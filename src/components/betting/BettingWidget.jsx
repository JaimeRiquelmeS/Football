import React, { useState } from 'react';
import './BettingWidget.css';
import { placeBet } from '../../services/bettingService';

const BettingWidget = ({ match, onBetPlaced }) => {
  const [betAmount, setBetAmount] = useState(10);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  
  if (!match || !match.match) return null;
  
  const { homeTeam, awayTeam } = match.match;
  
  // Cuotas calculadas basadas en estadísticas (simuladas)
  const odds = {
    home: (Math.random() * 2 + 1.1).toFixed(2),
    draw: (Math.random() * 3 + 2).toFixed(2),
    away: (Math.random() * 2 + 1.1).toFixed(2),
    over2: (Math.random() * 2 + 1.5).toFixed(2), 
    under2: (Math.random() * 2 + 1.5).toFixed(2)
  };
  
  const handleBet = () => {
    if (!selectedOption) return;
    
    try {
      const result = placeBet({
        matchId: match.match.id,
        option: selectedOption,
        amount: betAmount,
        odds: odds[selectedOption],
        potential: (betAmount * odds[selectedOption]).toFixed(2),
        matchDetails: {
          homeTeam: homeTeam.name,
          awayTeam: awayTeam.name,
          date: match.match.utcDate
        }
      });
      
      alert(`¡Apuesta realizada con éxito! Saldo restante: ${result.newBalance.toFixed(2)}€`);
      
      // Notificar al componente padre si es necesario
      if (onBetPlaced) {
        onBetPlaced(result.newBalance);
      }
      
      // Reset form
      setSelectedOption(null);
      setIsOpen(false);
    } catch (error) {
      alert(error.message);
    }
  };
  
  return (
    <div className="betting-widget">
      <button 
        className="betting-toggle" 
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? 'Ocultar Apuestas' : 'Mostrar Apuestas'}
      </button>
      
      {isOpen && (
        <div className="betting-content">
          <h3>Realizar Apuesta</h3>
          
          <div className="betting-options">
            <div 
              className={`bet-option ${selectedOption === 'home' ? 'selected' : ''}`}
              onClick={() => setSelectedOption('home')}
            >
              <span className="team-name">{homeTeam.name}</span>
              <span className="odds">{odds.home}</span>
            </div>
            
            <div 
              className={`bet-option ${selectedOption === 'draw' ? 'selected' : ''}`}
              onClick={() => setSelectedOption('draw')}
            >
              <span className="team-name">Empate</span>
              <span className="odds">{odds.draw}</span>
            </div>
            
            <div 
              className={`bet-option ${selectedOption === 'away' ? 'selected' : ''}`}
              onClick={() => setSelectedOption('away')}
            >
              <span className="team-name">{awayTeam.name}</span>
              <span className="odds">{odds.away}</span>
            </div>
          </div>
          
          <div className="more-options">
            <div 
              className={`bet-option ${selectedOption === 'over2' ? 'selected' : ''}`}
              onClick={() => setSelectedOption('over2')}
            >
              <span>Más de 2.5 goles</span>
              <span className="odds">{odds.over2}</span>
            </div>
            
            <div 
              className={`bet-option ${selectedOption === 'under2' ? 'selected' : ''}`}
              onClick={() => setSelectedOption('under2')}
            >
              <span>Menos de 2.5 goles</span>
              <span className="odds">{odds.under2}</span>
            </div>
          </div>
          
          <div className="bet-amount">
            <label htmlFor="amount">Cantidad a apostar (€):</label>
            <input 
              type="number" 
              id="amount"
              min="1"
              value={betAmount}
              onChange={(e) => setBetAmount(Number(e.target.value))}
            />
          </div>
          
          {selectedOption && (
            <div className="potential-win">
              Ganancia potencial: <span>{(betAmount * odds[selectedOption]).toFixed(2)}€</span>
            </div>
          )}
          
          <button 
            className="place-bet-button"
            disabled={!selectedOption}
            onClick={handleBet}
          >
            Realizar Apuesta
          </button>
        </div>
      )}
    </div>
  );
};

export default BettingWidget; 