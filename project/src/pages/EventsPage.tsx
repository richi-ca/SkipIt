import { useState, useEffect } from 'react';
import { Search, Calendar, ChevronLeft, ChevronRight, X, MapPin, Clock } from 'lucide-react';
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
  // valid_from and valid_until removed
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
  // Filters state removed as UI controls were removed

  // Modal State
  const [selectedEventForPopup, setSelectedEventForPopup] = useState<BackendEvent | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Initial Fetch & Filter Change
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    console.log("EventsPage: Starting fetchEvents...");
    setLoading(true);
    try {
      const params = new URLSearchParams();
      // Siempre pedimos eventos públicos (que ahora filtran is_active=True + validez feha)
      params.append('public', 'true');

      console.log("EventsPage: Fetching from API...");
      const data = await baseFetch<BackendEvent[]>(`/catalog/events?${params.toString()}`);
      console.log("EventsPage: Data received:", data);

      if (Array.isArray(data)) {
        setEvents(data);
      } else {
        console.error("EventsPage: Data is not an array:", data);
        setEvents([]);
      }

      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      console.log("EventsPage: Loaging set to false");
      setLoading(false);
    }
  };

  // handleTimeFilterChange removed

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
    return `${import.meta.env.VITE_MEDIA_URL}/events/${url}`;
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
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900">Eventos</h1>
            <p className="text-gray-600 mt-1">Explora nuestros próximos eventos</p>
          </div>
        </div>

        {/* Filters Bar */}
        {/* Filters removed (Periodo, Tipo de Evento) */}

        {/* Search */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-12">
          <div className="w-full">
            <label className="block text-xs font-medium text-gray-500 mb-1">Buscar</label>
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
                  <img
                    src={getImageUrl(event.image_url)}
                    alt={event.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

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

                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white flex justify-between items-end">
                    <div className="flex-1 mr-2">
                      <h3 className="font-bold text-lg mb-1 leading-tight">{event.name}</h3>
                      <div className="flex items-center text-xs opacity-90">
                        <Calendar size={12} className="mr-1" />
                        {event.iso_date ? (() => {
                          const [y, m, d] = event.iso_date.split('T')[0].split('-');
                          return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString();
                        })() : 'Fecha por confirmar'}
                      </div>
                      {event.location && (
                        <div className="flex items-center text-xs opacity-90 mt-1">
                          <MapPin size={12} className="mr-1" />
                          {event.location}
                        </div>
                      )}
                    </div>
                    {onSelectEvent && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const mappedEvent: Event = {
                            id: event.id,
                            name: event.name,
                            overlayTitle: event.overlay_title,
                            isoDate: event.iso_date,
                            startTime: event.start_time,
                            endTime: event.end_time,
                            location: event.location,
                            image: getImageUrl(event.image_url),
                            rating: event.rating,
                            type: event.type,
                            isFeatured: event.is_featured,
                            carouselOrder: event.carousel_order,
                            menuId: event.menu_id
                          };
                          onSelectEvent(mappedEvent);
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg transition-colors flex-shrink-0"
                      >
                        Ver Carta
                      </button>
                    )}
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
                    {selectedEventForPopup.iso_date ? (() => {
                      const [y, m, d] = selectedEventForPopup.iso_date.split('T')[0].split('-');
                      return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                    })() : 'TBA'}
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
                  Ver Carta
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
