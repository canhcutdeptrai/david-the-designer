/* Operator — #c-operator */
(function () {
  const root = document.getElementById('c-operator');
  root.querySelectorAll('.op-demo').forEach(function (demo) {
    const host = demo.querySelector('sd-operator');
    const trigger = host.querySelector('.c-op-trigger');
    const pane = demo.querySelector('.op-pane');
    trigger.addEventListener('click', function () {
      pane.hidden = !pane.hidden;
      trigger.setAttribute('aria-expanded', String(!pane.hidden));
    });
    pane.querySelectorAll('.c-op-row').forEach(function (row) {
      row.addEventListener('click', function () {
        pane.querySelectorAll('.c-op-row').forEach(function (r) { r.classList.toggle('c-op-active', r === row); });
        host.setAttribute('data-model', row.getAttribute('data-value'));
        trigger.querySelector('.c-op-icon').innerHTML = row.querySelector('.c-op-icon').innerHTML;
        trigger.setAttribute('title', row.querySelector('.c-op-label').textContent);
        pane.hidden = true;
        trigger.setAttribute('aria-expanded', 'false');
      });
    });
  });
})();
