
export type CartItem = {
  product: OreganoProduct;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
};

export type CartAction =
  | { type: 'ADD_ITEM'; product: OreganoProduct; quantity?: number }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QTY'; productId: string; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'SET_STATE'; state: CartState };


  // Define individual price mapping type
type Price = {
  [key: string]: number; // e.g., "250g", "500g", "250ml"
};

// Define types for each category item
export interface OreganoProduct {
  id: string;
  name: string;
  price: Price;
  image: string;
  description: string;
}


// Define the overall structure
export interface ProductCatalog {
  spices: OreganoProduct[];
  powders: OreganoProduct[];
  liquidEssentials: OreganoProduct [];
}
