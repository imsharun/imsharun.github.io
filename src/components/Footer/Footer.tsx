import './Footer.css';
import logo from '../../assets/oregano-logo.png';


export default function Footer() {
  return (
    <footer className="footer">
        
      <div className="footer-content">
        <div className="footer-logo">
              <img src={logo} alt='Oregano Spices' />
        </div>
        <div className="footer-column">
          <h3>Policy</h3>
          <ul>
            <li><a href="#cancellation">Cancellation</a></li>
            <li><a href="#return">Return</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Company</h3>
          <ul>
            <li><a href="#about">About us</a></li>
            <li><a href="#shop">Shop</a></li>
            <li><a href="#contact">Contact us</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Help</h3>
          <ul>
            <li><a href="#tracking">Order Tracking</a></li>
            <li><a href="#payment">Payment</a></li>
            <li><a href="#faq">FAQ</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Oregano Spices 2025 | All rights Reserved</p>
      </div>
    </footer>
  );
}