// node wi-list-int.mjs — bấm thử danh-sach-workitem.html sau khi chuyển sang sd-table / sd-select
import { chromium } from 'playwright';
const root = '/home/claude/kit/prototype-kit-CATALOG-1012m/prototypes/cam-nang-phan-quyen/';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.route(/^https?:/, r => r.abort());
const errs = [];
p.on('pageerror', e => errs.push('pageerror: ' + String(e).slice(0, 300)));
p.on('console', m => { if (m.type() === 'error' && !/ERR_|Failed to load resource/.test(m.text())) errs.push('console: ' + m.text().slice(0, 300)); });
const alerts = [];
p.on('dialog', d => { alerts.push(d.message()); d.accept(); });
let fails = 0;
const ok = (c, msg) => { console.log((c ? 'PASS ' : 'FAIL ') + msg); if (!c) fails++; };
const wait = ms => p.waitForTimeout(ms);
const rows = () => p.$$eval('#wi-right-table tbody tr.c-row', trs => trs.map(tr => [...tr.querySelectorAll('td.c-td')].map(td => td.innerText.trim())));
const codes = async () => (await rows()).map(r => r.find(c => /^WI-/.test(c)));
const menuLabels = async loc => (await loc.locator('span').allInnerTexts()).map(x => x.trim());
const statusOf = async code => { const r = (await rows()).find(x => x.includes(code)); return r ? r[5] : null; };
async function openRowMenu(code) {
  const tr = p.locator('#wi-right-table tbody tr.c-row', { has: p.locator('a.c-table-link', { hasText: code }) });
  await tr.locator('.c-table-menu-btn').click();
  await wait(150);
  return p.locator('#wi-right-table .c-table-menu-dropdown.open .c-table-menu-item');
}
async function pickSelect(sel, text) {
  await p.locator(sel + ' mat-form-field').first().click();
  await wait(200);
  await p.locator('.cdk-overlay-pane .sd-dropdown-item', { hasText: text }).first().click();
  await wait(300);
}

await p.goto('file://' + root + 'danh-sach-workitem.html'); await wait(1500);

// 1. Tải trang: thư mục đầu (Các vấn đề chung) → 7 đầu việc lá
let c = await codes();
ok(c.length === 7 && c[0] === 'WI-001' && c[6] === 'WI-007', 'tải trang: 7 dòng WI-001..WI-007 ' + JSON.stringify(c));
ok(await p.locator('#wi-right-table .mat-mdc-paginator-range-label').innerText().then(t => t.trim()) === '1-7/7', 'chân bảng sd-table hiện 1-7/7');
ok((await statusOf('WI-003')) === 'Nháp', 'WI-003 badge Nháp');
ok(await p.locator('#handbook-filter').evaluate(e => e.value) === 'mag', 'sd-select Cẩm nang = mag');

// 2. Chọn node cây → bảng đổi
await p.locator('.wi-tree-label', { hasText: 'Pháp lí tuân thủ' }).click(); await wait(300);
c = await codes();
ok(JSON.stringify(c) === JSON.stringify(['WI-010', 'WI-011', 'WI-012', 'WI-013', 'WI-014']), 'chọn "Pháp lí tuân thủ" → ' + JSON.stringify(c));
await p.locator('.wi-tree-label', { hasText: 'Tổ chức xây dựng bộ kế hoạch năm' }).click(); await wait(300);
c = await codes();
ok(JSON.stringify(c) === JSON.stringify(['WI-003', 'WI-004', 'WI-005', 'WI-006', 'WI-007']), 'chọn "Tổ chức xây dựng…" → ' + JSON.stringify(c));

