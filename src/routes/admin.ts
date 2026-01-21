/**
 * 관리자 API 라우터
 * n8n 워크플로우에서 사용하는 관리 API 엔드포인트
 */

import { Router, Request, Response } from 'express';
import { CONST_HOT_MEMES } from '../data/hotMemes.js';
import type { MemeData } from '../types/index.js';
import { z } from 'zod';

const router = Router();

// API Key 인증 미들웨어
const authenticateApiKey = (req: Request, res: Response, next: Function) => {
  const apiKey = req.headers.authorization?.replace('Bearer ', '');
  const validApiKey = process.env.ADMIN_API_KEY;

  if (!validApiKey) {
    return res.status(500).json({
      success: false,
      message: '서버 설정 오류: ADMIN_API_KEY가 설정되지 않았습니다.',
    });
  }

  if (apiKey !== validApiKey) {
    return res.status(401).json({
      success: false,
      message: '인증 실패: 유효하지 않은 API Key입니다.',
    });
  }

  next();
};

// 모든 관리자 API에 인증 적용
router.use(authenticateApiKey);

// 밈 정보 업데이트 스키마
const updateMemeSchema = z.object({
  popularity: z.number().min(0).max(100).optional(),
  trendRank: z.number().int().positive().optional(),
  updatedAt: z.string().optional(),
});

// 밈 인기도 업데이트 스키마
const updatePopularitySchema = z.object({
  popularity: z.number().min(0).max(100),
  updatedAt: z.string().optional(),
});

// 신규 밈 추가 스키마
const createMemeSchema = z.object({
  id: z.string(),
  name: z.string(),
  aliases: z.array(z.string()),
  meaning: z.string(),
  origin: z.string(),
  examples: z.array(z.string()),
  tags: z.array(z.string()),
  contexts: z.array(z.string()),
  moods: z.array(z.string()),
  trendRank: z.number().int().positive(),
  popularity: z.number().min(0).max(100),
  updatedAt: z.string(),
});

/**
 * GET /api/admin/memes
 * 전체 밈 데이터 조회
 */
router.get('/memes', (req: Request, res: Response) => {
  try {
    const { limit, sortBy, order } = req.query;

    let memes = [...CONST_HOT_MEMES];

    // 정렬
    if (sortBy === 'trendRank') {
      memes.sort((a, b) => (order === 'desc' ? b.trendRank - a.trendRank : a.trendRank - b.trendRank));
    } else if (sortBy === 'popularity') {
      memes.sort((a, b) => (order === 'desc' ? b.popularity - a.popularity : a.popularity - b.popularity));
    } else if (sortBy === 'updatedAt') {
      memes.sort((a, b) => {
        const dateA = new Date(a.updatedAt || '2000-01-01').getTime();
        const dateB = new Date(b.updatedAt || '2000-01-01').getTime();
        return order === 'desc' ? dateB - dateA : dateA - dateB;
      });
    }

    // 개수 제한
    if (limit) {
      const limitNum = parseInt(limit as string, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        memes = memes.slice(0, limitNum);
      }
    }

    res.json({
      success: true,
      data: memes,
      total: CONST_HOT_MEMES.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '서버 오류',
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * GET /api/admin/memes/:id
 * 특정 밈 조회
 */
router.get('/memes/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const meme = CONST_HOT_MEMES.find((m) => m.id === id);

    if (!meme) {
      return res.status(404).json({
        success: false,
        message: `밈을 찾을 수 없습니다: ${id}`,
      });
    }

    res.json({
      success: true,
      data: meme,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '서버 오류',
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * POST /api/admin/memes/:id/popularity
 * 밈 인기도 업데이트
 */
router.post('/memes/:id/popularity', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = updatePopularitySchema.parse(req.body);

    const memeIndex = CONST_HOT_MEMES.findIndex((m) => m.id === id);
    if (memeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `밈을 찾을 수 없습니다: ${id}`,
      });
    }

    CONST_HOT_MEMES[memeIndex].popularity = body.popularity;
    if (body.updatedAt) {
      CONST_HOT_MEMES[memeIndex].updatedAt = body.updatedAt;
    } else {
      CONST_HOT_MEMES[memeIndex].updatedAt = new Date().toISOString().split('T')[0];
    }

    res.json({
      success: true,
      message: '인기도 업데이트 완료',
      data: {
        id: CONST_HOT_MEMES[memeIndex].id,
        name: CONST_HOT_MEMES[memeIndex].name,
        popularity: CONST_HOT_MEMES[memeIndex].popularity,
        updatedAt: CONST_HOT_MEMES[memeIndex].updatedAt,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: '요청 데이터 검증 실패',
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: '서버 오류',
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * PUT /api/admin/memes/:id
 * 밈 정보 업데이트
 */
router.put('/memes/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const body = updateMemeSchema.parse(req.body);

    const memeIndex = CONST_HOT_MEMES.findIndex((m) => m.id === id);
    if (memeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `밈을 찾을 수 없습니다: ${id}`,
      });
    }

    if (body.popularity !== undefined) {
      CONST_HOT_MEMES[memeIndex].popularity = body.popularity;
    }
    if (body.trendRank !== undefined) {
      CONST_HOT_MEMES[memeIndex].trendRank = body.trendRank;
    }
    if (body.updatedAt) {
      CONST_HOT_MEMES[memeIndex].updatedAt = body.updatedAt;
    } else if (body.popularity !== undefined || body.trendRank !== undefined) {
      CONST_HOT_MEMES[memeIndex].updatedAt = new Date().toISOString().split('T')[0];
    }

    res.json({
      success: true,
      message: '밈 정보 업데이트 완료',
      data: CONST_HOT_MEMES[memeIndex],
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: '요청 데이터 검증 실패',
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: '서버 오류',
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * GET /api/admin/memes/export
 * 데이터 내보내기 (백업용)
 */
router.get('/memes/export', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      data: CONST_HOT_MEMES,
      exportedAt: new Date().toISOString(),
      total: CONST_HOT_MEMES.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '서버 오류',
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

/**
 * POST /api/admin/memes
 * 신규 밈 추가
 */
router.post('/memes', (req: Request, res: Response) => {
  try {
    const body = createMemeSchema.parse(req.body);

    // 중복 체크
    const existingMeme = CONST_HOT_MEMES.find((m) => m.id === body.id);
    if (existingMeme) {
      return res.status(409).json({
        success: false,
        message: `이미 존재하는 밈 ID입니다: ${body.id}`,
      });
    }

    // 새 밈 추가
    const newMeme: MemeData = body;
    CONST_HOT_MEMES.push(newMeme);

    res.status(201).json({
      success: true,
      message: '신규 밈 추가 완료',
      data: newMeme,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: '요청 데이터 검증 실패',
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: '서버 오류',
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

export default router;
