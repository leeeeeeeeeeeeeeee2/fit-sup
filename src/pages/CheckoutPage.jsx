import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import BoardListItem from '../components/BoardListItem.jsx'
import LoginModal from '../components/LoginModal.jsx'
import { Alert } from '../components/Icons.jsx'
import { cartTotal, won } from '../lib/price.js'
import { useStore } from '../store/StoreContext.jsx'
import './OrderPages.css'

const TEL_RE = /^01[016789]-?\d{3,4}-?\d{4}$/

const BANKS = ['KB국민은행', '신한은행', '우리은행', '하나은행', 'NH농협은행', 'IBK기업은행', '카카오뱅크', '토스뱅크']

// 입력 순서 (첫 오류 칸으로 이동할 때 씀)
const ORDER = ['rcv', 'tel', 'addr', 'cardNo', 'cardExp', 'cardCvc', 'bank', 'payer']

// 카드번호: 숫자 16자리를 4자리씩 띄어 씀
const formatCard = (v) =>
  v
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
// 유효기간: MM/YY
const formatExp = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4)
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}

function validExp(v) {
  const m = /^(\d{2})\/(\d{2})$/.exec(v)
  if (!m) return false
  const month = Number(m[1])
  const year = 2000 + Number(m[2])
  if (month < 1 || month > 12) return false
  const now = new Date()
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1)
}

// 빈칸·형식 확인
function validate(form, method) {
  const err = {}
  if (!form.rcv.trim()) err.rcv = '받는 분의 이름을 입력해 주세요.'
  if (!TEL_RE.test(form.tel.trim())) err.tel = '연락처를 숫자로 입력해 주세요. 예: 010-1234-5678'
  if (!form.addr.trim()) err.addr = '우편번호와 도로명주소, 상세주소를 입력해 주세요.'
  if (method === 'card') {
    if (form.cardNo.replace(/\D/g, '').length !== 16) err.cardNo = '카드번호 16자리를 입력해 주세요.'
    if (!validExp(form.cardExp)) err.cardExp = '유효기간을 MM/YY 형식으로 입력해 주세요. 예: 08/29'
    if (!/^\d{3}$/.test(form.cardCvc)) err.cardCvc = '카드 뒷면의 CVC 3자리를 입력해 주세요.'
  } else {
    if (!form.bank) err.bank = '이체할 은행을 선택해 주세요.'
    if (!form.payer.trim()) err.payer = '예금주(입금자) 이름을 입력해 주세요.'
  }
  return err
}

