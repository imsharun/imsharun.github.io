import { useNavigate } from 'react-router-dom';
import type { OreganoProduct } from '../../types';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }: { product: OreganoProduct }) {
    const { addItem } = useCart();
    const navigate = useNavigate();
    const [defaultSize, defaultPrice] = Object.entries(product.price)[0] ?? [];

    const goToDetails = () => navigate(`/products/${product.id}`);

    return (
        <div className="product-card">
                <img onClick={goToDetails}src={product.image} alt={product.name} className="product-image" />
            <div className="product-body">
                <div className="product-title" onClick={goToDetails}>{product.name}</div>

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
