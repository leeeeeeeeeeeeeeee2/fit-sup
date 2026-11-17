import { Link } from 'react-router-dom'
import { Logo } from './Icons.jsx'

export default function Footer() {
  return (
    <footer data-id="footer" className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <Link to="/" className="logo logo--white" aria-label="핏썹 메인으로">
              <Logo color="#FFFFFF" height={26} />
            </Link>
            <p>사이즈는 딱 맞게, 디자인은 내 맘대로.</p>
          </div>
          <nav aria-label="푸터 메뉴">
            <ul className="site-footer__menu">
              <li><Link to="/build">보드 만들기</Link></li>
              <li><Link to="/my-designs">내 디자인</Link></li>
              <li><Link to="/cart">장바구니</Link></li>
              <li><Link to="/login">로그인</Link></li>
            </ul>
          </nav>
        </div>
        <div className="site-footer__line" />
        <div className="site-footer__bottom">
          <div className="site-footer__policy">
            {/* 체험용 약관 페이지 (2026-11-17 결정) */}
            <div className="site-footer__policy-links">
              <Link to="/terms">이용약관</Link>
              <Link to="/privacy">개인정보처리방침</Link>
            </div>
            <p className="site-footer__biz">포트폴리오용 체험 사이트예요. 실제 판매는 하지 않아요.</p>
          </div>
          <p className="site-footer__copy">© FIT'SUP</p>
        </div>
      </div>
    </footer>
  )
}