// 3. Lọc theo cột (ô lọc của sd-table)
await p.locator('#wi-right-table [data-filter-field="code"] input').fill('WI-00');
await p.locator('#wi-right-table [data-filter-field="code"] input').type('5'); await wait(300);
c = await codes();
ok(JSON.stringify(c) === JSON.stringify(['WI-005']), 'lọc Mã "WI-005" → ' + JSON.stringify(c));
await p.locator('#wi-right-table [data-filter-field="code"] input').fill(''); await p.locator('#wi-right-table [data-filter-field="code"] input').type(' ');
await p.locator('#wi-right-table [data-filter-field="code"] input').press('Backspace'); await wait(300);
ok((await codes()).length === 5, 'xoá lọc Mã → 5 dòng');
await pickSelect('#wi-right-table sd-select[data-filter-field="status"]', 'Đang hiệu lực');
c = await codes();
ok(JSON.stringify(c) === JSON.stringify(['WI-004', 'WI-006']), 'lọc Trạng thái = Đang hiệu lực → ' + JSON.stringify(c));
await pickSelect('#wi-right-table sd-select[data-filter-field="selfDelegation"]', 'Không');
c = await codes();
ok(JSON.stringify(c) === JSON.stringify(['WI-004']), '+ Tự ủy quyền = Không → ' + JSON.stringify(c));
// xoá hai lọc bằng nút × của sd-select
await p.locator('#wi-right-table sd-select[data-filter-field="selfDelegation"] .sd-clear-btn').click(); await wait(300);
await p.locator('#wi-right-table sd-select[data-filter-field="status"] .sd-clear-btn').click(); await wait(300);
ok((await codes()).length === 5, 'xoá lọc (×) → 5 dòng');

// 4. Phân trang: đổi số dòng / trang (sd-table)
await p.locator('#wi-right-table [data-sd-pagesize]').click(); await p.locator('.sd-paginator-pane mat-option[data-value="50"]').click(); await wait(200);
ok((await codes()).length === 5, 'đổi số dòng/trang 50 → vẫn 5 dòng, không lỗi');
ok(await p.locator('#wi-right-table .mat-mdc-paginator-navigation-next').getAttribute('aria-disabled') === 'true', 'nút trang sau bị khoá (≤ 1 trang)');

// 5. Menu dòng: lệnh theo từng dòng
let items = await openRowMenu('WI-003');
let labels = await menuLabels(items);
ok(JSON.stringify(labels) === JSON.stringify(['Xem chi tiết', 'Chỉnh sửa', 'Publish', 'Clone']), 'menu WI-003 (Nháp): ' + JSON.stringify(labels));
await p.mouse.click(900, 700); await wait(150);
items = await openRowMenu('WI-007');
labels = await menuLabels(items);
ok(JSON.stringify(labels) === JSON.stringify(['Xem chi tiết']), 'menu WI-007 (Ngưng phát hành): ' + JSON.stringify(labels));
await p.mouse.click(900, 700); await wait(150);
items = await openRowMenu('WI-005');
labels = await menuLabels(items);
ok(JSON.stringify(labels) === JSON.stringify(['Xem chi tiết', 'Chỉnh sửa', 'Unpublish', 'Clone']), 'menu WI-005 (Sắp hiệu lực): ' + JSON.stringify(labels));

// 6. Unpublish WI-005 (Sắp hiệu lực → Ngưng phát hành), Publish WI-003 (Nháp → Đang hiệu lực)
await items.filter({ hasText: 'Unpublish' }).click(); await wait(300);
ok((await statusOf('WI-005')) === 'Ngưng phát hành', 'Unpublish WI-005 → Ngưng phát hành');
items = await openRowMenu('WI-003');
await items.filter({ hasText: 'Publish' }).click(); await wait(300);
ok((await statusOf('WI-003')) === 'Đang hiệu lực', 'Publish WI-003 → Đang hiệu lực');

