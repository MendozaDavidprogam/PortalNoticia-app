import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useAuthStore } from '../../store/auth.store'
import { useNotificationsStore } from '../../store/notifications.store'
import { useSocket } from '../../hooks/useSocket'

export default function Layout() {
  const { user } = useAuthStore()
  const { fetchCount } = useNotificationsStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')

  const userId = user?._id?.toString()

  useSocket(userId)

  useEffect(() => {
    if (userId) fetchCount()
  }, [userId])

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>

      <div className={`sidebar-wrapper ${menuOpen ? 'open' : ''}`}>
        <Sidebar onClose={() => setMenuOpen(false)} />
      </div>

      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,.45)',
            zIndex: 150,
          }}
        />
      )}

      <div className="main-wrapper">
        <Topbar
          search={search}
          setSearch={setSearch}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
        <main
          className="main-content"
          style={{
            flex: 1,
            padding: '28px 32px',
            maxWidth: 1100,
            width: '100%',
            margin: '0 auto',
          }}
        >
          <Outlet context={{ search }} />
        </main>
      </div>

    </div>
  )
}