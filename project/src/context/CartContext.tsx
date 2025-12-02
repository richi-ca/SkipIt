import React, { createContext, useState, useContext, ReactNode } from 'react';
// import { Order } from '../data/mockData'; // Deshabilitado temporalmente hasta resolver lógica de re-order

// Define the shape of the context
interface CartContextType {
  cartItems: { [key: number]: number }; // key: variationId, value: quantity
  addToCart: (variationId: number) => void;
  removeFromCart: (variationId: number) => void;
  deleteProductFromCart: (variationId: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  // repeatOrder: (orderItems: Order['items']) => void; // Deshabilitado temporalmente
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create the provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<{ [key: number]: number }>({});

  const addToCart = (variationId: number) => {
    setCartItems(prev => ({ ...prev, [variationId]: (prev[variationId] || 0) + 1 }));
  };

  const removeFromCart = (variationId: number) => {
    setCartItems(prev => {
      const newItems = { ...prev };
      if (newItems[variationId] > 1) {
        newItems[variationId]--;
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
    return Object.values(cartItems).reduce((sum, count) => sum + count, 0);
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
