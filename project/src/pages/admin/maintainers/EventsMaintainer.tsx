import GenericMaintainer from './GenericMaintainer';
import React, { useState, useEffect } from 'react';
import ImageSelectorModal from '../../../components/admin/ImageSelectorModal';
import { Loader, Upload, Plus, ImageOff } from 'lucide-react';
import SecureImage from '../../../components/SecureImage';
import $ from 'jquery';

// Componente separado para el formulario
const EventForm = ({ item, onSubmit, onCancel }: { item: any, onSubmit: (e: React.FormEvent<HTMLFormElement>) => void, onCancel: () => void }) => {
    const [showImageSelector, setShowImageSelector] = useState(false);
    // IMPORTANTE: Si la URL ya viene completa (http...), la usamos. Si es antigua (local assets), la mantenemos.
    const [imageUrl, setImageUrl] = useState(item?.image_url || '');
    const [imgError, setImgError] = useState(false);

    // Reset image error state when url changes
    useEffect(() => {
        setImgError(false);
    }, [imageUrl]);

    // Constante alineada con la nueva ruta de media
    const MEDIA_BASE = `${import.meta.env.VITE_MEDIA_URL}/events/`;

    const getPreviewUrl = (val?: string) => {
        if (!val) return null;
        if (val.startsWith('http')) return val; // Es link externo o ya completo
        // Si no empieza con http, asumimos que es un nombre de archivo en la carpeta media nueva
        return `${MEDIA_BASE}${val}`;
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(e);
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6 pl-2">
                <h2 className="text-xl font-bold text-gray-800">{item ? 'Editar Evento' : 'Crear Evento'}</h2>
                <button type="button" onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                    <Plus size={24} className="rotate-45" />
                </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-2">
                {item && <input type="hidden" name="id" value={item.id} />}

                <div className="space-y-6">
                    {/* Fila 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre del Evento</label>
                            <input name="name" type="text" defaultValue={item?.name} required className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500" placeholder="Ej: Summer Party" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Subtítulo</label>
                            <input name="overlay_title" type="text" defaultValue={item?.overlay_title} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500" placeholder="Frase promocional" />
                        </div>
                    </div>

                    {/* Fila 2 */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Ubicación</label>
                        <input name="location" type="text" defaultValue={item?.location} required className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500" placeholder="Lugar del evento" />
                    </div>

                    {/* Fila 3 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha</label>
                            <input name="iso_date" type="date" defaultValue={item?.iso_date || new Date().toISOString().split('T')[0]} required className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Hora Inicio</label>
                            <input name="start_time" type="time" defaultValue={item?.start_time?.substring(0, 5) || '20:00'} required className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500" step="60" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Hora Fin</label>
                            <input name="end_time" type="time" defaultValue={item?.end_time?.substring(0, 5) || '04:00'} required className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500" step="60" />
                        </div>
                    </div>

                    {/* Fila 4 Valid From/Until */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Mostrar Desde</label>
                            <input name="valid_from" type="date" defaultValue={item?.valid_from} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500 bg-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Mostrar Hasta</label>
                            <input name="valid_until" type="date" defaultValue={item?.valid_until} className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500 bg-white" />
                        </div>
                    </div>

                    {/* Fila 5 Checkboxes */}
                    <div className="flex gap-8">
                        <label className="flex items-center space-x-3 cursor-pointer select-none">
                            <input name="is_featured" type="checkbox" defaultChecked={!!item?.is_featured} className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
                            <span className="font-medium text-gray-700">Evento Destacado</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer select-none">
                            <input name="is_active" type="checkbox" defaultChecked={item ? !!item.is_active : true} className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                            <span className="font-medium text-gray-700">Evento Activo</span>
                        </label>
                    </div>

                    {/* Fila 6 Imagen */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">URL Imagen</label>
                        {/* Hidden actual input for standard form submit. Controlled by React state 'imageUrl' */}
                        <input type="text" name="image_url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm font-mono text-gray-600 mb-3 outline-none focus:ring-2 focus:ring-purple-500" placeholder="Ej: nombre-imagen.jpg" />

                        <div className="flex gap-4 items-start">
                            <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative group">
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
                        folder="events"
                    />
                )}
            </form>
        </>
    );
};

export default function EventsMaintainer() {
    return (
        <GenericMaintainer
            title="Mantenedor de Eventos"
            itemTitle="Evento"
            endpoint="/catalog/events"
            showDateFilter={true}
            columns={[
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Nombre' },
                // Hidden Month Year Column for Grouping
                { key: 'month_year_sort', label: 'Month Group', visible: false },
                { key: 'iso_date', label: 'Fecha' },
                { key: 'location', label: 'Ubicación' },
                { key: 'valid_from', label: 'Válido Desde' },
                { key: 'valid_until', label: 'Válido Hasta' },
                { key: 'is_featured', label: 'Destacado', type: 'boolean' },
                { key: 'is_active', label: 'Activo', type: 'boolean' }
            ]}
            fields={[]} // Not used because we provide renderForm
            renderForm={(props) => <EventForm {...props} />}
            processData={(data) => {
                // Add computed field for grouping
                return data.map(item => {
                    const date = new Date(item.iso_date || new Date());
                    const monthName = date.toLocaleString('es-CL', { month: 'long' });
                    const monthCap = monthName.charAt(0).toUpperCase() + monthName.slice(1);
                    const year = date.getFullYear();
                    return {
                        ...item,
                        month_year_sort: `${monthCap} ${year}` // unique enough for our groups
                    };
                });
            }}
            tableOptions={{
                order: [[3, 'asc']], // Order by 'iso_date'
                drawCallback: function (this: any, _settings: any) {
                    const api = this.api();
                    const rows = api.rows({ page: 'current' }).nodes();
                    const groupColumnIndex = 2; // 'month_year_sort'
                    let last: string | null = null;

                    api.column(groupColumnIndex, { page: 'current' })
                        .data()
                        .each(function (group: string, i: number) {
                            if (last !== group) {
                                $(rows).eq(i).before(
                                    '<tr class="group bg-gray-200 text-gray-700 font-bold uppercase text-xs cursor-default select-none"><td colspan="9" class="px-6 py-2">' +
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
