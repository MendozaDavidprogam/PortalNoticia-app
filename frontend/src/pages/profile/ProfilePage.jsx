import { useState } from 'react'
import { Camera } from 'lucide-react'
import { useAuthStore } from '../../store/auth.store'
import { usersApi } from '../../api/users.api'
import { uploadApi } from '../../api/upload.api'
import { Avatar, Badge, Button, Input, Textarea } from '../../components/ui/index'
import { getRoleBadge, formatDate } from '../../utils/helpers'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const [form, setForm] = useState({ name: user?.name || '', bio: user?.bio || '' })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const badge = getRoleBadge(user?.role)

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    try {
      const { data } = await usersApi.updateProfile(form)
      updateUser(data.data)
      toast.success('Perfil actualizado')
    } catch { toast.error('Error al guardar') }
    finally { setSaving(false) }
  }

  const handleAvatar = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const { data } = await uploadApi.uploadImage(file)
      await usersApi.updateProfile({ avatar: data.data.url })
      updateUser({ avatar: data.data.url })
      toast.success('Avatar actualizado')
    } catch { toast.error('Error al subir') }
    finally { setUploading(false) }
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }} className="animate-in">
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 400, color: 'var(--text-primary)', marginBottom: 24 }}>Mi perfil</h1>

      <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20, alignItems: 'start' }}>

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, textAlign: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Avatar name={user?.name} src={user?.avatar} size="xxl" />
            <label style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid var(--bg-card)' }}>
              <Camera size={13} style={{ color: 'var(--accent-fg)' }} />
              <input type="file" accept="image/*" onChange={handleAvatar} style={{ display: 'none' }} disabled={uploading} />
            </label>
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name}</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{user?.email}</p>
          </div>
          <span style={{ fontSize: 11, fontWeight: 500, color: badge.color, background: badge.bg, padding: '2px 10px', borderRadius: 'var(--radius-full)' }}>{badge.label}</span>
          <div style={{ width: '100%', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Miembro desde</p>
            <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginTop: 2 }}>{formatDate(user?.createdAt)}</p>
          </div>
        </div>


        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '24px' }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 20 }}>Editar información</h2>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Input label="Nombre" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            <div>
              <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Email</label>
              <div style={{ height: 40, padding: '0 13px', background: 'var(--bg-subtle)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', fontSize: 13.5, color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                {user?.email} <span style={{ marginLeft: 8, fontSize: 11, background: 'var(--bg-hover)', padding: '1px 7px', borderRadius: 'var(--radius-full)' }}>No editable</span>
              </div>
            </div>
            <Textarea label="Bio" placeholder="Cuéntanos sobre ti…" value={form.bio}
              onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
              hint={`${form.bio.length}/300`} rows={4} style={{ maxHeight: 120 }} />
            <Button type="submit" fullWidth loading={saving}>Guardar cambios</Button>
          </form>
        </div>
      </div>
    </div>
  )
}
