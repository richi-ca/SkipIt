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
import { events, drinks, Event, User, Order } from './data/mockData';
import LoginPrompt from './components/LoginPrompt';
import PaymentModal from './components/PaymentModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { OrderProvider, useOrders } from './context/OrderContext';
import OrderTypeSelectionModal from './components/OrderTypeSelectionModal';
import ManageOrderModal from './components/ManageOrderModal';
import MultiQRCodeModal from './components/MultiQRCodeModal';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <AppContent />
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

function AppContent() {
  const { cartItems, clearCart } = useCart();
  const { user, login, isAuthenticated } = useAuth();
  const { addOrder, claimFullOrder, storeActiveQRs } = useOrders();

  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [showUnderageBlock, setShowUnderageBlock] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQROpen, setIsQROpen] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [actionAfterLogin, setActionAfterLogin] = useState<(() => void) | null>(null);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const lastScrollY = useRef(0);

  // State for new modals
  const [isOrderTypeModalOpen, setIsOrderTypeModalOpen] = useState(false);
  const [isManageOrderModalOpen, setIsManageOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isMultiQrModalOpen, setIsMultiQrModalOpen] = useState(false);
  const [multiQrData, setMultiQrData] = useState<any[]>([]);

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

  const openPaymentModal = () => {
    const total = drinks
      .filter(drink => cartItems[drink.id] > 0)
      .reduce((sum, drink) => sum + (drink.price * cartItems[drink.id]), 0);
    setPaymentAmount(total);
    setIsCartOpen(false);
    setIsPaymentModalOpen(true);
  }

  const handleCheckout = () => {
    if (!isAuthenticated || !user) {
      setActionAfterLogin(() => openPaymentModal);
      setIsCartOpen(false);
      setIsLoginPromptOpen(true);
    } else {
      openPaymentModal();
    }
  };

  const handlePaymentSuccess = () => {
    if (!user) return;

    const cartDrinks = drinks.filter(drink => cartItems[drink.id] > 0);
    const total = cartDrinks.reduce((sum, drink) => sum + (drink.price * cartItems[drink.id]), 0);

    const newOrder: Order = {
      orderId: `SK${Date.now().toString().slice(-6)}`,
      userId: user.id,
      date: new Date().toLocaleDateString(),
      event: selectedEvent || events[0],
      items: cartDrinks.map(drink => ({
        drink: drink,
        quantity: cartItems[drink.id],
        claimed: 0
      })),
      total: total,
      status: 'COMPLETED'
    };

    addOrder(newOrder);
    setSelectedOrder(newOrder);
    clearCart();
    setIsPaymentModalOpen(false);
    setIsOrderTypeModalOpen(true);
  };

  const handleOpenSingleQR = () => {
    if (!selectedOrder) return;

    const globalQrData = {
      type: 'GLOBAL',
      orderNumber: selectedOrder.orderId,
      eventName: selectedOrder.event.name,
      total: selectedOrder.total,
      drinks: selectedOrder.items.map(item => `${item.drink.name} x${item.quantity}`)
    };

    // Mark the order as fully claimed and store the global QR as active
    claimFullOrder(selectedOrder.orderId);
    storeActiveQRs(selectedOrder.orderId, [globalQrData]);

    // Set data for display and open the modal
    setOrderData(globalQrData);
    setIsOrderTypeModalOpen(false);
    setIsQROpen(true);
  };

  const handleOpenManageModal = () => {
    setIsOrderTypeModalOpen(false);
    setIsManageOrderModalOpen(true);
  };

  const handleViewSingleQR = (qrData: any) => {
    setOrderData(qrData);
    setIsManageOrderModalOpen(false);
    setIsQROpen(true);
  };

  const handleGenerateIndividualQRs = (qrDataList: any[]) => {
    setMultiQrData(qrDataList);
    setIsManageOrderModalOpen(false);
    setIsMultiQrModalOpen(true);
  };

  const handleOpenCartFromMenu = () => {
    setSelectedEvent(null);
    setIsCartOpen(true);
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
              <Route path="/history" element={<OrderHistoryPage onManageOrder={(order) => { setSelectedOrder(order); setIsManageOrderModalOpen(true); }} />} />
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

          <OrderTypeSelectionModal
            isOpen={isOrderTypeModalOpen}
            onClose={() => setIsOrderTypeModalOpen(false)}
            onSelectSingleQR={handleOpenSingleQR}
            onSelectIndividual={handleOpenManageModal}
          />

          <ManageOrderModal
            isOpen={isManageOrderModalOpen}
            onClose={() => setIsManageOrderModalOpen(false)}
            order={selectedOrder}
            onShowQRs={handleGenerateIndividualQRs}
            onViewGlobalQR={handleViewSingleQR}
          />

          <MultiQRCodeModal
            isOpen={isMultiQrModalOpen}
            onClose={() => setIsMultiQrModalOpen(false)}
            qrDataList={multiQrData}
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
              onOpenCart={handleOpenCartFromMenu}
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

          <Footer />
        </>
      )}
    </div>
  );
}

export default App;
