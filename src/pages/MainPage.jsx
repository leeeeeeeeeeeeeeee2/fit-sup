import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HeroBoard } from '../components/Board.jsx'
import { ArrowRight } from '../components/Icons.jsx'
import { STYLES } from '../data/options.js'
// S01-5 품질 카드 사진 (Figma 이미지 자리에 가장 가까운 사진)
import imgDeck from '../assets/reviews/black-skateboard.jpg'
import imgRide from '../assets/reviews/person-riding.jpg'
import imgCare from '../assets/products/t-tool.jpg'
import './MainPage.css'

// 히어로 영상: src/assets/main/hero.mp4 (또는 .webm/.mov)를 넣으면 보드 그림 대신 재생
const HERO_VIDEO = Object.values(
  import.meta.glob('../assets/main/hero.{mp4,webm,mov}', { eager: true, query: '?url', import: 'default' }),
)[0]

const FLOW = [
  {
    no: '01',
    title: '스타일·길이 찾기',
    desc: '타는 스타일과 키, 신발 사이즈로 22·27·32인치 중 맞는 길이를 추천받아요. 원하는 길이를 바로 골라도 돼요.',
  },
  { no: '02', title: '내 맘대로 꾸미기', desc: '덱·바퀴·트럭 색, 덱 무늬, 덱 문구를 고르면 완성 모습이 바로 바뀌어요.' },
  { no: '03', title: '주문하기', desc: '장바구니에 담아 주문까지.' },
]

// S01-4 구매 전 확인 — 체험용 예시 정책 (2026-11-17 결정)
const CHECKS = [
  { title: '보드 소재', desc: '캐나다 메이플 7겹 덱 · PU 바퀴' },
  { title: '제작·배송 기간', desc: '주문 후 제작 5일 + 배송 1~2일 · 무료배송' },
  { title: '교환·반품 기준', desc: '맞춤 제작이라 단순 변심 반품은 어려워요. 불량은 7일 안에 무료 교환' },
]

// S01-5 보드 품질·길이 가이드 (출처: Figma 와이어프레임 P01 › S01-5)
const QUALITY = [
  {
    no: '01',
    title: '덱 내구성',
    strong: '몸을 지탱하는 덱, 소재와 구조부터',
    desc: '덱 소재·적층 구조·권장 하중을 확인해요. 몸무게와 사용 환경에 맞는 선택이 중요해요.',
    img: imgDeck,
    alt: '자갈길 위에 놓인 보드의 덱',
  },
  {
    no: '02',
    title: '주행 안정감',
    strong: '덱·트럭·바퀴의 조합을 함께',
    desc: '덱 길이와 발판 너비, 트럭의 움직임이 균형과 코너링에 어떤 영향을 주는지 살펴봐요.',
    img: imgRide,
    alt: '균형 잡힌 자세로 보드를 타는 모습',
  },
  {
    no: '03',
    title: '관리와 점검',
    strong: '오래 타기 위한 작은 습관',
    desc: '타기 전 나사 풀림과 덱의 균열을 확인해요. 물기를 닦고 건조한 곳에 보관해 주세요.',
    img: imgCare,
    alt: '바퀴 나사를 조이는 스케이트 T툴',
  },
]

const LENGTH_GUIDE = [
  { len: 22, feature: '작고 가벼워 휴대하기 좋아요', for: '짧은 거리 이동 · 휴대성 중심' },
  { len: 27, feature: '휴대성과 안정성의 균형을 잡아요', for: '일상 이동 · 균형 있는 선택' },
  { len: 32, feature: '넓은 발판으로 편안하게 타요', for: '입문 · 안정감 중심' },
]

