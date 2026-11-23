/* Select — #c-select */
(function () {
  'use strict';
  var root = document.getElementById('c-select');
  if (!root) return;

  var FLOAT = 'mdc-floating-label--float-above';
  function notch(ff) {
    var outline = ff.querySelector('.mdc-notched-outline');
    var label = ff.querySelector('.mdc-notched-outline .mdc-floating-label');
    if (!outline || !label) return;
    var n = outline.querySelector('.mdc-notched-outline__notch');
    if (outline.classList.contains('mdc-notched-outline--notched') && label.scrollWidth) {
      n.style.width = 'calc(' + label.scrollWidth + 'px * var(--mat-mdc-form-field-floating-label-scale, 0.75) + 9px)';
    } else {
      n.style.width = '';
    }
  }
  function setFloat(ff, on) {
    var label = ff.querySelector('.mdc-floating-label');
    if (!label) return;
    label.classList.toggle(FLOAT, on);
    ff.querySelector('.mdc-notched-outline').classList.toggle('mdc-notched-outline--notched', on);
    ff.classList.toggle('mat-form-field-hide-placeholder', !on);
    notch(ff);
  }
  function setFocus(ff, on) {
    ff.classList.toggle('mat-focused', on);
    ff.querySelector('.mat-mdc-text-field-wrapper').classList.toggle('mdc-text-field--focused', on);
    var box = ff.closest('.sd-input-container, .sd-textarea-container, .d-flex');
    if (box) box.classList.toggle('c-focused', on);
  }
  function refresh() { root.querySelectorAll('.mat-mdc-form-field').forEach(notch); }
  refresh();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
  root.querySelectorAll('.mat-mdc-form-field .sd-clear-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var ff = btn.closest('.mat-mdc-form-field');
      var el = ff.querySelector('input.mat-mdc-input-element, textarea.mat-mdc-input-element');
      if (el) {
        el.value = '';
        el.classList.remove('c-selected');
        if (el.hasAttribute('data-clear-placeholder')) el.placeholder = '';
        el.dispatchEvent(new Event('input'));
      }
      var suf = btn.parentElement;
      var repl = btn.getAttribute('data-replace');
      if (repl) { btn.insertAdjacentHTML('afterend', repl); }
      btn.remove();
      if (!suf.children.length) { suf.remove(); ff.classList.remove('mat-mdc-form-field-has-icon-suffix'); }
      if (ff.classList.contains('mat-mdc-form-field-label-always-float') && el && el.hasAttribute('data-clear-placeholder')) {
        ff.classList.remove('mat-mdc-form-field-label-always-float');
      }
      if (el && document.activeElement !== el) setFloat(ff, el.value !== '');
      var sel = ff.querySelector('.mat-mdc-select');
      if (sel) sel.dispatchEvent(new CustomEvent('sd-clear'));
      refresh();
    });
  });

  function trigger(cellEl, text) {
    var sel = cellEl.querySelector('mat-select');
    var ff = cellEl.querySelector('.mat-mdc-form-field');
    var val = sel.querySelector('.mat-mdc-select-value');
    var multi = sel.classList.contains('mat-mdc-select-multiple');
    var label = ff.querySelector('mat-label span');
    sel.classList.toggle('mat-mdc-select-empty', !text);
    if (!sel.classList.contains('mat-mdc-select-required')) sel.classList.toggle('sd-selected', !!text);
    val.innerHTML = '';
    var span = document.createElement('span');
    if (!text) {
      span.className = 'mat-mdc-select-placeholder mat-mdc-select-min-line';
      span.textContent = label ? label.textContent : '';
    } else {
      span.className = 'mat-mdc-select-value-text';
      var t = document.createElement('mat-select-trigger');
      if (multi) { var d = document.createElement('div'); d.className = 'sd-trigger-text'; d.textContent = text; t.appendChild(d); }
      else t.textContent = ' ' + text + ' ';
      span.appendChild(t);
    }
    val.appendChild(span);
    setFloat(ff, !!text || ff.classList.contains('mat-focused'));
  }
  root.querySelectorAll('.demo-cell').forEach(function (cellEl) {
    var p = cellEl.querySelector('.cdk-overlay-pane');
    var sel = cellEl.querySelector('mat-select');
    if (!sel) return;
    var ff = cellEl.querySelector('.mat-mdc-form-field');
    sel.addEventListener('sd-clear', function () { trigger(cellEl, ''); });
    if (!p) return;
    function setOpen(on) {
      p.hidden = !on;
      sel.classList.toggle('mat-select-open', on);
      sel.setAttribute('aria-expanded', String(on));
      setFocus(ff, on);
      setFloat(ff, on || !sel.classList.contains('mat-mdc-select-empty'));
    }
    sel.querySelector('.mat-mdc-select-trigger').addEventListener('click', function () { setOpen(p.hidden); });
    p.querySelectorAll('mat-option').forEach(function (o) {
      o.addEventListener('click', function () {
        var multi = o.classList.contains('mat-mdc-option-multiple');
        if (multi) {
          var on = !o.classList.contains('mdc-list-item--selected');
          o.classList.toggle('mdc-list-item--selected', on);
          o.querySelector('mat-pseudo-checkbox').classList.toggle('mat-pseudo-checkbox-checked', on);
          var names = [];
          p.querySelectorAll('mat-option.mdc-list-item--selected').forEach(function (s) { names.push(s.textContent.trim()); });
          trigger(cellEl, names.join(', '));
        } else {
          p.querySelectorAll('mat-option').forEach(function (s) {
            s.classList.remove('mdc-list-item--selected', 'mat-mdc-option-active');
            var pc = s.querySelector('mat-pseudo-checkbox'); if (pc) pc.remove();
          });
          o.classList.add('mdc-list-item--selected', 'mat-mdc-option-active');
          o.querySelector('.mdc-list-item__primary-text').insertAdjacentHTML('afterend', '<mat-pseudo-checkbox aria-hidden="true" class="mat-pseudo-checkbox mat-mdc-option-pseudo-checkbox mat-pseudo-checkbox-checked mat-pseudo-checkbox-minimal"></mat-pseudo-checkbox>');
          trigger(cellEl, o.textContent.trim());
          setOpen(false);
        }
      });
    });
  });

})();
