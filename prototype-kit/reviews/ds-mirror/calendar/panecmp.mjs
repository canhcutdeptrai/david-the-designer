// So DOM + computed style của popup đang mở: catalog (.stage .cdk-overlay-pane) ↔ kit (body > .cdk-overlay-container > .cdk-overlay-pane)
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'fs';
const FONTS = readFileSync('/home/claude/catalog/Core UI/css/fonts.css', 'utf8').replaceAll('../fonts', 'file:///home/claude/catalog/Core UI/fonts');
const PROPS = ['display','position','box-sizing','padding-top','padding-right','padding-bottom','padding-left','margin-top','margin-right','margin-bottom','margin-left','border-top-width','border-bottom-width','border-top-color','border-top-left-radius','border-bottom-right-radius','font-family','font-size','font-weight','line-height','letter-spacing','color','background-color','opacity','box-shadow','gap','align-items','justify-content','flex-direction','text-align','visibility','white-space','text-transform','vertical-align'];
const FREEZE = () => { const T = new Date(2026, 9, 8, 10, 0, 0).getTime(); const D = Date; class FD extends D { constructor(...a) { if (!a.length) super(T); else super(...a); } static now() { return T; } } window.Date = FD; };
const grab = (root, PROPS) => {
  const A = root.getBoundingClientRect();
  return [root, ...root.querySelectorAll('*')].filter(n => !n.ownerSVGElement || n.tagName === 'svg').map(n => {
    const cs = getComputedStyle(n), r = n.getBoundingClientRect();
    const at = [...n.attributes].filter(a => !/^(class|style|id|for|aria-describedby|aria-labelledby|_ng.*|data-(y|m|sel|today|a11y|range|dclass|offset)|data-sd-.*)$/.test(a.name)).map(a => a.name + '=' + a.value).sort();
    return { t: n.tagName.toLowerCase(), c: [...n.classList].filter(c => !/^(fx-pane|sd-float-pane|sd-[\w-]+-pane|sd-float-above)$/.test(c)).sort(), a: at, w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10, x: Math.round((r.left - A.left) * 10) / 10, y: Math.round((r.top - A.top) * 10) / 10, s: PROPS.map(p => cs.getPropertyValue(p)) };
  });
};
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } }); await ctx.addInitScript(FREEZE);
const out = { PROPS, cat: {}, kit: {} };
let p = await ctx.newPage(); await p.route(/^https?:/, r => r.abort());
await p.goto('file:///home/claude/catalog/Core UI/index.html', { timeout: 60000 }); await p.addStyleTag({ content: FONTS }); await p.waitForTimeout(2500);
for (const sid of ['c-date', 'c-date-range', 'c-datetime', 'c-chip-calendar']) out.cat[sid] = await p.evaluate(({ sid, PROPS, g }) => { const pn = document.querySelector('#' + sid + ' .stage .cdk-overlay-pane'); return pn ? (new Function('return ' + g)())(pn, PROPS) : null; }, { sid, PROPS, g: grab.toString() });
await p.close();
const K = 'file:///home/claude/kit/prototype-kit-CATALOG-1012m/design-system/preview/components/';
const OPEN = {
  'c-date': ['date.html', `const h=[...document.querySelectorAll('sd-date')].find(e=>e.getAttribute('value')==='2026/10/15'&&!e.hasAttribute('viewed')); h.open();`],
  'c-date-range': ['date-range.html', `const h=[...document.querySelectorAll('sd-date-range')].find(e=>e.getAttribute('from')==='2026/10/05'&&e.getAttribute('to')==='2026/10/20'&&!e.hasAttribute('viewed')); h._open();`],
  'c-datetime': ['datetime.html', `const h=[...document.querySelectorAll('sd-datetime')].find(e=>/^2026\\/10\\/15 14:30/.test(e.getAttribute('value')||'')&&!e.hasAttribute('viewed')); h.open();`],
  'c-chip-calendar': ['chip-calendar.html', `const h=[...document.querySelectorAll('sd-chip-calendar')].find(e=>(e.getAttribute('value')||'')==='2026/10/05,2026/10/12,2026/10/19'&&!e.hasAttribute('viewed')&&!e.hasAttribute('disabled')); h._openPopup();`]
};
for (const [sid, [pg, js]] of Object.entries(OPEN)) {
  p = await ctx.newPage(); await p.route(/^https?:/, r => r.abort());
  await p.goto(K + pg); await p.addStyleTag({ content: FONTS }); await p.waitForTimeout(1000);
  await p.evaluate(() => { document.querySelectorAll('body > .cdk-overlay-container > .cdk-overlay-pane').forEach(x => x.remove()); });
  try { await p.evaluate(js); } catch (e) { out.kit[sid] = 'ERR ' + e.message; await p.close(); continue; }
  await p.waitForTimeout(300);
  out.kit[sid] = await p.evaluate(({ PROPS, g }) => { const pn = document.querySelector('body > .cdk-overlay-container > .cdk-overlay-pane'); return pn ? (new Function('return ' + g)())(pn, PROPS) : null; }, { PROPS, g: grab.toString() });
  await p.close();
}
writeFileSync('/home/claude/work/cal/panes.json', JSON.stringify(out));
console.log('done'); await b.close();
