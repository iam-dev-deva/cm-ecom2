import axios from 'axios';

// Base URL of your REST API. Set VITE_API_URL in your .env file, e.g.
// VITE_API_URL=http://localhost:5000/api
const baseURL = import.meta.env.VITE_API_URL || '/api';

const TOKEN_KEY = 'auth_token';

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY)
};

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach the JWT (if we have one) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = tokenStorage.get();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Normalize errors so the rest of the app can keep doing `e.message`,
// and clear the token on 401s so the app knows the session is dead.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStorage.clear();
    }

    const message = error.response?.data?.message || error.message || 'Something went wrong.';

    return Promise.reject(new Error(message));
  }
);

export default api;
