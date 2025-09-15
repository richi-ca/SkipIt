import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import Hero from './components/Hero';
import QuienesSomos from './components/QuienesSomos';
import EventCard from './components/EventCard';
import DrinkMenu from './components/DrinkMenu';
import Cart from './components/Cart';
import QRCode from './components/QRCode';
import Promotions from './components/Promotions';
import AgeVerification from './components/AgeVerification';
import UnderageBlock from './components/UnderageBlock';
import { events, drinks, Event } from './data/mockData';

function App() {
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [showUnderageBlock, setShowUnderageBlock] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [cartItems, setCartItems] = useState<{ [key: number]: number }>({});
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [orderData, setOrderData] = useState<{
    orderNumber: string;
    eventName: string;
    total: number;
    drinks: string[];
  } | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);

  const handleAgeConfirm = () => {
    setIsAgeVerified(true);
    localStorage.setItem('ageVerified', 'true');
  };

  const handleAgeDeny = () => {
    setShowUnderageBlock(true);
  };

  const handleGoBack = () => {
    setShowUnderageBlock(false);
  };

  // Check if user has already verified age
  useEffect(() => {
    const ageVerified = localStorage.getItem('ageVerified');
    if (ageVerified === 'true') {
      setIsAgeVerified(true);
    }
  }, []);

  // Control header visibility on scroll
  useEffect(() => {
    const controlHeader = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) { // if scroll down
          setIsHeaderVisible(false);
        } else { // if scroll up
          setIsHeaderVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlHeader);

      // cleanup function
      return () => {
        window.removeEventListener('scroll', controlHeader);
      };
    }
  }, [lastScrollY]);

  const addToCart = (drinkId: number) => {
    setCartItems(prev => ({
      ...prev,
      [drinkId]: (prev[drinkId] || 0) + 1
    }));
  };

  const removeFromCart = (drinkId: number) => {
    setCartItems(prev => {
      const newItems = { ...prev };
      if (newItems[drinkId] > 1) {
        newItems[drinkId]--;
      } else {
        delete newItems[drinkId];
      }
      return newItems;
    });
  };

  const getTotalItems = () => {
    return Object.values(cartItems).reduce((sum, count) => sum + count, 0);
  };

  const generateQR = () => {
    const cartDrinks = drinks.filter(drink => cartItems[drink.id] > 0);
    const total = cartDrinks.reduce((sum, drink) => sum + (drink.price * cartItems[drink.id]), 0);
    const drinkList = cartDrinks.map(drink => 
      `${drink.name} x${cartItems[drink.id]}`
    );

    setOrderData({
      orderNumber: `SK${Date.now().toString().slice(-6)}`,
      eventName: selectedEvent?.name || 'Evento General',
      total,
      drinks: drinkList
    });

    setCartItems({});
    setIsCartOpen(false);
    setIsQROpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Age Verification Modal */}
      <AgeVerification
        isOpen={!isAgeVerified && !showUnderageBlock}
        onConfirm={handleAgeConfirm}
        onDeny={handleAgeDeny}
      />

      {/* Underage Block */}
      <UnderageBlock
        isOpen={showUnderageBlock}
        onGoBack={handleGoBack}
      />

      {/* Main Content - Only show if age verified */}
      {isAgeVerified && (
        <>
      <Header 
        isVisible={isHeaderVisible}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartItemCount={getTotalItems()}
      />
      
      {/* Auth Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />
      
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
      
      <Hero />
      
      <QuienesSomos />
      
      {/* Events Section */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {events.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                onSelect={setSelectedEvent}
              />
            ))}
          </div>
        </div>
      </section>

      <Promotions />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold">
                  S
                </div>
                <span className="text-xl font-bold">SkipIT</span>
              </div>
              <p className="text-gray-400">
                Salta la fila, disfruta más. La forma más inteligente de comprar tragos en eventos.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Eventos</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Festivales</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Clubes</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Conciertos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Fiestas</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Soporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Términos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Síguenos</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SkipIT. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedEvent && (
        <DrinkMenu
          eventName={selectedEvent.name}
          drinks={drinks}
          cartItems={cartItems}
          onAddToCart={addToCart}
          onRemoveFromCart={removeFromCart}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        drinks={drinks}
        onGenerateQR={generateQR}
      />

        </>
      )}
    </div>
  );
}

export default App;