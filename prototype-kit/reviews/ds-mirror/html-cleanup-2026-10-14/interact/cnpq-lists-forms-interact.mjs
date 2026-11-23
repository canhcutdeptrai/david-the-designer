// node cnpq-lists-forms-interact.mjs — bấm thử tương tác các trang danh sách / form cnpq đã chuyển sang sd-*
// (danh-sach-cam-nang, danh-sach-loai-dieu-kien, danh-sach-luong, quan-ly-orgbase, quan-ly-cam-nang,
//  tao-orgbase, sua-orgbase, tao/sua-cam-nang, tao-loai-dieu-kien, chi-tiet-*)
import { chromium } from 'playwright';
const root = 'file:///home/claude/kit/prototype-kit-CATALOG-1012m/prototypes/cam-nang-phan-quyen/';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.route(/^https?:/, r => r.abort());
const errs = []; p.on('pageerror', e => errs.push(p.url().split('/').pop() + ': ' + String(e).slice(0, 200)));
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; console.log('  ok  ', m); } else { fail++; console.log('  FAIL', m); } };
const go = async f => { await p.goto(root + f); await p.waitForTimeout(900); };
const page = () => decodeURIComponent(p.url().split('/').pop());
const rows = sel => p.$$eval(sel + ' tbody tr.c-row', t => t.length);
const col = (sel, i) => p.$$eval(sel + ' tbody tr.c-row', (t, i) => t.map(r => r.querySelectorAll('td.c-td:not(.c-command-cell)')[i]?.innerText.trim()), i);
const pick = async (selectSel, text) => {
  await p.click(selectSel + ' mat-form-field'); await p.waitForTimeout(250);
  await p.click(`.cdk-overlay-pane .sd-dropdown-item:has-text("${text}")`); await p.waitForTimeout(300);
};
const nav = async fn => { await Promise.all([p.waitForNavigation({ timeout: 5000 }).catch(() => {}), fn()]); await p.waitForTimeout(600); };

// ── 1. danh-sach-cam-nang ─────────────────────────────────────────────
console.log('danh-sach-cam-nang');
await go('danh-sach-cam-nang.html');
const T1 = '#handbook-table';
ok(await rows(T1) === 4, '4 dòng cẩm nang');
ok(JSON.stringify(await col(T1, 0)) === '["MAG","DUAN","MPM","HE"]', 'cột Mã đúng thứ tự');
ok((await col(T1, 3))[0] === '25/04/2026', 'cột Cập nhật dạng dd/MM/yyyy');
await p.fill(`${T1} sd-input[data-filter-field=code] input`, 'MP'); await p.waitForTimeout(300);
ok(JSON.stringify(await col(T1, 0)) === '["MPM"]', 'lọc Mã "MP" → MPM');
await p.reload(); await p.waitForTimeout(900);
await pick(`${T1} sd-select[data-filter-field=status]`, 'Ngừng áp dụng');
ok(JSON.stringify(await col(T1, 0)) === '["HE"]', 'lọc Trạng thái Ngừng → HE');
await p.reload(); await p.waitForTimeout(900);
ok(await p.$eval(`${T1} .mat-mdc-paginator-range-label`, e => e.innerText.trim()) === '1-4/4', 'chân bảng 1-4/4');
ok(await p.$eval(`${T1} .mat-mdc-paginator-navigation-next`, e => e.getAttribute('aria-disabled')) === 'true', 'nút trang sau khoá (1 trang)');
await nav(() => p.click(`${T1} a.c-table-link:has-text("Cẩm nang Dự án")`));
ok(page() === 'danh-sach-workitem.html?handbook=duan', 'link tên → danh-sach-workitem?handbook=duan (' + page() + ')');
await go('danh-sach-cam-nang.html');
await nav(() => p.click(`${T1} tbody tr.c-row >> nth=0 >> button.c-command-btn[title="Xem chi tiết cẩm nang"]`));
ok(page() === 'chi-tiet-cam-nang.html?id=MAG', 'Xem → chi-tiet-cam-nang?id=MAG (' + page() + ')');
await go('danh-sach-cam-nang.html');
await p.click(`${T1} tbody tr.c-row >> nth=3 >> button.c-table-menu-btn`); await p.waitForTimeout(200);
await nav(() => p.click(`${T1} .c-table-menu-dropdown.open .c-table-menu-item:has-text("Sửa cẩm nang")`));
ok(page() === 'sua-cam-nang.html?id=HE', 'Thao tác khác › Sửa → sua-cam-nang?id=HE (' + page() + ')');

