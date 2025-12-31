import { baseFetch } from './api';
import { Order } from '../data/mockData';

export interface CreateOrderItem {
  variationId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  eventId: number;
  items: CreateOrderItem[];
}

export const orderService = {
  createOrder: async (request: CreateOrderRequest): Promise<Order> => {
    return baseFetch<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },

  getMyOrders: async (): Promise<Order[]> => {
    return baseFetch<Order[]>('/orders/my-history', {
      method: 'GET',
    });
  },

  getOrderById: async (orderId: string): Promise<Order> => {
    return baseFetch<Order>(`/orders/${orderId}`, {
      method: 'GET',
    });
  },

  claimOrder: async (orderId: string, itemsToClaim: { variationId: number; quantity: number }[]): Promise<Order> => {
    return baseFetch<Order>(`/orders/${orderId}/claim`, {
      method: 'POST',
      body: JSON.stringify({ items: itemsToClaim }),
    });
  }
};
