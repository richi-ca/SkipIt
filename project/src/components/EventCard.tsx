import React from 'react';
import { Calendar, MapPin, Clock, Star } from 'lucide-react';

interface Event {
  id: number;
  name: string;
  date: string;
  time: string;
  location: string;
  image: string;
  price: string;
  rating: number;
  type: string;
}

interface EventCardProps {
  event: Event;
  onSelect: (event: Event) => void;
}

export default function EventCard({ event, onSelect }: EventCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={event.image} 
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {event.type}
          </span>
        </div>
        {/* <div className="absolute top-4 right-4 flex items-center bg-black bg-opacity-50 text-white px-2 py-1 rounded-full">
          <Star className="w-4 h-4 text-yellow-400 mr-1" />
          <span className="text-sm">{event.rating}</span>
        </div> */}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.name}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="text-sm">{event.date}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span className="text-sm">{event.time}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm">{event.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {/* <div className="text-2xl font-bold text-purple-600">
            Desde {event.price}
          </div> */}
          <button
            onClick={() => onSelect(event)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Ver Carta
          </button>
        </div>
      </div>
    </div>
  );
}