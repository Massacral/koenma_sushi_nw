


CREATE DATABASE IF NOT EXISTS koenma_sushi_nw;
USE koenma_sushi_nw;


-- 1. Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    endereco TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Tabela de Categorias
CREATE TABLE IF NOT EXISTS categorias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL UNIQUE,
    descricao TEXT,
    icone VARCHAR(50),
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabela de Produtos (Cardápio)
CREATE TABLE IF NOT EXISTS produtos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    categoria_id INT NOT NULL,
    destaque BOOLEAN DEFAULT FALSE,
    disponivel BOOLEAN DEFAULT TRUE,
    imagem_principal VARCHAR(500),
    imagens JSON,
    detalhes JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE RESTRICT
);

-- 4. Tabela de Pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    pedido_numero VARCHAR(20) UNIQUE NOT NULL,
    data DATETIME DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(10,2) NOT NULL,
    desconto DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,
    status ENUM('aguardando_pagamento', 'pagamento_confirmado', 'em_preparacao', 'saiu_para_entrega', 'entregue', 'cancelado') DEFAULT 'aguardando_pagamento',
    metodo_pagamento ENUM('pix', 'cartao') NOT NULL,
    parcelas INT DEFAULT 1,
    endereco_entrega TEXT NOT NULL,
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT
);

-- 5. Tabela de Itens do Pedido
CREATE TABLE IF NOT EXISTS pedido_itens (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pedido_id INT NOT NULL,
    produto_id INT NOT NULL,
    nome_produto VARCHAR(100) NOT NULL,
    preco_unitario DECIMAL(10,2) NOT NULL,
    quantidade INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos(id) ON DELETE RESTRICT
);

-- 6. Tabela de Reservas
CREATE TABLE IF NOT EXISTS reservas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    data DATE NOT NULL,
    horario TIME NOT NULL,
    pessoas INT NOT NULL,
    observacoes TEXT,
    status ENUM('pendente', 'confirmada', 'cancelada', 'finalizada') DEFAULT 'pendente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- 7. Tabela de Contatos (Mensagens)
CREATE TABLE IF NOT EXISTS contatos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    assunto VARCHAR(200),
    mensagem TEXT NOT NULL,
    status ENUM('nao_lida', 'lida', 'respondida') DEFAULT 'nao_lida',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Inserir categorias
INSERT INTO categorias (nome, descricao, icone) VALUES
('Sushis', 'Tradicionais e saborosos', '🍣'),
('Temakis', 'Crocantes e recheados', '🍙'),
('Hot Rolls', 'Grelhados e empanados', '🔥'),
('Entradas', 'Para começar sua refeição', '🥟'),
('Bebidas', 'Refrescantes e variadas', '🥤'),
('Sobremesas', 'Finalize com doçura', '🍨');

