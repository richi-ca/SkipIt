import React from 'react';
import EventCard from '../components/EventCard';
import { events, Event } from '../data/mockData';

interface EventsPageProps {
  onSelectEvent: (event: Event) => void;
}

export default function EventsPage({ onSelectEvent }: EventsPageProps) {
  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Todos los Eventos
          </h1>
          <p className="text-xl text-gray-600">
            Explora todos nuestros próximos eventos y no te pierdas nada.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map(event => (
            <EventCard 
              key={event.id} 
              event={event} 
              onSelect={onSelectEvent}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
