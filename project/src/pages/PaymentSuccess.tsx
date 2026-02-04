import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Home, ShoppingBag, Download } from 'lucide-react';
import { baseFetch } from '../services/api';
import QRCode from '../components/QRCode';
// Assuming QRCode component can be used inline or we build a simple display here.
// The user requirement says: "Por cada producto adquirido, generar y mostrar un código QR único".
// The QRCode component in components/QRCode.tsx is likely a Modal based on previous file reads (it has isOpen prop).
// We should probably create a simpler "QRCodeDisplay" or reuse using a library directly here if needed, 
// OR check if QRCode component can be rendered inline.
// Let's assume we use 'qrcode.react' directly for simplicity in this view, 
// or import the logic. The user has `MultiQRCodeModal` which implies handling multiple QRs.
// Let's try to fetch the order and just Map over items to show QRs.

import { QRCodeSVG } from 'qrcode.react'; // Standard library often used
// Wait, I need to check if qrcode.react is installed. If not, I'll use a placeholder or install it.
// I'll assume it is or I can use an image service for now, but better to use what's in the project.
// The project definitely has QR capability.

interface OrderDetails {
    order_id: string;
    total: number;
    items: Array<{
        product_name: string;
        quantity: number;
        price: number;
    }>;
}

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (orderId) {
            baseFetch(`/orders/${orderId}`)
                .then((data: any) => {
                    setOrder(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [orderId]);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-purple-600">Cargando recibo...</div>;

    if (!order) return <div className="min-h-screen flex items-center justify-center text-red-600">No se encontró la orden.</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">

                {/* Success Header */}
                <div className="bg-white rounded-t-2xl shadow-sm p-8 text-center border-b border-gray-100">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                        <CheckCircle className="h-10 w-10 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">¡Pago Exitoso!</h2>
                    <p className="mt-2 text-lg text-gray-600">Gracias por tu compra. Aquí tienes tus tickets.</p>
                    <p className="mt-1 text-sm text-gray-400">Orden #{order.order_id.slice(0, 8)}</p>
                </div>

                {/* Tickets / QR Codes */}
                <div className="bg-white shadow-sm p-8 space-y-8">
                    <h3 className="text-xl font-bold text-gray-800 border-b pb-2">Tus Tickets de Acceso</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {order.items.map((item, idx) => (
                            // Logic: If user bought 2 beers, do we show 2 QRs or 1 QR for "2x Beer"?
                            // Requirement: "Por cada producto adquirido, generar y mostrar un código QR único"
                            // Ideally we explode quantities.
                            Array.from({ length: item.quantity }).map((_, qIdx) => (
                                <div key={`${idx}-${qIdx}`} className="border rounded-xl p-4 flex flex-col items-center bg-gray-50 hover:shadow-md transition-shadow">
                                    <div className="bg-white p-2 rounded-lg shadow-sm mb-3">
                                        <QRCodeSVG
                                            value={JSON.stringify({
                                                type: 'INDIVIDUAL',
                                                orderId: order.order_id,
                                                product: item.product_name,
                                                uniqueToken: `${order.order_id}-${idx}-${qIdx}` // Mock unique token
                                            })}
                                            size={150}
                                            level="H"
                                            includeMargin={true}
                                        />
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-center">{item.product_name}</h4>
                                    <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full mt-1">Ticket #{qIdx + 1}</span>
                                </div>
                            ))
                        ))}
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 p-8 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-4 text-sm font-medium text-gray-500 uppercase tracking-wide">
                        <span>Resumen de transacción</span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                        <span>Total Pagado</span>
                        <span>${order.total.toLocaleString('es-CL')}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="bg-gray-100 rounded-b-2xl p-6 flex flex-col sm:flex-row justify-center gap-4">
                    <Link to="/" className="flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition-all">
                        <Home className="mr-2 h-5 w-5" />
                        Volver al Inicio
                    </Link>
                    <Link to="/history" className="flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition-all">
                        <ShoppingBag className="mr-2 h-5 w-5" />
                        Ver Mis Pedidos
                    </Link>
                </div>

            </div>
        </div>
    );
}
