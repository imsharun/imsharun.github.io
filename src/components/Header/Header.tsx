//import { NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Header.css';
//import cartLight from '../../assets/icons/cart-light.png';
//import cartDark from '../../assets/icons/cart-dark.png';

// import homeLight from '../../assets/icons/home-light.png';
// import homeDark from '../../assets/icons/home-dark.png';

// import Icon from '../Common/Icon/Icon';

import home1 from '../../assets/home/home2.png';
import home2 from '../../assets/home/home3.png';

export default function Header() {
    const { totalItems } = useCart();
    return (
        <header className="site-header">
            <div className="header-inner">
                <div className="brand">
                    <div className='brand-title'>Oregano </div>
                    <div className='brand-title-2'>Spices</div>
                    <div className='brand-subtitle'>Authentic spices from Idukki hills</div>
                </div>
                  
                {/* <nav className="nav">
                    <NavLink to="/" end aria-label="Home">
                        <Icon light={homeLight} dark={homeDark} alt="Home" />
                    </NavLink>
                   
                    <NavLink to="/cart" className="cart-link" aria-label="Cart">
                        <Icon light={cartLight} dark={cartDark} alt="Cart" />
                        <span className="badge">{totalItems}</span>
                    </NavLink>
                </nav> */}
            </div>
             <div className='top-images-container'>
                <div className="top-image-1-container">   <img src={home1} className="top-image-1" /></div>
     
                <div className="top-image-2-container"> <img src={home2} className="top-image-2" /></div>
     
       
      </div>
        </header>
    );
}
