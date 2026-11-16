import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import BoardListItem from '../components/BoardListItem.jsx'
import { Alert } from '../components/Icons.jsx'
import { useStore } from '../store/StoreContext.jsx'
import './OrderPages.css'

const TEL_RE = /^01[016789]-?\d{3,4}-?\d{4}$/

// 입력 검사 기준은 [미정] — 빈칸과 연락처 형식만 확인
function validate(form) {
  const err = {}
  if (!form.rcv.trim()) err.rcv = '받는 분의 이름을 입력해 주세요.'
  if (!TEL_RE.test(form.tel.trim())) err.tel = '연락처를 숫자로 입력해 주세요. 예: 010-1234-5678'
  if (!form.addr.trim()) err.addr = '우편번호와 도로명주소, 상세주소를 입력해 주세요.'
  return err
}

function Field({ id, label, type = 'text', placeholder, value, error, onChange }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        className={`input${error ? ' is-error' : ''}`}
        placeholder={placeholder}
        value={value}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && (
        <p id={`${id}-err`} className="field-error">
          <Alert strokeWidth={2.2} />
          {error}
        </p>
      )}
    </div>
  )
}

// P04 주문·결제
export default function CheckoutPage() {
  const { cart, completeOrder } = useStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ rcv: '', tel: '', addr: '' })
  const [errors, setErrors] = useState({})
  const n = cart.length

  if (!n) return <Navigate to="/cart" replace />

  const set = (key) => (v) => setForm((f) => ({ ...f, [key]: v }))

  const onPay = () => {
    const err = validate(form)
    setErrors(err)
    const first = ['rcv', 'tel', 'addr'].find((k) => err[k])
    if (first) {
      document.getElementById(first)?.focus()
      return
    }
    completeOrder()
    navigate('/checkout/complete', { replace: true })
  }

  return (
    <div data-id="P04" className="page">
      <main className="container work">
        <h1 className="page-title">주문·결제</h1>

        <section data-id="S04-1" aria-labelledby="ord-check" className="work__first">
          <h2 id="ord-check" className="work__title">
            주문할 보드와 구성을 확인해 주세요
          </h2>
          <ul className="board-list">
            {cart.map((it) => (
              <BoardListItem key={it.id} design={it.design} />
            ))}
          </ul>
        </section>

        <section data-id="S04-2" aria-labelledby="ship-title" className="ship-box">
          <h2 id="ship-title" className="work__title">
            보드를 받으실 정보를 입력해 주세요
          </h2>
          <p className="chip chip--notice">
            <Alert />
            체험용 입력란이에요. 실제 개인정보를 입력하지 마세요.
          </p>
          <div className="ship-box__row">
            <Field
              id="rcv"
              label="받는 분"
              placeholder="받는 분의 이름을 입력해 주세요"
              value={form.rcv}
              error={errors.rcv}
              onChange={set('rcv')}
            />
            <Field
              id="tel"
              type="tel"
              label="연락처"
              placeholder="휴대전화 번호를 입력해 주세요 · 예: 010-1234-5678"
              value={form.tel}
              error={errors.tel}
              onChange={set('tel')}
            />
          </div>
          <div className="ship-box__addr">
            <Field
              id="addr"
              label="주소"
              placeholder="우편번호와 도로명주소, 상세주소를 입력해 주세요"
              value={form.addr}
              error={errors.addr}
              onChange={set('addr')}
            />
          </div>
        </section>

        <section data-id="S04-3" aria-labelledby="pay-title" className="summary-box summary-box--pay">
          <div className="summary-box__text">
            <h2 id="pay-title" className="work__title">
              실제 결제 없이 주문을 체험해 보세요
            </h2>
            <p className="summary-box__strong">주문 상품 {n}개 · 상품 금액과 배송비는 판매 정책 확정 후 표시돼요.</p>
            <p className="summary-box__note">이 화면은 가상 결제 체험용으로, 카드 정보 입력이나 실제 금액 청구가 없어요.</p>
          </div>
          <button data-id="B04-1" type="button" className="btn btn--primary" onClick={onPay}>
            가상 결제 완료하기
          </button>
        </section>
      </main>
    </div>
  )
}
