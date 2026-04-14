const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// ===== CONFIGURAÇÃO CORS CORRIGIDA =====
// Lista de origens permitidas
const allowedOrigins = [
  'https://koenma-sushi-frontend.onrender.com',
  'http://localhost:3000',
  'http://localhost:3001'
];

app.use(cors({
  origin: function(origin, callback) {
    // Permite requisições sem origin (como apps mobile ou curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('❌ Origem bloqueada pelo CORS:', origin);
      callback(null, true); // Em desenvolvimento, permite todas
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware para OPTIONS (pré-requisição CORS)
app.options('*', cors());

// Middleware
app.use(express.json());

// Configuração do MySQL (TiDB Cloud)
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'koenma_sushi_nw',
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  }
});

// Conectar ao MySQL (TiDB Cloud)
db.connect((err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao TiDB:', err);
    console.log('Verifique as variáveis de ambiente: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME');
    return;
  }
  console.log('✅ Conectado ao TiDB Cloud com sucesso!');
  console.log('📁 Banco de dados:', db.config.database);
});

// ===== ROTAS =====

// Rota raiz (para teste)
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🍣 API do Koenma Sushi está funcionando!',
    status: 'online',
    endpoints: {
      test: 'GET /api/test',
      login: 'POST /api/login',
      register: 'POST /api/register',
      pedidos: {
        criar: 'POST /api/pedidos',
        listarUsuario: 'GET /api/pedidos/:usuarioId',
        listarAdmin: 'GET /api/pedidos/admin/all',
        atualizarStatus: 'PUT /api/pedidos/:pedidoId/status',
        cancelar: 'DELETE /api/pedidos/:pedidoId'
      }
    }
  });
});

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando!' });
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;
  
  console.log('🔐 Tentativa de login:', email);
  
  try {
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    db.query(query, [email], async (err, results) => {
      if (err) {
        console.error('❌ Erro no login:', err);
        return res.status(500).json({ success: false, message: 'Erro no servidor' });
      }
      
      console.log('📊 Resultados encontrados:', results.length);
      
      if (results.length === 0) {
        return res.status(401).json({ success: false, message: 'Email ou senha incorretos' });
      }
      
      const usuario = results[0];
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      
      if (!senhaValida) {
        return res.status(401).json({ success: false, message: 'Email ou senha incorretos' });
      }
      
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email },
        process.env.JWT_SECRET || 'seu-secret-key',
        { expiresIn: '7d' }
      );
      
      res.json({
        success: true,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          telefone: usuario.telefone || '',
          endereco: usuario.endereco || "Rua das Flores, 123 - Asa Sul, Brasília - DF"
        },
        token
      });
    });
  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
});

// Registrar
app.post('/api/register', async (req, res) => {
  const { nome, email, senha, telefone, endereco } = req.body;
  
  console.log('📝 Tentativa de cadastro:', { nome, email, telefone, endereco });
  
  try {
    // Verificar se email já existe
    const checkQuery = 'SELECT * FROM usuarios WHERE email = ?';
    db.query(checkQuery, [email], async (err, results) => {
      if (err) {
        console.error('❌ Erro ao verificar email:', err);
        return res.status(500).json({ success: false, message: 'Erro no servidor' });
      }
      
      if (results.length > 0) {
        console.log('⚠️ Email já cadastrado:', email);
        return res.status(400).json({ success: false, message: 'Email já cadastrado' });
      }
      
      // Gerar hash da senha
      const senhaHash = await bcrypt.hash(senha, 10);
      
      // Inserir novo usuário
      const insertQuery = 'INSERT INTO usuarios (nome, email, senha, telefone, endereco) VALUES (?, ?, ?, ?, ?)';
      const enderecoFinal = endereco || "Rua das Flores, 123 - Asa Sul, Brasília - DF";
      const telefoneFinal = telefone || "";
      
      db.query(insertQuery, [nome, email, senhaHash, telefoneFinal, enderecoFinal], (err, result) => {
        if (err) {
          console.error('❌ Erro no registro:', err);
          return res.status(500).json({ success: false, message: 'Erro ao cadastrar' });
        }
        
        console.log('✅ Usuário cadastrado com sucesso! ID:', result.insertId);
        
        const token = jwt.sign(
          { id: result.insertId, email },
          process.env.JWT_SECRET || 'seu-secret-key',
          { expiresIn: '7d' }
        );
        
        res.json({
          success: true,
          usuario: {
            id: result.insertId,
            nome,
            email,
            telefone: telefoneFinal,
            endereco: enderecoFinal
          },
          token
        });
      });
    });
  } catch (error) {
    console.error('❌ Erro no registro:', error);
    res.status(500).json({ success: false, message: 'Erro no servidor' });
  }
});

