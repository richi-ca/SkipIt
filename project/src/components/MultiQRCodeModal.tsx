import React, { useRef } from 'react';
import { X, QrCode, Download, Share, Check } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useOrders } from '../context/OrderContext';

interface QrDataItem {
  orderNumber: string;
  eventName: string;
  drinks: string[];
  total: number;
}

interface MultiQRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrDataList: QrDataItem[];
}

interface IndividualQRCardProps {
    qrData: QrDataItem;
    onMarkAsUsed: (qrId: string) => void;
}

// Sub-component for each individual QR card to manage its own state and logic
const IndividualQRCard: React.FC<IndividualQRCardProps> = ({ qrData, onMarkAsUsed }) => {
    const qrRef = useRef<HTMLDivElement>(null);

    const handleDownload = () => {
        const canvas = qrRef.current?.querySelector('canvas');
        if (canvas) {
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `QR_Pedido_${qrData.orderNumber}.png`;
            link.click();
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: `Mi trago de SkipIt: ${qrData.drinks.join(', ')}`,
            text: `¡Listo para retirar mi ${qrData.drinks.join(', ')} en ${qrData.eventName}! Mostrando mi QR.`,
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

    return (
        <div className="bg-gray-100 rounded-2xl p-6">
            <div className="text-center">
                <div ref={qrRef} className="w-48 h-48 bg-white border-2 border-gray-200 rounded-lg mx-auto flex items-center justify-center">
                    <QRCodeCanvas
                        value={JSON.stringify(qrData)}
                        size={180}
                        bgColor={"#ffffff"}
                        fgColor={"#000000"}
                        level={"H"}
                        includeMargin={false}
                    />
                </div>
                <p className="font-bold mt-4 text-xl">{qrData.drinks.join(', ')}</p>
                <p className="text-sm text-gray-500 mt-1">ID: {qrData.orderNumber}</p>
            </div>
            <div className="mt-6 space-y-3">
                <button onClick={handleDownload} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Descargar</span>
                </button>
                <button onClick={handleShare} className="w-full border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-bold py-3 px-4 rounded-full transition-all duration-300 flex items-center justify-center space-x-2">
                    <Share className="w-4 h-4" />
                    <span>Compartir</span>
                </button>
                 <button onClick={() => onMarkAsUsed(qrData.orderNumber)} className="w-full text-red-500 hover:text-red-700 text-xs font-bold py-2 px-4 rounded-full transition-all duration-300 flex items-center justify-center space-x-1">
                    <Check className="w-4 h-4" />
                    <span>Simular Uso / Marcar como Usado</span>
                </button>
            </div>
        </div>
    )
}

const MultiQRCodeModal: React.FC<MultiQRCodeModalProps> = ({ isOpen, onClose, qrDataList }) => {
  const { markQrAsUsed } = useOrders();
    
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <QrCode className="w-6 h-6" />
                    <h2 className="text-xl font-bold">Tus Códigos QR</h2>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors" aria-label="Cerrar modal">
                <X className="w-6 h-6" />
                </button>
            </div>
            <p className="text-green-100 mt-2 text-sm">{qrDataList.length} códigos generados. Muestra cada uno para retirar.</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
          {qrDataList.length > 0 ? qrDataList.map((qrData, index) => (
            <IndividualQRCard key={index} qrData={qrData} onMarkAsUsed={markQrAsUsed} />
          )) : (
            <p className='text-center text-gray-500 py-8'>No hay QR activos para este item.</p>
          )}
        </div>

         {/* Footer */}
        <div className="border-t bg-gray-50 p-6 text-center">
            <p className="text-xs text-gray-500">
                Estos códigos son únicos. Una vez escaneados, no podrán ser reutilizados.
            </p>
        </div>
      </div>
    </div>
  );
};

export default MultiQRCodeModal;
