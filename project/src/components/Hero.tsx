import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Zap } from 'lucide-react';
import advertenciaImg from '../assets/images/Advertencia.png';
import advertenciaMovilImg from '../assets/images/Advertencia-movil.png';
import { siteContent } from '../data/mockData';

const iconMap = {
  'Clock': Clock,
  'Users': Users,
  'Zap': Zap,
};

export default function Hero() {
  const { hero } = siteContent;

  return (
    <div className="relative bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black opacity-20"></div>

      {/* Imagen de Advertencia (Solo para MÓVIL, Absoluta) */}
      <div className="absolute top-0 left-0 right-0 z-10 lg:hidden">
        <img src={advertenciaMovilImg} alt="Advertencia sobre el consumo de alcohol" className="w-full h-auto" />
      </div>

      {/* Imagen de Advertencia (Solo para ESCRITORIO, Absoluta) */}
      <div className="absolute top-3 right-3 z-10 hidden lg:block">
        <img src={advertenciaImg} alt="Advertencia sobre el consumo de alcohol" className="lg:w-[14rem] h-auto" />
      </div>
      
      {/* Contenedor de Contenido Principal (con padding de seguridad en los lados) */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:pr-[13rem] lg:pl-[13rem]">
        
        {/* Bloque de Texto (Centrado y Ancho) */}
        <div className="text-center max-w-4xl mx-auto">

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
              <span className="block">{hero.title}</span>
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                {hero.subtitle}
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-200 mb-8 whitespace-pre-line">
              {hero.description}
            </p>
          </div>

          <div>
          <div className="max-w-md mx-auto sm:max-w-none">
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 flex-wrap">
              <Link 
                to="/events"
                className="text-center bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                {hero.ctaButtonText}
              </Link>
              <a href="#promotions" className="text-center border-2 border-white text-white hover:bg-white hover:text-purple-900 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105">
                {hero.secondaryButtonText}
              </a>
              <a href="#concursos" className="text-center border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-purple-900 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105">
                {hero.contestButtonText}
              </a>
            </div>
          </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {hero.features.map((feature, index) => {
              const Icon = iconMap[feature.icon];
              let iconColorClass = 'text-yellow-400';
              if (feature.icon === 'Zap') iconColorClass = 'text-green-400';
              if (feature.icon === 'Users') iconColorClass = 'text-pink-400';

              return (
                <div key={index} className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 text-center">
                  <Icon className={`w-12 h-12 ${iconColorClass} mx-auto mb-4`} />
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-200 whitespace-pre-line">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    
  );
}