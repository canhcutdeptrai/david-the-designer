// Kịch bản tương tác trên bản GỐC (selector cũ) — ghi lại kết quả để so với bản đã chuyển.
import { chromium } from 'playwright';
const root = '/home/claude/kit/prototype-kit-CATALOG-1012m/prototypes/cam-nang-phan-quyen/';
const file = process.argv[2] || 'tra-cuu-cam-nang-v2.html';
const shots = '/home/claude/work/round/agents/v2/';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.route(/^https?:/, r => r.abort());
const errs = []; p.on('pageerror', e => errs.push(String(e).slice(0, 300)));
p.on('dialog', d => d.accept());
await p.goto('file://' + root + file); await p.waitForTimeout(1200);
const log = (k, v) => console.log(k.padEnd(34), JSON.stringify(v), errs.length ? '[err ' + errs.length + ']' : '');
const W = ms => p.waitForTimeout(ms || 400);
log('tree rows', await p.locator('.work-tree-row').count());
await p.fill('#tree-search-input input', 'hop dong'); await W(600);
log('search rows/tags', [await p.locator('.work-tree-row').count(), await p.locator('.handbook-tag').count()]);
await p.click('#tree-search-clear'); await W(600);
log('after clear rows', await p.locator('.work-tree-row').count());
await p.locator('.handbook-tag').nth(0).click(); await W();
log('tag0 rows', await p.locator('.work-tree-row').count());
await p.locator('.handbook-tag').nth(1).click(); await W();
await p.locator('.work-tree-row.leaf').first().click(); await W(800);
log('detail title', await p.locator('.detail-sticky-name').textContent());
log('info panel active', await p.locator('[data-detail-tab-panel="info"]').evaluate(e => e.classList.contains('active')));
await p.screenshot({ path: shots + file + '.detail.png' });
await p.click('#inline-tab-history'); await W();
log('history active', await p.locator('[data-detail-tab-panel="history"]').evaluate(e => e.classList.contains('active')));
await p.screenshot({ path: shots + file + '.history.png' });
await p.click('#inline-tab-info'); await W();
log('info back', await p.locator('[data-detail-tab-panel="info"]').evaluate(e => e.classList.contains('active')));
// menu thêm người
const fa = p.locator('.flow-action-icon').first();
if (await fa.count()) { await fa.click(); await W(); log('flow menu open', await p.locator('.flow-action-menu.open').count()); await p.mouse.click(700, 30); await W(); log('flow menu closed', await p.locator('.flow-action-menu.open').count()); }
if (await p.locator('.inline-detail-close').isVisible()) { await p.locator('.inline-detail-close').click(); await W(); }
log('after close empty', await p.locator('#inline-detail-panel').evaluate(e => e.classList.contains('empty')));
// Tab nhân sự
await p.click('.page-tab-zone .tab:nth-child(2)'); await W(800);
await p.screenshot({ path: shots + file + '.identity0.png' });
await p.locator('#identity-search-person .multi-filter-trigger').click(); await W();
log('person options', await p.locator('#identity-search-person .single-filter-option').count());
await p.locator('#identity-search-person .single-filter-option').nth(0).click(); await W(800);
log('identity rows', await p.locator('.lookup-result-table tbody tr').count());
log('footer', (await p.locator('.lookup-table-footer .footer-label').textContent()).trim());
await p.screenshot({ path: shots + file + '.identity1.png' });
await p.locator('#identity-col-handbook .multi-filter-trigger').click(); await W();
const hbOpts = await p.locator('#identity-col-handbook .multi-filter-option').allTextContents();
log('handbook filter options', hbOpts);
await p.locator('#identity-col-handbook .multi-filter-option').nth(1).click(); await W(800);
log('rows after col filter', [await p.locator('.lookup-result-table tbody tr').count(), (await p.locator('.lookup-table-footer .footer-label').textContent()).trim()]);
// cấu hình bảng
await p.locator('.lookup-table-footer sd-button:has-text("Thiết lập")').click(); await W(800);
log('config rows', await p.locator('#table-config-rows tr').count());
await p.screenshot({ path: shots + file + '.config.png' });

