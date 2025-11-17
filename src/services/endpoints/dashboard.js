import api from '../api';

export const getDashboardData = () => api.get('/admin/dashboard');
