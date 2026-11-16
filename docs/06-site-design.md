# 핏썹(FIT'SUP) 시각 디자인 기준

- 문서 단계: 시각 디자인 확정 (3단계 디자인 쌓기 결과, 구현 전)
- 기준 자료: Claude Design 「핏썹 디자인 시스템」 (2026-11-13 생성), Claude Design 캔버스 「핏썹(FIT'SUP) 시각 디자인」 P01~P06 화면
- 함께 확인한 문서: [01-site-purpose.md](./01-site-purpose.md), [04-site-wireframe.md](./04-site-wireframe.md), [05-site-reference.md](./05-site-reference.md), `PROJECT_CONTEXT.md`
- 적용 범위: React 앱(루트을 만들 때 색·글자·여백·모서리·버튼·카드 모양은 이 문서 값을 그대로 씁니다. 페이지·섹션 구조와 버튼 이동은 04 문서를 따릅니다.
- 원칙: 디자인 시스템과 캔버스에서 실제로 쓰인 값만 적습니다. 정해지지 않은 값은 `[미정]`으로 표시합니다.

---

## 1. 디자인 콘셉트

> **아스팔트 위의 스티커** — 밝은 콘크리트 바탕에 검정 선을 긋고, 누를 곳에만 핏썹 블루 스티커를 붙입니다.

- 선(1.5px 검정)과 오른쪽 아래로 밀린 단단한 그림자로 물건을 구분합니다.
- 흐린 그림자, 그라데이션, 이모지는 쓰지 않습니다.
- 01 문서의 인상 우선순위(힙하고 장난스러움 → 쉽고 편함 → 나만의 것 → 믿을 수 있는 품질)를 따릅니다.

### 디자인 원칙
1. **색은 장식이 아니라 구분이다.** 화면 대부분은 `ink`·`ground`·`surface` 세 가지로 만듭니다.
2. **블루는 행동과 신뢰에만.** `brand`는 핵심 행동 버튼, P01 S01-4 구매 전 확인 넓은 면, 주문 완료 표시 원에만 씁니다.
3. **입문자에게 쉽게.** 보드 용어는 괄호로 풀어 씁니다. 예: "트럭(바퀴를 잡아 주는 부품)".
4. **나만의 보드가 주인공.** 제품 옵션색(`deck-*`)은 보드 그림 안에서만 쓰고 UI에는 섞지 않습니다.

---

## 2. 컬러

테마는 밝은 화면 하나입니다. 다크 모드는 [미정]입니다.

### UI 색

| 토큰 | 값 | 쓰는 곳 |
|---|---|---|
| `ink` | #111311 | 기본 글자, 제목, 1.5px 선·테두리, 단단한 그림자, 선택 상태 바탕, 푸터 바탕 |
| `ground` | #F3F4F1 | 페이지 기본 바탕(콘크리트), 카드 안 이미지 자리, 칩·결과 상자 바탕 |
| `surface` | #FFFFFF | 카드·패널·입력칸·보조 버튼 바탕, 구간을 나누는 흰 바탕(P01 S01-2) |
| `text-muted` | #3E403B | 설명 글, 보조 글 |
| `text-caption` | #4A4C47 | 이미지 캡션, 작은 안내 글 |
| `line-soft` | #C9CBC3 | 선택되지 않은 옵션 카드·타일 테두리 (아래 접근성 주의 참고) |
| `placeholder` | #DCDDD6 | 사진이 들어올 자리 바탕 |
| `brand` | #1E3FD0 | 핏썹 블루: 핵심 행동 버튼, 구매 전 확인 넓은 면, 완료 표시 원 |
| `on-brand` | #FFFFFF | brand 위의 글자·아이콘 |
| `error` | #C21F30 | 입력 오류 테두리와 안내 글 |
| `on-ink` | #FFFFFF | ink 바탕(푸터, 알림, 선택 상태) 위의 글자 |
| `on-ink-muted` | #C9CBC3 | ink 바탕 위 보조 글 |
| `on-ink-line` | #3E403B | 푸터 안 구분선 |
| `on-ink-dashed` | #6E706B | 푸터 사업자 정보 자리 점선 |
| `scrim` | #6E706B | 이미지 저장 창 뒤 바탕 |

### 제품 옵션색 (보드 그림 안에서만)

| 토큰 | 값 | 이름 |
|---|---|---|
| `deck-mint` | #7FD8BE | 민트 |
| `deck-white` | #FFFFFF | 화이트 (견본에는 ink 테두리) |
| `deck-coral` | #FF6F5E | 코랄 |
| `deck-blue` | #1E3FD0 | 블루 (브랜드 블루와 같은 값이지만 제품 색으로 따로 관리) |
| `deck-gray` | #9A9D96 | 그레이 |
| `deck-black` | #111311 | 블랙 |
| `truck-silver` | #B8BCC2 | 트럭 실버 |

### 색 사용 규칙
- 선택 상태는 색이 아니라 **반전**(ink 바탕 + 흰 글자) 또는 **ink 2.5px 테두리 + ✓**로 보여 줍니다.
- 오류는 빨간 테두리만으로 알리지 않고 아이콘 + 고치는 방법 문장을 함께 씁니다.
- 핵심 행동 버튼 강조색과 넓은 면 색이 지금은 `brand` 하나로 같습니다. 05 문서의 "강조색과 넓은 면 색은 역할을 나눈다" 원칙과 다르므로 확정이 필요합니다(12장).

---

## 3. 타이포그래피

### 글꼴 (모두 Google Fonts)

| 역할 | 글꼴 | 굵기 | 불러오기 |
|---|---|---|---|
| 제목 `display` | Black Han Sans | 400 (한 가지) | `family=Black+Han+Sans` |
| 본문·UI `sans` | Noto Sans KR | 400 · 500 · 700 | `family=Noto+Sans+KR:wght@400;500;700` |
| 덱 문구 '스프레이' | Rubik Spray Paint | 400 | 덱 문구가 있는 화면만 |
| 덱 문구 '페인트' | Permanent Marker | 400 | 덱 문구가 있는 화면만 |
| 덱 문구 '펜' | Nanum Pen Script | 400 | 덱 문구가 있는 화면만 |
| 덱 문구 '두꺼운' | Black Han Sans | 400 | — |

- 영문 대문자 제목은 쓰지 않습니다.
- 줄바꿈은 단어 단위(`word-break: keep-all`)로 합니다.

### 글자 크기와 위계

| 스타일 | 글꼴 | 크기 / 줄 간격 / 굵기 | 쓰는 곳 |
|---|---|---|---|
| `display-hero` | display | 80px / 1.14 / 400, 자간 -0.01em | P01 히어로 큰 제목 |
| `display-page` | display | 64px / 1.15 / 400 | P02~P06 페이지 큰 제목, 단계 숫자 01·02·03 |
| `display-section` | display | 56px / 1.2 / 400 | 메인 섹션 제목 |
| `display-band` | display | 48px / 1.2 / 400 | 구매 전 확인, 주문 완료 제목 |
| `display-tool` | display | 44px / 1.2 / 400 | P02 섹션 제목 |
| `display-sm` | display | 32px / 1.3 / 400 | 추천 결과, "가격 미정" |
| `logo` | display | 30px / 1 / 400 | 헤더·푸터 워드마크 |
| `heading` | sans | 26px / 1.4 / 700 | P03~P06 구역 제목 |
| `title-lg` | sans | 24px / 1.4 / 700 | 단계 카드 소제목 |
| `title` | sans | 22px / 1.4 / 700 | 스타일·길이 카드 소제목 |
| `lead` | sans | 18px / 1.8 / 400 | 섹션 보조 글 (구성 문장 강조는 700) |
| `hero-body` | sans | 17px / 1.8 / 400 | 히어로 본문 (데스크톱에서 문장마다 한 줄) |
| `body` | sans | 16px / 1.75 / 400 | 카드 본문 |
| `body-sm` | sans | 15px / 1.7 / 400 | 목록 행 구성 문장, 부품 설명 |
| `caption` | sans | 14px / 1.7 / 500 | 안내 글, 캡션, 입력 도움말 |
| `label` | sans | 16px / 1.5 / 700 | 입력칸·선택 묶음 이름 |
| `button-lg` | sans | 20px / 1.2 / 700 | 주요 버튼 |
| `button` | sans | 16px / 1.2 / 700 | 보조 버튼 |
| `nav` | sans | 16px / 1.2 / 500 | 메뉴 (현재 페이지 700 + 2px 밑줄) |
| `chip` | sans | 15px / 1.4 / 700 | 표시 칩 |
| `badge` | sans | 13px / 1 / 700 | 추천 칩, 개수 배지 |
| `deck-spray` 외 3종 | 덱 문구 글꼴 | 56~64px / 1 | 보드 그림 안 문구 |

---

## 4. 레이아웃과 간격

### 레이아웃 값

| 토큰 | 값 | 쓰는 곳 |
|---|---|---|
| `frame-width` | 1440px | 데스크톱 디자인 기준 너비 |
| `content-width` | 1200px | 내용 최대 너비 (좌우 여백 24px) |
| `header-height` | 80px | 헤더 최소 높이 |
| `touch-min` | 44px | 모든 링크·버튼 최소 클릭 높이 |
| `button-lg-height` | 64px | 주요 버튼 |
| `button-height` | 48px | 보조 버튼 (작업 화면 52px) |
| `input-height` | 56px | 입력칸·드롭다운 |

### 간격

| 토큰 | 값 | 쓰는 곳 |
|---|---|---|
| `space-1` | 4px | 아주 좁은 간격 |
| `space-2` | 8px | 칩 안쪽 위아래, 견본과 이름 사이 |
| `space-3` | 12px | 버튼 묶음 간격 |
| `space-4` | 16px | 옵션 카드 사이, 칩 좌우 안쪽 |
| `space-5` | 20px | 목록 행 안쪽, 보조 버튼 좌우 |
| `space-6` | 24px | 카드 사이 기본 간격, 페이지 좌우 여백 |
| `space-8` | 32px | 단계 카드 안쪽 |
| `space-10` | 40px | 패널 안쪽, 큰 묶음 사이 |
| `space-12` | 48px | 페이지 큰 제목과 첫 구역 사이 |
| `space-14` | 56px | 섹션 제목·보조 글과 카드 묶음 사이 |
| `space-18` | 72px | 작업 페이지 위쪽 여백, 푸터 위쪽 안쪽 |
| `space-24` | 96px | 히어로 위쪽 여백 |
| `space-30` | 120px | 메인 섹션 위아래 여백 |

### 배치 원칙
- 여백은 넓게 씁니다.
- 섹션은 늘 "제목 + 보조 글 → 카드 묶음" 순서입니다.
- 구간마다 바탕을 `ground` ↔ `surface` ↔ `brand` ↔ `ink`(푸터)로 바꿔 경계를 만듭니다.
- 카드는 같은 틀을 반복합니다. 사진 위·정보 아래, 왼쪽 정렬, 버튼은 맨 아래에 맞춥니다.
- 모든 페이지는 헤더(M01~M05) → 본문 → 푸터 순서입니다. 이미지 저장 창처럼 화면 위에 뜨는 창에는 푸터를 넣지 않습니다.

---

## 5. 모서리 · 선 · 그림자

| 구분 | 토큰 | 값 | 쓰는 곳 |
|---|---|---|---|
| 모서리 | `radius-sm` | 12px | 푸터 정보 상자 |
| | `radius-md` | 14px | 입력칸, 카드 안 사진, 무늬·문구 스타일 타일, 탭 윗모서리 |
| | `radius-lg` | 16px | 점선 정보 상자, 구성 문장 상자 |
| | `radius-toast` | 18px | 화면 아래 알림 |
| | `radius-card` | 20px | 모든 카드, 목록 행, 요약 상자 |
| | `radius-panel` | 28px | 큰 이미지 상자, 저장 창, 로그인·완료 패널 |
| | `radius-pill` | 999px | 모든 버튼, 칩, 배지, 구간 버튼 |
| 선 | `border-hair` | 1px | 푸터 구분선 |
| | `border-line` | 1.5px | 기본 선 (헤더 아래, 카드, 입력칸, 보조 버튼, 칩) |
| | `border-strong` | 2px | 요약·결과 상자 |
| | `border-action` | 2.5px | 주요 버튼, 선택된 카드·타일, 오류 입력칸 |
| 그림자 | `shadow-action` | 5px 5px 0 #111311 | 주요 버튼 |
| | `shadow-action-sm` | 4px 4px 0 #111311 | 카드 안 작은 주요 버튼 |
| | `shadow-dialog` | 8px 8px 0 #111311 | 이미지 저장 창 |
| | `shadow-toast` | 0 12px 32px rgba(17,19,17,0.25) | 화면 아래 알림 (유일한 부드러운 그림자) |

---

## 6. 컴포넌트

| 컴포넌트 | 쓰는 위치 (ID) | 모양과 규칙 |
|---|---|---|
| **Button – 주요** | B01-1, B02-4, B03-2, B04-1, B05-3, B06-1 | 높이 64px, `brand` 바탕, 흰 글자 20px 700, ink 2.5px 테두리, `shadow-action`, 알약 모양. 한 화면 한 구역에 하나 |
| **Button – 주요(작게)** | B05-2 | 높이 48px, 글자 15px, `shadow-action-sm` |
| **Button – 보조** | B01-2, B02-1, B02-3, B02-5, B02-6, B02-10, B03-1, B04-2, B04-3, B05-1 | 높이 48~56px, `surface` 바탕, ink 1.5px 테두리, 그림자 없음 |
| **Button – 텍스트** | B02-2, B02-8, B02-11 | 밑줄 글자, 높이 44px |
| **Button – 어두운 바탕** | B02-7 | 흰 1.5px 테두리 + 흰 글자 |
| **Chip** | 히어로 표시 칩, 안내 칩, 추천 칩, M04 개수 배지 | 알약 모양. 표시 칩은 surface + ink 테두리, 추천 칩·배지는 ink 바탕 흰 글자 |
| **Header** | 모든 페이지 (M01~M05) | 높이 80px, ground 바탕, 아래 ink 1.5px 선. 현재 페이지는 700 + 2px 밑줄, `aria-current="page"`. M05는 테두리 알약, 로그인 화면에서는 반전 |
| **Footer** | 모든 페이지 하단 | ink 바탕. 흰 로고 + 소개 글 / 메뉴, 이용약관·개인정보처리방침, 사업자 정보 자리(점선), © FIT'SUP |
| **Card** | S01-2 스타일 카드, S01-3 단계 카드, P05 저장한 디자인 카드 | `radius-card`. 스타일 카드는 ground 바탕·테두리 없음·4:5 사진, 단계 카드는 surface + ink 테두리 + 큰 숫자, 저장 카드는 썸네일 → 이름 → 구성 문장 → 버튼 |
| **OptionCard** | S02-2 타는 스타일·길이 고르기 | `aria-pressed` 버튼. 기본 ground + line-soft 테두리. 스타일 선택은 ink 반전 + ✓, 길이 선택은 ink 2.5px 테두리 + ✓ + '추천' 칩 |
| **Customizer** | S02-3 오른쪽 묶음 | 길이 구간 버튼(알약 3칸, 선택 칸 반전) → 부품 탭(덱/바퀴/트럭) → 부품 설명 → 색 견본(40px 원 + 직접 입력 '#'칸) → 무늬 타일 → 덱 문구 입력 → 문구 스타일 타일 |
| **TextField** | S02-2 키·신발, S02-3 덱 문구, S04-2 배송 정보 | 높이 56px, ink 1.5px 테두리, `radius-md`, 라벨은 위에 16px 700. 오류는 error 2.5px 테두리 + 아이콘 + 안내 문장 |
| **Toast** | P02·P05 담기·저장 완료 알림 | ink 바탕, 흰 글자 17px 700, `radius-toast`, 최대 640px, 화면 아래 6초, `role="status"` |
| **ListRow** | S03-1 담은 보드 목록, S04-1 주문 확인 | 썸네일(180×104) → 이름·구성 → 가격 → 삭제. 주문 확인에서는 삭제 없음 |
| **Band** | S01-4 구매 전 확인 | brand 넓은 면, 흰 글자, 확정 전 정보는 흰 점선 상자에 "판매 정책 확정 후 안내" |
| **Dialog** | P02 이미지 저장 창 | scrim 바탕 위 흰 창, `radius-panel`, ink 테두리, `shadow-dialog` |

---

## 7. 아이콘 · 보드 그림 · 이미지 · 로고

### 아이콘
- 인라인 SVG 선 아이콘. 선 굵기 2~2.5px, 둥근 끝, 색은 주변 글자색을 따름
- 사용 아이콘: 화살표(→ ↓), 체크, 정보(i), 휴지통, 내려받기, 카메라(사진 자리), 자물쇠(로그인 필요), 연필(직접 만들기)
- 글자 없이 아이콘만 있는 버튼에는 `aria-label`을 붙임

### 보드 그림
- 윗면: 끝이 둥근 긴 덱 막대 + 위아래로 보이는 바퀴 4개, ink 4~5px 선
- 옆모습: 얇은 덱 + `truck-silver` 트럭 + 바퀴 2개(가운데 흰 축 원)
- 무늬: 무지 · 스트라이프 · 체커 · 플레임 + 직접 만들기. 체커 칸은 20px(썸네일 6px)
- 덱 문구: ink 글자 + 흰 테두리(paint-order: stroke), -4° 기울임
- 모든 보드 그림에 구성 문장을 대체 텍스트로 붙임. 예: "블루 덱, 체커 무늬, 스프레이 스타일 leeeee 문구, 블랙 바퀴 보드의 윗면"

### 이미지
- S01-2 라이딩 사진 4장: 동작이 드러나는 실제 야외 장면, 모두 4:5 (05 문서 R5)
- 사진 전에는 `placeholder` 바탕 + 카메라 아이콘 + "라이딩 사진 자리"
- 사진은 사용자가 `fitsup/assets/`에 직접 넣기로 함 [미정: 파일]

### 로고
- 보드 옆모습 심볼(44×26) + "핏썹" 워드마크(Black Han Sans 30px)
- 밝은 바탕은 ink, ink 바탕(푸터)은 흰색. 브랜드 블루로 칠하지 않음
- 파일: `fitsup/assets/logo.svg`, 디자인 시스템 Logos 그룹(`fitsup-mark-ink.svg`, `fitsup-mark-white.svg`)

---

## 8. 말투

- 한 줄 설명: 보드 잘 타는 친한 선배가 존댓말로 쉽게 알려 주는 말투. 문장은 짧게, "~해요"로 끝냄
- 예시: "키만 알려 줘요. 나머진 우리가 딱 맞춰 볼게요."
- 피함: 구매를 재촉하는 말, 전문가 용어만 쓰는 설명, 유치한 말투
- 조사는 받침에 맞춤: 서프 스케이트로 · 카빙으로 · 사이드와인더로 · 크루저로

---

## 9. 접근성

- 글자 대비 4.5:1 이상 (예: `text-muted`/ground 약 9:1, 흰 글자/brand 약 7.3:1, error/surface 약 5.9:1)
- ⚠️ `line-soft` 테두리는 ground 위 대비 약 1.5:1로 컨트롤 테두리 기준(3:1)에 못 미침 → 선택 여부는 반전이나 ink 2.5px 테두리로만 구분
- 클릭 영역 44px 이상
- 선택 버튼 `aria-pressed`, 탭 `role="tab"`, 미리보기 구성 문장 `aria-live="polite"`, 오류 `aria-invalid` + `aria-describedby`
- 키보드 초점: 3px ink 테두리, 4px 띄움

---

## 10. 쓰지 않는 요소

할인율 배지, 취소선 가격, 빨간 판매가, 별점·리뷰 수, '함께 보기' 추천 줄, 슬라이드 화살표, 그라데이션, 이모지, 영문 대문자 제목

---

## 11. 디자인 단계에서 바뀐 내용 (04 문서 대비)

| 항목 | 04 문서 / 처음 제안 | 지금 디자인 |
|---|---|---|
| 핵심 버튼 강조색 | 라임 #C8F03C (3단계 제안) | 블루 #1E3FD0 + 흰 글자 |
| 덱 무늬 | 무지 / 스트라이프 / 체커 / 웨이브 | 무지 / 스트라이프 / 체커 / 플레임 / 직접 만들기 |
| 덱 색상 | 6색 견본 | 6색 견본 + '#' 색 코드 직접 입력 |
| 덱 문구 | 입력칸만 | 입력칸 + 문구 스타일(페인트·스프레이·펜·두꺼운) |
| 푸터 | 없음 | 모든 페이지에 추가 |
| P01 S01-3 '03 주문하기' 보조 글 | "…이 사이트는 체험용이라 실제 결제는 없어요." | "장바구니에 담아 주문까지." (체험용 문구 삭제) |
| 예시 보드 | 민트 · 코랄 바퀴 · 웨이브 · "MY RIDE" | 블루 · 블랙 바퀴 · 체커 · 스프레이 "leeeee" (P02~P05) |

---

## 12. 다음 단계에서 결정할 내용

- [ ] 강조색 하나(블루)로 버튼과 넓은 면을 함께 쓸지, 역할을 다시 나눌지
- [ ] 실제 판매 사이트로 바꿀지: P04 주문·결제의 체험용 문구, '가상 결제' 버튼, 주문 완료 문구, 결제 수단 화면
- [ ] 무늬(플레임·직접 만들기), 문구 스타일, 색 직접 입력을 기획(04 문서)에 정식으로 넣을지와 '직접 만들기' 방식
- [ ] 판매 색상·무늬 목록, 문구 최대 글자 수
- [ ] 사업자 정보, 이용약관·개인정보처리방침 내용
- [ ] 가격·배송비 표기 방식
- [ ] 비활성 버튼 모양 (B03-2 담은 보드 없음)
- [ ] 다크 모드 여부
- [ ] 움직임 효과 (5단계), 모바일 배치 (6단계)
- [ ] 라이딩 사진 4장, 워드마크 윤곽선 로고 파일

---

## 부록. 구현용 CSS 변수

React 앱에서 그대로 쓸 수 있는 변수 목록입니다. 이름은 디자인 시스템 토큰과 같습니다.

```css
:root {
  /* color */
  --ink: #111311; --ground: #f3f4f1; --surface: #ffffff;
  --text-muted: #3e403b; --text-caption: #4a4c47;
  --line-soft: #c9cbc3; --placeholder: #dcddd6;
  --brand: #1e3fd0; --on-brand: #ffffff; --error: #c21f30;
  --on-ink: #ffffff; --on-ink-muted: #c9cbc3; --on-ink-line: #3e403b; --on-ink-dashed: #6e706b;
  --scrim: #6e706b;
  --deck-mint: #7fd8be; --deck-white: #ffffff; --deck-coral: #ff6f5e; --deck-blue: #1e3fd0;
  --deck-gray: #9a9d96; --deck-black: #111311; --truck-silver: #b8bcc2;

  /* font */
  --font-display: "Black Han Sans", "Noto Sans KR", sans-serif;
  --font-sans: "Noto Sans KR", system-ui, sans-serif;
  --font-deck-spray: "Rubik Spray Paint", sans-serif;
  --font-deck-marker: "Permanent Marker", cursive;
  --font-deck-pen: "Nanum Pen Script", cursive;

  /* spacing */
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-5: 20px; --space-6: 24px;
  --space-8: 32px; --space-10: 40px; --space-12: 48px; --space-14: 56px; --space-18: 72px;
  --space-24: 96px; --space-30: 120px;

  /* radius */
  --radius-sm: 12px; --radius-md: 14px; --radius-lg: 16px; --radius-toast: 18px;
  --radius-card: 20px; --radius-panel: 28px; --radius-pill: 999px;

  /* border */
  --border-hair: 1px; --border-line: 1.5px; --border-strong: 2px; --border-action: 2.5px;

  /* shadow */
  --shadow-action: 5px 5px 0 #111311; --shadow-action-sm: 4px 4px 0 #111311;
  --shadow-dialog: 8px 8px 0 #111311; --shadow-toast: 0 12px 32px rgba(17, 19, 17, 0.25);

  /* layout */
  --frame-width: 1440px; --content-width: 1200px; --header-height: 80px; --touch-min: 44px;
  --button-lg-height: 64px; --button-height: 48px; --input-height: 56px;
}
```
