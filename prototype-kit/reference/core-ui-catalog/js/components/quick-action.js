/* Quick action — #c-quick-action */
(function () {
  'use strict';
  const root = document.getElementById('c-quick-action');
  if (!root) return;
  root.querySelectorAll('.vp').forEach((vp) => {
    const bar = vp.querySelector('[data-qa]');
    vp.querySelectorAll('[data-toggle]').forEach((b) => b.addEventListener('click', () => bar.classList.toggle('active')));
  });
})();
