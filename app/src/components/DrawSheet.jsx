import { useEffect, useRef, useState } from 'react'
import { DRAW_COLORS, DRAW_SIZES } from '../data/options.js'
import { DRAW_H, DRAW_W, strokePath } from '../lib/drawing.js'
import { DeckCanvasBase } from './Board.jsx'

// 화면 좌표 → 덱 그림 좌표 (소수점 1자리)
function toDeckPoint(svg, e) {
  const pt = svg.createSVGPoint()
  pt.x = e.clientX
  pt.y = e.clientY
  const p = pt.matrixTransform(svg.getScreenCTM().inverse())
  return [Math.round(p.x * 10) / 10, Math.round(p.y * 10) / 10]
}

// 지우개가 닿은 획인지 (획의 점 중 하나라도 반경 안에 있으면)
function hits(stroke, [x, y], radius) {
  const r = radius + stroke.width / 2
  return stroke.points.some(([px, py]) => (px - x) ** 2 + (py - y) ** 2 <= r * r)
}

/**
 * 덱 무늬 '직접 만들기' 그리기 창 (J)
 * - 데스크톱: 가운데 창 / 1023px 이하: 아래에서 올라오는 시트 (mobile.css의 .dialog 규칙)
 * - 도구: 펜 색, 굵기 3단계, 지우개(닿은 획을 지움), 되돌리기, 전체 지우기
 * - 완료를 누르면 디자인의 drawing에 저장 → 미리보기·장바구니·내 디자인·이미지 저장에 함께 보임
 */
export default function DrawSheet({ design, onApply, onClose }) {
  const [strokes, setStrokes] = useState(() => design.drawing ?? [])
  const [history, setHistory] = useState([])
  const [tool, setTool] = useState('pen')
  const [color, setColor] = useState(DRAW_COLORS[0].hex)
  const [size, setSize] = useState(DRAW_SIZES[1].width)
  const svgRef = useRef(null)
  const drawingRef = useRef(null) // { erased: boolean } | { index: number }
  const firstRef = useRef(null)

  useEffect(() => {
    firstRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  // 손가락을 움직이는 동안 최신 선 목록 (state 갱신을 기다리지 않음)
  const strokesRef = useRef(strokes)
  const commit = (next) => {
    strokesRef.current = next
    setStrokes(next)
  }
  const remember = (prev) => setHistory((h) => [...h, prev])

  const eraseAt = (pt) => {
    const prev = strokesRef.current
    const next = prev.filter((s) => !hits(s, pt, size / 2 + 6))
    if (next.length === prev.length) return
    if (!drawingRef.current.erased) {
      drawingRef.current.erased = true
      remember(prev)
    }
    commit(next)
  }

  const onPointerDown = (e) => {
    const svg = svgRef.current
    if (!svg) return
    e.preventDefault()
    svg.setPointerCapture?.(e.pointerId)
    const pt = toDeckPoint(svg, e)
    if (tool === 'eraser') {
      drawingRef.current = { erased: false }
      eraseAt(pt)
      return
    }
    const prev = strokesRef.current
    remember(prev)
    drawingRef.current = { index: prev.length }
    commit([...prev, { color, width: size, points: [pt] }])
  }

  const onPointerMove = (e) => {
    if (!drawingRef.current || !svgRef.current) return
    const pt = toDeckPoint(svgRef.current, e)
    if (tool === 'eraser') {
      eraseAt(pt)
      return
    }
    const prev = strokesRef.current
    const { index } = drawingRef.current
    const s = prev[index]
    if (!s) return
    const [lx, ly] = s.points[s.points.length - 1]
    if ((lx - pt[0]) ** 2 + (ly - pt[1]) ** 2 < 2.25) return // 1.5px보다 가까운 점은 건너뜀
    const next = prev.slice()
    next[index] = { ...s, points: [...s.points, pt] }
    commit(next)
  }

  const onPointerEnd = () => {
    drawingRef.current = null
  }

  const undo = () => {
    if (!history.length) return
    commit(history[history.length - 1])
    setHistory((h) => h.slice(0, -1))
  }

  const clearAll = () => {
    if (!strokesRef.current.length) return
    remember(strokesRef.current)
    commit([])
  }

  return (
    <div className="scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby="draw-title" className="dialog draw-sheet">
        <h2 id="draw-title" className="dialog__title">
          덱에 직접 그리기
        </h2>
        <p className="dialog__help">손가락이나 마우스로 덱 위에 그려 보세요. 덱 바깥은 그려지지 않아요.</p>

        <div className="draw-canvas">
          <svg
            ref={svgRef}
            viewBox={`-6 -6 ${DRAW_W + 12} ${DRAW_H + 12}`}
            width="100%"
            role="img"
            aria-label={`그리기 칸, 지금 ${strokes.length}개의 선`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
            onLostPointerCapture={onPointerEnd}
          >
            <DeckCanvasBase design={design} />
            <defs>
              <clipPath id="draw-sheet-clip">
                <rect x="0" y="0" width={DRAW_W} height={DRAW_H} rx={DRAW_H / 2} />
              </clipPath>
            </defs>
            <g clipPath="url(#draw-sheet-clip)">
              {strokes.map((s, i) => (
                <path
                  key={i}
                  d={strokePath(s.points)}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={s.width}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
            </g>
          </svg>
        </div>

        <div className="draw-tools">
          <div role="group" aria-label="도구" className="draw-tools__row">
            <button
              ref={firstRef}
              type="button"
              aria-pressed={tool === 'pen'}
              className={`draw-chip${tool === 'pen' ? ' is-on' : ''}`}
              onClick={() => setTool('pen')}
            >
              펜
            </button>
            <button
              type="button"
              aria-pressed={tool === 'eraser'}
              className={`draw-chip${tool === 'eraser' ? ' is-on' : ''}`}
              onClick={() => setTool('eraser')}
            >
              지우개
            </button>
            <span className="draw-tools__gap" />
            <button type="button" className="draw-chip" onClick={undo} disabled={!history.length}>
              되돌리기
            </button>
            <button type="button" className="draw-chip" onClick={clearAll} disabled={!strokes.length}>
              전체 지우기
            </button>
          </div>

          <div role="group" aria-label="펜 색" className="draw-tools__row">
            {DRAW_COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={color === c.hex}
                aria-label={`펜 색 ${c.name}`}
                className={`draw-color${color === c.hex ? ' is-on' : ''}`}
                disabled={tool === 'eraser'}
                onClick={() => setColor(c.hex)}
              >
                <span style={{ background: c.hex }} />
              </button>
            ))}
          </div>

          <div role="group" aria-label="굵기" className="draw-tools__row">
            {DRAW_SIZES.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-pressed={size === s.width}
                className={`draw-chip draw-size${size === s.width ? ' is-on' : ''}`}
                onClick={() => setSize(s.width)}
              >
                <span aria-hidden="true" className="draw-size__dot" style={{ width: s.width + 2, height: s.width + 2 }} />
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div className="dialog__actions">
          <button type="button" className="btn-text" onClick={onClose}>
            취소
          </button>
          <button type="button" className="btn btn--md" onClick={() => onApply(strokes)}>
            완료
          </button>
        </div>
      </div>
    </div>
  )
}
