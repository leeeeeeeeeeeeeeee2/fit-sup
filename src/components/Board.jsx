import { useId } from 'react'
import { deckHexOf, fontOf, partHexOf, sideAlt, topAlt, wheelTypeOf } from '../lib/design.js'
import { DRAW_H, DRAW_W, strokePath } from '../lib/drawing.js'

const INK = '#111311'
const WHITE = '#FFFFFF'

function useSvgId(prefix) {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
}

// 플레임 무늬 (80×44 견본 좌표 기준, docs/html P02와 같은 모양)
function FlamePaths({ strokeWidth = 1.8 }) {
  return (
    <>
      <path
        d="M0 4 C18 4 28 0 44 8 C34 11 34 13 52 16 C40 19 40 21 64 24 C46 28 44 31 56 37 C40 38 24 40 0 40 Z"
        fill={WHITE}
        stroke={INK}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M0 14 C12 14 18 12 28 16 C22 19 24 21 36 24 C24 27 22 29 30 32 C18 32 10 32 0 32 Z"
        fill="#FF6F5E"
      />
    </>
  )
}

/**
 * 덱 모양 하나를 무늬와 함께 그림
 * cell: 체커 칸 크기, stripe: [줄 간격, 흰 줄 두께]
 */
function DeckShape({ x, y, w, h, rx, color, pattern, cell, stripe, strokeWidth, flameStroke }) {
  const id = useSvgId('deck')
  const shape = { x, y, width: w, height: h, rx }

  let defs = null
  let fill = color
  if (pattern === 'checker') {
    defs = (
      <pattern id={id} width={cell * 2} height={cell * 2} patternUnits="userSpaceOnUse" x={x} y={y}>
        <rect width={cell * 2} height={cell * 2} fill={color} />
        <rect width={cell} height={cell} fill={WHITE} />
        <rect x={cell} y={cell} width={cell} height={cell} fill={WHITE} />
      </pattern>
    )
    fill = `url(#${id})`
  } else if (pattern === 'stripe') {
    defs = (
      <pattern id={id} width={w} height={stripe[0]} patternUnits="userSpaceOnUse" x={x} y={y}>
        <rect width={w} height={stripe[0]} fill={color} />
        <rect width={w} height={stripe[1]} fill={WHITE} />
      </pattern>
    )
    fill = `url(#${id})`
  } else if (pattern === 'flame') {
    defs = (
      <clipPath id={id}>
        <rect {...shape} />
      </clipPath>
    )
  }

  return (
    <>
      {defs && <defs>{defs}</defs>}
      {pattern === 'flame' ? (
        <>
          <rect {...shape} fill={color} />
          <g clipPath={`url(#${id})`}>
            <g transform={`translate(${x} ${y}) scale(${w / 80} ${h / 44})`}>
              <FlamePaths strokeWidth={flameStroke} />
            </g>
          </g>
          <rect {...shape} fill="none" stroke={INK} strokeWidth={strokeWidth} />
        </>
      ) : (
        <rect {...shape} fill={fill} stroke={INK} strokeWidth={strokeWidth} />
      )}
    </>
  )
}

/**
 * 직접 그린 그림 (J): 덱 모양 안쪽에만 보이게 잘라서 그림
 * drawing: [{ color, width, points: [[x, y], ...] }] — 좌표는 DRAW_W × DRAW_H 기준
 * 그림이 없으면 아무것도 그리지 않음 (기존 화면 그대로)
 */
