/**
 * 환경변수 로드 및 검증 모듈
 * dotenv로 .env 파일 로드 후 zod로 검증
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';
import { existsSync } from 'fs';
import { z } from 'zod';

// 현재 파일의 디렉토리 경로 얻기 (ESM 모듈용)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 프로젝트 루트 경로 계산 (src/config/env.ts -> 프로젝트 루트)
const projectRoot = resolve(__dirname, '../..');

// .env 파일 경로 (여러 위치 시도)
const envPaths = [
  join(process.cwd(), '.env'),      // 현재 작업 디렉토리
  join(projectRoot, '.env'),         // 프로젝트 루트 (계산된 경로)
];

// .env 파일 찾기 및 로드
let envPath: string | undefined;
for (const path of envPaths) {
  if (existsSync(path)) {
    envPath = path;
    break;
  }
}

// .env 파일 로드
if (envPath) {
  const result = config({ path: envPath });
  if (result.error) {
    console.warn(`⚠️ .env 파일을 로드하는 중 오류 발생: ${envPath}`);
    console.warn(`⚠️ 오류: ${result.error.message}`);
  }
} else {
  // .env 파일을 찾지 못한 경우 기본 로드 시도
  const result = config();
  if (result.error) {
    const errorCode = (result.error as NodeJS.ErrnoException).code;
    if (errorCode !== 'ENOENT') {
      // ENOENT는 파일이 없다는 의미이므로 무시
      console.warn(`⚠️ .env 파일을 찾을 수 없습니다.`);
      console.warn(`⚠️ 시도한 경로: ${envPaths.join(', ')}`);
      console.warn(`⚠️ 오류: ${result.error.message}`);
    }
  }
}

// 환경변수 스키마 정의
const envSchema = z.object({
  NAVER_CLIENT_ID: z.string().min(1, 'NAVER_CLIENT_ID는 필수입니다'),
  NAVER_CLIENT_SECRET: z.string().min(1, 'NAVER_CLIENT_SECRET은 필수입니다'),
  PORT: z.string().optional().default('3000').transform(Number),
  TRANSPORT_MODE: z.enum(['stdio', 'sse']).optional().default('stdio'),
});

// 환경변수 검증 및 export
export const env = envSchema.parse({
  NAVER_CLIENT_ID: process.env.NAVER_CLIENT_ID,
  NAVER_CLIENT_SECRET: process.env.NAVER_CLIENT_SECRET,
  PORT: process.env.PORT,
  TRANSPORT_MODE: process.env.TRANSPORT_MODE,
});