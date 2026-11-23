// Kiểm bảng phạm vi trong drawer "Tạo ủy quyền nội bộ" (sd-checkbox / sd-select / sd-input)
import { chromium } from 'playwright';
const root = '/home/claude/kit/prototype-kit-CATALOG-1012m/prototypes/cam-nang-phan-quyen/';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.route(/^https?:/, r => r.abort());
const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 300)));
await p.goto('file://' + root + 'tra-cuu-cam-nang-v2.html'); await p.waitForTimeout(1200);
const W = ms => p.waitForTimeout(ms || 400);
await p.click('.page-tab-zone .tab:nth-child(3)'); await W(900);
await p.locator('sd-button:has-text("Tạo ủy quyền")').click(); await W(900);
const sum = () => p.locator('#scope-picker-summary').textContent();
console.log('init', await sum());
const rows = p.locator('.scope-picker-row');
console.log('rows', await rows.count());
// bỏ tích dòng 1 -> 0 dòng
await rows.nth(0).locator('sd-checkbox[data-scope-role="row"] input').click(); await W();
console.log('row0 off', await sum());
await rows.nth(0).locator('sd-checkbox[data-scope-role="row"] input').click(); await W();
console.log('row0 on', await sum());
// tích "chọn tất cả" ở đầu bảng: tắt rồi bật
await p.locator('.scope-picker-head sd-checkbox[data-scope-role="all"] input').click(); await W();
console.log('all off', await sum());
await p.locator('.scope-picker-head sd-checkbox[data-scope-role="all"] input').click(); await W();
console.log('all on', await sum());
if (await rows.count() > 1) {
  // dòng 2 (bị chặn) đang khoá: các ô điều kiện disabled
  console.log('row1 disabled conds', await rows.nth(1).locator('sd-checkbox[disabled]').count());
  // mở khoá thử bằng cách bỏ disabled dòng (mô phỏng admin) -> tích dòng -> bấm chữ điều kiện
  await p.evaluate(() => { const c = document.querySelectorAll('.scope-picker-row')[1].querySelector('sd-checkbox[data-scope-role="row"]'); c.removeAttribute('disabled'); });
  await W(300);
  await rows.nth(1).locator('sd-checkbox[data-scope-role="row"] input').click(); await W();
  console.log('row1 on', await sum(), 'disabled left', await rows.nth(1).locator('sd-checkbox[disabled]').count());
  await rows.nth(1).locator('label.scope-condition-option span', { hasText: 'Điều kiện 1' }).click(); await W();
  console.log('click text cond1', await sum());
  await rows.nth(1).locator('label.scope-condition-option sd-checkbox[data-scope-role="condition"] input').nth(1).click(); await W();
  console.log('click box cond2', await sum());
  await rows.nth(1).locator('label.scope-condition-select-all sd-checkbox input').click(); await W();
  console.log('select-all conds', await sum());
}
await p.locator('.scope-picker-head sd-select').first().locator('mat-form-field').click(); await W();
await p.locator('.cdk-overlay-pane .sd-dropdown-item', { hasText: 'MAG' }).first().click(); await W();
console.log('handbook select', (await p.locator('.scope-picker-head sd-select').first().getAttribute('value')));
await p.locator('.scope-picker-head sd-input input').first().fill('abc');
console.log('search input', await p.locator('.scope-picker-head sd-input').first().evaluate(e => e.value));
await p.screenshot({ path: '/home/claude/work/round/agents/v2/scope.png' });
await b.close();
console.log(errs.length ? 'JS ERRORS:\n  ' + errs.join('\n  ') : 'Không lỗi JS.');
