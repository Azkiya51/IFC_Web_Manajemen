import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { EVENT, rupiah } from '../data/eventInfo'

const pad = n => String(n).padStart(2, '0')

export default function Home() {
  const { M } = useApp()
  const kickOff = new Date(EVENT.kickOff).getTime()
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const x = Math.max(0, kickOff - now)
  const timer = [
    [Math.floor(x / 864e5), 'Hari'],
    [Math.floor((x % 864e5) / 36e5), 'Jam'],
    [Math.floor((x % 36e5) / 6e4), 'Menit'],
    [Math.floor((x % 6e4) / 1e3), 'Detik'],
  ]
  const last = M.filter(m => m.s === 'Selesai').at(-1)

  return (
    <div className="view">
      <section className="hero">
        <div className="container">
          <h1>{EVENT.nama}</h1>
          <p>{EVENT.tema}. Turnamen futsal untuk pelajar SMA/SMK/MA se-Bandung Raya.</p>
          <div className="actions">
            <Link className="btn btn-primary" to="/pendaftaran">Daftar Sekarang</Link>
            <Link className="btn btn-outline" to="/informasi">Lihat Informasi</Link>
          </div>
          <div className="countdown">
            <h4>Menuju Kick Off</h4>
            <div className="timer">
              {timer.map(([v, label]) => <div key={label}><b>{pad(v)}</b><span>{label}</span></div>)}
            </div>
          </div>
        </div>
      </section>

      <main className="container">
        <div className="stats">
          <div className="stat"><b>24</b><span>Total Tim</span></div>
          <div className="stat"><b>6 Grup</b><span>Babak Penyisihan + Gugur</span></div>
          <div className="stat"><b>{rupiah(EVENT.totalHadiah)}</b><span>Total Hadiah</span></div>
        </div>
        <div className="section-title">
          <h3>Pertandingan Terbaru</h3>
          <Link to="/live-score">Lihat Semua</Link>
        </div>
        <div className="card match">
          {last ? (
            <>
              <div><b>{last.a}</b></div>
              <div>
                <span className="score">{last.x} - {last.y}</span>
                <small>Lapangan {last.l} · {last.d}, {last.t}</small>
              </div>
              <div><b>{last.b}</b></div>
            </>
          ) : <p>Belum ada pertandingan selesai.</p>}
        </div>
      </main>
    </div>
  )
}
