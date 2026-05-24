# Berbagi Cerita - Aplikasi Berbagi Pengalaman

Aplikasi web Single Page Application (SPA) dan Progressive Web App (PWA) untuk berbagi cerita dan pengalaman dari berbagai tempat. Dibuat sebagai submission untuk kelas Dicoding Academy "Belajar Pengembangan Web Intermediate".

## 📋 Informasi Aplikasi

- **Nama:** Berbagi Cerita
- **Tema:** Platform berbagi pengalaman perjalanan dari berbagai lokasi
- **API:** [Dicoding Story API](https://story-api.dicoding.dev/v1/)
- **Layanan Peta:** OpenStreetMap & Esri Satellite (tanpa API key)
- **URL Demo:** `http://localhost:5173/` (development)
- **URL Production:** *[Tambahkan URL deployment setelah deploy]*

## ✨ Fitur yang Diimplementasikan

### 1. SPA & Transisi Halaman (Advance) ✅
- ✅ Single-Page Application dengan hash routing
- ✅ Navigasi tanpa reload halaman
- ✅ View Transitions API untuk transisi halus antar halaman
- ✅ Pemisahan halaman authentication (login/register) dan homepage

### 2. Data & Marker Peta (Advance) ✅
- ✅ Menampilkan data dari API (foto, nama, deskripsi, tanggal)
- ✅ Interactive map dengan Leaflet.js dan markers
- ✅ Multiple tile layers (OpenStreetMap & Satellite)
- ✅ Layer control untuk berganti tampilan peta
- ✅ Sinkronisasi list dan peta (klik list → zoom ke lokasi)
- ✅ Popup marker menampilkan detail cerita

### 3. Fitur Tambah Data (Advance) ✅
- ✅ Form tambah cerita dengan upload file
- ✅ Pemilihan lokasi via mini-map interaktif
- ✅ HTTP Request asynchronous ke API
- ✅ Validasi input yang jelas dan user-friendly
- ✅ Camera capture menggunakan MediaDevices API
- ✅ Media stream ditutup setelah digunakan
- ✅ Feedback pesan sukses/error yang informatif

### 4. Aksesibilitas (Advance) ✅
- ✅ Skip to content link
- ✅ Semantic HTML elements (`<header>`, `<main>`, `<article>`, dll.)
- ✅ Labels pada semua form inputs
- ✅ Alt text pada semua gambar
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Keyboard navigation support
- ✅ ARIA attributes untuk screen readers

### 5. Push Notification (Submission V2) ✅
- ✅ Web Push API integration dengan VAPID keys
- ✅ Subscribe/unsubscribe push notifications
- ✅ Toggle button di halaman About
- ✅ Dynamic notification content (title, icon, message)
- ✅ Notification actions untuk navigasi ke story detail
- ✅ Server-side subscription management

### 6. Progressive Web App (Submission V2) ✅
- ✅ Installable app (Add to Home Screen)
- ✅ Service Worker dengan caching strategies
- ✅ Offline support untuk app shell
- ✅ Web App Manifest dengan screenshots dan shortcuts
- ✅ Theme color dan status bar customization
- ✅ Automatic update detection

### 7. IndexedDB & Offline Sync (Submission V2) ✅
- ✅ CRUD operations menggunakan IndexedDB
- ✅ Filter, search, dan sort pada data offline
- ✅ Offline-first architecture
- ✅ Automatic sync saat kembali online
- ✅ Pending queue untuk operasi offline
- ✅ Network status detection

## 🧪 Panduan Testing

### Prasyarat
1. Install dependencies: `npm install`
2. Jalankan development server: `npm run dev`
3. Buka browser di `http://localhost:5173/`

### Skenario Testing

#### 1. Registrasi & Login
- [ ] Buka halaman registrasi (`#/register`)
- [ ] Isi form dengan data dummy (nama, email valid, password minimal 8 karakter)
- [ ] Klik tombol daftar dan pastikan mendapat pesan sukses
- [ ] Login dengan akun yang baru didaftarkan
- [ ] Verifikasi redirect otomatis ke homepage setelah login

#### 2. Melihat Daftar Cerita
- [ ] Setelah login, homepage otomatis menampilkan daftar cerita dari API
- [ ] Pastikan foto, nama, deskripsi, dan tanggal ditampilkan dengan benar
- [ ] Test responsive design dengan resize browser window

#### 3. Peta Interaktif
- [ ] Klik menu "Peta" untuk navigasi ke halaman peta
- [ ] Verifikasi marker muncul di lokasi cerita yang memiliki koordinat
- [ ] Gunakan layer control (pojok kanan atas) untuk ganti antara OpenStreetMap dan Satellite
- [ ] Klik salah satu cerita di list bawah peta
- [ ] Verifikasi peta zoom ke lokasi cerita tersebut dan popup terbuka
- [ ] Klik marker pada peta untuk melihat detail cerita

#### 4. Tambah Cerita Baru
- [ ] Pastikan sudah login (jika belum, akan redirect ke login)
- [ ] Klik menu "Tambah Cerita"
- [ ] Isi deskripsi cerita (minimal 1 karakter)
- [ ] Upload foto ATAU klik "Buka Kamera" untuk capture langsung
  - Untuk kamera: izinkan akses kamera, ambil foto, preview muncul
- [ ] Klik pada mini-map untuk memilih lokasi (latitude & longitude terisi otomatis)
- [ ] Klik "Tambah Cerita"
- [ ] Verifikasi pesan sukses muncul
- [ ] Verifikasi redirect ke homepage setelah 2 detik
- [ ] Cek cerita baru muncul di daftar

#### 5. Aksesibilitas
- [ ] Tekan Tab saat pertama kali load page → verifikasi skip link muncul
- [ ] Navigasi seluruh aplikasi hanya dengan keyboard (Tab, Enter, Escape)
- [ ] Gunakan screen reader (opsional) untuk verifikasi ARIA labels
- [ ] Resize browser ke berbagai ukuran:
  - Mobile: 375px
  - Tablet: 768px
  - Desktop: 1024px+
- [ ] Verifikasi layout tetap rapi di semua ukuran layar

#### 6. Logout & Protected Routes
- [ ] Klik tombol logout (jika ada di UI)
- [ ] Coba akses `#/add` tanpa login
- [ ] Verifikasi redirect otomatis ke halaman login

#### 7. Push Notification (V2)
- [ ] Buka halaman About (`#/about`)
- [ ] Klik tombol "Aktifkan Notifikasi"
- [ ] Izinkan notifikasi di browser prompt
- [ ] Verifikasi status berubah menjadi "✓ Notifikasi aktif"
- [ ] Buat cerita baru untuk trigger notifikasi
- [ ] Verifikasi notifikasi muncul dengan judul, icon, dan pesan yang benar
- [ ] Klik action "Lihat Cerita" pada notifikasi
- [ ] Verifikasi navigasi ke halaman yang sesuai
- [ ] Klik tombol "Nonaktifkan Notifikasi"
- [ ] Verifikasi status berubah menjadi "✗ Notifikasi nonaktif"

#### 8. PWA Installability (V2)
- [ ] Buka aplikasi di Chrome/Edge mobile atau desktop
- [ ] Verifikasi install prompt muncul (Add to Home Screen)
- [ ] Install aplikasi
- [ ] Verifikasi app terbuka dalam mode standalone (tanpa browser chrome)
- [ ] Verifikasi theme color terlihat di status bar
- [ ] Long press app icon → verifikasi shortcuts muncul (Tambah Cerita, Lihat Peta)

#### 9. Offline Support (V2)
- [ ] Buka DevTools → Network tab → set throttling ke "Offline"
- [ ] Reload halaman
- [ ] Verifikasi app shell masih tampil (header, navigation, layout)
- [ ] Verifikasi indikator offline muncul di homepage
- [ ] Verifikasi cerita yang sudah di-cache masih terlihat
- [ ] Test search dan sort saat offline
- [ ] Koneksi kembali online (set Network ke "Online")
- [ ] Verifikasi data refresh otomatis

#### 10. IndexedDB Operations (V2)
- [ ] Buka DevTools → Application → IndexedDB → BerbagiCeritaDB
- [ ] Verifikasi object store "stories" ada
- [ ] Verifikasi stories tersimpan setelah load dari API
- [ ] Test search functionality → verifikasi filter bekerja
- [ ] Test sort functionality → verifikasi sorting bekerja
- [ ] Tambah cerita baru saat offline
- [ ] Verifikasi cerita masuk ke "pendingStories" store
- [ ] Kembali online
- [ ] Verifikasi pending story ter-sync dan dihapus dari pending store
- [ ] Verifikasi story baru muncul di "stories" store

## 🛠️ Teknologi & Dependencies

### Core Technologies
- **Vanilla JavaScript** - ES6+ modules, async/await
- **HTML5** - Semantic elements, forms, media devices
- **CSS3** - Custom properties, flexbox, grid, media queries

### Libraries & APIs
- **Leaflet.js 1.9.4** - Interactive maps library
- **Dicoding Story API** - Backend REST API dengan Web Push support
- **Vite 6.2.0** - Build tool & development server
- **View Transitions API** - Native page transitions
- **MediaDevices API** - Camera access for photo capture
- **Web Components** - Custom Elements architecture

### PWA Technologies (V2)
- **Service Worker API** - Caching, offline support, background sync
- **Web App Manifest** - Installable app configuration
- **IndexedDB API** - Client-side database untuk offline storage
- **Web Push API** - Server-initiated notifications
- **Cache API** - HTTP response caching
- **Notification API** - User notification display

### Build & Development
```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

## 📁 Struktur Proyek

```
berbagi-cerita/
├── public/
│   ├── manifest.json               # Web App Manifest (V2)
│   └── icons/                      # PWA icons
│       ├── icon-192x192.png
│       └── icon-512x512.png
├── src/
│   ├── sw.js                       # Service Worker (V2)
│   ├── scripts/
│   │   ├── data/
│   │   │   ├── api.js              # API integration layer
│   │   │   └── indexeddb.js        # IndexedDB wrapper (V2)
│   │   ├── pages/
│   │   │   ├── home/
│   │   │   │   └── home-page.js    # Homepage component
│   │   │   ├── map/
│   │   │   │   ── map-page.js     # Interactive map page
│   │   │   ├── add/
│   │   │   │   └── add-story-page.js # Add story form
│   │   │   ├── auth/
│   │   │   │   ├── login-page.js   # Login component
│   │   │   │   └── register-page.js # Registration component
│   │   │   ├── about/
│   │   │   │   └── about-page.js   # About page
│   │   │   └── app.js              # Main App controller
│   │   ├── routes/
│   │   │   ├── routes.js           # Route definitions
│   │   │   └── url-parser.js       # URL parsing utility
│   │   ├── utils/
│   │   │   ├── index.js            # Helper functions
│   │   │   ── push-notification.js # Push notification manager (V2)
│   │   ├── config.js               # App configuration
│   │   └── index.js                # Entry point
│   ├── styles/
│   │   └── styles.css              # Global styles
│   └── index.html                  # HTML template with SW registration
├── package.json
├── vite.config.js
├── STUDENT.txt                     # Deployment URL & credentials
└── README.md
```

## 🔑 Konfigurasi

File konfigurasi berada di `src/scripts/config.js`:

```javascript
const CONFIG = {
  BASE_URL: 'https://story-api.dicoding.dev/v1',
};
```

**Catatan:** Aplikasi menggunakan OpenStreetMap yang tidak memerlukan API key.

## ⚠️ Catatan Penting

### Kompatibilitas Browser
- **View Transitions API:** Hanya didukung di browser modern (Chrome 111+, Edge 111+)
  - Fallback tersedia untuk browser lama
- **MediaDevices API (Kamera):** 
  - Hanya bekerja di HTTPS atau localhost
  - Memerlukan izin pengguna
  - Tidak didukung di beberapa browser lama
- **GPS Accuracy:** Tergantung pada device dan browser

### Authentication Flow
- Token disimpan di `localStorage` setelah login berhasil
- Token otomatis disertakan di header Authorization untuk setiap request ke `/stories`
- Token dihapus saat logout (jika diimplementasikan)

### Accessibility Features
- **Skip to Content:** Link tersembunyi yang muncul saat Tab pertama kali ditekan
  - Langsung memindahkan fokus ke konten utama tanpa mengubah URL
  - Implementasi menggunakan JavaScript event handler (bukan pure HTML anchor)
- **Heading Hierarchy:** Struktur heading hierarkis (h1 → h2 → h3) untuk screen readers
  - Heading section disembunyikan secara visual tapi tetap semantic
  - Menggunakan "visually hidden" pattern untuk accessibility

### Performance Considerations
- Images menggunakan `loading="lazy"` untuk lazy loading
- Leaflet.js dimuat secara dinamis hanya saat halaman peta diakses
- Dynamic imports untuk optimasi bundle size

### Troubleshooting Common Issues

#### Error "Missing authentication" saat mengambil stories
**Solusi:** Pastikan sudah login dan token tersimpan di localStorage. Cek di DevTools → Application → Local Storage.

#### Kamera tidak berfungsi
**Solusi:** 
- Pastikan menggunakan HTTPS atau localhost
- Izinkan akses kamera di browser settings
- Coba gunakan browser modern (Chrome, Firefox, Edge terbaru)

#### Skip link tidak bekerja
**Solusi:** Pastikan JavaScript enabled di browser. Skip link memerlukan event handler untuk mencegah navigasi hash.

#### Peta tidak muncul
**Solusi:** 
- Periksa koneksi internet (Leaflet.js dimuat dari CDN)
- Clear browser cache dan reload
- Cek console untuk error messages

## 🎯 Kriteria Submission Checklist

### Submission V1 (Proyek Pertama) ✅
Aplikasi ini memenuhi semua kriteria submission pertama:

- ✅ **Kriteria 1:** SPA dan Transisi Halaman
- ✅ **Kriteria 2:** Data dan Marker Pada Peta
- ✅ **Kriteria 3:** Fitur Tambah Data Baru
- ✅ **Kriteria 4:** Aksesibilitas sesuai Standar WCAG

### Submission V2 (Proyek Kedua) ✅
Aplikasi ini juga memenuhi semua kriteria submission kedua:

- ✅ **Kriteria 1:** Mempertahankan Seluruh Kriteria Wajib Submission Sebelumnya
- ✅ **Kriteria 2:** Menerapkan Push Notification (Advanced - toggle button + navigation actions)
- ✅ **Kriteria 3:** Implementasi PWA dengan Dukungan Instalasi dan Mode Offline (Advanced - caching dynamic data)
- ✅ **Kriteria 4:** Penerapan IndexedDB (Advanced - offline-online synchronization)
- ✅ **Kriteria 5:** Distribusikan secara Publik (*Pending deployment*)

## 📖 Dokumentasi API

Endpoint yang digunakan dari [Dicoding Story API](https://story-api.dicoding.dev/v1/):

| Method | Endpoint | Deskripsi | Auth Required |
|--------|----------|-----------|---------------|
| POST | `/register` | Registrasi user baru | ❌ |
| POST | `/login` | Login user | ❌ |
| GET | `/stories` | Ambil daftar cerita | ✅ |
| POST | `/stories` | Tambah cerita baru | ✅ |

Untuk dokumentasi lengkap API, kunjungi: https://story-api.dicoding.dev/v1/

## 🙏 Credits

- **Developer:** Student of Dicoding Academy
- **Course:** Belajar Pengembangan Web Intermediate
- **API Provider:** [Dicoding Story API](https://story-api.dicoding.dev/v1/)
- **Map Library:** [Leaflet.js](https://leafletjs.com/)
- **Map Tiles:** [OpenStreetMap](https://www.openstreetmap.org/) & [Esri](https://www.esri.com/)
- **VAPID Public Key:** Provided by Dicoding Story API for push notifications

## 📄 License

Dibuat untuk tujuan pembelajaran Dicoding Academy.

---

**Terima kasih telah menggunakan Berbagi Cerita!** 🎉
