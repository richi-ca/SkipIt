import React, { useEffect, useState } from 'react';
import { Plus, Minus, X, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Event, Menu } from '../data/mockData';
import { catalogService } from '../services/catalogService';
import advertenciaImg from '../assets/images/Advertencia.png';
import advertenciaMovilImg from '../assets/images/Advertencia-movil.png';

interface DrinkMenuProps {
  eventId: number;
  onClose: () => void;
  onOpenCart: () => void;
}

export default function DrinkMenu({
  eventId,
  onClose,
  onOpenCart
}: DrinkMenuProps) {
  const { cartItems, addToCart, removeFromCart, getTotalItems } = useCart();
  const totalItems = getTotalItems();

  const [event, setEvent] = useState<Event | null>(null);
  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [eventData, menuData] = await Promise.all([
          catalogService.getEventById(eventId),
          catalogService.getMenuByEventId(eventId)
        ]);
        setEvent(eventData);
        setMenu(menuData);
      } catch (err: any) {
        console.error('Error fetching menu data:', err);
        setError('No se pudo cargar la carta de tragos. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, [eventId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-4xl w-full h-[60vh] flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600">Cargando carta...</p>
        </div>
      </div>
    );
  }

  if (error || !event || !menu) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
          <div className="text-red-600 mb-4 font-bold text-lg">{error || 'Error al cargar los datos'}</div>
          <button onClick={onClose} className="bg-purple-600 text-white px-6 py-2 rounded-full font-bold">Cerrar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold mb-2">Carta de Tragos</h2>
          <p className="text-purple-100">{event.name}</p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-grow">
          {menu.categories.map(category => (
            <div key={category.id} className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-purple-200">
                {category.name}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.products.map(product => (
                  <div key={product.id} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 rounded-lg object-cover shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 truncate">{product.name}</h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                        {/* Renderizado de Variaciones */}
                        <div className="space-y-2">
                          {product.variations.map(variation => {
                            const count = cartItems[variation.id]?.quantity || 0;
                            return (
                              <div key={variation.id} className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm">
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium text-gray-800">{variation.name}</span>
                                  <span className="text-sm font-bold text-purple-600">${variation.price.toLocaleString()}</span>
                                </div>

                                {count > 0 ? (
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => removeFromCart(variation.id)}
                                      className="w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </button>
                                    <span className="font-bold text-sm min-w-[1.5rem] text-center">
                                      {count}
                                    </span>
                                    <button
                                      onClick={() => addToCart({
                                        id: variation.id,
                                        name: product.name,
                                        variationName: variation.name,
                                        price: variation.price,
                                        image: product.image
                                      })}
                                      className="w-7 h-7 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => addToCart({
                                      id: variation.id,
                                      name: product.name,
                                      variationName: variation.name,
                                      price: variation.price,
                                      image: product.image
                                    })}
                                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs font-bold py-1.5 px-3 rounded-full transition-all"
                                  >
                                    Agregar
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Warning Image */}
          <div className="mt-8 flex justify-center">
            <img src={advertenciaImg} alt="Advertencia sobre el consumo de alcohol" className="hidden md:block max-w-[15rem]" />
            <img src={advertenciaMovilImg} alt="Advertencia sobre el consumo de alcohol" className="block md:hidden w-full max-w-xs" />
          </div>
        </div>

        {totalItems > 0 && (
          <div className="absolute bottom-8 right-8 z-50">
            <button
              onClick={onOpenCart}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-full h-16 w-16 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform"
            >
              <ShoppingCart className="w-8 h-8" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-white">
                {totalItems}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}