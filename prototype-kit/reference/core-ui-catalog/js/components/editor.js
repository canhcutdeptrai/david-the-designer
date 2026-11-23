/* Editor — #c-editor */
(function () {
  const root = document.getElementById('c-editor');
  root.querySelectorAll('.ck-editor__editable[contenteditable="true"]').forEach(function (ed) {
    ed.addEventListener('focus', function () { ed.classList.add('ck-focused'); ed.classList.remove('ck-blurred'); });
    ed.addEventListener('blur', function () { ed.classList.remove('ck-focused'); ed.classList.add('ck-blurred'); });
    const host = ed.closest('.sd-editor');
    const cnt = host && host.querySelector('[data-count]');
    ed.addEventListener('input', function () {
      const text = ed.textContent || '';
      const first = ed.querySelector('p');
      if (first && first.hasAttribute('data-placeholder')) first.classList.toggle('ck-placeholder', text.length === 0);
      if (cnt) {
        cnt.textContent = String(text.length);
        const over = text.length > 500;
        cnt.parentElement.classList.toggle('sd-editor-counter--over', over);
      }
    });
  });
})();
