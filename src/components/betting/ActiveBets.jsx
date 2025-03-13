import React from 'react';
import './ActiveBets.css';

const ActiveBets = ({ bets = [], onResolveBet }) => {
  if (!bets.length) {
    return null;
  }
  
  return (
    <div className="active-bets">
      <h3>Tus Apuestas Activas</h3>
      <div className="bets-container">
        {bets.map(bet => (
          <div key={bet.id} className="bet-card">
            <div className="bet-header">
              <span className="bet-type">
                {bet.option === 'home' ? 'Victoria Local' : 
                 bet.option === 'away' ? 'Victoria Visitante' : 
                 bet.option === 'draw' ? 'Empate' :
                 bet.option === 'over2' ? 'Más de 2.5 goles' : 'Menos de 2.5 goles'}
              </span>
              <span className="bet-date">
                {new Date(bet.timestamp).toLocaleDateString()}
              </span>
            </div>
            
            <div className="bet-details">
              <p><strong>Partido:</strong> {bet.matchDetails?.homeTeam} vs {bet.matchDetails?.awayTeam}</p>
              <p><strong>Cantidad:</strong> {bet.amount}€</p>
              <p><strong>Cuota:</strong> {bet.odds}</p>
              <p><strong>Ganancia potencial:</strong> {bet.potential}€</p>
            </div>
            
            {/* Esto es solo para demo, en una app real se resolvería automáticamente */}
            <div className="bet-actions">
              <button 
                className="resolve-win"
                onClick={() => onResolveBet(bet.id, true)}
              >
                Simular Victoria
              </button>
              <button 
                className="resolve-loss"
                onClick={() => onResolveBet(bet.id, false)}
              >
                Simular Derrota
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveBets; 