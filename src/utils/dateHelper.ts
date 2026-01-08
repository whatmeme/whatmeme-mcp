/**
 * 날짜 계산 헬퍼 함수
 * date-fns를 활용한 날짜 처리
 */

import { parse, differenceInDays, isAfter, subMonths } from 'date-fns';

/**
 * 네이버 날짜 형식("YYYYMMDD")을 Date 객체로 변환
 * @param postdate 네이버 날짜 문자열 (예: "20240315")
 * @returns Date 객체
 */
export function parseNaverDate(postdate: string): Date {
  if (postdate.length !== 8) {
    throw new Error(`잘못된 날짜 형식: ${postdate}`);
  }
  
  const year = parseInt(postdate.substring(0, 4), 10);
  const month = parseInt(postdate.substring(4, 6), 10);
  const day = parseInt(postdate.substring(6, 8), 10);
  
  return new Date(year, month - 1, day);
}

/**
 * 해당 날짜가 최근 1개월 이내인지 확인
 * @param date 확인할 날짜
 * @returns 최근 1개월 이내이면 true
 */
export function isWithinOneMonth(date: Date): boolean {
  const oneMonthAgo = subMonths(new Date(), 1);
  return isAfter(date, oneMonthAgo);
}

/**
 * 네이버 검색 결과의 postdate 배열에서 최근 1개월 내 게시글 비율 계산
 * @param postdates postdate 문자열 배열
 * @returns 최근 1개월 내 비율 (0-100)
 */
export function calculateRecentPercentage(postdates: string[]): number {
  if (postdates.length === 0) {
    return 0;
  }
  
  let recentCount = 0;
  
  for (const postdate of postdates) {
    try {
      const date = parseNaverDate(postdate);
      if (isWithinOneMonth(date)) {
        recentCount++;
      }
    } catch (error) {
      // 날짜 파싱 실패 시 무시
      console.warn(`날짜 파싱 실패: ${postdate}`, error);
    }
  }
  
  return Math.round((recentCount / postdates.length) * 100);
}