// P01 메인
export default function MainPage() {
  // 카드 묶음이 화면에 들어오면 차례로 떠오르게 함 (데스크톱, 동작 줄이기 꺼짐일 때만)
  useEffect(() => {
    const ok =
      'IntersectionObserver' in window &&
      window.matchMedia('(min-width: 1024px)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!ok) return undefined
    const root = document.documentElement
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in')
            io.unobserve(e.target)
          }
        }
      },
      { threshold: 0.15 },
    )
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    root.classList.add('reveal-on')
    return () => {
      io.disconnect()
      root.classList.remove('reveal-on')
    }
  }, [])

  return (
    <div data-id="P01" className="page page--main">
      <section data-id="S01-1" aria-labelledby="hero-title" className="hero container">
        <div className="hero__text">
          <span className="chip">크루저 보드 · 22 / 27 / 32인치</span>
          <h1 id="hero-title" className="hero__title">
            <span className="hero__brand">핏썹?</span>
            <span className="hero__line">
              사이즈는 <mark className="hero__fit">딱 맞게,</mark>
            </span>
            <span className="hero__line">
              디자인은 <span className="hero__free">내 맘대로.</span>
            </span>
          </h1>
          <p className="hero__desc">
            어떻게 탈지 고르고, 키와 신발 사이즈를 넣으면 맞는 길이를 찾아 드려요.
            <br />
            덱·바퀴·트럭 색과 무늬, 문구까지 골라 완성된 모습을 보고 주문까지 한 번에.
          </p>
          <Link data-id="B01-1" to="/build#S02-2" className="btn btn--primary hero__cta">
            보드 만들기 시작
            <ArrowRight />
          </Link>
        </div>
        <figure className="hero__figure">
          <div className={`hero__board-box${HERO_VIDEO ? ' hero__board-box--video' : ''}`}>
            {HERO_VIDEO ? (
              <video className="hero__video" src={HERO_VIDEO} autoPlay muted loop playsInline aria-label="핏썹 보드 라이딩 영상" />
            ) : (
              <HeroBoard />
            )}
          </div>
          {!HERO_VIDEO && (
            <figcaption className="caption">미리보기 예시 · 27인치 · 블루 덱 · 화이트 바퀴 · FIT'SUP</figcaption>
          )}
        </figure>
      </section>

      <section data-id="S01-2" aria-labelledby="styles-title" className="band band--surface">
        <div className="container section">
          <h2 id="styles-title" className="section__title">
            어떻게 탈래?
          </h2>
          <p className="section__desc">타는 스타일에 따라 맞는 길이가 달라져요. 스타일을 누르면 바로 보드 만들기로 이어져요.</p>
          <div className="style-grid reveal">
            {STYLES.map((s) => (
              <article key={s.id} className="style-card">
                <img className="style-card__img" src={s.img} alt={`${s.name} 라이딩 장면`} />
                <div className="style-card__body">
                  <h3 className="style-card__title">{s.name}</h3>
                  <p className="style-card__desc">{s.desc}</p>
                  <Link
                    data-id="B01-2"
                    to="/build#S02-2"
                    state={{ style: s.id }}
                    className="btn btn--sm style-card__cta"
                  >
                    {s.cta}
                    <ArrowRight size={18} strokeWidth={2.2} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section data-id="S01-3" aria-labelledby="flow-title" className="container section">
        <h2 id="flow-title" className="section__title">
          세 단계면 끝
        </h2>
        <p className="section__desc">스타일과 길이 → 디자인 → 구매. 중간에 저장해 두고 나중에 이어서 꾸며도 돼요.</p>
        <ol className="flow-grid reveal">
          {FLOW.map((f) => (
            <li key={f.no} className="flow-card">
              <span aria-hidden="true" className="flow-card__no">
                {f.no}
              </span>
              <h3 className="flow-card__title">{f.title}</h3>
              <p className="flow-card__desc">{f.desc}</p>
            </li>
          ))}
        </ol>
      </section>

      <section data-id="S01-5" aria-labelledby="guide-title" className="band band--surface">
        <div className="container section">
          <h2 id="guide-title" className="section__title">
            디자인만큼, 보드의 기본도 꼼꼼하게
          </h2>
          <p className="section__desc">오래 탈 수 있는지, 편안하게 탈 수 있는지. 보드를 고르기 전에 함께 살펴봐요.</p>
          <ul className="quality-grid reveal">
            {QUALITY.map((q) => (
              <li key={q.no} className="quality-card">
                <img className="quality-card__img" src={q.img} alt={q.alt} loading="lazy" />
                <span aria-hidden="true" className="quality-card__no">
                  {q.no}
                </span>
                <h3 className="quality-card__title">{q.title}</h3>
                <p className="quality-card__strong">{q.strong}</p>
                <p className="quality-card__desc">{q.desc}</p>
              </li>
            ))}
          </ul>

          <div className="length-guide">
            <h3 className="length-guide__title">나에게 맞는 길이, 한눈에 비교해요</h3>
            <div className="length-guide__table">
              <table>
                <thead>
                  <tr>
                    <th scope="col">길이</th>
                    <th scope="col">주요 특징</th>
                    <th scope="col">이런 분께 추천해요</th>
                  </tr>
                </thead>
                <tbody>
                  {LENGTH_GUIDE.map((g) => (
                    <tr key={g.len}>
                      <th scope="row">
                        <span className={`length-guide__len length-guide__len--${g.len}`}>{g.len}인치</span>
                      </th>
                      <td>{g.feature}</td>
                      <td>{g.for}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="length-guide__note">
              ※ 키·신발 사이즈와 타는 스타일을 함께 고려해요. <Link to="/build#S02-2">보드 만들기</Link>에서 길이를 추천받을 수 있어요.
            </p>
          </div>

          <p className="spec-note">
            <strong>상세 사양</strong>
            캐나다 메이플 7겹 · 최대 하중 100kg · 품질 보증 6개월 (체험용 예시 사양)
          </p>
        </div>
      </section>

      <section data-id="S01-4" aria-labelledby="check-title" className="band band--brand">
        <div className="container check">
          <h2 id="check-title" className="check__title">
            구매 전 확인
          </h2>
          <p className="check__desc">주문하기 전에 보드 소재, 제작·배송 기간, 교환·반품 기준을 확인해 주세요.</p>
          <ul className="check-grid">
            {CHECKS.map((c) => (
              <li key={c.title} className="check-box">
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
