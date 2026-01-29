import { useState, useEffect } from 'react';
import GenericMaintainer from './GenericMaintainer';
import { baseFetch } from '../../../services/api';
import ImageSelectorModal from '../../../components/admin/ImageSelectorModal';
import { Upload, X, ImageOff } from 'lucide-react';
import SecureImage from '../../../components/SecureImage';
import $ from 'jquery';

// Componente de formulario personalizado para Productos
const ProductForm = ({ item, onSubmit, onCancel, categories }: { item: any, onSubmit: (e: React.FormEvent<HTMLFormElement>) => void, onCancel: () => void, categories: any[] }) => {
    const [showImageSelector, setShowImageSelector] = useState(false);
    const [imageUrl, setImageUrl] = useState(item?.image_url || '');
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        setImgError(false);
    }, [imageUrl]);

    const MEDIA_BASE = `${import.meta.env.VITE_MEDIA_URL}/products/`;

    const getPreviewUrl = (val?: string) => {
        if (!val) return null;
        if (val.startsWith('http') || val.startsWith('data:')) return val;
        return `${MEDIA_BASE}${val}`;
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(e);
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6 pl-2">
                <h2 className="text-xl font-bold text-gray-800">{item ? 'Editar Producto' : 'Crear Producto'}</h2>
                <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                    <X size={24} />
                </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-2">
                {item && <input type="hidden" name="id" value={item.id} />}

                <div className="space-y-6">
                    {/* Fila 1: Nombre y Categoría */}
                    {/* Fila 1: Nombre y Precio */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-8">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Producto</label>
                            <input
                                name="name"
                                type="text"
                                defaultValue={item?.name}
                                required
                                className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div className="md:col-span-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Precio</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-gray-500">$</span>
                                <input
                                    name="price"
                                    type="number"
                                    defaultValue={item?.price}
                                    className="w-full border rounded-lg pl-7 pr-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Fila 2: Categoría */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Categoría</label>
                        <select
                            name="category_id"
                            defaultValue={item?.category_id || ''}
                            required
                            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                        >
                            <option value="" disabled>Seleccione una categoría</option>
                            {categories.map(cat => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Fila 2: Descripción */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción</label>
                        <textarea
                            name="description"
                            defaultValue={item?.description}
                            rows={3}
                            className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        />
                    </div>

                    {/* Fila 3 y 4: Imagen */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">URL Imagen</label>
                        <input
                            type="text"
                            name="image_url"
                            value={imageUrl}
                            onChange={e => setImageUrl(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2 text-sm font-mono text-gray-600 mb-3 outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="Ej: cerveza-lager.jpg"
                        />

                        <div className="flex gap-4 items-start">
                            <div className="w-[300px] h-[300px] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative group">
                                {imageUrl && !imgError ? (
                                    <SecureImage
                                        src={getPreviewUrl(imageUrl) || ''}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                        onError={() => setImgError(true)}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center w-full h-full text-gray-400 text-sm">
                                        <div className="mb-2 bg-gray-200 rounded-full p-3">
                                            {imageUrl ? <ImageOff size={24} className="text-gray-400 stroke-2" /> : <Upload size={24} className="text-gray-400" />}
                                        </div>
                                        <span className="text-center px-4">{imageUrl ? `No se pudo cargar: ${imageUrl}` : 'Sin imagen seleccionada'}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-2 shrink-0">
                                <button type="button" onClick={() => setShowImageSelector(true)} className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-50 flex items-center justify-center bg-white">
                                    Seleccionar / Subir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
                    <button type="button" onClick={onCancel} className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition">Cancelar</button>
                    <button type="submit" className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition shadow-lg shadow-purple-200">
                        Guardar
                    </button>
                </div>

                {showImageSelector && (
                    <ImageSelectorModal
                        currentValue={imageUrl}
                        onSelect={(val) => setImageUrl(val)}
                        onClose={() => setShowImageSelector(false)}
                        folder="products"
                    />
                )}
            </form>
        </>
    );
};

export default function ProductsMaintainer() {
    const [categories, setCategories] = useState<{ value: any, label: string }[]>([]);

    useEffect(() => {
        baseFetch<any[]>('/catalog/categories')
            .then(data => {
                setCategories(data.map(c => ({ value: c.id, label: c.name })));
            })
            .catch(console.error);
    }, []);

    // Esperar a que carguen las categorías para poder mapear los nombres correctamente
    if (categories.length === 0) {
        return <div className="p-8 text-center text-gray-500">Cargando configuración...</div>;
    }

    return (
        <GenericMaintainer
            title="Mantenedor de Productos"
            itemTitle="Producto"
            endpoint="/catalog/products"
            columns={[
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Nombre' },
                { key: 'category_name', label: 'Categoría', visible: false }, // Columna oculta para agrupación
                { key: 'description', label: 'Descripción' }
            ]}
            fields={[]} // Se usa renderForm
            renderForm={(props) => <ProductForm {...props} categories={categories} />}
            processData={(data) => {
                return data.map(item => {
                    const cat = categories.find(c => c.value === item.category_id);
                    return {
                        ...item,
                        category_name: cat ? cat.label : `Cat ID: ${item.category_id}`
                    };
                });
            }}
            tableOptions={{
                order: [[2, 'asc']], // Ordenar por 'category_name' (índice 2)
                drawCallback: function (this: any, _settings: any) {
                    const api = this.api();
                    const rows = api.rows({ page: 'current' }).nodes();
                    const groupColumnIndex = 2; // 'category_name'
                    let last: string | null = null;

                    api.column(groupColumnIndex, { page: 'current' })
                        .data()
                        .each(function (group: string, i: number) {
                            if (last !== group) {
                                $(rows).eq(i).before(
                                    '<tr class="group bg-gray-200 text-gray-700 font-bold uppercase text-xs cursor-default select-none"><td colspan="3" class="px-6 py-2">' +
                                    group +
                                    '</td></tr>'
                                );
                                last = group;
                            }
                        });
                }
            }}
        />
    );
}
