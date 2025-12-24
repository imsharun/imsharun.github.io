import { useCart } from '../context/CartContext';

export default function Cart() {
  const { state, updateQty, removeItem, clear, subtotal } = useCart();
  const hasItems = state.items.length > 0;

  return (
    <section>
      <h2>Your Cart</h2>
      {!hasItems && <p>Your cart is empty.</p>}
      {hasItems && (
        <div className="cart-list">
          {state.items.map(({ product, quantity }) => (
            <div key={product.id} className="cart-item">
              <img src={product.image} alt={product.name} />
              <div className="cart-info">
                <h3>{product.name}</h3>
                <p>${product.price.toFixed(2)}</p>
                <div className="qty">
                  <label>
                    Qty:
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => updateQty(product.id, Number(e.target.value))}
                    />
                  </label>
                  <button onClick={() => removeItem(product.id)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
          <div className="cart-summary">
            <div className="row">
              <span>Subtotal</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>
            <div className="actions">
              <button onClick={clear} style={{ marginRight: '0.5rem' }}>Clear Cart</button>
              <button>Checkout</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
