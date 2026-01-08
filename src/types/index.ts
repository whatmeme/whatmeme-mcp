/**
 * WhatMeme MCP Server - TypeScript 타입 정의
 */

// 밈 데이터 구조
export interface MemeData {
  name: string;
  desc: string;
  tags: string[];
}

// 네이버 블로그 검색 결과
export interface NaverBlogItem {
  title: string;
  link: string;
  description: string;
  bloggername: string;
  bloggerlink: string;
  postdate: string;
}

// 네이버 블로그 검색 응답
export interface NaverBlogResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NaverBlogItem[];
}

// 네이버 이미지 검색 결과
export interface NaverImageItem {
  title: string;
  link: string;
  thumbnail: string;
  sizeheight: string;
  sizewidth: string;
}

// 네이버 이미지 검색 응답
export interface NaverImageResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NaverImageItem[];
}

// 네이버 API 검색 옵션
export interface BlogSearchOptions {
  display?: number;
  sort?: 'sim' | 'date';
}

export interface ImageSearchOptions {
  display?: number;
}