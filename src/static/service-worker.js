/**
 * The name of our cache.
 * @type {string}
 */
const SHELL_CACHE = 'crime-checker-shell-v1';
const API_CACHE = 'crime-checker-fetch-v1';

/**
 * The base urls to cache.
 * @type {string[]}
 */
const urlsToCache = [
    '/',
    '/app.js',
    'https://fonts.googleapis.com/icon?family=Material+Icons|Roboto:400,500,700',
    'https://unpkg.com/react-md@1/dist/react-md.deep_purple-pink.min.css',
    'https://unpkg.com/react@16/umd/react.production.min.js',
    'https://unpkg.com/react-dom@16/umd/react-dom.production.min.js'
];

/**
 * Listener to cache required files on install.
 */
self.addEventListener('install', event => {
    event.waitUntil(async function () {
        const cache = await caches.open(SHELL_CACHE);
        await cache.addAll(urlsToCache);
    }())
});

/**
 * When activate, claim clients immediately.
 */
self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

/**
 * Listener to intercept and cache fetch requests, or serve shell.
 */
self.addEventListener('fetch', function (event) {
    event.respondWith(async function () {
        if (event.request.url.indexOf('fetch') !== -1) { // it is an fetch hit

            // open the fetch cache and try and find a hit
            const cache = await caches.open(API_CACHE);
            const response = await cache.match(event.request);
            if (response) return response;

            // fetch from the fetch itself and cache the result
            else {
                const response = await fetch(event.request);
                cache.put(event.request, response.clone());
                return response;
            }

        } else { // it is a shell hit or anything else

            // open the shell cache and try to find a hit
            const cache = await caches.open(SHELL_CACHE);
            const response = await caches.match(cache);
            if (response) return response;

            // get the file from the internet
            else return await fetch(event.request);

        }
    }())
});
