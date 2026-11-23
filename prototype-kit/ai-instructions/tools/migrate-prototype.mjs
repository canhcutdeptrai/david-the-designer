#!/usr/bin/env node
/* migrate-prototype.mjs — nâng prototype sinh bằng kit CŨ (trước 2026-10-13) lên kit hiện tại, để mở bằng kit mới không vỡ.
 *
 *   node ai-instructions/tools/migrate-prototype.mjs prototypes/<feature>/            (cả thư mục)
 *   node ai-instructions/tools/migrate-prototype.mjs prototypes/<feature>/a.html …    (từng trang)
 *   thêm --dry   : chỉ in báo cáo, không ghi file
 *   thêm --force : chạy cả trang không có dấu hiệu kit cũ (mặc định bỏ qua để không đổi nhầm trang mới)
 *   --inform     : CHỈ đổi khối thông báo tự dựng → <sd-inform> (bước 12), chạy được cả trên trang MỚI (không đụng gì khác)
 *   --components : CHỈ đổi markup tự dựng / tên cũ → component Core (bước 12 + 14) + nạp legacy-shim.js khi cần — chạy được cả trên trang MỚI
 *   --redo       : nâng LẠI từ bản gốc trong `_pre-migrate/` (bản trước mọi lần nâng) bằng công cụ hiện tại — dùng khi trang đã nâng
 *                  bằng bản công cụ cũ và CHƯA sửa tay sau đó. Bản đang có chép sang `_pre-migrate/redo-<ngày>/` trước khi ghi.
 *   Kiểm an toàn: <script> nào vốn chạy được mà sau khi đổi hỏng cú pháp → đổi lại, chỉ phần HTML tĩnh (không bao giờ trả trang hỏng JS).
 *
 * Node thuần (fs, path) — không cần cài gì. Viết 2026-10-14 (Builder: „các prototypes khác khi áp kit này vào vẫn bị lỗi“).
 * Bản gốc của mỗi trang được chép sang `<thư mục trang>/_pre-migrate/` trước khi ghi.
 *
 * Việc làm TỰ ĐỘNG (đều giữ hình như kit cũ, chỉ đổi cách viết):
 *   1. Thang khoảng cách: kit cũ là Tailwind ×4px (`mb-3` = 12px), kit mới là PIXEL của sd-core (`mb-3` = 3px).
 *      Đổi đúng 20 lớp kit cũ có định nghĩa → số px tương ứng (`mb-3` → `mb-12`, `gap-2` → `gap-8`…), trong
 *      class="…", className, classList.add/remove/toggle/contains/replace(…), setAttribute('class', …).
 *   2. Reset cũ `*{margin:0;padding:0}`: gắn `data-legacy-reset` lên p / h1–h6 / ul / ol / dl / dd / label / button / input /
 *      textarea / table / th / td / hr / figure / blockquote / pre / legend DO TRANG VIẾT (cả trong chuỗi JS), và nạp
 *      `design-system/core/styles/legacy-reset.css` ngay sau CSS của kit (trước <style> của trang).
 *   3. `sd-badge type="status" status="…"` (đã gỡ 2026-10-13) → `color` + `icon` (+ `fontSet`) tra STATUS_MAP.
 *   4. `sd-button href="…"` (sd-button không có href) → `onclick="location.href='…'"`.
 *   5. Cột `type: number` của sd-table chưa khai precision → `option.precision: 0` (kit cũ hiện số nguyên; nay mặc định 2 số lẻ).
 *   6. `div.sd-form-field` bọc ô sd-* → legacy-reset.css bỏ khung của lớp bọc (khỏi hai khung chồng nhau).
 *   7. `slot="header-right"` / `slot="header-left"` (bí danh kit cũ, sd-section đã gỡ 2026-10-12) → THÊM `sdHeaderRight` /
 *      `sdHeaderLeft` như catalog, GIỮ `slot` (sd-side-drawer vẫn nhận). `slot="footer"` của sd-side-drawer vẫn chạy — chỉ báo.
 *   8. `<sd-button …>Chữ</sd-button>` chưa có `title` (sd-button 19.0.10 không có ng-content — chữ trong thẻ không hiện)
 *      → `title="Chữ"`. Chỉ đổi khi bên trong là chữ thuần (không thẻ, không ${…}).
 *   9. Lớp "chết": lớp trang ghi mà kit cũ KHÔNG có (vô tác dụng — `p-3`, `my-4`, `ml-2`, `mb-5`, `px-6`…) nhưng sd-core nay có
 *      nghĩa px → gỡ khỏi class="…" để giữ hình (trừ lớp trang tự định nghĩa hoặc JS dùng làm móc). Báo danh sách đã gỡ.
 *  10. !important: lớp tiện ích kit cũ không !important, sd-core thì có → (a) inline style cùng thuộc tính: thêm !important vào
 *      khai báo inline; (b) luật `.lớp{…}` của trang phủ hết thuộc tính của lớp tiện ích trên cùng thẻ: bỏ lớp tiện ích (phủ một
 *      phần lớp m/p: tách theo cạnh, vd `p-16` + `padding-left:0` → `pt-16 pr-16 pb-16`); (c) trang tự định nghĩa lớp trùng tên
 *      lớp sd-core (`.p-3{padding:12px}`): thêm !important vào luật đó. JS ẩn khối `d-flex` bằng style.display='none' → legacy-reset.css lo.
 *  11. Ô sd-* trong `<td>` của bảng tự dựng và ô tìm kiếm không nhãn (placeholder "Tìm…") → `hideInlineError` (quy tắc kit cho
 *      hàng công cụ / ô bảng). Form vẫn giữ 20px dưới mỗi ô như Core (Builder 2026-10-14: "Theo Core").
 *  12. Khối thông báo tự dựng (`div` tô `background:var(--color-X-50)` + viền / icon, `div.alert.alert-X`) → `<sd-inform color="X"
 *      title="…" description="…">` như Core (chữ thuần; có nút / ô nhập / id bên trong thì chỉ báo).
 *  14. (lib/components.mjs) Markup tự dựng → component Core: nút, badge, ô nhập / select / textarea / checkbox / radio / switch,
 *      bảng, modal, drawer, thanh tab, card, info item, header viết tay; tên cũ của kit → tên Core. Bảng chi tiết + cách xử lý
 *      dòng `!`: ai-instructions/migrate-components.md. JS cũ vẫn chạy nhờ design-system/core/js/legacy-shim.js (tự nạp khi cần).
 *  13. Đánh dấu `<!-- kit-migrated … -->` để lần sau không chạy lại.
 *
 * Việc BÁO, không tự sửa (cần người quyết): header viết tay (Rule 10 — layout.css đã có lưới an toàn), `sd-badge type="tag"`
 * (nghĩa đổi 2026-10-10: tag = khung viền, viên thuốc là round), cột số khai trong object lồng, thẻ / thuộc tính / lớp đã gỡ khỏi kit
 * (bảng GONE bên dưới: sd-button-item, sd-scorecard, màu black, type lạ của sd-button, avatar của sd-section, clearable / mask
 * của sd-input…). Mỗi dòng `!` kèm cách sửa theo catalog. */
import fs from 'fs';
import path from 'path';
import { convertComponents } from './lib/components.mjs';

const argv = process.argv.slice(2);
const DRY = argv.includes('--dry'), FORCE = argv.includes('--force'), REDO = argv.includes('--redo'), ONLY_INFORM = argv.includes('--inform'), ONLY_COMP = argv.includes('--components');
const inputs = argv.filter(a => !a.startsWith('--'));
if (!inputs.length) { console.error('Cách dùng: node migrate-prototype.mjs <file.html | thư mục> … [--dry] [--force]'); process.exit(1); }
const SKIP = /^(memory|CHANGELOG)\.html$/i;
/* Thư mục → quét ĐỆ QUY mọi trang .html bên dưới (2026-10-15: trước chỉ lấy file ngay trong thư mục — người nhận kit chạy
   `prototypes/` tưởng đã nâng hết mà thực ra chỉ nâng index.html). Bỏ `_pre-migrate/`, `node_modules/`, thư mục ẩn, `design-system/`. */
const SKIP_DIR = /^(_pre-migrate|node_modules|design-system|ai-instructions|reviews|\..*)$/;
function walk(d) {
  const out = [];
  for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (e.isDirectory()) { if (!SKIP_DIR.test(e.name)) out.push(...walk(path.join(d, e.name))); }
    else if (e.name.endsWith('.html') && !SKIP.test(e.name)) out.push(path.join(d, e.name));
  }
  return out;
}
const files = inputs.flatMap(a => fs.statSync(a).isDirectory() ? walk(a) : [a]);

const KIT_ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
const MARK = 'kit-migrated';
const VERSION = 5;            // v1 = chưa gỡ lớp chết / !important / hideInlineError · v2 = chưa đổi dải thông báo · v3 = chưa đổi component tự dựng / tên cũ · v4 = min-width cứng trên ô đổi, chưa nhận hộp thông báo tô bằng lớp CSS
/* Hộp nhắc trên trang (sd-components.js → sdLegacyPageNotice) so dấu `kit-migrated vN` với SD_MIGRATE_VERSION để biết trang
   còn phải nâng tiếp — hai số phải bằng nhau, lệch thì trang đã nâng vẫn nhắc (hoặc trang cần nâng không nhắc). */
try {
  const sdc = fs.readFileSync(path.join(KIT_ROOT, 'design-system', 'sd-components', 'sd-components.js'), 'utf8');
  const mv = sdc.match(/var SD_MIGRATE_VERSION = (\d+);/);
  if (mv && +mv[1] !== VERSION) console.warn('⚠ SD_MIGRATE_VERSION trong sd-components.js = ' + mv[1] + ' ≠ VERSION công cụ = ' + VERSION + ' — sửa cho bằng nhau, không thì hộp nhắc trên trang báo sai');
} catch (e) { /* kit không đủ thư mục design-system → bỏ qua phép kiểm */ }
const TODAY = new Date().toISOString().slice(0, 10);

