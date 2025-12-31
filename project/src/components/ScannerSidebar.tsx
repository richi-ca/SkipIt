import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  QrCode, 
  History, 
  LogOut, 
  User
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoSkipIT from '../assets/images/Logo5.png';

export default function ScannerSidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/scanner', icon: QrCode, label: 'Escanear / Procesar', end: true },
    { to: '/scanner/history', icon: History, label: 'Historial Global' },
  ];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive 
        ? 'bg-white/10 text-white shadow-lg backdrop-blur-sm border border-white/10' 
        : 'text-purple-200 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <aside className="w-64 bg-gradient-to-b from-purple-900 via-purple-800 to-pink-700 text-white flex flex-col h-screen sticky top-0 shadow-2xl">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3 mb-4">
           <img src={logoSkipIT} alt="SkipIT Scanner" className="h-10 brightness-0 invert" />
           <span className="font-bold text-lg tracking-wide">STAFF</span>
        </div>
        <div className="flex items-center space-x-2 px-3 py-2 bg-black/20 rounded-lg border border-white/5">
            <User size={16} className="text-purple-300" />
            <span className="text-xs font-medium text-purple-100 truncate">{user?.name}</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink 
            key={item.to} 
            to={item.to} 
            end={item.end}
            className={navLinkClass}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 bg-black/10">
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 w-full text-red-300 hover:bg-red-500/20 hover:text-red-100 rounded-xl transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
}
