import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Order } from '../data/mockData';
import OrderSummaryCard from '../components/OrderSummaryCard';
import EmptyState from '../components/EmptyState';
import { ShoppingBag } from 'lucide-react';
import FilterPopover from '../components/FilterPopover';
import OrderHistorySkeleton from '../components/OrderHistorySkeleton';
import { orderService } from '../services/orderService';
import { Link } from 'react-router-dom';

interface OrderHistoryPageProps {
  onManageOrder: (order: Order) => void;
}

export default function OrderHistoryPage({ onManageOrder }: OrderHistoryPageProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<string>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const data = await orderService.getMyOrders();
        setOrders(data);
      } catch (err: any) {
        console.error('Error fetching order history:', err);
        setError('No pudimos cargar tu historial de pedidos.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Refresh when window gains focus (e.g. coming back from another tab or closing a modal that might have changed focus)
    window.addEventListener('focus', fetchOrders);
    return () => window.removeEventListener('focus', fetchOrders);
  }, [user]);

  // Si no hay usuario logueado, mostrar estado vacío o redirect
  if (!user) {
    return (
      <div className="py-12 bg-white flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 mb-4">Debes iniciar sesión para ver tus pedidos.</p>
        <Link to="/" className="text-purple-600 font-bold hover:underline">Volver al inicio</Link>
      </div>
    );
  }

  // Lógica de Filtrado operando sobre 'orders' del estado
  const filteredOrders = orders.filter(order => {
    // 1. Filtro por Tab (Activos vs Historial)
    // - Activos: COMPLETED (recién pagado), PARTIALLY_CLAIMED (quedan cosas por cobrar)
    // - Historial: FULLY_CLAIMED (ya se cobró todo), CANCELLED (anulado)
    const isFinished = order.status === 'FULLY_CLAIMED' || order.status === 'CANCELLED';
    if (activeTab === 'active' && isFinished) return false;
    if (activeTab === 'history' && !isFinished) return false;

    // 2. Filtro por Mes (Usando isoDate YYYY-MM-DD)
    if (selectedMonth !== 'all') {
      const orderMonthYear = order.isoDate.substring(0, 7); // "YYYY-MM"
      if (orderMonthYear !== selectedMonth) return false;
    }

    // 3. Filtro por Evento
    if (selectedEvent !== 'all') {
      if (order.event.id.toString() !== selectedEvent) return false;
    }

    return true;
  });

    // Extraer opciones para filtros basados en los datos REALES obtenidos del backend

    const availableMonths = Array.from(new Set(orders.map(o => o.isoDate.substring(0, 7)))).sort().reverse().map(monthStr => {

        const [y, m] = monthStr.split('-');

        const date = new Date(parseInt(y), parseInt(m) - 1);

        const label = date.toLocaleString('es-CL', { month: 'long', year: 'numeric' });

        return { value: monthStr, label: label.charAt(0).toUpperCase() + label.slice(1) };

    });

  

    const availableEvents = Array.from(new Set(orders.map(o => JSON.stringify({id: o.event.id, name: o.event.name}))))

      .map(s => JSON.parse(s));

  

    if (loading) return <OrderHistorySkeleton />;

  

    if (error) {

      return (

        <div className="py-12 bg-white text-center">

          <p className="text-red-600 font-medium">{error}</p>

          <button 

            onClick={() => window.location.reload()} 

            className="mt-4 text-purple-600 font-bold hover:underline"

          >

            Intentar de nuevo

          </button>

        </div>

      );

    }

  

    return (

      <div className="min-h-screen bg-gray-50 py-8">

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          

          {/* Header con Filtros Popovers */}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">

            <h1 className="text-2xl font-bold text-gray-900 flex items-center">

              <ShoppingBag className="w-6 h-6 mr-2 text-purple-600" />

              Mis Pedidos

            </h1>

            

            <div className="flex space-x-2">

               <FilterPopover 

                  filtroMes={selectedMonth}

                  setFiltroMes={setSelectedMonth}

                  opcionesMes={availableMonths}

                  filtroEvento={selectedEvent}

                  setFiltroEvento={setSelectedEvent}

                  opcionesEvento={availableEvents}

               />

            </div>

          </div>

  

          {/* Tabs de navegación */}

          <div className="bg-white rounded-xl p-1 mb-6 shadow-sm flex">

            <button

              onClick={() => setActiveTab('active')}

              className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${

                activeTab === 'active'

                  ? 'bg-purple-100 text-purple-700 shadow-sm'

                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'

              }`}

            >

              Pedidos Activos

            </button>

            <button

              onClick={() => setActiveTab('history')}

              className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${

                activeTab === 'history'

                  ? 'bg-purple-100 text-purple-700 shadow-sm'

                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'

              }`}

            >

              Historial

            </button>

          </div>

  

          {/* Listado de Órdenes */}

          {filteredOrders.length > 0 ? (

            <div className="space-y-4">

              {filteredOrders.map((order) => (

                <OrderSummaryCard 

                  key={order.orderId} 

                  order={order} 

                  onManage={() => onManageOrder(order)}

                  onShowQr={() => onManageOrder(order)} // Temporal: ambas acciones abren el modal

                  onRepeatOrder={() => {}} // Pendiente de implementar

                />

              ))}

            </div>

          ) : (

            <EmptyState 

              title={activeTab === 'active' ? "No tienes pedidos activos" : "No hay historial"}

              message={activeTab === 'active' 

                ? "Tus compras vigentes para próximos eventos aparecerán aquí." 

                : "Aquí verás el registro de tus eventos pasados."

              }

              buttonText="Buscar Eventos"

              buttonLink="/"

            />

          )}

        </div>

      </div>

    );

  }

  
