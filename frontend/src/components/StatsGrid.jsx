function formatTime(seconds) {
  if (!seconds) return '0h 0m'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  return `${h}h ${m}m`
}

function Stat({ label, value, unit, accent }) {
  return (
    <div style={{
      background: 'var(--bg-2)',
      border: `1px solid ${accent ? 'var(--accent)' : 'var(--border)'}`,
      borderRadius: 'var(--radius)',
      padding: '1.25rem 1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {accent && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, var(--accent), transparent)',
        }} />
      )}
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem',
        color: 'var(--text-2)',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        marginBottom: '0.5rem',
      }}>
        {label}
      </p>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2.5rem',
          letterSpacing: '0.02em',
          color: accent ? 'var(--accent)' : 'var(--text)',
          lineHeight: 1,
        }}>
          {value ?? '—'}
        </span>
        {unit && (
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--text-2)',
          }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  )
}

export default function StatsGrid({ stats }) {
  const runs = stats?.runs
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      gap: '1rem',
    }}>
      <Stat label="Total Runs"      value={runs?.count}            accent />
      <Stat label="Total Distance"  value={runs?.total_distance}   unit="km" />
      <Stat label="Total Time"      value={formatTime(runs?.total_time)} />
      <Stat label="Total Elevation" value={runs?.total_elevation}  unit="m" />
    </div>
  )
}
