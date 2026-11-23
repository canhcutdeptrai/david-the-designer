// node csdump.mjs <kitRoot> <out.json> [filter] — computed style của MỌI phần tử trên mọi trang
import { chromium } from 'playwright';
import { readdirSync, readFileSync, writeFileSync } from 'fs';
const [root, out] = process.argv.slice(2);
const FONTS = readFileSync('/home/claude/catalog/Core UI/css/fonts.css', 'utf8').replaceAll('../fonts', 'file:///home/claude/catalog/Core UI/fonts');
const list = d => readdirSync(root + d).filter(f => f.endsWith('.html')).map(f => d + f);
const FIL = process.argv[4] ? new RegExp(process.argv[4]) : null;
const pages = [...list('design-system/preview/components/'), ...list('design-system/preview/patterns/'), ...list('prototypes/cam-nang-phan-quyen/'), 'design-system/preview/index.html', 'prototypes/index.html'].filter(f => !FIL || FIL.test(f));
const P = ['display','position','margin-top','margin-right','margin-bottom','margin-left','padding-top','padding-right','padding-bottom','padding-left','row-gap','column-gap','color','background-color','font-family','font-size','font-weight','line-height','font-style','text-decoration-line','border-top-width','border-top-style','border-top-color','border-bottom-width','border-bottom-style','border-bottom-color','border-left-width','border-right-width','border-top-left-radius','box-shadow','width','height','overflow-x','overflow-y','vertical-align','cursor','list-style-type','white-space','text-align'];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => { Date.now = () => 1791849600000; Math.random = () => 0.42; });
const res = {};
for (const f of pages) {
  const p = await ctx.newPage(); await p.route(/^https?:/, r => r.abort());
  try {
    await p.goto('file://' + root + f, { timeout: 20000 }); await p.addStyleTag({ content: FONTS + '*{animation:none!important;transition:none!important}' }); await p.waitForTimeout(1300);
    res[f] = await p.evaluate((P) => { const o = []; for (const e of document.body.querySelectorAll('*')) { if (e.closest('script,style,svg,canvas')) continue; const c = getComputedStyle(e); let z = '', a = e.parentElement; while (a && a !== document.body) { const t = a.tagName.toLowerCase(); if (t.startsWith('sd-')) { z = t; break; } if (a.matches('.sidebar,.page-header,.page-tab-zone,[data-pattern]')) { z = '@' + (a.getAttribute('data-pattern') || a.className.split(' ')[0]); break; } a = a.parentElement; } o.push([e.tagName.toLowerCase() + (e.id ? '#' + e.id : ''), e.getAttribute('class') || '', P.map(k => c.getPropertyValue(k)), z]); } return o; }, P);
  } catch (e) { console.log('ERR', f, e.message.slice(0, 80)); }
  await p.close();
}
writeFileSync(out, JSON.stringify({ P, res })); console.log('done', Object.keys(res).length); await b.close();
