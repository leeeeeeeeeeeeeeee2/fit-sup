import { Link } from 'react-router-dom'
import { HeroBoard } from '../components/Board.jsx'
import { ArrowRight } from '../components/Icons.jsx'
import { STYLES } from '../data/options.js'
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

const CHECKS = ['보드 소재', '제작·배송 기간', '교환·반품 기준']

// P01 메인
export default function MainPage() {
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
          <div className="style-grid">
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
        <ol className="flow-grid">
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

      <section data-id="S01-4" aria-labelledby="check-title" className="band band--brand">
        <div className="container check">
          <h2 id="check-title" className="check__title">
            구매 전 확인
          </h2>
          <p className="check__desc">보드 소재, 제작·배송 기간, 교환·반품 기준은 판매 정책이 확정되면 이곳에 안내해요.</p>
          <ul className="check-grid">
            {CHECKS.map((c) => (
              <li key={c} className="check-box">
                <h3>{c}</h3>
                <p>판매 정책 확정 후 안내</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
