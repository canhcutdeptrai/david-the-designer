/* Phép NGƯỢC: liệt kê attribute + slot mà KIT có nhưng API catalog không có. */
import { chromium } from 'playwright';
import fs from 'fs';
const KIT = process.env.SD_KIT || '/home/claude/kit/prototype-kit';
const apis = JSON.parse(fs.readFileSync(new URL('./catalog-api-19.0.10.json', import.meta.url), 'utf8'));
const byTag = {};
for (const sid in apis) for (const t of apis[sid].tags) byTag[t] = { sid, api: apis[sid].api };

const src = fs.readFileSync(KIT + '/design-system/sd-components/sd-components.js', 'utf8');
/* slot mà mỗi component ĐỌC: hasAttribute('sdxxx') trong thân class */
const classes = [...src.matchAll(/class (Sd[A-Za-z]+) extends HTMLElement \{([\s\S]*?)\n  \}\n/g)];
const defines = [...src.matchAll(/customElements\.define\('([a-z-]+)',\s*(Sd[A-Za-z]+)\)/g)];
const tagOf = {}; defines.forEach(m => tagOf[m[2]] = m[1]);

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage();
await p.goto('file://' + KIT + '/design-system/preview/components/button.html');
await p.waitForTimeout(600);
const observed = await p.evaluate(() => {
  const o = {};
  for (const t of Array.from(document.querySelectorAll('*')).map(e => e.tagName.toLowerCase())) {}
  return o;
});
/* lấy observedAttributes qua customElements.get */
const tags = defines.map(m => m[1]);
const obs = await p.evaluate(ts => {
  const o = {};
  ts.forEach(t => { const C = customElements.get(t); o[t] = C && C.observedAttributes ? C.observedAttributes.slice() : []; });
  return o;
}, tags);
await b.close();

/* Chuẩn hoá để so được hai lối viết:
   catalog dùng cú pháp Angular (`[items]`, `[(model)]`, `(sdClosed)`, `[sdFooterLeft]`),
   kit dùng attribute HTML thường. Và `value` của HTML chính là `[(model)]` của Angular. */
const ALIAS = { model: 'value', ngmodel: 'value' };
const norm = s => {
  let x = s.replace(/[\[\]()]/g, '').replace(/\(\)$/, '').toLowerCase();
  return ALIAS[x] || x;
};
/* Attribute chuẩn của HTML/form — catalog không liệt kê vì chúng không phải
   input của component, nhưng Web Component thì buộc phải nhận. Không tính là thừa. */
const HTML_STD = new Set(['name', 'value', 'checked', 'disabled', 'placeholder', 'required', 'src', 'type', 'size', 'mode']);
const rows = [];
for (const m of classes) {
  const cls = m[1], body = m[2], tag = tagOf[cls];
  if (!tag || !byTag[tag]) continue;
  const api = byTag[tag].api;
  const apiNorm = new Set(api.map(norm));
  const slots = [...new Set([...body.matchAll(/hasAttribute\('(sd[a-z]+)'\)/g)].map(x => x[1]))];
  const extraSlots = [...new Set(slots.map(norm).filter(s => !apiNorm.has(s)))];
  const attrs = (obs[tag] || []).filter(a => !/^autoid$|^autoId$/.test(a));
  const extraAttrs = [...new Set(attrs.map(norm).filter(a => !apiNorm.has(a) && !HTML_STD.has(a)))];
  if (extraSlots.length || extraAttrs.length)
    rows.push({ tag, sid: byTag[tag].sid, extraSlots, extraAttrs });
}
rows.sort((a, b) => (b.extraSlots.length + b.extraAttrs.length) - (a.extraSlots.length + a.extraAttrs.length));
console.log('=== KIT CÓ, CATALOG KHÔNG CÓ ===\n');
for (const r of rows) {
  console.log(r.tag.padEnd(22), '(' + r.sid + ')');
  if (r.extraSlots.length) console.log('   slot :', r.extraSlots.join(', '));
  if (r.extraAttrs.length) console.log('   attr :', r.extraAttrs.join(', '));
}
console.log('\ntổng', rows.length, 'component có phần thừa');
