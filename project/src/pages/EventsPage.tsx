import React, { useState, useEffect } from 'react';
import { Search, Calendar, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Event } from '../data/mockData';
import { catalogService } from '../services/catalogService';
import { baseFetch } from '../services/api';
import { useNavigate } from 'react-router-dom';

// Interface matching Backend Response (snake_case)
interface BackendEvent {
  id: number;
  name: string;
  iso_date: string;
  start_time: string;
  end_time: string;
  location: string;
  image_url: string;
  rating: number;
  type: string;
  is_featured: boolean;
  carousel_order?: number;
  menu_id?: number;
  overlay_title?: string;
  valid_from?: string;
  valid_until?: string;
}

export default function EventsPage({ onSelectEvent }: { onSelectEvent: (event: any) => void }) {
  const navigate = useNavigate();
  const [events, setEvents] = useState<BackendEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Filters
  const [timeFilter, setTimeFilter] = useState('year'); // year, week, day
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [typeFilter, setTypeFilter] = useState('featured'); // featured, normal, all

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  useEffect(() => {
    fetchEvents();
  }, [timeFilter, dateFrom, dateTo, typeFilter]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Construct query params
      const params = new URLSearchParams();
      params.append('public', 'true'); // Always public events

      if (dateFrom) params.append('date_from', dateFrom);
      if (dateTo) params.append('date_to', dateTo);

      if (!dateFrom && !dateTo) {
        params.append('time_filter', timeFilter);
      }

      if (typeFilter !== 'all') {
        params.append('filter_type', typeFilter);
      }

      // Using baseFetch to hit our updated endpoint
      // Endpoint structure matches: GET /api/catalog/events?params...
      // Note: catalogService might need updating, or use baseFetch directly.
      // Using baseFetch for direct control over new params on /catalog/events
      const data = await baseFetch<BackendEvent[]>(`/catalog/events?${params.toString()}`);
      setEvents(data);
      setCurrentPage(1); // Reset to page 1 on filter change
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  // Client-side search filtering (by name) as requested "buscar por:" often implies text, 
  // but the prompt specified filters. However, "buscar evento" usually implies text search too.
  // The prompt says "buscar por: Eventos del año...". So 'search' might just mean filter.
  // But let's keep name filtering client-side for "search box" if we had one.
  // The prompt didn't strictly ask for a text search box *inside* the filter logic, 
  // but standard "Events page" usually has one. I'll stick to the requested filters largely.

  const filteredEvents = events.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage);

  const handleEventClick = (event: Event) => {
    // Navigate home with scrollTo logic, or select event directly?
    // "buscar evento" link opens this page. 
    // "Debe parecerse a la galeria... con paginador".
    // If I click, presumably I want to "precompra tus tragos".
    // The main page handles this via `onSelectEvent` which opens the modal/drawer.
    // So we can re-use that.
    onSelectEvent(event);
    // And maybe navigate back to home? Or stay here?
    // Usually "prebuy" might happen in a modal. 
    // If the `onSelectEvent` trigger a modal, staying here is fine.
  };

  // Helper to get image URL (handling relative paths)
  const getImageUrl = (url?: string) => {
    if (!url) return 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80';
    if (url.startsWith('http')) return url;
    return `http://localhost:5000/media/${url}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Eventos</h1>
            <p className="text-gray-600 mt-1">Explora nuestros próximos eventos</p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Time Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Período</label>
            <select
              value={timeFilter}
              onChange={(e) => {
                setTimeFilter(e.target.value);
                // Clear distinct dates if period is selected? 
                // User logic: "aparecen vacíos ... hasta que el usuario use estas cajas".
                // If user picks period, dates should probably clear to avoid confusion, 
                // or dates override. Let's clear dates to be safe/clear.
                setDateFrom('');
                setDateTo('');
              }}
              className="w-full border-gray-200 rounded-lg text-sm focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="year">Eventos del Año</option>
              <option value="week">Eventos de la Semana</option>
              <option value="day">Eventos del Día</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Desde</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full border-gray-200 rounded-lg text-sm focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Hasta</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full border-gray-200 rounded-lg text-sm focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Tipo de Evento</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full border-gray-200 rounded-lg text-sm focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="featured">Eventos Destacados</option>
              <option value="normal">Eventos Normales</option>
              <option value="all">Todos</option>
            </select>
          </div>

          {/* Search Text (Optional but good) */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Buscar por nombre</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Nombre del evento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 border-gray-200 rounded-lg text-sm focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-gray-100">
            <Calendar size={48} className="mx-auto mb-4 opacity-20" />
            <p>No se encontraron eventos con estos filtros.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => handleEventClick(event)}
                className={`group bg-white rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${event.is_featured ? 'ring-4 ring-yellow-400 ring-offset-2' : 'border border-gray-100'}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                  <img
                    src={getImageUrl(event.image_url)}
                    alt={event.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {event.is_featured && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      Destacado
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-bold text-lg mb-1 leading-tight">{event.name}</h3>
                    <div className="flex items-center text-xs opacity-90">
                      <Calendar size={12} className="mr-1" />
                      {event.iso_date ? new Date(event.iso_date).toLocaleDateString() : 'Fecha por confirmar'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed text-gray-600 border border-transparent hover:border-gray-200 transition-all"
            >
              <ChevronLeft size={20} />
            </button>

            <span className="px-4 py-2 bg-white rounded-lg border border-gray-100 text-gray-700 font-medium shadow-sm">
              Página {currentPage} de {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed text-gray-600 border border-transparent hover:border-gray-200 transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
