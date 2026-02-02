import { Link } from 'react-router-dom';
import { Zap, Heart, Trophy, Smartphone } from 'lucide-react';
import logoMision from '../assets/images/Logo00.png';
import imageVision from '../assets/images/Image1.jpeg';
import { siteContent } from '../data/mockData';

interface QuienesSomosProps {
  onOpenRegister: () => void;
}

// Helper para resaltar texto
const renderWithHighlight = (text: string, highlight: string) => {
  if (!highlight) return text;
  const parts = text.split(highlight);
  return (
    <span>
      {parts.map((part, index) => (
        <span key={index}>
          {part}
          {index < parts.length - 1 && (
            <span className="font-semibold text-purple-600">{highlight}</span>
          )}
        </span>
      ))}
    </span>
  );
};

// Imports adicionales necesarios
import { useState, useEffect } from 'react';
import { baseFetch } from '../services/api';

// ... (El resto de imports sigue igual: Link, iconos, imagenes)

// Props
interface QuienesSomosProps {
  onOpenRegister: () => void;
}

export default function QuienesSomos({ onOpenRegister }: QuienesSomosProps) {
  // Estado para contenidos CMS (con defaults por si falla la carga o mientras carga)
  const [cmsContent, setCmsContent] = useState({
    quienes_somos: '<p>Somos SkipIT, la plataforma que revoluciona la forma de disfrutar eventos. Creamos la solución perfecta para que pases más tiempo bailando y menos tiempo haciendo fila.</p>',
    mision: '<p>Disminuir el tiempo de espera para canjear tragos en eventos, ofreciendo una experiencia rápida, fluida y segura.</p>',
    vision: '<p>Ser la plataforma líder global en gestión de experiencia en eventos, reconocida por nuestra innovación y servicio.</p>'
  });
  const { about } = siteContent; // Aún usamos mockData para iconos y estructura general, pero texto vendrá de CMS.

  const iconMap = [Smartphone, Trophy, Zap];
  const gradientMap = [
    'from-blue-500 to-purple-600',
    'from-purple-600 to-pink-600',
    'from-pink-600 to-orange-500'
  ];

  // Efecto para cargar contenido CMS
  useEffect(() => {
    const loadCms = async () => {
      try {
        const data = await baseFetch<any>('/cms/');
        if (data) {
          // Merge con defaults para evitar vacíos si algo falta
          setCmsContent(prev => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error("Error cargando CMS en Quienes Somos", error);
      }
    };
    loadCms();
  }, []);

  return (
    <section id="quienes-somos" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Quienes Somos */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            ¿Quiénes Somos?
          </h2>
          <div
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed prose prose-purple"
            dangerouslySetInnerHTML={{ __html: cmsContent.quienes_somos }}
          />
        </div>

        {/* Mission */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Nuestra Misión
              </h3>
              <div
                className="text-lg text-gray-600 mb-6 leading-relaxed prose prose-purple"
                dangerouslySetInnerHTML={{ __html: cmsContent.mision }}
              />
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  Menos espera, más diversión
                </span>
              </div>
            </div>
            <div className="relative">
              <img
                src={logoMision}
                alt="Personas disfrutando en un evento"
                className="rounded-2xl shadow-lg w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>

        {/* Vision */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src={imageVision}
                alt="Personas disfrutando en un evento"
                className="rounded-2xl shadow-lg w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent rounded-2xl"></div>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Nuestra Visión
              </h3>
              <div
                className="text-lg text-gray-600 mb-6 leading-relaxed prose prose-purple"
                dangerouslySetInnerHTML={{ __html: cmsContent.vision }}
              />
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  Dedicarnos 100% a celebrar
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div id="como-funciona" className="py-20">
          <h3 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-12 text-center">
            ¿Cómo Funciona?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {about.steps.map((step, index) => {
              const Icon = iconMap[index] || Zap;
              const gradient = gradientMap[index] || gradientMap[0];

              return (
                <div key={step.stepNumber} className="text-center">
                  <div className={`w-20 h-20 bg-gradient-to-r ${gradient} rounded-full flex items-center justify-center mx-auto mb-6`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4">{step.stepNumber}. {step.title}</h4>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">
              ¿Estás listo para Saltarte la Fila?
            </h3>
            <p className="text-xl mb-8 text-purple-100">
              Únete a miles de personas que ya disfrutan el beneficio de precomprar y tener más tiempo para pasarlo bien.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onOpenRegister}
                className="bg-white text-purple-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Regístrate Aquí
              </button>
              <Link
                to="/events"
                className="border-2 border-white text-white hover:bg-white hover:text-purple-600 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105"
              >
                Ver Eventos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
