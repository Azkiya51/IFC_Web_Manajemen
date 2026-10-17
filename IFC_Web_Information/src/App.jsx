
import { useState } from "react";
import "./App.css";

const menuPublik = ["Home", "Jadwal", "Live Score", "Bracket"];

const menuAdmin = [
  "Dashboard",
  "Data Tim",
  "Data Pemain",
  "Verifikasi Pembayaran",
  "Jadwal Pertandingan",
  "Hasil Pertandingan",
  "Bagan Turnamen",
  "Klasemen",
  "Laporan",
];

const jadwalAwal = [
  {
    id: 1,
    tanggal: "Belum ditentukan",
    waktu: "-",
    timA: "Tim A",
    timB: "Tim B",
    lapangan: "-",
    skorA: 0,
    skorB: 0,
    status: "Akan Datang",
  },
];

function App() {
  // Navigasi
  const [halaman, setHalaman] = useState("Home");
  const [jenisAkun, setJenisAkun] = useState("Peserta");
  const [modeAdmin, setModeAdmin] = useState(false);

  // Akun dan autentikasi demo
  const [akun, setAkun] = useState([]);
  const [akunAktif, setAkunAktif] = useState(null);
  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");
  const [pesan, setPesan] = useState("");

  // Form akun peserta
  const [formAkun, setFormAkun] = useState({
    nama: "",
    email: "",
    password: "",
  });

  // Form pendaftaran tim
  const [langkah, setLangkah] = useState(1);
  const [formTim, setFormTim] = useState({
    namaTim: "",
    kapten: "",
    pelatih: "",
    instansi: "",
    whatsapp: "",
    email: "",
    pemain: ["", "", "", "", ""],
    kartuPelajar: [],
    logoTim: null,
    buktiPembayaran: null,
    setujuAturan: false,
  });

  const [timTerdaftar, setTimTerdaftar] = useState([]);
  const [timDipilih, setTimDipilih] = useState(null);
  const [filterTim, setFilterTim] = useState("Semua");

  // Jadwal dan hasil pertandingan
  const [jadwal, setJadwal] = useState(jadwalAwal);
  const [formJadwal, setFormJadwal] = useState({
    tanggal: "",
    waktu: "",
    timA: "",
    timB: "",
    lapangan: "",
  });

  const [formSkor, setFormSkor] = useState({
    id: "",
    skorA: 0,
    skorB: 0,
    status: "Selesai",
  });

  // Fungsi navigasi
  function bukaHalaman(namaHalaman) {
    setHalaman(namaHalaman);
    setPesan("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function ubahFormTim(nama, nilai) {
    setFormTim((sebelumnya) => ({
      ...sebelumnya,
      [nama]: nilai,
    }));
  }

  function ubahPemain(index, nilai) {
    setFormTim((sebelumnya) => {
      const pemainBaru = [...sebelumnya.pemain];
      pemainBaru[index] = nilai;

      return {
        ...sebelumnya,
        pemain: pemainBaru,
      };
    });
  }

  // Pendaftaran akun peserta
  function daftarAkun(event) {
    event.preventDefault();

    const emailSudahAda = akun.some(
      (item) => item.email === formAkun.email
    );

    if (emailSudahAda) {
      setPesan("Email sudah terdaftar. Silakan gunakan email lain.");
      return;
    }

    const akunBaru = {
      ...formAkun,
      id: Date.now(),
      role: "Peserta",
    };

    setAkun((sebelumnya) => [...sebelumnya, akunBaru]);
    setEmailLogin(formAkun.email);
    setPasswordLogin("");
    setFormAkun({ nama: "", email: "", password: "" });
    setPesan("Akun berhasil dibuat. Silakan login.");
    setJenisAkun("Peserta");
    setHalaman("Login");
  }

  // Login demo
  function login(event) {
    event.preventDefault();

    if (jenisAkun === "Admin") {
      setPesan(
        "Login admin belum terhubung ke sistem autentikasi. Hubungkan ke backend untuk mengaktifkannya."
      );
      return;
    }

    const akunDitemukan = akun.find(
      (item) =>
        item.email === emailLogin &&
        item.password === passwordLogin
    );

    if (!akunDitemukan) {
      setPesan(
        "Akun tidak ditemukan atau password salah. Untuk demo, buat akun peserta terlebih dahulu."
      );
      return;
    }

    setAkunAktif(akunDitemukan);
    setModeAdmin(false);
    setHalaman("Dashboard Peserta");
    setPesan("");
  }

  function keluar() {
    setAkunAktif(null);
    setModeAdmin(false);
    setHalaman("Home");
    setEmailLogin("");
    setPasswordLogin("");
    setPesan("Kamu telah keluar dari akun.");
  }

  // Unggah berkas
  function ubahBerkas(nama, files) {
    if (!files) return;

    ubahFormTim(nama, files);
  }

  // Pendaftaran tim
  function lanjutLangkah() {
    if (langkah === 1) {
      const wajibDiisi = [
        formTim.namaTim,
        formTim.kapten,
        formTim.instansi,
        formTim.whatsapp,
        formTim.email,
      ];

      if (wajibDiisi.some((nilai) => !nilai.trim())) {
        setPesan("Lengkapi semua data wajib terlebih dahulu.");
        return;
      }

      if (!formTim.pemain.some((nama) => nama.trim())) {
        setPesan("Masukkan setidaknya satu nama pemain.");
        return;
      }
    }

    if (langkah < 3) {
      setLangkah((sebelumnya) => sebelumnya + 1);
      setPesan("");
    }
  }

  function kirimPendaftaran(event) {
    event.preventDefault();

    if (!formTim.setujuAturan) {
      setPesan("Kamu harus menyetujui peraturan turnamen.");
      return;
    }

    if (!formTim.buktiPembayaran) {
      setPesan("Unggah bukti pembayaran terlebih dahulu.");
      return;
    }

    const timBaru = {
      id: Date.now(),
      namaTim: formTim.namaTim,
      kapten: formTim.kapten,
      pelatih: formTim.pelatih,
      instansi: formTim.instansi,
      whatsapp: formTim.whatsapp,
      email: formTim.email,
      pemain: formTim.pemain.filter((nama) => nama.trim()),
      kartuPelajar: Array.from(formTim.kartuPelajar).map(
        (file) => file.name
      ),
      logoTim: formTim.logoTim?.name || "",
      buktiPembayaran: formTim.buktiPembayaran.name,
      status: "Menunggu Verifikasi",
      alasanPenolakan: "",
      pemilikEmail: akunAktif?.email || formTim.email,
      tanggalDaftar: new Date().toLocaleDateString("id-ID"),
    };

    setTimTerdaftar((sebelumnya) => [...sebelumnya, timBaru]);
    setTimDipilih(timBaru);
    setLangkah(1);
    setFormTim({
      namaTim: "",
      kapten: "",
      pelatih: "",
      instansi: "",
      whatsapp: "",
      email: akunAktif?.email || "",
      pemain: ["", "", "", "", ""],
      kartuPelajar: [],
      logoTim: null,
      buktiPembayaran: null,
      setujuAturan: false,
    });
    setHalaman("Status Pendaftaran");
    setPesan("Pendaftaran tim berhasil dikirim untuk verifikasi.");
  }

  // Verifikasi tim oleh admin
  function verifikasiTim(id, status, alasan = "") {
    setTimTerdaftar((sebelumnya) =>
      sebelumnya.map((tim) =>
        tim.id === id
          ? { ...tim, status, alasanPenolakan: alasan }
          : tim
      )
    );

    if (timDipilih?.id === id) {
      setTimDipilih((sebelumnya) => ({
        ...sebelumnya,
        status,
        alasanPenolakan: alasan,
      }));
    }

    setPesan(`Status tim berhasil diubah menjadi ${status}.`);
  }

  // Manajemen jadwal
  function tambahJadwal(event) {
    event.preventDefault();

    const jadwalBaru = {
      ...formJadwal,
      id: Date.now(),
      skorA: 0,
      skorB: 0,
      status: "Akan Datang",
    };

    setJadwal((sebelumnya) => [...sebelumnya, jadwalBaru]);
    setFormJadwal({
      tanggal: "",
      waktu: "",
      timA: "",
      timB: "",
      lapangan: "",
    });

    setPesan("Jadwal pertandingan berhasil ditambahkan.");
  }

  function simpanSkor(event) {
    event.preventDefault();

    setJadwal((sebelumnya) =>
      sebelumnya.map((item) =>
        item.id === Number(formSkor.id)
          ? {
              ...item,
              skorA: Number(formSkor.skorA),
              skorB: Number(formSkor.skorB),
              status: formSkor.status,
            }
          : item
      )
    );

    setPesan("Hasil pertandingan berhasil diperbarui.");
  }

  function unduhLaporan() {
    const judul = [
      "Nama Tim",
      "Kapten",
      "Instansi",
      "WhatsApp",
      "Email",
      "Status",
    ];

    const baris = timTerdaftar.map((tim) =>
      [
        tim.namaTim,
        tim.kapten,
        tim.instansi,
        tim.whatsapp,
        tim.email,
        tim.status,
      ]
        .map((nilai) => `"${String(nilai).replaceAll('"', '""')}"`)
        .join(",")
    );

    const csv = [judul.join(","), ...baris].join("\n");
    const file = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(file);
    const tautan = document.createElement("a");
    tautan.href = url;
    tautan.download = "laporan-pendaftaran-ifc.csv";
    tautan.click();
    URL.revokeObjectURL(url);
  }

  const timMilikPeserta = timTerdaftar.filter(
    (tim) => tim.pemilikEmail === akunAktif?.email
  );

  const timTampil = timTerdaftar.filter((tim) => {
    if (filterTim === "Semua") return true;
    return tim.status === filterTim;
  });

  const jumlahTerverifikasi = timTerdaftar.filter(
    (tim) => tim.status === "Terverifikasi"
  ).length;

  const jumlahMenunggu = timTerdaftar.filter(
    (tim) => tim.status === "Menunggu Verifikasi"
  ).length;

  const jumlahDitolak = timTerdaftar.filter(
    (tim) => tim.status === "Ditolak"
  ).length;

  const timDisetujui = timTerdaftar.filter(
    (tim) => tim.status === "Terverifikasi"
  );

  const klasemen = timDisetujui.map((tim) => {
    const pertandingan = jadwal.filter(
      (item) =>
        item.status === "Selesai" &&
        (item.timA === tim.namaTim || item.timB === tim.namaTim)
    );

    let menang = 0;
    let seri = 0;
    let kalah = 0;
    let golMasuk = 0;
    let golKebobolan = 0;

    pertandingan.forEach((item) => {
      const sebagaiA = item.timA === tim.namaTim;
      const golSendiri = sebagaiA ? item.skorA : item.skorB;
      const golLawan = sebagaiA ? item.skorB : item.skorA;

      golMasuk += golSendiri;
      golKebobolan += golLawan;

      if (golSendiri > golLawan) menang++;
      else if (golSendiri === golLawan) seri++;
      else kalah++;
    });

    return {
      nama: tim.namaTim,
      main: pertandingan.length,
      menang,
      seri,
      kalah,
      golMasuk,
      golKebobolan,
      poin: menang * 3 + seri,
    };
  }).sort((a, b) => b.poin - a.poin);

  // Komponen tabel jadwal yang dipakai berulang
  function TabelJadwal() {
    return (
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Waktu</th>
              <th>Pertandingan</th>
              <th>Skor</th>
              <th>Lapangan</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {jadwal.map((item) => (
              <tr key={item.id}>
                <td>{item.tanggal}</td>
                <td>{item.waktu}</td>
                <td>
                  {item.timA} vs {item.timB}
                </td>
                <td>
                  {item.skorA} - {item.skorB}
                </td>
                <td>{item.lapangan}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Halaman Login
  function HalamanLogin() {
    return (
      <section className="auth-section">
        <h2>Login IFC</h2>
        <p>Masuk untuk mengakses layanan Informatic Futsal Competition.</p>

        <div className="account-choice">
          <button
            type="button"
            onClick={() => {
              setJenisAkun("Admin");
              setPesan("");
            }}
          >
            Login Admin
          </button>

          <button
            type="button"
            onClick={() => {
              setJenisAkun("Peserta");
              setPesan("");
            }}
          >
            Login Peserta
          </button>
        </div>

        <h3>Login sebagai {jenisAkun}</h3>

        <form onSubmit={login}>
          <label htmlFor="emailLogin">Email</label>
          <input
            id="emailLogin"
            type="email"
            value={emailLogin}
            onChange={(event) => setEmailLogin(event.target.value)}
            required
          />

          <label htmlFor="passwordLogin">Password</label>
          <input
            id="passwordLogin"
            type="password"
            value={passwordLogin}
            onChange={(event) => setPasswordLogin(event.target.value)}
            required
          />

          <button type="submit">Masuk</button>
        </form>

        {jenisAkun === "Peserta" && (
          <p>
            Belum punya akun?{" "}
            <button
              type="button"
              onClick={() => bukaHalaman("Daftar Akun")}
            >
              Daftar Akun
            </button>
          </p>
        )}

        {pesan && <p role="status">{pesan}</p>}
      </section>
    );
  }

  // Halaman pembuatan akun
  function HalamanDaftarAkun() {
    return (
      <section className="auth-section">
        <h2>Daftar Akun Peserta</h2>

        <form onSubmit={daftarAkun}>
          <label htmlFor="namaAkun">Nama Lengkap</label>
          <input
            id="namaAkun"
            value={formAkun.nama}
            onChange={(event) =>
              setFormAkun({ ...formAkun, nama: event.target.value })
            }
            required
          />

          <label htmlFor="emailAkun">Email</label>
          <input
            id="emailAkun"
            type="email"
            value={formAkun.email}
            onChange={(event) =>
              setFormAkun({ ...formAkun, email: event.target.value })
            }
            required
          />

          <label htmlFor="passwordAkun">Buat Password</label>
          <input
            id="passwordAkun"
            type="password"
            minLength={6}
            value={formAkun.password}
            onChange={(event) =>
              setFormAkun({ ...formAkun, password: event.target.value })
            }
            required
          />

          <button type="submit">Buat Akun</button>
        </form>

        <p>
          Sudah punya akun?{" "}
          <button
            type="button"
            onClick={() => bukaHalaman("Login")}
          >
            Login
          </button>
        </p>

        {pesan && <p role="status">{pesan}</p>}
      </section>
    );
  }

  // Formulir pendaftaran tim
  function HalamanPendaftaranTim() {
    return (
      <section>
        <h2>Pendaftaran Tim IFC</h2>

        <p>
          Lengkapi data tim dan dokumen sesuai persyaratan
          pendaftaran turnamen.
        </p>

        <p>Langkah {langkah} dari 3</p>

        <form onSubmit={kirimPendaftaran}>
          {langkah === 1 && (
            <div>
              <h3>Langkah 1: Data Tim dan Pemain</h3>

              <label htmlFor="namaTim">Nama Tim *</label>
              <input
                id="namaTim"
                value={formTim.namaTim}
                onChange={(event) =>
                  ubahFormTim("namaTim", event.target.value)
                }
                required
              />

              <label htmlFor="kapten">Nama Kapten *</label>
              <input
                id="kapten"
                value={formTim.kapten}
                onChange={(event) =>
                  ubahFormTim("kapten", event.target.value)
                }
                required
              />

              <label htmlFor="pelatih">Nama Pelatih</label>
              <input
                id="pelatih"
                value={formTim.pelatih}
                onChange={(event) =>
                  ubahFormTim("pelatih", event.target.value)
                }
              />

              <label htmlFor="instansi">Asal Sekolah/Instansi *</label>
              <input
                id="instansi"
                value={formTim.instansi}
                onChange={(event) =>
                  ubahFormTim("instansi", event.target.value)
                }
                required
              />

              <label htmlFor="whatsapp">Nomor WhatsApp *</label>
              <input
                id="whatsapp"
                type="tel"
                value={formTim.whatsapp}
                onChange={(event) =>
                  ubahFormTim("whatsapp", event.target.value)
                }
                required
              />

              <label htmlFor="emailTim">Email *</label>
              <input
                id="emailTim"
                type="email"
                value={formTim.email}
                onChange={(event) =>
                  ubahFormTim("email", event.target.value)
                }
                required
              />

              <h3>Daftar Nama Pemain</h3>

              {formTim.pemain.map((nama, index) => (
                <div key={index}>
                  <label htmlFor={`pemain-${index}`}>
                    Pemain {index + 1}
                  </label>
                  <input
                    id={`pemain-${index}`}
                    value={nama}
                    onChange={(event) =>
                      ubahPemain(index, event.target.value)
                    }
                    placeholder={`Nama pemain ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          )}

          {langkah === 2 && (
            <div>
              <h3>Langkah 2: Dokumen Pendaftaran</h3>

              <label htmlFor="kartuPelajar">
                Foto Kartu Pelajar Seluruh Pemain
              </label>
              <input
                id="kartuPelajar"
                type="file"
                accept="image/*,.pdf"
                multiple
                onChange={(event) =>
                  ubahBerkas("kartuPelajar", event.target.files)
                }
              />
              <p>
                {formTim.kartuPelajar.length
                  ? `${formTim.kartuPelajar.length} file dipilih`
                  : "Belum ada kartu pelajar yang dipilih."}
              </p>

              <label htmlFor="logoTim">Logo Tim (Opsional)</label>
              <input
                id="logoTim"
                type="file"
                accept="image/*"
                onChange={(event) =>
                  ubahBerkas("logoTim", event.target.files?.[0] || null)
                }
              />
              {formTim.logoTim && (
                <p>File: {formTim.logoTim.name}</p>
              )}

              <label htmlFor="buktiPembayaran">
                Bukti Pembayaran *
              </label>
              <input
                id="buktiPembayaran"
                type="file"
                accept="image/*,.pdf"
                onChange={(event) =>
                  ubahBerkas(
                    "buktiPembayaran",
                    event.target.files?.[0] || null
                  )
                }
                required
              />

              {formTim.buktiPembayaran && (
                <p>File: {formTim.buktiPembayaran.name}</p>
              )}

              <h3>Informasi Pendaftaran</h3>
              <p>Persyaratan: isi data tim dan lampirkan dokumen.</p>
              <p>Batas pendaftaran: menunggu informasi panitia.</p>
              <p>Biaya pendaftaran: menunggu informasi panitia.</p>
              <p>Petunjuk pembayaran: mengikuti informasi resmi panitia.</p>
              <p>Lokasi pertandingan: GOR yang ditentukan panitia.</p>
            </div>
          )}

          {langkah === 3 && (
            <div>
              <h3>Langkah 3: Konfirmasi Pendaftaran</h3>

              <p>Nama tim: {formTim.namaTim}</p>
              <p>Kapten: {formTim.kapten}</p>
              <p>Pelatih: {formTim.pelatih || "-"}</p>
              <p>Instansi: {formTim.instansi}</p>
              <p>WhatsApp: {formTim.whatsapp}</p>
              <p>Email: {formTim.email}</p>

              <h4>Daftar Pemain</h4>
              <ul>
                {formTim.pemain
                  .filter((nama) => nama.trim())
                  .map((nama, index) => (
                    <li key={index}>{nama}</li>
                  ))}
              </ul>

              <p>
                Bukti pembayaran:{" "}
                {formTim.buktiPembayaran?.name || "Belum diunggah"}
              </p>

              <label>
                <input
                  type="checkbox"
                  checked={formTim.setujuAturan}
                  onChange={(event) =>
                    ubahFormTim("setujuAturan", event.target.checked)
                  }
                />
                Saya menyetujui peraturan turnamen IFC.
              </label>

              <p>
                Setelah dikirim, pendaftaran akan menunggu verifikasi
                admin.
              </p>

              <button type="submit">Submit Pendaftaran</button>
            </div>
          )}
        </form>

        <div className="form-navigation">
          {langkah > 1 && (
            <button
              type="button"
              onClick={() => {
                setLangkah((sebelumnya) => sebelumnya - 1);
                setPesan("");
              }}
            >
              Kembali
            </button>
          )}

          {langkah < 3 && (
            <button type="button" onClick={lanjutLangkah}>
              Selanjutnya
            </button>
          )}
        </div>

        {pesan && <p role="status">{pesan}</p>}
      </section>
    );
  }

  // Dashboard admin
  function DashboardAdmin() {
    return (
      <section>
        <h2>Dashboard Admin IFC</h2>

        <div className="stats-container">
          <article>
            <h3>Total Tim</h3>
            <p>{timTerdaftar.length}</p>
          </article>

          <article>
            <h3>Menunggu Verifikasi</h3>
            <p>{jumlahMenunggu}</p>
          </article>

          <article>
            <h3>Terverifikasi</h3>
            <p>{jumlahTerverifikasi}</p>
          </article>

          <article>
            <h3>Ditolak</h3>
            <p>{jumlahDitolak}</p>
          </article>

          <article>
            <h3>Total Pertandingan</h3>
            <p>{jadwal.length}</p>
          </article>
        </div>

        <h3>Ringkasan Pendaftaran</h3>
        <p>Kelola tim, verifikasi pembayaran, dan jadwal pertandingan.</p>
      </section>
    );
  }

  function HalamanDataTim() {
    return (
      <section>
        <h2>Data Tim</h2>

        <label htmlFor="filterTim">Filter Status</label>
        <select
          id="filterTim"
          value={filterTim}
          onChange={(event) => setFilterTim(event.target.value)}
        >
          <option>Semua</option>
          <option>Menunggu Verifikasi</option>
          <option>Terverifikasi</option>
          <option>Ditolak</option>
        </select>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nama Tim</th>
                <th>Kapten</th>
                <th>Instansi</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {timTampil.map((tim) => (
                <tr key={tim.id}>
                  <td>{tim.namaTim}</td>
                  <td>{tim.kapten}</td>
                  <td>{tim.instansi}</td>
                  <td>{tim.status}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => setTimDipilih(tim)}
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {timDipilih && (
          <article>
            <h3>Detail Tim: {timDipilih.namaTim}</h3>
            <p>Kapten: {timDipilih.kapten}</p>
            <p>Pelatih: {timDipilih.pelatih || "-"}</p>
            <p>Instansi: {timDipilih.instansi}</p>
            <p>WhatsApp: {timDipilih.whatsapp}</p>
            <p>Email: {timDipilih.email}</p>
            <p>Pemain: {timDipilih.pemain.join(", ")}</p>
            <p>Kartu pelajar: {timDipilih.kartuPelajar.join(", ") || "-"}</p>
            <p>Logo: {timDipilih.logoTim || "-"}</p>
            <p>Bukti pembayaran: {timDipilih.buktiPembayaran}</p>
            <p>Status: {timDipilih.status}</p>

            <button
              type="button"
              onClick={() => setTimDipilih(null)}
            >
              Tutup Detail
            </button>
          </article>
        )}
      </section>
    );
  }

  function HalamanVerifikasi() {
    return (
      <section>
        <h2>Verifikasi Pembayaran</h2>

        {timTerdaftar.filter(
          (tim) => tim.status === "Menunggu Verifikasi"
        ).length === 0 && <p>Tidak ada pendaftaran yang menunggu.</p>}

        {timTerdaftar
          .filter((tim) => tim.status === "Menunggu Verifikasi")
          .map((tim) => (
            <article key={tim.id}>
              <h3>{tim.namaTim}</h3>
              <p>Kapten: {tim.kapten}</p>
              <p>Email: {tim.email}</p>
              <p>Bukti pembayaran: {tim.buktiPembayaran}</p>

              <button
                type="button"
                onClick={() =>
                  verifikasiTim(tim.id, "Terverifikasi")
                }
              >
                Terima
              </button>

              <button
                type="button"
                onClick={() => {
                  const alasan = window.prompt(
                    "Masukkan alasan penolakan:"
                  );

                  if (alasan?.trim()) {
                    verifikasiTim(tim.id, "Ditolak", alasan);
                  }
                }}
              >
                Tolak
              </button>
            </article>
          ))}
      </section>
    );
  }

  function HalamanDataPemain() {
    return (
      <section>
        <h2>Data Pemain</h2>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nama Pemain</th>
                <th>Tim</th>
                <th>Instansi</th>
              </tr>
            </thead>

            <tbody>
              {timTerdaftar.flatMap((tim) =>
                tim.pemain.map((nama, index) => (
                  <tr key={`${tim.id}-${index}`}>
                    <td>{nama}</td>
                    <td>{tim.namaTim}</td>
                    <td>{tim.instansi}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  function HalamanKelolaJadwal() {
    return (
      <section>
        <h2>Jadwal Pertandingan</h2>

        <form onSubmit={tambahJadwal}>
          <label htmlFor="tanggalJadwal">Tanggal</label>
          <input
            id="tanggalJadwal"
            type="date"
            value={formJadwal.tanggal}
            onChange={(event) =>
              setFormJadwal({
                ...formJadwal,
                tanggal: event.target.value,
              })
            }
            required
          />

          <label htmlFor="waktuJadwal">Waktu</label>
          <input
            id="waktuJadwal"
            type="time"
            value={formJadwal.waktu}
            onChange={(event) =>
              setFormJadwal({
                ...formJadwal,
                waktu: event.target.value,
              })
            }
            required
          />

          <label htmlFor="timA">Tim A</label>
          <select
            id="timA"
            value={formJadwal.timA}
            onChange={(event) =>
              setFormJadwal({
                ...formJadwal,
                timA: event.target.value,
              })
            }
            required
          >
            <option value="">Pilih Tim A</option>
            {timDisetujui.map((tim) => (
              <option key={tim.id} value={tim.namaTim}>
                {tim.namaTim}
              </option>
            ))}
          </select>

          <label htmlFor="timB">Tim B</label>
          <select
            id="timB"
            value={formJadwal.timB}
            onChange={(event) =>
              setFormJadwal({
                ...formJadwal,
                timB: event.target.value,
              })
            }
            required
          >
            <option value="">Pilih Tim B</option>
            {timDisetujui.map((tim) => (
              <option
                key={tim.id}
                value={tim.namaTim}
                disabled={tim.namaTim === formJadwal.timA}
              >
                {tim.namaTim}
              </option>
            ))}
          </select>

          <label htmlFor="lapangan">Lapangan</label>
          <input
            id="lapangan"
            value={formJadwal.lapangan}
            onChange={(event) =>
              setFormJadwal({
                ...formJadwal,
                lapangan: event.target.value,
              })
            }
            required
          />

          <button type="submit">Tambah Jadwal</button>
        </form>

        <h3>Daftar Pertandingan</h3>
        <TabelJadwal />
      </section>
    );
  }

  function HalamanHasilPertandingan() {
    return (
      <section>
        <h2>Hasil Pertandingan</h2>

        <form onSubmit={simpanSkor}>
          <label htmlFor="pilihPertandingan">Pertandingan</label>
          <select
            id="pilihPertandingan"
            value={formSkor.id}
            onChange={(event) => {
              const pertandingan = jadwal.find(
                (item) => item.id === Number(event.target.value)
              );

              setFormSkor({
                id: event.target.value,
                skorA: pertandingan?.skorA ?? 0,
                skorB: pertandingan?.skorB ?? 0,
                status: pertandingan?.status ?? "Selesai",
              });
            }}
            required
          >
            <option value="">Pilih Pertandingan</option>
            {jadwal.map((item) => (
              <option key={item.id} value={item.id}>
                {item.timA} vs {item.timB}
              </option>
            ))}
          </select>

          <label htmlFor="skorA">Skor Tim A</label>
          <input
            id="skorA"
            type="number"
            min="0"
            value={formSkor.skorA}
            onChange={(event) =>
              setFormSkor({
                ...formSkor,
                skorA: event.target.value,
              })
            }
            required
          />

          <label htmlFor="skorB">Skor Tim B</label>
          <input
            id="skorB"
            type="number"
            min="0"
            value={formSkor.skorB}
            onChange={(event) =>
              setFormSkor({
                ...formSkor,
                skorB: event.target.value,
              })
            }
            required
          />

          <label htmlFor="statusPertandingan">Status</label>
          <select
            id="statusPertandingan"
            value={formSkor.status}
            onChange={(event) =>
              setFormSkor({
                ...formSkor,
                status: event.target.value,
              })
            }
          >
            <option value="Akan Datang">Akan Datang</option>
            <option value="Berlangsung">Berlangsung</option>
            <option value="Selesai">Selesai</option>
          </select>

          <button type="submit">Simpan Hasil</button>
        </form>

        <TabelJadwal />
      </section>
    );
  }

  function HalamanKlasemen() {
    return (
      <section>
        <h2>Klasemen Turnamen</h2>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Posisi</th>
                <th>Tim</th>
                <th>Main</th>
                <th>Menang</th>
                <th>Seri</th>
                <th>Kalah</th>
                <th>Gol</th>
                <th>Poin</th>
              </tr>
            </thead>

            <tbody>
              {klasemen.map((tim, index) => (
                <tr key={tim.nama}>
                  <td>{index + 1}</td>
                  <td>{tim.nama}</td>
                  <td>{tim.main}</td>
                  <td>{tim.menang}</td>
                  <td>{tim.seri}</td>
                  <td>{tim.kalah}</td>
                  <td>
                    {tim.golMasuk} - {tim.golKebobolan}
                  </td>
                  <td>{tim.poin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  function HalamanBracket() {
    return (
      <section>
        <h2>Bagan Turnamen</h2>
        <p>Bagan akan menampilkan tim yang telah terverifikasi.</p>

        <div className="bracket-container">
          {timDisetujui.length === 0 ? (
            <p>Belum ada tim terverifikasi.</p>
          ) : (
            timDisetujui.map((tim, index) => (
              <article key={tim.id}>
                <p>Peserta {index + 1}</p>
                <h3>{tim.namaTim}</h3>
              </article>
            ))
          )}
        </div>

        <h3>Klasemen</h3>
        <HalamanKlasemen />
      </section>
    );
  }

  function HalamanLaporan() {
    return (
      <section>
        <h2>Laporan Pendaftaran</h2>
        <p>Total tim: {timTerdaftar.length}</p>
        <p>Menunggu verifikasi: {jumlahMenunggu}</p>
        <p>Terverifikasi: {jumlahTerverifikasi}</p>
        <p>Ditolak: {jumlahDitolak}</p>

        <button type="button" onClick={unduhLaporan}>
          Unduh Laporan CSV
        </button>
      </section>
    );
  }

  // Halaman publik
  function HalamanHome() {
    return (
      <>
        <section className="hero-section">
          <h2>Informatic Futsal Competition</h2>
          <p>
            Sistem Informasi Manajemen Informatic Futsal Competition
            untuk pendaftaran tim dan pengelolaan pertandingan.
          </p>

          <button
            type="button"
            onClick={() => {
              if (akunAktif) {
                bukaHalaman("Pendaftaran Tim");
              } else {
                bukaHalaman("Login");
              }
            }}
          >
            Daftar Turnamen
          </button>
        </section>

        <section>
          <h2>Informasi Turnamen</h2>
          <p>Informasi resmi turnamen IFC.</p>
          <p>Tanggal pelaksanaan: menunggu informasi panitia.</p>
          <p>Lokasi: GOR yang ditentukan panitia.</p>
        </section>

        <section>
          <h2>Countdown Turnamen</h2>
          <p>Tanggal turnamen akan diumumkan oleh panitia.</p>
        </section>

        <section className="stats-container">
          <article>
            <h3>Total Tim Terdaftar</h3>
            <p>{timTerdaftar.length}</p>
          </article>
          <article>
            <h3>Tim Terverifikasi</h3>
            <p>{jumlahTerverifikasi}</p>
          </article>
          <article>
            <h3>Total Pertandingan</h3>
            <p>{jadwal.length}</p>
          </article>
        </section>

        <section>
          <h2>Pertandingan Terbaru</h2>
          <TabelJadwal />
        </section>
      </>
    );
  }

  function HalamanStatusPendaftaran() {
    return (
      <section>
        <h2>Status Pendaftaran</h2>

        {timMilikPeserta.length === 0 && (
          <p>Belum ada data pendaftaran untuk akun ini.</p>
        )}

        {timMilikPeserta.map((tim) => (
          <article key={tim.id}>
            <h3>{tim.namaTim}</h3>
            <p>Tanggal daftar: {tim.tanggalDaftar}</p>
            <p>Status: {tim.status}</p>

            {tim.status === "Menunggu Verifikasi" && (
              <p>
                Pendaftaran sedang diperiksa oleh admin.
              </p>
            )}

            {tim.status === "Terverifikasi" && (
              <p>
                Pendaftaran tim telah terverifikasi.
              </p>
            )}

            {tim.status === "Ditolak" && (
              <>
                <p>Alasan penolakan: {tim.alasanPenolakan}</p>
                <p>
                  Perbaiki data atau dokumen sesuai alasan penolakan
                  sebelum mengajukan kembali.
                </p>
              </>
            )}
          </article>
        ))}
      </section>
    );
  }

  // Area konten utama
  function KontenHalaman() {
    if (halaman === "Login") return <HalamanLogin />;
    if (halaman === "Daftar Akun") return <HalamanDaftarAkun />;

    if (halaman === "Home") return <HalamanHome />;
    if (halaman === "Jadwal") return <TabelJadwal />;
    if (halaman === "Live Score") {
      return (
        <section>
          <h2>Live Score</h2>
          <p>Skor ditampilkan berdasarkan data pertandingan.</p>
          <TabelJadwal />
        </section>
      );
    }

    if (halaman === "Bracket") return <HalamanBracket />;

    if (halaman === "Dashboard Peserta") {
      return (
        <section>
          <h2>Dashboard Peserta</h2>
          <p>Selamat datang, {akunAktif?.nama}.</p>

          <button
            type="button"
            onClick={() => bukaHalaman("Pendaftaran Tim")}
          >
            Daftar Tim
          </button>

          <button
            type="button"
            onClick={() => bukaHalaman("Status Pendaftaran")}
          >
            Status Pendaftaran
          </button>
        </section>
      );
    }

    if (halaman === "Pendaftaran Tim") {
      return <HalamanPendaftaranTim />;
    }

    if (halaman === "Status Pendaftaran") {
      return <HalamanStatusPendaftaran />;
    }

    if (halaman === "Dashboard") return <DashboardAdmin />;
    if (halaman === "Data Tim") return <HalamanDataTim />;
    if (halaman === "Data Pemain") return <HalamanDataPemain />;
    if (halaman === "Verifikasi Pembayaran") {
      return <HalamanVerifikasi />;
    }
    if (halaman === "Jadwal Pertandingan") {
      return <HalamanKelolaJadwal />;
    }
    if (halaman === "Hasil Pertandingan") {
      return <HalamanHasilPertandingan />;
    }
    if (halaman === "Bagan Turnamen") return <HalamanBracket />;
    if (halaman === "Klasemen") return <HalamanKlasemen />;
    if (halaman === "Laporan") return <HalamanLaporan />;

    return <HalamanHome />;
  }

  return (
    <div className="app">
      <header className="site-header">
        <div className="logo">
          <h1>IFC</h1>
          <p>Informatic Futsal Competition</p>
        </div>

        {!modeAdmin && (
          <nav className="public-navigation">
            {menuPublik.map((menu) => (
              <button
                type="button"
                key={menu}
                onClick={() => bukaHalaman(menu)}
              >
                {menu}
              </button>
            ))}

            {akunAktif ? (
              <>
                <button
                  type="button"
                  onClick={() => bukaHalaman("Dashboard Peserta")}
                >
                  Akun Saya
                </button>

                <button type="button" onClick={keluar}>
                  Logout
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => bukaHalaman("Login")}
              >
                Login
              </button>
            )}
          </nav>
        )}
      </header>

      {modeAdmin ? (
        <div className="admin-layout">
          <aside className="admin-sidebar">
            <h2>Admin IFC</h2>

            <nav>
              {menuAdmin.map((menu) => (
                <button
                  type="button"
                  key={menu}
                  onClick={() => bukaHalaman(menu)}
                >
                  {menu}
                </button>
              ))}

              <button
                type="button"
                onClick={() => {
                  setModeAdmin(false);
                  setHalaman("Home");
                }}
              >
                Kembali ke Publik
              </button>
            </nav>
          </aside>

          <main className="admin-content">
            {pesan && <p role="status">{pesan}</p>}
            <KontenHalaman />
          </main>
        </div>
      ) : (
        <main className="main-content">
          {pesan && halaman !== "Login" && (
            <p role="status">{pesan}</p>
          )}

          <KontenHalaman />
        </main>
      )}

      <footer className="site-footer">
        <p>Informatic Futsal Competition (IFC)</p>
        <p>Sistem Informasi Manajemen Turnamen Futsal</p>
      </footer>
    </div>
  );
}

export default App;
