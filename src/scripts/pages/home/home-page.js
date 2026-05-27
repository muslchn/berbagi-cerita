import { getStories } from '../../data/api';
import storyDB from '../../data/indexeddb';
import { escapeHTML } from '../../utils';

export default class HomePage {
  async render() {
    return `
      <section class="container home-container">
        <h1 class="page-title">Berbagi Cerita</h1>
        <p class="page-subtitle">Temukan cerita dari berbagai tempat</p>
        
        <div class="story-controls" style="margin-bottom: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <input 
            type="text" 
            id="search-input" 
            placeholder="Cari cerita..." 
            style="flex: 1; min-width: 200px; padding: 0.5rem; border: 2px solid #ddd; border-radius: 4px;"
          />
          <select 
            id="sort-select" 
            style="padding: 0.5rem; border: 2px solid #ddd; border-radius: 4px;"
          >
            <option value="createdAt-desc">Terbaru</option>
            <option value="createdAt-asc">Terlama</option>
            <option value="name-asc">Nama A-Z</option>
            <option value="name-desc">Nama Z-A</option>
          </select>
        </div>
        
        <h2 class="stories-heading">Daftar Cerita Terbaru</h2>
        
        <div id="stories-list" class="stories-list">
          <p class="loading-text">Memuat cerita...</p>
        </div>
        
        <div id="offline-indicator" style="display: none; background: #fff3cd; color: #856404; padding: 1rem; border-radius: 4px; margin-top: 1rem;">
          Mode Offline - Menampilkan data yang tersimpan di perangkat
        </div>
      </section>
    `;
  }

  async afterRender() {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.hash = '#/login';
      return;
    }

    // Initialize IndexedDB
    await storyDB.init();
    
    // Load stories from API and cache to IndexedDB
    await this.loadAndCacheStories();
    
    // Setup search and sort controls
    this.setupControls();
    
    // Listen for online/offline events
    this.setupNetworkListeners();
  }

  async loadAndCacheStories() {
    const storiesList = document.getElementById('stories-list');
    const offlineIndicator = document.getElementById('offline-indicator');
    
    try {
      // Check network status
      if (!navigator.onLine) {
        // Load from IndexedDB when offline
        offlineIndicator.style.display = 'block';
        await this.loadStoriesFromIndexedDB();
        return;
      }
      
      // Fetch from API when online
      const result = await getStories(1);
      
      if (result.error) {
        storiesList.innerHTML = `<p class="error-text">Gagal memuat cerita: ${result.message}</p>`;
        return;
      }
      
      if (!result.listStory || result.listStory.length === 0) {
        storiesList.innerHTML = '<p class="empty-text">Belum ada cerita</p>';
        return;
      }
      
      // Cache stories to IndexedDB
      for (const story of result.listStory) {
        await storyDB.addStory(story);
      }
      
      // Display stories
      this.displayStories(result.listStory);
      
    } catch (error) {
      console.error('Error fetching stories:', error);
      
      // Fallback to IndexedDB on error
      offlineIndicator.style.display = 'block';
      await this.loadStoriesFromIndexedDB();
    }
  }

  async loadStoriesFromIndexedDB() {
    const storiesList = document.getElementById('stories-list');
    
    try {
      const stories = await storyDB.getAllStories();
      
      if (!stories || stories.length === 0) {
        storiesList.innerHTML = '<p class="empty-text">Tidak ada cerita tersimpan. Silakan terhubung ke internet.</p>';
        return;
      }
      
      this.displayStories(stories);
    } catch (error) {
      console.error('Error loading from IndexedDB:', error);
      storiesList.innerHTML = '<p class="error-text">Gagal memuat data offline</p>';
    }
  }

  displayStories(stories) {
    const storiesList = document.getElementById('stories-list');
    
    storiesList.innerHTML = stories.map(story => `
      <article class="story-card">
        <img src="${escapeHTML(story.photoUrl)}" alt="${escapeHTML(story.description.substring(0, 50))}" loading="lazy" />
        <div class="story-content">
          <h3>${escapeHTML(story.name)}</h3>
          <p>${escapeHTML(story.description)}</p>
          <small class="story-date">${new Date(story.createdAt).toLocaleDateString('id-ID')}</small>
        </div>
      </article>
    `).join('');
  }

  setupControls() {
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    
    // Search handler
    if (searchInput) {
      let debounceTimer;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.filterAndSortStories(e.target.value, sortSelect?.value || 'createdAt-desc');
        }, 300);
      });
    }
    
    // Sort handler
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.filterAndSortStories(searchInput?.value || '', e.target.value);
      });
    }
  }

  async filterAndSortStories(searchTerm, sortValue) {
    const [sortBy, order] = sortValue.split('-');
    
    const options = {
      search: searchTerm || undefined,
      sortBy: sortBy,
      order: order
    };
    
    const filteredStories = await storyDB.getAllStories(options);
    this.displayStories(filteredStories);
  }

  setupNetworkListeners() {
    window.addEventListener('online', () => {
      console.log('[HomePage] Back online, reloading stories...');
      const offlineIndicator = document.getElementById('offline-indicator');
      if (offlineIndicator) {
        offlineIndicator.style.display = 'none';
      }
      this.loadAndCacheStories();
    });
    
    window.addEventListener('offline', () => {
      console.log('[HomePage] Went offline, switching to IndexedDB...');
      const offlineIndicator = document.getElementById('offline-indicator');
      if (offlineIndicator) {
        offlineIndicator.style.display = 'block';
      }
      this.loadStoriesFromIndexedDB();
    });
  }
}
