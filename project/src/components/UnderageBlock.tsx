import React from 'react';
import { ShieldX, ArrowLeft } from 'lucide-react';

interface UnderageBlockProps {
  isOpen: boolean;
  onGoBack: () => void;
}

export default function UnderageBlock({ isOpen, onGoBack }: UnderageBlockProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-red-600 p-6 text-white text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldX className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Acceso Restringido</h2>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <p className="text-gray-700 mb-6 leading-relaxed">
            Lo sentimos, debes ser mayor de 18 años para acceder a este sitio web.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-800">
              Si tienes 18 años o más y llegaste aquí por error, puedes volver atrás y confirmar tu edad.
            </p>
          </div>

          <button
            onClick={onGoBack}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>

          <p className="text-xs text-gray-500 mt-4">
            Gracias por tu comprensión.
          </p>
        </div>
      </div>
    </div>
  );
}