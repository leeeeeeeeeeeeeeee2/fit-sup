import { COLORS, DEFAULT_DESIGN, FONTS, PATTERNS, STYLES } from '../data/options.js'

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

// 직접 입력한 6자리 색 코드가 있으면 그 색을 씀
export function deckHexOf(d) {
  return HEX_RE.test(d.deckHex) ? `#${d.deckHex}` : colorOf('deck', d.deck).hex
}

export function deckNameOf(d) {
  return HEX_RE.test(d.deckHex) ? `#${d.deckHex}` : colorOf('deck', d.deck).name
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
  parts.push(`${colorOf('wheel', d.wheel).name} 바퀴`)
  parts.push(`${colorOf('truck', d.truck).name} 트럭`)
  parts.push(patternOf(d.pattern).name)
  if (d.drawing?.length) parts.push('직접 그림')
  parts.push(d.phrase ? `문구 "${d.phrase}"` : '문구 없음')
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
  if (d.phrase) bits.push(`${fontOf(d.font).name} 스타일 ${d.phrase} 문구`)
  bits.push(`${colorOf('wheel', d.wheel).name} 바퀴`)
  return `${bits.join(', ')} 보드의 윗면`
}

export function sideAlt(d) {
  return `${deckNameOf(d)} 덱, ${colorOf('truck', d.truck).name} 트럭, ${colorOf('wheel', d.wheel).name} 바퀴 보드의 옆모습`
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
