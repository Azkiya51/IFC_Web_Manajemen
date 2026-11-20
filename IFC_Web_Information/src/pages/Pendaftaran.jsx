import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import DataTable from '../components/DataTable'
import { EVENT, rupiah } from '../data/eventInfo'

const STEPS = ['Data Tim', 'Data Pemain', 'Dokumen', 'Konfirmasi']
const MAX_SIZE = 2097152 // 2MB

export default function Pendaftaran() {
  const { addTeam } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ tn: '', kp: '', pt: '', ins: '', wa: '', em: '' })
  const [pls, setPls] = useState([['', ''], ['', ''], ['', ''], ['', ''], ['', '']])
  const [files, setFiles] = useState({ 1: [], 2: [], 3: [] }) // tiap item: {name, url, img, ok}
  const [agree, setAgree] = useState(false)
  const [errors, setErrors] = useState([])

  const setF = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const setPlayer = (i, j, v) => setPls(p => p.map((r, x) => (x === i ? r.map((c, y) => (y === j ? v : c)) : r)))
  const okCount = k => files[k].filter(f => f.ok).length

  const onFiles = k => e => {
    const list = [...e.target.files].map(f => ({
      name: f.name, img: f.type.startsWith('image/'), ok: f.size <= MAX_SIZE,
      url: f.type.startsWith('image/') ? URL.createObjectURL(f) : '',
    }))
    setFiles(s => ({ ...s, [k]: list }))
  }

  function validate(s) {
    const e = []
    const v = k => form[k].trim()
    if (s === 0) {
      if (!v('tn')) e.push('Nama tim wajib diisi.')
      if (!v('kp')) e.push('Nama kapten wajib diisi.')
      if (!v('ins')) e.push('Asal sekolah wajib diisi.')
      if (!/^(\+62|62|0)8\d{7,12}$/.test(v('wa'))) e.push('Nomor WhatsApp tidak valid.')
      if (!/^\S+@\S+\.\S+$/.test(v('em'))) e.push('Format email tidak valid.')
    }
    if (s === 1 && (pls.length < 5 || pls.length > EVENT.tim.pemain || pls.some(p => !p[0].trim() || !/^\d{10}$/.test(p[1].trim())))) {
      e.push(`Minimal 5 dan maksimal ${EVENT.tim.pemain} pemain, dengan nama dan NISN (10 digit) terisi lengkap.`)
    }
    if (s === 2) {
      if (!okCount(1)) e.push('Foto kartu pelajar wajib diunggah.')
      if (!okCount(3)) e.push('Bukti pembayaran wajib diunggah.')
    }
    if (s === 3 && !agree) e.push('Anda harus menyetujui peraturan terlebih dahulu.')
    setErrors(e)
    return !e.length
  }

  const next = () => {
    if (!validate(step)) return
    if (step < 3) { setErrors([]); return setStep(step + 1) }
    // submit
    addTeam({ n: form.tn.trim(), i: form.ins, k: form.kp.trim(), c: pls.length, s: 'Menunggu' }, pls)
    navigate('/status')
  }
  const prev = () => { setErrors([]); setStep(Math.max(0, step - 1)) }

  const upload = ({ k, label, hint, multiple, accept }) => (
    <>
      <label>{label}</label>
      <label className="upload">{hint}
        <input type="file" accept={accept} multiple={multiple} hidden onChange={onFiles(k)} />
      </label>
      <div className="thumbs">
        {files[k].map((f, i) => !f.ok
          ? <span key={i} className="too-big">{f.name} (melebihi 2MB)</span>
          : f.img ? <img key={i} src={f.url} title={f.name} alt={f.name} /> : <span key={i}>{f.name}</span>)}
      </div>
    </>
  )

  return (
    <main className="view container layout">
      <div className="card">
        <h2>Pendaftaran Tim</h2>
        <p className="sub">Isi form berikut untuk mendaftarkan tim Anda di IFC 2026.</p>

        <div className="stepper">
          {STEPS.map((s, k) => (
            <div key={s} data-n={k + 1} className={`step ${k === step ? 'active' : ''} ${k < step ? 'done' : ''}`}>{s}</div>
          ))}
        </div>

        <div className={`panel ${step === 0 ? 'show' : ''}`}>
          <h3>1. Data Tim</h3>
          <label>Nama Tim *</label>
          <input value={form.tn} onChange={setF('tn')} placeholder="Masukkan nama tim" />
          <label>Nama Lengkap Kapten *</label>
          <input value={form.kp} onChange={setF('kp')} placeholder="Masukkan nama lengkap kapten" />
          <label>Nama Pelatih</label>
          <input value={form.pt} onChange={setF('pt')} placeholder="Masukkan nama pelatih" />
          <label>Asal Sekolah (SMA/SMK/MA) *</label>
          <input value={form.ins} onChange={setF('ins')} placeholder="Contoh: SMAN 1 Bandung" />
          <label>Nomor WhatsApp *</label>
          <input value={form.wa} onChange={setF('wa')} placeholder="08xxxxxxxxxx" />
          <label>Email *</label>
          <input type="email" value={form.em} onChange={setF('em')} placeholder="nama@email.com" />
        </div>

        <div className={`panel ${step === 1 ? 'show' : ''}`}>
          <h3>2. Data Pemain</h3>
          <p className="sub">Minimal 5 pemain inti, maksimal {EVENT.tim.pemain} pemain ({EVENT.tim.inti} inti + {EVENT.tim.cadangan} cadangan).</p>
          <div className="scroll">
            <table>
              <thead><tr><th>No</th><th>Nama Pemain</th><th>NISN</th><th>Aksi</th></tr></thead>
              <tbody>
                {pls.map((p, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td><input value={p[0]} onChange={e => setPlayer(i, 0, e.target.value)} placeholder="Nama pemain" /></td>
                    <td><input value={p[1]} onChange={e => setPlayer(i, 1, e.target.value)} placeholder="NISN (10 digit)" /></td>
                    <td><button className="btn btn-light btn-sm" onClick={() => setPls(x => x.filter((_, j) => j !== i))}>Hapus</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="btn btn-primary btn-sm mt-14" disabled={pls.length >= EVENT.tim.pemain} onClick={() => setPls(x => [...x, ['', '']])}>+ Tambah Pemain</button>
        </div>

        <div className={`panel ${step === 2 ? 'show' : ''}`}>
          <h3>3. Dokumen</h3>
          {upload({ k: 1, label: 'Foto Kartu Pelajar Semua Pemain *', hint: 'Klik untuk mengunggah (JPG/PNG, maks. 2MB per file)', accept: 'image/*', multiple: true })}
          {upload({ k: 2, label: 'Logo Tim (opsional)', hint: 'Klik untuk mengunggah logo', accept: 'image/*' })}
          {upload({ k: 3, label: 'Bukti Pembayaran *', hint: 'Klik untuk mengunggah bukti pembayaran', accept: 'image/*,.pdf' })}
        </div>

        <div className={`panel ${step === 3 ? 'show' : ''}`}>
          <h3>4. Konfirmasi</h3>
          <DataTable head={['Data', 'Isian']} rows={[
            ['Nama Tim', form.tn], ['Kapten', form.kp], ['Instansi', form.ins], ['WhatsApp', form.wa],
            ['Email', form.em], ['Jumlah Pemain', pls.length],
            ['Dokumen', `${okCount(1)} kartu pelajar, ${okCount(3)} bukti pembayaran`],
          ]} />
          <label className="check">
            <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
            Saya menyatakan bahwa data yang saya isi adalah benar dan menyetujui semua peraturan yang berlaku di IFC 2026.
          </label>
        </div>

        <div className="err">{errors.map((m, i) => <div key={i}>{m}</div>)}</div>
        <div className="form-actions">
          <button className="btn btn-light" onClick={prev}>Sebelumnya</button>
          <button className="btn btn-primary" onClick={next}>{step === 3 ? 'Submit Pendaftaran' : 'Selanjutnya →'}</button>
        </div>
      </div>

      <aside className="card info">
        <h3>Informasi Pendaftaran</h3><br />
        <p><b>Batas Pendaftaran</b><br />{EVENT.batasDaftar}</p>
        <p><b>Biaya Pendaftaran</b><br />{rupiah(EVENT.biaya.pendaftaran)} / tim<br />
          <small>Boleh bayar {rupiah(EVENT.biaya.cicilanAwal)} dulu, lunas sebelum Technical Meeting.</small></p>
        <p><b>Uang Jaminan</b><br />{rupiah(EVENT.biaya.jaminan)} / tim (dibayar saat Technical Meeting)</p>
        <p><b>Lokasi Pertandingan</b><br />{EVENT.lokasi}</p>
        <h4>Persyaratan</h4>
        <ul>{EVENT.persyaratan.map(x => <li key={x}>{x}</li>)}</ul>
        <h4>Petunjuk Pembayaran</h4>
        <ol>
          <li>Transfer ke {EVENT.rekening.bank} {EVENT.rekening.no} a.n. {EVENT.rekening.an}.</li>
          <li>Unggah bukti pembayaran pada langkah ketiga.</li>
        </ol>
        <h4>Contact Person</h4>
        {EVENT.kontak.map(([n, hp]) => <p key={n}>{n}<br />{hp}</p>)}
      </aside>
    </main>
  )
}
