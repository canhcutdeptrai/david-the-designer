// node popcs.mjs <kitRoot> <out.json> — mở từng popup (date/date-range/datetime/chip-calendar/autocomplete), chụp computed style + toạ độ
import { chromium } from 'playwright';
import { writeFileSync, readFileSync } from 'fs';
const [root, OUT] = process.argv.slice(2);
const FONTS = readFileSync('/home/claude/catalog/Core UI/css/fonts.css', 'utf8').replaceAll('../fonts', 'file:///home/claude/catalog/Core UI/fonts');
const pages = ['design-system/preview/components/date.html','design-system/preview/components/date-range.html','design-system/preview/components/datetime.html','design-system/preview/components/chip-calendar.html','design-system/preview/components/autocomplete.html','design-system/preview/components/table.html','design-system/preview/components/form-generic.html','prototypes/cam-nang-phan-quyen/uy-quyen-noi-bo.html','prototypes/cam-nang-phan-quyen/tao-cam-nang.html'];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
await ctx.addInitScript(() => { Date.now = () => 1791849600000; });
const out = {};
for (const pg of pages) {
  const p = await ctx.newPage(); await p.route(/^https?:/, r => r.abort());
  try { await p.goto('file://' + root + pg, { timeout: 20000 }); } catch (e) { out[pg] = 'ERR'; continue; }
  await p.addStyleTag({ content: FONTS + '*,*::before,*::after{animation:none!important;transition:none!important}' }); await p.waitForTimeout(1200);
  const n = await p.evaluate(() => document.querySelectorAll('sd-date,sd-date-range,sd-datetime,sd-chip-calendar,sd-autocomplete').length);
  out[pg] = [];
  for (let i = 0; i < Math.min(n, 30); i++) {
    const r = await p.evaluate(async (i) => {
      const SEL = { 'SD-DATE': '.sd-date-popup', 'SD-DATE-RANGE': '.sd-range-popup', 'SD-DATETIME': '.sd-dt-popup', 'SD-CHIP-CALENDAR': '.sd-cc-popup', 'SD-AUTOCOMPLETE': '.sd-autocomplete-panel' };
      const h = document.querySelectorAll('sd-date,sd-date-range,sd-datetime,sd-chip-calendar,sd-autocomplete')[i];
      if (!h.querySelector('mat-form-field') || h.hasAttribute('disabled') || h.getAttribute('disabled') === 'true') return null;
      const anchor = h.querySelector('.mat-mdc-text-field-wrapper'); if (!anchor) return null;
      h.scrollIntoView({ block: 'center' });
      const t = h.tagName;
      if (t === 'SD-DATE' || t === 'SD-DATETIME') h.open(); else if (t === 'SD-DATE-RANGE') h._open(); else if (t === 'SD-CHIP-CALENDAR') h._openPopup();
      else { h.querySelector('mat-form-field').dispatchEvent(new MouseEvent('click', { bubbles: true })); }
      await new Promise(r => setTimeout(r, 120));
      const pop = h.querySelector(SEL[t]);
      if (!pop) return { t, err: 'no popup' };
      const A = anchor.getBoundingClientRect();
      const nodes = [pop, ...pop.querySelectorAll('*')].filter(x => !x.ownerSVGElement);
      const res = { t, inHost: h.contains(pop) && pop.parentElement === h, parent: pop.parentElement && pop.parentElement.className, nodes: nodes.map(x => {
        const cs = getComputedStyle(x), R = x.getBoundingClientRect(); const s = {};
        for (const k of cs) { if (/^(transition|animation|-webkit-|inset-|position|top|left|right|bottom|z-index|will-change|translate|perspective-origin|transform-origin|inline-size|block-size|min-inline|max-inline|min-block|max-block|offset)/.test(k)) continue; s[k] = cs.getPropertyValue(k); }
        return { tag: x.tagName.toLowerCase(), cls: x.className && x.className.baseVal === undefined ? x.className : '', x: Math.round(R.left - A.left), y: Math.round(R.top - A.bottom), w: Math.round(R.width), h: Math.round(R.height), s };
      }) };
      // đóng
      if (t === 'SD-DATE' || t === 'SD-CHIP-CALENDAR' || t === 'SD-DATETIME') h._closePopup(); else if (t === 'SD-DATE-RANGE') h._close(); else h._open(false);
      await new Promise(r => setTimeout(r, 50));
      return res;
    }, i);
    out[pg].push(r);
  }
  await p.close();
}
writeFileSync(OUT, JSON.stringify(out));
console.log('done');
await b.close();
