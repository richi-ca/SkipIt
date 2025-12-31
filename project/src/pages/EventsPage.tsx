import React, { useEffect, useState } from 'react';
import EventCard from '../components/EventCard';
import { Event } from '../data/mockData';
import { catalogService } from '../services/catalogService';

interface EventsPageProps {
  onSelectEvent: (event: Event) => void;
}

export default function EventsPage({ onSelectEvent }: EventsPageProps) {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await catalogService.getEvents();
        setAllEvents(data);
      } catch (err: any) {
        console.error('Error fetching events:', err);
        setError('No se pudieron cargar los eventos. Por favor, intenta de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Todos los Eventos
          </h1>
          <p className="text-xl text-gray-600">
            Encuentra aquí los mejores panoramas. 
            <br />
            ¡Asegura tu trago y dile adiós a la fila!
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 py-10 bg-red-50 rounded-xl max-w-2xl mx-auto">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allEvents.map(event => (
              <EventCard
                key={event.id} 
                event={event} 
                onSelect={onSelectEvent}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
