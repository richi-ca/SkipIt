import React from 'react';
import { X, ShoppingBag, QrCode } from 'lucide-react';

interface Drink {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: { [key: number]: number };
  drinks: Drink[];
  onGenerateQR: () => void;
}

export default function Cart({ isOpen, onClose, cartItems, drinks, onGenerateQR }: CartProps) {
  if (!isOpen) return null;

  const cartDrinks = drinks.filter(drink => cartItems[drink.id] > 0);
  const total = cartDrinks.reduce((sum, drink) => sum + (drink.price * cartItems[drink.id]), 0);
  const itemCount = Object.values(cartItems).reduce((sum, count) => sum + count, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md h-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-6 h-6" />
              <h2 className="text-xl font-bold">Mi Pedido</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          {itemCount > 0 && (
            <p className="text-purple-100 mt-2">{itemCount} items</p>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartDrinks.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Tu carrito está vacío</p>
              <p className="text-gray-400 mt-2">¡Agrega algunos tragos para empezar!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartDrinks.map(drink => (
                <div key={drink.id} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={drink.image} 
                      alt={drink.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{drink.name}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-purple-600 font-semibold">
                          ${drink.price.toLocaleString()} x {cartItems[drink.id]}
                        </span>
                        <span className="font-bold text-gray-900">
                          ${(drink.price * cartItems[drink.id]).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartDrinks.length > 0 && (
          <div className="border-t bg-gray-50 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-bold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-purple-600">
                ${total.toLocaleString()}
              </span>
            </div>
            
            <button
              onClick={onGenerateQR}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <QrCode className="w-5 h-5" />
              <span>Generar Código QR</span>
            </button>
            
            <p className="text-xs text-gray-500 text-center mt-3">
              Una vez generado el QR, podrás canjearlo en la barra del evento
            </p>
          </div>
        )}
      </div>
    </div>
  );
}