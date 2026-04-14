import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-4.0.3',
      title: 'KOENMA SUSHI',
      subtitle: 'Experiência gastronômica japonesa autêntica'
    },
    {
      image: 'https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?ixlib=rb-4.0.3',
      title: 'SABORES EXCLUSIVOS',
      subtitle: 'Ingredientes frescos e selecionados'
    },
    {
      image: 'https://djapa.com.br/wp-content/uploads/2025/07/sushi-sao-paulo-principal.jpg',
      title: 'SASHIMI FRESCO',
      subtitle: 'O melhor da culinária japonesa'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleVerCardapio = () => {
    navigate('/cardapio');
  };

  return (
    <section className="hero-carousel">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="hero-slide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${slides[currentSlide].image})`
          }}
        >
          <div className="hero-overlay"></div>
          <motion.div 
            className="hero-content"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <motion.h1 
              className="hero-title"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {slides[currentSlide].title}
            </motion.h1>
            <motion.p 
              className="hero-subtitle"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              {slides[currentSlide].subtitle}
            </motion.p>
            <motion.button 
              className="hero-btn"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleVerCardapio}
            >
              Ver Cardápio
            </motion.button>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <button className="carousel-btn prev" onClick={prevSlide}>
        <FiChevronLeft />
      </button>
      <button className="carousel-btn next" onClick={nextSlide}>
        <FiChevronRight />
      </button>

      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;