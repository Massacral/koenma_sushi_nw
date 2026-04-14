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

  // Extrair termo de busca da URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const busca = params.get('busca');
    if (busca) {
      setTermoBusca(busca);
    } else {
      setTermoBusca('');
    }
  }, [location]);

  // Filtrar produtos por categoria e termo de busca
  const produtosFiltrados = produtos.filter(p => {
    // Filtro por categoria
    const categoriaMatch = filtro === 'todos' || p.categoria === filtro;
    
    // Filtro por termo de busca
    const buscaMatch = !termoBusca || 
      p.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
      p.descricao.toLowerCase().includes(termoBusca.toLowerCase()) ||
      p.categoria.toLowerCase().includes(termoBusca.toLowerCase());
    
    return categoriaMatch && buscaMatch;
  });

  // Ordenar produtos
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
      className="produtos-page"
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
                className={`filtro-btn ${filtro === cat.toLowerCase() ? 'active' : ''}`}
                onClick={() => setFiltro(cat.toLowerCase())}
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

        <div className="produtos-grid-full">
          {produtosOrdenados.map((produto, index) => (
            <motion.div
              key={produto.id}
              className="produto-card-full sushi-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="produto-imagem-full">
                <img 
                  src={produto.imagens[0]} 
                  alt={produto.nome}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x400?text=Imagem+não+encontrada';
                  }}
                />
                {produto.destaque && <span className="produto-condicao sushi-destaque">Destaque</span>}
              </div>
              <div className="produto-info-full">
                <h3>{produto.nome}</h3>
                <p className="categoria-item">{produto.categoria}</p>
                <p className="descricao">{produto.descricao.substring(0, 80)}...</p>
                <p className="preco">R$ {produto.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <Link to={`/produto/${produto.id}`} className="btn-comprar btn-sushi-detalhes">
                  Ver Detalhes
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {produtosOrdenados.length === 0 && (
          <div className="nenhum-produto">
            <h3>Nenhum item encontrado</h3>
            <p>Tente buscar por outro termo ou categoria</p>
            <Link to="/cardapio" className="btn-luxury btn-sushi">
              Limpar busca
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Cardapio;