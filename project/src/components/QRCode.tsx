import React from 'react';
import { X, Download, Share } from 'lucide-react';

interface QRCodeProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  eventName: string;
  total: number;
  drinks: string[];
}

export default function QRCode({ isOpen, onClose, orderNumber, eventName, total, drinks }: QRCodeProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">¡Pedido Confirmado!</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* QR Code */}
        <div className="p-6 text-center max-h-[605px] overflow-y-auto custom-scrollbar">
          <div className="bg-gray-100 p-8 rounded-2xl mb-6">
            <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-lg mx-auto flex items-center justify-center">
              {/* Mock QR Code - En implementación real usar librería de QR */}
              <div className="grid grid-cols-8 gap-1">
                {Array.from({length: 64}, (_, i) => (
                  <div 
                    key={i} 
                    className={`w-2 h-2 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <h3 className="text-lg font-bold text-gray-900">Pedido #{orderNumber}</h3>
            <p className="text-gray-600">{eventName}</p>
            <p className="text-2xl font-bold text-green-600">${total.toLocaleString()}</p>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <h4 className="font-bold text-gray-900 mb-2">Resumen del pedido:</h4>
            <ul className="space-y-1">
              {drinks.map((drink, index) => (
                <li key={index} className="text-sm text-gray-600">• {drink}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Descargar QR</span>
            </button>
            
            <button className="w-full border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-bold py-3 px-6 rounded-full transition-all duration-300 flex items-center justify-center space-x-2">
              <Share className="w-5 h-5" />
              <span>Compartir</span>
            </button>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-6">
            <p className="text-sm text-yellow-800">
              <strong>¡Importante!</strong> Muestra este código QR en la barra del evento para canjear tus tragos. 
              El código es válido únicamente para este evento.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}