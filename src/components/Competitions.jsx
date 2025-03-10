import React, { useState, useEffect } from 'react';
import { getCompetitions, getTeamsByCompetition, getLastMatchByTeam, getMatchPlayers } from '../services/footballService';
import Navbar from './Navbar';
import Footer from './Footer';
import CompetitionSelector from './CompetitionSelector';
import TeamSelector from './TeamSelector';
import LastMatch from './LastMatch';
import './Competitions.css';

const Competitions = () => {
  const [competitions, setCompetitions] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [lastMatch, setLastMatch] = useState(null);
  const [matchPlayers, setMatchPlayers] = useState(null);
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
    setMatchPlayers(null);
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
    setLastMatch(null);
    setMatchPlayers(null);

    try {
      console.log('Buscando último partido para el equipo:', teamId);
      const match = await getLastMatchByTeam(selectedCompetition, teamId);
      
      if (match) {
        setLastMatch({ match: match });
        
        if (match.id) {
          console.log('Buscando jugadores del partido:', match.id);
          try {
            const playersData = await getMatchPlayers(match.id);
            
            if (playersData) {
              setMatchPlayers(playersData);
            } else {
              console.log('No se encontraron datos de jugadores');
              setError('No hay información de jugadores disponible para este partido');
            }
          } catch (playerError) {
            console.error('Error al obtener jugadores:', playerError);
            // No mostramos el error técnico al usuario
            setError('No se pudieron cargar los jugadores del partido. Por favor, inténtalo de nuevo más tarde.');
          }
        } else {
          setError('No se puede obtener información de jugadores para este partido');
        }
      } else {
        setError('No se encontró información del último partido para este equipo');
      }
    } catch (error) {
      console.error('Error en handleTeamChange:', error);
      setError(error.message || 'Error al cargar la información del partido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <div className="container">
          <h1 className="page-title">Competiciones</h1>
          {loading && <div className="spinner">Cargando...</div>}
          {error && <div className="error">{error}</div>}
          
          <CompetitionSelector 
            competitions={competitions}
            selectedCompetition={selectedCompetition}
            onCompetitionChange={handleCompetitionChange}
            loading={loading}
          />

          <TeamSelector 
            teams={teams}
            selectedTeam={selectedTeam}
            onTeamChange={handleTeamChange}
          />

          <LastMatch match={lastMatch} players={matchPlayers} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Competitions;