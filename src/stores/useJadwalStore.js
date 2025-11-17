import { create } from 'zustand';
import { getAdminJadwals, createJadwal, updateJadwal, deleteJadwal, getJadwalStatistics, getTrashedJadwals, restoreJadwal, forceDeleteJadwal } from '../services/endpoints/jadwal';

const useJadwalStore = create((set, get) => ({
  jadwals: [],
  statistics: null,
  trashedJadwals: [],
  loading: false,
  error: null,

  fetchJadwals: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await getAdminJadwals(params);
      set({ jadwals: response.data.data.data || response.data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Gagal memuat jadwals', loading: false });
      throw error;
    }
  },

  fetchStatistics: async () => {
    try {
      const response = await getJadwalStatistics();
      set({ statistics: response.data.data });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  },

  addJadwal: async (data) => {
    set({ loading: true, error: null });
    try {
      await createJadwal(data);
      await get().fetchJadwals();
      await get().fetchStatistics();
      set({ loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Gagal menambah jadwal', loading: false });
      throw error;
    }
  },

  editJadwal: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await updateJadwal(id, data);
      await get().fetchJadwals();
      await get().fetchStatistics();
      set({ loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Gagal update jadwal', loading: false });
      throw error;
    }
  },

  removeJadwal: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteJadwal(id);
      await get().fetchJadwals();
      await get().fetchStatistics();
      set({ loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Gagal hapus jadwal', loading: false });
      throw error;
    }
  },

  fetchTrashedJadwals: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getTrashedJadwals();
      set({ trashedJadwals: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Gagal memuat trashed jadwals', loading: false });
      throw error;
    }
  },

  restoreJadwal: async (id) => {
    set({ loading: true, error: null });
    try {
      await restoreJadwal(id);
      await get().fetchTrashedJadwals();
      set({ loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Gagal restore jadwal', loading: false });
      throw error;
    }
  },

  forceDeleteJadwal: async (id) => {
    set({ loading: true, error: null });
    try {
      await forceDeleteJadwal(id);
      await get().fetchTrashedJadwals();
      set({ loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Gagal hapus permanen jadwal', loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));

export default useJadwalStore;
