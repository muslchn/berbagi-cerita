# Berbagi Cerita

Berbagi Cerita adalah aplikasi web Single Page Application (SPA) dan Progressive Web App (PWA) untuk membagikan cerita lengkap dengan foto dan lokasi. Aplikasi ini dibuat untuk submission kelas Dicoding "Belajar Pengembangan Web Intermediate" dan menggunakan Dicoding Story API.

## Informasi Aplikasi

- Nama aplikasi: Berbagi Cerita
- Jenis aplikasi: SPA, PWA, dan aplikasi peta interaktif
- API utama: https://story-api.dicoding.dev/v1
- Map provider: OpenStreetMap dan Esri World Imagery melalui Leaflet
- Development URL: http://localhost:5173/
- Production URL: https://muslchn.github.io/berbagi-cerita/

## Fitur Utama

- Autentikasi pengguna dengan register, login, logout, dan route protection.
- Daftar cerita dari Dicoding Story API dengan foto, nama, deskripsi, dan tanggal.
- Peta interaktif berisi marker cerita yang memiliki koordinat.
- Layer peta OpenStreetMap dan Satellite.
- Form tambah cerita dengan upload foto, kamera, deskripsi, dan pemilihan titik lokasi dari mini map.
- View Transitions API dengan fallback untuk browser yang belum mendukung.
- Aksesibilitas dasar: skip link, semantic HTML, label form, alt text, ARIA, dan keyboard-friendly navigation.
- PWA: manifest, service worker, installable app, app-shell cache, image cache, dan offline fallback.
- IndexedDB untuk cache daftar cerita, pencarian, pengurutan, dan antrean cerita pending saat offline.
- Push notification menggunakan Web Push API dan endpoint subscription Dicoding Story API.

## Kriteria Submission

### Submission 1

- SPA dan transisi halaman.
- Menampilkan data cerita dan marker pada peta.
- Menambahkan data baru melalui form.
- Aksesibilitas sesuai kebutuhan submission.

### Submission 2

- Mempertahankan seluruh kriteria submission sebelumnya.
- Menerapkan push notification.
- Menerapkan PWA dengan manifest dan service worker.
- Menerapkan IndexedDB untuk penyimpanan lokal.
- Mendukung distribusi publik melalui GitHub Pages.

## Teknologi

- Vanilla JavaScript ES Modules
- HTML5 dan CSS3
- Vite 6
- Leaflet 1.9.4
- Dicoding Story API
- Service Worker API
- Web App Manifest
- IndexedDB
- Web Push API
- MediaDevices API
- View Transitions API

## Struktur Proyek

```text
berbagi-cerita/
├── .github/workflows/deploy.yml       # Workflow deploy GitHub Pages
├── src/
│   ├── index.html                     # Template HTML utama
│   ├── sw.js                          # Service worker
│   ├── public/
│   │   ├── favicon.png                # Ikon aplikasi
│   │   ├── manifest.json              # Web app manifest
│   │   └── images/logo.png            # Asset publik
│   ├── scripts/
│   │   ├── config.js                  # Konfigurasi API
│   │   ├── index.js                   # Entry point aplikasi
│   │   ├── data/
│   │   │   ├── api.js                 # Request ke Dicoding Story API
│   │   │   └── indexeddb.js           # Helper IndexedDB
│   │   ├── pages/                     # Halaman SPA
│   │   ├── routes/                    # Hash router
│   │   └── utils/                     # Helper umum dan push notification
│   └── styles/styles.css              # Style global
├── package.json
├── package-lock.json
├── vite.config.js
├── STUDENT.txt
└── README.md
```

## Instalasi dan Menjalankan Lokal

1. Install dependencies:

```bash
npm install
```

2. Jalankan development server:

```bash
npm run dev
```

3. Buka aplikasi:

```text
http://localhost:5173/
```

## Build dan Preview Production

Build aplikasi:

```bash
npm run build
```

Preview hasil build:

```bash
npm run preview
```

Output production dibuat di folder `dist/`.

## Deployment

Project ini sudah memiliki GitHub Actions workflow di `.github/workflows/deploy.yml`.

Alur deploy:

