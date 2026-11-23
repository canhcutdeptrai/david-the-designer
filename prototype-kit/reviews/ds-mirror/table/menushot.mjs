import { chromium } from 'playwright';
const [root,out,sel]=process.argv.slice(2);
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('file://'+root+'design-system/preview/components/table.html'); await p.waitForTimeout(1200);
const btn=p.locator('#cat-tbl-full tbody tr.c-row').nth(1).locator(sel); await btn.scrollIntoViewIfNeeded(); await btn.click(); await p.waitForTimeout(300);
const r=await btn.boundingBox();
await p.screenshot({path:out,clip:{x:Math.max(0,r.x-300),y:Math.max(0,r.y-120),width:620,height:300}});
await b.close();
