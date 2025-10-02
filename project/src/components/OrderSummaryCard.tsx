
import { Order } from '../data/mockData';
import { Calendar, MapPin, QrCode, RefreshCw } from 'lucide-react';

interface OrderSummaryCardProps {
  order: Order;
  onShowQr: (order: Order) => void;
  onRepeatOrder: (order: Order) => void;
}

const OrderSummaryCard = ({ order, onShowQr, onRepeatOrder }: OrderSummaryCardProps) => {
  // En una app real, aquí habría lógica para determinar si el evento ya pasó.
  // Por ahora, asumimos que todos los eventos son futuros y el QR es visible.
  const isEventUpcoming = true; 

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{order.event.name}</h2>
          <p className="text-sm text-gray-500">ID: {order.orderId}</p>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <p className="text-2xl font-bold text-purple-600">${order.total.toLocaleString()}</p>
          <p className="text-sm text-gray-500">{order.date}</p>
        </div>
      </div>
      
      <div className="border-t border-b border-gray-200 py-4 my-4">
        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-5 h-5 mr-3 text-purple-500" />
            <span>{order.event.date} at {order.event.time}</span>
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
          {order.items.map((item) => (
            <li key={item.drink.id}>
              {item.quantity}x {item.drink.name}
            </li>
          ))}
        </ul>
      </div>

      {isEventUpcoming && (
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
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
