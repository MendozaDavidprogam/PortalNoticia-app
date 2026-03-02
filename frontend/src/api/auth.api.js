import api from './axios.config'
export const authApi = {
  register: (d) => api.post('/auth/register', d),
  login: (d) => api.post('/auth/login', d),
  logout: () => api.post('/auth/logout'),
  refresh: (r) => api.post('/auth/refresh', { refreshToken: r }),
}
