import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { Order } from '../data/mockData';
import OrderSummaryCard from '../components/OrderSummaryCard';
import QRCode from '../components/QRCode';
import EmptyState from '../components/EmptyState';
import FilterPopover from '../components/FilterPopover';

interface OrderHistoryPageProps {
  onManageOrder: (order: Order) => void;
}

// Helper para crear fecha local sin problemas de zona horaria
const parseIsoDateToLocal = (isoDate: string) => {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const OrderHistoryPage: React.FC<OrderHistoryPageProps> = ({ onManageOrder }) => {
  const { user } = useAuth();
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
    const mesesMap = new Map<string, { value: string; label: string }>();
    
    userOrders.forEach(order => {
      // Robust extraction: YYYY-MM from ISO date (e.g., "2025-11")
      const isoMonth = order.isoDate.substring(0, 7);
      
      if (!mesesMap.has(isoMonth)) {
        const date = parseIsoDateToLocal(order.isoDate);
        // Robust display formatting
        const label = date.toLocaleString('es-CL', { month: 'long', year: 'numeric' });
        const labelCapitalized = label.charAt(0).toUpperCase() + label.slice(1);
        
        mesesMap.set(isoMonth, { value: isoMonth, label: labelCapitalized });
      }
    });

    // Return sorted options (Newest first)
    return Array.from(mesesMap.values()).sort((a, b) => b.value.localeCompare(a.value));
  }, [userOrders]);

  const pedidosFiltrados = useMemo(() => {
    return userOrders.filter(order => {
      const pasaFiltroEvento = filtroEvento === 'todos' || order.event.id.toString() === filtroEvento;
      
      // Robust filtering: Check if ISO date starts with the selected YYYY-MM value
      const pasaFiltroMes = filtroMes === 'todos' || order.isoDate.startsWith(filtroMes);
      
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

  const handleRepeatOrder = () => {
    // repeatOrder(order.items);
    console.log("Repetir orden pendiente de implementación backend");
  };

  if (!user) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <EmptyState 
          title="Inicia sesión para ver tu historial"
          message="Parece que no has iniciado sesión. ¡Ingresa para ver tus compras pasadas!"
          buttonText="Iniciar Sesión"
          buttonLink="/login"
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
          drinks={selectedOrderData.items.map(item => `${item.quantity}x ${item.productName} (${item.variationName})`)}
        />
      )}
    </div>
  );
};

export default OrderHistoryPage;