import React, { createContext, useState, useContext, ReactNode } from 'react';
// import { Order } from '../data/mockData'; // Deshabilitado temporalmente hasta resolver lógica de re-order

// Define the shape of the context
// Define the shape of the cart item
export interface CartItemDetails {
  id: number; // MenuProduct ID
  name: string; // Product Name
  variationName: string; // Variation Name or just product name
  price: number;
  image: string;
  quantity: number;
}

// Define the shape of the context
interface CartContextType {
  cartItems: { [key: number]: CartItemDetails }; // key: MenuProduct ID
  addToCart: (item: Omit<CartItemDetails, 'quantity'>) => void;
  removeFromCart: (variationId: number) => void;
  deleteProductFromCart: (variationId: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create the provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<{ [key: number]: CartItemDetails }>({});

  const addToCart = (item: Omit<CartItemDetails, 'quantity'>) => {
    setCartItems(prev => {
      const existing = prev[item.id];
      if (existing) {
        return { ...prev, [item.id]: { ...existing, quantity: existing.quantity + 1 } };
      }
      return { ...prev, [item.id]: { ...item, quantity: 1 } };
    });
  };

  const removeFromCart = (variationId: number) => {
    setCartItems(prev => {
      const existing = prev[variationId];
      if (!existing) return prev;

      const newItems = { ...prev };
      if (existing.quantity > 1) {
        newItems[variationId] = { ...existing, quantity: existing.quantity - 1 };
      } else {
        delete newItems[variationId];
      }
      return newItems;
    });
  };

  const deleteProductFromCart = (variationId: number) => {
    setCartItems(prev => {
      const newItems = { ...prev };
      delete newItems[variationId];
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems({});
  }

  const getTotalItems = () => {
    return Object.values(cartItems).reduce((sum, item) => sum + item.quantity, 0);
  };

  /* 
  // TODO: Implementar lógica de repetir orden conectada al Backend.
  // Requiere validar que las variaciones (IDs) aún existan y tengan stock.
  const repeatOrder = (orderItems: Order['items']) => {
    // Lógica pendiente
  }; 
  */

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, deleteProductFromCart, clearCart, getTotalItems }}>
      {children}
    </CartContext.Provider>
  );
};

// Create a custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
