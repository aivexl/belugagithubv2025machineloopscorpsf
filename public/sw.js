const CACHE_NAME = 'beluga-v1';
const urlsToCache = [
  '/',
  '/Asset/belugalogov3white.png',
  '/Asset/favicon-32x32.png',
  '/Asset/favicon-16x16.png',
  '/favicon.ico',
  '/site.webmanifest'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - Cache with network fallback strategy
self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // ENTERPRISE FIX: Skip caching for API calls, authentication, and external services
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('coingecko.com') ||
      event.request.url.includes('sanity.io') ||
      event.request.url.includes('supabase.co') ||
      event.request.url.includes('/auth/') ||
      event.request.url.includes('chrome-extension://') ||
      event.request.url.includes('moz-extension://') ||
      event.request.url.includes('_next/') ||
      event.request.url.includes('hot-reload') ||
      event.request.url.includes('webpack') ||
      event.request.method === 'POST' ||
      event.request.method === 'PUT' ||
      event.request.method === 'DELETE' ||
      event.request.method === 'PATCH') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        return fetch(event.request).then(
          (response) => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                // ENTERPRISE FIX: Add error handling for cache put operations
                try {
                  // Only cache if request is cacheable
                  if (event.request.url.startsWith('http') && 
                      !event.request.url.includes('chrome-extension') &&
                      !event.request.url.includes('moz-extension')) {
                    cache.put(event.request, responseToCache);
                  }
                } catch (error) {
                  console.warn('Cache put failed:', error);
                }
              })
              .catch((error) => {
                console.warn('Cache open failed:', error);
              });

            return response;
          }
        );
      })
  );
});

// Activate - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
