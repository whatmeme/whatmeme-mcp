/**
 * Tool 3: 상황별 밈 추천 (recommend_meme_for_context)
 * 주어진 상황에 맞는 밈 키워드 추천
 */

import { NaverAPIClient } from '../services/naverAPI.js';
import { cleanText } from '../utils/textCleaner.js';

const naverClient = new NaverAPIClient();

/**
 * 상황별 밈 추천
 * @param situation 상황 설명 (예: "퇴근하고 싶을 때")
 * @returns 추천 밈 키워드 목록
 */
export async function recommendMemeForContext(situation: string): Promise<string> {
  try {
    // 검색어 구성: "{situation} 짤"
    const searchQuery = `${situation} 짤`;
    
    // 네이버 이미지 검색
    const imageResult = await naverClient.searchImage(searchQuery, {
      display: 5,
    });

    if (imageResult.items.length === 0) {
      return `❌ "${situation}" 관련 밈을 찾을 수 없습니다.`;
    }

    // 각 이미지의 title에서 키워드 추출 및 HTML 태그 제거
    const keywords = imageResult.items.map((item, index) => {
      const cleanedTitle = cleanText(item.title);
      return `${index + 1}. ${cleanedTitle}`;
    });

    // 검색 URL 생성 (UTF-8 인코딩)
    const searchUrl = `https://search.naver.com/search.naver?where=image&query=${encodeURIComponent(searchQuery)}`;

    // 결과 포맷팅
    let result = `💡 "${situation}" 관련 밈 추천\n\n다음 키워드로 검색해보세요:\n\n`;
    result += keywords.join('\n');
    result += `\n\n🔍 더 많은 결과: [네이버 이미지 검색](${searchUrl})`;

    return result;
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `❌ 오류: ${errorMessage}`;
  }
}