// Criar pedido
app.post('/api/pedidos', (req, res) => {
  const { usuarioId, usuarioNome, usuarioEmail, data, total, status, itens, metodoPagamento, endereco } = req.body;
  
  console.log('📦 Pedido recebido:', { usuarioId, usuarioNome, usuarioEmail, total, itens });
  
  // Gerar número do pedido
  const pedidoNumero = `PED${Date.now()}`;
  
  const queryPedido = `INSERT INTO pedidos 
    (usuario_id, pedido_numero, data, subtotal, desconto, total, status, metodo_pagamento, endereco_entrega) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  const subtotal = total;
  const desconto = metodoPagamento === 'pix' ? total * 0.05 : 0;
  const totalFinal = metodoPagamento === 'pix' ? total * 0.95 : total;
  
  db.query(queryPedido, [usuarioId, pedidoNumero, new Date(), subtotal, desconto, totalFinal, status || 'aguardando_pagamento', metodoPagamento, endereco], (err, result) => {
    if (err) {
      console.error('❌ Erro ao criar pedido:', err);
      return res.status(500).json({ success: false, message: 'Erro ao criar pedido' });
    }
    
    const pedidoId = result.insertId;
    console.log('✅ Pedido criado ID:', pedidoId);
    
    // Inserir itens do pedido
    if (itens && itens.length > 0) {
      const queryItem = 'INSERT INTO pedido_itens (pedido_id, produto_id, nome_produto, preco_unitario, quantidade, subtotal) VALUES ?';
      const itensValues = itens.map(item => [
        pedidoId, 
        item.id, 
        item.nome, 
        item.preco, 
        item.quantidade, 
        item.preco * item.quantidade
      ]);
      
      db.query(queryItem, [itensValues], (err) => {
        if (err) {
          console.error('❌ Erro ao inserir itens:', err);
          return res.status(500).json({ success: false, message: 'Erro ao salvar itens' });
        }
        
        console.log('✅ Itens do pedido salvos:', itensValues.length);
        res.json({ success: true, pedidoId, pedidoNumero });
      });
    } else {
      res.json({ success: true, pedidoId, pedidoNumero });
    }
  });
});

// Listar pedidos do usuário
app.get('/api/pedidos/:usuarioId', (req, res) => {
  const { usuarioId } = req.params;
  
  const queryPedidos = `
    SELECT p.*, 
           (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', pi.produto_id, 'nome', pi.nome_produto, 'preco', pi.preco_unitario, 'quantidade', pi.quantidade)) 
            FROM pedido_itens pi WHERE pi.pedido_id = p.id) as itens
    FROM pedidos p 
    WHERE p.usuario_id = ? 
    ORDER BY p.data DESC
  `;
  
  db.query(queryPedidos, [usuarioId], (err, results) => {
    if (err) {
      console.error('❌ Erro ao listar pedidos:', err);
      return res.status(500).json({ success: false, message: 'Erro ao listar pedidos' });
    }
    
    const pedidos = results.map(pedido => ({
      ...pedido,
      itens: pedido.itens ? JSON.parse(pedido.itens) : []
    }));
    
    res.json({ success: true, pedidos });
  });
});

// Listar todos os pedidos (para admin)
app.get('/api/pedidos/admin/all', (req, res) => {
  const queryPedidos = `
    SELECT p.*, 
           u.nome as usuario_nome,
           u.email as usuario_email,
           u.telefone as usuario_telefone,
           (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', pi.produto_id, 'nome', pi.nome_produto, 'preco', pi.preco_unitario, 'quantidade', pi.quantidade)) 
            FROM pedido_itens pi WHERE pi.pedido_id = p.id) as itens
    FROM pedidos p
    LEFT JOIN usuarios u ON p.usuario_id = u.id
    ORDER BY p.data DESC
  `;
  
  db.query(queryPedidos, (err, results) => {
    if (err) {
      console.error('❌ Erro ao listar pedidos:', err);
      return res.status(500).json({ success: false, message: 'Erro ao listar pedidos' });
    }
    
    const pedidos = results.map(pedido => ({
      ...pedido,
      itens: pedido.itens ? JSON.parse(pedido.itens) : []
    }));
    
    res.json({ success: true, pedidos });
  });
});

// Atualizar status do pedido
app.put('/api/pedidos/:pedidoId/status', (req, res) => {
  const { pedidoId } = req.params;
  const { status } = req.body;
  
  const query = 'UPDATE pedidos SET status = ? WHERE id = ?';
  
  db.query(query, [status, pedidoId], (err, result) => {
    if (err) {
      console.error('❌ Erro ao atualizar status:', err);
      return res.status(500).json({ success: false, message: 'Erro ao atualizar status' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Pedido não encontrado' });
    }
    
    res.json({ success: true, message: 'Status atualizado com sucesso' });
  });
});

// Cancelar pedido
app.delete('/api/pedidos/:pedidoId', (req, res) => {
  const { pedidoId } = req.params;
  
  const query = 'UPDATE pedidos SET status = "cancelado" WHERE id = ? AND status IN ("aguardando_pagamento", "pagamento_confirmado")';
  
  db.query(query, [pedidoId], (err, result) => {
    if (err) {
      console.error('❌ Erro ao cancelar pedido:', err);
      return res.status(500).json({ success: false, message: 'Erro ao cancelar pedido' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(400).json({ success: false, message: 'Não é possível cancelar este pedido' });
    }
    
    res.json({ success: true, message: 'Pedido cancelado com sucesso' });
  });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor backend rodando na porta ${port}`);
  console.log(`   CORS configurado para aceitar:`);
  console.log(`   - https://koenma-sushi-frontend.onrender.com`);
  console.log(`   - http://localhost:3000`);
  console.log(`   Rotas disponíveis:`);
  console.log(`   GET  /`);
  console.log(`   GET  /api/test`);
  console.log(`   POST /api/login`);
  console.log(`   POST /api/register`);
  console.log(`   POST /api/pedidos`);
  console.log(`   GET  /api/pedidos/:usuarioId`);
  console.log(`   GET  /api/pedidos/admin/all`);
  console.log(`   PUT  /api/pedidos/:pedidoId/status`);
  console.log(`   DELETE /api/pedidos/:pedidoId`);
});
