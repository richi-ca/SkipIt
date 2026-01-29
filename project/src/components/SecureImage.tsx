import { useState, useEffect } from 'react';

interface SecureImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
}

export default function SecureImage({ src, ...props }: SecureImageProps) {
    const [objectUrl, setObjectUrl] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        if (!src) {
            setObjectUrl(null);
            return;
        }

        const apiUrl = import.meta.env.VITE_API_URL || '';

        // Solo interceptamos si es una URL de nuestra API (ngrok)
        if (src.startsWith('http') && src.includes(apiUrl.replace(/^https?:\/\//, ''))) {
            const fetchImage = async () => {
                try {
                    const response = await fetch(src, {
                        headers: {
                            'ngrok-skip-browser-warning': 'true',
                            // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Opcional si es privado
                        }
                    });
                    if (!response.ok) throw new Error('Network response was not ok');
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    if (mounted) setObjectUrl(url);
                } catch (e) {
                    // Si falla el fetch manual, probamos dejando el src original por si acaso
                    if (mounted) setObjectUrl(src);
                }
            };
            fetchImage();
        } else {
            // Para data:URI o externos
            setObjectUrl(src);
        }

        return () => {
            mounted = false;
            // Limpieza de memoria
            if (objectUrl && objectUrl.startsWith('blob:')) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [src]);

    // Renderizamos img normal con el objectUrl (o el original si no era necesario proxy)
    // Usamos props para pasar className, alt, etc.
    if (!objectUrl) return <div className={`bg-gray-200 animate-pulse ${props.className}`} />;

    return <img src={objectUrl} {...props} />;
}
