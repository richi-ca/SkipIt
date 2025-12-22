import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import ScannerSidebar from '../components/ScannerSidebar';
import { useAuth } from '../context/AuthContext';

export default function ScannerLayout() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  if (!isAuthenticated || (user?.role !== 'scanner' && user?.role !== 'admin')) {
     return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ScannerSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-auto p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <Outlet />
            </div>
        </main>
      </div>
    </div>
  );
}
