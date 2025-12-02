import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Event } from '../data/mockData';

interface EventCardProps {
  event: Event;
  onSelect: (event: Event) => void;
}

// Helper para crear fecha local sin problemas de zona horaria (Duplicado intencionalmente para autonomía del componente o podría importarse)
const parseIsoDateToLocal = (isoDate: string) => {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export default function EventCard({ event, onSelect }: EventCardProps) {
  // Helper para formatear fecha ISO a local legible usando la lógica corregida de zona horaria
  const formattedDate = parseIsoDateToLocal(event.isoDate).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col">
      <div className="relative h-48 overflow-hidden shrink-0">
        <img 
          src={event.image} 
          alt={event.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        
        {/* Type Badge (Top Left) */}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
            {event.type}
          </span>
        </div>

        {/* Price Badge (Top Right) */}
        <div className="absolute top-4 right-4 z-10">
           <span className="bg-white bg-opacity-90 text-gray-900 font-bold px-3 py-1 rounded-full text-sm shadow-md">
            ${event.price.toLocaleString()}
          </span>
        </div>

        {/* Overlay Title (Requirement: Fuchsia background adapting to text) */}
        {event.overlayTitle && (
          <div className="absolute bottom-4 left-0 z-10 max-w-[85%]">
            <div className="bg-fuchsia-600 text-white font-bold text-lg px-4 py-1 rounded-r-lg shadow-lg inline-block">
              {event.overlayTitle}
            </div>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        {/* Fallback title if no overlay, or secondary info */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{event.name}</h3>
        
        <div className="space-y-2 mb-6 flex-grow">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2 shrink-0" />
            <span className="text-sm truncate capitalize">{formattedDate}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2 shrink-0" />
            <span className="text-sm truncate">{event.startTime} - {event.endTime}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2 shrink-0" />
            <span className="text-sm truncate">{event.location}</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100">
          <button
            onClick={() => onSelect(event)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-md active:scale-95"
          >
            Ver Carta
          </button>
        </div>
      </div>
    </div>
  );
}