// 7. Hàng loạt: chọn 2 dòng → thanh chọn dòng → Unpublish
const cb = code => p.locator('#wi-right-table tbody tr.c-row', { has: p.locator('a.c-table-link', { hasText: code }) }).locator('sd-checkbox[data-sel-row]');
await cb('WI-003').click(); await wait(200);
await cb('WI-004').click(); await wait(200);
ok((await p.locator('#wi-right-table selector-action .c-length').innerText()).trim() === '2', 'thanh chọn dòng: 2 dữ liệu được chọn');
await wait(350);
await p.locator('#wi-right-table selector-action sd-button[data-sel-action="1"]').click(); await wait(400);
ok((await statusOf('WI-003')) === 'Hết hiệu lực' && (await statusOf('WI-004')) === 'Hết hiệu lực', 'Unpublish hàng loạt WI-003, WI-004 → Hết hiệu lực');
const nSelAfter = (await p.locator('#wi-right-table selector-action .c-length').textContent()).trim();
ok(nSelAfter === '0' && await p.locator('#wi-right-table sd-checkbox[data-sel-row][checked]').count() === 0, 'sau thao tác: bỏ chọn dòng (' + nSelAfter + ')');
// Publish hàng loạt trên thư mục có bản Nháp (Tư vấn và đầu tư: WI-009 Nháp)
await pickSelect('#handbook-filter', 'Dự án');
c = await codes();
ok(JSON.stringify(c) === JSON.stringify(['WI-008', 'WI-009']), 'Cẩm nang = Dự án → cây/bảng đổi ' + JSON.stringify(c));
ok(await p.locator('.wi-tree-label', { hasText: 'Tư vấn và đầu tư' }).count() === 1 && await p.locator('.wi-tree-label', { hasText: 'Các vấn đề chung' }).count() === 0, 'cây chỉ còn cẩm nang Dự án');
await cb('WI-009').click(); await wait(400);
await p.locator('#wi-right-table selector-action sd-button[data-sel-action="0"]').click(); await wait(400);
ok((await statusOf('WI-009')) === 'Đang hiệu lực', 'Publish hàng loạt WI-009 → Đang hiệu lực');
await pickSelect('#handbook-filter', 'Tất cả cẩm nang');
ok(await p.locator('.wi-tree-label', { hasText: 'Các vấn đề chung' }).count() === 1 && await p.locator('.wi-tree-label', { hasText: 'Tư vấn và đầu tư' }).count() === 1, 'Tất cả cẩm nang → cây đủ 4 nhánh');
await pickSelect('#handbook-filter', 'MAG');

// 8. Clone: menu dòng → hộp thoại → sd-select cẩm nang đích → cây thư mục → Clone
items = await openRowMenu('WI-001');
await items.filter({ hasText: 'Clone' }).click(); await wait(300);
ok(await p.locator('#clone-dialog').isVisible(), 'mở hộp thoại Clone');
ok((await p.locator('#clone-source-code').innerText()) === 'WI-CVG-CL-111', 'mã nguồn clone = WI-CVG-CL-111');
await wait(350);
await p.locator('#clone-dialog sd-button[prefixicon="content_copy"]').click(); await wait(200);
ok(alerts.pop() === 'Vui lòng chọn Cẩm nang đích', 'Clone khi chưa chọn cẩm nang → nhắc chọn');
await pickSelect('#clone-target-handbook', 'Dự án');
ok(await p.locator('#clone-target-tree .clone-tree-option').count() === 3, 'chọn Dự án → cây thư mục đích 3 mục');
await p.locator('#clone-target-tree .clone-tree-option', { hasText: '2.1 Chủ trương' }).click(); await wait(100);
await wait(350);
await p.locator('#clone-dialog sd-button[prefixicon="content_copy"]').click(); await wait(500);
let src = await p.locator('#wi-detail-panel iframe').getAttribute('src');
ok(!(await p.locator('#clone-dialog').isVisible()) && /tao-workitem\.html\?handbook=duan&clone=1&cloneFrom=WI-CVG-CL-111&type=task&targetParent=WI-DTU-11/.test(src), 'Clone → panel tạo mới ' + src);
ok(!(await p.locator('#wi-right-table').isVisible()), 'panel nhúng mở: bảng ẩn');

// quay lại danh sách (message từ panel như trang nhúng gửi)
await p.evaluate(() => window.postMessage({ type: 'aam-workitem-panel-navigate', href: 'danh-sach-workitem.html' }, '*')); await wait(400);
ok(await p.locator('#wi-right-table').isVisible() && (await codes()).length > 0, 'quay lại danh sách: bảng hiện lại');