// ── 2. danh-sach-loai-dieu-kien ───────────────────────────────────────
console.log('danh-sach-loai-dieu-kien');
await go('danh-sach-loai-dieu-kien.html');
const T2 = '#condition-table';
ok(await rows(T2) === 5, '5 dòng loại điều kiện');
await pick(`${T2} sd-select[data-filter-field=type]`, 'date');
ok(JSON.stringify(await col(T2, 0)) === '["COND-002"]', 'lọc Loại = date → COND-002');
await p.reload(); await p.waitForTimeout(900);
await p.fill(`${T2} sd-input[data-filter-field=name] input`, 'giá trị'); await p.waitForTimeout(300);
ok(JSON.stringify(await col(T2, 0)) === '["COND-001","COND-004"]', 'lọc Tên "giá trị" → 2 dòng');
await p.reload(); await p.waitForTimeout(900);
ok(await p.$$eval(`${T2} .c-paginator sd-button`, e => e.map(x => x.querySelector('.c-title').innerText.trim()).join('|')) === 'Tải lại|Thiết lập', 'chân bảng có Tải lại + Thiết lập');
await nav(() => p.click(`${T2} a.c-table-link:has-text("COND-003")`));
ok(page() === 'chi-tiet-loai-dieu-kien.html', 'link Mã → chi-tiet-loai-dieu-kien (' + page() + ')');
await go('danh-sach-loai-dieu-kien.html');
await nav(() => p.click(`${T2} tbody tr.c-row >> nth=2 >> button.c-command-btn[title="Xem chi tiết"]`));
ok(page() === 'chi-tiet-loai-dieu-kien.html?id=COND-003', 'Xem → ?id=COND-003 (' + page() + ')');
await go('danh-sach-loai-dieu-kien.html');
await p.click(`${T2} tbody tr.c-row >> nth=0 >> button.c-table-menu-btn`); await p.waitForTimeout(200);
await nav(() => p.click(`${T2} .c-table-menu-dropdown.open .c-table-menu-item:has-text("Chỉnh sửa")`));
ok(page() === 'sua-loai-dieu-kien.html?id=COND-001', 'Chỉnh sửa → sua-loai-dieu-kien?id=COND-001 (' + page() + ')');

// ── 3. danh-sach-luong ────────────────────────────────────────────────
console.log('danh-sach-luong');
await go('danh-sach-luong.html');
const T3 = '#flow-table';
ok(await rows(T3) === 6, '6 dòng hoạt động (từ mảng activities)');
ok(await p.$eval(`${T3} .mat-mdc-paginator-range-label`, e => e.innerText.trim()) === '1-6/6', 'chân bảng 1-6/6');
ok(await p.$eval(`${T3} [data-sd-pagesize]`, e => e.getAttribute('data-sd-pagesize')) === '10,20,50', 'ô số dòng 10/20/50 (thay pg-size-sel)');
await pick(`${T3} sd-select[data-filter-field=status]`, 'Ngừng áp dụng');
ok(JSON.stringify(await col(T3, 0)) === '["HD-003"]', 'lọc Ngừng → HD-003');
await p.reload(); await p.waitForTimeout(900);
await p.fill(`${T3} sd-input[data-filter-field=name] input`, 'phê duyệt'); await p.waitForTimeout(300);
ok(JSON.stringify(await col(T3, 0)) === '["HD-004","HD-005"]', 'lọc Tên "phê duyệt" → HD-004, HD-005');
await go('danh-sach-luong.html');
await p.click(`${T3} tbody tr.c-row >> nth=2 >> button.c-table-menu-btn`); await p.waitForTimeout(200);
await nav(() => p.click(`${T3} .c-table-menu-dropdown.open .c-table-menu-item:has-text("Chỉnh sửa")`));
ok(page() === 'sua-luong.html?id=HD-003', 'Chỉnh sửa → sua-luong?id=HD-003 (' + page() + ')');

