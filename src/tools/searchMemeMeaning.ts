/**
 * Tool 4: 뜻 풀이 (search_meme_meaning)
 * 밈의 뜻과 유래를 검색해서 설명
 */

import { NaverAPIClient } from '../services/naverAPI.js';
import { cleanText } from '../utils/textCleaner.js';

const naverClient = new NaverAPIClient();

/**
 * 밈의 뜻과 유래 검색
 * @param keyword 검색할 밈 키워드
 * @returns 검색 결과 텍스트
 */
export async function searchMemeMeaning(keyword: string): Promise<string> {
  try {
    // 검색어 구성: "{keyword} 뜻 유래"
    const searchQuery = `${keyword} 뜻 유래`;
    
    // 네이버 블로그 검색 (유사도순, 상위 3개)
    const blogResult = await naverClient.searchBlog(searchQuery, {
      display: 3,
      sort: 'sim', // 유사도순 정렬
    });

    if (blogResult.items.length === 0) {
      return `❌ "${keyword}"에 대한 정보를 찾을 수 없습니다.`;
    }

    // 각 블로그 결과 포맷팅
    const results = blogResult.items.map((item, index) => {
      const cleanedTitle = cleanText(item.title);
      const cleanedDesc = cleanText(item.description);
      
      return `[블로그 ${index + 1}] ${cleanedTitle}\n${cleanedDesc}\n\n링크: ${item.link}`;
    });

    // 최종 결과 포맷팅
    let result = `"${keyword}" 검색 결과:\n\n`;
    result += results.join('\n\n---\n\n');

    return result;
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `❌ 오류: ${errorMessage}`;
  }
}