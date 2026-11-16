// 덱 무늬 '직접 만들기'(J) 그림 도우미

// 그림 좌표 기준: 덱 윗면 크기 (DRAW_W × DRAW_H)
export const DRAW_W = 560
export const DRAW_H = 144

// 그림 한 획을 SVG 경로로 바꿈 (점 하나면 아주 짧은 선)
export function strokePath(points) {
  if (!points?.length) return ''
  const [first, ...rest] = points
  if (!rest.length) return `M${first[0]} ${first[1]}l0.01 0`
  return `M${first[0]} ${first[1]}${rest.map((p) => `L${p[0]} ${p[1]}`).join('')}`
}
