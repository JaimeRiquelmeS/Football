import React from 'react';
import './Navbar.css';

const Navbar = ({ navigateTo }) => {
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
          <a onClick={() => navigateTo && navigateTo('competitions')} style={{cursor: 'pointer'}}>Competiciones</a>
          <a onClick={() => navigateTo && navigateTo('equipos')} style={{cursor: 'pointer'}}>Equipos</a>
          <a onClick={() => navigateTo && navigateTo('apuestas')} style={{cursor: 'pointer'}}>Apuestas</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 