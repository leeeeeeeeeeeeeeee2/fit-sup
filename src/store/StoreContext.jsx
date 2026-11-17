import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { DEFAULT_DESIGN, QTY_MAX } from '../data/options.js'
import { normalizeDesign } from '../lib/design.js'
import { cartCount } from '../lib/price.js'

// 장바구니·로그인 상태·저장한 디자인·만들던 디자인을 브라우저(localStorage)에 보관
const STORAGE_KEY = 'fitsup'

const INITIAL = {
  draft: DEFAULT_DESIGN,
  cart: [],
  designs: [],
  loggedIn: false,
  pending: null, // 로그인하러 가기 전에 하던 일: 'save' | 'image' | 'cart' | 'review'
  buyNow: null, // 주문하기(바로 결제)로 고른 보드 { id, design } — 장바구니와 따로 결제
  lastOrderCount: 0,
  lastOrder: null, // { count, total, payLabel }
  myReviews: [], // 내가 쓴 리뷰
  helped: [], // 도움돼요를 누른 리뷰 id
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return INITIAL
    const saved = JSON.parse(raw)
    return { ...INITIAL, ...saved, draft: normalizeDesign(saved.draft) }
  } catch {
    return INITIAL
  }
}

let seq = 0
function newId() {
  seq += 1
  return `${Date.now().toString(36)}-${seq}`
}

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [state, setState] = useState(load)
  const [toast, setToast] = useState(null)
  const timer = useRef(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // 저장소를 쓸 수 없는 환경이면 화면 안에서만 유지
    }
  }, [state])

  const hideToast = useCallback(() => {
    clearTimeout(timer.current)
    setToast(null)
  }, [])

  // 화면 아래 알림: 6초 동안 표시
  const showToast = useCallback((t) => {
    clearTimeout(timer.current)
    setToast({ ...t, key: newId() })
    timer.current = setTimeout(() => setToast(null), 6000)
  }, [])

  useEffect(() => () => clearTimeout(timer.current), [])

  const actions = useMemo(
    () => ({
      updateDraft: (patch) => setState((s) => ({ ...s, draft: { ...s.draft, ...patch } })),
      setDraft: (design) => setState((s) => ({ ...s, draft: normalizeDesign(design) })),
      resetDraft: () => setState((s) => ({ ...s, draft: DEFAULT_DESIGN })),
      addToCart: (design) =>
        setState((s) => ({ ...s, cart: [...s.cart, { id: newId(), design: { ...design }, qty: 1 }] })),
      setQty: (id, qty) =>
        setState((s) => ({
          ...s,
          cart: s.cart.map((it) => (it.id === id ? { ...it, qty: Math.max(1, Math.min(QTY_MAX, qty)) } : it)),
        })),
      removeFromCart: (id) => setState((s) => ({ ...s, cart: s.cart.filter((it) => it.id !== id) })),
      // 주문하기(바로 결제): 장바구니에 담지 않고 이 보드만 결제
      startBuyNow: (design) => setState((s) => ({ ...s, buyNow: { id: newId(), design: { ...design }, qty: 1 } })),
      // now: 바로 결제였으면 장바구니는 그대로 두고 바로 결제 보드만 비움
      completeOrder: (order, { now = false } = {}) =>
        setState((s) =>
          now
            ? { ...s, lastOrderCount: 1, lastOrder: order ?? null, buyNow: null }
            : { ...s, lastOrderCount: cartCount(s.cart), lastOrder: order ?? null, cart: [] },
        ),
      addReview: (review) => setState((s) => ({ ...s, myReviews: [{ id: newId(), ...review }, ...s.myReviews] })),
      removeReview: (id) => setState((s) => ({ ...s, myReviews: s.myReviews.filter((r) => r.id !== id) })),
      toggleHelped: (id) =>
        setState((s) => ({
          ...s,
          helped: s.helped.includes(id) ? s.helped.filter((x) => x !== id) : [...s.helped, id],
        })),
      saveDesign: (design) =>
        setState((s) => ({ ...s, designs: [...s.designs, { id: newId(), design: { ...design } }] })),
      login: () => setState((s) => ({ ...s, loggedIn: true })),
      logout: () => setState((s) => ({ ...s, loggedIn: false })),
      setPending: (pending) => setState((s) => ({ ...s, pending })),
    }),
    [],
  )

  const value = useMemo(
    () => ({ ...state, ...actions, toast, showToast, hideToast }),
    [state, actions, toast, showToast, hideToast],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

// eslint-disable-next-line react/only-export-components
export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore는 StoreProvider 안에서 써야 해요.')
  return ctx
}
