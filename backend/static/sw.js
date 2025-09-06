// public/sw.js

self.addEventListener("install", (event) => {
  console.log("✅ Service Worker installed");
});

self.addEventListener("activate", (event) => {
  console.log("⚡ Service Worker activated");
});

self.addEventListener("fetch", (event) => {
  // This tells the service worker not to hijack requests — important during dev
  return;
});
