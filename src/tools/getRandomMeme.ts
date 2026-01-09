/**
 * Tool 5: 랜덤 밈 추천 (get_random_meme)
 * DB에서 랜덤으로 밈 하나를 선택해서 뜻/유래/예시를 보여줍니다.
 * 역할: "밈 아무거나 알려줘", "랜덤 밈 보여줘", "밈 하나 추천해줘" 같은 질문에 사용
 */

import { CONST_HOT_MEMES } from '../data/hotMemes.js';

/**
 * 랜덤으로 밈 하나 선택해서 상세 정보 반환
 * @returns 랜덤 선택된 밈의 뜻, 유래, 사용 예시, 태그가 포함된 상세 설명
 */
export function getRandomMeme(): string {
  try {
    if (CONST_HOT_MEMES.length === 0) {
      return '등록된 밈이 없습니다.';
    }

    // 랜덤 인덱스 선택
    const randomIndex = Math.floor(Math.random() * CONST_HOT_MEMES.length);
    const meme = CONST_HOT_MEMES[randomIndex];

    // 결과 포맷팅 (searchMemeMeaning과 동일한 형식)
    const tagsText = meme.tags.map(tag => `#${tag}`).join(' ');
    const examplesText = meme.examples.map(ex => `- ${ex}`).join('\n');

    let output = `🎲 **랜덤 밈 추천**\n\n`;
    output += `**${meme.name}**\n\n`;
    output += `**뜻**\n${meme.meaning}\n\n`;
    output += `**유래**\n${meme.origin}\n\n`;
    
    if (meme.examples.length > 0) {
      output += `**사용 예시**\n${examplesText}\n\n`;
    }
    
    output += `**태그**\n${tagsText}\n\n`;
    output += `**트렌드 순위**\n${meme.trendRank}위\n\n`;
    output += `**인기도**\n${meme.popularity}/100\n\n`;
    output += `💡 유행 상태를 확인하고 싶다면 check_meme_status를 사용해보세요.`;

    return output;
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `❌ 오류: ${errorMessage}`;
  }
}