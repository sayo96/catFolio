import axios from 'axios';
import { API_BASE, API_KEY } from '../../constants/config';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'x-api-key': API_KEY },
  adapter: 'fetch',
});

function normalizeError(error) {
  if (error.response) {
    const { data, status } = error.response;
    const message =
      (data && (data.message || data.error)) ||
      (typeof data === 'string' && data) ||
      `Request failed (${status}).`;
    return new Error(message);
  }
  if (error.request) {
    return new Error('Network error. Check your connection and try again.');
  }
  return new Error(error.message || 'Something went wrong.');
}

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeError(error)),
);
