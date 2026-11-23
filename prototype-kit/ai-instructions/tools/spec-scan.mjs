#!/usr/bin/env node
/* spec-scan.mjs — quét một (hoặc nhiều) trang prototype, in NHÁP số liệu cho `_dev-spec.md`.
 *
 *   node ai-instructions/tools/spec-scan.mjs prototypes/<feature>/<trang>.html [trang khác…] > /tmp/scan.md
 *   node ai-instructions/tools/spec-scan.mjs prototypes/<feature>/            (cả thư mục, bỏ memory.html / CHANGELOG.html)
 *
 * Chỉ dùng thư viện chuẩn của Node (fs, path) — không cần cài gì. Đọc mã nguồn tĩnh, KHÔNG chạy trang:
 *   · page-header (data-pattern) · thẻ sd-* và thuộc tính chính (label, required, pattern, min/max…) · cột sd-table
 *   · HTML thuần còn lại (button / select / table / input / textarea) · style="" · CSS riêng của trang
 *     (<style> trong file + file CSS link ngoài design-system/) kèm các GIÁ TRỊ TRẦN (#hex, rgb, px lẻ) không qua token
 *   · sự kiện JS demo đang nghe (addEventListener / on…=) — gợi ý hành vi cần đặc tả ở phần B
 * Kết quả là NHÁP: AI dùng nó để điền `_dev-spec.md` (phần A lấy gần như nguyên; phần B phải đọc thêm JS / requirements).
 * Viết 2026-10-14 (Builder: „tiếp tục mục (4) _dev-spec.md“). Mẫu spec: ai-instructions/dev-spec.md. */
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
if (!args.length) { console.error('Cách dùng: node spec-scan.mjs <file.html | thư mục> …'); process.exit(1); }
const SKIP = /^(memory|CHANGELOG)\.html$/i;
const files = args.flatMap(a => fs.statSync(a).isDirectory()
  ? fs.readdirSync(a).filter(f => f.endsWith('.html') && !SKIP.test(f)).sort().map(f => path.join(a, f)) : [a]);

const stripComments = s => s.replace(/<!--[\s\S]*?-->/g, '');
const attrsOf = tag => {
  const o = {}; const re = /([:@\w.-]+)(?:\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+)))?/g; let m;
  const inner = tag.replace(/^<[\w-]+/, '').replace(/\/?>$/, '');
  while ((m = re.exec(inner))) o[m[1]] = m[3] ?? m[4] ?? m[5] ?? '';
  return o;
};
const short = (v, n = 70) => { v = String(v).replace(/\s+/g, ' ').trim(); return v.length > n ? v.slice(0, n - 1) + '…' : v; };
const RAW_VALUE = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|\b\d*\.?\d+px\b/g;
const KEY_ATTRS = ['id', 'label', 'title', 'placeholder', 'name', 'required', 'pattern', 'patternErrorMessage', 'min', 'max',
  'minlength', 'maxlength', 'multiple', 'disabled', 'viewed', 'type', 'color', 'variant', 'size', 'suffix', 'hideInlineError'];

function cssBlocks(css) {
  const out = []; css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const re = /([^{}@]+)\{([^{}]*)\}/g; let m;
  while ((m = re.exec(css))) {
    const sel = m[1].trim().replace(/\s+/g, ' '); const decl = m[2].trim().replace(/\s+/g, ' ');
    if (!sel || !decl) continue;
    const raw = (decl.match(RAW_VALUE) || []).filter(v => !/^0px$/.test(v));
    out.push({ sel, decl, raw });
  }
  return out;
}

