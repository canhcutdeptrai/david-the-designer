/* html-lite.mjs — công cụ đọc HTML tối giản cho migrate-prototype.mjs (Node thuần, không cần cài).
 *
 * Làm việc thẳng trên CHUỖI nguồn (không dựng lại toàn trang) để phần không đổi giữ nguyên từng ký tự — kể cả CRLF,
 * khoảng trắng, chú thích. Hiểu được hai ngữ cảnh:
 *   · 'html' — HTML tĩnh của trang;
 *   · 'js'   — markup nằm trong chuỗi JS (`'<button class="x">' + label + '</button>'`). Giá trị thuộc tính trong ngoặc kép
 *              có thể chứa đoạn nối chuỗi (`"tab' + cls + '"`) — được giữ NGUYÊN VĂN, không giải mã.
 * Vùng bỏ qua: <style>, chú thích HTML, <pre>, <code>, <textarea> (nội dung là chữ), <template>, <xmp>.
 */

export const VOID = new Set(['input', 'br', 'img', 'hr', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr']);

/* Các vùng của tài liệu: [{start, end, kind}] — kind 'js' (nội dung <script> không có src) | 'skip' */
export function regions(s) {
  const out = [];
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>|<style\b[\s\S]*?<\/style\s*>|<!--[\s\S]*?-->|<(pre|code|xmp|template)\b[\s\S]*?<\/\3\s*>/gi;
  let m;
  while ((m = re.exec(s))) {
    if (m[0].startsWith('<script')) {
      const st = m.index + m[0].indexOf('>') + 1;
      if (!/\bsrc\s*=/.test(m[1]) && !/type\s*=\s*["'](?!text\/javascript|module)/i.test(m[1])) out.push({ start: st, end: st + m[2].length, kind: 'js' });
      else out.push({ start: m.index, end: m.index + m[0].length, kind: 'skip' });
    } else out.push({ start: m.index, end: m.index + m[0].length, kind: 'skip' });
  }
  return out;
}
export function ctxAt(regs, i) {
  for (const r of regs) if (i >= r.start && i < r.end) return r.kind;
  return 'html';
}

/* Thẻ mở: <name attrs> — thuộc tính trong "…" hoặc '…' (giá trị không qua giải mã) */
export const OPEN_TAG = /<([a-zA-Z][\w-]*)((?:\s+[^\s"'<>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*(\/?)>/g;

export function parseAttrs(str) {
  const out = [];
  const re = /([^\s"'<>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let m;
  while ((m = re.exec(str))) {
    const q = m[2] !== undefined ? '"' : m[3] !== undefined ? "'" : '';
    out.push({ name: m[1], value: m[2] ?? m[3] ?? m[4] ?? null, q, src: true });
  }
  return out;
}
export const getAttr = (attrs, n) => { const a = attrs.find(x => x.name.toLowerCase() === n.toLowerCase()); return a ? (a.value ?? '') : null; };
export const hasAttr = (attrs, n) => attrs.some(x => x.name.toLowerCase() === n.toLowerCase());
export function setAttr(attrs, n, v) {
  const a = attrs.find(x => x.name.toLowerCase() === n.toLowerCase());
  if (a) { a.value = v; if (v !== null && !a.q) a.q = '"'; } else attrs.push({ name: n, value: v, q: v === null ? '' : '"' });
}
export const delAttr = (attrs, ...ns) => { for (const n of ns) { const i = attrs.findIndex(x => x.name.toLowerCase() === n.toLowerCase()); if (i >= 0) attrs.splice(i, 1); } };
/* `quote` = dấu nháy của chuỗi JS đang chứa markup (null khi là HTML tĩnh). Thuộc tính lấy từ nguồn giữ nguyên dấu nháy
   (vốn đã hợp lệ ở đó); thuộc tính sinh mới chọn dấu nháy KHÁC dấu của chuỗi JS và thoát dấu đó trong giá trị. */
export function buildAttrs(attrs, quote) {
  return attrs.map(a => {
    if (a.value === null) return ' ' + a.name;
    if (a.src && a.q) return ' ' + a.name + '=' + a.q + a.value + a.q;
    let q = a.q || '"';
    if (quote === "'" && q === "'") q = '"';
    if (quote === '"' && q === '"') q = "'";
    const v = isDynamic(a.value) ? a.value : String(a.value).replace(q === '"' ? /"/g : /'/g, q === '"' ? '&quot;' : '&#39;');
    return ' ' + a.name + '=' + q + v + q;
  }).join('');
}

/* Dấu nháy của chuỗi JS bao vị trí i (quét từ đầu khối script). Bỏ qua chú thích; regex literal hiếm khi có nháy — nếu
   đoán sai, bước kiểm cú pháp sau cùng sẽ phát hiện và bỏ đổi trong JS. */
export function jsQuoteAt(s, start, i) {
  let q = null, prev = '';                 // prev = ký tự có nghĩa gần nhất ngoài chuỗi / chú thích (đoán regex literal)
  for (let k = start; k < i; k++) {
    const ch = s[k];
    if (q) {
      if (ch === '\\') { k++; continue; }
      if (ch === q) { q = null; prev = 'x'; }
      else if (q === '`' && ch === '$' && s[k + 1] === '{') { /* biểu thức trong template: coi như vẫn trong chuỗi */ }
      continue;
    }
    if (ch === '/' && s[k + 1] === '/') { const e = s.indexOf('\n', k); if (e < 0 || e >= i) return null; k = e; continue; }
    if (ch === '/' && s[k + 1] === '*') { const e = s.indexOf('*/', k + 2); if (e < 0 || e + 2 > i) return null; k = e + 1; continue; }
    if (ch === '/' && (prev === '' || /[(,=:[!&|?{};+\-*%<>~^]/.test(prev) || /\b(return|typeof|case|in|of|new|delete|void|throw)$/.test(s.slice(Math.max(start, k - 8), k).trimEnd()))) {
      /* regex literal: bỏ qua tới dấu / đóng (tôn trọng \ và [...]) */
      let cls = false, e = k + 1;
      for (; e < i && s[e] !== '\n'; e++) { const c = s[e]; if (c === '\\') { e++; continue; } if (c === '[') cls = true; else if (c === ']') cls = false; else if (c === '/' && !cls) break; }
      if (e >= i) return null;
      k = e; prev = 'x'; continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') { q = ch; continue; }
    if (!/\s/.test(ch)) prev = ch;
  }
  return q;
}

/* Tìm thẻ đóng khớp với thẻ mở `tag` kết thúc tại `from`. Trả {innerStart, innerEnd, end} hoặc null. */
export function findClose(s, tag, from, limit) {
  const re = new RegExp('<(/?)' + tag + '\\b[^>]*>', 'gi');
  re.lastIndex = from;
  let depth = 1, m;
  while ((m = re.exec(s))) {
    if (limit !== undefined && m.index >= limit) return null;
    if (m[1]) { if (--depth === 0) return { innerStart: from, innerEnd: m.index, end: m.index + m[0].length }; }
    else if (!m[0].endsWith('/>')) depth++;
  }
  return null;
}

/* Có đoạn nối chuỗi JS / template literal không */
export const isDynamic = t => /'\s*\+|\+\s*'|\$\{|"\s*\+|\+\s*"/.test(t);

/* Chữ thuần của một đoạn HTML (bỏ thẻ, <br> → khoảng trắng, gộp khoảng trắng). Không giải mã thực thể. */
export const textOf = h => h.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

/* Chuỗi đưa vào giá trị thuộc tính "…": giữ thực thể sẵn có, thoát & và " (và ' khi markup nằm trong chuỗi JS nháy đơn) */
export const attrText = (t, ctx) => {
  let v = t.replace(/&(?![\w#]+;)/g, '&amp;').replace(/"/g, '&quot;');
  if (ctx === 'js' && !isDynamic(t)) v = v.replace(/'/g, '&#39;');
  return v;
};

/* Lặp mọi thẻ mở `tagRe` (RegExp tên thẻ) trong s; cb(match, ctx) trả {from, to, text} để thay hoặc null. Tự dời vị trí. */
export function eachTag(s, tagRe, cb) {
  let regs = regions(s);
  const re = new RegExp(OPEN_TAG.source, 'g');
  let m;
  while ((m = re.exec(s))) {
    if (!tagRe.test(m[1])) continue;
    const ctx = ctxAt(regs, m.index);
    if (ctx === 'skip') continue;
    if (ctx === 'js' && /\\["']/.test(m[0])) continue;      // thuộc tính thoát kiểu \" — không đụng
    let quote = null;
    if (ctx === 'js') {
      if (eachTag.noJs) continue;
      const reg = regs.find(r => m.index >= r.start && m.index < r.end);
      quote = jsQuoteAt(s, reg.start, m.index);
      if (!quote) continue;                                  // markup không nằm trong chuỗi — không đụng
    }
    const r = cb({ name: m[1], attrsRaw: m[2], selfClose: !!m[3], index: m.index, end: m.index + m[0].length, raw: m[0], quote }, ctx, s, regs);
    if (!r) continue;
    s = s.slice(0, r.from) + r.text + s.slice(r.to);
    re.lastIndex = r.from + (r.resume ?? r.text.length);
    regs = regions(s);
  }
  return s;
}
