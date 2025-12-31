import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LoginPageHandlerProps {
  onOpenLogin: () => void;
}

const LoginPageHandler: React.FC<LoginPageHandlerProps> = ({ onOpenLogin }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      onOpenLogin();
      navigate('/', { replace: true });
    } else {
      // Intelligent redirection based on role
      if (user?.role === 'scanner') {
        navigate('/scanner', { replace: true });
      } else if (user?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/profile', { replace: true });
      }
    }
  }, [isAuthenticated, user, onOpenLogin, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p className="text-lg text-gray-700">Redirigiendo para iniciar sesión...</p>
    </div>
  );
};

export default LoginPageHandler;
