import { formatDistanceToNow, format } from 'date-fns'
import { es } from 'date-fns/locale'

export const timeAgo = (date) => {
  try { return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es }) }
  catch { return 'ahora' }
}

export const formatDate = (date, fmt = 'dd MMM yyyy') => {
  try { return format(new Date(date), fmt, { locale: es }) }
  catch { return '' }
}

export const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase()

export const getRoleBadge = (role) => ({
  admin:  { label: 'Admin',  color: '#7c3aed', bg: 'var(--purple-subtle)' },
  autor:  { label: 'Autor',  color: 'var(--blue)', bg: 'var(--blue-subtle)' },
  lector: { label: 'Lector', color: 'var(--green)', bg: 'var(--green-subtle)' },
}[role] || { label: role, color: 'var(--text-muted)', bg: 'var(--bg-subtle)' })

export const truncate = (str = '', max = 120) =>
  str.length > max ? str.slice(0, max) + '…' : str
