import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, Tag, Edit2, Trash2, Send, MessageSquare } from 'lucide-react'
import { newsApi } from '../../api/news.api'
import { commentsApi } from '../../api/comments.api'
import { useAuthStore } from '../../store/auth.store'
import { Avatar, Badge, Button, EmptyState } from '../../components/ui/index'
import CommentItem from '../../components/comments/CommentItem'
import { timeAgo, getRoleBadge } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function NewsDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [news, setNews] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [sending, setSending] = useState(false)
  const roleBadge = news ? getRoleBadge(news.author?.role) : null
  const canEdit = user && news && (user._id === news.author?._id?.toString() || user.role === 'admin')

  useEffect(() => {
    const load = async () => {
      try {
        const [nRes, cRes] = await Promise.all([newsApi.getOne(id), commentsApi.getByNews(id)])
        setNews(nRes.data.data)
        setComments(cRes.data.data.comments || [])
      } catch { toast.error('Noticia no encontrada'); navigate('/news') }
      finally { setLoading(false) }
    }
    load()
  }, [id])

  const handleDelete = async () => {
    if (!confirm('¿Eliminar esta noticia?')) return
    try { await newsApi.remove(id); toast.success('Eliminada'); navigate('/news') }
    catch { toast.error('Error al eliminar') }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    setSending(true)
    try {
      const { data } = await commentsApi.create({ newsId: id, content: newComment })
      setComments(prev => [data.data, ...prev])
      setNewComment('')
      toast.success('Comentario publicado')
    } catch { toast.error('Error al comentar') }
    finally { setSending(false) }
  }

  const handleCommentUpdated = (updated) => {
    setComments(prev => prev.map(c => c._id === updated._id ? updated : c))
  }

  const handleCommentDeleted = async (commentId) => {
    if (!confirm('¿Eliminar comentario?')) return
    try {
      await commentsApi.remove(commentId)
      setComments(prev => prev.filter(c => c._id !== commentId))
      toast.success('Eliminado')
    } catch { toast.error('Error') }
  }

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="skeleton" style={{ height: 36, width: 100 }} />
      <div className="skeleton" style={{ height: 48, width: '60%' }} />
      <div className="skeleton" style={{ height: 320, borderRadius: 'var(--radius-lg)' }} />
    </div>
  )

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }} className="animate-in">

      <button onClick={() => navigate(-1)}
        style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)', marginBottom: 20, transition: 'color var(--transition)' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
        <ArrowLeft size={15}/> Volver
      </button>

      <article>

        {news.tags?.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            {news.tags.map(t => (
              <span key={t} style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-muted)', background: 'var(--bg-subtle)', padding: '2px 8px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: 3 }}>
                <Tag size={9}/>{t}
              </span>
            ))}
            {news.status === 'draft' && <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--amber)', background: 'var(--amber-subtle)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>Borrador</span>}
          </div>
        )}


        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 400, lineHeight: 1.25, color: 'var(--text-primary)', marginBottom: 16 }}>
          {news.title}
        </h1>


        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, paddingBottom: 18, borderBottom: '1px solid var(--border)', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Avatar name={news.author?.name} src={news.author?.avatar} size="md" />
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{news.author?.name}</p>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 2 }}>
                <span style={{ fontSize: 11, fontWeight: 500, color: roleBadge?.color, background: roleBadge?.bg, padding: '1px 7px', borderRadius: 'var(--radius-full)' }}>{roleBadge?.label}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{timeAgo(news.createdAt)}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12.5, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Eye size={13}/>{news.views} vistas
            </span>
            {canEdit && (
              <div style={{ display: 'flex', gap: 6 }}>
                <Button size="sm" variant="secondary" icon={<Edit2 size={13}/>} onClick={() => navigate(`/news/${id}/edit`)}>Editar</Button>
                <Button size="sm" variant="danger" icon={<Trash2 size={13}/>} onClick={handleDelete}>Eliminar</Button>
              </div>
            )}
          </div>
        </div>


        {news.image && (
          <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 24 }}>
            <img src={news.image} alt={news.title} style={{ width: '100%', maxHeight: 420, objectFit: 'cover' }} />
          </div>
        )}


        <div style={{ fontSize: 16, lineHeight: 1.75, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
          {news.content}
        </div>
      </article>


      <section style={{ marginTop: 40, paddingTop: 32, borderTop: '2px solid var(--border)' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 400, color: 'var(--text-primary)', marginBottom: 20 }}>
          Comentarios <span style={{ fontSize: 15, color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>({comments.length})</span>
        </h2>


        {user ? (
          <form onSubmit={handleComment} style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
            <Avatar name={user?.name} src={user?.avatar} size="sm" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <textarea value={newComment} onChange={e => setNewComment(e.target.value)}
                placeholder="Escribe un comentario…" rows={2}
                style={{ width: '100%', padding: '10px 13px', background: 'var(--bg-subtle)', color: 'var(--text-primary)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-lg)', fontSize: 13.5, outline: 'none', fontFamily: 'var(--font-sans)', resize: 'none', transition: 'border-color var(--transition)' }}
                onFocus={e => e.target.style.borderColor = 'var(--border-strong)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="submit" size="sm" loading={sending} icon={<Send size={13}/>}>Comentar</Button>
              </div>
            </div>
          </form>
        ) : (
          <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 20, padding: '12px 16px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
            <a href="/login" style={{ color: 'var(--blue)' }}>Inicia sesión</a> para comentar
          </p>
        )}


        {comments.length === 0 ? (
          <EmptyState icon={<MessageSquare size={32}/>} title="Sin comentarios" description="Sé el primero en comentar esta noticia" />
        ) : (
          <div>
            {comments.map(c => (
              <CommentItem key={c._id} comment={c} newsId={id} onUpdated={handleCommentUpdated} onDeleted={handleCommentDeleted} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
