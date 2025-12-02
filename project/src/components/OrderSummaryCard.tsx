import { Order } from '../data/mockData';
import { Calendar, MapPin, QrCode, RefreshCw } from 'lucide-react';

interface OrderSummaryCardProps {
  order: Order;
  onShowQr: (order: Order) => void;
  onRepeatOrder: (order: Order) => void;
  onManage: (order: Order) => void;
}

// Helper para crear fecha local sin problemas de zona horaria (Duplicado intencionalmente para autonomía del componente o podría importarse)
const parseIsoDateToLocal = (isoDate: string) => {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const OrderSummaryCard = ({ order, onShowQr, onRepeatOrder, onManage }: OrderSummaryCardProps) => {
  // En una app real, aquí habría lógica para determinar si el evento ya pasó.
  // Por ahora, asumimos que todos los eventos son futuros y el QR es visible.
  const isEventUpcoming = true; 

  const eventDateFormatted = parseIsoDateToLocal(order.event.isoDate).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Formatear la fecha de la orden (compra)
  const orderDateObj = parseIsoDateToLocal(order.isoDate);
  const orderDateFormatted = orderDateObj.toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short', // 'Nov' instead of 'Noviembre'
  });
  // Capitalizar mes
  const orderDateCapitalized = orderDateFormatted.replace(/^\w/, (c) => c.toUpperCase()) + ".";
  
  // Use real purchase time from mockData, fallback to 00:00:00 if missing
  const purchaseTime = order.purchaseTime || "00:00:00";

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{order.event.name}</h2>
          
          {/* New Date Location */}
          <div className="flex items-center text-sm text-gray-500 mt-1 mb-1">
            <Calendar className="w-4 h-4 mr-1 text-purple-500" />
            <span>Comprado {orderDateCapitalized} {purchaseTime}</span>
          </div>

          <p className="text-xs text-gray-400 uppercase tracking-wide">ID: {order.orderId}</p>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <p className="text-2xl font-bold text-purple-600">${order.total.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="border-t border-b border-gray-200 py-4 my-4">
        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-5 h-5 mr-3 text-purple-500" />
            <span className="capitalize"> evento: {eventDateFormatted} at {order.event.startTime} - {order.event.endTime}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-3 text-purple-500" />
            <span>{order.event.location}</span>
          </div>
        </div>
      </div>

      <div className="flex-grow">
        <h3 className="font-semibold text-gray-800 mb-2">Artículos del Pedido:</h3>
        <ul className="space-y-1 text-gray-600 list-disc list-inside">
          {order.items.map((item, index) => (
            <li key={index}>
              {item.quantity}x {item.productName} <span className="text-sm text-gray-500">({item.variationName})</span>
            </li>
          ))}
        </ul>
      </div>

      {isEventUpcoming && (
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => onManage(order)}
            className="flex-1 border-2 border-gray-500 text-gray-600 hover:bg-gray-100 font-bold py-3 px-6 rounded-full transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>Gestionar</span>
          </button>
          <button
            onClick={() => onRepeatOrder(order)}
            className="flex-1 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-bold py-3 px-6 rounded-full transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Repetir Pedido</span>
          </button>
          <button
            onClick={() => onShowQr(order)}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <QrCode className="w-5 h-5" />
            <span>Ver Código QR</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderSummaryCard;
