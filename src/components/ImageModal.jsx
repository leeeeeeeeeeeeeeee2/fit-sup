import { useEffect, useRef } from 'react'
import { useState } from 'react'
import { describe } from '../lib/design.js'
import { BoardTop } from './Board.jsx'
import { Download } from './Icons.jsx'

// 미리보기 SVG + 구성 문장을 PNG로 만들어 내려받기
function downloadPng(svgEl, caption) {
  const W = 1200
  const H = 600
  const clone = svgEl.cloneNode(true)
  clone.setAttribute('width', '1080')
  clone.setAttribute('height', '396')
  const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(clone))}`
  const img = new Image()
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#F3F4F1'
    ctx.fillRect(0, 0, W, H)
    ctx.drawImage(img, 60, 48, 1080, 396)
    ctx.fillStyle = '#111311'
    ctx.font = '700 30px "Noto Sans KR", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(caption, W / 2, 520, W - 80)
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = 'fitsup-board.png'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }
  img.src = src
}

// 모바일·태블릿용: 내려받기와 같은 그림을 PNG 주소로 만들어 돌려줌 (길게 눌러 저장할 수 있게)
function renderPngUrl(svgEl, caption, done) {
  const W = 1200
  const H = 600
  const clone = svgEl.cloneNode(true)
  clone.setAttribute('width', '1080')
  clone.setAttribute('height', '396')
  const src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(clone))}`
  const img = new Image()
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = W
    canvas.height = H
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#F3F4F1'
    ctx.fillRect(0, 0, W, H)
    ctx.drawImage(img, 60, 48, 1080, 396)
    ctx.fillStyle = '#111311'
    ctx.font = '700 30px "Noto Sans KR", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(caption, W / 2, 520, W - 80)
    done(canvas.toDataURL('image/png'))
  }
  img.src = src
}

// 이미지 저장 창 (B02-6으로 열고, B02-11로 닫으면 B02-6으로 돌아감)
export default function ImageModal({ design, onClose }) {
  const svgRef = useRef(null)
  const closeRef = useRef(null)
  const caption = describe(design)
  // 모바일·태블릿에서 SVG 대신 보여 줄 PNG (데스크톱에서는 .m-only로 숨김)
  const [pngUrl, setPngUrl] = useState('')
  useEffect(() => {
    if (!svgRef.current) return undefined
    let alive = true
    renderPngUrl(svgRef.current, caption, (url) => alive && setPngUrl(url))
    return () => {
      alive = false
    }
  }, [caption])

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby="img-title" className="dialog">
        <h2 id="img-title" className="dialog__title">
          미리보기 이미지
        </h2>
        <figure className="dialog__figure">
          <BoardTop design={design} svgRef={svgRef} />
          {pngUrl && <img className="m-only dialog__png" src={pngUrl} alt={`${caption} 미리보기 이미지`} />}
          <figcaption>{caption}</figcaption>
        </figure>
        <p className="dialog__help">다운로드가 되지 않으면 이미지를 길게 누르거나 마우스 오른쪽 버튼으로 저장해 주세요.</p>
        <div className="dialog__actions">
          <button data-id="B02-11" type="button" className="btn-text" ref={closeRef} onClick={onClose}>
            닫기
          </button>
          <button
            data-id="B02-10"
            type="button"
            className="btn btn--md"
            onClick={() => svgRef.current && downloadPng(svgRef.current, caption)}
          >
            <Download />
            이미지 내려받기
          </button>
        </div>
      </div>
    </div>
  )
}
