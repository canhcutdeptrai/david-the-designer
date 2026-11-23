/* Confirm — #c-confirm */
(function () {
  const root = document.getElementById('c-confirm');
  root.querySelectorAll('.stage').forEach(function (stage) {
    const overlay = stage.querySelector('[data-cf-overlay]');
    const opener = stage.querySelector('[data-cf-open]');
    if (!overlay || !opener) return;
    overlay.querySelectorAll('[data-cf-close]').forEach(function (b) {
      b.addEventListener('click', function () { overlay.hidden = true; });
    });
    opener.addEventListener('click', function () {
      overlay.hidden = false;
      const yes = overlay.querySelector('[cdkfocusinitial] button');
      if (yes) yes.classList.add('cdk-focused', 'cdk-program-focused');
    });
  });
})();
