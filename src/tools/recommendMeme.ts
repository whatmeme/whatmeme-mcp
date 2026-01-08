/**
 * Tool 3: 상황별 밈 추천 (recommend_meme_for_context)
 * 주어진 상황에 맞는 밈을 DB에서 추천
 */

import { CONST_HOT_MEMES } from '../data/hotMemes.js';

/**
 * 상황별 밈 추천 (DB 기반)
 * @param situation 상황 설명 (예: "퇴근하고 싶을 때")
 * @returns 추천 밈 목록
 */
export async function recommendMemeForContext(situation: string): Promise<string> {
  try {
    if (!situation || situation.trim().length < 1) {
      return `❓ 상황을 입력해주세요.`;
    }

    // 불필요한 단어 제거
    let normalizedSituation = situation.toLowerCase().trim();
    normalizedSituation = normalizedSituation.replace(/\s*(밈|추천해줘|알려줘|보여줘|뭐있어|뭐야|밈|추천)\s*/g, ' ').trim();

    // 키워드 추출 (명사 중심)
    const keywords = normalizedSituation.split(/\s+/).filter(word => 
      word.length >= 2 && 
      !['때', '하고', '하고서', '하려고', '할', '하는', '해', '을', '를', '이', '가', '의', '하고', '싶을', '싶어'].includes(word)
    );

    // 의미 연관 키워드 매핑 (예: 퇴근 → 출근, 일)
    const keywordMappings: Record<string, string[]> = {
      '퇴근': ['출근', '일', '직장', '근무', '회사'],
      '스트레스': ['힘든', '어려운', '고생'],
      '동기부여': ['힘내', '포기', '버티'],
      '신나': ['신남', '흥분', '재미'],
    };

    // 확장된 키워드 리스트 생성
    const extendedKeywords = [...keywords];
    for (const keyword of keywords) {
      if (keywordMappings[keyword]) {
        extendedKeywords.push(...keywordMappings[keyword]);
      }
    }

    // 태그나 키워드로 매칭 (더 유연한 매칭)
    const matchedMemes = CONST_HOT_MEMES.filter(meme => {
      const tags = meme.tags.join(' ').toLowerCase();
      const meaning = meme.meaning.toLowerCase();
      const name = meme.name.toLowerCase();
      const examples = meme.examples.join(' ').toLowerCase();
      const searchText = `${tags} ${meaning} ${name} ${examples}`;
      
      // 전체 문장 포함 여부
      if (searchText.includes(normalizedSituation) || normalizedSituation.includes(name)) {
        return true;
      }
      
      // 확장된 키워드 하나라도 포함되면 매칭
      if (extendedKeywords.length > 0) {
        return extendedKeywords.some(keyword => searchText.includes(keyword));
      }
      
      return false;
    }).slice(0, 5);

    if (matchedMemes.length === 0) {
      return `❓ "${situation}"에 맞는 밈을 찾을 수 없습니다.\n현재 DB의 밈 목록을 확인해보세요: get_trending_memes`;
    }

    // 결과 포맷팅
    const recommendations = matchedMemes.map((meme, index) => {
      const tagsText = meme.tags.map(tag => `#${tag}`).join(' ');
      return `${index + 1}. **${meme.name}** — ${meme.meaning} (${tagsText})`;
    }).join('\n');

    return `💡 "${situation}" 관련 밈 추천\n\n${recommendations}`;
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `❌ 오류: ${errorMessage}`;
  }
}