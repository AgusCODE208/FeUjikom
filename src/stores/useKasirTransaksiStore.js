import { create } from 'zustand';
import api from '../services/api';

const useKasirTransaksiStore = create((set) => ({
  films: [],
  jadwals: [],
  seats: [],
  loading: false,
  error: null,

  fetchFilms: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/kasir/films');
      set({ films: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch films', loading: false });
      throw error;
    }
  },

  fetchJadwals: async (filmId, tanggal) => {
    set({ loading: true, error: null });
    try {
      console.log('🚀 [Store] Fetching jadwals with:', { filmId, tanggal });
      
      const params = { film_id: filmId };
      // Hanya tambahkan tanggal jika ada nilai yang valid
      if (tanggal && tanggal !== '') {
        params.tanggal = tanggal;
      }
      
      console.log('📤 [Store] Request params:', params);
      
      const response = await api.get('/kasir/jadwals', { params });
      
      console.log('📥 [Store] Jadwals response:', response.data);
      console.log('📊 [Store] Data count:', response.data.data?.length);
      
      set({ jadwals: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      console.error('❌ [Store] Fetch jadwals error:', error.response || error);
      set({ 
        error: error.response?.data?.message || 'Failed to fetch jadwals', 
        loading: false,
        jadwals: []
      });
      // Return empty array instead of throwing
      return [];
    }
  },

  fetchSeats: async (jadwalId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/kasir/jadwals/${jadwalId}/seats`);
      set({ seats: response.data.data.seats, loading: false });
      return response.data.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch seats', loading: false });
      throw error;
    }
  },

  createTransaksi: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/kasir/transaksi', data);
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create transaction', loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useKasirTransaksiStore;
