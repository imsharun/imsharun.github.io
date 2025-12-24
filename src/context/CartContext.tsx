import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import type { CartAction, CartState, Product } from '../types';

const CartContext = createContext<{
  state: CartState;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, quantity: number) => void;
  clear: () => void;
  totalItems: number;
  subtotal: number;
} | null>(null);

const initialState: CartState = { items: [] };

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const qty = action.quantity ?? 1;
      const existing = state.items.find(i => i.product.id === action.product.id);
      if (existing) {
        return {
          items: state.items.map(i =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + qty }
              : i,
          ),
        };
      }
      return { items: [...state.items, { product: action.product, quantity: qty }] };
    }
    case 'REMOVE_ITEM': {
      return { items: state.items.filter(i => i.product.id !== action.productId) };
    }
    case 'UPDATE_QTY': {
      const q = Math.max(1, action.quantity);
      return {
        items: state.items.map(i =>
          i.product.id === action.productId ? { ...i, quantity: q } : i,
        ),
      };
    }
    case 'CLEAR':
      return initialState;
    default:
      return state;
  }
}

function usePersistedCart() {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try {
      const raw = localStorage.getItem('cart:v1');
      return raw ? (JSON.parse(raw) as CartState) : init;
    } catch {
      return init;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cart:v1', JSON.stringify(state));
    } catch {
      // ignore persistence errors
    }
  }, [state]);

  return [state, dispatch] as const;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = usePersistedCart();

  const addItem = (product: Product, quantity = 1) =>
    dispatch({ type: 'ADD_ITEM', product, quantity });
  const removeItem = (productId: string) => dispatch({ type: 'REMOVE_ITEM', productId });
  const updateQty = (productId: string, quantity: number) =>
    dispatch({ type: 'UPDATE_QTY', productId, quantity });
  const clear = () => dispatch({ type: 'CLEAR' });

  const { totalItems, subtotal } = useMemo(() => {
    const totalItems = state.items.reduce((acc, i) => acc + i.quantity, 0);
    const subtotal = state.items.reduce((acc, i) => acc + i.quantity * i.product.price, 0);
    return { totalItems, subtotal };
  }, [state.items]);

  const value = useMemo(
    () => ({ state, addItem, removeItem, updateQty, clear, totalItems, subtotal }),
    [state, totalItems, subtotal],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
