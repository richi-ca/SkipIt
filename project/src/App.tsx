import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AgeVerification from './components/AgeVerification';
import UnderageBlock from './components/UnderageBlock';
import { events, Event, Order, findProductByVariationId } from './data/mockData';
import LoginPrompt from './components/LoginPrompt';
import PaymentModal from './components/PaymentModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { OrderProvider, useOrders } from './context/OrderContext';
import OrderTypeSelectionModal from './components/OrderTypeSelectionModal';
import ManageOrderModal from './components/ManageOrderModal';
import MultiQRCodeModal from './components/MultiQRCodeModal';
import ScrollToTop from './components/ScrollToTop';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import ConfirmationModal from './components/ConfirmationModal';
import QRCode from './components/QRCode';
import DrinkMenu from './components/DrinkMenu';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ScannerLayout from './layouts/ScannerLayout';
import AdminRoute from './components/AdminRoute';

// Pages
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ProfilePage from './pages/ProfilePage';
import LoginPageHandler from './pages/LoginPageHandler';
import ScannerDashboard from './pages/ScannerDashboard';
import ScannerHistoryPage from './pages/ScannerHistoryPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import EventsMaintainer from './pages/admin/maintainers/EventsMaintainer';
import MenusMaintainer from './pages/admin/maintainers/MenusMaintainer';
import ProductsMaintainer from './pages/admin/maintainers/ProductsMaintainer';
import CategoriesMaintainer from './pages/admin/maintainers/CategoriesMaintainer';
import UsersMaintainer from './pages/admin/maintainers/UsersMaintainer';
import CMSPage from './pages/admin/cms/CMSPage';
import MockWebpay from './pages/MockWebpay';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';


import { toast } from 'react-hot-toast';

// --- Security Components ---
function SecurityGuard() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'scanner') {
      // Force scanner role to stay in /scanner
      if (!location.pathname.startsWith('/scanner')) {
        navigate('/scanner', { replace: true });
      }
    }
  }, [user, location, navigate]);

  return null;
}

function ClientGuard({ children }: { children: React.ReactElement }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return null; // Wait for auth to settle

  // Scanner users should NEVER see the public client view
  if (user?.role === 'scanner') {
    return <Navigate to="/scanner" replace />;
  }

  // Admins are allowed (God mode), Clients are allowed, Guests are allowed.
  return children;
}

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
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
    </LocalizationProvider>
  );
}

