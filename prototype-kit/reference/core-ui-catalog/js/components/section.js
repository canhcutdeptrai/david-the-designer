/* Section — #c-section */
(function () {
  const root = document.getElementById('c-section');
  root.querySelectorAll('sd-section[data-collapsible]').forEach(function (host) {
    const box = host.firstElementChild;
    const head = box.firstElementChild;
    const body = box.lastElementChild;
    const icon = head.querySelector('mat-icon');
    head.addEventListener('click', function (e) {
      if (e.target.closest('sd-button')) return;
      const collapsed = !body.hidden;
      body.hidden = collapsed;
      box.classList.toggle('c-shadow-section', !collapsed);
      if (icon) icon.textContent = collapsed ? 'expand_more' : 'expand_less';
    });
  });
})();
