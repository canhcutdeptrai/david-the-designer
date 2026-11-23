// node dispaudit.mjs <kitRoot> <out.json> [filter] — bắt mọi lần JS ẩn/hiện phần tử mà CSS (!important) chặn mất
import { chromium } from 'playwright';
import { readdirSync, writeFileSync } from 'fs';
const [root, out] = process.argv.slice(2);
const list = d => readdirSync(root + d).filter(f => f.endsWith('.html')).map(f => d + f);
const FIL = process.argv[4] ? new RegExp(process.argv[4]) : null;
const pages = [...list('design-system/preview/components/'), ...list('design-system/preview/patterns/'), ...list('prototypes/cam-nang-phan-quyen/'), 'design-system/preview/index.html', 'prototypes/index.html'].filter(f => !FIL || FIL.test(f));
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => {
  Date.now = () => 1791849600000; Math.random = () => 0.42;
  const LOG = window.__DLOG = []; const owner = new WeakMap();
  const desc = e => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (e.getAttribute('class') ? '.' + e.getAttribute('class').trim().split(/\s+/).slice(0, 6).join('.') : '');
  const check = (e, want, how) => queueMicrotask(() => { if (!e.isConnected) return; const d = getComputedStyle(e).display; const bad = want === 'none' ? d !== 'none' : (d === 'none' && !e.closest('[hidden]') && e.parentElement && getComputedStyle(e.parentElement).display !== 'none'); if (bad) LOG.push(how + ' want=' + want + ' got=' + d + ' ' + desc(e)); });
  const sg = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'style');
  Object.defineProperty(HTMLElement.prototype, 'style', { get() { const s = sg.get.call(this); if (!owner.has(s)) { owner.set(s, this); const el = this; try { Object.defineProperty(s, 'display', { configurable: true, get() { return s.getPropertyValue('display'); }, set(v) { s.setProperty('display', v); check(el, v === 'none' ? 'none' : (v === '' ? 'shown' : v), 'style'); } }); } catch (_) {} } return s; }, set(v) { sg.set.call(this, v); }, configurable: true });
  const hd = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'hidden');
  Object.defineProperty(HTMLElement.prototype, 'hidden', { get() { return hd.get.call(this); }, set(v) { hd.set.call(this, v); check(this, v ? 'none' : 'shown', 'prop-hidden'); }, configurable: true });
  const sa = Element.prototype.setAttribute, ra = Element.prototype.removeAttribute;
  Element.prototype.setAttribute = function (n, v) { sa.call(this, n, v); if (n === 'hidden' && this instanceof HTMLElement) check(this, 'none', 'attr-hidden'); };
  Element.prototype.removeAttribute = function (n) { ra.call(this, n); if (n === 'hidden' && this instanceof HTMLElement) check(this, 'shown', 'attr-hidden'); };
  const cl = DOMTokenList.prototype;
  for (const m of ['add', 'remove', 'toggle']) { const o = cl[m]; cl[m] = function (...a) { const r = o.apply(this, a); try { const e = this.__el; } catch (_) {} return r; }; }
  document.addEventListener('click', ev => { const a = ev.target.closest && ev.target.closest('a[href]'); if (a) ev.preventDefault(); }, true);
  window.open = () => null;
});
const res = {};
for (const f of pages) {
  const p = await ctx.newPage(); await p.route(/^https?:/, r => r.abort());
  p.on('dialog', d => d.dismiss().catch(() => {}));
  try {
    await p.goto('file://' + root + f, { timeout: 20000 }); await p.waitForTimeout(1200);
    // tĩnh: phần tử đang có style display / [hidden] mà computed không khớp
    const st = await p.evaluate(() => { const o = []; for (const e of document.querySelectorAll('[style*="display"],[hidden]')) { const want = e.hasAttribute('hidden') || e.style.display === 'none' ? 'none' : e.style.display; const d = getComputedStyle(e).display; if ((want === 'none') !== (d === 'none')) o.push('static want=' + want + ' got=' + d + ' ' + e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + '.' + (e.getAttribute('class') || '').trim().split(/\s+/).slice(0, 6).join('.')); } return o; });
    const n = await p.evaluate(() => { const c = [...document.querySelectorAll('.content-zone button, .content-zone sd-button, .content-zone [onclick], .content-zone [role=tab], .content-zone .c-anchor-list-item, .content-zone summary, .content-zone .mat-mdc-tab, .content-zone .c-expand, .content-zone mat-icon')].filter(e => e.offsetParent); c.slice(0, 120).forEach((e, i) => e.setAttribute('data-dx', i)); return Math.min(c.length, 120); });
    for (let i = 0; i < n; i++) { try { await p.click(`[data-dx="${i}"]`, { timeout: 400, force: true }); await p.waitForTimeout(40); await p.keyboard.press('Escape'); } catch (_) {} if (p.url().indexOf(f) < 0) break; }
    await p.waitForTimeout(300);
    const dyn = await p.evaluate(() => window.__DLOG || []);
    res[f] = [...new Set([...st, ...dyn])];
  } catch (e) { res[f] = ['ERR ' + e.message.slice(0, 80)]; }
  await p.close();
}
writeFileSync(out, JSON.stringify(res, null, 1)); console.log('done', Object.values(res).reduce((a, x) => a + x.length, 0)); await b.close();