function AppContent() {
  // Context Hooks
  const { cartItems, clearCart } = useCart();
  const { user, isAuthenticated, setActionAfterLogin } = useAuth();
  const { createOrder, storeActiveQRs } = useOrders();
  const navigate = useNavigate();

  // --- Global State (Age Verification) ---
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [showUnderageBlock, setShowUnderageBlock] = useState(false);

  // Estados de Modales Globales (Restaurados para control desde App)
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // --- Event & Cart Logic (Shared between layouts potentially, but mostly Public) ---
  // Nota: Idealmente esto debería moverse a un EventContext o similar para limpiar App.tsx,
  // pero por ahora lo mantenemos aquí para no romper la lógica de "DrinkMenu" que se abre sobre todo.
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [cartEvent, setCartEvent] = useState<Event | null>(null);
  const [pendingEventSelection, setPendingEventSelection] = useState<Event | null>(null);
  const [isCartConflictModalOpen, setIsCartConflictModalOpen] = useState(false);

  // Estado para controlar la visibilidad del carrito (Restaurado)
  const [isCartOpen, setIsCartOpen] = useState(false);

  // --- Payment & Order Logic ---
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);

  // --- QR & Order Management Modals ---
  const [isQROpen, setIsQROpen] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [isOrderTypeModalOpen, setIsOrderTypeModalOpen] = useState(false);
  const [isManageOrderModalOpen, setIsManageOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isMultiQrModalOpen, setIsMultiQrModalOpen] = useState(false);
  const [multiQrData, setMultiQrData] = useState<any[]>([]);

  // --- Age Verification Logic ---
  const handleAgeConfirm = () => {
    const verificationData = { verified: true, timestamp: new Date().getTime() };
    localStorage.setItem('ageVerified', JSON.stringify(verificationData));
    setIsAgeVerified(true);
  };

  const handleAgeDeny = () => { setShowUnderageBlock(true); };
  const handleGoBack = () => { setShowUnderageBlock(false); };

  useEffect(() => {
    const verificationDataString = localStorage.getItem('ageVerified');
    if (verificationDataString) {
      try {
        const verificationData = JSON.parse(verificationDataString);
        const now = new Date().getTime();
        const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000;
        if (verificationData.verified && (now - verificationData.timestamp < sevenDaysInMillis)) {
          setIsAgeVerified(true);
        } else {
          localStorage.removeItem('ageVerified');
        }
      } catch (error) {
        localStorage.removeItem('ageVerified');
      }
    }
  }, []);

  // --- Event Selection Handlers ---
  const handleEventSelection = (event: Event) => {
    const hasItems = Object.keys(cartItems).length > 0;
    if (hasItems && cartEvent && cartEvent.id !== event.id) {
      setPendingEventSelection(event);
      setIsCartConflictModalOpen(true);
    } else {
      setCartEvent(event);
      setSelectedEvent(event);
    }
  };

  const confirmChangeCartEvent = () => {
    if (pendingEventSelection) {
      clearCart();
      setCartEvent(pendingEventSelection);
      setSelectedEvent(pendingEventSelection);
      setPendingEventSelection(null);
      setIsCartConflictModalOpen(false);
    }
  };

  const cancelChangeCartEvent = () => {
    setPendingEventSelection(null);
    setIsCartConflictModalOpen(false);
  };

  // --- Payment Handlers ---
  const calculateTotal = () => {
    return Object.values(cartItems).reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Exposed to PublicLayout via Context or Prop drilling could be complex.
  // For now, we will pass these down or keep them here if they are triggered by Routes.
  // Actually, Cart is inside PublicLayout now. But checkout triggers logic here.
  // We need to expose a "handleCheckout" function to the Context or pass it down?
  // Simpler approach: PublicLayout manages UI, but logic stays here? No, let's migrate.
  // TEMPORARY FIX: Payment logic remains in App because Cart calls it.

  // ... (Existing Payment Logic Logic omitted for brevity, keeping as is mostly) ...
  const openPaymentModal = () => {
    const total = calculateTotal();
    setPaymentAmount(total);
    setIsCartOpen(false); // Cart logic is now in PublicLayout, this might need adjustment
    setIsPaymentModalOpen(true);
  }

  const handleInitiatePayment = async () => {
    if (!user) return;

    if (!cartEvent && (!cartItems || Object.keys(cartItems).length === 0)) {
      toast.error("El carrito está vacío o no tiene evento asociado.");
      return;
    }

    const itemsPayload = Object.values(cartItems).map((item) => {
      return {
        product_id: item.productId,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price
      };
    });

    const targetEventId = cartEvent?.id || (Object.values(cartItems)[0]?.eventId) || events[0].id;
    const total = calculateTotal();

    try {
      const createdOrder = await createOrder(targetEventId, itemsPayload, total, user.id);

      setIsPaymentModalOpen(false);

      if (createdOrder && createdOrder.orderId) {
        navigate(`/mock-webpay?orderId=${createdOrder.orderId}&amount=${total}`);
      } else {
        toast.error("Error al iniciar pago: No se recibió ID de orden.");
      }

    } catch (error: any) {
      console.error("Error al iniciar orden:", error);
      toast.error(error.message || "Hubo un problema al procesar tu pedido.");
    }
  };



  // ... (imports anteriores)

  // Dentro de AppContent:



  const handleCheckout = () => {
    if (!isAuthenticated || !user) {
      setActionAfterLogin(() => openPaymentModal);
      setIsCartOpen(false);
      setIsLoginPromptOpen(true);
    } else {
      openPaymentModal();
    }
  };

  // --- QR Handlers ---
  const handleOpenSingleQR = () => {
    if (!selectedOrder) return;
    const globalQrData = {
      type: 'GLOBAL',
      orderNumber: selectedOrder.orderId,
      eventName: selectedOrder.event.name,
      total: selectedOrder.total,
      drinks: selectedOrder.items.map(item => `${item.productName} (${item.variationName}) x${item.quantity}`)
    };
    // Removed claimFullOrder call here to prevent premature claiming
    storeActiveQRs(selectedOrder.orderId, [globalQrData]);
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

  return (
    <div className="min-h-screen bg-white">
      <SecurityGuard />
      <AgeVerification isOpen={!isAgeVerified && !showUnderageBlock} onConfirm={handleAgeConfirm} onDeny={handleAgeDeny} />
      <UnderageBlock isOpen={showUnderageBlock} onGoBack={handleGoBack} />

      {isAgeVerified && (
        <>
          <Routes>
            {/* === RUTAS PÚBLICAS (Cliente) === */}
            <Route element={
              <ClientGuard>
                <PublicLayout
                  isCartOpen={isCartOpen}
                  onOpenCart={() => setIsCartOpen(true)}
                  onCloseCart={() => setIsCartOpen(false)}
                  onCheckout={handleCheckout}
                  isLoginOpen={isLoginOpen}
                  setIsLoginOpen={setIsLoginOpen}
                  isRegisterOpen={isRegisterOpen}
                  setIsRegisterOpen={setIsRegisterOpen}
                />
              </ClientGuard>
            }>
              <Route
                path="/"
                element={
                  <HomePage
                    onSelectEvent={handleEventSelection}
                    onOpenRegister={() => setIsRegisterOpen(true)} // Register modal trigger
                  />
                }
              />
              <Route path="/events" element={<EventsPage onSelectEvent={handleEventSelection} />} />
              <Route path="/history" element={<OrderHistoryPage onManageOrder={(order) => { setSelectedOrder(order); setIsManageOrderModalOpen(true); }} />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/login" element={<LoginPageHandler onOpenLogin={() => { }} />} />
              <Route path="/mock-webpay" element={<MockWebpay />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/failure" element={<PaymentFailure />} />
            </Route>

            {/* === RUTAS PRIVADAS (Admin) === */}
            <Route path="/admin" element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="events" element={<EventsMaintainer />} />
                <Route path="menus" element={<MenusMaintainer />} />
                <Route path="categories" element={<CategoriesMaintainer />} />
                <Route path="users" element={<UsersMaintainer />} />
                <Route path="products" element={<ProductsMaintainer />} />
                <Route path="sales" element={<div className="p-10 text-2xl text-gray-600">Ventas & Scanner</div>} />
                <Route path="marketing" element={<div className="p-10 text-2xl text-gray-600">Marketing</div>} />
                <Route path="cms" element={<CMSPage />} />
              </Route>
            </Route>

            {/* === RUTAS PRIVADAS (Scanner/Staff) === */}
            <Route path="/scanner" element={<ScannerLayout />}>
              <Route index element={<ScannerDashboard />} />
              <Route path="history" element={<ScannerHistoryPage />} />
            </Route>
          </Routes>

          {/* --- Global Modals that sit on top of EVERYTHING (incl. Admin) --- */}
          {/* NOTE: Payment logic is currently coupled to App state. Needs refactoring to Context or custom Hook to move fully to PublicLayout. */}
          {/* For now, we render them here to keep functionality working. */}

          <ConfirmationModal
            isOpen={isCartConflictModalOpen}
            onClose={cancelChangeCartEvent}
            onConfirm={confirmChangeCartEvent}
            title="Cambiar de Evento"
            message={`Tu carrito contiene productos de ${cartEvent?.name}. Si continúas, se vaciará tu carrito actual. ¿Deseas proceder?`}
            confirmText="Sí, vaciar carrito"
            cancelText="Cancelar"
          />

          <PaymentModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            onPaymentSuccess={handleInitiatePayment}
            totalAmount={paymentAmount}
          />

          <LoginPrompt
            isOpen={isLoginPromptOpen}
            onClose={() => setIsLoginPromptOpen(false)}
            onConfirm={() => {
              setIsLoginPromptOpen(false);
              setIsLoginOpen(true);
            }}
          />

          {/* Order & QR Modals */}
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

          {isQROpen && orderData && (
            <QRCode
              isOpen={isQROpen}
              onClose={() => setIsQROpen(false)}
              {...orderData}
            />
          )}

          {/* Drink Menu is special because it overlays the whole page when an event is clicked */}
          {selectedEvent && (
            <DrinkMenu
              eventId={selectedEvent.id}
              onClose={() => setSelectedEvent(null)}
              onOpenCart={() => {
                setSelectedEvent(null);
                setIsCartOpen(true);
              }}
            />
          )}

          {/* Function to open cart from DrinkMenu */}
          {/* This function needs to be defined outside the JSX, or passed as a prop */}
          {/* For now, moving it outside the JSX block */}

          <Toaster />
        </>
      )}
    </div>
  );
}

export default App;
