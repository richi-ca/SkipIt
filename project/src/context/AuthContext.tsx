
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../data/mockData'; // Import the unified User type

// Define the shape of the context
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  actionAfterLogin: (() => void) | null;
  setActionAfterLogin: (action: (() => void) | null) => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [actionAfterLogin, setActionAfterLogin] = useState<(() => void) | null>(null);

  const login = (userData: User) => {
    setUser(userData);
    // In a real app, you'd also store the token or session info
  };

  const logout = () => {
    setUser(null);
    // In a real app, you'd also clear the token or session info
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
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, actionAfterLogin, setActionAfterLogin }}>
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
