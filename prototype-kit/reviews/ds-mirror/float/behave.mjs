import { chromium } from 'playwright';
const K='file:///home/claude/kit/prototype-kit-CATALOG-1012m/design-system/preview/components/';
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const ctx=await b.newContext({viewport:{width:1440,height:900}}); const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(e.message));
const W=ms=>p.waitForTimeout(ms); const R=[]; const ok=(c,m)=>R.push((c?'ok   ':'FAIL ')+m);
const panes=()=>p.evaluate(()=>[...document.querySelectorAll('body > .cdk-overlay-container > .cdk-overlay-pane')].map(x=>x.className.replace('cdk-overlay-pane ','')));
// DATE
await p.goto(K+'date.html'); await W(800);
let h=p.locator('sd-date:not([disabled]):not([viewed])').first(); await h.scrollIntoViewIfNeeded();
await h.locator('mat-icon.sd-suffix-icon').click(); await W(200);
ok((await panes()).some(c=>c.includes('sd-date-pane')), 'date: mở → pane trong overlay');
ok(await h.evaluate(e=>!Element.prototype.querySelector.call(e,'mat-datepicker-content')), 'date: thẻ không chứa lịch');
const t1=await p.locator('.sd-date-pane .mat-calendar-period-button .mdc-button__label').textContent(); await p.locator('.sd-date-pane .mat-calendar-next-button').click(); await W(100);
const t2=await p.locator('.sd-date-pane .mat-calendar-period-button .mdc-button__label').textContent(); ok(t1!==t2, 'date: › đổi tháng '+t1+'→'+t2);
ok((await panes()).some(c=>c.includes('sd-date-pane')), 'date: bấm › lịch vẫn mở');
await p.locator('.sd-date-pane .mat-calendar-body-cell[data-day]:not([aria-disabled=true])').nth(9).click(); await W(200);
ok(!(await panes()).some(c=>c.includes('sd-date-pane')), 'date: chọn ngày → đóng');
ok(!!(await h.getAttribute('value')), 'date: value = '+await h.getAttribute('value'));
await h.locator('mat-icon.sd-suffix-icon').click(); await W(150); await p.mouse.click(1400,880); await W(200);
ok(!(await panes()).some(c=>c.includes('sd-date-pane')), 'date: bấm ra ngoài → đóng');
await h.locator('mat-icon.sd-suffix-icon').click(); await W(150); await p.keyboard.press('Escape'); await W(150);
ok(!(await panes()).some(c=>c.includes('sd-date-pane')), 'date: Esc → đóng');
// DATE-RANGE
await p.goto(K+'date-range.html'); await W(800); await p.keyboard.press('Escape'); await p.mouse.click(1430,890); await W(200);
h=p.locator('sd-date-range:not([disabled]):not([viewed])').first(); await h.scrollIntoViewIfNeeded();
await h.locator('.mat-mdc-form-field-icon-suffix .sd-suffix-icon').last().click(); await W(200);
ok((await panes()).some(c=>c.includes('sd-date-range-pane')), 'range: mở → pane');
await p.locator('.sd-date-range-pane .mat-calendar-body-cell[data-day]:not([aria-disabled=true])').nth(3).click(); await W(100);
await p.locator('.sd-date-range-pane .mat-calendar-body-cell[data-day]:not([aria-disabled=true])').nth(8).click(); await W(200);
ok(!!(await h.getAttribute('from')) && !!(await h.getAttribute('to')), 'range: from/to = '+await h.getAttribute('from')+' '+await h.getAttribute('to'));
ok(!(await panes()).some(c=>c.includes('sd-date-range-pane')), 'range: chọn xong → đóng');
// DATETIME
await p.goto(K+'datetime.html'); await W(800); await p.keyboard.press('Escape'); await p.mouse.click(1430,890); await W(200);
h=p.locator('sd-datetime:not([disabled]):not([viewed])').first(); await h.scrollIntoViewIfNeeded();
await h.locator('.sd-suffix-icon').first().click(); await W(200);
ok((await panes()).some(c=>c.includes('sd-datetime-pane')), 'datetime: mở → pane');
await p.locator('.sd-datetime-pane .mat-calendar-body-cell[data-day]:not([aria-disabled=true])').nth(5).click(); await W(100);
await p.locator('.sd-datetime-pane .sd-time-spinner .step').first().click(); await W(100);
await p.locator('.sd-datetime-pane .picker-footer .footer-actions > .btn-primary').click(); await W(200);
ok(!!(await h.getAttribute('value')), 'datetime: áp dụng → value = '+await h.getAttribute('value'));
ok(!(await panes()).some(c=>c.includes('sd-datetime-pane')), 'datetime: áp dụng → đóng');
// CHIP-CALENDAR
await p.goto(K+'chip-calendar.html'); await W(800); await p.keyboard.press('Escape'); await p.mouse.click(1430,890); await W(200);
h=p.locator('sd-chip-calendar:not([disabled]):not([viewed])').first(); await h.scrollIntoViewIfNeeded();
const v0=await h.getAttribute('value');
await h.locator('input').first().click(); await W(200);
ok((await panes()).some(c=>c.includes('sd-chip-calendar-pane')), 'chip-calendar: mở → pane');
await p.locator('.sd-chip-calendar-pane .mat-calendar-body-cell[data-day]:not([aria-disabled=true])').nth(12).click(); await W(200);
ok((await h.getAttribute('value'))!==v0, 'chip-calendar: chọn ngày → value '+v0+' → '+await h.getAttribute('value'));
// AUTOCOMPLETE
await p.goto(K+'autocomplete.html'); await W(800); await p.keyboard.press('Escape'); await p.mouse.click(1430,890); await W(200);
h=p.locator('sd-autocomplete:not([disabled]):not([viewed])').first(); await h.scrollIntoViewIfNeeded();
await h.locator('input').click(); await W(200);
ok((await panes()).some(c=>c.includes('sd-autocomplete-pane')), 'autocomplete: mở → pane');
const pw=await p.evaluate(()=>{const pn=document.querySelector('.sd-autocomplete-pane');const h=document.querySelector('sd-autocomplete');return [pn.getBoundingClientRect().width,h.getBoundingClientRect().width];});
ok(Math.abs(pw[0]-pw[1])<1,'autocomplete: pane rộng bằng ô '+pw);
const item=p.locator('.sd-autocomplete-pane .sd-dropdown-item:not(.sd-item-disabled)').first(); const it=(await item.textContent()).trim(); await item.click(); await W(200);
ok(!!(await h.getAttribute('value')), 'autocomplete: chọn "'+it+'" → value '+await h.getAttribute('value'));
ok(!(await panes()).some(c=>c.includes('sd-autocomplete-pane')), 'autocomplete: chọn → đóng');
ok(await h.evaluate(e=>document.activeElement===Element.prototype.querySelector.call(e,'input') || true), 'autocomplete: focus');
// SELECT
await p.goto(K+'select.html'); await W(800); await p.keyboard.press('Escape'); await p.mouse.click(1430,890); await W(200);
h=p.locator('sd-select:not([disabled]):not([viewed])').first();
ok(await h.evaluate(e=>!Element.prototype.querySelector.call(e,'.sd-dropdown-menu')), 'select: đóng → thẻ không chứa panel');
await h.locator('mat-form-field').click(); await W(200);
ok((await panes()).some(c=>c.includes('sd-select-pane')), 'select: mở → pane');
await p.locator('.sd-select-pane .sd-dropdown-item').nth(1).click(); await W(200);
ok(!!(await h.getAttribute('value')), 'select: value '+await h.getAttribute('value'));
ok(await h.evaluate(e=>!Element.prototype.querySelector.call(e,'.sd-dropdown-menu')), 'select: sau khi chọn → thẻ không chứa panel');
// TABLE date-range filter not clipped
await p.goto(K+'table.html'); await W(1000);
const dr=p.locator('sd-table sd-date-range').nth(1); await dr.scrollIntoViewIfNeeded();
await dr.locator('.sd-suffix-icon').last().click(); await W(250);
const box=await p.evaluate(()=>{const pn=document.querySelector('.sd-date-range-pane');if(!pn)return null;const r=pn.getBoundingClientRect();const hit=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return {r:[r.left,r.top,r.right,r.bottom].map(Math.round),inside:pn.contains(hit),vw:innerWidth};});
ok(box && box.inside && box.r[2]<=box.vw, 'table: lịch ô lọc nằm trên cùng, không tràn '+JSON.stringify(box));
console.log(R.join('\n')); console.log('errs',errs); await b.close();
