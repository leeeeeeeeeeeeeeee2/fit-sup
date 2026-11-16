import { useNavigate } from 'react-router-dom'
import { Alert, ArrowRight } from '../components/Icons.jsx'
import { useStore } from '../store/StoreContext.jsx'
import './OrderPages.css'

// 로그인하러 오기 전에 하던 일별 안내 문구
const PENDING_TEXT = {
  cart: { title: '장바구니에 담으려면 로그인해 주세요', notice: '장바구니 담기는 로그인하면 가능해요.' },
  save: { title: '디자인을 저장하려면 로그인해 주세요', notice: '디자인 저장은 로그인하면 가능해요.' },
  image: { title: '이미지를 저장하려면 로그인해 주세요', notice: '이미지 저장은 로그인하면 가능해요.' },
}

// P06 로그인 (버튼만 누르면 로그인되는 체험용)
export default function LoginPage() {
  const { loggedIn, login, pending, setPending } = useStore()
  const navigate = useNavigate()
  const text = PENDING_TEXT[pending]

  const onLogin = () => {
    login()
    if (pending) {
      // 하던 일이 있으면 P02 › S02-3으로 돌아가 이어서 진행
      setPending(null)
      navigate('/build#S02-3', { state: { resume: pending } })
    }
  }

  return (
    <div data-id="P06" className="page">
      <main className="container work">
        <h1 className="page-title">로그인</h1>
        <section data-id="S06-1" aria-labelledby="login-title" className="panel login work__first" role="status">
          {loggedIn ? (
            <p id="login-title" className="login__text login__done">
              로그인 되었습니다.
            </p>
          ) : (
            <>
              {text && (
                <p className="chip chip--notice login__chip">
                  <Alert size={18} strokeWidth={2.2} />
                  {text.notice} 로그인하면 이어서 진행해 드릴게요. 만들던 디자인은 그대로 남아 있어요.
                </p>
              )}
              <h2 id="login-title" className={`login__title${text ? '' : ' login__title--first'}`}>
                {text ? text.title : '내 보드를 저장하려면 로그인해 주세요'}
              </h2>
              <p className="login__text">
                로그인하면 장바구니에 보드를 담고, 만든 디자인을 저장하고, 미리보기 이미지를 내려받을 수 있어요.
              </p>
              <button data-id="B06-1" type="button" className="btn btn--primary login__cta" onClick={onLogin}>
                로그인하고 계속하기
                <ArrowRight />
              </button>
            </>
          )}
        </section>
      </main>
    </div>
  )
}
