// 추가 용품 그림 (보드 그림과 같은 굵은 외곽선 스타일, 80×56)
const INK = '#111311'
const line = { stroke: INK, strokeWidth: 3, strokeLinejoin: 'round', strokeLinecap: 'round' }

const ICONS = {
  helmet: (
    <>
      <path d="M14 40 C14 20 28 10 42 10 C56 10 68 20 68 36 L68 40 Z" fill="#1E3FD0" {...line} />
      <path d="M30 14 C34 22 34 30 32 40 M46 11 C50 20 50 30 48 40" fill="none" stroke="#FFFFFF" strokeWidth="3" />
      <path d="M10 40 H70 C70 44 68 46 64 46 H14 C11 46 10 44 10 40 Z" fill="#111311" {...line} />
    </>
  ),
  bag: (
    <>
      <rect x="6" y="18" width="68" height="26" rx="13" fill="#7FD8BE" {...line} />
      <path d="M22 18 C22 8 58 8 58 18" fill="none" {...line} />
      <path d="M14 31 H66" stroke={INK} strokeWidth="2.5" strokeDasharray="5 4" />
      <rect x="34" y="26" width="12" height="10" rx="3" fill="#FFFFFF" {...line} />
    </>
  ),
  pads: (
    <>
      <path d="M16 12 H34 C38 12 40 16 40 20 V36 C40 44 34 48 25 48 C16 48 10 44 10 36 V18 C10 14 12 12 16 12 Z" fill="#111311" {...line} />
      <ellipse cx="25" cy="32" rx="9" ry="10" fill="#9A9D96" stroke="#FFFFFF" strokeWidth="2" />
      <rect x="46" y="14" width="26" height="32" rx="10" fill="#FF6F5E" {...line} />
      <path d="M46 24 H72 M46 36 H72" stroke={INK} strokeWidth="2.5" />
    </>
  ),
  bearing: (
    <>
      <circle cx="40" cy="28" r="22" fill="#B8BCC2" {...line} />
      <circle cx="40" cy="28" r="9" fill="#FFFFFF" {...line} />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
        const r = (a * Math.PI) / 180
        return <circle key={a} cx={40 + Math.cos(r) * 15.5} cy={28 + Math.sin(r) * 15.5} r="3.2" fill={INK} />
      })}
    </>
  ),
  grip: (
    <>
      <rect x="8" y="12" width="64" height="32" rx="16" fill="#111311" {...line} />
      {Array.from({ length: 18 }, (_, i) => (
        <circle key={i} cx={20 + (i % 6) * 8} cy={20 + Math.floor(i / 6) * 8} r="1.4" fill="#9A9D96" />
      ))}
    </>
  ),
  tool: (
    <>
      <path d="M12 12 H68" fill="none" stroke="#FF6F5E" strokeWidth="10" strokeLinecap="round" />
      <path d="M12 12 H68" fill="none" stroke={INK} strokeWidth="14" strokeLinecap="round" opacity="0.15" />
      <rect x="34" y="12" width="12" height="36" rx="4" fill="#B8BCC2" {...line} />
      <circle cx="16" cy="12" r="5" fill="#FFFFFF" {...line} />
      <circle cx="64" cy="12" r="5" fill="#FFFFFF" {...line} />
      <path d="M36 44 H44" stroke={INK} strokeWidth="2.5" />
    </>
  ),
}

export default function ExtraIcon({ id }) {
  return (
    <svg width="80" height="56" viewBox="0 0 80 56" aria-hidden="true">
      {ICONS[id]}
    </svg>
  )
}
