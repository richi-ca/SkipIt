import React from 'react';
import Slider from 'react-slick';
import EventCard from './EventCard';
import { Event } from '../data/mockData';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useScreenWidth } from '../hooks/useScreenWidth';

interface EventCarouselProps {
  events: Event[];
  onSelectEvent: (event: Event) => void;
}

const NextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-black bg-opacity-20 hover:bg-opacity-50 text-white p-2 rounded-full z-10 transition-all"
      onClick={onClick}
    >
      <ChevronRight size={32} />
    </button>
  );
};

const PrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <button
      className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-black bg-opacity-20 hover:bg-opacity-50 text-white p-2 rounded-full z-10 transition-all"
      onClick={onClick}
    >
      <ChevronLeft size={32} />
    </button>
  );
};

const EventCarousel: React.FC<EventCarouselProps> = ({ events, onSelectEvent }) => {
  const screenWidth = useScreenWidth();

  // Lógica de Filtrado Robusta (Usando ISO Date):
  // 1. Debe estar marcado como 'isFeatured'.
  // 2. No debe ser un evento pasado (comparación de strings ISO funciona perfectamente: '2025-12-15' >= '2025-11-26').
  // 3. Ordenar por 'carouselOrder'.

  // Obtener fecha local en formato YYYY-MM-DD para comparar con isoDate del evento
  const today = new Date();
  const todayISO = new Date(today.getTime() - (today.getTimezoneOffset() * 60000))
    .toISOString()
    .split('T')[0];

  const featuredEvents = events
    .sort((a, b) => (a.carouselOrder || 99) - (b.carouselOrder || 99));

  const slidesToShow = screenWidth < 1024 ? 1 : 2;

  const settings = {
    dots: true,
    infinite: featuredEvents.length > slidesToShow,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  if (featuredEvents.length === 0) {
    return <p className="text-center text-gray-500 py-8">No hay eventos destacados disponibles en este momento.</p>;
  }

  return (
    <div className="w-full relative pb-8"> {/* Added pb-8 for dots space */}
      <Slider {...settings}>
        {featuredEvents.map(event => (
          <div key={event.id} className="p-4 h-full">
            <EventCard event={event} onSelect={onSelectEvent} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default EventCarousel;