/* 1. 20 lớp khoảng cách của kit cũ (utilities.css cũ: var(--space-N), --space-1 = 4px…) → lớp px của sd-core */
const SP = {
  'mt-1': 'mt-4', 'mt-2': 'mt-8', 'mt-3': 'mt-12', 'mt-4': 'mt-16', 'mt-6': 'mt-24',
  'mb-1': 'mb-4', 'mb-2': 'mb-8', 'mb-3': 'mb-12', 'mb-4': 'mb-16', 'mb-6': 'mb-24',
  'mr-2': 'mr-8', 'p-4': 'p-16', 'p-5': 'p-20', 'p-6': 'p-24', 'px-4': 'px-16', 'py-2': 'py-8',
  'gap-1': 'gap-4', 'gap-2': 'gap-8', 'gap-3': 'gap-12', 'gap-6': 'gap-24'
};
const SP_OUT = new Set(Object.values(SP));   // lớp bước 1 sinh ra — nâng lại trang v1 thì coi như lớp kit cũ
/* Nhận ra trang kit CŨ. Không dựa vào lớp khoảng cách (kit cũ đã có sẵn cả `mb-16` / `gap-8` px trong sd-tokens.css cũ).
   Dấu chắc nhất: template cũ nạp Roboto từ Google Fonts; từ 2026-10-13 font đi theo `vendor/sd-fonts` (tokens.css) nên trang mới không có
   link đó. Thêm hai API chỉ kit cũ có: `sd-badge type="status"`, `slot="header-right|left"`. */
