import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';
import Cart from '../components/Cart';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { User } from '../data/mockData';

// Este componente actúa como "wrapper" para todas las páginas públicas.
// Mantiene el estado de los modales globales que se activan desde el Header.

interface PublicLayoutProps {
  isCartOpen: boolean;
  onOpenCart: () => void;
  onCloseCart: () => void;
  onCheckout: () => void;
  isLoginOpen: boolean;
  setIsLoginOpen: (isOpen: boolean) => void;
  isRegisterOpen: boolean;
  setIsRegisterOpen: (isOpen: boolean) => void;
}

export default function PublicLayout({
  isCartOpen, onOpenCart, onCloseCart, onCheckout,
  isLoginOpen, setIsLoginOpen, isRegisterOpen, setIsRegisterOpen
}: PublicLayoutProps) {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  
  // Estado para la visibilidad del Header en scroll
  const [isHeaderVisible, setIsHeaderVisible] = React.useState(true);
  const lastScrollY = React.useRef(0);

  // Security: Block 'scanner' role from accessing Public Layout (Home, Events, etc.)
  React.useEffect(() => {
    if (user?.role === 'scanner') {
      navigate('/scanner', { replace: true });
    }
  }, [user, navigate]);

  React.useEffect(() => {
    const controlHeader = () => {
      if (window.scrollY > lastScrollY.current && window.scrollY > 100) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
      lastScrollY.current = window.scrollY;
    };

    window.addEventListener('scroll', controlHeader);
    return () => {
      window.removeEventListener('scroll', controlHeader);
    };
  }, []);

  const handleLoginSuccess = (user: User, token: string) => {
    login(user, token);
    setIsLoginOpen(false);
    
    // Redirect based on role
    if (user.role === 'scanner') {
      navigate('/scanner');
    } else if (user.role === 'admin') {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header
        isVisible={isHeaderVisible}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenCart={onOpenCart}
      />
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
            setIsLoginOpen(false);
            setIsRegisterOpen(true);
        }}
        onLoginSuccess={handleLoginSuccess}
      />
      
      <RegisterModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
        onSwitchToLogin={() => {
            setIsRegisterOpen(false);
            setIsLoginOpen(true);
        }} 
      />

      <Cart
        isOpen={isCartOpen}
        onClose={onCloseCart}
        onGenerateQR={onCheckout}
      />
    </div>
  );
}
