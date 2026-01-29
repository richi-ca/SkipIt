import { useState, useEffect } from 'react';
import { Search, Calendar, Filter, ChevronLeft, ChevronRight, X, MapPin, Clock } from 'lucide-react';
import { baseFetch } from '../services/api';


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
  is_active?: boolean;
}

import { Event } from '../data/mockData';

interface EventsPageProps {
  onSelectEvent?: (event: Event) => void;
}

export default function EventsPage({ onSelectEvent }: EventsPageProps) {

  const [events, setEvents] = useState<BackendEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados del filtro
  const [timeFilter, setTimeFilter] = useState('current'); // 'year', 'week', 'day', 'custom_range', 'all', 'current'
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'featured', 'normal', 'all'

  // Modal State
  const [selectedEventForPopup, setSelectedEventForPopup] = useState<BackendEvent | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Initial Fetch & Filter Change
  useEffect(() => {
    fetchEvents();
  }, [timeFilter, dateFrom, dateTo, typeFilter]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      // Siempre pedimos eventos públicos (que ahora filtran is_active=True + validez feha)
      params.append('public', 'true');

      // Lógica de Filtro de Tiempo
      if (timeFilter === 'custom_range') {
        if (dateFrom) params.append('date_from', dateFrom);
        if (dateTo) params.append('date_to', dateTo);
      } else if (timeFilter !== 'all' && timeFilter !== 'current') {
        // year, week, day
        params.append('time_filter', timeFilter);
      }
      // 'all' y 'current' no envían time_filter específico (backend retorna todo lo válido por defecto)
      // Si quisiéramos diferenciar 'all' (histórico) de 'current' (válido), necesitaríamos otro param en backend.
      // Por ahora ambos usan el filtro public base que es "Vigentes/Activos".

      // Lógica de Filtro de Tipo
      if (typeFilter !== 'all') {
        params.append('filter_type', typeFilter);
      }

      const data = await baseFetch<BackendEvent[]>(`/catalog/events?${params.toString()}`);
      setEvents(data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeFilterChange = (val: string) => {
    setTimeFilter(val);
    if (val !== 'custom_range') {
      setDateFrom('');
      setDateTo('');
    }
  };

  // Helper: Proximamente
  const isUpcoming = (dateStr?: string) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const now = new Date();
    // Reset hours to ignore time of day for "today" comparison
    now.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    // 30 days from now
    const limit = new Date(now);
    limit.setDate(limit.getDate() + 30);

    return date >= now && date <= limit;
  };

  // Helper: Image URL
  const getImageUrl = (url?: string) => {
    if (!url) return 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80';
    if (url.startsWith('http')) return url;
    return `${import.meta.env.VITE_MEDIA_URL}/${url}`;
  };

  // Filtration client-side (Search Text)
  const filteredEvents = events.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + itemsPerPage);

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return '';
    // timeStr is usually "HH:MM:SS"
    return timeStr.substring(0, 5);
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

          {/* Período */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Período</label>
            <select
              value={timeFilter}
              onChange={(e) => handleTimeFilterChange(e.target.value)}
              className="w-full border-gray-200 rounded-lg text-sm focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="current">Todos los eventos vigentes</option>
              <option value="year">Eventos del año</option>
              <option value="week">Eventos de la semana</option>
              <option value="day">Eventos del día</option>
              <option value="custom_range">Buscar por fechas</option>
              <option value="all">Todos los eventos</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={`block text-xs font-medium mb-1 ${timeFilter === 'custom_range' ? 'text-gray-700' : 'text-gray-400'}`}>Desde</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                disabled={timeFilter !== 'custom_range'}
                className={`w-full border-gray-200 rounded-lg text-sm focus:ring-purple-500 focus:border-purple-500 ${timeFilter !== 'custom_range' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
              />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${timeFilter === 'custom_range' ? 'text-gray-700' : 'text-gray-400'}`}>Hasta</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                disabled={timeFilter !== 'custom_range'}
                className={`w-full border-gray-200 rounded-lg text-sm focus:ring-purple-500 focus:border-purple-500 ${timeFilter !== 'custom_range' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}`}
              />
            </div>
          </div>

          {/* Tipo de Evento */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Tipo de Evento</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full border-gray-200 rounded-lg text-sm focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">Todos</option>
              <option value="featured">Eventos Destacados</option>
              <option value="normal">Eventos Normales</option>
            </select>
          </div>

          {/* Search */}
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
                onClick={() => setSelectedEventForPopup(event)}
                className={`group bg-white rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${event.is_featured ? 'ring-4 ring-yellow-400 ring-offset-2' : 'border border-gray-100'}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div className="absolute inset-0 bg-gray-200" />
                  <img
                    src={getImageUrl(event.image_url)}
                    alt={event.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Badges */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                    {event.is_featured && (
                      <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        Destacado
                      </div>
                    )}
                    {isUpcoming(event.iso_date) && (
                      <div className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        Próximamente
                      </div>
                    )}
                  </div>

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

      {/* Detail Modal */}
      {selectedEventForPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="relative aspect-video">
              <img
                src={getImageUrl(selectedEventForPopup.image_url)}
                alt={selectedEventForPopup.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedEventForPopup(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-md"
              >
                <X size={20} />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                {selectedEventForPopup.overlay_title && (
                  <p className="text-purple-300 text-sm font-medium mb-1 tracking-wide uppercase">{selectedEventForPopup.overlay_title}</p>
                )}
                <h2 className="text-3xl font-bold text-white leading-none">{selectedEventForPopup.name}</h2>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                  <div className="flex items-center text-purple-700 mb-2">
                    <Calendar size={18} className="mr-2" />
                    <span className="text-xs font-bold uppercase tracking-wider">Fecha</span>
                  </div>
                  <p className="text-gray-900 font-semibold text-lg">
                    {selectedEventForPopup.iso_date ? new Date(selectedEventForPopup.iso_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'TBA'}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <div className="flex items-center text-blue-700 mb-2">
                    <Clock size={18} className="mr-2" />
                    <span className="text-xs font-bold uppercase tracking-wider">Horario</span>
                  </div>
                  <p className="text-gray-900 font-semibold text-lg">
                    {formatTime(selectedEventForPopup.start_time)} - {formatTime(selectedEventForPopup.end_time)}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin size={24} className="text-gray-400 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Ubicación</h3>
                  <p className="text-xl text-gray-800 font-medium">{selectedEventForPopup.location}</p>
                </div>
              </div>

              {selectedEventForPopup.is_featured && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center text-yellow-800 text-sm">
                  <span className="font-bold mr-2">✨ Evento Destacado:</span>
                  Este es uno de nuestros eventos más esperados.
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={() => setSelectedEventForPopup(null)}
                className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition shadow-sm mr-3"
              >
                Cerrar
              </button>

              {onSelectEvent && (
                <button
                  onClick={() => {
                    if (!selectedEventForPopup) return;

                    const mappedEvent: Event = {
                      id: selectedEventForPopup.id,
                      name: selectedEventForPopup.name,
                      overlayTitle: selectedEventForPopup.overlay_title,
                      isoDate: selectedEventForPopup.iso_date,
                      startTime: selectedEventForPopup.start_time,
                      endTime: selectedEventForPopup.end_time,
                      location: selectedEventForPopup.location,
                      image: getImageUrl(selectedEventForPopup.image_url), // Ensure absolute URL
                      rating: selectedEventForPopup.rating,
                      type: selectedEventForPopup.type,
                      isFeatured: selectedEventForPopup.is_featured,
                      carouselOrder: selectedEventForPopup.carousel_order,
                      menuId: selectedEventForPopup.menu_id
                    };

                    onSelectEvent(mappedEvent);
                    setSelectedEventForPopup(null);
                  }}
                  className="px-6 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition shadow-sm"
                >
                  Ver Menú y Comprar
                </button>
              )}
              {/* Optional: Add "Comprar" button here if desired later */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
