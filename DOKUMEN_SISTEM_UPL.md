# 📑 DOKUMEN SPESIFIKASI & KONTEKS SISTEM: STOK BARANG ULU PLASTIK LATERSIA

## 1. PENDAHULUAN
Dokumen ini berfungsi sebagai panduan utama bagi AI Developer (Antigravity) dan tim teknis untuk membangun sistem manajemen stok di PT Ulu Plastik Latersia (UPL). Fokus utama adalah migrasi dari Google Sheets ke Web App Fullstack berbasis Supabase.

## 2. IDENTITAS VISUAL & UI/UX
- **Nama Sistem:** STOK BARANG ULU PLASTIK LATERSIA
- **Bahasa Interface:** 100% Bahasa Indonesia
- **Tema Warna:** - Dominan: Putih (#FFFFFF)
    - Sekunder 1 (Aksi/Tombol): Biru (#009ce4)
    - Sekunder 2 (Status Aman/Masuk): Hijau (#7eb93e)
- **Prinsip Desain:** Minimalis, Modern, Mobile-First (Responsif untuk HP staff lapangan).

## 3. ARSITEKTUR DATA (SUPABASE)
Sistem menggunakan database relasional dengan skema berikut:

### A. Tabel Master
1. **`categories`**: `id, category_name`
2. **`staff`**: `id, staff_name, position`
3. **`items`**: `id, item_code (Unique), item_name, category_id (FK), unit, min_stock, buying_price`

### B. Tabel Transaksi
4. **`transactions`**: `id, item_id (FK), type (1=Masuk, 2=Keluar), qty, date, pic_id (FK), witness_id (FK), note_number, remarks`

### C. Tabel Perencanaan
5. **`budgets`**: `id, budget_name, total_amount, status (Draft/Approved)`
6. **`budget_items`**: `id, budget_id (FK), item_id (FK), qty, estimated_price`

## 4. LOGIKA BISNIS KRITIKAL
- **Kalkulasi Real-time:** Stok akhir dihitung secara dinamis: `SUM(Masuk) - SUM(Keluar)`. Tidak ada penyimpanan nilai stok statis untuk menghindari data korup.
- **Validasi Stok Keluar:** Sistem wajib memblokir transaksi jika `Qty Keluar > Stok Tersedia`.
- **Auto-Fill Form:** Saat menginput nama barang, sistem otomatis menarik data Kategori, Satuan, dan Harga dari database.
- **Indikator Stok:**
    - 🔴 Merah: Stok Kosong (0).
    - 🟡 Kuning: Stok <= Min Stock (Segera beli).
    - 🟢 Hijau: Stok Aman.

## 5. STRUKTUR HALAMAN WEB
1. **Dashboard:** Ringkasan nilai aset, alert stok kritis, dan grafik transaksi terbaru.
2. **Part Master:** Manajemen data barang dan harga beli.
3. **Data Entry:** Form input transaksi (desktop-friendly).
4. **Input Mobile:** Form minimalis khusus untuk staff di lapangan (HP).
5. **CariPart:** Fitur pencarian cepat sisa stok dan lokasi barang.
6. **Riwayat & Laporan:** Filter mutasi berdasarkan tanggal, PIC, atau kategori.
7. **Anggaran Belanja:** Perencanaan belanja otomatis berdasarkan stok yang sudah kuning/merah.

## 6. TEKNOLOGI (TECH STACK)
- **Framework:** Next.js 14 (App Router)
- **Bahasa:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Icons:** Lucide-React
- **Deployment:** Vercel

## 7. PANDUAN IMPLEMENTASI (UNTUK AI ANTIGRAVITY)
Path Proyek: `C:\Users\INTEL\Documents\APLIKASI UPL\stock-part`

**Instruksi Step-by-Step:**
1. Inisialisasi Next.js 14 di folder tujuan.
2. Konfigurasi `supabase-js` dan file `.env.local`.
3. Buat folder `/components`, `/app`, `/lib`, dan `/services`.
4. Implementasikan Server Action untuk transaksi stok guna memastikan kecepatan dan keamanan.
5. Gunakan Shadcn/UI untuk komponen tabel dan form.
6. Berikan petunjuk terminal (npm install, dsb) secara mendetail untuk user pemula.