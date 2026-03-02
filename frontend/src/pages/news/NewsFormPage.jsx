import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Image, X, Tag as TagIcon, Save, Eye, EyeOff } from 'lucide-react'
import { newsApi } from '../../api/news.api'
import { uploadApi } from '../../api/upload.api'
import { Button, Input, Textarea } from '../../components/ui/index'
import toast from 'react-hot-toast'

export default function NewsFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [form, setForm] = useState({ title: '', content: '', image: '', tags: [], status: 'published' })
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(false)

  useEffect(() => {
    if (isEdit) {
      newsApi.getOne(id).then(({ data }) => {
        const n = data.data
        setForm({ title: n.title, content: n.content, image: n.image || '', tags: n.tags || [], status: n.status })
      }).catch(() => navigate('/news'))
    }
  }, [id])

  const validate = () => {
    const e = {}
    if (!form.title || form.title.length < 5) e.title = 'Mínimo 5 caracteres'
    if (!form.content || form.content.length < 20) e.content = 'Mínimo 20 caracteres'
    setErrors(e); return !Object.keys(e).length
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      if (isEdit) {
        await newsApi.update(id, form)
        toast.success('Noticia actualizada')
      } else {
        const { data } = await newsApi.create(form)
        toast.success('Noticia publicada')
        navigate(`/news/${data.data._id}`)
        return
      }
      navigate(`/news/${id}`)
    } catch (err) { toast.error(err.response?.data?.message || 'Error') }
    finally { setSaving(false) }
  }

  const handleImage = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5242880) { toast.error('Imagen demasiado grande (max 5MB)'); return }
    setUploading(true)
    try {
      const { data } = await uploadApi.uploadImage(file)
      setForm(p => ({ ...p, image: data.data.url }))
      toast.success('Imagen subida')
    } catch { toast.error('Error al subir imagen') }
    finally { setUploading(false) }
  }

  const addTag = () => {
    const t = tagInput.trim().toLowerCase()
    if (t && !form.tags.includes(t) && form.tags.length < 5) {
      setForm(p => ({ ...p, tags: [...p.tags, t] }))
      setTagInput('')
    }
  }

  const removeTag = (t) => setForm(p => ({ ...p, tags: p.tags.filter(x => x !== t) }))

  return (
    <div className="animate-in" style={{ maxWidth: 840, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 400, color: 'var(--text-primary)' }}>
            {isEdit ? 'Editar noticia' : 'Nueva noticia'}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 3 }}>
            {isEdit ? 'Actualiza el contenido' : 'Comparte una nueva historia'}
          </p>
        </div>
        <Button variant="ghost" size="sm" icon={preview ? <EyeOff size={14}/> : <Eye size={14}/>} onClick={() => setPreview(!preview)}>
          {preview ? 'Editar' : 'Previsualizar'}
        </Button>
      </div>

      {preview ? (

        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '32px 36px' }}>
          {form.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
              {form.tags.map(t => <span key={t} style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-subtle)', padding: '1px 8px', borderRadius: 'var(--radius-full)' }}>{t}</span>)}
            </div>
          )}
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 400, marginBottom: 16 }}>{form.title || 'Sin título'}</h2>
          {form.image && <img src={form.image} alt="preview" style={{ width: '100%', maxHeight: 360, objectFit: 'cover', borderRadius: 'var(--radius-lg)', marginBottom: 20 }} />}
          <p style={{ fontSize: 16, lineHeight: 1.75, whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>{form.content || 'Sin contenido'}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Título" placeholder="Un título llamativo…" value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              error={errors.title}
              hint={`${form.title.length}/200`} />

            <Textarea label="Contenido" placeholder="Escribe aquí el contenido de la noticia…"
              value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
              error={errors.content} rows={14} style={{ minHeight: 320 }}
              hint={`${form.content.length} caracteres`} />
          </div>


          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 16 }}>
              <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.05em' }}>Publicación</p>
              <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                {['published', 'draft'].map(s => (
                  <button key={s} type="button" onClick={() => setForm(p => ({ ...p, status: s }))}
                    style={{ flex: 1, padding: '7px 0', borderRadius: 'var(--radius-sm)', fontSize: 12.5, fontWeight: 500, fontFamily: 'var(--font-sans)', cursor: 'pointer', transition: 'all var(--transition)', background: form.status === s ? 'var(--accent)' : 'var(--bg-subtle)', color: form.status === s ? 'var(--accent-fg)' : 'var(--text-secondary)', border: 'none' }}>
                    {s === 'published' ? 'Publicar' : 'Borrador'}
                  </button>
                ))}
              </div>
              <Button type="submit" fullWidth loading={saving} icon={<Save size={14}/>}>
                {isEdit ? 'Guardar cambios' : 'Publicar ahora'}
              </Button>
              <Button type="button" fullWidth variant="ghost" size="sm" onClick={() => navigate(-1)} style={{ marginTop: 6 }}>
                Cancelar
              </Button>
            </div>


            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 16 }}>
              <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.05em' }}>Imagen</p>
              {form.image ? (
                <div style={{ position: 'relative' }}>
                  <img src={form.image} alt="portada" style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
                  <button type="button" onClick={() => setForm(p => ({ ...p, image: '' }))}
                    style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: '50%', background: 'rgba(0,0,0,.55)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={11}/>
                  </button>
                </div>
              ) : (
                <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '18px 0', border: '1.5px dashed var(--border)', borderRadius: 'var(--radius-md)', cursor: uploading ? 'wait' : 'pointer', gap: 6, color: 'var(--text-muted)', transition: 'all var(--transition)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                  <Image size={20}/>
                  <span style={{ fontSize: 12 }}>{uploading ? 'Subiendo…' : 'Subir imagen'}</span>
                  <input type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} disabled={uploading} />
                </label>
              )}
            </div>


            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 16 }}>
              <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '.05em' }}>Etiquetas</p>
              {form.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 10 }}>
                  {form.tags.map(t => (
                    <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, padding: '2px 8px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-full)', color: 'var(--text-secondary)' }}>
                      {t}
                      <button type="button" onClick={() => removeTag(t)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', padding: 0 }}><X size={10}/></button>
                    </span>
                  ))}
                </div>
              )}
              {form.tags.length < 5 && (
                <div style={{ display: 'flex', gap: 6 }}>
                  <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                    placeholder="Añadir etiqueta…"
                    style={{ flex: 1, height: 32, padding: '0 10px', background: 'var(--bg-subtle)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 13, color: 'var(--text-primary)', outline: 'none', fontFamily: 'var(--font-sans)' }} />
                  <button type="button" onClick={addTag}
                    style={{ padding: '0 10px', height: 32, background: 'var(--bg-subtle)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 13 }}>
                    +
                  </button>
                </div>
              )}
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 7 }}>{form.tags.length}/5 etiquetas</p>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
