const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool, testConnection } = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3006; 

// ========== CONFIGURAÇÕES IMPORTANTES ==========
// Aumentar limite de tamanho dos cabeçalhos para evitar erro 431
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Configurar CORS para permitir frontend nas portas 3000, 3001 e 3007
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3007'],
  credentials: true,
  maxAge: 86400 // Cache de preflight por 24h
}));

// Middleware para log de requisições (útil para debug)
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// Testar conexão com o banco
testConnection();

// ========== ROTAS DE USUÁRIOS ==========

// Registro de usuário
app.post('/api/register', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // Validação básica
    if (!nome || !email || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Todos os campos são obrigatórios'
      });
    }

    // Verificar se usuário já existe
    const [existingUser] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email já cadastrado'
      });
    }

    // Criptografar senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Inserir novo usuário
    const [result] = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, isAdmin) VALUES (?, ?, ?, ?)',
      [nome, email, hashedPassword, false]
    );

    // Gerar token JWT
    const token = jwt.sign(
      { id: result.insertId, email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Cadastro realizado com sucesso!',
      usuario: {
        id: result.insertId,
        nome,
        email,
        isAdmin: false
      },
      token
    });

  } catch (error) {
    console.error('❌ Erro no registro:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// Login de usuário
app.post('/api/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validação básica
    if (!email || !senha) {
      return res.status(400).json({
        success: false,
        message: 'Email e senha são obrigatórios'
      });
    }

    // Buscar usuário
    const [users] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos'
      });
    }

    const user = users[0];

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
      return res.status(401).json({
        success: false,
        message: 'Email ou senha inválidos'
      });
    }

    // Gerar token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login realizado com sucesso!',
      usuario: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        isAdmin: user.isAdmin
      },
      token
    });

  } catch (error) {
    console.error('❌ Erro no login:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
});

// ========== ROTAS DE PRODUTOS ==========

