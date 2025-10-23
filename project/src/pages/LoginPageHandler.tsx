import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LoginPageHandlerProps {
  onOpenLogin: () => void;
}

const LoginPageHandler: React.FC<LoginPageHandlerProps> = ({ onOpenLogin }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      onOpenLogin();
    } else {
      // If already authenticated, redirect to profile or home
      navigate('/profile', { replace: true });
    }
  }, [isAuthenticated, onOpenLogin, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg text-gray-700">Redirigiendo para iniciar sesión...</p>
    </div>
  );
};

export default LoginPageHandler;
