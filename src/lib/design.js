import { COLORS, DEFAULT_DESIGN, EXTRAS, FONTS, PATTERNS, STYLES, WHEEL_TYPES } from '../data/options.js'

export const HEX_RE = /^[0-9A-F]{6}$/

export function styleOf(id) {
  return STYLES.find((s) => s.id === id)
}

export function colorOf(part, id) {
  const list = COLORS[part]
  return list.find((c) => c.id === id) ?? list[0]
}

export function fontOf(id) {
  return FONTS.find((f) => f.id === id) ?? FONTS[0]
}

export function patternOf(id) {
  return PATTERNS.find((p) => p.id === id) ?? PATTERNS[0]
}

// 직접 입력한 6자리 색 코드가 있으면 그 색을 씀 (part: deck | wheel | truck)
export function partHexOf(d, part) {
  const hex = d[`${part}Hex`]
  return HEX_RE.test(hex ?? '') ? `#${hex}` : colorOf(part, d[part]).hex
}

export function partNameOf(d, part) {
  const hex = d[`${part}Hex`]
  return HEX_RE.test(hex ?? '') ? `#${hex}` : colorOf(part, d[part]).name
}

export function deckHexOf(d) {
  return partHexOf(d, 'deck')
}

export function deckNameOf(d) {
  return partNameOf(d, 'deck')
}

export function wheelTypeOf(d) {
  return WHEEL_TYPES.find((w) => w.id === d.wheelType) ?? WHEEL_TYPES[0]
}

export function normalizeDesign(d) {
  return { ...DEFAULT_DESIGN, ...d }
}

// 구성 문장: 카빙 · 32인치 · 블루 덱 · 블랙 바퀴 · 실버 트럭 · 체커 · 문구 "MY RIDE"
export function describe(d) {
  const parts = []
  const s = styleOf(d.style)
  if (s) parts.push(s.name)
  parts.push(`${d.length}인치`)
  parts.push(`${deckNameOf(d)} 덱`)
  const wt = wheelTypeOf(d)
  parts.push(`${partNameOf(d, 'wheel')} ${wt.id === 'solid' ? '' : `${wt.name} `}바퀴`)
  parts.push(`${partNameOf(d, 'truck')} 트럭`)
  parts.push(patternOf(d.pattern).name)
  if (d.drawing?.length) parts.push('직접 그림')
  if (d.stickers?.length) parts.push(`사진·이모지 ${d.stickers.length}개`)
  parts.push(d.phrase ? `문구 "${d.phrase}"` : '문구 없음')
  if (d.coating) parts.push('보호 코팅')
  if (d.clearGrip) parts.push('클리어 그립테이프')
  const extras = EXTRAS.filter((e) => d.extras?.includes(e.id)).map((e) => e.name)
  if (extras.length) parts.push(`추가 ${extras.join(', ')}`)
  return parts.join(' · ')
}

// 보드 이름: 블루 카빙 보드
export function boardName(d) {
  const s = styleOf(d.style)
  return s ? `${deckNameOf(d)} ${s.name} 보드` : `${deckNameOf(d)} 보드`
}

// 그림 대체 텍스트
export function topAlt(d) {
  const bits = [`${deckNameOf(d)} 덱`, `${patternOf(d.pattern).name} 무늬`]
  if (d.drawing?.length) bits.push('직접 그린 그림')
  if (d.stickers?.length) bits.push('사진·이모지')
  if (d.phrase) bits.push(`${fontOf(d.font).name} 스타일 ${d.phrase} 문구`)
  bits.push(`${partNameOf(d, 'wheel')} 바퀴`)
  return `${bits.join(', ')} 보드의 윗면`
}

export function sideAlt(d) {
  return `${deckNameOf(d)} 덱, ${partNameOf(d, 'truck')} 트럭, ${partNameOf(d, 'wheel')} ${wheelTypeOf(d).name} 바퀴 보드의 옆모습`
}

// 확인용 예시 추천 규칙 ([미정]) — site/js/app.js 1차 구현과 같음
// 키·신발로 기본 길이를 정하고, 스타일에 따라 한 단계 조정
export function recommend(height, shoe, styleId) {
  let base = 1
  if (height < 160 || shoe <= 235) base = 0
  if (height >= 180 || shoe >= 275) base = 2
  const s = styleOf(styleId)
  const idx = Math.max(0, Math.min(2, base + (s ? s.bias : 0)))
  const lens = [22, 27, 32]
  return { base: lens[base], length: lens[idx], style: s, height, shoe }
}

// 받침에 맞는 조사 (은/는)
export function eunNeun(word) {
  const code = word.charCodeAt(word.length - 1) - 0xac00
  if (code < 0 || code > 11171) return `${word}는`
  return code % 28 ? `${word}은` : `${word}는`
}

// 덱 문구에 넣을 수 없는 낱말 (욕설·비하) — 띄어쓰기·기호를 빼고 비교
const BANNED_WORDS = [
  '시발', '씨발', '씨빨', 'ㅅㅂ', 'ㅆㅂ', '병신', 'ㅂㅅ', '개새끼', '새끼', '좆', '존나', 'ㅈㄴ', '지랄', '염병', '미친놈', '미친년',
  '닥쳐', '꺼져', '엠창', '느금', '애미', '애비', '창녀', '걸레', '장애인새끼', '한남', '김치녀', '틀딱', '급식충',
  'fuck', 'shit', 'bitch', 'asshole', 'dick', 'pussy', 'cunt', 'nigger', 'nigga', 'faggot', 'retard', 'slut', 'whore',
]

export function hasBannedWord(text) {
  const t = (text ?? '').toLowerCase().replace(/[\s\p{P}\p{S}0-9_]/gu, '')
  return BANNED_WORDS.some((w) => t.includes(w))
}
