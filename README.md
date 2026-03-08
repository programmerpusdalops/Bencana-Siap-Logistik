# SIAP LOGISTIK BENCANA

**SIAP LOGISTIK BENCANA** adalah sistem manajemen logistik terpadu yang digunakan oleh Badan Penanggulangan Bencana Daerah (BPBD) untuk mengelola logistik selama operasi tanggap darurat bencana.

Sistem ini dirancang untuk memudahkan pemantauan, pencatatan, dan distribusi logistik mulai dari gudang hingga ke lokasi pengungsian, dengan antarmuka yang modern, cepat, dan aman.

---

## 🏗 Struktur Monorepo

Project ini menggunakan arsitektur **Monorepo** yang memisahkan antara frontend dan backend dalam satu repository utama.

```text
Bencana-Siap-Logistik/
├── frontend/       # Aplikasi Web berbasis React + Vite
└── backend/        # API Server berbasis Node.js + Express
```

---

## 💻 Tech Stack

### 🎨 Frontend
- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI + Radix UI
- **Routing:** React Router v6
- **Data Fetching:** TanStack Query (React Query)
- **Maps:** Leaflet & React-Leaflet
- **Charts:** Recharts

### ⚙️ Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** Helmet, CORS, bcryptjs, express-rate-limit

---

## 🚀 Panduan Menjalankan Project (Development)

Untuk menjalankan project ini secara lokal, Anda perlu membuka dua terminal terpisah: satu untuk frontend dan satu untuk backend.

### 1. Menjalankan Backend API

```bash
# Masuk ke direktori backend
cd backend

# Install dependencies (jika belum)
npm install

# Copy pengaturan environment
cp .env.example .env

# Jalankan server development (berjalan di port 5000)
npm run dev
```

### 2. Menjalankan Frontend Web

Buka tab terminal baru:

```bash
# Masuk ke direktori frontend
cd frontend

# Install dependencies (jika belum)
npm install

# Jalankan server development (biasanya berjalan di port 5173 atau 8080/8081)
npm run dev
```

Aplikasi siap diakses melalui browser pada URL yang tertera di terminal frontend (contoh: `http://localhost:8081`).

---

## 🔒 Fitur Utama Sistem

Sistem ini mendukung pengelolaan penuh terhadap siklus logistik darurat bencana, meliputi:

1. **Dashboard Analytics:** Ringkasan stok, grafik logistik masuk/keluar, dan peta sebaran bencana interaktif.
2. **Autentikasi & Otorisasi:** Sistem login aman dengan Role-Based Access Control (Super Admin, Admin Gudang, Pusdalops, Posko, Pimpinan).
3. **Manajemen Master Data:** Pengelolaan jenis logistik, barang, instansi, gudang, satuan, dan kendaraan.
4. **Manajemen Stok Gudang:** Pemantauan ketersediaan logistik di seluruh gudang secara *real-time*.
5. **Logistik Masuk:** Pencatatan logistik ganti/bantuan dari berbagai sumber (APBD, BNPB, Donasi, dll).
6. **Data Bencana:** Pencatatan kejadian bencana lengkap dengan koordinat lokasi dan jumlah korban/pengungsi.
7. **Permintaan Logistik:** Modul bagi petugas lapangan/posko untuk mengajukan permintaan barang.
8. **Verifikasi Permintaan:** Modul persetujuan/penolakan permintaan oleh pihak berwenang.
9. **Manajemen Distribusi:** Pengiriman barang dari gudang ke lokasi bencana menggunakan armada yang ditunjuk.
10. **Konfirmasi Penerimaan:** Bukti terima barang di lapangan lengkap dengan dokumentasi foto.

---

## 📝 Aturan Kontribusi (Git Workflow)

Karena menggunakan arsitektur monorepo, *commit* dan *push* dilakukan dari direktori root (folder utama `Bencana-Siap-Logistik`).

Disarankan menggunakan konvensi **Conventional Commits**:

- `feat(frontend): tambah halaman master data`
- `feat(backend): buat API untuk manajemen stok`
- `fix(frontend): perbaiki bug pada peta dashboard`
- `chore: update versi dependency`

Langkah push:
```bash
# Pastikan berada di root direktori
git add .
git commit -m "feat(scope): deskripsi perubahan"
git push
```

---

*Dikembangkan untuk menunjang kecepatan dan ketepatan distribusi bantuan logistik di masa tanggap darurat bencana.*
