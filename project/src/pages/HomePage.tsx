import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import QuienesSomos from '../components/QuienesSomos';
import EventCarousel from '../components/EventCarousel';
import Promotions from '../components/Promotions';
import { Event } from '../data/mockData';

interface HomePageProps {
  events: Event[];
  onSelectEvent: (event: Event) => void;
  onOpenRegister: () => void;
}

export default function HomePage({ events, onSelectEvent, onOpenRegister }: HomePageProps) {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.querySelector(location.state.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Clean up state to prevent re-scrolling on refresh
        window.history.replaceState({}, document.title)
      }
    }
  }, [location]);

  return (
    <>
      <Hero />
      <QuienesSomos onOpenRegister={onOpenRegister} />
      <section id="eventos" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Eventos Destacados
            </h2>
            <p className="text-xl text-gray-600">
              Encuentra tu evento favorito y precompra tus tragos
            </p>
          </div>
          <EventCarousel events={events} onSelectEvent={onSelectEvent} />
        </div>
      </section>
      <Promotions />
    </>
  );
}
