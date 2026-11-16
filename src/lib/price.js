import { DECK_OPTIONS, DESIGN_PRICES, EXTRAS, LENGTHS, WHEEL_TYPES } from '../data/options.js'

export function won(n) {
  return `${n.toLocaleString('ko-KR')}원`
}

export function plusWon(n) {
  return n ? `+${won(n)}` : '무료'
}

// 디자인에 따라 자동으로 붙는 금액 (사진+그림이면 복합 커스텀 한 가지로)
function designLine(d) {
  const photo = d.stickers?.length > 0
  const drawn = d.drawing?.length > 0
  if (photo && drawn) return DESIGN_PRICES.combo
  if (photo) return DESIGN_PRICES.print
  if (drawn) return DESIGN_PRICES.drawing
  return null
}

// 가격 내역: [{ label, amount }] + 합계
export function priceOf(d) {
  const len = LENGTHS.find((l) => l.value === d.length) ?? LENGTHS[1]
  const lines = [{ label: `보드 ${len.value}인치`, amount: len.price }]

  if (d.pattern && d.pattern !== 'plain') lines.push({ label: DESIGN_PRICES.twoTone.name, amount: DESIGN_PRICES.twoTone.price })
  const custom = designLine(d)
  if (custom) lines.push({ label: custom.name, amount: custom.price })

  const wheel = WHEEL_TYPES.find((w) => w.id === d.wheelType)
  if (wheel?.price) lines.push({ label: `바퀴 ${wheel.name}`, amount: wheel.price })

  for (const o of DECK_OPTIONS) if (d[o.id]) lines.push({ label: o.name, amount: o.price })
  for (const e of EXTRAS) if (d.extras?.includes(e.id)) lines.push({ label: e.name, amount: e.price })

  return { lines, total: lines.reduce((sum, l) => sum + l.amount, 0) }
}

export function cartTotal(cart) {
  return cart.reduce((sum, it) => sum + priceOf(it.design).total, 0)
}
