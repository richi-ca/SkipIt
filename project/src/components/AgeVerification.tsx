import React from 'react';
import { Calendar, AlertTriangle } from 'lucide-react';
import logoSkipIT from '../assets/images/Logo1.png'; // Import the standard logo

interface AgeVerificationProps {
  isOpen: boolean;
  onConfirm: () => void;
  onDeny: () => void;
}

export default function AgeVerification({ isOpen, onConfirm, onDeny }: AgeVerificationProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8" />
          </div>
          {/* Replaced Logo */}
          <div className="flex items-center justify-center mb-2">
            <img src={logoSkipIT} alt="Logo SkipIT" className="h-12" />
          </div>
          <p className="text-purple-100 text-sm">SÁLTATE LA FILA, DISFRUTA MÁS</p>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ¿Eres mayor de edad?
          </h2>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            Debes tener al menos 18 años de edad para ingresar a este sitio web y comprar bebidas alcohólicas.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm text-yellow-800 font-medium mb-1">
                  Consumo responsable
                </p>
                <p className="text-xs text-yellow-700">
                  El consumo excesivo de alcohol es dañino para la salud. Prohibida su venta a menores de 18 años.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onConfirm}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Sí, soy mayor de 18
            </button>
            
            <button
              onClick={onDeny}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-full transition-all duration-300"
            >
              No
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            Al hacer clic en "Sí", confirmas que tienes al menos 18 años de edad.
          </p>
        </div>
      </div>
    </div>
  );
}