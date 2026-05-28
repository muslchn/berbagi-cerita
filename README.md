# Berbagi Cerita

Berbagi Cerita adalah Single Page Application (SPA) dan Progressive Web App (PWA) untuk membagikan cerita dengan foto dan lokasi. Aplikasi ini dibuat untuk submission kelas Dicoding **Belajar Pengembangan Web Intermediate** dan memakai Dicoding Story API sebagai sumber data utama.

## Ringkasan

- Nama aplikasi: Berbagi Cerita
- Jenis aplikasi: SPA, PWA, dan aplikasi peta interaktif
- API utama: `https://story-api.dicoding.dev/v1`
- Peta: Leaflet 1.9.4, OpenStreetMap, dan Esri World Imagery
- URL lokal: `http://localhost:5173/`
- URL produksi: `https://muslchn.github.io/berbagi-cerita/`

## Fitur

- Register, login, logout, dan proteksi halaman untuk pengguna yang belum masuk.
- Daftar cerita dari Dicoding Story API berisi foto, nama, deskripsi, tanggal, dan lokasi jika tersedia.
- Pencarian dan pengurutan cerita di halaman beranda.
- Peta interaktif dengan marker cerita, popup detail, daftar cerita, dan pilihan layer OpenStreetMap atau Satellite.
- Form tambah cerita dengan validasi deskripsi, foto, kamera, latitude, longitude, dan pemilihan titik dari peta.
- Cerita tersimpan berbasis IndexedDB melalui aksi eksplisit pengguna.
- Halaman `#/saved` untuk melihat dan menghapus cerita tersimpan.
- Antrean cerita pending di IndexedDB ketika pengguna menambah cerita saat offline atau saat request gagal.
- Push notification dengan tombol subscribe dan unsubscribe setelah login.
- PWA dengan manifest, service worker, cache app shell, cache gambar, fallback offline, dan dukungan instalasi.
- Aksesibilitas dasar melalui skip link, semantic HTML, label form, alt text, ARIA, alert status, dan navigasi keyboard.

## Rute Aplikasi

| Rute | Akses | Fungsi |
| --- | --- | --- |
| `#/login` | Publik | Masuk ke akun Dicoding Story API. |
| `#/register` | Publik | Membuat akun baru. |
| `#/` | Login | Menampilkan daftar cerita, pencarian, pengurutan, dan tombol simpan. |
| `#/map` | Login | Menampilkan cerita yang memiliki koordinat pada peta. |
| `#/add` | Login | Menambahkan cerita baru dengan foto dan lokasi. |
| `#/saved` | Login | Menampilkan cerita yang disimpan di perangkat. |
| `#/about` | Publik | Informasi aplikasi dan kontrol push notification. |

## Teknologi

- Vanilla JavaScript ES Modules
- HTML5 dan CSS3
- Vite 6
- Leaflet 1.9.4 yang dimuat dari CDN saat halaman peta dibutuhkan
- Dicoding Story API
- Service Worker API
- Web App Manifest
- IndexedDB
- Web Push API
- MediaDevices API
- View Transitions API jika tersedia di browser

## Struktur Proyek

```text
berbagi-cerita/
├── .github/workflows/deploy.yml       # Workflow deploy GitHub Pages
├── src/
│   ├── index.html                     # Template HTML utama
│   ├── sw.js                          # Service worker
│   ├── public/
│   │   ├── favicon.png                # Favicon
│   │   ├── manifest.json              # Manifest PWA
│   │   └── images/                    # Logo dan ikon PWA
│   ├── scripts/
│   │   ├── config.js                  # Konfigurasi API
│   │   ├── index.js                   # Entry point aplikasi
│   │   ├── data/                      # API client dan IndexedDB helper
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

## Instalasi

Gunakan Node.js 18 atau versi LTS yang lebih baru.

```bash
npm install
```

## Menjalankan Lokal

```bash
npm run dev
```

Buka aplikasi di:

```text
http://localhost:5173/
```

## Build dan Preview

```bash
npm run build
npm run preview
```

`npm run build` akan menjalankan Vite dengan root `src/`, menyalin aset publik, dan menyalin `src/sw.js` ke hasil build melalui plugin di `vite.config.js`.

## Konfigurasi

Konfigurasi API berada di `src/scripts/config.js`.

```js
const CONFIG = {
  BASE_URL: 'https://story-api.dicoding.dev/v1',
};
```

Aplikasi tidak membutuhkan API key untuk peta. Tile OpenStreetMap dan Esri World Imagery diakses langsung dari provider publik melalui Leaflet.

## Penyimpanan Lokal

IndexedDB dikelola oleh `src/scripts/data/indexeddb.js`.

| Database | Object store | Fungsi |
| --- | --- | --- |
| `BerbagiCeritaDB` | `savedStories` | Menyimpan cerita yang dipilih pengguna melalui tombol "Simpan Cerita". |
| `BerbagiCeritaDB` | `pendingStories` | Menyimpan cerita yang belum berhasil dikirim agar dapat dicoba kembali saat online. |

Halaman beranda akan mencoba mengambil cerita dari API. Jika request gagal, aplikasi menampilkan fallback dari cerita yang sudah disimpan di perangkat.

## PWA dan Offline

- Manifest utama berada di `src/public/manifest.json`.
- Service worker berada di `src/sw.js`.
- Service worker didaftarkan dari `src/index.html`.
- App shell, manifest, favicon, ikon, dan aset yang pernah dikunjungi disimpan di Cache Storage.
- Request API `GET` memakai strategi network-first dengan fallback cache.
- Gambar memakai strategi cache-first.
- Request non-GET tidak dicache agar login, tambah cerita, dan subscription tetap dikirim langsung ke server.

## Push Notification

Push notification dikelola oleh `src/scripts/utils/push-notification.js`.

- Tombol aktif/nonaktif notifikasi muncul di navigasi setelah login jika browser mendukung Push API.
- Kontrol notifikasi juga tersedia di halaman `#/about`.
- Subscribe meminta permission browser, membuat `PushSubscription`, lalu mengirim `endpoint`, `p256dh`, dan `auth` ke Dicoding Story API.
- Unsubscribe mengirim endpoint ke server lalu memutus subscription dari browser.
- Event `push` dan `notificationclick` ditangani di `src/sw.js`.

