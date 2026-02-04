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

          {/* Webpay Redirection Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <CreditCard className="w-6 h-6 text-blue-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Redirección Bancaria</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Al confirmar, serás redirigido a <strong>Webpay</strong> para realizar el pago de forma segura.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={onPaymentSuccess}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 flex items-center justify-center space-x-3"
            >
              <Lock className="w-5 h-5" />
              <span>Ir a Pagar ${totalAmount.toLocaleString()}</span>
            </button>
          </div>

          <div className="mt-4 flex justify-center">
            <img src="https://www.transbank.cl/public/img/logo-webpay-plus.svg" alt="Webpay Plus" className="h-8 opacity-70" />
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
