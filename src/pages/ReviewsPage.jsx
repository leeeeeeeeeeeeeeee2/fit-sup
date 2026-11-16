import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Alert, Pencil, Star, ThumbUp } from '../components/Icons.jsx'
import { LENGTHS, STYLES } from '../data/options.js'
import { REVIEW_FILTERS, REVIEW_PHOTOS, REVIEW_SORTS, REVIEW_SUMMARY, REVIEWS } from '../data/reviews.js'
import { readPhoto } from '../lib/photo.js'
import { useStore } from '../store/StoreContext.jsx'
import './ReviewsPage.css'

const styleName = (id) => STYLES.find((s) => s.id === id)?.name ?? ''
const num = (n) => n.toLocaleString('ko-KR')

function Stars({ rating, size = 18 }) {
  return (
    <span className="stars" role="img" aria-label={`별점 5점 만점에 ${rating}점`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={size} empty={i > rating} />
      ))}
    </span>
  )
}

function today() {
  const d = new Date()
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

// 사진 크게 보기
function PhotoViewer({ photo, onClose }) {
  const closeRef = useRef(null)
  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label="리뷰 사진 크게 보기" className="dialog photo-viewer">
        <img src={photo.src} alt={photo.alt} />
        <div className="dialog__actions">
          <button ref={closeRef} type="button" className="btn btn--md" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  )
}

