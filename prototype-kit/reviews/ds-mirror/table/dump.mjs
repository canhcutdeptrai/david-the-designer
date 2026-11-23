// node dump.mjs cat|kit idx out.txt — cây DOM đầy đủ của sd-table thứ idx
import { chromium } from 'playwright'; import fs from 'fs';
const [who, idx, out] = process.argv.slice(2);
const url = who === 'cat' ? 'file:///home/claude/catalog/Core%20UI/index.html' : 'file:///home/claude/kit/prototype-kit-CATALOG-1012m/design-system/preview/components/table.html';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => { const D = Date; Date.now = () => 1791849600000; });
const p = await ctx.newPage(); await p.route(/^https?:/, r => r.abort());
await p.goto(url); await p.waitForTimeout(1500);
const txt = await p.evaluate(([who, i]) => {
  const root = who === 'cat' ? document.querySelector('#c-table') : document;
  const t = [...root.querySelectorAll('sd-table')][i];
  const out = [];
  const walk = (e, d) => {
    const kids = [...e.childNodes];
    for (const c of kids) {
      if (c.nodeType === 3) { const s = c.textContent.trim(); if (s) out.push('  '.repeat(d) + '"' + s.slice(0, 40) + '"'); continue; }
      if (c.nodeType !== 1) continue;
      const cls = [...c.classList].join(' ');
      const at = [...c.attributes].filter(a => !['class', 'id', 'aria-describedby', 'aria-labelledby', 'for', 'name', 'd', 'points'].includes(a.name) && !a.name.startsWith('_ng') && !a.name.startsWith('data-sd') ).map(a => a.name + (a.value ? '=' + a.value.slice(0, 60) : '')).join(' ');
      out.push('  '.repeat(d) + c.tagName.toLowerCase() + (cls ? '.' + cls.replace(/ /g, '.') : '') + (at ? ' [' + at + ']' : ''));
      if (c.tagName === 'svg') continue;
      walk(c, d + 1);
    }
  };
  walk(t, 0); return out.join('\n');
}, [who, +idx]);
fs.writeFileSync(out, txt); await b.close();
