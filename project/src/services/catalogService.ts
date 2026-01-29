import { baseFetch } from './api';
import { Event, Menu } from '../data/mockData';

export const catalogService = {
  getEvents: async (): Promise<Event[]> => {
    const data = await baseFetch<any[]>('/catalog/events/');
    return data.map(mapEventFromApi);
  },

  getFeaturedEvents: async (): Promise<Event[]> => {
    const data = await baseFetch<any[]>('/catalog/events/featured');
    return data.map(mapEventFromApi);
  },

  getEventDetails: async (eventId: number): Promise<Event> => {
    return baseFetch<Event>(`/catalog/events/${eventId}`);
  },

  getMenuByEventId: async (eventId: number): Promise<Menu> => {
    return baseFetch<Menu>(`/catalog/events/${eventId}/menu`);
  },

  getMenuById: async (menuId: number): Promise<Menu> => {
    return baseFetch<Menu>(`/catalog/menus/${menuId}`);
  }
};

const MEDIA_BASE_URL = `${import.meta.env.VITE_MEDIA_URL}/`;

const mapEventFromApi = (e: any): Event => {
  let imageUrl = e.image_url;
  if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
    imageUrl = `${MEDIA_BASE_URL}events/${imageUrl}`;
  }

  return {
    id: e.id,
    name: e.name,
    overlayTitle: e.overlay_title,
    isoDate: e.iso_date,
    startTime: e.start_time,
    endTime: e.end_time,
    location: e.location,
    image: imageUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    // price removed
    rating: e.rating,
    type: e.type,
    isFeatured: e.is_featured,
    carouselOrder: e.carousel_order,
    menuId: e.menu_id
  };
};
