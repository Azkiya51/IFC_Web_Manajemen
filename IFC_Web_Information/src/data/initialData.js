// Data dummy. T = tim, M = pertandingan, P = pemain, me = tim milik user yang login.
// Nanti diganti dengan data dari backend (Supabase/Firebase). NISN di sini hanya contoh.
export const INITIAL = {
  T: [
    {n:"SMA 100 Bandung",i:"SMA 100 Bandung",k:"Ahmad Fauzi",c:6,s:"Terverifikasi"},
    {n:"SMA 87 Bandung",i:"SMA 87 Bandung",k:"Ricky Maulana",c:6,s:"Menunggu"},
    {n:"SMA 90 Bandung",i:"SMA 90 Bandung",k:"Siti Nurhaliza",c:7,s:"Terverifikasi"},
    {n:"SMA 101 BANDUNG",i:"SMA 101 BANDUNG",k:"Dimas Pratama",c:6,s:"Menunggu"},
    {n:"SMA 404 Bandung",i:"SMA 404 Bandung",k:"Fajar Ramadhan",c:5,s:"Ditolak",r:"Bukti pembayaran tidak terbaca."},
    {n:"SMA 200 Bandung",i:"SMA 200 Bandung",k:"Rian Hidayat",c:6,s:"Terverifikasi"},
    {n:"SMA 300 Bandung",i:"SMA 300 Bandung",k:"Budi Santoso",c:6,s:"Terverifikasi"},
    {n:"SMA 11 BANDUNG",i:"SMA 11 BANDUNG",k:"Andi Wijaya",c:6,s:"Menunggu"},
  ],
  M: [
    {d:"2026-07-24",t:"08:00",a:"SMA 100 Bandung",b:"SMA 101 BANDUNG",l:"1",x:3,y:1,s:"Selesai"},
    {d:"2026-07-24",t:"10:00",a:"SMA 87 Bandung",b:"SMA 90 Bandung",l:"1",x:1,y:0,s:"Berlangsung"},
    {d:"2026-07-24",t:"14:00",a:"SMA 200 Bandung",b:"SMA 300 Bandung",l:"1",x:0,y:0,s:"Akan Datang"},
    {d:"2026-07-25",t:"08:00",a:"SMA 404 Bandung",b:"SMA 11 BANDUNG",l:"1",x:0,y:0,s:"Akan Datang"},
  ],
  P: [
    ["Ahmad Fauzi","0051234510","SMA 100 Bandung"],
    ["Ricky Maulana","0051234511","SMA 87 Bandung"],
    ["Siti Nurhaliza","0051234512","SMA 90 Bandung"],
    ["Dimas Pratama","0051234513","SMA 101 BANDUNG"],
    ["Fajar Ramadhan","0051234514","SMA 404 Bandung"],
    ["Rian Hidayat","0051234515","SMA 200 Bandung"],
    ["Budi Santoso","0051234516","SMA 300 Bandung"],
    ["Andi Wijaya","0051234517","SMA 11 BANDUNG"],
  ],
  me: "SMA 101 BANDUNG",
}
