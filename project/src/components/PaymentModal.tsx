import React, { useState } from 'react';
import { X, CreditCard, Lock, Loader } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  totalAmount: number;
}

export default function PaymentModal({ isOpen, onClose, onPaymentSuccess, totalAmount }: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handlePayment = () => {
    setIsLoading(true);
    // Simula una llamada a una API de pagos
    setTimeout(() => {
      setIsLoading(false);
      onPaymentSuccess();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale">
        {/* Header */}
        <div className="bg-gray-100 p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Confirmar Pago</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:bg-gray-200 rounded-full transition-colors"
              disabled={isLoading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-gray-600">Total a Pagar</p>
            <p className="text-4xl font-bold text-gray-900">${totalAmount.toLocaleString()}</p>
          </div>

          {/* Mock Payment Form */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4">
            <div className="flex items-center">
              <CreditCard className="w-6 h-6 text-gray-400 mr-3" />
              <input 
                type="text" 
                placeholder="4922 0000 0000 0000" 
                disabled 
                className="w-full bg-gray-200 text-gray-500 rounded-md p-2 cursor-not-allowed"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="MM/YY" 
                disabled 
                className="w-full bg-gray-200 text-gray-500 rounded-md p-2 cursor-not-allowed"
              />
              <input 
                type="text" 
                placeholder="CVC" 
                disabled 
                className="w-full bg-gray-200 text-gray-500 rounded-md p-2 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handlePayment}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-70 disabled:cursor-wait"
            >
              {isLoading ? (
                <Loader className="w-6 h-6 animate-spin" />
              ) : (
                <Lock className="w-5 h-5" />
              )}
              <span>{isLoading ? 'Procesando Pago...' : `Pagar $${totalAmount.toLocaleString()}`}</span>
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center mt-4">
            Esto es una simulación. No se realizará ningún cargo real.
          </p>
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
