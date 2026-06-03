const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function getToken() {
  return localStorage.getItem('jar_token')
}

async function req(path, options = {}) {
  const token = getToken()
  const url = `${BASE}${path}${path.includes('?') ? '&' : '?'}token=${token}`
  const res = await fetch(url, options)
  if (res.status === 401) {
    localStorage.removeItem('jar_token')
    window.location.href = '/'
    return
  }
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export const api = {
  me:         ()           => req('/me'),
  sync:       ()           => req('/sync', { method: 'POST' }),
  activities: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return req(`/activities${qs ? '?' + qs : ''}`)
  },
  activity:   (id)         => req(`/activities/${id}`),
  stats:      (year)       => req(`/stats${year ? '?year=' + year : ''}`),
}

export function setToken(t) { localStorage.setItem('jar_token', t) }
export function clearToken() { localStorage.removeItem('jar_token') }
export function hasToken() { return !!localStorage.getItem('jar_token') }
