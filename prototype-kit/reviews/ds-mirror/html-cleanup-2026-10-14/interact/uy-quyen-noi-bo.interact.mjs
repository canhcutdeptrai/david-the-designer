// Kiểm tương tác uy-quyen-noi-bo.html sau khi chuyển tab/bảng sang sd-tab-group / sd-table.
import { chromium } from 'playwright';
const URL = 'file:///home/claude/kit/prototype-kit-CATALOG-1012m/prototypes/cam-nang-phan-quyen/uy-quyen-noi-bo.html';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const errs = [];
let fails = 0;
const ok = (cond, msg) => { console.log((cond ? 'OK   ' : 'FAIL ') + msg); if (!cond) fails++; };
async function open(qs = '') {
  const p = await ctx.newPage();
  await p.route(/^https?:/, r => r.abort());
  p.on('pageerror', e => errs.push(String(e).slice(0, 300)));
  p.on('console', m => { if (m.type() === 'error' && !/ERR_|Failed to load resource/.test(m.text())) errs.push('console: ' + m.text().slice(0, 300)); });
  p.on('dialog', d => d.accept());
  await p.goto(URL + qs); await p.waitForTimeout(1200);
  return p;
}
const rows = (p, id) => p.evaluate(id => [...document.querySelectorAll('#' + id + ' tbody tr.c-row')].map(tr => tr.innerText.replace(/\s+/g, ' ').trim()), id);
const T1 = 'lookup-delegation-table', T2 = 'confirmation-delegation-table';
async function pick(p, table, field, text) {
  await p.click(`#${table} [data-filter-field="${field}"] mat-form-field`);
  await p.waitForTimeout(200);
  await p.click(`.cdk-overlay-pane .sd-dropdown-item:has-text("${text}")`);
  await p.waitForTimeout(250);
}
async function type(p, table, field, text) {
  await p.fill(`#${table} [data-filter-field="${field}"] input`, text);
  await p.waitForTimeout(250);
}

// ---- 1. Trang admin mặc định
let p = await open();
const tabs = await p.evaluate(() => [...document.querySelectorAll('#delegation-tabs .mat-mdc-tab')].map(x => x.innerText.trim() + (x.classList.contains('mdc-tab--active') ? '*' : '')));
ok(JSON.stringify(tabs) === JSON.stringify(['Tra cứu ủy quyền*', 'Chờ tôi xác nhận']), 'tab: ' + JSON.stringify(tabs));
ok(await p.isVisible('#delegation-export-button'), 'Xuất Excel hiện ở tab Tra cứu');
let r = await rows(p, T1);
ok(r.length === 5 && /Đang hiệu lực/.test(r[0]) && /Sắp hiệu lực/.test(r[1]) && /Chờ xác nhận/.test(r[2]) && /Hết hiệu lực/.test(r[3]) && /Đã hủy/.test(r[4]), 'bảng tra cứu 5 dòng, đúng thứ tự trạng thái');
ok(/Nguyễn Thị Dịu diunt@onemount.com/.test(r[0]), 'ô người ủy quyền 2 dòng tên + email');
const filters = await p.evaluate(id => [...document.querySelectorAll('#' + id + ' [data-filter-field]')].map(e => e.tagName.toLowerCase() + ':' + e.getAttribute('data-filter-field')), T1);
console.log('     ô lọc:', filters.join(', '));
ok(filters.length === 8, '8 ô lọc (Thao tác không có ô lọc)');

