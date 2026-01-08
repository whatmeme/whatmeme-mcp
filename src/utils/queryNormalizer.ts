/**
 * 밈 검색 쿼리 정규화 유틸리티 (재설계)
 * 목적: "밈 이름 후보"를 뽑는 것
 * 전략: 패턴 기반 suffix/prefix 제거 + 안전장치
 */

/**
 * 앞부분 제거 대상 (prefix)
 */
const PREFIX_WORDS = ['요즘', '최근', '지금', '아직'];

/**
 * 뒷부분 제거 대상 (suffix) - 길이순 정렬 (긴 것부터)
 */
const SUFFIX_PHRASES = [
  '뜻 알려줘',
  '뜻 설명해줘',
  '뜻 정리해줘',
  '유래 설명해줘',
  '유래 알려줘',
  '유래 정리해줘',
  '아직 살아있어',
  '아직 살아있어?',
  '밈 식었어',
  '밈 식었어?',
  '밈 살아있어',
  '밈 살아있어?',
  '유행이야',
  '유행이야?',
  '핫해',
  '핫해?',
  '끝났어',
  '끝났어?',
  '식었어',
  '식되었어',
  '식었어?',
  '살아있어',
  '살아있어?',
  '알아',
  '알아?',
  '알고있어',
  '알고 있어',
  '알고있어?',
  '알고 있어?',
  '뜻',
  '유래',
  '뭐야',
  '뭐야?',
  '이 뭐야',
  '이게 뭐야',
  '이란',
  '에 대해',
  '설명해줘',
  '설명해',
  '알려줘',
  '알려',
  '정리해줘',
  '정리해',
  '밈',
  '무엇',
  '뭐',
];

/**
 * 조사 (조건부 제거)
 */
const PARTICLES = ['는', '은', '이', '가', '를', '을'];

/**
 * 밈 검색 쿼리 정규화
 * 질문 형태의 입력을 순수 밈 이름 후보로 변환
 * 
 * @param input 사용자 입력 문자열
 * @returns 정규화된 키워드 (비어있으면 '' 반환, 원본 되살리기 금지)
 * 
 * @example
 * normalizeMemeQuery("골반춤 밈 알아?") → "골반춤"
 * normalizeMemeQuery("중꺾마 뜻 알려줘") → "중꺾마"
 * normalizeMemeQuery("요즘 헬창 밈 식었어?") → "헬창"
 * normalizeMemeQuery("뭐야") → ""
 */
export function normalizeMemeQuery(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // 1. trim 및 연속 공백 정리
  let normalized = input.trim().replace(/\s+/g, ' ');

  // 2. 구두점/따옴표 제거 (정규식으로)
  normalized = normalized.replace(/[?!.。！？'""'']/g, '');

  // 3. Prefix 제거 (앞부분만)
  for (const prefix of PREFIX_WORDS) {
    const prefixPattern = new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+`, 'i');
    if (prefixPattern.test(normalized)) {
      normalized = normalized.replace(prefixPattern, '').trim();
      break; // 하나만 제거
    }
  }

  // 4. Suffix 제거 (뒷부분만, 길이순으로 긴 것부터)
  // SUFFIX_PHRASES는 이미 길이순 정렬되어 있음
  for (const suffix of SUFFIX_PHRASES) {
    // 공백 포함 패턴: " 밈 식었어?", " 뜻 알려줘" 등
    const suffixPattern = new RegExp(`\\s+${suffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
    if (suffixPattern.test(normalized)) {
      normalized = normalized.replace(suffixPattern, '').trim();
      continue; // 여러 개 제거 가능 (예: "중꺾마 뜻 알려줘" → "중꺾마")
    }
    
    // 정확히 끝에 붙은 경우 (공백 없음)
    const exactSuffixPattern = new RegExp(`${suffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
    if (exactSuffixPattern.test(normalized)) {
      normalized = normalized.replace(exactSuffixPattern, '').trim();
      continue;
    }
  }

  // 5. 조사 제거 (조건부: 최종 결과가 2글자 이상일 때만)
  normalized = normalized.trim();
  if (normalized.length >= 2) {
    for (const particle of PARTICLES) {
      // 끝에 붙은 조사만 제거
      if (normalized.toLowerCase().endsWith(particle.toLowerCase())) {
        const before = normalized;
        normalized = normalized.slice(0, -particle.length).trim();
        // 1글자가 되면 복구
        if (normalized.length < 1) {
          normalized = before;
        }
        break;
      }
    }
  }

  // 6. 최종 검증: 비어있으면 '' 반환 (원본 되살리기 금지)
  normalized = normalized.trim();
  return normalized.length >= 1 ? normalized : '';
}
