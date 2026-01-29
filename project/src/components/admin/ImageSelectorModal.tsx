import React, { useState, useEffect } from 'react';
import { X, Upload, Check, Maximize2, Minimize2, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import SecureImage from '../SecureImage';

interface ImageSelectorProps {
    currentValue: string;
    onSelect: (value: string) => void;
    onClose: () => void;
    folder?: string;
}

export default function ImageSelectorModal({ currentValue, onSelect, onClose, folder = '' }: ImageSelectorProps) {
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Nuevos estados para funcionalidades requeridas
    const [isMaximized, setIsMaximized] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const MEDIA_BASE_URL = import.meta.env.VITE_MEDIA_URL;
    const LIST_ENDPOINT = `${MEDIA_BASE_URL}/?folder=${folder}`;
    const UPLOAD_ENDPOINT = `${MEDIA_BASE_URL}/upload`;
    const MEDIA_BASE = `${MEDIA_BASE_URL}/${folder ? folder + '/' : ''}`;

    useEffect(() => {
        fetchImages();
    }, []);

    // Resetear a página 1 cuando cambia el término de búsqueda
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, itemsPerPage]);

    const fetchImages = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(LIST_ENDPOINT, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'ngrok-skip-browser-warning': 'true'
                }
            });
            if (!res.ok) throw new Error("Error fetching images");

            const data = await res.json();

            if (Array.isArray(data)) {
                setImages(data);
            } else {
                console.error("Formato de respuesta inesperado para imagenes", data);
                setImages([]);
            }
        } catch (error) {
            console.error(error);
            toast.error('Error al cargar galería');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const ext = file.name.split('.').pop()?.toLowerCase();
        if (!['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif'].includes(ext || '')) {
            toast.error('Formato no permitido');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        if (folder) formData.append('folder', folder);

        setIsUploading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(UPLOAD_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: formData
            });

            if (!res.ok) throw new Error('Error subiendo imagen');
            await res.json();

            toast.success('Imagen subida correctamente');

            await fetchImages();

        } catch (error) {
            console.error(error);
            toast.error('Error al subir imagen');
        } finally {
            setIsUploading(false);
        }
    };

    // Lógica de Filtrado y Paginación
    const filteredImages = images.filter(img =>
        img.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedImages = filteredImages.slice(startIndex, startIndex + itemsPerPage);
    const endIndex = Math.min(startIndex + itemsPerPage, filteredImages.length);

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}>
            <div className={`bg-white shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${isMaximized ? 'w-full h-full rounded-none' : 'w-full max-w-4xl max-h-[85vh] rounded-xl'}`}>

                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center bg-gray-50 shrink-0">
                    <h3 className="font-bold text-lg text-gray-800">
                        Galería de Imágenes
                    </h3>
                    <div className="flex items-center gap-2">
                        <label className={`cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 transition text-sm mr-2 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                            <Upload size={16} />
                            <span>{isUploading ? 'Subiendo...' : 'Subir Nueva'}</span>
                            <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.webp,.avif,.gif" onChange={handleFileUpload} />
                        </label>

                        <button
                            type="button"
                            onClick={() => setIsMaximized(!isMaximized)}
                            className="p-2 hover:bg-gray-200 rounded-lg transition text-gray-600"
                            title={isMaximized ? "Restaurar tamaño" : "Maximizar"}
                        >
                            {isMaximized ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                        </button>
                        <button type="button" onClick={onClose} className="p-2 hover:bg-red-100 hover:text-red-600 rounded-lg transition text-gray-500">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* DataTables Controls Bar */}
                <div className="p-4 bg-white border-b flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-700">
                    {/* Left: Show Entries */}
                    <div className="flex items-center gap-2">
                        <span>Mostrar</span>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            className="border border-gray-300 rounded px-2 py-1 outline-none focus:border-purple-500"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            <option value={999999}>Todos</option>
                        </select>
                        <span>registros</span>
                    </div>

                    {/* Right: Search */}
                    <div className="flex items-center gap-2">
                        <label>Buscar:</label>
                        <input
                            type="text"
                            className="border border-gray-300 rounded px-2 py-1 outline-none focus:border-purple-500 h-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Gallery Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                            {paginatedImages.map((img, index) => (
                                <div
                                    key={`${img}-${index}`}
                                    onClick={() => {
                                        onSelect(img);
                                        setTimeout(onClose, 0);
                                    }}
                                    className={`group relative aspect-square rounded-lg overflow-hidden border-4 cursor-pointer transition hover:border-purple-400 hover:shadow-lg bg-white ${currentValue === img ? 'border-purple-600' : 'border-transparent'}`}
                                >
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                        <SecureImage
                                            src={`${MEDIA_BASE}${img}`}
                                            alt={img}
                                            className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="bg-black/50 text-white text-xs px-2 py-1 rounded">Click para seleccionar</div>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] p-2 truncate text-center">
                                        {img}
                                    </div>

                                    {currentValue === img && (
                                        <div className="absolute top-0 right-0 bg-purple-600 text-white p-1 rounded-bl-lg shadow-lg z-10">
                                            <Check size={16} strokeWidth={3} />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {filteredImages.length === 0 && (
                                <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-400">
                                    <Search size={48} className="mb-4 opacity-20" />
                                    <p>No se encontraron resultados</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* DataTables Pagination Footer */}
                <div className="p-4 border-t bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
                    <div>
                        Mostrando {filteredImages.length > 0 ? startIndex + 1 : 0} a {endIndex} de {filteredImages.length} registros
                    </div>

                    <div className="flex items-center gap-1 select-none">
                        <button
                            type="button"
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                        >
                            Primero
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                        >
                            Anterior
                        </button>

                        <span className="px-3 py-1 border bg-purple-600 text-white border-purple-600 rounded">
                            {currentPage}
                        </span>

                        <button
                            type="button"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                        >
                            Siguiente
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                        >
                            Último
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
