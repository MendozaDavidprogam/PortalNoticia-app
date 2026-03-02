import { Search, Sun, Moon, Menu, X } from 'lucide-react'
import { useThemeStore } from '../../store/theme.store'
import NotificationBell from './NotificationBell'

export default function Topbar({ search, setSearch, menuOpen, setMenuOpen }) {
  const { theme, toggle } = useThemeStore()

  return (
    <header style={{
      height: 54, display: 'flex', alignItems: 'center', gap: 12,
      padding: '0 20px', borderBottom: '1px solid var(--border)',
      background: 'var(--bg-card)', position: 'sticky', top: 0, zIndex: 100,
    }}>

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: 'none', width: 34, height: 34, alignItems: 'center', justifyContent: 'center',
          border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)',
          background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer',
          '@media (max-width: 768px)': { display: 'flex' },
        }}
        className="mobile-menu-btn"
      >
        {menuOpen ? <X size={16} /> : <Menu size={16} />}
      </button>


      <div style={{ flex: 1, maxWidth: 440, position: 'relative' }}>
        <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar noticias…"
          style={{
            width: '100%', height: 36,
            padding: '0 14px 0 34px',
            background: 'var(--bg-subtle)', color: 'var(--text-primary)',
            border: '1.5px solid transparent', borderRadius: 'var(--radius-full)',
            fontSize: 13.5, outline: 'none', transition: 'all var(--transition)',
          }}
          onFocus={e => { e.target.style.background = 'var(--bg-card)'; e.target.style.borderColor = 'var(--border)' }}
          onBlur={e => { e.target.style.background = 'var(--bg-subtle)'; e.target.style.borderColor = 'transparent' }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>

        <NotificationBell />


        <button
          onClick={toggle}
          style={{
            width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)',
            background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer',
            transition: 'all var(--transition)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-subtle)'; e.currentTarget.style.color = 'var(--text-primary)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          title={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>
    </header>
  )
}
