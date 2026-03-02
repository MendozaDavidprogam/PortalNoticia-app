import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/auth.store'
import { useThemeStore } from './store/theme.store'
import Layout from './components/layout/Layout'
import { ProtectedRoute, RoleRoute } from './routes/guards'


import { LoginPage, RegisterPage } from './pages/auth/AuthPages'
import DashboardPage from './pages/DashboardPage'
import NewsListPage from './pages/news/NewsListPage'
import NewsDetailPage from './pages/news/NewsDetailPage'
import NewsFormPage from './pages/news/NewsFormPage'
import ProfilePage from './pages/profile/ProfilePage'
import AdminUsersPage from './pages/admin/AdminUsersPage'

export default function App() {
  const { init } = useAuthStore()
  const { theme } = useThemeStore()

  useEffect(() => { init() }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <Routes>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />


      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/news" element={<NewsListPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />


          <Route element={<RoleRoute roles={['autor', 'admin']} />}>
            <Route path="/news/create" element={<NewsFormPage />} />
            <Route path="/news/:id/edit" element={<NewsFormPage />} />
          </Route>


          <Route element={<RoleRoute roles={['admin']} />}>
            <Route path="/admin/users" element={<AdminUsersPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
