import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiUsers, FiPhone, FiMail, FiMessageSquare, FiUser, FiMapPin } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Reservas = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    data: '',
    horario: '',
    pessoas: 2,
    observacoes: ''
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
    if (!formData.nome || !formData.email || !formData.telefone || !formData.data || !formData.horario) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      setLoading(false);
      return;
    }

    // Simular envio
    setTimeout(() => {
      toast.success('Reserva realizada com sucesso! Entraremos em contato para confirmar.');
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        data: '',
        horario: '',
        pessoas: 2,
        observacoes: ''
      });
      setLoading(false);
    }, 1500);
  };

  // Gerar datas disponíveis (próximos 30 dias)
  const gerarDatasDisponiveis = () => {
    const datas = [];
    const hoje = new Date();
    for (let i = 1; i <= 30; i++) {
      const data = new Date(hoje);
      data.setDate(hoje.getDate() + i);
      // Pular segundas-feiras (dia 1 = segunda)
      if (data.getDay() !== 1) {
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = data.getFullYear();
        datas.push(`${ano}-${mes}-${dia}`);
      }
    }
    return datas;
  };

  const horarios = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="reservas-page"
    >
      <div className="page-header sushi-header">
        <h1>FAÇA SUA RESERVA</h1>
        <p>Garanta sua experiência gastronômica no Koenma Sushi</p>
      </div>

      <div className="container">
        <div className="reservas-container">
          {/* Informações do Restaurante */}
          <div className="reservas-info-section">
            <h2 className="info-title">Informações</h2>
            
            <div className="info-card">
              <div className="info-icon">
                <FiClock />
              </div>
              <div className="info-content">
                <h3>Horário de Funcionamento</h3>
                <p>Terça a Domingo: 18h às 23h</p>
                <p>Segunda: Fechado</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <FiUsers />
              </div>
              <div className="info-content">
                <h3>Capacidade</h3>
                <p>Máximo de 8 pessoas por mesa</p>
                <p>Grupos maiores: consultar disponibilidade</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <FiCalendar />
              </div>
              <div className="info-content">
                <h3>Antecedência</h3>
                <p>Reservas com até 30 dias de antecedência</p>
                <p>Cancelamento gratuito até 2h antes</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <FiMapPin />
              </div>
              <div className="info-content">
                <h3>Localização</h3>
                <p>Brasília, Asa Sul</p>
                <p>Distrito Federal - DF, 70200-001</p>
              </div>
            </div>
          </div>

          {/* Formulário de Reserva */}
          <div className="reservas-form-section">
            <h2 className="form-title">Dados da Reserva</h2>
            
            <form onSubmit={handleSubmit} className="reserva-form">
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

              <div className="form-row">
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
                  <label htmlFor="telefone">
                    <FiPhone className="input-icon" />
                    Telefone <span className="required">*</span>
                  </label>
                  <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                    placeholder="(61) 99999-9999"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="data">
                    <FiCalendar className="input-icon" />
                    Data <span className="required">*</span>
                  </label>
                  <select
                    id="data"
                    name="data"
                    value={formData.data}
                    onChange={handleChange}
                    required
                    className="form-select"
                  >
                    <option value="">Selecione uma data</option>
                    {gerarDatasDisponiveis().map(data => (
                      <option key={data} value={data}>
                        {new Date(data).toLocaleDateString('pt-BR', { 
                          day: '2-digit', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="horario">
                    <FiClock className="input-icon" />
                    Horário <span className="required">*</span>
                  </label>
                  <select
                    id="horario"
                    name="horario"
                    value={formData.horario}
                    onChange={handleChange}
                    required
                    className="form-select"
                  >
                    <option value="">Selecione um horário</option>
                    {horarios.map(horario => (
                      <option key={horario} value={horario}>
                        {horario}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="pessoas">
                  <FiUsers className="input-icon" />
                  Número de pessoas <span className="required">*</span>
                </label>
                <div className="pessoas-selector">
                  <button
                    type="button"
                    className="pessoas-btn"
                    onClick={() => setFormData({...formData, pessoas: Math.max(1, formData.pessoas - 1)})}
                  >
                    -
                  </button>
                  <span className="pessoas-valor">{formData.pessoas}</span>
                  <button
                    type="button"
                    className="pessoas-btn"
                    onClick={() => setFormData({...formData, pessoas: Math.min(8, formData.pessoas + 1)})}
                  >
                    +
                  </button>
                  <span className="pessoas-info">(máx. 8 pessoas)</span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="observacoes">
                  <FiMessageSquare className="input-icon" />
                  Observações (opcional)
                </label>
                <textarea
                  id="observacoes"
                  name="observacoes"
                  rows="4"
                  value={formData.observacoes}
                  onChange={handleChange}
                  placeholder="Alergias alimentares, preferências, ocasião especial, etc..."
                  className="form-textarea"
                />
              </div>

              <button 
                type="submit" 
                className="btn-reservar-submit"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'CONFIRMAR RESERVA'}
              </button>
              
              <p className="reserva-obs">
                * Sua reserva será confirmada por telefone ou email em até 24h
              </p>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Reservas;