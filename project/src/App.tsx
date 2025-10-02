import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import DrinkMenu from './components/DrinkMenu';
import Cart from './components/Cart';
import QRCode from './components/QRCode';
import AgeVerification from './components/AgeVerification';
import UnderageBlock from './components/UnderageBlock';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import { events, drinks, Event, User } from './data/mockData';
import LoginPrompt from './components/LoginPrompt';
import PaymentModal from './components/PaymentModal';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const { cartItems, clearCart } = useCart();
  const { login, isAuthenticated } = useAuth();
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [showUnderageBlock, setShowUnderageBlock] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [orderData, setOrderData] = useState<{
    orderNumber: string;
    eventName: string;
    total: number;
    drinks: string[];
  } | null>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [actionAfterLogin, setActionAfterLogin] = useState<(() => void) | null>(null);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const lastScrollY = useRef(0);

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

  const handleLoginSuccess = (loggedInUser: User) => {
    login(loggedInUser);
    setIsLoginOpen(false);
    if (actionAfterLogin) {
      actionAfterLogin();
      setActionAfterLogin(null);
    }
  };

  useEffect(() => {
    const ageVerified = localStorage.getItem('ageVerified');
    if (ageVerified === 'true') {
      setIsAgeVerified(true);
    }
  }, []);

  useEffect(() => {
    const controlHeader = () => {
      if (window.scrollY > lastScrollY.current && window.scrollY > 100) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
      lastScrollY.current = window.scrollY;
    };

    window.addEventListener('scroll', controlHeader);
    return () => {
      window.removeEventListener('scroll', controlHeader);
    };
  }, []);

  const generateQR = () => {
    const cartDrinks = drinks.filter(drink => cartItems[drink.id] > 0);
    const total = cartDrinks.reduce((sum, drink) => sum + (drink.price * cartItems[drink.id]), 0);
    const drinkList = cartDrinks.map(drink => `${drink.name} x${cartItems[drink.id]}`);
    setOrderData({
      orderNumber: `SK${Date.now().toString().slice(-6)}`,
      eventName: selectedEvent?.name || 'Evento General',
      total,
      drinks: drinkList
    });
    clearCart();
    setIsCartOpen(false);
    setIsQROpen(true);
  };

  const openPaymentModal = () => {
    const total = drinks
      .filter(drink => cartItems[drink.id] > 0)
      .reduce((sum, drink) => sum + (drink.price * cartItems[drink.id]), 0);
    setPaymentAmount(total);
    setIsCartOpen(false);
    setIsPaymentModalOpen(true);
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setActionAfterLogin(() => openPaymentModal);
      setIsCartOpen(false);
      setIsLoginPromptOpen(true);
    } else {
      openPaymentModal();
    }
  };

  const handlePaymentSuccess = () => {
    setIsPaymentModalOpen(false);
    generateQR();
  };

  return (
    <div className="min-h-screen bg-white">
      <AgeVerification isOpen={!isAgeVerified && !showUnderageBlock} onConfirm={handleAgeConfirm} onDeny={handleAgeDeny} />
      <UnderageBlock isOpen={showUnderageBlock} onGoBack={handleGoBack} />

      {isAgeVerified && (
        <>
          <Header 
            isVisible={isHeaderVisible}
            onOpenLogin={() => setIsLoginOpen(true)}
            onOpenRegister={() => setIsRegisterOpen(true)}
            onOpenCart={() => setIsCartOpen(true)}
          />

          <main>
            <Routes>
              <Route path="/" element={<HomePage events={events} onSelectEvent={setSelectedEvent} onOpenRegister={() => setIsRegisterOpen(true)} />} />
              <Route path="/events" element={<EventsPage onSelectEvent={setSelectedEvent} />} />
              <Route path="/history" element={<OrderHistoryPage />} />
            </Routes>
          </main>

          <LoginPrompt
            isOpen={isLoginPromptOpen}
            onClose={() => setIsLoginPromptOpen(false)}
            onConfirm={() => {
              setIsLoginPromptOpen(false);
              setIsLoginOpen(true);
            }}
          />

          <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            onPaymentSuccess={handlePaymentSuccess}
            totalAmount={paymentAmount}
          />

          <LoginModal 
            isOpen={isLoginOpen} 
            onClose={() => setIsLoginOpen(false)} 
            onSwitchToRegister={() => { setIsLoginOpen(false); setIsRegisterOpen(true); }} 
            onLoginSuccess={handleLoginSuccess}
          />
          <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} onSwitchToLogin={() => { setIsRegisterOpen(false); setIsLoginOpen(true); }} />
          
          {selectedEvent && (
            <DrinkMenu
              eventName={selectedEvent.name}
              drinks={drinks}
              onClose={() => setSelectedEvent(null)}
            />
          )}

          <Cart
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            drinks={drinks}
            onGenerateQR={handleCheckout}
          />

          {isQROpen && orderData && (
            <QRCode
              isOpen={isQROpen}
              onClose={() => setIsQROpen(false)}
              {...orderData}
            />
          )}

          <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
                    <span className="text-xl font-bold">SkipIT</span>
                  </div>
                  <p className="text-gray-400">Salta la fila, disfruta más.</p>
                </div>
                <div>
                  <h3 className="font-bold mb-4">Navegación</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li><Link to="/" className="hover:text-white">Inicio</Link></li>
                    <li><Link to="/events" className="hover:text-white">Eventos</Link></li>
                    <li><Link to="#quienesSomos?" className="hover:text-white">Quienes Somos?</Link></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold mb-4">Soporte</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="#" className="hover:text-white">Términos</a></li>
                    <li><a href="#" className="hover:text-white">Privacidad</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold mb-4">Síguenos</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2025 SkipIT. Todos los derechos reservados.</p>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}

export default App;
