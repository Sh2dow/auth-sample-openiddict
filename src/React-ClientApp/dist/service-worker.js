"use strict";
/* eslint-disable no-restricted-globals */
Object.defineProperty(exports, "__esModule", { value: true });
// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.
const workbox_core_1 = require("workbox-core");
const workbox_expiration_1 = require("workbox-expiration");
const workbox_precaching_1 = require("workbox-precaching");
const workbox_routing_1 = require("workbox-routing");
const workbox_strategies_1 = require("workbox-strategies");
(0, workbox_core_1.clientsClaim)();
// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
(0, workbox_precaching_1.precacheAndRoute)(self.__WB_MANIFEST);
// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
(0, workbox_routing_1.registerRoute)(
// Return false to exempt requests from being fulfilled by index.html.
({ request, url }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== 'navigate') {
        return false;
    } // If this is a URL that starts with /_, skip.
    if (url.pathname.startsWith('/_')) {
        return false;
    } // If this looks like a URL for a resource, because it contains // a file extension, skip.
    if (url.pathname.match(fileExtensionRegexp)) {
        return false;
    } // Return true to signal that we want to use the handler.
    return true;
}, (0, workbox_precaching_1.createHandlerBoundToURL)(process.env.PUBLIC_URL + '/index.html'));
// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
(0, workbox_routing_1.registerRoute)(
// Add in any other file extensions or routing criteria as needed.
({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.png'), // Customize this strategy as needed, e.g., by changing to CacheFirst.
new workbox_strategies_1.StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
        // Ensure that once this runtime cache reaches a maximum size the
        // least-recently used images are removed.
        new workbox_expiration_1.ExpirationPlugin({ maxEntries: 50 }),
    ],
}));
// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
// Any other custom service worker logic can go here.
