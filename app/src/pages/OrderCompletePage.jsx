import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../store/StoreContext.jsx'
import './OrderPages.css'

// P04 › S04-4 주문 완료
export default function OrderCompletePage() {
  const { lastOrderCount, resetDraft } = useStore()
  const navigate = useNavigate()

  const startNew = (e) => {
    e.preventDefault()
    resetDraft()
    navigate('/build')
  }

  return (
    <div data-id="P04" className="page">
      <main className="container work work--center">
        <section data-id="S04-4" aria-labelledby="done-title" role="status" className="panel panel--center">
          <svg width="96" height="96" viewBox="0 0 96 96" aria-hidden="true">
            <circle cx="48" cy="48" r="44" fill="#1E3FD0" />
            <path
              d="M28 49l13 13 27-28"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h2 id="done-title" className="panel__display">
            가상 주문이 완료되었어요
          </h2>
          <p className="panel__desc">
            선택한 보드 {lastOrderCount}개의 주문 흐름을 끝까지 체험했어요. 실제 결제·상품 제작·배송은 진행되지 않아요.
          </p>
          <div className="panel__actions">
            <a data-id="B04-2" href="/build" className="btn btn--md" onClick={startNew}>
              새 보드 만들기
            </a>
            <Link data-id="B04-3" to="/" className="btn btn--md">
              메인으로
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
