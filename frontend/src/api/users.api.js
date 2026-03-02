import api from './axios.config'
export const usersApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (d) => api.put('/users/profile', d),
  getAll: (p) => api.get('/users', { params: p }),
  getStats: () => api.get('/users/stats'),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
  toggleActive: (id) => api.patch(`/users/${id}/toggle-active`),
}
