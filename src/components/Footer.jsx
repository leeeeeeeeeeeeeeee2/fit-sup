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
            {/* 이용약관·개인정보처리방침 페이지는 [미정] */}
            <div className="site-footer__policy-links">
              <a href="#">이용약관</a>
              <a href="#">개인정보처리방침</a>
            </div>
            <p className="site-footer__biz">
              상호 · 대표자 · 사업자등록번호 · 통신판매업 신고번호 · 주소 · 고객센터는 판매 정책이 확정되면 이곳에 표시해요.
            </p>
          </div>
          <p className="site-footer__copy">© FIT'SUP</p>
        </div>
      </div>
    </footer>
  )
}
