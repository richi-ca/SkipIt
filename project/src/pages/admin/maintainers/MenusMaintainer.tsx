import { useState, useEffect } from 'react';
import GenericMaintainer from './GenericMaintainer';
import { baseFetch } from '../../../services/api';
import { Trash2, ArrowUp, ArrowDown, Search, X, ChevronDown, Check } from 'lucide-react';
import toast from 'react-hot-toast';

// Helper for displaying currency
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
};

const MenuForm = ({ item, onSubmit, onCancel }: { item: any, onSubmit: (e: React.FormEvent<HTMLFormElement>) => void, onCancel: () => void }) => {
    const [events, setEvents] = useState<any[]>([]);
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [menuProducts, setMenuProducts] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [productsSearchTerm, setProductsSearchTerm] = useState('');
    const [isProductListOpen, setIsProductListOpen] = useState(false);

    // Event Search State
    const [eventSearchTerm, setEventSearchTerm] = useState('');
    const [isEventSearchOpen, setIsEventSearchOpen] = useState(false);
    const [selectedEventName, setSelectedEventName] = useState('');

    // Pagination for the products table
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Initial load
    useEffect(() => {
        // Load Events
        baseFetch('/catalog/events').then((res: any) => {
            if (Array.isArray(res)) setEvents(res);
        }).catch(err => console.error("Error loading events", err));

        // Load All Products
        baseFetch('/catalog/products').then((res: any) => setAllProducts(res)).catch(console.error);

        // If editing
        if (item && item.id) {
            baseFetch(`/catalog/menus/${item.id}`).then((res: any) => {
                if (res) {
                    if (res.products) setMenuProducts(res.products);
                    if (res.event_name) {
                        setSelectedEventName(res.event_name);
                        setEventSearchTerm(res.event_name);
                    }
                }
            }).catch(console.error);
        } else {
            // New item
            setEventSearchTerm('');
            setSelectedEventName('');
        }
    }, [item]);

    // Handle adding product
    const handleAddProduct = async (product: any) => {
        if (!item || !item.id) {
            toast.error("Guarda la carta primero antes de agregar productos");
            return;
        }

        try {
            const res = await baseFetch(`/catalog/menus/${item.id}/products`, {
                method: 'POST',
                body: JSON.stringify({ product_id: product.id })
            });

            setMenuProducts([...menuProducts, res]);
            setIsProductListOpen(false);
            setProductsSearchTerm('');
            toast.success("Producto agregado");
        } catch (error) {
            console.error(error);
            toast.error("Error al agregar producto");
        }
    };

    // Handle removing product
    const handleRemoveProduct = async (mpId: number) => {
        if (!confirm("¿Eliminar producto de la carta?")) return;
        try {
            await baseFetch(`/catalog/menu-products/${mpId}`, { method: 'DELETE' });
            setMenuProducts(menuProducts.filter(mp => mp.id !== mpId));
            toast.success("Producto eliminado");
        } catch (error) {
            toast.error("Error al eliminar");
        }
    };

    // Handle updates (price, active)
    const handleUpdateProduct = async (mpId: number, data: any) => {
        try {
            const res = await baseFetch(`/catalog/menu-products/${mpId}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
            setMenuProducts(menuProducts.map(mp => mp.id === mpId ? { ...mp, ...res } : mp));
            // toast.success("Actualizado"); // Too noisy for quick edits
        } catch (error) {
            toast.error("Error al actualizar");
        }
    };

    // Handle Reorder Product
    const handleReorderProduct = async (mpId: number, direction: 'up' | 'down') => {
        const mpIndex = menuProducts.findIndex(p => p.id === mpId);
        if (mpIndex === -1) return;
        const mp = menuProducts[mpIndex];
        const category = mp.category_name;

        // items in this category
        const itemsByCategory = menuProducts
            .filter(p => p.category_name === category)
            .sort((a, b) => a.product_display_order - b.product_display_order);

        const indexInCategory = itemsByCategory.findIndex(p => p.id === mpId);

        if (direction === 'up' && indexInCategory > 0) {
            const prevItem = itemsByCategory[indexInCategory - 1];
            // Swap product_display_order
            const temp = prevItem.product_display_order;
            prevItem.product_display_order = mp.product_display_order;
            mp.product_display_order = temp;

            updateLocalAndBackend([mp, prevItem]);

        } else if (direction === 'down' && indexInCategory < itemsByCategory.length - 1) {
            const nextItem = itemsByCategory[indexInCategory + 1];
            const temp = nextItem.product_display_order;
            nextItem.product_display_order = mp.product_display_order;
            mp.product_display_order = temp;

            updateLocalAndBackend([mp, nextItem]);
        }
    };

    // Handle Reorder Category
    const handleReorderCategory = async (categoryName: string, direction: 'up' | 'down') => {
        // 1. Identify distinct categories and their current order (based on the first item found)
        const categoriesOrder: { name: string, order: number }[] = [];
        const seen = new Set();

        // Ensure menuProducts is sorted by cat order first
        const sortedProds = [...menuProducts].sort((a, b) => a.category_display_order - b.category_display_order);

        sortedProds.forEach(p => {
            if (!seen.has(p.category_name)) {
                seen.add(p.category_name);
                categoriesOrder.push({ name: p.category_name, order: p.category_display_order });
            }
        });

        const catIndex = categoriesOrder.findIndex(c => c.name === categoryName);
        if (catIndex === -1) return;

        let targetCatName = '';
        let currentCatObj = categoriesOrder[catIndex];
        let targetCatObj: any = null;

        if (direction === 'up' && catIndex > 0) {
            targetCatObj = categoriesOrder[catIndex - 1];
        } else if (direction === 'down' && catIndex < categoriesOrder.length - 1) {
            targetCatObj = categoriesOrder[catIndex + 1];
        }

        if (!targetCatObj) return;

        // Swap orders value
        const temp = targetCatObj.order;
        targetCatObj.order = currentCatObj.order;
        currentCatObj.order = temp;

        // Update ALL products belonging to these two categories
        const updates: any[] = [];
        const newMenuProducts = menuProducts.map(p => {
            if (p.category_name === currentCatObj.name) {
                const updated = { ...p, category_display_order: currentCatObj.order };
                updates.push(updated);
                return updated;
            }
            if (p.category_name === targetCatObj.name) {
                const updated = { ...p, category_display_order: targetCatObj.order };
                updates.push(updated);
                return updated;
            }
            return p;
        });

        setMenuProducts(newMenuProducts);

        // Send batch update
        // We only need to send { id, category_display_order }
        const payload = updates.map(u => ({ id: u.id, category_display_order: u.category_display_order }));

        try {
            await baseFetch(`/catalog/menus/${item.id}/reorder`, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            // toast.success("Categorías reordenadas");
        } catch (e) {
            console.error(e);
            toast.error("Error al reordenar categorías");
        }
    };

    const updateLocalAndBackend = async (modifiedItems: any[]) => {
        const newMenuProducts = menuProducts.map(p => {
            const mod = modifiedItems.find(m => m.id === p.id);
            return mod ? mod : p;
        });
        setMenuProducts(newMenuProducts);

        const payload = modifiedItems.map(m => ({
            id: m.id,
            product_display_order: m.product_display_order
        }));

        try {
            await baseFetch(`/catalog/menus/${item.id}/reorder`, {
                method: 'POST',
                body: JSON.stringify(payload)
            });
        } catch (e) {
            console.error(e);
            toast.error("Error al reordenar productos");
        }
    }


    // Helper: Group items by category and sort
    const getGroupedProducts = () => {
        // Use searchTerm to filter
        const filtered = menuProducts.filter(mp =>
            mp.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mp.category_name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Group
        const grouped: Record<string, any[]> = {};
        const catOrders: Record<string, number> = {};

        filtered.forEach(mp => {
            const cat = mp.category_name;
            if (!grouped[cat]) {
                grouped[cat] = [];
                catOrders[cat] = mp.category_display_order;
            }
            grouped[cat].push(mp);
        });

        // Sort items inside groups by product_display_order
        Object.keys(grouped).forEach(cat => {
            grouped[cat].sort((a, b) => a.product_display_order - b.product_display_order);
        });

        // Return sorted categories (keys)
        const sortedKeys = Object.keys(grouped).sort((a, b) => catOrders[a] - catOrders[b]);

        return sortedKeys.map(cat => ({
            category: cat,
            items: grouped[cat]
        }));
    };

    const groupedData = getGroupedProducts();

    // Pagination Logic.
    const flattenForPagination = () => {
        const flat: any[] = [];
        groupedData.forEach((group, groupIdx) => {
            // Include rendering info for Header arrows
            flat.push({
                type: 'header',
                key: group.category,
                label: group.category.toUpperCase(),
                isFirst: groupIdx === 0,
                isLast: groupIdx === groupedData.length - 1
            });
            group.items.forEach((item, idx) => {
                flat.push({ type: 'item', data: item, visualIndex: idx + 1 });
            });
        });
        return flat;
    };

    const flatList = flattenForPagination();
    // Filter out headers from count
    const itemRows = flatList.filter(x => x.type === 'item');
    const totalItems = itemRows.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Get visible items for current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = itemRows.slice(startIndex, endIndex);

    // Reconstruct list with headers for the current page items
    // Since reordering categories is global, we need global context or just render the headers again locally.
    const visibleList: any[] = [];
    let lastCat = '';

    // We need to find the correct header properties (isFirst, isLast) for the categories appearing here.
    // Simplifying: we'll re-find the header info from flattenForPagination.

    currentItems.forEach(row => {
        const catName = row.data.category_name;
        if (catName !== lastCat) {
            lastCat = catName;
            // Find header info
            const headerInfo = flatList.find(x => x.type === 'header' && x.key === catName);
            if (headerInfo) visibleList.push(headerInfo);
        }
        visibleList.push(row);
    });

    // Event filtering
    const filteredEvents = events.filter(e => e.name.toLowerCase().includes(eventSearchTerm.toLowerCase()));

    // Available products filter
    const availableProducts = allProducts.filter(p => !menuProducts.some(mp => mp.product_id === p.id) && p.name.toLowerCase().includes(productsSearchTerm.toLowerCase()));

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(e); }} className="p-6 space-y-6 max-h-[90vh] overflow-y-auto w-full bg-white rounded-xl">
            {item && <input type="hidden" name="id" value={item.id} />}

            <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-xl font-bold text-gray-800">{item ? 'Editar Carta' : 'Crear Nueva Carta'}</h2>
                <button type="button" onClick={onCancel} className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={24} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Carta</label>
                    <input
                        name="name"
                        defaultValue={item?.name}
                        required
                        className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50"
                        placeholder="Ej: Carta Lollapalooza 2026"
                    />
                </div>
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Evento Asociado</label>
                    <div className="relative">
                        <input
                            type="text"
                            className="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-purple-500 bg-white pr-10"
                            placeholder="-- Seleccionar Evento --"
                            value={eventSearchTerm}
                            onChange={(e) => {
                                setEventSearchTerm(e.target.value);
                                setIsEventSearchOpen(true);
                                // Clear selection if typing
                                // if (e.target.value !== selectedEventName) setSelectedEventName(''); 
                                // Actually better to just search.
                            }}
                            onFocus={() => setIsEventSearchOpen(true)}
                            onBlur={() => setTimeout(() => setIsEventSearchOpen(false), 200)} // Delay to allow click
                        />
                        <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={18} />

                        {/* Hidden input for form submission */}
                        <input type="hidden" name="event_id" value={events.find(e => e.name === selectedEventName)?.id || item?.event_id || ''} />

                        {isEventSearchOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                                {filteredEvents.length > 0 ? (
                                    filteredEvents.map(ev => (
                                        <div
                                            key={ev.id}
                                            className="px-4 py-2 hover:bg-purple-50 cursor-pointer text-sm text-gray-700"
                                            onMouseDown={() => {
                                                setEventSearchTerm(ev.name);
                                                setSelectedEventName(ev.name);
                                                setIsEventSearchOpen(false);
                                            }}
                                        >
                                            {ev.name}
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-2 text-sm text-gray-500">No se encontraron eventos</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Separator */}
            <hr className="border-gray-200" />

            {/* Products Section */}
            {!item ? (
                <div className="text-center p-8 bg-gray-50 rounded border border-dashed text-gray-500">
                    Guarda la carta básica primero para agregar productos.
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800">Productos en Carta ({menuProducts.length})</h3>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsProductListOpen(!isProductListOpen)}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition"
                            >
                                <span className="text-lg">+</span> Agregar Producto
                            </button>

                            {isProductListOpen && (
                                <div className="absolute right-0 top-full mt-2 w-72 bg-white border shadow-xl rounded-lg z-50 p-3">
                                    <div className="flex items-center gap-2 border rounded-lg px-2 py-1.5 mb-2 bg-gray-50">
                                        <Search size={16} className="text-gray-400" />
                                        <input
                                            autoFocus
                                            className="w-full bg-transparent outline-none text-sm"
                                            placeholder="Buscar producto..."
                                            value={productsSearchTerm}
                                            onChange={(e) => setProductsSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <div className="max-h-60 overflow-y-auto">
                                        {availableProducts.length === 0 ? (
                                            <p className="text-xs text-gray-500 p-2 text-center">No encontrado</p>
                                        ) : (
                                            availableProducts.map(p => (
                                                <div
                                                    key={p.id}
                                                    onClick={() => handleAddProduct(p)}
                                                    className="p-2 hover:bg-purple-50 cursor-pointer text-sm flex items-center justify-between group rounded"
                                                >
                                                    <span>{p.name}</span>
                                                    <span className="text-xs text-gray-400 group-hover:text-purple-600 transition-colors">Agregar</span>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Custom DataTables-like Table */}
                    <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
                        {/* Table Controls */}
                        <div className="p-3 border-b flex justify-between items-center bg-white text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                                <span>Mostrar</span>
                                <select
                                    className="border rounded p-1 outline-none focus:ring-1 focus:ring-purple-500"
                                    value={itemsPerPage}
                                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                                <span>registros</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-600">Buscar:</span>
                                <input
                                    type="text"
                                    className="border rounded px-2 py-1 outline-none focus:ring-1 focus:ring-purple-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <div className="col-span-1">ID</div>
                            <div className="col-span-4">Nombre</div>
                            <div className="col-span-2">Precio</div>
                            <div className="col-span-2">Activo</div>
                            <div className="col-span-3 text-right">Acciones</div>
                        </div>

                        {/* Table Body */}
                        <div className="divide-y divide-gray-100">
                            {visibleList.length === 0 ? (
                                <div className="p-8 text-center text-gray-400 text-sm">No se encontraron datos</div>
                            ) : (
                                visibleList.map((row) => {
                                    if (row.type === 'header') {
                                        return (
                                            <div key={`header-${row.key}`} className="px-6 py-2 bg-gray-100 flex justify-between items-center group">
                                                <span className="font-bold text-xs text-gray-700 uppercase tracking-wide">{row.label}</span>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        type="button"
                                                        disabled={row.isFirst}
                                                        onClick={() => handleReorderCategory(row.key, 'up')}
                                                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                                    >
                                                        <ArrowUp size={14} className="text-gray-600" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={row.isLast}
                                                        onClick={() => handleReorderCategory(row.key, 'down')}
                                                        className="p-1 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                                    >
                                                        <ArrowDown size={14} className="text-gray-600" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    }

                                    const mp = row.data;
                                    return (
                                        <div key={mp.id} className="grid grid-cols-12 gap-4 px-6 py-3 items-center hover:bg-purple-50 transition-colors text-sm text-gray-700">
                                            <div className="col-span-1 font-mono text-gray-500">{row.visualIndex}</div>
                                            <div className="col-span-4 font-medium text-gray-900">{mp.product_name}</div>
                                            <div className="col-span-2">
                                                <div className="flex items-center">
                                                    <span className="mr-1 text-gray-400">$</span>
                                                    <input
                                                        type="number"
                                                        className="w-20 border rounded px-1 py-0.5 text-right outline-none focus:ring-1 focus:ring-purple-500"
                                                        defaultValue={mp.price}
                                                        onBlur={(e) => handleUpdateProduct(mp.id, { price: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-span-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleUpdateProduct(mp.id, { active: !mp.active })}
                                                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${mp.active ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}
                                                >
                                                    {mp.active ? 'SÍ' : 'NO'}
                                                </button>
                                            </div>
                                            <div className="col-span-3 flex justify-end items-center gap-2">
                                                <button type="button" onClick={() => handleRemoveProduct(mp.id)} className="p-1 text-red-500 hover:bg-red-50 rounded-md transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                                <div className="flex flex-col gap-0.5">
                                                    <button type="button" onClick={() => handleReorderProduct(mp.id, 'up')} className="text-gray-400 hover:text-purple-600"><ArrowUp size={14} /></button>
                                                    <button type="button" onClick={() => handleReorderProduct(mp.id, 'down')} className="text-gray-400 hover:text-purple-600"><ArrowDown size={14} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Pagination Footer */}
                        <div className="flex justify-between items-center px-6 py-3 border-t bg-gray-50 text-sm text-gray-600">
                            <div>
                                Mostrando {startIndex + 1} a {Math.min(endIndex, totalItems)} de {totalItems} registros
                            </div>
                            <div className="flex gap-1">
                                <button
                                    type="button"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
                                >
                                    Anterior
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setCurrentPage(p)}
                                        className={`px-3 py-1 border rounded ${p === currentPage ? 'bg-purple-600 text-white border-purple-600' : 'bg-white hover:bg-gray-100'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    className="px-3 py-1 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
                <button type="button" onClick={onCancel} className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition-colors">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium transition-colors shadow-sm">Guardar Carta</button>
            </div>
        </form>
    );
};

export default function MenusMaintainer() {
    return (
        <GenericMaintainer
            title="Gestor de Cartas por Evento"
            itemTitle="Carta"
            endpoint="/catalog/menus"
            columns={[
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Nombre' },
                { key: 'event_name', label: 'Evento Asociado', render: (row: any) => row.event_name ? `<span class="font-medium text-gray-800">${row.event_name}</span>` : '<span class="text-gray-400 italic">Sin evento</span>' },
                {
                    key: 'products_count',
                    label: 'Productos',
                    render: (row: any) => {
                        const count = row.products_count || 0;
                        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">${count} items</span>`;
                    }
                }
            ]}
            fields={[]}
            renderForm={(props) => <MenuForm {...props} />}
            customRowActions={(row) => (
                <div />
            )}
            tableOptions={{
                order: [[0, 'desc']]
            }}
        />
    );
}