// đổi tiêu đề cột 1 + bật Cố định cột 1 rồi Áp dụng
await p.locator('#table-config-rows tr').nth(0).locator('sd-input input').first().fill('Cẩm nang X');
await p.locator('#table-config-rows tr').nth(0).locator('sd-input input').first().dispatchEvent('input');
await W();
await p.locator('#table-config-rows tr').nth(1).locator('.table-config-switch-cell').nth(0).locator('button,sd-switch').first().click(); await W();
await p.locator('#table-config-rows tr').nth(2).locator('sd-checkbox input').click(); await W();
await p.locator('sd-modal sd-button:has-text("Áp dụng")').click(); await W(800);
log('header after config', await p.locator('.lookup-result-table thead tr').first().locator('th:not([hidden])').allTextContents());
log('pinned cells', await p.locator('.lookup-result-table .column-pinned').count());
await p.screenshot({ path: shots + file + '.identity2.png' });
// Tab ủy quyền
await p.click('.page-tab-zone .tab:nth-child(3)'); await W(900);
log('deleg rows', await p.locator('.lookup-result-table tbody tr').count());
log('deleg footer', (await p.locator('.lookup-table-footer .footer-label').textContent()).trim());
await p.screenshot({ path: shots + file + '.deleg0.png' });
await p.locator('#delegation-col-status .multi-filter-trigger').click(); await W();
log('status options', await p.locator('#delegation-col-status .multi-filter-option').allTextContents());
await p.locator('#delegation-col-status .multi-filter-option').nth(1).click(); await W(800);
log('deleg rows status1', await p.locator('.lookup-result-table tbody tr').count());
await p.locator('#delegation-col-status .multi-filter-trigger').click(); await W();
await p.locator('#delegation-col-status .multi-filter-option').nth(1).click(); await W(800);
log('deleg rows status cleared', await p.locator('.lookup-result-table tbody tr').count());
await p.fill('#delegation-col-item', 'hop dong'); await p.press('#delegation-col-item', 'Enter'); await W(800);
log('deleg rows item=hop dong', await p.locator('.lookup-result-table tbody tr').count());
log('empty text', await p.locator('.lookup-table-empty-text').allTextContents());
await p.fill('#delegation-col-item', ''); await p.press('#delegation-col-item', 'Enter'); await W(800);
await p.fill('#delegation-col-eff-from-start', '2026-06-01'); await p.dispatchEvent('#delegation-col-eff-from-start', 'change'); await W(800);
log('deleg rows effFrom>=2026-06-01', await p.locator('.lookup-result-table tbody tr').count());
await p.fill('#delegation-col-eff-from-start', ''); await p.dispatchEvent('#delegation-col-eff-from-start', 'change'); await W(800);
log('deleg rows reset', await p.locator('.lookup-result-table tbody tr').count());
await p.locator('sd-button:has-text("Xuất danh sách")').click(); await W();
log('export menu open', await p.locator('#delegation-export-menu.open').count());
await p.mouse.click(700, 30); await W();
log('export menu closed', await p.locator('#delegation-export-menu.open').count());
// mở chi tiết từ link đầu việc
await p.locator('.workitem-link').first().click(); await W(900);
log('deleg -> detail title', await p.locator('.detail-sticky-name').textContent().catch(() => null));
await p.screenshot({ path: shots + file + '.deleg1.png' });
// tạo ủy quyền
await p.locator('#inline-detail-panel').evaluate(() => closeInlineDetail()); await W(500);
await p.locator('sd-button:has-text("Tạo ủy quyền")').click(); await W(900);
log('scope summary', await p.locator('#scope-picker-summary').textContent());
await p.screenshot({ path: shots + file + '.create.png' });
await b.close();
console.log(errs.length ? 'JS ERRORS:\n  ' + errs.join('\n  ') : 'Không lỗi JS.');
