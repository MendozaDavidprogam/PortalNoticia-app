import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Newspaper, Eye, Users, TrendingUp } from 'lucide-react'
import { useAuthStore } from '../store/auth.store'
import { newsApi } from '../api/news.api'
import { usersApi } from '../api/users.api'
import { Avatar, Badge } from '../components/ui/index'
import NewsCard from '../components/news/NewsCard'
import { formatDate, getRoleBadge } from '../utils/helpers'

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'center' }}>
      <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
        <Icon size={18} />
      </div>
      <div>
        <p style={{ fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1 }}>{value ?? '—'}</p>
        <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 3 }}>{label}</p>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [news, setNews] = useState([])
  const [myNews, setMyNews] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const badge = getRoleBadge(user?.role)

  useEffect(() => {
    const load = async () => {
      try {
        const [newsRes] = await Promise.all([newsApi.getAll({ limit: 4 })])
        setNews(newsRes.data.data.news || [])
        if (user?.role === 'admin') {
          const [uStats, nStats] = await Promise.all([usersApi.getStats(), newsApi.getStats()])
          setStats({ ...uStats.data.data, ...nStats.data.data })
        }
        if (user?.role === 'autor' || user?.role === 'admin') {
          const myRes = await newsApi.getMyNews({ limit: 3 })
          setMyNews(myRes.data.data.news || [])
        }
      } catch {}
      finally { setLoading(false) }
    }
    load()
  }, [user])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }} className="animate-in">
      {/* Welcome */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 18 }}>
        <Avatar name={user?.name} src={user?.avatar} size="xl" />
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 400, color: 'var(--text-primary)', lineHeight: 1.2 }}>
            Hola, {user?.name?.split(' ')[0]} 👋
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: badge.color, background: badge.bg, padding: '2px 9px', borderRadius: 'var(--radius-full)' }}>{badge.label}</span>
            <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{formatDate(new Date())}</span>
          </div>
        </div>
      </div>


      {user?.role === 'admin' && stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
          <StatCard icon={Newspaper} label="Total noticias" value={stats.total} color="var(--blue)" />
          <StatCard icon={Eye} label="Vistas totales" value={stats.totalViews} color="var(--green)" />
          <StatCard icon={Users} label="Usuarios" value={stats.total} color="var(--purple)" />
          <StatCard icon={TrendingUp} label="Autores" value={stats.autores} color="var(--amber)" />
        </div>
      )}


      {myNews.length > 0 && (
        <section>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 400, color: 'var(--text-primary)', marginBottom: 14 }}>Mis publicaciones recientes</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {myNews.map(n => <NewsCard key={n._id} news={n} />)}
          </div>
        </section>
      )}


      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 400, color: 'var(--text-primary)' }}>Últimas noticias</h2>
          <button onClick={() => navigate('/news')}
            style={{ fontSize: 13, color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>
            Ver todas →
          </button>
        </div>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 280, borderRadius: 'var(--radius-lg)' }} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {news.map(n => <NewsCard key={n._id} news={n} />)}
          </div>
        )}
      </section>
    </div>
  )
}
