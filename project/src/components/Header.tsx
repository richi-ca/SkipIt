import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, User as UserIcon, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ConfirmationModal from './ConfirmationModal';
import logoSkipIT from '../assets/images/Logo5.png';
import UserMenuDropdown from './UserMenuDropdown';
import MobileMenuButton from './MobileMenuButton';

interface HeaderProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenCart: () => void;
  isVisible: boolean;
}

export default function Header({ onOpenLogin, onOpenRegister, onOpenCart, isVisible }: HeaderProps) {
  const { getTotalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const cartItemCount = getTotalItems();
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setIsLogoutConfirmOpen(true);
  };

  const confirmLogout = () => {
    logout();
    setIsLogoutConfirmOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block text-gray-700 hover:text-purple-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-purple-50 ${
      isActive ? 'text-purple-600 bg-purple-100' : ''
    }`;

  return (
    <>
      <header 
        className={`bg-white shadow-lg sticky top-0 z-50 transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center space-x-6">
              <img src={logoSkipIT} alt="Logo SkipIT" className="h-12" />
            </Link>

            <nav className="hidden lg:flex items-center space-x-6">
              <NavLink to="/" className={navLinkClass}>Inicio</NavLink>
              <NavLink to="/events" className={navLinkClass}>Eventos</NavLink>
              <Link to="/" state={{ scrollTo: '#quienes-somos' }} className="text-gray-700 hover:text-purple-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-purple-50">Quiénes Somos</Link>
              <Link to="/" state={{ scrollTo: '#como-funciona' }} className="text-gray-700 hover:text-purple-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-purple-50">Cómo Funciona</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="hidden lg:flex items-center space-x-4">
                {isAuthenticated && user ? (
                  <UserMenuDropdown user={user} onLogout={handleLogout} onOpenLogin={onOpenLogin} onOpenRegister={onOpenRegister} />
                ) : (
                  <>
                    <button onClick={onOpenLogin} className="text-gray-700 hover:text-purple-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-purple-50">Inicia Sesión</button>
                    <button onClick={onOpenRegister} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105">Regístrate</button>
                  </>
                )}
                {isAuthenticated && (
                  <button onClick={onOpenCart} className="relative p-2 text-gray-700 hover:text-purple-600 transition-colors rounded-full hover:bg-purple-50">
                    <ShoppingCart className="w-6 h-6" />
                    {cartItemCount > 0 && (
                      <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-pink-600 text-white text-xs flex items-center justify-center">{cartItemCount}</span>
                    )}
                  </button>
                )}
              </div>
              <div className="lg:hidden flex items-center">
                {isAuthenticated && (
                  <button onClick={onOpenCart} className="relative p-2 text-gray-700 hover:text-purple-600 transition-colors rounded-full hover:bg-purple-50">
                    <ShoppingCart className="w-6 h-6" />
                    {cartItemCount > 0 && (
                      <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-pink-600 text-white text-xs flex items-center justify-center">{cartItemCount}</span>
                    )}
                  </button>
                )}
                <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-lg p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-8">
                    {isAuthenticated && user ? (
                        <div className="flex items-center space-x-2">
                            <UserIcon className="w-6 h-6 text-gray-600" />
                            <span className="text-xl font-bold text-purple-600">Hola, {user.name.split(' ')[0]}</span>
                        </div>
                    ) : (
                        <span className="text-xl font-bold text-purple-600">Menú</span>
                    )}
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
                        <X className="w-6 h-6 text-gray-700" />
                    </button>
                </div>

                <nav className="flex flex-col space-y-4">
                    <NavLink to="/" className={navLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Inicio</NavLink>
                    <NavLink to="/events" className={navLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Eventos</NavLink>
                    <Link to="/" state={{ scrollTo: '#quienes-somos' }} className="block text-gray-700 hover:text-purple-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-purple-50" onClick={() => setIsMobileMenuOpen(false)}>Quiénes Somos</Link>
                    <Link to="/" state={{ scrollTo: '#como-funciona' }} className="block text-gray-700 hover:text-purple-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-purple-50" onClick={() => setIsMobileMenuOpen(false)}>Cómo Funciona</Link>
                </nav>

                <div className="border-t border-gray-200 mt-8 pt-6">
                    {isAuthenticated && user ? (
                        <div className="flex flex-col space-y-3">
                            <NavLink to="/profile" className={navLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Mis Datos</NavLink>
                            <NavLink to="/history" className={navLinkClass} onClick={() => setIsMobileMenuOpen(false)}>Mis Pedidos</NavLink>
                            <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className={`${navLinkClass} w-full text-left`}>Salir</button>
                        </div>
                    ) : (
                        <div className="flex flex-col space-y-3">
                            <button onClick={() => { onOpenLogin(); setIsMobileMenuOpen(false); }} className="w-full text-center text-gray-700 hover:text-purple-600 font-medium transition-colors px-3 py-3 rounded-lg hover:bg-purple-50">Inicia Sesión</button>
                            <button onClick={() => { onOpenRegister(); setIsMobileMenuOpen(false); }} className="w-full text-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-4 py-3 rounded-full transition-all">Regístrate</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={confirmLogout}
        title="Confirmar Cierre de Sesión"
        message="¿Estás seguro de que quieres cerrar sesión?"
        confirmText="Cerrar Sesión"
      />
    </>
  );
}