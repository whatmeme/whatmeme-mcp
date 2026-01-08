/**
 * 인메모리 밈 데이터베이스
 * 핫한 밈들의 정보를 저장하는 상수 배열
 */

import type { MemeData } from '../types/index.js';

// 핫한 밈 목록
export const CONST_HOT_MEMES: MemeData[] = [
  { name: "럭키비키", desc: "원영적 사고", tags: ["긍정", "마인드"] },
  { name: "중꺾마", desc: "중요한 건 꺾이지 않는 마음", tags: ["동기부여"] },
  { name: "티라미수 케익", desc: "띠라띠라 미친미친...", tags: ["신남"] },
  { name: "꽁꽁 얼어붙은 한강", desc: "춥거나 경직된 분위기", tags: ["추위"] },
  { name: "헬창", desc: "운동 열정러", tags: ["헬스"] },
  { name: "어쩔티비", desc: "어쩔 수 없다는 말장난", tags: ["트렌드"] }
];

/**
 * 밈 이름으로 검색 (대소문자 무시)
 * @param keyword 검색할 밈 이름
 * @returns 찾은 밈 데이터 또는 null
 */
export function findMemeByName(keyword: string): MemeData | null {
  const normalizedKeyword = keyword.toLowerCase().trim();
  return CONST_HOT_MEMES.find(
    meme => meme.name.toLowerCase() === normalizedKeyword
  ) || null;
}