- Workflow berjalan saat ada push ke branch `main` atau dijalankan manual dari tab Actions.
- Dependencies di-install dengan `npm ci`.
- Aplikasi di-build dengan `npm run build`.
- Folder `dist/` diunggah ke GitHub Pages.

Pastikan pengaturan repository GitHub Pages menggunakan source "GitHub Actions".

## Konfigurasi

Konfigurasi API berada di `src/scripts/config.js`.

```js
const CONFIG = {
  BASE_URL: 'https://story-api.dicoding.dev/v1',
};
```

Aplikasi tidak membutuhkan API key untuk peta karena menggunakan tile OpenStreetMap dan Esri yang dapat diakses publik.

## Catatan PWA

- Manifest berada di `src/public/manifest.json`.
- Service worker berada di `src/sw.js` dan disalin ke `dist/sw.js` saat build.
- Cache app shell dibuat dari halaman utama, manifest, favicon, dan asset yang dikunjungi.
- API `GET` menggunakan strategi network-first dengan fallback cache.
- Gambar menggunakan strategi cache-first.
- Request non-GET tidak dicache agar proses tambah cerita dan subscription tetap aman.

## Catatan Offline dan IndexedDB

- Database: `BerbagiCeritaDB`
- Object store:
  - `stories` untuk cache cerita yang berhasil dimuat.
  - `pendingStories` untuk cerita yang dibuat saat offline atau saat request gagal.
- Saat koneksi kembali online, pending story dicoba dikirim kembali ke API.
- Search dan sort pada homepage dapat menggunakan data yang sudah tersimpan di IndexedDB.

## Panduan Testing Manual

### Autentikasi

- Buka `#/register`, buat akun dengan email valid dan password minimal 8 karakter.
- Login melalui `#/login`.
- Pastikan setelah login diarahkan ke halaman utama.
- Klik "Keluar" dan pastikan token terhapus serta aplikasi kembali ke beranda/login sesuai route.

### Daftar Cerita

- Login terlebih dahulu.
- Pastikan daftar cerita tampil di halaman utama.
- Coba search dan sort cerita.
- Matikan koneksi dari DevTools Network dan pastikan data tersimpan masih dapat tampil jika sudah pernah dimuat.

### Peta

- Buka `#/map`.
- Pastikan peta tampil dan marker muncul untuk cerita yang memiliki koordinat.
- Coba ganti layer peta.
- Klik item cerita pada daftar untuk zoom ke marker dan membuka popup.

### Tambah Cerita

- Buka `#/add` setelah login.
- Isi deskripsi.
- Upload foto atau gunakan kamera.
- Pilih lokasi dari mini map.
- Submit dan pastikan pesan sukses muncul.
- Coba mode offline untuk memastikan cerita masuk ke pending queue.

### PWA

- Jalankan aplikasi dari origin HTTPS atau localhost.
- Buka DevTools Application.
- Pastikan manifest terbaca.
- Pastikan service worker aktif.
- Reload dalam mode offline dan pastikan app shell tetap tampil.
- Install aplikasi dari browser yang mendukung PWA.

### Push Notification

- Login terlebih dahulu.
- Buka halaman `#/about`.
- Klik "Aktifkan Notifikasi".
- Izinkan permission notification.
- Pastikan status berubah menjadi aktif.
- Klik kembali untuk unsubscribe dan pastikan status nonaktif.

## Troubleshooting

- Jika cerita gagal dimuat dengan pesan autentikasi, login ulang dan pastikan token tersedia di Local Storage.
- Jika kamera tidak aktif, gunakan HTTPS atau localhost dan izinkan permission kamera di browser.
- Jika peta tidak tampil, pastikan koneksi internet tersedia karena Leaflet dan map tile dimuat dari CDN/provider eksternal.
- Jika PWA belum bisa di-install, pastikan aplikasi dijalankan dari HTTPS atau localhost dan service worker sudah terdaftar.
- Jika deployment GitHub Pages tidak berubah, cek status workflow pada tab Actions dan pastikan Pages source adalah GitHub Actions.

## Credits

- Dicoding Story API: https://story-api.dicoding.dev/v1
- Leaflet: https://leafletjs.com/
- OpenStreetMap: https://www.openstreetmap.org/
- Esri World Imagery: https://www.esri.com/

## License

Dibuat untuk tujuan pembelajaran dan submission Dicoding Academy.
