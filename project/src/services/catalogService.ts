import { baseFetch } from './api';
import { Event, Menu } from '../data/mockData';

export const catalogService = {
  getEvents: async (): Promise<Event[]> => {
    return baseFetch<Event[]>('/catalog/events');
  },

  getFeaturedEvents: async (): Promise<Event[]> => {
    return baseFetch<Event[]>('/catalog/events/featured');
  },

  getEventById: async (id: number): Promise<Event> => {
    return baseFetch<Event>(`/catalog/events/${id}`);
  },

  getMenuByEventId: async (eventId: number): Promise<Menu> => {
    return baseFetch<Menu>(`/catalog/events/${eventId}/menu`);
  },

  getMenuById: async (menuId: number): Promise<Menu> => {
    return baseFetch<Menu>(`/catalog/menus/${menuId}`);
  }
};
