import { create } from 'zustand';
import { getAdminTransaksis, getTransaksiStatistics, createTransaksi, getMyTransaksi, checkPaymentStatus } from '../services/endpoints/transaksi';

const useTransaksiStore = create((set, get) => ({
  transaksis: [],
  myTransaksis: [],
  statistics: null,
  loading: false,
  error: null,

  // Admin functions
  fetchTransaksis: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await getAdminTransaksis(params);
      set({ transaksis: response.data.data.data || response.data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Gagal memuat transaksis', loading: false });
      throw error;
    }
  },

  fetchStatistics: async () => {
    try {
      const response = await getTransaksiStatistics();
      set({ statistics: response.data.data });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  },



  // User functions
  createTransaksi: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await createTransaksi(data);
      set({ loading: false });
      return response.data.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Gagal membuat transaksi', loading: false });
      throw error;
    }
  },

  fetchMyTransaksis: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getMyTransaksi();
      set({ myTransaksis: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Gagal memuat transaksi', loading: false });
      throw error;
    }
  },

  checkPaymentStatus: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await checkPaymentStatus(id);
      set({ loading: false });
      return response.data.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Gagal cek status pembayaran', loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));

export default useTransaksiStore;
