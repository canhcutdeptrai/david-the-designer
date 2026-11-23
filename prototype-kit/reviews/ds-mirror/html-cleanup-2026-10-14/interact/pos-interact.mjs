// Kịch bản tương tác cho 5 trang Ghế — node pos-interact.mjs
import { chromium } from 'playwright';
const root = 'file:///home/claude/kit/prototype-kit-CATALOG-1012m/prototypes/cam-nang-phan-quyen/';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
let fails = 0, errs = [];
const ok = (c, m) => { console.log((c ? 'PASS ' : 'FAIL ') + m); if (!c) fails++; };
const wait = ms => new Promise(r => setTimeout(r, ms));
async function open(f) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.route(/^https?:/, r => r.abort());
  p.on('pageerror', e => errs.push(f + ': ' + e));
  p.on('console', m => { if (m.type() === 'error' && !/ERR_|Failed to load/.test(m.text())) errs.push(f + ' console: ' + m.text()); });
  await p.goto(root + f); await p.waitForTimeout(1200);
  return p;
}
const rows = (p, sel) => p.locator(sel + ' tbody tr.c-row').count();
const today = (() => { const d = new Date(); return d.getFullYear() + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + String(d.getDate()).padStart(2, '0'); })();
async function pickSelect(p, hostSel, label) {
  await p.locator(hostSel + ' .mat-mdc-select-trigger').click(); await wait(300);
  if (!(await p.locator('.cdk-overlay-pane .sd-dropdown-item:has-text("' + label + '")').first().isVisible())) { await p.locator(hostSel + ' mat-form-field').click({ position: { x: 20, y: 16 } }); await wait(300); }
  await p.locator('.cdk-overlay-pane .sd-dropdown-item:has-text("' + label + '")').first().click(); await wait(300);
  await p.keyboard.press('Escape'); await wait(300);
}
async function typeDate(p, loc, ddmmyyyy) {
  const inp = loc.locator('input').first();
  await inp.click(); await inp.fill(''); await inp.type(ddmmyyyy); await inp.press('Tab'); await wait(300);
}

