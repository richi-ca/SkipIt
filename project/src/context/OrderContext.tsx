import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Order } from '../data/mockData';
import { orderService, CreateOrderRequest } from '../services/orderService';
import { useAuth } from './AuthContext';

interface OrderContextType {
  orders: Order[];
  activeQRs: { [orderId: string]: any[] };
  isLoading: boolean;
  error: string | null;
  createOrder: (eventId: number, items: { variationId: number; quantity: number }[]) => Promise<Order>;
  claimItems: (orderId: string, itemsToClaim: { variationId: number; quantity: number }[]) => Promise<void>;
  claimFullOrder: (orderId: string) => Promise<void>;
  refreshOrders: () => Promise<void>;
  storeActiveQRs: (orderId: string, qrDataList: any[]) => void;
  markQrAsUsed: (qrId: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeQRs, setActiveQRs] = useState<{ [orderId: string]: any[] }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshOrders = useCallback(async () => {
    if (!isAuthenticated) {
      setOrders([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await orderService.getMyOrders();
      setOrders(data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("No se pudo cargar el historial de pedidos.");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Load orders when user authenticates
  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const createOrder = async (eventId: number, items: { variationId: number; quantity: number }[]): Promise<Order> => {
    setIsLoading(true);
    setError(null);
    try {
      const request: CreateOrderRequest = {
        eventId,
        items
      };
      const newOrder = await orderService.createOrder(request);
      setOrders(prev => [newOrder, ...prev]); // Add to top of list
      return newOrder;
    } catch (err: any) {
      console.error("Failed to create order:", err);
      setError(err.message || "Error al procesar el pedido.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const claimItems = async (orderId: string, itemsToClaim: { variationId: number; quantity: number }[]) => {
    try {
      // Call backend
      const updatedOrder = await orderService.claimOrder(orderId, itemsToClaim);
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.orderId === orderId ? updatedOrder : order
        )
      );
    } catch (err: any) {
      console.error("Failed to claim items:", err);
      throw err;
    }
  };

  const claimFullOrder = async (orderId: string) => {
    const order = orders.find(o => o.orderId === orderId);
    if (!order) return;

    const itemsToClaim = order.items.map(item => ({
      variationId: item.variationId,
      quantity: item.quantity
    }));

    await claimItems(orderId, itemsToClaim);
  };

  const storeActiveQRs = (orderId: string, qrDataList: any[]) => {
    setActiveQRs(prev => ({
      ...prev,
      [orderId]: [...(prev[orderId] || []), ...qrDataList]
    }));
  };

  const markQrAsUsed = (qrId: string) => {
    const orderId = qrId.split('-')[0];
    if (!activeQRs[orderId]) return;

    setActiveQRs(prev => ({
        ...prev,
        [orderId]: prev[orderId].filter(qr => qr.orderNumber !== qrId)
    }));
  };

  return (
    <OrderContext.Provider value={{ 
      orders, 
      activeQRs, 
      isLoading, 
      error, 
      createOrder, 
      claimItems, 
      claimFullOrder,
      refreshOrders,
      storeActiveQRs, 
      markQrAsUsed 
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
