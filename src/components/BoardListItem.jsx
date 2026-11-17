import { QTY_MAX } from '../data/options.js'
import { boardName, describe } from '../lib/design.js'
import { lineTotal, priceOf, qtyOf, won } from '../lib/price.js'
import { BoardThumb } from './Board.jsx'
import { Trash } from './Icons.jsx'

// P03·P04 목록 행: 윗면 이미지 → 이름·구성 → (수량) → 가격 → (삭제)
// onQty가 있으면 수량을 −/+로 1~5개 바꿀 수 있음 (P03)
export default function BoardListItem({ item, onRemove, onQty }) {
  const { design } = item
  const qty = qtyOf(item)
  const name = boardName(design)
  return (
    <li className="board-row">
      <span className="board-row__thumb">
        <BoardThumb design={design} />
      </span>
      <div className="board-row__info">
        <p className="board-row__name">{`${name} · ${design.length}인치 · 수량 ${qty}개`}</p>
        <p className="board-row__spec">{describe(design)}</p>
      </div>
      {onQty && (
        <div className="qty" role="group" aria-label={`${name} 수량`}>
          <button
            type="button"
            className="qty__btn"
            aria-label="수량 줄이기"
            disabled={qty <= 1}
            onClick={() => onQty(qty - 1)}
          >
            −
          </button>
          <span className="qty__num" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            className="qty__btn"
            aria-label="수량 늘리기"
            disabled={qty >= QTY_MAX}
            onClick={() => onQty(qty + 1)}
          >
            +
          </button>
        </div>
      )}
      <p className="board-row__price">
        {won(lineTotal(item))}
        {qty > 1 && <span className="board-row__unit">{`1개 ${won(priceOf(design).total)}`}</span>}
      </p>
      {onRemove && (
        <button data-id="B03-1" type="button" className="btn btn--sm" aria-label={`${name} 삭제`} onClick={onRemove}>
          <Trash />
          삭제
        </button>
      )}
    </li>
  )
}
