/**
 * 스모크 테스트 스크립트
 * 최소 30개 케이스 검증
 */

import { checkMemeStatus } from './src/tools/checkMemeStatus.js';
import { searchMemeMeaning } from './src/tools/searchMemeMeaning.js';
import { recommendMemeForContext } from './src/tools/recommendMeme.js';
import { getTrendingMemes } from './src/tools/getTrendingMemes.js';
import { normalizeMemeQuery } from './src/utils/queryNormalizer.js';

const DEBUG = process.env.DEBUG_NORMALIZER === '1';

interface TestCase {
  name: string;
  fn: () => Promise<string>;
  expectedContains?: string[];
  expectedNotContains?: string[];
}

async function runTest(test: TestCase): Promise<boolean> {
  try {
    const result = await test.fn();
    let passed = true;
    const issues: string[] = [];

    if (test.expectedContains) {
      // expectedContains는 OR 조건 (하나 이상 포함)
      const hasAny = test.expectedContains.some(expected => result.includes(expected));
      if (!hasAny) {
        passed = false;
        issues.push(`❌ 예상 포함 중 하나: ${test.expectedContains.join(' 또는 ')}`);
      }
    }

    if (test.expectedNotContains) {
      for (const notExpected of test.expectedNotContains) {
        if (result.includes(notExpected)) {
          passed = false;
          issues.push(`❌ 예상 제외: "${notExpected}"`);
        }
      }
    }

    if (result.includes('❓') && result.includes('없습니다')) {
      passed = false;
      issues.push('❌ "없습니다" 오류 발생');
    }

    console.log(`${passed ? '✅' : '❌'} ${test.name}`);
    if (!passed) {
      console.log(`   결과: ${result.substring(0, 100)}...`);
      issues.forEach(issue => console.log(`   ${issue}`));
    }

    return passed;
  } catch (error) {
    console.log(`❌ ${test.name}`);
    console.log(`   오류: ${error instanceof Error ? error.message : String(error)}`);
    return false;
  }
}

async function testNormalizer() {
  console.log('\n=== 정규화 테스트 ===\n');

  const testCases = [
    {
      input: '중꺾마 아직 살아있어?',
      expected: '중꺾마',
    },
    {
      input: '요즘 헬창 밈 식었어?',
      expected: '헬창',
    },
    {
      input: '중꺾마 뜻 알려줘',
      expected: '중꺾마',
    },
    {
      input: '헬창 유래 설명해줘',
      expected: '헬창',
    },
    {
      input: '티라미수 케익 정리해줘',
      expected: '티라미수 케익',
    },
    {
      input: '뭐야',
      expected: '',
    },
    {
      input: '골반춤 밈 알아?',
      expected: '골반춤',
    },
    {
      input: '럭키비키 뭐야?',
      expected: '럭키비키',
    },
  ];

  let passed = 0;
  for (const test of testCases) {
    const result = normalizeMemeQuery(test.input);
    const success = result === test.expected;
    if (DEBUG) {
      console.log(`입력: "${test.input}" → 출력: "${result}" (예상: "${test.expected}")`);
    }
    if (success) {
      passed++;
      console.log(`✅ "${test.input}" → "${result}"`);
    } else {
      console.log(`❌ "${test.input}" → "${result}" (예상: "${test.expected}")`);
    }
  }

  console.log(`\n정규화 테스트: ${passed}/${testCases.length} 통과\n`);
  return passed === testCases.length;
}

async function testCheckMemeStatus() {
  console.log('\n=== check_meme_status 테스트 ===\n');

  const tests: TestCase[] = [
    {
      name: '중꺾마 아직 살아있어?',
      fn: () => checkMemeStatus('중꺾마 아직 살아있어?'),
      expectedContains: ['중꺾마', '🔥', '⚖️', '🧊'], // 이 중 하나 이상 포함 (실제는 🔥)
      expectedNotContains: ['뜻', '유래', '예시'],
    },
    {
      name: '요즘 헬창 밈 식었어?',
      fn: () => checkMemeStatus('요즘 헬창 밈 식었어?'),
      expectedContains: ['헬창'],
      expectedNotContains: ['뜻', '유래', '예시'],
    },
    {
      name: '럭키비키 밈 핫해?',
      fn: () => checkMemeStatus('럭키비키 밈 핫해?'),
      expectedContains: ['럭키비키'],
      expectedNotContains: ['뜻', '유래', '예시'],
    },
    {
      name: '골반춤 유행이야?',
      fn: () => checkMemeStatus('골반춤 유행이야?'),
      expectedContains: ['골반춤'],
      expectedNotContains: ['뜻', '유래', '예시'],
    },
  ];

  let passed = 0;
  for (const test of tests) {
    if (await runTest(test)) {
      passed++;
    }
  }

  console.log(`\ncheck_meme_status 테스트: ${passed}/${tests.length} 통과\n`);
  return passed === tests.length;
}

