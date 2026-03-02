import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 12000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nh-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let isRefreshing = false
let queue = []

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      if (isRefreshing) {
        return new Promise((resolve, reject) => queue.push({ resolve, reject }))
          .then(token => { original.headers.Authorization = `Bearer ${token}`; return api(original) })
      }
      isRefreshing = true
      try {
        const refresh = localStorage.getItem('nh-refresh')
        if (!refresh) throw new Error('no refresh')
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL || '/api/v1'}/auth/refresh`,
          { refreshToken: refresh }
        )
        const token = data.data.accessToken
        localStorage.setItem('nh-token', token)
        if (data.data.refreshToken) localStorage.setItem('nh-refresh', data.data.refreshToken)
        queue.forEach(p => p.resolve(token))
        queue = []
        original.headers.Authorization = `Bearer ${token}`
        return api(original)
      } catch {
        queue.forEach(p => p.reject())
        queue = []
        localStorage.removeItem('nh-token')
        localStorage.removeItem('nh-refresh')
        window.location.href = '/login'
      } finally { isRefreshing = false }
    }
    return Promise.reject(error)
  }
)

export default api