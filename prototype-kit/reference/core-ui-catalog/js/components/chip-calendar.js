/* Chip calendar — #c-chip-calendar */
(function () {
  const root = document.getElementById('c-chip-calendar');
  if (!root) return;
const MON = ['January','February','March','April','May','June','July','August','September','October','November','December'];
root.querySelectorAll('tbody[mat-calendar-body][data-y]').forEach((tb) => {
const y = +tb.dataset.y, m = +tb.dataset.m, today = +tb.dataset.today || 0;
const sel = (tb.dataset.sel || '').split(',').filter(Boolean).map(Number);
const rg = tb.dataset.range ? tb.dataset.range.split('-').map(Number) : null;
const dcls = tb.dataset.dclass ? tb.dataset.dclass.split(':') : null;
const off = new Date(y, m - 1, 1).getDay(), n = new Date(y, m, 0).getDate();
const pad = 'padding-top: 7.14286%; padding-bottom: 7.14286%;';
const name = MON[m - 1], active = sel.length ? Math.min(...sel) : (today || 1);
let html = '', cells = off ? '<td class="mat-calendar-body-label" colspan="' + off + '" style="' + pad + '">' + (off >= 3 ? name.slice(0, 3).toUpperCase() : '') + '</td>' : '';
for (let d = 1; d <= n; d++) {
const col = (off + d - 1) % 7, row = Math.floor((off + d - 1) / 7);
const b = ['mat-calendar-body-cell'];
if (dcls && dcls[1].split(',').map(Number).includes(d)) b.push(dcls[0]);
if (rg) { if (d === rg[0]) b.push('mat-calendar-body-range-start'); if (d === rg[1]) b.push('mat-calendar-body-range-end'); if (d >= rg[0] && d <= rg[1]) b.push('mat-calendar-body-in-range'); }
if (d === active) b.push('mat-calendar-body-active');
const c = ['mat-calendar-body-cell-content', 'mat-focus-indicator'];
if (sel.includes(d)) c.push('mat-calendar-body-selected');
if (d === today) c.push('mat-calendar-body-today');
const aria = tb.dataset.a11y === 'native' ? name + ' ' + d + ', ' + y : name.slice(0, 3) + ' ' + d + ', ' + y;
cells += '<td role="gridcell" class="mat-calendar-body-cell-container" style="width: 14.2857%; ' + pad + '" data-mat-row="' + row + '" data-mat-col="' + (row ? col : col - off) + '">'
+ '<button type="button" class="' + b.join(' ') + '" tabindex="' + (d === active ? 0 : -1) + '" aria-label="' + aria + '" aria-pressed="' + sel.includes(d) + '"' + (d === today ? ' aria-current="date"' : '') + ' data-day="' + d + '">'
+ '<span class="' + c.join(' ') + '"> ' + d + ' </span><span class="mat-calendar-body-cell-preview" aria-hidden="true"></span></button></td>';
if (col === 6 || d === n) { html += '<tr role="row">' + cells + '</tr>'; cells = ''; }
}
tb.innerHTML = html;
});
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
root.addEventListener('click', (e) => {
const rm = e.target.closest('.mat-mdc-chip-remove');
if (rm) { rm.closest('mat-chip-row').remove(); fit(); }
});
root.querySelectorAll('.fx-anchor').forEach((a) => {
const pane = a.querySelector(':scope > .cdk-overlay-pane');
const input = a.querySelector('input.sd-chip-input');
input.addEventListener('click', () => { pane.hidden = !pane.hidden; });
pane.querySelectorAll('.mat-calendar-body-cell').forEach((btn) => btn.addEventListener('click', () => {
const label = String(btn.dataset.day).padStart(2, '0') + '/10/2026';
const rows = Array.from(a.querySelectorAll('mat-chip-row'));
const hit = rows.find((r) => r.textContent.trim() === label);
btn.classList.toggle('sd-chip-calendar-selected-date', !hit);
if (hit) { hit.remove(); return; }
const row = rows[0].cloneNode(true);
row.querySelector('.mat-mdc-chip-action-label > span').textContent = label;
const after = rows.find((r) => r.textContent.trim().slice(0, 2) > label.slice(0, 2));
(after || input).before(row);
}));
});
})();
