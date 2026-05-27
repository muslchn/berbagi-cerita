import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import pushManager from '../utils/push-notification';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this.#setupDrawer();
    this.#updateAuthLinks();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      const isOpen = this.#navigationDrawer.classList.toggle('open');
      this.#drawerButton.setAttribute('aria-expanded', isOpen);
    });

    document.body.addEventListener('click', (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
        this.#drawerButton.setAttribute('aria-expanded', 'false');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
          this.#drawerButton.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  #updateAuthLinks() {
    const token = localStorage.getItem('token');
    const authLinks = document.getElementById('auth-links');
    
    if (token) {
      authLinks.innerHTML = '<a href="#/logout">Keluar</a>';
    } else {
      authLinks.innerHTML = '<a href="#/login">Masuk</a>';
    }

    this.#setupPushNotificationTools(Boolean(token));
    
    // Add event listener for logout
    const logoutLink = authLinks.querySelector('a[href="#/logout"]');
    if (logoutLink) {
      logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('token');
        this.#updateAuthLinks();
        window.location.hash = '#/';
      });
    }
  }

  async #setupPushNotificationTools(isAuthenticated) {
    const pushTools = document.getElementById('push-notification-tools');

    if (!pushTools) {
      return;
    }

    if (!isAuthenticated || !pushManager.checkSupport()) {
      pushTools.innerHTML = '';
      return;
    }

    pushTools.innerHTML = `
      <button type="button" id="nav-push-toggle" class="nav-button">
        Memuat Notifikasi
      </button>
    `;

    const toggleButton = document.getElementById('nav-push-toggle');

    try {
      const updateButton = async () => {
        const isSubscribed = await pushManager.isSubscribed();
        toggleButton.textContent = isSubscribed ? 'Nonaktifkan Notifikasi' : 'Aktifkan Notifikasi';
        toggleButton.setAttribute(
          'aria-label',
          isSubscribed ? 'Nonaktifkan notifikasi push' : 'Aktifkan notifikasi push'
        );
      };

      await updateButton();

      toggleButton.addEventListener('click', async () => {
        toggleButton.disabled = true;
        toggleButton.textContent = 'Memproses...';

        try {
          await pushManager.toggleSubscription();
          await updateButton();
        } catch (error) {
          console.error('Error toggling push notification:', error);
          toggleButton.textContent = 'Gagal Notifikasi';
        } finally {
          toggleButton.disabled = false;
        }
      });
    } catch (error) {
      console.error('Error preparing push notification button:', error);
      pushTools.innerHTML = '';
    }
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url] || routes['/'];

    if (!routes[url]) {
      window.location.hash = '#/';
      return;
    }

    // Add view transition
    if (document.startViewTransition) {
      await document.startViewTransition(async () => {
        this.#content.innerHTML = await page.render();
        await page.afterRender();
        this.#updateAuthLinks();
      });
    } else {
      this.#content.innerHTML = await page.render();
      await page.afterRender();
      this.#updateAuthLinks();
    }
  }
}

export default App;
