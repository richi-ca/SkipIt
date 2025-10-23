import React from 'react';
import Slider from 'react-slick';
import EventCard from './EventCard';
import { Event } from '../data/mockData';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface EventCarouselProps {
  events: Event[];
  onSelectEvent: (event: Event) => void;
}

const monthMap: { [key: string]: number } = {
  'Enero': 0,
  'Febrero': 1,
  'Marzo': 2,
  'Abril': 3,
  'Mayo': 4,
  'Junio': 5,
  'Julio': 6,
  'Agosto': 7,
  'Septiembre': 8,
  'Octubre': 9,
  'Noviembre': 10,
  'Diciembre': 11,
};

const parseDate = (dateString: string): Date => {
  const parts = dateString.split(' ');
  if (parts.length !== 3) {
    return new Date(0); // Return an invalid date
  }
  const day = parseInt(parts[0]);
  const monthName = parts[1];
  const year = parseInt(parts[2]);
  const month = monthMap[monthName];

  if (isNaN(day) || month === undefined || isNaN(year)) {
    return new Date(0); // Return an invalid date
  }

  return new Date(year, month, day);
};

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
  const upcomingEvents = events
    .map(event => ({
      ...event,
      dateObj: parseDate(event.date),
    }))
    .filter(event => event.dateObj >= new Date())
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())
    .slice(0, 5);

  const settings = {
    dots: true,
    infinite: upcomingEvents.length > 2,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  if (upcomingEvents.length === 0) {
    return <p>No hay eventos próximos.</p>;
  }

  return (
    <div className="w-full relative">
      <Slider {...settings}>
        {upcomingEvents.map(event => (
          <div key={event.id} className="p-4">
            <EventCard event={event} onSelect={onSelectEvent} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default EventCarousel;
