import { chromium } from 'playwright';
const P = ['font-family','font-size','font-weight','line-height','color','background-color','margin-top','margin-bottom','margin-left','padding-top','padding-left','border-top-width','border-top-style','border-top-color','text-decoration-line','text-align','border-collapse','vertical-align','display','box-sizing','letter-spacing','cursor','border-top-left-radius','list-style-type'];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
async function get(f) { const p = await b.newPage(); await p.route(/^https?:/, r => r.abort()); await p.goto('file:///tmp/claude-0/sasswork/' + f); await p.waitForTimeout(300);
  return p.evaluate(P => { const out = {}; const L = [document.documentElement, document.body, ...document.querySelectorAll('#els *')];
    L.forEach((e, i) => { const s = getComputedStyle(e); out[(e.tagName.toLowerCase()) + '#' + i] = P.map(k => k + '=' + s.getPropertyValue(k)); }); return out; }, P); }
const R = await get('ref2.html'), K = await get('kit2.html');
for (const k of Object.keys(R)) { const d = R[k].filter((v, i) => v !== K[k][i]).map((v, i) => v + '  →kit ' + K[k][R[k].indexOf(v)].split('=')[1]); if (d.length) console.log(k.padEnd(12), d.join(' | ')); }
await b.close();
