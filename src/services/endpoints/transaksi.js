import api from '../api';

// User Transaksi Endpoints
export const createTransaksi = (data) => api.post('/transaksis', data);
export const getMyTransaksi = () => api.get('/transaksis/my');
export const getTransaksiById = (id) => api.get(`/transaksis/${id}`);
export const checkPaymentStatus = (id) => api.get(`/transaksis/${id}/payment-status`);
export const getBookedSeats = (jadwalId) => api.get(`/jadwals/${jadwalId}/booked-seats`);

// My Tickets Endpoints
export const getMyTickets = (filter = 'all') => api.get('/my-tickets', { params: { filter } });
export const getTicketDetail = (id) => api.get(`/tickets/${id}`);

// Payment Endpoints - Midtrans
export const createSnapToken = (transaksiId) => api.post(`/payment/${transaksiId}/snap-token`);
export const checkMidtransStatus = (transaksiId) => api.get(`/payment/${transaksiId}/check-status`);

// Admin Transaksi Management Endpoints
export const getAdminTransaksis = (params) => api.get('/admin/transaksis', { params });
export const getAdminTransaksiById = (id) => api.get(`/admin/transaksis/${id}`);
export const getTransaksiStatistics = () => api.get('/admin/transaksis/statistics');