function Field({ id, label, type = 'text', placeholder, value, error, onChange, ...rest }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        {...rest}
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
  const { cart, buyNow, loggedIn, completeOrder } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  // 주문하기(바로 결제)로 왔으면 그 보드 하나만, 아니면 장바구니 전체를 결제
  const now = Boolean(location.state?.now && buyNow)
  const items = now ? [buyNow] : cart
  // 카드 정보는 이 화면 안에서만 쓰고 저장하지 않음
  const [form, setForm] = useState({ rcv: '', tel: '', addr: '', cardNo: '', cardExp: '', cardCvc: '', bank: '', payer: '' })
  const [method, setMethod] = useState('card')
  const [errors, setErrors] = useState({})
  // 결제 직후 장바구니가 비어도 장바구니로 돌려보내지 않게 표시
  const [paid, setPaid] = useState(false)
  // 로그인 창: 로그인하지 않은 동안(들어올 때·결제 중 로그아웃) 늘 띄움
  // 로그인한 뒤에는 완료 창을 닫을 때까지 띄워 둠
  const [loginDone, setLoginDone] = useState(false)
  const loginOpen = !loggedIn || loginDone
  const n = items.length
  const total = cartTotal(items)

  if (!n && !paid) return <Navigate to="/cart" replace />

  const set = (key) => (v) => setForm((f) => ({ ...f, [key]: v }))

  const onPay = () => {
    // 로그인하지 않으면 결제하지 않음 (이때는 로그인 창이 떠 있음)
    if (!loggedIn) return
    const err = validate(form, method)
    setErrors(err)
    const first = ORDER.find((k) => err[k])
    if (first) {
      document.getElementById(first)?.focus()
      return
    }
    const payLabel =
      method === 'card' ? `신용·체크카드 (**** ${form.cardNo.replace(/\D/g, '').slice(-4)})` : `실시간 계좌이체 (${form.bank})`
    setPaid(true)
    navigate('/checkout/complete', { replace: true })
    completeOrder({ count: n, total, payLabel }, { now })
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
            {items.map((it) => (
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
            정확한 배송을 위해 받는 분 정보를 다시 한번 확인해 주세요.
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

        <section data-id="S04-5" aria-labelledby="method-title" className="ship-box pay-box">
          <h2 id="method-title" className="work__title">
            결제 수단을 선택해 주세요
          </h2>
          <div role="radiogroup" aria-labelledby="method-title" className="pay-methods">
            {[
              { id: 'card', name: '신용·체크카드' },
              { id: 'transfer', name: '실시간 계좌이체' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={method === m.id}
                className={`pay-method${method === m.id ? ' is-on' : ''}`}
                onClick={() => {
                  setMethod(m.id)
                  setErrors({})
                }}
              >
                <span className="pay-method__dot" aria-hidden="true" />
                {m.name}
              </button>
            ))}
          </div>

          {method === 'card' ? (
            <div className="pay-fields pay-fields--card">
              <Field
                id="cardNo"
                label="카드번호"
                placeholder="0000 0000 0000 0000"
                inputMode="numeric"
                autoComplete="off"
                value={form.cardNo}
                error={errors.cardNo}
                onChange={(v) => set('cardNo')(formatCard(v))}
              />
              <Field
                id="cardExp"
                label="유효기간"
                placeholder="MM/YY"
                inputMode="numeric"
                autoComplete="off"
                value={form.cardExp}
                error={errors.cardExp}
                onChange={(v) => set('cardExp')(formatExp(v))}
              />
              <Field
                id="cardCvc"
                type="password"
                label="CVC"
                placeholder="카드 뒷면 3자리"
                inputMode="numeric"
                autoComplete="off"
                maxLength={3}
                value={form.cardCvc}
                error={errors.cardCvc}
                onChange={(v) => set('cardCvc')(v.replace(/\D/g, '').slice(0, 3))}
              />
            </div>
          ) : (
            <div className="pay-fields pay-fields--transfer">
              <div className="field">
                <label htmlFor="bank">은행</label>
                <select
                  id="bank"
                  className={`input${errors.bank ? ' is-error' : ''}`}
                  value={form.bank}
                  aria-invalid={errors.bank ? 'true' : undefined}
                  aria-describedby={errors.bank ? 'bank-err' : undefined}
                  onChange={(e) => set('bank')(e.target.value)}
                >
                  <option value="">은행을 선택해 주세요</option>
                  {BANKS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                {errors.bank && (
                  <p id="bank-err" className="field-error">
                    <Alert strokeWidth={2.2} />
                    {errors.bank}
                  </p>
                )}
              </div>
              <Field
                id="payer"
                label="예금주"
                placeholder="이체할 계좌의 예금주 이름"
                value={form.payer}
                error={errors.payer}
                onChange={set('payer')}
              />
            </div>
          )}
        </section>

        <section data-id="S04-3" aria-labelledby="pay-title" className="summary-box summary-box--pay">
          <div className="summary-box__text">
            <h2 id="pay-title" className="work__title">
              결제 금액
            </h2>
            <p className="summary-box__strong">
              주문 상품 {n}개 · 합계 {won(total)}
            </p>
          </div>
          <button data-id="B04-1" type="button" className="btn btn--primary" onClick={onPay}>
            {won(total)} 결제하기
          </button>
        </section>
      </main>
      {loginOpen && !paid && (
        <LoginModal
          notice="주문·결제는 로그인하면 가능해요. 담은 보드와 입력한 내용은 그대로 남아 있어요."
          doneLabel="이어서 결제하기"
          onLoggedIn={() => setLoginDone(true)}
          onDone={() => setLoginDone(false)}
          onClose={() => navigate(now ? '/build#S02-4' : '/cart', { replace: true })}
        />
      )}
    </div>
  )
}
