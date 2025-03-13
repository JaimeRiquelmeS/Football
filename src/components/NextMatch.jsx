import React from 'react';
import './LastMatch.css'; // Reutilizamos los estilos de LastMatch
import BettingWidget from './betting/BettingWidget';

const PlayersList = ({ players, title }) => {
  if (!players || players.length === 0) {
    return (
      <div className="players-section">
        <h3>{title}</h3>
        <p className="no-data">No hay información de jugadores disponible para este equipo</p>
      </div>
    );
  }

  return (
    <div className="players-section">
      <h3>{title}</h3>
      <ul className="players-list">
        {players.map((player, index) => (
          <li key={player.id || `player-${index}`} className="player-item">
            <span className="player-number">{player.shirtNumber || '-'}</span>
            <span className="player-name">{player.name}</span>
            <span className="player-position">{player.position || 'N/A'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const formatDate = (dateString) => {
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('es-ES', options);
};

// Función para calcular el tiempo restante hasta el partido
const getTimeRemaining = (dateString) => {
  const matchDate = new Date(dateString);
  const now = new Date();
  const diff = matchDate - now;
  
  // Si el partido ya pasó
  if (diff < 0) return "El partido ya ha comenzado";
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  let remainingText = '';
  if (days > 0) remainingText += `${days} día${days !== 1 ? 's' : ''} `;
  if (hours > 0) remainingText += `${hours} hora${hours !== 1 ? 's' : ''} `;
  if (minutes > 0) remainingText += `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
  
  return `Faltan ${remainingText} para el partido`;
};

const NextMatch = ({ match, players }) => {
  if (!match) {
    return <div className="last-match">Selecciona un equipo para ver su próximo partido</div>;
  }

  const matchDetails = match.match || match;

  if (!matchDetails) {
    return <div className="last-match">No se encontró información del próximo partido</div>;
  }

  const hasPlayers = players && (
    (players.homeTeamPlayers?.length > 0) ||
    (players.awayTeamPlayers?.length > 0) ||
    (players.homeTeamSubstitutes?.length > 0) ||
    (players.awayTeamSubstitutes?.length > 0)
  );

  return (
    <div className="last-match">
      <h2>Próximo Partido</h2>
      <div className={`match-status ${matchDetails.status.toLowerCase()}`}>
        {matchDetails.status === 'SCHEDULED' ? 'Programado' : 
         matchDetails.status === 'POSTPONED' ? 'Pospuesto' : 
         matchDetails.status === 'CANCELED' ? 'Cancelado' : matchDetails.status}
      </div>
      
      <div className="match-details">
        <div className="team home-team">
          <img 
            src={matchDetails.homeTeam?.crest} 
            alt={matchDetails.homeTeam?.name || 'Equipo local'} 
            className="team-logo" 
          />
          <p>{matchDetails.homeTeam?.name}</p>
        </div>
        <div className="vs">
          <span>VS</span>
        </div>
        <div className="team away-team">
          <img 
            src={matchDetails.awayTeam?.crest} 
            alt={matchDetails.awayTeam?.name || 'Equipo visitante'} 
            className="team-logo" 
          />
          <p>{matchDetails.awayTeam?.name}</p>
        </div>
      </div>
      
      <div className="match-info">
        <p>Fecha: {matchDetails.utcDate ? formatDate(matchDetails.utcDate) : 'No disponible'}</p>
        <p>Competición: {matchDetails.competition?.name || 'No disponible'}</p>
        <p>Jornada: {matchDetails.matchday || 'No disponible'}</p>
        <p className="countdown">{getTimeRemaining(matchDetails.utcDate)}</p>
      </div>

      {/* Widget de apuestas */}
      <BettingWidget match={match} />

      {/* Sección de alineaciones probables (si hay datos disponibles) */}
      {hasPlayers ? (
        <div className="match-players">
          <h3>Alineaciones Probables</h3>
          <div className="team-players">
            <PlayersList 
              title={`${matchDetails.homeTeam?.name || 'Equipo Local'} - Posible Alineación`}
              players={players?.homeTeamPlayers}
            />
          </div>
          
          <div className="team-players">
            <PlayersList 
              title={`${matchDetails.awayTeam?.name || 'Equipo Visitante'} - Posible Alineación`}
              players={players?.awayTeamPlayers}
            />
          </div>
        </div>
      ) : (
        <div className="no-players-message">
          <p>La información de los jugadores aún no está disponible para este partido.</p>
          <p>Las alineaciones probables se publicarán más cerca de la fecha del partido.</p>
        </div>
      )}
      
      {/* Estadísticas recientes o h2h si estuvieran disponibles */}
      <div className="match-stats">
        <h3>Estadísticas Previas</h3>
        <p className="no-data">Las estadísticas previas no están disponibles actualmente.</p>
      </div>
    </div>
  );
};

export default NextMatch; 