import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import type { CartAction, CartState, OreganoProduct } from '../types';
import { getCart, addToCart, tryGetIdToken } from '../services/authService';
import { Hub } from 'aws-amplify/utils';

const CartContext = createContext<{
  state: CartState;
  addItem: (product: OreganoProduct, quantity?: number) => void;
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
    case 'SET_STATE':
      return action.state;
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

  useEffect(() => {
    let cancelled = false;

    async function loadRemoteCart() {
      try {
        const token = await tryGetIdToken();
        if (!token) {
          return;
        }
        const remote = await getCart();
        if (!cancelled && Array.isArray(remote?.items) && remote.items.length > 0) {
          dispatch({ type: 'SET_STATE', state: remote });
        }
      } catch (err) {
        // If unauthenticated or fetch fails, stay on local cart
        console.warn('Remote cart fetch skipped', err);
      }
    }

    // Listen for auth events to refresh cart on sign-in
    const remove = Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signedIn' || payload.event === 'tokenRefresh') {
        loadRemoteCart();
      }
    });

    // Try once on mount (if already signed in)
    loadRemoteCart();

    return () => {
      cancelled = true;
      remove();
    };
  }, [dispatch]);

  const addItem = async (product: OreganoProduct, quantity = 1) => {
    // Add to local state immediately for optimistic UI
    dispatch({ type: 'ADD_ITEM', product, quantity });
    
    // If logged in, also sync to backend
    try {
      const token = await tryGetIdToken();
      if (token) {
        await addToCart(product.id, quantity);
      }
    } catch (err) {
      console.error('Failed to add item to backend cart', err);
      // Item is still in local cart, user can retry on next action
    }
  };
  const removeItem = (productId: string) => dispatch({ type: 'REMOVE_ITEM', productId });
  const updateQty = (productId: string, quantity: number) =>
    dispatch({ type: 'UPDATE_QTY', productId, quantity });
  const clear = () => dispatch({ type: 'CLEAR' });

  const { totalItems, subtotal } = useMemo(() => {
    const totalItems = state.items.reduce((acc, i) => acc + i.quantity, 0);
    const subtotal = state.items.reduce((acc, i) => {
      const [, price] = Object.entries(i.product.price)[0] ?? [];
      return acc + i.quantity * (price ?? 0);
    }, 0);
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
