import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiAward, FiCoffee, FiHeart } from 'react-icons/fi';

const Sobre = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="sobre-page"
    >
      <div className="page-header sushi-header">
        <h1>SOBRE NÓS</h1>
        <p>Conheça a história do Koenma Sushi</p>
      </div>
      
      <div className="container">
        {/* Hero da Página Sobre */}
        <div className="sobre-hero">
          <div className="sobre-hero-content">
            <h2 className="sobre-hero-title">KOENMA SUSHI</h2>
            <p className="sobre-hero-subtitle">
              Uma jornada de sabores e tradição
            </p>
          </div>
        </div>

        {/* História */}
        <div className="sobre-historia">
          <div className="sobre-texto">
            <h3 className="sobre-titulo-secao">Nossa História</h3>
            <p>
              Fundado em 2020, o Koenma Sushi nasceu da paixão pela culinária japonesa autêntica 
              e do desejo de oferecer uma experiência gastronômica única em Brasília. Desde o primeiro 
              dia, nossa missão tem sido levar o verdadeiro sabor do Japão para nossos clientes, 
              combinando tradição e inovação.
            </p>
            <p>
              Nosso compromisso é com a qualidade e frescor dos ingredientes. Trabalhamos apenas com 
              fornecedores selecionados que nos garantem os melhores peixes e produtos diretamente do 
              Japão e de fontes sustentáveis.
            </p>
            <p>
              Cada prato é preparado com dedicação e técnica, respeitando as tradições milenares da 
              culinária japonesa. No Koenma Sushi, acreditamos que comer é uma experiência que envolve 
              todos os sentidos.
            </p>
            <p>
              Por isso, nosso ambiente foi cuidadosamente projetado para proporcionar conforto, 
              elegância e uma atmosfera acolhedora. Venha nos visitar e descubra o que a verdadeira 
              culinária japonesa tem a oferecer!
            </p>
          </div>
        </div>

        {/* Valores */}
        <div className="sobre-valores">
          <h3 className="sobre-titulo-secao centralizado">Nossos Valores</h3>
          <div className="valores-grid">
            <div className="valor-card">
              <div className="valor-icon">
                <FiHeart />
              </div>
              <h4>Paixão</h4>
              <p>Amor pela culinária japonesa e dedicação em cada prato</p>
            </div>
            <div className="valor-card">
              <div className="valor-icon">
                <FiAward />
              </div>
              <h4>Qualidade</h4>
              <p>Ingredientes frescos e selecionados com rigor</p>
            </div>
            <div className="valor-card">
              <div className="valor-icon">
                <FiCoffee />
              </div>
              <h4>Hospitalidade</h4>
              <p>Atendimento acolhedor e experiência única</p>
            </div>
            <div className="valor-card">
              <div className="valor-icon">
                <FiUsers />
              </div>
              <h4>Tradição</h4>
              <p>Respeito às técnicas e sabores originais</p>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="sobre-stats">
          <div className="stat-card">
            <div className="stat-number">500+</div>
            <div className="stat-label">Clientes Felizes</div>
            <div className="stat-desc">Pessoas que já experimentaram nossa culinária</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">50+</div>
            <div className="stat-label">Pratos Especiais</div>
            <div className="stat-desc">Opções variadas para todos os gostos</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">100%</div>
            <div className="stat-label">Ingredientes Frescos</div>
            <div className="stat-desc">Produtos selecionados diariamente</div>
          </div>
        </div>

        {/* Chef */}
        <div className="sobre-chef">
          <div className="chef-content">
            <div className="chef-info">
              <h3 className="sobre-titulo-secao">Nosso Chef</h3>
              <p className="chef-nome">Chef Miyagi</p>
              <p className="chef-descricao">
                Com mais de 20 anos de experiência no Japão e no Brasil, o Chef Kenji traz 
                consigo a tradição e o amor pela culinária japonesa. Formado em Osaka, 
                ele dedica-se a criar pratos que equilibram perfeitamente sabor, textura e 
                apresentação. Cada criação é uma obra de arte que reflete sua paixão pela 
                gastronomia.
              </p>
              <div className="chef-destaques">
                <span>✨ 20+ anos de experiência</span>
                <span>🍣 Especialista em Sushi Tradicional</span>
                <span>🏆 Prêmio Melhor Chef 2023</span>
              </div>
            </div>
            <div className="chef-imagem">
              <img 
                src="https://s2-oglobo.glbimg.com/AyKV19Yep36WpBonHrdNTbBNbIg=/0x0:700x664/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_da025474c0c44edd99332dddb09cabe8/internal_photos/bs/2022/u/K/XlsEdNSc6ajx88wyyQ6Q/35773276-sx-rio-de-janeiro-rj-19-08-2010-filme-karate-kid-de-1984-foto-divulgacao.jpg" 
                alt="Chef Miyagi"
              />
            </div>
          </div>
        </div>

        {/* Convidativo */}
        <div className="sobre-convite">
          <h3>Venha nos Conhecer</h3>
          <p>
            Estamos te esperando para uma experiência gastronômica inesquecível. 
            Reserve sua mesa e venha descobrir o verdadeiro sabor do Japão.
          </p>
          <button className="btn-luxury btn-sushi" onClick={() => window.location.href = '/reservas'}>
            FAÇA SUA RESERVA
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Sobre;