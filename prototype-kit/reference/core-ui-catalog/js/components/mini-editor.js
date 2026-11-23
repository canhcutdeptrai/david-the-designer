/* Mini editor — #c-mini-editor */
(function () {
  const root = document.getElementById('c-mini-editor');
  root.querySelectorAll('.ck-editor__editable[contenteditable="true"]').forEach(function (ed) {
    ed.addEventListener('focus', function () { ed.classList.add('ck-focused'); ed.classList.remove('ck-blurred'); });
    ed.addEventListener('blur', function () { ed.classList.remove('ck-focused'); ed.classList.add('ck-blurred'); });
    ed.addEventListener('input', function () {
      const first = ed.querySelector('p[data-placeholder]');
      if (first) first.classList.toggle('ck-placeholder', (ed.textContent || '').length === 0);
    });
  });
  const list = root.querySelector('.ck-mentions');
  if (list) list.addEventListener('mouseover', function (e) {
    const b = e.target.closest('.ck-button');
    if (!b) return;
    list.querySelectorAll('.ck-button').forEach(function (x) { x.classList.toggle('ck-on', x === b); x.classList.toggle('ck-off', x !== b); });
  });
})();
