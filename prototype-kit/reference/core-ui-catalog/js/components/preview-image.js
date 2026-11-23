/* Preview image — #c-preview-image */
(function () {
  const root = document.getElementById('c-preview-image');
  const sizes = ["1.2 MB", "2.4 MB", "844.0 KB", "3.2 MB"];
  root.querySelectorAll('sd-preview-image').forEach(function (host) {
    const thumbs = Array.from(host.querySelectorAll('.sd-preview-thumb'));
    if (!thumbs.length) return;
    const img = host.querySelector('.sd-preview-image');
    const name = host.querySelector('.sd-preview-header__name');
    const sub = host.querySelector('.sd-preview-header__sub');
    const counter = host.querySelector('.sd-preview-header__counter');
    const cap = host.querySelector('.sd-preview-caption');
    let idx = thumbs.findIndex(function (t) { return t.classList.contains('sd-preview-thumb--active'); });
    function go(i) {
      idx = (i + thumbs.length) % thumbs.length;
      thumbs.forEach(function (t, k) {
        t.classList.toggle('sd-preview-thumb--active', k === idx);
        if (k === idx) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current');
      });
      const ti = thumbs[idx].querySelector('img');
      img.src = ti.src; img.alt = ti.alt;
      name.textContent = ti.alt; name.title = ti.alt;
      sub.textContent = ' ' + sizes[idx] + ' ';
      counter.textContent = ' ' + (idx + 1) + ' / ' + thumbs.length + ' ';
      if (cap) cap.hidden = true;
    }
    thumbs.forEach(function (t, k) { t.addEventListener('click', function () { go(k); }); });
    host.querySelector('.sd-preview-nav--prev').addEventListener('click', function () { go(idx - 1); });
    host.querySelector('.sd-preview-nav--next').addEventListener('click', function () { go(idx + 1); });
  });
})();
