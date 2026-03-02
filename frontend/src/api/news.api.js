import api from './axios.config'
export const newsApi = {
  getAll: (p) => api.get('/news', { params: p }),
  getOne: (id) => api.get(`/news/${id}`),
  getMyNews: (p) => api.get('/news/my-news', { params: p }),
  getStats: () => api.get('/news/stats'),
  create: (d) => api.post('/news', d),
  update: (id, d) => api.put(`/news/${id}`, d),
  remove: (id) => api.delete(`/news/${id}`),
}
