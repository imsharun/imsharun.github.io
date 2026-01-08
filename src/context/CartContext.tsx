import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import type { CartAction, CartState, OreganoProduct } from '../types';
import { getCart, addToCart, tryGetIdToken } from '../services/authService';
import { Hub } from 'aws-amplify/utils';
import { catalog } from '../data/allproducts';

const CartContext = createContext<{
  state: CartState;
  addItem: (product: OreganoProduct, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, quantity: number) => void;
  clear: () => void;
  totalItems: number;
  subtotal: number;
  loading: boolean;
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadRemoteCart() {
      setLoading(true);
      try {
        const token = await tryGetIdToken();
        if (!token) {
          setLoading(false);
          return;
        }
        const remote = await getCart();
        if (!cancelled && Array.isArray(remote)) {
          // Map backend cart items to CartState shape
          const allProducts = [
            ...catalog.spices,
            ...catalog.powders,
            ...catalog.liquidEssentials,
          ];
          const items = remote.map((item: any) => {
            const product = allProducts.find(p => p.id === item.productId);
            if (!product) return null;
            return { product, quantity: item.quantity };
          }).filter(Boolean);
          dispatch({ type: 'SET_STATE', state: { items } });
        }
      } catch (err) {
        console.warn('Remote cart fetch skipped', err);
      } finally {
        setLoading(false);
      }
    }

    // Listen for auth events to refresh cart on sign-in only
    const remove = Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signedIn') {
        loadRemoteCart();
      }
    });

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
    () => ({ state, addItem, removeItem, updateQty, clear, totalItems, subtotal, loading }),
    [state, totalItems, subtotal, loading],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
