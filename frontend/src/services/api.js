import axios from 'axios';

// Create API client
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Request interceptor: Attach JWT token if available
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('routewise_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor: Global error handler
api.interceptors.response.use(
  response => response.data,
  error => {
    const message = error.response?.data?.message || error.message || 'An unexpected network error occurred';
    
    // Automatically clear token on 401 Unauthorized
    if (error.response?.status === 401 && localStorage.getItem('routewise_token')) {
      localStorage.removeItem('routewise_token');
      localStorage.removeItem('routewise_user');
      window.dispatchEvent(new Event('auth-expired'));
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
