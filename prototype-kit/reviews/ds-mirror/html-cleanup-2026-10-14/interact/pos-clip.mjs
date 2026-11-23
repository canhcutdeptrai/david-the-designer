import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.route(/^https?:/, r => r.abort());
await p.goto('file:///home/claude/kit/prototype-kit-CATALOG-1012m/prototypes/cam-nang-phan-quyen/' + (process.argv[2]||'tao-position.html')); await p.waitForTimeout(1000);
console.log(await p.evaluate(() => { let e = document.querySelector('#holder-table sd-date'); const out = [];
  while (e && e !== document.body) { const cs = getComputedStyle(e); if (cs.overflow !== 'visible' || cs.overflowX !== 'visible' || cs.overflowY !== 'visible' || cs.clipPath !== 'none' || cs.contain !== 'none') out.push(e.tagName + '.' + e.className + ' ov=' + cs.overflowX + '/' + cs.overflowY + ' clip=' + cs.clipPath + ' contain=' + cs.contain); e = e.parentElement; } return out; }));
await b.close();
