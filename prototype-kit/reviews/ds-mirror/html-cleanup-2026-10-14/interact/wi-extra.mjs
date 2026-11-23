// Kiểm thêm: popup nâng version khi KHÔNG đổi gì; dòng điều kiện dạng gọn (Luồng 2) đổi loại → sd-date không nhãn
import { chromium } from 'playwright';
const root = process.env.ROOT || '/home/claude/kit/prototype-kit-CATALOG-1012m/prototypes/cam-nang-phan-quyen/';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
const errs = [];
for (const f of ['sua-workitem.html', 'tao-workitem.html?clone=1']) {
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  await p.route(/^https?:/, r => r.abort());
  p.on('pageerror', e => errs.push(f + ': ' + e));
  await p.goto('file://' + root + f); await p.waitForTimeout(1200);
  if (f.startsWith('sua')) {
    await p.locator('button', { hasText: /^\s*(save)?Lưu\s*$/ }).first().click(); await p.waitForTimeout(400);
    const r = await p.evaluate(() => ({ overlay: document.querySelectorAll('.version-save-overlay').length, force: document.querySelectorAll('.version-save-force-note').length, sameDisabled: document.querySelector('.version-save-overlay sd-radio[value="same"]').hasAttribute('disabled') }));
    console.log((r.overlay === 1 && r.force === 0 && !r.sameDisabled ? 'PASS' : 'FAIL') + ' sửa, chưa đổi gì → popup, không bắt buộc nâng version ' + JSON.stringify(r));
    await p.waitForTimeout(350); await p.locator('.version-save-footer sd-button').first().click(); await p.waitForTimeout(300);
    console.log((await p.locator('.version-save-overlay').count() === 0 ? 'PASS' : 'FAIL') + ' Bỏ qua → đóng popup');
  }
  const sec = p.locator('#cond-builder-tier-2').locator('xpath=ancestor::sd-section[1]');
  const collapsed = await sec.evaluate(e => e.hasAttribute('collapsed'));
  if (collapsed) { await sec.locator('.c-section-header').first().click(); await p.waitForTimeout(400); }
  const row = p.locator('#cond-builder-tier-2 .cond-row').first();
  await row.locator('sd-select.cond-field mat-form-field').click(); await p.waitForTimeout(200);
  await p.locator('.cdk-overlay-pane .sd-dropdown-item', { hasText: 'Ngày đề xuất' }).first().click(); await p.waitForTimeout(250);
  const r2 = await row.evaluate(r => ({ date: r.querySelectorAll('.cond-val-wrap sd-date').length, label: r.querySelectorAll('.cond-val-wrap label').length, num: r.querySelectorAll('.cond-val-wrap sd-input-number').length }));
  console.log((r2.date === 1 && r2.label === 0 && r2.num === 0 ? 'PASS' : 'FAIL') + ' ' + f + ' dòng gọn: Ngày đề xuất → 1 sd-date, không nhãn ' + JSON.stringify(r2));
  await row.locator('sd-select.cond-op mat-form-field').click(); await p.waitForTimeout(200);
  await p.locator('.cdk-overlay-pane .sd-dropdown-item', { hasText: 'BETWEEN' }).first().click(); await p.waitForTimeout(250);
  const r3 = await row.evaluate(r => r.querySelectorAll('.cond-val-wrap sd-date').length);
  console.log((r3 === 2 ? 'PASS' : 'FAIL') + ' ' + f + ' dòng gọn: BETWEEN → 2 sd-date');
  await p.screenshot({ path: '/home/claude/work/round/agents/wi-compact-' + f.split('-')[0] + '.png', clip: await row.boundingBox() });
  await p.close();
}
console.log(errs.length ? 'JS ERRORS ' + errs.join('\n') : 'Không lỗi JS.');
await b.close();
