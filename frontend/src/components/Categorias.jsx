import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const categorias = [
  { 
    nome: 'Sushis', 
    imagem: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=500&auto=format",
    descricao: "Tradicionais e saborosos",
    link: "/cardapio?categoria=Sushis"
  },
  { 
    nome: 'Temakis', 
    imagem: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=500&auto=format',
    descricao: "Crocantes e recheados",
    link: "/cardapio?categoria=Temakis"
  },
  { 
    nome: 'Hot Rolls', 
    imagem: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=500&auto=format',
    descricao: "Grelhados e empanados",
    link: "/cardapio?categoria=Hot%20Rolls"
  },
  { 
    nome: 'Entradas', 
    imagem: 'https://images.unsplash.com/photo-1613514785940-daef0771c5b6?w=500&auto=format',
    descricao: "Harumaki, Gyoza e mais",
    link: "/cardapio?categoria=Entradas"
  },
  { 
    nome: 'Bebidas', 
    imagem: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=500&auto=format',
    descricao: "Sucos, chás e bebidas",
    link: "/cardapio?categoria=Bebidas"
  },
  { 
    nome: 'Sobremesas', 
    imagem: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500&auto=format',
    descricao: "Mochi, tempurá de sorvete",
    link: "/cardapio?categoria=Sobremesas"
  }
];

const Categorias = () => {
  const navigate = useNavigate();

  const handleCategoriaClick = (link) => {
    navigate(link);
  };

  return (
    <section className="categorias">
      <div className="container">
        <h2 className="section-title">CATEGORIAS</h2>
        <div className="categorias-grid">
          {categorias.map((categoria, index) => (
            <motion.div
              key={index}
              className="categoria-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleCategoriaClick(categoria.link)}
            >
              <img src={categoria.imagem} alt={categoria.nome} />
              <div className="categoria-overlay">
                <h3>{categoria.nome}</h3>
                <p>{categoria.descricao}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categorias;