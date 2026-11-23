/* Inline text — #c-inline-text */
(function () {
  'use strict';
  var root = document.getElementById('c-inline-text');
  if (!root) return;

  root.querySelectorAll('sd-inline-text').forEach(function (host) {
    var el = host.querySelector('input');
    if (!el || el.disabled) return;
    var min = +(host.getAttribute('data-min') || 2);
    function sync(focused) {
      var forced = host.getAttribute('data-force');
      host.setAttribute('data-state', forced || (focused ? 'focus' : (el.value ? 'active' : 'pending')));
      el.size = Math.max(min, el.value ? el.value.length : el.placeholder.length);
      var clr = host.querySelector('.sd-inline-text__clear');
      if (clr) clr.hidden = !el.value;
    }
    el.addEventListener('focus', function () { sync(true); });
    el.addEventListener('blur', function () { sync(false); });
    el.addEventListener('input', function () { sync(true); });
    var clr = host.querySelector('.sd-inline-text__clear');
    if (clr) clr.addEventListener('mousedown', function (e) { e.preventDefault(); el.value = ''; sync(document.activeElement === el); });
  });

})();
