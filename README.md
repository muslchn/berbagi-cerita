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
- Pencarian dan pengurutan cerita pada halaman beranda.
- Peta interaktif berisi marker cerita yang memiliki koordinat.
- Layer peta OpenStreetMap dan Satellite.
- Form tambah cerita dengan upload foto, kamera, deskripsi, dan pemilihan titik lokasi dari mini map.
- Fitur simpan cerita berbasis IndexedDB melalui tombol "Simpan Cerita" pada setiap kartu cerita.
- Halaman "Cerita Tersimpan" untuk melihat dan menghapus cerita yang sudah disimpan pengguna.
- Antrean cerita pending di IndexedDB saat pengguna menambahkan cerita ketika offline atau saat request gagal.
- Push notification dengan tombol aktif/nonaktif setelah login dan integrasi endpoint subscription Dicoding Story API.
- PWA: manifest, service worker, installable app, app-shell cache, image cache, dan offline fallback.
- Aksesibilitas dasar: skip link, semantic HTML, label form terasosiasi, alt text, ARIA, dan navigasi ramah keyboard.

## Kriteria Submission

### Submission 1

- Menerapkan SPA dengan hash routing.
- Menampilkan data cerita dari API.
- Menampilkan lokasi cerita pada peta interaktif.
- Menambahkan cerita baru melalui form.
- Menyediakan aksesibilitas dasar untuk elemen interaktif dan konten gambar.

### Submission 2

- Mempertahankan seluruh kriteria wajib submission sebelumnya.
- Menerapkan push notification melalui service worker dan subscription ke server.
- Menerapkan PWA dengan manifest, service worker, instalasi, dan dukungan offline.
- Memanfaatkan IndexedDB untuk data yang dipilih pengguna, yaitu cerita tersimpan.
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
│   │   └── images/
│   │       ├── icon-192.png           # Ikon PWA
│   │       └── logo.png               # Logo aplikasi
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

## Deployment

Project ini memiliki GitHub Actions workflow di `.github/workflows/deploy.yml`.

Alur deploy:

- Workflow berjalan saat ada push ke branch `main` atau dijalankan manual dari tab Actions.
- Dependencies di-install dengan `npm ci`.
- Aplikasi di-build dengan `npm run build`.
- Hasil build diunggah ke GitHub Pages.

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
- Service worker berada di `src/sw.js` dan disalin saat build.
- Cache app shell dibuat dari halaman utama, manifest, favicon, dan aset yang dikunjungi.
- API `GET` menggunakan strategi network-first dengan fallback cache.
- Gambar menggunakan strategi cache-first.
- Request non-GET tidak dicache agar proses tambah cerita dan subscription tetap aman.

## Catatan IndexedDB

- Database: `BerbagiCeritaDB`
- Object store `savedStories` menyimpan cerita hanya setelah pengguna menekan tombol "Simpan Cerita".
- Object store `pendingStories` menyimpan antrean cerita yang perlu dikirim ulang saat koneksi kembali tersedia.
- Halaman `#/saved` menampilkan daftar cerita tersimpan dan menyediakan tombol hapus.
- Saat offline, halaman beranda dapat menampilkan cerita yang sudah disimpan pengguna di perangkat.

## Catatan Push Notification

- Tombol toggle push notification tersedia di navigasi setelah pengguna login.
- Tombol juga tersedia di halaman `#/about`.
- Proses subscribe meminta permission notification, membuat `PushSubscription`, lalu mengirim `endpoint`, `p256dh`, dan `auth` ke Dicoding Story API.
- Proses unsubscribe mengirim endpoint subscription ke server lalu memutus subscription dari browser.
- Push notification dari server ditangani oleh `src/sw.js` melalui event `push`.

## Panduan Testing Manual

### Autentikasi

- Buka `#/register`, buat akun dengan email valid dan password minimal 8 karakter.
- Login melalui `#/login`.
- Pastikan setelah login diarahkan ke halaman utama.
- Klik "Keluar" dan pastikan token terhapus.

### Daftar dan Simpan Cerita

- Login terlebih dahulu.
- Pastikan daftar cerita tampil di halaman utama.
- Coba search dan sort cerita.
- Klik "Simpan Cerita" pada salah satu kartu.
- Buka `#/saved` dan pastikan cerita tersimpan muncul.
- Klik "Hapus dari Tersimpan" dan pastikan cerita terhapus dari daftar.
- Matikan koneksi dari DevTools Network dan pastikan cerita yang sudah disimpan masih dapat tampil.

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
- Klik "Aktifkan Notifikasi" di navigasi atau halaman `#/about`.
- Izinkan permission notification.
- Pastikan tombol berubah menjadi "Nonaktifkan Notifikasi".
- Tambahkan cerita baru untuk memicu push notification dari API.
- Klik kembali tombol toggle untuk unsubscribe.

## Troubleshooting

- Jika cerita gagal dimuat dengan pesan autentikasi, login ulang dan pastikan token tersedia di Local Storage.
- Jika kamera tidak aktif, gunakan HTTPS atau localhost dan izinkan permission kamera di browser.
- Jika peta tidak tampil, pastikan koneksi internet tersedia karena Leaflet dan map tile dimuat dari CDN/provider eksternal.
- Jika PWA belum bisa di-install, pastikan aplikasi dijalankan dari HTTPS atau localhost dan service worker sudah terdaftar.
- Jika push notification tidak muncul, pastikan permission notification sudah diizinkan, service worker aktif, dan subscription berhasil dibuat.
- Jika deployment GitHub Pages tidak berubah, cek status workflow pada tab Actions dan pastikan Pages source adalah GitHub Actions.

## Credits

- Dicoding Story API: https://story-api.dicoding.dev/v1
- Leaflet: https://leafletjs.com/
- OpenStreetMap: https://www.openstreetmap.org/
- Esri World Imagery: https://www.esri.com/

## License

Dibuat untuk tujuan pembelajaran dan submission Dicoding Academy.
