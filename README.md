# WhatMeme (왓밈) MCP Server

한국 밈 트렌드 분석 및 추천을 위한 MCP (Model Context Protocol) 서버입니다.

## 📖 프로젝트 소개

WhatMeme은 내부 DB 기반으로 한국 밈의 유행 상태를 분석하고, 상황별 밈 추천 및 뜻 풀이를 제공하는 MCP 서버입니다.

### 주요 기능

1. **유행 판독기**: 밈의 현재 유행 상태를 분석하고 판정
2. **최신 밈 추천**: 현재 인기 있는 밈 TOP 5 목록 제공
3. **상황별 밈 추천**: 주어진 상황에 맞는 밈 키워드 추천
4. **뜻 풀이**: 밈의 뜻과 유래 검색 및 설명

### 플랫폼 호환성

- ✅ **Claude Desktop** (stdio 모드)
- ✅ **PlayMCP** (Streamable HTTP 모드, `/mcp` 엔드포인트)
- ✅ **ChatGPT** (stdio 모드, 제한적 지원)

---

## 🏗️ 프로젝트 아키텍처

```
whatmeme-mcp/
├── src/
│   ├── index.ts              # MCP 서버 메인 진입점 (stdio + Streamable HTTP 하이브리드)
│   ├── config/
│   │   └── env.ts            # 환경변수 로드 및 zod 검증
│   ├── data/
│   │   └── hotMemes.ts       # 인메모리 밈 DB (CONST_HOT_MEMES 배열)
│   ├── domain/
│   │   └── memeResolver.ts   # 공통 밈 해석기
│   ├── tools/
│   │   ├── index.ts          # 4개 Tool 통합 export
│   │   ├── checkMemeStatus.ts        # Tool 1: 유행 판독기
│   │   ├── getTrendingMemes.ts       # Tool 2: 최신 밈 추천
│   │   ├── recommendMeme.ts          # Tool 3: 상황별 밈 추천
│   │   └── searchMemeMeaning.ts      # Tool 4: 뜻 풀이
│   ├── utils/
│   │   ├── queryNormalizer.ts    # 밈 검색 쿼리 정규화
│   │   ├── situationTokenizer.ts # 상황 텍스트 토큰화
│   │   └── dateHelper.ts     # 날짜 계산 헬퍼 (date-fns 활용)
│   └── types/
│       └── index.ts          # TypeScript 인터페이스 정의
├── .env                      # 환경변수 (실제 API 키)
├── .gitignore                # Git 제외 파일 목록
├── package.json              # 의존성 & npm 스크립트
├── tsconfig.json             # TypeScript 컴파일러 설정
└── README.md                 # 프로젝트 문서
```

### 디렉토리 구조 설명

- **`src/config/`**: 환경변수 관리 및 검증
- **`src/data/`**: 인메모리 밈 데이터베이스
- **`src/domain/`**: 도메인 로직 (밈 해석기 등)
- **`src/tools/`**: MCP Tool 구현체
- **`src/utils/`**: 공통 유틸리티 함수
- **`src/types/`**: TypeScript 타입 정의

---

## 🚀 설치 방법

### 1. 저장소 클론

```bash
git clone <repository-url>
cd whatmeme-mcp
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경변수 설정 (선택)

`.env` 파일을 생성하고 선택적 환경변수를 설정하세요:

```env
PORT=3000
TRANSPORT_MODE=stdio
```

**참고:** 네이버 API는 사용하지 않으며, 모든 기능은 내부 DB 기반으로 동작합니다.

### 4. 빌드

```bash
npm run build
```

---

## 🎮 실행 방법

### 개발 모드

#### stdio 모드 (Claude Desktop, ChatGPT용)

```bash
npm run dev
```

#### Streamable HTTP 모드 (PlayMCP용)

```bash
npm run dev:http
```

서버가 `http://localhost:3000/mcp`에서 실행됩니다.

### 프로덕션 모드

#### stdio 모드

```bash
npm run build
npm start
```

#### Streamable HTTP 모드

```bash
npm run build
npm run start:http
```

---

## 🔌 플랫폼별 연결 방법

