import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const produtos = [
  {
    id: 1,
    nome: "Combo Especial Koenma",
    preco: "R$ 89,90",
    imagem: "https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=500&auto=format",
    descricao: "10 peças de sushi + 8 hot rolls + 4 temakis"
  },
  {
    id: 2,
    nome: "Sashimi Premium",
    preco: "R$ 45,90",
    imagem: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&auto=format",
    descricao: "Seleção nobre de salmão, atum e peixe branco"
  },
  {
    id: 3,
    nome: "Hot Roll Filadélfia",
    preco: "R$ 32,90",
    imagem: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=500&auto=format",
    descricao: "Salmão, cream cheese e cebolinha empanado"
  },
  {
    id: 4,
    nome: "Temaki Especial",
    preco: "R$ 24,90",
    imagem: "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=500&auto=format",
    descricao: "Salmão fresco, cream cheese e cebolinha"
  }
];

const Destaques = () => {
  const navigate = useNavigate();

  const handleVerDetalhes = (id) => {
    navigate(`/produto/${id}`);
  };

  return (
    <section className="destaques">
      <div className="container">
        <h2 className="section-title">PRATOS DESTAQUES</h2>
        <div className="produtos-grid">
          {produtos.map((produto, index) => (
            <motion.div 
              key={produto.id}
              className="produto-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className="produto-imagem">
                <img src={produto.imagem} alt={produto.nome} />
                <div className="produto-overlay">
                  <button 
                    className="btn-view"
                    onClick={() => handleVerDetalhes(produto.id)}
                  >
                    Ver Detalhes
                  </button>
                </div>
              </div>
              <div className="produto-info">
                <h3>{produto.nome}</h3>
                <p className="designer">{produto.descricao}</p>
                <p className="preco">{produto.preco}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Destaques;