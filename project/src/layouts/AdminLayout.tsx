import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { useAuth } from '../context/AuthContext';

// Este layout define la estructura visual del Panel de Administración.
// Incluye el Sidebar fijo y el área de contenido variable.

export default function AdminLayout() {
  const { user } = useAuth();

  // Doble verificación de seguridad (aunque AdminRoute ya lo hace)
  if (user?.role !== 'admin') {
     return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Fijo */}
      <AdminSidebar />

      {/* Área de Contenido Principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Opcional: Topbar minimalista para breadcrumbs o perfil rápido */}
        {/* <header className="bg-white shadow-sm h-16 flex items-center px-8">...</header> */}

        <main className="flex-1 overflow-auto p-8">
            <div className="max-w-7xl mx-auto">
                <Outlet />
            </div>
        </main>
      </div>
    </div>
  );
}
