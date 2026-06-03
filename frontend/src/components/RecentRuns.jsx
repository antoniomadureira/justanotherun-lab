import ActivityCard from './ActivityCard'

export default function RecentRuns({ activities }) {
  return (
    <div style={{
      background: 'var(--bg-2)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      padding: '1.25rem',
    }}>
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.65rem',
        color: 'var(--text-2)',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        marginBottom: '1rem',
      }}>
        Recent Activities
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {activities.length === 0 && (
          <p style={{ color: 'var(--text-3)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
            No activities yet.
          </p>
        )}
        {activities.map(a => <ActivityCard key={a.id} activity={a} compact />)}
      </div>
    </div>
  )
}
