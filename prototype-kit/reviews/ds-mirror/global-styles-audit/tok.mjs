import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
const names = ['primary','primary-light','primary-dark','info','info-light','info-dark','success','success-light','success-dark','warning','warning-light','warning-dark','error','error-light','error-dark','secondary','secondary-light','secondary-dark','light','dark','black500','black400','black300','black200','black100'];
async function get(f) { const p = await b.newPage(); await p.goto('file:///tmp/claude-0/sasswork/' + f); return p.evaluate(n => { const s = getComputedStyle(document.documentElement); return n.map(k => s.getPropertyValue('--sd-' + k).trim().toLowerCase()); }, names); }
const R = await get('ref.html'), K = await get('kit.html');
names.forEach((n, i) => { if (R[i] !== K[i]) console.log('≠ --sd-' + n, R[i], K[i]); });
console.log('checked', names.length);
await b.close();
