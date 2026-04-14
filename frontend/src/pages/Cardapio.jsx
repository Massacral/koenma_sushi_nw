import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { produtos } from '../data/produtos';

const Cardapio = () => {
  const [filtro, setFiltro] = useState('todos');
  const [ordenacao, setOrdenacao] = useState('recentes');
  const [termoBusca, setTermoBusca] = useState('');
  const location = useLocation();

  const categorias = ['todos', 'Sushis', 'Temakis', 'Hot Rolls', 'Entradas', 'Bebidas', 'Sobremesas'];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const busca = params.get('busca');
    const categoria = params.get('categoria');
    
    if (busca) {
      setTermoBusca(busca);
    } else {
      setTermoBusca('');
    }
    
    if (categoria && categorias.includes(categoria)) {
      setFiltro(categoria);
    } else if (!categoria) {
      setFiltro('todos');
    }
  }, [location]);

  const produtosFiltrados = produtos.filter(p => {
    const categoriaMatch = filtro === 'todos' || p.categoria === filtro;
    const buscaMatch = !termoBusca || 
      p.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
      p.descricao.toLowerCase().includes(termoBusca.toLowerCase()) ||
      p.categoria.toLowerCase().includes(termoBusca.toLowerCase());
    return categoriaMatch && buscaMatch;
  });

  const produtosOrdenados = [...produtosFiltrados].sort((a, b) => {
    if (ordenacao === 'menor-preco') {
      return a.preco - b.preco;
    } else if (ordenacao === 'maior-preco') {
      return b.preco - a.preco;
    } else {
      return b.id - a.id;
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="cardapio-page"
    >
      <div className="page-header sushi-header">
        <h1>NOSSO CARDÁPIO</h1>
        <p>Delícias japonesas preparadas com ingredientes frescos e selecionados</p>
        {termoBusca && (
          <p className="resultado-busca">
            Resultados para: <strong>"{termoBusca}"</strong>
          </p>
        )}
      </div>

      <div className="container">
        <div className="filtros-section">
          <div className="categorias-filtro">
            {categorias.map(cat => (
              <button
                key={cat}
                className={`filtro-btn ${filtro === cat ? 'active' : ''}`}
                onClick={() => setFiltro(cat)}
              >
                {cat === 'todos' ? 'Todos' : cat}
              </button>
            ))}
          </div>

          <select 
            className="ordenacao-select"
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value)}
          >
            <option value="recentes">Mais Recentes</option>
            <option value="menor-preco">Menor Preço</option>
            <option value="maior-preco">Maior Preço</option>
          </select>
        </div>

        <div className="cardapio-grid">
          {produtosOrdenados.map((produto, index) => (
            <motion.div
              key={produto.id}
              className="cardapio-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="cardapio-imagem-container">
                <img 
                  src={produto.imagens[0]} 
                  alt={produto.nome}
                  className="cardapio-imagem"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Koenma+Sushi';
                  }}
                />
                {produto.destaque && <span className="destaque-badge">Destaque</span>}
              </div>
              <div className="cardapio-info">
                <div className="cardapio-categoria">{produto.categoria}</div>
                <h3 className="cardapio-nome">{produto.nome}</h3>
                <p className="cardapio-descricao">{produto.descricao.substring(0, 100)}...</p>
                <div className="cardapio-preco">
                  <span>R$ {produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  <Link to={`/produto/${produto.id}`} className="btn-detalhes-cardapio">
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {produtosOrdenados.length === 0 && (
          <div className="nenhum-item">
            <h3>Nenhum item encontrado</h3>
            <p>Tente buscar por outro termo ou categoria</p>
            <button onClick={() => setFiltro('todos')} className="btn-luxury btn-sushi">
              Ver todos os itens
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Cardapio;