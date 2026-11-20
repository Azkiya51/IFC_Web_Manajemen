import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import LoginModal from './LoginModal'

export default function Layout() {
  const [login, setLogin] = useState(false)
  return (
    <div className="app">
      <Navbar onLogin={() => setLogin(true)} />
      <Outlet />
      <Footer />
      <LoginModal open={login} onClose={() => setLogin(false)} />
    </div>
  )
}
