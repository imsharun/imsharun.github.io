import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { catalog } from '../data/allproducts';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, clear } = useCart();

  const product = useMemo(() => {
    const all = [
      ...catalog.spices,
      ...catalog.powders,
      ...catalog.liquidEssentials,
    ];
    const productId = id;
    return all.find(p => p.id === productId);
  }, [id]);

  if (!product) {
    return (
      <section className="product-detail">
        <p>Product not found.</p>
        <button onClick={() => navigate('/')}>Back to products</button>
      </section>
    );
  }

  const [defaultSize, defaultPrice] = Object.entries(product.price)[0] ?? [];

  const handleAdd = () => addItem(product);

  const handleBuyNow = () => {
    clear();
    addItem(product);
    navigate('/cart');
  };

  return (
    <section className="product-detail">
      <button className="back-link" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="product-hero">
        <div className="image-wrap">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="info">
          <h1>{product.name}</h1>
          <p className="description">{product.description}</p>

          <div className="prices">
            {Object.entries(product.price).map(([size, price]) => (
              <div key={size} className="price-line">
                <span>{size}</span>
                <strong>₹{price.toFixed(2)}</strong>
              </div>
            ))}
          </div>

          {defaultPrice !== undefined && (
            <div className="highlight">Starting at ₹{defaultPrice.toFixed(2)} ({defaultSize})</div>
          )}

          <div className="actions">
            <button onClick={handleAdd}>Add to Cart</button>
            <button className="secondary" onClick={handleBuyNow}>Buy Now</button>
          </div>
        </div>
      </div>
    </section>
  );
}
