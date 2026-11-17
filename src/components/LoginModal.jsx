import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/StoreContext.jsx'
import { Alert, ArrowRight, Check } from './Icons.jsx'

// 로그인 창 → (회원가입) → 로그인 완료 창 (한 창 안에서 단계가 바뀜)
// 실제 회원 서버가 없어 입력값은 형식만 확인하고 어디에도 보내거나 저장하지 않음
// - notice: 로그인이 필요한 이유 (예: "주문·결제는 로그인하면 가능해요.")
// - doneLabel / onDone: 로그인 완료 창의 버튼 (하던 일로 이어서 가기)
// - onClose: 로그인 전 취소·닫기
// - onLoggedIn: 로그인한 순간 알림 (완료 창을 띄워 둘 때 씀)

const ID_RE = /^[A-Za-z0-9._@-]{4,30}$/

function Field({ id, label, inputRef, error, help, ...rest }) {
  const describedBy = [error && `${id}-err`, help && `${id}-help`].filter(Boolean).join(' ') || undefined
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        ref={inputRef}
        id={id}
        className={`input${error ? ' is-error' : ''}`}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        {...rest}
      />
      {help && !error && (
        <p id={`${id}-help`} className="small-help">
          {help}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="field-error">
          <Alert strokeWidth={2.2} />
          {error}
        </p>
      )}
    </div>
  )
}

