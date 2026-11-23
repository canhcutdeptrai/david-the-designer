import { chromium } from 'playwright';
import { readFileSync } from 'fs';
const FONTS = readFileSync('/home/claude/catalog/Core UI/css/fonts.css', 'utf8').replaceAll('../fonts', 'file:///home/claude/catalog/Core UI/fonts');
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--allow-file-access-from-files']});
const PROPS=['display','position','width','height','padding','margin','font-family','font-size','font-weight','line-height','letter-spacing','color','background-color','border-top','border-bottom','border-radius','opacity','box-shadow','gap','justify-content','align-items','flex-grow','visibility','transform','z-index','overflow'];
const grab = (sel, idx) => ({sel, idx, PROPS});
async function dump(url, rootSel, n) {
  const p = await b.newPage({viewport:{width:1440,height:900}}); await p.route(/^https?:/, r=>r.abort());
  await p.goto(url); await p.addStyleTag({content:FONTS}); await p.waitForTimeout(1500);
  const r = await p.evaluate(({rootSel,n,PROPS})=>{
    const gs=[...document.querySelectorAll(rootSel)].slice(0,n);
    return gs.map(g=>{
      const mtg=g.querySelector('mat-tab-group'); const hdr=g.querySelector('mat-tab-header'); const gb=hdr.getBoundingClientRect();
      const els=[g, mtg, ...hdr.querySelectorAll('*')];
      const norm=h=>h.replace(/ id="[^"]*"| aria-controls="[^"]*"| aria-labelledby="[^"]*"/g,'').replace(/\s+/g,' ');
      return { html: norm(hdr.outerHTML), mtgCls: mtg.className+' |'+mtg.getAttribute('mat-align-tabs')+'|'+mtg.getAttribute('style'), hostCls: g.className, hostStyle: g.getAttribute('style'),
        bodies: [...g.querySelectorAll('mat-tab-body')].map(x=>x.className+'|'+x.getAttribute('aria-hidden')+'|'+x.hasAttribute('inert')+'|'+x.firstElementChild.className+'|'+(x.firstElementChild.getAttribute('style')||'')),
        els: els.map(e=>{const cs=getComputedStyle(e); const bb=e.getBoundingClientRect(); return {k:e.tagName.toLowerCase()+'.'+[...e.classList].join('.'), box:[bb.x-gb.x,bb.y-gb.y,bb.width,bb.height].map(v=>Math.round(v*10)/10), s:Object.fromEntries(PROPS.map(q=>[q,cs.getPropertyValue(q)]))}})};
    });
  },{rootSel,n,PROPS});
  await p.close(); return r;
}
const cat = await dump('file:///home/claude/catalog/Core UI/index.html', '#c-tab sd-tab-group', 5);
const kit = await dump('file:///home/claude/kit/prototype-kit-CATALOG-1012m/design-system/preview/components/tab-group.html', '.content-zone sd-tab-group', 5);
for (let i=0;i<5;i++){
  const c=cat[i], k=kit[i];
  console.log(`## variant ${i}: html ${c.html===k.html?'SAME':'DIFF'} · mtg ${c.mtgCls===k.mtgCls?'same':'DIFF '+c.mtgCls+' VS '+k.mtgCls} · host ${c.hostCls===k.hostCls?'same':'DIFF'} · style ${c.hostStyle===k.hostStyle?'same':'DIFF\n   '+c.hostStyle+'\n   '+k.hostStyle}`);
  if (c.html!==k.html){ let j=0; while(c.html[j]===k.html[j]) j++; console.log('   cat:',c.html.slice(Math.max(0,j-120),j+200)); console.log('   kit:',k.html.slice(Math.max(0,j-120),j+200)); }
  console.log('   bodies cat',JSON.stringify(c.bodies)); console.log('   bodies kit',JSON.stringify(k.bodies));
  let nd=0;
  c.els.forEach((ce,j)=>{ const ke=k.els[j]; if(!ke){console.log('   missing',ce.k);return;}
    const diffs=PROPS.filter(q=>ce.s[q]!==ke.s[q]&&!(q==='width'&&j<3)).map(q=>q+': '+ce.s[q]+' → '+ke.s[q]);
    const bd=j>=2 && ce.box.some((v,x)=>Math.abs(v-ke.box[x])>0.6);
    if(diffs.length||bd||ce.k!==ke.k){ nd++; if(nd<=14) console.log('   ',ce.k===ke.k?ce.k:ce.k+' ≠ '+ke.k, bd?'box '+ce.box+' → '+ke.box:'', diffs.join(' ; ')); }
  });
  console.log('   nodes with diffs:',nd,'/',c.els.length);
}
await b.close();
