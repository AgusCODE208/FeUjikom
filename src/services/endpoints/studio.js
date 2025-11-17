import api from '../api';

// Public Studio Endpoints
export const getStudios = (params) => api.get('/studios', { params });
export const getStudioById = (id) => api.get(`/studios/${id}`);
export const getKursiByStudio = (studioId) => api.get(`/studios/${studioId}/kursis`);

// Admin Studio Management Endpoints
export const getAdminStudios = (params) => api.get('/admin/studios', { params });
export const getAdminStudioById = (id) => api.get(`/admin/studios/${id}`);
export const createStudio = (data) => api.post('/admin/studios', data);
export const updateStudio = (id, data) => api.put(`/admin/studios/${id}`, data);
export const deleteStudio = (id) => api.delete(`/admin/studios/${id}`);
export const getTrashedStudios = () => api.get('/admin/studios/trashed');
export const restoreStudio = (id) => api.post(`/admin/studios/${id}/restore`);
export const forceDeleteStudio = (id) => api.delete(`/admin/studios/${id}/force`);
export const getStudioStatistics = () => api.get('/admin/studios/statistics');
