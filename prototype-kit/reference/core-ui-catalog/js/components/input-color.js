/* Input color — #c-input-color */
(function () {
  'use strict';
  var root = document.getElementById('c-input-color');
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
  function counter(el, focused) {
    var wrap = el.closest('.sd-input-field-wrap, .sd-textarea-field-wrap');
    var c = wrap && wrap.querySelector('.sd-maxlength-counter');
    if (!c) return;
    var max = +(c.getAttribute('data-max') || c.textContent.split('/')[1]);
    c.setAttribute('data-max', max);
    c.textContent = ' ' + el.value.length + '/' + max + ' ';
    c.classList.toggle('sd-maxlength-counter--visible', focused);
    c.classList.toggle('sd-maxlength-counter--exceeded', el.value.length > max);
  }
  root.querySelectorAll('.mat-mdc-form-field input.mat-mdc-input-element, .mat-mdc-form-field textarea.mat-mdc-input-element').forEach(function (el) {
    if (el.disabled || el.hasAttribute('data-static')) return;
    var ff = el.closest('.mat-mdc-form-field');
    var always = ff.classList.contains('mat-mdc-form-field-label-always-float');
    function sync(focused) {
      setFocus(ff, focused);
      setFloat(ff, always || focused || el.value !== '');
      counter(el, focused);
    }
    el.addEventListener('focus', function () { sync(true); });
    el.addEventListener('blur', function () { sync(false); });
    el.addEventListener('input', function () { sync(document.activeElement === el); });
  });
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

  var HEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/;
  root.querySelectorAll('sd-input-color').forEach(function (host) {
    var text = host.querySelector('input.mat-mdc-input-element');
    var sw = host.querySelector('.sd-input-color__swatch');
    var picker = host.querySelector('.sd-input-color__hidden-picker');
    if (!text || !sw || !picker) return;
    function paint() {
      var ok = HEX.test(text.value);
      sw.style.background = ok ? text.value : 'transparent';
      sw.classList.toggle('sd-input-color__swatch--empty', !ok);
    }
    sw.addEventListener('click', function () { if (!sw.disabled) picker.click(); });
    picker.addEventListener('input', function () {
      text.value = picker.value.toUpperCase();
      text.dispatchEvent(new Event('input'));
      text.dispatchEvent(new Event('blur'));
    });
    text.addEventListener('input', paint);
  });

})();
