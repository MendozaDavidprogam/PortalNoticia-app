import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Newspaper, User, Users, Plus, LogOut } from 'lucide-react'
import { useAuthStore } from '../../store/auth.store'
import { killSocket } from '../../hooks/useSocket'
import Avatar from '../ui/Avatar'
import { getRoleBadge } from '../../utils/helpers'
import toast from 'react-hot-toast'

const link = (active) => ({
  display: 'flex', alignItems: 'center', gap: 9, padding: '7px 12px',
  borderRadius: 'var(--radius-md)', fontSize: 13.5, fontWeight: active ? 500 : 400,
  color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
  background: active ? 'var(--bg-subtle)' : 'transparent',
  transition: 'all var(--transition)', textDecoration: 'none',
  border: '1px solid ' + (active ? 'var(--border)' : 'transparent'),
})

export default function Sidebar({ onClose }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'admin'
  const isAuthor = user?.role === 'autor' || isAdmin
  const badge = getRoleBadge(user?.role)

  const handleLogout = async () => {
    killSocket()
    await logout()
    toast.success('Hasta pronto')
    navigate('/login')
  }

  return (
    <aside style={{
      width: 'var(--sidebar-w)', height: '100vh', position: 'fixed',
      display: 'flex', flexDirection: 'column',
      borderRight: '1px solid var(--border)', background: 'var(--bg-card)',
      padding: '0',
    }}>

      <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 'var(--radius-sm)',
            background: 'var(--text-primary)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: 'var(--bg-card)', fontFamily: 'var(--font-serif)', fontSize: 15, lineHeight: 1 }}>N</span>
          </div>
          <div>
            <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: '-0.01em' }}>NewsHub</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginTop: -2 }}>Pro</span>
          </div>
        </div>
      </div>


      <nav style={{ flex: 1, padding: '10px 10px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {[
          { to: '/', icon: LayoutDashboard, label: 'Dashboard', end: true },
          { to: '/news', icon: Newspaper, label: 'Noticias' },
          { to: '/profile', icon: User, label: 'Mi perfil' },
        ].map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end} onClick={onClose}
            style={({ isActive }) => link(isActive)}>
            <Icon size={16} style={{ flexShrink: 0 }} />
            {label}
          </NavLink>
        ))}

        {isAuthor && (
          <>
            <div style={{ height: 1, background: 'var(--border)', margin: '6px 2px' }} />
            <NavLink to="/news/create" onClick={onClose}
              style={({ isActive }) => ({
                ...link(isActive),
                border: `1.5px dashed ${isActive ? 'var(--border-strong)' : 'var(--border)'}`,
              })}>
              <Plus size={16} />
              Crear noticia
            </NavLink>
          </>
        )}

        {isAdmin && (
          <>
            <div style={{ margin: '8px 2px 4px', fontSize: 10.5, color: 'var(--text-muted)', letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 500, padding: '0 10px' }}>Admin</div>
            <NavLink to="/admin/users" onClick={onClose}
              style={({ isActive }) => link(isActive)}>
              <Users size={16} />
              Usuarios
            </NavLink>
          </>
        )}
      </nav>


      <div style={{ padding: '12px 10px', borderTop: '1px solid var(--border)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px',
          borderRadius: 'var(--radius-md)',
        }}>
          <Avatar name={user?.name} src={user?.avatar} size="sm" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
            <span style={{ fontSize: 11, color: badge.color, background: badge.bg, padding: '0 6px', borderRadius: 'var(--radius-full)', display: 'inline-block', marginTop: 1 }}>{badge.label}</span>
          </div>
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: 'var(--radius-sm)', flexShrink: 0, transition: 'all var(--transition)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--red-subtle)'; e.currentTarget.style.color = 'var(--red)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}
