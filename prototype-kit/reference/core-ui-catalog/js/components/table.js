/* Table — #c-table */
(function () {
const root = document.getElementById('c-table');
if (!root) return;
root.querySelectorAll('[data-like-select]').forEach(function (cell) {
const src = cell.parentNode.querySelector('sd-select');
if (!src) return;
const c = src.cloneNode(true);
const t = cell.getAttribute('data-like-select');
c.querySelectorAll('mat-label span, .mat-mdc-select-placeholder').forEach(function (n) { n.textContent = t; });
cell.appendChild(c);
});
root.querySelectorAll('column-filter[data-like]').forEach(function (cf) {
const th = cf.closest('th');
const src = cf.closest('tr').querySelector('.mat-column-' + cf.getAttribute('data-like') + ' column-filter');
if (!src) return;
if (th.classList.contains('mat-column-amount')) {
const tpl = document.createElement('template');
tpl.innerHTML = src.outerHTML.replace(/<(\/?)sd-input(?=[ >])/g, '<$1sd-input-number');
cf.replaceWith(tpl.content);
} else { cf.replaceWith(src.cloneNode(true)); }
});
const BADGE = {"Nháp": "secondary", "Chờ phê duyệt": "warning", "Đã phê duyệt": "success", "Đang giải ngân": "info", "Từ chối": "error"};
const DATA = [["FD-2026-00127", "Giải ngân hạn mức HM-0457", "BIDV", "3.800.000.000", "12/10/2026", ["07/10/2026", "16:42:05"], "Đã phê duyệt"], ["FD-2026-00125", "Tái cấp vốn khoản vay KV-2025-031", "Techcombank", "12.500.000.000", "30/10/2026", ["07/10/2026", "10:03:47"], "Đang giải ngân"], ["FD-2026-00121", "Kế hoạch Funding tháng 11/2026", "VietinBank", "760.000.000", "05/11/2026", ["06/10/2026", "14:20:11"], "Nháp"]];
root.querySelectorAll('.cat-stage-qa tbody').forEach(function (tb) {
const first = tb.querySelector('tr.c-row');
const detail = first && first.nextElementSibling;
if (!first || !detail) return;
const fields = ["code", "name", "bank", "amount", "disbursedAt", "updatedAt", "status"];
DATA.forEach(function (vals, i) {
const tr = first.cloneNode(true);
const sel = i === 0;
tr.classList.toggle('selected', sel);
const cb = tr.querySelector('.c-selection input');
if (cb) { cb.checked = sel; cb.classList.toggle('mdc-checkbox--selected', sel); }
const mc = tr.querySelector('mat-checkbox');
if (mc) mc.classList.toggle('mat-mdc-checkbox-checked', sel);
fields.forEach(function (f, k) {
const cell = tr.querySelector('.mat-column-' + f);
const v = vals[k];
if (f === 'status') {
const b = cell.querySelector('.c-badge');
b.className = 'c-badge c-' + BADGE[v] + ' c-badge--sm';
b.querySelector('.c-badge-title').textContent = v;
} else if (f === 'updatedAt') {
const d = cell.querySelector('.T14R');
d.firstChild.textContent = v[0];
d.querySelector('span').textContent = v[1];
} else {
cell.querySelector('.text-break').textContent = ' ' + v + ' ';
}
});
tb.appendChild(tr);
tb.appendChild(detail.cloneNode(true));
});
});
root.querySelectorAll('.cat-stage-qa sd-table').forEach(function (tbl) {
const stage = tbl.closest('.stage');
const qa = stage.querySelector('.c-quick-action');
const count = stage.querySelector('.c-length');
const head = tbl.querySelector('thead .c-selection input');
const rows = Array.prototype.slice.call(tbl.querySelectorAll('tbody tr.c-row'));
function sync() {
let n = 0;
rows.forEach(function (tr) {
const input = tr.querySelector('.c-selection input');
const on = !!(input && input.checked);
tr.classList.toggle('selected', on);
input.classList.toggle('mdc-checkbox--selected', on);
if (on) n++;
});
if (count) count.textContent = String(n);
if (qa) qa.classList.toggle('active', n > 0);
if (head) { head.checked = n === rows.length && n > 0; head.classList.toggle('mdc-checkbox--selected', head.checked); }
}
rows.forEach(function (tr) { const i = tr.querySelector('.c-selection input'); if (i) i.addEventListener('change', sync); });
if (head) head.addEventListener('change', function () { rows.forEach(function (tr) { const i = tr.querySelector('.c-selection input'); if (i) i.checked = head.checked; }); sync(); });
const clear = stage.querySelector('.c-quick-action .c-outline');
if (clear) clear.addEventListener('click', function () { rows.forEach(function (tr) { const i = tr.querySelector('.c-selection input'); if (i) i.checked = false; }); sync(); });
});
root.querySelectorAll('.mat-sort-header:not(.mat-sort-header-disabled)').forEach(function (h) {
h.addEventListener('click', function (e) {
if (e.target.closest('column-filter')) return;
const order = ['none', 'ascending', 'descending'];
const next = order[(order.indexOf(h.getAttribute('aria-sort')) + 1) % 3];
h.closest('tr').querySelectorAll('.mat-sort-header').forEach(function (o) {
o.setAttribute('aria-sort', 'none');
const c = o.querySelector('.mat-sort-header-container'); if (c) c.classList.remove('mat-sort-header-sorted');
});
h.setAttribute('aria-sort', next);
const c = h.querySelector('.mat-sort-header-container'); if (c) c.classList.toggle('mat-sort-header-sorted', next !== 'none');
});
});
const src = root.querySelector('.cat-stage-qa sd-table');
root.querySelectorAll('[data-clone]').forEach(function (stage) {
if (!src) return;
const kind = stage.getAttribute('data-clone');
const t = src.cloneNode(true);
t.querySelectorAll('column-filter').forEach(function (n) { n.remove(); });
t.querySelectorAll('tr.selected').forEach(function (n) { n.classList.remove('selected'); });
t.querySelectorAll('.c-selection input').forEach(function (n) { n.checked = false; n.classList.remove('mdc-checkbox--selected'); });
t.querySelectorAll('[aria-sort]').forEach(function (n) { n.setAttribute('aria-sort', 'none'); });
t.querySelectorAll('.mat-sort-header-sorted').forEach(function (n) { n.classList.remove('mat-sort-header-sorted'); });
const body = t.querySelector('tbody');
if (kind === 'loading') {
const rows = body.querySelectorAll('tr');
for (let i = 6; i < rows.length; i++) rows[i].remove();
const tpl = stage.querySelector('template.cat-spinner');
t.querySelector('.c-container').prepend(tpl.content.cloneNode(true));
} else {
body.replaceChildren();
const head = t.querySelector('thead .sd-selection-cell');
if (head) head.replaceChildren();
const box = document.createElement('div');
box.className = 'c-no-data-row';
box.appendChild(stage.querySelector('template[data-empty="data"]').content.cloneNode(true));
t.querySelector('.c-table').appendChild(box);
const pag = t.querySelector('mat-paginator');
if (pag) pag.classList.add('d-none');
const btns = t.querySelectorAll('.c-action sd-button');
if (btns[0]) { const b0 = btns[0].querySelector('button'); b0.disabled = true; b0.classList.add('c-disabled', 'mat-mdc-button-disabled'); }
if (btns[1]) btns[1].remove();
}
stage.querySelector('.cat-table-box').appendChild(t);
});
root.querySelectorAll('.cat-toolbar').forEach(function (bar) {
const stage = bar.closest('.stage');
bar.addEventListener('click', function (e) {
const b = e.target.closest('button[data-show]');
if (!b) return;
bar.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
const tpl = stage.querySelector('template[data-empty="' + b.getAttribute('data-show') + '"]');
const box = stage.querySelector('.c-no-data-row');
if (tpl && box) { box.replaceChildren(tpl.content.cloneNode(true)); }
});
});
root.querySelectorAll('.sd-tree-toggle-btn').forEach(function (btn) {
const tr = btn.closest('tr');
const level = Number(tr.getAttribute('data-level'));
function rowsBelow() {
const out = [];
let n = tr.nextElementSibling;
while (n) {
if (n.classList.contains('c-row')) { if (Number(n.getAttribute('data-level')) <= level) break; out.push(n); }
else if (out.length || n.previousElementSibling === tr) { out.push(n); }
n = n.nextElementSibling;
}
return out;
}
btn.addEventListener('click', function () {
const ic = btn.querySelector('mat-icon');
const open = ic.textContent.trim() === 'expand_more';
ic.textContent = open ? 'chevron_right' : 'expand_more';
rowsBelow().forEach(function (r) { r.hidden = open; });
});
});
})();
