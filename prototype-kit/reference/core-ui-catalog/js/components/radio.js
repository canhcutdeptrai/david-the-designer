/* Radio — #c-radio */
(function () {
  const root = document.getElementById('c-radio');
  if (!root) return;
root.querySelectorAll('mat-radio-group').forEach((group) => {
group.addEventListener('change', (e) => {
const input = e.target;
if (!input.matches('input.mdc-radio__native-control')) return;
group.querySelectorAll('mat-radio-button').forEach((b) => {
b.classList.toggle('mat-mdc-radio-checked', b.querySelector('input').checked);
});
group.setAttribute('data-value', input.value);
group.setAttribute('data-empty', 'false');
const err = group.parentElement.querySelector('mat-error');
if (err) err.remove();
});
});
})();
