const CACHE_NAME = "shopco-pwa-v2";
const OFFLINE_URL = "/offline.html";
const STATIC_PREFIXES = ["/_next/static/", "/icons/"];
const APP_ICON = "/icons/shopco-192.png";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll([OFFLINE_URL, APP_ICON, "/icons/shopco-512.png"]))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key.startsWith("shopco-pwa-") && key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ))
      .then(() => self.clients.claim()),
  );
});

// This handler becomes active when the backend sends standards-based Web Push.
// A VAPID key and server-side subscription/delivery endpoint are still required.
self.addEventListener("push", (event) => {
  let payload = {};
  try {
    const decoded = event.data ? event.data.json() : {};
    if (decoded && typeof decoded === "object") payload = decoded;
    else if (typeof decoded === "string") payload = { body: decoded };
  } catch {
    payload = { body: event.data ? event.data.text() : "" };
  }

  const title = typeof payload.title === "string" ? payload.title : "SHOP.CO";
  const body = typeof payload.body === "string" ? payload.body : "You have a new update.";
  const target = typeof payload.url === "string" && payload.url.startsWith("/") && !payload.url.startsWith("//")
    ? payload.url
    : "/";

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: typeof payload.icon === "string" ? payload.icon : APP_ICON,
      badge: APP_ICON,
      tag: typeof payload.tag === "string" ? payload.tag : "shopco-update",
      data: { url: target },
      renotify: false,
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const requestedPath = event.notification.data && event.notification.data.url;
  const targetUrl = typeof requestedPath === "string" && requestedPath.startsWith("/") && !requestedPath.startsWith("//")
    ? new URL(requestedPath, self.location.origin).href
    : new URL("/", self.location.origin).href;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.startsWith(self.location.origin) && "focus" in client) {
          return client.navigate(targetUrl).then(() => client.focus());
        }
      }
      return self.clients.openWindow(targetUrl);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/auth/") ||
    url.pathname.includes("/checkout") ||
    url.pathname.includes("/orders")
  ) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => {
        const cachedOffline = await caches.match(OFFLINE_URL);
        return cachedOffline || Response.error();
      }),
    );
    return;
  }

  if (STATIC_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fresh = fetch(request).then((response) => {
          if (response.ok && response.type === "basic") {
            const copy = response.clone();
            void caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        });
        return cached || fresh;
      }),
    );
  }
});
