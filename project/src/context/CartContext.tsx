import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Order } from '../data/mockData';

// Define the shape of the context
interface CartContextType {
  cartItems: { [key: number]: number };
  addToCart: (drinkId: number) => void;
  removeFromCart: (drinkId: number) => void;
  deleteProductFromCart: (drinkId: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  repeatOrder: (orderItems: Order['items']) => void; // Nueva función
}

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Create the provider component
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<{ [key: number]: number }>({});

  const addToCart = (drinkId: number) => {
    setCartItems(prev => ({ ...prev, [drinkId]: (prev[drinkId] || 0) + 1 }));
  };

  const removeFromCart = (drinkId: number) => {
    setCartItems(prev => {
      const newItems = { ...prev };
      // Stop decrementing if the quantity is 1
      if (newItems[drinkId] > 1) {
        newItems[drinkId]--;
      } 
      return newItems;
    });
  };

  const deleteProductFromCart = (drinkId: number) => {
    setCartItems(prev => {
      const newItems = { ...prev };
      delete newItems[drinkId];
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems({});
  }

  const getTotalItems = () => {
    return Object.values(cartItems).reduce((sum, count) => sum + count, 0);
  };

  // Nueva función para repetir un pedido
  const repeatOrder = (orderItems: Order['items']) => {
    setCartItems(prev => {
      const newItems = { ...prev };
      orderItems.forEach(item => {
        const drinkId = item.drink.id;
        const quantity = item.quantity;
        newItems[drinkId] = (newItems[drinkId] || 0) + quantity;
      });
      return newItems;
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, deleteProductFromCart, clearCart, getTotalItems, repeatOrder }}>
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
