import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Status() {
  const { T, me } = useApp()
  const mt = T.find(t => t.n === me)

  if (!mt) {
    return (
      <main className="view container"><div className="mt-24">
        <div className="card">
          <h2>Status Pendaftaran</h2>
          <p>Belum ada pendaftaran tim untuk akun ini. Silakan login atau daftarkan tim Anda terlebih dahulu.</p>
          <Link className="btn btn-primary mt-14" to="/pendaftaran">Daftar Sekarang</Link>
        </div>
      </div></main>
    )
  }

  const [cls, judul, pesan] = mt.s === 'Terverifikasi'
    ? ['ok', 'Terverifikasi', 'Tim Anda resmi terdaftar. Silakan cek jadwal pertandingan.']
    : mt.s === 'Ditolak'
      ? ['bad', 'Ditolak', 'Alasan penolakan: ' + mt.r]
      : ['warn', 'Menunggu Verifikasi', 'Panitia sedang memeriksa data dan bukti pembayaran Anda.']

  return (
    <main className="view container"><div className="mt-24">
      <div className="card">
        <h2>Status Pendaftaran Tim</h2>
        <p className="sub">{mt.n} — {mt.i}</p>
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
      </div>
    </div></main>
  )
}