// ── danh-sach-position ──
{
  const p = await open('danh-sach-position.html');
  const T = '#tbl-position';
  ok(await rows(p, T) === 14, 'DS: 14 dòng ban đầu');
  ok((await p.locator(T + ' .mat-mdc-paginator-range-label').innerText()).trim() === '1-10/156', 'DS: chân bảng 1-10/156');
  const kw = p.locator('#flt-keyword input');
  await kw.click(); await kw.type('Kế toán'); await wait(400);
  ok(await rows(p, T) === 2, 'DS: lọc từ khoá "Kế toán" → 2 dòng (POS-001, POS-008), thực tế ' + await rows(p, T));
  ok((await p.locator(T + ' .mat-mdc-paginator-range-label').innerText()).trim() === '1-2/2', 'DS: chân bảng theo kết quả lọc 1-2/2');
  await kw.fill(''); await kw.type(' '); await kw.press('Backspace'); await wait(400);
  ok(await rows(p, T) === 14, 'DS: xoá từ khoá → 14 dòng');
  await pickSelect(p, '#flt-source', 'AAM Manual');
  ok(await rows(p, T) === 3, 'DS: lọc Nguồn = AAM Manual → 3 dòng, thực tế ' + await rows(p, T));
  await pickSelect(p, '#flt-status', 'Ngừng áp dụng');
  const codes = await p.locator(T + ' tbody tr.c-row td:nth-child(2)').allInnerTexts();
  ok(codes.length === 1 && codes[0].trim() === 'POS-M02', 'DS: + Trạng thái Ngừng áp dụng → chỉ POS-M02');
  await pickSelect(p, '#flt-source', 'AAM Manual'); await pickSelect(p, '#flt-status', 'Ngừng áp dụng');
  ok(await rows(p, T) === 14, 'DS: bỏ chọn 2 lọc → 14 dòng');
  await pickSelect(p, '#flt-org', 'VinMart+');
  ok(await rows(p, T) === 1, 'DS: lọc Đơn vị VinMart+ → 1 dòng');
  await pickSelect(p, '#flt-org', 'VinMart+');
  // phân trang (tĩnh như bảng cũ): bấm Trang sau / đổi số dòng không lỗi
  await p.locator(T + ' .mat-mdc-paginator-navigation-next').click({ force: true }); await wait(200);   /* 2026-10-14: total giả 156 > 14 dòng → nút khoá (phân trang tĩnh) */
  await p.locator(T + ' [data-sd-pagesize]').click(); await p.locator('.sd-paginator-pane mat-option[data-value="20"]').click();   /* 2026-10-14: mat-select thay <select> */ await wait(200);
  ok(await rows(p, T) === 14, 'DS: bấm Trang sau + đổi số dòng → bảng vẫn hiển thị, không lỗi');
  // lệnh trên dòng
  const nav = [];
  p.on('request', r => { if (r.isNavigationRequest()) nav.push(r.url()); });
  await p.route(/chi-tiet-position|sua-position/, r => r.abort());
  await p.locator(T + ' tbody tr.c-row').nth(0).locator('.c-command-btn[title="Xem chi tiết"]').click(); await wait(500);
  ok(nav.some(u => /chi-tiet-position\.html\?id=POS-001$/.test(u)), 'DS: nút Xem chi tiết → chi-tiet-position.html?id=POS-001'); await p.goto(root + 'danh-sach-position.html'); await p.waitForTimeout(1000);
  await p.locator(T + ' tbody tr.c-row').nth(0).locator('.c-table-menu-btn').click(); await wait(300);
  await p.locator(T + ' .c-table-menu-dropdown.open .c-table-menu-item:has-text("Sửa")').click(); await wait(500);
  ok(nav.some(u => /sua-position\.html\?id=POS-001&source=sap$/.test(u)), 'DS: Thao tác khác → Sửa (ghế SAP) → ...&source=sap'); await p.goto(root + 'danh-sach-position.html'); await p.waitForTimeout(1000);
  await wait(400);
  await p.locator(T + ' tbody tr.c-row').nth(5).locator('.c-table-menu-btn').click(); await wait(300);
  await p.locator(T + ' .c-table-menu-dropdown.open .c-table-menu-item:has-text("Sửa")').click(); await wait(500);
  ok(nav.some(u => /sua-position\.html\?id=POS-006$/.test(u)), 'DS: Sửa ghế Manual POS-006 → không kèm source'); await p.goto(root + 'danh-sach-position.html'); await p.waitForTimeout(1000);
  // drawer
  await p.evaluate(() => openDrawer({ positionCode: 'POS-006', positionName: 'Admin hệ thống AAM', source: 'AAM_MANUAL', orgUnit: 'MAG > Khối Công nghệ thông tin > Phòng IT', status: 'active', currentHolder: 'Vũ Thị F' }));
  await wait(600);
  const dr = await p.evaluate(() => { const d = document.getElementById('position-drawer'); const it = document.getElementById('info-code');
    return { opened: d.isOpened, title: document.getElementById('drawer-title-text').textContent, label: it.querySelector('.c-item-label') && it.querySelector('.c-item-label').textContent, val: it.querySelector('.c-item-value').textContent.trim(),
      edit: getComputedStyle(document.getElementById('btn-edit')).display, sap: document.getElementById('sap-notice').style.display }; });
  ok(dr.opened && dr.title === 'Admin hệ thống AAM', 'DS: openDrawer (ghế có người giữ) mở drawer, không lỗi — bản cũ ném TypeError');
  ok(dr.label === 'Mã Ghế' && dr.val === 'POS-006', 'DS: sd-section-item giữ nhãn, giá trị = POS-006');
  ok(dr.edit !== 'none' && dr.sap === 'none', 'DS: ghế Manual hiện nút Sửa, ẩn thông báo SAP');
  await p.screenshot({ path: 'pos-drawer-tab0.png' });
  await p.locator('#drawer-tabs .mat-mdc-tab:has-text("Người giữ ghế"), #drawer-tabs [role=tab]:has-text("Người giữ ghế")').first().click(); await wait(700);
  const holderVis = await p.evaluate(() => { const t = document.querySelector('#tab-holder sd-table'); const r = t.getBoundingClientRect(); return r.height > 0 && t.querySelectorAll('tr.c-row').length; });
  ok(holderVis === 6, 'DS: đổi tab "Người giữ ghế" → bảng sd-table 6 dòng hiện, thực tế ' + holderVis);
  await p.screenshot({ path: 'pos-drawer-tab1.png' });
  await p.locator('#drawer-tabs [role=tab]:has-text("Lịch sử Holder")').first().click(); await wait(700);
  const histVis = await p.evaluate(() => { const t = document.querySelector('#tab-history sd-table'); return t.getBoundingClientRect().height > 0 ? t.querySelectorAll('tr.c-row').length : 0; });
  ok(histVis === 3, 'DS: đổi tab "Lịch sử Holder" → 3 dòng');
  await p.locator('#position-drawer .c-close, #position-drawer button[aria-label*="Đóng"], #position-drawer .sd-side-drawer-header button').last().click().catch(() => {}); await wait(600);
  if (await p.evaluate(() => document.getElementById('position-drawer').isOpened)) await p.evaluate(() => closeDrawer());
  ok(!(await p.evaluate(() => document.getElementById('position-drawer').isOpened)), 'DS: đóng drawer');
  await p.evaluate(() => openDrawer({ positionCode: 'POS-008', positionName: 'Nhân viên Kế toán cao cấp', source: 'SAP_HCM', orgUnit: 'MPM', status: 'active', currentHolder: '-' }));
  await wait(600);
  const d2 = await p.evaluate(() => ({ sel: document.getElementById('drawer-tabs').getAttribute('selectedIndex'), sap: document.getElementById('sap-notice').style.display, edit: document.getElementById('btn-edit').style.display, vac: document.getElementById('vacant-warning').style.display }));
  ok(d2.sel === '0' && d2.sap === 'block' && d2.edit === 'none' && d2.vac === 'block', 'DS: mở lại (ghế SAP trống) → về tab Thông tin, hiện thông báo SAP, ẩn Sửa, cảnh báo ghế trống');
  await p.close();
}

