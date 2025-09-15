import React from 'react';
import { Gift, Clock, Users, Trophy } from 'lucide-react';

export default function Promotions() {
  const promotions = [
    {
      id: 1,
      title: "Happy Hour Digital",
      description: "2x1 en cervezas precompradas hasta las 11 PM",
      icon: Clock,
      color: "from-orange-500 to-red-500",
      discount: "50% OFF"
    },
    {
      id: 2,
      title: "Grupo Premiado",
      description: "Compra para 4+ personas y obtén tragos gratis",
      icon: Users,
      color: "from-blue-500 to-purple-500",
      discount: "GRATIS"
    },
    {
      id: 3,
      title: "Weekend Vibes",
      description: "Descuentos especiales en fines de semana",
      icon: Gift,
      color: "from-green-500 to-emerald-500",
      discount: "30% OFF"
    }
  ];

  const contests = [
    {
      id: 1,
      title: "Corona Extra Challenge",
      description: "Compra 3 cervezas Corona y participa por entradas VIP",
      brand: "Corona",
      prize: "Entradas VIP",
      endDate: "31 Dic"
    },
    {
      id: 2,
      title: "Pisco Sour Festival",
      description: "Gana un viaje a Perú comprando Pisco Sour",
      brand: "Capel",
      prize: "Viaje a Perú",
      endDate: "15 Ene"
    }
  ];

  return (
    <section id="promociones" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Promotions */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Promociones Especiales
          </h2>
          <p className="text-xl text-gray-600">
            Aprovecha nuestras ofertas exclusivas y ahorra aún más
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {promotions.map((promo) => {
            const IconComponent = promo.icon;
            return (
              <div key={promo.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className={`bg-gradient-to-r ${promo.color} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <IconComponent className="w-8 h-8" />
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-bold">
                      {promo.discount}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold">{promo.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{promo.description}</p>
                  <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105">
                    Activar Promoción
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contests */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Concursos Activos
          </h2>
          <p className="text-xl text-gray-600">
            Participa y gana increíbles premios de nuestras marcas auspiciantes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="concursos">
          {contests.map((contest) => (
            <div key={contest.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <Trophy className="w-8 h-8" />
                  <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-bold">
                    {contest.brand}
                  </span>
                </div>
                <h3 className="text-xl font-bold">{contest.title}</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">{contest.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Premio</p>
                    <p className="font-bold text-purple-600">{contest.prize}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Termina</p>
                    <p className="font-bold text-red-600">{contest.endDate}</p>
                  </div>
                </div>
                <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105">
                  Participar Ahora
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}