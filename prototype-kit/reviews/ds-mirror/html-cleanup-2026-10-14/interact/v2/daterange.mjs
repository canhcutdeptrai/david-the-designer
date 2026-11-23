// Bấm thật vào ô lọc "Hiệu lực từ" (sd-date-range) của bảng Ủy quyền: mở lịch, chọn 2 ngày.
import { chromium } from 'playwright';
const root = '/home/claude/kit/prototype-kit-CATALOG-1012m/prototypes/cam-nang-phan-quyen/';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1920, height: 1000 } });
await p.route(/^https?:/, r => r.abort());
const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 300)));
const W = ms => p.waitForTimeout(ms || 400);
await p.goto('file://' + root + 'tra-cuu-cam-nang-v2.html'); await p.waitForTimeout(1200);
await p.click('.page-tab-zone .tab:nth-child(3)'); await W(900);
const dr = p.locator('#delegation-col-eff-from');
await dr.scrollIntoViewIfNeeded();
await dr.locator('input').first().click(); await W(500);
await p.screenshot({ path: '/home/claude/work/round/agents/v2/daterange-open.png' });
const typed = await dr.locator('input').count();
console.log('inputs in range', typed);
// gõ tay hai đầu rồi rời ô
await dr.locator('input').nth(0).fill('01/06/2026'); await dr.locator('input').nth(0).press('Tab'); await W(300);
await dr.locator('input').nth(1).fill('31/12/2026'); await dr.locator('input').nth(1).press('Tab'); await W(800);
console.log('range attrs', await dr.getAttribute('from'), await dr.getAttribute('to'));
console.log('rows', await p.locator('.lookup-result-table tbody tr').count());
await p.mouse.click(900, 40); await W(300);
await p.screenshot({ path: '/home/claude/work/round/agents/v2/daterange-done.png' });
await b.close();
console.log(errs.length ? 'JS ERRORS:\n  ' + errs.join('\n  ') : 'Không lỗi JS.');
