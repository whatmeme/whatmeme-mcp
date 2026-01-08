/**
 * WhatMeme MCP Server - TypeScript 타입 정의
 */

// 밈 데이터 구조 (상용급 확장)
export interface MemeData {
  id: string;
  name: string; // 대표 이름
  aliases: string[]; // 다른 이름들 (띄어쓰기/짧은 표현/영문 등)
  meaning: string; // 한 줄 뜻
  origin: string; // 유래/맥락 (2~4줄)
  examples: string[]; // 사용 예시 (2~3개)
  tags: string[];
  contexts: string[]; // 상황 키워드 (퇴근, 회사, 피곤, 현타 등)
  moods: string[]; // 감정 키워드 (신남, 빡침, 우울, 자조 등)
  trendRank: number; // 낮을수록 상위 (1이 최상위) - deprecated, popularity 사용 권장
  popularity: number; // 수동 관리 점수 (0~100)
  updatedAt: string; // 수동 업데이트 날짜 (ISO 형식)
  // 하위 호환을 위한 필드 (deprecated)
  desc?: string; // meaning으로 대체 예정
}