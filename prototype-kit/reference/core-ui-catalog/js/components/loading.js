/* Loading — #c-loading */
(function () {
  const root = document.getElementById('c-loading');
  const target = root.querySelector('[data-ld-target]');
  let overlay = target.querySelector('.sd-loading');
  root.querySelectorAll('[data-ld]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.getAttribute('data-ld') === 'start') {
        if (!overlay.isConnected) target.appendChild(overlay);
      } else if (overlay.isConnected) {
        overlay.remove();
      }
    });
  });
})();
