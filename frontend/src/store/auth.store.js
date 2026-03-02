import { create } from 'zustand'
import { authApi } from '../api/auth.api'
import { usersApi } from '../api/users.api'

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  init: async () => {
    const token = localStorage.getItem('nh-token')
    if (!token) { set({ isLoading: false }); return }
    try {
      const { data } = await usersApi.getProfile()
      set({ user: data.data, isAuthenticated: true, isLoading: false })
    } catch {
      localStorage.removeItem('nh-token')
      localStorage.removeItem('nh-refresh')
      set({ isLoading: false })
    }
  },

  login: async (creds) => {
    const { data } = await authApi.login(creds)
    const { user, accessToken, refreshToken } = data.data
    localStorage.setItem('nh-token', accessToken)
    localStorage.setItem('nh-refresh', refreshToken)
    set({ user, isAuthenticated: true })
    return user
  },

  register: async (userData) => {
    const { data } = await authApi.register(userData)
    const { user, accessToken, refreshToken } = data.data
    localStorage.setItem('nh-token', accessToken)
    localStorage.setItem('nh-refresh', refreshToken)
    set({ user, isAuthenticated: true })
    return user
  },

  logout: async () => {
    try { await authApi.logout() } catch {}
    localStorage.removeItem('nh-token')
    localStorage.removeItem('nh-refresh')
    set({ user: null, isAuthenticated: false })
  },

  updateUser: (updates) => set((s) => ({ user: { ...s.user, ...updates } })),
}))
