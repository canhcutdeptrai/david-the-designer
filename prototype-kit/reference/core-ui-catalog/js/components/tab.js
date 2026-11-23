/* Tab — #c-tab */
(function () {
  const root = document.getElementById('c-tab');
  if (!root) return;
  function select(group, index) {
    const tabs = Array.from(group.querySelectorAll(':scope > mat-tab-header .mat-mdc-tab'));
    const bodies = Array.from(group.querySelectorAll(':scope > .mat-mdc-tab-body-wrapper > mat-tab-body'));
    tabs.forEach(function (t, i) {
      const on = i === index;
      t.classList.toggle('mdc-tab--active', on);
      t.classList.toggle('mdc-tab-indicator--active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.setAttribute('tabindex', on ? '0' : '-1');
      t.setAttribute('aria-posinset', String(i + 1));
      t.setAttribute('aria-setsize', String(tabs.length));
    });
    bodies.forEach(function (b, i) {
      const on = i === index;
      b.classList.toggle('mat-mdc-tab-body-active', on);
      b.setAttribute('aria-hidden', on ? 'false' : 'true');
      if (on) b.removeAttribute('inert'); else b.setAttribute('inert', '');
      const c = b.firstElementChild;
      if (!c) return;
      c.classList.toggle('mat-tab-body-content-left', i < index);
      c.classList.toggle('mat-tab-body-content-right', i > index);
      if (on) c.style.transform = 'none'; else c.style.removeProperty('transform');
    });
  }
  root.addEventListener('click', function (e) {
    const tab = e.target.closest('.mat-mdc-tab');
    if (!tab || !root.contains(tab)) return;
    const group = tab.closest('mat-tab-group');
    const tabs = Array.from(group.querySelectorAll(':scope > mat-tab-header .mat-mdc-tab'));
    const index = tabs.indexOf(tab);
    if (e.target.closest('.sd-tab__close')) {
      e.stopPropagation();
      if (tabs.length <= 1) return;
      const current = tabs.findIndex(function (t) { return t.classList.contains('mdc-tab--active'); });
      const bodies = group.querySelectorAll(':scope > .mat-mdc-tab-body-wrapper > mat-tab-body');
      tab.remove();
      if (bodies[index]) bodies[index].remove();
      let next = current;
      if (index < current) next = current - 1;
      if (next > tabs.length - 2) next = tabs.length - 2;
      select(group, Math.max(0, next));
      return;
    }
    if (tab.classList.contains('mat-mdc-tab-disabled')) return;
    select(group, index);
  });
  root.addEventListener('keydown', function (e) {
    const tab = e.target.closest('.mat-mdc-tab');
    if (!tab || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault();
    tab.click();
  });
})();
