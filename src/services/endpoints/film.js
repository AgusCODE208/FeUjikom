import api from '../api';

// Public Film Endpoints
export const getFilms = (params) => api.get('/films', { params });
export const getFilmById = (id) => api.get(`/films/${id}`);
export const getNowPlaying = () => api.get('/films/now-playing');
export const getComingSoon = () => api.get('/films/coming-soon');
export const getHistory = () => api.get('/films/history');

// Admin Film Management Endpoints
export const getAdminFilms = (params) => api.get('/admin/films', { params });
export const getAdminFilmById = (id) => api.get(`/admin/films/${id}`);
export const createFilm = (formData) => api.post('/admin/films', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateFilm = (id, formData) => api.post(`/admin/films/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteFilm = (id) => api.delete(`/admin/films/${id}`);
export const togglePublish = (id) => api.patch(`/admin/films/${id}/toggle-publish`);
export const getStatistics = () => api.get('/admin/films/statistics');
export const getTrashedFilms = () => api.get('/admin/films/trashed');
export const restoreFilm = (id) => api.post(`/admin/films/${id}/restore`);
export const forceDeleteFilm = (id) => api.delete(`/admin/films/${id}/force`);
