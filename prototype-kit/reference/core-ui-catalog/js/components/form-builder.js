/* Form Builder — #c-form-builder */
(function () {
  const root = document.getElementById('c-form-builder');
  if (!root) return;
  const ACT = {"item": [["edit_off", "Chỉ xem", ""], ["content_copy", "Nhân bản", ""], ["visibility", "Ẩn", ""], ["delete", "Xóa", " danger"]], "group": [["open_in_full", "Thiết kế group", ""], ["content_copy", "Nhân bản", ""], ["visibility", "Ẩn", ""], ["delete", "Xóa", " danger"]], "break": [["visibility", "Ẩn", ""], ["delete", "Xóa", " danger"]]};
  root.querySelectorAll('.fb-actions[data-a]').forEach(function (a) {
    a.innerHTML = ACT[a.dataset.a].map(function (b) {
      return '<button type="button" class="fb-icon-btn' + b[2] + '" title="' + b[1] + '"><span class="msi">' + b[0] + '</span></button>';
    }).join('');
    a.removeAttribute('data-a');
  });

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

  // phần lặp lại của mỗi dòng / item / palette (template gốc: fb-row__drag, fb-row-break-btn, fb-resize, fb-palette-item__drag)
  root.querySelectorAll('.fb-row').forEach(function (r) {
    r.insertAdjacentHTML('afterbegin', '<div class="fb-row__drag" title="Kéo lên / xuống"><span class="msi">drag_indicator</span></div><button type="button" class="fb-row-break-btn" title="Ngắt dòng"><span class="msi">horizontal_rule</span></button>');
  });
  root.querySelectorAll('.fb-design .fb-item:not(.is-break):not(.fb-item--static)').forEach(function (it) {
    it.insertAdjacentHTML('beforeend', '<div class="cdk-drop-list"><div class="fb-resize cdk-drag" aria-label="resize" title="Co dãn"></div></div>');
  });
  root.querySelectorAll('.fb-palette-item').forEach(function (it) {
    it.insertAdjacentHTML('beforeend', '<span class="fb-palette-item__drag"><span class="msi">drag_indicator</span></span>');
  });
  const design = root.querySelector('.fb-design');
  design.addEventListener('click', function (e) {
    const it = e.target.closest('.fb-item:not(.fb-item--static), .fb-group');
    if (it && design.contains(it) && !e.target.closest('.fb-actions')) {
      design.querySelectorAll('.is-selected').forEach(function (x) { x.classList.remove('is-selected'); });
      it.classList.add('is-selected');
    }
  });
})();