// Buscar todos os produtos
app.get('/api/produtos', async (req, res) => {
  try {
    const [produtos] = await pool.query('SELECT * FROM produtos ORDER BY id DESC');
    res.json(produtos);
  } catch (error) {
    console.error('❌ Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// Buscar produto por ID
app.get('/api/produtos/:id', async (req, res) => {
  try {
    const [produtos] = await pool.query('SELECT * FROM produtos WHERE id = ?', [req.params.id]);
    
    if (produtos.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    // Buscar detalhes do produto
    const [detalhes] = await pool.query('SELECT * FROM produto_detalhes WHERE produto_id = ?', [req.params.id]);
    
    const produto = produtos[0];
    produto.detalhes = detalhes.map(d => d.detalhe);

    res.json(produto);
  } catch (error) {
    console.error('❌ Erro ao buscar produto:', error);
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
});

// Buscar produtos por categoria
app.get('/api/produtos/categoria/:categoria', async (req, res) => {
  try {
    const [produtos] = await pool.query(
      'SELECT * FROM produtos WHERE categoria = ? ORDER BY id DESC',
      [req.params.categoria]
    );
    res.json(produtos);
  } catch (error) {
    console.error('❌ Erro ao buscar produtos por categoria:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// Buscar produtos em destaque
app.get('/api/produtos/destaque/destaques', async (req, res) => {
  try {
    const [produtos] = await pool.query(
      'SELECT * FROM produtos WHERE destaque = true ORDER BY id DESC LIMIT 8'
    );
    res.json(produtos);
  } catch (error) {
    console.error('❌ Erro ao buscar produtos em destaque:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

// ========== ROTAS DO CARRINHO ==========

// Adicionar ao carrinho
app.post('/api/carrinho', async (req, res) => {
  try {
    const { usuarioId, produtoId, quantidade } = req.body;

    // Verificar se já existe no carrinho
    const [existing] = await pool.query(
      'SELECT * FROM carrinho WHERE usuario_id = ? AND produto_id = ?',
      [usuarioId, produtoId]
    );

    if (existing.length > 0) {
      // Atualizar quantidade
      await pool.query(
        'UPDATE carrinho SET quantidade = quantidade + ? WHERE usuario_id = ? AND produto_id = ?',
        [quantidade, usuarioId, produtoId]
      );
    } else {
      // Inserir novo item
      await pool.query(
        'INSERT INTO carrinho (usuario_id, produto_id, quantidade) VALUES (?, ?, ?)',
        [usuarioId, produtoId, quantidade]
      );
    }

    res.json({ success: true, message: 'Produto adicionado ao carrinho' });
  } catch (error) {
    console.error('❌ Erro ao adicionar ao carrinho:', error);
    res.status(500).json({ error: 'Erro ao adicionar ao carrinho' });
  }
});

// Buscar carrinho do usuário
app.get('/api/carrinho/:usuarioId', async (req, res) => {
  try {
    const [itens] = await pool.query(
      `SELECT c.*, p.nome, p.preco, p.imagens 
       FROM carrinho c 
       JOIN produtos p ON c.produto_id = p.id 
       WHERE c.usuario_id = ?`,
      [req.params.usuarioId]
    );
    res.json(itens);
  } catch (error) {
    console.error('❌ Erro ao buscar carrinho:', error);
    res.status(500).json({ error: 'Erro ao buscar carrinho' });
  }
});

// Remover do carrinho
app.delete('/api/carrinho/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM carrinho WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Item removido do carrinho' });
  } catch (error) {
    console.error('❌ Erro ao remover do carrinho:', error);
    res.status(500).json({ error: 'Erro ao remover do carrinho' });
  }
});

// ========== ROTAS DE PEDIDOS ==========

// Criar pedido
app.post('/api/pedidos', async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { usuarioId, total, itens } = req.body;

    // Inserir pedido
    const [pedido] = await connection.query(
      'INSERT INTO pedidos (usuario_id, total, status) VALUES (?, ?, ?)',
      [usuarioId, total, 'aguardando pagamento']
    );

    // Inserir itens do pedido
    for (const item of itens) {
      await connection.query(
        'INSERT INTO pedido_itens (pedido_id, produto_id, nome, preco, quantidade) VALUES (?, ?, ?, ?, ?)',
        [pedido.insertId, item.produtoId, item.nome, item.preco, item.quantidade]
      );
    }

    // Limpar carrinho
    await connection.query('DELETE FROM carrinho WHERE usuario_id = ?', [usuarioId]);

    await connection.commit();
    res.json({ success: true, message: 'Pedido criado com sucesso', pedidoId: pedido.insertId });

  } catch (error) {
    await connection.rollback();
    console.error('❌ Erro ao criar pedido:', error);
    res.status(500).json({ error: 'Erro ao criar pedido' });
  } finally {
    connection.release();
  }
});

// Buscar pedidos do usuário
app.get('/api/pedidos/:usuarioId', async (req, res) => {
  try {
    const [pedidos] = await pool.query(
      `SELECT p.*, 
        (SELECT JSON_ARRAYAGG(
          JSON_OBJECT('id', pi.id, 'produto_id', pi.produto_id, 'nome', pi.nome, 'preco', pi.preco, 'quantidade', pi.quantidade)
        ) FROM pedido_itens pi WHERE pi.pedido_id = p.id) as itens
       FROM pedidos p 
       WHERE p.usuario_id = ? 
       ORDER BY p.data DESC`,
      [req.params.usuarioId]
    );
    res.json(pedidos);
  } catch (error) {
    console.error('❌ Erro ao buscar pedidos:', error);
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

// ========== ROTA DE FALLBACK PARA O REACT ==========
// Redireciona todas as rotas não-API para o React (versão compatível com Express 5+)
app.use((req, res, next) => {
  // Se a rota NÃO começar com /api, redireciona para o React na porta 3001
  if (!req.path.startsWith('/api')) {
    console.log(`🔄 Redirecionando: ${req.path} → http://localhost:3001${req.path}`);
    res.redirect(`http://localhost:3001${req.path}`);
  } else {
    next();
  }
});

// ========== ROTA 404 PARA APIs ==========
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Rota API não encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`📌 Frontend esperado em: http://localhost:3001 ou http://localhost:3007`);
  console.log(`📌 API disponível em: http://localhost:${PORT}/api`);
});