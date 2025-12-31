import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { X, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { User } from '../data/mockData';
import { authService } from '../services/authService';
import logoSkipIT from '../assets/images/Logo1.png';
import { Link } from 'react-router-dom';

// Definimos el tipo para los datos del formulario
interface IFormInput {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onLoginSuccess: (user: User, token: string) => void;
}

export default function LoginModal({ isOpen, onClose, onSwitchToRegister, onLoginSuccess }: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IFormInput>({
    mode: 'onBlur', // Activa la validación cuando se pierde el foco
    defaultValues: {
      email: localStorage.getItem('rememberedEmail') || '',
      password: '',
      rememberMe: !!localStorage.getItem('rememberedEmail'),
    },
  });

  // Efecto para manejar el foco, cierre con Escape y limpiar el formulario
  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    } else {
      // Limpia el formulario al cerrar, respetando la lógica de "Recordarme"
      setTimeout(() => {
        const rememberedEmail = localStorage.getItem('rememberedEmail') || '';
        reset({
          email: rememberedEmail,
          password: '',
          rememberMe: !!rememberedEmail,
        });
        setServerError('');
        setShowPassword(false);
      }, 200);
    }
  }, [isOpen, onClose, reset]);

  if (!isOpen) return null;

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setServerError('');
    try {
      const response = await authService.login({
        email: data.email,
        password: data.password
      });

      if (data.rememberMe) {
        localStorage.setItem('rememberedEmail', data.email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      onLoginSuccess(response.user, response.token);
      onClose();
    } catch (error: any) {
      setServerError(error.message || 'Email o contraseña incorrectos. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]" role="dialog" aria-modal="true">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-6">
                <img src={logoSkipIT} alt="Logo SkipIT" className="h-12" />
              </Link>
              <p className="text-purple-100 text-sm pl-1">¡Sáltate la fila, y dedícate a disfrutar!</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors" aria-label="Cerrar modal">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[605px] overflow-y-auto custom-scrollbar">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">¡Bienvenido de vuelta!</h2>
          <p className="text-gray-600 text-center mb-6">Inicia sesión para continuar disfrutando</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
              <div id="server-error" role="alert" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">{serverError}</span>
              </div>
            )}

            <div>
              <label htmlFor="email-login" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email-login"
                  type="email"
                  autoComplete="email"
                  {...register('email', {
                    required: 'El email es obligatorio.',
                    pattern: { value: /\S+@\S+\.\S+/, message: 'El formato del email no es válido.' }
                  })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`}
                  placeholder="tu@email.com"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby="email-error"
                />
              </div>
              {errors.email && <p id="email-error" role="alert" className="text-sm text-red-600 mt-2">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password-login" className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password-login"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password', { required: 'La contraseña es obligatoria.' })}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'}`}
                  placeholder="Tu contraseña"
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby="password-error"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600" aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p id="password-error" role="alert" className="text-sm text-red-600 mt-2">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  id="remember-me-login"
                  type="checkbox"
                  {...register('rememberMe')}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="remember-me-login" className="text-sm text-gray-600">Recordarme</label>
              </div>
              <a href="/forgot-password" className="text-sm text-purple-600 hover:text-purple-700 font-medium">¿Olvidaste tu contraseña?</a>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿No tienes cuenta?{' '}
              <button onClick={onSwitchToRegister} className="text-purple-600 hover:text-purple-700 font-medium">Regístrate aquí</button>
            </p>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="bg-purple-50 rounded-xl p-4">
              <p className="text-sm text-purple-800 text-center">
                <strong>¡Beneficios de tener cuenta!</strong><br />
                Historial de pedidos, promociones exclusivas y acceso prioritario a eventos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}