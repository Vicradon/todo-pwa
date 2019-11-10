// STEP 5: UNCOMMENT THE staticCache
const staticCache = 'static-v1.1';

// STEP 8: UNCOMMENT THE dynamicCache
const dynamicCache = 'dynamic-v1.1';

// STEP 6: UNCOMMENT THE APP SHELL ARRAY
const appShell = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/script.min.js',
  '/pages/offline.html'
]

// STEP 4: UNCOMMENT THE INSTALL HANDLER LINES 18 TO 23
// This is where we precache.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(staticCache)
      .then(cache => cache.addAll(appShell))
  )
})

// STEP 7: UNCOMMENT THE ACTIVATE HANDLER
// This is where we delete old service workers
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keyArr => {
        keyArr
          .filter(keys => keys !== staticCache && keys !== dynamicCache)
          .map(oldKey => caches.delete(oldKey))
      })
  )
})


// STEP 9: UNCOMMENT THE FETCH EVENT HANDLER
// This is where we dynamically cache assets and also
// serve files to the client
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .then(fetchResponse => caches.open(dynamicCache)
        .then(cache => {
          cache.put(event.request.url, fetchResponse.clone())
          return fetchResponse
        }
        )
      ).catch(() => caches.match('/pages/offline.html'))
  )
})

// EXTRA: CODE FOR DELETING CACHES FROM THE BROWSER CONSOLE
// caches.keys().then(keys => keys.map(key => caches.delete(key)))