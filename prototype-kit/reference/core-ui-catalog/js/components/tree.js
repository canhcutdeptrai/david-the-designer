/* Tree — #c-tree */
(function () {
  const root = document.getElementById('c-tree');
  if (!root) return;
  function rowsOf(tree) { return Array.from(tree.querySelectorAll('.sd-tree__row')); }
  function setHidden(tree, id, hide) {
    rowsOf(tree).forEach(function (r) {
      if (r.dataset.parent !== id) return;
      r.hidden = hide;
      const childHide = hide || r.getAttribute('aria-expanded') !== 'true';
      setHidden(tree, r.dataset.id, childHide);
    });
  }
  function updateQa(sdTree) {
    const qa = sdTree.querySelector('.c-quick-action');
    if (!qa) return;
    const n = sdTree.querySelectorAll('.sd-tree__row--selected').length;
    qa.classList.toggle('active', n > 0);
    qa.querySelector('.sd-tree__qa-count').textContent = String(n);
    qa.querySelector('.c-message').textContent = ' Đã chọn ' + n + ' mục ';
  }
  root.addEventListener('click', function (e) {
    const tog = e.target.closest('.sd-tree__toggle');
    if (tog && root.contains(tog) && !tog.disabled) {
      const r = tog.closest('.sd-tree__row');
      const exp = r.getAttribute('aria-expanded') !== 'true';
      r.setAttribute('aria-expanded', String(exp));
      tog.setAttribute('aria-label', exp ? 'Collapse tree item' : 'Expand tree item');
      const ic = tog.querySelector('mat-icon');
      if (ic) ic.textContent = exp ? 'expand_more' : 'chevron_right';
      const fi = r.querySelector('.sd-tree__item-icon');
      if (fi && (fi.textContent === 'folder' || fi.textContent === 'folder_open')) fi.textContent = exp ? 'folder_open' : 'folder';
      setHidden(r.closest('.sd-tree'), r.dataset.id, !exp);
      return;
    }
    const clear = e.target.closest('sd-button[data-clear]');
    if (clear && root.contains(clear)) {
      const t = clear.closest('sd-tree');
      t.querySelectorAll('.sd-tree__row--selected').forEach(function (r) {
        r.classList.remove('sd-tree__row--selected');
        r.setAttribute('aria-selected', 'false');
        const cb = r.querySelector('mat-checkbox');
        cb.classList.remove('mat-mdc-checkbox-checked');
        const inp = cb.querySelector('input');
        inp.checked = false;
        inp.classList.remove('mdc-checkbox--selected');
      });
      updateQa(t);
    }
  });
  root.addEventListener('change', function (e) {
    const inp = e.target;
    if (!inp.classList || !inp.classList.contains('mdc-checkbox__native-control')) return;
    const r = inp.closest('.sd-tree__row');
    const cb = inp.closest('mat-checkbox');
    r.classList.toggle('sd-tree__row--selected', inp.checked);
    r.setAttribute('aria-selected', String(inp.checked));
    cb.classList.toggle('mat-mdc-checkbox-checked', inp.checked);
    inp.classList.toggle('mdc-checkbox--selected', inp.checked);
    updateQa(inp.closest('sd-tree'));
  });
})();
