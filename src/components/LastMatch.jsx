import React from 'react';
import './LastMatch.css';
import BettingWidget from './betting/BettingWidget';

const getPositionTitle = (position) => {
  const positionMap = {
    'Goalkeeper': 'Portero',
    'Defender': 'Defensa',
    'Midfielder': 'Centrocampista',
    'Attacker': 'Delantero',
    'Forward': 'Delantero'
  };
  return positionMap[position] || position;
};

const PlayersList = ({ players, title }) => {
  console.log(`PlayersList - ${title}:`, players);

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
        {players.map((player, index) => {
          const position = getPositionTitle(player.position);
          return (
            <li key={player.id || `player-${index}`} className="player-item">
              <span className="player-number">{player.shirtNumber || '-'}</span>
              <span className="player-name">{player.name}</span>
              <span className="player-position" title={position}>{position}</span>
            </li>
          );
        })}
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

const LastMatch = ({ match, players }) => {
  console.log('LastMatch component - match:', match);
  console.log('LastMatch component - players:', players);

  if (!match) {
    return <div className="last-match">Selecciona un equipo para ver su último partido</div>;
  }

  const matchDetails = match.match || match;

  if (!matchDetails) {
    return <div className="last-match">No se encontró información del último partido</div>;
  }

  const hasPlayers = players && (
    (players.homeTeamPlayers?.length > 0) ||
    (players.awayTeamPlayers?.length > 0) ||
    (players.homeTeamSubstitutes?.length > 0) ||
    (players.awayTeamSubstitutes?.length > 0)
  );

  return (
    <div className="last-match">
      <h2>Último Partido</h2>
      <div className={`match-status ${matchDetails.status.toLowerCase()}`}>
        {matchDetails.status === 'FINISHED' ? 'Finalizado' : 
         matchDetails.status === 'SCHEDULED' ? 'Programado' : 
         matchDetails.status === 'LIVE' ? 'En Vivo' : matchDetails.status}
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
        <div className="score">
          <span>{matchDetails.score?.fullTime?.home || 0}</span>
          <span> - </span>
          <span>{matchDetails.score?.fullTime?.away || 0}</span>
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
        <p>Fecha: {formatDate(matchDetails.utcDate)}</p>
        <p>Competición: {matchDetails.competition?.name || 'No disponible'}</p>
        <p>Jornada: {matchDetails.matchday || 'No disponible'}</p>
      </div>

      <BettingWidget match={match} />

      {!hasPlayers ? (
        <div className="no-players-message">
          <p>La información de los jugadores no está disponible para este partido.</p>
          <p>Esto puede deberse a que:</p>
          <ul>
            <li>El partido es muy antiguo o futuro</li>
            <li>La API no proporciona esta información para esta competición</li>
            <li>Los datos aún no han sido actualizados</li>
          </ul>
        </div>
      ) : (
        <div className="match-players">
          <div className="team-players">
            <PlayersList 
              title={`${matchDetails.homeTeam?.name || 'Equipo Local'} - Alineación`}
              players={players?.homeTeamPlayers}
            />
            
            {players?.homeTeamSubstitutes?.length > 0 && (
              <PlayersList 
                title="Suplentes"
                players={players.homeTeamSubstitutes}
              />
            )}
          </div>
          
          <div className="team-players">
            <PlayersList 
              title={`${matchDetails.awayTeam?.name || 'Equipo Visitante'} - Alineación`}
              players={players?.awayTeamPlayers}
            />
            
            {players?.awayTeamSubstitutes?.length > 0 && (
              <PlayersList 
                title="Suplentes"
                players={players.awayTeamSubstitutes}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LastMatch; 