import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-3)',
      border: '1px solid var(--border)',
      padding: '0.75rem 1rem',
      borderRadius: 'var(--radius)',
      fontFamily: 'var(--font-mono)',
      fontSize: '0.72rem',
    }}>
      <p style={{ color: 'var(--accent)', marginBottom: '0.25rem' }}>{label}</p>
      <p style={{ color: 'var(--text)' }}>{payload[0].value} km</p>
      <p style={{ color: 'var(--text-2)' }}>{payload[0].payload.count} runs</p>
    </div>
  )
}

export default function MonthlyChart({ data }) {
  const currentMonth = new Date().getMonth() + 1
  const chartData = MONTHS.map((name, i) => {
    const found = data.find(d => d.month === i + 1)
    return { name, distance_km: found?.distance_km || 0, count: found?.count || 0 }
  })

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
        Monthly Distance (km)
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData} barCategoryGap="30%">
          <XAxis
            dataKey="name"
            tick={{ fill: 'var(--text-3)', fontFamily: 'var(--font-mono)', fontSize: 10 }}
            axisLine={false} tickLine={false}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,77,0,0.05)' }} />
          <Bar dataKey="distance_km" radius={[3,3,0,0]}>
            {chartData.map((_, i) => (
              <Cell
                key={i}
                fill={i + 1 === currentMonth ? 'var(--accent)' : 'var(--bg-3)'}
                stroke={i + 1 === currentMonth ? 'var(--accent)' : 'var(--border)'}
                strokeWidth={1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
