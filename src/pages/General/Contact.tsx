import { useNavigate } from 'react-router-dom';
import './Contact.css';

const EMAIL = 'hello@oreganospices.com';
const PHONE = '+91 98765 43210';

export default function Contact() {
  const navigate = useNavigate();

  return (
    <section className="contact-page">
      <div className="contact-card">
        <h1>Contact Us</h1>
        <p>We would love to hear from you. Reach out anytime.</p>

        <div className="contact-grid">
          <div className="contact-item">
            <div className="label">Email</div>
            <a href={`mailto:${EMAIL}`} className="value">{EMAIL}</a>
          </div>

          <div className="contact-item">
            <div className="label">Phone</div>
            <a href={`tel:${PHONE.replace(/\s+/g, '')}`} className="value">{PHONE}</a>
          </div>
        </div>

        <div className="note">Available 9:00–18:00 IST, Monday to Saturday.</div>

        <div className="contact-actions">
          <button onClick={() => navigate(-1)}>Back</button>
          <button className="secondary" onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      </div>
    </section>
  );
}
