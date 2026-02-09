/**
 * Tool 3: 상황별 밈 추천 (recommend_meme_for_context)
 * 주어진 상황에 맞는 밈을 DB에서 추천 (점수화 기반)
 */

import { CONST_HOT_MEMES } from '../data/hotMemes.js';
import { tokenizeSituation } from '../utils/situationTokenizer.js';

/**
 * 추천 결과 타입
 */
interface Recommendation {
  meme: typeof CONST_HOT_MEMES[0];
  score: number;
  matchedTokens: string[];
}

/**
 * 상황별 밈 추천 (점수화 기반)
 * @param situation 상황 설명 (예: "퇴근하고 싶을 때")
 * @returns 추천 밈 목록 (매칭 근거 포함)
 */
export async function recommendMemeForContext(situation: string): Promise<string> {
  try {
    if (!situation || situation.trim().length < 1) {
      return `❓ 상황을 입력해주세요.`;
    }

    // 상황 토큰화
    const tokens = tokenizeSituation(situation);
    if (tokens.length === 0) {
      return `❓ 상황을 더 구체적으로 입력해주세요.`;
    }

    // 점수화 추천
    const recommendations: Recommendation[] = CONST_HOT_MEMES.map(meme => {
      let score = 0;
      const matchedTokens: string[] = [];
      const situationLower = situation.toLowerCase();

      // 1. contexts 매칭 (최고 우선순위 - 상황과 직접 관련된 맥락이 가장 중요)
      let contextMatches = 0;
      for (const context of meme.contexts || []) {
        const contextLower = context.toLowerCase();
        for (const token of tokens) {
          const tokenLower = token.toLowerCase();
          // 정확 매칭 (예: "퇴근" === "퇴근")
          if (contextLower === tokenLower) {
            score += 18; // 높은 점수
            contextMatches++;
            if (!matchedTokens.includes(context)) {
              matchedTokens.push(`context:${context}`);
            }
          }
          // 부분 매칭
          else if (contextLower.includes(tokenLower) || tokenLower.includes(contextLower)) {
            score += 12;
            contextMatches++;
            if (!matchedTokens.includes(context)) {
              matchedTokens.push(`context:${context}`);
            }
          }
        }
      }
      // contexts가 여러 개 매칭되면 보너스 (상황과 강하게 연관됨)
      if (contextMatches >= 2) {
        score += 8;
      }

      // 2. moods 매칭 (높은 우선순위 - 감정/분위기 매칭)
      // 가중치: 기존 점수의 1.5배 적용 (감정 매칭의 중요도 강화)
      // - 정확 매칭: 16점 → 24점 (1.5배)
      // - 부분 매칭: 10점 → 15점 (1.5배)
      // - 변형 매칭 보너스: 14점 → 21점 (1.5배)
      let moodMatches = 0;
      for (const mood of meme.moods || []) {
        const moodLower = mood.toLowerCase();
        for (const token of tokens) {
          const tokenLower = token.toLowerCase();
          // 정확 매칭 (예: "신남" === "신남")
          // 가중치: 16점 × 1.5 = 24점
          if (moodLower === tokenLower) {
            score += 24; // 기존 16점에서 1.5배 증가
            moodMatches++;
            if (!matchedTokens.includes(mood)) {
              matchedTokens.push(`mood:${mood}`);
            }
          }
          // 부분 매칭
          // 가중치: 10점 × 1.5 = 15점
          else if (moodLower.includes(tokenLower) || tokenLower.includes(moodLower)) {
            score += 15; // 기존 10점에서 1.5배 증가
            moodMatches++;
            if (!matchedTokens.includes(mood)) {
              matchedTokens.push(`mood:${mood}`);
            }
          }
        }
        // "신날" → "신남" 같은 변형 매칭 보너스
        // 가중치: 14점 × 1.5 = 21점
        if (mood === '신남' && situationLower.includes('신날')) {
          score += 21; // 기존 14점에서 1.5배 증가
          if (!matchedTokens.includes('mood:신남')) {
            matchedTokens.push('mood:신남');
          }
        }
      }

      // 3. examples 매칭 (중간 우선순위 - 직접 예시가 있는 경우)
      const examplesText = meme.examples.join(' ').toLowerCase();
      let exampleMatches = 0;
      for (const token of tokens) {
        const tokenLower = token.toLowerCase();
        if (tokenLower.length >= 3 && examplesText.includes(tokenLower)) {
          exampleMatches++;
          // 핵심 키워드가 예시에 있으면 점수 (contexts나 moods와 함께 매칭되면 더 의미있음)
          score += 14;
        }
      }
      // contexts나 moods 매칭과 함께 examples 매칭이 있으면 보너스 (매우 관련있음)
      if (exampleMatches > 0 && (contextMatches > 0 || moodMatches > 0)) {
        score += 10;
      }
      if (exampleMatches > 0 && !matchedTokens.includes('examples')) {
        matchedTokens.push('examples');
      }

      // 4. meaning 매칭 (의미적 매칭, 보조 점수)
      const meaningLower = meme.meaning.toLowerCase();
      let meaningMatches = 0;
      for (const token of tokens) {
        const tokenLower = token.toLowerCase();
        if (tokenLower.length >= 3 && meaningLower.includes(tokenLower)) {
          meaningMatches++;
          score += 8;
        }
      }
      // meaning에 핵심 키워드가 포함되고, contexts/moods와 함께 매칭되면 보너스
      if (meaningMatches > 0 && (contextMatches > 0 || moodMatches > 0)) {
        score += 6;
      }
      // 동의어/유사어 매칭 (예: "힘들" ↔ "피곤", "동기부여" ↔ "의지")
      const synonymPairs = [
        { from: ['힘들', '힘든', '어려운'], to: ['피곤', '어려움', '힘듦'] },
        { from: ['동기부여', '의지'], to: ['동기부여', '의지', '투지'] },
        { from: ['스트레스'], to: ['스트레스', '힘든', '어려운'] },
      ];
      for (const pair of synonymPairs) {
        const hasToken = pair.from.some(word => tokens.some(t => t.toLowerCase().includes(word.toLowerCase())));
        const hasMeaning = pair.to.some(word => meaningLower.includes(word));
        if (hasToken && hasMeaning && (contextMatches > 0 || moodMatches > 0)) {
          score += 8;
          meaningMatches++;
        }
      }

      // 5. tags 매칭 (낮은 우선순위)
      for (const tag of meme.tags) {
        const tagLower = tag.toLowerCase();
        for (const token of tokens) {
          const tokenLower = token.toLowerCase();
          if (tagLower === tokenLower) {
            score += 4;
            if (!matchedTokens.includes(`tag:${tag}`)) {
              matchedTokens.push(`tag:${tag}`);
            }
          } else if (tagLower.includes(tokenLower) || tokenLower.includes(tagLower)) {
            score += 2;
            if (!matchedTokens.includes(`tag:${tag}`)) {
              matchedTokens.push(`tag:${tag}`);
            }
          }
        }
      }

      // 6. name/aliases 매칭 (가장 낮은 우선순위)
      const nameLower = meme.name.toLowerCase();
      for (const token of tokens) {
        const tokenLower = token.toLowerCase();
        if (nameLower.includes(tokenLower) || tokenLower.includes(nameLower)) {
          score += 1;
          if (!matchedTokens.includes(meme.name)) {
            matchedTokens.push(meme.name);
          }
        }
      }

      // 7. popularity 보너스 (기본 점수가 일정 이상이고, contexts/moods/examples 매칭이 있을 때만 적용)
      // 상황 매칭이 약하면 인기 밈이 상위로 올라가는 것을 방지
      if (score >= 15 && (contextMatches > 0 || moodMatches > 0 || exampleMatches > 0)) {
        const popularityBonus = Math.min((meme.popularity || 50) * 0.06, 6);
        score += popularityBonus;
      }

      return { meme, score, matchedTokens };
    })
      .filter(rec => rec.score > 0)
      .sort((a, b) => b.score - a.score);

    if (recommendations.length === 0) {
      return `❓ "${situation}"에 맞는 밈을 찾을 수 없습니다.\n현재 DB의 밈 목록을 확인해보세요: get_trending_memes`;
    }

    // 상위 밈 대비 점수가 너무 낮은 결과 제외 (1위 점수의 30% 미만이면 제외)
    const topScore = recommendations[0].score;
    const minScoreThreshold = topScore * 0.3;
    const filteredRecommendations = recommendations.filter(rec => rec.score >= minScoreThreshold);

    // 최대 3개까지만 반환 (임계값을 넘은 것들 중에서)
    const finalRecommendations = filteredRecommendations.slice(0, 3);

    // 결과 포맷팅
    const output = finalRecommendations.map((rec, index) => {
      const tagsText = rec.meme.tags.map(tag => `#${tag}`).join(' ');
      const matchedText = rec.matchedTokens.length > 0 
        ? ` (매칭: ${rec.matchedTokens.slice(0, 3).join(', ')})`
        : '';
      return `${index + 1}. **${rec.meme.name}** — ${rec.meme.meaning} (${tagsText})${matchedText}`;
    }).join('\n\n');

    return `💡 "${situation}" 관련 밈 추천\n\n${output}`;
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `❌ 오류: ${errorMessage}`;
  }
}
