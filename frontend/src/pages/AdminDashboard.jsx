import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  FiSearch,
  FiUser,
  FiShoppingBag,
  FiPrinter,
  FiMail,
  FiPhone,
  FiEdit,
  FiSettings,
  FiUsers,
  FiTag,
  FiBookOpen,
  FiHome,
  FiLogOut,
  FiBarChart2,
  FiRefreshCw
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { usePedidos } from '../context/PedidoContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { pedidos: pedidosContext, atualizarStatus, getStatusInfo, setPedidos: setPedidosContext } = usePedidos();
  const { usuario, logout } = useAuth();
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [pedidoExpandido, setPedidoExpandido] = useState(null);
  const [termoBusca, setTermoBusca] = useState('');
  const [abaAtiva, setAbaAtiva] = useState('pedidos');
  const [estatisticas, setEstatisticas] = useState({
    totalPedidos: 0,
    faturamentoTotal: 0,
    pedidosPendentes: 0,
    ticketMedio: 0,
    pedidosHoje: 0
  });
  const [atualizando, setAtualizando] = useState(false);
  const [pedidos, setPedidos] = useState(pedidosContext || []);

  // Verificar se é admin
  const isAdmin = usuario?.email === 'admin@sushi.com' || usuario?.tipo === 'admin';

  // Função para carregar pedidos do localStorage
  const carregarPedidos = useCallback(() => {
    const pedidosSalvos = localStorage.getItem('@KoenmaSushi:pedidos_global');
    if (pedidosSalvos) {
      const novosPedidos = JSON.parse(pedidosSalvos);
      setPedidos(novosPedidos);
      if (setPedidosContext) {
        setPedidosContext(novosPedidos);
      }
      return novosPedidos;
    }
    return [];
  }, [setPedidosContext]);

  // Atualizar automaticamente a cada 2 segundos
  useEffect(() => {
    // Carregar imediatamente
    carregarPedidos();

    // Configurar intervalo para atualizar automaticamente
    const interval = setInterval(() => {
      const novosPedidos = carregarPedidos();
      if (JSON.stringify(novosPedidos) !== JSON.stringify(pedidos)) {
        console.log('🔄 Pedidos atualizados automaticamente!');
      }
    }, 2000); // Atualiza a cada 2 segundos

    return () => clearInterval(interval);
  }, [carregarPedidos, pedidos]);

  // Calcular estatísticas
  useEffect(() => {
    if (pedidos.length > 0) {
      const hoje = new Date().toDateString();
      const pedidosHoje = pedidos.filter(p => new Date(p.data).toDateString() === hoje);
      const total = pedidos.reduce((acc, p) => acc + p.total, 0);
      const pendentes = pedidos.filter(p => p.status === 'AGUARDANDO_PAGAMENTO').length;

      setEstatisticas({
        totalPedidos: pedidos.length,
        faturamentoTotal: total,
        pedidosPendentes: pendentes,
        ticketMedio: total / pedidos.length,
        pedidosHoje: pedidosHoje.length
      });
    } else {
      setEstatisticas({
        totalPedidos: 0,
        faturamentoTotal: 0,
        pedidosPendentes: 0,
        ticketMedio: 0,
        pedidosHoje: 0
      });
    }
  }, [pedidos]);

  const statusFiltros = [
    { id: 'todos', nome: 'Todos', icone: '📋', count: pedidos.length },
    { id: 'AGUARDANDO_PAGAMENTO', nome: 'Aguardando Pagamento', icone: '⏳', count: pedidos.filter(p => p.status === 'AGUARDANDO_PAGAMENTO').length },
    { id: 'PAGAMENTO_CONFIRMADO', nome: 'Pagamento Confirmado', icone: '✅', count: pedidos.filter(p => p.status === 'PAGAMENTO_CONFIRMADO').length },
    { id: 'EM_PREPARACAO', nome: 'Em Preparação', icone: '👨‍🍳', count: pedidos.filter(p => p.status === 'EM_PREPARACAO').length },
    { id: 'SAIU_PARA_ENTREGA', nome: 'Saiu para Entrega', icone: '🚚', count: pedidos.filter(p => p.status === 'SAIU_PARA_ENTREGA').length },
    { id: 'ENTREGUE', nome: 'Entregue', icone: '🎉', count: pedidos.filter(p => p.status === 'ENTREGUE').length },
    { id: 'CANCELADO', nome: 'Cancelado', icone: '❌', count: pedidos.filter(p => p.status === 'CANCELADO').length }
  ];

  const pedidosFiltrados = pedidos.filter(p => {
    const matchStatus = filtroStatus === 'todos' || p.status === filtroStatus;
    const matchBusca = !termoBusca || 
      p.id.toLowerCase().includes(termoBusca.toLowerCase()) ||
      p.itens?.some(item => item.nome.toLowerCase().includes(termoBusca.toLowerCase()));
    return matchStatus && matchBusca;
  });

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

  const handleAtualizarStatus = async (pedidoId, novoStatus) => {
    setAtualizando(true);
    await atualizarStatus(pedidoId, novoStatus);
    // Recarregar pedidos após atualizar status
    setTimeout(() => {
      carregarPedidos();
    }, 500);
    setAtualizando(false);
  };

  const handleAtualizarLista = () => {
    carregarPedidos();
    toast.success('Lista de pedidos atualizada!');
  };

  const getStatusActions = (statusAtual) => {
    if (statusAtual === 'AGUARDANDO_PAGAMENTO') {
      return [
        { status: 'PAGAMENTO_CONFIRMADO', label: '💰 Confirmar Pagamento', icone: '💰', cor: '#4caf50' },
        { status: 'CANCELADO', label: '❌ Cancelar Pedido', icone: '❌', cor: '#f44336' }
      ];
    } else if (statusAtual === 'PAGAMENTO_CONFIRMADO') {
      return [
        { status: 'EM_PREPARACAO', label: '👨‍🍳 Iniciar Preparação', icone: '👨‍🍳', cor: '#9c27b0' }
      ];
    } else if (statusAtual === 'EM_PREPARACAO') {
      return [
        { status: 'SAIU_PARA_ENTREGA', label: '🚚 Saiu para Entrega', icone: '🚚', cor: '#ff9800' }
      ];
    } else if (statusAtual === 'SAIU_PARA_ENTREGA') {
      return [
        { status: 'ENTREGUE', label: '🎉 Marcar como Entregue', icone: '🎉', cor: '#2196f3' }
      ];
    }
    return [];
  };

  const abas = [
    { id: 'pedidos', nome: 'Pedidos', icone: <FiPackage size={18} /> },
    { id: 'estatisticas', nome: 'Estatísticas', icone: <FiBarChart2 size={18} /> }
  ];

  if (!isAdmin && usuario) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="admin-page"
      >
        <div className="page-header sushi-header">
          <h1>ACESSO RESTRITO</h1>
          <p>Esta área é exclusiva para administradores</p>
        </div>
        <div className="container">
          <div className="acesso-negado">
            <FiSettings size={60} />
            <h2>Acesso Negado</h2>
            <p>Você não tem permissão para acessar esta página.</p>
            <button onClick={() => window.location.href = '/'} className="btn-luxury btn-sushi">
              Voltar para Home
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="admin-dashboard"
    >
      {/* Header */}
      <div className="admin-header">
        <div className="container">
          <div className="admin-header-content">
            <div>
              <h1>Painel Administrativo</h1>
              <p>Gerencie pedidos do Koenma Sushi</p>
            </div>
            <div className="admin-user-info">
              <div className="admin-avatar">
                <FiUser size={24} />
              </div>
              <div className="admin-user-text">
                <strong>{usuario?.nome || 'Administrador'}</strong>
                <span>{usuario?.email}</span>
              </div>
              <button onClick={handleAtualizarLista} className="btn-atualizar-admin" title="Atualizar pedidos">
                <FiRefreshCw /> Atualizar
              </button>
              <button onClick={logout} className="btn-logout-admin">
                <FiLogOut /> Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container">
        <div className="admin-stats-grid">
          <div className="stat-card-admin">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>Total de Pedidos</h3>
              <p>{estatisticas.totalPedidos}</p>
            </div>
          </div>
          <div className="stat-card-admin">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>Faturamento Total</h3>
              <p>R$ {formatarMoeda(estatisticas.faturamentoTotal)}</p>
            </div>
          </div>
          <div className="stat-card-admin">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>Pedidos Pendentes</h3>
              <p>{estatisticas.pedidosPendentes}</p>
            </div>
          </div>
          <div className="stat-card-admin">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>Ticket Médio</h3>
              <p>R$ {formatarMoeda(estatisticas.ticketMedio)}</p>
            </div>
          </div>
          <div className="stat-card-admin">
            <div className="stat-icon">📅</div>
            <div className="stat-info">
              <h3>Pedidos Hoje</h3>
              <p>{estatisticas.pedidosHoje}</p>
            </div>
          </div>
        </div>

        {/* Abas */}
        <div className="admin-tabs">
          {abas.map(aba => (
            <button
              key={aba.id}
              className={`admin-tab ${abaAtiva === aba.id ? 'active' : ''}`}
              onClick={() => setAbaAtiva(aba.id)}
            >
              {aba.icone}
              {aba.nome}
            </button>
          ))}
        </div>

        {/* Conteúdo das Abas */}
        <AnimatePresence mode="wait">
          {abaAtiva === 'pedidos' && (
            <motion.div
              key="pedidos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="admin-content"
            >
              {/* Filtros e Busca */}
              <div className="admin-filtros">
                <div className="busca-admin">
                  <FiSearch />
                  <input
                    type="text"
                    placeholder="Buscar por pedido ou produto..."
                    value={termoBusca}
                    onChange={(e) => setTermoBusca(e.target.value)}
                  />
                </div>
                <div className="filtros-status">
                  {statusFiltros.map(filtro => (
                    <button
                      key={filtro.id}
                      className={`filtro-status-btn ${filtroStatus === filtro.id ? 'active' : ''}`}
                      onClick={() => setFiltroStatus(filtro.id)}
                    >
                      {filtro.icone}
                      {filtro.nome}
                      <span className="contador">{filtro.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Lista de Pedidos */}
              <div className="pedidos-lista-admin">
                {pedidosFiltrados.length === 0 ? (
                  <div className="nenhum-pedido">
                    <FiPackage size={60} />
                    <h3>Nenhum pedido encontrado</h3>
                    <p>Tente buscar por outro termo ou categoria</p>
                  </div>
                ) : (
                  pedidosFiltrados.map((pedido, index) => {
                    const statusInfo = getStatusInfo(pedido.status);
                    const estaExpandido = pedidoExpandido === pedido.id;
                    const actions = getStatusActions(pedido.status);

                    return (
                      <div key={pedido.id} className="pedido-card-admin">
                        <div className="pedido-header-admin">
                          <div className="pedido-info">
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
                          <div className="pedido-actions">
                            <span className="status-badge" style={{ backgroundColor: statusInfo.cor }}>
                              {statusInfo.icone} {statusInfo.nome}
                            </span>
                            <div className="status-buttons">
                              {actions.map(action => (
                                <button
                                  key={action.status}
                                  className="btn-status-update"
                                  style={{ backgroundColor: action.cor }}
                                  onClick={() => handleAtualizarStatus(pedido.id, action.status)}
                                  disabled={atualizando}
                                >
                                  {action.label}
                                </button>
                              ))}
                            </div>
                            <button
                              className="btn-expandir"
                              onClick={() => setPedidoExpandido(estaExpandido ? null : pedido.id)}
                            >
                              {estaExpandido ? <FiChevronUp /> : <FiChevronDown />}
                            </button>
                          </div>
                        </div>

                        {estaExpandido && (
                          <div className="pedido-detalhes-admin">
                            <div className="cliente-info">
                              <h4><FiUser /> Informações do Cliente</h4>
                              <p><strong>Nome:</strong> {pedido.usuarioNome || 'Não identificado'}</p>
                              <p><strong>Email:</strong> {pedido.usuarioEmail || 'Não informado'}</p>
                              <p><strong>Endereço:</strong> {pedido.endereco}</p>
                              <p><strong>Forma de Pagamento:</strong> {pedido.metodoPagamento === 'pix' ? 'PIX' : 'Cartão de Crédito'}</p>
                            </div>

                            <div className="itens-pedido">
                              <h4><FiShoppingBag /> Itens do Pedido</h4>
                              {pedido.itens?.map((item, idx) => (
                                <div key={idx} className="item-pedido">
                                  <img src={item.imagem} alt={item.nome} />
                                  <div className="item-info">
                                    <h5>{item.nome}</h5>
                                    <p>Quantidade: {item.quantidade}</p>
                                  </div>
                                  <div className="item-preco">
                                    R$ {formatarMoeda(item.preco * item.quantidade)}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="acoes-rapidas">
                              <button className="btn-acao" onClick={() => window.open(`mailto:${pedido.usuarioEmail}`)}>
                                <FiMail /> Email
                              </button>
                              <button className="btn-acao" onClick={() => window.print()}>
                                <FiPrinter /> Imprimir
                              </button>
                              <button className="btn-acao" onClick={() => navigator.clipboard.writeText(pedido.id)}>
                                <FiTag /> Copiar ID
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          )}

          {abaAtiva === 'estatisticas' && (
            <motion.div
              key="estatisticas"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="admin-content"
            >
              <div className="estatisticas-grid">
                <div className="estatistica-card">
                  <h3>📊 Resumo de Pedidos</h3>
                  <div className="estatistica-item">
                    <span>Total de Pedidos:</span>
                    <strong>{estatisticas.totalPedidos}</strong>
                  </div>
                  <div className="estatistica-item">
                    <span>Aguardando Pagamento:</span>
                    <strong>{pedidos.filter(p => p.status === 'AGUARDANDO_PAGAMENTO').length}</strong>
                  </div>
                  <div className="estatistica-item">
                    <span>Pagamento Confirmado:</span>
                    <strong>{pedidos.filter(p => p.status === 'PAGAMENTO_CONFIRMADO').length}</strong>
                  </div>
                  <div className="estatistica-item">
                    <span>Em Preparação:</span>
                    <strong>{pedidos.filter(p => p.status === 'EM_PREPARACAO').length}</strong>
                  </div>
                  <div className="estatistica-item">
                    <span>Saiu para Entrega:</span>
                    <strong>{pedidos.filter(p => p.status === 'SAIU_PARA_ENTREGA').length}</strong>
                  </div>
                  <div className="estatistica-item">
                    <span>Entregues:</span>
                    <strong>{pedidos.filter(p => p.status === 'ENTREGUE').length}</strong>
                  </div>
                  <div className="estatistica-item">
                    <span>Cancelados:</span>
                    <strong>{pedidos.filter(p => p.status === 'CANCELADO').length}</strong>
                  </div>
                </div>

                <div className="estatistica-card">
                  <h3>💰 Financeiro</h3>
                  <div className="estatistica-item">
                    <span>Faturamento Total:</span>
                    <strong>R$ {formatarMoeda(estatisticas.faturamentoTotal)}</strong>
                  </div>
                  <div className="estatistica-item">
                    <span>Ticket Médio:</span>
                    <strong>R$ {formatarMoeda(estatisticas.ticketMedio)}</strong>
                  </div>
                  <div className="estatistica-item">
                    <span>Pedidos Hoje:</span>
                    <strong>{estatisticas.pedidosHoje}</strong>
                  </div>
                </div>

                <div className="estatistica-card">
                  <h3>💳 Formas de Pagamento</h3>
                  <div className="estatistica-item">
                    <span>PIX:</span>
                    <strong>{pedidos.filter(p => p.metodoPagamento === 'pix').length}</strong>
                  </div>
                  <div className="estatistica-item">
                    <span>Cartão de Crédito:</span>
                    <strong>{pedidos.filter(p => p.metodoPagamento === 'cartao').length}</strong>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;