// ---- 2. Lọc
await type(p, T1, 'delegatorCell', 'diunt'); r = await rows(p, T1);
ok(r.length === 1 && /Phê duyệt mua sắm TSCĐ/.test(r[0]), 'lọc người ủy quyền theo email "diunt" → 1 dòng');
await type(p, T1, 'delegatorCell', ''); 
await type(p, T1, 'delegateCell', 'kim anh'); r = await rows(p, T1);
ok(r.length === 1 && /Nguyễn Kim Anh/.test(r[0]), 'lọc người được ủy quyền theo tên "kim anh" → 1 dòng');
await type(p, T1, 'delegateCell', '');
await type(p, T1, 'workitem', 'pháp lý'); r = await rows(p, T1);
ok(r.length === 1 && /Rà soát pháp lý dự án/.test(r[0]), 'lọc Đầu việc "pháp lý" → 1 dòng');
await type(p, T1, 'workitem', '');
await type(p, T1, 'period', '01/07/2026'); r = await rows(p, T1);
ok(r.length === 1 && /Duyệt hợp đồng mua hàng/.test(r[0]), 'lọc Hiệu lực "01/07/2026" → 1 dòng');
await type(p, T1, 'period', '');
ok((await rows(p, T1)).length === 5, 'xoá ô lọc chữ → đủ 5 dòng');
await pick(p, T1, 'handbook', 'MPM'); r = await rows(p, T1);
ok(r.length === 1 && /MPM/.test(r[0]), 'lọc Cẩm nang = MPM → 1 dòng');
await pick(p, T1, 'role', 'Phê duyệt'); r = await rows(p, T1);
ok(r.length === 0, 'MPM + Phê duyệt → 0 dòng (AND)');
const empty = await p.evaluate(id => (document.querySelector('#' + id + ' .c-no-data-title') || {}).innerText, T1);
ok(empty === 'Không có kết quả phù hợp', 'bảng rỗng do lọc: "' + empty + '"');
await p.screenshot({ path: '/home/claude/work/round/agents/uy-quyen-noi-bo.filter-empty.png' });
await p.close();

p = await open();
await pick(p, T1, 'statusView', 'Đã hủy'); r = await rows(p, T1);
ok(r.length === 1 && /Phê duyệt tuyển dụng cấp Manager/.test(r[0]), 'lọc Trạng thái = Đã hủy → 1 dòng');
await pick(p, T1, 'category', 'Mua sắm'); r = await rows(p, T1);
ok(r.length === 0, 'Đã hủy + Mua sắm → 0 dòng');
await p.close();

// ---- 3. Phân trang / số dòng / Tải lại
p = await open();
ok((await p.innerText(`#${T1} .mat-mdc-paginator-range-label`)).trim() === '1-20/128', 'chân bảng 1-20/128');
const sizes = await p.evaluate(id => document.querySelector('#' + id + ' [data-sd-pagesize]').getAttribute('data-sd-pagesize').split(','), T1);
ok(JSON.stringify(sizes) === '["20","50","100"]', 'số dòng mỗi trang 20/50/100');
await p.click(`#${T1} [data-sd-pagesize]`); await p.click('.sd-paginator-pane mat-option[data-value="50"]');
ok((await p.$eval(`#${T1} .mat-mdc-paginator-page-size .mat-mdc-select-min-line`, s => s.textContent.trim())) === '50', 'chọn 50 dòng/trang không lỗi');
await p.click(`#${T1} .mat-mdc-paginator-navigation-next`, { force: true });   /* total giả 128 → nút khoá */
await p.click(`#${T1} [data-sd-reload]`); await p.waitForTimeout(200);
ok((await rows(p, T1)).length === 5, 'Tải lại → vẫn 5 dòng');

// ---- 4. Nút trên dòng: Xem / Hủy / Sửa
await p.click(`#${T1} tbody tr.c-row >> nth=0 >> sd-button:has-text("Xem")`); await p.waitForTimeout(500);
ok(await p.evaluate(() => /Nguyễn Thị Dịu → Nguyễn Kim Anh/.test(document.getElementById('delegation-detail-content').innerText)), 'Xem → drawer chi tiết đúng bản ghi');
ok(await p.evaluate(() => !!document.querySelector('#delegation-detail-content sd-badge')), 'trạng thái trong drawer là sd-badge');
await p.click('#delegation-detail-footer sd-button:has-text("Thoát")'); await p.waitForTimeout(400);
await p.click(`#${T1} tbody tr.c-row >> nth=0 >> sd-button:has-text("Hủy")`); await p.waitForTimeout(200);
ok(await p.evaluate(() => /Đã hủy ủy quyền/.test(document.body.innerText)), 'Hủy → confirm → toast "Đã hủy ủy quyền"');
await p.click(`#${T1} tbody tr.c-row >> nth=2 >> sd-button:has-text("Sửa")`); await p.waitForTimeout(400);
ok(await p.evaluate(() => !document.getElementById('delegation-form-page').classList.contains('hidden') && /Sửa ủy quyền nội bộ/.test(document.getElementById('delegation-form-page').innerText)), 'Sửa → màn form sửa');
await p.click('#delegation-form-page .form-page-actions sd-button:has-text("Bỏ qua")'); await p.waitForTimeout(300);
ok(await p.evaluate(() => !document.getElementById('delegation-list-page').classList.contains('hidden')), 'Bỏ qua → về danh sách');

