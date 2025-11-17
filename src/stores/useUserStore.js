import { create } from 'zustand';
import { 
  getAdminUsers, 
  getAdminUserById, 
  createAdminUser, 
  updateAdminUser, 
  deleteAdminUser,
  getAdminUserStatistics,
  getTrashedUsers,
  restoreUser,
  forceDeleteUser
} from '../services/endpoints/user';

const useUserStore = create((set) => ({
  users: [],
  selectedUser: null,
  statistics: null,
  loading: false,
  error: null,

  fetchUsers: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await getAdminUsers(params);
      set({ users: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  fetchUserById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await getAdminUserById(id);
      set({ selectedUser: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  addUser: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await createAdminUser(userData);
      set((state) => ({
        users: [...state.users, response.data.data],
        loading: false,
      }));
      return response.data.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    set({ loading: true, error: null });
    try {
      const response = await updateAdminUser(id, userData);
      set((state) => ({
        users: state.users.map((user) =>
          user.id === id ? response.data.data : user
        ),
        loading: false,
      }));
      return response.data.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteAdminUser(id);
      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  fetchStatistics: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getAdminUserStatistics();
      set({ statistics: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  fetchTrashed: async () => {
    set({ loading: true, error: null });
    try {
      const response = await getTrashedUsers();
      set({ users: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  restoreUser: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await restoreUser(id);
      set({ loading: false });
      return response.data.data;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  forceDeleteUser: async (id) => {
    set({ loading: true, error: null });
    try {
      await forceDeleteUser(id);
      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  setSelectedUser: (user) => set({ selectedUser: user }),
  clearError: () => set({ error: null }),
}));

export default useUserStore;
