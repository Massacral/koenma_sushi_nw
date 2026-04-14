import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>KOENMA SUSHI</h3>
          <p>Sabor japonês autêntico em Brasília</p>
        </div>
        <div className="footer-section">
          <h4>Links Rápidos</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/cardapio">Cardápio</a></li>
            <li><a href="/reservas">Reservas</a></li>
            <li><a href="/sobre">Sobre</a></li>
            <li><a href="/contato">Contato</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contato</h4>
          <p>contato@koenmasushi.com.br</p>
          <p>+55 61 99999-9999</p>
          <p>Brasília - DF</p>
          <p>Terça a Domingo: 18h às 23h</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Koenma Sushi - Sushi Autêntico. Todos os direitos reservados. Desenvolvido por Tiago Martins</p>
      </div>
    </footer>
  );
};

export default Footer;