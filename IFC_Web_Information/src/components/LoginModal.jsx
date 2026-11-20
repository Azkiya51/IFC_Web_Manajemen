import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../services/apiAuth'

export default function LoginModal({ open, onClose }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  if (!open) return null

  const submit = async (e) => {
    if (e) e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { role } = await loginUser(email.trim(), password)
      onClose()
      navigate(role === 'admin' ? '/admin' : '/status')
    } catch (err) {
      setError(err.message || 'Email atau password salah.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal show" onClick={e => e.target === e.currentTarget && onClose()}>
      <form className="login-card" onSubmit={submit}>
        <button type="button" className="close" onClick={onClose} aria-label="Tutup">×</button>
        <h2>Login</h2>
        <p className="hint">Masuk menggunakan akun email dan password yang terdaftar.</p>
        
        {error && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginBottom: '0.75rem' }}>{error}</p>}

        <label htmlFor="u">Email</label>
        <input 
          id="u" 
          type="email"
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          placeholder="Masukkan email" 
          required 
        />

        <label htmlFor="p">Password</label>
        <input 
          id="p" 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          placeholder="Masukkan password" 
          required 
        />

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Memproses...' : 'Login'}
        </button>
      </form>
    </div>
  )
}