export default function Badge({ s }) {
  const cls = /Terv|Sele/.test(s) ? 'b-ok' : s === 'Ditolak' ? 'b-bad' : 'b-warn'
  return <span className={`badge ${cls}`}>{s}</span>
}
