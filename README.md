# ⚽ Sistem Informasi Manajemen Informatic Futsal Competition (IFC)

Sebuah platform berbasis web untuk mengelola operasional turnamen Informatic Futsal Competition (IFC). Sistem ini memfasilitasi pendaftaran tim, penyusunan jadwal pertandingan, hingga pembaruan skor dan bagan turnamen (bracket) secara *real-time*.

## ✨ Fitur Utama

Sistem ini dibagi menjadi 3 modul utama:
*   **Modul Publik:** Melihat jadwal pertandingan, *live score*, klasemen, dan bagan turnamen tanpa perlu login.
*   **Modul Tim (Peserta):** Pendaftaran tim, manajemen roster/pemain, dan unggah bukti pembayaran.
*   **Modul Admin:** Dashboard rekapitulasi, verifikasi pendaftaran tim, manajemen jadwal (CRUD), dan pembaruan hasil pertandingan.

## 🛠️ Tech Stack

Proyek ini dikembangkan menggunakan teknologi:
*   **Frontend:** React.js (dengan Vite)
*   **Styling:** Tailwind CSS
*   **Backend & Database:** Supabase / Firebase (Authentication, Firestore/Database, Storage)
*   **Routing:** React Router DOM
*   **Deployment:** Vercel (Frontend)

## 🚀 Panduan Instalasi Lokal

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di komputer lokal:

1. **Clone repositori**
   ```bash
   git clone https://github.com/Azkiya51/IFC_Web_Manajemen.git
   cd ifc-web-management