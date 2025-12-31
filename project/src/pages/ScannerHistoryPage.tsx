import React, { useState, useEffect } from 'react';
import { History, ShoppingBag, User, Calendar } from 'lucide-react';
import { orderService } from '../services/orderService';
import { Order } from '../data/mockData';
import OrderHistorySkeleton from '../components/OrderHistorySkeleton';

export default function ScannerHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        // En una app real, el scanner tendría un endpoint para ver TODAS las órdenes del evento.
        // Por ahora, usamos getMyOrders como proxy o simulamos la data.
        const data = await orderService.getMyOrders();
        // Filtramos las que han tenido actividad de canje
        const claimedOrders = data.filter(o => o.status === 'FULLY_CLAIMED' || o.status === 'PARTIALLY_CLAIMED');
        setOrders(claimedOrders);
      } catch (error) {
        console.error('Error fetching scanner history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  if (loading) return <OrderHistorySkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <History className="mr-2 text-purple-600" />
          Historial Global de Canjes
        </h1>
        <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border shadow-sm">
            Total hoy: <span className="font-bold text-purple-600">{orders.length}</span>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No se han procesado pedidos todavía.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Orden</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Evento</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.orderId} className="hover:bg-purple-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-bold text-purple-600">{order.orderId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-700">
                      <User className="w-3 h-3 mr-1 text-gray-400" />
                      Usuario #{order.userId.substring(0, 5)}...
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-700">
                      <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                      {order.event.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      order.status === 'FULLY_CLAIMED' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status === 'FULLY_CLAIMED' ? 'Completado' : 'Parcial'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-500">
                    {order.purchaseTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
