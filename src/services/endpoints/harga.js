import api from '../api';

export const hargaService = {
  getAll: (params) => api.get('/hargas', { params }),
  getByTipe: (tipe) => api.get(`/hargas/by-tipe/${tipe}`),
  getTipeOptions: () => api.get('/hargas/tipe-options'),
  
  // Admin
  getAdminAll: (params) => api.get('/admin/hargas', { params }),
  getById: (id) => api.get(`/admin/hargas/${id}`),
  create: (data) => api.post('/admin/hargas', data),
  update: (id, data) => api.put(`/admin/hargas/${id}`, data),
  delete: (id) => api.delete(`/admin/hargas/${id}`),
  getTrashed: () => api.get('/admin/hargas/trashed'),
  restore: (id) => api.post(`/admin/hargas/${id}/restore`),
  forceDelete: (id) => api.delete(`/admin/hargas/${id}/force`),
  getStatistics: () => api.get('/admin/hargas/statistics')
};

export default hargaService;
