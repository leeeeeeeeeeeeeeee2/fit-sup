// 인라인 선 아이콘 (선 굵기 2~2.5px, 둥근 끝, 색은 주변 글자색)

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
  viewBox: '0 0 24 24',
}

export function ArrowRight({ size = 22, strokeWidth = 2.5 }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} {...base}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  )
}

export function ArrowDown({ size = 20 }) {
  return (
    <svg width={size} height={size} strokeWidth="2.4" {...base}>
      <path d="M12 5v14" />
      <path d="M6 13l6 6 6-6" />
    </svg>
  )
}

export function Check({ size = 22, strokeWidth = 2.4 }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} {...base}>
      <path d="M5 12l4.5 4.5L19 7" />
    </svg>
  )
}

export function Info({ size = 20 }) {
  return (
    <svg width={size} height={size} strokeWidth="2" {...base} className="icon-info">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6" />
      <path d="M12 7.5v.01" />
    </svg>
  )
}

export function Alert({ size = 18, strokeWidth = 2 }) {
  return (
    <svg width={size} height={size} strokeWidth={strokeWidth} {...base}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6" />
      <path d="M12 16.5v.01" />
    </svg>
  )
}

export function Trash({ size = 18 }) {
  return (
    <svg width={size} height={size} strokeWidth="2" {...base}>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M6 7l1 13h10l1-13" />
    </svg>
  )
}

export function Download({ size = 20 }) {
  return (
    <svg width={size} height={size} strokeWidth="2.2" {...base}>
      <path d="M12 4v11" />
      <path d="M7 10l5 5 5-5" />
      <path d="M5 20h14" />
    </svg>
  )
}

export function Pencil({ size = 24 }) {
  return (
    <svg width={size} height={size} strokeWidth="2" {...base}>
      <path d="M4 20l4-1 11-11-3-3L5 16l-1 4z" />
      <path d="M14 7l3 3" />
    </svg>
  )
}

export function Lock({ size = 64 }) {
  return (
    <svg width={size} height={size} strokeWidth="1.6" {...base}>
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
      <path d="M12 14.5v2.5" />
    </svg>
  )
}

// 모바일·태블릿 아이콘 메뉴용 (M03 내 디자인)
export function Bookmark({ size = 24 }) {
  return (
    <svg width={size} height={size} strokeWidth="2" {...base}>
      <path d="M6 4h12v16l-6-4-6 4z" />
    </svg>
  )
}

// 모바일·태블릿 아이콘 메뉴용 (M04 장바구니)
export function Cart({ size = 24 }) {
  return (
    <svg width={size} height={size} strokeWidth="2" {...base}>
      <path d="M3 4h2.5l2.2 10.5h10.6L20.5 7H7" />
      <circle cx="9.5" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
    </svg>
  )
}

// 모바일·태블릿 아이콘 메뉴용 (M05 로그인)
export function User({ size = 24 }) {
  return (
    <svg width={size} height={size} strokeWidth="2" {...base}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </svg>
  )
}

// 모바일·태블릿 아이콘 메뉴용 (M05 로그아웃)
export function LogOut({ size = 24 }) {
  return (
    <svg width={size} height={size} strokeWidth="2" {...base}>
      <path d="M10 4H5v16h5" />
      <path d="M14 8l4 4-4 4" />
      <path d="M18 12H9" />
    </svg>
  )
}

// 로고(안): 보드 옆모습 아이콘
export function LogoMark({ color = '#111311' }) {
  return (
    <svg width="44" height="26" viewBox="0 0 44 26" aria-hidden="true">
      <rect x="2" y="6" width="40" height="7" rx="3.5" fill={color} />
      <circle cx="12" cy="19" r="4" fill="none" stroke={color} strokeWidth="2.5" />
      <circle cx="32" cy="19" r="4" fill="none" stroke={color} strokeWidth="2.5" />
    </svg>
  )
}

// 리뷰 메뉴 (모바일 아이콘)
export function StarLine({ size = 24 }) {
  return (
    <svg width={size} height={size} strokeWidth="2" {...base}>
      <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />
    </svg>
  )
}

// 별점 별 (채움)
export function Star({ size = 18, color = '#1E3FD0', empty = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2.8l2.85 5.8 6.4.93-4.63 4.5 1.1 6.37L12 17.4l-5.72 3 1.1-6.37-4.63-4.5 6.4-.93z"
        fill={empty ? '#DCDDD6' : color}
      />
    </svg>
  )
}

export function ThumbUp({ size = 18 }) {
  return (
    <svg width={size} height={size} strokeWidth="2" {...base}>
      <path d="M7 10v11H4V10zM7 10l4-7c1.7 0 2.6 1.1 2.3 2.8L12.8 9H19a2 2 0 012 2.3l-1.3 7.6A2.5 2.5 0 0117.2 21H7" />
    </svg>
  )
}
