import { getInitials } from '../../utils/helpers'
import styles from './Avatar.module.css'

const colors = ['#3b82f6','#8b5cf6','#f59e0b','#10b981','#ef4444','#ec4899','#06b6d4']

function colorFor(name = '') {
  const idx = name.charCodeAt(0) % colors.length
  return colors[idx]
}

export default function Avatar({ name = '', src, size = 'md', online }) {
  const initials = getInitials(name)
  const bg = colorFor(name)

  return (
    <div className={[styles.avatar, styles[size]].join(' ')}>
      {src
        ? <img src={src} alt={name} className={styles.img} />
        : <span className={styles.initials} style={{ background: bg }}>{initials}</span>
      }
      {online && <span className={styles.online} />}
    </div>
  )
}