// 9. Mã đầu việc / Tên đầu việc → panel chi tiết
await p.locator('.wi-tree-label', { hasText: 'Các vấn đề chung' }).click(); await wait(300);
await p.locator('#wi-right-table a.c-table-link', { hasText: 'WI-002' }).click(); await wait(400);
src = await p.locator('#wi-detail-panel iframe').getAttribute('src');
ok(src === 'chi-tiet-workitem.html?id=WI-CVG-CL-112&embedded=1', 'bấm mã WI-002 → ' + src);
ok(p.url().indexOf('#') < 0, 'không điều hướng theo href="#"');
await p.evaluate(() => window.postMessage({ type: 'aam-workitem-panel-navigate', href: 'danh-sach-workitem.html' }, '*')); await wait(400);
await p.locator('#wi-right-table td.c-td', { hasText: 'Mô hình tài chính 5 năm' }).click(); await wait(400);
src = await p.locator('#wi-detail-panel iframe').getAttribute('src');
ok(src === 'chi-tiet-workitem.html?id=WI-CVG-CL-112&embedded=1', 'bấm tên đầu việc → ' + src);
await p.evaluate(() => window.postMessage({ type: 'aam-workitem-panel-navigate', href: 'danh-sach-workitem.html' }, '*')); await wait(400);
items = await openRowMenu('WI-002');
await items.filter({ hasText: 'Chỉnh sửa' }).click(); await wait(300);
src = await p.locator('#wi-detail-panel iframe').getAttribute('src');
ok(src === 'sua-workitem.html?id=WI-CVG-CL-112&embedded=1', 'menu Chỉnh sửa → ' + src);
await p.evaluate(() => window.postMessage({ type: 'aam-workitem-panel-navigate', href: 'danh-sach-workitem.html' }, '*')); await wait(400);

// 10. Menu node cây vẫn chạy (giữ HTML thuần)
await p.locator('.wi-tree-item[data-id="WI-CVG-CL-112"] .workitem-action-btn').click(); await wait(200);
labels = await p.locator('.tree-action-popup .sd-dropdown-item').allInnerTexts();
ok(JSON.stringify(labels) === JSON.stringify(['Xem chi tiết', 'Chỉnh sửa', 'Unpublish', 'Clone']), 'menu node cây WI-002: ' + JSON.stringify(labels));
await p.mouse.click(900, 700); await wait(150);

// 11. Nhập đầu việc: bảng xem trước là sd-table
await wait(350);
await p.locator('.page-header-actions sd-button', { hasText: 'Nhập đầu việc' }).click(); await wait(300);
ok(await p.locator('#import-dialog').isVisible(), 'mở hộp thoại Nhập đầu việc');
await p.setInputFiles('#workitem-import-file', { name: 'mau.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer: Buffer.from('x') });
await wait(200);
ok((await p.locator('#import-selected-file').innerText()) === 'Đã chọn: mau.xlsx', 'chọn tệp → hiện tên tệp');
await wait(350);
await p.locator('#import-preview-btn').click(); await wait(400);
const prev = await p.$$eval('#import-preview-table tbody tr.c-row', trs => trs.map(tr => [...tr.querySelectorAll('td')].map(td => td.innerText.trim())));
ok(prev.length === 3 && prev[0][3] === 'VALID' && prev[2][3] === 'BLOCKED' && prev[1][4] === 'URL sắp hết hiệu lực', 'xem trước: sd-table 3 dòng ' + JSON.stringify(prev));
ok(await p.locator('#import-preview-table sd-badge').count() === 3, 'trạng thái dòng là sd-badge');
ok(!(await p.locator('#import-confirm-btn').evaluate(e => e.hasAttribute('disabled'))), 'nút Xác nhận mở khoá');
await p.locator('#import-dialog sd-button[aria-label="Đóng"]').click(); await wait(200);
ok(!(await p.locator('#import-dialog').isVisible()), 'đóng hộp thoại nhập');

// 12. Thư mục rỗng → empty state của trang
await p.evaluate(() => { WI['WI-EMPTY'] = { code: 'WI-CAT-X', label: 'Thư mục rỗng', handbook: 'MAG', kind: 'category', parent: '', children: [] }; });
await p.evaluate(() => selectFolder('WI-CVG'));
ok(await p.locator('#wi-right-table').isVisible(), 'bảng hiện');

console.log(errs.length ? 'JS ERRORS:\n  ' + errs.join('\n  ') : 'Không lỗi JS.');
console.log(fails ? fails + ' FAIL' : 'TẤT CẢ PASS');
await b.close();
