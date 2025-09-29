import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Instagram, ShoppingCart, User as UserIcon, LogOut } from 'lucide-react';
import { User } from '../data/mockData';

interface HeaderProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenCart: () => void;
  cartItemCount: number;
  isVisible: boolean;
  currentUser: User | null;
  onLogout: () => void;
}

export default function Header({ onOpenLogin, onOpenRegister, onOpenCart, cartItemCount, isVisible, currentUser, onLogout }: HeaderProps) {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-gray-700 hover:text-purple-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-purple-50 ${
      isActive ? 'text-purple-600 bg-purple-100' : ''
    }`;

  return (
    <header 
      className={`bg-white shadow-lg sticky top-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              S
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              SkipIT
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <NavLink to="/" className={navLinkClass}>
              Inicio
            </NavLink>
            <NavLink to="/events" className={navLinkClass}>
              Eventos
            </NavLink>
            <Link to="/" state={{ scrollTo: '#quienes-somos' }} className="text-gray-700 hover:text-purple-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-purple-50">
              Quiénes Somos
            </Link>
            <Link to="/" state={{ scrollTo: '#como-funciona' }} className="text-gray-700 hover:text-purple-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-purple-50">
              Cómo Funciona
            </Link>
            <a 
              href="https://instagram.com/skipit" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-pink-600 transition-colors p-2 rounded-lg hover:bg-pink-50"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-4">
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <UserIcon className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-700">Hola, {currentUser.name.split(' ')[0]}</span>
                  </div>
                  <button onClick={onLogout} className="text-gray-700 hover:text-purple-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-purple-50 flex items-center space-x-2">
                    <LogOut className="w-5 h-5" />
                    <span>Salir</span>
                  </button>
                </div>
              ) : (
                <>
                  <button onClick={onOpenLogin} className="text-gray-700 hover:text-purple-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-purple-50">
                    Inicia Sesión
                  </button>
                  <button onClick={onOpenRegister} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-105">
                    Regístrate
                  </button>
                </>
              )}
              <button onClick={onOpenCart} className="relative p-2 text-gray-700 hover:text-purple-600 transition-colors rounded-full hover:bg-purple-50">
                <ShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-pink-600 text-white text-xs flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>
            <div className="lg:hidden">
              <button className="p-2 text-gray-700 hover:text-purple-600 transition-colors">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}