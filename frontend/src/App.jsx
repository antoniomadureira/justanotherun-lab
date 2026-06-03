import { Routes, Route, Navigate } from 'react-router-dom'
import { hasToken } from './api/client'
import Login    from './pages/Login'
import Callback from './pages/Callback'
import Dashboard from './pages/Dashboard'
import Activities from './pages/Activities'
import NavBar from './components/NavBar'

function Protected({ children }) {
  return hasToken() ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/"          element={<Login />} />
      <Route path="/callback"  element={<Callback />} />
      <Route path="/dashboard" element={<Protected><NavBar /><Dashboard /></Protected>} />
      <Route path="/activities" element={<Protected><NavBar /><Activities /></Protected>} />
      <Route path="*"          element={<Navigate to="/" replace />} />
    </Routes>
  )
}
