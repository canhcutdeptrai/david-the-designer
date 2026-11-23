// node count.mjs  — đếm HTML thuần theo từng trạng thái của tra-cuu-cam-nang-v2.html
import { chromium } from 'playwright';
const root = '/home/claude/kit/prototype-kit-CATALOG-1012m/prototypes/cam-nang-phan-quyen/';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.route(/^https?:/, r => r.abort());
const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 300)));
await p.goto('file://' + root + 'tra-cuu-cam-nang-v2.html'); await p.waitForTimeout(1200);
const count = (label) => p.evaluate((label) => {
  const vis = e => !e.closest('sd-button,sd-select,sd-table,sd-input,sd-date,sd-datetime,sd-checkbox,sd-radio,sd-switch,sd-tab-group,sd-chip,sd-textarea,sd-input-number,sd-autocomplete,sd-date-range,sd-tree,sd-modal,sd-side-drawer,sd-section .c-section-header,sd-dropdown-menu,.sidebar,.page-header,sd-query-bar,sd-upload-file,sd-inform,sd-badge,sd-anchor,sd-stepper,sd-tooltip,sd-history,sd-org-chart,sd-view');
  const all = s => [...document.querySelectorAll(s)].filter(vis);
  const cls = s => { const m = {}; all(s).forEach(e => { const k = e.tagName.toLowerCase() + '.' + (e.className && e.className.baseVal === undefined ? String(e.className).split(' ')[0] : ''); m[k] = (m[k] || 0) + 1; }); return m; };
  return label + ' ' + JSON.stringify({ button: cls('button'), select: cls('select'), table: cls('table'), input: cls('input:not([type=hidden]):not([type=file])') });
}, label);
console.log(await count('mặc định'));
await p.click('.work-tree-row.leaf'); await p.waitForTimeout(600);
console.log(await count('mở chi tiết'));
await p.click('.page-tab-zone .tab:nth-child(2)'); await p.waitForTimeout(600);
console.log(await count('tab nhân sự'));
const pick = async (sel) => {
  if (await p.locator(sel + ' .multi-filter-trigger').count()) { await p.locator(sel + ' .multi-filter-trigger').click(); await p.waitForTimeout(300); await p.locator(sel + ' .single-filter-option, ' + sel + ' .multi-filter-option').last().click(); }
  else { await p.locator(sel + ' mat-form-field').click(); await p.waitForTimeout(300); await p.locator('.cdk-overlay-pane .sd-dropdown-item').last().click(); }
  await p.waitForTimeout(700);
};
await pick('#identity-search-person');
console.log(await count('nhân sự đã chọn'));
await p.click('.page-tab-zone .tab:nth-child(3)'); await p.waitForTimeout(800);
console.log(await count('tab ủy quyền'));
await b.close();
console.log(errs.length ? 'JS ERRORS:\n  ' + errs.join('\n  ') : 'Không lỗi JS.');
