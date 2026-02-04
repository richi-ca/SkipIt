import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { XCircle, RefreshCcw, ShoppingCart } from 'lucide-react';

export default function PaymentFailure() {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-red-50 p-8 text-center">
                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
                        <XCircle className="h-12 w-12 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Pago Fallido</h2>
                    <p className="text-gray-600">
                        Lo sentimos, la transacción no pudo ser procesada.
                    </p>
                    {orderId && <p className="text-xs text-gray-400 mt-2">Orden #{orderId.slice(0, 8)}...</p>}
                </div>

                <div className="p-8 space-y-6">
                    <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
                        <p className="text-sm text-orange-800 flex items-start">
                            <span className="mr-2">💡</span>
                            <span>
                                Posibles causas: fondos insuficientes, error de conexión con el banco, o la operación fue anulada manualmente.
                            </span>
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Link
                            to="/"
                            onClick={() => {
                                // Ideally we might want to recover the cart here?
                                // For now, retry sends home or to cart if open.
                            }}
                            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 shadow-lg transition-all"
                        >
                            <RefreshCcw className="mr-2 h-5 w-5" />
                            Reintentar Pago (Volver al Carrito)
                        </Link>

                        <Link
                            to="/"
                            className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 text-base font-medium rounded-lg text-gray-600 bg-white hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
