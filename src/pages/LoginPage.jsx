import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Alert, ArrowRight, Check } from '../components/Icons.jsx'
import { useStore } from '../store/StoreContext.jsx'
import './OrderPages.css'

// 로그인하러 오기 전에 하던 일별 안내 문구
const PENDING_TEXT = {
  cart: {
    title: '장바구니에 담으려면 로그인해 주세요',
    notice: '장바구니 담기는 로그인하면 가능해요.',
    next: '로그인 후 장바구니 담기를 다시 눌러 주세요.',
    cta: '보드 만들기로 돌아가기',
  },
  save: { title: '디자인을 저장하려면 로그인해 주세요', notice: '디자인 저장은 로그인하면 가능해요.', cta: '이어서 디자인 저장하기' },
  image: { title: '이미지를 저장하려면 로그인해 주세요', notice: '이미지 저장은 로그인하면 가능해요.', cta: '이어서 이미지 저장하기' },
  review: { title: '리뷰를 쓰려면 로그인해 주세요', notice: '리뷰 쓰기는 로그인하면 가능해요.', cta: '이어서 리뷰 쓰기' },
}

// 로그인 창 (아이디·비밀번호 입력)
// 실제 회원 서버가 없어 입력값은 확인만 하고 어디에도 보내거나 저장하지 않음
function LoginDialog({ onSubmit, onClose }) {
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const [errors, setErrors] = useState({})
  const idRef = useRef(null)

  useEffect(() => {
    idRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const submit = (e) => {
    e.preventDefault()
    const err = {}
    if (!id.trim()) err.id = '아이디를 입력해 주세요.'
    if (pw.length < 4) err.pw = '비밀번호를 4자 이상 입력해 주세요.'
    setErrors(err)
    if (err.id) return idRef.current?.focus()
    if (err.pw) return document.getElementById('login-pw')?.focus()
    onSubmit()
  }

  return (
    <div className="scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form role="dialog" aria-modal="true" aria-labelledby="login-dialog-title" className="dialog login-dialog" onSubmit={submit} noValidate>
        <h2 id="login-dialog-title" className="dialog__title">
          로그인
        </h2>
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
    </div>
  )
}

// P06 로그인: 안내 → 로그인 창 → 로그인 완료 → 계속하기
export default function LoginPage() {
  const { loggedIn, login, pending, setPending } = useStore()
  const navigate = useNavigate()
  const [dialogOpen, setDialogOpen] = useState(false)
  const ctaRef = useRef(null)
  const text = PENDING_TEXT[pending]

  const closeDialog = useCallback(() => {
    setDialogOpen(false)
    requestAnimationFrame(() => ctaRef.current?.focus())
  }, [])

  const onLoggedIn = () => {
    login()
    setDialogOpen(false)
  }

  // 로그인 완료 후 [계속하기]: 하던 일로 돌아감
  const onContinue = () => {
    setPending(null)
    if (pending === 'review') navigate('/reviews', { state: { resume: 'review' } })
    // 장바구니는 자동으로 담지 않고 담기 버튼이 있는 곳으로만 돌려보냄
    else if (pending === 'cart') navigate('/build#S02-4')
    else navigate('/build#S02-3', { state: { resume: pending } })
  }

  return (
    <div data-id="P06" className="page">
      <main className="container work">
        <h1 className="page-title">로그인</h1>
        <section data-id="S06-1" aria-labelledby="login-title" className="panel login work__first" role="status">
          {loggedIn ? (
            <>
              <p id="login-title" className="login__text login__done">
                <Check size={30} strokeWidth={3} />
                로그인 되었습니다.
              </p>
              {text && (
                <button data-id="B06-2" type="button" className="btn btn--primary login__cta" onClick={onContinue}>
                  {text.cta}
                  <ArrowRight />
                </button>
              )}
            </>
          ) : (
            <>
              {text && (
                <p className="chip chip--notice login__chip">
                  <Alert size={18} strokeWidth={2.2} />
                  {text.notice} {text.next ?? '로그인하면 이어서 진행할 수 있어요.'} 만들던 디자인은 그대로 남아 있어요.
                </p>
              )}
              <h2 id="login-title" className={`login__title${text ? '' : ' login__title--first'}`}>
                {text ? text.title : '내 보드를 저장하려면 로그인해 주세요'}
              </h2>
              <p className="login__text">
                로그인하면 장바구니에 보드를 담고, 만든 디자인을 저장하고, 미리보기 이미지를 내려받을 수 있어요.
              </p>
              <button
                ref={ctaRef}
                data-id="B06-1"
                type="button"
                className="btn btn--primary login__cta"
                onClick={() => setDialogOpen(true)}
              >
                로그인하고 계속하기
                <ArrowRight />
              </button>
            </>
          )}
        </section>
      </main>
      {dialogOpen && <LoginDialog onSubmit={onLoggedIn} onClose={closeDialog} />}
    </div>
  )
}
