import './App.css'
import Products from './pages/Products'
import Cart from './pages/Cart'
import { Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer/Footer'
import NavBar from './components/NavBar/NavBar'
//import NavBar from './components/NavBar/NavBar'
import useScrollPosition from './hooks/useScrollPosition'
import { useEffect } from 'react'

export default function App() {
  const location = useLocation()
  const scrollY = useScrollPosition()

  const showNav =
    location.pathname !== '/' || scrollY > 300


  return (
    <div className="app">
      <NavBar show={showNav}></NavBar>

      <main className="container">
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}
