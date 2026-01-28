import { baseFetch } from './api';
import { User } from '../data/mockData';

export interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  login: async (credentials: any): Promise<LoginResponse> => {
    // NOTA: El login real requeriría un endpoint /auth/login que valide contraseña y devuelva token.
    // Como estamos usando un backend simplificado que solo tiene CRUD de usuarios,
    // simularemos el login buscando si el usuario existe por ID (email como ID o similar).

    // OPCIÓN TEMPORAL: Usamos GET /users/<id> asumiendo que el ID es el username o algo conocido,
    // o filtramos (pero GET /users no filtra por email/pass en este backend simple).

    // Para que funcione con los botones de Login Rápido (que envían email/pass de usuarios ya creados como 'cliente1', 'admin1'),
    // necesitamos que el backend valide. PERO el backend actual solo tiene CRUD básico.

    // Voy a asumir que debemos implementar un login real o simularlo aquí.
    // Para simplificar y dado que el usuario pidió "corregir el acceso",
    // voy a intentar hacer un POST a un endpoint '/login' que crearé en el backend,
    // o modificaré este servicio para que haga un "fake login" contra GET /users.

    // Mejor estrategia: Crear endpoint /login en el backend.
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
