// node workitem-interact.mjs [tao|sua]  — bấm thử tương tác đã chuyển sang sd-* của cặp Tạo/Sửa Đầu việc
import { chromium } from 'playwright';
const which = process.argv[2] || 'tao';
const root = process.env.ROOT || '/home/claude/kit/prototype-kit-CATALOG-1012m/prototypes/cam-nang-phan-quyen/';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
await p.route(/^https?:/, r => r.abort());
const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 300)));
p.on('console', m => { if (m.type() === 'error' && !/ERR_|Failed to load resource/.test(m.text())) errs.push('console: ' + m.text().slice(0, 300)); });
let fails = 0;
const ok = (cond, msg) => { console.log((cond ? 'PASS ' : 'FAIL ') + msg); if (!cond) fails++; };
const wait = ms => p.waitForTimeout(ms);
async function sclick(loc) { await wait(350); await loc.click(); await wait(150); }
async function choose(sel, text) {
  if (!(await sel.evaluate(e => e.classList.contains('sd-open')))) { await sel.locator('mat-form-field').first().click(); await wait(150); }
  await p.locator('.cdk-overlay-pane .sd-dropdown-item', { hasText: text }).first().click(); await wait(200);
}
async function closePanels() { await p.mouse.click(1420, 980); await wait(150); }

const file = which === 'tao' ? 'tao-workitem.html' : 'sua-workitem.html?id=WI-001';
const builderSel = which === 'tao' ? '#tier-1-conds' : '#tier-1-conds';
const addCondFn = which === 'tao' ? 'addTierCondition' : 'addEditTierCondition';

if (which === 'tao') {
  await p.goto('file://' + root + file); await wait(1200);
  // 1. mặc định trống: Luồng ẩn, có nút Thêm
  const hiddenCount = await p.evaluate(() => [...document.querySelectorAll('#condition-section sd-section')].filter(s => s.style.display === 'none').length);
  ok(hiddenCount === 2, 'tạo mới: 2 Luồng ẩn mặc định (' + hiddenCount + ')');
  await sclick(p.locator('#condition-section .tier-add-condition-wrap sd-button[onclick^="showFirstCreateConditionSet"]'));
  const condRows0 = await p.locator('#tier-1-conds .cond-row').count();
  ok(condRows0 === 0, 'bấm Thêm: Luồng 1 hiện, bộ điều kiện rỗng (' + condRows0 + ')');
  // 2. loại Hạng mục / Đầu việc
  await p.locator('#workitem-kind-radio label.mdc-label', { hasText: 'Hạng mục' }).click(); await wait(250);
  let st = await p.evaluate(() => ({ kind: getCurrentWorkItemKind(), cond: getComputedStyle(document.getElementById('condition-section')).display, label: document.getElementById('workitem-title-label').textContent }));
  ok(st.kind === 'category' && st.cond === 'none' && /Tên hạng mục/.test(st.label), 'chọn Hạng mục: ẩn Luồng, nhãn "Tên hạng mục" ' + JSON.stringify(st));
  await p.locator('#workitem-kind-radio label.mdc-label', { hasText: 'Đầu việc' }).click(); await wait(250);
  st = await p.evaluate(() => ({ kind: getCurrentWorkItemKind(), cond: getComputedStyle(document.getElementById('condition-section')).display }));
  ok(st.kind === 'task' && st.cond !== 'none', 'chọn lại Đầu việc: hiện Luồng ' + JSON.stringify(st));
} else {
  await p.goto('file://' + root + file); await wait(1200);
}

// 3. thêm điều kiện (Phòng ban)
const builder = p.locator(builderSel);
const before = await builder.locator('.cond-row').count();
await sclick(p.locator('#tier-1-conds + .tier-add-condition-wrap sd-button'));
let rows = builder.locator('.cond-row');
ok(await rows.count() === before + 1, 'thêm điều kiện: ' + before + ' → ' + await rows.count());
let row = rows.last();
ok(await row.locator('.cond-field').evaluate(e => e.value) === 'department', 'dòng mới: Loại = Phòng ban');
ok(await row.locator('sd-select.dept-cond-value[multiple]').count() === 1, 'dòng mới: ô Giá trị = sd-select chọn nhiều phòng ban');
await choose(row.locator('sd-select.dept-cond-value'), 'Pháp chế');
await choose(row.locator('sd-select.dept-cond-value'), 'Nhân sự');
await closePanels();
ok(await row.locator('sd-select.dept-cond-value').evaluate(e => e.value) === 'Pháp chế,Nhân sự', 'chọn 2 phòng ban → value "Pháp chế,Nhân sự"');

