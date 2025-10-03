import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { Order } from '../data/mockData';
import OrderSummaryCard from '../components/OrderSummaryCard';
import QRCode from '../components/QRCode';
import EmptyState from '../components/EmptyState';
import FilterPopover from '../components/FilterPopover';

interface OrderHistoryPageProps {
  onManageOrder: (order: Order) => void;
}

const OrderHistoryPage: React.FC<OrderHistoryPageProps> = ({ onManageOrder }) => {
  const { user } = useAuth();
  const { repeatOrder } = useCart();
  const { orders: allOrders } = useOrders();

  const [filtroEvento, setFiltroEvento] = useState('todos');
  const [filtroMes, setFiltroMes] = useState('todos');

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedOrderData, setSelectedOrderData] = useState<Order | null>(null);

  const userOrders = useMemo(() => {
    if (!user) return [];
    return allOrders.filter(order => order.userId === user.id);
  }, [allOrders, user]);

  const opcionesEvento = useMemo(() => {
    const eventos = userOrders.map(order => order.event);
    return Array.from(new Map(eventos.map(e => [e.id, e])).values());
  }, [userOrders]);

  const opcionesMes = useMemo(() => {
    const meses = userOrders.map(order => new Date(order.date).toLocaleString('es-ES', { month: 'long' }));
    return [...new Set(meses)];
  }, [userOrders]);

  const pedidosFiltrados = useMemo(() => {
    return userOrders.filter(order => {
      const pasaFiltroEvento = filtroEvento === 'todos' || order.event.id.toString() === filtroEvento;
      const mesPedido = new Date(order.date).toLocaleString('es-ES', { month: 'long' });
      const pasaFiltroMes = filtroMes === 'todos' || mesPedido === filtroMes;
      return pasaFiltroEvento && pasaFiltroMes;
    });
  }, [userOrders, filtroEvento, filtroMes]);

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

  if (!user) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <EmptyState 
          title="Inicia sesión para ver tu historial"
          message="Parece que no has iniciado sesión. ¡Ingresa para ver tus compras pasadas!"
          buttonText="Iniciar Sesión"
          buttonLink="/"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Mi Historial de Pedidos</h1>
        
        {userOrders.length > 0 && (
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
              onManage={onManageOrder}
            />
          ))}
        </div>
      ) : (
        <EmptyState 
          title={userOrders.length > 0 ? "Sin Resultados" : "Aún no tienes pedidos"}
          message={userOrders.length > 0 ? "No se encontraron pedidos que coincidan con tus filtros." : "Parece que todavía no has realizado ninguna compra. ¡Explora nuestros eventos y evita las filas!"}
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