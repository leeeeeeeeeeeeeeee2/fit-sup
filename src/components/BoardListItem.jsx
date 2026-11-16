import { boardName, describe } from '../lib/design.js'
import { priceOf, won } from '../lib/price.js'
import { BoardThumb } from './Board.jsx'
import { Trash } from './Icons.jsx'

// P03·P04 목록 행: 윗면 이미지 → 이름·구성 → 가격 → (삭제)
export default function BoardListItem({ design, onRemove }) {
  const name = boardName(design)
  return (
    <li className="board-row">
      <span className="board-row__thumb">
        <BoardThumb design={design} />
      </span>
      <div className="board-row__info">
        <p className="board-row__name">{`${name} · ${design.length}인치 · 수량 1개`}</p>
        <p className="board-row__spec">{describe(design)}</p>
      </div>
      <p className="board-row__price">{won(priceOf(design).total)}</p>
      {onRemove && (
        <button data-id="B03-1" type="button" className="btn btn--sm" aria-label={`${name} 삭제`} onClick={onRemove}>
          <Trash />
          삭제
        </button>
      )}
    </li>
  )
}
