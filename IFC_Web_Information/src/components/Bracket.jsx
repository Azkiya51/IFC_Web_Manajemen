import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import DataTable from './DataTable'

const GRUP_LIST = ['A', 'B', 'C', 'D']

const ROUND_DEFS = [
  ['Perempat Final', ['QF1', 'QF2', 'QF3', 'QF4']],
  ['Semifinal', ['SF1', 'SF2']],
  ['Final', ['Final', 'Juara 3']],
]

const ALL_CODES = ['QF1', 'QF2', 'QF3', 'QF4', 'SF1', 'SF2', 'Final', 'Juara 3']

export default function Bracket({ isAdmin = false }) {
  const { T, M, B, updateTeamGroup, autoAssignGroups, saveBracketSlot } = useApp()

  // 1. Hitung Klasemen Babak Grup (A–D) otomatis dari hasil pertandingan 'Grup' yang 'Selesai'
  const klasemen = useMemo(() => {
    const hasil = {}
    GRUP_LIST.forEach(g => {
      const timGrup = T.filter(t => (t.grup || '').toUpperCase() === g)
      const map = {}
      timGrup.forEach(t => {
        map[t.n] = { nama: t.n, main: 0, m: 0, s: 0, k: 0, gm: 0, gk: 0, poin: 0 }
      })

      M.forEach(m => {
        if (m.s !== 'Selesai') return
        if ((m.babak || 'Grup') !== 'Grup') return
        const ta = map[m.a]
        const tb = map[m.b]
        if (!ta || !tb) return

        const sa = Number(m.x) || 0
        const sb = Number(m.y) || 0
        ta.main += 1
        tb.main += 1
        ta.gm += sa
        ta.gk += sb
        tb.gm += sb
        tb.gk += sa

        if (sa > sb) {
          ta.m += 1
          ta.poin += 3
          tb.k += 1
        } else if (sa < sb) {
          tb.m += 1
          tb.poin += 3
          ta.k += 1
        } else {
          ta.s += 1
          ta.poin += 1
          tb.s += 1
          tb.poin += 1
        }
      })

      hasil[g] = Object.values(map).sort(
        (a, b) =>
          b.poin - a.poin ||
          (b.gm - b.gk) - (a.gm - a.gk) ||
          b.gm - a.gm ||
          a.nama.localeCompare(b.nama)
      )
    })
    return hasil
  }, [T, M])

  // 2. Resolusi Bagan Fase Gugur (8 tim lolos: Juara & Runner Up Grup A–D)
  const resolved = useMemo(() => {
    const juara = g => klasemen[g]?.[0]?.nama || `Juara Grup ${g}`
    const runnerUp = g => klasemen[g]?.[1]?.nama || `Runner Up Grup ${g}`

    const res = {}
    const pemenang = kode => {
      const item = res[kode]
      if (!item || item.skorA === '' || item.skorB === '') return `Pemenang ${kode}`
      if (Number(item.skorA) > Number(item.skorB)) return item.timA
      if (Number(item.skorB) > Number(item.skorA)) return item.timB
      return `Pemenang ${kode}`
    }
    const kalah = kode => {
      const item = res[kode]
      if (!item || item.skorA === '' || item.skorB === '') return `Kalah ${kode}`
      if (Number(item.skorA) > Number(item.skorB)) return item.timB
      if (Number(item.skorB) > Number(item.skorA)) return item.timA
      return `Kalah ${kode}`
    }

    const defaults = {
      QF1: () => [juara('A'), runnerUp('B')],
      QF2: () => [juara('C'), runnerUp('D')],
      QF3: () => [juara('B'), runnerUp('A')],
      QF4: () => [juara('D'), runnerUp('C')],
      SF1: () => [pemenang('QF1'), pemenang('QF2')],
      SF2: () => [pemenang('QF3'), pemenang('QF4')],
      Final: () => [pemenang('SF1'), pemenang('SF2')],
      'Juara 3': () => [kalah('SF1'), kalah('SF2')],
    }

    ALL_CODES.forEach(kode => {
      const [defA, defB] = defaults[kode]()
      const slot = B[kode] || {}
      const matchM = M.find(m => m.babak === kode)

      const timA = slot.tim_a || matchM?.a || defA
      const timB = slot.tim_b || matchM?.b || defB

      let skorA = ''
      let skorB = ''
      if (slot.skor_a !== null && slot.skor_a !== undefined) {
        skorA = slot.skor_a
      } else if (matchM && matchM.s !== 'Akan Datang') {
        skorA = matchM.x
      }

      if (slot.skor_b !== null && slot.skor_b !== undefined) {
        skorB = slot.skor_b
      } else if (matchM && matchM.s !== 'Akan Datang') {
        skorB = matchM.y
      }

      res[kode] = { kode, timA, timB, skorA, skorB }
    })

    return res
  }, [klasemen, B, M])

  const [kodeEdit, setKodeEdit] = useState('QF1')
  const [formSlot, setFormSlot] = useState({ tim_a: '', tim_b: '', skor_a: '', skor_b: '' })

  const pilihKode = k => {
    setKodeEdit(k)
    const s = B[k] || {}
    setFormSlot({
      tim_a: s.tim_a || '',
      tim_b: s.tim_b || '',
      skor_a: s.skor_a ?? '',
      skor_b: s.skor_b ?? '',
    })
  }

  const simpanSlot = async e => {
    e.preventDefault()
    await saveBracketSlot(kodeEdit, formSlot)
    alert(`Slot ${kodeEdit} berhasil diperbarui.`)
  }

  const resetSlot = async () => {
    setFormSlot({ tim_a: '', tim_b: '', skor_a: '', skor_b: '' })
    await saveBracketSlot(kodeEdit, { tim_a: '', tim_b: '', skor_a: null, skor_b: null })
  }

  const verifiedTeams = T.filter(t => t.s === 'Terverifikasi')

  return (
    <>
      {isAdmin && (
        <div className="card" style={{ marginBottom: 20, background: '#f8fafc' }}>
          <h3>Pengaturan Bagan Fase Gugur</h3>
          <p className="sub">Biarkan tim kosong untuk mengikuti hasil klasemen/babak sebelumnya secara otomatis, atau pilih manual.</p>
          <form onSubmit={simpanSlot} className="row">
            <div>
              <label>Kode Laga</label>
              <select value={kodeEdit} onChange={e => pilihKode(e.target.value)}>
                {ALL_CODES.map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div>
              <label>Tim 1 (Opsional Manual)</label>
              <select value={formSlot.tim_a} onChange={e => setFormSlot(s => ({ ...s, tim_a: e.target.value }))}>
                <option value="">-- Otomatis ({resolved[kodeEdit]?.timA}) --</option>
                {T.map(t => <option key={t.id || t.n} value={t.n}>{t.n}</option>)}
              </select>
            </div>
            <div>
              <label>Skor 1</label>
              <input
                className="input-skor"
                type="number"
                min="0"
                placeholder="-"
                value={formSlot.skor_a}
                onChange={e => setFormSlot(s => ({ ...s, skor_a: e.target.value }))}
              />
            </div>
            <div>
              <label>Tim 2 (Opsional Manual)</label>
              <select value={formSlot.tim_b} onChange={e => setFormSlot(s => ({ ...s, tim_b: e.target.value }))}>
                <option value="">-- Otomatis ({resolved[kodeEdit]?.timB}) --</option>
                {T.map(t => <option key={t.id || t.n} value={t.n}>{t.n}</option>)}
              </select>
            </div>
            <div>
              <label>Skor 2</label>
              <input
                className="input-skor"
                type="number"
                min="0"
                placeholder="-"
                value={formSlot.skor_b}
                onChange={e => setFormSlot(s => ({ ...s, skor_b: e.target.value }))}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">Simpan Bagan</button>
            <button type="button" className="btn btn-light btn-sm" onClick={resetSlot}>Reset Otomatis</button>
          </form>
        </div>
      )}

      <div className="bracket">
        {ROUND_DEFS.map(([label, codes]) => (
          <div key={label}>
            {codes.map(kode => {
              const item = resolved[kode]
              return (
                <div className="bm" key={kode}>
                  <small>{kode}</small>
                  <p><span>{item.timA}</span><b>{item.skorA}</b></p>
                  <p><span>{item.timB}</span><b>{item.skorB}</b></p>
                </div>
              )
            })}
            <small className="bracket-label">{label}</small>
          </div>
        ))}
      </div>

      {isAdmin && (
        <div className="card" style={{ marginTop: 24, background: '#f8fafc' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h3>Pembagian Grup Tim (Grup A–D)</h3>
              <p className="sub">Atur penempatan grup untuk setiap tim. Klasemen di bawah otomatis menghitung skor dari menu Pertandingan.</p>
            </div>
            <button type="button" className="btn btn-primary btn-sm" onClick={autoAssignGroups}>
              Bagi Grup Otomatis ({verifiedTeams.length} Tim Terverifikasi)
            </button>
          </div>
          <div className="mt-14">
            <DataTable
              head={['Nama Tim', 'Instansi', 'Status', 'Grup']}
              rows={T.map(t => [
                t.n,
                t.i,
                t.s,
                <select
                  value={GRUP_LIST.includes((t.grup || '').toUpperCase()) ? (t.grup || '').toUpperCase() : ''}
                  onChange={e => updateTeamGroup(t.id, e.target.value)}
                >
                  <option value="">-- Belum Masuk Grup --</option>
                  {GRUP_LIST.map(g => (
                    <option key={g} value={g}>Grup {g}</option>
                  ))}
                </select>,
              ])}
            />
          </div>
        </div>
      )}

      <h3 className="title-klasemen">Klasemen Babak Grup</h3>
      <div className="grup-grid">
        {GRUP_LIST.map(g => {
          const rows = klasemen[g] || []
          return (
            <div key={g}>
              <h4>Grup {g}</h4>
              <DataTable
                head={['#', 'Tim', 'Main', 'M', 'S', 'K', 'Poin']}
                rows={
                  rows.length > 0
                    ? rows.map((r, k) => [k + 1, r.nama, r.main, r.m, r.s, r.k, r.poin])
                    : [['-', 'Belum ada tim', 0, 0, 0, 0, 0]]
                }
              />
            </div>
          )
        })}
      </div>
    </>
  )
}