/**
 * 네이버 검색 API 클라이언트
 * 블로그 및 이미지 검색 기능 제공
 */

import axios, { type AxiosInstance } from 'axios';
import { env } from '../config/env.js';
import type {
  NaverBlogResponse,
  NaverImageResponse,
  BlogSearchOptions,
  ImageSearchOptions,
} from '../types/index.js';

export class NaverAPIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'https://openapi.naver.com/v1/search',
      headers: {
        'X-Naver-Client-Id': env.NAVER_CLIENT_ID,
        'X-Naver-Client-Secret': env.NAVER_CLIENT_SECRET,
      },
      timeout: 10000, // 10초 타임아웃
    });
  }

  /**
   * 네이버 블로그 검색
   * @param query 검색어
   * @param options 검색 옵션 (display, sort)
   * @returns 블로그 검색 결과
   */
  async searchBlog(
    query: string,
    options: BlogSearchOptions = {}
  ): Promise<NaverBlogResponse> {
    try {
      const { display = 10, sort = 'sim' } = options;
      
      const response = await this.client.get<NaverBlogResponse>('/blog.json', {
        params: {
          query,
          display,
          sort,
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.errorMessage || error.message;
        throw new Error(`네이버 블로그 검색 실패: ${message}`);
      }
      throw new Error(`네이버 블로그 검색 실패: ${String(error)}`);
    }
  }

  /**
   * 네이버 이미지 검색
   * @param query 검색어
   * @param options 검색 옵션 (display)
   * @returns 이미지 검색 결과
   */
  async searchImage(
    query: string,
    options: ImageSearchOptions = {}
  ): Promise<NaverImageResponse> {
    try {
      const { display = 10 } = options;

      const response = await this.client.get<NaverImageResponse>('/image.json', {
        params: {
          query,
          display,
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.errorMessage || error.message;
        throw new Error(`네이버 이미지 검색 실패: ${message}`);
      }
      throw new Error(`네이버 이미지 검색 실패: ${String(error)}`);
    }
  }
}