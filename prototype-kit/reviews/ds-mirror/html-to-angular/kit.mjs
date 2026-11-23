import { chromium } from 'playwright';
import fs from 'fs';
// node kit.mjs <thư mục kit> [file json ra]  — cần Playwright + Chromium
import path from 'path';
const KIT = path.resolve(process.argv[2] || '.');
const OUTF = process.argv[3] || path.join(path.dirname(new URL(import.meta.url).pathname), 'kit-api.json');
const src = fs.readFileSync(KIT + '/design-system/sd-components/sd-components.js', 'utf8');
const defines = [...src.matchAll(/customElements\.define\('([a-z0-9-]+)',\s*(\w+)\)/g)].map(m => ({ tag: m[1], cls: m[2] }));
// thân class: từ "class X extends" tới class kế tiếp
const starts = [...src.matchAll(/\n  class (\w+) extends HTMLElement/g)].map(m => ({ cls: m[1], i: m.index }));
const body = {}; starts.forEach((s, k) => body[s.cls] = src.slice(s.i, k + 1 < starts.length ? starts[k + 1].i : src.length));
const exe = process.env.CHROME_PATH; const b = await chromium.launch({ ...(exe ? { executablePath: exe } : {}), args: ['--allow-file-access-from-files'] });
const p = await b.newPage(); await p.route(/^https?:/, r => r.abort());
await p.goto('file://' + KIT + '/design-system/preview/components/button.html'); await p.waitForTimeout(500);
const obs = await p.evaluate(ts => { const o = {}; ts.forEach(t => { const C = customElements.get(t); o[t] = C && C.observedAttributes ? [...C.observedAttributes] : []; }); return o; }, defines.map(d => d.tag));
await b.close();
const res = {};
for (const d of defines) {
  const txt = body[d.cls] || '';
  const ev = [...new Set([...txt.matchAll(/new CustomEvent\('([\w-]+)'/g)].map(m => m[1]))];
  const getAttr = [...new Set([...txt.matchAll(/(?:getAttribute|hasAttribute|_attr|_bool|_boolAttr|_cfgVal)\('([\w-]+)'/g)].map(m => m[1]))];
  res[d.tag] = { cls: d.cls, observed: obs[d.tag] || [], read: getAttr, events: ev };
}
fs.writeFileSync(OUTF, JSON.stringify(res, null, 1));
console.log(Object.keys(res).length, 'kit tags');
