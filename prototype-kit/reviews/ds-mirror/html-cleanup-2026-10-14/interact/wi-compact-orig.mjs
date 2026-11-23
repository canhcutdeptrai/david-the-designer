import { chromium } from 'playwright';
const root = process.env.ROOT || '/home/claude/kit/prototype-kit-CATALOG-1012m/prototypes/cam-nang-phan-quyen/';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
await p.route(/^https?:/, r => r.abort());
await p.goto('file://' + root + process.argv[2]); await p.waitForTimeout(1200);
const sec = p.locator('#cond-builder-tier-2').locator('xpath=ancestor::sd-section[1]');
if (await sec.evaluate(e => e.hasAttribute('collapsed'))) { await sec.locator('.c-section-header').first().click(); await p.waitForTimeout(400); }
await p.locator('#cond-builder-tier-2 .cond-row').first().screenshot({ path: process.argv[3] });
await b.close();
