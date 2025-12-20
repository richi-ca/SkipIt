import { baseFetch } from './api';
import { User } from '../data/mockData';

export interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  login: async (credentials: any): Promise<LoginResponse> => {
    return baseFetch<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData: any): Promise<LoginResponse> => {
    return baseFetch<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getMe: async (): Promise<User> => {
    return baseFetch<User>('/users/me', {
      method: 'GET',
    });
  },

  updateProfile: async (userData: Partial<User>): Promise<User> => {
    return baseFetch<User>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }
};
