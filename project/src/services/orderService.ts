import { baseFetch } from './api';
import { Order } from '../data/mockData';

export interface CreateOrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  event_id: number;
  items: CreateOrderItem[];
  total: number;
  user_id: string;
}

export const orderService = {
  createOrder: async (request: CreateOrderRequest): Promise<Order> => {
    const data = await baseFetch<any>('/orders/', {
      method: 'POST',
      body: JSON.stringify(request),
    });

    // Map backend snake_case to frontend camelCase
    debugger;
    return {
      ...data,
      orderId: data.order_id,
      userId: data.user_id,
      isoDate: data.iso_date,
      purchaseTime: data.purchase_time,
    } as Order;
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
