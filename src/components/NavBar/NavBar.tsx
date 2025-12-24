import { NavLink } from 'react-router-dom';
import './NavBar.css';
import Icon from '../Common/Icon/Icon';
import cartDark from '../../assets/icons/cart-dark.png';
import homeDark from '../../assets/icons/home-dark.png';
import { useCart } from '../../context/CartContext';
export default function NavBar({ show }: { show?: boolean }) {
    const { totalItems } = useCart();

    return (
        <nav className={`nav ${show ? 'visible' : 'hidden'}`}>
            <div className='nav-links-container'>
            <NavLink to="/" end aria-label="Home" onClick={() => {
    if (window.location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }} >
                <Icon light={homeDark} dark={homeDark} alt="Home" />
            </NavLink>

            <NavLink to="/cart" className="cart-link" aria-label="Cart">
                <Icon light={cartDark} dark={cartDark} alt="Cart" />
                <span className="badge">{totalItems}</span>
            </NavLink></div>
        </nav>

    );
}