-- Inserir produtos (cardápio)
INSERT INTO produtos (nome, descricao, preco, categoria_id, destaque, imagem_principal) VALUES
('Combo Especial Koenma', '10 peças de sushi variado + 8 hot rolls + 4 temakis', 89.90, 1, 1, 'https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=500'),
('Sashimi Premium', 'Seleção nobre de peixes frescos: salmão, atum, white tuna e peixe branco', 45.90, 1, 1, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500'),
('Sushi de Salmão (Sake)', 'Sushi tradicional com salmão fresco e arroz temperado', 18.90, 1, 0, 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=500'),
('Sushi de Atum (Maguro)', 'Sushi tradicional com atum fresco e arroz temperado', 22.90, 1, 0, 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=500'),
('Uramaki Salmão', 'Uramaki invertido com salmão, cream cheese e cebolinha', 34.90, 1, 0, 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=500'),
('Temaki Especial', 'Temaki com salmão fresco, cream cheese, cebolinha e kani', 24.90, 2, 0, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=500'),
('Temaki Salmão com Cream Cheese', 'Temaki com salmão, cream cheese, cebolinha e cebola crispy', 26.90, 2, 0, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=500'),
('Temaki de Camarão', 'Temaki com camarão empanado, cream cheese e cebolinha', 28.90, 2, 0, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=500'),
('Hot Roll Filadélfia', 'Hot roll empanado e frito com salmão, cream cheese e cebolinha', 32.90, 3, 1, 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=500'),
('Hot Roll Skin', 'Hot roll com pele de salmão crocante, cream cheese e cebolinha', 34.90, 3, 0, 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=500'),
('Harumaki (Rolinho Primavera)', 'Rolinho de massa fina recheado com legumes e frango', 18.90, 4, 0, 'https://images.unsplash.com/photo-1613514785940-daef0771c5b6?w=500'),
('Gyoza', 'Pastéis japoneses recheados com carne suína e legumes', 22.90, 4, 0, 'https://images.unsplash.com/photo-1613514785940-daef0771c5b6?w=500'),
('Sunomono', 'Salada refrescante de pepino com molho de arroz e gergelim', 15.90, 4, 0, 'https://images.unsplash.com/photo-1613514785940-daef0771c5b6?w=500'),
('Missoshiru', 'Sopa de missô com tofu, algas e cebolinha', 12.90, 4, 0, 'https://images.unsplash.com/photo-1613514785940-daef0771c5b6?w=500'),
('Suco Natural', 'Sucos naturais de laranja, maracujá, limão ou abacaxi', 8.90, 5, 0, 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=500'),
('Chá Gelado', 'Chá verde gelado com limão e hortelã', 6.90, 5, 0, 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=500'),
('Refrigerante', 'Coca-Cola, Guaraná, Sprite ou Fanta', 5.90, 5, 0, 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=500'),
('Água Mineral', 'Água mineral com ou sem gás', 3.90, 5, 0, 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=500'),
('Mochi', 'Doce japonês de massa de arroz recheado com doce de leite e coberto com coco', 12.90, 6, 0, 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500'),
('Tempurá de Sorvete', 'Sorvete de creme envolto em massa tempurá e frito', 18.90, 6, 1, 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500'),
('Pudim de Leite', 'Pudim de leite condensado com calda de caramelo', 9.90, 6, 0, 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=500');

-- Inserir usuário administrador (senha: admin123)
INSERT INTO usuarios (nome, email, senha, telefone, endereco) VALUES 
('Administrador', 'admin@koenmasushi.com.br', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MrI6TqXeFz4hF5sQXpHxqXpJxXpJxXp', '(61) 99999-9999', 'Rua das Flores, 123 - Asa Sul, Brasília - DF');

-- Inserir usuário de teste (senha: 123456)
INSERT INTO usuarios (nome, email, senha, telefone, endereco) VALUES 
('Cliente Teste', 'teste@email.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MrI6TqXeFz4hF5sQXpHxqXpJxXpJxXp', '(61) 88888-8888', 'Rua dos Testes, 456 - Asa Norte, Brasília - DF');

-- Inserir pedidos de exemplo
INSERT INTO pedidos (usuario_id, pedido_numero, subtotal, desconto, total, status, metodo_pagamento, endereco_entrega) VALUES
(2, 'PED001', 89.90, 0, 89.90, 'entregue', 'pix', 'Rua dos Testes, 456 - Asa Norte, Brasília - DF'),
(2, 'PED002', 45.90, 0, 45.90, 'entregue', 'cartao', 'Rua dos Testes, 456 - Asa Norte, Brasília - DF'),
(2, 'PED003', 32.90, 1.65, 31.25, 'aguardando_pagamento', 'pix', 'Rua dos Testes, 456 - Asa Norte, Brasília - DF');

-- Inserir itens dos pedidos
INSERT INTO pedido_itens (pedido_id, produto_id, nome_produto, preco_unitario, quantidade, subtotal) VALUES
(1, 1, 'Combo Especial Koenma', 89.90, 1, 89.90),
(2, 2, 'Sashimi Premium', 45.90, 1, 45.90),
(3, 9, 'Hot Roll Filadélfia', 32.90, 1, 32.90);

-- Inserir reservas de exemplo
INSERT INTO reservas (usuario_id, nome, email, telefone, data, horario, pessoas, status) VALUES
(2, 'Cliente Teste', 'teste@email.com', '(61) 88888-8888', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '19:30:00', 4, 'confirmada'),
(NULL, 'João Silva', 'joao@email.com', '(61) 77777-7777', DATE_ADD(CURDATE(), INTERVAL 5 DAY), '20:00:00', 2, 'pendente');

-- Inserir mensagens de contato
INSERT INTO contatos (nome, email, assunto, mensagem) VALUES
('Cliente Teste', 'teste@email.com', 'Dúvida sobre cardápio', 'Gostaria de saber se tem opções sem glúten'),
('Maria Santos', 'maria@email.com', 'Reserva para aniversário', 'Gostaria de fazer uma reserva para 8 pessoas no sábado');

-- ==========================================
-- ÍNDICES PARA OTIMIZAÇÃO
-- ==========================================

CREATE INDEX idx_pedidos_usuario ON pedidos(usuario_id);
CREATE INDEX idx_pedidos_status ON pedidos(status);
CREATE INDEX idx_pedidos_data ON pedidos(data);
CREATE INDEX idx_reservas_data ON reservas(data);
CREATE INDEX idx_produtos_categoria ON produtos(categoria_id);
CREATE INDEX idx_produtos_destaque ON produtos(destaque);

-- ==========================================
-- CONSULTAS DE VERIFICAÇÃO
-- ==========================================

SELECT '✅ Banco de dados koenma_sushi_nw criado com sucesso!' as status;
SELECT COUNT(*) as total_usuarios FROM usuarios;
SELECT COUNT(*) as total_produtos FROM produtos;
SELECT COUNT(*) as total_pedidos FROM pedidos;
SELECT id, nome, email FROM usuarios;
SELECT id, nome, preco FROM produtos LIMIT 5;