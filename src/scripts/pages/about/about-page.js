import pushManager from '../../utils/push-notification';

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
              <li><strong>Push Notification:</strong> Notifikasi real-time saat ada cerita baru</li>
              <li><strong>Offline Support:</strong> Akses aplikasi tanpa koneksi internet</li>
            </ul>
          </article>
          
          <article class="about-section">
            <h2>Notifikasi Push</h2>
            <p>Aktifkan notifikasi push untuk mendapatkan pemberitahuan saat ada cerita baru!</p>
            
            <div class="push-notification-controls" style="margin-top: 1rem;">
              <button id="toggle-push-btn" class="btn-primary" style="width: auto; padding: 0.75rem 1.5rem;">
                Aktifkan Notifikasi
              </button>
              <span id="push-status" style="margin-left: 1rem; color: #7f8c8d;"></span>
            </div>
            
            <div id="push-message" class="form-message" style="margin-top: 1rem;" role="alert" aria-live="polite"></div>
          </article>
          
          <article class="about-section">
            <h2>Teknologi yang Digunakan</h2>
            <ul>
              <li>Single Page Application (SPA) dengan vanilla JavaScript</li>
              <li>Leaflet.js untuk peta interaktif</li>
              <li>Dicoding Story API</li>
              <li>Progressive Web App (PWA) dengan Service Worker</li>
              <li>IndexedDB untuk penyimpanan offline</li>
              <li>Web Push API untuk notifikasi real-time</li>
              <li>Web Accessibility (WCAG) compliant</li>
              <li>Responsive Design</li>
            </ul>
          </article>
          
          <article class="about-section">
            <h2>Dibuat Untuk</h2>
            <p>
              Aplikasi ini dibuat sebagai submission untuk kelas Dicoding Academy 
              "Belajar Pengembangan Web Intermediate".
            </p>
          </article>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Setup push notification toggle
    await this.setupPushNotification();
  }

  async setupPushNotification() {
    const toggleBtn = document.getElementById('toggle-push-btn');
    const statusText = document.getElementById('push-status');
    const messageEl = document.getElementById('push-message');

    if (!toggleBtn || !statusText) return;

    // Check initial subscription status
    const isSubscribed = await pushManager.isSubscribed();
    this.updatePushUI(isSubscribed, statusText);

    // Add click handler
    toggleBtn.addEventListener('click', async () => {
      try {
        toggleBtn.disabled = true;
        toggleBtn.textContent = 'Memproses...';

        const newStatus = await pushManager.toggleSubscription();
        this.updatePushUI(newStatus, statusText);
        
        if (newStatus) {
          this.showMessage(messageEl, 'Notifikasi berhasil diaktifkan!', 'success');
        } else {
          this.showMessage(messageEl, 'Notifikasi berhasil dinonaktifkan.', 'info');
        }
      } catch (error) {
        console.error('Error toggling push notification:', error);
        this.showMessage(messageEl, 'Gagal mengubah status notifikasi: ' + error.message, 'error');
      } finally {
        toggleBtn.disabled = false;
        const isCurrentlySubscribed = await pushManager.isSubscribed();
        toggleBtn.textContent = isCurrentlySubscribed ? 'Nonaktifkan Notifikasi' : 'Aktifkan Notifikasi';
      }
    });
  }

  updatePushUI(isSubscribed, statusElement) {
    const toggleBtn = document.getElementById('toggle-push-btn');
    
    if (isSubscribed) {
      statusElement.textContent = '✓ Notifikasi aktif';
      statusElement.style.color = '#27ae60';
      if (toggleBtn) {
        toggleBtn.textContent = 'Nonaktifkan Notifikasi';
        toggleBtn.classList.remove('btn-primary');
        toggleBtn.classList.add('btn-secondary');
      }
    } else {
      statusElement.textContent = ' Notifikasi nonaktif';
      statusElement.style.color = '#95a5a6';
      if (toggleBtn) {
        toggleBtn.textContent = 'Aktifkan Notifikasi';
        toggleBtn.classList.remove('btn-secondary');
        toggleBtn.classList.add('btn-primary');
      }
    }
  }

  showMessage(element, message, type) {
    if (!element) return;
    
    element.textContent = message;
    element.className = `form-message ${type}`;
    
    setTimeout(() => {
      element.textContent = '';
      element.className = 'form-message';
    }, 5000);
  }
}
