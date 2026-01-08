/**
 * 인메모리 밈 데이터베이스
 * 핫한 밈들의 정보를 저장하는 상수 배열
 * 사전형 DB로 확장 (의미, 유래, 예시 포함)
 */

import type { MemeData } from '../types/index.js';

// 핫한 밈 목록 (확장된 스키마)
export const CONST_HOT_MEMES: MemeData[] = [
  {
    id: 'lucky-vicky',
    name: '럭키비키',
    aliases: ['럭비', 'Lucky Vicky', 'luckyvicky'],
    meaning: '운 좋은 원영, 모든 상황을 긍정적으로 해석하는 초긍정 마인드',
    origin: '아이브(IVE)의 멤버 장원영이 자신을 "럭키비키(Lucky Vicky)"라고 부르며 보여준 긍정적인 사고방식에서 유래. 나쁜 일도 긍정적으로 재해석하고, 모든 상황을 자신에게 유리하게 받아들이는 태도를 표현하는 말. "원영적 사고"라는 밈과도 연결됨.',
    examples: [
      '비가 와서 약속 취소됨 → "오늘 집에서 쉴 수 있어서 럭키비키~"',
      '시험 망침 → "이제 더 잘할 일만 남았으니 럭키비키!"',
      '늦잠 잤는데 출근 시간 지남 → "충분히 잤으니 오늘 컨디션 최고겠다 럭키비키"'
    ],
    tags: ['긍정', '마인드', '아이돌', '원영'],
    trendRank: 1,
  },
  {
    id: 'jung-geom-ma',
    name: '중꺾마',
    aliases: ['중꺽마', '중꺼마', '중간에 꺾이지 않는 마음'],
    meaning: '중간에 꺾이지 않는 마음, 포기하지 않고 끝까지 밀고 나가는 의지',
    origin: '2022년 리그 오브 레전드(LOL) e스포츠에서 유래된 표현. "중간에 꺾이지 않는 마음"의 줄임말로, 힘든 상황에서도 포기하지 않고 끝까지 버티는 의지를 표현. 포기하고 싶을 때 떠올려야 할 응원의 메시지로 쓰임.',
    examples: [
      '시험 기간 중 → "중꺾마! 조금만 더 하면 끝이야"',
      '헬스장 가기 싫을 때 → "중꺾마! 가기만 하면 됐어"',
      '프로젝트 마감 전 → "중꺾마로 버티자!"'
    ],
    tags: ['동기부여', 'e스포츠', '포기하지않기'],
    trendRank: 2,
  },
  {
    id: 'tiramisu-cake',
    name: '티라미수 케익',
    aliases: ['티라미수', '띠라띠라 미친미친', 'tiramisu'],
    meaning: '띠라띠라 미친미친, 신나거나 흥분된 상태를 표현',
    origin: '티라미수 케익을 말하면서 "띠라띠라 미친미친"이라고 발음하는 것에서 유래. 말이 안 되게 신나거나 흥분된 상태를 표현하는 밈. 유튜브나 SNS에서 자주 사용됨.',
    examples: [
      '주말이라 신날 때 → "오늘 티라미수 케익!"',
      '친구들과 놀 때 → "티라미수 케익 모드 온!"',
      '기분 좋을 때 → "띠라띠라 미친미친 상태"'
    ],
    tags: ['신남', '흥분', '유쾌'],
    trendRank: 3,
  },
  {
    id: 'frozen-hangang',
    name: '꽁꽁 얼어붙은 한강',
    aliases: ['얼어붙은 한강', '꽁꽁 얼어', '한강 얼음'],
    meaning: '춥거나 경직된 분위기, 냉랭한 상황을 표현',
    origin: '한강이 꽁꽁 얼어붙은 것처럼 차갑고 경직된 분위기를 표현하는 밈. 대화가 안 풀리거나 분위기가 냉랭할 때 사용. 겨울철 한강이 얼어붙은 것에서 비유.',
    examples: [
      '대화가 안 풀릴 때 → "지금 분위기 꽁꽁 얼어붙은 한강 수준"',
      '회의실 분위기가 어색할 때 → "한강 얼음 같아"',
      '차가운 반응 받을 때 → "꽁꽁 얼어붙은 한강 같다"'
    ],
    tags: ['추위', '분위기', '냉랭'],
    trendRank: 4,
  },
  {
    id: 'hell-chang',
    name: '헬창',
    aliases: ['헬스장 중독', '운동 중독자', '헬스 마니아'],
    meaning: '헬스장에 빠져 사는 사람, 운동 열정러',
    origin: '헬스장(Health) + 중독(Addict)의 합성어. 헬스장에 자주 가고 운동을 열정적으로 하는 사람을 지칭. 운동에 빠져 살아가는 사람들의 라이프스타일을 표현하는 밈.',
    examples: [
      '헬스장 가는 게 일상 → "나 완전 헬창됐어"',
      '운동 빼먹으면 불안할 때 → "헬창의 삶"',
      '근육 자랑할 때 → "헬창 인증"'
    ],
    tags: ['헬스', '운동', '건강'],
    trendRank: 5,
  },
  {
    id: 'pelvic-dance',
    name: '골반춤',
    aliases: ['골반춤 밈', '힙댄스', 'pelvic dance', '힙춤'],
    meaning: '골반을 움직이며 추는 춤, 특히 K-pop 아이돌의 안무나 짧은 영상 밈에서 유래',
    origin: 'K-pop 아이돌의 안무에서 골반을 흔드는 동작이 강조되면서 시작된 밈. 특히 유튜브 쇼츠나 틱톡에서 짧은 영상으로 유행. 골반을 움직이는 춤 동작 자체와 그 영상을 따라 하는 밈이 모두 인기.',
    examples: [
      '춤 안무 따라할 때 → "골반춤 한 번 해볼까?"',
      '짧은 영상 만들 때 → "골반춤 밈으로 하나 올릴까?"',
      '유행 안무 언급 → "골반춤 진짜 중독적이야"'
    ],
    tags: ['트렌드', '춤', 'K-pop', '영상'],
    trendRank: 6,
  },
  {
    id: 'eojjeol-tv',
    name: '어쩔티비',
    aliases: ['어쩔', '티비', 'eojjeol', '어쩔 수 없지'],
    meaning: '어쩔 수 없다는 뜻의 말장난, "어쩔 수 없지"를 "어쩔 티비(Television)"로 바꿔 말하는 밈',
    origin: '"어쩔 수 없지"를 말장난처럼 "어쩔 티비"로 바꿔 말하면서 시작된 밈. "안 물어봤는데?"라는 반응에는 "안물티비"라는 대답으로 이어지는 말장난 체인. 10대~20대 사이에서 유행.',
    examples: [
      '할 수 없다고 할 때 → "어쩔티비~"',
      '반응 요구할 때 → "안 물어봤는데?" "안물티비~"',
      '말장난 할 때 → "어쩔티비 안물티비 뇌절티비"'
    ],
    tags: ['트렌드', '말장난', '10대'],
    trendRank: 7,
  },
];

