import api from '../api';

// Public Jadwal Endpoints
export const getJadwals = (params) => api.get('/jadwals', { params });
export const getJadwalById = (id) => api.get(`/jadwals/${id}`);
export const getJadwalsByFilm = (filmId) => api.get(`/films/${filmId}/jadwals`);

// Admin Jadwal Management Endpoints
export const getAdminJadwals = (params) => api.get('/admin/jadwals', { params });
export const getAdminJadwalById = (id) => api.get(`/admin/jadwals/${id}`);
export const createJadwal = (data) => api.post('/admin/jadwals', data);
export const updateJadwal = (id, data) => api.put(`/admin/jadwals/${id}`, data);
export const deleteJadwal = (id) => api.delete(`/admin/jadwals/${id}`);
export const getTrashedJadwals = () => api.get('/admin/jadwals/trashed');
export const restoreJadwal = (id) => api.post(`/admin/jadwals/${id}/restore`);
export const forceDeleteJadwal = (id) => api.delete(`/admin/jadwals/${id}/force`);
export const getJadwalStatistics = () => api.get('/admin/jadwals/statistics');
