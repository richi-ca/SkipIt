import React, { useRef } from 'react';
import { X, Download, Share, Check } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useOrders } from '../context/OrderContext';

interface QRCodeProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  eventName: string;
  total: number;
  drinks: string[];
}

export default function QRCode({ isOpen, onClose, orderNumber, eventName, total, drinks }: QRCodeProps) {
  const { markQrAsUsed } = useOrders();
  const qrRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `QR_Pedido_${orderNumber}.png`;
      link.click();
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `Mi Pedido SkipIt: #${orderNumber}`,
      text: `¡Listo para retirar mi pedido #${orderNumber} en ${eventName}!`,
      url: window.location.href
    };
    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        alert("La función de compartir no está soportada en este navegador.");
      }
    } catch (error) {
      console.error("Error al compartir:", error);
      alert("Hubo un error al intentar compartir.");
    }
  };

  const handleMarkAsUsed = () => {
    markQrAsUsed(orderNumber);
    onClose();
  }

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
            <div ref={qrRef} className="w-48 h-48 bg-white border-2 border-gray-200 rounded-lg mx-auto flex items-center justify-center">
              <QRCodeCanvas
                value={JSON.stringify({ type: 'GLOBAL', orderNumber, eventName, total, drinks })}
                size={180}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"H"}
                includeMargin={false}
              />
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
            <button 
              onClick={handleDownload}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Descargar QR</span>
            </button>
            
            <button 
              onClick={handleShare}
              className="w-full border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white font-bold py-3 px-6 rounded-full transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Share className="w-5 h-5" />
              <span>Compartir</span>
            </button>

            <button onClick={handleMarkAsUsed} className="w-full text-red-500 hover:text-red-700 text-xs font-bold py-2 px-4 rounded-full transition-all duration-300 flex items-center justify-center space-x-1">
                <Check className="w-4 h-4" />
                <span>Simular Uso / Marcar como Usado</span>
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
