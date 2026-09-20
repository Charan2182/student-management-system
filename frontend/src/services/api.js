import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8085/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sms_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for standardized error handling and 401 management
api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred. Please try again.';
    let validationErrors = null;

    if (error.response) {
      const data = error.response.data;
      if (data && data.message) {
        message = data.message;
      }
      if (data && data.validationErrors) {
        validationErrors = data.validationErrors;
      }

      // If unauthorized on a protected endpoint, clear saved token
      if (error.response.status === 401 && !error.config.url.includes('/auth/login')) {
        localStorage.removeItem('sms_token');
        localStorage.removeItem('sms_user');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      message = 'Cannot reach backend server. Please make sure Spring Boot is running on port 8085.';
    }

    const customError = new Error(message);
    customError.status = error.response ? error.response.status : 0;
    customError.validationErrors = validationErrors;
    return Promise.reject(customError);
  }
);

export default api;
