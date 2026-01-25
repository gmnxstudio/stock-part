# 📘 PANDUAN SETUP - STOK BARANG UPL

## Selamat Datang! 🎉

Anda telah berhasil menginisialisasi aplikasi **STOK BARANG ULU PLASTIK LATERSIA**. Berikut adalah langkah-langkah untuk menjalankan aplikasi ini.

---

## 🔧 LANGKAH 1: Setup Supabase

### 1.1 Buat Akun Supabase (Gratis)

1. Buka browser dan kunjungi: **https://supabase.com**
2. Klik tombol **"Start your project"**
3. Sign up dengan akun Google atau GitHub Anda
4. Klik **"New Project"**
5. Isi detail:
   - **Project name**: `stock-upl` (atau nama bebas)
   - **Database password**: Buat password yang kuat dan **SIMPAN!**
   - **Region**: Pilih **Singapore** (terdekat dengan Indonesia)
6. Klik **"Create new project"**
7. Tunggu 1-2 menit sampai project selesai dibuat

### 1.2 Dapatkan API Credentials

1. Setelah project aktif, klik **"Settings"** (icon gear di sidebar kiri)
2. Klik **"API"**
3. Anda akan melihat:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (string panjang)
4. **COPY kedua nilai ini!**

### 1.3 Jalankan Database Migration

1. Masih di Supabase dashboard, klik **"SQL Editor"** di sidebar
2. Klik **"New query"**
3. Buka file: `database-migration.sql` di folder project Anda
4. **COPY semua isi file** tersebut
5. **PASTE** ke SQL Editor di Supabase
6. Klik **"Run"** (tombol play di kanan bawah)
7. Jika berhasil, akan muncul pesan **"Success. No rows returned"**

---

## ⚙️ LANGKAH 2: Konfigurasi Environment

### 2.1 Buat File .env.local

1. Buka folder project di VS Code atau text editor
2. Copy file `.env.local.example` dan rename jadi `.env.local`
   
   **ATAU** buat file baru bernama `.env.local` di root folder dengan isi:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

3. **Ganti** `https://xxxxx.supabase.co` dengan **Project URL** Anda
4. **Ganti** `eyJhbGc...` dengan **anon public key** Anda
5. **SAVE** file ini

> ⚠️ **PENTING**: File `.env.local` tidak akan ter-upload ke GitHub (sudah ada di .gitignore)

---

## 🚀 LANGKAH 3: Jalankan Aplikasi

### 3.1 Install Dependencies (Jika Belum)

Buka terminal (PowerShell/CMD) di folder project, lalu jalankan:

```bash
npm install
```

Tunggu sampai selesai (2-3 menit).

### 3.2 Jalankan Development Server

```bash
npm run dev
```

### 3.3 Buka di Browser

1. Tunggu sampai muncul pesan:
   ```
   ✓ Ready in 2s
   ○ Local: http://localhost:3000
   ```

2. Buka browser dan ketik: **http://localhost:3000**

3. Anda akan melihat **Dashboard** aplikasi!

---

## ✅ LANGKAH 4: Testing Aplikasi

### 4.1 Cek Data Sample

Jika migration berhasil, Anda akan melihat:
- Di **Dashboard**: Statistik kosong atau minimal (karena database baru berisi sample)
- Di **Part Master**: 3 barang sample (Spidol, Bearing, Plastik HDPE)

### 4.2 Test CRUD Operations

1. **Buka Part Master** → Klik "Tambah Barang"
2. Isi form:
   - Kode: `TEST-001`
   - Nama: `Barang Test`
   - Kategori: `ATK`
   - Satuan: `Pcs`
   - Min. Stok: `10`
   - Harga: `5000`
3. Klik **Simpan**
4. Barang baru akan muncul di tabel

### 4.3 Test Transaksi

