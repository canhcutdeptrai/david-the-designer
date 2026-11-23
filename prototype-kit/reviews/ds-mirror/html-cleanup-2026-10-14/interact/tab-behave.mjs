// So hành vi sd-tab-group trên preview/components/tab-group.html: bản trước (t12, DOM tự dựng) và kit (DOM Material)
import { chromium } from 'playwright';
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--allow-file-access-from-files']});
const V = { old: { root:'/tmp/claude-0/pc/t12/', tab:'.sd-tab__button', act:'sd-tab--active', close:'.sd-tab__close', next:'.sd-tab-pagination--after', vis: g=>'' },
            neu: { root:'/home/claude/kit/prototype-kit-CATALOG-1012m/', tab:'.mat-mdc-tab-labels > .mat-mdc-tab', act:'mdc-tab--active', close:'.sd-tab__close', next:'.mat-mdc-tab-header-pagination-after' } };
const out = {};
for (const [name, v] of Object.entries(V)) {
  const p = await b.newPage({viewport:{width:1440,height:900}}); await p.route(/^https?:/, r=>r.abort());
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('file://'+v.root+'design-system/preview/components/tab-group.html'); await p.waitForTimeout(1000);
  await p.evaluate(()=>{ window.__ev=[]; document.addEventListener('sd-tab-change',e=>window.__ev.push('chg'+e.detail.index)); document.addEventListener('sd-tab-close',e=>window.__ev.push('close'+e.detail.index)); });
  const n = await p.$$eval('.content-zone sd-tab-group', g=>g.length);
  const res = [];
  for (let gi=0; gi<n; gi++) {
    const g = `.content-zone sd-tab-group >> nth=${gi}`;
    const cnt = await p.locator(g).locator(v.tab).count();
    const st = [];
    for (let i=0;i<cnt;i++){
      await p.locator(g).locator(v.tab).nth(i).click({force:true, timeout:3000}).catch(()=>st.push('noclick'+i));
      await p.waitForTimeout(120);
      st.push(await p.locator(g).evaluate((el,{tab,act})=>{const ts=[...el.querySelectorAll(tab)].filter(t=>t.closest('sd-tab-group')===el);const a=ts.findIndex(t=>t.classList.contains(act));
        const tabs=[...el.querySelectorAll('sd-tab')].filter(t=>t.closest('sd-tab-group')===el); const vis=tabs.map(t=>getComputedStyle(t).display!=='none'&&t.getClientRects().length>0||(t.firstElementChild&&t.firstElementChild.offsetParent!==null)?1:0).join('');
        return a+':'+el.getAttribute('selectedindex')+':'+vis+':'+(tabs[a]?tabs[a].textContent.trim().slice(0,20):'')},{tab:v.tab,act:v.act}));
    }
    res.push(`g${gi} [${cnt}] `+st.join(' | '));
  }
  // đóng tab trong nhóm 1 (closable)
  await p.locator('.content-zone sd-tab-group >> nth=1').locator(v.close).first().click(); await p.waitForTimeout(150);
  res.push('after close g1: '+await p.locator('.content-zone sd-tab-group >> nth=1').locator(v.tab).count());
  // phân trang nhóm 10
  const g10='.content-zone sd-tab-group >> nth=10';
  const nb = p.locator(g10).locator(v.next);
  res.push('g10 next visible: '+await nb.isVisible());
  res.push('events: '+(await p.evaluate(()=>window.__ev.join(','))));
  // bàn phím (chỉ bản mới)
  if (name==='neu') { await p.locator('.content-zone sd-tab-group >> nth=0').locator(v.tab).first().focus(); await p.keyboard.press('ArrowRight'); await p.keyboard.press('Enter'); await p.waitForTimeout(100);
    res.push('kbd g0 → '+await p.locator('.content-zone sd-tab-group >> nth=0').getAttribute('selectedindex')); }
  res.push('errs: '+errs.join(';'));
  out[name]=res; await p.close();
}
for (let i=0;i<Math.max(out.old.length,out.neu.length);i++){ const a=out.old[i], c=out.neu[i]; console.log((a===c?'= ':'≠ ')+(a===c?a:('OLD '+a+'\n   NEW '+c))); }
await b.close();
