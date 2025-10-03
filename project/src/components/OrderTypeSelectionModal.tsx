import React from 'react';
import { X, QrCode, SlidersHorizontal } from 'lucide-react';

interface OrderTypeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSingleQR: () => void;
  onSelectIndividual: () => void;
}

const OrderTypeSelectionModal: React.FC<OrderTypeSelectionModalProps> = ({ isOpen, onClose, onSelectSingleQR, onSelectIndividual }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <QrCode className="w-7 h-7" />
              <h2 className="text-xl font-bold">Elige el tipo de QR</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors" aria-label="Cerrar modal">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
            <p className='text-center text-gray-600'>Tu pago fue exitoso. Ahora, elige cómo quieres recibir los productos de tu pedido.</p>
            <div className='space-y-4'>
                <button
                    onClick={onSelectSingleQR}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
                >
                    <QrCode className="w-5 h-5" />
                    <span>Generar un solo QR para todo</span>
                </button>
                <button
                    onClick={onSelectIndividual}
                    className="w-full border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-bold py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center space-x-2"
                >
                    <SlidersHorizontal className="w-5 h-5" />
                    <span>Gestionar productos individualmente</span>
                </button>
            </div>
             <div className="text-center">
                <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700">Cancelar</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTypeSelectionModal;