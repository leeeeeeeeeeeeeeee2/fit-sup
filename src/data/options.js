// 화면에 쓰는 선택지와 문구
// 출처: docs/html 완성 화면, docs/fitsup-design-system/tokens.json, PROJECT_CONTEXT.md

import imgSurf from '../assets/main/style-surfskate.jpg'
import imgCarving from '../assets/main/style-carving.jpg'
import imgSidewinder from '../assets/main/style-sidewinder.jpg'
import imgCruiser from '../assets/main/style-cruiser.jpg'
// 바퀴·용품 제품 사진 (docs/assets)
import imgSolidWheels from '../assets/products/solid-wheels.jpg'
import imgClearWheels from '../assets/products/clear-wheels.jpg'
import imgGraphicWheels from '../assets/products/side-graphic-wheels.jpg'
import imgWideWheels from '../assets/products/wide-wheels.jpg'
import imgHelmet from '../assets/products/helmet.jpg'
import imgPads from '../assets/products/gear-set.jpg'
import imgTool from '../assets/products/t-tool.jpg'
import imgBearings from '../assets/products/bearings.jpg'
import imgGrip from '../assets/products/grip-tape.jpg'
import imgBag from '../assets/products/carry-bag.jpg'

// 타는 스타일 (P01 S01-2, P02 S02-2)
// bias·why: 확인용 예시 추천 규칙 (site/js/app.js 1차 구현과 같음, 추천 규칙은 [미정])
export const STYLES = [
  {
    id: 'surf',
    name: '서프 스케이트',
    desc: '땅 위에서 서핑하듯 몸을 크게 흔들어(펌핑) 앞으로 나가요.',
    cta: '서프 스케이트로 시작하기',
    img: imgSurf,
    bias: 1,
    why: '몸을 크게 흔들어도 안정적이도록 한 단계 길게',
  },
  {
    id: 'carving',
    name: '카빙',
    desc: '몸을 좌우로 기울여 S자 커브를 부드럽게 그려요.',
    cta: '카빙으로 시작하기',
    img: imgCarving,
    bias: 1,
    why: '긴 커브를 편하게 그리도록 한 단계 길게',
  },
  {
    id: 'sidewinder',
    name: '사이드와인더',
    desc: '트럭(바퀴를 잡아 주는 부품)이 더 깊게 꺾여 좁은 곳에서도 짧게 돌아요.',
    cta: '사이드와인더로 시작하기',
    img: imgSidewinder,
    bias: 0,
    why: '짧은 회전에 맞게 기본 길이 그대로',
  },
  {
    id: 'cruiser',
    name: '크루저',
    desc: '동네, 캠퍼스, 역까지 가볍게 밀고 다니고 들고 다니기도 편해요.',
    cta: '크루저로 시작하기',
    img: imgCruiser,
    bias: -1,
    why: '들고 다니기 편하게 한 단계 짧게',
  },
]

// 길이 (P02 S02-2)
// price: 보드 기본 가격 (원)
export const LENGTHS = [
  { value: 22, price: 105000, strong: '가볍게 들고 다니는 짧은 이동용', desc: '작고 가벼워요. 초보자는 균형에 주의해요.' },
  { value: 27, price: 125000, strong: '이동과 재미를 함께 원한다면', desc: '휴대성과 안정성이 균형 잡힌 일상용이에요.' },
  { value: 32, price: 145000, strong: '처음 배우거나 안정감이 중요하다면', desc: '발판이 넓어 편안하고 속도를 내기 좋아요. 휴대성은 낮아요.' },
]

// 부품별 색 (tokens.json의 제품 옵션색). 판매 색상 목록은 [미정]
export const COLORS = {
  deck: [
    { id: 'mint', name: '민트', hex: '#7FD8BE' },
    { id: 'white', name: '화이트', hex: '#FFFFFF' },
    { id: 'coral', name: '코랄', hex: '#FF6F5E' },
    { id: 'blue', name: '블루', hex: '#1E3FD0' },
    { id: 'gray', name: '그레이', hex: '#9A9D96' },
    { id: 'black', name: '블랙', hex: '#111311' },
  ],
  wheel: [
    { id: 'black', name: '블랙', hex: '#111311' },
    { id: 'white', name: '화이트', hex: '#FFFFFF' },
    { id: 'gray', name: '그레이', hex: '#9A9D96' },
    { id: 'blue', name: '블루', hex: '#1E3FD0' },
    { id: 'mint', name: '민트', hex: '#7FD8BE' },
    { id: 'coral', name: '코랄', hex: '#FF6F5E' },
  ],
  truck: [{ id: 'silver', name: '실버', hex: '#B8BCC2' }],
}

// 꾸밀 부품 탭과 쉬운 설명
// 덱: 와이어프레임 문장 / 바퀴·트럭: site/js/app.js 1차 구현 문장
export const PARTS = [
  { id: 'deck', name: '덱', help: '덱은 발을 올리는 판이에요. 보드에서 가장 넓게 보이는 부분이라 분위기를 정해요.' },
  { id: 'truck', name: '트럭', help: '트럭은 덱 아래에서 바퀴를 잡아 주고, 몸을 기울이면 방향을 틀어 주는 부품이에요.' },
]

// 덱 무늬 ('직접 만들기'는 동작이 [미정]이라 목록에서 따로 그림)
export const PATTERNS = [
  { id: 'plain', name: '무지' },
  { id: 'stripe', name: '스트라이프' },
  { id: 'checker', name: '체커' },
  { id: 'flame', name: '플레임' },
]

