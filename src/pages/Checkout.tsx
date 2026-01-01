import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Icon from '../components/Common/Icon/Icon';
import backArrow from '../assets/icons/back-arrow-dark.png';
import { createOrder } from '../services/razorpayService';

import './Checkout.css';

type AddressForm = {
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

export default function Checkout() {
  const navigate = useNavigate();
  const { state, subtotal, clear } = useCart();

  declare global {
    interface Window {
      Razorpay?: any;
    }
  }

  const [form, setForm] = useState<AddressForm>(() => {
    try {
      const raw = localStorage.getItem('checkout:address:v1');
      return raw ? (JSON.parse(raw) as AddressForm) : {
        fullName: '',
        phone: '',
        email: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
      };
    } catch {
      return {
        fullName: '',
        phone: '',
        email: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
      };
    }
  });

  const hasItems = state.items.length > 0;

  function update<K extends keyof AddressForm>(key: K, value: AddressForm[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function isValid() {
    // Minimal validation: required fields present and phone/postal basic pattern
    const requiredFilled = [
      form.fullName,
      form.phone,
      form.address1,
      form.city,
      form.state,
      form.postalCode,
      form.country,
    ].every(Boolean);

    const phoneOk = /^\+?[0-9\s-]{7,15}$/.test(form.phone);
    const postalOk = /^[A-Za-z0-9\s-]{3,12}$/.test(form.postalCode);
    const emailOk = !form.email || /.+@.+\..+/.test(form.email);

    return requiredFilled && phoneOk && postalOk && emailOk && hasItems;
  }

  const loadRazorpayScript = (src = 'https://checkout.razorpay.com/v1/checkout.js') => {
    return new Promise<boolean>((resolve) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve(true);
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  async function handleBuy(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid()) return;
    // Persist last used address
    try {
      localStorage.setItem('checkout:address:v1', JSON.stringify(form));
    } catch {}

    const amountInPaise = Math.round(subtotal * 100);

    // create order on backend to get a valid Razorpay order id
    let orderId: string | undefined;
    try {
      orderId = await createOrder(amountInPaise);
    } catch (err) {
      alert('Could not create order. Please try again.');
      return;
    }

    const ok = await loadRazorpayScript();
    if (!ok || !(window as any).Razorpay) {
      alert('Razorpay SDK failed to load');
      return;
    }

    const options: any = {
      key: (import.meta as any).env.VITE_RAZORPAY_KEY || 'YOUR_KEY_ID',
      amount: amountInPaise,
      currency: 'INR',
      name: 'Oregano Spices Inc',
      description: 'Order Payment',
      image: 'https://example.com/your_logo',
      order_id: orderId,
      handler: function (response: any) {
        // on success, create order and navigate to confirmation
        const order = {
          id: Math.random().toString(36).slice(2).toUpperCase(),
          items: state.items.map(i => ({
            id: i.product.id,
            name: i.product.name,
            quantity: i.quantity,
            price: Object.values(i.product.price)[0] ?? 0,
          })),
          subtotal,
          address: form,
          placedAt: Date.now(),
          payment: response,
        };

        try { clear(); } catch {}
        navigate('/order-confirmation', { state: order });
      },
      prefill: {
        name: form.fullName,
        email: form.email,
        contact: form.phone,
      },
      notes: { address: form.address1 },
      theme: { color: '#3399cc' },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.on('payment.failed', (resp: any) => {
      console.error('Payment failed', resp);
      alert('Payment failed. See console for details.');
    });
    rzp.open();
  }

  // Auto-save address as user types
  useEffect(() => {
    try {
      localStorage.setItem('checkout:address:v1', JSON.stringify(form));
    } catch {}
  }, [form]);

  return (
    <section className="checkout-page">
      <div className="back-button-container">
        <button onClick={() => navigate('/cart')}>
          <Icon light={backArrow} alt="Back to Cart" className='back-arrow' />
        </button>
        <h1>Checkout</h1>
      </div>

      {!hasItems && (
        <p className="empty-note">Your cart is empty. Add items to continue.</p>
      )}

      <form className="checkout-form" onSubmit={handleBuy}>
        <div className="form-grid">
          <label>
            <span>Full Name</span>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => update('fullName', e.target.value)}
              required
            />
          </label>

          <label>
            <span>Phone</span>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => update('phone', e.target.value)}
              placeholder="e.g. +91 98765 43210"
              required
            />
          </label>

          <label>
            <span>Email (optional)</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => update('email', e.target.value)}
              placeholder="you@example.com"
            />
          </label>

          <label className="wide">
            <span>Address Line 1</span>
            <input
              type="text"
              value={form.address1}
              onChange={(e) => update('address1', e.target.value)}
              required
            />
          </label>

          <label className="wide">
            <span>Address Line 2</span>
            <input
              type="text"
              value={form.address2}
              onChange={(e) => update('address2', e.target.value)}
              placeholder="Apartment, suite, etc. (optional)"
            />
          </label>

          <label>
            <span>City</span>
            <input
              type="text"
              value={form.city}
              onChange={(e) => update('city', e.target.value)}
              required
            />
          </label>

          <label>
            <span>State</span>
            <input
              type="text"
              value={form.state}
              onChange={(e) => update('state', e.target.value)}
              required
            />
          </label>

          <label>
            <span>Postal Code</span>
            <input
              type="text"
              value={form.postalCode}
              onChange={(e) => update('postalCode', e.target.value)}
              required
            />
          </label>

          <label>
            <span>Country</span>
            <input
              type="text"
              value={form.country}
              onChange={(e) => update('country', e.target.value)}
              required
            />
          </label>
        </div>

        <div className="order-summary">
          <div className="row">
            <span>Items</span>
            <strong>{state.items.reduce((a, i) => a + i.quantity, 0)}</strong>
          </div>
          <div className="row">
            <span>Subtotal</span>
            <strong>₹{subtotal.toFixed(2)}</strong>
          </div>
          <div className="actions">
            <button type="submit" disabled={!isValid()}>
              Pay Now
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
