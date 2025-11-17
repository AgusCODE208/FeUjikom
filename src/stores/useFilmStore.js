import { create } from 'zustand';
import { getFilms } from '../services/endpoints/film';

const useFilmStore = create((set) => ({
  films: [],
  loading: false,
  error: null,

  fetchFilms: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await getFilms(params);
      set({ films: response.data.data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  clearFilms: () => set({ films: [], error: null })
}));

export default useFilmStore;
