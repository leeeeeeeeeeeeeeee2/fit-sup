import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/StoreContext.jsx'
import { Alert, ArrowRight, Check } from './Icons.jsx'

// 로그인 창 → 로그인 완료 창 (한 창 안에서 두 단계)
// 실제 회원 서버가 없어 입력값은 형식만 확인하고 어디에도 보내거나 저장하지 않음
// - notice: 로그인이 필요한 이유 (예: "주문·결제는 로그인하면 가능해요.")
// - doneLabel / onDone: 로그인 완료 창의 버튼 (하던 일로 이어서 가기)
// - onClose: 로그인 전 취소·닫기
// - onLoggedIn: 로그인한 순간 알림 (완료 창을 띄워 둘 때 씀)
export default function LoginModal({ notice, doneLabel = '확인', onLoggedIn, onDone, onClose }) {
  const { login } = useStore()
  const [step, setStep] = useState('form')
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const [errors, setErrors] = useState({})
  const idRef = useRef(null)
  const pwRef = useRef(null)
  const doneRef = useRef(null)

  // 로그인 완료 뒤에는 닫아도 하던 일로 이어서 감
  const dismiss = step === 'done' ? onDone : onClose

  useEffect(() => {
    if (step === 'form') idRef.current?.focus()
    else doneRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && dismiss()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [step, dismiss])

  const submit = (e) => {
    e.preventDefault()
    const err = {}
    if (!id.trim()) err.id = '아이디를 입력해 주세요.'
    if (pw.length < 4) err.pw = '비밀번호를 4자 이상 입력해 주세요.'
    setErrors(err)
    if (err.id) return idRef.current?.focus()
    if (err.pw) return pwRef.current?.focus()
    onLoggedIn?.()
    login()
    setStep('done')
  }

  return (
    <div className="scrim" onMouseDown={(e) => e.target === e.currentTarget && dismiss()}>
      {step === 'form' ? (
        <form
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-dialog-title"
          className="dialog login-dialog"
          onSubmit={submit}
          noValidate
        >
          <h2 id="login-dialog-title" className="dialog__title">
            로그인
          </h2>
          {notice && (
            <p className="chip chip--notice login-dialog__notice">
              <Alert size={18} strokeWidth={2.2} />
              {notice}
            </p>
          )}
          <div className="field">
            <label htmlFor="login-id">아이디</label>
            <input
              ref={idRef}
              id="login-id"
              className={`input${errors.id ? ' is-error' : ''}`}
              autoComplete="username"
              placeholder="아이디 또는 이메일을 입력해 주세요"
              value={id}
              aria-invalid={errors.id ? 'true' : undefined}
              aria-describedby={errors.id ? 'login-id-err' : undefined}
              onChange={(e) => setId(e.target.value)}
            />
            {errors.id && (
              <p id="login-id-err" className="field-error">
                <Alert strokeWidth={2.2} />
                {errors.id}
              </p>
            )}
          </div>
          <div className="field">
            <label htmlFor="login-pw">비밀번호</label>
            <input
              ref={pwRef}
              id="login-pw"
              type="password"
              className={`input${errors.pw ? ' is-error' : ''}`}
              autoComplete="current-password"
              placeholder="비밀번호를 입력해 주세요"
              value={pw}
              aria-invalid={errors.pw ? 'true' : undefined}
              aria-describedby={errors.pw ? 'login-pw-err' : undefined}
              onChange={(e) => setPw(e.target.value)}
            />
            {errors.pw && (
              <p id="login-pw-err" className="field-error">
                <Alert strokeWidth={2.2} />
                {errors.pw}
              </p>
            )}
          </div>
          <div className="dialog__actions">
            <button type="button" className="btn-text" onClick={onClose}>
              취소
            </button>
            <button data-id="B06-3" type="submit" className="btn btn--md">
              로그인
            </button>
          </div>
        </form>
      ) : (
        <div role="dialog" aria-modal="true" aria-labelledby="login-done-title" className="dialog login-dialog login-dialog--done">
          <p id="login-done-title" className="login-dialog__done">
            <Check size={30} strokeWidth={3} />
            로그인 되었습니다.
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
