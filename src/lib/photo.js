// 올린 사진을 작게 줄여 데이터 주소로 (브라우저 저장 공간을 아끼려고 긴 변 max px)
export function readPhoto(file, max = 400) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('사진 파일(JPG, PNG 등)만 올릴 수 있어요.'))
      return
    }
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve({ src: canvas.toDataURL('image/webp', 0.85), ratio: img.width / img.height })
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('이미지를 읽지 못했어요.'))
    }
    img.src = url
  })
}
