/* Boot the app once every generator has registered. */
(function (Carto) {
  'use strict';
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', Carto.start);
  else Carto.start();
})(window.Carto);
