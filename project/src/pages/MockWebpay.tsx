import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { baseFetch } from '../services/api';

export default function MockWebpay() { // Renaming file implies usage. We can keep name or rename to "WebpayRedirect"
    const [searchParams] = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount') || "0";

    useEffect(() => {
        const initiateWebpay = async () => {
            try {
                if (!orderId) throw new Error("No Order ID");

                // 1. Call Backend to Create Transaction
                console.log("Initiating Webpay for Order:", orderId);
                const response = await baseFetch<{ token: string, url: string }>('/webpay/create', {
                    method: 'POST',
                    body: JSON.stringify({
                        buy_order: orderId,
                        session_id: `SESSION-${orderId}-${Date.now()}`,
                        amount: parseInt(amount)
                    })
                });

                console.log("Webpay Response:", response);

                // 2. Submit Form automatically
                if (response.token && response.url) {
                    // We render a form and submit it utilizing the Ref
                    if (formRef.current) {
                        formRef.current.action = response.url;
                        // Input value set below
                        // formRef.current.submit(); // React doesn't like direct submit sometimes?
                        // Let's rely on state update to trigger render then submit?
                        // Or just direct DOM manipulation.
                        // Ideally we construct the form in DOM.

                        // We need to set the value of the input before submitting
                        const tokenInput = formRef.current.querySelector('input[name="token_ws"]') as HTMLInputElement;
                        if (tokenInput) {
                            tokenInput.value = response.token;
                            formRef.current.submit();
                        }
                    }
                } else {
                    throw new Error("Invalid response from Webpay Init");
                }

            } catch (err: any) {
                console.error(err);
                setError(err.message || "Error al conectar con Webpay");
            }
        };

        if (orderId) {
            initiateWebpay();
        }
    }, [orderId, amount]);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-red-50 text-red-800 p-6 rounded-lg max-w-md text-center">
                    <h2 className="text-xl font-bold mb-2">Error de Conexión</h2>
                    <p>{error}</p>
                    <a href="/" className="mt-4 inline-block underline">Volver al inicio</a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
            <div className="text-center">
                <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Conectando con Webpay...</h2>
                <p className="text-gray-500">Por favor espera, te estamos redirigiendo al sitio seguro de Transbank.</p>
                <p className="text-xs text-gray-400 mt-4">Orden #{orderId}</p>
            </div>

            {/* Hidden Form for Redirection */}
            <form ref={formRef} method="POST" action="">
                <input type="hidden" name="token_ws" />
            </form>
        </div>
    );
}
