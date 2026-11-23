/* Switch — #c-switch */
(function () {
  const root = document.getElementById('c-switch');
  if (!root) return;
root.querySelectorAll('mat-slide-toggle button.mdc-switch').forEach((btn) => {
btn.addEventListener('click', () => {
if (btn.disabled) return;
const on = btn.getAttribute('aria-checked') !== 'true';
const host = btn.closest('mat-slide-toggle');
btn.setAttribute('aria-checked', String(on));
btn.classList.toggle('mdc-switch--selected', on);
btn.classList.toggle('mdc-switch--checked', on);
btn.classList.toggle('mdc-switch--unselected', !on);
host.classList.toggle('mat-mdc-slide-toggle-checked', on);
host.setAttribute('data-value', String(on));
});
});
})();
