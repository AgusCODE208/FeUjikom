import { create } from 'zustand';
import { getAdminStudios, createStudio, updateStudio, deleteStudio, getStudioStatistics, getTrashedStudios, restoreStudio, forceDeleteStudio } from '../services/endpoints/studio';

const useStudioStore = create((set, get) => ({
  studios: [],
  statistics: null,
  trashedStudios: [],
  loading: false,
  error: null,

  fetchStudios: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await getAdminStudios(params);
      set({ studios: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Gagal memuat studios', loading: false });
      throw error;
    }
  },

  fetchStatistics: async () => {
    try {
      const response = await getStudioStatistics();
      set({ statistics: response.data.data });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  },

  addStudio: async (data) => {
    set({ loading: true, error: null });
    try {
      await createStudio(data);
      await get().fetchStudios();
      await get().fetchStatistics();
      set({ loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Gagal menambah studio', loading: false });
      throw error;
    }
  },

  editStudio: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await updateStudio(id, data);
      await get().fetchStudios();
      await get().fetchStatistics();
      set({ loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Gagal update studio', loading: false });
      throw error;
    }
  },

  removeStudio: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteStudio(id);
      await get().fetchStudios();
      await get().fetchStatistics();
      set({ loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Gagal hapus studio', loading: false });
      throw error;
    }
  },

  fetchTrashedStudios: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getTrashedStudios();
      set({ trashedStudios: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Gagal memuat trashed studios', loading: false });
      throw error;
    }
  },

  restoreStudio: async (id) => {
    set({ loading: true, error: null });
    try {
      await restoreStudio(id);
      await get().fetchTrashedStudios();
      set({ loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Gagal restore studio', loading: false });
      throw error;
    }
  },

  forceDeleteStudio: async (id) => {
    set({ loading: true, error: null });
    try {
      await forceDeleteStudio(id);
      await get().fetchTrashedStudios();
      set({ loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Gagal hapus permanen studio', loading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));

export default useStudioStore;
