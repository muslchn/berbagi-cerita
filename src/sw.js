/**
 * Service Worker for Berbagi Cerita PWA
 * Handles caching, offline support, and push notifications
 */

const CACHE_NAME = 'berbagi-cerita-v1';
const BASE_URL = new URL('./', self.location).href;
const STATIC_ASSETS = [
  BASE_URL,
  new URL('index.html', self.location).href,
  new URL('scripts/index.js', self.location).href,
  new URL('styles/styles.css', self.location).href,
  new URL('favicon.png', self.location).href
];

const API_CACHE_NAME = 'berbagi-cerita-api-v1';
const IMAGE_CACHE_NAME = 'berbagi-cerita-images-v1';

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== API_CACHE_NAME && 
                cacheName !== IMAGE_CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests with stale-while-revalidate strategy
  if (url.pathname.startsWith('/v1/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle image requests with cache-first strategy
  if (request.destination === 'image') {
    event.respondWith(handleImageRequest(request));
    return;
  }

  // Handle static assets with cache-first strategy
  event.respondWith(handleStaticRequest(request));
});

/**
 * Handle API requests with network-first, fallback to cache
 */
async function handleApiRequest(request) {
  const cache = await caches.open(API_CACHE_NAME);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache the response
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('[SW] Network failed, serving from cache:', request.url);
  }

  // Fallback to cache
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // If no cache, return offline response
  return new Response(
    JSON.stringify({ error: true, message: 'Offline - data not available' }),
    { status: 503, headers: { 'Content-Type': 'application/json' } }
  );
}

/**
 * Handle image requests with cache-first strategy
 */
async function handleImageRequest(request) {
  const cache = await caches.open(IMAGE_CACHE_NAME);
  
  // Try cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Fallback to network
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return placeholder or empty response
    return new Response('', { status: 404 });
  }
}

/**
 * Handle static asset requests with cache-first strategy
 */
async function handleStaticRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  
  // Try cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Fallback to network
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match(new URL('index.html', self.location).href);
    }
    throw error;
  }
}

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received:', event);
  
  let data = {};
  
  try {
    data = event.data ? event.data.json() : {};
  } catch (error) {
    console.error('[SW] Error parsing push data:', error);
  }

  const title = data.title || 'Berbagi Cerita';
  const options = {
    body: data.options?.body || 'Anda memiliki notifikasi baru',
    icon: data.options?.icon || new URL('favicon.png', self.location).href,
    badge: new URL('favicon.png', self.location).href,
    tag: data.options?.tag || 'story-notification',
    renotify: true,
    requireInteraction: false,
    actions: [
      { action: 'view', title: 'Lihat Cerita' },
      { action: 'close', title: 'Tutup' }
    ],
    data: {
      storyId: data.options?.data?.id || null,
      url: data.options?.data?.url || `${BASE_URL}#/`
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event - handle user interaction
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'view') {
    const storyId = event.notification.data.storyId;
    const url = storyId ? `${BASE_URL}#/story/${storyId}` : event.notification.data.url || `${BASE_URL}#/`;
    
    event.waitUntil(
      clients.openWindow(url)
    );
  } else if (event.action === 'close') {
    // Do nothing, notification already closed
  } else {
    // Default action - open app
    event.waitUntil(
      clients.openWindow(`${BASE_URL}#/`)
    );
  }
});

// Message event - handle messages from main thread
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_API_DATA') {
    // Cache API data manually if needed
    cacheApiData(event.data.payload);
  }
});

/**
 * Helper function to cache API data
 */
async function cacheApiData(data) {
  const cache = await caches.open(API_CACHE_NAME);
  const request = new Request('/v1/stories');
  const response = new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
  
  await cache.put(request, response);
}

console.log('[SW] Service Worker loaded');
