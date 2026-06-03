import { useState, useEffect, useCallback } from 'react'
import { api } from '../api/client'
import ActivityCard from '../components/ActivityCard'

const SPORT_TYPES = ['All', 'Run', 'TrailRun', 'Ride', 'Swim', 'Walk']

export default function Activities() {
  const [activities, setActivities] = useState([])
  const [filter, setFilter]         = useState('All')
  const [offset, setOffset]         = useState(0)
  const [loading, setLoading]       = useState(false)
  const [hasMore, setHasMore]       = useState(true)
  const LIMIT = 20

  const load = useCallback(async (reset = false) => {
    setLoading(true)
    const params = { limit: LIMIT, offset: reset ? 0 : offset }
    if (filter !== 'All') params.sport_type = filter
    const data = await api.activities(params)
    setActivities(reset ? data : prev => [...prev, ...data])
    setHasMore(data.length === LIMIT)
    if (!reset) setOffset(o => o + LIMIT)
    setLoading(false)
  }, [filter, offset])

  useEffect(() => {
    setOffset(0)
    load(true)
  }, [filter])

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>

      <div className="fade-up" style={{ marginBottom: '2rem' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
          ◉ ALL ACTIVITIES
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', letterSpacing: '0.04em', lineHeight: 1 }}>
          ACTIVITY LOG
        </h1>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }} className="fade-up-1">
        {SPORT_TYPES.map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            style={{
              background: filter === t ? 'var(--accent)' : 'var(--bg-3)',
              color: filter === t ? '#fff' : 'var(--text-2)',
              border: `1px solid ${filter === t ? 'var(--accent)' : 'var(--border)'}`,
              padding: '0.4rem 1rem',
              borderRadius: 'var(--radius)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.72rem',
              fontWeight: '700',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Activity list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }} className="fade-up-2">
        {activities.map(a => <ActivityCard key={a.id} activity={a} />)}
        {activities.length === 0 && !loading && (
          <p style={{ color: 'var(--text-3)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
            No activities found. Hit SYNC on the dashboard first.
          </p>
        )}
      </div>

      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            onClick={() => load(false)}
            disabled={loading}
            style={{
              background: 'transparent',
              color: 'var(--text-2)',
              border: '1px solid var(--border)',
              padding: '0.65rem 2rem',
              borderRadius: 'var(--radius)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Loading...' : 'Load more'}
          </button>
        </div>
      )}
    </main>
  )
}
