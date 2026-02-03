import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { User as UserIcon, LogOut, ShoppingBag, Settings, LayoutDashboard } from 'lucide-react';

interface UserMenuDropdownProps {
  user: { name: string; email: string; role?: string }; // Updated to include role
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onLogout: () => void; // New prop for logout handler
}

export default function UserMenuDropdown({
  user,
  onOpenLogin,
  onOpenRegister,
  onLogout,
}: UserMenuDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    onLogout(); // Call the prop function
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navLinkClass = "block px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 hover:text-purple-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
      >
        <UserIcon className="w-5 h-5" />
        {user && (
          <span className="hidden md:inline ml-2 text-sm font-medium">
            {user.name.split(' ')[0]}
          </span>
        )}
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
          <Link to="/profile" className={navLinkClass} onClick={() => setIsDropdownOpen(false)}>
            <Settings className="inline-block w-4 h-4 mr-2" />
            Mis Datos
          </Link>
          <NavLink to="/history" className={navLinkClass} onClick={() => setIsDropdownOpen(false)}>
            <ShoppingBag className="inline-block w-4 h-4 mr-2" />
            Mis Pedidos
          </NavLink>

          {user.role === 'admin' && (
            <Link to="/admin" className={`${navLinkClass} text-purple-700 font-semibold bg-purple-50`} onClick={() => setIsDropdownOpen(false)}>
              <LayoutDashboard className="inline-block w-4 h-4 mr-2" />
              Panel Admin
            </Link>
          )}

          <div className="border-t border-gray-100 my-1"></div>

          <button onClick={handleLogout} className={`${navLinkClass} w-full text-left text-red-600 hover:bg-red-50 hover:text-red-700`}>
            <LogOut className="inline-block w-4 h-4 mr-2" />
            Salir
          </button>
        </div>
      )}
    </div>
  );
}
