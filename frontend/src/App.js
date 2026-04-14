// Configuração da API
const API_URL = process.env.REACT_APP_API_URL || process.env.VITE_API_URL || 'http://localhost:3001';

export const api = {
  // Teste de conexão
  test: async () => {
    const response = await fetch(`${API_URL}/api/test`);
    return response.json();
  },

  // Login
  login: async (email, senha) => {
    const response = await fetch(`${API_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, senha }),
    });
    return response.json();
  },

  // Registro
  register: async (userData) => {
    const response = await fetch(`${API_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  // Criar pedido
  criarPedido: async (pedidoData, token) => {
    const response = await fetch(`${API_URL}/api/pedidos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(pedidoData),
    });
    return response.json();
  },

  // Listar pedidos do usuário
  listarPedidos: async (usuarioId, token) => {
    const response = await fetch(`${API_URL}/api/pedidos/${usuarioId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Listar todos pedidos (admin)
  listarTodosPedidos: async (token) => {
    const response = await fetch(`${API_URL}/api/pedidos/admin/all`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },

  // Atualizar status do pedido (admin)
  atualizarStatusPedido: async (pedidoId, status, token) => {
    const response = await fetch(`${API_URL}/api/pedidos/${pedidoId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    return response.json();
  },
};

export default api;export default App;
