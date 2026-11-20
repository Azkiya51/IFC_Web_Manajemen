import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/logo-ifc.jpg'

const NAV = [
  ['Home', '/'], ['Informasi', '/informasi'], ['Jadwal', '/jadwal'], ['Live Score', '/live-score'],
  ['Bracket', '/bracket'], ['Pendaftaran', '/pendaftaran'], ['Status', '/status'],
]

export default function Navbar({ onLogin }) {
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
        </nav>
        <button className="btn btn-primary btn-sm" onClick={onLogin}>Login</button>
      </div>
    </header>
  )
}
