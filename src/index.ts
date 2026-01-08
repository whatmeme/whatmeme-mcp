/**
 * WhatMeme MCP Server - 메인 진입점
 * stdio + SSE 하이브리드 모드 지원
 * - stdio 모드: Claude Desktop, ChatGPT용 (기본값)
 * - SSE 모드: PlayMCP용
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import express from 'express';
import { env } from './config/env.js';
import {
  checkMemeStatus,
  getTrendingMemes,
  recommendMemeForContext,
  searchMemeMeaning,
} from './tools/index.js';

// MCP 서버 핸들러 설정 함수
function setupServerHandlers(server: Server) {
  // Tool 목록 핸들러
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: 'check_meme_status',
          description: '밈의 현재 유행 상태를 분석하고 판정합니다. 내부 DB에서 확인하거나 네이버 블로그 검색으로 최근 게시글 비율을 계산합니다.',
          inputSchema: {
            type: 'object',
            properties: {
              keyword: {
                type: 'string',
                description: '검색할 밈 키워드',
              },
            },
            required: ['keyword'],
          },
        },
        {
          name: 'get_trending_memes',
          description: '현재 인기 있는 밈 TOP 6 목록을 반환합니다.',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'recommend_meme_for_context',
          description: '주어진 상황에 맞는 밈을 추천합니다. 네이버 이미지 검색을 통해 관련 키워드를 제공합니다.',
          inputSchema: {
            type: 'object',
            properties: {
              situation: {
                type: 'string',
                description: '상황 설명 (예: "퇴근하고 싶을 때", "시험 스트레스 받을 때")',
              },
            },
            required: ['situation'],
          },
        },
        {
          name: 'search_meme_meaning',
          description: '밈의 뜻과 유래를 검색해서 설명합니다. 네이버 블로그 검색을 통해 관련 정보를 제공합니다.',
          inputSchema: {
            type: 'object',
            properties: {
              keyword: {
                type: 'string',
                description: '검색할 밈 키워드',
              },
            },
            required: ['keyword'],
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
  // 명령행 인자 파싱
  const args = process.argv.slice(2);
  const transportIndex = args.indexOf('--transport');
  const transportMode = transportIndex >= 0 
    ? args[transportIndex + 1] || 'stdio'
    : 'stdio';

  if (transportMode === 'sse') {
    // SSE 모드: Express 서버 + SSEServerTransport
    console.error('Starting WhatMeme MCP Server in SSE mode...');
    
    // createMcpExpressApp() 대신 일반 Express 앱 사용
    // 이유: createMcpExpressApp()이 내부적으로 body-parser를 설정할 수 있음
    const app = express();

    // 세션별 transport 저장 (실제 프로덕션에서는 Redis 등 사용)
    const transports = new Map<string, SSEServerTransport>();

    // CORS 설정 - /sse와 /message에만 적용
    // 주의: body-parsing 미들웨어는 절대 추가하지 않음
    app.use('/sse', (req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
      }
      next();
    });

    app.use('/message', (req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, x-session-id');
      if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
      }
      next();
    });

    // Health check 엔드포인트
    // body-parsing 불필요하므로 express.json() 제거
    app.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        service: 'whatmeme-mcp-server',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
      });
    });

    // SSE 엔드포인트 설정
    // 주의: express.json() 미들웨어 적용하지 않음
    app.get('/sse', async (req, res) => {
      try {
        console.error('New SSE connection request');
        const transport = new SSEServerTransport('/message', res);
        const sessionId = transport.sessionId;
        transports.set(sessionId, transport);
        console.error(`SSE connection established, sessionId: ${sessionId}`);
        
        // 각 세션마다 새로운 서버 인스턴스 생성
        const sessionServer = new Server(
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
        setupServerHandlers(sessionServer);
        
        // 서버 연결 (connect()가 자동으로 start()를 호출함)
        await sessionServer.connect(transport);
      } catch (error) {
        console.error('SSE connection error:', error);
        if (!res.headersSent) {
          res.status(500).send('SSE connection failed');
        }
      }
    });

    // POST 메시지 엔드포인트
    // 주의: express.json() 미들웨어를 절대 사용하지 않음
    // handlePostMessage가 직접 request stream을 파싱함
    app.post('/message', async (req, res) => {
      try {
        const sessionId = (req.query.sessionId as string) || 
                          (req.headers['x-session-id'] as string);
        
        if (!sessionId) {
          console.error('POST /message: sessionId not found');
          res.status(400).send('Session ID required');
          return;
        }

        const transport = transports.get(sessionId);
        
        if (!transport) {
          console.error(`POST /message: Session not found, sessionId: ${sessionId}`);
          res.status(404).send('Session not found');
          return;
        }

        console.error(`POST /message: Received message for sessionId: ${sessionId}`);
        // handlePostMessage가 request stream을 직접 파싱함
        await transport.handlePostMessage(req, res);
      } catch (error) {
        console.error('Message handling error:', error);
        if (!res.headersSent) {
          res.status(500).send('Message handling failed');
        }
      }
    });

    // HTTP 서버 시작
    const port = env.PORT || 3000;
    app.listen(port, () => {
      console.error(`WhatMeme MCP Server running on http://localhost:${port}/sse`);
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