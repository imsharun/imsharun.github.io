
export type CartItem = {
  product: OreganoProduct;
  quantity: number;
};

export type CartState = {
  items: CartItem[];
};

export type CartAction =
  | { type: 'ADD_ITEM'; product: OreganoProduct; quantity?: number }
  | { type: 'REMOVE_ITEM'; productId: number }
  | { type: 'UPDATE_QTY'; productId: number; quantity: number }
  | { type: 'CLEAR' };


  // Define individual price mapping type
type Price = {
  [key: string]: number; // e.g., "250g", "500g", "250ml"
};

// Define types for each category item
export interface OreganoProduct {
  id: number;
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
