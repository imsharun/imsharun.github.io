import type { OreganoProduct } from '../../types';
import { useCart } from '../../context/CartContext';
import removeIcon from '../../assets/icons/remove.png';
import './CartItem.css';
import Icon from '../Common/Icon/Icon';
interface CartItemProps {
  product: OreganoProduct;
  quantity: number;
}

export default function CartItem({ product, quantity }: CartItemProps) {
  const { updateQty, removeItem } = useCart();

  const dec = () => updateQty(product.id, Math.max(1, quantity - 1));
  const inc = () => updateQty(product.id, quantity + 1);

  return (
    <div className='cart-item-container'>
      <div className="cart-item">
        <button onClick={() => removeItem(product.id)} className="btn-remove-item" aria-label="Remove item">
          <Icon light={removeIcon} alt="Remove" />
        </button>
        <img src={product.image} alt={product.name} />
        <div className="cart-info">
          <div>{product.name}</div>
          <p>
            {(() => {
              const [size, price] = Object.entries(product.price)[0] ?? [];
              return price !== undefined ? `₹${price.toFixed(2)} / ${size}` : 'Price unavailable';
            })()}
          </p>
        </div>
      </div>
      <div className="qty-counter">
        <button aria-label="Decrease quantity" onClick={dec}>−</button>
        <span className="qty-value" aria-live="polite">{quantity}</span>
        <button aria-label="Increase quantity" onClick={inc}>+</button>
      </div>
    </div>
  );
}
