import React from 'react';
import { Plus, Minus, X, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import advertenciaImg from '../assets/images/Advertencia.png';
import advertenciaMovilImg from '../assets/images/Advertencia-movil.png';

interface Drink {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface DrinkMenuProps {
  eventName: string;
  drinks: Drink[];
  onClose: () => void;
  onOpenCart: () => void;
}

export default function DrinkMenu({ 
  eventName, 
  drinks, 
  onClose, 
  onOpenCart
}: DrinkMenuProps) {
  const { cartItems, addToCart, removeFromCart, getTotalItems } = useCart();
  const categories = [...new Set(drinks.map(drink => drink.category))];
  const totalItems = getTotalItems();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold mb-2">Carta de Tragos</h2>
          <p className="text-purple-100">{eventName}</p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {categories.map(category => (
            <div key={category} className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-purple-200">
                {category}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {drinks
                  .filter(drink => drink.category === category)
                  .map(drink => (
                    <div key={drink.id} className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={drink.image} 
                          alt={drink.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{drink.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{drink.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-purple-600">
                              ${drink.price.toLocaleString()}
                            </span>
                            
                            {cartItems[drink.id] ? (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => removeFromCart(drink.id)}
                                  className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="font-bold text-lg min-w-[2rem] text-center">
                                  {cartItems[drink.id]}
                                </span>
                                <button
                                  onClick={() => addToCart(drink.id)}
                                  className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => addToCart(drink.id)}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            )}
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

        {/* Warning Image (Mobile) */}
        {/* <div className="block md:hidden absolute bottom-0 left-0 right-0">
            <img src={advertenciaMovilImg} alt="Advertencia sobre el consumo de alcohol" className="w-full" />
        </div> */}

        {totalItems > 0 && (
          <div className="absolute bottom-8 right-8">
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