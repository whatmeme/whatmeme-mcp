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
      const tokenSet = new Set(tokens.map(t => t.toLowerCase()));

      // contexts 매칭 (가장 높은 점수)
      for (const context of meme.contexts || []) {
        const contextLower = context.toLowerCase();
        for (const token of tokens) {
          if (contextLower.includes(token.toLowerCase()) || token.toLowerCase().includes(contextLower)) {
            score += 10;
            if (!matchedTokens.includes(context)) {
              matchedTokens.push(context);
            }
          }
        }
      }

      // moods 매칭 (2순위)
      for (const mood of meme.moods || []) {
        const moodLower = mood.toLowerCase();
        for (const token of tokens) {
          if (moodLower.includes(token.toLowerCase()) || token.toLowerCase().includes(moodLower)) {
            score += 7;
            if (!matchedTokens.includes(mood)) {
              matchedTokens.push(mood);
            }
          }
        }
      }

      // tags 매칭 (3순위)
      for (const tag of meme.tags) {
        const tagLower = tag.toLowerCase();
        for (const token of tokens) {
          if (tagLower.includes(token.toLowerCase()) || token.toLowerCase().includes(tagLower)) {
            score += 5;
            if (!matchedTokens.includes(tag)) {
              matchedTokens.push(tag);
            }
          }
        }
      }

      // name/aliases 매칭 (4순위)
      const nameLower = meme.name.toLowerCase();
      for (const token of tokens) {
        if (nameLower.includes(token.toLowerCase()) || token.toLowerCase().includes(nameLower)) {
          score += 3;
          if (!matchedTokens.includes(meme.name)) {
            matchedTokens.push(meme.name);
          }
        }
      }

      // examples 매칭 (보조, 가중치 낮게)
      const examplesText = meme.examples.join(' ').toLowerCase();
      for (const token of tokens) {
        if (examplesText.includes(token.toLowerCase())) {
          score += 2;
        }
      }

      // popularity 보너스 (기본 점수에 반영)
      score += (meme.popularity || 50) * 0.1;

      return { meme, score, matchedTokens };
    })
      .filter(rec => rec.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    if (recommendations.length === 0) {
      return `❓ "${situation}"에 맞는 밈을 찾을 수 없습니다.\n현재 DB의 밈 목록을 확인해보세요: get_trending_memes`;
    }

    // 결과 포맷팅 (매칭 근거 포함)
    const output = recommendations.map((rec, index) => {
      const tagsText = rec.meme.tags.map(tag => `#${tag}`).join(' ');
      const matchedText = rec.matchedTokens.length > 0 
        ? ` (매칭: ${rec.matchedTokens.slice(0, 3).join(', ')})`
        : '';
      return `${index + 1}. **${rec.meme.name}** — ${rec.meme.meaning} (${tagsText})${matchedText}`;
    }).join('\n');

    return `💡 "${situation}" 관련 밈 추천\n\n${output}`;
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `❌ 오류: ${errorMessage}`;
  }
}
