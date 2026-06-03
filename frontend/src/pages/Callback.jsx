import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { setToken } from '../api/client'

export default function Callback() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const token = params.get('token')
    if (token) {
      setToken(token)
      navigate('/dashboard', { replace: true })
    } else {
      navigate('/', { replace: true })
    }
  }, [])

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: '1rem',
    }}>
      <div style={{
        width: '48px', height: '48px',
        border: '3px solid var(--border)',
        borderTop: '3px solid var(--accent)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-2)', fontSize: '0.8rem' }}>
        Authenticating...
      </p>
    </div>
  )
}
