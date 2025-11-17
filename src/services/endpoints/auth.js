import api from '../api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/register', userData);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.post('/profile/update', userData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.post('/change-password', passwordData);
    return response.data;
  }
};
