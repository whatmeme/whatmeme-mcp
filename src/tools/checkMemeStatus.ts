/**
 * Tool 1: 유행 판독기 (check_meme_status)
 * 밈의 현재 유행/트렌딩 상태(🔥/⚖️/🧊)만 답합니다.
 * 역할: "요즘/최근/핫해/유행/밈 살아있어?/끝났어?/식었어?" 같은 질문에 사용
 * 중요: 뜻/유래/예시는 다루지 않음
 */

import { resolveMeme } from '../domain/memeResolver.js';

/**
 * 밈의 유행 상태 확인 (유행 상태만 반환)
 * @param keyword 검색할 밈 키워드
 * @returns 유행 상태 판정 결과 (이모지 + 상태 텍스트 + 순위 + 근거)
 */
export async function checkMemeStatus(keyword: string): Promise<string> {
  try {
    // 공통 resolver 사용
    const result = resolveMeme(keyword);

    if (!result.ok) {
      if (result.reason === 'EMPTY') {
        return `❓ 검색어가 너무 짧습니다. 밈 이름을 입력해주세요.`;
      }
      return `❓ "${keyword}"는 아직 등록된 밈이 아닙니다.\n일반 단어일 수 있으니, 밈 이름을 정확히 입력해주세요.\n📩 새로운 밈 추가 요청: woongaaaaa1@gmail.com`;
    }

    const { meme } = result;

    // popularity 기반 상태 판정 (popularity가 있으면 우선 사용, 없으면 trendRank 사용)
    const score = meme.popularity ?? (meme.trendRank <= 3 ? 95 : meme.trendRank <= 5 ? 75 : 50);
    
    let statusEmoji: string;
    let statusText: string;
    let oneLineSummary: string;

    if (score >= 80) {
      statusEmoji = '🔥';
      statusText = '지금 핫한 밈';
      oneLineSummary = '현재 트렌딩 상위권';
    } else if (score >= 50) {
      statusEmoji = '⚖️';
      statusText = '스테디 밈';
      oneLineSummary = '안정적인 인기 유지';
    } else {
      statusEmoji = '🧊';
      statusText = '과거 밈 or 마이너';
      oneLineSummary = '과거 유행 또는 소수층';
    }

    // 결과 포맷팅 (유행 상태만, origin/examples 절대 포함 금지)
    const reason = `popularity=${score}${meme.updatedAt ? `, updatedAt=${meme.updatedAt}` : ''}`;
    return `**${meme.name}**: ${statusEmoji} ${statusText}\n${oneLineSummary}\n트렌딩 순위: ${meme.trendRank}위\n\n근거: ${reason}`;
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `❌ 오류: ${errorMessage}`;
  }
}
