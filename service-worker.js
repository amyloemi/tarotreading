/**
 * My Tarot Today - Service Worker
 * Provides offline functionality and caching for tarot card readings
 * Version: 1.0.0
 */

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `my-tarot-today-${CACHE_VERSION}`;

// Core assets to cache immediately on install
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/pages/dictionary.html',
  '/pages/gallery.html',
  '/pages/journey.html',
  '/assets/css/main.css',
  '/decks/shared/DeckLoader.js',
  '/decks/shared/CardDatabase.js',
  '/images/backgrounds/tarot-background.jpg',
  '/images/icons/icon-192.png',
  '/images/icons/icon-512.png',
  '/manifest.json'
];

// Card images to cache (lazy - cached as they're accessed)
const CARD_IMAGE_PATTERNS = [
  /\/decks\/.*\.png$/,
  /\/decks\/.*\.jpg$/,
  /\/decks\/.*\.webp$/
];

// Network-first resources (always try to fetch fresh)
const NETWORK_FIRST_PATTERNS = [
  /\/api\//,
  /translate\.googleapis\.com/,
  /google-analytics\.com/,
  /googletagmanager\.com/
];

/**
 * Install event - cache core assets
 */
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing version:', CACHE_VERSION);

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching core assets');
        return cache.addAll(CORE_ASSETS.map(url => new Request(url, { cache: 'reload' })));
      })
      .then(() => {
        console.log('[ServiceWorker] Core assets cached successfully');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('[ServiceWorker] Failed to cache core assets:', error);
      })
  );
});

/**
 * Activate event - cleanup old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating version:', CACHE_VERSION);

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Delete old cache versions
              return cacheName.startsWith('my-tarot-today-') && cacheName !== CACHE_NAME;
            })
            .map((cacheName) => {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[ServiceWorker] Claiming clients');
        return self.clients.claim(); // Take control immediately
      })
  );
});

/**
 * Fetch event - serve from cache with network fallback
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions and other protocols
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Network-first strategy for analytics and APIs
  if (NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(url.href))) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Cache-first strategy for card images (they don't change)
  if (CARD_IMAGE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Stale-while-revalidate for HTML pages and other assets
  event.respondWith(staleWhileRevalidate(request));
});

/**
 * Cache-first strategy: Try cache first, then network
 * Best for: Static assets that don't change (images, fonts)
 */
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  if (cached) {
    console.log('[ServiceWorker] Cache hit:', request.url);
    return cached;
  }

  try {
    console.log('[ServiceWorker] Fetching and caching:', request.url);
    const response = await fetch(request);

    // Cache successful responses
    if (response.ok) {
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.error('[ServiceWorker] Fetch failed:', request.url, error);

    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return cache.match('/index.html');
    }

    throw error;
  }
}

/**
 * Network-first strategy: Try network first, then cache
 * Best for: Dynamic content, APIs
 */
async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const response = await fetch(request);

    // Cache successful responses
    if (response.ok) {
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.log('[ServiceWorker] Network failed, trying cache:', request.url);
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    throw error;
  }
}

/**
 * Stale-while-revalidate strategy: Return cache immediately, update in background
 * Best for: HTML pages, CSS, JavaScript
 */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  // Fetch in the background to update cache
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch((error) => {
    console.error('[ServiceWorker] Background fetch failed:', request.url, error);
  });

  // Return cached version immediately if available
  if (cached) {
    console.log('[ServiceWorker] Returning cached, updating in background:', request.url);
    return cached;
  }

  // Wait for network if no cache
  console.log('[ServiceWorker] No cache, waiting for network:', request.url);
  return fetchPromise;
}

/**
 * Background sync event - sync saved readings when online
 */
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Background sync:', event.tag);

  if (event.tag === 'sync-readings') {
    event.waitUntil(syncReadings());
  }
});

/**
 * Sync saved readings (future feature)
 */
async function syncReadings() {
  // Future implementation: sync saved readings to server
  console.log('[ServiceWorker] Syncing readings...');
  return Promise.resolve();
}

/**
 * Message event - handle commands from clients
 */
self.addEventListener('message', (event) => {
  console.log('[ServiceWorker] Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.urls || [];
    caches.open(CACHE_NAME).then((cache) => {
      cache.addAll(urls);
    });
  }
});

/**
 * Push notification event (future feature)
 */
self.addEventListener('push', (event) => {
  console.log('[ServiceWorker] Push received:', event);

  const options = {
    body: event.data ? event.data.text() : 'Your daily tarot reading is ready',
    icon: '/images/icons/icon-192.png',
    badge: '/images/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'tarot-notification',
    requireInteraction: false,
    actions: [
      { action: 'view', title: 'View Reading' },
      { action: 'close', title: 'Close' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('My Tarot Today', options)
  );
});

/**
 * Notification click event
 */
self.addEventListener('notificationclick', (event) => {
  console.log('[ServiceWorker] Notification clicked:', event.action);

  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('[ServiceWorker] Loaded version:', CACHE_VERSION);
