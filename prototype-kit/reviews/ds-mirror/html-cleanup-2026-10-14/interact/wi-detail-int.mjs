// node wi-detail-int.mjs — bấm thử chi-tiet-workitem.html sau khi chuyển sang sd-select / sd-table / sd-tab-group
import { chromium } from 'playwright';
const root = '/home/claude/kit/prototype-kit-CATALOG-1012m/prototypes/cam-nang-phan-quyen/';
const S = process.argv[2] || '';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.route(/^https?:/, r => r.abort());
const errs = [];
p.on('pageerror', e => errs.push('pageerror: ' + String(e).slice(0, 300)));
p.on('console', m => { if (m.type() === 'error' && !/ERR_|Failed to load resource/.test(m.text())) errs.push('console: ' + m.text().slice(0, 300)); });
let fails = 0;
const ok = (c, msg) => { console.log((c ? 'PASS ' : 'FAIL ') + msg); if (!c) fails++; };
const wait = ms => p.waitForTimeout(ms);
const rowsOf = loc => loc.evaluate(t => [...t.querySelectorAll('tbody tr.c-row')].map(tr => [...tr.querySelectorAll('td.c-td')].map(td => td.textContent.trim().replace(/\s+/g, ' '))));
const tableRows = sel => rowsOf(p.locator(sel).first());
async function pickSelect(sel, text) {
  await p.locator(sel + ' mat-form-field').first().click();
  await wait(200);
  await p.locator('.cdk-overlay-pane .sd-dropdown-item', { hasText: text }).first().click();
  await wait(300);
}

await p.goto('file://' + root + 'chi-tiet-workitem.html'); await wait(1500);
let r = await tableRows('#resolved-dept-table');
ok(JSON.stringify(r.map(x => x[0])) === JSON.stringify(['Đề xuất', 'Thẩm định', 'Phê duyệt']), 'mặc định: 3 hoạt động ' + JSON.stringify(r.map(x => x[0])));
ok(r[0][2].indexOf('Trưởng phòng Mua sắmNguyễn Văn A') === 0 && r[2][3] === '2/3 người' && r[1][5] === 'Trong phạm vi', 'mặc định: bộ điều kiện 1 · P.Mua sắm');
ok(await p.locator('#resolved-dept-table th', { hasText: 'Kết quả resolve / Người giữ' }).count() === 1, 'tiêu đề cột đủ');
ok(await p.locator('.info-value sd-badge').count() === 1, 'trạng thái "Đang hiệu lực" là sd-badge');

// đổi các select resolve → bảng luồng đổi
await pickSelect('#budget-condition-select', 'Giá trị ngân sách > 7 tỷ');
ok(await p.locator('#budget-condition-select').evaluate(e => e.value) === 'condition2', 'sd-select ngân sách = condition2');
r = await tableRows('#resolved-dept-table');
ok(JSON.stringify(r.map(x => x[0])) === JSON.stringify(['Thẩm định', 'Phê duyệt']) && r[1][3] === '2/4 người', '> 7 tỷ → bộ điều kiện 2: ' + JSON.stringify(r.map(x => [x[0], x[3]])));
await pickSelect('#dept-resolve-select', 'P.Vận hành');
r = await tableRows('#resolved-dept-table');
ok(r[0][2].indexOf('Trưởng phòng Vận hànhHoàng Minh D') === 0 && r[1][4].indexOf('Trưởng phòng Vận hành') >= 0, 'Phòng ban = P.Vận hành → ' + r[0][2].slice(0, 40));
await pickSelect('#division-resolve-select', 'Khối Vận hành');
ok((await tableRows('#resolved-dept-table')).length === 2, 'Khối không đổi luồng (như trước)');
await pickSelect('#contract-condition-select', 'Từ 5 tỷ trở lên');
await pickSelect('#contract-type-select', 'Hợp đồng mua sắm');
ok(!(await p.locator('#resolved-dept-table').isVisible()) && await p.locator('#resolved-dept-empty').isVisible(), 'HĐ ≥ 5 tỷ + mua sắm → ẩn bảng, hiện câu "Không có luồng…"');
ok((await p.locator('#resolved-dept-empty').innerText()).trim() === 'Không có luồng phê duyệt phù hợp với tổ hợp điều kiện đang chọn.', 'câu báo đúng chữ');
await p.locator('#contract-type-select .sd-clear-btn').click(); await wait(300);
ok(await p.locator('#resolved-dept-table').isVisible() && !(await p.locator('#resolved-dept-empty').isVisible()), 'xoá Loại hợp đồng (×) → bảng hiện lại');
await p.locator('#budget-condition-select .sd-clear-btn').click(); await wait(300);
r = await tableRows('#resolved-dept-table');
ok(r.length === 3 && r[0][2].indexOf('Hoàng Minh D') >= 0, 'xoá ngân sách → bộ điều kiện 1 · P.Vận hành (3 dòng)');
if (S) await p.screenshot({ path: S + 'ct-resolve.png', fullPage: false });