// 4. đổi loại → Giá trị tài sản (toán tử IN giữ nguyên → ô danh sách sd-chip)
await choose(row.locator('sd-select.cond-field'), 'Giá trị tài sản');
let opItems = await row.locator('.cond-op').evaluate(e => JSON.parse(e.getAttribute('items')).length);
ok(opItems === 9, 'đổi sang Giá trị tài sản: bộ toán tử chuẩn 9 mục (' + opItems + ')');
ok(await row.locator('.cond-val-wrap sd-chip').count() === 1, 'toán tử IN → ô Giá trị = sd-chip');
await row.locator('.cond-val-wrap sd-chip input').fill('A1'); await row.locator('.cond-val-wrap sd-chip input').press('Enter'); await wait(150);
ok(JSON.stringify(await row.locator('.cond-val-wrap sd-chip').evaluate(e => e.value)) === '["A1"]', 'sd-chip: gõ A1 + Enter → ["A1"]');

// 5. toán tử BETWEEN → 2 sd-input-number + tiền tệ
await choose(row.locator('sd-select.cond-op'), 'BETWEEN');
ok(await row.locator('.cond-val-wrap sd-input-number').count() === 2 && await row.locator('.cond-val-wrap sd-select.cond-currency').count() === 2, 'BETWEEN (số): 2 sd-input-number + 2 sd-select tiền tệ');
const num = row.locator('.cond-val-wrap sd-input-number input').first();
await num.click(); await num.pressSequentially('2500000'); await wait(100);
ok(/2,500,000/.test(await num.inputValue()), 'sd-input-number định dạng 1,234,567: ' + await num.inputValue());
await choose(row.locator('sd-select.cond-currency').first(), 'VND');
ok(await row.locator('sd-select.cond-currency').first().evaluate(e => e.value) === 'VND', 'chọn tiền tệ VND');

// 6. loại → Ngày đề xuất (BETWEEN) → 2 sd-date; toán tử = → 1 sd-date
await choose(row.locator('sd-select.cond-field'), 'Ngày đề xuất');
ok(await row.locator('.cond-val-wrap sd-date').count() === 2 && await row.locator('.cond-val-wrap sd-input-number').count() === 0, 'loại ngày + BETWEEN: 2 sd-date, không còn ô số');
await choose(row.locator('sd-select.cond-op'), '(bằng)');
ok(await row.locator('.cond-val-wrap sd-date').count() === 1, 'loại ngày + "=": 1 sd-date');
await choose(row.locator('sd-select.cond-field'), 'Giá trị hợp đồng');
ok(await row.locator('.cond-val-wrap sd-input-number').count() === 1 && await row.locator('.cond-val-wrap sd-date').count() === 0, 'về loại số + "=": 1 sd-input-number');

// 7. AND/OR
await sclick(p.locator('#tier-1-conds + .tier-add-condition-wrap sd-button'));
const nRows = await builder.locator('.cond-row').count();
ok(await builder.locator('.cond-connector-badge').count() === nRows - 1, 'mỗi cặp dòng có 1 nhãn nối (' + nRows + ' dòng)');
await p.locator('.tier-condition-toolbar').first().locator('[role=tab], .mat-mdc-tab, .sd-tab-label', { hasText: 'OR' }).first().click(); await wait(200);
let badges = await builder.locator('.cond-connector-badge').allTextContents();
ok(badges.length && badges.every(t => t.trim() === 'OR'), 'bấm OR → nhãn nối ' + JSON.stringify(badges));
await sclick(builder.locator('.cond-row').last().locator('sd-button[aria-label="Xóa điều kiện"]'));
ok(await builder.locator('.cond-row').count() === nRows - 1, 'xoá điều kiện cuối → ' + await builder.locator('.cond-row').count() + ' dòng');
const nums = await builder.locator('.cond-num').allTextContents();
ok(nums.every((t, i) => t.trim() === String(i + 1)), 'đánh số lại ' + JSON.stringify(nums));

