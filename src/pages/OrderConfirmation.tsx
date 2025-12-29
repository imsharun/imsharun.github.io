import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../components/Common/Icon/Icon';
import backArrow from '../assets/icons/back-arrow-dark.png';
import './OrderConfirmation.css';

type OrderItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
};

type OrderState = {
  id: string;
  items: OrderItem[];
  subtotal: number;
  address: {
    fullName: string;
    phone: string;
    email: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  placedAt: number;
};

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const order = state as OrderState | undefined;

  if (!order) {
    return (
      <section className="order-confirmation-page">
        <div className="back-button-container">
          <button onClick={() => navigate('/')}> 
            <Icon light={backArrow} alt="Back to Home" className='back-arrow' />
          </button>
          <h1>Order Confirmation</h1>
        </div>
        <p>No order details found. Return to products to shop.</p>
        <div className="actions">
          <button onClick={() => navigate('/')}>Browse Products</button>
        </div>
      </section>
    );
  }

  return (
    <section className="order-confirmation-page">
      <div className="back-button-container">
        <button onClick={() => navigate('/')}> 
          <Icon light={backArrow} alt="Back to Home" className='back-arrow' />
        </button>
        <h2>Order Confirmed</h2>
      </div>

      <div className="card">
        <div className="order-header">
          <div>
            <div className="order-id">Order ID: <strong>{order.id}</strong></div>
            <div className="order-date">Placed: {new Date(order.placedAt).toLocaleString()}</div>
          </div>
          <div className="order-total">Subtotal: <strong>₹{order.subtotal.toFixed(2)}</strong></div>
        </div>

        <div className="order-content">
          <div className="items">
            <h2>Items</h2>
            <ul>
              {order.items.map(item => (
                <li key={item.id}>
                  <span className="name">{item.name}</span>
                  <span className="qty">x{item.quantity}</span>
                  <span className="price">₹{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="address">
            <h2>Shipping Address</h2>
            <address>
              <div>{order.address.fullName}</div>
              <div>{order.address.phone}{order.address.email ? ` · ${order.address.email}` : ''}</div>
              <div>{order.address.address1}</div>
              {order.address.address2 && <div>{order.address.address2}</div>}
              <div>{order.address.city}, {order.address.state} {order.address.postalCode}</div>
              <div>{order.address.country}</div>
            </address>
          </div>
        </div>

        <div className="actions">
          <button onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      </div>
    </section>
  );
}
