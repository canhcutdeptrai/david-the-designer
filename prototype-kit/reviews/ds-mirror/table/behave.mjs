import { chromium } from 'playwright';
const K='file:///home/claude/kit/prototype-kit-CATALOG-1012m/design-system/preview/';
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:1440,height:900}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
const W=ms=>p.waitForTimeout(ms); const R=[]; const ok=(c,m)=>R.push((c?'ok   ':'FAIL ')+m);
const pane=()=>p.$('body > .cdk-overlay-container > .sd-table-pane');
await p.goto(K+'components/table.html'); await W(1200);
const T='#cat-tbl-full';
await p.evaluate(()=>{window.__ev=[];document.addEventListener('sd-table-command',e=>window.__ev.push(e.detail.key+':'+(e.detail.row&&e.detail.row.code)));});
// selection
let n=async()=>p.$eval(T+' selector-action .c-length',e=>e.textContent.trim());
ok(await n()==='2','chọn sẵn 2 dòng → thanh chọn = 2');
await p.locator(T+' tbody tr.c-row').nth(2).locator('mat-checkbox[data-sel-row] input').click(); await W(150);
ok(await n()==='3' && await p.locator(T+' tbody tr.c-row').nth(2).evaluate(r=>r.classList.contains('selected') && !!r.querySelector('.mat-mdc-checkbox-checked')),'bấm ô chọn dòng 3 → 3, dòng tô selected');
await p.locator(T+' thead mat-checkbox[data-sel-all] input').click(); await W(150);
ok(await n()==='4' && await p.$eval(T+' thead mat-checkbox',e=>e.classList.contains('mat-mdc-checkbox-checked')),'chọn tất cả → 4, ô đầu cột checked');
await p.locator(T+' thead mat-checkbox[data-sel-all] input').click(); await W(150);
ok(await p.locator(T+' tbody .mat-mdc-checkbox-checked').count()===0,'bỏ chọn tất cả → 0');
// keyboard
await p.locator(T+' tbody tr.c-row').nth(1).locator('mat-checkbox input').focus(); await p.keyboard.press('Space'); await W(150);
ok(await p.evaluate(t=>{const a=document.activeElement;return a&&a.closest('tr')===document.querySelectorAll(t+' tbody tr.c-row')[1]&&a.checked;},T),'Space trên ô chọn → chọn + giữ focus đúng ô');
// command inline
await p.locator(T+' tbody tr.c-row').nth(0).locator('desktop-command button[title="Xem chi tiết"]').click(); await W(100);
ok((await p.evaluate(()=>window.__ev.join()))==='view:FD-2026-00128','nút Xem chi tiết → sd-table-command view');
// menu
ok(await p.locator(T+' .c-table-menu-dropdown').count()===0,'ô lệnh không chứa bảng chọn (đóng)');
const mb=p.locator(T+' tbody tr.c-row').nth(1).locator('desktop-command button[data-menu-target]');
await mb.click(); await W(150);
let pn=await pane(); ok(!!pn,'bấm ⋮ → menu ở overlay');
const pos=await p.evaluate(t=>{const pn=document.querySelector('.sd-table-pane');const btn=document.querySelectorAll(t+' tbody tr.c-row')[1].querySelector('button[data-menu-target]');const a=pn.getBoundingClientRect(),c=btn.getBoundingClientRect();return [Math.round(a.left-c.right),Math.round(a.top-c.bottom),btn.getAttribute('aria-expanded'),[...pn.querySelectorAll('.c-table-menu-item span')].map(x=>x.textContent.trim()).join('|')];},T);
ok(pos[0]===4&&pos[1]===4&&pos[2]==='true','menu cách nút 4px phải/dưới, aria-expanded '+JSON.stringify(pos));
ok(pos[3]==='Chỉnh sửa|Sao chép','mục menu: '+pos[3]);
await p.locator('.sd-table-pane .c-table-menu-item:has-text("Sao chép")').click(); await W(150);
ok(!(await pane()) && (await p.evaluate(()=>window.__ev.join())).endsWith('copy:FD-2026-00127'),'chọn Sao chép → đóng + command copy dòng 2');
await mb.click(); await W(100); await mb.click(); await W(100); ok(!(await pane()),'bấm ⋮ lần nữa → đóng');
await mb.click(); await W(100); await p.mouse.click(1400,880); await W(100); ok(!(await pane()),'bấm ra ngoài → đóng');
await mb.click(); await W(100); await p.keyboard.press('Escape'); await W(100);
ok(!(await pane()) && await p.evaluate(()=>document.activeElement && document.activeElement.hasAttribute('data-menu-target')),'Esc → đóng, focus về nút ⋮');
await mb.click(); await W(100); await p.mouse.wheel(0,200); await W(200); ok(!(await pane()),'cuộn trang → đóng');
// two tables
await p.evaluate(()=>scrollTo(0,0)); await W(100);
// sort
const st=async()=>p.$eval(T+' th.mat-column-code .c-header-title',e=>[e.getAttribute('aria-sort'),getComputedStyle(e).backgroundImage.slice(-60),e.querySelector('.mat-sort-header-container').classList.contains('mat-sort-header-sorted')]);
let s0=await st(); await p.locator(T+' th.mat-column-code .c-header-title').click(); await W(150); let s1=await st();
ok(s0[0]==='none'&&s1[0]==='ascending'&&s1[2]&&s1[1]!==s0[1],'sắp xếp mã: none→ascending, đổi ảnh mũi tên '+JSON.stringify([s0,s1]));
const T2='#table-children-demo'; await p.locator(T2).scrollIntoViewIfNeeded();
const c0=await p.$$eval(T2+' tbody tr.c-row td.mat-column-name',a=>a.map(x=>x.textContent.trim()));
await p.locator(T2+' th.mat-column-name .c-header-title').click(); await W(150);
const c1=await p.$$eval(T2+' tbody tr.c-row td.mat-column-name',a=>a.map(x=>x.textContent.trim()));
ok(JSON.stringify(c1)===JSON.stringify(c0.slice().sort((a,b)=>a.localeCompare(b,'vi'))),'bảng client: sắp xếp Khách hàng tăng dần '+c1.join(','));
// sticky
const sticky=await p.evaluate(t=>{const tb=document.querySelector(t);const td=tb.querySelector('tbody td.mat-column-sdCommand');const th=tb.querySelector('th.mat-column-code');return [getComputedStyle(td).position,getComputedStyle(td).left,getComputedStyle(th).position,getComputedStyle(th).zIndex,tb.querySelector('td.mat-column-sdSelection').getBoundingClientRect().width];},T);
ok(sticky[0]==='sticky'&&sticky[1]==='42px'&&sticky[2]==='sticky'&&sticky[3]==='100'&&Math.round(sticky[4])===42,'cột dính: '+JSON.stringify(sticky));
// legacy menu (type:menu) — patterns/table.html
await p.goto(K+'patterns/table.html'); await W(1200);
await p.evaluate(()=>{window.__m=[];document.addEventListener('sd-table-menu-click',e=>window.__m.push(e.detail.itemId+':'+e.detail.row.code));});
const lt='#demo-table-sel';
ok(await p.locator(lt+' .c-table-menu-dropdown').count()===0,'cột type:menu: ô không chứa bảng chọn');
await p.locator(lt+' tbody tr.c-row').nth(1).locator('.c-table-menu-btn').click(); await W(150);
ok(!!(await pane()),'cột type:menu: bấm → menu overlay');
await p.locator('.sd-table-pane .c-table-menu-item:has-text("Phê duyệt")').click(); await W(150);
ok((await p.evaluate(()=>window.__m.join()))==='approve:DM-002' && !(await pane()),'cột type:menu: Phê duyệt → sd-table-menu-click approve:DM-002');
// paging
await p.goto(K+'components/table.html'); await W(1200);
const pg='#cat-tbl-full';
console.log(R.join('\n')); console.log('errs',errs); await b.close();
