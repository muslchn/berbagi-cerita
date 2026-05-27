export function showFormattedDate(date, locale = 'en-US', options = {}) {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

export function sleep(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function escapeHTML(value = '') {
  const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return String(value).replace(/[&<>"']/g, (character) => htmlEscapes[character]);
}

let leafletLoader = null;

export function loadLeaflet() {
  if (window.L) {
    return Promise.resolve(window.L);
  }

  if (leafletLoader) {
    return leafletLoader;
  }

  leafletLoader = new Promise((resolve, reject) => {
    const existingStylesheet = document.querySelector('link[data-leaflet]');
    if (!existingStylesheet) {
      const leafletCSS = document.createElement('link');
      leafletCSS.rel = 'stylesheet';
      leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      leafletCSS.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      leafletCSS.crossOrigin = 'anonymous';
      leafletCSS.dataset.leaflet = 'true';
      document.head.appendChild(leafletCSS);
    }

    const leafletJS = document.createElement('script');
    leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    leafletJS.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    leafletJS.crossOrigin = 'anonymous';
    leafletJS.dataset.leaflet = 'true';
    leafletJS.onload = () => resolve(window.L);
    leafletJS.onerror = () => {
      leafletLoader = null;
      reject(new Error('Gagal memuat pustaka peta'));
    };
    document.head.appendChild(leafletJS);
  });

  return leafletLoader;
}
