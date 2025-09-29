import React from 'react';
import { X, LogIn } from 'lucide-react';

interface LoginPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LoginPrompt({ isOpen, onClose, onConfirm }: LoginPromptProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-purple-200 to-pink-200 mb-4">
            <LogIn className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Inicia Sesión para Continuar</h3>
          <p className="text-gray-600 mb-6">
            Para poder guardar y validar tu compra, necesitas tener una cuenta.
          </p>
          <div className="space-y-3">
            <button
              onClick={onConfirm}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <LogIn className="w-5 h-5" />
              <span>Iniciar Sesión</span>
            </button>
            <button
              onClick={onClose}
              className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-100 font-bold py-3 px-6 rounded-full transition-all duration-300"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.3s forwards cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      `}</style>
    </div>
  );
}
