/* Document builder — #c-document-builder */
(function () {
  const root = document.getElementById('c-document-builder');
  root.querySelectorAll('.ck-editor__editable[contenteditable="true"]').forEach(function (ed) {
    ed.addEventListener('focus', function () { ed.classList.add('ck-focused'); ed.classList.remove('ck-blurred'); });
    ed.addEventListener('blur', function () { ed.classList.remove('ck-focused'); ed.classList.add('ck-blurred'); });
  });
})();
