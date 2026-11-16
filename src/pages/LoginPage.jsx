import { useNavigate } from 'react-router-dom'
import { ArrowRight, Check } from '../components/Icons.jsx'
import { useStore } from '../store/StoreContext.jsx'
import './OrderPages.css'

// P06 로그인 (버튼만 누르면 로그인되는 체험용)
export default function LoginPage() {
  const { loggedIn, login, logout, pending, setPending } = useStore()
  const navigate = useNavigate()

  const onLogin = () => {
    login()
    if (pending) {
      // 저장하다 왔으면 P02 › S02-3으로 돌아가 이어서 진행
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
            <>
              <p id="login-title" className="login__text">
                지금 로그인되어 있어요.
              </p>
              <button data-id="B06-2" type="button" className="btn btn--md login__cta" onClick={logout}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              {pending && (
                <p className="chip chip--notice login__chip">
                  <Check size={18} strokeWidth={2.2} />
                  로그인하면 하던 디자인 저장을 이어서 해 드릴게요. 만들던 디자인은 그대로 남아 있어요.
                </p>
              )}
              <h2 id="login-title" className={`login__title${pending ? '' : ' login__title--first'}`}>
                내 보드를 저장하려면 로그인해 주세요
              </h2>
              <p className="login__text">
                로그인하면 만든 디자인을 내 디자인에서 다시 열어 꾸밀 수 있어요. 디자인 저장과 미리보기 이미지 저장을
                계속하려면 로그인이 필요해요.
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