function scan(file) {
  const src = fs.readFileSync(file, 'utf8'); const html = stripComments(src); const dir = path.dirname(file);
  // markup tĩnh = bỏ nội dung <script> (thẻ sd-* sinh bằng chuỗi JS đếm riêng, không đưa vào bảng ô nhập)
  const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
  const jsTags = (html.length - markup.length) ? [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n').match(/<(sd|bpm)-[\w-]+/g) || [] : [];
  const L = []; const name = path.basename(file);
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  L.push(`## ${name} — nháp tự quét`, '', `> \`${title.trim()}\` · tạo bởi \`ai-instructions/tools/spec-scan.mjs\` — đọc mã tĩnh, chưa phải spec.`, '');

  // page-header
  const ph = html.match(/<div[^>]*data-pattern="page-header"[^>]*>/);
  if (ph) {
    const a = attrsOf(ph[0]); const keep = Object.entries(a).filter(([k]) => k.startsWith('data-') && k !== 'data-pattern');
    L.push('**Header:** ' + keep.map(([k, v]) => `\`${k.slice(5)}=${short(v, 50)}\``).join(' · '), '');
  }

  // sd-* inventory
  const tags = [...markup.matchAll(/<(sd-[\w-]+|bpm-[\w-]+)\b[^>]*>/g)];
  const count = {}; tags.forEach(m => count[m[1]] = (count[m[1]] || 0) + 1);
  L.push('**Component dùng (markup tĩnh):** ' + (Object.entries(count).sort((a, b) => b[1] - a[1]).map(([t, c]) => `\`${t}\`×${c}`).join(' · ') || '—')
    + (jsTags.length ? ` · **+${jsTags.length} thẻ sd-* sinh bằng JS** (${[...new Set(jsTags.map(t => t.slice(1)))].slice(0, 8).join(', ')}) — đọc script`: ''), '');

  // ô nhập / chọn (B1)
  const FIELD = /^sd-(input|input-number|select|autocomplete|date|datetime|date-range|textarea|checkbox|radio|switch|chip|chip-calendar|upload-file|inline-text)$/;
  const fields = tags.filter(m => FIELD.test(m[1])).map(m => ({ tag: m[1], a: attrsOf(m[0]) }));
  if (fields.length) {
    L.push('**Ô nhập / chọn** (nháp cho B1):', '', '| Thẻ | Nhãn / placeholder | id / name | Kiểm tra | Khác |', '|---|---|---|---|---|');
    for (const f of fields) {
      const a = f.a; const chk = ['required', 'pattern', 'min', 'max', 'minlength', 'maxlength'].filter(k => k in a).map(k => a[k] ? `${k}=${short(a[k], 24)}` : k).join(' · ');
      const other = ['multiple', 'disabled', 'viewed', 'suffix', 'type', 'size'].filter(k => k in a).map(k => a[k] ? `${k}=${short(a[k], 16)}` : k).join(' · ');
      const items = a.items ? ` · items(${(a.items.match(/"id"/g) || []).length})` : '';
      L.push(`| \`${f.tag}\` | ${short(a.label || a.placeholder || a.title || '—', 40)} | ${a.id || a.name || '—'} | ${chk || '—'} | ${other}${items} |`);
    }
    L.push('');
  }

  // sd-table (B2)
  const tables = tags.filter(m => m[1] === 'sd-table').map(m => attrsOf(m[0]));
  tables.forEach((t, i) => {
    let cols = [];
    try { cols = JSON.parse(t.columns || '[]'); } catch (e) { cols = []; }
    const flags = ['paginated', 'pageSize', 'pageSizes', 'total', 'selectable', 'addable', 'tree', 'hide-inline-filter', 'reload-visible', 'export-visible', 'config-visible']
      .filter(k => k in t).map(k => t[k] ? `${k}=${short(t[k], 20)}` : k).join(' · ');
    L.push(`**Bảng ${t.id ? '`#' + t.id + '`' : i + 1}:** ${flags || '—'}` + (t.columns ? '' : ' · cột gán bằng JS (`el.option` / `columns`) — đọc script'), '');
    if (cols.length) L.push('| field | title | type |', '|---|---|---|', ...cols.map(c => `| ${c.field || '—'} | ${short(typeof c.title === 'object' ? c.title.title : c.title || '', 30)} | ${c.type || ''} |`), '');
  });

  // HTML thuần
  const raw = {}; for (const t of ['button', 'select', 'table', 'input', 'textarea']) raw[t] = (markup.match(new RegExp('<' + t + '\\b', 'g')) || []).length;
  const styleAttrs = [...markup.matchAll(/<([\w-]+)[^>]*\sstyle="([^"]*)"/g)];
  L.push(`**HTML thuần (markup tĩnh):** ` + Object.entries(raw).map(([k, v]) => `${k} ${v}`).join(' · ') + ` · \`style=""\` ${styleAttrs.length}`, '');
  if (styleAttrs.length) {
    L.push('<details><summary>style="" (tối đa 15)</summary>', '', ...styleAttrs.slice(0, 15).map(m => `- \`<${m[1]}>\` ${short(m[2], 90)}`), '', '</details>', '');
  }

  // CSS riêng (A)
  let css = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n');
  const links = [...html.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map(m => m[1]).filter(h => !/design-system\//.test(h) && !/^https?:/.test(h));
  for (const h of links) { try { css += '\n' + fs.readFileSync(path.join(dir, h), 'utf8'); } catch (e) { /* bỏ qua */ } }
  const blocks = cssBlocks(css);
  const cssLines = css.split('\n').filter(l => l.trim()).length;
  L.push(`**CSS riêng của trang:** ${cssLines} dòng · ${blocks.length} khối` + (links.length ? ` (gồm ${links.join(', ')})` : ''), '');
  const rawBlocks = blocks.filter(b => b.raw.length);
  if (blocks.length) {
    L.push(`Khối có giá trị trần (không qua token): **${rawBlocks.length}/${blocks.length}**. Nháp cho phần A (tối đa 40 khối, ưu tiên khối có giá trị trần):`, '',
      '| Selector | Khai báo (rút gọn) | Giá trị trần |', '|---|---|---|');
    [...rawBlocks, ...blocks.filter(b => !b.raw.length)].slice(0, 40)
      .forEach(b => L.push(`| \`${short(b.sel, 60).replace(/\|/g, '\\|')}\` | ${short(b.decl, 110).replace(/\|/g, '\\|')} | ${[...new Set(b.raw)].slice(0, 6).join(' ') || '—'} |`));
    L.push('');
  }

  // JS demo — sự kiện (gợi ý cho B3)
  const scripts = [...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]).join('\n');
  const evs = {}; for (const m of scripts.matchAll(/addEventListener\(\s*['"]([\w-]+)['"]/g)) evs[m[1]] = (evs[m[1]] || 0) + 1;
  const inline = (html.match(/\son(click|change|input)="/g) || []).length;
  const fns = [...new Set([...scripts.matchAll(/function\s+(\w+)\s*\(/g)].map(m => m[1]))];
  L.push(`**JS demo:** ${scripts.split('\n').length} dòng · sự kiện nghe: ` + (Object.entries(evs).map(([k, v]) => `\`${k}\`×${v}`).join(' · ') || '—') + ` · onclick/onchange inline ${inline}`, '');
  if (fns.length) L.push(`Hàm (gợi ý luồng cần đặc tả): ${fns.slice(0, 40).map(f => '`' + f + '`').join(', ')}${fns.length > 40 ? ` … (+${fns.length - 40})` : ''}`, '');
  return L.join('\n');
}

console.log(files.map(scan).join('\n\n---\n\n'));