// 문구 스타일 (보드 그림 안에서만 쓰는 글꼴)
export const FONTS = [
  { id: 'paint', name: '페인트', family: "'Permanent Marker', cursive", tileSize: 28 },
  { id: 'spray', name: '스프레이', family: "'Rubik Spray Paint', sans-serif", tileSize: 30 },
  { id: 'pen', name: '펜', family: "'Nanum Pen Script', cursive", tileSize: 34 },
  { id: 'bold', name: '두꺼운', family: "'Black Han Sans', sans-serif", tileSize: 28 },
]

// 덱 문구 최대 글자 수 (예시 12자, [미정])
export const PHRASE_MAX = 12

// 신발 사이즈 (mm) 선택지 — site/js/app.js 1차 구현과 같음
export const SHOE_SIZES = Array.from({ length: 17 }, (_, i) => 220 + i * 5)

// 처음 꾸밀 때 고른 상태 (완성 화면 P02의 선택값, 문구는 비움)
export const DEFAULT_DESIGN = {
  style: '',
  length: 27,
  deck: 'blue',
  deckHex: '',
  wheel: 'black',
  truck: 'silver',
  pattern: 'checker',
  phrase: '',
  font: 'spray',
  // 덱 무늬 '직접 만들기'로 그린 그림 (J): [{ color, width, points: [[x, y], ...] }]
  drawing: [],
  // 직접 만들기로 붙인 사진·이모지: [{ id, kind: 'image' | 'emoji', value, x, y, size, ratio }]
  stickers: [],
  // 바퀴·트럭 색 직접 입력 (6자리, 비어 있으면 견본 색)
  wheelHex: '',
  truckHex: '',
  wheelType: 'solid',
  wheelGraphic: '', // 사이드 그래픽 바퀴에 넣을 이미지 (데이터 주소)
  coating: false, // 스크래치 방지 보호 코팅
  clearGrip: false, // 상판 투명(클리어) 그립테이프
  extras: [], // 그 외 추가 상품 id 목록
}

// 직접 만들기(J) 그리기 도구 — 펜 색은 덱 색 목록에서 코랄을 뺀 색 (답변 H)
export const DRAW_COLORS = [
  { id: 'black', name: '블랙', hex: '#111311' },
  { id: 'white', name: '화이트', hex: '#FFFFFF' },
  { id: 'blue', name: '블루', hex: '#1E3FD0' },
  { id: 'mint', name: '민트', hex: '#7FD8BE' },
  { id: 'gray', name: '그레이', hex: '#9A9D96' },
]

// 펜·지우개 굵기 3단계 (덱 윗면 560×144 좌표 기준)
export const DRAW_SIZES = [
  { id: 'thin', name: '가늘게', width: 4 },
  { id: 'mid', name: '보통', width: 9 },
  { id: 'thick', name: '굵게', width: 16 },
]

// 직접 만들기에 붙일 수 있는 이모지
export const EMOJIS = ['🔥', '⭐', '💙', '🌊', '🛹', '😎', '🌈', '⚡', '🌸', '🍀', '👑', '💀', '🐱', '🍒', '✌️', '❤️']

// 바퀴 종류 (P02 바퀴 탭)
export const WHEEL_TYPES = [
  { id: 'solid', name: '솔리드', note: '기본', desc: '한 가지 색으로 꽉 찬 기본 바퀴예요.', price: 0, img: imgSolidWheels },
  { id: 'clear', name: '클리어', note: '반투명', desc: '속이 살짝 비치는 반투명 바퀴예요.', price: 8000, img: imgClearWheels },
  { id: 'graphic', name: '사이드 그래픽', note: '커스텀 인쇄', desc: '바퀴 옆면에 원하는 그래픽을 직접 넣을 수 있어요.', price: 20000, img: imgGraphicWheels },
  { id: 'wide', name: '와이드', note: '광폭 바퀴', desc: '폭이 넓어 더 안정적인 바퀴예요.', price: 10000, img: imgWideWheels },
]

// 디자인 추가 금액 — 무늬·그림·사진 선택에 따라 자동으로 붙음
export const DESIGN_PRICES = {
  twoTone: { name: '투톤 배색', price: 10000 }, // 무지 외 무늬 (단색 기본은 무료)
  print: { name: '사진 및 그래픽 프린팅', price: 35000 }, // 사진·이모지
  drawing: { name: '핸드 드로잉 (펜/마카 작업)', price: 30000 }, // 직접 그림
  combo: { name: '복합 커스텀 (사진 + 핸드 드로잉)', price: 55000 }, // 둘 다
}

// 체크해서 고르는 덱 옵션
export const DECK_OPTIONS = [
  { id: 'coating', name: '스크래치 방지 보호 코팅', price: 15000, recommended: true },
  { id: 'clearGrip', name: '상판 투명(클리어) 그립테이프 변경', price: 10000 },
]

// 그 외 추가 상품
export const EXTRAS = [
  { id: 'helmet', name: '헬멧', desc: '머리를 보호하는 기본 안전 장비예요.', price: 22000, img: imgHelmet },
  { id: 'pads', name: '보호대 세트', desc: '손목·팔꿈치·무릎을 함께 보호해요.', price: 15000, img: imgPads },
  { id: 'tool', name: '스케이트 T툴', desc: '트럭과 바퀴 나사를 조이고 풀 때 써요.', price: 5000, img: imgTool },
  { id: 'bearing', name: '베어링 세트', desc: '바퀴를 부드럽게 굴려 주는 교체용 8개입이에요.', price: 20000, img: imgBearings },
  { id: 'grip', name: '그립테이프', desc: '덱 윗면에 붙이는 여분·교체용 미끄럼 방지 테이프예요.', price: 6000, img: imgGrip },
  { id: 'bag', name: '보드 가방', desc: '보드를 넣고 메고 다니기 편해요.', price: 18000, img: imgBag },
]
