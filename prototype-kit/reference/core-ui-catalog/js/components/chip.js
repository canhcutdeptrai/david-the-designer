/* Chip — #c-chip */
(function () {
  const root = document.getElementById('c-chip');
  if (!root) return;
const fit = () => {
root.querySelectorAll('.mdc-notched-outline--notched').forEach((o) => {
const label = o.querySelector('.mdc-floating-label');
const notch = o.querySelector('.mdc-notched-outline__notch');
if (label && notch && label.scrollWidth) notch.style.width = 'calc(' + label.scrollWidth + 'px * var(--mat-mdc-form-field-floating-label-scale, 0.75) + 9px)';
});
root.querySelectorAll('.fx-anchor').forEach((a) => {
const w = a.querySelector('.mat-mdc-text-field-wrapper');
const p = a.querySelector(':scope > .cdk-overlay-pane');
if (w && p) p.style.top = (w.getBoundingClientRect().bottom - a.getBoundingClientRect().top + (p.dataset.offset ? +p.dataset.offset : 0)) + 'px';
});
};
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
fit();
// Enter (hoặc dấu phẩy) thêm chip, bấm cancel để xoá — như matChipInputTokenEnd / (removed).
root.addEventListener('click', (e) => {
const rm = e.target.closest('.mat-mdc-chip-remove');
if (rm) { rm.closest('mat-chip-row').remove(); fit(); }
});
root.querySelectorAll('sd-chip input.sd-chip-input:not([disabled])').forEach((input) => {
input.addEventListener('keydown', (e) => {
if (e.key !== 'Enter' && e.key !== ',') return;
e.preventDefault();
const v = input.value.trim();
if (!v) return;
const proto = root.querySelector('sd-chip mat-chip-row:not(.mat-mdc-chip-disabled)');
if (!proto) return;
const row = proto.cloneNode(true);
row.querySelector('.mat-mdc-chip-action-label > span').textContent = v;
input.before(row);
input.value = '';
});
});
})();
