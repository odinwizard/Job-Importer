import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const importJobs = async (url) => {
  try {
    const response = await api.post('/import', { url });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getImportHistory = async (page = 1, limit = 10) => {
  try {
    const response = await api.get('/history', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAvailableJobs = async (page = 1, limit = 10) => {
  try {
    const response = await api.get('/getjobs', {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
