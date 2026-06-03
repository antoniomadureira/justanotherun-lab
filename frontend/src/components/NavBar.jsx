import { Link, useLocation, useNavigate } from 'react-router-dom'
import { clearToken } from '../api/client'

export default function NavBar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  function logout() {
    clearToken()
    navigate('/')
  }

  const link = (to, label) => (
    <Link
      to={to}
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.72rem',
        fontWeight: '700',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: pathname === to ? 'var(--accent)' : 'var(--text-2)',
        borderBottom: pathname === to ? '2px solid var(--accent)' : '2px solid transparent',
        paddingBottom: '2px',
        transition: 'color 0.15s',
      }}
    >
      {label}
    </Link>
  )

  return (
    <nav style={{
      background: 'var(--bg)',
      borderBottom: '1px solid var(--border)',
      padding: '0 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '56px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.4rem',
        letterSpacing: '0.06em',
        color: 'var(--text)',
      }}>
        JAR<span style={{ color: 'var(--accent)' }}>·</span>LAB
      </span>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        {link('/dashboard', 'Dashboard')}
        {link('/activities', 'Activities')}
        <button
          onClick={logout}
          style={{
            background: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--text-3)',
            padding: '0.3rem 0.8rem',
            borderRadius: 'var(--radius)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
