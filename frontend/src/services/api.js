import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8085/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error message from backend
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
