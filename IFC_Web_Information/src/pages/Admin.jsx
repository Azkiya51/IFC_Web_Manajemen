import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Badge from '../components/Badge'
import Bracket from '../components/Bracket'
import DataTable, { skor } from '../components/DataTable'
import { EVENT, rupiah } from '../data/eventInfo'

// [label sidebar, id panel]
const MENU = [
  ['Dashboard', 'dash'], ['Data Tim', 'tim'], ['Data Pemain', 'pem'], ['Verifikasi Pembayaran', 'ver'],
  ['Jadwal Pertandingan', 'mat'], ['Hasil Pertandingan', 'mat'], ['Bagan Turnamen', 'bag'],
  ['Klasemen', 'bag'], ['Laporan', 'lap'], ['Logout', 'out'],
]

export default function Admin() {
  const [idx, setIdx] = useState(0) // menu sidebar yang aktif
  const panel = MENU[idx][1]
  const pilih = i => (MENU[i][1] === 'out' ? (window.location.href = '/') : setIdx(i))

  return (
    <div className="admin">
      <aside className="side">
        <div className="logo">I<span>F</span>C<small>Admin Panel</small></div>
        {MENU.map(([label], i) => (
          <button key={i} className={i === idx ? 'on' : ''} onClick={() => pilih(i)}>{label}</button>
        ))}
      </aside>
      <div className="amain">
        {panel === 'dash' && <Dashboard />}
        {panel === 'tim' && <DataTim />}
        {panel === 'pem' && <DataPemain />}
        {panel === 'ver' && <Verifikasi />}
        {panel === 'mat' && <Pertandingan />}
        {panel === 'bag' && <div className="card"><h2>Bagan Turnamen dan Klasemen</h2><Bracket /></div>}
        {panel === 'lap' && <Laporan />}
      </div>
    </div>
  )
}

const hitung = (T, s) => T.filter(t => t.s === s).length

function Dashboard() {
  const { T, M } = useApp()
  const cards = [
    ['Tim Terdaftar', T.length], ['Menunggu Verifikasi', hitung(T, 'Menunggu')],
    ['Terverifikasi', hitung(T, 'Terverifikasi')], ['Total Pertandingan', M.length],
  ]
  return (
    <>
      <h2>Dashboard</h2>
      <p className="sub">Ringkasan informasi turnamen.</p>
      <div className="cards">
        {cards.map(([label, v]) => <div className="card" key={label}><span className="sub">{label}</span><b>{v}</b></div>)}
      </div>
      <div className="card"><h3>Tim Terdaftar</h3>
        <DataTable head={['Nama Tim', 'Status']} rows={T.map(t => [t.n, <Badge s={t.s} />])} />
      </div>
    </>
  )
}

function DataTim() {
  const { T, renameTeam, deleteTeam } = useApp()
  const detail = t => alert(`Tim: ${t.n}\nInstansi: ${t.i}\nKapten: ${t.k}\nPemain: ${t.c}\nStatus: ${t.s}`)
  const edit = k => {
    const v = prompt('Nama tim:', T[k].n)
    if (v && v.trim()) renameTeam(k, v.trim())
  }
  const hapus = k => { if (confirm('Hapus tim ' + T[k].n + '?')) deleteTeam(k) }
  return (
    <div className="card"><h2>Data Tim</h2>
      <DataTable head={['Nama Tim', 'Instansi', 'Kapten', 'Pemain', 'Status', 'Aksi']}
        rows={T.map((t, k) => [t.n, t.i, t.k, t.c, <Badge s={t.s} />,
          <>
            <button className="btn btn-light btn-sm" onClick={() => detail(t)}>Detail</button>{' '}
            <button className="btn btn-primary btn-sm" onClick={() => edit(k)}>Edit</button>{' '}
            <button className="btn btn-bad btn-sm" onClick={() => hapus(k)}>Hapus</button>
          </>])} />
    </div>
  )
}

function DataPemain() {
  const { P } = useApp()
  return <div className="card"><h2>Data Pemain</h2><DataTable head={['Nama', 'NISN', 'Tim']} rows={P} /></div>
}

function Verifikasi() {
  const { T, P, updateTeam } = useApp()
  const menunggu = T.map((t, k) => ({ t, k })).filter(x => x.t.s === 'Menunggu')
  const [pilih, setPilih] = useState('')
  const [alasan, setAlasan] = useState('')
  const aktif = menunggu.find(x => String(x.k) === pilih) || menunggu[0]

  const proses = ok => {
    if (!aktif) return
    if (!ok && !alasan.trim()) { alert('Alasan penolakan wajib diisi.'); return }
    updateTeam(aktif.k, { s: ok ? 'Terverifikasi' : 'Ditolak', r: ok ? '' : alasan.trim() })
    setAlasan(''); setPilih('')
  }

  return (
    <div className="card">
      <h2>Verifikasi Pembayaran</h2>
      <p className="sub">Periksa data tim, pemain, dan dokumen.</p>
      <label>Pilih tim (menunggu verifikasi)</label>
      <select value={aktif ? String(aktif.k) : ''} onChange={e => setPilih(e.target.value)}>
        {menunggu.map(x => <option key={x.k} value={x.k}>{x.t.n}</option>)}
      </select>
      {!aktif ? <p className="mt-14">Tidak ada pendaftaran yang menunggu verifikasi.</p> : (
        <>
          <h4>Data Tim</h4>
          <DataTable head={['Tim', 'Instansi', 'Kapten', 'Pemain']} rows={[[aktif.t.n, aktif.t.i, aktif.t.k, aktif.t.c]]} />
          <h4>Daftar Pemain</h4>
          <DataTable head={['Nama', 'NISN']} rows={P.filter(p => p[2] === aktif.t.n).map(p => [p[0], p[1]])} />
          <h4>Dokumen</h4>
          <div className="row">
            {['Foto Kartu Pelajar', 'Logo Tim', 'Bukti Pembayaran'].map(d => <div className="doc" key={d}>{d}</div>)}
          </div>
        </>
      )}
      <label>Alasan penolakan (wajib jika ditolak)</label>
      <textarea rows="3" value={alasan} onChange={e => setAlasan(e.target.value)} placeholder="Tuliskan alasan dan petunjuk perbaikan" />
      <div className="form-actions start">
        <button className="btn btn-ok" onClick={() => proses(true)}>Terima</button>
        <button className="btn btn-bad" onClick={() => proses(false)}>Tolak</button>
      </div>
    </div>
  )
}

