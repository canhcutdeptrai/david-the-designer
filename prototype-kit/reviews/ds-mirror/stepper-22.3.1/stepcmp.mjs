// node stepcmp.mjs [idx] [full] — so sd-stepper của trang tài liệu 22.3.1 (harness Angular) với kit
import {chromium} from 'playwright';
const ONLY=process.argv[2]!==undefined&&process.argv[2]!=='all'?+process.argv[2]:null, FULL=process.argv[3]==='full';
const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--allow-file-access-from-files']});
const P=['display','visibility','position','color','background-color','font-family','font-size','font-weight','line-height','letter-spacing','border-top-width','border-top-style','border-top-color','border-left-width','border-left-color','border-top-left-radius','padding-top','padding-right','padding-bottom','padding-left','margin-top','margin-right','margin-bottom','margin-left','text-align','white-space','overflow-x','transform','grid-template-rows','opacity'];
const KITPAL='html{--sd-primary:#ae7129;--sd-primary-light:#f5eee6;--sd-primary-dark:#834111;--sd-info:#1890ff;--sd-info-light:#e6f7ff;--sd-info-dark:#0050b3;--sd-success:#4caf50;--sd-success-light:#dbefdc;--sd-success-dark:#39833c;--sd-warning:#ff9600;--sd-warning-light:#ffeacc;--sd-warning-dark:#bf7000;--sd-error:#f82c13;--sd-error-light:#fed5d0;--sd-error-dark:#ba200e;--sd-secondary:#212121;--sd-secondary-light:#f2f3f4;--sd-secondary-dark:#757575}';
async function dump(url,setup){
  const p=await b.newPage({viewport:{width:1280,height:900}});
  await p.route(/^https?:\/\/(?!127\.0\.0\.1)/,r=>r.abort());
  await p.goto(url);if(url.startsWith('http'))await p.addStyleTag({content:KITPAL});else await p.addStyleTag({content:'body{color:#1a1b1f}'});await p.waitForTimeout(2200);
  if(setup)await setup(p);
  const r=await p.evaluate(([P,ONLY])=>{
    const all=[...document.querySelectorAll('section.ex sd-stepper')];
    return all.map((s,si)=>{ if(ONLY!==null&&si!==ONLY)return null;
      const H=s.getBoundingClientRect();const o=[];
      const walk=(e,d)=>{for(const c of e.children){
        if(c.tagName==='SD-STEP')continue;
        const cl=String(c.getAttribute('class')||'').split(/\s+/).filter(x=>x&&!/^ng-|^cdk-(focused|mouse|keyboard|program)/.test(x)).join('.');
        const r=c.getBoundingClientRect();const cs=getComputedStyle(c);
        const at=['role','tabindex','aria-selected','aria-disabled','aria-expanded','aria-current','aria-posinset','aria-setsize','inert','aria-orientation'].filter(a=>c.hasAttribute(a)).map(a=>a+'='+c.getAttribute(a)).join(' ');
        const own=[...c.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('').trim();
        o.push({k:c.tagName.toLowerCase()+(cl?'.'+cl:''),d,at,txt:own,geo:[r.left-H.left,r.top-H.top,r.width,r.height].map(v=>Math.round(v*10)/10).join(','),cs:P.map(k=>cs.getPropertyValue(k)).join('|')});
        const inContent=c.classList.contains('mat-horizontal-stepper-content')||c.classList.contains('mat-vertical-content');
        if(!inContent)walk(c,d+1);}};
      walk(s,0);return {host:[H.width,H.height].map(Math.round).join('x'),style:s.getAttribute('style'),els:o};});
  },[P,ONLY]);
  await p.close();return r;}
const SC=process.env.SC||'';
const setup=async p=>{
  const S=i=>`section.ex >> nth=0`;
  const hdr=async(si,hi)=>{await p.evaluate(([si,hi])=>document.querySelectorAll('section.ex sd-stepper')[si].querySelectorAll('mat-step-header')[hi].click(),[si,hi]);await p.waitForTimeout(650);};
  const btn=async(si,title)=>{await p.evaluate(([si,t])=>{const s=document.querySelectorAll('section.ex')[si];const b=[...s.querySelectorAll('sd-button')].find(x=>((x.getAttribute('title')||'').trim()===t||x.textContent.trim()===t)&&!x.closest('[inert]'));(b.querySelector('button')||b).click();},[si,title]);await p.waitForTimeout(650);};
  const typ=async(si,idx,val)=>{const h=await p.evaluateHandle(([si,idx])=>[...document.querySelectorAll('section.ex')[si].querySelectorAll('.mat-horizontal-stepper-content-current input')][idx],[si,idx]);await h.asElement().fill(val);await p.waitForTimeout(150);};
  const realHdr=async(si,hi)=>{const h=await p.evaluateHandle(([si,hi])=>document.querySelectorAll('section.ex sd-stepper')[si].querySelectorAll('mat-step-header')[hi],[si,hi]);await h.asElement().click();await p.waitForTimeout(650);};
  if(SC==='kbd'){await p.focus('section.ex sd-stepper mat-step-header[tabindex="0"]');await p.keyboard.press('ArrowRight');await p.waitForTimeout(200);await p.keyboard.press('ArrowRight');await p.keyboard.press('Enter');await p.waitForTimeout(650);await p.keyboard.press('ArrowLeft');await p.waitForTimeout(200);}
  if(SC==='mouse'){await realHdr(0,1);await realHdr(1,1);const h=await p.evaluateHandle(()=>document.querySelectorAll('section.ex sd-stepper')[3].querySelectorAll('mat-step-header')[2]);await h.asElement().hover();await p.waitForTimeout(200);}
  if(SC==='nav'){await hdr(0,1);await hdr(0,2);await hdr(0,0);await hdr(1,2);await hdr(3,2);await hdr(5,3);await hdr(11,1);await hdr(11,0);}
  if(SC==='linear'){await hdr(2,2);await typ(2,0,'abc');await typ(2,1,'a@b.co');await btn(2,'Tiếp tục');await typ(2,0,'Nguyễn A');await typ(2,1,'0901');await btn(2,'Tiếp tục');
    await p.evaluate(()=>{const c=document.querySelectorAll('section.ex')[2].querySelector('.mat-horizontal-stepper-content-current input[type=checkbox]');c.click();});await p.waitForTimeout(200);await btn(2,'Hoàn tất');await hdr(2,3);}
  if(SC==='linreset'){await typ(2,0,'abc');await typ(2,1,'a@b.co');await btn(2,'Tiếp tục');await hdr(2,0);await btn(2,'Tiếp tục');await btn(2,'Quay lại');}
  if(SC==='ext'){await btn(7,'Next');await btn(7,'Next');await btn(7,'Prev');await btn(7,'Đến cuối');await btn(7,'Reset');await btn(7,'Next');}
  if(SC==='misc'){await btn(4,'Bỏ lỗi step 2');await hdr(4,0);await btn(5,'end');await btn(3,'Tiếp tục');await btn(3,'Bỏ qua');await btn(8,'Tiếp tục');}
};
const A=await dump('http://127.0.0.1:8765/index.html',setup);
const K=await dump(new URL('./kit-harness.html', import.meta.url).href,setup);
let tot=0;
for(let i=0;i<A.length;i++){ if(!A[i])continue; const a=A[i],k=K[i];
  const diffs=[];
  if(a.host!==k.host)diffs.push('HOST '+a.host+' vs '+k.host);
  if(a.style!==k.style)diffs.push('STYLE\n  A '+a.style+'\n  K '+k.style);
  const n=Math.max(a.els.length,k.els.length);
  for(let j=0;j<n;j++){const x=a.els[j]||{},y=k.els[j]||{};
    if(x.k!==y.k){diffs.push('#'+j+' TAG '+x.k+' vs '+y.k);break;}
    if(x.at!==y.at)diffs.push('#'+j+' '+x.k+' ATTR '+x.at+' | '+y.at);
    if(x.txt!==y.txt)diffs.push('#'+j+' '+x.k+' TXT "'+x.txt+'" vs "'+y.txt+'"');
    if(x.geo!==y.geo)diffs.push('#'+j+' '+x.k.slice(0,60)+' GEO '+x.geo+' vs '+y.geo);
    if(x.cs!==y.cs){const xa=x.cs.split('|'),ya=y.cs.split('|');const dd=P.map((p,q)=>xa[q]!==ya[q]?p+': '+xa[q]+' → '+ya[q]:null).filter(Boolean);diffs.push('#'+j+' '+x.k.slice(0,60)+' CSS '+dd.join(' ; '));}
  }
  tot+=diffs.length;
  console.log('== stepper',i,'diffs',diffs.length);
  diffs.slice(0,FULL?200:12).forEach(d=>console.log('  '+d.slice(0,400)));
}
console.log('TOTAL',tot);await b.close();
