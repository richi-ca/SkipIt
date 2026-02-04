import React from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  ShoppingBag,
  Tags,
  FileText,
  LogOut,
  ExternalLink,
  Store,
  Layers,
  Database,
  AlertTriangle,
  BookOpen,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoSkipIT from '../assets/images/Logo5.png'; // Ajustar ruta si es necesario

export default function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    navigate('/login');
  };

  const handleResetDB = async () => {
    if (confirm('ADVERTENCIA: ¿Estás seguro de que quieres restablecer la base de datos?\n\nEsta acción eliminará TODOS los datos actuales y cargará datos de prueba.\n\nEsta acción NO se puede deshacer.')) {
      try {
        // Import baseFetch logic locally or assume it's available? 
        // Better to use fetch directly or the hook if available, but here we can import baseFetch if this file was in a context that allows it.
        // AdminSidebar is a component. Let's assume we can fetch.
        const token = localStorage.getItem('token');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/reset-db`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          }
        });
        if (res.ok) {
          alert('Base de datos restablecida con éxito.');
          window.location.reload();
        } else {
          const data = await res.json();
          alert('Error: ' + (data.message || 'Error desconocido'));
        }
      } catch (e) {
        console.error(e);
        alert('Error de conexión');
      }
    }
  };

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/events', icon: Calendar, label: 'Eventos' },
    { to: '/admin/categories', icon: Layers, label: 'Categorías' },
    { to: '/admin/products', icon: Store, label: 'Productos' },
    { to: '/admin/menus', icon: BookOpen, label: 'Carta' },
    { to: '/admin/users', icon: Users, label: 'Usuarios' },
    { to: '/admin/sales', icon: ShoppingBag, label: 'Ventas & Scanner' },
    { to: '/admin/marketing', icon: Tags, label: 'Marketing' },
    { to: '/admin/cms', icon: FileText, label: 'Contenidos (CMS)' },
  ];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
      ? 'bg-white/10 text-white shadow-lg backdrop-blur-sm border border-white/10'
      : 'text-purple-200 hover:bg-white/5 hover:text-white'
    }`;

  return (
    <aside className="w-64 bg-gradient-to-b from-purple-900 via-purple-800 to-pink-700 text-white flex flex-col h-screen sticky top-0 shadow-2xl">
      {/* Header del Sidebar */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3 mb-6">
          <img src={logoSkipIT} alt="SkipIT Admin" className="h-10 brightness-0 invert" /> {/* Logo blanco */}
          <span className="font-bold text-lg tracking-wide">ADMIN</span>
        </div>

        <Link
          to="/"
          className="flex items-center justify-center space-x-2 w-full bg-white/10 hover:bg-white/20 text-sm font-medium py-2 rounded-lg transition-colors border border-white/10"
        >
          <ExternalLink size={16} />
          <span>Ver Sitio Web</span>
        </Link>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
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

      {/* Database Reset Action */}
      <div className="px-4 pb-2">
        <button
          onClick={handleResetDB}
          className="flex items-center space-x-3 px-4 py-3 w-full text-orange-300 hover:bg-orange-500/20 hover:text-orange-100 rounded-xl transition-colors border border-orange-500/30"
        >
          <Database size={20} />
          <span className="font-medium">Reset DB</span>
        </button>
      </div>

      {/* Footer del Sidebar */}
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
