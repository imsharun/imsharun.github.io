import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem/CartItem';
import backArrow from '../assets/icons/back-arrow-dark.png';

import './Cart.css';
import Icon from '../components/Common/Icon/Icon';

export default function Cart() {
  const { state, subtotal, loading } = useCart();
  const hasItems = state.items.length > 0;
  const navigate = useNavigate();
  return (
    <section className="cart-page">
      <div className="back-button-container">
       <button onClick={() => navigate('/')}>
      <Icon light={backArrow} alt="Back to Home" className='back-arrow' />
        </button>  <h1>Cart</h1>
        </div>

      {loading && <div className="cart-loader">Loading cart...</div>}
      {!loading && !hasItems && <p>Your cart is empty.</p>}
      {!loading && hasItems && (
        <div className="cart-grid">
          {state.items.map(({ product, quantity }) => (
            <CartItem key={product.id} product={product} quantity={quantity} />
          ))}
        </div>
      )}
      {!loading && (
        <div className="cart-summary">
            <div className="row">
              <span>Subtotal</span>
              <strong>₹{subtotal.toFixed(2)}</strong>
            </div>
            <div className="actions">
              <button onClick={() => navigate('/checkout')}>Checkout</button>
            </div>
          </div>
      )}
    </section>
  );
}
