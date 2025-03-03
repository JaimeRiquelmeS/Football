import React, { useState, useEffect } from 'react';
import { getCompetitions, getTeamsByCompetition, getLastMatchByTeam } from '../services/footballService';
import './Competitions.css';

const Competitions = () => {
  const [competitions, setCompetitions] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [lastMatch, setLastMatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompetitions = async () => {
      setLoading(true);
      try {
        const data = await getCompetitions();
        setCompetitions(data.competitions);
      } catch (error) {
        setError('Failed to fetch competitions');
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, []);

  const handleCompetitionChange = async (event) => {
    const competitionId = event.target.value;
    setSelectedCompetition(competitionId);
    setSelectedTeam(null);
    setLastMatch(null);
    setLoading(true);
    setError(null);
    try {
      const teamsData = await getTeamsByCompetition(competitionId);
      setTeams(teamsData.teams);
    } catch (error) {
      setError('Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  const handleTeamChange = async (event) => {
    const teamId = event.target.value;
    setSelectedTeam(teamId);
    setLoading(true);
    setError(null);
    try {
      const match = await getLastMatchByTeam(selectedCompetition, teamId);
      setLastMatch(match);
    } catch (error) {
      setError('Failed to fetch last match');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <h1>Football App</h1>
        <h3>permite a los usuarios ver competiciones de fútbol</h3>
      </nav>
      <div className="container">
        <h1>Competitions</h1>
        {loading && <div className="spinner">Loading...</div>}
        {error && <div className="error">{error}</div>}
        <select onChange={handleCompetitionChange} value={selectedCompetition || ''}>
          <option value="" disabled>Select a competition</option>
          {competitions.map(competition => (
            <option key={competition.id} value={competition.id}>
              {competition.name}
            </option>
          ))}
        </select>

        {teams.length > 0 && (
          <select onChange={handleTeamChange} value={selectedTeam || ''}>
            <option value="" disabled>Select a team</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        )}

        {lastMatch && (
          <div className="last-match">
            <h2>Last Match</h2>
            <p>{lastMatch.homeTeam.name} vs {lastMatch.awayTeam.name}</p>
            <p>Date: {new Date(lastMatch.utcDate).toLocaleString()}</p>
            <div>
              <h3>Score Structure</h3>
              <p>Winner: {lastMatch.score.winner}</p>
              <p>Duration: {lastMatch.score.duration}</p>
              <p>Full Time: {lastMatch.score.fullTime.home} - {lastMatch.score.fullTime.away}</p>
              <p>Half Time: {lastMatch.score.halfTime.home} - {lastMatch.score.halfTime.away}</p>
            </div>
          </div>
        )}
      </div>
      <footer className="footer">
        <p>Esta app muestra competiciones y equipos de fútbol con sus últimos partidos.</p>
      </footer>
    </div>
  );
};

export default Competitions;