import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const PedidoContext = createContext();

export const usePedidos = () => useContext(PedidoContext);

export const PedidoProvider = ({ children }) => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const { usuario } = useAuth();

  const statusPedido = {
    AGUARDANDO_PAGAMENTO: { id: 1, nome: 'Aguardando Pagamento', cor: '#ff9800', icone: '⏳' },
    PAGAMENTO_CONFIRMADO: { id: 2, nome: 'Pagamento Confirmado', cor: '#4caf50', icone: '✅' },
    EM_PREPARACAO: { id: 3, nome: 'Em Preparação', cor: '#9c27b0', icone: '👨‍🍳' },
    SAIU_PARA_ENTREGA: { id: 4, nome: 'Saiu para Entrega', cor: '#ff9800', icone: '🚚' },
    ENTREGUE: { id: 5, nome: 'Entregue', cor: '#2196f3', icone: '🎉' },
    CANCELADO: { id: 6, nome: 'Cancelado', cor: '#f44336', icone: '❌' }
  };

  // Carregar pedidos do localStorage GLOBAL
  useEffect(() => {
    carregarPedidos();
  }, []);

  const carregarPedidos = () => {
    const pedidosSalvos = localStorage.getItem('@KoenmaSushi:pedidos_global');
    if (pedidosSalvos) {
      setPedidos(JSON.parse(pedidosSalvos));
    }
  };

  const salvarPedidos = (novosPedidos) => {
    setPedidos(novosPedidos);
    localStorage.setItem('@KoenmaSushi:pedidos_global', JSON.stringify(novosPedidos));
  };

  const criarPedido = async (itens, total, metodoPagamento, endereco) => {
    setLoading(true);
    
    try {
      const novoPedido = {
        id: `PED${String(Date.now()).slice(-6)}`,
        data: new Date().toISOString(),
        status: 'AGUARDANDO_PAGAMENTO',
        total: total,
        subtotal: total / (metodoPagamento === 'pix' ? 0.95 : 1),
        desconto: metodoPagamento === 'pix' ? total * 0.05 : 0,
        itens: itens.map(item => ({
          id: item.id,
          nome: item.nome,
          quantidade: item.quantidade,
          preco: item.preco,
          imagem: item.imagem
        })),
        endereco: endereco,
        metodoPagamento: metodoPagamento,
        usuarioNome: usuario?.nome || 'Cliente',
        usuarioEmail: usuario?.email || 'cliente@email.com',
        usuarioId: usuario?.id
      };

      const novosPedidos = [novoPedido, ...pedidos];
      salvarPedidos(novosPedidos);
      
      toast.success('Pedido realizado com sucesso! Aguardando confirmação do pagamento.');
      return { success: true, pedido: novoPedido };
    } catch (error) {
      toast.error('Erro ao criar pedido');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatus = async (pedidoId, novoStatus) => {
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (!pedido) {
      toast.error('Pedido não encontrado');
      return;
    }

    const statusInfo = statusPedido[novoStatus];
    
    const novosPedidos = pedidos.map(p => 
      p.id === pedidoId 
        ? { ...p, status: novoStatus }
        : p
    );
    salvarPedidos(novosPedidos);
    
    toast.success(`✅ Pedido ${pedidoId}: ${statusInfo?.nome}`);
  };

  const cancelarPedido = async (pedidoId) => {
    const pedido = pedidos.find(p => p.id === pedidoId);
    
    if (pedido && (pedido.status === 'AGUARDANDO_PAGAMENTO' || pedido.status === 'PAGAMENTO_CONFIRMADO')) {
      const novosPedidos = pedidos.map(p => 
        p.id === pedidoId 
          ? { ...p, status: 'CANCELADO' }
          : p
      );
      salvarPedidos(novosPedidos);
      toast.success('Pedido cancelado com sucesso!');
      return true;
    } else {
      toast.error('Não é possível cancelar este pedido');
      return false;
    }
  };

  const getStatusInfo = (status) => {
    return statusPedido[status] || statusPedido.AGUARDANDO_PAGAMENTO;
  };

  return (
    <PedidoContext.Provider value={{
      pedidos,
      loading,
      criarPedido,
      atualizarStatus,
      cancelarPedido,
      getStatusInfo,
      statusPedido
    }}>
      {children}
    </PedidoContext.Provider>
  );
};