import React from 'react';
import { Gift, Clock, Users, Trophy } from 'lucide-react';
import { promotions, contests, PromotionStyle } from '../data/mockData';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

// Mapeo de estilos para mantener el diseño original basado en la data
const gradientMap: Record<PromotionStyle, string> = {
  'orange-red': 'from-orange-500 to-red-500',
  'blue-purple': 'from-blue-500 to-purple-500',
  'green-emerald': 'from-green-500 to-emerald-500',
};

const iconMap = {
  'Clock': Clock,
  'Users': Users,
  'Gift': Gift,
};

export default function Promotions() {
  const { addToCart } = useCart();

  const handleAction = (type: 'PROMO' | 'CONTEST', item: any) => {
    if (item.actionType === 'ADD_TO_CART' && item.linkedVariationId) {
      addToCart(item.linkedVariationId);
      toast.success(`${type === 'PROMO' ? 'Promoción' : 'Concurso'} activado! Producto agregado al carrito.`);
    } else if (item.actionType === 'LINK' && item.actionUrl) {
      window.open(item.actionUrl, '_blank');
    } else {
      // Default fallback or 'NONE'
      console.log('Action triggered:', type, item.id);
    }
  };

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
          {promotions.filter(p => p.active).map((promo) => {
            const IconComponent = iconMap[promo.iconName] || Gift;
            const gradientClass = gradientMap[promo.styleVariant] || 'from-purple-500 to-pink-500';

            return (
              <div key={promo.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className={`bg-gradient-to-r ${gradientClass} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <IconComponent className="w-8 h-8" />
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-bold">
                      {promo.discountText}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold">{promo.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{promo.description}</p>
                  <button 
                    onClick={() => handleAction('PROMO', promo)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
                  >
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
          {contests.filter(c => c.active).map((contest) => (
            <div key={contest.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              {/* Nota: Los concursos en el diseño original usaban yellow-orange fijo, pero podríamos parametrizarlo igual si quisiéramos.
                  Por ahora mantenemos el diseño original fijo para concursos salvo que la data diga otra cosa en el futuro. */}
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
                
                {/* Renderizado condicional de imagen si existe (Feature PDF) */}
                {contest.image && (
                   <div className="mb-4 flex justify-center">
                     <img src={contest.image} alt={contest.title} className="h-32 object-contain" />
                   </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Premio</p>
                    <p className="font-bold text-purple-600">{contest.prizeText}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Termina</p>
                    <p className="font-bold text-red-600">{contest.endDate}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleAction('CONTEST', contest)}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
                >
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