// ---- 5. Đổi tab, xác nhận / từ chối
await p.click('#delegation-tabs .mat-mdc-tab:has-text("Chờ tôi xác nhận")'); await p.waitForTimeout(600);
ok(await p.isVisible(`#${T2}`) && !(await p.isVisible(`#${T1}`)), 'đổi tab → bảng chờ xác nhận hiện, bảng tra cứu ẩn');
ok(!(await p.isVisible('#delegation-export-button')), 'Xuất Excel ẩn ở tab Chờ xác nhận');
r = await rows(p, T2);
ok(r.length === 2 && r.every(x => /Chờ xác nhận/.test(x)), 'bảng chờ xác nhận 2 dòng');
await p.screenshot({ path: '/home/claude/work/round/agents/uy-quyen-noi-bo.tab2.png' });
await p.click(`#${T2} tbody tr.c-row >> nth=0 >> sd-button[aria-label="Xác nhận"]`); await p.waitForTimeout(300);
r = await rows(p, T2);
console.log("     ", r[0]); ok(/Đang hiệu lực/.test(r[0]) && / Xem$/.test(r[0]), 'dòng 1 Xác nhận → Đang hiệu lực + nút Xem');
await p.click(`#${T2} tbody tr.c-row >> nth=1 >> sd-button[aria-label="Xác nhận"]`); await p.waitForTimeout(300);
const r2btn = await p.evaluate(id => [...document.querySelectorAll('#' + id + ' tbody tr.c-row')][1].querySelectorAll('sd-button').length, T2);
ok(/Chờ xác nhận/.test((await rows(p, T2))[1]) && r2btn === 3, 'dòng 2 Xác nhận → vẫn Chờ xác nhận + 3 nút');
await p.click(`#${T2} tbody tr.c-row >> nth=1 >> sd-button:has-text("Từ chối")`); await p.waitForTimeout(300);
r = await rows(p, T2);
ok(/Đã từ chối/.test(r[1]) && !(await p.evaluate(id => [...document.querySelectorAll('#' + id + ' tbody tr.c-row')][1].querySelector('sd-button'), T2)), 'dòng 2 Từ chối → Đã từ chối, hết nút');
await p.screenshot({ path: '/home/claude/work/round/agents/uy-quyen-noi-bo.tab2-after.png' });
await pick(p, T2, 'statusView', 'Đã từ chối'); r = await rows(p, T2);
ok(r.length === 1, 'lọc Trạng thái = Đã từ chối → 1 dòng');
await p.click('#delegation-tabs .mat-mdc-tab:has-text("Tra cứu ủy quyền")'); await p.waitForTimeout(600);
ok(await p.isVisible('#delegation-export-button') && await p.isVisible(`#${T1}`), 'về tab Tra cứu → Xuất Excel hiện lại');

