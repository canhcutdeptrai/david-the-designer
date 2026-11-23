/* Checkbox — #c-checkbox */
(function () {
  const root = document.getElementById('c-checkbox');
  if (!root) return;
root.querySelectorAll('input[data-indeterminate]').forEach((i) => { i.indeterminate = true; });
root.querySelectorAll('mat-checkbox input.mdc-checkbox__native-control').forEach((input) => {
input.addEventListener('change', () => {
const host = input.closest('mat-checkbox');
input.indeterminate = false;
input.removeAttribute('aria-checked');
input.classList.toggle('mdc-checkbox--selected', input.checked);
host.classList.toggle('mat-mdc-checkbox-checked', input.checked);
host.setAttribute('data-value', String(input.checked));
host.setAttribute('data-empty', 'false');
});
});
})();
