/* Org chart — #c-org-chart */
(function () {
  const root = document.getElementById('c-org-chart');
  if (!root) return;
  root.addEventListener('click', function (e) {
    const btn = e.target.closest('.sd-org-chart__toggle');
    if (!btn || !root.contains(btn)) return;
    e.stopPropagation();
    const li = btn.closest('.sd-org-chart__node');
    const ul = li.querySelector(':scope > .sd-org-chart__children');
    if (!ul) return;
    const expanded = btn.getAttribute('aria-expanded') !== 'true';
    ul.hidden = !expanded;
    li.classList.toggle('sd-org-chart__node--expanded', expanded);
    li.classList.toggle('sd-org-chart__node--collapsed', !expanded);
    li.setAttribute('aria-expanded', String(expanded));
    btn.setAttribute('aria-expanded', String(expanded));
    btn.setAttribute('aria-label', expanded ? 'Collapse children' : 'Expand children');
    btn.querySelector('mat-icon').textContent = expanded ? 'expand_more' : 'chevron_right';
  });
})();