const OLD_SIGNS = [
  [/fonts\.googleapis\.com\/css2\?[^"']*family=Roboto\b/, 'link Google Fonts Roboto của template cũ'],
  [/<sd-badge\b[^>]*\btype=\\?["']status/, 'sd-badge type="status"'],
  [/\sslot=\\?["']header-(?:right|left)/, 'slot="header-right|left"']
];
const CLASS_CTX = [
  /(class\s*=\s*\\?")([^"\\]*(?:\\.[^"\\]*)*?)(\\?")/g,
  /(class\s*=\s*\\?')([^'\\]*(?:\\.[^'\\]*)*?)(\\?')/g,
  /(className\s*\+?=\s*)(['"`][^'"`]*['"`])()/g,
  /(classList\.(?:add|remove|toggle|contains|replace)\()([^)]*)(\))/g,
  /(setAttribute\(\s*['"]class['"]\s*,\s*)([^)]*)(\))/g
];
const KEEP = '\u2063';   // đánh dấu lớp do công cụ vừa sinh — bước gỡ lớp chết bỏ qua, xoá dấu ở cuối
function mapToken(t, st, pc, drop) {
  if (pc.single[t]) return t;    // trang tự định nghĩa `.t{…}` → giữ tên (fixPageUtilDefs lo độ ưu tiên)
  if (UPGRADE) return (drop && NEW_UTIL[t] && !OLD_KNOWN.has(t) && !SP_OUT.has(t) && !pc.tokens.has(t) && !pc.hooks.has(t)) ? (st.noop[t] = (st.noop[t] || 0) + 1, '') : t;
  if (SP[t]) {
    st.spacing[t] = (st.spacing[t] || 0) + 1;
    if (pc.tokens.has(t) && !st.spNote?.[t]) { (st.spNote ||= {})[t] = 1; st.notes.push('CSS của trang có luật ghép nhắc tới lớp .' + t + ' (nay đổi thành ' + SP[t] + ') — sửa selector đó theo tên mới'); }
    return SP[t];
  }
  if (drop && NEW_UTIL[t] && !OLD_KNOWN.has(t) && !pc.tokens.has(t) && !pc.hooks.has(t)) { st.noop[t] = (st.noop[t] || 0) + 1; return ''; }
  return t;
}
const mapBody = (body, st, pc, drop) => {
  const out = body.replace(/(?<![\w$.\u2063-])[a-zA-Z][\w-]*(?![\w(-])/g, t => mapToken(t, st, pc, drop));
  if (out !== body && !out.trim()) return "";
  return out === body ? body : out.replace(/ {2,}/g, ' ').replace(/^ (?=\S)|(?<=\S) $/g, '');
};
function remapSpacing(s, st, pc) {
  /* gỡ lớp chết CHỈ trong class="…" (tĩnh hoặc chuỗi HTML trong JS) — classList / className chỉ đổi thang (gỡ ở đó dễ sinh chuỗi rỗng) */
  CLASS_CTX.forEach((rx, i) => { s = s.replace(rx, (m, a, body, z) => a + mapBody(body, st, pc, i < 2) + z); });
  /* chuỗi JS chỉ gồm tên lớp, nằm gần chữ class/cls (vd `cls = cond ? 'mb-3' : 'mb-2'`) */
  s = s.replace(/(<script\b[^>]*>)([\s\S]*?)(<\/script>)/gi, (m, a, js, z) => a + js.replace(/(class|cls|Class)([^;\n]{0,80}?)(['"])([a-z][\w-]*(?: +[a-z][\w-]*)*)\3/g,
    (mm, kw, mid, q, lit) => lit.split(' ').some(t => SP[t]) ? kw + mid + q + mapBody(lit, st, pc, false) + q : mm) + z);
  return s;
}

/* 2. reset cũ — thẻ do trang viết */
const RESET_TAGS = 'p|h[1-6]|ul|ol|dl|dd|label|button|input|textarea|table|th|td|hr|figure|blockquote|pre|legend';
function markReset(s, st) {
  return s.replace(new RegExp('<(' + RESET_TAGS + ')(?=[\\s>/])(?![^>]*data-legacy-reset)', 'gi'), (m, tag) => {
    st.reset++; return '<' + tag + ' data-legacy-reset';
  });
}
function linkLegacyCss(s, st) {
  if (/legacy-reset\.css/.test(s)) return s;
  const m = s.match(/<link[^>]+href=["']([^"']*core\/styles\/)sd-tokens\.css["'][^>]*>/i) ||
            s.match(/<link[^>]+href=["']([^"']*core\/styles\/)[\w-]+\.css["'][^>]*>(?![\s\S]*core\/styles\/)/i);
  if (!m) { st.notes.push('không tìm thấy <link> CSS của kit — tự thêm legacy-reset.css'); return s; }
  st.css = true;
  return s.replace(m[0], m[0] + '\n  <link rel="stylesheet" href="' + m[1] + 'legacy-reset.css">   <!-- ' + MARK + ': reset của kit cũ -->');
}

/* 3. sd-badge type="status" → API catalog, theo STATUS_MAP của sd-components.js (đọc lúc chạy để luôn khớp) */
function loadStatusMap() {
  try {
    const src = fs.readFileSync(path.join(KIT_ROOT, 'design-system/sd-components/sd-components.js'), 'utf8');
    const body = src.slice(src.indexOf('var STATUS_MAP = {'), src.indexOf('};', src.indexOf('var STATUS_MAP = {')));
    const map = {}; const re = /(\w+):\s*\{\s*icon:\s*'([\w-]+)',\s*color:\s*'(\w+)',\s*filled:\s*(true|false)/g; let m;
    while ((m = re.exec(body))) map[m[1]] = { icon: m[2], color: m[3], filled: m[4] === 'true' };
    return map;
  } catch (e) { return {}; }
}
const STATUS_MAP = loadStatusMap();
function fixStatusBadge(s, st) {
  return s.replace(/<sd-badge\b([^>]*?)\btype=(["'])status\2([^>]*)>/g, (m, a, q, b) => {
    const all = a + b; const k = ((all.match(/\bstatus=(["'])([^"']*)\1/) || [])[2] || 'unknown').toLowerCase();
    const cfg = STATUS_MAP[k] || STATUS_MAP.unknown || { icon: 'help_outline', color: 'info', filled: false };
    /* status dựng bằng JS (`status="' + s + '"`) → không đoán được khoá: giữ nguyên, sd-badge vẫn nhận type="status"
       làm bí danh lúc chạy (vẽ đúng STATUS_MAP) — trước 2026-10-15 công cụ đổi thành icon help_outline cố định */
    if (/\bstatus=(["'])[^"']*(?:'\s*\+|\+\s*'|"\s*\+|\+\s*"|\$\{)/.test(all) || /\bstatus=\\/.test(all)) return m;
    const rest = all.replace(/\s*\bstatus=(["'])[^"']*\1/, '').replace(/\s*\b(color|icon|fontSet)=(["'])[^"']*\2/g, '');
    /* kit cũ: không có title thì hiện khoá viết hoa chữ đầu ("Pending") — giữ chữ đó */
    const hasTitle = /\btitle=(["'])/.test(rest);
    const raw = ((all.match(/\bstatus=(["'])([^"']*)\1/) || [])[2] || '').toLowerCase();
    const autoTitle = !hasTitle && raw ? ' title="' + raw.charAt(0).toUpperCase() + raw.slice(1) + '"' : '';
    st.badge++;
    return '<sd-badge' + rest.replace(/\s+$/, '') + autoTitle + ' color="' + cfg.color + '" icon="' + cfg.icon + '"' +
      (cfg.filled ? '' : ' fontSet="material-icons-outlined"') + '>';
  });
}

/* 4. sd-button href → onclick */
function fixButtonHref(s, st) {
  return s.replace(/<sd-button\b([^>]*?)\shref=(["'])([^"']*)\2([^>]*)>/g, (m, a, q, url, b) => {
    if (/\bonclick=/.test(a + b)) { st.notes.push('sd-button có cả href và onclick — giữ onclick, bỏ href (' + url + ')'); return '<sd-button' + a + b + '>'; }
    st.href++;
    return '<sd-button' + a + ' onclick="location.href=\'' + url.replace(/'/g, "\\'") + '\'"' + b + '>';
  });
}

/* 5. Cột số của sd-table: kit cũ hiện số nguyên, kit mới theo catalog hiện 2 số lẻ → thêm `option.precision: 0` cho cột
   `type: number` chưa khai precision (dạng JSON trong attribute lẫn object JS phẳng; object lồng nhiều lớp thì chỉ báo). */
function fixNumberPrecision(s, st) {
  const isJson = q => q === '"';
  // object phẳng: { … type: 'number' … } không có option / precision
  s = s.replace(/\{([^{}]*?\btype["']?\s*:\s*(["'])number\2[^{}]*?)\}/g, (m, body, q) => {
    if (/precision/.test(body) || /\boption["']?\s*:/.test(body)) return m;
    st.precision++;
    return '{' + body.replace(/\s*$/, '') + (isJson(q) && /"\w+"\s*:/.test(body) ? ',"option":{"precision":0}' : ', option: { precision: 0 }') + '}';
  });
  // có option: { … } (một lớp) nhưng chưa có precision
  s = s.replace(/(\{[^{}]*?\btype["']?\s*:\s*(["'])number\2[^{}]*?\boption["']?\s*:\s*\{)([^{}]*\})/g, (m, head, q, rest) => {
    if (/precision/.test(rest)) return m;
    st.precision++;
    return head + (isJson(q) && /"option"/.test(head) ? '"precision":0' : 'precision: 0') + (/^\s*\}/.test(rest) ? '' : ', ') + rest;
  });
  return s;
}

/* 7. bí danh slot của kit cũ → directive của catalog (giữ slot cho sd-side-drawer) */
function fixSlots(s, st) {
  const DIR = { 'header-right': 'sdHeaderRight', 'header-left': 'sdHeaderLeft' };
  return s.replace(/(<[a-z][\w-]*\b)([^>]*?)\sslot=(\\?["'])(header-right|header-left)\3([^>]*>)/gi, (m, open, a, q, name, b) => {
    const d = DIR[name.toLowerCase()];
    if (new RegExp('\\s' + d + '(?![\\w-])', 'i').test(a + b)) return m;
    st.slot++;
    return open + a + ' ' + d + ' slot=' + q + name + q + b;
  });
}

/* 8. sd-button: chữ trong thẻ → title (thư viện không chiếu nội dung) */
function fixButtonLabel(s, st) {
  return s.replace(/<sd-button\b([^>]*)>([^<>]*?)<\/sd-button>/g, (m, a, text) => {
    const t = text.replace(/\s+/g, ' ').trim();
    if (!t || /\btitle=/.test(a) || /[$`{}'"\\]/.test(t)) {
      if (t && /\btitle=/.test(a)) st.notes.push('sd-button có cả title lẫn chữ trong thẻ ("' + t.slice(0, 30) + '") — chữ trong thẻ không hiện, giữ title');
      return m;
    }
    st.label++;
    return '<sd-button' + a.replace(/\s+$/, '') + ' title="' + t.replace(/&(?![\w#]+;)/g, '&amp;') + '"></sd-button>';
  });
}

/* ── Lớp tiện ích: kit cũ ↔ kit mới ─────────────────────────────────────────────────────────────────────
   Kit cũ chỉ có ~225 lớp tiện ích (đo trên CSS kit 2026-10-12); lớp nào trang ghi mà kit cũ KHÔNG có thì trước
   đây vô tác dụng (`p-3`, `my-4`, `ml-2`, `mb-5`… — AI quen tay Tailwind). Nay utilities.css của sd-core có ~4.600
   lớp, nên các lớp "chết" đó bỗng có nghĩa px → lệch. Ngoài ra lớp tiện ích kit cũ KHÔNG !important (inline style
   và CSS của trang đè được), sd-core thì !important (đè lại trang). OLD_SOFT = lớp kit cũ có mà không !important. */
const OLD_SOFT = new Set(`
  T10M T10R T12M T12R T14M T14R T16M T16R T18M T20M T24M align-items-center border-b col-span-1 col-span-12 col-span-2
  col-span-3 col-span-4 col-span-6 col-span-8 col-span-9 cursor-pointer d-flex d-none flex flex-1 flex-col flex-column
  flex-shrink-0 flex-wrap font-medium font-semibold gap-1 gap-12 gap-16 gap-2 gap-3 gap-4 gap-6 gap-8 grid-cols-1
  grid-cols-12 grid-cols-2 grid-cols-3 grid-cols-4 grid-cols-6 hidden inline-flex items-center justify-between
  justify-content-between justify-content-center justify-content-start material-icons material-icons-outlined
  material-symbols-outlined mb-0 mb-1 mb-2 mb-3 mb-4 mb-6 mi-2xl mi-3xl mi-lg mi-md mi-sm mi-xl mi-xs ml-4 ml-8 ml-auto
  mr-2 mr-8 msi-lg msi-md msi-sm msi-xl msi-xs mt-0 mt-1 mt-2 mt-3 mt-4 mt-6 p-0 p-16 p-4 p-5 p-6 pt-0 px-16 px-4 py-2
  py-8 relative rounded-lg sd-input-action-icon sr-only text-mono text-muted text-right text-sm text-tabular text-xs
  truncate w-full
`.trim().split(/\s+/));
const OLD_KNOWN = new Set([...OLD_SOFT, ...`
  align-middle bg-black bg-black100 bg-black200 bg-black300 bg-black400 bg-black500 bg-dark bg-error bg-error-dark
  bg-error-light bg-info bg-info-dark bg-info-light bg-light bg-primary bg-primary-dark bg-primary-light bg-secondary
  bg-secondary-dark bg-secondary-light bg-success bg-success-dark bg-success-light bg-warning bg-warning-dark
  bg-warning-light bg-white border-black border-black100 border-black200 border-black300 border-black400 border-black500
  border-bottom border-dark border-error border-error-dark border-error-light border-info border-info-dark
  border-info-light border-light border-primary border-primary-dark border-primary-light border-secondary
  border-secondary-dark border-secondary-light border-success border-success-dark border-success-light border-top
  border-warning border-warning-dark border-warning-light border-white justify-content-end m-0 mb-16 mb-8 p-8 px-0 px-3
  py-12 text-black text-black100 text-black200 text-black300 text-black400 text-black500 text-center text-dark text-error
  text-error-dark text-error-light text-info text-info-dark text-info-light text-light text-primary text-primary-dark
  text-primary-light text-secondary text-secondary-dark text-secondary-light text-success text-success-dark
  text-success-light text-warning text-warning-dark text-warning-light text-white align-items-start border-0 col-1 col-10
  col-11 col-12 col-2 col-3 col-4 col-5 col-6 col-7 col-8 col-9 mb-12 mr-16 mr-4 mt-16 mx-0 px-8 rounded-8 row
  sd-image-image-error text-wrap visible
`.trim().split(/\s+/)]);

/* utilities.css hiện tại: lớp → { thuộc tính: !important? } (chỉ luật một lớp, ngoài @media) */
function loadNewUtil() {
  const map = {};
  try {
    let css = fs.readFileSync(path.join(KIT_ROOT, 'design-system/core/styles/utilities.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    css = css.replace(/@media[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, '');
    for (const m of css.matchAll(/([^{}@]+)\{([^{}]*)\}/g)) {
      for (const sel of m[1].split(',')) {
        const t = (sel.trim().match(/^\.(-?[A-Za-z_][\w-]*)$/) || [])[1]; if (!t) continue;
        const p = map[t] || (map[t] = {});
        for (const d of m[2].split(';')) { const i = d.indexOf(':'); if (i < 0) continue;
          const k = d.slice(0, i).trim().toLowerCase(); if (k) p[k] = p[k] || /!important/.test(d); }
      }
    }
  } catch (e) {}
  return map;
}
const NEW_UTIL = loadNewUtil();

const LONG = { margin: ['margin-top', 'margin-right', 'margin-bottom', 'margin-left'], padding: ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'],
  gap: ['row-gap', 'column-gap'], 'grid-gap': ['row-gap', 'column-gap'], flex: ['flex-grow', 'flex-shrink', 'flex-basis'], 'flex-flow': ['flex-direction', 'flex-wrap'],
  overflow: ['overflow-x', 'overflow-y'], inset: ['top', 'right', 'bottom', 'left'], 'border-radius': ['border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius'],
  font: ['font-size', 'font-weight', 'line-height', 'font-family', 'font-style'] };
const expand = p => LONG[p] || [p];
const overlaps = (a, b) => expand(a).some(x => expand(b).includes(x));
/* thuộc tính !important của lớp mới mà kit cũ là "mềm" → nơi trang từng thắng nay thua */
let UPGRADE = false;   // đang nâng lại trang đã chạy bản trước (v1 / v2)
function hardened(tok) {
  const p = NEW_UTIL[tok]; if (!p || !(OLD_SOFT.has(tok) || (UPGRADE && SP_OUT.has(tok)))) return [];
  return Object.keys(p).filter(k => p[k]);
}

/* CSS của chính trang (<style> + file .css cạnh trang, trừ CSS kit): lớp có định nghĩa + luật một-lớp `.x{…}` */
function pageCss(s, file) {
  let css = [...s.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]).join('\n');
  for (const m of s.matchAll(/<link[^>]+href=["']([^"']+\.css)["']/gi)) {
    if (/core\/styles\/|^https?:/.test(m[1])) continue;
    try { css += '\n' + fs.readFileSync(path.resolve(path.dirname(file), m[1]), 'utf8'); } catch (e) {}
  }
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const tokens = new Set(css.match(/\.(-?[A-Za-z_][\w-]*)/g)?.map(x => x.slice(1)) || []);
  const flat = css.replace(/@media[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, '');
  const single = {};
  for (const m of flat.matchAll(/([^{}@]+)\{([^{}]*)\}/g)) {
    for (const sel of m[1].split(',')) {
      const t = (sel.trim().match(/^\.(-?[A-Za-z_][\w-]*)$/) || [])[1]; if (!t) continue;
      const p = single[t] || (single[t] = []);
      for (const d of m[2].split(';')) { const i = d.indexOf(':'); if (i > 0 && !/!important/.test(d)) p.push(d.slice(0, i).trim().toLowerCase()); }
    }
  }
  /* lớp JS dùng làm móc (querySelector('.x'), closest, classList.contains/toggle…, getElementsByClassName) — không gỡ */
  const hooks = new Set();
  for (const js of s.match(/<script\b[^>]*>[\s\S]*?<\/script>/gi) || []) {
    for (const m of js.matchAll(/['"`][^'"`\n]*?\.(-?[A-Za-z_][\w-]*)/g)) hooks.add(m[1]);
    for (const m of js.matchAll(/(?:classList\.\w+|getElementsByClassName|hasClass|toggleClass)\(([^)]*)\)/g)) for (const t of m[1].match(/[A-Za-z_][\w-]*/g) || []) hooks.add(t);
  }
  return { tokens, single, hooks, css };
}

/* 9. Va chạm !important trên từng thẻ: (a) inline style cùng thuộc tính với lớp tiện ích → thêm !important vào khai báo
   inline (inline từng thắng); (b) luật `.lớp-của-trang{…}` phủ HẾT thuộc tính của lớp tiện ích trên cùng thẻ → bỏ lớp
   tiện ích (trước đây nó vô hiệu); phủ một phần thì báo. */
function fixCollisions(s, st, pc) {
  return s.replace(/<([a-z][\w-]*)(\s[^<>]*?)(\/?)>/gi, (m, tag, attrs, sl) => {
    const cm = attrs.match(/(\sclass\s*=\s*)(\\?["'])(.*?)\2/i); if (!cm || /['"]\s*\+|\$\{/.test(cm[3])) return m;
    const toks = cm[3].split(/\s+/).filter(Boolean);
    const hard = toks.map(t => [t, hardened(t)]).filter(([, p]) => p.length); if (!hard.length) return m;
    let out = attrs, drop = new Set(), split = new Map();
    const sm = attrs.match(/(\sstyle\s*=\s*)(\\?["'])(.*?)\2/i);
    if (sm && !/['"]\s*\+|\$\{/.test(sm[3])) {
      let changed = false;
      const decl = sm[3].split(';').map(d => {
        const i = d.indexOf(':'); if (i < 0 || /!important/.test(d)) return d;
        const k = d.slice(0, i).trim().toLowerCase();
        if (hard.some(([, ps]) => ps.some(p => overlaps(p, k)))) { changed = true; st.inline++; return d.replace(/\s*$/, ' !important'); }
        return d;
      }).join(';');
      if (changed) out = out.replace(sm[0], sm[1] + sm[2] + decl + sm[2]);
    }
    const prAll = [...new Set(toks.filter(c => pc.single[c] && !NEW_UTIL[c]).flatMap(c => pc.single[c]))];
    for (const [u, ps] of hard) {
      const covered = p => prAll.some(k => k === p || expand(k).includes(p)) || expand(p).every(x => prAll.some(k => expand(k).includes(x)));
      const hit = ps.filter(p => prAll.some(k => overlaps(p, k)));
      if (!hit.length) continue;
      if (ps.every(covered)) { drop.add(u); st.collide++; continue; }
      /* phủ một phần lớp m/p (vd `p-16` + `.x{padding-left:0}`) → tách theo cạnh, bỏ cạnh trang đã khai: pt-16 pr-16 pb-16 */
      const mp = u.match(/^(m|p)([xytrbl]?)-(\d+|auto)$/);
      if (mp) {
        const SIDES = { '': 'trbl', x: 'rl', y: 'tb', t: 't', r: 'r', b: 'b', l: 'l' }, NAME = { t: 'top', r: 'right', b: 'bottom', l: 'left' };
        const prop = mp[1] === 'm' ? 'margin' : 'padding';
        const keep = [...SIDES[mp[2]]].filter(c => !covered(prop + '-' + NAME[c])).map(c => mp[1] + c + '-' + mp[3]);
        if (keep.every(t => NEW_UTIL[t])) { split.set(u, keep.map(t => KEEP + t).join(' ')); st.collide++; continue; }
      }
      st.notes.push('<' + tag + ' class="' + cm[3].slice(0, 50) + '">: lớp ' + u + ' nay !important, đè một phần CSS của trang (' + hit.join(', ') + ') — kiểm tra hình');
    }
    if (drop.size || split.size) {
      const nc = cm[3].split(/(\s+)/).filter(x => !drop.has(x)).map(x => split.get(x) || x).join('').replace(/\s{2,}/g, ' ').trim();
      out = out.replace(cm[0], cm[1] + cm[2] + nc + cm[2]);
    }
    return '<' + tag + out + sl + '>';
  });
}

/* 10. Trang tự định nghĩa lớp trùng tên lớp tiện ích sd-core (`.p-3{padding:12px}`): nay utilities !important thắng
   → thêm !important vào khai báo của trang (trang từng thắng vì đứng sau). Chỉ luật một-lớp trong <style> của trang. */
function fixPageUtilDefs(s, st) {
  return s.replace(/(<style[^>]*>)([\s\S]*?)(<\/style>)/gi, (m, a, css, z) => a + css.replace(/(^|[}\s])(\.(-?[A-Za-z_][\w-]*))(\s*\{)([^{}]*)\}/g, (mm, pre, sel, t, ob, body) => {
    const p = NEW_UTIL[t]; if (!p || !Object.values(p).some(Boolean)) return mm;
    if (OLD_KNOWN.has(t) && !OLD_SOFT.has(t)) return mm;   // kit cũ đã !important (vd text-primary) → trang vốn thua, giữ nguyên
    st.pagedef++;
    return pre + sel + ob + body.split(';').map(d => (d.includes(':') && !/!important/.test(d)) ? d.replace(/\s*$/, ' !important') : d).join(';') + '}';
  }) + z);
}

/* 11. Ô nhập sd-* trong ô bảng tự viết (<td>) và ô tìm kiếm không nhãn → `hideInlineError` (quy tắc kit: hàng công cụ /
   ô bảng không chừa 20px vạch lỗi; kit tự bật cho thead, filter-bar… nhưng không cho bảng do trang tự dựng). */
const FIELD = 'sd-(?:input|select|date|datetime|date-range|autocomplete|input-number|textarea|chip|chip-calendar)';
function addHie(tagText, st) {
  if (/\shideinlineerror\b/i.test(tagText)) return tagText;
  st.hie++; return tagText.replace(new RegExp('^<(' + FIELD + ')\\b'), '<$1 hideInlineError');
}
function fixInlineError(s, st) {
  s = s.replace(/<td\b[^>]*>(?:(?!<\/?td\b)[\s\S])*?<\/td>/gi, cell =>
    cell.replace(new RegExp('<' + FIELD + '\\b[^<>]*>', 'g'), t => addHie(t, st)));
  s = s.replace(/<sd-input\b[^<>]*>/g, t => (!/\slabel=/i.test(t) && /\splaceholder=\\?["']\s*Tìm/i.test(t)) ? addHie(t, st) : t);
  return s;
}

/* 12. Khối thông báo tự dựng → `<sd-inform>` (Core #c-inform). Trang cũ / AI hay dựng dải báo bằng `div` tô
   `background:var(--color-X-50)` + viền + icon viền + tiêu đề / thân tô màu (hoặc `div.alert.alert-X` của kit cũ) — khác
   hẳn Core (icon đặc, thân chữ thường #212121, đệm 12px 16px). Chỉ đổi khi chắc: thân chỉ có chữ + span/div/strong/br…,
   không có id bên trong (JS có thể ghi vào), không nằm trong <script>. Còn lại báo `!`. */
const INFORM_DEFAULT_ICON = { primary: 'info', secondary: 'info', info: 'info', success: 'check_circle', warning: 'warning', error: 'error' };
/* bản viền của icon mặc định — Core dùng bản đặc của chính icon đó */
const INFORM_OUTLINE_ALIAS = { warning_amber: 'warning', report_problem: 'warning', info_outline: 'info', error_outline: 'error', check_circle_outline: 'check_circle', task_alt: 'check_circle' };
const attrQ = t => t.replace(/&(?![\w#]+;)/g, '&amp;').replace(/"/g, '&quot;');
/* Lớp CSS của trang tô nền nhạt theo màu trạng thái → hộp thông báo tự dựng (2026-10-15: trước chỉ nhận style viết thẳng
   trên thẻ, hộp tô bằng lớp — `.reject-banner{background:var(--color-warning-50)…}` — bị bỏ sót, vẫn vẽ tay, lệch Core). */
const BANNER_NAME = /(alert|banner|notice|callout|inform|warning|warn|caution|reject|reason|hint|tip|message|msg|note)/i;
function bannerClasses(pc) {
  const map = {};
  const flat = ((pc && pc.css) || '').replace(/@media[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, '');
  for (const m of flat.matchAll(/([^{}@]+)\{([^{}]*)\}/g)) {
    const bg = m[2].match(/background(?:-color)?\s*:\s*var\(--(?:color-(info|warning|error|danger|success|primary)-(?:50|100)|sd-(info|warning|error|success|primary)-light)\)/i);
    if (!bg) continue;
    const border = /border(?:-left)?\s*:/.test(m[2]);
    for (const sel of m[1].split(',')) {
      const t = (sel.trim().match(/^\.(-?[A-Za-z_][\w-]*)$/) || [])[1]; if (!t) continue;
      map[t] = { color: (bg[1] || bg[2]).toLowerCase().replace('danger', 'error'), border };
    }
  }
  return map;
}
function fixHandBanner(s, st, pc, src) {
  const BC = bannerClasses(pc);
  const js = ((src || s).match(/<script\b[^>]*>[\s\S]*?<\/script>/gi) || []).join('\n');
  const parts = s.split(/(<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>)/i);
  for (let pi = 0; pi < parts.length; pi += 2) {
    let h = parts[pi], out = '', pos = 0;
    const open = /<div\b([^>]*)>/gi; let m;
    while ((m = open.exec(h))) {
      const attrs = m[1];
      const bg = attrs.match(/style\s*=\s*"[^"]*background(?:-color)?\s*:\s*var\(--color-(info|warning|error|success|primary)-(?:50|100)\)/i);
      const al = attrs.match(/class\s*=\s*"[^"]*\balert\s+alert-(info|warning|error|danger|success)\b/i);
      const ownCls = ((attrs.match(/class\s*=\s*"([^"]*)"/) || [])[1] || '').split(/\s+/).filter(Boolean);
      const bcName = !bg && !al ? ownCls.find(c => BC[c] && BANNER_NAME.test(c)) : null;
      const bcm = bcName ? [null, BC[bcName].color] : null;
      if (!bg && !al && !bcm) continue;
      /* tìm </div> khớp */
      let depth = 1, re = /<div\b[^>]*>|<\/div>/gi, mm; re.lastIndex = open.lastIndex;
      while (depth && (mm = re.exec(h))) depth += mm[0][1] === '/' ? -1 : 1;
      if (depth) continue;
      const inner = h.slice(open.lastIndex, mm.index), end = re.lastIndex;
      const color = ((bg || al || bcm)[1] || '').toLowerCase().replace('danger', 'error');
      const isBanner = al || /border(?:-left)?\s*:[^;"]*var\(--color-/.test(attrs) || /material-icons/.test(inner) || (bcName && BC[bcName].border);
      if (!isBanner) continue;
      const idOwn = (attrs.match(/\sid\s*=\s*"([^"]*)"/) || [])[1];
      const boxy = c => BC[c] || (pc && pc.single && (pc.single[c] || []).some(k => /^(background|border|padding|color|box-shadow|border-radius)/.test(k)));
      /* JS dùng lớp tô hộp làm móc, hoặc JS ghi chữ vào hộp qua id → không chắc → không đổi */
      const jsHook = (pc && pc.hooks && ownCls.find(c => pc.hooks.has(c) && (bcName || boxy(c)))) ||
        (idOwn && new RegExp('[\'"#]' + idOwn.replace(/[-]/g, '\\-') + '[\'"]').test(js) && /\.(innerHTML|textContent|innerText)\s*\+?=|insertAdjacentHTML|\.append(Child)?\(/.test(js) ? '#' + idOwn : '');
      if (jsHook) { st.notes.push('khối thông báo tự dựng (' + color + ') — JS của trang dùng ' + (jsHook[0] === '#' ? jsHook : '.' + jsHook) + ' (bật / tắt, ghi chữ) → đổi tay sang <sd-inform color="' + color + '"> (ghi chữ bằng setAttribute(\'description\', …))'); continue; }
      const why = /<(?!\/?(?:div|span|strong|b|em|i|br|p|small|code)\b)[a-z]/i.test(inner) ? 'có thẻ khác ngoài chữ (nút / ô nhập / bảng…)'
        : /\sid\s*=/.test(inner) ? 'có id bên trong (JS có thể ghi vào)' : /\$\{|'\s*\+/.test(inner) ? 'nội dung dựng bằng JS' : '';
      const txt0 = inner.replace(/\s+/g, ' ').replace(/<[^>]+>/g, '').trim().slice(0, 50);
      if (why) { st.notes.push('khối thông báo tự dựng (' + color + ') "' + txt0 + '…" — ' + why + ' → đổi tay sang <sd-inform color="' + color + '">'); continue; }
      let body = inner, icon = '';
      body = body.replace(/<span\b[^>]*class="[^"]*material-(?:icons|symbols)[^"]*"[^>]*>\s*([\w]+)\s*<\/span>/i, (x, n) => { icon = n; return ''; });
      let title = '';
      body = body.replace(/<(div|span|p|strong|b)\b([^>]*)>((?:(?!<\/?\1\b)[\s\S])*?)<\/\1>/i, (x, tag, a, t) => {
        const strong = /^(strong|b)$/i.test(tag) || /font-(?:semibold|medium|bold)|font-weight-(?:bold|medium|bolder)|\bT1[2-8][MB]\b|title/.test(a);
        const before = body.slice(0, body.indexOf(x)).replace(/<[^>]+>/g, '').trim();
        if (!strong || before) return x;
        title = t; return '';
      });
      const clean = t => t.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      title = clean(title); const desc = clean(body);
      if (!title && !desc) continue;
      /* lớp của trang tô hộp (nền / viền / đệm…) không gắn lên sd-inform — sẽ vẽ chồng lên khung Core (boxy ở trên) */
      const cls = ((attrs.match(/class\s*=\s*"([^"]*)"/) || [])[1] || '').split(/\s+/)
        .filter(c => /^-?m[tbrlxy]?-(\d+|auto)$/.test(c) || (c && !NEW_UTIL[c] && !OLD_KNOWN.has(c) && !boxy(c) && !/^(alert|alert-\w+|rounded-lg|items-start|items-center|flex|text-sm|text-xs)$/.test(c)));
      const id = (attrs.match(/\sid\s*=\s*"([^"]*)"/) || [])[1];
      const hidden = /display\s*:\s*none/.test(attrs);
      const margins = (((attrs.match(/style\s*=\s*"([^"]*)"/) || [])[1] || '').match(/(?:^|;)\s*margin(?:-(?:top|right|bottom|left))?\s*:[^;]+/g) || []).map(d => d.replace(/^;?\s*/, '').trim());
      const tag = '<sd-inform' + (id ? ' id="' + id + '"' : '') + ' color="' + color + '"' + (icon && icon !== INFORM_DEFAULT_ICON[color] && INFORM_OUTLINE_ALIAS[icon] !== INFORM_DEFAULT_ICON[color] ? ' icon="' + icon + '"' : '') +
        (cls.length ? ' class="' + cls.join(' ') + '"' : '') + (hidden || margins.length ? ' style="' + [...margins, ...(hidden ? ['display:none'] : [])].join('; ') + ';"' : '') +
        (title ? ' title="' + attrQ(title) + '"' : '') + (desc ? ' description="' + attrQ(desc) + '"' : '') + '></sd-inform>';
      out += h.slice(pos, m.index) + tag; pos = end; open.lastIndex = end; st.inform++;
    }
    parts[pi] = out + h.slice(pos);
  }
  return parts.join('');
}

/* 14. (lib/components.mjs) markup tự dựng → component Core; tên cũ của kit → tên Core. legacy-shim.js nối JS cũ. */
function compSummary(st) {
  const parts = Object.entries(st.comp || {}).map(([k, v]) => k + ' ' + v);
  return 'component: ' + (parts.length ? parts.join(', ') : '0') + ' · tên cũ → Core ' + (st.alias || 0);
}
function linkShim(s, st) {
  if (!/data-legacy-(change|modal|toggle|title|onselect|panel|onclose|upgrade|minw|dom)/.test(s) || /legacy-shim\.js/.test(s)) return s;
  const m = s.match(/<script[^>]+src=["']([^"']*?)sd-components\/sd-components\.js["'][^>]*><\/script>/i);
  if (!m) { st.notes.push('không thấy <script> sd-components.js — tự thêm design-system/core/js/legacy-shim.js'); return s; }
  st.shim = true;
  return s.replace(m[0], m[0] + '\n<script src="' + m[1] + 'core/js/legacy-shim.js"></script>   <!-- ' + MARK + ': nối JS cũ với component Core -->');
}

/* Thẻ / thuộc tính / lớp kit cũ có mà kit hiện tại (= catalog 19.0.10) không có. Chỉ BÁO — cách thay tuỳ ngữ cảnh. */
const GONE = [
  [/<sd-button-item\b/, 'sd-button-item / sd-button-item-divider (menu của sd-button, đã gỡ 2026-10-13)', 'dựng menu bằng sd-button + danh sách tự viết, hoặc cột command/menu của sd-table'],
  [/<sd-scorecard\b/, 'sd-scorecard (kit cũ — nay tự vẽ bằng thẻ catalog, không mất số liệu)', 'nên đổi thẳng: thẻ bấm lọc → <bpm-filter-scorecard key label value [active]> (sự kiện sd-filter-toggle), thẻ chỉ xem (interactive="false") → <bpm-kpi-card icon label value>; đơn vị ghép vào value'],
  [/<sd-button\b[^>]*\bcolor=(["'])black\1/, 'sd-button color="black" (đã gỡ)', 'chọn màu catalog: secondary (xám) hoặc primary'],
  [/<sd-button\b[^>]*\btype=(["'])(?!(?:fill|light|outline|link|text)\1)[^"']*\1/, 'sd-button type lạ (chỉ fill / light / outline / link)', 'type khác → thư viện KHÔNG vẽ nút; đổi sang một trong bốn loại'],
  [/<sd-button\b[^>]*\sopenOnHover\b/i, 'sd-button openOnHover', 'bỏ — menu của sd-button đã gỡ'],
  [/<sd-button\b[^>]*>[^<]*<(?!\/sd-button)/, 'sd-button có thẻ con', 'sd-button không chiếu nội dung — dùng title / prefixIcon / suffixIcon'],
  [/sd-item-click|['"]sd-click['"]/, 'sự kiện sd-item-click / sd-click', 'nghe sự kiện click thường'],
  [/<sd-section\b[^>]*\savatar=/i, 'sd-section avatar', 'ghi số / chữ vào title'],
  [/<sd-section-item\b[^>]*\sfield=/i, 'sd-section-item field', 'dùng label + nội dung trong thẻ'],
  [/<sd-anchor\b[^>]*\shideNavOnMobile\b/i, 'sd-anchor hideNavOnMobile', 'bỏ'],
  [/<sd-checkbox\b[^>]*\s(?:error|helperText|indeterminate|size)\b/i, 'sd-checkbox error / helperText / indeterminate / size', 'catalog không có — bỏ (lỗi / gợi ý viết dòng chữ riêng bên dưới)'],
  [/\.(?:toggleAttribute|setAttribute)\(\s*['"]indeterminate['"]/, 'JS đặt indeterminate cho sd-checkbox', 'sd-checkbox không có indeterminate — chọn tất cả dùng selection của sd-table'],
  [/<sd-(?:date|datetime)\b[^>]*\sclearable\b/i, 'sd-date / sd-datetime clearable', 'bỏ — catalog không có'],
  [/<sd-datetime\b[^>]*\shelperText=/i, 'sd-datetime helperText', 'bỏ — catalog không có'],
  [/<sd-input\b[^>]*\s(?:blurOnEnter|clearable|field|focusForceBlur|mask|mode)\b/i, 'sd-input blurOnEnter / clearable / field / focusForceBlur / mask / mode', 'catalog không có — bỏ; xem chế độ xem dùng viewed'],
  [/<sd-input\b[^>]*\sprefixIcon=/i, 'sd-input prefixIcon', 'catalog chỉ có suffix / suffixIcon'],
  [/<sd-(?:select|textarea)\b[^>]*\smode=/i, 'sd-select / sd-textarea mode', 'bỏ; chế độ xem dùng viewed'],
  [/<sd-switch\b[^>]*\ssize=/i, 'sd-switch size', 'bỏ — catalog chỉ một cỡ'],
  [/<sd-upload-file\b[^>]*\smax(?:Height|Width)=/i, 'sd-upload-file maxHeight / maxWidth', 'bỏ — catalog không có'],
  [/<sd-table\b[^>]*\shideReadError\b/i, 'sd-table hideReadError', 'bỏ'],
  [/\bsite-tab(?:-zone|s)?\b/, 'lớp site-tab* (tab cấp trang của kit cũ, đã gỡ)', 'dùng sd-tab-group'],
  [/\bsd-input-action\b/, 'lớp sd-input-action (kit cũ)', 'dùng suffixIcon của sd-input hoặc sd-button cạnh ô'],
  [/data-site-tabs=/, 'data-site-tabs của page-header (đã gỡ)', 'dùng sd-tab-group dưới header'],
  [/data-pattern=["']data-table["']/, 'pattern data-table (ngừng dùng)', 'dùng <sd-table>']
];


/* 0. Vùng NỘI DUNG không được đụng (2026-10-15): chữ / mã mẫu hiển thị nguyên văn — <pre>, <code>, <xmp> — và nội dung soạn
   thảo của sd-mini-editor / sd-editor / sd-document-builder / sd-code-editor / [contenteditable]. Trước đây bước đánh dấu
   reset chèn `data-legacy-reset` vào HTML của trình soạn thảo (lộ ra khi xuất nội dung), bước đổi tên cũ sửa cả đoạn mã
   mẫu trong sd-code-editor, bước đổi khoảng cách sửa chữ `class="mb-2"` trong <code>. Thẻ mở vẫn được nâng như thường,
   chỉ phần bên trong được cất đi rồi trả lại nguyên văn. */
const PROTECT_TAGS = /<(pre|code|xmp|sd-mini-editor|sd-editor|sd-document-builder|sd-code-editor|[a-z][\w-]*(?=[^>]*\scontenteditable(?:\s*=\s*["']?(?!false)[^"'\s>]*["']?)?[\s>]))\b[^>]*>/gi;
function protect(s) {
  const bag = [];
  let out = '', pos = 0, m;
  const re = new RegExp(PROTECT_TAGS.source, 'gi');
  while ((m = re.exec(s))) {
    if (m.index < pos) continue;
    const tag = m[1].toLowerCase(), from = m.index + m[0].length;
    if (m[0].endsWith('/>')) continue;
    const reC = new RegExp('<(/?)' + tag + '\\b[^>]*>', 'gi'); reC.lastIndex = from;
    let depth = 1, c;
    while ((c = reC.exec(s))) { if (c[1]) { if (--depth === 0) break; } else if (!c[0].endsWith('/>')) depth++; }
    if (!c || depth) continue;
    const inner = s.slice(from, c.index);
    if (!inner) { re.lastIndex = c.index + c[0].length; continue; }
    out += s.slice(pos, from) + '⁠P' + bag.length + '⁠';
    bag.push(inner); pos = c.index; re.lastIndex = c.index + c[0].length;
  }
  out += s.slice(pos);
  return { s: out, restore: t => t.replace(/⁠P(\d+)⁠/g, (x, i) => bag[+i]) };
}


/* 15. Nâng tiếp trang v4 (2026-10-15): bề rộng tối thiểu công cụ v4 ghi cứng `style="min-width:Nch"` lên sd-select / ô nhập
   đã đổi → `data-legacy-minw` (legacy-shim chỉ áp trong hàng flex; trong ô lưới hẹp min-width làm ô tràn đè cột bên cạnh). */
function upgradeMinW(s, st) {
  return s.replace(/<(sd-(?:select|input|input-number|date|datetime|autocomplete|textarea))\b([^>]*?)\sstyle="([^"]*)"([^>]*)>/g, (m, tag, a, style, b) => {
    const mm = style.match(/(?:^|;)\s*min-width:\s*(\d+ch|180px|160px)\s*;?\s*$/);
    if (!mm || /data-legacy-minw/.test(a + b)) return m;
    const rest = style.slice(0, mm.index).replace(/;\s*$/, '').trim();
    st.minw = (st.minw || 0) + 1;
    return '<' + tag + a + (rest ? ' style="' + rest + '"' : '') + ' data-legacy-minw="' + mm[1] + '"' + b + '>';
  });
}


/* 16. sd-table của trang cũ → `data-legacy-dom` (2026-10-15). Kit cũ vẽ [chọn][cây]["#"][cột…] và mỗi dòng dữ liệu một
   <tr>; trang cũ ĐẾM Ô theo vị trí (`td.c-td:nth-child(2){display:none}` ẩn "#", `cells[7].innerHTML = …`, `tbody tr`
   thứ i = dòng thứ i). Kit mới theo catalog bỏ "#" và chèn `tr.c-detail-row` → lệch một ô / một dòng (cột Mã biến mất,
   ô bị ghi đè sai cột). Thuộc tính này bật chế độ tương thích của sd-table (cột "#" như kit cũ, không chèn dòng chi tiết, giữ ô
   trang tự sửa khi vẽ lại); ô / dòng / chân bảng vẫn vẽ theo catalog. Gắn cả thẻ trong chuỗi JS (thuộc tính không giá trị, không đụng dấu nháy). */
function markLegacyTables(s, st) {
  return s.replace(/<sd-table(?=[\s>\/])(?![^>]*\bdata-legacy-dom\b)/g, () => { st.ltable = (st.ltable || 0) + 1; return '<sd-table data-legacy-dom'; });
}


/* 17. sd-button type lạ (`type="primary"`, `type="secondary"`…) — kit cũ vẽ như `light`, thư viện / kit mới KHÔNG vẽ nút
   (mất nút, vd "Đẩy ERP"). Đổi thành `type="light"` = đúng hình kit cũ đã hiện (2026-10-15). Giá trị dựng bằng JS thì để nguyên. */
function fixButtonType(s, st) {
  return s.replace(/(<sd-button\b[^>]*?\stype=)(\\?["'])([^"'\\]*)\2/g, (m, a, q, v) => {
    if (/^(fill|light|outline|link|text)$/.test(v) || /[+$]/.test(v)) return m;
    st.btype = (st.btype || 0) + 1;
    return a + q + 'light' + q;
  });
}


/* 18. Mã RIÊNG của trang bám vào DOM BÊN TRONG component kit cũ (2026-10-15, prototype thật design-test: multi-filter.js,
   table-filter.js…). DOM bên trong sd-* nay là Material của catalog — selector cũ không còn tìm thấy gì: bộ lọc / phân trang /
   chọn nhiều tự viết lặng lẽ thôi chạy (hình không vỡ). Công cụ KHÔNG tự sửa (viết lại logic là việc của người dựng trang) —
   chỉ quét JS (trong trang + file .js cục bộ trang nạp) và CSS (trong trang + .css cục bộ), báo đúng chỗ + cách viết theo API. */
const HOOKS = [
  [/\.sd-dropdown-(?:item|menu|empty)(?![\w-])|sd-dropdown-item-label/, 'danh sách chọn bên trong sd-select / sd-autocomplete cũ (nay chỉ có trong overlay khi mở)', 'dùng thuộc tính `items` / `value` + sự kiện `sd-change`; chọn nhiều → `<sd-select multiple>` thay bộ chọn nhiều tự dựng'],
  [/input\.sd-input(?![\w-])|['"\s,>(]\.sd-input(?![\w-])/, '<input> bên trong sd-input / sd-select cũ (lớp `sd-input`)', 'đọc / ghi `el.value` của chính thẻ sd-*; nghe `input` / `sd-change`'],
  [/\.sd-textarea(?![\w-])/, '<textarea> bên trong sd-textarea cũ', '`el.value` của sd-textarea'],
  [/\.sd-form-field(?![\w-])/, 'khung `.sd-form-field` bên trong sd-* cũ', 'thao tác trên chính thẻ sd-* (value / disabled / required / error)'],
  [/\.c-checkbox-input(?![\w-])/, 'ô tick bên trong sd-checkbox cũ', '`el.checked` / thuộc tính `checked` + sự kiện `sd-change`'],
  [/c-has-filter|\.c-th-(?:filter|inner|label)(?![\w-])/, 'ô lọc trên tiêu đề sd-table cũ', 'sd-table nay LỌC THẬT theo `columns` (type, `option.items`) — bỏ mã lọc tự viết'],
  [/\.c-paginator-(?:center|nav)(?![\w-])|sd-page-size-select|aria-label=\\?["']Trang (?:đầu|trước|tiếp|cuối)/, 'chân phân trang sd-table cũ', 'sd-table nay PHÂN TRANG THẬT (`paginated`, `pageSize`, `pageSizes`) — bỏ mã tự cắt trang'],
  [/\.c-section-header|\.c-collapsable(?![\w-])/, 'đầu sd-section cũ', 'thuộc tính `title` / `collapsible` / `[sdHeaderRight]` của sd-section'],
  /* 2026-10-30 — sd-table theo 22.2.14: tiêu đề sắp xếp nay là `.sd-table-sort-header` (bỏ `.mat-sort-header*` của 19.0.10) */
  [/\.mat-sort-header(?:-container|-content|-disabled)?(?![\w-])/, 'tiêu đề sắp xếp bên trong sd-table (19.0.10)', 'khai `"sortable": true` / `defaultSort` trên cột — sd-table tự sắp xếp, không bắt sự kiện vào tiêu đề']
];
const HOOK_SEEN = new Map();   // file dùng chung (.js / .css) → đã quét
const REPORT = { pages: new Map(), shared: new Map() };
function hookScan(text, kind) {
  const found = [];
  const lines = text.split('\n');
  for (const [re, what, how] of HOOKS) {
    const hits = [];
    lines.forEach((ln, i) => {
      let t = ln;
      if (kind === 'css') { const b = t.indexOf('{'); if (b >= 0) t = t.slice(0, b); else if (/[:;]\s*[^,]*$/.test(t) && !/,\s*$/.test(t)) return; }
      const m = t.match(re); if (m) hits.push({ line: i + 1, sel: m[0].trim() });
    });
    if (hits.length) found.push({ what, how: kind === 'css' ? 'luật CSS này nay không khớp phần tử nào (DOM bên trong theo catalog) — bỏ; đừng viết lại cho DOM mới (Rule 0b: component cơ bản không custom)' : how, hits });
  }
  return found;
}
/* Khung Bộ lọc (pattern filter-bar) — 2026-10-15 kit tự lọc sd-table phía sau theo từng ô: `data-field`, hoặc nhãn ô trùng tiêu
   đề cột (sd-components.js mục "Bộ lọc ngoài → sd-table"). Báo các ô KHÔNG gắn được cột để người dùng kit / AI khai
   `data-field` (luật nghiệp vụ riêng → thêm trường tính sẵn vào data rồi trỏ data-field vào đó). Chỉ báo, không sửa. */
function sdNormLabel(t) {
  return String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd')
    .replace(/[:：…]+\s*$/, '').replace(/\.{2,}\s*$/, '').replace(/\*\s*$/, '').replace(/\s+/g, ' ').trim();
}
function filterBarReport(f, src) {
  const notes = [];
  const re = /<div\b[^>]*data-pattern=["']filter-bar["'][^>]*>/gi;
  let m;
  while ((m = re.exec(src))) {
    const rest = src.slice(m.index + m[0].length);
    const tIdx = rest.search(/<sd-table\b/);
    if (tIdx < 0) continue;
    const forId = (m[0].match(/data-for=["']([^"']+)["']/) || [])[1];
    let tableTag = rest.slice(tIdx);
    if (forId) { const tm = src.match(new RegExp('<sd-table\\b[^>]*\\bid=["\']' + forId + '["\'][\\s\\S]*?>')); if (tm) tableTag = tm[0]; }
    const colsRaw = (tableTag.match(/\scolumns\s*=\s*'([\s\S]*?)'/) || [])[1];
    let cols; try { cols = JSON.parse(colsRaw); } catch (e) { continue; }
    if (!Array.isArray(cols)) continue;
    const titles = new Set(cols.map(c => sdNormLabel(c && (typeof c.title === 'object' ? c.title && c.title.title : c.title))));
    const block = rest.slice(0, tIdx);
    const ctl = [...block.matchAll(/<(sd-(?:input|input-number|select|autocomplete|date|datetime|date-range|checkbox|switch))\b([^>]*)>/gi)];
    const miss = [];
    for (const c of ctl) {
      const at = c[2];
      if (/\sdata-field=/.test(at)) continue;
      const lab = (at.match(/\slabel\s*=\s*["']([^"']*)["']/) || at.match(/\splaceholder\s*=\s*["']([^"']*)["']/) || [])[1] || '';
      const n = sdNormLabel(lab);
      if (titles.has(n)) {
        /* ô chọn trùng tiêu đề cột nhưng không mục nào khớp dữ liệu cột (mã hoặc tên) → kit bỏ qua ô này lúc chạy */
        const col = cols.find(x => x && sdNormLabel(typeof x.title === 'object' ? x.title && x.title.title : x.title) === n);
        const itemsRaw = (at.match(/\sitems\s*=\s*'([\s\S]*?)'/) || [])[1];
        const dataRaw = (tableTag.match(/\sdata\s*=\s*'([\s\S]*?)'/) || [])[1];
        let items, rows; try { items = JSON.parse(itemsRaw); rows = JSON.parse(dataRaw); } catch (e) { continue; }
        if (!Array.isArray(items) || !Array.isArray(rows) || !rows.length || !col) continue;
        const show = v => { const o = col.option && Array.isArray(col.option.items) ? col.option.items.find(i => i && String(i[col.option.valueField || 'id']) === String(v)) : null; return sdNormLabel(o ? o[col.option.displayField || 'name'] : v); };
        const vals = new Set(rows.flatMap(r => r ? [sdNormLabel(r[col.field]), show(r[col.field])] : []));
        const hit = items.some(i => i && (vals.has(sdNormLabel(typeof i === 'object' ? i.id : i)) || vals.has(sdNormLabel(typeof i === 'object' ? i.name : i))));
        if (!hit) miss.push('"' + lab + '" (mục chọn không khớp dữ liệu cột)');
        continue;
      }
      if (c[1].toLowerCase() === 'sd-input' && /^(tim kiem|tim|tu khoa|search)\b/.test(n)) continue;
      miss.push('"' + (lab || c[1]) + '"');
    }
    if (miss.length) notes.push('khung Bộ lọc: ' + miss.length + ' ô chưa gắn cột của bảng (' + miss.slice(0, 6).join(', ') + (miss.length > 6 ? '…' : '') +
      ') → kit KHÔNG lọc theo các ô này; thêm `data-field="<field>"` (field của cột / dữ liệu). Luật riêng (vd "Quá hạn" tính từ hạn xử lý) → thêm trường tính sẵn vào data rồi trỏ data-field vào đó');
  }
  if (notes.length) REPORT.pages.set(f, (REPORT.pages.get(f) || []).concat(notes));
}
function hookReportPage(f, src) {
  filterBarReport(f, src);
  const local = (m, attr) => [...src.matchAll(new RegExp('<' + m + '\\b[^>]*\\s' + attr + '\\s*=\\s*["\']([^"\']+)["\']', 'gi'))].map(x => x[1])
    .filter(u => !/^(https?:|data:|\/\/)/.test(u) && !/design-system\//.test(u));
  /* giữ đúng số dòng của file: dòng ngoài <script> / <style> thay bằng dòng trống */
  const keepOnly = re => { const lines = src.split('\n').map(() => ''); for (const m of src.matchAll(re)) { const l0 = src.slice(0, m.index).split('\n').length - 1; m[0].split('\n').forEach((t, k) => { lines[l0 + k] = t; }); } return lines.join('\n'); };
  const inlineJs = keepOnly(/<script\b(?![^>]*\bsrc=)[^>]*>[\s\S]*?<\/script>/gi);
  const inlineCss = keepOnly(/<style\b[^>]*>[\s\S]*?<\/style>/gi);
  const own = [...hookScan(inlineJs, 'js').map(x => ({ ...x, kind: 'JS' })), ...hookScan(inlineCss, 'css').map(x => ({ ...x, kind: 'CSS' }))];
  if (own.length) REPORT.pages.set(f, (REPORT.pages.get(f) || []).concat(own.map(o => 'mã trang (' + o.kind + ') dùng ' + o.what + ': `' + o.hits[0].sel + '`' + (o.hits.length > 1 ? ' ×' + o.hits.length : '') + ' (dòng ' + o.hits.slice(0, 3).map(h => h.line).join(', ') + ') → ' + o.how)));
  for (const [list, kind] of [[local('script', 'src'), 'js'], [local('link', 'href').filter(u => /\.css(\?|$)/.test(u)), 'css']]) {
    for (const u of list) {
      const abs = path.resolve(path.dirname(f), u.split('?')[0]);
      if (HOOK_SEEN.has(abs)) { HOOK_SEEN.get(abs).add(f); continue; }
      const users = new Set([f]); HOOK_SEEN.set(abs, users);
      let text; try { text = fs.readFileSync(abs, 'utf8'); } catch (e) { continue; }
      const r = hookScan(text, kind);
      if (r.length) REPORT.shared.set(abs, { kind: kind.toUpperCase(), items: r, users });
    }
  }
}
function writeReport() {
  const lines = [];
  if (REPORT.shared.size) {
    console.log('\nMÃ DÙNG CHUNG BÁM VÀO DOM BÊN TRONG COMPONENT KIT CŨ — không tự sửa, viết lại theo API (bộ lọc / phân trang / chọn nhiều tự viết sẽ thôi chạy):');
    lines.push('## Mã dùng chung bám vào DOM bên trong component kit cũ', '', 'DOM bên trong `sd-*` nay là Material của catalog. Các selector dưới đây không còn tìm thấy gì → phần việc của đoạn mã đó (bộ lọc, phân trang, chọn nhiều tự viết…) lặng lẽ thôi chạy; giao diện không vỡ. Viết lại theo API công khai của component.', '');
    for (const [abs, r] of REPORT.shared) {
      const rel = path.relative(process.cwd(), abs);
      console.log('  ! ' + rel + ' (' + r.kind + ', ' + r.users.size + ' trang dùng)');
      lines.push('### `' + rel + '` (' + r.kind + ' — ' + r.users.size + ' trang dùng)', '');
      for (const it of r.items) {
        const where = it.hits.slice(0, 4).map(h => h.line).join(', ') + (it.hits.length > 4 ? '…' : '');
        console.log('      · ' + it.what + ': `' + it.hits[0].sel + '` (dòng ' + where + ') → ' + it.how);
        lines.push('- ' + it.what + ': `' + it.hits[0].sel + '` — dòng ' + where + ' → ' + it.how);
      }
      lines.push('');
    }
  }
  if (DRY || (!REPORT.pages.size && !REPORT.shared.size)) return;
  const root = inputs.length === 1 && fs.statSync(inputs[0]).isDirectory() ? inputs[0] : process.cwd();
  const out = ['# Báo cáo nâng trang — ' + TODAY, '', 'Sinh bởi `ai-instructions/tools/migrate-prototype.mjs`. Mỗi dòng là một chỗ công cụ **không tự sửa** vì không chắc — sửa tay theo gợi ý (bảng đầy đủ: `ai-instructions/migrate-components.md` mục 3). Chạy lại công cụ sau khi sửa: trang đã nâng không bị đổi lần hai.', ''];
  if (REPORT.pages.size) {
    out.push('## Từng trang', '');
    for (const [f, notes] of REPORT.pages) { out.push('### `' + path.relative(root, f) + '`', ''); for (const n of notes) out.push('- ' + n); out.push(''); }
  }
  out.push(...lines);
  fs.writeFileSync(path.join(root, '_migrate-report.md'), out.join('\n'));
  console.log('\nBáo cáo đầy đủ: ' + path.join(root, '_migrate-report.md'));
}

/* báo cáo — không tự sửa */
function report(s, st) {
  const handHeader = /<div[^>]*class=["'][^"']*\bpage-header\b(?![\w-])[^"']*["']/.test(s) && !/data-pattern=["']page-header["']/.test(s) && !/c-page-header/.test(s);
  if (handHeader) st.notes.push('header VIẾT TAY (Rule 10) — đã có lưới an toàn trong layout.css; nên đổi sang data-pattern="page-header"');
  const tag = (s.match(/<sd-badge\b[^>]*\btype=["']tag["']/g) || []).length;
  if (tag) st.notes.push(tag + ' sd-badge type="tag" — từ 2026-10-10 "tag" là khung viền 1px; muốn viên thuốc thì đổi sang type="round"');
  const num = (s.match(/["']?type["']?\s*:\s*["']number["'](?![^}]*precision)(?![^}]*\})/g) || []).length;
  if (num) st.notes.push(num + ' cột type number (object lồng) chưa khai option.precision — nay hiện 2 số lẻ như catalog; số nguyên thì thêm option.precision = 0');
  for (const [rx, what, how] of GONE) {
    const n = (s.match(new RegExp(rx.source, rx.flags.includes('g') ? rx.flags : rx.flags + 'g')) || []).length;
    if (n) st.notes.push('còn ' + n + '× ' + what + ' → ' + how);
  }
  if (/\bd-none\b/.test(s) && /\.style\.display\s*=\s*['"](?!none)/.test(s))
    st.notes.push('JS hiện khối bằng style.display = "…" — nếu khối đó mang lớp d-none thì nay KHÔNG hiện (d-none của sd-core !important) → đổi sang classList.remove("d-none")');
  const foot = (s.match(/\sslot=\\?["']footer\\?["']/g) || []).length;
  if (foot) st.notes.push(foot + '× slot="footer" — sd-side-drawer vẫn nhận; theo catalog nên đổi sang <div sdFooter class="d-flex align-items-center justify-content-end gap-8"> (sdFooter không tự căn phải; sd-modal chỉ nhận sdFooter)');
}

let total = { files: 0, skipped: 0 };
const REDO_CUR = new Map();
for (const f of files) {
  let src = fs.readFileSync(f, 'utf8');
  if (!(!/<(?:script|link)\b[^>]*(?:src|href)\s*=\s*["'][^"']*design-system\//i.test(src) && /customElements\.define\(\s*['"]sd-/.test(src))) hookReportPage(f, src);
  if (REDO) {
    const orig = path.join(path.dirname(f), '_pre-migrate', path.basename(f));
    if (!fs.existsSync(orig)) { console.log('· ' + f + ' — --redo: không có bản gốc trong _pre-migrate/ → chạy như thường'); }
    else if (/<!-- kit-migrated/.test(src)) {
      if (!DRY) { const rb = path.join(path.dirname(f), '_pre-migrate', 'redo-' + TODAY); fs.mkdirSync(rb, { recursive: true }); const d = path.join(rb, path.basename(f)); if (!fs.existsSync(d)) fs.writeFileSync(d, src); }
      src = fs.readFileSync(orig, 'utf8');
      console.log('↺ ' + f + ' — nâng lại từ _pre-migrate/' + path.basename(f) + ' (bản đang có → _pre-migrate/redo-' + TODAY + '/)');
      REDO_CUR.set(f, true);
    }
  }
  /* Trang XUẤT (export.md) tự chứa cả kit trong <style>/<script> — không nạp gì từ design-system/ nên áp kit mới không ảnh
     hưởng; nâng nó là sửa vào chính mã kit đã nhúng (đã gặp: <textarea> trong SdTextarea nhúng bị đổi thành <sd-textarea> →
     đệ quy vô hạn). Bỏ qua (2026-10-15). */
  if (!/<(?:script|link)\b[^>]*(?:src|href)\s*=\s*["'][^"']*design-system\//i.test(src) && /customElements\.define\(\s*['"]sd-/.test(src)) {
    console.log('· ' + f + ' — trang xuất tự chứa kit (không nạp design-system/) → không phụ thuộc kit mới, bỏ qua');
    total.skipped++; continue;
  }
  const st = { spacing: {}, noop: {}, inform: 0, alias: 0, comp: {}, widgets: [], inline: 0, collide: 0, pagedef: 0, hie: 0, reset: 0, badge: 0, href: 0, precision: 0, slot: 0, label: 0, css: false, notes: [] };
  if (ONLY_INFORM || ONLY_COMP) {
    const st = { inform: 0, alias: 0, comp: {}, widgets: [], notes: [] };
    const P = protect(src);
    let s = fixHandBanner(P.s, st, pageCss(src, f), src);
    if (ONLY_COMP) { s = convertComponents(s, st, { pc: pageCss(src, f), NEW_UTIL, OLD_KNOWN }); s = linkShim(s, st); s = s.split(KEEP).join(''); }
    s = P.restore(s);
    const nC = Object.values(st.comp).reduce((a, b) => a + b, 0) + st.inform + st.alias;
    console.log((nC ? '✓ ' : '· ') + f + ' — dải thông báo → sd-inform ' + st.inform + (ONLY_COMP ? ' · ' + compSummary(st) : ''));
    st.inform = nC;
    for (const n of st.notes) console.log('    ! ' + n);
    if (st.notes.length) REPORT.pages.set(f, st.notes.concat(REPORT.pages.get(f) || []));
    if (!DRY && s !== src) {
      const bak = path.join(path.dirname(f), '_pre-migrate', 'inform'); fs.mkdirSync(bak, { recursive: true });
      const dst = path.join(bak, path.basename(f)); if (!fs.existsSync(dst)) fs.writeFileSync(dst, src);
      fs.writeFileSync(f, s);
    }
    st.inform ? total.files++ : total.skipped++;
    continue;
  }
  const mk = src.match(/<!-- kit-migrated (?:v(\d+) )?/);
  const ver = mk ? +(mk[1] || 1) : 0;
  if (ver >= VERSION) { console.log('· ' + f + ' — đã nâng (v' + ver + '), bỏ qua'); total.skipped++; continue; }
  UPGRADE = ver > 0;   // trang đã chạy bản v1: chạy các bước mới, KHÔNG đổi thang khoảng cách lần nữa (mt-1→mt-4→mt-16)
  const sign = OLD_SIGNS.find(([rx]) => rx.test(src));
  if (!UPGRADE && !sign && !FORCE) { console.log('· ' + f + ' — không thấy dấu hiệu kit cũ (link Google Fonts Roboto, type="status", slot="header-right") → coi là trang mới, bỏ qua (thêm --force nếu chắc là trang cũ)'); total.skipped++; continue; }
  const P = protect(src);
  let s = P.s;
  const pc = pageCss(src, f);
  s = fixHandBanner(s, st, pc, src);
  if (UPGRADE) s = upgradeMinW(s, st);
  /* Trang đã nâng bằng bản công cụ cũ: id có trong bản gốc (_pre-migrate/) mà nay mất → bản cũ đã đổi nhầm phần JS đụng tới
     (vd <tbody id> của bảng JS đổ dòng bị thay bằng sd-table cố định → cột / dòng biến mất). Báo để chạy --redo. */
  if (UPGRADE) {
    const orig = path.join(path.dirname(f), '_pre-migrate', path.basename(f));
    if (fs.existsSync(orig)) {
      const ids = t => new Set([...t.replace(/<!--[\s\S]*?-->/g, '').matchAll(/\sid\s*=\s*["']([\w-]+)["']/g)].map(x => x[1]));
      const jsAll = (src.match(/<script\b[^>]*>[\s\S]*?<\/script>/gi) || []).join('\n');
      const now = ids(s), lost = [...ids(fs.readFileSync(orig, 'utf8'))].filter(x => !now.has(x) && new RegExp('[\'"#]' + x + '[\'"\\s.:\\[]').test(jsAll));
      if (lost.length) st.notes.push(lost.length + ' id của bản gốc không còn (' + lost.slice(0, 5).join(', ') + (lost.length > 5 ? '…' : '') + ') — bản công cụ trước 2026-10-15 có thể đã đổi nhầm phần JS dùng tới → nếu chưa sửa tay trang này sau khi nâng, chạy lại với --redo');
    }
  }
  s = convertComponents(s, st, { pc, NEW_UTIL, OLD_KNOWN });
  s = fixCollisions(s, st, pc);
  s = fixPageUtilDefs(s, st);
  s = remapSpacing(s, st, pc);
  s = fixInlineError(s, st);
  s = s.split(KEEP).join('');
  s = fixStatusBadge(s, st);
  s = fixButtonHref(s, st);
  s = fixNumberPrecision(s, st);
  s = fixSlots(s, st);
  s = fixButtonLabel(s, st);
  s = fixButtonType(s, st);
  s = markReset(s, st);
  s = markLegacyTables(s, st);
  s = linkLegacyCss(s, st);
  s = linkShim(s, st);
  s = P.restore(s);
  report(s, st);
  const stamp = '<!-- ' + MARK + ' v' + VERSION + ' ' + TODAY + ' (ai-instructions/tools/migrate-prototype.mjs) -->';
  /* trang không có thẻ <head> (HTML cho phép bỏ) → dấu ngay sau <html> / <!doctype>, không thì lần sau công cụ nâng LẠI (đổi thang
     khoảng cách hai lần) và hộp nhắc không bao giờ tắt */
  s = UPGRADE ? s.replace(/<!-- kit-migrated (?!:)[^>]*-->/, stamp)
    : /<head(?=[\s>])[^>]*>/i.test(s) ? s.replace(/(<head(?=[\s>])[^>]*>)/i, '$1\n  ' + stamp)
    : /<html(?=[\s>])[^>]*>/i.test(s) ? s.replace(/(<html(?=[\s>])[^>]*>)/i, '$1\n' + stamp)
    : /<!doctype[^>]*>/i.test(s) ? s.replace(/(<!doctype[^>]*>)/i, '$1\n' + stamp) : stamp + '\n' + s;
  const nSp = Object.values(st.spacing).reduce((a, b) => a + b, 0);
  const nNo = Object.values(st.noop).reduce((a, b) => a + b, 0);
  console.log((UPGRADE ? '↑ ' : '✓ ') + f + (UPGRADE ? ' (nâng tiếp từ v' + ver + ')' : '') + ' — khoảng cách ' + nSp + ' · lớp chết gỡ ' + nNo + ' · inline !important ' + st.inline + ' · lớp đè CSS trang gỡ ' + st.collide +
    ' · luật trang trùng tên lớp ' + st.pagedef + ' · hideInlineError ' + st.hie + ' · dải thông báo → sd-inform ' + st.inform + ' · ' + compSummary(st) + ' · reset ' + st.reset + ' thẻ · badge status ' + st.badge + ' · sd-button href ' + st.href + ' · cột số ' + st.precision +
    ' · slot→sdHeader* ' + st.slot + ' · nhãn sd-button ' + st.label + (st.minw ? ' · min-width → data-legacy-minw ' + st.minw : '') + (st.ltable ? ' · sd-table chế độ trang cũ ' + st.ltable : '') + (st.btype ? ' · sd-button type lạ → light ' + st.btype : '') +
    (st.css ? ' · nạp legacy-reset.css' : '') + (st.shim ? ' · nạp legacy-shim.js' : ''));
  if (nNo) console.log('    · lớp kit cũ KHÔNG có (vô tác dụng) nay sd-core có nghĩa px → đã gỡ để giữ hình: ' + Object.entries(st.noop).map(([k, v]) => k + (v > 1 ? '×' + v : '')).join(' ') +
    ' — muốn có khoảng thì thêm lại theo px (vd p-12)');
  for (const n of st.notes) console.log('    ! ' + n);
  for (const n of (REPORT.pages.get(f) || [])) console.log('    ! ' + n);
  if (st.notes.length) REPORT.pages.set(f, st.notes.concat(REPORT.pages.get(f) || []));
  if (!DRY && (s !== src || REDO_CUR.has(f))) {
    /* bản gốc (trước mọi lần nâng) giữ nguyên ở _pre-migrate/; bản đã chạy v1 chép sang _pre-migrate/v1/ */
    const bak = path.join(path.dirname(f), '_pre-migrate', UPGRADE ? 'v' + ver : ''); fs.mkdirSync(bak, { recursive: true });
    const dst = path.join(bak, path.basename(f));
    if (!fs.existsSync(dst)) fs.writeFileSync(dst, src);
    fs.writeFileSync(f, s);
  }
  total.files++;
}
console.log('\n' + total.files + ' trang ' + (DRY ? '(chạy thử, chưa ghi)' : 'đã nâng') + ' · ' + total.skipped + ' trang bỏ qua' +
  (DRY || !total.files ? '' : ' · bản gốc ở _pre-migrate/'));
writeReport();
