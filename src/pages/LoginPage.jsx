import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginModal from '../components/LoginModal.jsx'
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

// P06 로그인: 안내 → 로그인 창 → 로그인 완료 창 → 하던 일로 이어서
// 다른 화면에서 로그인이 필요해 왔으면 로그인 창을 바로 띄움
export default function LoginPage() {
  const { loggedIn, pending, setPending } = useStore()
  const navigate = useNavigate()
  const text = PENDING_TEXT[pending]
  const [dialogOpen, setDialogOpen] = useState(() => !loggedIn && Boolean(text))
  const ctaRef = useRef(null)

  const closeDialog = useCallback(() => {
    setDialogOpen(false)
    requestAnimationFrame(() => ctaRef.current?.focus())
  }, [])

  // 로그인 완료 후: 하던 일로 돌아감 (하던 일이 없으면 창만 닫음)
  const onContinue = () => {
    setDialogOpen(false)
    if (!pending) return
    setPending(null)
    if (pending === 'review') navigate('/reviews', { state: { resume: 'review' } })
    // 장바구니는 자동으로 담지 않고 담기 버튼이 있는 곳으로만 돌려보냄
    else if (pending === 'cart') navigate('/build#S02-4')
    else navigate('/build#S02-3', { state: { resume: pending } })
  }

  const noticeText = text && `${text.notice} ${text.next ?? '로그인하면 이어서 진행할 수 있어요.'} 만들던 디자인은 그대로 남아 있어요.`

  return (
    <div data-id="P06" className="page">
      <main className="container work">
        <h1 className="page-title">로그인</h1>
        <section data-id="S06-1" aria-labelledby="login-title" className="panel login work__first" role="status">
          {loggedIn && !dialogOpen ? (
            <>
              <p id="login-title" className="login__text login__done">
                <Check size={30} strokeWidth={3} />
                로그인 되었습니다.
              </p>
              {text && (
                <button type="button" className="btn btn--primary login__cta" onClick={onContinue}>
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
                  {noticeText}
                </p>
              )}
              <h2 id="login-title" className={`login__title${text ? '' : ' login__title--first'}`}>
                {text ? text.title : '내 보드를 저장하려면 로그인해 주세요'}
              </h2>
              <p className="login__text">
                로그인하면 장바구니에 보드를 담고, 주문·결제하고, 만든 디자인을 저장하고, 미리보기 이미지를 내려받을 수 있어요.
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
      {dialogOpen && (
        <LoginModal
          notice={text ? text.notice : undefined}
          doneLabel={text ? text.cta : '확인'}
          onDone={onContinue}
          onClose={closeDialog}
        />
      )}
    </div>
  )
}
