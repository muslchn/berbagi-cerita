import { getStories } from '../../data/api';

export default class HomePage {
  async render() {
    return `
      <section class="container home-container">
        <h1 class="page-title">Berbagi Cerita</h1>
        <p class="page-subtitle">Temukan cerita dari berbagai tempat</p>
        
        <h2 class="stories-heading">Daftar Cerita Terbaru</h2>
        
        <div id="stories-list" class="stories-list">
          <p class="loading-text">Memuat cerita...</p>
        </div>
      </section>
    `;
  }

  async afterRender() {
    try {
      const result = await getStories(1);
      const storiesList = document.getElementById('stories-list');
      
      if (result.error) {
        storiesList.innerHTML = `<p class="error-text">Gagal memuat cerita: ${result.message}</p>`;
        return;
      }
      
      if (!result.listStory || result.listStory.length === 0) {
        storiesList.innerHTML = '<p class="empty-text">Belum ada cerita</p>';
        return;
      }
      
      storiesList.innerHTML = result.listStory.map(story => `
        <article class="story-card">
          <img src="${story.photoUrl}" alt="${story.description.substring(0, 50)}" loading="lazy" />
          <div class="story-content">
            <h3>${story.name}</h3>
            <p>${story.description}</p>
            <small class="story-date">${new Date(story.createdAt).toLocaleDateString('id-ID')}</small>
          </div>
        </article>
      `).join('');
      
    } catch (error) {
      console.error('Error fetching stories:', error);
      document.getElementById('stories-list').innerHTML = 
        '<p class="error-text">Terjadi kesalahan saat memuat cerita</p>';
    }
  }
}
