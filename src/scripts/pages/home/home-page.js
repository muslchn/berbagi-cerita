import { getStories } from '../../data/api';
import storyDB from '../../data/indexeddb';
import { escapeHTML } from '../../utils';

export default class HomePage {
  #stories = [];

  async render() {
    return `
      <section class="container home-container">
        <h1 class="page-title">Berbagi Cerita</h1>
        <p class="page-subtitle">Temukan cerita dari berbagai tempat</p>
        
        <div class="story-controls">
          <div class="story-control-field">
            <label for="search-input">Cari cerita</label>
            <input 
              type="text" 
              id="search-input" 
              placeholder="Cari cerita..." 
            />
          </div>
          <div class="story-control-field">
            <label for="sort-select">Urutkan cerita</label>
            <select id="sort-select">
              <option value="createdAt-desc">Terbaru</option>
              <option value="createdAt-asc">Terlama</option>
              <option value="name-asc">Nama A-Z</option>
              <option value="name-desc">Nama Z-A</option>
            </select>
          </div>
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
    
    await this.loadStories();
    
    // Setup search and sort controls
    this.setupControls();
    
    // Listen for online/offline events
    this.setupNetworkListeners();
  }

  async loadStories() {
    const storiesList = document.getElementById('stories-list');
    const offlineIndicator = document.getElementById('offline-indicator');
    
    try {
      const result = await getStories(1);
      
      if (result.error) {
        storiesList.innerHTML = `<p class="error-text">Gagal memuat cerita: ${result.message}</p>`;
        return;
      }
      
      if (!result.listStory || result.listStory.length === 0) {
        storiesList.innerHTML = '<p class="empty-text">Belum ada cerita</p>';
        return;
      }
      
      offlineIndicator.style.display = 'none';
      this.#stories = result.listStory;
      await this.displayStories(result.listStory);
      
    } catch (error) {
      console.error('Error fetching stories:', error);
      
      offlineIndicator.style.display = 'block';
      await this.loadSavedStoriesFallback();
    }
  }

  async loadSavedStoriesFallback() {
    const storiesList = document.getElementById('stories-list');
    
    try {
      const stories = await storyDB.getSavedStories({ sortBy: 'createdAt', order: 'desc' });
      
      if (!stories || stories.length === 0) {
        storiesList.innerHTML = '<p class="empty-text">Tidak ada cerita tersimpan di perangkat ini.</p>';
        return;
      }
      
      this.#stories = stories;
      await this.displayStories(stories);
    } catch (error) {
      console.error('Error loading from IndexedDB:', error);
      storiesList.innerHTML = '<p class="error-text">Gagal memuat cerita tersimpan</p>';
    }
  }

  async displayStories(stories) {
    const storiesList = document.getElementById('stories-list');
    const savedStoryIds = new Set((await storyDB.getSavedStories()).map((story) => story.id));
    
    storiesList.innerHTML = stories.map(story => `
      <article class="story-card">
        <img src="${escapeHTML(story.photoUrl)}" alt="${escapeHTML(story.description.substring(0, 50))}" loading="lazy" />
        <div class="story-content">
          <h3>${escapeHTML(story.name)}</h3>
          <p>${escapeHTML(story.description)}</p>
          <small class="story-date">${new Date(story.createdAt).toLocaleDateString('id-ID')}</small>
          <button
            type="button"
            class="btn-save-story ${savedStoryIds.has(story.id) ? 'saved' : ''}"
            data-story-id="${escapeHTML(story.id)}"
          >
            ${savedStoryIds.has(story.id) ? 'Hapus dari Tersimpan' : 'Simpan Cerita'}
          </button>
        </div>
      </article>
    `).join('');

    this.setupSaveButtons();
  }

  setupSaveButtons() {
    document.querySelectorAll('.btn-save-story').forEach((button) => {
      button.addEventListener('click', async () => {
        const storyId = button.dataset.storyId;
        const story = this.#stories.find((item) => item.id === storyId);

        if (!story) {
          return;
        }

        button.disabled = true;

        try {
          const savedStory = await storyDB.getSavedStoryById(storyId);

          if (savedStory) {
            await storyDB.deleteSavedStory(storyId);
            button.textContent = 'Simpan Cerita';
            button.classList.remove('saved');
          } else {
            await storyDB.saveStory(story);
            button.textContent = 'Hapus dari Tersimpan';
            button.classList.add('saved');
          }
        } catch (error) {
          console.error('Error toggling saved story:', error);
        } finally {
          button.disabled = false;
        }
      });
    });
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
    
    let filteredStories = [...this.#stories];

    if (options.search) {
      const searchTerm = options.search.toLowerCase();
      filteredStories = filteredStories.filter((story) =>
        story.name.toLowerCase().includes(searchTerm) ||
        story.description.toLowerCase().includes(searchTerm)
      );
    }

    filteredStories.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === 'createdAt') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (typeof valA === 'string' && typeof valB === 'string') {
        return order === 'asc'
          ? valA.localeCompare(valB, 'id-ID')
          : valB.localeCompare(valA, 'id-ID');
      }

      return order === 'asc' ? valA - valB : valB - valA;
    });

    await this.displayStories(filteredStories);
  }

  setupNetworkListeners() {
    window.addEventListener('online', () => {
      console.log('[HomePage] Back online, reloading stories...');
      const offlineIndicator = document.getElementById('offline-indicator');
      if (offlineIndicator) {
        offlineIndicator.style.display = 'none';
      }
      this.loadStories();
    });
    
    window.addEventListener('offline', () => {
      console.log('[HomePage] Went offline, switching to IndexedDB...');
      const offlineIndicator = document.getElementById('offline-indicator');
      if (offlineIndicator) {
        offlineIndicator.style.display = 'block';
      }
      this.loadSavedStoriesFallback();
    });
  }
}
