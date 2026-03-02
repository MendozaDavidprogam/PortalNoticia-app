import { useState } from 'react'
import { Edit2, Trash2, CornerDownRight, X, Check } from 'lucide-react'
import { Avatar, Button } from '../ui/index'
import { timeAgo } from '../../utils/helpers'
import { useAuthStore } from '../../store/auth.store'
import { commentsApi } from '../../api/comments.api'
import toast from 'react-hot-toast'

export default function CommentItem({ comment, newsId, onUpdated, onDeleted }) {
  const { user } = useAuthStore()
  const [editing, setEditing] = useState(false)
  const [editVal, setEditVal] = useState(comment.content)
  const [replying, setReplying] = useState(false)
  const [replyVal, setReplyVal] = useState('')
  const [saving, setSaving] = useState(false)

  const canEdit = user && (user._id === comment.author?._id?.toString() || user.role === 'admin')

  const handleEdit = async () => {
    if (!editVal.trim()) return
    setSaving(true)
    try {
      const { data } = await commentsApi.update(comment._id, { content: editVal })
      onUpdated?.(data.data)
      setEditing(false)
      toast.success('Comentario editado')
    } catch { toast.error('Error al editar') }
    finally { setSaving(false) }
  }

  const handleReply = async () => {
    if (!replyVal.trim()) return
    setSaving(true)
    try {
      const { data } = await commentsApi.addReply(comment._id, { content: replyVal }, newsId)
      onUpdated?.(data.data)
      setReplying(false)
      setReplyVal('')
      toast.success('Respuesta agregada')
    } catch { toast.error('Error al responder') }
    finally { setSaving(false) }
  }

  const handleDeleteReply = async (replyId) => {
    try {
      const { data } = await commentsApi.deleteReply(comment._id, replyId)
      onUpdated?.(data.data)
    } catch { toast.error('Error al eliminar') }
  }

  return (
    <div id={`comment-${comment._id}`} style={{ display: 'flex', gap: 11, padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
      <Avatar name={comment.author?.name} src={comment.author?.avatar} size="sm" />
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{comment.author?.name}</span>
            <span style={{ fontSize: 11.5, color: 'var(--text-muted)', marginLeft: 7 }}>{timeAgo(comment.createdAt)}</span>
          </div>
          {canEdit && !editing && (
            <div style={{ display: 'flex', gap: 3 }}>
              <button onClick={() => setEditing(true)}
                style={{ padding: '3px 7px', fontSize: 11.5, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-xs)', display: 'flex', alignItems: 'center', gap: 4, transition: 'all var(--transition)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--blue)'; e.currentTarget.style.background = 'var(--blue-subtle)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none' }}>
                <Edit2 size={11}/> Editar
              </button>
              <button onClick={() => onDeleted?.(comment._id)}
                style={{ padding: '3px 7px', fontSize: 11.5, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-xs)', display: 'flex', alignItems: 'center', gap: 4, transition: 'all var(--transition)' }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.background = 'var(--red-subtle)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none' }}>
                <Trash2 size={11}/> Eliminar
              </button>
            </div>
          )}
        </div>


        {editing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <textarea value={editVal} onChange={e => setEditVal(e.target.value)} rows={2}
              style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-subtle)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: 13.5, outline: 'none', fontFamily: 'var(--font-sans)', resize: 'none', color: 'var(--text-primary)' }} />
            <div style={{ display: 'flex', gap: 6 }}>
              <Button size="xs" loading={saving} onClick={handleEdit} icon={<Check size={12}/>}>Guardar</Button>
              <Button size="xs" variant="ghost" onClick={() => { setEditing(false); setEditVal(comment.content) }}>Cancelar</Button>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: 13.5, color: 'var(--text-primary)', lineHeight: 1.6 }}>{comment.content}</p>
        )}


        {user && !editing && (
          <button onClick={() => setReplying(!replying)}
            style={{ marginTop: 6, fontSize: 12, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'var(--font-sans)', transition: 'color var(--transition)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--blue)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}>
            <CornerDownRight size={12}/> Responder
          </button>
        )}


        {replying && (
          <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <Avatar name={user?.name} src={user?.avatar} size="xs" />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <textarea value={replyVal} onChange={e => setReplyVal(e.target.value)} placeholder="Escribe tu respuesta…" rows={2}
                style={{ width: '100%', padding: '8px 12px', background: 'var(--bg-subtle)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: 13, outline: 'none', fontFamily: 'var(--font-sans)', resize: 'none', color: 'var(--text-primary)' }} />
              <div style={{ display: 'flex', gap: 6 }}>
                <Button size="xs" loading={saving} onClick={handleReply}>Responder</Button>
                <Button size="xs" variant="ghost" onClick={() => { setReplying(false); setReplyVal('') }}>Cancelar</Button>
              </div>
            </div>
          </div>
        )}


        {comment.replies?.length > 0 && (
          <div style={{ marginTop: 10, paddingLeft: 14, borderLeft: '2px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {comment.replies.map((reply) => (
              <div key={reply._id} id={`reply-${reply._id}`} style={{ display: 'flex', gap: 8 }}>
                <Avatar name={reply.author?.name} src={reply.author?.avatar} size="xs" />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                    <div>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>{reply.author?.name}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 6 }}>{timeAgo(reply.createdAt)}</span>
                    </div>
                    {user && (user._id === reply.author?._id?.toString() || user.role === 'admin') && (
                      <button onClick={() => handleDeleteReply(reply._id)}
                        style={{ width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: 'var(--radius-xs)', transition: 'all var(--transition)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--red-subtle)'; e.currentTarget.style.color = 'var(--red)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)' }}>
                        <X size={11}/>
                      </button>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.55 }}>{reply.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
