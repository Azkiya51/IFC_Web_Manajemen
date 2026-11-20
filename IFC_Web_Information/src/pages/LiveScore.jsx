import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import DataTable, { skor } from '../components/DataTable'

export default function LiveScore() {
  const { M } = useApp()
  const [sec, setSec] = useState(2700) // jam pertandingan demo (detik)
  useEffect(() => {
    const id = setInterval(() => setSec(s => s + 1), 1000)
    return () => clearInterval(id)
  }, [])
  const clock = `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`
  const live = M.find(m => m.s === 'Berlangsung')

  return (
    <main className="view container">
      <div className="mt-24">
        <div className="card">
          <h2>Live Score</h2>
          <p className="sub">Hanya satu pertandingan berlangsung di Lapangan 1.</p>
          {live ? (
            <div className="live">
              <small>Lapangan 1</small>
              <span className="badge">LIVE {clock}</span>
              <div className="match"><b>{live.a}</b><span className="score">{live.x} - {live.y}</span><b>{live.b}</b></div>
            </div>
          ) : <p>Tidak ada pertandingan yang sedang berlangsung.</p>}
          <h3 className="title-hasil">Hasil Pertandingan</h3>
          <DataTable head={['Pertandingan', 'Skor']} rows={M.filter(m => m.s === 'Selesai').map(m => [`${m.a} vs ${m.b}`, skor(m)])} />
        </div>
      </div>
    </main>
  )
}
