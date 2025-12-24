import './App.css'
import Header from './components/Header/Header'
import Products from './pages/Products'
import Cart from './pages/Cart'
import { Route, Routes } from 'react-router-dom'
import Footer from './components/Footer/Footer'

export default function App() {
  return (
    <div className="app">
      <Header />
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
