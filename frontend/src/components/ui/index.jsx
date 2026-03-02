export function Button({ children, variant = 'primary', size = 'md', loading, disabled, fullWidth, icon, onClick, type = 'button', style: extra, ...p }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7,
    fontFamily: 'var(--font-sans)', fontWeight: 500, border: 'none',
    borderRadius: 'var(--radius-md)', cursor: 'pointer',
    transition: 'all var(--transition)', whiteSpace: 'nowrap',
    outline: 'none', letterSpacing: '-0.01em',
    opacity: (disabled || loading) ? .5 : 1,
    pointerEvents: (disabled || loading) ? 'none' : undefined,
    width: fullWidth ? '100%' : undefined,
  }
  const sizes = {
    xs: { height: 28, padding: '0 10px', fontSize: 12 },
    sm: { height: 32, padding: '0 12px', fontSize: 13 },
    md: { height: 38, padding: '0 16px', fontSize: 13.5 },
    lg: { height: 46, padding: '0 22px', fontSize: 15 },
  }
  const variants = {
    primary:   { background: 'var(--accent)', color: 'var(--accent-fg)' },
    secondary: { background: 'var(--bg-subtle)', color: 'var(--text-primary)', border: '1.5px solid var(--border)' },
    ghost:     { background: 'transparent', color: 'var(--text-secondary)' },
    danger:    { background: 'var(--red-subtle)', color: 'var(--red)', border: '1.5px solid transparent' },
    outline:   { background: 'transparent', color: 'var(--text-primary)', border: '1.5px solid var(--border)' },
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading}
      style={{ ...base, ...sizes[size], ...variants[variant], ...extra }} {...p}>
      {loading
        ? <span style={{ width: 13, height: 13, border: '2px solid rgba(128,128,128,.3)', borderTopColor: 'currentColor', borderRadius: '50%', animation: 'spin .65s linear infinite', display: 'inline-block' }} />
        : icon}
      {children}
    </button>
  )
}


export function Input({ label, error, icon, hint, style: extra, ...p }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</label>}
      <div style={{ position: 'relative' }}>
        {icon && <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', pointerEvents: 'none' }}>{icon}</span>}
        <input style={{
          width: '100%', height: 40, padding: icon ? '0 13px 0 36px' : '0 13px',
          background: 'var(--bg-card)', color: 'var(--text-primary)',
          border: `1.5px solid ${error ? 'var(--red)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-md)', fontSize: 13.5, outline: 'none',
          transition: 'border-color var(--transition)', ...extra,
        }} {...p} />
      </div>
      {error && <span style={{ fontSize: 12, color: 'var(--red)' }}>{error}</span>}
      {hint && !error && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{hint}</span>}
    </div>
  )
}


export function Textarea({ label, error, hint, style: extra, ...p }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {label && <label style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text-secondary)' }}>{label}</label>}
      <textarea style={{
        width: '100%', padding: '10px 13px',
        background: 'var(--bg-card)', color: 'var(--text-primary)',
        border: `1.5px solid ${error ? 'var(--red)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-md)', fontSize: 13.5, outline: 'none',
        transition: 'border-color var(--transition)', resize: 'vertical', lineHeight: 1.6,
        fontFamily: 'var(--font-sans)', ...extra,
      }} {...p} />
      {error && <span style={{ fontSize: 12, color: 'var(--red)' }}>{error}</span>}
      {hint && !error && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{hint}</span>}
    </div>
  )
}


const BADGE_COLORS = {
  gray:   { bg: 'var(--bg-hover)',     color: 'var(--text-secondary)' },
  blue:   { bg: 'var(--blue-subtle)',  color: 'var(--blue)' },
  green:  { bg: 'var(--green-subtle)', color: 'var(--green)' },
  amber:  { bg: 'var(--amber-subtle)', color: 'var(--amber)' },
  red:    { bg: 'var(--red-subtle)',   color: 'var(--red)' },
  purple: { bg: 'var(--purple-subtle)',color: 'var(--purple)' },
}
export function Badge({ children, color = 'gray', dot }) {
  const c = BADGE_COLORS[color] || BADGE_COLORS.gray
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      borderRadius: 'var(--radius-full)', fontWeight: 500,
      fontSize: 11, padding: '2px 8px', ...c,
    }}>
      {dot && <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />}
      {children}
    </span>
  )
}


const AV_COLORS = ['#3b82f6','#8b5cf6','#f59e0b','#10b981','#ef4444','#ec4899','#0ea5e9']
const sizes = { xs: 22, sm: 30, md: 38, lg: 46, xl: 60, xxl: 76 }
export function Avatar({ name = '', src, size = 'md' }) {
  const px = sizes[size] || 38
  const initials = name.split(' ').slice(0,2).map(n => n[0]).join('').toUpperCase()
  const bg = AV_COLORS[(name.charCodeAt(0) || 0) % AV_COLORS.length]
  return (
    <div style={{ width: px, height: px, borderRadius: '50%', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: src ? 'transparent' : bg }}>
      {src
        ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        : <span style={{ color: '#fff', fontWeight: 600, fontSize: px * .36 }}>{initials}</span>
      }
    </div>
  )
}


export function EmptyState({ icon, title, description, action }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '56px 24px', textAlign: 'center' }}>
      {icon && <div style={{ color: 'var(--text-muted)', opacity: .4, marginBottom: 14 }}>{icon}</div>}
      <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>{title}</h3>
      {description && <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', maxWidth: 300, lineHeight: 1.6 }}>{description}</p>}
      {action && <div style={{ marginTop: 18 }}>{action}</div>}
    </div>
  )
}


import { ChevronLeft, ChevronRight } from 'lucide-react'
export function Pagination({ page, total, limit, onChange }) {
  const pages = Math.ceil(total / limit)
  if (pages <= 1) return null
  const nums = Array.from({ length: pages }, (_, i) => i + 1)
    .filter(p => p === 1 || p === pages || Math.abs(p - page) <= 1)
    .reduce((a, p, i, arr) => { if (i > 0 && p - arr[i-1] > 1) a.push('…'); a.push(p); return a }, [])
  const btn = (active, disabled) => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minWidth: 32, height: 32, padding: '0 6px',
    border: `1.5px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
    borderRadius: 'var(--radius-sm)',
    background: active ? 'var(--accent)' : 'transparent',
    color: active ? 'var(--accent-fg)' : 'var(--text-secondary)',
    fontSize: 13, fontWeight: 500, fontFamily: 'var(--font-sans)',
    cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? .4 : 1,
    transition: 'all var(--transition)',
  })
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      <button style={btn(false, page <= 1)} disabled={page <= 1} onClick={() => onChange(page - 1)}><ChevronLeft size={14}/></button>
      {nums.map((p, i) => p === '…'
        ? <span key={i} style={{ padding: '0 4px', color: 'var(--text-muted)', fontSize: 13 }}>…</span>
        : <button key={p} style={btn(page === p, false)} onClick={() => onChange(p)}>{p}</button>
      )}
      <button style={btn(false, page >= pages)} disabled={page >= pages} onClick={() => onChange(page + 1)}><ChevronRight size={14}/></button>
      <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--text-muted)' }}>{total} total</span>
    </div>
  )
}
