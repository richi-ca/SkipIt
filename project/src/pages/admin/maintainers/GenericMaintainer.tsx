import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { baseFetch } from '../../../services/api';

// jQuery & DataTables
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-dt/css/dataTables.dataTables.css';

export default function GenericMaintainer({
    title,
    itemTitle,
    endpoint,
    columns,
    fields,
    processData,
    tableOptions,
    renderForm
}: {
    title: string,
    itemTitle?: string,
    endpoint: string,
    columns: { key: string, label: string, type?: string, visible?: boolean }[],
    fields: { key: string, label: string, type: string, required?: boolean, options?: { value: any, label: string }[] }[],
    processData?: (data: any[]) => any[],
    tableOptions?: any,
    renderForm?: (props: { item: any, onSubmit: (e: React.FormEvent<HTMLFormElement>) => void, onCancel: () => void }) => React.ReactNode
}) {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any | null>(null);

    // Referencia a la tabla
    const tableRef = useRef<HTMLTableElement>(null);
    const dataTableRef = useRef<DataTables.Api | null>(null);

    // Estado para filtrar por fechas (default hoy +- 3 meses)
    const [dateStart, setDateStart] = useState(() => {
        const d = new Date(); d.setFullYear(d.getFullYear() - 2); return d.toISOString().split('T')[0];
    });
    const [dateEnd, setDateEnd] = useState(() => {
        const d = new Date(); d.setFullYear(d.getFullYear() + 2); return d.toISOString().split('T')[0];
    });

    // Cargar datos
    const fetchItems = async () => {
        try {
            setLoading(true);
            const data = await baseFetch<any[]>(endpoint);
            const processed = processData ? processData(data) : data;
            setItems(processed);
        } catch (error) {
            console.error(error);
            toast.error('Error al cargar datos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, [endpoint]);

    // Calcular data filtrada
    const filteredItems = React.useMemo(() => items.filter(item => {
        let matchesDate = true;
        if ('iso_date' in item) {
            const iso = (item as any).iso_date;
            matchesDate = iso >= dateStart && iso <= dateEnd;
        }
        return matchesDate;
    }), [items, dateStart, dateEnd]);

    // Inicializar / Actualizar DataTables
    useEffect(() => {
        if (!tableRef.current) return;

        // Si ya existe instancia, solo recargar datos
        if (dataTableRef.current) {
            dataTableRef.current.clear();
            dataTableRef.current.rows.add(filteredItems);
            dataTableRef.current.draw(false); // false = mantener paginación
            return;
        }

        // Definir columnas para DT
        const dtColumns: any[] = columns.map(col => ({
            data: col.key,
            title: col.label,
            visible: col.visible !== false,
            render: (data: any, _type: any, row: any) => {
                // Renderizado especial para booleanos (Toggle)
                if (col.type === 'boolean' || typeof data === 'boolean') {
                    const boolValue = Boolean(data);
                    const colorClass = boolValue
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : 'bg-gray-100 text-gray-600 border-gray-200';
                    const text = boolValue ? 'Sí' : 'No';
                    return `<button class="toggle-btn px-3 py-1 rounded-full text-xs font-bold border ${colorClass}" data-id="${row.id}" data-key="${col.key}">${text}</button>`;
                }
                return data || '-';
            }
        }));

        // Columna de Acciones
        dtColumns.push({
            data: null,
            title: 'Acciones',
            className: 'text-right',
            orderable: false,
            render: (_data: any, _type: any, row: any) => {
                const editIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;
                const trashIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`;

                return `
                    <div class="flex justify-end gap-3">
                        <button class="edit-btn text-blue-600 hover:text-blue-900" data-id="${row.id}">${editIcon}</button>
                        <button class="delete-btn text-red-600 hover:text-red-900" data-id="${row.id}">${trashIcon}</button>
                    </div>
                `;
            }
        });

        // Init DataTable
        const dt = $(tableRef.current).DataTable({
            data: filteredItems,
            columns: dtColumns,
            stateSave: true,
            language: {
                processing: "Procesando...",
                search: "Buscar:",
                lengthMenu: "Mostrar _MENU_ registros",
                info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
                infoEmpty: "Mostrando 0 a 0 de 0 registros",
                infoFiltered: "(filtrado de _MAX_ registros totales)",
                loadingRecords: "Cargando...",
                zeroRecords: "No se encontraron resultados",
                emptyTable: "Ningún dato disponible en esta tabla",
                paginate: {
                    first: "Primero",
                    previous: "Anterior",
                    next: "Siguiente",
                    last: "Último"
                },
                aria: {
                    sortAscending: ": Activar para ordenar la columna de manera ascendente",
                    sortDescending: ": Activar para ordenar la columna de manera descendente"
                }
            },
            createdRow: (row, _data, _dataIndex) => {
                $(row).addClass('hover:bg-gray-50');
            },
            destroy: true,
            ...tableOptions
        });

        dataTableRef.current = dt;

        // Event Listeners Delegados (jQuery)
        $(tableRef.current).on('click', '.edit-btn', function () {
            const tr = $(this).closest('tr');
            // DataTables puede manejar responsive rows (child rows). Usar API para asegurar data correcta.
            // Si hay row grouping, 'tr' puede ser el group header? No, el selector .edit-btn no está ahi.
            const rowData = dt.row(tr).data();
            if (rowData) {
                setEditingItem(rowData);
                setIsModalOpen(true);
            }
        });

        $(tableRef.current).on('click', '.delete-btn', function () {
            const tr = $(this).closest('tr');
            const rowData = dt.row(tr).data() as any;
            if (rowData) handleDelete(rowData.id);
        });

        $(tableRef.current).on('click', '.toggle-btn', function () {
            const tr = $(this).closest('tr');
            const rowData = dt.row(tr).data();
            const key = $(this).data('key');
            if (rowData && key) handleToggle(rowData, key);
        });

        return () => {
            if (dataTableRef.current) {
                dataTableRef.current.destroy();
                dataTableRef.current = null;
            }
        };
    }, [filteredItems]);

    // Guardar (Crear o Editar)
    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data: any = Object.fromEntries(formData.entries());

        // Manejo robusto de Checkboxes (incluyendo los de renderForm personalizado)
        // Itera sobre los elementos reales del formulario para capturar el estado checked/unchecked
        const form = e.currentTarget;
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach((checkbox: any) => {
            if (checkbox.name) {
                data[checkbox.name] = checkbox.checked;
            }
        });


        try {
            if (editingItem) {
                await baseFetch(`${endpoint}/${editingItem.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(data)
                });
                toast.success('Actualizado correctamente');
            } else {
                await baseFetch(endpoint, {
                    method: 'POST',
                    body: JSON.stringify(data)
                });
                toast.success('Creado correctamente');
            }
            setIsModalOpen(false);
            setEditingItem(null);
            fetchItems();
        } catch (error: any) {
            toast.error(error.message || 'Error al guardar');
        }
    };

    // Eliminar
    const handleDelete = async (id: string | number) => {
        if (!confirm('¿Estás seguro de eliminar este ítem?')) return;
        try {
            await baseFetch(`${endpoint}/${id}`, { method: 'DELETE' });
            toast.success('Eliminado correctamente');
            fetchItems();
        } catch (error) {
            toast.error('Error al eliminar');
        }
    };

    // Toggle
    const handleToggle = async (item: any, key: string) => {
        const newValue = !item[key];
        const updatedItem = { ...item, [key]: newValue };
        setItems(prev => prev.map(i => i.id === item.id ? updatedItem : i));

        try {
            const cleanEndpoint = endpoint.endsWith('/') ? endpoint.slice(0, -1) : endpoint;
            await baseFetch(`${cleanEndpoint}/${item.id}`, {
                method: 'PUT',
                body: JSON.stringify(updatedItem)
            });
            toast.success('Actualizado');
        } catch (error) {
            console.error(error);
            toast.error('Error al actualizar');
            setItems(prev => prev.map(i => i.id === item.id ? item : i));
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                <button
                    onClick={() => { setEditingItem(null); setIsModalOpen(true); }}
                    className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                >
                    <Plus size={20} />
                    <span>Nuevo</span>
                </button>
            </div>

            {/* Filtros */}
            <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-wrap gap-4 items-center">
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-800 font-medium">Ver eventos válidos desde</span>
                    <input
                        type="date"
                        className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                        value={dateStart}
                        onChange={(e) => setDateStart(e.target.value)}
                    />
                    <span className="text-sm text-gray-500 font-medium ml-2">Hasta:</span>
                    <input
                        type="date"
                        className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                        value={dateEnd}
                        onChange={(e) => setDateEnd(e.target.value)}
                    />
                </div>
            </div>

            {/* Tabla DataTables */}
            <div className="bg-white rounded-xl shadow p-4 overflow-hidden relative min-h-[400px]">
                {loading && (
                    <div className="absolute inset-0 bg-white/80 z-10 flex justify-center items-center backdrop-blur-sm">
                        <Loader className="animate-spin text-purple-600" size={32} />
                        <span className="ml-3 text-gray-500 font-medium">Cargando datos...</span>
                    </div>
                )}
                <div className="dt-container">
                    <table ref={tableRef} className="display w-full text-sm">
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6 relative">
                        {renderForm ? (
                            renderForm({
                                item: editingItem,
                                onSubmit: handleSave,
                                onCancel: () => setIsModalOpen(false)
                            })
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold">{editingItem ? 'Editar' : 'Crear'} {itemTitle || title}</h2>
                                    <button onClick={() => setIsModalOpen(false)}><X size={24} className="text-gray-400 hover:text-gray-600" /></button>
                                </div>
                                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {editingItem && <input type="hidden" name="id" value={editingItem.id} />}
                                    {fields.map(field => (
                                        <div key={field.key} className={field.key === 'image_url' || field.key === 'description' || field.key === 'name' ? 'md:col-span-1' : ''}>
                                            {field.type !== 'checkbox' && (
                                                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                                            )}
                                            {field.type === 'checkbox' ? (
                                                <div className="flex items-center space-x-2 mt-6">
                                                    <input
                                                        type="checkbox"
                                                        name={field.key}
                                                        defaultChecked={editingItem ? !!editingItem[field.key] : false}
                                                        className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                                    />
                                                    <span className="text-sm text-gray-600">{field.label}</span>
                                                </div>
                                            ) : field.type === 'textarea' ? (
                                                <textarea
                                                    name={field.key}
                                                    required={field.required}
                                                    defaultValue={editingItem ? editingItem[field.key] : ''}
                                                    rows={3}
                                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                                                />
                                            ) : field.type === 'select' ? (
                                                <select
                                                    name={field.key}
                                                    required={field.required}
                                                    defaultValue={editingItem ? editingItem[field.key] : ''}
                                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none bg-white"
                                                >
                                                    <option value="">Seleccione una opción</option>
                                                    {field.options?.map(opt => (
                                                        <option key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type={field.type}
                                                    name={field.key}
                                                    required={field.required}
                                                    defaultValue={editingItem ? editingItem[field.key] : ''}
                                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                                />
                                            )}
                                        </div>
                                    ))}
                                    <div className="flex justify-end space-x-3 mt-6 col-span-1 md:col-span-2">
                                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                                        <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center">
                                            <span>Guardar</span>
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
