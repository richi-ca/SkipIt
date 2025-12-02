import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Order, orders as mockOrders } from '../data/mockData';

interface OrderContextType {
  orders: Order[];
  activeQRs: { [orderId: string]: any[] };
  addOrder: (newOrder: Order) => void;
  claimItems: (orderId: string, itemsToClaim: { variationId: number; quantity: number }[]) => void;
  claimFullOrder: (orderId: string) => void;
  storeActiveQRs: (orderId: string, qrDataList: any[]) => void;
  markQrAsUsed: (qrId: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [activeQRs, setActiveQRs] = useState<{ [orderId: string]: any[] }>({});

  const addOrder = (newOrder: Order) => {
    setOrders(prevOrders => [...prevOrders, newOrder]);
  };

  const claimItems = (orderId: string, itemsToClaim: { variationId: number; quantity: number }[]) => {
    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.orderId === orderId) {
          const newItems = order.items.map(item => {
            const claim = itemsToClaim.find(c => c.variationId === item.variationId);
            if (claim) {
              return { ...item, claimed: (item.claimed || 0) + claim.quantity };
            }
            return item;
          });
          return { ...order, items: newItems };
        }
        return order;
      })
    );
  };

  const claimFullOrder = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order => {
        if (order.orderId === orderId) {
          return {
            ...order,
            status: 'FULLY_CLAIMED',
            items: order.items.map(item => ({ ...item, claimed: item.quantity }))
          };
        }
        return order;
      })
    );
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
    <OrderContext.Provider value={{ orders, activeQRs, addOrder, claimItems, claimFullOrder, storeActiveQRs, markQrAsUsed }}>
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
