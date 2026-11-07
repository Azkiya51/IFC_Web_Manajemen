import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Informasi from './pages/Informasi'
import Jadwal from './pages/Jadwal'
import LiveScore from './pages/LiveScore'
import BracketPage from './pages/BracketPage'
import Pendaftaran from './pages/Pendaftaran'
import Status from './pages/Status'
import Admin from './pages/Admin'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/informasi" element={<Informasi />} />
        <Route path="/jadwal" element={<Jadwal />} />
        <Route path="/live-score" element={<LiveScore />} />
        <Route path="/bracket" element={<BracketPage />} />
        <Route path="/pendaftaran" element={<Pendaftaran />} />
        <Route path="/status" element={<Status />} />
        <Route path="/admin" element={<Admin />} />
      </Route>
    </Routes>
  )
}
