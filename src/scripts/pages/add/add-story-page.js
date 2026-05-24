import { addStory } from '../../data/api';
import storyDB from '../../data/indexeddb';

export default class AddStoryPage {
  async render() {
    return `
      <section class="container add-story-container">
        <h1 class="page-title">Tambah Cerita Baru</h1>
        <p class="page-subtitle">Bagikan pengalaman Anda</p>
        
        <div id="sync-status" style="background: #d4edda; color: #155724; padding: 0.75rem; border-radius: 4px; margin-bottom: 1rem; display: none;">
          ✓ Online - Data akan langsung disimpan ke server
        </div>
        
        <form id="add-story-form" class="story-form" enctype="multipart/form-data">
          <div class="form-group">
            <label for="description">Deskripsi Cerita:</label>
            <textarea 
              id="description" 
              name="description" 
              rows="5" 
              required
              aria-required="true"
              placeholder="Tulis cerita Anda di sini..."
            ></textarea>
            <span class="error-message" id="description-error"></span>
          </div>
          
          <div class="form-group">
            <label for="photo">Foto:</label>
            <input 
              type="file" 
              id="photo" 
              name="photo" 
              accept="image/*"
              required
              aria-required="true"
            />
            <span class="help-text">Pilih foto atau ambil dari kamera</span>
            <span class="error-message" id="photo-error"></span>
          </div>
          
          <div class="form-group">
            <label for="camera">Ambil Foto dari Kamera:</label>
            <button type="button" id="camera-button" class="btn-secondary">
              Buka Kamera
            </button>
            <video id="camera-stream" autoplay playsinline style="display: none; max-width: 100%; margin-top: 10px;"></video>
            <canvas id="camera-canvas" style="display: none;"></canvas>
            <div id="camera-preview" style="display: none; margin-top: 10px;">
              <img id="captured-image" alt="Preview foto yang diambil" style="max-width: 100%;" />
              <button type="button" id="retake-button" class="btn-secondary" style="margin-top: 10px;">
                Ambil Ulang
              </button>
            </div>
          </div>
          
          <div class="form-info">
            <p><strong>Petunjuk:</strong> Klik pada peta untuk memilih lokasi cerita Anda.</p>
          </div>
          
          <div class="form-group">
            <label for="latitude">Latitude:</label>
            <input 
              type="number" 
              id="latitude" 
              name="latitude" 
              step="-90..90" 
              min="-90" 
              max="90"
              required
              aria-required="true"
              readonly
              placeholder="Klik pada peta untuk memilih"
            />
          </div>
          
          <div class="form-group">
            <label for="longitude">Longitude:</label>
            <input 
              type="number" 
              id="longitude" 
              name="longitude" 
              step="-180..180" 
              min="-180" 
              max="180"
              required
              aria-required="true"
              readonly
              placeholder="Klik pada peta untuk memilih"
            />
          </div>
          
          <div id="mini-map" class="mini-map"></div>
          
          <div id="form-message" class="form-message" role="alert" aria-live="polite"></div>
          
          <button type="submit" class="btn-primary">Tambah Cerita</button>
        </form>
        
        <div id="pending-sync-section" style="margin-top: 2rem; display: none;">
          <h3>Cerita Pending (Offline)</h3>
          <p style="color: #7f8c8d; font-size: 0.9rem;">Cerita berikut akan disinkronkan saat kembali online:</p>
          <ul id="pending-stories-list" style="list-style: none; padding: 0;"></ul>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.hash = '#/login';
      return;
    }

    // Initialize IndexedDB
    await storyDB.init();
    
    // Load Leaflet CSS and JS dynamically
    const leafletCSS = document.createElement('link');
    leafletCSS.rel = 'stylesheet';
    leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    leafletCSS.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    leafletCSS.crossOrigin = 'anonymous';
    document.head.appendChild(leafletCSS);

    const leafletJS = document.createElement('script');
    leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    leafletJS.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    leafletJS.crossOrigin = 'anonymous';
    document.head.appendChild(leafletJS);

    leafletJS.onload = () => {
      this.initializeMiniMap();
    };

    // Setup form submission
    const form = document.getElementById('add-story-form');
    form.addEventListener('submit', (e) => this.handleSubmit(e));

    // Setup camera button
    const cameraButton = document.getElementById('camera-button');
    cameraButton.addEventListener('click', () => this.openCamera());

    // Setup retake button
    const retakeButton = document.getElementById('retake-button');
    retakeButton.addEventListener('click', () => this.retakePhoto());
    
    // Setup network listeners
    this.setupNetworkListeners();
    
    // Display pending stories if any
    await this.displayPendingStories();
  }

  setupNetworkListeners() {
    const syncStatus = document.getElementById('sync-status');
    
    window.addEventListener('online', () => {
      console.log('[AddStory] Back online');
      if (syncStatus) {
        syncStatus.style.display = 'block';
        syncStatus.textContent = '✓ Online - Data akan langsung disimpan ke server';
        syncStatus.style.background = '#d4edda';
        syncStatus.style.color = '#155724';
      }
      
      // Sync pending stories
      this.syncPendingStories();
    });
    
    window.addEventListener('offline', () => {
      console.log('[AddStory] Went offline');
      if (syncStatus) {
        syncStatus.style.display = 'block';
        syncStatus.textContent = '️ Offline - Data akan disimpan lokal dan disinkronkan nanti';
        syncStatus.style.background = '#fff3cd';
        syncStatus.style.color = '#856404';
      }
    });
  }

  async displayPendingStories() {
    const pendingSection = document.getElementById('pending-sync-section');
    const pendingList = document.getElementById('pending-stories-list');
    
    try {
      const pendingStories = await storyDB.getPendingStories();
      
      if (pendingStories && pendingStories.length > 0) {
        pendingSection.style.display = 'block';
        pendingList.innerHTML = pendingStories.map(story => `
          <li style="padding: 0.5rem; background: #f8f9fa; margin-bottom: 0.5rem; border-radius: 4px;">
            <strong>${story.description.substring(0, 50)}...</strong>
            <small style="color: #7f8c8d;"> - ${new Date(story.timestamp).toLocaleString('id-ID')}</small>
          </li>
        `).join('');
      }
    } catch (error) {
      console.error('Error displaying pending stories:', error);
    }
  }

  async syncPendingStories() {
    try {
      const pendingStories = await storyDB.getPendingStories();
      
      if (!pendingStories || pendingStories.length === 0) {
        return;
      }
      
      console.log(`[AddStory] Syncing ${pendingStories.length} pending stories...`);
      
      for (const pendingStory of pendingStories) {
        try {
          const result = await addStory(pendingStory.data);
          
          if (!result.error) {
            // Remove from pending after successful sync
            await storyDB.removePendingStory(pendingStory.timestamp);
            console.log(`[AddStory] Successfully synced story ${pendingStory.timestamp}`);
          }
        } catch (error) {
          console.error(`[AddStory] Failed to sync story ${pendingStory.timestamp}:`, error);
        }
      }
      
      // Refresh pending list display
      await this.displayPendingStories();
      
    } catch (error) {
      console.error('[AddStory] Error syncing pending stories:', error);
    }
  }

  initializeMiniMap() {
    // Default center (Indonesia)
    const defaultLat = -2.5489;
    const defaultLon = 118.0149;
    
    const map = L.map('mini-map').setView([defaultLat, defaultLon], 5);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    let marker = null;

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      
      document.getElementById('latitude').value = lat.toFixed(6);
      document.getElementById('longitude').value = lng.toFixed(6);
      
      if (marker) {
        map.removeLayer(marker);
      }
      
      marker = L.marker([lat, lng]).addTo(map);
    });
  }

  async openCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      const video = document.getElementById('camera-stream');
      const cameraButton = document.getElementById('camera-button');
      const cameraPreview = document.getElementById('camera-preview');
      
      video.srcObject = stream;
      video.style.display = 'block';
      cameraButton.textContent = 'Tangkap Foto';
      cameraPreview.style.display = 'none';
      
      cameraButton.onclick = () => this.capturePhoto(stream);
    } catch (error) {
      this.showMessage('Tidak dapat mengakses kamera: ' + error.message, 'error');
    }
  }

  capturePhoto(stream) {
    const video = document.getElementById('camera-stream');
    const canvas = document.getElementById('camera-canvas');
    const cameraPreview = document.getElementById('camera-preview');
    const capturedImage = document.getElementById('captured-image');
    const photoInput = document.getElementById('photo');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
      
      // Create a DataTransfer object to set the file
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      photoInput.files = dataTransfer.files;
      
      capturedImage.src = URL.createObjectURL(blob);
      video.style.display = 'none';
      cameraPreview.style.display = 'block';
      
      // Stop the stream
      stream.getTracks().forEach(track => track.stop());
      
      const cameraButton = document.getElementById('camera-button');
      cameraButton.textContent = 'Buka Kamera';
      cameraButton.onclick = () => this.openCamera();
    }, 'image/jpeg');
  }

  retakePhoto() {
    const cameraPreview = document.getElementById('camera-preview');
    const photoInput = document.getElementById('photo');
    
    cameraPreview.style.display = 'none';
    photoInput.value = '';
    
    this.openCamera();
  }

  validateForm() {
    const description = document.getElementById('description').value.trim();
    const photo = document.getElementById('photo').files[0];
    const latitude = document.getElementById('latitude').value;
    const longitude = document.getElementById('longitude').value;
    
    let isValid = true;
    
    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
    
    if (!description) {
      document.getElementById('description-error').textContent = 'Deskripsi harus diisi';
      isValid = false;
    }
    
    if (!photo) {
      document.getElementById('photo-error').textContent = 'Foto harus dipilih';
      isValid = false;
    }
    
    if (!latitude || !longitude) {
      this.showMessage('Silakan pilih lokasi pada peta', 'error');
      isValid = false;
    }
    
    return isValid;
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    if (!this.validateForm()) {
      return;
    }
    
    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = 'Menyimpan...';
    
    try {
      const description = document.getElementById('description').value.trim();
      const photo = document.getElementById('photo').files[0];
      const lat = parseFloat(document.getElementById('latitude').value);
      const lon = parseFloat(document.getElementById('longitude').value);
      
      const storyData = { description, lat, lon, photo };
      
      // Check if online
      if (navigator.onLine) {
        // Submit directly to API
        const result = await addStory(storyData);
        
        if (result.error) {
          this.showMessage(`Gagal menambah cerita: ${result.message}`, 'error');
        } else {
          this.showMessage('Cerita berhasil ditambahkan!', 'success');
          
          // Reset form
          e.target.reset();
          document.getElementById('latitude').value = '';
          document.getElementById('longitude').value = '';
          
          // Redirect to home after 2 seconds
          setTimeout(() => {
            window.location.hash = '#/';
          }, 2000);
        }
      } else {
        // Store in IndexedDB for later sync
        await storyDB.addPendingStory(storyData);
        
        this.showMessage('Cerita disimpan offline. Akan disinkronkan saat kembali online.', 'success');
        
        // Reset form
        e.target.reset();
        document.getElementById('latitude').value = '';
        document.getElementById('longitude').value = '';
        
        // Refresh pending list
        await this.displayPendingStories();
      }
    } catch (error) {
      console.error('Error adding story:', error);
      
      // If API fails, store in IndexedDB
      if (navigator.onLine) {
        try {
          await storyDB.addPendingStory({ description, lat, lon, photo });
          this.showMessage('Gagal mengirim ke server. Disimpan offline untuk sinkronisasi nanti.', 'info');
        } catch (dbError) {
          this.showMessage('Terjadi kesalahan saat menyimpan cerita', 'error');
        }
      } else {
        this.showMessage('Terjadi kesalahan saat menyimpan cerita', 'error');
      }
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Tambah Cerita';
    }
  }

  showMessage(message, type) {
    const messageElement = document.getElementById('form-message');
    messageElement.textContent = message;
    messageElement.className = `form-message ${type}`;
    
    setTimeout(() => {
      messageElement.textContent = '';
      messageElement.className = 'form-message';
    }, 5000);
  }
}
