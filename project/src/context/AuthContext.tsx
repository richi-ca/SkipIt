
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../data/mockData';
import { authService } from '../services/authService';

// Define the shape of the context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User, token?: string) => void;
  logout: () => void;
  actionAfterLogin: (() => void) | null;
  setActionAfterLogin: (action: (() => void) | null) => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionAfterLogin, setActionAfterLogin] = useState<(() => void) | null>(null);

  // Check for existing token and load user on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await authService.getMe();
          setUser(userData);
        } catch (error) {
          console.error('Failed to restore session:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (userData: User, token?: string) => {
    setUser(userData);
    if (token) {
      localStorage.setItem('token', token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const isAuthenticated = !!user;

  // Effect to run action after login
  useEffect(() => {
    if (isAuthenticated && actionAfterLogin) {
      actionAfterLogin();
      setActionAfterLogin(null); // Reset after execution
    }
  }, [isAuthenticated, actionAfterLogin]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoading,
      login, 
      logout, 
      actionAfterLogin, 
      setActionAfterLogin 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook for easy access to the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
