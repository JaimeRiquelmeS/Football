import React from 'react';

const CompetitionSelector = ({ competitions, selectedCompetition, onCompetitionChange, loading }) => {
  return (
    <select onChange={onCompetitionChange} value={selectedCompetition || ''}>
      <option value="" disabled>Select a competition</option>
      {competitions.map(competition => (
        <option key={competition.id} value={competition.id}>
          {competition.name}
        </option>
      ))}
    </select>
  );
};

export default CompetitionSelector; 