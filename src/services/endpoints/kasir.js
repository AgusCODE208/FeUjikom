import api from '../api';

// Kasir Dashboard
export const getKasirDashboard = (params) => api.get('/kasir/dashboard', { params });

// Riwayat Transaksi
export const getKasirRiwayatTransaksi = (params) => api.get('/kasir/riwayat-transaksi', { params });
export const getKasirTransaksiDetail = (id) => api.get(`/kasir/riwayat-transaksi/${id}`);
export const refundTransaksi = (id, data) => api.post(`/kasir/riwayat-transaksi/${id}/refund`, data);
