// head: ["Kolom1", ...]  rows: [[sel, sel, ...], ...]  (sel boleh teks atau JSX)
export default function DataTable({ head, rows }) {
  return (
    <div className="scroll">
      <table>
        <thead><tr>{head.map(h => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  )
}

export const skor = m => (m.s === 'Akan Datang' ? '-' : `${m.x} - ${m.y}`)