// 리뷰 쓰기 창
function WriteReview({ onSubmit, onClose }) {
  const [rating, setRating] = useState(5)
  const [style, setStyle] = useState('cruiser')
  const [length, setLength] = useState(27)
  const [height, setHeight] = useState('')
  const [shoe, setShoe] = useState('')
  const [text, setText] = useState('')
  const [photo, setPhoto] = useState('')
  const [error, setError] = useState('')
  const fileRef = useRef(null)
  const firstRef = useRef(null)

  useEffect(() => {
    firstRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const onPhoto = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      setPhoto((await readPhoto(file, 640)).src)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  const submit = (e) => {
    e.preventDefault()
    if (text.trim().length < 10) {
      setError('리뷰 내용을 10자 이상 입력해 주세요.')
      document.getElementById('review-text')?.focus()
      return
    }
    onSubmit({
      rating,
      user: '내 리뷰',
      date: today(),
      style,
      length,
      height: Number(height) || null,
      shoe: Number(shoe) || null,
      text: text.trim(),
      photo,
      helpful: 0,
      mine: true,
    })
  }

  return (
    <div className="scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form role="dialog" aria-modal="true" aria-labelledby="write-title" className="dialog write-review" onSubmit={submit}>
        <h2 id="write-title" className="dialog__title">
          리뷰 쓰기
        </h2>

        <fieldset className="field-group">
          <legend>별점</legend>
          <div className="write-review__stars">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                ref={i === 1 ? firstRef : undefined}
                type="button"
                aria-label={`${i}점`}
                aria-pressed={rating === i}
                onClick={() => setRating(i)}
              >
                <Star size={32} empty={i > rating} />
              </button>
            ))}
          </div>
        </fieldset>

        <div className="write-review__row">
          <div className="field">
            <label htmlFor="review-style">타는 스타일</label>
            <select id="review-style" className="input" value={style} onChange={(e) => setStyle(e.target.value)}>
              {STYLES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="review-length">길이</label>
            <select
              id="review-length"
              className="input"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
            >
              {LENGTHS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.value}인치
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="review-height">
              키 <span className="muted">(cm, 선택)</span>
            </label>
            <input
              id="review-height"
              className="input"
              inputMode="numeric"
              placeholder="예: 170"
              value={height}
              onChange={(e) => setHeight(e.target.value.replace(/\D/g, '').slice(0, 3))}
            />
          </div>
          <div className="field">
            <label htmlFor="review-shoe">
              신발 <span className="muted">(mm, 선택)</span>
            </label>
            <input
              id="review-shoe"
              className="input"
              inputMode="numeric"
              placeholder="예: 260"
              value={shoe}
              onChange={(e) => setShoe(e.target.value.replace(/\D/g, '').slice(0, 3))}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="review-text">리뷰 내용</label>
          <textarea
            id="review-text"
            className="input write-review__text"
            rows={4}
            maxLength={500}
            placeholder="보드를 받아 보고 타 본 느낌을 자유롭게 남겨 주세요. (10자 이상)"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="write-review__photo">
          {photo && <img src={photo} alt="첨부한 사진 미리보기" />}
          <button type="button" className="btn btn--sm" onClick={() => fileRef.current?.click()}>
            {photo ? '사진 바꾸기' : '+ 사진 첨부'}
          </button>
          {photo && (
            <button type="button" className="btn-text" onClick={() => setPhoto('')}>
              사진 빼기
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onPhoto} />
        </div>

        {error && (
          <p role="alert" className="field-error">
            <Alert />
            {error}
          </p>
        )}

        <div className="dialog__actions">
          <button type="button" className="btn-text" onClick={onClose}>
            취소
          </button>
          <button type="submit" className="btn btn--md">
            리뷰 등록
          </button>
        </div>
      </form>
    </div>
  )
}

// P07 리뷰
export default function ReviewsPage() {
  const { loggedIn, setPending, myReviews, addReview, helped, toggleHelped, showToast } = useStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('helpful')
  const [viewer, setViewer] = useState(null)
  const [writeOpen, setWriteOpen] = useState(false)
  const listRef = useRef(null)

  // 로그인하고 돌아왔으면 리뷰 쓰기 창을 바로 열어 줌
  useEffect(() => {
    if (location.state?.resume === 'review') {
      setWriteOpen(true)
      navigate(location.pathname, { replace: true, state: null })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key])

  const onWrite = () => {
    if (!loggedIn) {
      setPending('review')
      navigate('/login')
      return
    }
    setWriteOpen(true)
  }

  const onSubmit = (review) => {
    addReview(review)
    setWriteOpen(false)
    setFilter('all')
    setSort('latest')
    showToast({ message: '리뷰를 등록했어요. 소중한 후기 고마워요!' })
  }

  const showPhotoReviews = () => {
    setFilter('photo')
    listRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }

  const list = useMemo(() => {
    const all = [...myReviews, ...REVIEWS].map((r) => ({
      ...r,
      helpfulCount: r.helpful + (helped.includes(r.id) ? 1 : 0),
    }))
    const shown = all.filter((r) => {
      if (filter === 'all') return true
      if (filter === 'photo') return Boolean(r.photo)
      return r.style === filter
    })
    const byDate = (a, b) => b.date.localeCompare(a.date)
    const sorters = {
      helpful: (a, b) => b.helpfulCount - a.helpfulCount || byDate(a, b),
      latest: byDate,
      high: (a, b) => b.rating - a.rating || b.helpfulCount - a.helpfulCount,
      low: (a, b) => a.rating - b.rating || b.helpfulCount - a.helpfulCount,
    }
    return shown.sort(sorters[sort])
  }, [myReviews, helped, filter, sort])

  const S = REVIEW_SUMMARY

  return (
    <div data-id="P07" className="page">
      <main className="container reviews">
        <div className="reviews__head">
          <h1 className="page-title">리뷰</h1>
          <span className="reviews__sample">디자인 시연용 예시 리뷰</span>
        </div>
        <p className="reviews__desc">핏썹 보드를 받은 분들이 남긴 후기예요. 타는 스타일별로 골라 볼 수 있어요.</p>

        <section aria-label="리뷰 요약" className="review-summary">
          <div className="review-summary__score">
            <p className="review-summary__total">전체 리뷰 {num(S.total + myReviews.length)}개</p>
            <p className="review-summary__avg">
              {S.average}
              <span> / 5</span>
            </p>
            <Stars rating={5} size={22} />
          </div>
          <ul className="review-summary__dist">
            {S.dist.map((d) => (
              <li key={d.score}>
                <span className="review-summary__label">{d.score}점</span>
                <span className="review-summary__bar" aria-hidden="true">
                  <span style={{ width: `${d.pct}%` }} />
                </span>
                <span className="review-summary__pct">{d.pct}%</span>
              </li>
            ))}
          </ul>
          <button type="button" className="btn btn--primary review-summary__write" onClick={onWrite}>
            <Pencil size={18} />
            리뷰 쓰기
          </button>
        </section>

        <section aria-labelledby="photo-title" className="review-photos">
          <div className="review-photos__head">
            <h2 id="photo-title" className="review-photos__title">
              사진 리뷰 <span>{num(S.photoTotal)}개</span>
            </h2>
            <button type="button" className="review-photos__all" onClick={showPhotoReviews}>
              사진 리뷰 전체 보기
            </button>
          </div>
          <ul className="review-photos__grid">
            {REVIEW_PHOTOS.map((p) => (
              <li key={p.src}>
                <button type="button" className="review-photos__item" onClick={() => setViewer(p)} aria-label={`${p.alt} 크게 보기`}>
                  <img src={p.src} alt="" loading="lazy" />
                </button>
              </li>
            ))}
            <li>
              <button type="button" className="review-photos__item review-photos__more" onClick={showPhotoReviews}>
                + 더 보기
              </button>
            </li>
          </ul>
        </section>

        <section aria-label="리뷰 목록" className="review-list-sec" ref={listRef}>
          <div className="review-tools">
            <div role="group" aria-label="스타일 필터" className="review-filters">
              {REVIEW_FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={filter === f.id}
                  className={`review-filter${filter === f.id ? ' is-on' : ''}`}
                  onClick={() => setFilter(f.id)}
                >
                  {f.name}
                </button>
              ))}
            </div>
            <label className="review-sort">
              <span>정렬</span>
              <select className="input" value={sort} onChange={(e) => setSort(e.target.value)}>
                {REVIEW_SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <ul className="review-list">
            {list.length === 0 && <li className="review-empty">이 조건에 맞는 리뷰가 아직 없어요.</li>}
            {list.map((r) => {
              const on = helped.includes(r.id)
              return (
                <li key={r.id} className="review-item">
                  <div className="review-item__meta">
                    <Stars rating={r.rating} />
                    <strong className="review-item__user">{r.user}</strong>
                    <span className="review-item__date">{r.date}</span>
                    {r.photo && <span className="review-item__badge">사진 리뷰</span>}
                  </div>
                  <ul className="review-item__tags">
                    <li>{styleName(r.style)}</li>
                    <li>{r.length}인치</li>
                    {r.height && r.shoe && <li>{`${r.height}cm · ${r.shoe}mm`}</li>}
                  </ul>
                  <p className="review-item__text">{r.text}</p>
                  {r.photo && (
                    <button
                      type="button"
                      className="review-item__photo"
                      onClick={() => setViewer({ src: r.photo, alt: `${r.user} 님의 리뷰 사진` })}
                      aria-label={`${r.user} 님의 리뷰 사진 크게 보기`}
                    >
                      <img src={r.photo} alt="" loading="lazy" />
                    </button>
                  )}
                  <button
                    type="button"
                    aria-pressed={on}
                    className={`review-item__help${on ? ' is-on' : ''}`}
                    onClick={() => toggleHelped(r.id)}
                  >
                    <ThumbUp size={16} />
                    도움돼요 {num(r.helpfulCount)}
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      </main>

      {viewer && <PhotoViewer photo={viewer} onClose={() => setViewer(null)} />}
      {writeOpen && <WriteReview onSubmit={onSubmit} onClose={() => setWriteOpen(false)} />}
    </div>
  )
}
