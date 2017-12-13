var dataCacheName = 'eNotis+_Data-v1';
var cacheName = 'eNotis+_step_1_1';
// 캐시 저장소
var filesToCache = [
	'/eNotisPlus_APP/',
	'/eNotisPlus_APP/index.html',
	'/eNotisPlus_APP/scripts/app.js',
	'/eNotisPlus_APP/styles/base.css',
	'/eNotisPlus_APP/styles/inline.css',
	'/eNotisPlus_APP/include/include-body.html',
	'/eNotisPlus_APP/include/include-header.html',
	'/eNotisPlus_APP/include/include-leftMenu.html',

	//componets
	'/eNotisPlus_APP/components/home/home.html',
	'/eNotisPlus_APP/components/home/home.js',
	
	'/eNotisPlus_APP/components/mail/writeMail.html',
	'/eNotisPlus_APP/components/mail/receiveList.html'	// , 조심!!
	/*	
	'/components/home/homeApp.js'*/
	];

// service-worker install evnet
self.addEventListener('install', function(e) {
	console.log('[ServiceWorker] Install');
	e.waitUntil(caches.open(cacheName).then(function(cache) {
		console.log('[ServiceWorker] Caching app shell', cacheName);
		return cache.addAll(filesToCache);
	}));
});

// service-worker fetch event - 1
// PWA에서 생성된 요청을 가로채서 서비스워커에서 처리하는 기능
//self.addEventListener('fetch', function(e) {
//	console.log('[ServiceWorker] Fetch', e.request.url);
//	e.respondWith(caches.match(e.request).then(function(response) {
//		return response || fetch(e.request);
//	}));
//});

// service-worker fetch event - test
self.addEventListener('fetch', function(e) {
	console.log('[ServiceWorker] Fetch', e.request.url);
	
	var dataUrl = 'https://cyoung90.github.io/eNotisPlus_APP/';
	if (e.request.url.indexOf(dataUrl) > -1) {
		e.respondWith(
		  caches.open(dataCacheName).then(function(cache) {
		    return fetch(e.request).then(function(response){
		      cache.put(e.request.url, response.clone());
		      return response;
		    });
		  })
		);
	} else {
		e.respondWith(caches.match(e.request).then(function(response) {
			return response || fetch(e.request);
		}));
	}
	
});

// service-worker activate event (Cache update)
self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});


// 사용자 앱 설치

