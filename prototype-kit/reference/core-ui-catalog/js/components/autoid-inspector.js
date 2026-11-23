/* AutoId inspector — #c-autoid-inspector */
(function () {
  const root = document.getElementById('c-autoid-inspector');
  root.querySelectorAll('.sd-autoid-inspector__segments').forEach(function (seg) {
    seg.addEventListener('click', function (e) {
      const b = e.target.closest('button');
      if (!b) return;
      seg.querySelectorAll('button').forEach(function (x) { x.classList.toggle('is-active', x === b); });
    });
  });
  root.querySelectorAll('.sd-autoid-inspector__toggle').forEach(function (t) {
    t.addEventListener('click', function () {
      const on = !t.classList.contains('is-on');
      t.classList.toggle('is-on', on);
      t.querySelector('mat-icon').textContent = on ? 'visibility' : 'visibility_off';
      t.querySelector('.sd-autoid-inspector__toggle-state').textContent = on ? 'ON' : 'OFF';
      const demo = t.closest('.aid-demo');
      demo.querySelectorAll('[data-hl-style]').forEach(function (n) { n.setAttribute('style', on ? n.getAttribute('data-hl-style') : ''); });
    });
  });
  root.querySelectorAll('.aid-demo .aid-field, .aid-demo .aid-btn').forEach(function (n) {
    const s = n.getAttribute('style');
    if (s) n.setAttribute('data-hl-style', s);
  });
})();
