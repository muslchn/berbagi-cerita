export default class AboutPage {
  async render() {
    return `
      <section class="container about-container">
        <h1 class="page-title">Tentang Aplikasi</h1>
        <p class="page-subtitle">Berbagi Cerita - Aplikasi Berbagi Pengalaman</p>
        
        <div class="about-content">
          <article class="about-section">
            <h2>Apa itu Berbagi Cerita?</h2>
            <p>
              Berbagi Cerita adalah aplikasi web yang memungkinkan Anda untuk berbagi pengalaman 
              dan cerita dari berbagai tempat. Anda dapat menambahkan cerita baru dengan foto 
              dan melihat lokasi cerita-cerita tersebut pada peta interaktif.
            </p>
          </article>
          
          <article class="about-section">
            <h2>Fitur Utama</h2>
            <ul>
              <li><strong>Beranda:</strong> Melihat daftar cerita dari berbagai pengguna</li>
              <li><strong>Peta:</strong> Menjelajahi cerita berdasarkan lokasi dengan marker interaktif</li>
              <li><strong>Tambah Cerita:</strong> Menambahkan cerita baru dengan foto dan lokasi</li>
              <li><strong>Autentikasi:</strong> Sistem login dan register untuk keamanan</li>
            </ul>
          </article>
          
          <article class="about-section">
            <h2>Teknologi yang Digunakan</h2>
            <ul>
              <li>Single Page Application (SPA) dengan vanilla JavaScript</li>
              <li>Leaflet.js untuk peta interaktif</li>
              <li>Dicoding Story API</li>
              <li>Web Accessibility (WCAG) compliant</li>
              <li>Responsive Design</li>
            </ul>
          </article>
          
          <article class="about-section">
            <h2>Dibuat Untuk</h2>
            <p>
              Aplikasi ini dibuat sebagai submission untuk kelas Dicoding Academy 
              "Menjadi Front-End Web Developer Expert".
            </p>
          </article>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // No additional rendering needed
  }
}
