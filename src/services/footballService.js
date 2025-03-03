import axios from 'axios';

const BASE_URL = '/api'; // Ahora usa /api como base

const api = axios.create({
  baseURL: BASE_URL,
});

export const getCompetitions = async () => {
  try {
    const response = await api.get('/competitions');
    return response.data;
  } catch (error) {
    console.error('Error fetching competitions:', error);
    throw error;
  }
};

export const getTeamsByCompetition = async (competitionId) => {
  try {
    const response = await api.get(`/competitions/${competitionId}/teams`);
    return response.data;
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

export const getLastMatchByTeam = async (competitionId, teamId) => {
    try {
      const response = await api.get(`/competitions/${competitionId}/matches`);
      const matches = response.data.matches;
  
      console.log('All matches:', matches);
  
      // Filtra los partidos que ya han sido jugados y en los que participó el equipo seleccionado
      const playedMatches = matches.filter(match => {
        const matchDate = new Date(match.utcDate);
        const isPlayed = match.status === 'FINISHED'; // Aquí comprobamos si está terminado
        const teamPlayed = Number(match.homeTeam.id) === Number(teamId) || Number(match.awayTeam.id) === Number(teamId);
  
        console.log(`Match ID: ${match.id}, Date: ${match.utcDate}, Status: ${match.status}, isPlayed: ${isPlayed}, teamPlayed: ${teamPlayed}`);
  
        return isPlayed && teamPlayed;
      });
  
      console.log('Played matches:', playedMatches);
  
      // Ordena los partidos por fecha en orden descendente
      playedMatches.sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate));
  
      console.log('Sorted played matches:', playedMatches);
  
      // Devuelve el último partido jugado
      const lastMatch = playedMatches.length > 0 ? playedMatches[0] : null;
      console.log('Last match object:', lastMatch);
      console.log('Score structure:', JSON.stringify(lastMatch?.score, null, 2));
  
      return lastMatch;
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
  };
  