## Deployment

Repository memiliki workflow GitHub Pages di `.github/workflows/deploy.yml`.

Alur deploy:

1. Workflow berjalan saat push ke branch `main` atau dijalankan manual.
2. Node.js 18 disiapkan.
3. Dependencies dipasang dengan `npm ci`.
4. Aplikasi dibuild dengan `npm run build`.
5. Hasil build diunggah dan dipublikasikan ke GitHub Pages.

Pastikan pengaturan GitHub Pages pada repository menggunakan source **GitHub Actions**.

## Panduan Uji Manual

### Autentikasi

1. Buka `#/register`.
2. Buat akun dengan nama, email valid, dan password minimal 8 karakter.
3. Login melalui `#/login`.
4. Pastikan pengguna diarahkan ke halaman beranda.
5. Klik "Keluar" dan pastikan halaman terlindungi meminta login kembali.

### Daftar Cerita

1. Login terlebih dahulu.
2. Buka `#/`.
3. Pastikan daftar cerita tampil dari API.
4. Coba pencarian berdasarkan nama atau deskripsi.
5. Coba urutan terbaru, terlama, nama A-Z, dan nama Z-A.
6. Simpan salah satu cerita, lalu pastikan tombol berubah menjadi "Hapus dari Tersimpan".

### Cerita Tersimpan

1. Simpan cerita dari beranda.
2. Buka `#/saved`.
3. Pastikan cerita yang disimpan muncul.
4. Klik "Hapus dari Tersimpan".
5. Pastikan cerita hilang dari daftar.

### Peta

1. Buka `#/map`.
2. Pastikan peta tampil dan marker muncul untuk cerita yang memiliki koordinat.
3. Coba ganti layer peta.
4. Klik item cerita pada daftar untuk zoom ke marker dan membuka popup.

### Tambah Cerita

1. Buka `#/add`.
2. Isi deskripsi.
3. Upload foto atau gunakan kamera.
4. Pilih lokasi dari mini map.
5. Submit form.
6. Pastikan pesan sukses muncul dan aplikasi kembali ke beranda.

### Offline dan PWA

1. Jalankan aplikasi dari `localhost` atau HTTPS.
2. Buka DevTools Application.
3. Pastikan manifest terbaca dan service worker aktif.
4. Simpan minimal satu cerita.
5. Aktifkan mode offline dari DevTools Network.
6. Reload aplikasi dan pastikan app shell tetap tampil.
7. Buka beranda atau halaman tersimpan untuk melihat fallback cerita yang tersimpan di perangkat.
8. Buka `#/add` saat offline, tambah cerita, lalu pastikan cerita masuk ke daftar pending.

### Push Notification

1. Login terlebih dahulu.
2. Klik "Aktifkan Notifikasi" di navigasi atau halaman `#/about`.
3. Izinkan permission notification dari browser.
4. Pastikan tombol berubah menjadi "Nonaktifkan Notifikasi".
5. Tambahkan cerita baru untuk memicu notifikasi dari Dicoding Story API.
6. Klik tombol toggle lagi untuk unsubscribe.

## Troubleshooting

- Jika cerita gagal dimuat karena autentikasi, login ulang agar token diperbarui.
- Jika kamera tidak aktif, jalankan aplikasi dari HTTPS atau `localhost` dan izinkan permission kamera.
- Jika peta tidak tampil, pastikan koneksi internet tersedia karena Leaflet dan map tile dimuat dari CDN/provider eksternal.
- Jika aplikasi belum bisa diinstall sebagai PWA, pastikan service worker aktif dan aplikasi berjalan dari HTTPS atau `localhost`.
- Jika push notification gagal, pastikan permission notification diberikan, service worker sudah siap, dan pengguna masih login.
- Jika deploy GitHub Pages belum berubah, cek status workflow pada tab Actions dan pastikan Pages menggunakan source GitHub Actions.

## Credits

- Dicoding Story API: `https://story-api.dicoding.dev/v1`
- Leaflet: `https://leafletjs.com/`
- OpenStreetMap: `https://www.openstreetmap.org/`
- Esri World Imagery: `https://www.esri.com/`

## Lisensi

Dibuat untuk tujuan pembelajaran dan submission Dicoding Academy.