function Pertandingan() {
  const { T, M, addMatch, editMatch, deleteMatch, updateMatch } = useApp()
  const [f, setF] = useState({ d: '', w: '', a: '', b: '' })
  const a = f.a || T[0]?.n, b = f.b || T[0]?.n
  const set = k => e => setF(x => ({ ...x, [k]: e.target.value }))

  const tambah = () => {
    if (!f.d || !f.w || a === b) { alert('Lengkapi tanggal, waktu, dan pilih dua tim yang berbeda.'); return }
    addMatch({ d: f.d, t: f.w, a, b, l: '1', x: 0, y: 0, s: 'Akan Datang' }) // semua di Lapangan 1
    setF({ d: '', w: '', a: '', b: '' })
  }
  const edit = k => {
    const d = prompt('Tanggal (YYYY-MM-DD):', M[k].d)
    const w = d && prompt('Waktu (HH:MM):', M[k].t)
    if (d && w) editMatch(k, { d, t: w })
  }

  return (
    <div className="card">
      <h2>Manajemen Pertandingan</h2>
      <p className="sub">Tambah, ubah, hapus jadwal, dan perbarui skor.</p>
      <div className="row">
        <div><label>Tanggal</label><input type="date" value={f.d} onChange={set('d')} /></div>
        <div><label>Waktu</label><input type="time" value={f.w} onChange={set('w')} /></div>
        <div><label>Tim A</label><select value={a} onChange={set('a')}>{T.map(t => <option key={t.n}>{t.n}</option>)}</select></div>
        <div><label>Tim B</label><select value={b} onChange={set('b')}>{T.map(t => <option key={t.n}>{t.n}</option>)}</select></div>
        <div><label>Lapangan</label><select><option value="1">Lapangan 1</option></select></div>
        <button className="btn btn-primary" onClick={tambah}>Tambah</button>
      </div>
      <div className="mt-18">
        <DataTable head={['Tanggal', 'Waktu', 'Pertandingan', 'Skor', 'Status', 'Aksi']}
          rows={M.map((m, k) => [m.d, m.t, `${m.a} vs ${m.b} (Lap. 1)`,
            <>
              <input className="input-skor" type="number" min="0" value={m.x} onChange={e => updateMatch(k, 'x', e.target.value)} />
              {' - '}
              <input className="input-skor" type="number" min="0" value={m.y} onChange={e => updateMatch(k, 'y', e.target.value)} />
            </>,
            <select value={m.s} onChange={e => updateMatch(k, 's', e.target.value)}>
              {['Akan Datang', 'Berlangsung', 'Selesai'].map(x => <option key={x}>{x}</option>)}
            </select>,
            <>
              <button className="btn btn-light btn-sm" onClick={() => edit(k)}>Edit</button>{' '}
              <button className="btn btn-bad btn-sm" onClick={() => deleteMatch(k)}>Hapus</button>
            </>])} />
      </div>
    </div>
  )
}

function Laporan() {
  const { T, M } = useApp()
  const ok = hitung(T, 'Terverifikasi')
  const gol = M.reduce((a, m) => a + (m.s === 'Akan Datang' ? 0 : m.x + m.y), 0)
  return (
    <div className="card"><h2>Laporan</h2>
      <h4>Rekap Pendaftaran</h4>
      <DataTable head={['Status', 'Jumlah']} rows={[['Terverifikasi', ok], ['Menunggu', hitung(T, 'Menunggu')], ['Ditolak', hitung(T, 'Ditolak')], ['Total', T.length]]} />
      <h4>Rekap Pembayaran</h4>
      <p>Pembayaran diterima: {ok} tim × {rupiah(EVENT.biaya.pendaftaran)} = <b>{rupiah(ok * EVENT.biaya.pendaftaran)}</b></p>
      <h4>Hasil Turnamen</h4>
      <DataTable head={['Pertandingan', 'Skor']} rows={M.filter(m => m.s === 'Selesai').map(m => [`${m.a} vs ${m.b}`, skor(m)])} />
      <p className="my-10">Total gol: <b>{gol}</b></p>
      <button className="btn btn-primary" onClick={() => window.print()}>Cetak Laporan</button>
    </div>
  )
}
