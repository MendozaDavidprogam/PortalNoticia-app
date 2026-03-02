import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '../../store/auth.store'
import { Button, Input } from '../../components/ui/index'
import toast from 'react-hot-toast'

const authCard = {
  minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'var(--bg)', padding: '24px',
}
const card = {
  width: '100%', maxWidth: 380, background: 'var(--bg-card)',
  border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)',
  padding: '36px 32px', boxShadow: 'var(--shadow-lg)',
}

export function LoginPage() {
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Requerido'
    if (!form.password) e.password = 'Requerido'
    setErrors(e); return !Object.keys(e).length
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await login(form)
      toast.success('Bienvenido')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Credenciales inválidas')
    } finally { setLoading(false) }
  }

  return (
    <div style={authCard}>
      <div style={card} className="animate-in">

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--bg-card)', lineHeight: 1 }}>N</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 400, color: 'var(--text-primary)' }}>Iniciar sesión</h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginTop: 4 }}>Bienvenido de nuevo</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Email" type="email" placeholder="tu@email.com" value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            icon={<Mail size={15}/>} error={errors.email} />
          <div style={{ position: 'relative' }}>
            <Input label="Contraseña" type={showPw ? 'text' : 'password'} placeholder="••••••••"
              value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              icon={<Lock size={15}/>} error={errors.password} />
            <button type="button" onClick={() => setShowPw(!showPw)}
              style={{ position: 'absolute', right: 11, bottom: errors.password ? 26 : 10, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              {showPw ? <EyeOff size={15}/> : <Eye size={15}/>}
            </button>
          </div>

          <Button type="submit" fullWidth loading={loading} style={{ marginTop: 4 }}>
            Iniciar sesión
          </Button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13.5, color: 'var(--text-muted)' }}>
          ¿Sin cuenta?{' '}
          <Link to="/register" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Regístrate</Link>
        </p>
      </div>
    </div>
  )
}

export function RegisterPage() {
  const { register } = useAuthStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'lector' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name || form.name.length < 2) e.name = 'Mínimo 2 caracteres'
    if (!form.email) e.email = 'Requerido'
    if (!form.password || form.password.length < 6) e.password = 'Mínimo 6 caracteres'
    setErrors(e); return !Object.keys(e).length
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await register(form)
      toast.success('¡Bienvenido a NewsHub Pro!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al registrarse')
    } finally { setLoading(false) }
  }

  return (
    <div style={authCard}>
      <div style={{ ...card, maxWidth: 420 }} className="animate-in">
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 20, color: 'var(--bg-card)', lineHeight: 1 }}>N</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 400 }}>Crear cuenta</h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginTop: 4 }}>Únete a NewsHub Pro</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Input label="Nombre" placeholder="Tu nombre" value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            icon={<User size={15}/>} error={errors.name} />
          <Input label="Email" type="email" placeholder="tu@email.com" value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            icon={<Mail size={15}/>} error={errors.email} />
          <Input label="Contraseña" type="password" placeholder="Mínimo 6 caracteres" value={form.password}
            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
            icon={<Lock size={15}/>} error={errors.password} />


          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text-secondary)' }}>Tipo de cuenta</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { value: 'lector', label: 'Lector', desc: 'Leer y comentar' },
                { value: 'autor', label: 'Autor', desc: 'Publicar noticias' },
              ].map(({ value, label, desc }) => (
                <button key={value} type="button" onClick={() => setForm(p => ({ ...p, role: value }))}
                  style={{
                    padding: '10px 12px', borderRadius: 'var(--radius-md)', textAlign: 'left',
                    border: `1.5px solid ${form.role === value ? 'var(--accent)' : 'var(--border)'}`,
                    background: form.role === value ? 'var(--accent-subtle, var(--bg-subtle))' : 'transparent',
                    cursor: 'pointer', transition: 'all var(--transition)',
                  }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</p>
                  <p style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 1 }}>{desc}</p>
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" fullWidth loading={loading} style={{ marginTop: 4 }}>
            Crear cuenta
          </Button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13.5, color: 'var(--text-muted)' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}
