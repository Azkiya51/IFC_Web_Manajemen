import { EVENT, rupiah } from '../data/eventInfo'
import DataTable from '../components/DataTable'

const List = ({ items }) => <ul>{items.map(i => <li key={i}>{i}</li>)}</ul>

// Ringkasan Guide Book IFC 2026
export default function Informasi() {
  const { biaya: b, rekening: r, tim } = EVENT
  return (
    <main className="view container info-page">
      <div className="card mt-24">
        <h2>{EVENT.nama}</h2>
        <p className="tema">{EVENT.tema}</p>
        <p>Kompetisi futsal antar pelajar yang diselenggarakan oleh {EVENT.penyelenggara}. Peserta: {EVENT.peserta}.</p>
      </div>

      <div className="card">
        <h3>Timeline Kegiatan</h3>
        <DataTable head={['Kegiatan', 'Tanggal', 'Tempat']} rows={EVENT.timeline} />
      </div>

      <div className="info-grid">
        <div className="card">
          <h3>Pendaftaran & Biaya</h3>
          <p>Biaya pendaftaran: <b>{rupiah(b.pendaftaran)} / tim</b></p>
          <p>Boleh dibayar setengahnya ({rupiah(b.cicilanAwal)}) dahulu, lunas sebelum Technical Meeting.</p>
          <p>Uang jaminan: <b>{rupiah(b.jaminan)} / tim</b> (dibayar saat Technical Meeting, dikembalikan jika tim hadir dan tidak WO/melanggar).</p>
          <p>Transfer: <b>{r.bank} · {r.no}</b> a.n. {r.an}</p>
          <h4>Susunan Tim</h4>
          <List items={[`${tim.pemain} pemain (${tim.inti} inti + ${tim.cadangan} cadangan)`, `Maksimal ${tim.official} official`, `Total maksimal ${tim.total} orang per tim`]} />
        </div>

        <div className="card">
          <h3>Hadiah — Total {rupiah(EVENT.totalHadiah)}</h3>
          <DataTable head={['Kategori', 'Hadiah']} rows={EVENT.hadiah} />
        </div>

        <div className="card">
          <h3>Persyaratan Peserta</h3>
          <List items={EVENT.persyaratan} />
          <h4>Fasilitas Peserta</h4>
          <List items={EVENT.fasilitas} />
        </div>

        <div className="card">
          <h3>Contact Person</h3>
          {EVENT.kontak.map(([n, hp]) => <p key={n}><b>{n}</b><br />{hp}</p>)}
          <p>HTM Supporter: <b>{EVENT.htmSupporter}</b></p>
        </div>
      </div>

      <div className="card">
        <h3>Format & Sistem Pertandingan</h3>
        <h4>Babak Penyisihan</h4><List items={EVENT.format.penyisihan} />
        <h4>Babak Gugur</h4>
        <List items={['Perdelapan Final (12 → 8 tim)', 'Perempat Final (8 → 4 tim)', 'Semifinal (4 → 2 tim) dan Final, plus perebutan Juara 3']} />
        <h4>Waktu Pertandingan</h4><List items={EVENT.format.waktu} />
        <h4>Jika Imbang</h4><List items={EVENT.format.imbang} />
        <h4>Penentuan Peringkat Grup (berurutan)</h4>
        <ol className="info">{EVENT.format.peringkat.map(i => <li key={i}>{i}</li>)}</ol>
      </div>

      <div className="info-grid">
        <div className="card">
          <h3>Kartu & Denda</h3>
          <List items={EVENT.aturan.kartu} />
          <DataTable head={['Pelanggaran', 'Denda']} rows={[
            ['Kartu kuning', rupiah(b.denda.kuning)],
            ['2 kartu kuning dalam 1 laga', rupiah(b.denda.duaKuning)],
            ['Kartu merah langsung', rupiah(b.denda.merah)],
          ]} />
          <p>Denda dipotong dari uang jaminan; kelebihan wajib dilunasi sebelum laga berikutnya.</p>
        </div>
        <div className="card"><h3>Walk Out (WO)</h3><List items={EVENT.aturan.wo} /></div>
        <div className="card"><h3>Jersey & Perlengkapan</h3><List items={EVENT.aturan.jersey} /></div>
        <div className="card"><h3>Peraturan Supporter</h3><List items={EVENT.aturan.supporter} /></div>
      </div>
    </main>
  )
}
