/**
 * Tool 1: 유행 판독기 (check_meme_status)
 * 밈의 현재 유행 상태를 분석하고 판정
 */

import { findMemeByName } from '../data/hotMemes.js';
import { NaverAPIClient } from '../services/naverAPI.js';
import { calculateRecentPercentage } from '../utils/dateHelper.js';

const naverClient = new NaverAPIClient();

/**
 * 밈의 유행 상태 확인
 * @param keyword 검색할 밈 키워드
 * @returns 유행 상태 판정 결과
 */
export async function checkMemeStatus(keyword: string): Promise<string> {
  try {
    // 1. 내부 DB에서 먼저 확인
    const memeData = findMemeByName(keyword);
    
    if (memeData) {
      // 내부 DB에 있는 경우: 인증된 핵인싸 밈
      const tagsText = memeData.tags.map(tag => `#${tag}`).join(' ');
      
      return `[내부 DB] 🔥 인증된 핵인싸 밈입니다!\n\n**${memeData.name}**\n${memeData.desc}\n\n태그: ${tagsText}`;
    }

    // 2. 내부 DB에 없으면 네이버 블로그 검색으로 분석
    const searchQuery = `${keyword} 밈`;
    const blogResult = await naverClient.searchBlog(searchQuery, {
      display: 20,
      sort: 'date', // 최신순 정렬
    });

    // 3. 최근 1개월 내 게시글 비율 계산
    const postdates = blogResult.items.map(item => item.postdate);
    const recentPercentage = calculateRecentPercentage(postdates);

    // 4. 유행 상태 판정
    let statusEmoji: string;
    let statusText: string;

    if (recentPercentage >= 80) {
      statusEmoji = '🔥';
      statusText = '지금 핫한 밈';
    } else if (recentPercentage >= 40) {
      statusEmoji = '⚖️';
      statusText = '스테디 밈';
    } else {
      statusEmoji = '🧊';
      statusText = '유행 지남 or 마이너';
    }

    // 5. 결과 포맷팅
    return `[검색 분석] ${statusEmoji} ${statusText}입니다.\n\n"${keyword}" 분석 결과:\n- 최근 1개월 내 비율: ${recentPercentage}%\n- 전체 검색 결과: ${blogResult.total.toLocaleString()}개`;
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `❌ 오류: ${errorMessage}`;
  }
}