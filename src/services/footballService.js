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

