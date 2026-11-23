// node extract.mjs catalog|kit out.json  — trích mẫu component (cấu trúc + computed style) để đối chiếu kit ↔ catalog
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'fs';
const [mode, OUT] = process.argv.slice(2);
const FONTS = readFileSync('/home/claude/catalog/Core UI/css/fonts.css', 'utf8').replaceAll('../fonts', 'file:///home/claude/catalog/Core UI/fonts');
const K = '/home/claude/kit/prototype-kit-CATALOG-1012m/design-system/preview/components/';
const MAP = JSON.parse(readFileSync(new URL('./map.json', import.meta.url)));
const PROPS = ['display','position','box-sizing','height','padding-top','padding-right','padding-bottom','padding-left','margin-top','margin-right','margin-bottom','margin-left',
  'border-top-width','border-right-width','border-bottom-width','border-left-width','border-top-color','border-bottom-color','border-top-left-radius','border-bottom-right-radius',
  'font-family','font-size','font-weight','line-height','letter-spacing','color','background-color','opacity','box-shadow','gap','align-items','justify-content','flex-direction','text-align','visibility','white-space','text-transform','cursor'];
const NOCMP = 'script,style,template,svg *';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const out = {};
async function grab(page, rootSel, tags) {
  return page.evaluate(({ rootSel, tags, PROPS }) => {
    const roots = [...document.querySelectorAll(rootSel)];
    const res = {};
    for (const tag of tags) {
      const all = roots.flatMap(r => [...r.querySelectorAll(tag)]);
      const top = all.filter(e => !e.parentElement.closest(tag));
      res[tag] = top.slice(0, 40).map(el => {
        const nodes = [el, ...Element.prototype.querySelectorAll.call(el, '*')].filter(n => !n.closest('script,style,template') && !(n.ownerSVGElement)).slice(0, 400);
        const r0 = el.getBoundingClientRect();
        return {
          text: (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase().slice(0, 200),
          nodes: nodes.map(n => {
            const cs = getComputedStyle(n); const r = n.getBoundingClientRect();
            const attrs = [...n.attributes].filter(a => !/^(id|for|style|aria-controls|aria-labelledby|aria-describedby|aria-owns|aria-activedescendant|data-sd-[\w-]*|data-autoid|tabindex|_ngcontent[\w-]*|_nghost[\w-]*|ng-reflect[\w-]*|data-cat[\w-]*)$/.test(a.name) && a.name !== 'class').map(a => a.name + (/^(role|type|aria-[\w-]+|disabled|data-mat-icon-type)$/.test(a.name) ? '=' + a.value : '')).sort();
            return { t: n.tagName.toLowerCase(), c: [...n.classList].filter(x => !/^(ng-|cdk-(focused|mouse|keyboard|program)|mat-mdc-focus|_mat-animation)/.test(x)), a: attrs,
              d: n === el ? 0 : (() => { let k = 0, p = n; while (p && p !== el) { k++; p = p.parentElement; } return k; })(),
              w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10, x: Math.round((r.left - r0.left) * 10) / 10, y: Math.round((r.top - r0.top) * 10) / 10,
              s: PROPS.map(q => cs.getPropertyValue(q)) };
          })
        };
      });
    }
    return res;
  }, { rootSel, tags, PROPS });
}
if (mode === 'catalog') {
  const p = await ctx.newPage(); await p.route(/^https?:/, r => r.abort());
  await p.goto('file:///home/claude/catalog/Core UI/index.html', { timeout: 60000 }); await p.addStyleTag({ content: FONTS }); await p.waitForTimeout(2500);
  for (const [sid, m] of Object.entries(MAP)) out[sid] = await grab(p, `#${sid} .stage`, m.tags);
} else {
  const ONLY = (process.env.ONLY || '').split(',').filter(Boolean);
  for (const [sid, m] of Object.entries(MAP)) {
    if (!m.page) continue;
    if (ONLY.length && !ONLY.includes(sid)) continue;
    const p = await ctx.newPage(); await p.route(/^https?:/, r => r.abort());
    try { await p.goto('file://' + K + m.page, { timeout: 30000 }); await p.addStyleTag({ content: FONTS }); await p.waitForTimeout(1500);
      out[sid] = await grab(p, '.content-zone', m.tags); } catch (e) { out[sid] = { error: e.message.slice(0, 100) }; }
    await p.close();
  }
}
writeFileSync(OUT, JSON.stringify({ PROPS, data: out }));
console.log('done', mode, Object.keys(out).length);
await b.close();