### 1. Claude Desktop (stdio 모드)

Claude Desktop에서 MCP 서버를 사용하려면 설정 파일을 수정해야 합니다.

#### 설정 파일 위치

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

#### 설정 파일 편집

```json
{
  "mcpServers": {
    "whatmeme": {
      "command": "node",
      "args": [
        "/absolute/path/to/whatmeme-mcp/dist/index.js"
      ],
      "env": {}
    }
  }
}
```

**또는 npm 스크립트 사용:**

```json
{
  "mcpServers": {
    "whatmeme": {
      "command": "npm",
      "args": [
        "run",
        "start",
        "--prefix",
        "/absolute/path/to/whatmeme-mcp"
      ],
      "env": {}
    }
  }
}
```

**중요**: 절대 경로를 정확하게 입력하세요!

#### Claude Desktop에서 테스트

1. Claude Desktop 재시작 (설정 변경 후 필요)
2. Claude Desktop에서 Tool 확인:
   - "whatmeme 서버의 Tool 목록 보여줘"
   - "check_meme_status Tool로 '럭키비키' 밈 확인해줘"

#### 테스트 시나리오

- ✅ 서버 연결 확인: Claude Desktop에서 "whatmeme" 서버가 표시되는지 확인
- ✅ Tool 목록 확인: 4개 Tool 모두 표시되어야 함
- ✅ Tool 실행 테스트: 각 Tool을 실행하여 결과 확인

---

### 2. PlayMCP (Streamable HTTP 모드)

PlayMCP는 Streamable HTTP (2025-03-26 스펙) 모드를 사용합니다.

#### 서버 실행

**개발 모드:**
```bash
npm run dev:http
```

**프로덕션 모드:**
```bash
npm run build
npm run start:http
```

서버가 `http://localhost:3000/mcp`에서 실행됩니다.

#### PlayMCP 연결 설정

