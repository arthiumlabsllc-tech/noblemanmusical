/* eslint-disable no-restricted-globals */

const CACHE_NAME = "nmc-v1";
const OFFLINE_URL = "/offline";

// Assets to pre-cache on install
const PRECACHE_URLS = [
  "/",
  "/shop",
  "/offline",
  "/icon.svg",
];

// ── Install: pre-cache core assets ──
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Don't fail install if a URL fails to cache
      return Promise.allSettled(
        PRECACHE_URLS.map((url) => cache.add(url))
      );
    })
  );
  self.skipWaiting();
});

// ── Activate: clean old caches ──
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch: network-first with cache fallback ──
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Skip API and auth requests
  if (
    request.url.includes("/api/") ||
    request.url.includes("/auth/")
  ) {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        // Try network first
        const networkResponse = await fetch(request);

        // Cache successful responses
        if (networkResponse.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, networkResponse.clone());
        }

        return networkResponse;
      } catch {
        // Network failed — try cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) return cachedResponse;

        // For navigation requests, serve offline page
        if (request.mode === "navigate") {
          const offlinePage = await caches.match(OFFLINE_URL);
          if (offlinePage) return offlinePage;
        }

        // Last resort: return a basic offline response
        return new Response("Offline", {
          status: 503,
          statusText: "Service Unavailable",
          headers: { "Content-Type": "text/plain" },
        });
      }
    })()
  );
});


