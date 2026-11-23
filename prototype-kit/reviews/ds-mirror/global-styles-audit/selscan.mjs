import {chromium} from 'playwright';
import {readdirSync} from 'fs';
const root=process.argv[2];
const list=d=>readdirSync(root+d).filter(f=>f.endsWith('.html')).map(f=>d+f);
const pages=[...list('design-system/preview/components/'),...list('design-system/preview/patterns/'),...list('prototypes/cam-nang-phan-quyen/')];
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--allow-file-access-from-files']});
const ctx=await b.newContext({viewport:{width:1440,height:900}});
let tot=0,bad=[];const errs=[];
for(const f of pages){const p=await ctx.newPage();await p.route(/^https?:/,r=>r.abort());p.on('pageerror',e=>errs.push(f+': '+e.message));
 try{await p.goto('file://'+root+f,{timeout:15000});await p.waitForTimeout(900);
 const n=await p.evaluate(()=>{const s=[...document.querySelectorAll('sd-select')].filter(x=>!x.hasAttribute('disabled')&&x.offsetParent&&(x.querySelector('mat-form-field')||x.querySelector('.sd-inline-view'))&&!x.closest('[hidden]'));s.forEach((x,i)=>x.setAttribute('data-ss',i));return s.length;});
 for(let i=0;i<Math.min(n,6);i++){
  const el=await p.$(`[data-ss="${i}"]`);await el.scrollIntoViewIfNeeded().catch(()=>{});
  const t=await el.$('mat-form-field, .sd-inline-view');const bx=t&&await t.boundingBox();if(!bx)continue;
  await p.mouse.click(bx.x+Math.min(30,bx.width/2),bx.y+bx.height/2);await p.waitForTimeout(200);
  const r=await p.evaluate(i=>{const h=document.querySelector(`[data-ss="${i}"]`);if(!h.classList.contains('sd-open'))return 'notopen';const m=h._pane&&h._pane.querySelector('.sd-dropdown-menu');if(!m)return 'nopane';const r=m.getBoundingClientRect();if(!r.height)return 'zero';
   const pts=[[r.left+6,r.top+6],[r.right-6,r.top+6],[r.left+6,r.bottom-6],[r.right-6,r.bottom-6],[(r.left+r.right)/2,(r.top+r.bottom)/2]];
   const ok=pts.filter(([x,y])=>{if(x<0||y<0||x>innerWidth||y>innerHeight)return false;const e=document.elementFromPoint(x,y);return e&&h._pane.contains(e);}).length;
   return ok===5?'ok':'hidden'+ok+' '+[r.left,r.top,r.width,r.height].map(Math.round);},i);
  tot++;if(r!=='ok')bad.push(f.split('/').pop()+'#'+i+' '+r);
  await p.keyboard.press('Escape');await p.mouse.click(5,895);await p.waitForTimeout(80);
 }}catch(e){bad.push(f+' ERR '+e.message.slice(0,60));}
 await p.close();}
console.log('opened',tot);console.log(bad.join('\n'));console.log('JSERR',errs.slice(0,10).join('\n')||'none');await b.close();
