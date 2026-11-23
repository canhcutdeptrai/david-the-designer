// node pagecheck.mjs <file-in-cam-nang-phan-quyen.html> [outPng]  — mở trang, in lỗi JS + đếm HTML thuần còn lại, chụp ảnh toàn trang
import { chromium } from 'playwright';
const [f, out] = process.argv.slice(2);
const root = '/home/claude/kit/prototype-kit-CATALOG-1012m/prototypes/cam-nang-phan-quyen/';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.route(/^https?:/, r => r.abort());
const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 300)));
p.on('console', m => { if (m.type() === 'error' && !/ERR_|Failed to load resource/.test(m.text())) errs.push('console: ' + m.text().slice(0, 300)); });
await p.goto('file://' + root + f, { timeout: 20000 }); await p.waitForTimeout(1500);
const cnt = await p.evaluate(() => {
  const vis = e => !e.closest('sd-button,sd-select,sd-table,sd-input,sd-date,sd-datetime,sd-checkbox,sd-radio,sd-switch,sd-tab-group,sd-chip,sd-textarea,sd-input-number,sd-autocomplete,sd-date-range,sd-tree,sd-modal,sd-side-drawer,sd-section .c-section-header,sd-dropdown-menu,.sidebar,.page-header,sd-query-bar,sd-upload-file,sd-inform,sd-badge,sd-anchor,sd-stepper,sd-tooltip,sd-history,sd-org-chart,sd-view');
  const q = s => [...document.querySelectorAll(s)].filter(vis).length;
  return { button: q('button'), select: q('select'), table: q('table'), input: q('input:not([type=hidden]):not([type=file])'), textarea: q('textarea') };
});
console.log('RAW (ngoài sd-* / shell):', JSON.stringify(cnt));
if (out) { await p.evaluate(() => { const s = document.createElement('style'); s.textContent = 'html,body,.app-shell,.main-area,.content-zone{height:auto!important;max-height:none!important;overflow:visible!important}'; document.head.appendChild(s); }); await p.waitForTimeout(200); await p.screenshot({ path: out, fullPage: true }); }
console.log(errs.length ? 'JS ERRORS:\n  ' + errs.join('\n  ') : 'Không lỗi JS.');
await b.close();
