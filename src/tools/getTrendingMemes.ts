/**
 * Tool 2: 최신 밈 추천 (get_trending_memes)
 * 현재 인기 있는 밈 TOP 5 목록 반환
 */

import { getTrendingMemesList } from '../data/hotMemes.js';

/**
 * 현재 트렌딩 밈 TOP 5 목록 반환
 * @returns 포맷팅된 밈 목록 텍스트
 */
export function getTrendingMemes(): string {
  const trendingMemes = getTrendingMemesList(5);

  if (trendingMemes.length === 0) {
    return '현재 트렌딩 밈이 없습니다.';
  }

  let result = `🔥 현재 인기 밈 TOP ${trendingMemes.length}\n\n`;

  trendingMemes.forEach((meme, index) => {
    const tagsText = meme.tags.map(tag => `#${tag}`).join(' ');
    result += `${index + 1}. **${meme.name}** — ${meme.meaning} (${tagsText})\n`;
  });

  return result.trim();
}