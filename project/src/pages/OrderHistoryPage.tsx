
import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orders as mockOrders, Order } from '../data/mockData';
import OrderSummaryCard from '../components/OrderSummaryCard';
import QRCode from '../components/QRCode';
import OrderHistorySkeleton from '../components/OrderHistorySkeleton';
import EmptyState from '../components/EmptyState';
import FilterPopover from '../components/FilterPopover'; // Importar el nuevo componente

const OrderHistoryPage = () => {
  const { user } = useAuth();
  const { repeatOrder } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [filtroEvento, setFiltroEvento] = useState('todos');
  const [filtroMes, setFiltroMes] = useState('todos');

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedOrderData, setSelectedOrderData] = useState<Order | null>(null);

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        const userOrders = mockOrders.filter((order) => order.userId.toString() === user.id);
        setOrders(userOrders);
        setLoading(false);
      }, 1000);
    } else {
      setLoading(false);
      setOrders([]);
    }
  }, [user]);

  const opcionesEvento = useMemo(() => {
    const eventos = orders.map(order => order.event);
    return Array.from(new Map(eventos.map(e => [e.id, e])).values());
  }, [orders]);

  const opcionesMes = useMemo(() => {
    const meses = orders.map(order => new Date(order.date).toLocaleString('es-ES', { month: 'long' }));
    return [...new Set(meses)];
  }, [orders]);

  const pedidosFiltrados = useMemo(() => {
    return orders.filter(order => {
      const pasaFiltroEvento = filtroEvento === 'todos' || order.event.id.toString() === filtroEvento;
      const mesPedido = new Date(order.date).toLocaleString('es-ES', { month: 'long' });
      const pasaFiltroMes = filtroMes === 'todos' || mesPedido === filtroMes;
      return pasaFiltroEvento && pasaFiltroMes;
    });
  }, [orders, filtroEvento, filtroMes]);

  const handleShowQr = (order: Order) => {
    setSelectedOrderData(order);
    setIsQrModalOpen(true);
  };

  const handleCloseQr = () => {
    setIsQrModalOpen(false);
    setSelectedOrderData(null);
  };

  const handleRepeatOrder = (order: Order) => {
    repeatOrder(order.items);
  };

  if (loading) {
    return <OrderHistorySkeleton />;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Mi Historial de Pedidos</h1>
        
        {orders.length > 0 && (
          <FilterPopover 
            filtroEvento={filtroEvento}
            setFiltroEvento={setFiltroEvento}
            opcionesEvento={opcionesEvento}
            filtroMes={filtroMes}
            setFiltroMes={setFiltroMes}
            opcionesMes={opcionesMes}
          />
        )}
      </div>

      {pedidosFiltrados.length > 0 ? (
        <div className="space-y-6">
          {pedidosFiltrados.map((order) => (
            <OrderSummaryCard 
              key={order.orderId} 
              order={order} 
              onShowQr={handleShowQr} 
              onRepeatOrder={handleRepeatOrder}
            />
          ))}
        </div>
      ) : (
        <EmptyState 
          title={orders.length > 0 ? "Sin Resultados" : "Aún no tienes pedidos"}
          message={orders.length > 0 ? "No se encontraron pedidos que coincidan con tus filtros." : "Parece que todavía no has realizado ninguna compra. ¡Explora nuestros eventos y evita las filas!"}
          buttonText="Explorar Eventos"
          buttonLink="/events"
        />
      )}

      {selectedOrderData && (
        <QRCode
          isOpen={isQrModalOpen}
          onClose={handleCloseQr}
          orderNumber={selectedOrderData.orderId}
          eventName={selectedOrderData.event.name}
          total={selectedOrderData.total}
          drinks={selectedOrderData.items.map(item => `${item.quantity}x ${item.drink.name}`)}
        />
      )}
    </div>
  );
};

export default OrderHistoryPage;
