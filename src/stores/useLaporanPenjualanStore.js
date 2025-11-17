import { create } from 'zustand';
import api from '../services/api';

const useLaporanPenjualanStore = create((set) => ({
  laporanData: null,
  loading: false,
  error: null,

  fetchLaporan: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      console.log('Fetching laporan with params:', params);
      const response = await api.get('/owner/laporan-penjualan', { params });
      console.log('Laporan response:', response.data.data);
      set({ laporanData: response.data.data, loading: false });
      return response.data.data;
    } catch (error) {
      console.error('Laporan fetch error:', error);
      set({ error: error.response?.data?.message || 'Failed to fetch laporan', loading: false });
      throw error;
    }
  },

  exportLaporan: async (params = {}) => {
    try {
      console.log('Exporting laporan with params:', params);
      const response = await api.get('/owner/laporan-penjualan/export', { 
        params,
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'laporan-penjualan.csv';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return true;
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useLaporanPenjualanStore;
