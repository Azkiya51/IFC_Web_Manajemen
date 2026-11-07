// Informasi resmi kompetisi — bersumber dari Guide Book IFC 2026.
// Kalau ada perubahan (tanggal, biaya, hadiah), cukup ubah di file ini.

export const rupiah = n => 'Rp ' + n.toLocaleString('id-ID')

export const EVENT = {
  nama: 'Informatics Futsal Competition 2026',
  singkat: 'IFC 2026',
  tema: 'Berkompetisi dengan Kreativitas, Tumbuh dengan Supportivitas',
  penyelenggara: 'Bidang Seni dan Olahraga HIMATIF Teknik Informatika UIN Sunan Gunung Djati Bandung',
  peserta: 'Pelajar aktif SMA/SMK/MA sederajat (kelas 10/11/12) se-Bandung Raya',
  kickOff: '2026-07-24T00:00:00+07:00', // hari pertama pelaksanaan; jam belum ditentukan di guidebook
  lokasi: 'GOR ITB Jatinangor',

  timeline: [
    ['Sosialisasi Program IFC', '8–13 Juni 2026', 'Online'],
    ['Pendaftaran Peserta IFC', '15 Juni – 16 Juli 2026', 'Online'],
    ['Technical Meeting Peserta IFC', '18 Juli 2026', 'Aula Fakultas Saintek UIN Kampus 1'],
    ['Pelaksanaan IFC', '24–25 Juli 2026', 'GOR ITB Jatinangor'],
  ],
  batasDaftar: '16 Juli 2026',

  biaya: { pendaftaran: 550000, cicilanAwal: 275000, jaminan: 100000, denda: { wo: 100000, kuning: 15000, duaKuning: 30000, merah: 30000 } },
  rekening: { bank: 'Bank Jago', no: '104318734323', an: 'Diah Khairunisa' },
  kontak: [['Devi Aliyanti', '083877701686'], ['Rihadatul Fitriyah Ramadhani', '082396657804']],

  tim: { pemain: 12, inti: 5, cadangan: 7, official: 3, total: 15 },

  totalHadiah: 4500000,
  hadiah: [
    ['Juara 1', 'Rp 1.750.000 + Sertifikat + Piala + Merchandise'],
    ['Juara 2', 'Rp 1.250.000 + Sertifikat + Piala + Merchandise'],
    ['Juara 3', 'Rp 750.000 + Sertifikat + Piala + Merchandise'],
    ['Top Score', 'Rp 250.000 + Sertifikat'],
    ['Best Player', 'Rp 250.000 + Sertifikat'],
    ['Best Supporter', 'Rp 250.000 + Sertifikat'],
  ],

  htmSupporter: 'Rp 10.000 per hari',

  persyaratan: [
    'Pelajar aktif SMA/SMK/MA sederajat di wilayah Bandung Raya',
    'Satu pemain/official hanya boleh mewakili satu tim (tidak boleh rangkap)',
    'Melampirkan kartu pelajar semua pemain dan bukti pembayaran',
    'Data pemain & official final saat Technical Meeting',
  ],
  fasilitas: ['1 air mineral per tim', 'Identitas peserta + coach'],

  format: {
    penyisihan: [
      '24 tim dibagi 6 grup (A–F), masing-masing 4 tim',
      'Round robin: tiap tim bertemu sekali dengan tim lain di grupnya (3 laga)',
      '2 tim teratas tiap grup (Juara & Runner-Up) lolos → 12 tim ke Perdelapan Final',
    ],
    waktu: ['Babak grup: 2 × 10 menit (waktu kotor)', 'Semifinal & Final: 2 × 15 menit (waktu kotor)'],
    imbang: ['Imbang di Semifinal & Final → langsung adu penalti', 'Masih imbang setelah adu penalti → toss coin'],
    peringkat: ['Poin (menang 3, seri 1, kalah 0)', 'Selisih gol', 'Jumlah gol dicetak', 'Head to head (jika hanya 2 tim)', 'Adu penalti'],
  },

  aturan: {
    kartu: [
      'Dua kartu kuning dalam satu laga = kartu merah',
      'Kartu kuning di laga berbeda: pemain absen 1 laga berikutnya',
      'Kartu merah: pemain absen 1 laga berikutnya',
      'Tidak ada pemutihan kartu sepanjang kompetisi',
    ],
    wo: [
      'WO: tim tidak hadir saat kick-off atau didiskualifikasi karena pelanggaran',
      'Skor ditetapkan 3–0 untuk tim lawan',
      'Denda WO Rp 100.000 (di luar uang jaminan)',
      'WO lebih dari satu kali dapat didiskualifikasi permanen',
    ],
    jersey: [
      'Tiap tim membawa 2 jersey: terang (home) dan gelap (away)',
      'Nomor punggung berbeda tiap pemain; kiper berjersey berbeda',
      'Kaos kaki panjang; celana & kaos kaki senada; wajib deker & sepatu futsal',
      'Panitia tidak menyediakan jersey cadangan',
    ],
    supporter: [
      'Dukungan positif, tanpa unsur SARA, rasisme, atau pelecehan',
      'Dilarang membawa narkotika, miras, rokok/vape, benda tajam, flare/petasan',
      'Dilarang membuat keributan atau melempar benda ke area pertandingan',
      'Pelanggaran dapat berujung peringatan, larangan menonton, hingga diskualifikasi tim yang didukung',
    ],
  },
}
