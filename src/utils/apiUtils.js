import axios from 'axios';
import { getApiUrl } from './apiUrls';
import { getTokenFromLocalStorage } from './functions';

const apiUrl = getApiUrl();
const token = getTokenFromLocalStorage();

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
});

export const get = async (url, params = {}, headers = {}) => {
  try {
    const response = await api.get(url, { params, headers });
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

export const post = async (url, data = {}) => {
  try {
    const response = await api.post(url, data);
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

export const put = async (url, data = {}) => {
  try {
    const response = await api.put(url, data);
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

export const del = async (url) => {
  try {
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    handleRequestError(error);
  }
};

const handleRequestError = (error) => {
  // Handle error (e.g., log, show a notification, etc.)
  console.error('API request error:', error);
  throw error;
};

export default api;