// ── 4. quan-ly-orgbase ────────────────────────────────────────────────
console.log('quan-ly-orgbase');
await go('quan-ly-orgbase.html');
const T4 = '#rule-table';
ok(await rows(T4) === 4, '4 nguyên tắc');
ok(await p.$eval(`${T4} tbody tr.c-row`, r => r.querySelectorAll('sd-badge[type=round]').length) === 3, 'dòng 1: 3 nhãn vai trò sd-badge round');
ok(!(await p.$('#drawer-overlay')), 'drawer chết đã gỡ');
await pick(`${T4} sd-select[data-filter-field=status]`, 'Ngừng áp dụng');
ok(JSON.stringify(await col(T4, 0)) === '["Rule-04"]', 'lọc Ngừng → Rule-04');
await go('quan-ly-orgbase.html');
await nav(() => p.click(`${T4} tbody tr.c-row >> nth=1 >> button.c-command-btn[title="Xem chi tiết"]`));
ok(page() === 'chi-tiet-orgbase.html?id=Rule-02', 'Xem → chi-tiet-orgbase?id=Rule-02 (' + page() + ')');

// ── 5. quan-ly-cam-nang ───────────────────────────────────────────────
console.log('quan-ly-cam-nang');
await go('quan-ly-cam-nang.html');
ok(!(await p.$('#handbook-modal')), 'modal chết đã gỡ');
await p.click('.tree-node[data-id="hb-mag"] > .tree-node-header'); await p.waitForTimeout(700);
const T5 = 'sd-table.workitem-table';
ok(await rows(T5) === 5, 'bảng WorkItem của MAG có 5 dòng');
ok(JSON.stringify(await p.$$eval(`${T5} tbody sd-badge`, e => e.map(x => x.innerText.trim()))) === '["Đang hiệu lực","Đang hiệu lực","Sắp hiệu lực","Hết hiệu lực","Nháp"]', 'cột Trạng thái là badge round theo trạng thái');
await nav(() => p.click(`${T5} tbody tr.c-row >> nth=2 >> button.c-command-btn[title="Xem chi tiết"]`));
ok(page() === 'chi-tiet-workitem.html?id=wi-003', 'Xem → chi-tiet-workitem?id=wi-003 (' + page() + ')');
await go('quan-ly-cam-nang.html');
await p.waitForTimeout(400); await p.click('sd-button:has-text("Mở tất cả")'); await p.waitForTimeout(400);
ok(await p.$$eval('.tree-node.has-children.expanded', e => e.length) === 4, 'Mở tất cả → 4 nhánh mở');
await p.click('sd-button:has-text("Thu gọn")'); await p.waitForTimeout(400);
ok(await p.$$eval('.tree-node.has-children.expanded', e => e.length) === 0, 'Thu gọn → 0 nhánh mở');

// ── 6. tao-orgbase ────────────────────────────────────────────────────
console.log('tao-orgbase');
await go('tao-orgbase.html');
ok(await p.$$eval('#flows-container .flow-section', e => e.length) === 1, '1 hoạt động mặc định');
await pick('#flow-item-1 sd-select.flow-activity', 'Thẩm định Level 1');
ok(await p.$eval('#flow-item-1 sd-select.flow-activity', e => e.value) === 'LUO-002-01', 'chọn hoạt động → value LUO-002-01');
await p.waitForTimeout(350); await p.click('sd-button:has-text("Thêm hoạt động")'); await p.waitForTimeout(400);
ok(JSON.stringify(await p.$$eval('#flows-container .flow-section-num', e => e.map(x => x.textContent))) === '["Hoạt động 1","Hoạt động 2"]', 'Thêm hoạt động → đánh số 1, 2');
await pick('#flow-item-2 sd-select.flow-activity', 'Phê duyệt cuối');
ok(await p.$eval('#flow-item-2 sd-select.flow-activity', e => e.value) === 'LUO-003-01', 'hoạt động 2 chọn được riêng');
ok(await p.$eval('#flow-item-1 sd-select.flow-activity', e => e.value) === 'LUO-002-01', 'hoạt động 1 giữ giá trị');
await p.waitForTimeout(350); await p.click('.page-header-actions sd-button:has-text("Tạo")'); await p.waitForTimeout(400);
ok(await p.$$eval('#flows-container .assignee-field.is-error', e => e.length) === 2, 'Tạo khi chưa chọn người thực hiện → 2 khối báo lỗi');
await p.click('#flow-item-2 sd-checkbox[label="Cấp 2"]'); await p.waitForTimeout(300);
ok(await p.$eval('#flow-item-2 .assignee-field', e => !e.classList.contains('is-error')), 'tick Cấp 2 → hết lỗi ở hoạt động 2');
await p.waitForTimeout(350); await p.click('#flow-item-1 .flow-section-header sd-button[aria-label="Xóa hoạt động"]'); await p.waitForTimeout(400);
ok(JSON.stringify(await p.$$eval('#flows-container .flow-section-num', e => e.map(x => x.textContent))) === '["Hoạt động 1"]', 'Xoá hoạt động 1 → còn 1, đánh số lại');
ok(await p.$eval('#flows-container sd-select.flow-activity', e => e.value) === 'LUO-003-01', 'hoạt động còn lại là hoạt động 2 cũ');
await p.waitForTimeout(350); await p.click('#flows-container .flow-section-header sd-button[aria-label="Xóa hoạt động"]'); await p.waitForTimeout(300);
ok(await p.$$eval('#flows-container .flow-section', e => e.length) === 1, 'không xoá được hoạt động cuối cùng');