function DeckDrawing({ x, y, w, h, rx, drawing, stickers }) {
  const id = useSvgId('draw')
  if (!drawing?.length && !stickers?.length) return null
  return (
    <>
      <defs>
        <clipPath id={id}>
          <rect x={x} y={y} width={w} height={h} rx={rx} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id})`}>
        <g transform={`translate(${x} ${y}) scale(${w / DRAW_W} ${h / DRAW_H})`}>
          {drawing?.map((s, i) => (
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
          {stickers?.map((st) => (
            <Sticker key={st.id} sticker={st} />
          ))}
        </g>
      </g>
    </>
  )
}

/**
 * 사진·이모지 한 개 (좌표는 DRAW_W × DRAW_H 기준, x·y는 가운데, size는 높이)
 */
export function Sticker({ sticker: st }) {
  if (st.kind === 'emoji') {
    return (
      <text x={st.x} y={st.y} fontSize={st.size} textAnchor="middle" dominantBaseline="central">
        {st.value}
      </text>
    )
  }
  const h = st.size
  const w = st.size * (st.ratio || 1)
  return <image href={st.value} x={st.x - w / 2} y={st.y - h / 2} width={w} height={h} preserveAspectRatio="xMidYMid meet" />
}

// 바퀴 종류에 따른 윗면 바퀴 모양 (와이드는 더 두껍게, 클리어는 반투명)
function wheelLook(design, base) {
  const type = wheelTypeOf(design).id
  const fill = partHexOf(design, 'wheel')
  const look = { ...base, fill, fillOpacity: type === 'clear' ? 0.5 : 1 }
  return { look, grow: type === 'wide' ? base.height * 0.3 : 0 }
}

// 그리기 창(J)의 바탕: 덱 윗면만 DRAW_W × DRAW_H 크기로 그림
export function DeckCanvasBase({ design }) {
  return (
    <DeckShape
      x={0}
      y={0}
      w={DRAW_W}
      h={DRAW_H}
      rx={DRAW_H / 2}
      color={deckHexOf(design)}
      pattern={design.pattern}
      cell={20}
      stripe={[36, 15]}
      strokeWidth={5}
      flameStroke={4}
    />
  )
}

// 덱 윗면 미리보기 (600×220)
export function BoardTop({ design, svgRef, label }) {
  const font = fontOf(design.font)
  const { look, grow } = wheelLook(design, { width: 44, height: 28, rx: 9, stroke: INK, strokeWidth: 4 })
  const wheelRect = { ...look, height: look.height + grow }
  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      viewBox="0 0 600 220"
      role="img"
      aria-label={label ?? topAlt(design)}
    >
      <rect x="100" y={20 - grow} {...wheelRect} />
      <rect x="100" y="172" {...wheelRect} />
      <rect x="456" y={20 - grow} {...wheelRect} />
      <rect x="456" y="172" {...wheelRect} />
      <DeckShape
        x={20}
        y={38}
        w={560}
        h={144}
        rx={72}
        color={deckHexOf(design)}
        pattern={design.pattern}
        cell={20}
        stripe={[36, 15]}
        strokeWidth={5}
        flameStroke={4}
      />
      <DeckDrawing x={20} y={38} w={560} h={144} rx={72} drawing={design.drawing} stickers={design.stickers} />
      {design.phrase && (
        <text
          x="300"
          y="130"
          textAnchor="middle"
          fill={INK}
          stroke={WHITE}
          strokeWidth="7"
          strokeLinejoin="round"
          paintOrder="stroke"
          fontFamily={font.family.replace(/'/g, '')}
          fontSize="60"
          transform="rotate(-4 300 112)"
        >
          {design.phrase}
        </text>
      )}
    </svg>
  )
}

// 옆모습 미리보기 (600×140)
export function BoardSide({ design }) {
  const wheel = partHexOf(design, 'wheel')
  const truck = partHexOf(design, 'truck')
  const type = wheelTypeOf(design).id
  const clipId = useSvgId('wheel')
  return (
    <svg width="100%" viewBox="0 0 600 140" role="img" aria-label={sideAlt(design)}>
      <rect x="20" y="24" width="560" height="18" rx="9" fill={deckHexOf(design)} stroke={INK} strokeWidth="4" />
      {[96, 456].map((x) => (
        <g key={x}>
          <rect x={x} y="42" width="48" height="10" fill={truck} stroke={INK} strokeWidth="3" />
          <polygon
            points={`${x + 4},52 ${x + 44},52 ${x + 56},74 ${x - 8},74`}
            fill={truck}
            stroke={INK}
            strokeWidth="3"
            strokeLinejoin="round"
          />
        </g>
      ))}
      {[120, 480].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="98" r="28" fill={wheel} fillOpacity={type === 'clear' ? 0.5 : 1} stroke={INK} strokeWidth="4" />
          {type === 'graphic' &&
            (design.wheelGraphic ? (
              <>
                <defs>
                  <clipPath id={`${clipId}-${cx}`}>
                    <circle cx={cx} cy="98" r="24" />
                  </clipPath>
                </defs>
                <image
                  href={design.wheelGraphic}
                  x={cx - 24}
                  y="74"
                  width="48"
                  height="48"
                  preserveAspectRatio="xMidYMid slice"
                  clipPath={`url(#${clipId}-${cx})`}
                />
              </>
            ) : (
              <>
                <circle cx={cx} cy="98" r="19" fill="none" stroke="#FF6F5E" strokeWidth="6" strokeDasharray="8 5" />
                <circle cx={cx} cy="98" r="13" fill="none" stroke="#1E3FD0" strokeWidth="3" />
              </>
            ))}
          {type === 'wide' && <circle cx={cx} cy="98" r="22" fill="none" stroke={INK} strokeWidth="2" strokeOpacity="0.5" />}
          <circle cx={cx} cy="98" r="8" fill={WHITE} stroke={INK} strokeWidth="3" />
        </g>
      ))}
    </svg>
  )
}