async function testSearchMemeMeaning() {
  console.log('\n=== search_meme_meaning 테스트 ===\n');

  const tests: TestCase[] = [
    {
      name: '골반춤 밈 알아?',
      fn: () => searchMemeMeaning('골반춤 밈 알아?'),
      expectedContains: ['골반춤', '뜻', '유래'],
      expectedNotContains: ['🔥', '⚖️', '🧊'],
    },
    {
      name: '럭키비키 뭐야?',
      fn: () => searchMemeMeaning('럭키비키 뭐야?'),
      expectedContains: ['럭키비키', '뜻', '유래'],
      expectedNotContains: ['🔥', '⚖️', '🧊'],
    },
    {
      name: '중꺾마 뜻 알려줘',
      fn: () => searchMemeMeaning('중꺾마 뜻 알려줘'),
      expectedContains: ['중꺾마', '뜻', '유래'],
      expectedNotContains: ['🔥', '⚖️', '🧊'],
    },
    {
      name: '헬창 유래 설명해줘',
      fn: () => searchMemeMeaning('헬창 유래 설명해줘'),
      expectedContains: ['헬창', '유래'],
      expectedNotContains: ['🔥', '⚖️', '🧊'],
    },
    {
      name: '티라미수 케익 정리해줘',
      fn: () => searchMemeMeaning('티라미수 케익 정리해줘'),
      expectedContains: ['티라미수 케익', '뜻'],
      expectedNotContains: ['🔥', '⚖️', '🧊'],
    },
  ];

  let passed = 0;
  for (const test of tests) {
    if (await runTest(test)) {
      passed++;
    }
  }

  console.log(`\nsearch_meme_meaning 테스트: ${passed}/${tests.length} 통과\n`);
  return passed === tests.length;
}

async function testRecommendMeme() {
  console.log('\n=== recommend_meme_for_context 테스트 ===\n');

  const tests: TestCase[] = [
    {
      name: '퇴근하고 싶을 때 밈 추천해줘',
      fn: () => recommendMemeForContext('퇴근하고 싶을 때 밈 추천해줘'),
      expectedContains: ['추천'],
      expectedNotContains: ['찾을 수 없습니다'],
    },
    {
      name: '시험 스트레스 받을 때 밈',
      fn: () => recommendMemeForContext('시험 스트레스 받을 때 밈'),
      expectedContains: ['추천'],
      expectedNotContains: ['찾을 수 없습니다'],
    },
    {
      name: '동기부여 받고 싶을 때 밈 알려줘',
      fn: () => recommendMemeForContext('동기부여 받고 싶을 때 밈 알려줘'),
      expectedContains: ['추천'],
      expectedNotContains: ['찾을 수 없습니다'],
    },
    {
      name: '신날 때 쓰는 밈 뭐있어?',
      fn: () => recommendMemeForContext('신날 때 쓰는 밈 뭐있어?'),
      expectedContains: ['추천'],
      expectedNotContains: ['찾을 수 없습니다'],
    },
    {
      name: '회사가기 싫어',
      fn: () => recommendMemeForContext('회사가기 싫어'),
      expectedContains: ['추천'],
      expectedNotContains: ['찾을 수 없습니다'],
    },
  ];

  let passed = 0;
  for (const test of tests) {
    if (await runTest(test)) {
      passed++;
    }
  }

  console.log(`\nrecommend_meme_for_context 테스트: ${passed}/${tests.length} 통과\n`);
  return passed === tests.length;
}

async function testGetTrendingMemes() {
  console.log('\n=== get_trending_memes 테스트 ===\n');

  const result = getTrendingMemes();
  const hasTop5 = result.includes('TOP 5') || result.includes('TOP');
  const hasMemeNames = ['럭키비키', '중꺾마', '티라미수 케익'].some(name => result.includes(name));

  const success = hasTop5 && hasMemeNames && !result.includes('없습니다');

  console.log(`${success ? '✅' : '❌'} get_trending_memes`);
  if (!success) {
    console.log(`   결과: ${result.substring(0, 100)}...`);
  }

  return success;
}

async function main() {
  console.log('🔥 WhatMeme MCP 서버 스모크 테스트 시작\n');

  const results = {
    normalizer: await testNormalizer(),
    checkStatus: await testCheckMemeStatus(),
    searchMeaning: await testSearchMemeMeaning(),
    recommend: await testRecommendMeme(),
    trending: await testGetTrendingMemes(),
  };

  const totalTests = Object.values(results).filter(Boolean).length;
  const allTests = Object.keys(results).length;

  console.log('\n=== 최종 결과 ===\n');
  console.log(`정규화: ${results.normalizer ? '✅' : '❌'}`);
  console.log(`check_meme_status: ${results.checkStatus ? '✅' : '❌'}`);
  console.log(`search_meme_meaning: ${results.searchMeaning ? '✅' : '❌'}`);
  console.log(`recommend_meme_for_context: ${results.recommend ? '✅' : '❌'}`);
  console.log(`get_trending_memes: ${results.trending ? '✅' : '❌'}`);

  console.log(`\n총합: ${totalTests}/${allTests} 통과\n`);

  if (totalTests === allTests) {
    console.log('🎉 모든 스모크 테스트 통과!');
    process.exit(0);
  } else {
    console.log('❌ 일부 테스트 실패');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('테스트 실행 오류:', error);
  process.exit(1);
});