// 8. Nguyên tắc duyệt + hoạt động
const panel = p.locator('.assignment-source-wrap').first();
if (which === 'tao') await choose(panel.locator('sd-select.orgbase-rule-select'), 'Rule-01');
let grids = panel.locator('.assignment-rule-grid');
ok(await grids.count() === 3, 'Rule-01 → 3 dòng hoạt động (' + await grids.count() + ')');
ok(await grids.first().locator('sd-autocomplete.assignment-action').evaluate(e => e.value) === 'Đề xuất', 'dòng 1: Hoạt động = Đề xuất (sd-autocomplete)');
ok(await grids.first().locator('sd-select.assignment-levels').evaluate(e => e.value) === '2,3', 'dòng 1: Cấp ghế = 2,3 (sd-select multiple)');
ok(await grids.nth(1).locator('sd-autocomplete.assignment-action input').evaluate(e => e.placeholder || e.value) === 'Thẩm định', 'dòng 2: "Thẩm định" (ngoài danh sách) vẫn hiện');
await choose(grids.first().locator('sd-select.assignment-seats'), 'CFO'); await closePanels();
ok(await grids.first().locator('sd-select.assignment-seats').evaluate(e => e.value) === 'GĐ TC-KT,CFO', 'thêm ghế CFO → "GĐ TC-KT,CFO"');
await sclick(panel.locator('sd-button.add-action-btn[onclick*="ssignmentAction"]'));
ok(await grids.count() === 4, 'Thêm hoạt động → 4 dòng');
await sclick(grids.last().locator('sd-button[aria-label="Xóa dòng"]'));
ok(await grids.count() === 3, 'Xóa dòng → 3 dòng');
const badgesOrder = await panel.locator('.assignment-order-badge').allTextContents();
ok(badgesOrder.join() === '1,2,3', 'thứ tự hoạt động ' + badgesOrder.join());
// autocomplete: gõ lọc + chọn
const ac = grids.nth(2).locator('sd-autocomplete.assignment-action');
await ac.locator('input').click(); await ac.locator('input').fill('cuối'); await wait(250);
const acItem = p.locator('.sd-dropdown-item:visible, [role=option]:visible', { hasText: 'Phê duyệt cuối' }).first();
if (await acItem.count()) { await acItem.click(); await wait(200); }
ok(await ac.evaluate(e => e.value) === 'Phê duyệt cuối', 'sd-autocomplete: gõ "cuối" → chọn "Phê duyệt cuối" (' + await ac.evaluate(e => e.value) + ')');
await closePanels();

// 9. popup cấu hình: số người + thứ tự
await sclick(grids.first().locator('sd-button[aria-label="Số người cần thực hiện"]'));
let modal = p.locator('.activity-config-overlay');
ok(await modal.count() === 1, 'mở popup Số người');
const quorum = modal.locator('sd-select').first();
const qItems = await quorum.evaluate(e => JSON.parse(e.getAttribute('items')).map(i => i.name));
ok(qItems[0] === 'Tất cả' && qItems.length === 4, 'Số người: ' + JSON.stringify(qItems) + ' (4 ghế đã cấu hình → Tất cả + 1..3/4)');
await quorum.locator('mat-form-field').click(); await wait(200);
const item = p.locator('.cdk-overlay-pane .sd-dropdown-item', { hasText: '2/4 người' }).first();
const onTop = await item.evaluate(el => { const r = el.getBoundingClientRect(); const t = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return !!t && el.contains(t); });
ok(onTop, 'bảng chọn sd-select nổi TRÊN popup (z-index)');
await item.click(); await wait(200);
ok(await quorum.evaluate(e => e.value) === '2/4 người', 'chọn 2/4 người');
await sclick(modal.locator('.activity-config-footer sd-button').first());
ok(await p.locator('.activity-config-overlay').count() === 0, 'Bỏ qua → đóng popup');
await sclick(grids.first().locator('sd-button[aria-label="Thứ tự thực hiện"]'));
modal = p.locator('.activity-config-overlay');
ok(!(await modal.locator('#activity-sequence-list').evaluate(e => e.classList.contains('show'))), 'Thứ tự: mặc định ẩn danh sách ghế');
await choose(modal.locator('sd-select.activity-sequence-mode'), 'Chỉ định thứ tự');
ok(await modal.locator('#activity-sequence-list').evaluate(e => e.classList.contains('show')), 'chọn "Chỉ định thứ tự" → hiện danh sách ghế');
const seq = await modal.locator('.activity-sequence-name').allTextContents();
ok(seq.join('|') === 'Cấp ghế 2|Cấp ghế 3|GĐ TC-KT|CFO', 'danh sách ghế đọc từ sd-select: ' + seq.join('|'));
await sclick(modal.locator('sd-button[aria-label="Thoát"]'));