// lịch sử phiên bản → hộp ảnh chụp, tab sd-tab-group
await p.locator('.version-row', { hasText: 'v2' }).first().click(); await wait(700);
ok(await p.locator('#versionSnapshot').isVisible(), 'mở ảnh chụp v2');
ok((await p.locator('#snapshotTitle').innerText()) === 'v2 — Chi tiết đầu việc tại thời điểm lưu', 'tiêu đề v2');
const tabs = await p.locator('#versionSnapshot sd-tab-group [role="tab"]').allInnerTexts();
ok(JSON.stringify(tabs.map(t => t.trim())) === JSON.stringify(['Thông tin đầu việc', 'Lịch sử thay đổi']), 'tab: ' + JSON.stringify(tabs));
ok(await p.locator('#versionSnapshot sd-tab').nth(0).locator('sd-table').count() === 3, 'tab 1: 3 bảng sd-table (Bộ điều kiện / Người thực hiện / Tài liệu)');
const condRows = await rowsOf(p.locator('#versionSnapshot sd-tab').nth(0).locator('sd-table').nth(0));
ok(condRows.length === 2 && condRows[1][1] === 'Giá trị ngân sách ≥ 15 tỷ', 'bảng Bộ điều kiện v2: ' + JSON.stringify(condRows));
const actorRows = await rowsOf(p.locator('#versionSnapshot sd-tab').nth(0).locator('sd-table').nth(1));
ok(actorRows.length === 3 && actorRows[2][2].indexOf('Giám đốc Khối Vận hànhLê Văn C') === 0 && actorRows[2].length === 6, 'bảng Người thực hiện v2 (6 cột): ' + actorRows.map(x => x.length).join(','));
ok(await p.locator('#versionSnapshot sd-badge').count() >= 1, 'trạng thái trong ảnh chụp là sd-badge');
ok(await p.locator('#versionSnapshot sd-table[data-snapshot-table="change-log-table"]').isVisible() === false, 'tab Lịch sử đang ẩn');
if (S) await p.screenshot({ path: S + 'ct-snap-info.png' });
await p.locator('#versionSnapshot sd-tab-group [role="tab"]', { hasText: 'Lịch sử thay đổi' }).click(); await wait(700);
ok(await p.locator('#versionSnapshot sd-table[data-snapshot-table="change-log-table"]').isVisible(), 'đổi tab → bảng lịch sử hiện');
const hist = await tableRows('#versionSnapshot sd-table[data-snapshot-table="change-log-table"]');
ok(hist.length === 2 && hist[1][2] === 'Cập nhật trong version' && hist[1][3].indexOf('Tên hiển thị') === 0, 'lịch sử v2: ' + JSON.stringify(hist.map(x => x.slice(0, 3))));
ok(!(await p.locator('#versionSnapshot sd-tab').nth(0).locator('sd-table').nth(0).isVisible()), 'tab Thông tin ẩn');
if (S) await p.screenshot({ path: S + 'ct-snap-hist.png' });
await p.evaluate(() => setSnapshotTab('info')); await wait(700);
ok(await p.locator('#versionSnapshot sd-tab').nth(0).locator('sd-table').nth(0).isVisible(), 'setSnapshotTab("info") → về tab Thông tin');
await wait(350);
await p.locator('#versionSnapshot sd-button[aria-label="Thoát"]').click(); await wait(300);
ok(!(await p.locator('#versionSnapshot').isVisible()), 'nút Thoát đóng hộp');
await p.locator('.version-row', { hasText: 'v1' }).locator('sd-button').click(); await wait(600);
ok((await p.locator('#snapshotTitle').innerText()).indexOf('v1') === 0, 'nút Xem v1 mở ảnh chụp v1');
await p.locator('#versionSnapshot sd-tab-group [role="tab"]', { hasText: 'Lịch sử thay đổi' }).click(); await wait(700);
ok((await tableRows('#versionSnapshot sd-table[data-snapshot-table="change-log-table"]')).length === 1, 'lịch sử v1: 1 dòng');
await p.keyboard.press('Escape'); await wait(200);
ok(!(await p.locator('#versionSnapshot').isVisible()), 'Esc đóng hộp');
await p.locator('.version-row', { hasText: 'v3' }).first().click(); await wait(600);
ok(await p.locator('#versionSnapshot sd-tab-group').evaluate(e => e.getAttribute('selectedIndex') || e.getAttribute('selectedindex')) === '0', 'mở lại → luôn về tab đầu');
await p.keyboard.press('Escape');

// ?version=v1 mở sẵn; ?type=category ẩn các khối
await p.goto('file://' + root + 'chi-tiet-workitem.html?version=v1'); await wait(1500);
ok(await p.locator('#versionSnapshot').isVisible() && (await p.locator('#snapshotTitle').innerText()).indexOf('v1') === 0, '?version=v1 mở sẵn ảnh chụp');
await p.goto('file://' + root + 'chi-tiet-workitem.html?id=WI-CVG&type=category&embedded=1'); await wait(1500);
ok(!(await p.locator('sd-section[title="Người thực hiện"]').isVisible()), 'đầu mục: ẩn khối Người thực hiện');

console.log(errs.length ? 'JS ERRORS:\n  ' + errs.join('\n  ') : 'Không lỗi JS.');
console.log(fails ? fails + ' FAIL' : 'TẤT CẢ PASS');
await b.close();
