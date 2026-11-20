import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import logo from '../assets/logo-ifc.jpg'
import { supabase } from '../supabase'
import { getCurrentSession, logoutUser } from '../services/apiAuth'

const NAV = [
  ['Home', '/'], ['Informasi', '/informasi'], ['Jadwal', '/jadwal'], ['Live Score', '/live-score'],
  ['Bracket', '/bracket'], ['Pendaftaran', '/pendaftaran'], ['Status', '/status'],
]

export default function Navbar({ onLogin }) {
  const [auth, setAuth] = useState(null)
  const navigate = useNavigate()

  const cekSesi = async () => {
    const sesi = await getCurrentSession()
    setAuth(sesi)
  }

  useEffect(() => {
    cekSesi()
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      cekSesi()
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await logoutUser()
    setAuth(null)
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="container">
        <Link className="logo" to="/">
          <img src={logo} alt="Logo IFC" className="logo-img" />
          <div className="logo-text">Informatics Futsal<small>Competition 2026</small></div>
        </Link>
        <nav className="nav-links">
          {NAV.map(([label, to]) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>{label}</NavLink>
          ))}
          {auth?.role === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => (isActive ? 'active' : '')}>Admin Panel</NavLink>
          )}
        </nav>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {auth ? (
            <>
              <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                {auth.role === 'admin' ? 'Admin' : auth.user.email}
              </span>
              <button className="btn btn-bad btn-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <button className="btn btn-primary btn-sm" onClick={onLogin}>Login</button>
          )}
        </div>
      </div>
    </header>
  )
}