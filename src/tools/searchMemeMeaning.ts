/**
 * Tool 4: 뜻 풀이 (search_meme_meaning)
 * 밈의 뜻/유래/사용예시를 설명합니다.
 * 역할: "뭐야/무슨 뜻/유래/알아/설명해줘/정리해줘" 같은 질문에 사용
 * 중요: 질문형 입력("~알아?", "~뭐야?")을 그대로 keyword로 넣어도 됨
 * 중요: 🔥/⚖️/🧊 같은 상태 표현은 포함하지 않음 → 상태는 check_meme_status 사용
 */

import { resolveMeme } from '../domain/memeResolver.js';

/**
 * 밈의 뜻과 유래 검색 (뜻, 유래, 예시 포함)
 * @param keyword 검색할 밈 키워드 또는 질문
 * @returns 뜻, 유래, 사용 예시, 태그가 포함된 상세 설명 (상태 표현 절대 포함 안 함)
 */
export async function searchMemeMeaning(keyword: string): Promise<string> {
  try {
    // 공통 resolver 사용
    const result = resolveMeme(keyword);

    if (!result.ok) {
      if (result.reason === 'EMPTY') {
        return `❓ 검색어가 너무 짧습니다. 밈 이름을 입력해주세요.`;
      }
      return `❓ "${keyword}"는 아직 등록된 밈이 아닙니다.\n일반 단어일 수 있으니, 밈 이름을 정확히 입력해주세요.\n\n📩 새로운 밈 추가 요청: woongaaaaa1@gmail.com\n💡 유행 상태를 확인하고 싶다면 check_meme_status를 사용해보세요.`;
    }

    const { meme } = result;

    // 결과 포맷팅 (상태 표현 절대 포함 안 함)
    const tagsText = meme.tags.map(tag => `#${tag}`).join(' ');
    const examplesText = meme.examples.map(ex => `- ${ex}`).join('\n');

    let output = `**${meme.name}**\n\n`;
    output += `**뜻**\n${meme.meaning}\n\n`;
    output += `**유래**\n${meme.origin}\n\n`;
    
    if (meme.examples.length > 0) {
      output += `**사용 예시**\n${examplesText}\n\n`;
    }
    
    output += `**태그**\n${tagsText}\n\n`;
    output += `💡 유행 상태를 확인하고 싶다면 check_meme_status를 사용해보세요.`;

    return output;
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `❌ 오류: ${errorMessage}`;
  }
}
