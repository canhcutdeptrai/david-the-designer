/* Query Bar — #c-query-bar */
(function () {
'use strict';
const root = document.getElementById('c-query-bar');
if (!root) return;
const HOSTS = 'sd-query-popover-chip,sd-query-inline-value-chip,sd-query-inline-chip,sd-query-build-chip';
const $$ = (el, s) => Array.from(el.querySelectorAll(s));
const paneOf = (tr) => { const st = tr.closest('.stage'); return st && st.querySelector('.cdk-overlay-pane[data-anchor="' + tr.dataset.qb + '"]'); };
const trigOf = (p) => p.closest('.stage').querySelector('[data-qb="' + p.dataset.anchor + '"]');
function place() {
$$(root, '.cdk-overlay-pane[data-anchor]').forEach((p) => {
const st = p.closest('.stage'), tr = trigOf(p);
if (!tr || p.hidden) return;
const s = st.getBoundingClientRect(), a = tr.getBoundingClientRect();
const left = (p.dataset.x === 'before' ? a.right - p.offsetWidth : a.left) - s.left + st.scrollLeft;
p.style.left = Math.max(0, left) + 'px'; p.style.right = 'auto';
p.style.top = (a.bottom - s.top + st.scrollTop) + 'px';
});
}
function show(p, on) { p.hidden = !on; const tr = trigOf(p); if (tr) tr.setAttribute('aria-expanded', String(on)); place(); }
function sync(bar) {
const n = $$(bar, HOSTS).length, kw = bar.querySelector('.c-search-input');
const lg = bar.querySelector('.c-logic-toggle'), cl = bar.querySelector('.c-clear-all'), se = bar.querySelector('.c-search-trigger');
if (lg) lg.hidden = n < 2;
if (cl) { cl.hidden = n === 0; cl.title = 'Xóa tất cả (' + n + ')'; }
if (se) se.disabled = n === 0 && !(kw && kw.value.trim());
if (n < 2) $$(bar, '.c-or-connector').forEach((c) => c.remove());
}
function removeChip(h) {
const bar = h.closest('sd-query-bar'), pv = h.previousElementSibling, nx = h.nextElementSibling;
if (pv && pv.classList.contains('c-or-connector')) pv.remove();
else if (nx && nx.classList.contains('c-or-connector')) nx.remove();
const tr = h.querySelector('[data-qb]'), p = tr && paneOf(tr);
if (p) p.hidden = true;
h.remove(); sync(bar); place();
}
function setLogic(bar, v) {
$$(bar, '.c-logic-segment').forEach((b) => b.classList.toggle('c-logic-active', b.dataset.logic === v));
$$(bar, '.c-or-connector').forEach((c) => c.remove());
if (v === 'OR') $$(bar, HOSTS).slice(1).forEach((h) => {
const o = document.createElement('span'); o.className = 'c-or-connector'; o.setAttribute('aria-hidden', 'true'); o.textContent = 'OR';
h.parentNode.insertBefore(o, h);
});
}
root.addEventListener('click', (e) => {
const t = e.target, f = (s) => t.closest(s);
let el;
if ((el = f('.c-chip-remove,.c-token-remove,.c-seamless__x'))) { e.stopPropagation(); const h = el.closest(HOSTS); if (h) removeChip(h); }
else if ((el = f('.c-logic-segment'))) setLogic(el.closest('sd-query-bar'), el.dataset.logic);
else if ((el = f('.c-clear-all'))) $$(el.closest('sd-query-bar'), HOSTS).forEach(removeChip);
else if ((el = f('.c-bool-btn'))) { const on = !el.classList.contains('c-bool-active'); $$(el.parentNode, '.c-bool-btn').forEach((b) => b.classList.remove('c-bool-active')); el.classList.toggle('c-bool-active', on); }
else if ((el = f('.c-sf-del'))) { e.stopPropagation(); el.closest('.c-sf-row').remove(); place(); }
else if ((el = f('[data-qb]')) && paneOf(el)) { const p = paneOf(el); show(p, p.hidden); }
else if ((el = f('.mat-mdc-menu-item:not([disabled])'))) show(el.closest('.cdk-overlay-pane'), false); // chọn dòng → đóng menu
});
root.addEventListener('input', (e) => {
const t = e.target;
if (t.classList.contains('c-search-input')) sync(t.closest('sd-query-bar'));
if (t.classList.contains('sd-inline-text__input')) t.size = Math.max(2, (t.value || t.placeholder).length);
});
place();
window.addEventListener('resize', place);
window.addEventListener('load', place);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
})();
