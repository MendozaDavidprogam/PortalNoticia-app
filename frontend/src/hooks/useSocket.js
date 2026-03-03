import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { useNotificationsStore } from '../store/notifications.store'
import toast from 'react-hot-toast'

const SOCKET_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/api/v1', '')
  : 'http://localhost:3001'

let socket = null
let bound = false

export function useSocket(userId) {
  useEffect(() => {
    if (!userId) return
    if (socket?.connected && bound) return

    const token = localStorage.getItem('nh-token')
    if (!token) return

    if (socket && !socket.connected) { socket.close(); socket = null; bound = false }
    if (socket?.connected) return

    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    })

    socket.on('connect', () => {
      bound = true
      console.log(' Socket:', socket.id)
    })

    socket.on('disconnect', (r) => {
      bound = false
      console.log(' Disconnected:', r)
    })

    socket.on('unread-count', ({ count }) => {
      useNotificationsStore.setState({ unreadCount: count })
    })

    socket.on('new-notification', (data) => {
      useNotificationsStore.getState().push({ ...data, read: false })
      const icons = { new_news: '📰', new_comment: '💬', new_reply: '↩️' }
      toast(`${icons[data.type] || '🔔'} ${data.message}`)
    })

  }, [userId])
}

export function killSocket() {
  if (socket) { socket.disconnect(); socket = null; bound = false }
}