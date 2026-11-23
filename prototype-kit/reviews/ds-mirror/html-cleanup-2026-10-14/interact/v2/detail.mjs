// node detail.mjs <file> — ô tra Quản lý trực tiếp, đổi điều kiện, menu Thêm người, drawer người thẩm định (chạy được cả bản gốc lẫn bản mới)
import { chromium } from 'playwright';
const root = '/home/claude/kit/prototype-kit-CATALOG-1012m/prototypes/cam-nang-phan-quyen/';
const file = process.argv[2] || 'tra-cuu-cam-nang-v2.html';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.route(/^https?:/, r => r.abort());
const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 300)));
const W = ms => p.waitForTimeout(ms || 400);
const log = (k, v) => console.log(k.padEnd(30), JSON.stringify(v));
await p.goto('file://' + root + file + '?categoryId=hr&itemNumber=1.1'); await p.waitForTimeout(1500);
log('title', await p.locator('.detail-sticky-name').textContent());
log('resolver result', (await p.locator('#manager-resolver-result').innerText()).replace(/\s+/g, ' ').slice(0, 120));
const inp = p.locator('.manager-resolver-search-row input');
await inp.fill(''); await inp.type('trang', { delay: 30 }); await W(500);
log('resolver after "trang"', (await p.locator('#manager-resolver-result').innerText()).replace(/\s+/g, ' ').slice(0, 120));
log('focus kept', await p.evaluate(() => !!(document.activeElement && document.activeElement.closest('.manager-resolver-search-row'))));
await p.screenshot({ path: '/home/claude/work/round/agents/v2/' + file + '.resolver.png' });
// đổi Khối -> Phòng ban mở khoá
await p.locator('#proposal-org-division mat-form-field, #proposal-org-division').first().click(); await W();
await p.locator('.cdk-overlay-pane .sd-dropdown-item').first().click(); await W(500);
log('division value', await p.locator('#proposal-org-division').getAttribute('value'));
log('department disabled', await p.locator('#proposal-org-department').evaluate(e => e.hasAttribute('disabled')));
// xoá Khối bằng nút x của sd-select
await p.locator('#proposal-org-division .sd-clear-btn').click(); await W(500);
log('after clear division', [await p.locator('#proposal-org-division').getAttribute('value'), await p.locator('#proposal-org-department').evaluate(e => e.hasAttribute('disabled'))]);
log('clear btns in division row', await p.locator('#proposal-org-division-row sd-button, #proposal-org-division-row .sd-clear-btn').count());
// mở drawer người thẩm định
await p.goto('file://' + root + file + '?categoryId=general&itemNumber=1.1'); await p.waitForTimeout(1500);
const fa = p.locator('.flow-action-icon').first();
log('flow action btns', await p.locator('.flow-action-icon').count());
if (await fa.count()) {
  await fa.click(); await W();
  await p.locator('.flow-action-menu.open .flow-action-option', { hasText: 'Thêm người thẩm định' }).click(); await W(800);
  await p.locator('#actor-search-input input').fill('ng'); await W(600);
  log('actor results', await p.locator('.actor-result-item').count());
  await p.locator('.actor-result-item').first().click(); await W(400);
  log('confirm title', await p.locator('#actor-picker-confirm-button').textContent());
  await p.waitForTimeout(400);
  await p.locator('#actor-picker-confirm-button').click(); await W(900);
  log('reviewer rows', await p.locator('.reviewer-row').count());
}
await b.close();
console.log(errs.length ? 'JS ERRORS:\n  ' + errs.join('\n  ') : 'Không lỗi JS.');
