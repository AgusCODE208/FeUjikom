import { create } from 'zustand';
import { getKasirDashboard, getKasirRiwayatTransaksi, getKasirTransaksiDetail, refundTransaksi } from '../services/endpoints/kasir';

const useKasirStore = create((set) => ({
  dashboard: null,
  riwayatTransaksi: [],
  transaksiDetail: null,
  loading: false,
  error: null,

  fetchDashboard: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await getKasirDashboard(params);
      set({ dashboard: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Gagal memuat dashboard', loading: false });
      throw error;
    }
  },

  fetchRiwayatTransaksi: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await getKasirRiwayatTransaksi(params);
      set({ riwayatTransaksi: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Gagal memuat riwayat transaksi', loading: false });
      throw error;
    }
  },

  fetchTransaksiDetail: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await getKasirTransaksiDetail(id);
      set({ transaksiDetail: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Gagal memuat detail transaksi', loading: false });
      throw error;
    }
  },

  refundTransaksi: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await refundTransaksi(id, data);
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Gagal memproses refund', loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useKasirStore;
