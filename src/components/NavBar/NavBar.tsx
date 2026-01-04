import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './NavBar.css';
import Icon from '../Common/Icon/Icon';
import cartDark from '../../assets/icons/cart-dark.png';
import homeDark from '../../assets/icons/home-dark.png';
import { useCart } from '../../context/CartContext';
import { getCurrentUserInfo, logout } from '../../services/authService';
export default function NavBar({ show }: { show?: boolean }) {
    const { totalItems } = useCart();
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const user = await getCurrentUserInfo();
            if (user?.signInDetails?.loginId) {
                setUserEmail(user.signInDetails.loginId);
            } else {
                setUserEmail(null);
            }
        })();
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            setUserEmail(null);
            navigate('/');
        } catch (err) {
            console.error('Logout failed', err);
        }
    };

    return (
        <nav className={`nav ${show ? 'visible' : 'hidden'}`}>
            <NavLink  className='nav-left' to="/" end aria-label="Home" onClick={() => {
    if (window.location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }} >
                <Icon light={homeDark} dark={homeDark} alt="Home" />
            </NavLink>

            <div className="nav-right">
                <div className="auth-actions">
                    {userEmail ? (
                        <>
                            <span className="nav-user" title={userEmail}>{userEmail}</span>
                            <button className="nav-auth-btn" type="button" onClick={handleLogout}>
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="nav-auth-btn" type="button" onClick={() => navigate('/login')}>
                                Log in
                            </button>
                            <button className="nav-auth-btn primary" type="button" onClick={() => navigate('/signup')}>
                                Sign up
                            </button>
                        </>
                    )}
                </div>
                <NavLink className='cart-link' to="/cart" aria-label="Cart">
                    <Icon light={cartDark} dark={cartDark} alt="Cart" />
                    <span className="badge">{totalItems}</span>
                </NavLink>
            </div>
        </nav>

    );
}
