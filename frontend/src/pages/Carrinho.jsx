import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiTrash2, 
  FiArrowLeft, 
  FiShoppingBag, 
  FiCreditCard, 
  FiSmartphone,
  FiCheckCircle,
  FiInfo,
  FiPackage,
  FiCopy,
  FiCheck
} from 'react-icons/fi';
import { useCarrinho } from '../context/CarrinhoContext';
import { useAuth } from '../context/AuthContext';
import { usePedidos } from '../context/PedidoContext';
import toast from 'react-hot-toast';

const Carrinho = () => {
  const [metodoPagamento, setMetodoPagamento] = useState('pix');
  const [parcelas, setParcelas] = useState(1);
  const [termosAceitos, setTermosAceitos] = useState(false);
  const [mostrarModalPagamento, setMostrarModalPagamento] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [pagamentoProcessando, setPagamentoProcessando] = useState(false);
  
  const { 
    itens, 
    removerDoCarrinho, 
    atualizarQuantidade,
    getTotalItens,
    getPrecoTotal,
    limparCarrinho,
    loading: carrinhoLoading 
  } = useCarrinho();
  
  const { usuario } = useAuth();
  const { criarPedido, atualizarStatus } = usePedidos();
  const navigate = useNavigate();

  const precoTotal = getPrecoTotal();
  const valorParcela = precoTotal / parcelas;
  const totalComDesconto = metodoPagamento === 'pix' ? precoTotal * 0.95 : precoTotal;

  const pixData = {
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=00020101021226870014br.gov.bcb.pix2563pix.koenmasushi.com.br/62c8d2e0-1234-5678-9abc-def01234567852040000530398654041.005802BR5913Koenma Sushi6009SAO PAULO62240520PEDIDO1234567896304E2A3",
    codigoPix: "00020101021226870014br.gov.bcb.pix2563pix.koenmasushi.com.br/62c8d2e0-1234-5678-9abc-def01234567852040000530398654041.005802BR5913Koenma Sushi6009SAO PAULO62240520PEDIDO1234567896304E2A3"
  };

  const cartaoTeste = {
    numero: "**** **** **** 1234",
    validade: "12/28",
    cvv: "***"
  };

  useEffect(() => {
    const termosJaAceitos = localStorage.getItem('@KoenmaSushi:termosAceitos');
    if (termosJaAceitos === 'true') {
      setTermosAceitos(true);
    }
  }, []);

  const handleFinalizarPedido = async () => {
    if (!usuario) {
      toast.error('Faça login para finalizar o pedido');
      navigate('/?login=true');
      return;
    }

    if (!termosAceitos) {
      toast.error('Você precisa aceitar os termos para continuar');
      return;
    }

    if (itens.length === 0) {
      toast.error('Seu carrinho está vazio');
      return;
    }

    setMostrarModalPagamento(true);
  };

  const handleConfirmarPagamento = async () => {
    setPagamentoProcessando(true);
    
    const endereco = usuario.endereco || "Rua das Flores, 123 - Asa Sul, Brasília - DF";
    
    console.log('📝 Criando pedido...');
    const resultado = await criarPedido(itens, totalComDesconto, metodoPagamento, endereco);
    console.log('📦 Resultado criação:', resultado);
    
    if (resultado.success) {
      console.log('⏳ Aguardando 2 segundos...');
      setTimeout(async () => {
        console.log('💰 Atualizando status para PAGAMENTO_CONFIRMADO...');
        await atualizarStatus(resultado.pedido.id, 'PAGAMENTO_CONFIRMADO');
        console.log('✅ Status atualizado!');
        
        setMostrarModalPagamento(false);
        limparCarrinho();
        localStorage.removeItem('@KoenmaSushi:termosAceitos');
        
        toast.success('✅ Pagamento confirmado! Aguardando início da preparação.');
        navigate('/meus-pedidos');
      }, 2000);
    }
    
    setPagamentoProcessando(false);
  };

  const copiarPix = () => {
    navigator.clipboard.writeText(pixData.codigoPix);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
    toast.success('Código PIX copiado!');
  };

  const formatarPreco = (valor) => {
    return valor.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  if (itens.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="carrinho-vazio"
      >
        <FiPackage size={80} />
        <h2>Seu carrinho está vazio</h2>
        <p>Explore nosso cardápio e escolha seus pratos favoritos</p>
        <Link to="/cardapio" className="btn-luxury btn-sushi">
          Ver Cardápio
        </Link>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="carrinho-page"
      >
        <div className="container">
          <Link to="/cardapio" className="voltar-link">
            <FiArrowLeft /> Continuar Comprando
          </Link>

          <h1 className="carrinho-titulo">
            Seu Pedido ({getTotalItens()} {getTotalItens() === 1 ? 'item' : 'itens'})
          </h1>

          <div className="carrinho-grid">
            <div className="carrinho-itens">
              {itens.map((item) => (
                <motion.div
                  key={item.id}
                  className="carrinho-item"
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <img src={item.imagem} alt={item.nome} className="item-imagem" />
                  
                  <div className="item-info">
                    <h3>{item.nome}</h3>
                    <p className="item-designer">{item.descricao?.substring(0, 50)}</p>
                    <p className="item-preco">
                      R$ {item.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div className="item-quantidade">
                    <button 
                      onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                      className="qtd-btn"
                    >
                      -
                    </button>
                    <span>{item.quantidade}</span>
                    <button 
                      onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                      className="qtd-btn"
                    >
                      +
                    </button>
                  </div>

                  <div className="item-subtotal">
                    <p>Subtotal:</p>
                    <p className="subtotal-valor">
                      R$ {(item.preco * item.quantidade).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <button 
                    onClick={() => removerDoCarrinho(item.id)}
                    className="item-remover"
                  >
                    <FiTrash2 />
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="carrinho-resumo">
              <h2>Resumo do Pedido</h2>
              
              <div className="resumo-linha">
                <span>Subtotal:</span>
                <span>R$ {formatarPreco(precoTotal)}</span>
              </div>
              
              <div className="resumo-linha">
                <span>Frete:</span>
                <span className="frete-gratis">Grátis</span>
              </div>

              {metodoPagamento === 'pix' && (
                <div className="resumo-linha desconto">
                  <span>Desconto PIX (5%):</span>
                  <span className="desconto-valor">- R$ {formatarPreco(precoTotal * 0.05)}</span>
                </div>
              )}
              
              <div className="resumo-linha total">
                <span>Total:</span>
                <span>R$ {formatarPreco(totalComDesconto)}</span>
              </div>

              <div className="pagamento-section">
                <h3>Forma de Pagamento</h3>
                
                <div className="metodos-pagamento">
                  <label className={`metodo-pagamento ${metodoPagamento === 'pix' ? 'selecionado' : ''}`}>
                    <input
                      type="radio"
                      name="pagamento"
                      value="pix"
                      checked={metodoPagamento === 'pix'}
                      onChange={(e) => setMetodoPagamento(e.target.value)}
                    />
                    <FiSmartphone className="metodo-icone" />
                    <div className="metodo-info">
                      <strong>PIX</strong>
                      <small>Pagamento instantâneo</small>
                    </div>
                    <span className="desconto-badge">5% OFF</span>
                  </label>

                  <label className={`metodo-pagamento ${metodoPagamento === 'cartao' ? 'selecionado' : ''}`}>
                    <input
                      type="radio"
                      name="pagamento"
                      value="cartao"
                      checked={metodoPagamento === 'cartao'}
                      onChange={(e) => setMetodoPagamento(e.target.value)}
                    />
                    <FiCreditCard className="metodo-icone" />
                    <div className="metodo-info">
                      <strong>Cartão de Crédito</strong>
                      <small>Até 10x sem juros</small>
                    </div>
                  </label>
                </div>

                {metodoPagamento === 'cartao' && (
                  <div className="parcelas-section">
                    <label htmlFor="parcelas">Número de parcelas:</label>
                    <select 
                      id="parcelas"
                      value={parcelas}
                      onChange={(e) => setParcelas(Number(e.target.value))}
                      className="parcelas-select"
                    >
                      {[1,2,3,4,5,6,7,8,9,10].map(num => (
                        <option key={num} value={num}>
                          {num}x de R$ {formatarPreco(precoTotal / num)} {num === 1 ? '(à vista)' : 'sem juros'}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="termos-section">
                <label className="termos-checkbox">
                  <input
                    type="checkbox"
                    checked={termosAceitos}
                    onChange={(e) => setTermosAceitos(e.target.checked)}
                  />
                  <span>
                    Li e aceito os <Link to="/termos" target="_blank">termos e condições</Link> de compra
                  </span>
                </label>
              </div>

              <button 
                onClick={handleFinalizarPedido}
                className="btn-finalizar"
                disabled={carrinhoLoading || !termosAceitos}
              >
                {carrinhoLoading ? 'Processando...' : 'IR PARA PAGAMENTO'}
              </button>

              <p className="resumo-obs">
                *Frete grátis para todo o Brasil<br />
                *Pedido 100% seguro
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal de Pagamento */}
      {mostrarModalPagamento && (
        <div className="modal-pagamento-overlay" onClick={() => setMostrarModalPagamento(false)}>
          <div className="modal-pagamento-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-pagamento-close" onClick={() => setMostrarModalPagamento(false)}>
              ×
            </button>
            
            <h2>Finalizar Pedido</h2>
            <p className="modal-total">Total: <strong>R$ {formatarPreco(totalComDesconto)}</strong></p>
            
            {metodoPagamento === 'pix' ? (
              <div className="pagamento-pix">
                <h3>Pague com PIX</h3>
                <div className="qr-code">
                  <img src={pixData.qrCode} alt="QR Code PIX" />
                </div>
                <p>Escaneie o QR Code ou copie o código:</p>
                <div className="pix-codigo">
                  <code>{pixData.codigoPix.substring(0, 50)}...</code>
                  <button onClick={copiarPix} className="btn-copiar">
                    {copiado ? <FiCheck /> : <FiCopy />} {copiado ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
                <div className="instrucoes-pix">
                  <FiInfo />
                  <p>Após o pagamento, seu pedido será confirmado e aguardará a preparação.</p>
                </div>
              </div>
            ) : (
              <div className="pagamento-cartao">
                <h3>Dados do Cartão de Teste</h3>
                <div className="cartao-info">
                  <p><strong>Número:</strong> {cartaoTeste.numero}</p>
                  <p><strong>Validade:</strong> {cartaoTeste.validade}</p>
                  <p><strong>CVV:</strong> {cartaoTeste.cvv}</p>
                </div>
                <div className="instrucoes-cartao">
                  <FiInfo />
                  <p>Para teste, utilize os dados acima. Nenhum valor será cobrado.</p>
                </div>
              </div>
            )}
            
            <button 
              className="btn-confirmar-pagamento"
              onClick={handleConfirmarPagamento}
              disabled={pagamentoProcessando}
            >
              {pagamentoProcessando ? 'Processando...' : 'Confirmar Pagamento'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Carrinho;