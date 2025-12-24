import type { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }: { product: Product }) {
    const { addItem } = useCart();
    return (
        <div className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-body">
                <div className="product-title">{product.name}</div>

                <div className="price">₹{product.price.toFixed(2)}</div>
                <button onClick={() => addItem(product)}>Add to Cart</button>
            </div>
        </div>
    );
}
