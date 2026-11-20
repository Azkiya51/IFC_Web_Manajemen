import DataTable from './DataTable'

// Bagan sesuai Guide Book IFC 2026: 24 tim, 6 grup (A–F), 12 tim lolos ke Perdelapan Final.
// [kode laga, tim 1, tim 2]
const ROUNDS = [
  ['Perdelapan Final', [
    ['OF1', 'Juara Grup C', 'Runner Up Grup D'],
    ['OF2', 'Juara Grup D', 'Runner Up Grup B'],
    ['OF3', 'Juara Grup A', 'Runner Up Grup C'],
    ['OF4', 'Juara Grup B', 'Runner Up Grup A'],
  ]],
  ['Perempat Final', [
    ['QF1', 'Pemenang OF1', 'Juara Grup E'],
    ['QF2', 'Pemenang OF2', 'Runner Up Grup E'],
    ['QF3', 'Pemenang OF3', 'Runner Up Grup F'],
    ['QF4', 'Pemenang OF4', 'Juara Grup F'],
  ]],
  ['Semifinal', [
    ['SF1', 'Pemenang QF1', 'Pemenang QF2'],
    ['SF2', 'Pemenang QF3', 'Pemenang QF4'],
  ]],
  ['Final', [
    ['Final', 'Pemenang SF1', 'Pemenang SF2'],
    ['Juara 3', 'Kalah SF1', 'Kalah SF2'],
  ]],
]

// Klasemen per grup (placeholder: Tim 1–24). Nanti dihitung dari hasil pertandingan.
const GRUP = 'ABCDEF'.split('').map((g, gi) => ({
  nama: g,
  tim: [0, 1, 2, 3].map(k => `Tim ${gi * 4 + k + 1}`),
}))

export default function Bracket() {
  return (
    <>
      <div className="bracket">
        {ROUNDS.map(([label, matches]) => (
          <div key={label}>
            {matches.map(([kode, a, b]) => (
              <div className="bm" key={kode}>
                <small>{kode}</small>
                <p><span>{a}</span><b>{''}</b></p>
                <p><span>{b}</span><b>{''}</b></p>
              </div>
            ))}
            <small className="bracket-label">{label}</small>
          </div>
        ))}
      </div>

      <h3 className="title-klasemen">Klasemen Babak Grup</h3>
      <div className="grup-grid">
        {GRUP.map(g => (
          <div key={g.nama}>
            <h4>Grup {g.nama}</h4>
            <DataTable head={['#', 'Tim', 'Main', 'M', 'S', 'K', 'Poin']}
              rows={g.tim.map((t, k) => [k + 1, t, 0, 0, 0, 0, 0])} />
          </div>
        ))}
      </div>
    </>
  )
}
