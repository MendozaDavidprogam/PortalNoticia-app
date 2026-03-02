import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Check, Trash2, Newspaper, MessageSquare, CornerDownRight, X } from 'lucide-react'
import { useNotificationsStore } from '../../store/notifications.store'
import { timeAgo } from '../../utils/helpers'

const TYPE_CONFIG = {
  new_news:    { icon: Newspaper,        color: 'var(--blue)',   bg: 'var(--blue-subtle)',   label: 'Noticia' },
  new_comment: { icon: MessageSquare,    color: 'var(--green)',  bg: 'var(--green-subtle)',  label: 'Comentario' },
  new_reply:   { icon: CornerDownRight,  color: 'var(--purple)', bg: 'var(--purple-subtle)', label: 'Respuesta' },
}

function NotifItem({ n, onNavigate, onDelete }) {
  const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.new_news
  const Icon = cfg.icon

  return (
    <div
      style={{
        display: 'flex', gap: 10, padding: '11px 16px',
        background: n.read ? 'transparent' : 'var(--blue-subtle)',
        borderBottom: '1px solid var(--border)',
        transition: 'background var(--transition)',
        cursor: 'pointer',
        position: 'relative',
      }}
      onMouseEnter={e => { if (n.read) e.currentTarget.style.background = 'var(--bg-subtle)' }}
      onMouseLeave={e => { e.currentTarget.style.background = n.read ? 'transparent' : 'var(--blue-subtle)' }}
    >

      <div style={{
        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: cfg.bg, color: cfg.color, marginTop: 1,
      }}>
        <Icon size={14} />
      </div>


      <div style={{ flex: 1, minWidth: 0 }} onClick={() => onNavigate(n)}>
        <p style={{
          fontSize: 13, fontWeight: n.read ? 400 : 600,
          color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: 2,
        }}>
          {n.title}
        </p>
        <p style={{
          fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5,
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {n.message}
        </p>
        <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3, display: 'block' }}>
          {timeAgo(n.createdAt)}
        </span>
      </div>


      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
        {!n.read && (
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--blue)', display: 'block', marginTop: 4 }} />
        )}
        <button
          onClick={e => { e.stopPropagation(); onDelete(n._id) }}
          style={{
            width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
            borderRadius: 'var(--radius-xs)', transition: 'all var(--transition)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--red-subtle)'; e.currentTarget.style.color = 'var(--red)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)' }}
        >
          <X size={11} />
        </button>
      </div>
    </div>
  )
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()
  const { notifications, unreadCount, isLoading, fetch, markRead, markAllRead, remove } = useNotificationsStore()

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  useEffect(() => { if (open) fetch() }, [open])

  const handleNavigate = async (n) => {
    if (!n.read) await markRead(n._id)
    setOpen(false)
    if (n.link) navigate(n.link)
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>

      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'relative', width: 36, height: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1.5px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          background: open ? 'var(--bg-subtle)' : 'transparent',
          color: open ? 'var(--text-primary)' : 'var(--text-secondary)',
          transition: 'all var(--transition)',
        }}
        onMouseEnter={e => { if (!open) { e.currentTarget.style.background = 'var(--bg-subtle)'; e.currentTarget.style.color = 'var(--text-primary)' } }}
        onMouseLeave={e => { if (!open) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' } }}
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: -5, right: -5,
            background: 'var(--red)', color: '#fff',
            fontSize: 10, fontWeight: 700, lineHeight: 1,
            minWidth: 17, height: 17, padding: '0 4px',
            borderRadius: 'var(--radius-full)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid var(--bg)',
            animation: 'badgePop .28s cubic-bezier(.34,1.56,.64,1)',
          }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>


      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 8px)',
          width: 360, background: 'var(--bg-card)',
          border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)', zIndex: 1000,
          animation: 'slideDown .16s ease',
          overflow: 'hidden',
        }}>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '13px 16px', borderBottom: '1px solid var(--border)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                Notificaciones
              </span>
              {unreadCount > 0 && (
                <span style={{
                  background: 'var(--red-subtle)', color: 'var(--red)',
                  fontSize: 11, fontWeight: 600, padding: '1px 7px',
                  borderRadius: 'var(--radius-full)',
                }}>
                  {unreadCount} nuevas
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  fontSize: 12, color: 'var(--blue)', background: 'none',
                  border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                  padding: '4px 8px', borderRadius: 'var(--radius-sm)',
                  transition: 'background var(--transition)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--blue-subtle)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <Check size={12} /> Marcar todas
              </button>
            )}
          </div>


          <div style={{ maxHeight: 420, overflowY: 'auto' }}>
            {isLoading ? (
              <div style={{ padding: '16px' }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                    <div className="skeleton" style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div className="skeleton" style={{ height: 11, width: '55%', marginBottom: 6 }} />
                      <div className="skeleton" style={{ height: 10, width: '80%' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--bg-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: 'var(--text-muted)' }}>
                  <Bell size={20} />
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Todo tranquilo</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  Aquí verás nuevas noticias, comentarios y respuestas
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <NotifItem
                  key={n._id}
                  n={n}
                  onNavigate={handleNavigate}
                  onDelete={remove}
                />
              ))
            )}
          </div>


          {notifications.length > 0 && (
            <div style={{
              padding: '8px 16px', borderTop: '1px solid var(--border)',
              display: 'flex', justifyContent: 'flex-end',
            }}>
              <button
                onClick={() => setOpen(false)}
                style={{
                  fontSize: 12, color: 'var(--text-muted)', background: 'none',
                  border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                }}
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
