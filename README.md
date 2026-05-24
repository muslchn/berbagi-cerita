# Berbagi Cerita - Aplikasi Berbagi Pengalaman

Aplikasi web Single Page Application (SPA) untuk berbagi cerita dan pengalaman dari berbagai tempat. Dibuat sebagai submission untuk kelas Dicoding Academy "Belajar Pengembangan Web Intermediate".

## 📋 Informasi Aplikasi

- **Nama:** Berbagi Cerita
- **Tema:** Platform berbagi pengalaman perjalanan dari berbagai lokasi
- **API:** [Dicoding Story API](https://story-api.dicoding.dev/v1/)
- **Layanan Peta:** OpenStreetMap & Esri Satellite (tanpa API key)
- **URL Demo:** `http://localhost:5173/` (development)

## ✨ Fitur yang Diimplementasikan

### 1. SPA & Transisi Halaman (Advance)
- ✅ Single-Page Application dengan hash routing
- ✅ Navigasi tanpa reload halaman
- ✅ View Transitions API untuk transisi halus antar halaman
- ✅ Pemisahan halaman authentication (login/register) dan homepage

### 2. Data & Marker Peta (Advance)
- ✅ Menampilkan data dari API (foto, nama, deskripsi, tanggal)
- ✅ Interactive map dengan Leaflet.js dan markers
- ✅ Multiple tile layers (OpenStreetMap & Satellite)
- ✅ Layer control untuk berganti tampilan peta
- ✅ Sinkronisasi list dan peta (klik list → zoom ke lokasi)
- ✅ Popup marker menampilkan detail cerita

### 3. Fitur Tambah Data (Advance)
- ✅ Form tambah cerita dengan upload file
- ✅ Pemilihan lokasi via mini-map interaktif
- ✅ HTTP Request asynchronous ke API
- ✅ Validasi input yang jelas dan user-friendly
- ✅ Camera capture menggunakan MediaDevices API
- ✅ Media stream ditutup setelah digunakan
- ✅ Feedback pesan sukses/error yang informatif

### 4. Aksesibilitas (Advance)
- ✅ Skip to content link
- ✅ Semantic HTML elements (`<header>`, `<main>`, `<article>`, dll.)
- ✅ Labels pada semua form inputs
- ✅ Alt text pada semua gambar
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Keyboard navigation support
- ✅ ARIA attributes untuk screen readers

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

## 🛠️ Teknologi & Dependencies

### Core Technologies
- **Vanilla JavaScript** - ES6+ modules, async/await
- **HTML5** - Semantic elements, forms, media devices
- **CSS3** - Custom properties, flexbox, grid, media queries

### Libraries & APIs
- **Leaflet.js 1.9.4** - Interactive maps library
- **Dicoding Story API** - Backend REST API
- **Vite 6.2.0** - Build tool & development server
- **View Transitions API** - Native page transitions
- **MediaDevices API** - Camera access for photo capture
- **Web Components** - Custom Elements architecture

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
├── src/
│   ├── scripts/
│   │   ├── data/
│   │   │   └── api.js              # API integration layer
│   │   ├── pages/
│   │   │   ├── home/
│   │   │   │   └── home-page.js    # Homepage component
│   │   │   ├── map/
│   │   │   │   └── map-page.js     # Interactive map page
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
│   │   │   └── index.js            # Helper functions
│   │   ├── config.js               # App configuration
│   │   └── index.js                # Entry point
│   ├── styles/
│   │   └── styles.css              # Global styles
│   └── index.html                  # HTML template
├── package.json
├── vite.config.js
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

Aplikasi ini memenuhi semua kriteria submission Dicoding Academy:

- ✅ **Kriteria 1:** SPA dan Transisi Halaman
- ✅ **Kriteria 2:** Data dan Marker Pada Peta
- ✅ **Kriteria 3:** Fitur Tambah Data Baru
- ✅ **Kriteria 4:** Aksesibilitas sesuai Standar WCAG

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

## 📄 License

Dibuat untuk tujuan pembelajaran Dicoding Academy.

---

**Terima kasih telah menggunakan Berbagi Cerita!** 🎉
