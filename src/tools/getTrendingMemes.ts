/**
 * Tool 2: 최신 밈 추천 (get_trending_memes)
 * 현재 인기 있는 밈 목록 반환
 */

import { CONST_HOT_MEMES } from '../data/hotMemes.js';

/**
 * 현재 트렌딩 밈 목록 반환
 * @returns 포맷팅된 밈 목록 텍스트
 */
export function getTrendingMemes(): string {
  let result = '🔥 현재 인기 밈 TOP 6\n\n';

  CONST_HOT_MEMES.forEach((meme, index) => {
    const tagsText = meme.tags.map(tag => `#${tag}`).join(' ');
    
    result += `${index + 1}. **${meme.name}**\n`;
    result += `   - ${meme.desc}\n`;
    result += `   - 태그: ${tagsText}\n\n`;
  });

  return result.trim();
}