// 리뷰 페이지 (P07) — 디자인 시연용 예시 리뷰
// 출처: 리뷰 시안 20261116_172731.png (위 3개는 시안 문구 그대로)

import imgBlackBoard from '../assets/reviews/black-skateboard.jpg'
import imgCarrying from '../assets/reviews/person-carrying.jpg'
import imgRiding from '../assets/reviews/person-riding.jpg'
import imgUnboxing from '../assets/reviews/unboxing.jpg'
import imgClearWheels from '../assets/products/clear-wheels.jpg'

// 요약 숫자 (시안 그대로)
export const REVIEW_SUMMARY = {
  total: 19566,
  average: 4.9,
  photoTotal: 4812,
  dist: [
    { score: 5, pct: 88 },
    { score: 4, pct: 9 },
    { score: 3, pct: 3 },
    { score: 2, pct: 0 },
    { score: 1, pct: 0 },
  ],
}

// 사진 리뷰 줄 (시안 순서)
export const REVIEW_PHOTOS = [
  { src: imgBlackBoard, alt: '자갈길 위에 놓인 블랙 보드' },
  { src: imgCarrying, alt: '보드를 들고 걸어가는 모습' },
  { src: imgRiding, alt: '공원 길에서 보드를 타는 모습' },
  { src: imgClearWheels, alt: '민트색 클리어 바퀴' },
  { src: imgUnboxing, alt: '상자에서 꺼낸 체커 무늬 보드' },
]

// 필터 (style id는 options.js STYLES와 같음)
export const REVIEW_FILTERS = [
  { id: 'all', name: '전체' },
  { id: 'surf', name: '서프 스케이트' },
  { id: 'carving', name: '카빙' },
  { id: 'sidewinder', name: '사이드와인더' },
  { id: 'cruiser', name: '크루저' },
  { id: 'photo', name: '사진 리뷰만' },
]

export const REVIEW_SORTS = [
  { id: 'helpful', name: '도움돼요 많은순' },
  { id: 'latest', name: '최신순' },
  { id: 'high', name: '별점 높은순' },
  { id: 'low', name: '별점 낮은순' },
]

export const REVIEWS = [
  {
    id: 'r1',
    rating: 5,
    user: '보드입문**',
    date: '2026.11.12',
    style: 'cruiser',
    length: 27,
    height: 168,
    shoe: 250,
    text: '처음 사는 건데 길이랑 이런 거 쉽게 비교하니까 저한테 필요한 보드를 쉽게 구매한 것 같아요. 키랑 발 사이즈만 넣으면 길이를 바로 추천해 줘서 뭘 사야 할지 헤맬 일이 없었어요.',
    photo: imgBlackBoard,
    helpful: 412,
  },
  {
    id: 'r2',
    rating: 5,
    user: 'lee***',
    date: '2026.11.10',
    style: 'carving',
    length: 32,
    height: 181,
    shoe: 275,
    text: '다른 사람들이랑 안 겹치고 내 취향 보드 만들 수 있어서 개좋아요. 보드 타러 갔다가 어디서 샀냐고 물어봄 당했어요ㅋㅋ',
    photo: imgCarrying,
    helpful: 287,
  },
  {
    id: 'r3',
    rating: 5,
    user: '스트릿핏**',
    date: '2026.11.09',
    style: 'cruiser',
    length: 27,
    height: 176,
    shoe: 265,
    text: '제가 원하는 대로 직접 디자인할 수 있어서 너무 좋았어요.',
    helpful: 254,
  },
  // 아래는 필터 확인용으로 더한 예시
  {
    id: 'r4',
    rating: 5,
    user: '서프조아**',
    date: '2026.11.08',
    style: 'surf',
    length: 32,
    height: 172,
    shoe: 260,
    text: '펌핑할 때 보드가 길어서 안정적이에요. 추천받은 길이 그대로 샀는데 딱 맞았어요.',
    photo: imgRiding,
    helpful: 198,
  },
  {
    id: 'r5',
    rating: 5,
    user: '골목대장**',
    date: '2026.11.06',
    style: 'sidewinder',
    length: 27,
    height: 170,
    shoe: 255,
    text: '좁은 골목에서도 잘 돌아요. 바퀴 색까지 직접 고를 수 있어서 만족해요.',
    helpful: 143,
  },
  {
    id: 'r6',
    rating: 4,
    user: '언박싱러**',
    date: '2026.11.05',
    style: 'cruiser',
    length: 22,
    height: 158,
    shoe: 235,
    text: '포장이 꼼꼼하게 와서 좋았어요. 체커 무늬가 화면에서 본 그대로예요.',
    photo: imgUnboxing,
    helpful: 96,
  },
  {
    id: 'r7',
    rating: 4,
    user: '카빙연습**',
    date: '2026.11.03',
    style: 'carving',
    length: 27,
    height: 165,
    shoe: 245,
    text: '처음엔 조금 어려웠는데 금방 익숙해졌어요. 보호대 세트 같이 산 거 잘한 것 같아요.',
    helpful: 61,
  },
]
