const SPORT_ICONS = {
  Run: '🏃', TrailRun: '⛰️', Ride: '🚴', Swim: '🏊',
  Walk: '🚶', Hike: '🥾', VirtualRun: '🏃',
}

function msToPace(metersPerSec) {
  if (!metersPerSec || metersPerSec === 0) return '--:--'
  const secPerKm = 1000 / metersPerSec
  const min = Math.floor(secPerKm / 60)
  const sec = Math.round(secPerKm % 60).toString().padStart(2, '0')
  return `${min}:${sec}`
}

function formatDist(m) {
  return m >= 1000 ? `${(m / 1000).toFixed(2)} km` : `${Math.round(m)} m`
}

function formatTime(s) {
  if (!s) return '—'
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function ActivityCard({ activity: a, compact = false }) {
  const icon = SPORT_ICONS[a.sport_type] || '🏅'
  const isRun = ['Run','TrailRun','VirtualRun'].includes(a.sport_type)

  if (compact) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.6rem 0',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
          <span style={{ fontSize: '1rem' }}>{icon}</span>
          <div style={{ overflow: 'hidden' }}>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.82rem',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '140px',
            }}>{a.name}</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-2)' }}>
              {formatDate(a.start_date)}
            </p>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: '700', color: 'var(--accent)' }}>
            {formatDist(a.distance)}
          </p>
          {isRun && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-2)' }}>
              {msToPace(a.average_speed)} /km
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{
      background: 'var(--bg-2)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '1rem 1.25rem',
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: '0.5rem',
      transition: 'border-color 0.15s',
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span>{icon}</span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: 'var(--text-3)',
            background: 'var(--bg-3)',
            padding: '0.15rem 0.4rem',
            borderRadius: '3px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
            {a.sport_type}
          </span>
        </div>
        <p style={{ fontWeight: '600', fontSize: '0.92rem', marginBottom: '0.2rem' }}>{a.name}</p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-2)' }}>
          {formatDate(a.start_date)}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Dist</p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--accent)', lineHeight: 1 }}>
            {formatDist(a.distance)}
          </p>
        </div>
        {isRun && (
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pace</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', lineHeight: 1 }}>
              {msToPace(a.average_speed)}
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-3)' }}>/km</p>
          </div>
        )}
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Time</p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', lineHeight: 1 }}>
            {formatTime(a.moving_time)}
          </p>
        </div>
        {a.average_heartrate && (
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>HR</p>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--green)', lineHeight: 1 }}>
              {Math.round(a.average_heartrate)}
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-3)' }}>bpm</p>
          </div>
        )}
      </div>
    </div>
  )
}
