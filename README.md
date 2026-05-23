# Berbagi Cerita - Aplikasi Berbagi Pengalaman

Aplikasi web Single Page Application (SPA) untuk berbagi cerita dan pengalaman dari berbagai tempat. Dibuat sebagai submission untuk kelas Dicoding Academy "Menjadi Front-End Web Developer Expert".

## Fitur Utama

### 1. **Beranda**
- Menampilkan daftar cerita dari berbagai pengguna
- Menampilkan foto, nama, deskripsi, dan tanggal cerita
- Layout responsive dengan grid system

### 2. **Peta Interaktif**
- Visualisasi lokasi cerita menggunakan marker pada peta digital
- Multiple tile layers (OpenStreetMap dan Satellite)
- Layer control untuk berganti tampilan peta
- Interaksi klik pada list cerita untuk zoom ke lokasi
- Popup marker menampilkan detail cerita

### 3. **Tambah Cerita Baru**
- Form penambahan cerita dengan validasi input
- Upload foto atau ambil langsung dari kamera (media stream)
- Pemilihan lokasi melalui klik pada mini-map
- Pengiriman data ke API secara asynchronous
- Feedback pesan sukses/error yang jelas

### 4. **Autentikasi**
- Halaman login dan register
- Token-based authentication
- Protected routes untuk fitur tambah cerita
- Logout functionality

### 5. **Aksesibilitas (WCAG Compliant)**
- Skip to content link
- Semantic HTML elements
- Proper labels pada form elements
- Keyboard navigation support
- Alt text pada semua gambar
- ARIA attributes untuk screen readers

### 6. **Responsive Design**
- Mobile-first approach
- Optimized untuk berbagai ukuran layar:
  - Mobile: 375px
  - Tablet: 768px
  - Desktop: 1024px+

## Teknologi yang Digunakan

- **Vanilla JavaScript** - Tanpa framework/library
- **Leaflet.js** - Library peta interaktif
- **Dicoding Story API** - REST API untuk menyimpan dan mengambil data cerita
- **Vite** - Build tool dan development server
- **CSS3** - Styling dengan modern features
- **Web Components** - Custom Elements dan Shadow DOM
- **MediaDevices API** - Akses kamera untuk capture foto
- **View Transitions API** - Transisi halaman yang halus

## Installation

1. Clone repository ini
2. Install dependencies:
   ```bash
   npm install
   ```

3. Jalankan development server:
   ```bash
   npm run dev
   ```

4. Buka browser dan akses `http://localhost:5173/`

## Build untuk Production

```bash
npm run build
```

Output akan ada di folder `dist/`

## Struktur Proyek

```
berbagi-cerita/
├── src/
│   ├── scripts/
│   │   ├── data/
│   │   │   └── api.js              # Fungsi-fungsi API
│   │   ├── pages/
│   │   │   ├── home/
│   │   │   │   └── home-page.js    # Halaman beranda
│   │   │   ├── map/
│   │   │   │   └── map-page.js     # Halaman peta
│   │   │   ├── add/
│   │   │   │   └── add-story-page.js # Halaman tambah cerita
│   │   │   ├── auth/
│   │   │   │   ├── login-page.js   # Halaman login
│   │   │   │   └── register-page.js # Halaman register
│   │   │   ├── about/
│   │   │   │   └── about-page.js   # Halaman tentang
│   │   │   └── app.js              # Main App component
│   │   ├── routes/
│   │   │   ├── routes.js           # Route definitions
│   │   │   └── url-parser.js       # URL parser utility
│   │   ├── utils/
│   │   │   └── index.js            # Utility functions
│   │   ├── config.js               # Configuration
│   │   └── index.js                # Entry point
│   ├── styles/
│   │   └── styles.css              # Global styles
│   └── index.html                  # Main HTML
├── package.json
├── vite.config.js
└── STUDENT.txt
```

## API Endpoints

Menggunakan [Dicoding Story API](https://story-api.dicoding.dev/v1/)

- `GET /stories` - Mengambil daftar cerita
- `POST /stories` - Menambah cerita baru
- `POST /login` - Login user
- `POST /register` - Register user

## Kriteria Submission

Aplikasi ini memenuhi semua kriteria submission Dicoding Academy:

### ✅ Kriteria 1: SPA dan Transisi Halaman
- Menerapkan arsitektur Single-Page Application
- Navigasi antar halaman tanpa reload (hash routing)
- View transitions untuk transisi yang halus
- Pemisahan halaman authentication dan homepage

### ✅ Kriteria 2: Data dan Marker Peta
- Menampilkan data dari API (gambar, nama, deskripsi, tanggal)
- Visualisasi lokasi pada peta dengan marker dan popup
- Multiple tile layers (OpenStreetMap & Satellite)
- Layer control untuk interaktivitas peta
- Sinkronisasi list dan peta

### ✅ Kriteria 3: Fitur Tambah Data
- Form tambah cerita dengan upload file
- Pemilihan lokasi via klik pada peta
- HTTP Request asynchronous ke API
- Validasi input yang jelas
- Pesan error/sukses yang informatif
- Opsi capture foto dari kamera (media stream)
- Media stream ditutup setelah digunakan

### ✅ Kriteria 4: Aksesibilitas
- Alternatif teks pada semua gambar
- HTML elements yang semantik
- Label pada setiap elemen input
- Responsive design (mobile, tablet, desktop)
- Skip to content feature
- Keyboard navigable

## Konfigurasi

File `STUDENT.txt` berisi konfigurasi jika diperlukan:

```
APP_URL=<url_aplikasi>
MAP_SERVICE_API_KEY=<api_key>
```

**Catatan:** Aplikasi ini menggunakan OpenStreetMap yang tidak memerlukan API key.

## License

Dibuat untuk tujuan pembelajaran Dicoding Academy.

## Credits

- **Developer:** Student of Dicoding Academy
- **API:** [Dicoding Story API](https://story-api.dicoding.dev/v1/)
- **Map:** [Leaflet.js](https://leafletjs.com/) & [OpenStreetMap](https://www.openstreetmap.org/)
