// 리뷰 페이지 (P07) — 디자인 시연용 예시 리뷰
// 출처: 리뷰 시안 20261116_172731.png · 20261116_172753.png (7개 모두 시안 문구 그대로)

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
  {
    id: 'r4',
    rating: 5,
    user: '주말라이더',
    date: '2026.11.08',
    style: 'sidewinder',
    length: 27,
    height: 174,
    shoe: 265,
    text: '단단하고 구성이 너무 좋아요. T툴이랑 헬멧까지 같이 담았더니 따로 안 사도 돼서 편했고, 골목에서 짧게 도는 것도 생각보다 쉬웠어요.',
    helpful: 196,
  },
  {
    id: 'r5',
    rating: 4,
    user: 'kim***',
    date: '2026.11.05',
    style: 'surf',
    length: 32,
    height: 177,
    shoe: 270,
    text: '펌핑할 때 보드가 몸을 잘 따라와요. 바퀴 색 고르는 게 제일 재밌었고, 미리보기랑 실물이 똑같아서 너무 만족해요.',
    photo: imgRiding,
    helpful: 143,
  },
  {
    id: 'r6',
    rating: 5,
    user: '민트바퀴',
    date: '2026.11.03',
    style: 'cruiser',
    length: 22,
    height: 160,
    shoe: 235,
    text: '클리어 바퀴를 민트로 했는데 실물이 더 예뻐요. 작아서 버스 탈 때 들고 다니기도 편해요.',
    photo: imgClearWheels,
    helpful: 98,
  },
  {
    id: 'r7',
    rating: 5,
    user: '출퇴근보더',
    date: '2026.11.01',
    style: 'cruiser',
    length: 27,
    height: 171,
    shoe: 260,
    text: '만들다가 내 디자인에 저장해 두고 며칠 고민했는데, 다시 열어서 이어서 꾸밀 수 있어서 좋았어요. 결국 처음 고른 색으로 주문함ㅋㅋ',
    photo: imgUnboxing,
    helpful: 61,
  },
]
