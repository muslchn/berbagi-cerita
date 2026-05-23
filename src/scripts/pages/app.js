import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';

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

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

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
