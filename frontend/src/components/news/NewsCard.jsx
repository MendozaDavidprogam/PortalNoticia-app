import { useNavigate } from 'react-router-dom'
import { Eye, Tag, Edit2, Trash2 } from 'lucide-react'
import { Avatar, Badge, Button } from '../ui/index'
import { timeAgo, truncate, getRoleBadge } from '../../utils/helpers'
import { useAuthStore } from '../../store/auth.store'

export default function NewsCard({ news, onDelete }) {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const canEdit = user && (user._id === news.author?._id?.toString() || user.role === 'admin')
  const roleBadge = getRoleBadge(news.author?.role)

  return (
    <article style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', overflow: 'hidden',
      transition: 'all var(--transition)',
      cursor: 'pointer', display: 'flex', flexDirection: 'column',
    }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
    >

      {news.image ? (
        <div style={{ height: 168, overflow: 'hidden' }} onClick={() => navigate(`/news/${news._id}`)}>
          <img src={news.image} alt={news.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s ease' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.03)'}
            onMouseLeave={e => e.target.style.transform = 'none'}
          />
        </div>
      ) : (
        <div style={{ height: 6, background: 'linear-gradient(90deg, var(--blue), var(--purple))' }} />
      )}


      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }} onClick={() => navigate(`/news/${news._id}`)}>

        {news.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {news.tags.slice(0, 3).map(tag => (
              <span key={tag} style={{ fontSize: 10.5, fontWeight: 500, color: 'var(--text-muted)', background: 'var(--bg-subtle)', padding: '1px 7px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: 3 }}>
                <Tag size={9} />{tag}
              </span>
            ))}
          </div>
        )}

        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 17, lineHeight: 1.35, color: 'var(--text-primary)', fontWeight: 400 }}>
          {news.title}
        </h3>

        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1 }}>
          {truncate(news.content?.replace(/<[^>]*>/g, ''), 110)}
        </p>
      </div>


      <div style={{ padding: '11px 16px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Avatar name={news.author?.name} src={news.author?.avatar} size="xs" />
          <div>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)' }}>{news.author?.name}</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block' }}>{timeAgo(news.createdAt)}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
            <Eye size={11} />{news.views || 0}
          </span>
          {canEdit && (
            <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
              <button onClick={() => navigate(`/news/${news._id}/edit`)}
                style={{ width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: 'var(--radius-xs)', transition: 'all var(--transition)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue-subtle)'; e.currentTarget.style.color = 'var(--blue)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)' }}
              ><Edit2 size={12} /></button>
              <button onClick={() => onDelete?.(news._id)}
                style={{ width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: 'var(--radius-xs)', transition: 'all var(--transition)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--red-subtle)'; e.currentTarget.style.color = 'var(--red)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)' }}
              ><Trash2 size={12} /></button>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