// 목록 행·카드의 작은 윗면 그림 (150×60)
export function BoardThumb({ design, width = 150, height = 60, label }) {
  const font = fontOf(design.font)
  const { look, grow } = wheelLook(design, { width: 16, height: 10, rx: 4, stroke: INK, strokeWidth: 2.5 })
  const wheelRect = { ...look, height: look.height + grow }
  return (
    <svg width={width} height={height} viewBox="0 0 150 60" role="img" aria-label={label ?? topAlt(design)}>
      <rect x="26" y={4 - grow} {...wheelRect} />
      <rect x="26" y="46" {...wheelRect} />
      <rect x="108" y={4 - grow} {...wheelRect} />
      <rect x="108" y="46" {...wheelRect} />
      <DeckShape
        x={3}
        y={11}
        w={144}
        h={38}
        rx={19}
        color={deckHexOf(design)}
        pattern={design.pattern}
        cell={6}
        stripe={[10, 4]}
        strokeWidth={3}
        flameStroke={1.2}
      />
      <DeckDrawing x={3} y={11} w={144} h={38} rx={19} drawing={design.drawing} stickers={design.stickers} />
      {design.phrase && (
        <text
          x="75"
          y="37"
          textAnchor="middle"
          fill={INK}
          stroke={WHITE}
          strokeWidth="3"
          strokeLinejoin="round"
          paintOrder="stroke"
          fontFamily={font.family.replace(/'/g, '')}
          fontSize="18"
          transform="rotate(-4 75 30)"
        >
          {design.phrase}
        </text>
      )}
    </svg>
  )
}

// 덱 무늬 타일 견본 (80×44)
export function PatternSwatch({ pattern, color }) {
  return (
    <svg width="100%" height="44" viewBox="0 0 80 44" aria-hidden="true">
      <DeckShape
        x={1}
        y={1}
        w={78}
        h={42}
        rx={10}
        color={color}
        pattern={pattern}
        cell={8}
        stripe={[12, 5]}
        strokeWidth={2}
        flameStroke={1.8}
      />
    </svg>
  )
}

// 길이 카드 그림 (회색 덱, 길이에 따라 너비가 바뀜)
export function LengthBoard({ length }) {
  const d = length * 10
  const w = d + 6
  const w1 = Math.round(d * 0.18)
  const w2 = Math.round(d * 0.82 - 16)
  const wheel = { width: 22, height: 14, rx: 5, fill: WHITE, stroke: INK, strokeWidth: 3 }
  return (
    <svg width={w} height="80" viewBox={`0 0 ${w} 80`} aria-hidden="true">
      <rect x={w1} y="6" {...wheel} />
      <rect x={w1} y="60" {...wheel} />
      <rect x={w2} y="6" {...wheel} />
      <rect x={w2} y="60" {...wheel} />
      <rect x="3" y="14" width={d} height="52" rx="26" fill="#C9CBC3" stroke={INK} strokeWidth="3" />
    </svg>
  )
}

// P01 히어로 보드 예시 (완성 화면 그대로: 27인치 · 블루 덱 · 화이트 바퀴 · FIT'SUP)
export function HeroBoard() {
  const wheel = { width: 44, height: 28, rx: 9, fill: WHITE, stroke: INK, strokeWidth: 4 }
  const bolts = [
    [110, 96], [134, 96], [110, 124], [134, 124],
    [466, 96], [490, 96], [466, 124], [490, 124],
  ]
  return (
    <svg
      className="hero-board"
      width="100%"
      viewBox="0 0 600 220"
      role="img"
      aria-label="27인치 블루 덱에 화이트 바퀴, FIT'SUP 문구를 넣은 보드 미리보기 예시"
    >
      <rect x="100" y="20" {...wheel} />
      <rect x="100" y="172" {...wheel} />
      <rect x="456" y="20" {...wheel} />
      <rect x="456" y="172" {...wheel} />
      <rect x="20" y="38" width="560" height="144" rx="72" fill="#1E3FD0" stroke={INK} strokeWidth="5" />
      <rect x="168" y="86" width="264" height="48" rx="24" fill={INK} />
      <text
        x="300"
        y="118"
        textAnchor="middle"
        fill={WHITE}
        fontFamily="Noto Sans KR, sans-serif"
        fontSize="24"
        fontWeight="700"
        letterSpacing="2"
      >
        FIT'SUP
      </text>
      {bolts.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4.5" fill={INK} />
      ))}
    </svg>
  )
}
