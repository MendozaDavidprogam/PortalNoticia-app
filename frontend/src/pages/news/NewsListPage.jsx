import { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { Plus, Newspaper } from 'lucide-react'
import { newsApi } from '../../api/news.api'
import { useAuthStore } from '../../store/auth.store'
import { Button, Pagination, EmptyState } from '../../components/ui/index'
import NewsCard from '../../components/news/NewsCard'
import toast from 'react-hot-toast'

const TAGS = ['tecnología','ciencia','política','economía','cultura','deportes','salud','mundo']

export default function NewsListPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { search } = useOutletContext() || {}
  const [news, setNews] = useState([])
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [tag, setTag] = useState('')
  const canCreate = user?.role === 'autor' || user?.role === 'admin'

  const load = async (page = 1) => {
    setLoading(true)
    try {
      const { data } = await newsApi.getAll({ page, limit: 9, search, tag })
      setNews(data.data.news || [])
      setPagination({ page, total: data.data.pagination.total, pages: data.data.pagination.pages })
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { load(1) }, [search, tag])

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar esta noticia?')) return
    try {
      await newsApi.remove(id)
      toast.success('Noticia eliminada')
      load(pagination.page)
    } catch { toast.error('Error al eliminar') }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="animate-in">

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 400, color: 'var(--text-primary)' }}>Noticias</h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginTop: 2 }}>{pagination.total} publicaciones</p>
        </div>
        {canCreate && <Button icon={<Plus size={15}/>} onClick={() => navigate('/news/create')}>Nueva noticia</Button>}
      </div>


      <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
        <button onClick={() => setTag('')}
          style={{ padding: '5px 13px', borderRadius: 'var(--radius-full)', fontSize: 12.5, fontWeight: 500, fontFamily: 'var(--font-sans)', cursor: 'pointer', transition: 'all var(--transition)', background: !tag ? 'var(--accent)' : 'var(--bg-subtle)', color: !tag ? 'var(--accent-fg)' : 'var(--text-secondary)', border: 'none' }}>
          Todas
        </button>
        {TAGS.map(t => (
          <button key={t} onClick={() => setTag(t === tag ? '' : t)}
            style={{ padding: '5px 13px', borderRadius: 'var(--radius-full)', fontSize: 12.5, fontWeight: 500, fontFamily: 'var(--font-sans)', cursor: 'pointer', transition: 'all var(--transition)', background: tag === t ? 'var(--accent)' : 'var(--bg-subtle)', color: tag === t ? 'var(--accent-fg)' : 'var(--text-secondary)', border: 'none' }}>
            {t}
          </button>
        ))}
      </div>


      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16 }}>
          {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton" style={{ height: 290, borderRadius: 'var(--radius-lg)' }} />)}
        </div>
      ) : news.length === 0 ? (
        <EmptyState icon={<Newspaper size={38}/>} title="Sin resultados" description="No se encontraron noticias con los filtros aplicados"
          action={canCreate ? <Button icon={<Plus size={15}/>} onClick={() => navigate('/news/create')}>Crear primera noticia</Button> : undefined} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 16 }}>
          {news.map(n => <NewsCard key={n._id} news={n} onDelete={handleDelete} />)}
        </div>
      )}


      {pagination.pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 12 }}>
          <Pagination page={pagination.page} total={pagination.total} limit={9} onChange={load} />
        </div>
      )}
    </div>
  )
}
