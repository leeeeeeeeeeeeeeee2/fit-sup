import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import BoardListItem from '../components/BoardListItem.jsx'
import { ArrowRight } from '../components/Icons.jsx'
import LoginModal from '../components/LoginModal.jsx'
import { SHIPPING_NOTE } from '../data/options.js'
import { VAT_NOTE, cartCount, cartTotal, won } from '../lib/price.js'
import { useStore } from '../store/StoreContext.jsx'
import './OrderPages.css'

// P03 장바구니
export default function CartPage() {
  const { cart, removeFromCart, setQty, loggedIn } = useStore()
  const navigate = useNavigate()
  const [loginOpen, setLoginOpen] = useState(false)
  const n = cartCount(cart)

  // 주문·결제는 로그인이 필요: 이 자리에서 로그인 창을 띄우고, 완료하면 주문·결제로 이어서 감
  const onOrder = (e) => {
    if (loggedIn) return
    e.preventDefault()
    setLoginOpen(true)
  }

  return (
    <div data-id="P03" className="page">
      <main className="container work">
        <h1 className="page-title">장바구니</h1>

        <section data-id="S03-1" aria-labelledby="cart-list" className="work__first">
          <h2 id="cart-list" className="work__title">
            담은 보드 {n}개
          </h2>
          {n ? (
            <ul className="board-list">
              {cart.map((it) => (
                <BoardListItem key={it.id} item={it} onQty={(q) => setQty(it.id, q)} onRemove={() => removeFromCart(it.id)} />
              ))}
            </ul>
          ) : (
            <p className="empty-box">
              아직 담은 보드가 없어요. <Link to="/build">보드 만들기</Link>에서 첫 보드를 만들어 보세요.
            </p>
          )}
        </section>

        <section data-id="S03-2" aria-labelledby="order-sum" className="summary-box">
          <div className="summary-box__text">
            <h2 id="order-sum" className="work__title">
              주문 요약
            </h2>
            <p>
              주문 예정 보드 {n}개 · 상품 금액 합계 <strong>{won(cartTotal(cart))}</strong> {VAT_NOTE}
            </p>
            <p className="summary-box__ship">{SHIPPING_NOTE}</p>
          </div>
          {n ? (
            <Link data-id="B03-2" to="/checkout" className="btn btn--primary" onClick={onOrder}>
              주문하기
              <ArrowRight />
            </Link>
          ) : (
            <button data-id="B03-2" type="button" className="btn btn--primary" disabled>
              주문하기
              <ArrowRight />
            </button>
          )}
        </section>
      </main>
      {loginOpen && (
        <LoginModal
          notice="주문·결제는 로그인하면 가능해요. 담은 보드는 그대로 남아 있어요."
          doneLabel="이어서 주문하기"
          onDone={() => navigate('/checkout')}
          onClose={() => setLoginOpen(false)}
        />
      )}
    </div>
  )
}
