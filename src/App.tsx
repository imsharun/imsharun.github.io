import './App.css'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import ProductDetail from './pages/ProductDetail'
import Contact from './pages/Contact'
import { Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer/Footer'
import NavBar from './components/NavBar/NavBar'
//import NavBar from './components/NavBar/NavBar'
import useScrollPosition from './hooks/useScrollPosition'

export default function App() {
  const location = useLocation()
  const scrollY = useScrollPosition()

  const showNav = location.pathname !== '/cart' &&
    (location.pathname === '/' && scrollY > 200)


  return (
    <div className="app">
      <NavBar show={showNav}></NavBar>

      <main className="container">
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

 
