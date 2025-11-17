import { create } from 'zustand';

const useUIStore = create((set) => ({
  sidebarOpen: true,
  modalOpen: false,
  modalContent: null,
  loading: false,
  notification: null,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  openModal: (content) => set({ modalOpen: true, modalContent: content }),
  closeModal: () => set({ modalOpen: false, modalContent: null }),
  
  setLoading: (loading) => set({ loading }),
  
  showNotification: (notification) => set({ notification }),
  clearNotification: () => set({ notification: null })
}));

export default useUIStore;
