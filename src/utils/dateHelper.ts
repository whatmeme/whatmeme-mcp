/**
 * 날짜 계산 헬퍼 함수
 * date-fns를 활용한 날짜 처리
 */

import { isAfter, subMonths } from 'date-fns';

/**
 * 해당 날짜가 최근 1개월 이내인지 확인
 * @param date 확인할 날짜
 * @returns 최근 1개월 이내이면 true
 */
export function isWithinOneMonth(date: Date): boolean {
  const oneMonthAgo = subMonths(new Date(), 1);
  return isAfter(date, oneMonthAgo);
}