/**
 * 밈 이름으로 검색 (대소문자 무시)
 * @param keyword 검색할 밈 이름
 * @returns 찾은 밈 데이터 또는 null
 */
export function findMemeByName(keyword: string): MemeData | null {
  const normalizedKeyword = keyword.toLowerCase().trim();
  return CONST_HOT_MEMES.find(
    meme => meme.name.toLowerCase() === normalizedKeyword
  ) || null;
}

/**
 * 별칭(aliases) 포함하여 검색
 * @param keyword 검색할 키워드
 * @returns 찾은 밈 데이터 또는 null
 */
export function findMemeByKeyword(keyword: string): MemeData | null {
  const normalizedKeyword = keyword.toLowerCase().trim();
  
  // 1. name 정확 일치
  const exactMatch = CONST_HOT_MEMES.find(
    meme => meme.name.toLowerCase() === normalizedKeyword
  );
  if (exactMatch) return exactMatch;
  
  // 2. aliases 정확 일치
  const aliasMatch = CONST_HOT_MEMES.find(
    meme => meme.aliases.some(alias => alias.toLowerCase() === normalizedKeyword)
  );
  if (aliasMatch) return aliasMatch;
  
  // 3. name 포함 (키워드 길이 >= 2일 때만)
  if (normalizedKeyword.length >= 2) {
    const nameContains = CONST_HOT_MEMES.find(
      meme => meme.name.toLowerCase().includes(normalizedKeyword)
    );
    if (nameContains) return nameContains;
    
    // 4. aliases 포함
    const aliasContains = CONST_HOT_MEMES.find(
      meme => meme.aliases.some(alias => alias.toLowerCase().includes(normalizedKeyword))
    );
    if (aliasContains) return aliasContains;
  }
  
  return null;
}

/**
 * 트렌딩 순위대로 정렬된 밈 목록 반환
 * @param limit 반환할 개수 (기본: 전체)
 * @returns 정렬된 밈 배열
 */
export function getTrendingMemesList(limit?: number): MemeData[] {
  const sorted = [...CONST_HOT_MEMES].sort((a, b) => a.trendRank - b.trendRank);
  return limit ? sorted.slice(0, limit) : sorted;
}