// ── lich-su-sync ──
{
  const p = await open('lich-su-sync.html');
  await p.locator('#tbl-sync tbody tr.c-row').nth(6).locator('.c-command-btn[title="Xem chi tiết"]').click(); await wait(600);
  const s = await p.evaluate(() => ({ o: document.getElementById('sync-drawer').isOpened, sub: document.getElementById('drawer-subtitle').textContent, c: document.getElementById('stat-status').getAttribute('color'), t: document.getElementById('stat-status').textContent.trim() }));
  console.log(JSON.stringify(s)); ok(s.o && s.sub === 'SYNC-1241' && s.c === 'error' && s.t === 'Thất bại', 'SYNC: Xem chi tiết dòng SYNC-1241 → drawer mở đúng dữ liệu (Thất bại / error)');
  await p.screenshot({ path: 'sync-drawer.png' });
  await p.evaluate(() => closeDrawer()); await wait(500);
  ok(!(await p.evaluate(() => document.getElementById('sync-drawer').isOpened)), 'SYNC: đóng drawer');
  await p.close();
}

// ── tao-position ──
{
  const p = await open('tao-position.html');
  const T = '#holder-table';
  ok(await rows(p, T) === 1, 'TAO: 1 dòng người giữ ban đầu');
  const ac = p.locator(T + ' sd-autocomplete').first();
  await ac.locator('input').click(); await ac.locator('input').type('Trần'); await wait(400);
  await ac.locator('.sd-autocomplete-panel .sd-dropdown-item:has-text("Trần Thị B")').click(); await wait(400);
  ok((await ac.getAttribute('value')) === 'Trần Thị B - tranthib@onemount.com', 'TAO: chọn người giữ qua sd-autocomplete');
  const toMin0 = await p.locator(T + ' sd-date[data-holder-field="to"]').first().getAttribute('min');
  ok(toMin0 === today, 'TAO: Ngày kết thúc min = hôm nay (' + toMin0 + ')');
  ok(!(await p.locator(T + ' sd-date[data-holder-field="from"]').first().getAttribute('min')), 'TAO: Ngày bắt đầu không có min (quá khứ/hiện tại/tương lai)');
  await typeDate(p, p.locator(T + ' sd-date[data-holder-field="from"]').first(), '01/12/2026');
  ok((await p.locator(T + ' sd-date[data-holder-field="to"]').first().getAttribute('min')) === '2026/12/02', 'TAO: chọn Ngày bắt đầu 01/12/2026 → Ngày kết thúc min 02/12/2026');
  await typeDate(p, p.locator(T + ' sd-date[data-holder-field="from"]').first(), '01/01/2020');
  ok((await p.locator(T + ' sd-date[data-holder-field="from"]').first().getAttribute('value')) === '2020/01/01', 'TAO: Ngày bắt đầu nhận ngày quá khứ');
  ok((await p.locator(T + ' sd-date[data-holder-field="to"]').first().getAttribute('min')) === today, 'TAO: ... Ngày kết thúc min quay về hôm nay');
  // lịch: ngày trước min bị khoá
  await p.evaluate(() => document.querySelector('#holder-table sd-date[data-holder-field="to"]').scrollIntoView({ block: 'center' })); await wait(300);
  await p.locator(T + ' sd-date[data-holder-field="to"]').first().locator('mat-icon.sd-suffix-icon').click(); await wait(400);
  const cal = await p.evaluate(() => { const pop = document.querySelector('#holder-table sd-date[data-holder-field="to"] .sd-date-popup');
    if (!pop) return null; const r = pop.getBoundingClientRect(); const hit = document.elementFromPoint(r.left + r.width / 2, r.top + Math.min(r.height - 4, 120));
    return { h: r.height, inside: pop.contains(hit), disabled: pop.querySelectorAll('[disabled], .disabled, [aria-disabled=true]').length }; });
  ok(cal && cal.h > 100 && cal.inside, 'TAO: lịch Ngày kết thúc mở, không bị khung bảng cắt ' + JSON.stringify(cal));
  ok(cal && cal.disabled > 0, 'TAO: lịch khoá các ngày trước hôm nay');
  await p.screenshot({ path: 'tao-cal.png' });
  await p.keyboard.press('Escape'); await p.mouse.click(1300, 60); await wait(300);
  await wait(350); await p.locator(T + ' [data-sd-add-row]').click(); await wait(400);
  ok(await rows(p, T) === 2, 'TAO: Thêm người giữ → 2 dòng');
  ok((await p.locator(T + ' sd-autocomplete').first().getAttribute('value')) === 'Trần Thị B - tranthib@onemount.com' && (await p.locator(T + ' sd-date[data-holder-field="from"]').first().getAttribute('value')) === '2020/01/01', 'TAO: dòng 1 giữ nguyên giá trị sau khi thêm dòng');
  await wait(350); await p.locator(T + ' [data-holder-del="0"]').click(); await wait(400);
  ok(await rows(p, T) === 1 && !(await p.locator(T + ' sd-autocomplete').first().getAttribute('value')), 'TAO: xoá dòng 1 → còn 1 dòng (dòng mới, trống)');
  await wait(350); await p.locator(T + ' [data-holder-del="0"]').click(); await wait(400);
  ok(await rows(p, T) === 0, 'TAO: xoá hết → 0 dòng (mục tùy chọn), nút Thêm vẫn còn: ' + await p.locator(T + ' [data-sd-add-row]').count());
  await p.close();
}

