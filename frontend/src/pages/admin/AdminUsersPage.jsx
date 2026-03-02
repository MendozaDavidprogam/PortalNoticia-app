import { useState, useEffect } from 'react'
import { Search, Users } from 'lucide-react'
import { usersApi } from '../../api/users.api'
import { Avatar, Button, Pagination, EmptyState } from '../../components/ui/index'
import { getRoleBadge, formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 })
  const [stats, setStats] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async (page = 1) => {
    setLoading(true)
    try {
      const [uRes, sRes] = await Promise.all([usersApi.getAll({ page, limit: 12, search }), usersApi.getStats()])
      setUsers(uRes.data.data.users || [])
      setPagination({ page, total: uRes.data.data.pagination.total, pages: uRes.data.data.pagination.pages })
      setStats(sRes.data.data)
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { const t = setTimeout(() => load(1), 300); return () => clearTimeout(t) }, [search])

  const handleRole = async (userId, role) => {
    try {
      await usersApi.updateRole(userId, role)
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role } : u))
      toast.success('Rol actualizado')
    } catch { toast.error('Error') }
  }

  const handleToggle = async (userId) => {
    try {
      const { data } = await usersApi.toggleActive(userId)
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: data.data.isActive } : u))
      toast.success('Estado actualizado')
    } catch { toast.error('Error') }
  }

  const statItems = stats ? [
    { label: 'Total', value: stats.total, color: 'var(--blue)' },
    { label: 'Activos', value: stats.activos, color: 'var(--green)' },
    { label: 'Autores', value: stats.autores, color: 'var(--amber)' },
    { label: 'Admins', value: stats.admins, color: 'var(--purple)' },
  ] : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }} className="animate-in">
      <div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 400, color: 'var(--text-primary)' }}>Gestión de usuarios</h1>
        <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginTop: 3 }}>{pagination.total} usuarios registrados</p>
      </div>


      {stats && (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {statItems.map(({ label, value, color }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{value}</span>
              <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{label}</span>
            </div>
          ))}
        </div>
      )}


      <div style={{ position: 'relative', maxWidth: 360 }}>
        <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre o email…"
          style={{ width: '100%', height: 38, padding: '0 14px 0 34px', background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: 13.5, color: 'var(--text-primary)', outline: 'none', fontFamily: 'var(--font-sans)' }} />
      </div>


      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px 90px 110px 80px', gap: 12, padding: '10px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-subtle)' }}>
          {['Usuario', 'Rol', 'Estado', 'Registro', 'Acción'].map(h => (
            <span key={h} style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</span>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: '20px' }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div className="skeleton" style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0 }} />
                <div style={{ flex: 1 }}><div className="skeleton" style={{ height: 12, width: '40%', marginBottom: 6 }} /><div className="skeleton" style={{ height: 10, width: '60%' }} /></div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <EmptyState icon={<Users size={32}/>} title="Sin usuarios" description="No se encontraron resultados" />
        ) : (
          users.map((u) => {
            const badge = getRoleBadge(u.role)
            return (
              <div key={u._id} style={{ display: 'grid', gridTemplateColumns: '1fr 110px 90px 110px 80px', gap: 12, padding: '12px 20px', borderBottom: '1px solid var(--border)', alignItems: 'center', transition: 'background var(--transition)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-subtle)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
                  <Avatar name={u.name} src={u.avatar} size="sm" />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</p>
                  </div>
                </div>

                <select value={u.role} onChange={e => handleRole(u._id, e.target.value)}
                  style={{ padding: '4px 8px', background: badge.bg, color: badge.color, border: 'none', borderRadius: 'var(--radius-sm)', fontSize: 12, fontWeight: 500, fontFamily: 'var(--font-sans)', cursor: 'pointer', outline: 'none' }}>
                  {['lector','autor','admin'].map(r => <option key={r} value={r}>{r}</option>)}
                </select>

                <span style={{ fontSize: 12, fontWeight: 500, color: u.isActive ? 'var(--green)' : 'var(--text-muted)', background: u.isActive ? 'var(--green-subtle)' : 'var(--bg-hover)', padding: '2px 9px', borderRadius: 'var(--radius-full)', display: 'inline-block', textAlign: 'center' }}>
                  {u.isActive ? 'Activo' : 'Inactivo'}
                </span>

                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{formatDate(u.createdAt)}</span>

                <Button size="xs" variant={u.isActive ? 'danger' : 'secondary'} onClick={() => handleToggle(u._id)}>
                  {u.isActive ? 'Desactivar' : 'Activar'}
                </Button>
              </div>
            )
          })
        )}
      </div>

      {pagination.pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Pagination page={pagination.page} total={pagination.total} limit={12} onChange={load} />
        </div>
      )}
    </div>
  )
}
