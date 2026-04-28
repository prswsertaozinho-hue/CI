const CACHE_NAME = 'comunicado-sw-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/sw-install.js',
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js'
];

self.addEventListener('install', event => {
  console.log('Service Worker instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Arquivos cacheados com sucesso');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('Erro no cache:', err))
  );
  self.skipWaiting(); // Força ativação imediata
});

self.addEventListener('fetch', event => {
  console.log('Buscando:', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('✅ Servindo do cache:', event.request.url);
          return response;
        }
        console.log('🌐 Buscando da rede:', event.request.url);
        return fetch(event.request)
          .then(response => {
            // Cache de novas requisições
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            return response;
          })
          .catch(err => {
            console.log('❌ Erro de rede:', err);
            // Página offline customizada
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            return new Response('Você está offline e esta página não está disponível', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Service Worker ativado');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('Removendo cache antigo:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  event.waitUntil(clients.claim()); // Toma controle imediato
});