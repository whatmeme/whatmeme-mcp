/**
 * 기능 검증 테스트 스크립트
 * 각 Tool과 유틸리티 함수를 개별적으로 테스트
 */

import { findMemeByName } from './src/data/hotMemes.js';
import { checkMemeStatus } from './src/tools/checkMemeStatus.js';
import { getTrendingMemes } from './src/tools/getTrendingMemes.js';
import { recommendMemeForContext } from './src/tools/recommendMeme.js';
import { searchMemeMeaning } from './src/tools/searchMemeMeaning.js';
// import { NaverAPIClient } from './src/services/naverAPI.js'; // 주석 처리: 사용되지 않는 테스트
import { parseNaverDate, isWithinOneMonth, calculateRecentPercentage } from './src/utils/dateHelper.js';
import { cleanText } from './src/utils/textCleaner.js';

async function runTests() {
  console.log('🧪 WhatMeme MCP 서버 기능 검증 시작\n');
  console.log('='.repeat(60));

  // 테스트 1: 밈 데이터베이스 검색
  console.log('\n📋 테스트 1: 밈 데이터베이스 검색');
  console.log('-'.repeat(60));
  try {
    const meme1 = findMemeByName('럭키비키');
    console.log('✅ "럭키비키" 검색:', meme1 ? '성공' : '실패');
    if (meme1) {
      console.log(`   결과: ${meme1.name} - ${meme1.meaning}`);
    }

    const meme2 = findMemeByName('존재하지않는밈');
    console.log('✅ "존재하지않는밈" 검색:', meme2 === null ? '성공 (null 반환)' : '실패');
  } catch (error) {
    console.log('❌ 오류:', error instanceof Error ? error.message : String(error));
  }

  // 테스트 2: 텍스트 클리닝
  console.log('\n📋 테스트 2: 텍스트 클리닝');
  console.log('-'.repeat(60));
  try {
    const dirtyText = '<b>테스트</b> &amp; &lt;태그&gt; 제거';
    const cleaned = cleanText(dirtyText);
    console.log('✅ HTML 태그 제거:', cleaned);
    console.log('   원본:', dirtyText);
    console.log('   결과:', cleaned);
  } catch (error) {
    console.log('❌ 오류:', error instanceof Error ? error.message : String(error));
  }

  // 테스트 3: 날짜 파싱
  console.log('\n📋 테스트 3: 날짜 파싱 및 계산');
  console.log('-'.repeat(60));
  try {
    const date1 = parseNaverDate('20240315');
    console.log('✅ 날짜 파싱:', date1.toISOString().split('T')[0]);

    const isRecent = isWithinOneMonth(date1);
    console.log('✅ 최근 1개월 내:', isRecent);

    const postdates = ['20240315', '20240201', '20240101', '20231201'];
    const percentage = calculateRecentPercentage(postdates);
    console.log('✅ 최근 비율 계산:', percentage + '%');
  } catch (error) {
    console.log('❌ 오류:', error instanceof Error ? error.message : String(error));
  }

  // 테스트 4: 네이버 API 클라이언트
  // 주석 처리: NaverAPIClient가 src 폴더에서 실제로 사용되지 않음 (test-functions.ts에서만 import됨)
  // 실제 네이버 API 호출은 checkMemeStatus, searchMemeMeaning, recommendMemeForContext에서 직접 처리됨
  /*
  console.log('\n📋 테스트 4: 네이버 API 클라이언트');
  console.log('-'.repeat(60));
  try {
    const client = new NaverAPIClient();
    console.log('✅ 클라이언트 생성: 성공');

    // 실제 API 호출 테스트 (네트워크 필요)
    console.log('⏳ 네이버 블로그 검색 테스트 중...');
    const blogResult = await client.searchBlog('테스트', { display: 1 });
    console.log('✅ 블로그 검색:', blogResult.total > 0 ? '성공' : '결과 없음');
    console.log(`   전체 결과: ${blogResult.total}개`);

    console.log('⏳ 네이버 이미지 검색 테스트 중...');
    const imageResult = await client.searchImage('테스트', { display: 1 });
    console.log('✅ 이미지 검색:', imageResult.total > 0 ? '성공' : '결과 없음');
    console.log(`   전체 결과: ${imageResult.total}개`);
  } catch (error) {
    console.log('❌ 오류:', error instanceof Error ? error.message : String(error));
  }
  */

  // 테스트 5: get_trending_memes
  // 참고: test-manual.ts와 test-smoke.ts에서도 동일한 테스트 수행
  console.log('\n📋 테스트 5: get_trending_memes');
  console.log('-'.repeat(60));
  try {
    const result = getTrendingMemes();
    console.log('✅ 실행 성공');
    console.log('결과 미리보기:');
    console.log(result.substring(0, 200) + '...');
  } catch (error) {
    console.log('❌ 오류:', error instanceof Error ? error.message : String(error));
  }

  // 테스트 6: check_meme_status (내부 DB)
  // 참고: test-manual.ts와 test-smoke.ts에서도 동일한 테스트 수행
  console.log('\n📋 테스트 6: check_meme_status (내부 DB)');
  console.log('-'.repeat(60));
  try {
    const result = await checkMemeStatus('럭키비키');
    console.log('✅ 실행 성공');
    console.log('결과 미리보기:');
    console.log(result.substring(0, 200) + '...');
  } catch (error) {
    console.log('❌ 오류:', error instanceof Error ? error.message : String(error));
  }

  // 테스트 7: check_meme_status (네이버 검색)
  // 참고: test-manual.ts에서도 동일한 테스트 수행
  console.log('\n📋 테스트 7: check_meme_status (네이버 검색)');
  console.log('-'.repeat(60));
  try {
    const result = await checkMemeStatus('존재하지않는밈테스트');
    console.log('✅ 실행 성공');
    console.log('결과 미리보기:');
    console.log(result.substring(0, 200) + '...');
  } catch (error) {
    console.log('❌ 오류:', error instanceof Error ? error.message : String(error));
  }

  // 테스트 8: recommend_meme_for_context
  // 참고: test-manual.ts와 test-smoke.ts에서도 동일한 테스트 수행
  console.log('\n📋 테스트 8: recommend_meme_for_context');
  console.log('-'.repeat(60));
  try {
    const result = await recommendMemeForContext('퇴근하고 싶을 때');
    console.log('✅ 실행 성공');
    console.log('결과 미리보기:');
    console.log(result.substring(0, 200) + '...');
  } catch (error) {
    console.log('❌ 오류:', error instanceof Error ? error.message : String(error));
  }

  // 테스트 9: search_meme_meaning
  // 참고: test-manual.ts와 test-smoke.ts에서도 동일한 테스트 수행
  console.log('\n📋 테스트 9: search_meme_meaning');
  console.log('-'.repeat(60));
  try {
    const result = await searchMemeMeaning('중꺾마');
    console.log('✅ 실행 성공');
    console.log('결과 미리보기:');
    console.log(result.substring(0, 200) + '...');
  } catch (error) {
    console.log('❌ 오류:', error instanceof Error ? error.message : String(error));
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ 모든 테스트 완료!\n');
}

// 테스트 실행
runTests().catch((error) => {
  console.error('❌ 테스트 실행 중 오류:', error);
  process.exit(1);
});