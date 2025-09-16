import React from 'react';
import { Clock, Users, Zap, Heart, Trophy, Smartphone } from 'lucide-react';

interface QuienesSomosProps {
  onOpenRegister: () => void;
}

export default function QuienesSomos({ onOpenRegister }: QuienesSomosProps) {
  return (
    <section id="quienes-somos" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            ¿Quiénes Somos?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Somos SkipIT, la plataforma que revoluciona la forma de disfrutar eventos.
            Creamos la solución perfecta para que pases más tiempo bailando y menos tiempo haciendo fila.
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Nuestra Misión
              </h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Transformar la experiencia en eventos masivos eliminando las largas filas en las barras.
                Creemos que tu tiempo es valioso y debe dedicarse a lo que realmente importa:
                <span className="font-semibold text-purple-600"> disfrutar, bailar y crear recuerdos inolvidables</span>.
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  Más diversión, menos espera
                </span>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg"
                alt="Personas disfrutando en un evento"
                className="rounded-2xl shadow-lg w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div id="como-funciona" className="py-20">
          <h3 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-12 text-center">
            ¿Cómo Funciona?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">1. Precompra</h4>
              <p className="text-gray-600">
                Selecciona tu evento favorito y precompra tus tragos desde la comodidad de tu casa o mientras vas camino al evento.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">2. Recibe tu QR</h4>
              <p className="text-gray-600">
                Una vez confirmada tu compra, recibes un código QR único que contiene todos tus tragos precomprados.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-pink-600 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">3. Canjea al Instante</h4>
              <p className="text-gray-600">
                Llega al evento, muestra tu QR en la barra y recibe tus tragos inmediatamente. ¡Sin filas, sin esperas!
              </p>
            </div>
          </div>


          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <Clock className="w-12 h-12 text-orange-500 mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-3">Ahorra Tiempo</h4>
              <p className="text-gray-600">
                Evita las largas filas en las barras. Tu tiempo es para bailar, no para esperar.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <Users className="w-12 h-12 text-purple-500 mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-3">Más Diversión</h4>
              <p className="text-gray-600">
                Dedica más tiempo a disfrutar con tus amigos y menos tiempo haciendo trámites.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <Zap className="w-12 h-12 text-green-500 mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-3">Súper Fácil</h4>
              <p className="text-gray-600">
                Proceso simple: compra, recibe tu QR y canjea. ¡Así de fácil es con SkipIT!
              </p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">
              ¿Listo para Saltarte la Fila?
            </h3>
            <p className="text-xl mb-8 text-purple-100">
              Únete a miles de personas que ya disfrutan más y esperan menos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onOpenRegister}
                className="bg-white text-purple-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Regístrate Gratis
              </button>
              <a
                href="#eventos"
                className="border-2 border-white text-white hover:bg-white hover:text-purple-600 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105"
              >
                Ver Eventos
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
