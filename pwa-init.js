/**
 * PWA Initialization Script
 * Registers Service Worker for offline functionality
 */

(function() {
  'use strict';

  /**
   * Register Service Worker
   */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then((registration) => {
          console.log('[PWA] Service Worker registered successfully:', registration.scope);
        })
        .catch((error) => {
          console.error('[PWA] Service Worker registration failed:', error);
        });
    });
  }

  /**
   * Check if app is running in standalone mode
   */
  function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
  }

  /**
   * Track standalone usage
   */
  if (isStandalone()) {
    console.log('[PWA] Running in standalone mode');

    if (typeof gtag !== 'undefined') {
      gtag('event', 'pwa_standalone', {
        event_category: 'PWA',
        event_label: 'Standalone Mode'
      });
    }
  }

})();
