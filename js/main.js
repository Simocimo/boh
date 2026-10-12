/* Boot the app once every generator has registered, and install the
   offline worker when served over the web (not from disk, not framed). */
(function (Carto) {
  'use strict';
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', Carto.start);
  else Carto.start();

  let framed = true;
  try { framed = window.self !== window.top; } catch (e) { /* cross-origin frame */ }
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol) && !framed) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch((err) => console.warn('Offline mode unavailable:', err));
    });
  }
})(window.Carto);
