import React from 'react';

const TeamSelector = ({ teams, selectedTeam, onTeamChange }) => {
  if (teams.length === 0) return null;
  
  return (
    <select onChange={onTeamChange} value={selectedTeam || ''}>
      <option value="" disabled>Select a team</option>
      {teams.map(team => (
        <option key={team.id} value={team.id}>
          {team.name}
        </option>
      ))}
    </select>
  );
};

export default TeamSelector; 