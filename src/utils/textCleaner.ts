/**
 * 텍스트 클리닝 유틸리티
 * HTML 태그 제거 및 엔티티 디코딩
 */

/**
 * HTML 태그 제거 및 엔티티 디코딩
 * @param html HTML 문자열
 * @returns 클리닝된 텍스트
 */
export function cleanText(html: string): string {
  // HTML 태그 제거
  let cleaned = html.replace(/<[^>]*>/g, '');
  
  // HTML 엔티티 디코딩
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' ',
  };
  
  cleaned = cleaned.replace(/&[#\w]+;/g, (entity) => {
    return entities[entity] || entity;
  });
  
  // 연속된 공백 정리
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  return cleaned;
}