import { create } from 'zustand';
import api from '../services/api';

const useOwnerStore = create((set) => ({
  dashboardData: null,
  loading: false,
  error: null,

  fetchDashboard: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      console.log('Fetching dashboard with params:', params);
      const response = await api.get('/owner/dashboard', { params });
      console.log('Dashboard response:', response.data.data);
      set({ dashboardData: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      set({ error: error.response?.data?.message || 'Failed to fetch dashboard', loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useOwnerStore;
