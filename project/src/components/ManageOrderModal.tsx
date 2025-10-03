import React, { useState, useEffect } from 'react';
import { Order } from '../data/mockData';
import { useOrders } from '../context/OrderContext';
import { X, SlidersHorizontal, QrCode, Plus, Minus, Eye } from 'lucide-react';

interface ManageOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onShowQRs: (qrDataList: any[]) => void;
  onViewGlobalQR: (qrData: any) => void;
}

const ManageOrderModal: React.FC<ManageOrderModalProps> = ({ isOpen, onClose, order, onShowQRs, onViewGlobalQR }) => {
  const { claimItems, storeActiveQRs, activeQRs } = useOrders();
  const [itemsToClaim, setItemsToClaim] = useState<{ [drinkId: number]: number }>({});

  useEffect(() => {
    if (isOpen) {
      setItemsToClaim({});
    }
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const handleClaimQuantityChange = (drinkId: number, quantity: number, maxQuantity: number) => {
    const newQuantity = Math.max(0, Math.min(quantity, maxQuantity));
    setItemsToClaim(prev => ({ ...prev, [drinkId]: newQuantity }));
  };

  const handleGenerateQRs = () => {
    const itemsToClaimArray = Object.entries(itemsToClaim)
      .filter(([, quantity]) => quantity > 0)
      .map(([drinkId, quantity]) => ({ drinkId: Number(drinkId), quantity }));

    if (itemsToClaimArray.length === 0) return;

    const qrDataList: any[] = [];
    itemsToClaimArray.forEach(({ drinkId, quantity }) => {
      const drinkInfo = order.items.find(i => i.drink.id === drinkId)?.drink;
      if (!drinkInfo) return;

      for (let i = 0; i < quantity; i++) {
        qrDataList.push({
          type: 'INDIVIDUAL',
          orderNumber: `${order.orderId}-D${drinkId}-N${(order.items.find(i => i.drink.id === drinkId)?.claimed || 0) + i + 1}`,
          eventName: order.event.name,
          drinks: [`1x ${drinkInfo.name}`],
          total: drinkInfo.price,
        });
      }
    });

    claimItems(order.orderId, itemsToClaimArray);
    storeActiveQRs(order.orderId, qrDataList);
    onShowQRs(qrDataList);
  };

  const handleViewActiveQRs = (drinkId: number) => {
    const activeQRsForOrder = activeQRs[order.orderId] || [];
    const activeQRsForItem = activeQRsForOrder.filter(qr => 
        qr.orderNumber.startsWith(`${order.orderId}-D${drinkId}-`)
    );
    if (activeQRsForItem.length > 0) {
        onShowQRs(activeQRsForItem);
    }
  };

  const totalItemsToClaim = Object.values(itemsToClaim).reduce((sum, q) => sum + q, 0);
  const globalQR = (activeQRs[order.orderId] || []).find(qr => qr.type === 'GLOBAL');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
                <SlidersHorizontal className="w-6 h-6" />
                <h2 className="text-xl font-bold">Gestionar Pedido</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors" aria-label="Cerrar modal">
              <X className="w-6 h-6" />
            </button>
          </div>
           <p className="text-blue-100 mt-2 text-sm">Pedido #{order.orderId}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
          {order.items.map(item => {
            const claimed = item.claimed || 0;
            const remaining = item.quantity - claimed;
            const currentClaimAmount = itemsToClaim[item.drink.id] || 0;
            const activeQRsForItemCount = (activeQRs[order.orderId] || []).filter(qr => qr.orderNumber.startsWith(`${order.orderId}-D${item.drink.id}-`)).length;

            return (
              <div key={item.drink.id} className="bg-gray-50 rounded-xl p-4">
                 <div className="flex items-center space-x-4">
                    <img 
                        src={item.drink.image} 
                        alt={item.drink.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{item.drink.name}</h4>
                        <p className="text-sm text-gray-500">
                            Comprados: {item.quantity} | Reclamados: {claimed} | <span className="font-medium text-blue-600">Restantes: {remaining}</span>
                        </p>
                        {activeQRsForItemCount > 0 && (
                            <button onClick={() => handleViewActiveQRs(item.drink.id)} className="text-xs text-orange-500 hover:underline mt-1 flex items-center gap-1">
                                <Eye className="w-4 h-4"/> Ver {activeQRsForItemCount} QR(s) activo(s)
                            </button>
                        )}
                    </div>
                     {remaining > 0 && (
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handleClaimQuantityChange(item.drink.id, currentClaimAmount - 1, remaining)}
                                className="w-8 h-8 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
                                disabled={currentClaimAmount <= 0}
                                >
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-bold text-lg min-w-[1.5rem] text-center">
                                {currentClaimAmount}
                            </span>
                            <button
                                onClick={() => handleClaimQuantityChange(item.drink.id, currentClaimAmount + 1, remaining)}
                                className="w-8 h-8 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
                                disabled={currentClaimAmount >= remaining}
                                >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                 </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 p-6 space-y-3">
            {globalQR && (
                <button 
                    onClick={() => onViewGlobalQR(globalQR)}
                    className="w-full border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-bold py-3 px-6 rounded-full transition-all duration-300 flex items-center justify-center space-x-2"
                >
                    <QrCode className="w-5 h-5" />
                    <span>Ver QR Global Activo</span>
                </button>
            )}
             <button 
                onClick={handleGenerateQRs}
                disabled={totalItemsToClaim === 0}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100"
            >
                <QrCode className="w-5 h-5" />
                <span>Generar {totalItemsToClaim} QR(s)</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default ManageOrderModal;