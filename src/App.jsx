import { Navigate, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import Toast from './components/Toast.jsx'
import BuildPage from './pages/BuildPage.jsx'
import CartPage from './pages/CartPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import MainPage from './pages/MainPage.jsx'
import MyDesignsPage from './pages/MyDesignsPage.jsx'
import OrderCompletePage from './pages/OrderCompletePage.jsx'
import ReviewsPage from './pages/ReviewsPage.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'

// 페이지 주소
// P01 /  · P02 /build  · P03 /cart  · P04 /checkout (완료 /checkout/complete)  · P05 /my-designs  · P06 /login  · P07 /reviews
function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/build" element={<BuildPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout/complete" element={<OrderCompletePage />} />
        <Route path="/my-designs" element={<MyDesignsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
      <Toast />
    </>
  )
}

export default App
