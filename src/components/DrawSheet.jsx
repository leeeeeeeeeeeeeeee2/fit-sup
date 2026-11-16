import { useEffect, useRef, useState } from 'react'
import { DRAW_COLORS, DRAW_SIZES, EMOJIS } from '../data/options.js'
import { DRAW_H, DRAW_W, strokePath } from '../lib/drawing.js'
import { readPhoto } from '../lib/photo.js'
import { DeckCanvasBase, Sticker } from './Board.jsx'

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

function stickerBox(st) {
  const h = st.size
  const w = st.kind === 'emoji' ? st.size * 1.1 : st.size * (st.ratio || 1)
  return { x: st.x - w / 2, y: st.y - h / 2, w, h }
}

// 가장 위에 있는 사진·이모지부터 찾음
function stickerAt(stickers, [x, y]) {
  for (let i = stickers.length - 1; i >= 0; i -= 1) {
    const b = stickerBox(stickers[i])
    if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) return stickers[i]
  }
  return null
}

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
const SIZE_MIN = 24
const SIZE_MAX = 144
const SIZE_STEP = 16

let stickerSeq = 0
function newStickerId() {
  stickerSeq += 1
  return `st-${Date.now().toString(36)}-${stickerSeq}`
}

/**
 * 덱 무늬 '직접 만들기' 창 (J)
 * - 데스크톱: 가운데 창 / 1023px 이하: 아래에서 올라오는 시트 (mobile.css의 .dialog 규칙)
 * - 도구: 펜 색, 굵기 3단계, 지우개(닿은 획을 지움), 옮기기(사진·이모지), 되돌리기, 전체 지우기
 * - 사진 올리기, 이모지 붙이기 → 옮기기 도구로 끌어서 위치를 바꾸고 크기 조절·삭제
 * - 완료를 누르면 디자인의 drawing·stickers에 저장 → 미리보기·장바구니·내 디자인·이미지 저장에 함께 보임
 */
