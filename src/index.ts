/**
 * WhatMeme MCP Server - 메인 진입점
 * stdio + Streamable HTTP 하이브리드 모드 지원
 * - stdio 모드: Claude Desktop, ChatGPT용 (기본값)
 * - Streamable HTTP 모드: PlayMCP용 (/mcp 엔드포인트)
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import express from 'express';
import { env } from './config/env.js';
import {
  checkMemeStatus,
  getTrendingMemes,
  recommendMemeForContext,
  searchMemeMeaning,
  getRandomMeme,
} from './tools/index.js';
import adminRouter from './routes/admin.js';

// MCP 서버 핸들러 설정 함수
function setupServerHandlers(server: Server) {
  // Tool 목록 핸들러
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: 'check_meme_status',
          description: '밈의 현재 유행/트렌딩 상태를 5단계로 답합니다\n(🔥: 80~100점 / ⚡: 60~80점 / ⚖️: 40~60점 / 🧊: 20~40점 / ❄️: 0~20점)\n\n예시 질문: "매끈매끈하다 밈 핫해?", "골반춤 밈 유행이야?", "요즘 럭키비키 밈 식었어?"',
          inputSchema: {
            type: 'object',
            properties: {
              keyword: {
                type: 'string',
                description: '검색할 밈 키워드 또는 질문',
              },
            },
            required: ['keyword'],
          },
        },
        {
          name: 'get_trending_memes',
          description: '현재 트렌딩 TOP 5 밈 목록을 반환합니다.\n\n예시 질문: "최신 밈 알려줘", "요즘 핫한 밈 뭐야?", "지금 유행하는 밈 뭐 있어?"',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'recommend_meme_for_context',
          description: '주어진 상황에 맞는 밈을 추천합니다.\n\n예시 질문: "시험 스트레스 받을 때 밈", "신날 때 쓰는 밈 뭐있어?", "합의 없이 결론을 멋대로 지을 때 밈 추천해줘"',
          inputSchema: {
            type: 'object',
            properties: {
              situation: {
                type: 'string',
                description: '상황 설명',
              },
            },
            required: ['situation'],
          },
        },
        {
          name: 'search_meme_meaning',
          description: '밈의 뜻/유래/사용예시를 설명합니다.\n\n예시 질문: "매끈매끈하다 밈 알아?", "골반춤 밈이 뭐야?", "럭키비키 밈 알려줘"',
          inputSchema: {
            type: 'object',
            properties: {
              keyword: {
                type: 'string',
                description: '검색할 밈 키워드 또는 질문',
              },
            },
            required: ['keyword'],
          },
        },
        {
          name: 'get_random_meme',
          description: '랜덤으로 밈 하나를 선택해서 뜻/유래/예시를 보여줍니다.\n\n예시 질문: "밈 아무거나 알려줘", "밈 하나 추천해줘", "밈 랜덤 추천"',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
      ],
    };
  });

  // Tool 실행 핸들러
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      let result: string;

      switch (name) {
        case 'check_meme_status': {
          const keyword = args?.keyword as string;
          if (!keyword) {
            throw new Error('keyword 파라미터가 필요합니다');
          }
          result = await checkMemeStatus(keyword);
          break;
        }

        case 'get_trending_memes': {
          result = getTrendingMemes();
          break;
        }

        case 'recommend_meme_for_context': {
          const situation = args?.situation as string;
          if (!situation) {
            throw new Error('situation 파라미터가 필요합니다');
          }
          result = await recommendMemeForContext(situation);
          break;
        }

        case 'search_meme_meaning': {
          const keyword = args?.keyword as string;
          if (!keyword) {
            throw new Error('keyword 파라미터가 필요합니다');
          }
          result = await searchMemeMeaning(keyword);
          break;
        }

        case 'get_random_meme': {
          result = getRandomMeme();
          break;
        }

        default:
          throw new Error(`알 수 없는 Tool: ${name}`);
      }

      return {
        content: [
          {
            type: 'text',
            text: result,
          },
        ],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [
          {
            type: 'text',
            text: `❌ 오류 발생: ${errorMessage}`,
          },
        ],
        isError: true,
      };
    }
  });
}

// MCP 서버 인스턴스 생성
const server = new Server(
  {
    name: 'whatmeme-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 핸들러 설정
setupServerHandlers(server);

// 서버 시작 함수
async function main() {
  // 명령행 인자 파싱 (명령행 인자가 없으면 env.TRANSPORT_MODE 사용)
  const args = process.argv.slice(2);
  const transportIndex = args.indexOf('--transport');
  const transportMode = transportIndex >= 0
    ? args[transportIndex + 1] || env.TRANSPORT_MODE
    : env.TRANSPORT_MODE;

  if (transportMode === 'http' || transportMode === 'streamable') {
    // Streamable HTTP 모드: Express 서버 + StreamableHTTPServerTransport
    console.error('Starting WhatMeme MCP Server in Streamable HTTP mode...');

    const app = express();

    // CORS 설정 (전역)
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
      }
      next();
    });

    // Body parser (JSON) - Streamable HTTP는 JSON 요청/응답 사용
    app.use(express.json());

    // Health check 엔드포인트
    app.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        service: 'whatmeme-mcp-server',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      });
    });

    // 관리자 API 라우터 등록
    app.use('/api/admin', adminRouter);

    // Stateless Streamable HTTP transport 생성 (요청마다 재사용)
    // sessionIdGenerator를 undefined로 설정하여 stateless 모드 활성화
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // Stateless mode
    });

    // MCP 서버를 transport에 연결
    await server.connect(transport);

    // Streamable HTTP 엔드포인트 (/mcp)
    // Stateless: 요청마다 동일한 transport 인스턴스 사용
    app.post('/mcp', async (req, res) => {
      try {
        // handleRequest가 요청을 처리하고 응답을 전송함
        await transport.handleRequest(req, res, req.body);
      } catch (error) {
        if (!res.headersSent) {
          res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) });
        }
      }
    });

    // GET 요청도 지원 (SSE 스트림용, 선택적)
    app.get('/mcp', async (req, res) => {
      try {
        await transport.handleRequest(req, res);
      } catch (error) {
        if (!res.headersSent) {
          res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : String(error) });
        }
      }
    });

    // HTTP 서버 시작
    const port = Number(process.env.PORT ?? env.PORT ?? 3000);
    app.listen(port, '0.0.0.0', () => {
      console.error(`Listening on 0.0.0.0:${port}`);
      console.error(`WhatMeme MCP Server running on http://localhost:${port}/mcp`);
      console.error(`PlayMCP endpoint: http://localhost:${port}/mcp`);
    });
  } else {
    // stdio 모드: StdioServerTransport (기본값)
    console.error('Starting WhatMeme MCP Server in stdio mode...');

    const transport = new StdioServerTransport();
    await server.connect(transport);

    console.error('WhatMeme MCP Server ready (stdio mode)');
  }
}

// 에러 핸들링
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// 서버 시작
main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
