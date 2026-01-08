/**
 * 밈 검색 쿼리 정규화 유틸리티
 * 사용자 입력을 정제하여 DB 검색에 적합한 키워드로 변환
 */

/**
 * 불용어 목록 (뒤에 붙는 불필요한 단어들)
 */
const STOP_WORDS = [
  '밈',
  '뜻',
  '유래',
  '뭐야',
  '알아',
  '알고있어',
  '알고 있어',
  '알고있어?',
  '알고 있어?',
  '설명',
  '설명해줘',
  '설명해',
  '알려줘',
  '알려',
  '정리해줘',
  '정리해',
  '에 대해',
  '이란',
  '이 뭐야',
  '이게 뭐야',
  '무엇',
  '뭐',
  // 상태 관련 질문 단어들
  '핫해',
  '핫해?',
  '유행',
  '유행이야',
  '유행이야?',
  '살아있어',
  '살아있어?',
  '아직',
  '끝났어',
  '끝났어?',
  '식었어',
  '식었어?',
  // 시간 관련
  '요즘',
  '최근',
  '지금',
  // 조사/어미
  '는',
  '은',
  '이',
  '가',
  '를',
  '을',
  '?',
  '!',
  '.',
];

/**
 * 밈 검색 쿼리 정규화
 * 질문 형태의 입력을 순수 키워드로 변환
 * 
 * @param input 사용자 입력 문자열
 * @returns 정규화된 키워드
 * 
 * @example
 * normalizeMemeQuery("골반춤 밈 알아?") → "골반춤"
 * normalizeMemeQuery("중꺾마 뜻") → "중꺾마"
 * normalizeMemeQuery("  럭키비키  ") → "럭키비키"
 */
export function normalizeMemeQuery(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // 1. trim 및 연속 공백 정리
  let normalized = input.trim().replace(/\s+/g, ' ');

  // 2. 불필요한 구두점 제거 (끝부분 중심)
  normalized = normalized.replace(/[?!.。！？]+$/g, '');

  // 3. 따옴표 제거
  normalized = normalized.replace(/['""'']/g, '');

  // 4. 불용어 제거 (끝부분 중심)
  // 여러 불용어를 체크하면서 제거
  let changed = true;
  let iterations = 0;
  const maxIterations = 10; // 무한 루프 방지
  
  while (changed && iterations < maxIterations) {
    changed = false;
    iterations++;
    const beforeLength = normalized.length;
    
    for (const stopWord of STOP_WORDS) {
      const lowerStopWord = stopWord.toLowerCase();
      const lowerNormalized = normalized.toLowerCase();
      
      // 정확히 끝에 붙은 경우 제거 (공백 포함)
      if (lowerNormalized.endsWith(lowerStopWord)) {
        normalized = normalized.slice(0, -stopWord.length).trim();
        changed = true;
        break;
      }
      
      // 공백 + 불용어 패턴 (예: "골반춤 밈", "럭키비키 핫해", "중꺾마 뜻")
      const escapedStopWord = stopWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`\\s+${escapedStopWord}(?=\\s|$|\\?|!)`, 'i');
      if (pattern.test(normalized)) {
        normalized = normalized.replace(pattern, '').trim();
        changed = true;
        break;
      }
      
      // 앞부분 불용어 패턴 (예: "요즘 헬창", "아직 살아있어")
      const prefixPattern = new RegExp(`^${escapedStopWord}\\s+`, 'i');
      if (prefixPattern.test(normalized)) {
        normalized = normalized.replace(prefixPattern, '').trim();
        changed = true;
        break;
      }
    }
    
    // 변화가 없으면 종료
    if (beforeLength === normalized.length) {
      break;
    }
  }

  // 5. 최종 trim
  normalized = normalized.trim();

  // 6. 너무 짧거나 의미 없는 경우 원본 반환 (최소 1글자)
  if (normalized.length < 1) {
    return input.trim();
  }

  return normalized;
}