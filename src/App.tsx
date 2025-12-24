import './App.css'
import Header from './components/Header/Header'
import Products from './pages/Products'
import Cart from './pages/Cart'
import { Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer/Footer'
import { useState } from 'react'

export default function App() {

    const [carouselIndex, setCarouselIndex] = useState(0);
  const location = useLocation();
  const hideHeader = location.pathname === '/cart';
  return (
    <div className="app">
      {!hideHeader && <Header carouselIndex={carouselIndex} />}
      <main className="container">
        <Routes>
          <Route path="/" element={<Products onCarouselChange={setCarouselIndex} />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>
        <Footer />
    </div>
  )
}
