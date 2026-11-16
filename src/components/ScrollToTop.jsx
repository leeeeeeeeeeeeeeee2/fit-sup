import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// 페이지를 옮기면 맨 위에서 시작 (#섹션 주소는 각 페이지가 처리)
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}
