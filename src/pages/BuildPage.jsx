import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { BoardSide, BoardTop, LengthBoard, PatternSwatch } from '../components/Board.jsx'
import ImageModal from '../components/ImageModal.jsx'
import DrawSheet from '../components/DrawSheet.jsx'
import { Alert, ArrowDown, Info, Pencil } from '../components/Icons.jsx'
import { COLORS, FONTS, LENGTHS, PARTS, PATTERNS, PHRASE_MAX, SHOE_SIZES, STYLES } from '../data/options.js'
import { HEX_RE, deckHexOf, describe, eunNeun, recommend } from '../lib/design.js'
import { useStore } from '../store/StoreContext.jsx'
import './BuildPage.css'

const CART_TOAST = {
  message: '장바구니에 담았어요.',
  actions: [
    { id: 'B02-7', label: '장바구니 보기', to: '/cart' },
    { id: 'B02-8', label: '계속 꾸미기', close: true },
  ],
}
const SAVE_TOAST = {
  message: '디자인을 저장했어요.',
  actions: [{ id: 'B02-9', label: '내 디자인 보기', to: '/my-designs' }],
}

function scrollToId(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ block: 'start' })
}

// P02 보드 만들기
export default function BuildPage() {
  const { draft, updateDraft, addToCart, saveDesign, loggedIn, setPending, showToast } = useStore()
  const location = useLocation()
  const navigate = useNavigate()

  const [height, setHeight] = useState('')
  const [shoe, setShoe] = useState('')
  const [errors, setErrors] = useState({})
  const [rec, setRec] = useState(null)
  const [step, setStep] = useState(1)
  const [part, setPart] = useState('deck')
  const [hexInput, setHexInput] = useState(draft.deckHex)
  const [modalOpen, setModalOpen] = useState(false)
  // 모바일 전용 접기 (데스크톱에서는 버튼이 숨겨져 있어 영향 없음)
  const [sideOpen, setSideOpen] = useState(false)
  const [hexOpen, setHexOpen] = useState(Boolean(draft.deckHex))
  // 덱 무늬 '직접 만들기' 그리기 창 (J, 데스크톱 포함)
  const [drawOpen, setDrawOpen] = useState(false)
  const drawBtnRef = useRef(null)
  const closeDraw = useCallback(() => {
    setDrawOpen(false)
    requestAnimationFrame(() => drawBtnRef.current?.focus())
  }, [])
  const applyDraw = (drawing) => {
    updateDraft({ drawing })
    closeDraw()
  }

  const lengthCardsRef = useRef(null)
  const imageBtnRef = useRef(null)

  // 메인에서 고른 스타일, 로그인 후 이어서 할 일, 주소의 #섹션 처리
  const handledKey = useRef(null)
  useEffect(() => {
    // 같은 이동을 두 번 처리하지 않음 (개발 모드에서 effect가 두 번 실행돼도 저장은 한 번)
    if (handledKey.current === location.key) return
    handledKey.current = location.key
    const st = location.state
    if (st?.style) updateDraft({ style: st.style })
    if (st?.resume === 'save') {
      saveDesign(draft)
      showToast(SAVE_TOAST)
    }
    if (st?.resume === 'image') setModalOpen(true)
    if (location.hash) {
      const id = location.hash.slice(1)
      if (id === 'S02-3') setStep(2)
      requestAnimationFrame(() => scrollToId(id))
    } else {
      window.scrollTo(0, 0)
    }
    if (st) navigate(`${location.pathname}${location.hash}`, { replace: true, state: null })
    // 한 번만 처리 (location.key가 바뀔 때만)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key])

  // 스타일을 바꾸면 이미 받은 추천을 다시 계산
  const selectStyle = (id) => {
    updateDraft({ style: id })
    if (rec) {
      const r = recommend(rec.height, rec.shoe, id)
      setRec(r)
      updateDraft({ style: id, length: r.length })
    }
  }

  const onRecommend = () => {
    const h = Number.parseInt(height, 10)
    const s = Number.parseInt(shoe, 10)
    const next = {}
    if (!h || h < 120 || h > 210) next.height = '키를 120~210 사이 숫자로 입력해 주세요. 예: 170'
    if (!s) next.shoe = '신발 사이즈를 선택해 주세요. 예: 260'
    setErrors(next)
    if (Object.keys(next).length) {
      document.getElementById(next.height ? 'height' : 'shoe')?.focus()
      return
    }
    const r = recommend(h, s, draft.style)
    setRec(r)
    updateDraft({ length: r.length })
  }

  const onSkip = () => {
    setRec(null)
    setErrors({})
    lengthCardsRef.current?.querySelector('button')?.focus()
  }

  const goDesign = () => {
    setStep(2)
    scrollToId('S02-3')
    document.getElementById('design-title')?.focus({ preventScroll: true })
  }

  const onHexChange = (e) => {
    const v = e.target.value.toUpperCase().replace(/[^0-9A-F]/g, '').slice(0, 6)
    setHexInput(v)
    updateDraft({ deckHex: HEX_RE.test(v) ? v : '' })
  }

  const pickColor = (id) => {
    if (part === 'deck') {
      setHexInput('')
      updateDraft({ deck: id, deckHex: '' })
    } else {
      updateDraft({ [part]: id })
    }
  }

  const onAddCart = () => {
    addToCart(draft)
    showToast(CART_TOAST)
  }

  const onSave = () => {
    if (!loggedIn) {
      setPending('save')
      navigate('/login')
      return
    }
    saveDesign(draft)
    showToast(SAVE_TOAST)
  }

  const onImage = () => {
    if (!loggedIn) {
      setPending('image')
      navigate('/login')
      return
    }
    setModalOpen(true)
  }

  const closeModal = useCallback(() => {
    setModalOpen(false)
    requestAnimationFrame(() => imageBtnRef.current?.focus())
  }, [])

  const spec = describe(draft)
  const currentPart = PARTS.find((p) => p.id === part)
  const selectedColor = part === 'deck' && draft.deckHex ? null : draft[part]

  return (
    <div data-id="P02" className="page">
      <section data-id="S02-1" className="container build-head">
        <h1 className="page-title">보드 만들기</h1>
        <ol aria-label="진행 단계" className="steps">
          <li className={`steps__item${step === 1 ? ' is-current' : ''}`} aria-current={step === 1 ? 'step' : undefined}>
            <span className="steps__no">1</span>스타일·길이 찾기
          </li>
          <li aria-hidden="true" className="steps__line" />
          <li className={`steps__item${step === 2 ? ' is-current' : ''}`} aria-current={step === 2 ? 'step' : undefined}>
            <span className="steps__no">2</span>디자인
          </li>
        </ol>
      </section>

      {/* 1단계 */}
      <section id="S02-2" data-id="S02-2" aria-labelledby="find-title" className="band band--surface">
        <div className="container find">
          <h2 id="find-title" className="build-title">
            나에게 맞는 보드 길이를 찾아보세요
          </h2>
          <p className="section__desc">
            타는 스타일과 키, 신발 사이즈를 넣으면 길이를 추천해요. 원하는 길이를 직접 골라도 좋아요.
          </p>

          <fieldset className="field-group find__styles">
            <legend>
              타는 스타일 <span className="muted">(선택)</span>
            </legend>
            <div className="pick-grid pick-grid--styles">
              {STYLES.map((s) => {
                const on = draft.style === s.id
                return (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={on}
                    className={`style-pick${on ? ' is-on' : ''}`}
                    onClick={() => selectStyle(s.id)}
                  >
                    <span className="style-pick__title">{on ? `${s.name} ✓` : s.name}</span>
                    <span className="style-pick__desc">{s.desc}</span>
                  </button>
                )
              })}
            </div>
          </fieldset>

          <div className="find__inputs">
            <div className="field">
              <label htmlFor="height">키 (cm)</label>
              <input
                id="height"
                type="text"
                inputMode="numeric"
                className={`input${errors.height ? ' is-error' : ''}`}
                value={height}
                placeholder="키를 입력해 주세요 · 예: 170"
                aria-invalid={errors.height ? 'true' : undefined}
                aria-describedby={errors.height ? 'height-err' : undefined}
                onChange={(e) => setHeight(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
              />
              {errors.height && (
                <p id="height-err" className="field-error">
                  <Alert />
                  {errors.height}
                </p>
              )}
            </div>
            <div className="field">
              <label htmlFor="shoe">신발 사이즈 (mm)</label>
              <select
                id="shoe"
                className={`input${errors.shoe ? ' is-error' : ''}`}
                value={shoe}
                aria-invalid={errors.shoe ? 'true' : undefined}
                aria-describedby={errors.shoe ? 'shoe-err' : undefined}
                onChange={(e) => setShoe(e.target.value)}
              >
                <option value="">신발 사이즈를 선택해 주세요 · 예: 260</option>
                {SHOE_SIZES.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              {errors.shoe && (
                <p id="shoe-err" className="field-error">
                  <Alert />
                  {errors.shoe}
                </p>
              )}
            </div>
          </div>

          <div className="find__actions">
            <button data-id="B02-1" type="button" className="btn btn--md" onClick={onRecommend}>
              내 길이 추천받기
            </button>
            <button data-id="B02-2" type="button" className="btn-text" onClick={onSkip}>
              추천 건너뛰기
            </button>
          </div>

          <div role="status">
            {rec && (
              <div className="rec-box">
                <p className="rec-box__title">{rec.length}인치를 추천해요!</p>
                <p className="rec-box__text">
                  {`키 ${rec.height}cm · 신발 ${rec.shoe}mm 기준으로는 ${rec.base}인치예요.`}
                  {rec.style && rec.length !== rec.base && ` ${eunNeun(rec.style.name)} ${rec.style.why} 추천했어요.`}
                </p>
                <p className="rec-box__note">추천은 확인용 예시 규칙이에요. 아래에서 다른 길이를 골라도 돼요.</p>
              </div>
            )}
          </div>

          <fieldset className="field-group find__lengths">
            <legend>
              길이 고르기 <span className="muted">(선택)</span>
            </legend>
            <div className="pick-grid pick-grid--lengths" ref={lengthCardsRef}>
              {LENGTHS.map((l) => {
                const on = draft.length === l.value
                return (
                  <button
                    key={l.value}
                    type="button"
                    aria-pressed={on}
                    className={`length-card${on ? ' is-on' : ''}`}
                    onClick={() => updateDraft({ length: l.value })}
                  >
                    <span className="length-card__head">
                      <span className="length-card__title">{on ? `${l.value}인치 ✓` : `${l.value}인치`}</span>
                      {rec?.length === l.value && <span className="chip chip--ink">추천</span>}
                    </span>
                    <span className="length-card__img">
                      <LengthBoard length={l.value} />
                    </span>
                    <span className="length-card__strong">{l.strong}</span>
                    <span className="length-card__desc">{l.desc}</span>
                  </button>
                )
              })}
            </div>
          </fieldset>

          <div className="find__next">
            <a
              data-id="B02-3"
              href="#S02-3"
              className="btn btn--md btn--next"
              onClick={(e) => {
                e.preventDefault()
                goDesign()
              }}
            >
              다음: 디자인하기
              <ArrowDown />
            </a>
          </div>
        </div>
      </section>

      {/* 2단계 */}
      <section id="S02-3" data-id="S02-3" aria-labelledby="design-title" className="container design">
        <h2 id="design-title" className="build-title" tabIndex={-1}>
          2단계 · 내 맘대로 꾸미기
        </h2>
        <div className="design__cols">
          <div className="design__preview">
            <div className="preview-box">
              <div>
                <p className="preview-box__label">윗면</p>
                <BoardTop design={draft} />
              </div>
              <div>
                <p className="preview-box__label">옆모습</p>
                <BoardSide design={draft} />
              </div>
            </div>
            <button
              type="button"
              className="m-only m-toggle m-toggle--side"
              aria-expanded={sideOpen}
              onClick={() => setSideOpen((v) => !v)}
            >
              {sideOpen ? '옆모습 접기' : '옆모습 보기'}
            </button>
            <p aria-live="polite" className="spec-box">
              선택한 보드 · {spec}
            </p>
          </div>

          <div className="design__options">
            <div role="group" aria-labelledby="len-label">
              <p id="len-label" className="opt-label">
                보드 길이 <span className="muted">(바꿀 수 있어요)</span>
              </p>
              <div className="segment">
                {LENGTHS.map((l) => (
                  <button
                    key={l.value}
                    type="button"
                    aria-pressed={draft.length === l.value}
                    className={`segment__btn${draft.length === l.value ? ' is-on' : ''}`}
                    onClick={() => updateDraft({ length: l.value })}
                  >
                    {l.value}인치
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p id="part-label" className="opt-label">
                꾸밀 부품
              </p>
              <div role="tablist" aria-labelledby="part-label" className="tabs">
                {PARTS.map((p) => (
                  <button
                    key={p.id}
                    id={`tab-${p.id}`}
                    type="button"
                    role="tab"
                    aria-selected={part === p.id}
                    aria-controls="part-panel"
                    className={`tabs__btn${part === p.id ? ' is-on' : ''}`}
                    onClick={() => setPart(p.id)}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
              <div id="part-panel" role="tabpanel" aria-labelledby={`tab-${part}`} className="tabpanel">
                <p className="help-box">
                  <Info />
                  {currentPart.help}
                </p>

                <fieldset className="field-group">
                  <legend>{currentPart.name} 색상</legend>
                  <div className="swatches">
                    {COLORS[part].map((c) => {
                      const on = selectedColor === c.id
                      return (
                        <button
                          key={c.id}
                          type="button"
                          aria-pressed={on}
                          aria-label={c.name}
                          className={`swatch${on ? ' is-on' : ''}`}
                          onClick={() => pickColor(c.id)}
                        >
                          <span className="swatch__ring">
                            <span className="swatch__dot" style={{ background: c.hex }} />
                          </span>
                          <span className="swatch__name">{c.name}</span>
                        </button>
                      )
                    })}
                  </div>
                  {part === 'deck' && (
                    <button
                      type="button"
                      className="m-only m-toggle m-toggle--hex"
                      aria-expanded={hexOpen}
                      onClick={() => setHexOpen((v) => !v)}
                    >
                      {hexOpen ? '직접 입력 접기' : '직접 입력'}
                    </button>
                  )}
                  {part === 'deck' && (
                    <div className="hex">
                      <label htmlFor="deck-hex">직접 입력</label>
                      <div className="hex__row">
                        <span
                          aria-hidden="true"
                          className={`hex__dot${draft.deckHex ? ' is-on' : ''}`}
                          style={draft.deckHex ? { background: deckHexOf(draft) } : undefined}
                        />
                        <div className="hex__field">
                          <span aria-hidden="true">#</span>
                          <input
                            id="deck-hex"
                            type="text"
                            maxLength={6}
                            placeholder="1E3FD0"
                            value={hexInput}
                            aria-describedby="deck-hex-help"
                            onChange={onHexChange}
                          />
                        </div>
                      </div>
                      <p id="deck-hex-help" className="small-help">
                        원하는 색의 6자리 코드를 입력해 주세요 · 예: 1E3FD0
                      </p>
                    </div>
                  )}
                </fieldset>

                {part === 'deck' && (
                  <>
                    <fieldset className="field-group">
                      <legend>덱 무늬</legend>
                      <div className="tiles tiles--5">
                        {PATTERNS.map((p) => {
                          const on = draft.pattern === p.id
                          return (
                            <button
                              key={p.id}
                              type="button"
                              aria-pressed={on}
                              className={`tile${on ? ' is-on' : ''}`}
                              onClick={() => updateDraft({ pattern: p.id })}
                            >
                              <PatternSwatch pattern={p.id} color={deckHexOf(draft)} />
                              {on ? `${p.name} ✓` : p.name}
                            </button>
                          )
                        })}
                        {/* 직접 만들기: 그리기 창을 열어 덱 위에 직접 그림 (J) */}
                        <button
                          ref={drawBtnRef}
                          type="button"
                          aria-pressed={draft.drawing?.length > 0}
                          aria-label="덱 무늬 직접 만들기"
                          className={`tile tile--dashed${draft.drawing?.length ? ' is-on' : ''}`}
                          onClick={() => setDrawOpen(true)}
                        >
                          <span aria-hidden="true" className="tile__icon">
                            <Pencil />
                          </span>
                          {draft.drawing?.length ? '직접 만들기 ✓' : '직접 만들기'}
                        </button>
                      </div>
                    </fieldset>

                    <div className="field">
                      <label htmlFor="phrase">
                        덱 문구 <span className="muted">(선택 사항)</span>
                      </label>
                      <input
                        id="phrase"
                        type="text"
                        className="input"
                        maxLength={PHRASE_MAX}
                        value={draft.phrase}
                        placeholder="덱에 넣을 문구를 입력해 주세요 · 예: MY RIDE"
                        aria-describedby="phrase-help"
                        onChange={(e) => updateDraft({ phrase: e.target.value.slice(0, PHRASE_MAX) })}
                      />
                      <p id="phrase-help" className="small-help">
                        <strong>
                          {draft.phrase.length}/{PHRASE_MAX}자
                        </strong>{' '}
                        · 입력한 문구는 미리보기에 바로 보여요. 문구 없이 무늬만 골라도 돼요.
                      </p>
                    </div>

                    <fieldset className="field-group">
                      <legend>문구 스타일</legend>
                      <div className="tiles tiles--4">
                        {FONTS.map((f) => {
                          const on = draft.font === f.id
                          return (
                            <button
                              key={f.id}
                              type="button"
                              aria-pressed={on}
                              className={`tile tile--font${on ? ' is-on' : ''}`}
                              onClick={() => updateDraft({ font: f.id })}
                            >
                              <span aria-hidden="true" className="tile__aa" style={{ fontFamily: f.family, fontSize: f.tileSize }}>
                                Aa
                              </span>
                              {on ? `${f.name} ✓` : f.name}
                            </button>
                          )
                        })}
                      </div>
                    </fieldset>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section data-id="S02-4" aria-labelledby="price-title" className="band band--surface band--top-line">
        <div className="container price">
          <div className="price__summary">
            <h2 id="price-title" className="price__title">
              선택한 구성과 가격을 확인해 주세요
            </h2>
            <p className="price__spec">{spec}</p>
            <p className="price__amount">가격 미정</p>
          </div>
          <div className="price__actions">
            <button data-id="B02-4" type="button" className="btn btn--primary btn--block" onClick={onAddCart}>
              장바구니 담기
            </button>
            <div className="price__sub">
              <button data-id="B02-5" type="button" className="btn btn--md" onClick={onSave}>
                디자인 저장
              </button>
              <button data-id="B02-6" type="button" className="btn btn--md" ref={imageBtnRef} onClick={onImage}>
                이미지 저장
              </button>
            </div>
            <p className="small-help">디자인 저장과 이미지 저장은 로그인이 필요해요.</p>
          </div>
        </div>
      </section>

      {modalOpen && <ImageModal design={draft} onClose={closeModal} />}
      {drawOpen && <DrawSheet design={draft} onApply={applyDraw} onClose={closeDraw} />}
    </div>
  )
}
