import App from './pages/app';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });
  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });

  // Setup skip to content link for accessibility
  const skipLink = document.querySelector('.skip-link');
  const mainContent = document.querySelector('#main-content');
  
  if (skipLink && mainContent) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      // Set focus directly to main content without changing URL
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    });
  }
});
