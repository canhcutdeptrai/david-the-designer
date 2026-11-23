// So sánh hành vi tab trang (.page-tab-zone .tab) giữa bản trước (t8) và kit sau khi đổi page-header
import { chromium } from 'playwright';
const PAGES = ['prototypes/cam-nang-phan-quyen/tra-cuu-cam-nang.html','prototypes/cam-nang-phan-quyen/tra-cuu-cam-nang-v2.html','design-system/preview/patterns/page-header.html','design-system/preview/patterns/read-page.html','design-system/preview/components/button.html'];
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--allow-file-access-from-files']});
let fails=0;
for (const f of PAGES) {
  const res = [];
  for (const K of ['/tmp/claude-0/pc/t8/','/home/claude/kit/prototype-kit-CATALOG-1012m/']) {
    const p = await b.newPage({viewport:{width:1440,height:900}}); await p.route(/^https?:/, r=>r.abort());
    const errs=[]; p.on('pageerror',e=>errs.push(e.message));
    await p.goto('file://'+K+f); await p.waitForTimeout(900);
    const n = await p.$$eval('.main-area > .page-header .page-tab-zone .tab', t=>t.length);
    const states=[];
    for (let i=0;i<n;i++){ await p.click(`.main-area > .page-header .page-tab-zone .tab >> nth=${i}`); await p.waitForTimeout(350);
      states.push(await p.evaluate(()=>{const cz=document.querySelector('.content-zone');const vis=[...cz.querySelectorAll('[id],[data-tab-panel]')].filter(e=>e.offsetParent!==null&&e.getBoundingClientRect().height>0).filter(e=>!/^mat-tab-group-/.test(e.id)).slice(0,12).map(e=>e.id||('p'+e.getAttribute('data-tab-panel')));return document.querySelector('.page-tab-zone .tab.active')?.textContent.trim()+'::'+vis.join(',')}));
      if (K.includes('/kit/')) { await p.waitForTimeout(600); const v = await p.evaluate(()=>{const a=document.querySelector('.page-tab-zone .tab.active');const s=document.querySelector('.page-tab-zone .mdc-tab--active');const ind=s&&s.querySelector('.mdc-tab-indicator__content');const ab=a&&a.getBoundingClientRect(), ib=ind&&ind.getBoundingClientRect();return {same:a===s, ind: ab&&ib? Math.abs(ab.x-ib.x)<2 && Math.abs(ab.width-ib.width)<2 && getComputedStyle(ind).opacity==='1' : false, hiddenShown:[...document.querySelectorAll('.page-tab-zone .mat-mdc-tab[hidden]')].some(b=>b.offsetWidth>0)}});
        if (!v.same || !v.ind || v.hiddenShown) { console.log('  VISUAL', f, i, JSON.stringify(v)); res.visualFail = true; } } }
    res.push({states,errs}); await p.close();
  }
  const same = JSON.stringify(res[0].states)===JSON.stringify(res[1].states) && !res[1].errs.length && !res.visualFail;
  if(!same) fails++;
  console.log((same?'PASS ':'FAIL ')+f+' — '+res[1].states.length+' tab'); if(!same) console.log(JSON.stringify(res,null,1).slice(0,1500));
}
console.log(fails? fails+' FAIL':'TẤT CẢ PASS'); await b.close();
