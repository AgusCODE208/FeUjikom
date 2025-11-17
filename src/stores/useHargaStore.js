import { create } from 'zustand';
import hargaService from '../services/endpoints/harga';

const useHargaStore = create((set) => ({
  hargas: [],
  loading: false,
  error: null,

  fetchHargas: async () => {
    set({ loading: true, error: null });
    try {
      const response = await hargaService.getAll();
      if (response.success) {
        set({ hargas: response.data, loading: false });
      } else {
        set({ error: response.message, loading: false });
      }
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  clearHargas: () => set({ hargas: [], error: null })
}));

export default useHargaStore;
