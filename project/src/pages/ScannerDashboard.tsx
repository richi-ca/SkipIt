import React, { useState } from 'react';
import { QrCode, Search, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { orderService } from '../services/orderService';
import toast from 'react-hot-toast';

export default function ScannerDashboard() {
  const [orderInput, setOrderInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<{ success: boolean; message: string; data?: any } | null>(null);

  const handleProcessOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderInput.trim()) return;

    setIsProcessing(true);
    setLastResult(null);

    try {
      let orderId = orderInput.trim();
      let itemIndex: number | null = null;
      let isIndividual = false;
      
      // Intentar detectar si es un JSON de QR
      if (orderId.startsWith('{')) {
        try {
          const qrData = JSON.parse(orderId);
          orderId = qrData.orderId || qrData.orderNumber;
        } catch (e) {
          // Si falla el parse, lo tratamos como string literal
        }
      }

      // Detectar patrón de QR individual: ID-I{index}-N{correlativo}
      // Ejemplo: ORD-DB83346B-I0-N1
      const individualMatch = orderId.match(/^(.+)-I(\d+)-N\d+$/);
      if (individualMatch) {
        orderId = individualMatch[1];
        itemIndex = parseInt(individualMatch[2], 10);
        isIndividual = true;
      }

      // 1. Obtener la orden para validar estado actual
      const order = await orderService.getOrderById(orderId);

      if (!order) {
        throw new Error("Pedido no encontrado.");
      }

      if (order.status === 'FULLY_CLAIMED') {
         throw new Error("Este pedido YA ha sido canjeado totalmente.");
      }

      let itemsToClaim = [];

      if (isIndividual && itemIndex !== null) {
        // Lógica para CANJE INDIVIDUAL (1 unidad)
        const item = order.items[itemIndex];
        if (!item || item.claimed >= item.quantity) {
          throw new Error("Este ítem específico ya fue canjeado o no existe.");
        }
        itemsToClaim = [{
          variationId: item.variationId,
          quantity: 1
        }];
      } else {
        // Lógica para CANJE GLOBAL (Todo lo pendiente)
        itemsToClaim = order.items
          .filter(item => item.claimed < item.quantity)
          .map(item => ({
              variationId: item.variationId,
              quantity: item.quantity - item.claimed
          }));
      }

      if (itemsToClaim.length === 0) {
        throw new Error("No hay productos pendientes para canjear.");
      }

      const result = await orderService.claimOrder(orderId, itemsToClaim);

      // Mapeamos los items que acabamos de canjear para mostrarlos en el resumen,
      // buscando sus nombres reales en el resultado que volvió del backend.
      const displayItems = itemsToClaim.map(claimed => {
        const itemInfo = result.items.find(i => i.variationId === claimed.variationId);
        return {
          productName: itemInfo?.productName || 'Producto',
          variationName: itemInfo?.variationName || '',
          quantity: claimed.quantity
        };
      });

      setLastResult({
        success: true,
        message: '¡Pedido procesado con éxito!',
        data: { ...result, items: displayItems } // Sobrescribimos items solo para la visualización del resumen
      });
      toast.success('Pedido canjeado');
      setOrderInput('');

    } catch (error: any) {
      console.error('Error processing order:', error);
      setLastResult({
        success: false,
        message: error.message || 'Error al procesar el pedido'
      });
      toast.error('Error en el canje');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <QrCode className="mr-2 text-purple-600" />
          Procesar Pedido
        </h1>
        <p className="text-gray-600 mb-6">Ingresa el ID del pedido o pega el contenido del QR para validar los tragos.</p>

        <form onSubmit={handleProcessOrder} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={orderInput}
              onChange={(e) => setOrderInput(e.target.value)}
              placeholder="Ej: ORD-ABC12345 o JSON del QR..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              disabled={isProcessing}
            />
          </div>
          <button
            type="submit"
            disabled={isProcessing || !orderInput.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? <Loader2 className="animate-spin" /> : 'Validar'}
          </button>
        </form>
      </div>

      {lastResult && (
        <div className={`rounded-2xl p-8 text-center animate-in fade-in zoom-in duration-300 ${
          lastResult.success ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'
        }`}>
          {lastResult.success ? (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-800 mb-2">{lastResult.message}</h2>
              <div className="mt-4 text-left bg-white rounded-xl p-4 inline-block mx-auto shadow-sm min-w-[300px]">
                <p className="text-sm font-bold text-gray-500 mb-2">Resumen de entrega:</p>
                <ul className="space-y-1">
                  {lastResult.data?.items.map((item: any, idx: number) => (
                    <li key={idx} className="text-gray-700 flex justify-between">
                      <span>{item.productName} ({item.variationName})</span>
                      <span className="font-bold text-purple-600">x{item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-800 mb-2">¡Atención!</h2>
              <p className="text-red-600">{lastResult.message}</p>
            </>
          )}
          <button 
            onClick={() => setLastResult(null)}
            className="mt-6 text-gray-500 hover:text-gray-700 text-sm font-medium underline"
          >
            Cerrar aviso
          </button>
        </div>
      )}

      {/* Guía rápida */}
      {!lastResult && !isProcessing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h3 className="font-bold text-blue-800 mb-1 flex items-center">
                    💡 Tip de Uso
                </h3>
                <p className="text-sm text-blue-700">Puedes copiar el ID de orden desde el historial del cliente para probar la validación.</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                <h3 className="font-bold text-purple-800 mb-1 flex items-center">
                    📸 Cámara (Fase 2)
                </h3>
                <p className="text-sm text-purple-700">Próximamente podrás usar la cámara de este dispositivo para escanear directamente.</p>
            </div>
        </div>
      )}
    </div>
  );
}
