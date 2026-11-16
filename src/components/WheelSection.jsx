import { useRef, useState } from 'react'
import { COLORS, EXTRAS, WHEEL_TYPES } from '../data/options.js'
import { HEX_RE, partHexOf } from '../lib/design.js'
import { readPhoto } from '../lib/photo.js'
import { plusWon, won } from '../lib/price.js'

// P02 › 바퀴도 내 스타일로 (바퀴 종류 4가지 + 바퀴 색)
export default function WheelSection({ draft, updateDraft }) {
  const [hexInput, setHexInput] = useState(draft.wheelHex ?? '')
  const [graphicError, setGraphicError] = useState('')
  const fileRef = useRef(null)
  const color = partHexOf(draft, 'wheel')
  const type = draft.wheelType ?? 'solid'

  const pickColor = (id) => {
    setHexInput('')
    updateDraft({ wheel: id, wheelHex: '' })
  }

  const setHex = (raw) => {
    const v = raw.toUpperCase().replace(/[^0-9A-F]/g, '').slice(0, 6)
    setHexInput(v)
    updateDraft({ wheelHex: HEX_RE.test(v) ? v : '' })
  }

  const onGraphic = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const { src } = await readPhoto(file, 240)
      setGraphicError('')
      updateDraft({ wheelType: 'graphic', wheelGraphic: src })
    } catch (err) {
      setGraphicError(err.message)
    }
  }

  return (
    <section data-id="S02-6" aria-labelledby="wheel-title" className="container wheel-sec">
      <h2 id="wheel-title" className="sec-title">
        바퀴도 내 스타일로
      </h2>
      <p className="section__desc">바퀴 종류와 색을 골라 주세요. 사이드 그래픽은 내가 원하는 그래픽을 직접 넣을 수 있어요.</p>

      <div className="wheel-grid">
        {WHEEL_TYPES.map((w) => {
          const on = type === w.id
          return (
            <article key={w.id} className={`pick-card${on ? ' is-on' : ''}`}>
              <div className="pick-card__img pick-card__img--photo">
                <img src={w.img} alt={`${w.name} 바퀴`} loading="lazy" />
                {w.id === 'graphic' && draft.wheelGraphic && (
                  <span className="pick-card__graphic" title="올린 그래픽">
                    <img src={draft.wheelGraphic} alt="내가 올린 바퀴 그래픽" />
                  </span>
                )}
              </div>
              <h3 className="pick-card__name">{w.name}</h3>
              <p className="pick-card__desc">{w.desc}</p>
              <p className="pick-card__price">{plusWon(w.price)}</p>
              <div className="pick-card__actions">
                {w.id === 'graphic' && (
                  <>
                    <button type="button" className="pick-card__sub" onClick={() => fileRef.current?.click()}>
                      <span aria-hidden="true">⇪</span>
                      {draft.wheelGraphic ? '그래픽 바꾸기' : '내 그래픽 올리기'}
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" hidden onChange={onGraphic} />
                    {graphicError && (
                      <p role="alert" className="field-error">
                        {graphicError}
                      </p>
                    )}
                  </>
                )}
                <button
                  type="button"
                  aria-pressed={on}
                  className={`pick-card__btn${on ? ' is-on' : ''}`}
                  onClick={() => updateDraft({ wheelType: w.id })}
                >
                  {on ? '선택됨 ✓' : '이 바퀴로 선택'}
                </button>
              </div>
            </article>
          )
        })}
      </div>

      <fieldset className="wheel-color">
        <legend>바퀴 색</legend>
        <div className="wheel-color__row">
          <div className="swatches wheel-color__swatches">
            {COLORS.wheel.map((c) => {
              const on = !draft.wheelHex && draft.wheel === c.id
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
                  <span className="swatch__name">{on ? `${c.name} ✓` : c.name}</span>
                </button>
              )
            })}
          </div>
          <div className="hex wheel-color__hex">
            <label htmlFor="wheel-hex">직접 입력</label>
            <div className="hex__row">
              <label
                className={`hex__dot hex__picker${draft.wheelHex ? ' is-on' : ''}`}
                style={draft.wheelHex ? { background: color } : undefined}
                title="색 고르기"
              >
                <input
                  type="color"
                  aria-label="바퀴 색 고르기"
                  value={color.toLowerCase()}
                  onChange={(e) => setHex(e.target.value.slice(1))}
                />
              </label>
              <div className="hex__field">
                <span aria-hidden="true">#</span>
                <input
                  id="wheel-hex"
                  type="text"
                  maxLength={6}
                  placeholder="1E3FD0"
                  value={hexInput}
                  onChange={(e) => setHex(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <p className="small-help">
          동그라미를 눌러 색을 고르거나 6자리 코드를 입력해 주세요. 사이드 그래픽은 올린 그래픽이 바퀴 옆면에 들어가요.
        </p>
      </fieldset>
    </section>
  )
}

// P02 › 라이딩 준비물도 함께 챙겨요
export function ExtrasSection({ draft, updateDraft }) {
  const list = draft.extras ?? []
  const picked = EXTRAS.filter((x) => list.includes(x.id))
  const toggle = (id) => updateDraft({ extras: list.includes(id) ? list.filter((x) => x !== id) : [...list, id] })
  return (
    <section data-id="S02-5" aria-labelledby="extra-title" className="container extras">
      <h2 id="extra-title" className="sec-title">
        라이딩 준비물도 함께 챙겨요
      </h2>
      <p className="section__desc">
        안전하게 타고 오래 관리하는 데 필요한 용품이에요. 필요한 것만 골라 함께 담아 주세요. <span className="muted">(선택 사항)</span>
      </p>
      <div className="extra-grid">
        {EXTRAS.map((x) => {
          const on = list.includes(x.id)
          return (
            <article key={x.id} className={`pick-card${on ? ' is-on' : ''}`}>
              <div className="pick-card__img pick-card__img--tall pick-card__img--photo">
                <img src={x.img} alt={x.name} loading="lazy" />
              </div>
              <h3 className="pick-card__name">{x.name}</h3>
              <p className="pick-card__desc">{x.desc}</p>
              <p className="pick-card__price">+{won(x.price)}</p>
              <div className="pick-card__actions">
                <button
                  type="button"
                  aria-pressed={on}
                  className={`pick-card__btn${on ? ' is-on' : ''}`}
                  onClick={() => toggle(x.id)}
                >
                  {on ? '함께 담음 ✓' : '+ 함께 담기'}
                </button>
              </div>
            </article>
          )
        })}
      </div>
      <div className="extras__bar" aria-live="polite">
        <strong>
          함께 담을 용품 {picked.length}개{picked.length ? ` · ${picked.map((x) => x.name).join(', ')}` : ''}
        </strong>
        <span>{picked.length ? `+${won(picked.reduce((s, x) => s + x.price, 0))}` : '고른 용품은 아래 합계에 함께 더해져요.'}</span>
      </div>
    </section>
  )
}
