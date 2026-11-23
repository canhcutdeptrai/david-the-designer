import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--allow-file-access-from-files']});
const p=await b.newPage(); await p.route(/^https?:/,r=>r.abort());
await p.goto('file:///home/claude/catalog/Core UI/index.html',{timeout:60000}); await p.waitForTimeout(2500);
const r=await p.evaluate(()=>{const o={};for(const id of ['c-date','c-date-range','c-datetime','c-chip-calendar','c-autocomplete','c-select']){o[id]=[...document.querySelectorAll('#'+id+' .stage .cdk-overlay-pane')].map(x=>x.outerHTML);}return o;});
writeFileSync('/home/claude/work/cal/catpanes.json',JSON.stringify(r,null,1));
for(const [k,v] of Object.entries(r)) console.log(k,v.length,v.map(x=>x.length));
await b.close();
