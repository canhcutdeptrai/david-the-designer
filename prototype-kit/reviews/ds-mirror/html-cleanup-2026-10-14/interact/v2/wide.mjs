// Chụp tab Ủy quyền ở 1920px (thấy đủ cột ngày) — node wide.mjs <file>
import { chromium } from 'playwright';
const root = '/home/claude/kit/prototype-kit-CATALOG-1012m/prototypes/cam-nang-phan-quyen/';
const file = process.argv[2] || 'tra-cuu-cam-nang-v2.html';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--allow-file-access-from-files'] });
const p = await b.newPage({ viewport: { width: 1920, height: 700 } });
await p.route(/^https?:/, r => r.abort());
await p.goto('file://' + root + file); await p.waitForTimeout(1200);
await p.click('.page-tab-zone .tab:nth-child(3)'); await p.waitForTimeout(900);
await p.screenshot({ path: '/home/claude/work/round/agents/v2/' + file + '.wide.png', clip: { x: 1000, y: 180, width: 920, height: 160 } });
await b.close();
