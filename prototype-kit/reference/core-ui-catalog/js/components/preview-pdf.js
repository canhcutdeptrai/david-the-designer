/* Preview PDF — #c-preview-pdf */
(function () {
  const root = document.getElementById('c-preview-pdf');
  root.querySelectorAll('sd-preview-pdf').forEach(function (host) {
    const thumbs = Array.from(host.querySelectorAll('.sd-preview-pdf-thumb'));
    const input = host.querySelector('.sd-preview-pdf-toolbar__page-input');
    if (!thumbs.length || !input) return;
    thumbs.forEach(function (t) {
      t.addEventListener('click', function () {
        thumbs.forEach(function (x) {
          const on = x === t;
          x.classList.toggle('sd-preview-pdf-thumb--active', on);
          if (on) x.setAttribute('aria-current', 'page'); else x.removeAttribute('aria-current');
        });
        input.value = t.dataset.p;
        const btns = host.querySelectorAll('.sd-preview-pdf-toolbar__btn');
        btns[0].disabled = btns[1].disabled = t.dataset.p === '1';
      });
    });
  });
})();
