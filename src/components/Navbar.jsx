import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-brand">
          <img 
            src="https://www.football-data.org/assets/logo.jpg" 
            alt="Football Data" 
            className="navbar-logo"
          />
          <h1 className="navbar-title">Football Stats</h1>
        </a>
        
        <div className="navbar-links">
          <a href="/" className="navbar-link active">Competiciones</a>
          <a href="/equipos" className="navbar-link">Equipos</a>
          <a href="/partidos" className="navbar-link">Partidos</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 