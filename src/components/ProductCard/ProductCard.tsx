import type { OreganoProduct } from '../../types';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }: { product: OreganoProduct }) {
    const { addItem } = useCart();
    const [defaultSize, defaultPrice] = Object.entries(product.price)[0] ?? [];
    return (
        <div className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-body">
                <div className="product-title">{product.name}</div>

                <div className="price">
                    {defaultPrice !== undefined
                        ? `₹${defaultPrice.toFixed(2)} / ${defaultSize}`
                        : 'Price unavailable'}
                </div>
                <button onClick={() => addItem(product)}>Add to Cart</button>
            </div>
        </div>
    );
}
