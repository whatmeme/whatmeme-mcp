/**
 * 밈 해석기 (Meme Resolver)
 * 표준화된 밈 검색 및 해석 로직
 */

import { findMemeByKeyword } from '../data/hotMemes.js';
import { normalizeMemeQuery } from '../utils/queryNormalizer.js';
import type { MemeData } from '../types/index.js';

/**
 * 해석 결과 타입
 */
export type ResolveResult =
  | { ok: true; meme: MemeData; normalized: string }
  | { ok: false; normalized: string; reason: 'EMPTY' | 'NOT_FOUND' };

/**
 * 입력 문자열에서 밈을 해석
 * 
 * @param input 사용자 입력 문자열
 * @returns ResolveResult (성공 시 meme 포함, 실패 시 reason 포함)
 * 
 * @example
 * resolveMeme("럭키비키 밈 핫해?") → { ok: true, meme: {...}, normalized: "럭키비키" }
 * resolveMeme("없는밈") → { ok: false, normalized: "없는밈", reason: "NOT_FOUND" }
 */
export function resolveMeme(input: string): ResolveResult {
  // 1. 정규화
  const normalized = normalizeMemeQuery(input);

  // 2. EMPTY 체크
  if (!normalized || normalized.length < 1) {
    return { ok: false, normalized: '', reason: 'EMPTY' };
  }

  // 3. DB 검색
  const meme = findMemeByKeyword(normalized);

  if (!meme) {
    return { ok: false, normalized, reason: 'NOT_FOUND' };
  }

  return { ok: true, meme, normalized };
}
