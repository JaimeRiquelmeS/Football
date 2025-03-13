import axios from 'axios';

const BASE_URL = '/api'; // Ahora usa /api como base

const api = axios.create({
  baseURL: BASE_URL,
});

// Función para esperar un tiempo determinado
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Función para reintentar una petición
const retryRequest = async (fn, retries = 3, delayMs = 1000) => {
  try {
    return await fn();
  } catch (error) {
    if (error.response?.status === 429 && retries > 0) {
      console.log(`Rate limit alcanzado. Esperando ${delayMs}ms antes de reintentar...`);
      await delay(delayMs);
      return retryRequest(fn, retries - 1, delayMs * 2);
    }
    throw error;
  }
};

// Función para manejar errores de la API
const handleApiError = (error) => {
  if (error.response) {
    switch (error.response.status) {
      case 429:
        return 'Has excedido el límite de peticiones. Por favor, espera un momento y vuelve a intentarlo.';
      case 403:
        return 'No tienes permiso para acceder a estos datos. Verifica tu API key.';
      case 404:
        return 'La información solicitada no está disponible.';
      default:
        return `Error del servidor: ${error.response.status}`;
    }
  }
  return 'Error de conexión. Por favor, verifica tu conexión a internet.';
};

export const getCompetitions = async () => {
  try {
    const response = await retryRequest(() => api.get('/competitions'));
    return response.data;
  } catch (error) {
    console.error('Error fetching competitions:', error);
    throw new Error(handleApiError(error));
  }
};

export const getTeamsByCompetition = async (competitionId) => {
  try {
    const response = await retryRequest(() => 
      api.get(`/competitions/${competitionId}/teams`)
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw new Error(handleApiError(error));
  }
};

export const getNextMatchByTeam = async (competitionId, teamId) => {
  try {
    const response = await api.get(`/competitions/${competitionId}/matches`);
    const matches = response.data.matches;
    const currentDate = new Date();

    // Filtra los partidos que aún no se han jugado y en los que participará el equipo seleccionado
    const upcomingMatches = matches.filter(match => {
      const matchDate = new Date(match.utcDate);
      const isUpcoming = matchDate > currentDate;
      const teamPlays = Number(match.homeTeam.id) === Number(teamId) || 
                      Number(match.awayTeam.id) === Number(teamId);
      return isUpcoming && teamPlays;
    });

    // Ordena los partidos por fecha en orden ascendente (el más cercano primero)
    upcomingMatches.sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate));

    // Devuelve el próximo partido
    return upcomingMatches.length > 0 ? upcomingMatches[0] : null;
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw new Error(handleApiError(error));
  }
};

export const getLastMatchByTeam = async (competitionId, teamId) => {
  try {
    const response = await api.get(`/competitions/${competitionId}/matches`);
    const matches = response.data.matches;

    // Filtra los partidos que ya han sido jugados y en los que participó el equipo seleccionado
    const playedMatches = matches.filter(match => {
      const isPlayed = match.status === 'FINISHED';
      const teamPlayed = Number(match.homeTeam.id) === Number(teamId) || 
                        Number(match.awayTeam.id) === Number(teamId);
      return isPlayed && teamPlayed;
    });

    // Ordena los partidos por fecha en orden descendente
    playedMatches.sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate));

    // Devuelve el último partido jugado
    return playedMatches.length > 0 ? playedMatches[0] : null;
  } catch (error) {
    console.error('Error fetching matches:', error);
    throw new Error(handleApiError(error));
  }
};

// Función para obtener los jugadores de un partido específico
export const getMatchPlayers = async (matchId) => {
  try {
    const response = await retryRequest(() => api.get(`/matches/${matchId}`));
    const data = response.data;
    
    if (!data.homeTeam || !data.awayTeam) {
      throw new Error('Datos del partido no disponibles');
    }

    const homeTeam = data.homeTeam;
    const awayTeam = data.awayTeam;

    // Procesar jugadores...
    const result = {
      homeTeamPlayers: processTeamPlayers(homeTeam, 'home'),
      awayTeamPlayers: processTeamPlayers(awayTeam, 'away'),
      homeTeamSubstitutes: processTeamSubstitutes(homeTeam, 'home'),
      awayTeamSubstitutes: processTeamSubstitutes(awayTeam, 'away')
    };

    return result;
  } catch (error) {
    console.error('Error fetching match players:', error);
    throw new Error(handleApiError(error));
  }
};

// Funciones auxiliares para procesar jugadores
const processTeamPlayers = (team, prefix) => {
  const players = team.lineup || team.squad || team.players || [];
  return players.map(player => ({
    id: player.id || `${prefix}-${Math.random()}`,
    name: player.name || 'Nombre no disponible',
    position: player.position || 'N/A',
    shirtNumber: player.shirtNumber || player.number || '-'
  }));
};

const processTeamSubstitutes = (team, prefix) => {
  const subs = team.bench || team.substitutes || [];
  return subs.map(player => ({
    id: player.id || `${prefix}-sub-${Math.random()}`,
    name: player.name || 'Nombre no disponible',
    position: player.position || 'N/A',
    shirtNumber: player.shirtNumber || player.number || '-'
  }));
};
  