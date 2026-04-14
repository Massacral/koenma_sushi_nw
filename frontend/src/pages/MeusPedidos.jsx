import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FiPackage, 
  FiClock, 
  FiCheckCircle, 
  FiTruck, 
  FiXCircle,
  FiChevronDown,
  FiChevronUp,
  FiCalendar,
  FiDollarSign,
  FiRefreshCw,
  FiShoppingBag
} from 'react-icons/fi';
import { usePedidos } from '../context/PedidoContext';
import { useAuth } from '../context/AuthContext';

const MeusPedidos = () => {
  const { pedidos, cancelarPedido, getStatusInfo } = usePedidos();
  const { usuario } = useAuth();
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [pedidoExpandido, setPedidoExpandido] = useState(null);

  // Filtrar pedidos APENAS do usuário logado
  const meusPedidos = pedidos.filter(p => p.usuarioEmail === usuario?.email);

  const statusFiltros = [
    { id: 'todos', nome: 'Todos', icone: '📋', count: meusPedidos.length },
    { id: 'AGUARDANDO_PAGAMENTO', nome: 'Aguardando', icone: '⏳', count: meusPedidos.filter(p => p.status === 'AGUARDANDO_PAGAMENTO').length },
    { id: 'PAGAMENTO_CONFIRMADO', nome: 'Confirmados', icone: '✅', count: meusPedidos.filter(p => p.status === 'PAGAMENTO_CONFIRMADO').length },
    { id: 'EM_PREPARACAO', nome: 'Preparando', icone: '👨‍🍳', count: meusPedidos.filter(p => p.status === 'EM_PREPARACAO').length },
    { id: 'SAIU_PARA_ENTREGA', nome: 'Enviados', icone: '🚚', count: meusPedidos.filter(p => p.status === 'SAIU_PARA_ENTREGA').length },
    { id: 'ENTREGUE', nome: 'Entregues', icone: '🎉', count: meusPedidos.filter(p => p.status === 'ENTREGUE').length },
    { id: 'CANCELADO', nome: 'Cancelados', icone: '❌', count: meusPedidos.filter(p => p.status === 'CANCELADO').length }
  ];

  const pedidosFiltrados = filtroStatus === 'todos' 
    ? meusPedidos 
    : meusPedidos.filter(p => p.status === filtroStatus);

  const formatarData = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatarMoeda = (valor) => {
    return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const podeCancelar = (status) => {
    return status !== 'ENTREGUE' && status !== 'CANCELADO' && status !== 'SAIU_PARA_ENTREGA';
  };

  if (!usuario) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="pedidos-page"
      >
        <div className="page-header sushi-header">
          <h1>MEUS PEDIDOS</h1>
          <p>Faça login para ver seus pedidos</p>
        </div>
        <div className="container">
          <div className="login-required">
            <FiPackage size={60} />
            <h2>Você precisa estar logado</h2>
            <p>Faça login para visualizar seu histórico de pedidos</p>
            <Link to="/?login=true" className="btn-luxury btn-sushi">
              Fazer Login
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pedidos-page"
    >
      <div className="page-header sushi-header">
        <h1>MEUS PEDIDOS</h1>
        <p>Histórico e acompanhamento dos seus pedidos</p>
      </div>

      <div className="container">
        {/* Filtros */}
        <div className="filtros-pedidos">
          {statusFiltros.map(filtro => (
            <button
              key={filtro.id}
              className={`filtro-status ${filtroStatus === filtro.id ? 'active' : ''}`}
              onClick={() => setFiltroStatus(filtro.id)}
            >
              <span className="filtro-icone">{filtro.icone}</span>
              <span className="filtro-nome">{filtro.nome}</span>
              {filtro.count > 0 && (
                <span className="filtro-contador">{filtro.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* Lista de Pedidos */}
        <div className="pedidos-lista">
          {pedidosFiltrados.length === 0 ? (
            <div className="nenhum-pedido">
              <FiShoppingBag size={60} />
              <h3>Nenhum pedido encontrado</h3>
              <p>Você ainda não possui pedidos nesta categoria</p>
              <Link to="/cardapio" className="btn-luxury btn-sushi">
                Ver Cardápio
              </Link>
            </div>
          ) : (
            pedidosFiltrados.map((pedido, index) => {
              const statusInfo = getStatusInfo(pedido.status);
              const estaExpandido = pedidoExpandido === pedido.id;

              return (
                <motion.div
                  key={pedido.id}
                  className="pedido-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="pedido-header">
                    <div className="pedido-info-header">
                      <div className="pedido-id">
                        <FiPackage />
                        <span>{pedido.id}</span>
                      </div>
                      <div className="pedido-data">
                        <FiCalendar />
                        <span>{formatarData(pedido.data)}</span>
                      </div>
                      <div className="pedido-total">
                        <FiDollarSign />
                        <span>R$ {formatarMoeda(pedido.total)}</span>
                      </div>
                    </div>
                    <div className="pedido-status-actions">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: statusInfo.cor }}
                      >
                        <span className="status-icone">{statusInfo.icone}</span>
                        <span className="status-nome">{statusInfo.nome}</span>
                      </span>
                      {podeCancelar(pedido.status) && (
                        <button 
                          className="btn-cancelar-pedido"
                          onClick={() => cancelarPedido(pedido.id)}
                        >
                          <FiXCircle /> Cancelar
                        </button>
                      )}
                      <button 
                        className="btn-expandir"
                        onClick={() => setPedidoExpandido(estaExpandido ? null : pedido.id)}
                      >
                        {estaExpandido ? <FiChevronUp /> : <FiChevronDown />}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {estaExpandido && (
                      <motion.div
                        className="pedido-detalhes"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Itens do Pedido */}
                        <div className="itens-pedido">
                          <h4>Itens do Pedido</h4>
                          {pedido.itens && pedido.itens.length > 0 ? (
                            pedido.itens.map((item, idx) => (
                              <div key={idx} className="item-pedido">
                                <img src={item.imagem} alt={item.nome} className="item-pedido-imagem" />
                                <div className="item-pedido-info">
                                  <h5>{item.nome}</h5>
                                  <p>Quantidade: {item.quantidade}</p>
                                </div>
                                <div className="item-pedido-preco">
                                  R$ {formatarMoeda(item.preco * item.quantidade)}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="sem-itens">Nenhum item encontrado</p>
                          )}
                        </div>

                        {/* Informações de Entrega */}
                        <div className="entrega-info">
                          <h4>Informações de Entrega</h4>
                          <p><strong>Endereço:</strong> {pedido.endereco}</p>
                          <p><strong>Forma de Pagamento:</strong> {pedido.metodoPagamento === 'pix' ? 'PIX (5% OFF)' : 'Cartão de Crédito'}</p>
                          {pedido.desconto > 0 && (
                            <p><strong>Desconto:</strong> R$ {formatarMoeda(pedido.desconto)}</p>
                          )}
                        </div>

                        {/* Timeline de Status */}
                        <div className="status-timeline">
                          <h4>Acompanhamento</h4>
                          <div className="timeline">
                            <div className={`timeline-step ${pedido.status !== 'CANCELADO' ? 'completed' : ''}`}>
                              <div className="step-icon">🛒</div>
                              <div className="step-label">Pedido Realizado</div>
                              <div className="step-date">{formatarData(pedido.data)}</div>
                            </div>
                            <div className={`timeline-step ${pedido.status === 'PAGAMENTO_CONFIRMADO' || pedido.status === 'EM_PREPARACAO' || pedido.status === 'SAIU_PARA_ENTREGA' || pedido.status === 'ENTREGUE' ? 'completed' : ''}`}>
                              <div className="step-icon">💰</div>
                              <div className="step-label">Pagamento Confirmado</div>
                            </div>
                            <div className={`timeline-step ${pedido.status === 'EM_PREPARACAO' || pedido.status === 'SAIU_PARA_ENTREGA' || pedido.status === 'ENTREGUE' ? 'completed' : ''}`}>
                              <div className="step-icon">👨‍🍳</div>
                              <div className="step-label">Em Preparação</div>
                            </div>
                            <div className={`timeline-step ${pedido.status === 'SAIU_PARA_ENTREGA' || pedido.status === 'ENTREGUE' ? 'completed' : ''}`}>
                              <div className="step-icon">🚚</div>
                              <div className="step-label">Saiu para Entrega</div>
                            </div>
                            <div className={`timeline-step ${pedido.status === 'ENTREGUE' ? 'completed' : ''}`}>
                              <div className="step-icon">🎉</div>
                              <div className="step-label">Entregue</div>
                            </div>
                          </div>
                        </div>

                        {pedido.status === 'CANCELADO' && (
                          <div className="cancelado-info">
                            <FiXCircle />
                            <p>Este pedido foi cancelado</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MeusPedidos;