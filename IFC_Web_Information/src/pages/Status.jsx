import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Status() {
  const { T, me, updateTeam } = useApp()
  const k = T.findIndex(t => t.n === me)
  const mt = T[k]

  if (!mt) {
    return (
      <main className="view container"><div className="mt-24">
        <div className="card"><h2>Status Pendaftaran</h2><p>Belum ada pendaftaran tim.</p></div>
      </div></main>
    )
  }

  const [cls, judul, pesan] = mt.s === 'Terverifikasi'
    ? ['ok', 'Terverifikasi', 'Tim Anda resmi terdaftar. Silakan cek jadwal pertandingan.']
    : mt.s === 'Ditolak'
      ? ['bad', 'Ditolak', 'Alasan penolakan: ' + mt.r]
      : ['warn', 'Menunggu Verifikasi', 'Panitia sedang memeriksa data dan bukti pembayaran Anda.']

  // simulasi status (demo)
  const sim = v => updateTeam(k, { s: v, r: v === 'Ditolak' ? 'Bukti pembayaran tidak terbaca. Silakan unggah ulang.' : '' })

  return (
    <main className="view container"><div className="mt-24">
      <div className="card">
        <h2>Status Pendaftaran Tim</h2>
        <p className="sub">{mt.n}</p>
        <div className={`box ${cls}`}><b>{judul}</b><p>{pesan}</p></div>
        {mt.s === 'Ditolak' && (
          <>
            <h4>Petunjuk Perbaikan</h4>
            <ol className="info">
              <li>Periksa alasan penolakan di atas.</li>
              <li>Perbaiki data atau unggah ulang dokumen yang bermasalah.</li>
              <li>Kirim ulang pendaftaran sebelum batas waktu.</li>
            </ol>
            <Link className="btn btn-primary" to="/pendaftaran">Perbaiki Pendaftaran</Link>
          </>
        )}
        <label>Simulasi status (demo)</label>
        <select className="select-status" value={mt.s} onChange={e => sim(e.target.value)}>
          {['Menunggu', 'Terverifikasi', 'Ditolak'].map(x => <option key={x}>{x}</option>)}
        </select>
      </div>
    </div></main>
  )
}
