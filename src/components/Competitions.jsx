import React, { useState, useEffect } from 'react';
import { getCompetitions, getTeamsByCompetition } from '../services/footballService';
import './Competitions.css'; // Importa el archivo CSS

const Competitions = () => {
  const [competitions, setCompetitions] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const data = await getCompetitions();
        console.log(data); // Agrega esto para ver la respuesta de la API en la consola
        if (data && data.competitions) {
          setCompetitions(data.competitions);
        } else {
            console.error("Data.competitions is undefined or data is undefined", data)
        }
      } catch (error) {
        console.error('Failed to fetch competitions', error);
      }
    };

    fetchCompetitions();
  }, []);

  const handleCompetitionClick = async (competitionId) => {
    setSelectedCompetition(competitionId);
    try{
        const data = await getTeamsByCompetition(competitionId);
        setTeams(data.teams);
    } catch (error){
        console.error("Failed to fetch teams", error);
    }
  };

  return (
    <div className="container">
      <h2>Competitions</h2>
      <ul>
        {competitions.map((competition) => (
          <li key={competition.id} onClick={() => handleCompetitionClick(competition.id)}>
            {competition.name}
          </li>
        ))}
      </ul>
        {selectedCompetition && (
            <div className="selected-competition">
                <h3>Teams in selected competition</h3>
                <ul className="team-list">
                    {teams.map((team) =>(
                        <li key={team.id}>
                            {team.name}
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </div>
  );
};

export default Competitions;