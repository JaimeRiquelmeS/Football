import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import UserBalance from './betting/UserBalance';
import ActiveBets from './betting/ActiveBets';
import { getUserBalance, getActiveBets, getBetHistory, resolveBet } from '../services/bettingService';
import './BettingPage.css';

const BettingPage = ({ navigateTo }) => {
  const [balance, setBalance] = useState(0);
  const [activeBets, setActiveBets] = useState([]);
  const [betHistory, setBetHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  
  useEffect(() => {
    // Cargar datos al montar el componente
    loadUserData();
  }, []);
  
  const loadUserData = () => {
    setBalance(getUserBalance());
    setActiveBets(getActiveBets());
    setBetHistory(getBetHistory());
  };
  
  const handleBalanceUpdate = (newBalance) => {
    setBalance(newBalance);
  };
  
  const handleResolveBet = (betId, isWinner) => {
    try {
      resolveBet(betId, isWinner);
      loadUserData(); // Recargar los datos
      alert(isWinner ? '¡Apuesta ganada!' : 'Apuesta perdida');
    } catch (error) {
      alert(error.message);
    }
  };
  
  return (
    <div className="app-container">
      <Navbar navigateTo={navigateTo} />
      <main className="main-content">
        <div className="container">
          <h1 className="page-title">Centro de Apuestas</h1>
          
          <UserBalance 
            balance={balance} 
            onBalanceUpdate={handleBalanceUpdate} 
          />
          
          <div className="betting-tabs">
            <button 
              className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
              onClick={() => setActiveTab('active')}
            >
              Apuestas Activas
            </button>
            <button 
              className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              Historial
            </button>
          </div>
          
          {activeTab === 'active' ? (
            activeBets.length > 0 ? (
              <ActiveBets bets={activeBets} onResolveBet={handleResolveBet} />
            ) : (
              <div className="no-bets-message">
                <p>No tienes apuestas activas en este momento.</p>
                <p>Ve a la sección de competiciones para realizar apuestas en los partidos.</p>
              </div>
            )
          ) : (
            <div className="bet-history">
              <h3>Historial de Apuestas</h3>
              {betHistory.length > 0 ? (
                <div className="history-list">
                  {betHistory.map(bet => (
                    <div 
                      key={bet.id} 
                      className={`history-item ${bet.status === 'won' ? 'won' : 'lost'}`}
                    >
                      <div className="history-header">
                        <span className="bet-type">
                          {bet.option === 'home' ? 'Victoria Local' : 
                           bet.option === 'away' ? 'Victoria Visitante' : 
                           bet.option === 'draw' ? 'Empate' :
                           bet.option === 'over2' ? 'Más de 2.5 goles' : 'Menos de 2.5 goles'}
                        </span>
                        <span className="bet-result">
                          {bet.status === 'won' ? 'Ganada' : 'Perdida'}
                        </span>
                      </div>
                      <div className="history-details">
                        <p><strong>Partido:</strong> {bet.matchDetails?.homeTeam} vs {bet.matchDetails?.awayTeam}</p>
                        <p><strong>Cantidad:</strong> {bet.amount}€</p>
                        <p><strong>Cuota:</strong> {bet.odds}</p>
                        <p>
                          <strong>
                            {bet.status === 'won' ? 'Ganancia:' : 'Potencial:'}
                          </strong> {bet.potential}€
                        </p>
                        <p><strong>Fecha:</strong> {new Date(bet.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-bets-message">No tienes historial de apuestas.</p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BettingPage; 