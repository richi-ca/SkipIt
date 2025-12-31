import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../components/Hero';
import QuienesSomos from '../components/QuienesSomos';
import EventCarousel from '../components/EventCarousel';
import Promotions from '../components/Promotions';
import { Event } from '../data/mockData';
import { catalogService } from '../services/catalogService';

interface HomePageProps {
  onSelectEvent: (event: Event) => void;
  onOpenRegister: () => void;
}

export default function HomePage({ onSelectEvent, onOpenRegister }: HomePageProps) {
  const location = useLocation();
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await catalogService.getFeaturedEvents();
        setFeaturedEvents(data);
      } catch (err: any) {
        console.error('Error fetching featured events:', err);
        setError('No se pudieron cargar los eventos destacados.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

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
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-10 bg-red-50 rounded-xl">
              {error}
            </div>
          ) : (
            <EventCarousel events={featuredEvents} onSelectEvent={onSelectEvent} />
          )}
        </div>
      </section>
      <Promotions />
    </>
  );
}



