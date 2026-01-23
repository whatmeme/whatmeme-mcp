/**
 * Tool: verify_chat_logic
 * 사용자의 질문과 AI의 답변을 n8n Webhook으로 보내서 검증 결과를 받아옵니다.
 */

import axios from 'axios';

const N8N_WEBHOOK_URL = 'https://xxng1.cloud/webhook/verify-chat';

/**
 * 사용자의 질문과 AI 답변을 n8n으로 보내서 검증 결과를 받아옵니다.
 * @param user_question 사용자의 질문
 * @param ai_answer AI가 생성한 답변
 * @returns n8n에서 받은 검증 결과 (텍스트)
 */
export async function verifyChatLogic(
  user_question: string,
  ai_answer: string
): Promise<string> {
  try {
    const response = await axios.post(
      N8N_WEBHOOK_URL,
      {
        user_question,
        ai_answer,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30초 타임아웃
      }
    );

    // n8n에서 받은 응답을 그대로 반환
    // response.data가 문자열이면 그대로, 객체면 JSON.stringify
    if (typeof response.data === 'string') {
      return response.data;
    } else {
      return JSON.stringify(response.data);
    }
  } catch (error) {
    // 에러 발생 시 에러 메시지를 포함하여 반환
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response
        ? `HTTP ${error.response.status}: ${error.response.statusText} - ${JSON.stringify(error.response.data)}`
        : error.message;
      return `❌ 검증 요청 실패: ${errorMessage}`;
    } else {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return `❌ 검증 요청 실패: ${errorMessage}`;
    }
  }
}
