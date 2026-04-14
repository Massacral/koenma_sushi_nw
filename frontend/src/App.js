import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CarrinhoProvider } from './context/CarrinhoContext';
import { PedidoProvider } from './context/PedidoContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Cardapio from './pages/Cardapio';
import ProdutoDetalhe from './pages/ProdutoDetalhe';
import Sobre from './pages/Sobre';
import Contato from './pages/Contato';
import Carrinho from './pages/Carrinho';
import Reservas from './pages/Reservas';
import MeusPedidos from './pages/MeusPedidos';
import AdminDashboard from './pages/AdminDashboard';
import LoginModal from './components/LoginModal';
import Termos from './pages/Termos';
import './styles/global.css';

function AppContent() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('login') === 'true') {
      setLoginModalOpen(true);
    }
  }, [location]);

  const handleOpenLoginModal = () => {
    setLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setLoginModalOpen(false);
  };

  return (
    <div className="App">
      <Navbar onLoginClick={handleOpenLoginModal} />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/cardapio" element={<Cardapio />} />
          <Route path="/produto/:id" element={<ProdutoDetalhe />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/termos" element={<Termos />} />
          <Route path="/meus-pedidos" element={<MeusPedidos />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <LoginModal isOpen={loginModalOpen} onClose={handleCloseLoginModal} />
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#d4af37',
            color: '#000',
          },
          success: {
            style: {
              background: '#d4af37',
              color: '#000',
            },
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <CarrinhoProvider>
          <PedidoProvider>
            <AppContent />
          </PedidoProvider>
        </CarrinhoProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;