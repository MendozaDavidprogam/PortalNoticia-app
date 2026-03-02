import api from './axios.config'
export const uploadApi = {
  uploadImage: (file) => {
    const fd = new FormData()
    fd.append('image', file)
    return api.post('/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  deleteImage: (filename) => api.delete(`/upload/${filename}`),
}
