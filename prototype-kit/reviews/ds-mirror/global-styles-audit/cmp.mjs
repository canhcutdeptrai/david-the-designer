import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
const P = ['margin-top','margin-right','margin-bottom','margin-left','padding-top','padding-right','padding-bottom','padding-left','row-gap','column-gap',
 'border-top-left-radius','border-top-right-radius','border-bottom-left-radius','border-bottom-right-radius','border-top-width','border-top-style','border-top-color','border-right-width','border-right-style','border-bottom-width','border-bottom-style','border-left-width','border-left-style','border-left-color',
 'background-color','color','font-size','font-weight','line-height','box-shadow','display','flex-direction','flex-wrap','justify-content','align-items','align-self','align-content','flex-grow','flex-shrink','flex-basis','order',
 'width','height','min-width','min-height','max-width','max-height','overflow-x','overflow-y','position','top','left','right','bottom','text-align','white-space','text-overflow','word-break','overflow-wrap','text-transform','cursor','opacity','visibility','z-index','float','vertical-align','user-select','pointer-events','object-fit','grid-template-columns','grid-column-start','grid-column-end','text-decoration-line','font-style','letter-spacing','flex','inset'];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
async function run(f) {
  const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
  await p.goto('file:///tmp/claude-0/sasswork/' + f); await p.waitForTimeout(300);
  return await p.evaluate((P) => {
    const box = document.getElementById('box'); const base = document.createElement('div'); box.appendChild(base);
    const bs = getComputedStyle(base); const B = {}; P.forEach(k => B[k] = bs.getPropertyValue(k));
    const out = { __base: B };
    for (const c of Object.keys(window.__CLS)) { const d = document.createElement('div'); d.className = c; box.appendChild(d); const s = getComputedStyle(d); const o = {}; P.forEach(k => o[k] = s.getPropertyValue(k)); out[c] = o; d.remove(); }
    return out;
  }, P);
}
const R = await run('ref.html'), K = await run('kit.html');
const res = {};
for (const c of Object.keys(R)) { if (c === '__base') continue;
  const changed = P.filter(k => R[c][k] !== R.__base[k]);   // thuộc tính lớp sd-core thật sự đổi
  const kitChanged = P.filter(k => K[c][k] !== K.__base[k]);
  const diff = changed.filter(k => R[c][k] !== K[c][k]).map(k => k + ': ' + R[c][k] + ' ≠ ' + K[c][k]);
  const extra = kitChanged.filter(k => !changed.includes(k) && K[c][k] !== R.__base[k]).map(k => '+' + k + ': ' + K[c][k]);
  const missing = changed.length && changed.every(k => K[c][k] === K.__base[k]);
  res[c] = { missing, diff, extra };
}
writeFileSync('/tmp/claude-0/sasswork/res.json', JSON.stringify(res));
const miss = Object.keys(res).filter(c => res[c].missing), bad = Object.keys(res).filter(c => !res[c].missing && (res[c].diff.length || res[c].extra.length));
console.log('classes', Object.keys(res).length, 'missing', miss.length, 'mismatch', bad.length, 'ok', Object.keys(res).length - miss.length - bad.length);
console.log('BASE diff:', Object.keys(R.__base).filter(k => R.__base[k] !== K.__base[k]).map(k => k + ' ' + R.__base[k] + ' ≠ ' + K.__base[k]).join(' | '));
await b.close();