// ---- 6. Form tạo ủy quyền: thêm / xoá liên kết
await p.click('.page-header sd-button:has-text("Tạo ủy quyền")'); await p.waitForTimeout(500);
ok(await p.evaluate(() => /Tạo ủy quyền nội bộ/.test(document.getElementById('delegation-form-page').innerText)), 'Tạo ủy quyền → màn form tạo');
const nLinks = () => p.evaluate(() => document.querySelectorAll('#delegation-form-page .link-row').length);
const n0 = await nLinks();
await p.click('#delegation-form-page sd-button:has-text("Thêm liên kết")'); await p.waitForTimeout(200);
ok(await nLinks() === n0 + 1, 'Thêm liên kết → +1 dòng (' + n0 + '→' + (n0 + 1) + ')');
await p.click('#delegation-form-page .link-row >> nth=0 >> sd-button[aria-label="Xóa liên kết"]'); await p.waitForTimeout(200);
ok(await nLinks() === n0, 'Xóa liên kết → -1 dòng');
await p.screenshot({ path: '/home/claude/work/round/agents/uy-quyen-noi-bo.form.png', fullPage: true });
await p.click('#delegation-form-page sd-button:has-text("Tạo")'); await p.waitForTimeout(300);
ok(await p.evaluate(() => !document.getElementById('delegation-list-page').classList.contains('hidden') && /Đã tạo yêu cầu ủy quyền/.test(document.body.innerText)), 'Tạo → toast + về danh sách');
await p.close();

// ---- 7. Vai trò end-user: tab chờ xác nhận bị gỡ, chỉ còn active/upcoming/expired
p = await open('?view=end-user');
const t2 = await p.evaluate(() => [...document.querySelectorAll('#delegation-tabs .mat-mdc-tab')].map(x => x.innerText.trim()));
ok(JSON.stringify(t2) === '["Tra cứu ủy quyền"]', 'view=end-user → chỉ còn tab Tra cứu');
r = await rows(p, T1);
ok(r.length === 3, 'view=end-user → 3 dòng (đang/sắp/hết hiệu lực)');
await p.close();
p = await open('?view=delegate&user=nam.tran@onemount.com');
ok((await rows(p, T1)).length === 1 && (await rows(p, T2)).length === 1, 'view=delegate&user=nam.tran → 1 dòng tra cứu + 1 dòng chờ xác nhận');
await p.close();

// ---- 8. Từ màn Tra cứu Cẩm nang + nháp localStorage
p = await open('?source=handbook-lookup&handbook=MPM&workitem=Duyệt%20HĐ&role=Thẩm%20định');
const badge = await p.evaluate(() => { const b = document.querySelector('#delegation-form-page .context-row sd-badge'); return b && (b.getAttribute('type') + '/' + b.getAttribute('color') + '/' + b.innerText.trim()); });
ok(badge === 'round/warning/Thẩm định', 'ngữ cảnh từ Tra cứu Cẩm nang → sd-badge ' + badge);
await p.evaluate(() => localStorage.setItem('aamDelegationLookupDraft', JSON.stringify({ handbook: 'MAG', category: 'Mua sắm', workitem: 'Nháp thử', delegatorName: 'A', delegatorEmail: 'a@x.com', delegateName: 'B', delegateEmail: 'b@x.com', role: 'Đề xuất', validFrom: '2026-08-01', validTo: '2026-08-31' })));
await p.close();
p = await open();
r = await rows(p, T1);
ok(r.length === 6 && /Nháp thử/.test(r[2]) && /01\/08\/2026 - 31\/08\/2026/.test(r[2]) && /Chờ xác nhận/.test(r[2]), 'nháp localStorage → thêm dòng Chờ xác nhận, đứng đầu nhóm chờ xác nhận như bản cũ');
await p.evaluate(() => localStorage.removeItem('aamDelegationLookupDraft'));
// cuộn bảng sang phải để chụp cột Thao tác
await p.evaluate(id => { document.getElementById(id).scrollLeft = 9999; }, T1);
await p.waitForTimeout(200);
await p.screenshot({ path: '/home/claude/work/round/agents/uy-quyen-noi-bo.scrolled.png' });
await p.close();

console.log(errs.length ? 'JS ERRORS:\n  ' + errs.join('\n  ') : 'Không lỗi JS.');
console.log(fails ? fails + ' FAIL' : 'Tất cả OK');
await b.close();
