import { hasToken } from '../api/client'
import { Navigate } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function Login() {
  if (hasToken()) return <Navigate to="/dashboard" replace />

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
        opacity: 0.4,
      }} />
      {/* Glow */}
      <div style={{
        position: 'absolute',
        width: '600px', height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,77,0,0.12) 0%, transparent 70%)',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', textAlign: 'center', maxWidth: '480px' }} className="fade-up">
        {/* Logo */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          letterSpacing: '0.3em',
          color: 'var(--accent)',
          textTransform: 'uppercase',
          marginBottom: '1rem',
        }}>
          ◉ RUNNING INTELLIGENCE
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3.5rem, 10vw, 6rem)',
          letterSpacing: '0.04em',
          lineHeight: 1,
          marginBottom: '0.5rem',
          color: 'var(--text)',
        }}>
          JUST<br/>
          <span style={{ color: 'var(--accent)' }}>ANOTHER</span><br/>
          RUN LAB
        </h1>

        <p style={{
          color: 'var(--text-2)',
          fontSize: '0.9rem',
          marginBottom: '3rem',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.05em',
        }}>
          Your training data. Your way.
        </p>

        <a
          href={`${API}/auth/strava`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: '#FC4C02',
            color: '#fff',
            padding: '0.9rem 2rem',
            borderRadius: 'var(--radius)',
            fontFamily: 'var(--font-mono)',
            fontWeight: '700',
            fontSize: '0.85rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            transition: 'transform 0.15s, box-shadow 0.15s',
            boxShadow: '0 0 0 0 rgba(252,76,2,0)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(252,76,2,0.4)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 0 0 0 rgba(252,76,2,0)'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066l-2.084 4.116zm-7.008-5.599l2.836 5.598 2.835-5.598H12.66l-1.435 2.833-1.435-2.833H8.38z"/>
          </svg>
          Connect with Strava
        </a>

        <p style={{
          marginTop: '2rem',
          fontSize: '0.75rem',
          color: 'var(--text-3)',
          fontFamily: 'var(--font-mono)',
        }}>
          Read-only access · No data sold · Ever.
        </p>
      </div>
    </div>
  )
}
