/**
 * WhatMeme MCP 서버 직접 테스트 스크립트
 * 각 Tool 함수를 개별적으로 테스트
 */

import { checkMemeStatus } from './src/tools/checkMemeStatus.js';
import { getTrendingMemes } from './src/tools/getTrendingMemes.js';
import { recommendMemeForContext } from './src/tools/recommendMeme.js';
import { searchMemeMeaning } from './src/tools/searchMemeMeaning.js';

async function testAll() {
  console.log('='.repeat(60));
  console.log('🧪 WhatMeme MCP 서버 직접 테스트\n');

  // 테스트 1: get_trending_memes
  console.log('📋 테스트 1: get_trending_memes');
  console.log('-'.repeat(60));
  try {
    const result1 = getTrendingMemes();
    console.log(result1);
    console.log('\n✅ 성공!\n');
  } catch (error) {
    console.log('❌ 오류:', error);
    console.log('');
  }

  // 잠시 대기 (API 호출 간격 조절)
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 테스트 2: check_meme_status (내부 DB)
  console.log('📋 테스트 2: check_meme_status - 내부 DB');
  console.log('-'.repeat(60));
  try {
    const result2 = await checkMemeStatus('럭키비키');
    console.log(result2);
    console.log('\n✅ 성공!\n');
  } catch (error) {
    console.log('❌ 오류:', error);
    console.log('');
  }

  // 잠시 대기
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 테스트 3: check_meme_status (네이버 검색)
  console.log('📋 테스트 3: check_meme_status - 네이버 검색');
  console.log('-'.repeat(60));
  console.log('⏳ 네이버 API 호출 중... (최대 10초 소요)');
  try {
    const result3 = await checkMemeStatus('새로운밈테스트');
    console.log(result3);
    console.log('\n✅ 성공!\n');
  } catch (error) {
    console.log('❌ 오류:', error instanceof Error ? error.message : String(error));
    console.log('');
  }

  // 잠시 대기
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 테스트 4: recommend_meme_for_context
  console.log('📋 테스트 4: recommend_meme_for_context');
  console.log('-'.repeat(60));
  console.log('⏳ 네이버 이미지 검색 API 호출 중... (최대 10초 소요)');
  try {
    const result4 = await recommendMemeForContext('퇴근하고 싶을 때');
    console.log(result4);
    console.log('\n✅ 성공!\n');
  } catch (error) {
    console.log('❌ 오류:', error instanceof Error ? error.message : String(error));
    console.log('');
  }

  // 잠시 대기
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 테스트 5: search_meme_meaning
  console.log('📋 테스트 5: search_meme_meaning');
  console.log('-'.repeat(60));
  console.log('⏳ 네이버 블로그 검색 API 호출 중... (최대 10초 소요)');
  try {
    const result5 = await searchMemeMeaning('중꺾마');
    console.log(result5);
    console.log('\n✅ 성공!\n');
  } catch (error) {
    console.log('❌ 오류:', error instanceof Error ? error.message : String(error));
    console.log('');
  }

  console.log('='.repeat(60));
  console.log('✅ 모든 테스트 완료!');
}

// 테스트 실행
testAll().catch((error) => {
  console.error('❌ 테스트 실행 중 오류:', error);
  process.exit(1);
});