// 10. Nhân bản luồng → dòng điều kiện trong bản sao vẫn đổi được
const secCount = await p.locator('#' + (which === 'tao' ? 'condition-section' : 'condition-section-edit') + ' sd-section').count();
await sclick(p.locator('sd-button.tier-clone-btn').first());
const secCount2 = await p.locator('#' + (which === 'tao' ? 'condition-section' : 'condition-section-edit') + ' sd-section').count();
ok(secCount2 === secCount + 1, 'Nhân bản luồng: ' + secCount + ' → ' + secCount2 + ' sd-section');
const cloneRow = p.locator('#' + (which === 'tao' ? 'condition-section' : 'condition-section-edit') + ' sd-section').nth(1).locator('.cond-builder .cond-row').first();
ok(await cloneRow.count() === 1, 'bản sao có dòng điều kiện');
if (await cloneRow.count()) {
  ok(await cloneRow.locator('sd-select.cond-field').evaluate(e => e.value) === await p.locator('#tier-1-conds .cond-row .cond-field').first().evaluate(e => e.value), 'bản sao giữ giá trị Loại điều kiện');
  await choose(cloneRow.locator('sd-select.cond-field'), 'Ngày đề xuất');
  ok(await cloneRow.locator('.cond-val-wrap sd-date').count() >= 1, 'bản sao: đổi loại → ô ngày');
}

ok(errs.length === 0, 'không lỗi JS' + (errs.length ? ':\n  ' + errs.join('\n  ') : ''));
await p.evaluate(() => { const s = document.createElement('style'); s.id = 'shot-css'; s.textContent = 'html,body,.app-shell,.main-area,.content-zone{height:auto!important;max-height:none!important;overflow:visible!important}'; document.head.appendChild(s); }); await wait(200);
await p.screenshot({ path: '/home/claude/work/round/agents/' + which + '-workitem.interact.png', fullPage: true });
await p.evaluate(() => document.getElementById('shot-css').remove()); await wait(100);

// 11. Lưu
if (which === 'tao') {
  await wait(350);
  await p.locator('button', { hasText: /^\s*Tạo\s*$/ }).first().click();
  await p.waitForURL(/danh-sach-workitem\.html/, { timeout: 5000 }).catch(() => {});
  ok(/danh-sach-workitem\.html/.test(p.url()), 'bấm Tạo → về danh-sach-workitem.html');
} else {
  await wait(350);
  await p.locator('button', { hasText: /^\s*(save)?Lưu\s*$/ }).first().click(); await wait(300);
  const vm = p.locator('.version-save-overlay');
  ok(await vm.count() === 1, 'bấm Lưu → popup nâng version');
  const forced = await vm.locator('.version-save-force-note').count();
  ok(forced === 1, 'đã đổi điều kiện (sd-change) → bắt buộc nâng version (ghi chú hiện)');
  const sameDisabled = await vm.locator('sd-radio[value="same"]').evaluate(e => e.hasAttribute('disabled'));
  ok(sameDisabled, '"Không nâng version" bị khoá');
  await wait(350);
  await vm.locator('.version-save-footer sd-button').last().click();
  await p.waitForURL(/chi-tiet-workitem\.html/, { timeout: 5000 }).catch(() => {});
  ok(/chi-tiet-workitem\.html\?id=WI-001/.test(p.url()), 'Lưu trong popup → chi-tiet-workitem.html?id=WI-001');
}
console.log(fails ? fails + ' FAIL' : 'TẤT CẢ PASS');
await b.close();