// ── sua-position ──
{
  const p = await open('sua-position.html');
  const T = '#holder-table';
  ok(await rows(p, T) === 3, 'SUA: 3 record người giữ');
  const st = await p.evaluate(() => [...document.querySelectorAll('#holder-table tr.c-row')].map(tr => ({
    h: tr.querySelector('sd-autocomplete').hasAttribute('disabled'), f: tr.querySelector('[data-holder-field=from]').hasAttribute('disabled'),
    t: tr.querySelector('[data-holder-field=to]').hasAttribute('disabled'), fmin: tr.querySelector('[data-holder-field=from]').getAttribute('min'),
    tmin: tr.querySelector('[data-holder-field=to]').getAttribute('min'), btn: tr.querySelector('sd-button').hasAttribute('disabled') })));
  ok(st[0].h && st[0].f && st[0].t && st[0].btn, 'SUA: record cũ khoá cả 3 ô + nút bút khoá');
  ok(st[1].h && st[1].f && !st[1].t && st[1].tmin === today && !st[1].btn, 'SUA: record hiện tại chỉ sửa Ngày kết thúc (min hôm nay)');
  ok(!st[2].h && !st[2].f && st[2].fmin === today && st[2].tmin === today, 'SUA: record tương lai sửa được, min ngày bắt đầu/kết thúc = hôm nay');
  await wait(350); await p.locator(T + ' [data-sd-add-row]').click(); await wait(400);
  ok(await rows(p, T) === 4, 'SUA: Thêm người giữ → 4 dòng');
  const n = p.locator(T + ' tr.c-row').nth(3);
  ok((await n.locator('[data-holder-field=from]').getAttribute('min')) === today && (await n.locator('[data-holder-field=from]').getAttribute('required')) !== null, 'SUA: người giữ mới — Ngày bắt đầu bắt buộc, min hôm nay');
  await typeDate(p, p.locator(T + ' tr.c-row').nth(2).locator('[data-holder-field=to]'), '31/12/2026');
  ok((await n.locator('[data-holder-field=from]').getAttribute('min')) === '2027/01/01', 'SUA: record trước có Ngày kết thúc 31/12/2026 → Ngày bắt đầu mới min 01/01/2027');
  await typeDate(p, n.locator('[data-holder-field=from]'), '05/01/2027');
  ok((await n.locator('[data-holder-field=to]').getAttribute('min')) === '2027/01/06', 'SUA: Ngày kết thúc mới > Ngày bắt đầu (min 06/01/2027)');
  ok((await n.locator('sd-button').getAttribute('prefixIcon')) === 'delete_outline', 'SUA: dòng mới có nút Xóa dòng');
  await p.screenshot({ path: 'sua-added.png', fullPage: false });
  await wait(350); await n.locator('[data-holder-del]').click(); await wait(400);
  ok(await rows(p, T) === 3 && (await p.locator(T + ' tr.c-row').nth(2).locator('[data-holder-field=to]').getAttribute('value')) === '2026/12/31', 'SUA: xoá dòng mới → 3 dòng, giá trị đã sửa của record tương lai còn nguyên');
  await p.close();
  const q = await open('sua-position.html?source=sap');
  ok(await q.evaluate(() => getComputedStyle(document.querySelector('.holder-table-subgroup')).display === 'none' && getComputedStyle(document.querySelector('.holder-sap-current')).display === 'block'), 'SUA ?source=sap: ẩn bảng người giữ, hiện dòng người đang giữ');
  await q.close();
}
console.log(errs.length ? 'JS ERRORS:\n  ' + errs.join('\n  ') : 'Không lỗi JS.');
console.log(fails ? fails + ' FAIL' : 'TẤT CẢ PASS');
await b.close();
