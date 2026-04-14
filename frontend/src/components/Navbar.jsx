import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiShoppingBag, 
  FiUser, 
  FiSearch, 
  FiMenu, 
  FiX, 
  FiPackage, 
  FiLogOut,
  FiSettings,
  FiHome,
  FiBookOpen,
  FiCalendar,
  FiInfo,
  FiMail
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCarrinho } from '../context/CarrinhoContext';

const Navbar = ({ onLoginClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { usuario, logout } = useAuth();
  const { getTotalItens } = useCarrinho();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/cardapio?busca=${encodeURIComponent(searchTerm)}`);
      setSearchOpen(false);
      setSearchTerm('');
    }
  };

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Verificar se é admin
  const isAdmin = usuario?.email === 'admin@sushi.com' || usuario?.tipo === 'admin';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <motion.div 
          className="navbar-logo"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/">KOENMA SUSHI</Link>
        </motion.div>

        <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>
            <FiHome size={14} /> Home
          </Link>
          <Link to="/cardapio" className="nav-link" onClick={() => setIsOpen(false)}>
            <FiBookOpen size={14} /> Cardápio
          </Link>
          <Link to="/reservas" className="nav-link" onClick={() => setIsOpen(false)}>
            <FiCalendar size={14} /> Reservas
          </Link>
          <Link to="/sobre" className="nav-link" onClick={() => setIsOpen(false)}>
            <FiInfo size={14} /> Sobre
          </Link>
          <Link to="/contato" className="nav-link" onClick={() => setIsOpen(false)}>
            <FiMail size={14} /> Contato
          </Link>
          {isAdmin && (
            <Link to="/admin" className="nav-link admin-link" onClick={() => setIsOpen(false)}>
              <FiSettings size={14} /> Admin
            </Link>
          )}
        </div>

        <div className="navbar-icons">
          <FiSearch 
            className="nav-icon" 
            onClick={() => setSearchOpen(!searchOpen)}
          />
          
          {usuario ? (
            <div className="user-menu logged">
              <FiUser className="nav-icon" />
              <div className="user-dropdown">
                <div className="user-info">
                  <span className="user-name">Olá, {usuario.nome}</span>
                  <span className="user-email">{usuario.email}</span>
                </div>
                <Link to="/meus-pedidos" className="dropdown-link" onClick={() => setIsOpen(false)}>
                  <FiPackage size={16} />
                  Meus Pedidos
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="dropdown-link" onClick={() => setIsOpen(false)}>
                    <FiSettings size={16} />
                    Painel Admin
                  </Link>
                )}
                <button onClick={handleLogout}>
                  <FiLogOut size={16} />
                  Sair
                </button>
              </div>
            </div>
          ) : (
            <FiUser className="nav-icon" onClick={handleLoginClick} />
          )}
          
          <Link to="/carrinho" className="carrinho-icon">
            <FiShoppingBag className="nav-icon" />
            {getTotalItens() > 0 && (
              <span className="carrinho-badge">{getTotalItens()}</span>
            )}
          </Link>
          
          <div className="mobile-menu-icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <FiX /> : <FiMenu />}
          </div>
        </div>

        {searchOpen && (
          <motion.form 
            className="search-bar"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSearch}
          >
            <input 
              type="text" 
              placeholder="Buscar no cardápio..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            <button type="submit" className="search-btn">Buscar</button>
          </motion.form>
        )}
      </div>
    </nav>
  );
};

export default Navbar;