// ── 7. sua-orgbase ────────────────────────────────────────────────────
console.log('sua-orgbase');
await go('sua-orgbase.html');
ok(await p.$$eval('.page-header sd-button', e => e.filter(x => !(x.getAttribute('title') || x.innerText.trim()) && !x.getAttribute('aria-label')).length) === 0, 'header không còn nút rỗng chữ');
await nav(() => p.click('sd-inform sd-button:has-text("Quay lại")'));
ok(page() === 'chi-tiet-orgbase.html?id=Rule-01', 'Quay lại → chi-tiet-orgbase?id=Rule-01 (' + page() + ')');

// ── 8. tao-cam-nang / sua-cam-nang (sd-editor) ────────────────────────
console.log('tao-cam-nang / sua-cam-nang');
await go('tao-cam-nang.html'); await p.waitForTimeout(800);
const ed = '#hb-note .ck-editor__editable';
await p.click(ed); await p.keyboard.type('Ghi chú ');
await p.click('#hb-note .ck-toolbar button.ck-button >> nth=0'); // nút B (Bold) đầu thanh công cụ
await p.keyboard.type('đậm'); await p.waitForTimeout(700);
const v = await p.$eval('#hb-note', e => e.value);
ok(/Ghi chú/.test(v) && /<strong>đậm<\/strong>/.test(v), 'sd-editor gõ được + in đậm (value: ' + v + ')');
await go('sua-cam-nang.html'); await p.waitForTimeout(800);
ok(await p.$eval('#hb-note', e => (e.value.match(/<li>/g) || []).length) === 2, 'sua-cam-nang: ghi chú nạp sẵn 2 mục danh sách');
await go('sua-cam-nang.html?mode=view'); await p.waitForTimeout(900);
ok(await p.$eval('#hb-note', e => e.hasAttribute('disabled')), 'mode=view → sd-editor disabled');
ok(await p.$eval('#hb-note .ck-editor__editable', e => e.getAttribute('contenteditable')) === 'false', 'mode=view → vùng soạn thảo chỉ đọc');

// ── 9. tao-loai-dieu-kien (sd-select đổi trường) ──────────────────────
console.log('tao-loai-dieu-kien');
await go('tao-loai-dieu-kien.html');
await pick('#condition-type-select', 'list');
ok(await p.$eval('#condition-list-values-field', e => !e.classList.contains('is-hidden')), 'Loại = list → hiện Giá trị danh sách');
ok(await p.$eval('#condition-unit-field', e => e.classList.contains('is-hidden')), 'Loại = list → ẩn Đơn vị');

// ── 10. header badge các trang chi tiết ───────────────────────────────
console.log('chi-tiet-* header badge');
for (const f of ['chi-tiet-cam-nang.html', 'chi-tiet-loai-dieu-kien.html', 'chi-tiet-luong.html', 'chi-tiet-orgbase.html']) {
  await go(f);
  ok(await p.$eval('.page-header sd-badge .c-badge-title', e => e.innerText.trim()).catch(() => '') === 'Đang áp dụng', f + ': badge "Đang áp dụng" trên header');
}
await go('tao-luong.html');
ok(await p.$$eval('sd-checkbox[data-sd-tooltip]', e => e.length) === 2 && await p.$$eval('sd-checkbox[title]', e => e.length) === 0, 'tao-luong: tooltip checkbox qua data-sd-tooltip');

console.log(`\n${pass} ok, ${fail} FAIL`);
console.log(errs.length ? 'JS ERRORS:\n  ' + errs.join('\n  ') : 'Không lỗi JS.');
await b.close();
