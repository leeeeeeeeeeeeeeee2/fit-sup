import { Link } from 'react-router-dom'
import BoardListItem from '../components/BoardListItem.jsx'
import { ArrowRight } from '../components/Icons.jsx'
import { cartTotal, won } from '../lib/price.js'
import { useStore } from '../store/StoreContext.jsx'
import './OrderPages.css'

// P03 장바구니
export default function CartPage() {
  const { cart, removeFromCart } = useStore()
  const n = cart.length

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
                <BoardListItem key={it.id} design={it.design} onRemove={() => removeFromCart(it.id)} />
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
              주문 예정 보드 {n}개 · 상품 금액 합계 <strong>{won(cartTotal(cart))}</strong>
            </p>
          </div>
          {n ? (
            <Link data-id="B03-2" to="/checkout" className="btn btn--primary">
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
    </div>
  )
}
