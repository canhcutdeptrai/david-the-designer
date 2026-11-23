// node rawdump-cnpq.mjs <file> — liệt kê phần tử HTML thuần còn lại (cùng bộ lọc với pagecheck)
import { chromium } from 'playwright';
const [f] = process.argv.slice(2);
const root = '/home/claude/kit/prototype-kit-CATALOG-1012m/prototypes/cam-nang-phan-quyen/';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.route(/^https?:/, r => r.abort());
await p.goto('file://' + root + f); await p.waitForTimeout(1200);
const r = await p.evaluate(() => {
  const vis = e => !e.closest('sd-button,sd-select,sd-table,sd-input,sd-date,sd-datetime,sd-checkbox,sd-radio,sd-switch,sd-tab-group,sd-chip,sd-textarea,sd-input-number,sd-autocomplete,sd-date-range,sd-tree,sd-modal,sd-side-drawer,sd-section .c-section-header,sd-dropdown-menu,.sidebar,.page-header,sd-query-bar,sd-upload-file,sd-inform,sd-badge,sd-anchor,sd-stepper,sd-tooltip,sd-history,sd-org-chart,sd-view');
  return [...document.querySelectorAll('button,select,table,input:not([type=hidden]):not([type=file]),textarea')].filter(vis).map(e => e.outerHTML.slice(0, 160) + ' @ ' + (e.parentElement && e.parentElement.className));
});
console.log(r.join('\n'));
await b.close();
