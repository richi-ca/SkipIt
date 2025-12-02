import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Si no está logueado, redirigir al login (o home)
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    // Si está logueado pero no es admin, redirigir al home
    return <Navigate to="/" replace />;
  }

  // Si es admin, renderizar el contenido (AdminLayout -> Outlet)
  return <Outlet />;
}
