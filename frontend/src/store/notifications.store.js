import { create } from 'zustand'
import { notificationsApi } from '../api/notifications.api'

export const useNotificationsStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetch: async () => {
    set({ isLoading: true })
    try {
      const { data } = await notificationsApi.getAll({ page: 1, limit: 30 })
      const { notifications, unread } = data.data
      set({ notifications: notifications || [], unreadCount: unread || 0, isLoading: false })
    } catch { set({ isLoading: false }) }
  },

  fetchCount: async () => {
    try {
      const { data } = await notificationsApi.getUnreadCount()
      set({ unreadCount: data.data.count })
    } catch {}
  },


  push: (n) => set((s) => ({
    notifications: [n, ...s.notifications],
    unreadCount: s.unreadCount + 1,
  })),

  markRead: async (id) => {
    try {
      await notificationsApi.markAsRead(id)
      set((s) => ({
        notifications: s.notifications.map((n) => n._id === id ? { ...n, read: true } : n),
        unreadCount: Math.max(0, s.unreadCount - 1),
      }))
    } catch {}
  },

  markAllRead: async () => {
    try {
      await notificationsApi.markAllAsRead()
      set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })), unreadCount: 0 }))
    } catch {}
  },

  remove: async (id) => {
    const n = get().notifications.find((x) => x._id === id)
    try {
      await notificationsApi.delete(id)
      set((s) => ({
        notifications: s.notifications.filter((x) => x._id !== id),
        unreadCount: n && !n.read ? Math.max(0, s.unreadCount - 1) : s.unreadCount,
      }))
    } catch {}
  },
}))
