import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiXCircle, FiInfo, FiFileText } from 'react-icons/fi';

const Termos = () => {
  const [termosAceitos, setTermosAceitos] = useState(false);
  const navigate = useNavigate();

  const handleAceitar = () => {
    if (termosAceitos) {
      localStorage.setItem('@KoenmaSushi:termosAceitos', 'true');
      navigate('/carrinho');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="termos-page"
    >
      <div className="container">
        <Link to="/carrinho" className="voltar-link">
          <FiArrowLeft /> Voltar para o Carrinho
        </Link>

        <div className="termos-header">
          <FiFileText size={48} className="termos-icon" />
          <h1>Termos e Condições</h1>
          <p>Por favor, leia atentamente os termos antes de finalizar seu pedido</p>
        </div>

        <div className="termos-content">
          <section className="termos-section">
            <h2>1. Informações Gerais</h2>
            <p>
              O Koenma Sushi é um restaurante especializado em culinária japonesa autêntica. 
              Todos os nossos pratos são preparados com ingredientes frescos e selecionados.
            </p>
          </section>

          <section className="termos-section">
            <h2>2. Pedidos</h2>
            <p>
              Os pedidos podem ser realizados através do nosso site. Após a confirmação do pagamento, 
              o pedido será encaminhado para preparo. O prazo de preparo é de aproximadamente 30 a 60 minutos.
            </p>
          </section>

          <section className="termos-section">
            <h2>3. Formas de Pagamento</h2>
            <p>Aceitamos as seguintes formas de pagamento:</p>
            <ul>
              <li><strong>PIX:</strong> 5% de desconto, pagamento instantâneo</li>
              <li><strong>Cartão de Crédito:</strong> Parcelamento em até 10x sem juros</li>
            </ul>
          </section>

          <section className="termos-section">
            <h2>4. Entrega</h2>
            <p>
              O frete é gratuito para todo o território nacional. O prazo de entrega varia de 
              3 a 15 dias úteis, dependendo da localização. O rastreamento será enviado por email.
            </p>
          </section>

          <section className="termos-section">
            <h2>5. Cancelamento</h2>
            <p>
              O cancelamento do pedido pode ser solicitado até 2 horas antes do início do preparo. 
              Após esse período, não será possível realizar o cancelamento.
            </p>
          </section>

          <section className="termos-section">
            <h2>6. Política de Troca e Devolução</h2>
            <p>
              Você tem até 7 dias após o recebimento para solicitar troca ou devolução, 
              conforme o Código de Defesa do Consumidor. O produto deve estar em sua embalagem original.
            </p>
          </section>

          <section className="termos-section">
            <h2>7. Alergênicos</h2>
            <p>
              Informamos que nossos produtos podem conter glúten, lactose, frutos do mar e outros alérgenos. 
              Caso tenha alguma restrição alimentar, entre em contato antes de realizar o pedido.
            </p>
          </section>

          <section className="termos-section">
            <h2>8. Privacidade</h2>
            <p>
              Seus dados são tratados com total segurança e não serão compartilhados com 
              terceiros sem sua autorização, conforme a LGPD (Lei Geral de Proteção de Dados).
            </p>
          </section>

          <section className="termos-section">
            <h2>9. Contato</h2>
            <p>
              Em caso de dúvidas, reclamações ou sugestões, entre em contato conosco através do email 
              <strong> contato@koenmasushi.com.br</strong> ou pelo telefone <strong>(61) 99999-9999</strong>.
            </p>
          </section>
        </div>

        <div className="termos-aceite">
          <label className="termos-checkbox-large">
            <input
              type="checkbox"
              checked={termosAceitos}
              onChange={(e) => setTermosAceitos(e.target.checked)}
            />
            <span>
              Li e aceito todos os <strong>termos e condições</strong> de compra
            </span>
          </label>

          <div className="termos-buttons">
            <button 
              onClick={() => navigate('/carrinho')}
              className="btn-voltar"
            >
              Voltar
            </button>
            <button 
              onClick={handleAceitar}
              disabled={!termosAceitos}
              className={`btn-aceitar ${!termosAceitos ? 'disabled' : ''}`}
            >
              Aceitar e Continuar
            </button>
          </div>
        </div>

        <div className="termos-ajuda">
          <FiInfo />
          <p>
            Em caso de dúvidas, entre em contato com nosso <Link to="/contato">atendimento</Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Termos;