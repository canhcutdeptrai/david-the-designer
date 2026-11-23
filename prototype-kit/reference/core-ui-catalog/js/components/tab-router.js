/* Tab router — #c-tab-router */
(function () {
  const root = document.getElementById('c-tab-router');
  if (!root) return;
  root.addEventListener('click', function (e) {
    const link = e.target.closest('.tab-router__item');
    if (!link || !root.contains(link)) return;
    e.preventDefault();
    const outlet = link.closest('sd-tab-router-outlet');
    const nav = outlet.querySelector('.tab-router__nav');
    const host = link.closest('sd-tab-router-item');
    const items = Array.from(nav.querySelectorAll('sd-tab-router-item'));
    const panes = Array.from(outlet.querySelectorAll('.tab-router__pane'));
    function activate(key) {
      items.forEach(function (it) {
        if (!it.isConnected) return;
        it.querySelector('.tab-router__item').classList.toggle('tab-router__item--active', it.dataset.key === key);
      });
      panes.forEach(function (p) { if (p.isConnected) p.classList.toggle('active', p.dataset.key === key); });
    }
    if (e.target.closest('.tab-router__close')) {
      e.stopPropagation();
      const left = items.filter(function (it) { return it !== host; });
      if (!left.length) return;
      const wasActive = link.classList.contains('tab-router__item--active');
      const idx = items.indexOf(host);
      const pane = outlet.querySelector('.tab-router__pane[data-key="' + host.dataset.key + '"]');
      host.remove();
      if (pane) pane.remove();
      if (wasActive) {
        const next = items[idx + 1] || items[idx - 1];
        activate(next.dataset.key);
      }
      if (nav.dataset.realRule === 'true') nav.classList.toggle('d-none', left.length > 1);
      return;
    }
    activate(host.dataset.key);
  });
})();
