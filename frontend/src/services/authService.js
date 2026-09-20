import api from './api';

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data; // { success, message, data: { token, type, id, username, fullName, role } }
  },

  register: async ({ username, password, fullName, role }) => {
    const response = await api.post('/auth/register', { username, password, fullName, role });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