export default function LoginModal({ notice, doneLabel = '확인', onLoggedIn, onDone, onClose }) {
  const { login } = useStore()
  const [step, setStep] = useState('form') // 'form' | 'signup' | 'done'
  const [joined, setJoined] = useState(false)
  const [f, setF] = useState({ id: '', pw: '', newId: '', newPw: '', newPw2: '', agree: false })
  const [errors, setErrors] = useState({})
  const firstRef = useRef(null)
  const doneRef = useRef(null)

  const set = (key) => (e) => setF((v) => ({ ...v, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  // 로그인 완료 뒤에는 닫아도 하던 일로 이어서 감
  const dismiss = step === 'done' ? onDone : onClose

  useEffect(() => {
    if (step === 'done') doneRef.current?.focus()
    else firstRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && dismiss()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [step, dismiss])

  const finish = (fromSignup) => {
    onLoggedIn?.()
    login()
    setJoined(fromSignup)
    setStep('done')
  }

  // 첫 오류 칸으로 초점 이동
  const check = (err, order) => {
    setErrors(err)
    const first = order.find((k) => err[k])
    if (first) document.getElementById(`login-${first}`)?.focus()
    return !first
  }

  const submitLogin = (e) => {
    e.preventDefault()
    const err = {}
    if (!f.id.trim()) err.id = '아이디를 입력해 주세요.'
    if (f.pw.length < 4) err.pw = '비밀번호를 4자 이상 입력해 주세요.'
    if (check(err, ['id', 'pw'])) finish(false)
  }

  const submitSignup = (e) => {
    e.preventDefault()
    const err = {}
    if (!ID_RE.test(f.newId.trim())) err.newId = '아이디를 영문·숫자 4자 이상으로 입력해 주세요.'
    if (f.newPw.length < 4) err.newPw = '비밀번호를 4자 이상 입력해 주세요.'
    if (!err.newPw && f.newPw2 !== f.newPw) err.newPw2 = '비밀번호가 서로 달라요. 한 번 더 확인해 주세요.'
    if (!f.agree) err.agree = '이용약관과 개인정보처리방침에 동의해 주세요.'
    if (check(err, ['newId', 'newPw', 'newPw2', 'agree'])) finish(true)
  }

  const go = (next) => {
    setErrors({})
    setStep(next)
  }

  return (
    <div className="scrim" onMouseDown={(e) => e.target === e.currentTarget && dismiss()}>
      {step === 'form' && (
        <form role="dialog" aria-modal="true" aria-labelledby="login-dialog-title" className="dialog login-dialog" onSubmit={submitLogin} noValidate>
          <h2 id="login-dialog-title" className="dialog__title">
            로그인
          </h2>
          {notice && (
            <p className="chip chip--notice login-dialog__notice">
              <Alert size={18} strokeWidth={2.2} />
              {notice}
            </p>
          )}
          <Field
            id="login-id"
            label="아이디"
            inputRef={firstRef}
            autoComplete="username"
            placeholder="아이디 또는 이메일을 입력해 주세요"
            value={f.id}
            error={errors.id}
            onChange={set('id')}
          />
          <Field
            id="login-pw"
            label="비밀번호"
            type="password"
            autoComplete="current-password"
            placeholder="비밀번호를 입력해 주세요"
            value={f.pw}
            error={errors.pw}
            onChange={set('pw')}
          />
          <p className="login-dialog__switch">
            아직 회원이 아니에요?{' '}
            <button data-id="B06-4" type="button" className="btn-text" onClick={() => go('signup')}>
              회원가입
            </button>
          </p>
          <div className="dialog__actions">
            <button type="button" className="btn-text" onClick={onClose}>
              취소
            </button>
            <button data-id="B06-3" type="submit" className="btn btn--md">
              로그인
            </button>
          </div>
        </form>
      )}

      {step === 'signup' && (
        <form role="dialog" aria-modal="true" aria-labelledby="signup-title" className="dialog login-dialog" onSubmit={submitSignup} noValidate>
          <h2 id="signup-title" className="dialog__title">
            회원가입
          </h2>
          <p className="login-dialog__hint">체험용 가입이라 입력한 정보는 어디에도 저장하지 않아요.</p>
          <Field
            id="login-newId"
            label="아이디"
            inputRef={firstRef}
            autoComplete="username"
            placeholder="영문·숫자 4자 이상"
            value={f.newId}
            error={errors.newId}
            onChange={set('newId')}
          />
          <Field
            id="login-newPw"
            label="비밀번호"
            type="password"
            autoComplete="new-password"
            placeholder="4자 이상"
            value={f.newPw}
            error={errors.newPw}
            onChange={set('newPw')}
          />
          <Field
            id="login-newPw2"
            label="비밀번호 확인"
            type="password"
            autoComplete="new-password"
            placeholder="비밀번호를 한 번 더 입력해 주세요"
            value={f.newPw2}
            error={errors.newPw2}
            onChange={set('newPw2')}
          />
          <div className="field">
            <label className="login-dialog__agree">
              <input
                id="login-agree"
                type="checkbox"
                checked={f.agree}
                aria-invalid={errors.agree ? 'true' : undefined}
                aria-describedby={errors.agree ? 'login-agree-err' : undefined}
                onChange={set('agree')}
              />
              <span>
                <Link to="/terms" target="_blank" rel="noopener">
                  이용약관
                </Link>
                과{' '}
                <Link to="/privacy" target="_blank" rel="noopener">
                  개인정보처리방침
                </Link>
                에 동의해요
              </span>
            </label>
            {errors.agree && (
              <p id="login-agree-err" className="field-error">
                <Alert strokeWidth={2.2} />
                {errors.agree}
              </p>
            )}
          </div>
          <div className="dialog__actions">
            <button type="button" className="btn-text" onClick={() => go('form')}>
              로그인으로 돌아가기
            </button>
            <button data-id="B06-5" type="submit" className="btn btn--md">
              가입하고 로그인
            </button>
          </div>
        </form>
      )}

      {step === 'done' && (
        <div role="dialog" aria-modal="true" aria-labelledby="login-done-title" className="dialog login-dialog login-dialog--done">
          <p id="login-done-title" className="login-dialog__done">
            <Check size={30} strokeWidth={3} />
            {joined ? '가입하고 로그인 되었습니다.' : '로그인 되었습니다.'}
          </p>
          <div className="dialog__actions">
            <button ref={doneRef} data-id="B06-2" type="button" className="btn btn--primary btn--primary-sm" onClick={onDone}>
              {doneLabel}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
