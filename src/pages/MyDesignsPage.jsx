import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BoardThumb } from '../components/Board.jsx'
import { Lock, Trash } from '../components/Icons.jsx'
import { boardName, describe } from '../lib/design.js'
import { useStore } from '../store/StoreContext.jsx'
import './OrderPages.css'

// P05 내 디자인 (로그인 필요)
export default function MyDesignsPage() {
  const { loggedIn, designs, setDraft, addToCart, removeDesign, showToast } = useStore()
  const navigate = useNavigate()
  // 삭제 확인 중인 디자인 id (한 번 더 눌러야 지워짐)
  const [confirmId, setConfirmId] = useState(null)

  if (!loggedIn) {
    return (
      <div data-id="P05" className="page">
        <main className="container work">
          <h1 className="page-title">내 디자인</h1>
          <section data-id="S05-1" aria-labelledby="saved-title" className="panel panel--center work__first">
            <Lock />
            <h2 id="saved-title" className="work__title panel__gap">
              저장한 보드를 이어서 꾸며보세요
            </h2>
            <p className="chip chip--notice panel__chip">내 디자인은 로그인한 뒤 볼 수 있어요.</p>
            <Link data-id="B05-3" to="/login" className="btn btn--primary panel__cta">
              로그인하기
            </Link>
          </section>
        </main>
      </div>
    )
  }

  const reEdit = (design) => {
    setDraft(design)
    navigate('/build#S02-3')
  }

  const addCart = (design) => {
    addToCart(design)
    showToast({
      message: '장바구니에 담았어요.',
      actions: [{ id: 'B02-7', label: '장바구니 보기', to: '/cart' }],
    })
    // 보드 만들기와 같이 담고 나면 메인으로 부드럽게 넘어감
    navigate('/', { viewTransition: true })
  }

  return (
    <div data-id="P05" className="page">
      <main className="container work">
        <h1 className="page-title">내 디자인</h1>
        <section data-id="S05-1" aria-labelledby="saved-title" className="work__first">
          <h2 id="saved-title" className="work__title">
            저장한 보드를 이어서 꾸며보세요
          </h2>
          {designs.length ? (
            <ul className="design-grid">
              {designs.map(({ id, design }) => (
                <li key={id} className="design-card">
                  <span className="design-card__img">
                    <BoardThumb design={design} width={260} height={104} />
                  </span>
                  <div className="design-card__body">
                    <p className="design-card__name">{`${boardName(design)} · ${design.length}인치`}</p>
                    <p className="design-card__spec">{describe(design)}</p>
                    <div className="design-card__actions">
                      <a
                        data-id="B05-1"
                        href="/build#S02-3"
                        className="btn btn--sm"
                        onClick={(e) => {
                          e.preventDefault()
                          reEdit(design)
                        }}
                      >
                        다시 꾸미기
                      </a>
                      <button
                        data-id="B05-2"
                        type="button"
                        className="btn btn--primary btn--primary-sm"
                        onClick={() => addCart(design)}
                      >
                        장바구니 담기
                      </button>
                    </div>
                    {confirmId === id ? (
                      <p className="design-card__confirm" role="group" aria-label="디자인 삭제 확인">
                        이 디자인을 지울까요?
                        <button
                          type="button"
                          className="design-card__del is-danger"
                          onClick={() => {
                            removeDesign(id)
                            setConfirmId(null)
                            showToast({ message: '디자인을 지웠어요.' })
                          }}
                        >
                          지우기
                        </button>
                        <button type="button" className="design-card__del" onClick={() => setConfirmId(null)}>
                          취소
                        </button>
                      </p>
                    ) : (
                      <button
                        data-id="B05-4"
                        type="button"
                        className="design-card__del design-card__del--start"
                        aria-label={`${boardName(design)} 디자인 삭제`}
                        onClick={() => setConfirmId(id)}
                      >
                        <Trash size={16} />
                        삭제
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-box">저장한 디자인이 아직 없어요. 보드 만들기에서 디자인을 저장해 보세요.</p>
          )}
        </section>
      </main>
    </div>
  )
}
