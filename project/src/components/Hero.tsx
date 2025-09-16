import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Zap } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black opacity-20"></div>
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
            <span className="block">¡Salta la fila,</span>
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              disfruta más!
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Precompra tus tragos favoritos y canjéalos al instante con tu código QR. 
            Más tiempo para bailar, menos tiempo haciendo fila.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              to="/events"
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
              Explorar Eventos
            </Link>
            <a href="#promotions" className="border-2 border-white text-white hover:bg-white hover:text-purple-900 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105">
              Ver Promociones
            </a>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <Clock className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Ahorra Tiempo</h3>
              <p className="text-gray-200">No más esperas en la barra. Canjea tu trago al instante.</p>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <Zap className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Súper Fácil</h3>
              <p className="text-gray-200">Compra, recibe tu QR y canjea. ¡Así de simple!</p>
            </div>
            
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <Users className="w-12 h-12 text-pink-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Más Diversión</h3>
              <p className="text-gray-200">Dedica tu tiempo a lo que realmente importa: ¡pasarlo bien!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
