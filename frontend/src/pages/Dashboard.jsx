import { useState, useEffect } from 'react'
import { api } from '../api/client'
import StatsGrid from '../components/StatsGrid'
import RecentRuns from '../components/RecentRuns'
import MonthlyChart from '../components/MonthlyChart'

export default function Dashboard() {
  const [athlete, setAthlete] = useState(null)
  const [stats, setStats]     = useState(null)
  const [recent, setRecent]   = useState([])
  const [syncing, setSyncing] = useState(false)
  const [year] = useState(new Date().getFullYear())

  useEffect(() => {
    Promise.all([api.me(), api.stats(year), api.activities({ limit: 5 })])
      .then(([a, s, acts]) => {
        setAthlete(a)
        setStats(s)
        setRecent(acts)
      })
  }, [])

  async function handleSync() {
    setSyncing(true)
    try {
      const r = await api.sync()
      const [s, acts] = await Promise.all([api.stats(year), api.activities({ limit: 5 })])
      setStats(s)
      setRecent(acts)
      alert(`✓ Synced ${r.synced} new activities`)
    } catch(e) {
      alert('Sync failed: ' + e.message)
    } finally {
      setSyncing(false)
    }
  }

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem' }} className="fade-up">
        <div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            ◉ OVERVIEW · {year}
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', letterSpacing: '0.04em', lineHeight: 1 }}>
            {athlete ? `${athlete.firstname} ${athlete.lastname}`.toUpperCase() : 'LOADING...'}
          </h1>
          {athlete?.city && (
            <p style={{ color: 'var(--text-2)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', marginTop: '0.3rem' }}>
              📍 {athlete.city}{athlete.country ? `, ${athlete.country}` : ''}
            </p>
          )}
        </div>

        <button
          onClick={handleSync}
          disabled={syncing}
          style={{
            background: syncing ? 'var(--bg-3)' : 'var(--accent)',
            color: syncing ? 'var(--text-2)' : '#fff',
            border: 'none',
            padding: '0.65rem 1.25rem',
            borderRadius: 'var(--radius)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            fontWeight: '700',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: syncing ? 'not-allowed' : 'pointer',
            transition: 'all 0.15s',
            animation: syncing ? 'pulse 1s ease infinite' : 'none',
          }}
        >
          {syncing ? '⟳ SYNCING...' : '↑ SYNC'}
        </button>
      </div>

      {/* Stats grid */}
      <div className="fade-up-1">
        <StatsGrid stats={stats} />
      </div>

      {/* Chart + Recent */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }} className="fade-up-2">
        <MonthlyChart data={stats?.monthly || []} />
        <RecentRuns activities={recent} />
      </div>
    </main>
  )
}
