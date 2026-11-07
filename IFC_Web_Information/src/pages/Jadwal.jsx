import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Badge from '../components/Badge'
import DataTable, { skor } from '../components/DataTable'

export default function Jadwal() {
  const { M } = useApp()
  const [filter, setFilter] = useState('Semua Status')
  const rows = M.filter(m => filter === 'Semua Status' || m.s === filter)
    .map(m => [m.d, m.t, `${m.a} vs ${m.b}`, m.l, skor(m), <Badge s={m.s} />])

  return (
    <main className="view container">
      <div className="card mt-24">
        <h2>Jadwal Pertandingan</h2>
        <p className="sub">Lihat jadwal lengkap pertandingan turnamen.</p>
        <select className="select-filter" value={filter} onChange={e => setFilter(e.target.value)}>
          <option>Semua Status</option><option>Selesai</option><option>Berlangsung</option><option>Akan Datang</option>
        </select>
        <DataTable head={['Tanggal', 'Waktu', 'Pertandingan', 'Lapangan', 'Skor', 'Status']} rows={rows} />
      </div>
    </main>
  )
}
