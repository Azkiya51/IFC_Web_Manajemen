import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Demo login: username "admin" -> /admin, selain itu -> /status
export default function LoginModal({ open, onClose }) {
  const [u, setU] = useState('')
  const [p, setP] = useState('')
  const navigate = useNavigate()
  if (!open) return null

  const submit = () => {
    onClose()
    navigate(u.trim().toLowerCase() === 'admin' ? '/admin' : '/status')
  }

  return (
    <div className="modal show" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="login-card">
        <button className="close" onClick={onClose} aria-label="Tutup">×</button>
        <h2>Login</h2>
        <p className="hint">Masuk untuk mengakses sistem. (Demo: ketik "admin" untuk membuka Admin Panel.)</p>
        <label htmlFor="u">Email / Username</label>
        <input id="u" value={u} onChange={e => setU(e.target.value)} placeholder="Masukkan email atau username" />
        <label htmlFor="p">Password</label>
        <input id="p" type="password" value={p} onChange={e => setP(e.target.value)} placeholder="Masukkan password" />
        <button className="btn btn-primary" onClick={submit}>Login</button>
      </div>
    </div>
  )
}
