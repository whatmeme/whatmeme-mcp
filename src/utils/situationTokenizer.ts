/**
 * 상황 텍스트 토큰화 유틸리티
 * 목적: "퇴근하고 싶을 때 밈 추천해줘" 같은 상황 문장에서 의미 토큰 추출
 * 정책: normalizeMemeQuery를 재사용하지 않음 (목적이 다름)
 */

/**
 * 동사 어미 제거 대상
 */
const VERB_ENDINGS = ['하고', '하고서', '하려고', '할', '하는', '해', '해줘', '좀', '싶어', '싶을'];

/**
 * 상황 문장에서 의미 토큰 추출
 * 
 * @param input 상황 설명 문자열
 * @returns 의미 토큰 배열
 * 
 * @example
 * tokenizeSituation("퇴근하고 싶을 때 밈 추천해줘") → ["퇴근"]
 * tokenizeSituation("시험 스트레스 받을 때 밈") → ["시험", "스트레스"]
 */
export function tokenizeSituation(input: string): string[] {
  if (!input || typeof input !== 'string') {
    return [];
  }

  // 1. trim 및 구두점 제거
  let text = input.trim().replace(/[?!.。！？'""'']/g, '');

  // 2. 불필요한 단어 제거
  text = text.replace(/\s*(밈|추천해줘|알려줘|보여줘|뭐있어|뭐야|밈|추천|추천해)\s*/gi, ' ');

  // 3. 공백 기준 split
  let tokens = text.split(/\s+/).filter(token => token.length > 0);

  // 4. 동사 어미 제거 및 필터링
  tokens = tokens.map(token => {
    // 동사 어미 제거 (예: "퇴근하고" → "퇴근")
    for (const ending of VERB_ENDINGS) {
      if (token.toLowerCase().endsWith(ending.toLowerCase())) {
        token = token.slice(0, -ending.length);
        break;
      }
    }
    return token.trim();
  }).filter(token => {
    // 길이 2 이상만, 조사/어미 제외
    return token.length >= 2 && 
           !['때', '하고', '하고서', '하려고', '할', '하는', '해', '을', '를', '이', '가', '의', '싶을', '싶어', '에', '에서', '에게'].includes(token);
  });

  return tokens;
}
