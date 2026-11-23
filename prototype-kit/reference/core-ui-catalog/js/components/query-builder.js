/* Query Builder — #c-query-builder */
(function () {
  const root = document.getElementById('c-query-builder');
  if (!root) return;

  // Dựng khung MDC của mat-form-field outline (wrapper > flex > notched-outline + label, subscript) từ data-*
  function hydrate(scope) {
  scope.querySelectorAll('mat-form-field[data-ff]').forEach(function (f) {
    const lab = f.dataset.l, fl = 'f' in f.dataset, req = 'r' in f.dataset, err = f.dataset.e;
    const w = document.createElement('div');
    w.className = 'mat-mdc-text-field-wrapper mdc-text-field mdc-text-field--outlined' + (lab ? '' : ' mdc-text-field--no-label') + (err ? ' mdc-text-field--invalid' : '');
    const fx = document.createElement('div'); fx.className = 'mat-mdc-form-field-flex';
    const n = document.createElement('div');
    n.className = 'mdc-notched-outline ' + (lab ? 'mdc-notched-outline--upgraded' + (fl ? ' mdc-notched-outline--notched' : '') : 'mdc-notched-outline--no-label');
    n.innerHTML = '<div class="mat-mdc-notch-piece mdc-notched-outline__leading"></div><div class="mat-mdc-notch-piece mdc-notched-outline__notch"></div><div class="mat-mdc-notch-piece mdc-notched-outline__trailing"></div>';
    if (lab) {
      const l = document.createElement('label');
      l.className = 'mdc-floating-label mat-mdc-floating-label' + (fl ? ' mdc-floating-label--float-above' : '');
      l.innerHTML = '<mat-label style="display:inline-block"><div style="display:flex;align-items:center;gap:4px"><span></span></div></mat-label>' + (req ? '<span aria-hidden="true" class="mat-mdc-form-field-required-marker mdc-floating-label--required"></span>' : '');
      l.querySelector('span').textContent = lab;
      n.children[1].appendChild(l);
    }
    fx.appendChild(n);
    while (f.firstChild) fx.appendChild(f.firstChild);
    w.appendChild(fx); f.appendChild(w);
    const sub = document.createElement('div');
    sub.className = 'mat-mdc-form-field-subscript-wrapper mat-mdc-form-field-bottom-align';
    if (err && !f.classList.contains('hide-inline-error')) {
      sub.innerHTML = '<div class="mat-mdc-form-field-error-wrapper"><mat-error class="mat-mdc-form-field-error mat-mdc-form-field-bare-error"></mat-error></div>';
      sub.querySelector('mat-error').textContent = err;
    }
    f.appendChild(sub);
    ['ff', 'l', 'f', 'r', 'e'].forEach(function (k) { delete f.dataset[k]; });
  });
  }
  hydrate(root);
  // Bề rộng notch của label nổi (Material đo bằng JS: labelWidth * 0.75 + 9px)
  function notch() {
    root.querySelectorAll('.mdc-notched-outline--notched .mdc-notched-outline__notch').forEach(function (n) {
      const l = n.querySelector('.mdc-floating-label');
      if (l && l.scrollWidth) n.style.width = 'calc(' + l.scrollWidth + 'px * 0.75 + 9px)';
    });
  }
  notch();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(notch);

  const blankEl = root.querySelector('[data-blank] .qb-treenode');
  const blankTpl = blankEl ? blankEl.outerHTML : '';
  function closeAll(except) {
    root.querySelectorAll('.qb-header.is-open').forEach(function (h) {
      if (h === except) return;
      h.classList.remove('is-open');
      const d = h.querySelector('.qb-dropdown'); if (d) d.remove();
    });
  }
  root.addEventListener('click', function (e) {
    const t = e.target.closest('button');
    const cont = e.target.closest('.qb-container');
    if (!cont || cont.classList.contains('is-disabled')) return;
    if (!t) { closeAll(); return; }
    const header = t.closest('.qb-header');
    if (t.parentElement.classList.contains('qb-logic-switch')) {
      t.parentElement.querySelectorAll('button').forEach(function (b) { b.classList.toggle('active', b === t); });
      return;
    }
    if (t.classList.contains('qb-btn-add')) {
      e.stopPropagation();
      const open = header.classList.contains('is-open');
      closeAll();
      if (!open) {
        header.classList.add('is-open');
        const d = document.createElement('div');
        d.className = 'qb-dropdown';
        d.innerHTML = '<button type="button" data-add="rule">+ Điều kiện</button><button type="button" data-add="group">+ Nhóm</button>';
        t.after(d);
      }
      return;
    }
    if (t.dataset.add) {
      const body = header.nextElementSibling;
      const empty = body.querySelector(':scope > .qb-empty'); if (empty) empty.remove();
      const html = t.dataset.add === 'rule' ? blankTpl
        : '<div class="qb-treenode is-group"><div class="qb-group"><div class="qb-header"><div class="qb-logic-switch"><button type="button" class="active">AND</button><button type="button">OR</button></div><div class="qb-actions"><button type="button" class="qb-btn qb-btn-add" title="Thêm">+</button><button type="button" class="qb-btn qb-btn-remove" title="Xoá nhóm">✕</button></div></div><div class="qb-body">' + blankTpl + '</div></div></div>';
      body.insertAdjacentHTML('beforeend', html);
      closeAll();
      return;
    }
    if (t.classList.contains('qb-btn-remove-rule') || t.classList.contains('qb-btn-remove')) {
      const node = t.closest('.qb-treenode');
      const body = node.parentElement;
      node.remove();
      if (!body.children.length) body.innerHTML = '<div class="qb-empty">Chưa có điều kiện</div>';
      return;
    }
    if (t.classList.contains('sd-clear-btn')) { e.preventDefault(); }
  });
})();
