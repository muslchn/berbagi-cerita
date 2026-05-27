import storyDB from '../../data/indexeddb';
import { escapeHTML } from '../../utils';

export default class SavedStoriesPage {
  #stories = [];

  async render() {
    return `
      <section class="container home-container">
        <h1 class="page-title">Cerita Tersimpan</h1>
        <p class="page-subtitle">Cerita yang Anda simpan di perangkat ini</p>

        <div id="saved-message" class="form-message" role="alert" aria-live="polite"></div>
        <div id="saved-stories-list" class="stories-list">
          <p class="loading-text">Memuat cerita tersimpan...</p>
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

    await storyDB.init();
    await this.loadSavedStories();
  }

  async loadSavedStories() {
    const storiesList = document.getElementById('saved-stories-list');

    try {
      this.#stories = await storyDB.getSavedStories({ sortBy: 'createdAt', order: 'desc' });

      if (this.#stories.length === 0) {
        storiesList.innerHTML = '<p class="empty-text">Belum ada cerita yang disimpan.</p>';
        return;
      }

      storiesList.innerHTML = this.#stories.map((story) => `
        <article class="story-card">
          <img src="${escapeHTML(story.photoUrl)}" alt="${escapeHTML(story.description.substring(0, 50))}" loading="lazy" />
          <div class="story-content">
            <h2>${escapeHTML(story.name)}</h2>
            <p>${escapeHTML(story.description)}</p>
            <small class="story-date">${new Date(story.createdAt).toLocaleDateString('id-ID')}</small>
            <button
              type="button"
              class="btn-save-story saved"
              data-story-id="${escapeHTML(story.id)}"
            >
              Hapus dari Tersimpan
            </button>
          </div>
        </article>
      `).join('');

      this.setupRemoveButtons();
    } catch (error) {
      console.error('Error loading saved stories:', error);
      storiesList.innerHTML = '<p class="error-text">Gagal memuat cerita tersimpan</p>';
    }
  }

  setupRemoveButtons() {
    document.querySelectorAll('.btn-save-story').forEach((button) => {
      button.addEventListener('click', async () => {
        button.disabled = true;

        try {
          await storyDB.deleteSavedStory(button.dataset.storyId);
          this.showMessage('Cerita dihapus dari daftar tersimpan.', 'success');
          await this.loadSavedStories();
        } catch (error) {
          console.error('Error deleting saved story:', error);
          this.showMessage('Gagal menghapus cerita tersimpan.', 'error');
          button.disabled = false;
        }
      });
    });
  }

  showMessage(message, type) {
    const messageElement = document.getElementById('saved-message');
    messageElement.textContent = message;
    messageElement.className = `form-message ${type}`;
  }
}
