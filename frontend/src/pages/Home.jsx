import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import Destaques from '../components/Destaques';
import Categorias from '../components/Categorias';

const Home = () => {
  const navigate = useNavigate();

  const handleVerCardapio = () => {
    navigate('/cardapio');
  };

  const handleFazerReserva = () => {
    navigate('/reservas');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="home-page"
    >
      <Hero />
      <Destaques />
      <Categorias />
      
      <section className="luxury-message sushi-message">
        <div className="container">
          <h2>KOENMA SUSHI</h2>
          <p>Experimente o verdadeiro sabor da culinária japonesa em um ambiente acolhedor e sofisticado. Ingredientes frescos, preparo artesanal e uma explosão de sabores que encantam desde o primeiro contato.</p>
          <div className="botoes-home">
            <button 
              className="btn-luxury btn-sushi"
              onClick={handleVerCardapio}
            >
              Ver Cardápio
            </button>
            <button 
              className="btn-luxury btn-reserva"
              onClick={handleFazerReserva}
            >
              Fazer Reserva
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;