import api from '../api';

export const getAdminUsers = (params) => api.get('/admin/users', { params });
export const getAdminUserById = (id) => api.get(`/admin/users/${id}`);
export const createAdminUser = (data) => api.post('/admin/users', data);
export const updateAdminUser = (id, data) => api.put(`/admin/users/${id}`, data);
export const deleteAdminUser = (id) => api.delete(`/admin/users/${id}`);
export const getAdminUserStatistics = () => api.get('/admin/users/statistics');
export const getTrashedUsers = () => api.get('/admin/users/trashed');
export const restoreUser = (id) => api.post(`/admin/users/${id}/restore`);
export const forceDeleteUser = (id) => api.delete(`/admin/users/${id}/force`);
