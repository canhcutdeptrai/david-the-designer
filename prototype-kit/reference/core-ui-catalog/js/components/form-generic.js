/* Form Generic — #c-form-generic */
(function () {
  const root = document.getElementById('c-form-generic');
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

})();
