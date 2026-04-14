import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend, FiUser, FiMessageSquare } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Contato = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validar campos obrigatórios
    if (!formData.nome || !formData.email || !formData.mensagem) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      setLoading(false);
      return;
    }

    // Simular envio
    setTimeout(() => {
      toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      setFormData({
        nome: '',
        email: '',
        assunto: '',
        mensagem: ''
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="contato-page"
    >
      <div className="page-header sushi-header">
        <h1>CONTATO</h1>
        <p>Entre em contato conosco</p>
      </div>

      <div className="container">
        <div className="contato-container">
          {/* Seção de Informações */}
          <div className="contato-info-section">
            <h2 className="info-section-title">Informações de Contato</h2>
            
            <div className="info-card-contato">
              <div className="info-icon-contato">
                <FiMapPin />
              </div>
              <div className="info-content-contato">
                <h3>Endereço</h3>
                <p>Brasília, Ceilândia</p>
                <p>Distrito Federal - DF, 70200-001</p>
              </div>
            </div>

            <div className="info-card-contato">
              <div className="info-icon-contato">
                <FiPhone />
              </div>
              <div className="info-content-contato">
                <h3>Telefone</h3>
                <p>+55 61 99999-9999</p>
                <p>+55 61 3333-3333</p>
              </div>
            </div>

            <div className="info-card-contato">
              <div className="info-icon-contato">
                <FiMail />
              </div>
              <div className="info-content-contato">
                <h3>Email</h3>
                <p>contato@koenmasushi.com.br</p>
                <p>reservas@koenmasushi.com.br</p>
              </div>
            </div>

            <div className="info-card-contato">
              <div className="info-icon-contato">
                <FiClock />
              </div>
              <div className="info-content-contato">
                <h3>Horário de Funcionamento</h3>
                <p>Terça a Domingo: 18h às 23h</p>
                <p>Segunda: Fechado</p>
              </div>
            </div>

            {/* Mapa */}
            <div className="mapa-container">
              <h3>Localização</h3>
              <div className="mapa-placeholder">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3839.176480960813!2d-47.8825933!3d-15.7938787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a3a8573c445db%3A0x3a0e6e3b2b3b3b3b!2sAsa%20Sul%2C%20Bras%C3%ADlia%20-%20DF!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr" 
                  width="100%" 
                  height="200" 
                  style={{ border: 0, borderRadius: '12px' }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa Koenma Sushi"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Seção do Formulário */}
          <div className="contato-form-section">
            <h2 className="form-section-title">Envie uma Mensagem</h2>
            
            <form onSubmit={handleSubmit} className="contato-form">
              <div className="form-group">
                <label htmlFor="nome">
                  <FiUser className="input-icon" />
                  Nome completo <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  placeholder="Digite seu nome completo"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <FiMail className="input-icon" />
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="seu@email.com"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="assunto">
                  <FiSend className="input-icon" />
                  Assunto
                </label>
                <input
                  type="text"
                  id="assunto"
                  name="assunto"
                  value={formData.assunto}
                  onChange={handleChange}
                  placeholder="Assunto da mensagem"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="mensagem">
                  <FiMessageSquare className="input-icon" />
                  Mensagem <span className="required">*</span>
                </label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  rows="5"
                  value={formData.mensagem}
                  onChange={handleChange}
                  required
                  placeholder="Digite sua mensagem aqui..."
                  className="form-textarea"
                />
              </div>

              <button 
                type="submit" 
                className="btn-enviar"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'ENVIAR MENSAGEM'}
                <FiSend className="btn-icon" />
              </button>
              
              <p className="form-obs">
                * Campos obrigatórios. Sua mensagem será respondida em até 24h.
              </p>
            </form>

            {/* Redes Sociais */}
            <div className="redes-sociais">
              <h3>Siga-nos nas redes sociais</h3>
              <div className="social-icons">
                <a href="#" className="social-icon" target="_blank" rel="noopener noreferrer">
                  <span>📱</span> Instagram
                </a>
                <a href="#" className="social-icon" target="_blank" rel="noopener noreferrer">
                  <span>📘</span> Facebook
                </a>
                <a href="#" className="social-icon" target="_blank" rel="noopener noreferrer">
                  <span>🐦</span> Twitter
                </a>
                <a href="#" className="social-icon" target="_blank" rel="noopener noreferrer">
                  <span>💬</span> WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contato;