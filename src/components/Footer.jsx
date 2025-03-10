import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">Sobre Football Stats</h3>
          <p className="footer-content">
            Proporcionamos información actualizada sobre competiciones, equipos y partidos de fútbol 
            utilizando datos oficiales de football-data.org.
          </p>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Enlaces Rápidos</h3>
          <ul className="footer-links">
            <li><a href="/" className="footer-link">Inicio</a></li>
            <li><a href="/competiciones" className="footer-link">Competiciones</a></li>
            <li><a href="/equipos" className="footer-link">Equipos</a></li>
            <li><a href="/partidos" className="footer-link">Partidos</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Competiciones Destacadas</h3>
          <ul className="footer-links">
            <li><a href="/liga" className="footer-link">LaLiga</a></li>
            <li><a href="/premier" className="footer-link">Premier League</a></li>
            <li><a href="/bundesliga" className="footer-link">Bundesliga</a></li>
            <li><a href="/seriea" className="footer-link">Serie A</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Síguenos</h3>
          <div className="footer-social">
            <a href="#" className="social-link" title="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="social-link" title="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="social-link" title="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Football Stats. Todos los derechos reservados.</p>
        <p>Desarrollado con ❤️ usando la API de football-data.org</p>
      </div>
    </footer>
  );
};

export default Footer; 