1. **Buka Data Entry**  
2. Pilih **Tipe**: MASUK
3. Pilih **Barang**: Barang Test
4. **Jumlah**: 50
5. Pilih **PIC**: Budi Santoso
6. Klik **Simpan Transaksi**
7. Cek di **Dashboard** → Stok akan bertambah!

---

## 📱 LANGKAH 5: Test di Mobile

1. Buka **http://localhost:3000/mobile-input** di HP Anda (pastikan HP dan laptop di WiFi yang sama)
2. Atau gunakan Developer Tools → Toggle Device Toolbar (F12 → Ctrl+Shift+M)
3. Test input cepat untuk staff lapangan

---

## 🎨 CUSTOMIZATION (Opsional)

### Ganti Logo/Nama

Edit file: `components/layout/Sidebar.tsx` (baris 29-32)

### Ubah Warna Brand

Edit file: `app/globals.css` atau component yang menggunakan warna:
- Blue: `#009ce4`
- Green: `#7eb93e`

---

## 🐛 TROUBLESHOOTING

### Error: "Supabase credentials are missing"

**Solusi**: Pastikan file `.env.local` sudah dibuat dan berisi URL + Key yang benar.

### Error: "relation does not exist"

**Solusi**: Anda lupa menjalankan migration SQL. Ulangi **Langkah 1.3**.

### Error: "Failed to fetch"

**Solusi**: 
1. Cek koneksi internet
2. Pastikan Supabase project masih aktif
3. Cek URL di `.env.local` tidak ada typo

### Page Blank/Error 500

**Solusi**:
1. Stop server (`Ctrl+C`)
2. Hapus folder `.next`
3. Jalankan ulang `npm run dev`

---

## 📞 FITUR LENGKAP

### ✅ Yang Sudah Dibuat:

1. **Dashboard** - Statistik real-time, alert stok kritis
2. **Part Master** - Kelola data barang (Create, Read, Update, Delete)
3. **Data Entry** - Form transaksi lengkap (desktop)
4. **Mobile Input** - Form sederhana untuk HP
5. **CariPart** - Pencarian cepat stok
6. **Riwayat** - History transaksi dengan filter
7. **Anggaran** - Perencanaan belanja otomatis

### 🔒 Keamanan:

- ✅ Validasi stok sebelum transaksi keluar
- ✅ Real-time calculation (tidak ada stok statis di database)
- ✅ Server-side validation dengan Zod
- ✅ Environment variables tidak ter-commit ke GitHub

---

## 🚀 DEPLOYMENT (Untuk Produksi)

Jika ingin deploy ke internet:

1. Push code ke GitHub (sudah terhubung)
2. Buka **https://vercel.com**
3. Import repository dari GitHub
4. Tambahkan Environment Variables (URL & Key Supabase)
5. Deploy!

---

## 📚 STRUKTUR FOLDER

```
stock-part/
├── app/                    # Halaman Next.js (7 pages)
│   ├── page.tsx           # Dashboard
│   ├── part-master/       # CRUD barang
│   ├── data-entry/        # Form desktop
│   ├── mobile-input/      # Form mobile
│   ├── cari-part/         # Pencarian
│   ├── riwayat/           # History
│   └── anggaran/          # Budgeting
├── components/            # UI components
│   ├── ui/                # Shadcn/UI components
│   └── layout/            # Sidebar & Layout
├── services/              # Business logic
│   ├── stock.service.ts   # Stock calculation
│   ├── data.service.ts    # CRUD operations
│   └── transaction.service.ts
├── lib/                   # Utilities
│   └── supabase.ts        # Supabase client
├── types/                 # TypeScript types
│   └── database.ts
├── database-migration.sql # SQL schema
└── .env.local            # Config (JANGAN di-commit!)
```

---

## ✨ SELESAI!

Aplikasi sudah siap digunakan. Jika ada pertanyaan atau error, silakan hubungi developer atau cek dokumentasi Next.js dan Supabase.

**Selamat menggunakan Sistem Stok Barang UPL! 🎉**
