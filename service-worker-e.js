var cacheName = 'eNotis+_step_1_0';
// 캐시 저장소
var filesToCache = [
	'/',
	'/index.html',
	'/scripts/home.js',
	'/styles/base.css',
	'/styles/inline.css',
	
];

// service-worker install evnet
self.addEventListener('install', function(e) {
	console.log('[ServiceWorker] Install');
	e.waitUntil(caches.open(cacheName).then(function(cache) {
		console.log('[ServiceWorker] Caching app shell');
		return cache.addAll(filesToCache);
	}));
});

// service-worker fetch event
// PWA에서 생성된 요청을 가로채서 서비스워커에서 처리하는 기능
self.addEventListener('fetch', function(e) {
	console.log('[ServiceWorker] Fetch', e.request.url);
	e.respondWith(caches.match(e.request).then(function(response) {
		return response || fetch(e.request);
	}));
});