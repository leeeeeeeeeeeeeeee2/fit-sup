import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { cartCount } from '../lib/price.js'
import { useStore } from '../store/StoreContext.jsx'
import { Logo } from './Icons.jsx'
// 모바일·태블릿(1023px 이하) 아이콘 메뉴용 — 데스크톱에서는 .m-only로 숨김
import { Bookmark, Cart, LogOut, Pencil, StarLine, User } from './Icons.jsx'

// 공통 메뉴 M01~M05
export default function Header() {
  const { cart, loggedIn, logout } = useStore()
  const { pathname } = useLocation()
  const count = cartCount(cart)
  // 개수가 바뀔 때마다 배지를 한 번 튀어 오르게 함 (처음 열 때는 그대로)
  const [last, setLast] = useState(count)
  const [bump, setBump] = useState(0)
  if (last !== count) {
    setLast(count)
    setBump(bump + 1)
  }

  return (
    <header data-id="header" className="site-header">
      <div className="site-header__inner">
        <Link data-id="M01" to="/" className="logo" aria-label="핏썹 메인으로">
          <Logo />
        </Link>
        <nav aria-label="주요 메뉴">
          <ul className="gnb">
            <li>
              <NavLink data-id="M02" to="/build" className="gnb__link">
                <span className="m-only gnb__icon" aria-hidden="true"><Pencil /></span>
                보드 만들기
              </NavLink>
            </li>
            <li>
              <NavLink data-id="M03" to="/my-designs" className="gnb__link">
                <span className="m-only gnb__icon" aria-hidden="true"><Bookmark /></span>
                내 디자인
              </NavLink>
            </li>
            <li>
              <NavLink data-id="M06" to="/reviews" className="gnb__link">
                <span className="m-only gnb__icon" aria-hidden="true"><StarLine /></span>
                리뷰
              </NavLink>
            </li>
            <li>
              <NavLink
                data-id="M04"
                to="/cart"
                className="gnb__link"
                aria-label={`장바구니, 담은 보드 ${count}개`}
              >
                <span className="m-only gnb__icon" aria-hidden="true"><Cart /></span>
                장바구니
                <span key={bump} className={`badge${bump ? ' badge--bump' : ''}`} aria-hidden="true">
                  {count}
                </span>
              </NavLink>
            </li>
            <li>
              {loggedIn ? (
                <button data-id="M05" type="button" className="gnb__login gnb__login--out" onClick={logout}>
                  <span className="m-only gnb__icon" aria-hidden="true"><LogOut /></span>
                  로그아웃
                </button>
              ) : (
                <Link
                  data-id="M05"
                  to="/login"
                  className={`gnb__login${pathname === '/login' ? ' is-current' : ''}`}
                  aria-current={pathname === '/login' ? 'page' : undefined}
                >
                  <span className="m-only gnb__icon" aria-hidden="true"><User /></span>
                  로그인
                </Link>
              )}
            </li>
          </ul>
        </nav>
        {/* 화면 읽기 프로그램에 장바구니 개수 변화를 알림 */}
        <p className="sr-only" role="status" aria-live="polite">
          {bump ? `장바구니에 담은 보드 ${count}개` : ''}
        </p>
      </div>
    </header>
  )
}
