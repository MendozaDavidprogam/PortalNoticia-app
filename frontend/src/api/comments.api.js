import api from './axios.config'
export const commentsApi = {
  getByNews: (newsId, p) => api.get(`/comments/news/${newsId}`, { params: p }),
  create: (d) => api.post('/comments', d),
  update: (id, d) => api.put(`/comments/${id}`, d),
  remove: (id) => api.delete(`/comments/${id}`),
  addReply: (commentId, d, newsId) => api.post(`/comments/${commentId}/replies?newsId=${newsId}`, d),
  deleteReply: (cId, rId) => api.delete(`/comments/${cId}/replies/${rId}`),
}
