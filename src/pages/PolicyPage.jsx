import { Link } from 'react-router-dom'
import './OrderPages.css'

// 체험용 이용약관·개인정보처리방침 (2026-11-17 결정)
// 포트폴리오용 체험 사이트라 실제 판매·개인정보 수집을 하지 않는다는 내용만 담음
const POLICIES = {
  terms: {
    id: 'P08',
    title: '이용약관',
    sections: [
      {
        heading: '1. 사이트 소개',
        body: '핏썹(FIT\'SUP)은 크루저 보드의 길이를 추천받고 디자인을 꾸며 보는 포트폴리오용 체험 사이트예요. 실제로 상품을 팔거나 만들어 보내지 않아요.',
      },
      {
        heading: '2. 주문과 결제',
        body: '장바구니·주문·결제는 흐름을 체험하는 기능이에요. 결제 버튼을 눌러도 돈이 빠져나가지 않고, 주문도 실제로 접수되지 않아요. 실제 카드 정보는 넣지 마세요.',
      },
      {
        heading: '3. 회원과 로그인',
        body: '회원가입과 로그인은 입력 형식만 확인하는 체험용이에요. 아이디와 비밀번호는 어디에도 보내거나 저장하지 않아요.',
      },
      {
        heading: '4. 가격·배송·교환 안내',
        body: '화면에 보이는 가격(부가세 포함), 무료배송, 제작·배송 기간, 교환·반품 기준은 모두 체험용 예시 정책이에요.',
      },
      {
        heading: '5. 리뷰와 디자인',
        body: '예시 리뷰는 디자인 시연용이에요. 내가 쓴 리뷰와 저장한 디자인은 이 브라우저에만 남고, 브라우저 기록을 지우면 함께 사라져요.',
      },
    ],
  },
  privacy: {
    id: 'P09',
    title: '개인정보처리방침',
    sections: [
      {
        heading: '1. 모으는 정보',
        body: '핏썹은 개인정보를 모으지 않아요. 회원가입·로그인·배송 정보·결제 정보 칸에 입력한 내용은 서버로 보내지 않아요.',
      },
      {
        heading: '2. 이 브라우저에 남는 정보',
        body: '장바구니, 로그인 상태, 저장한 디자인, 만들던 디자인, 내가 쓴 리뷰, 도움돼요 기록은 사용하는 브라우저(localStorage)에만 저장돼요. 카드번호·계좌·비밀번호는 저장하지 않아요.',
      },
      {
        heading: '3. 정보 지우기',
        body: '브라우저 설정에서 이 사이트의 데이터를 지우면 위 정보가 모두 사라져요.',
      },
      {
        heading: '4. 다른 곳에 주는 정보',
        body: '어떤 정보도 다른 회사나 사람에게 주지 않아요.',
      },
    ],
  },
}

export default function PolicyPage({ kind }) {
  const p = POLICIES[kind]
  return (
    <div data-id={p.id} className="page">
      <main className="container work policy">
        <h1 className="page-title">{p.title}</h1>
        <p className="chip chip--notice policy__chip">포트폴리오용 체험 사이트의 {p.title}이에요.</p>
        <div className="panel policy__body">
          {p.sections.map((s) => (
            <section key={s.heading} className="policy__sec">
              <h2>{s.heading}</h2>
              <p>{s.body}</p>
            </section>
          ))}
        </div>
        <p className="policy__links">
          <Link to={kind === 'terms' ? '/privacy' : '/terms'}>{kind === 'terms' ? '개인정보처리방침' : '이용약관'} 보기</Link>
          <Link to="/">메인으로</Link>
        </p>
      </main>
    </div>
  )
}