1. PlayMCP 웹사이트 접속 (https://playmcp.com)
2. "Add MCP Server" 또는 "서버 추가" 클릭
3. 서버 정보 입력:
   - **서버 이름**: `whatmeme`
   - **서버 URL**: `http://localhost:3000/mcp` (로컬) 또는 `https://your-domain.com/mcp` (프로덕션)
   - **Transport Type**: `Streamable HTTP`
   - **설명**: "한국 밈 트렌드 분석 및 추천 서버"
4. 저장 후 연결 테스트

#### PlayMCP 테스트

1. 서버가 실행 중인지 확인:
   ```bash
   curl http://localhost:3000/health
   # {"status":"ok","service":"whatmeme-mcp-server",...}
   ```

2. PlayMCP 대시보드에서:
   - "정보 불러오기" 클릭하여 서버 연결 확인
   - Tool 목록 확인
   - 각 Tool 실행 테스트

**참고**: 
- 프로덕션 환경에서는 실제 도메인과 HTTPS를 사용하세요 (예: `https://your-domain.railway.app/mcp`)
- 로컬 테스트 시 PlayMCP가 같은 네트워크에 있어야 합니다

---

### 3. ChatGPT / Custom GPT

ChatGPT의 MCP 지원은 아직 제한적입니다. 다음 방법을 시도해보세요:

#### 방법 A: Streamable HTTP 모드 사용 (제한적)

1. Streamable HTTP 서버 실행:
   ```bash
   npm run dev:http
   ```

2. Custom GPT 편집:
   - Actions 섹션에서 "Create new action" 클릭
   - OpenAPI 스키마 또는 API 엔드포인트 설정

**참고:** ChatGPT의 MCP 지원은 아직 제한적일 수 있습니다.

---

## 🧪 테스트 방법

### 직접 테스트 (가장 간단) ⭐

각 Tool 함수를 직접 호출하여 테스트할 수 있습니다:

```bash
npm run test:manual
```

이 명령어는 다음을 순차적으로 테스트합니다:
1. `get_trending_memes` - 내부 데이터 (즉시 결과)
2. `check_meme_status` - 내부 DB 검색 (즉시 결과)
3. `recommend_meme_for_context` - 내부 DB 기반 추천 (즉시 결과)
4. `search_meme_meaning` - 내부 DB 검색 (즉시 결과)

**장점:**
- ✅ Claude Desktop 설치 불필요
- ✅ 빠르고 간단
- ✅ 각 함수를 직접 테스트 가능
- ✅ 디버깅 용이

### TypeScript 타입 체크

```bash
npm run typecheck
```

### 서버 실행 테스트

**stdio 모드:**
```bash
npm run dev
# 서버가 정상적으로 시작되는지 확인
```

**Streamable HTTP 모드:**
```bash
npm run dev:http
# 서버가 http://localhost:3000/mcp에서 실행됨
```

---

## 🛠️ Tool 사용 예시

### 1. check_meme_status (유행 판독기)

밈의 현재 유행 상태를 확인합니다.

**요청 예시:**
```json
{
  "name": "check_meme_status",
  "arguments": {
    "keyword": "중꺾마"
  }
}
```

**응답 예시 (내부 DB):**
```
[내부 DB] 🔥 인증된 핵인싸 밈입니다!

**중꺾마**
중요한 건 꺾이지 않는 마음

태그: #동기부여
```


### 2. get_trending_memes (최신 밈 추천)

현재 인기 있는 밈 목록을 가져옵니다.

**요청 예시:**
```json
{
  "name": "get_trending_memes",
  "arguments": {}
}
```

**응답 예시:**
```
🔥 현재 인기 밈 TOP 6

1. **럭키비키**
   - 원영적 사고
   - 태그: #긍정 #마인드

2. **중꺾마**
   - 중요한 건 꺾이지 않는 마음
   - 태그: #동기부여
...
```

### 3. recommend_meme_for_context (상황별 밈 추천)

상황에 맞는 밈을 추천합니다.

**요청 예시:**
```json
{
  "name": "recommend_meme_for_context",
  "arguments": {
    "situation": "퇴근하고 싶을 때"
  }
}
```

**응답 예시:**
```
💡 "퇴근하고 싶을 때" 관련 밈 추천

1. **럭키비키** — 운 좋은 원영, 모든 상황을 긍정적으로 해석하는 초긍정 마인드 (#긍정 #마인드) (매칭: 퇴근, 회사)
2. **중꺾마** — 중간에 꺾이지 않는 마음, 포기하지 않고 끝까지 밀고 나가는 의지 (#동기부여) (매칭: 힘든, 포기)
```

### 4. search_meme_meaning (뜻 풀이)

밈의 뜻과 유래를 검색합니다.

**요청 예시:**
```json
{
  "name": "search_meme_meaning",
  "arguments": {
    "keyword": "돔황챠"
  }
}
```

**응답 예시:**
```
**돔황챠**

**뜻**
도망X 황당X 차단O의 줄임말

**유래**
SNS나 온라인 커뮤니티에서...

**사용 예시**
- ...

**태그**
#트렌드 #인터넷
```

---

## 🚀 배포 가이드

### 로컬 실행 (개발/테스트용)

```bash
# stdio 모드
npm run dev

# Streamable HTTP 모드
npm run dev:http
```

### 클라우드 배포 (프로덕션용)

#### Railway

```bash
railway init
railway up
railway env set PORT=3000
railway env set TRANSPORT_MODE=http
```

#### Render

1. GitHub 저장소 연결
2. 빌드 명령: `npm run build`
3. 실행 명령: `npm run start:http`
4. 환경변수 설정

#### Fly.io

```bash
fly launch
fly secrets set PORT=3000
fly secrets set TRANSPORT_MODE=http
```

### PM2로 프로덕션 실행

```bash
npm run build
npm install -g pm2
pm2 start dist/index.js --name whatmeme-mcp -- --transport http
pm2 save
```

---

## 📊 플랫폼별 테스트 체크리스트

### Claude Desktop
- [ ] 서버가 stdio 모드로 시작됨
- [ ] Claude Desktop에서 서버 인식됨
- [ ] 4개 Tool 모두 표시됨
- [ ] 각 Tool 실행 성공

### PlayMCP
- [ ] Streamable HTTP 서버가 정상 시작됨
- [ ] PlayMCP에서 서버 연결 성공 (정보 불러오기)
- [ ] Tool 목록 조회 성공
- [ ] 각 Tool 실행 성공

### 전체 호환성
- [ ] stdio 모드 정상 작동
- [ ] Streamable HTTP 모드 정상 작동
- [ ] 내부 DB 검색 정상
- [ ] 에러 핸들링 정상

---

## 🆘 문제 해결

### 문제: Claude Desktop에서 서버 연결 실패

**해결:**
1. 설정 파일 경로 확인
2. 절대 경로 사용 확인
3. Claude Desktop 재시작
4. 서버 로그 확인 (`npm run dev`로 stdio 모드 실행 시 로그 확인)

### 문제: Claude Desktop에서 Tool이 보이지 않음

**해결:**
1. 설정 파일 경로 확인
2. 환경변수 확인
3. 서버 빌드 확인 (`npm run build`)
4. Claude Desktop 재시작

### 문제: PlayMCP 연결 실패

**해결:**
1. Streamable HTTP 서버가 실행 중인지 확인 (`npm run start:http`)
2. 포트(3000)가 올바른지 확인
3. URL이 정확한지 확인 (`/mcp` 엔드포인트 포함, 예: `https://your-domain.com/mcp`)
4. Transport Type이 "Streamable HTTP"로 설정되었는지 확인
5. CORS 설정 확인
6. 네트워크 방화벽 확인
7. Railway/Render 배포 시 포트가 올바르게 설정되었는지 확인


### 문제: 빌드 실패

**해결:**
1. `npm install` 재실행
2. Node.js 버전 확인 (20+ 필요)
3. TypeScript 오류 확인: `npm run typecheck`

---

## ⚠️ 주의사항

1. **API 키 보안**
   - 절대 소스 코드에 API 키 포함하지 않기
   - `.env` 파일을 `.gitignore`에 추가
   - 공개 저장소에 커밋하지 않기

2. **포트 충돌**
   - Streamable HTTP 모드 기본 포트: 3000
   - 다른 서비스와 포트 충돌 시 `PORT` 환경변수로 변경

---

## 📦 기술 스택

- **Runtime**: Node.js 20+ (LTS)
- **Language**: TypeScript
- **MCP SDK**: `@modelcontextprotocol/sdk`
- **Date Handling**: `date-fns` (선택적 사용)
- **Schema Validation**: `zod`
- **Web Framework**: `express` (Streamable HTTP 모드용)

---

## 📝 공모전 제출 체크리스트

### 필수 파일
- [x] `README.md` - 프로젝트 소개 및 가이드
- [x] `package.json` - 의존성 정의
- [x] `tsconfig.json` - TypeScript 설정
- [x] `.env.example` - 환경변수 예시
- [x] `src/` - 소스 코드
- [x] `dist/` - 빌드 결과물 (빌드 후)

### 기능
- [x] stdio 모드 구현
- [x] Streamable HTTP 모드 구현
- [x] 4개 Tool 구현
- [x] 내부 DB 기반 검색
- [x] 에러 핸들링

### 테스트
- [x] 로컬 테스트 완료 (모든 Tool 작동 확인)
- [ ] Claude Desktop 연결 테스트
- [ ] PlayMCP 연결 테스트

---

## 📚 밈 데이터 추가 규칙

WhatMeme은 내부 DB 기반으로 동작합니다. 새로운 밈을 추가하려면 `src/data/hotMemes.ts`의 `CONST_HOT_MEMES` 배열에 다음 형식으로 추가하세요.

### 데이터 구조

```typescript
{
  id: 'unique-id',                    // 고유 식별자 (영문 소문자, 하이픈 사용)
  name: '밈 이름',                     // 대표 이름
  aliases: ['별칭1', '별칭2'],         // 다른 이름들 (띄어쓰기/영문 등)
  meaning: '한 줄 뜻 설명',            // 간단한 의미 (1줄)
  origin: '유래/맥락 설명 (2~4줄)',   // 상세한 유래 설명
  examples: [                         // 사용 예시 (2~3개)
    '상황 → "밈 사용 예시"',
    ...
  ],
  tags: ['태그1', '태그2'],           // 분류 태그
  contexts: ['상황1', '상황2'],       // 상황 키워드 (퇴근, 회사, 피곤, 현타 등)
  moods: ['감정1', '감정2'],          // 감정 키워드 (신남, 빡침, 우울, 자조 등)
  trendRank: 1,                       // 트렌딩 순위 (낮을수록 상위)
  popularity: 95,                     // 인기도 점수 (0~100)
  updatedAt: '2026-01-08',            // 업데이트 날짜 (ISO 형식)
}
```

### 필드별 작성 가이드

#### `id`
- 고유 식별자
- 영문 소문자, 하이픈(`-`) 사용
- 예: `lucky-vicky`, `jung-geom-ma`

#### `name`
- 밈의 대표 이름
- 사용자가 가장 많이 부르는 이름

#### `aliases`
- 다른 이름들 (최소 2~3개)
- 띄어쓰기 변형, 영문명, 줄임말 등 포함
- 예: `['럭비', 'Lucky Vicky', 'luckyvicky']`

#### `meaning`
- 한 줄로 밈의 의미를 설명
- 예: `'운 좋은 원영, 모든 상황을 긍정적으로 해석하는 초긍정 마인드'`

#### `origin`
- 밈의 유래와 맥락을 2~4줄로 설명
- 어디서 시작되었는지, 왜 유행했는지 포함

#### `examples`
- 실제 사용 예시 2~3개
- 형식: `'상황 → "밈 사용 예시"'`
- 다양한 상황을 포함하되 간결하게

#### `tags`
- 밈을 분류하는 태그 (3~5개)
- 예: `['긍정', '마인드', '아이돌']`

#### `contexts` ⭐ (중요)
- 밈이 사용되는 상황 키워드 (최소 5개 이상)
- 추천 시스템의 핵심 필드
- 업무/생활 상황 대응을 특히 보강:
  - 업무: `['퇴근', '출근', '회사', '일', '직장', '근무', '회의']`
  - 학습: `['시험', '공부', '과제', '프로젝트']`
  - 생활: `['주말', '친구', '놀', '쉬', '여가']`
  - 감정/상태: `['피곤', '힘든', '어려운', '스트레스']`

#### `moods` ⭐ (중요)
- 밈이 표현하는 감정 키워드 (최소 5개 이상)
- 추천 시스템의 핵심 필드
- 예: `['긍정', '자조', '유쾌', '낙관', '여유']` 또는 `['의지', '각성', '투지', '불굴', '인내']`

#### `popularity`
- 수동 관리 인기도 점수 (0~100)
- 80 이상: 🔥 핫한 밈
- 50~79: ⚖️ 스테디 밈
- 50 미만: 🧊 과거/마이너 밈
- 주기적으로 업데이트 필요

#### `updatedAt`
- 최종 업데이트 날짜 (ISO 형식: `YYYY-MM-DD`)
- 예: `'2026-01-08'`

### 추가 예시

```typescript
{
  id: 'new-meme',
  name: '새로운밈',
  aliases: ['새밈', 'newmeme'],
  meaning: '새로운 밈의 의미',
  origin: '유래 설명...',
  examples: [
    '상황 → "사용 예시"',
  ],
  tags: ['태그1', '태그2'],
  contexts: ['상황1', '상황2', '상황3', '상황4', '상황5'],
  moods: ['감정1', '감정2', '감정3', '감정4', '감정5'],
  trendRank: 8,
  popularity: 60,
  updatedAt: '2026-01-08',
}
```

### 유지보수 가이드

1. **정기적 업데이트**
   - `popularity` 점수 조정
   - `updatedAt` 날짜 갱신
   - `contexts`/`moods` 보완

2. **데이터 품질**
   - 각 필드 최소 기준 충족
   - `contexts`와 `moods`는 최소 5개씩
   - 예시는 실제 사용 사례 기반

3. **중복 방지**
   - 추가 전 기존 밈과 중복 확인
   - `aliases`도 중복 체크

---

## 🤝 기여

이슈와 PR을 환영합니다!

## 📄 라이선스

MIT License

## 📞 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 등록해주세요.