export default function DrawSheet({ design, onApply, onClose }) {
  const [scene, setScene] = useState(() => ({ strokes: design.drawing ?? [], stickers: design.stickers ?? [] }))
  const [history, setHistory] = useState([])
  const [tool, setTool] = useState('pen')
  const [color, setColor] = useState(DRAW_COLORS[0].hex)
  const [size, setSize] = useState(DRAW_SIZES[1].width)
  const [selected, setSelected] = useState(null)
  const [photoError, setPhotoError] = useState('')
  const svgRef = useRef(null)
  const fileRef = useRef(null)
  const drawingRef = useRef(null) // { erased } | { index } | { drag, dx, dy, moved }
  const firstRef = useRef(null)

  useEffect(() => {
    firstRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  // 손가락을 움직이는 동안 최신 상태 (state 갱신을 기다리지 않음)
  const sceneRef = useRef(scene)
  const commit = (next) => {
    sceneRef.current = next
    setScene(next)
  }
  const remember = (prev) => setHistory((h) => [...h, prev])
  const { strokes, stickers } = scene
  const current = stickers.find((st) => st.id === selected) ?? null

  const eraseAt = (pt) => {
    const prev = sceneRef.current
    const next = prev.strokes.filter((s) => !hits(s, pt, size / 2 + 6))
    if (next.length === prev.strokes.length) return
    if (!drawingRef.current.erased) {
      drawingRef.current.erased = true
      remember(prev)
    }
    commit({ ...prev, strokes: next })
  }

  const updateSticker = (id, patch) => {
    const prev = sceneRef.current
    commit({ ...prev, stickers: prev.stickers.map((st) => (st.id === id ? { ...st, ...patch } : st)) })
  }

  const addSticker = (kind, value, ratio = 1) => {
    const prev = sceneRef.current
    remember(prev)
    const st = { id: newStickerId(), kind, value, ratio, x: DRAW_W / 2, y: DRAW_H / 2, size: kind === 'emoji' ? 64 : 96 }
    commit({ ...prev, stickers: [...prev.stickers, st] })
    setSelected(st.id)
    setTool('move')
  }

  const onPhoto = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const { src, ratio } = await readPhoto(file)
      setPhotoError('')
      addSticker('image', src, ratio)
    } catch (err) {
      setPhotoError(err.message)
    }
  }

  const onPointerDown = (e) => {
    const svg = svgRef.current
    if (!svg) return
    e.preventDefault()
    svg.setPointerCapture?.(e.pointerId)
    const pt = toDeckPoint(svg, e)
    if (tool === 'move') {
      const hit = stickerAt(sceneRef.current.stickers, pt)
      setSelected(hit?.id ?? null)
      drawingRef.current = hit ? { drag: hit.id, dx: pt[0] - hit.x, dy: pt[1] - hit.y, moved: false } : null
      return
    }
    if (tool === 'eraser') {
      drawingRef.current = { erased: false }
      eraseAt(pt)
      return
    }
    const prev = sceneRef.current
    remember(prev)
    drawingRef.current = { index: prev.strokes.length }
    commit({ ...prev, strokes: [...prev.strokes, { color, width: size, points: [pt] }] })
  }

  const onPointerMove = (e) => {
    if (!drawingRef.current || !svgRef.current) return
    const pt = toDeckPoint(svgRef.current, e)
    const d = drawingRef.current
    if (d.drag) {
      if (!d.moved) {
        d.moved = true
        remember(sceneRef.current)
      }
      updateSticker(d.drag, { x: clamp(pt[0] - d.dx, 0, DRAW_W), y: clamp(pt[1] - d.dy, 0, DRAW_H) })
      return
    }
    if (tool === 'eraser') {
      eraseAt(pt)
      return
    }
    const prev = sceneRef.current
    const s = prev.strokes[d.index]
    if (!s) return
    const [lx, ly] = s.points[s.points.length - 1]
    if ((lx - pt[0]) ** 2 + (ly - pt[1]) ** 2 < 2.25) return // 1.5px보다 가까운 점은 건너뜀
    const next = prev.strokes.slice()
    next[d.index] = { ...s, points: [...s.points, pt] }
    commit({ ...prev, strokes: next })
  }

  const onPointerEnd = () => {
    drawingRef.current = null
  }

  const resize = (delta) => {
    if (!current) return
    remember(sceneRef.current)
    updateSticker(current.id, { size: clamp(current.size + delta, SIZE_MIN, SIZE_MAX) })
  }

  const removeSelected = () => {
    if (!current) return
    const prev = sceneRef.current
    remember(prev)
    commit({ ...prev, stickers: prev.stickers.filter((st) => st.id !== current.id) })
    setSelected(null)
  }

  const undo = () => {
    if (!history.length) return
    commit(history[history.length - 1])
    setHistory((h) => h.slice(0, -1))
  }

  const clearAll = () => {
    if (!strokes.length && !stickers.length) return
    remember(sceneRef.current)
    commit({ strokes: [], stickers: [] })
    setSelected(null)
  }

  const box = current && stickerBox(current)

  return (
    <div className="scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby="draw-title" className="dialog draw-sheet">
        <h2 id="draw-title" className="dialog__title">
          덱 직접 꾸미기
        </h2>
        <p className="dialog__help">
          손가락이나 마우스로 그리고, 사진이나 이모지를 붙여 보세요. 붙인 건 ‘옮기기’로 끌어서 옮길 수 있어요.
        </p>

        <div className="draw-canvas">
          <svg
            ref={svgRef}
            viewBox={`-6 -6 ${DRAW_W + 12} ${DRAW_H + 12}`}
            width="100%"
            role="img"
            className={tool === 'move' ? 'is-move' : undefined}
            aria-label={`꾸미기 칸, 선 ${strokes.length}개, 사진·이모지 ${stickers.length}개`}
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
              {stickers.map((st) => (
                <Sticker key={st.id} sticker={st} />
              ))}
            </g>
            {box && tool === 'move' && (
              <rect
                x={box.x}
                y={box.y}
                width={box.w}
                height={box.h}
                fill="none"
                stroke="#1E3FD0"
                strokeWidth="2.5"
                strokeDasharray="7 5"
                pointerEvents="none"
              />
            )}
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
            <button
              type="button"
              aria-pressed={tool === 'move'}
              className={`draw-chip${tool === 'move' ? ' is-on' : ''}`}
              disabled={!stickers.length}
              onClick={() => setTool('move')}
            >
              옮기기
            </button>
            <span className="draw-tools__gap" />
            <button type="button" className="draw-chip" onClick={undo} disabled={!history.length}>
              되돌리기
            </button>
            <button type="button" className="draw-chip" onClick={clearAll} disabled={!strokes.length && !stickers.length}>
              전체 지우기
            </button>
          </div>

          {tool === 'move' && current && (
            <div role="group" aria-label="고른 사진·이모지" className="draw-tools__row draw-tools__selected">
              <span className="draw-tools__label">{current.kind === 'emoji' ? `이모지 ${current.value}` : '사진'}</span>
              <button type="button" className="draw-chip" onClick={() => resize(-SIZE_STEP)} disabled={current.size <= SIZE_MIN}>
                작게
              </button>
              <button type="button" className="draw-chip" onClick={() => resize(SIZE_STEP)} disabled={current.size >= SIZE_MAX}>
                크게
              </button>
              <button type="button" className="draw-chip" onClick={removeSelected}>
                삭제
              </button>
            </div>
          )}

          {tool !== 'move' && (
            <>
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
            </>
          )}

          <div role="group" aria-label="사진 추가" className="draw-tools__row">
            <span className="draw-tools__label">사진</span>
            <button type="button" className="draw-chip" onClick={() => fileRef.current?.click()}>
              + 사진 올리기
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPhoto} />
            {photoError && (
              <span role="alert" className="field-error draw-tools__error">
                {photoError}
              </span>
            )}
          </div>

          <div role="group" aria-label="이모지 추가" className="draw-tools__row">
            <span className="draw-tools__label">이모지</span>
            {EMOJIS.map((em) => (
              <button
                key={em}
                type="button"
                className="draw-emoji"
                aria-label={`이모지 ${em} 붙이기`}
                onClick={() => addSticker('emoji', em)}
              >
                {em}
              </button>
            ))}
          </div>
        </div>

        <div className="dialog__actions">
          <button type="button" className="btn-text" onClick={onClose}>
            취소
          </button>
          <button type="button" className="btn btn--md" onClick={() => onApply({ drawing: strokes, stickers })}>
            완료
          </button>
        </div>
      </div>
    </div>
  )
}
