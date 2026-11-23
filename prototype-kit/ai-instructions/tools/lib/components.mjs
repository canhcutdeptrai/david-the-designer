/* components.mjs — đổi markup tự dựng / tên cũ sang component Core (sd-*) cho migrate-prototype.mjs.
 *
 * Builder 2026-10-14: *„giờ tôi cần tất cả các component phải đổi được vì tôi cần đưa bộ prototype kit này cho những người
 * khác dùng nữa. Bộ sẽ apply được cho các prototype cũ của họ“* — chọn *„Đổi hết, kể cả bảng/modal“* và *„Đổi sang tên Core“*.
 *
 * Nguyên tắc (vẫn giữ lệnh „phần nào không chắc thì không sửa“):
 *   · Đổi khi CẤU TRÚC rõ: biết chắc nhãn / giá trị / tiêu đề lấy từ đâu. Không rõ → dòng `!` kèm markup Core gợi ý.
 *   · JS của trang còn chạy: thuộc tính / sự kiện component kit hỗ trợ (value, checked, disabled, change, click) được giữ
 *     nguyên; chỗ JS dùng thứ component không có (`.options`, `.selectedIndex`, `.innerHTML` của nút…) → không đổi, báo.
 *     Phần nối hành vi cũ (bật/tắt modal bằng style / class, sự kiện `change` của sd-select…) do `core/js/legacy-shim.js`
 *     lo — chỉ trang đã nâng nạp, như legacy-reset.css.
 *   · Khối là WIDGET riêng của trang (nút / bảng có lớp CSS của trang: hàng cây, thẻ chọn, ô thả tệp…) KHÔNG phải component
 *     Core cùng tên — giữ nguyên (AGENTS Rule 0b nhóm B), chỉ báo.
 */
import vm from 'vm';
import { VOID, regions, ctxAt, OPEN_TAG, parseAttrs, getAttr, hasAttr, setAttr, delAttr, buildAttrs, findClose,
  isDynamic, textOf, attrText, eachTag, jsQuoteAt } from './html-lite.mjs';

/* ───────────────────────────── tiện ích chung ───────────────────────────── */
const ICON_SPAN = /<(span|i|mat-icon)\b[^>]*class\s*=\s*"[^"]*\bmaterial-(?:icons|symbols)(?:-(outlined|round|sharp))?\b[^"]*"[^>]*>\s*([a-z0-9_]+)\s*<\/\1>/i;
const ICON_SPAN_G = new RegExp(ICON_SPAN.source, 'gi');
const clsOf = attrs => (getAttr(attrs, 'class') || '').split(/\s+/).filter(Boolean);
const setCls = (attrs, list) => { if (list.length) setAttr(attrs, 'class', list.join(' ')); else delAttr(attrs, 'class'); };
const isMargin = c => /^-?m[tbrlxy]?-(\d+|auto)$/.test(c);

/* JS của trang có chạm phần tử này bằng thứ component KHÔNG có không */
function jsRisk(js, id, props) {
  if (!id || !js) return null;
  const e = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const refs = ['document\\.getElementById\\(\\s*[\'"]' + e + '[\'"]\\s*\\)', 'querySelector\\(\\s*[\'"]#' + e + '[\'"]\\s*\\)', '\\$\\(\\s*[\'"]#' + e + '[\'"]\\s*\\)'];
  const vars = [...js.matchAll(new RegExp('(?:const|let|var)\\s+([\\w$]+)\\s*=\\s*(?:' + refs.join('|') + ')', 'g'))].map(m => m[1]);
  const heads = [...refs, ...vars.map(v => '\\b' + v.replace(/\$/g, '\\$'))];
  const m = js.match(new RegExp('(?:' + heads.join('|') + ')\\s*\\.\\s*(' + props + ')\\b'));
  return m ? m[1] : null;
}
/* như jsRisk nhưng theo LỚP móc: JS chọn phần tử bằng `.lớp` rồi dùng thứ component không có trong ~400 ký tự sau đó */
function jsRiskCls(js, cls, props) {
  if (!js) return null;
  for (const c of cls) {
    const e = c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp('[\'"`][^\'"`\\n]*\\.' + e + '(?![\\w-])', 'g'); let m;
    while ((m = re.exec(js))) { const r = js.slice(m.index, m.index + 400).match(new RegExp('\\.\\s*(' + props + ')\\b')); if (r) return r[1] + ' (qua .' + c + ')'; }
  }
  return null;
}
const referenced = (js, id) => !!id && js && new RegExp('[\'"`]#?' + id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\'"`]').test(js);

/* Lớp do CSS của TRANG định nghĩa (không phải tiện ích / lớp kit) → khối là widget riêng */
function pageClasses(cls, ctx) {
  return cls.filter(c => ctx.pc.tokens.has(c) && !isMargin(c) && !ctx.NEW_UTIL[c]);
}

/* ───────────────────────── 1. Tên cũ của kit → tên Core ───────────────────────── */
const INFORM_TYPE = { neutral: 'secondary', inform: 'info', positive: 'success', warning: 'warning', negative: 'error' };
export function fixAliases(s, st) {
  /* sd-section collapsable → collapsible (thư viện 19.0.10 nhận cả hai, catalog ghi collapsible) */
  s = s.replace(/(<sd-section\b[^>]*?\s)collapsable(?=[\s>=\/])/g, (m, a) => { st.alias++; return a + 'collapsible'; });
  /* sd-button type="text" → type="link" (catalog không có "text") */
  s = s.replace(/(<sd-button\b[^>]*?\stype=)(["'])text\2/g, (m, a, q) => { st.alias++; return a + q + 'link' + q; });
  /* sd-inform: type → color (+ hideIcon khi kiểu cũ không có icon — giữ hình), dismissible → closable, cta → actionLabel */
  s = s.replace(/<sd-inform\b([^>]*)>/g, (m, a) => {
    const attrs = parseAttrs(a);
    let changed = false;
    const t = getAttr(attrs, 'type');
    if (t !== null && !hasAttr(attrs, 'color') && INFORM_TYPE[t]) {
      delAttr(attrs, 'type'); setAttr(attrs, 'color', INFORM_TYPE[t]);
      const ic = getAttr(attrs, 'icon');
      if (ic === null) setAttr(attrs, 'hideIcon', null);
      else if (ic === '' || ic === 'true') delAttr(attrs, 'icon');
      changed = true;
    }
    if (hasAttr(attrs, 'dismissible')) { delAttr(attrs, 'dismissible'); setAttr(attrs, 'closable', null); changed = true; }
    const cta = getAttr(attrs, 'cta');
    if (cta !== null) { delAttr(attrs, 'cta'); if (!hasAttr(attrs, 'actionLabel')) setAttr(attrs, 'actionLabel', cta); changed = true; }
    if (!changed) return m;
    st.alias++;
    const q0 = (attrs.find(x => x.src && x.q) || {}).q || '"';
    for (const x of attrs) if (!x.src && x.value !== null) x.q = q0;
    return '<sd-inform' + buildAttrs(attrs) + '>';
  });
  s = s.replace(/(['"])sd-inform-dismiss\1/g, (m, q) => { st.alias++; return q + 'sd-closed' + q; });
  /* slot="header-right|header-left" — đã có sdHeaderRight / sdHeaderLeft (bước 7) → bỏ bí danh */
  s = s.replace(/(\ssd(?:HeaderRight|HeaderLeft)\b[^>]*?)\s+slot=(\\?["'])header-(?:right|left)\2/gi, (m, a) => { st.alias++; return a; });
  /* slot="footer" của sd-side-drawer → sdFooter. Bí danh cũ được căn phải sẵn, sdFooter thì không (catalog) → thêm lớp căn. */
  s = s.replace(/<(div|footer|section)\b([^>]*?)\sslot=(["'])footer\3([^>]*)>/gi, (m, tag, a, q, b, off, all) => {
    const before = all.slice(0, off);
    if (before.lastIndexOf('<sd-side-drawer') <= before.lastIndexOf('</sd-side-drawer')) return m;   // chỉ sd-side-drawer có bí danh này
    const attrs = parseAttrs(a + b);
    const cls = clsOf(attrs);
    for (const c of ['d-flex', 'align-items-center', 'justify-content-end', 'gap-8']) if (!cls.includes(c) && !(c === 'd-flex' && cls.includes('flex')) && !(c === 'gap-8' && cls.some(x => /^gap-/.test(x)))) cls.push(c);
    const q0 = (attrs.find(x => x.src && x.q) || {}).q || '"';
    setCls(attrs, cls);
    const ca = attrs.find(x => x.name === 'class'); if (ca && !ca.src) ca.q = q0;
    st.alias++;
    return '<' + tag + ' sdFooter' + buildAttrs(attrs) + '>';
  });
  return s;
}

/* ─────────────────────────────── 2. Nút ─────────────────────────────── */
const BTN_MAP = {
  'btn-primary': ['fill', 'primary'], 'btn-secondary': ['light', 'primary'], 'btn-tertiary': ['light', 'secondary'],
  'btn-danger': ['fill', 'error'], 'btn-success': ['fill', 'success'], 'btn-warning': ['fill', 'warning'], 'btn-info': ['fill', 'info'],
  'btn-light': ['light', 'secondary'], 'btn-dark': ['fill', 'secondary'], 'btn-link': ['link', 'primary'],
  'btn-ghost': ['link', 'primary'], 'btn-ghost-primary': ['link', 'primary'], 'btn-ghost-danger': ['link', 'error'], 'btn-ghost-tertiary': ['link', 'secondary'], 'btn-ghost-secondary': ['link', 'secondary'],
  'btn-outline': ['outline', 'primary'], 'btn-outline-primary': ['outline', 'primary'], 'btn-outline-danger': ['outline', 'error'],
  'btn-outline-tertiary': ['outline', 'secondary'], 'btn-outline-secondary': ['outline', 'secondary'], 'btn-outline-success': ['outline', 'success'],
  'btn-outline-warning': ['outline', 'warning'], 'btn-outline-info': ['outline', 'info']
};
const BTN_DROP = /^(btn|btn-[\w-]+)$/;
const keepClsFor = cls => cls.filter(x => !BTN_DROP.test(x) && !isMargin(x));
function convertButtons(s, ctx) {
  const { st, js } = ctx;
  return eachTag(s, /^(button|a)$/i, (t, c, src) => {
    const tag = t.name.toLowerCase();
    const attrs = parseAttrs(t.attrsRaw);
    const clsRaw = getAttr(attrs, 'class') || '';
    const cls = clsRaw.split(/\s+/).filter(Boolean);
    const isBtnCls = cls.some(x => x === 'btn' || BTN_MAP[x]);
    if (tag === 'a' && !isBtnCls) return null;
    if (isDynamic(clsRaw)) { if (isBtnCls) ctx.note('nút có lớp ghép bằng JS (' + clsRaw.slice(0, 40) + ') — đổi tay sang <sd-button>'); return null; }
    if (hasAttr(attrs, 'role') && !/^button$/i.test(getAttr(attrs, 'role'))) return null;   // role=switch / tab… → bộ đổi riêng
    if (cls.includes('toggle')) return null;
    const own = pageClasses(cls.filter(x => !BTN_DROP.test(x)), ctx);
    if (own.length) { ctx.widget('button', own); return null; }
    const close = findClose(src, tag, t.end);
    if (!close) return null;
    let inner = src.slice(close.innerStart, close.innerEnd);
    if (ctxAt(regions(src), close.innerEnd) !== c) return null;
    /* icon đầu / cuối */
    let prefix = '', suffix = '', fontSet = '';
    const icons = [...inner.matchAll(ICON_SPAN_G)];
    if (icons.length > 2) { ctx.note('nút có hơn 2 icon — đổi tay'); return null; }
    let rest = inner;
    for (const ic of icons) {
      const before = textOf(rest.slice(0, rest.indexOf(ic[0])));
      if (!before && !prefix) { prefix = ic[3]; fontSet = ic[2] ? 'material-icons-' + ic[2] : 'material-icons'; }
      else suffix = ic[3];
      rest = rest.replace(ic[0], '');
    }
    if (/<(?!\/?(span|strong|b|em|small)\b)[a-z]/i.test(rest)) { ctx.note('nút có nội dung phức tạp ("' + textOf(inner).slice(0, 30) + '") — đổi tay sang <sd-button>'); return null; }
    const label = isDynamic(rest) ? rest.replace(/<\/?(span|strong|b|em|small)\b[^>]*>/gi, '').trim() : textOf(rest);
    const id = getAttr(attrs, 'id');
    const risk = jsRisk(js, id, 'textContent|innerText|innerHTML|appendChild|insertAdjacentHTML|form|type|value') || jsRiskCls(js, keepClsFor(cls), 'innerHTML|innerText|textContent\\s*=|appendChild|insertAdjacentHTML');
    if (risk) { ctx.note('nút #' + id + ' — JS dùng .' + risk + ' (sd-button không có) → đổi tay'); return null; }
    /* loại / màu / cỡ */
    let type = '', color = '', size = '';
    for (const x of cls) if (BTN_MAP[x]) [type, color] = BTN_MAP[x];
    if (cls.includes('btn-sm') || cls.includes('btn-xs')) size = 'sm';
    if (cls.includes('btn-lg')) size = 'lg';
    const out = attrs.filter(a => !/^(class|type|href|title)$/i.test(a.name));
    for (const a of out) { if (/^onfocus$/i.test(a.name)) a.name = 'onfocusin'; if (/^onblur$/i.test(a.name)) a.name = 'onfocusout'; }
    const keepCls = cls.filter(x => !BTN_DROP.test(x));
    const pre = [];
    if (type) pre.push({ name: 'type', value: type, q: '"' });
    if (color) pre.push({ name: 'color', value: color, q: '"' });
    if (size) pre.push({ name: 'size', value: size, q: '"' });
    if (prefix) pre.push({ name: 'prefixIcon', value: prefix, q: '"' });
    if (suffix) pre.push({ name: 'suffixIcon', value: suffix, q: '"' });
    if ((prefix || suffix) && fontSet && fontSet !== 'material-icons-outlined') pre.push({ name: 'fontSet', value: fontSet, q: '"' });
    pre.push({ name: 'title', value: label ? attrText(label, c) : '', q: '"' });
    const tip = getAttr(attrs, 'title');
    if (tip) { pre.push({ name: 'tooltip', value: tip, q: '"' }); if (!label && !hasAttr(attrs, 'aria-label')) pre.push({ name: 'aria-label', value: tip, q: '"' }); }
    const tp = getAttr(attrs, 'type'); if (tp && /^(submit|reset)$/i.test(tp)) pre.push({ name: 'htmlType', value: tp.toLowerCase(), q: '"' });
    const href = getAttr(attrs, 'href'); if (href && href !== '#' && !/^javascript:/i.test(href)) pre.push({ name: 'href', value: href, q: '"' });  // bước 4 đổi sang onclick
    const all = [...pre, ...out];
    if (keepCls.length) all.push({ name: 'class', value: keepCls.join(' '), q: '"' });
    st.comp.button = (st.comp.button || 0) + 1;
    return { from: t.index, to: close.end, text: '<sd-button' + buildAttrs(all, t.quote) + '></sd-button>' };
  });
}

/* ─────────────────────────────── 3. Badge ─────────────────────────────── */
const BADGE_COLOR = { primary: 'primary', secondary: 'secondary', neutral: 'secondary', info: 'info', success: 'success', warning: 'warning', error: 'error', danger: 'error', dark: 'secondary', light: 'secondary' };
function convertBadges(s, ctx) {
  const { st } = ctx;
  return eachTag(s, /^span$/i, (t, c, src) => {
    const attrs = parseAttrs(t.attrsRaw);
    const clsRaw = getAttr(attrs, 'class') || '';
    if (isDynamic(clsRaw)) return null;
    const cls = clsRaw.split(/\s+/);
    if (!cls.includes('badge')) return null;
    const close = findClose(src, 'span', t.end); if (!close) return null;
    const inner = src.slice(close.innerStart, close.innerEnd);
    if (/<(?!\/?(strong|b|span)\b)[a-z]/i.test(inner.replace(ICON_SPAN_G, ''))) return null;
    let color = 'secondary';
    for (const x of cls) { const k = x.replace(/^(badge|bg|text)-/, ''); if (x !== 'badge' && BADGE_COLOR[k]) color = BADGE_COLOR[k]; }
    const ic = inner.match(ICON_SPAN);
    const label = isDynamic(inner) ? inner.replace(ICON_SPAN, '').replace(/<\/?\w+[^>]*>/g, '').trim() : textOf(inner.replace(ICON_SPAN, ''));
    const keep = cls.filter(x => x && x !== 'badge' && !/^(badge|bg|rounded)-/.test(x) && !/^text-/.test(x));
    const out = [{ name: 'type', value: 'round', q: '"' }, { name: 'color', value: color, q: '"' }];
    if (ic) out.push({ name: 'icon', value: ic[3], q: '"' });
    out.push({ name: 'title', value: attrText(label, c), q: '"' });
    for (const a of attrs) if (!/^(class|title)$/i.test(a.name)) out.push(a);
    if (keep.length) out.push({ name: 'class', value: keep.join(' '), q: '"' });
    st.comp.badge = (st.comp.badge || 0) + 1;
    ctx.once('badge', 'span.badge → sd-badge type="round" (nhãn phân loại). Nếu là TRẠNG THÁI vòng đời thì đổi sang kiểu icon theo STATUS_MAP (bỏ type, thêm color + icon)');
    return { from: t.index, to: close.end, text: '<sd-badge' + buildAttrs(out, t.quote) + '></sd-badge>' };
  });
}

/* ────────────────────── 4. Ô nhập / select / textarea / checkbox / radio / switch ────────────────────── */
const TEXT_TYPES = { '': 'sd-input', text: 'sd-input', search: 'sd-input', email: 'sd-input', tel: 'sd-input', url: 'sd-input', password: 'sd-input',
  number: 'sd-input-number', date: 'sd-date', 'datetime-local': 'sd-datetime' };
const FIELD_CLS = /^(form-control|form-input|form-input-sm|form-select|form-textarea|form-field-input|sd-input|sd-select|input|select|textarea|form-control-sm)$/;
const KEEP_ON_HOST = /^(id|name|placeholder|required|disabled|readonly|maxlength|minlength|pattern|min|max|on[a-z]+|data-[\w-]+|aria-[\w-]+|autoid|style|title)$/i;

/* nhãn: <label for=id>…</label> ở bất kỳ đâu (HTML tĩnh) */
function takeLabelFor(src, id, regs) {
  if (!id) return null;
  const re = new RegExp('<label\\b[^>]*\\bfor\\s*=\\s*["\']' + id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '["\'][^>]*>([\\s\\S]*?)</label\\s*>', 'i');
  const m = src.match(re);
  if (!m || ctxAt(regs, m.index) !== 'html' || /<(input|select|textarea|button|sd-)/i.test(m[1])) return null;
  return { index: m.index, len: m[0].length, html: m[1] };
}
function labelInfo(html) {
  const req = /\*\s*(<\/span>)?\s*$/.test(html.trim()) || /class\s*=\s*"[^"]*(required|text-error|text-danger)[^"]*"/.test(html);
  const text = textOf(html.replace(/<span\b[^>]*>\s*\*\s*<\/span>/gi, '')).replace(/\s*\*$/, '').trim();
  return { text, req };
}
/* ô nằm trong <td>/<th> (gần nhất) → bảng tự dựng: size sm + hideInlineError */
function inCell(src, i) {
  const before = src.slice(Math.max(0, i - 3000), i);
  const lt = Math.max(before.lastIndexOf('<td'), before.lastIndexOf('<th'));
  const lc = Math.max(before.lastIndexOf('</td'), before.lastIndexOf('</th'));
  return lt > lc;
}

/* bề rộng tối thiểu của host (trừ khi style đã định bề rộng): ghi vào data-legacy-minw, legacy-shim chỉ áp khi cha là
   hàng flex (nơi sd-* co về ~0). Trước 2026-10-15 ghi thẳng style min-width → trong ô lưới hẹp ô chọn tràn đè cột bên cạnh. */
function minWidth(out, w) {
  const sa = out.find(a => a.name.toLowerCase() === 'style');
  if (sa && /(^|;)\s*(min-)?width\s*:/.test(sa.value || '')) return;
  if (sa && isDynamic(sa.value)) return;
  out.push({ name: 'data-legacy-minw', value: w, q: '"' });
}
function controlAttrs(attrs, c, extraDrop) {
  const out = [];
  for (const a of attrs) {
    const n = a.name.toLowerCase();
    if (/^(type|class|value|size|autocomplete|list|form|step|spellcheck|autofocus|rows|cols|multiple|checked)$/.test(n) || (extraDrop && extraDrop.test(n))) continue;
    if (!KEEP_ON_HOST.test(a.name)) continue;
    const b = { ...a };
    if (n === 'onfocus') b.name = 'onfocusin';
    if (n === 'onblur') b.name = 'onfocusout';
    if (n === 'readonly') b.name = 'readonly';
    out.push(b);
  }
  return out;
}
function hostClass(attrs, ctx, out) {
  const cls = clsOf(attrs).filter(x => !FIELD_CLS.test(x));
  if (cls.length) out.push({ name: 'class', value: cls.join(' '), q: '"' });
  /* lớp của trang từng vẽ viền / đệm cho ô trần → legacy-reset.css bỏ hình của lớp đó trên host (giữ width / margin / flex) */
  if (pageClasses(cls, ctx).length) out.push({ name: 'data-legacy-ctl', value: null, q: '' });
}
const RISK_INPUT = 'select|setSelectionRange|selectionStart|selectionEnd|files|type\\s*=|options|selectedIndex|add|remove\\(|innerHTML|appendChild|valueAsDate|valueAsNumber|validity|checkValidity|setCustomValidity|indeterminate|labels';

/* Ô nhập / ô chọn bị ẩn (style display:none, [hidden], lớp ẩn) là chỗ JS cũ giữ trạng thái, hình thật nằm ở widget
   khác — đổi sang sd-* thì nhãn <label for> bị gộp vào một thẻ ẩn và mất khỏi màn hình. Không đổi (2026-10-15). */
const isHiddenCtl = attrs => hasAttr(attrs, 'hidden') || /(?:^|;)\s*(display\s*:\s*none|visibility\s*:\s*hidden)/i.test(getAttr(attrs, 'style') || '') ||
  clsOf(attrs).some(x => /^(d-none|hidden|sr-only|visually-hidden|invisible)$/.test(x));
function convertInputs(s, ctx) {
  const { st, js } = ctx;
  return eachTag(s, /^input$/i, (t, c, src, regs) => {
    const attrs = parseAttrs(t.attrsRaw);
    const type = (getAttr(attrs, 'type') || '').toLowerCase();
    if (isDynamic(getAttr(attrs, 'type') || '')) return null;
    if (isHiddenCtl(attrs)) return null;
    if (type === 'checkbox' || type === 'radio') return convertCheck(t, c, src, regs, attrs, type, ctx);
    const comp = TEXT_TYPES[type];
    if (!comp) return null;   // hidden / file / range / color / time / month… giữ nguyên
    const id = getAttr(attrs, 'id');
    const risk = jsRisk(js, id, RISK_INPUT) || jsRiskCls(js, clsOf(attrs).filter(x => !FIELD_CLS.test(x)), RISK_INPUT);
    if (risk) { ctx.note('ô nhập ' + (id ? '#' + id : '.' + clsOf(attrs).join('.')) + ' — JS dùng .' + risk.replace(/\\s.*$/, '') + ' (sd-* không có) → đổi tay'); return null; }
    let tag = comp;
    const out = [];
    let from = t.index, to = t.end, labelHtml = null;
    /* nhãn: <label for> hoặc <label> bọc ô */
    const lf = c === 'html' ? takeLabelFor(src, id, regs) : null;
    const wrapStart = src.lastIndexOf('<label', t.index);
    if (c === 'html' && wrapStart >= 0 && !/<\/label>/i.test(src.slice(wrapStart, t.index)) && /^<label\b(?![^>]*\bfor=)[^>]*>/i.test(src.slice(wrapStart))) {
      const cl = findClose(src, 'label', src.indexOf('>', wrapStart) + 1);
      if (cl && cl.end > t.end) {
        const whole = src.slice(cl.innerStart, cl.innerEnd).replace(t.raw, '');
        if (!/<(input|select|textarea|button)\b/i.test(whole)) { labelHtml = whole; from = wrapStart; to = cl.end; }
      }
    }
    const list = getAttr(attrs, 'list');
    if (list && comp === 'sd-input') {
      const dl = src.match(new RegExp('<datalist\\b[^>]*\\bid\\s*=\\s*["\']' + list + '["\'][^>]*>([\\s\\S]*?)</datalist>', 'i'));
      if (dl && !isDynamic(dl[1])) {
        const items = [...dl[1].matchAll(/<option\b([^>]*)>([^<]*)<\/option>|<option\b([^>]*)\/?>/gi)].map(o => {
          const oa = parseAttrs(o[1] || o[3] || ''); const v = getAttr(oa, 'value') ?? textOf(o[2] || ''); const l = textOf(o[2] || '') || v; return { value: v, label: l };
        });
        tag = 'sd-autocomplete';
        out.push({ name: 'items', value: JSON.stringify(items).replace(/'/g, '&#39;'), q: "'" });
      }
    }
    if (labelHtml === null && lf) labelHtml = lf.html;
    if (labelHtml !== null) {
      const li = labelInfo(labelHtml);
      if (li.text) out.push({ name: 'label', value: attrText(li.text, c), q: '"' });
      if (li.req && !hasAttr(attrs, 'required')) out.push({ name: 'required', value: null, q: '' });
    }
    if (['password', 'email', 'tel', 'url'].includes(type) && tag === 'sd-input') out.push({ name: 'type', value: type, q: '"' });
    const v = getAttr(attrs, 'value'); if (v !== null && v !== '') out.push({ name: 'value', value: v, q: '"' });
    out.push(...controlAttrs(attrs, c));
    if (tag === 'sd-input-number' && /^\d+$/.test(getAttr(attrs, 'step') || '') === false && getAttr(attrs, 'step')) out.push({ name: 'precision', value: String(((getAttr(attrs, 'step').split('.')[1]) || '').length), q: '"' });
    hostClass(attrs, ctx, out);
    if (inCell(src, t.index)) out.push({ name: 'size', value: 'sm', q: '"' }, { name: 'hideInlineError', value: null, q: '' });
    else if (!clsOf(attrs).some(x => pageClasses([x], ctx).length)) minWidth(out, tag === 'sd-date' || tag === 'sd-datetime' ? '160px' : '180px');
    if (tag !== 'sd-input') out.push({ name: 'data-legacy-change', value: null, q: '' });
    st.comp[tag] = (st.comp[tag] || 0) + 1;
    const text = '<' + tag + buildAttrs(out, t.quote) + '></' + tag + '>';
    if (lf && labelHtml === lf.html && from === t.index) ctx.later.push({ raw: src.substr(lf.index, lf.len), index: lf.index });   // xoá <label for> ở cuối
    return { from, to, text };
  });
}

function convertCheck(t, c, src, regs, attrs, type, ctx) {
  const { st, js } = ctx;
  const id = getAttr(attrs, 'id');
  const risk = jsRisk(js, id, 'indeterminate|labels|form|type\\s*=');
  if (risk) { ctx.note('ô ' + type + ' #' + id + ' — JS dùng .' + risk + ' → đổi tay'); return null; }
  const isSwitch = /^switch$/i.test(getAttr(attrs, 'role') || '');
  const tag = type === 'radio' ? 'sd-radio' : isSwitch ? 'sd-switch' : 'sd-checkbox';
  let from = t.index, to = t.end, labelHtml = null, wrapAttrs = null;
  const wrapStart = src.lastIndexOf('<label', t.index);
  if (wrapStart >= 0 && !/<\/label>/i.test(src.slice(wrapStart, t.index)) && /^<label\b(?![^>]*\bfor=)/i.test(src.slice(wrapStart))) {
    const openEnd = src.indexOf('>', wrapStart) + 1;
    const cl = findClose(src, 'label', openEnd);
    if (cl && cl.end > t.end) {
      const whole = src.slice(cl.innerStart, cl.innerEnd).replace(t.raw, '');
      if (!/<(input|select|textarea|button|sd-)\b/i.test(whole)) { labelHtml = whole; from = wrapStart; to = cl.end; wrapAttrs = parseAttrs(src.slice(wrapStart + 6, openEnd - 1)); }
    }
  }
  const lf = labelHtml === null && c === 'html' ? takeLabelFor(src, id, regs) : null;
  if (lf) labelHtml = lf.html;
  const out = [];
  if (labelHtml !== null) {
    const txt = isDynamic(labelHtml) ? labelHtml.replace(/<\/?\w+[^>]*>/g, '').trim() : textOf(labelHtml);
    if (txt) out.push({ name: 'label', value: attrText(txt, c), q: '"' });
  }
  const v = getAttr(attrs, 'value'); if (v !== null && type === 'radio') out.push({ name: 'value', value: v, q: '"' });
  else if (v !== null && v !== 'on') out.push({ name: 'value', value: v, q: '"' });
  if (hasAttr(attrs, 'checked')) out.push({ name: 'checked', value: null, q: '' });
  out.push(...controlAttrs(attrs, c, /^(placeholder|maxlength|minlength|pattern|min|max)$/));
  const wcls = wrapAttrs ? clsOf(wrapAttrs).filter(x => !/^(form-check|form-check-label|checkbox|radio|form-check-inline)$/.test(x)) : [];
  const cls = [...clsOf(attrs).filter(x => !/^(form-check-input|checkbox|radio)$/.test(x)), ...wcls];
  if (cls.length) out.push({ name: 'class', value: cls.join(' '), q: '"' });
  st.comp[tag] = (st.comp[tag] || 0) + 1;
  const text = '<' + tag + buildAttrs(out, t.quote) + '></' + tag + '>';
  if (lf) ctx.later.push({ raw: src.substr(lf.index, lf.len), index: lf.index });
  return { from, to, text };
}

/* <button class="toggle" role="switch"> (kit cũ) → sd-switch; legacy-shim đồng bộ lớp .active ↔ checked */
function convertToggles(s, ctx) {
  const { st } = ctx;
  return eachTag(s, /^button$/i, (t, c, src) => {
    const attrs = parseAttrs(t.attrsRaw);
    const clsRaw = getAttr(attrs, 'class') || '';
    if (!/(^|\s)toggle(\s|'|$)/.test(clsRaw) && !/^switch$/i.test(getAttr(attrs, 'role') || '')) return null;
    const close = findClose(src, 'button', t.end); if (!close) return null;
    if (textOf(src.slice(close.innerStart, close.innerEnd))) return null;
    const out = [];
    const dyn = isDynamic(clsRaw);
    if (!dyn && /(^|\s)active(\s|$)/.test(clsRaw)) out.push({ name: 'checked', value: null, q: '' });
    for (const a of attrs) if (/^(id|name|disabled|on[a-z]+|data-[\w-]+|aria-label)$/i.test(a.name)) out.push(a);
    out.push({ name: 'class', value: clsRaw, q: '"' }, { name: 'data-legacy-toggle', value: null, q: '' });
    st.comp['sd-switch'] = (st.comp['sd-switch'] || 0) + 1;
    return { from: t.index, to: close.end, text: '<sd-switch' + buildAttrs(out, t.quote) + '></sd-switch>' };
  });
}

function convertSelects(s, ctx) {
  const { st, js } = ctx;
  return eachTag(s, /^select$/i, (t, c, src, regs) => {
    const attrs = parseAttrs(t.attrsRaw);
    if (isHiddenCtl(attrs)) return null;
    const id = getAttr(attrs, 'id');
    const close = findClose(src, 'select', t.end); if (!close) return null;
    const inner = src.slice(close.innerStart, close.innerEnd);
    const what = 'ô chọn' + (id ? ' #' + id : '');
    /* Không đổi tĩnh được (option dựng bằng JS, hoặc JS dùng .options / .selectedIndex / .add…) → đánh dấu
       data-legacy-upgrade: legacy-shim dựng một <sd-select> Core thay hình, <select> gốc ẩn đi nhưng VẪN là nơi JS cũ đọc /
       ghi (value, options, sự kiện change) — chọn trên sd-select ghi ngược vào <select> và phát change. */
    const proxy = why => {
      if (hasAttr(attrs, 'data-legacy-upgrade')) return null;
      st.comp['sd-select (lúc chạy)'] = (st.comp['sd-select (lúc chạy)'] || 0) + 1;
      ctx.once('select-proxy', 'ô chọn có option dựng bằng JS / JS dùng .options… → giữ <select> làm nguồn dữ liệu, legacy-shim vẽ <sd-select> Core thay hình (data-legacy-upgrade). Trang mới: <sd-select items=…> + sự kiện sd-change');
      return { from: t.index, to: t.end, text: '<select' + t.attrsRaw + ' data-legacy-upgrade>' };
    };
    if (isDynamic(inner) || !/<option\b/i.test(inner)) return proxy('dyn');
    const risk = jsRisk(js, id, RISK_INPUT) || jsRiskCls(js, clsOf(attrs).filter(x => !FIELD_CLS.test(x)), RISK_INPUT);
    if (risk) return proxy(risk);
    if (/<optgroup\b/i.test(inner)) return proxy('optgroup');
    const items = []; let value = null; let placeholder = '';
    for (const o of inner.matchAll(/<option\b([^>]*)>([\s\S]*?)<\/option\s*>/gi)) {
      const oa = parseAttrs(o[1]); const text = textOf(o[2]); const val = getAttr(oa, 'value') ?? text;
      if (val === '' && (hasAttr(oa, 'disabled') || hasAttr(oa, 'hidden'))) { placeholder = text; continue; }
      const it = { id: val, name: text }; if (hasAttr(oa, 'disabled')) it.disabled = true;
      items.push(it);
      if (hasAttr(oa, 'selected')) value = hasAttr(attrs, 'multiple') ? [...(value || []), val] : val;
    }
    const out = [];
    const lf = c === 'html' ? takeLabelFor(src, id, regs) : null;
    if (lf) { const li = labelInfo(lf.html); if (li.text) out.push({ name: 'label', value: attrText(li.text, c), q: '"' }); if (li.req) out.push({ name: 'required', value: null, q: '' }); ctx.later.push({ raw: src.substr(lf.index, lf.len), index: lf.index }); }
    if (placeholder) out.push({ name: 'placeholder', value: attrText(placeholder, c), q: '"' });
    out.push({ name: 'items', value: JSON.stringify(items).replace(/&(?![\w#]+;)/g, '&amp;').replace(/'/g, '&#39;'), q: "'" });
    if (hasAttr(attrs, 'multiple')) out.push({ name: 'multiple', value: null, q: '' });
    if (value !== null) out.push(Array.isArray(value) ? { name: 'value', value: JSON.stringify(value).replace(/'/g, '&#39;'), q: "'" } : { name: 'value', value: attrText(value, c), q: '"' });
    else if (items.length && !placeholder && !hasAttr(attrs, 'multiple')) out.push({ name: 'value', value: attrText(items[0].id, c), q: '"' });  // <select> trần luôn chọn option đầu
    out.push(...controlAttrs(attrs, c, /^(placeholder)$/));
    hostClass(attrs, ctx, out);
    if (inCell(src, t.index)) out.push({ name: 'size', value: 'sm', q: '"' }, { name: 'hideInlineError', value: null, q: '' });
    /* <select> trần tự rộng theo option dài nhất; sd-select rộng 100% vật chứa → trong hàng flex nó co về ~0. Giữ bề rộng tối thiểu cũ. */
    minWidth(out, Math.max(...items.map(i => String(i.name).length), placeholder.length, 4) + 7 + 'ch');
    out.push({ name: 'data-legacy-change', value: null, q: '' });
    st.comp['sd-select'] = (st.comp['sd-select'] || 0) + 1;
    /* mũi tên tự vẽ ngay sau <select> (span icon expand_more) → sd-select đã có mũi tên → bỏ, khỏi hai mũi tên */
    const arrow = src.slice(close.end).match(/^\s*<span\b[^>]*class\s*=\s*"[^"]*material-(?:icons|symbols)[^"]*"[^>]*>\s*(?:expand_more|arrow_drop_down|keyboard_arrow_down|unfold_more)\s*<\/span>/);
    return { from: t.index, to: close.end + (arrow ? arrow[0].length : 0), text: '<sd-select' + buildAttrs(out, t.quote) + '></sd-select>' };
  });
}

function convertTextareas(s, ctx) {
  const { st, js } = ctx;
  /* <textarea> là vùng 'skip' của regions() (nội dung là chữ) — quét riêng */
  const regs = regions(s);
  return s.replace(/<textarea\b([^>]*)>([\s\S]*?)<\/textarea\s*>/gi, (m, a, body, i) => {
    const c = ctxAt(regs, i); if (c === 'skip') return m;
    if (isHiddenCtl(parseAttrs(a))) return m;
    if (c === 'js' && /\\["']/.test(a)) return m;
    let quote = null;
    if (c === 'js') { if (eachTag.noJs) return m; const reg = regs.find(r => i >= r.start && i < r.end); quote = jsQuoteAt(s, reg.start, i); if (!quote) return m; }
    const t = { quote };
    const attrs = parseAttrs(a); const id = getAttr(attrs, 'id');
    const risk = jsRisk(js, id, 'select|setSelectionRange|selectionStart|selectionEnd');
    if (risk) { ctx.note('ô textarea #' + id + ' — JS dùng .' + risk + ' → đổi tay'); return m; }
    const out = [];
    const lf = c === 'html' ? takeLabelFor(s, id, regs) : null;
    if (lf) { const li = labelInfo(lf.html); if (li.text) out.push({ name: 'label', value: attrText(li.text, c), q: '"' }); if (li.req) out.push({ name: 'required', value: null, q: '' }); ctx.later.push({ raw: s.substr(lf.index, lf.len), index: lf.index }); }
    const rows = getAttr(attrs, 'rows'); if (rows) out.push({ name: 'rows', value: rows, q: '"' });
    if (body.trim()) out.push({ name: 'value', value: isDynamic(body) ? body : attrText(body.trim(), c), q: '"' });
    out.push(...controlAttrs(attrs, c));
    hostClass(attrs, ctx, out);
    st.comp['sd-textarea'] = (st.comp['sd-textarea'] || 0) + 1;
    return '<sd-textarea' + buildAttrs(out, t.quote) + '></sd-textarea>';
  });
}

/* ─────────────────────────────── 5. Bảng ─────────────────────────────── */
function convertTables(s, ctx) {
  const { st, js } = ctx;
  return eachTag(s, /^table$/i, (t, c, src) => {
    if (c !== 'html') { ctx.once('table-js', 'bảng <table> dựng bằng JS — đổi tay sang <sd-table columns=…> và gán el.setAttribute(\'data\', JSON.stringify(rows))'); return null; }
    const attrs = parseAttrs(t.attrsRaw); const id = getAttr(attrs, 'id'); const cls = clsOf(attrs);
    const close = findClose(src, 'table', t.end); if (!close) return null;
    const inner = src.slice(close.innerStart, close.innerEnd);
    const what = 'bảng' + (id ? ' #' + id : cls.length ? ' .' + cls[0] : '');
    if (/<table\b/i.test(inner)) { ctx.note(what + ' lồng bảng con — đổi tay'); return null; }
    if (/\b(rowspan|colspan)\s*=/.test(inner)) { ctx.note(what + ' có rowspan/colspan — sd-table không gộp ô → đổi tay'); return null; }
    const hooked = (id && referenced(js, id)) || cls.some(x => ctx.pc.hooks.has(x)) || (id && new RegExp('#' + id + '\\s+(tbody|tr|td)').test(js));
    if (hooked) { ctx.note(what + ' — JS của trang đọc / ghi bảng này (thêm dòng, đổi ô…) → đổi tay sang <sd-table> (gán thuộc tính data / sự kiện sd-table-command)'); return null; }
    if (/<tr\b[^>]*\son[a-z]+=/.test(inner)) { ctx.note(what + ' — dòng có onclick → đổi tay (sd-table: cột command / sự kiện)'); return null; }
    /* 2026-10-15 — bảng "tĩnh" mà JS vẫn đụng tới qua phần tử BÊN TRONG (thường gặp: <tbody id="x"></tbody> rỗng chờ
       JS đổ dòng) bị đổi thành sd-table cố định → mất id, JS không ghi được, cột / dòng biến mất. Không chắc → không đổi. */
    const innerIds = [...inner.matchAll(/\sid\s*=\s*["']([^"']+)["']/g)].map(x => x[1]);
    if (innerIds.length) { ctx.note(what + ' — có id bên trong (' + innerIds.slice(0, 3).join(', ') + ') → JS có thể đổ / đọc dòng → đổi tay sang <sd-table> + el.setAttribute(\'data\', …)'); return null; }
    const innerCls = [...inner.matchAll(/\sclass\s*=\s*["']([^"']+)["']/g)].flatMap(x => x[1].split(/\s+/)).filter(Boolean);
    const hookCls = innerCls.find(x => ctx.pc.hooks.has(x));
    if (hookCls) { ctx.note(what + ' — JS của trang tìm phần tử .' + hookCls + ' trong bảng → đổi tay'); return null; }
    if (/\son[a-z]+\s*=/.test(inner) || /<(input|select|textarea|button|sd-(?:button|input|input-number|select|autocomplete|checkbox|radio|switch|textarea|date|datetime|date-range|upload-file))\b/i.test(inner)) { ctx.note(what + ' — ô có nút / ô nhập / sự kiện → đổi tay (sd-table: cột raw / command)'); return null; }
    if ((inner.match(/<thead\b[^>]*>[\s\S]*?<\/thead>/i) || [''])[0].split(/<tr\b/i).length > 2) { ctx.note(what + ' — tiêu đề nhiều hàng (hàng lọc / gộp tiêu đề) → đổi tay'); return null; }
    if (!/<td\b/i.test(inner.replace(/<thead\b[\s\S]*?<\/thead>/i, ''))) { ctx.note(what + ' — chưa có dòng nào (JS đổ dữ liệu lúc chạy?) → đổi tay'); return null; }
    const thead = inner.match(/<thead\b[^>]*>([\s\S]*?)<\/thead>/i);
    const headRow = thead ? thead[1] : (inner.match(/<tr\b[^>]*>((?:(?!<\/tr>)[\s\S])*?<th\b[\s\S]*?)<\/tr>/i) || [])[1];
    if (!headRow) { ctx.note(what + ' không có hàng tiêu đề — bảng bố cục? → giữ nguyên'); return null; }
    const ths = [...headRow.matchAll(/<th\b([^>]*)>([\s\S]*?)<\/th\s*>/gi)];
    if (!ths.length) return null;
    const bodyPart = thead ? inner.slice(inner.indexOf(thead[0]) + thead[0].length) : inner.replace(headRow, '');
    const rows = [...bodyPart.matchAll(/<tr\b([^>]*)>([\s\S]*?)<\/tr\s*>/gi)].map(r => [...r[2].matchAll(/<td\b([^>]*)>([\s\S]*?)<\/td\s*>/gi)].map(x => x[2].trim()));
    if (rows.some(r => r.length && r.length !== ths.length)) { ctx.note(what + ' — số ô mỗi dòng không đều → đổi tay'); return null; }
    if (/<tfoot\b/i.test(inner)) ctx.note(what + ' có tfoot — sd-table không có chân bảng tự do, phần tfoot đã bỏ (xem bản gốc)');
    const cols = ths.map((th, i) => {
      const ta = parseAttrs(th[1]);
      const col = { field: 'c' + i, title: textOf(th[2]).replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ') };
      const hasHtml = rows.some(r => /<[a-z]/i.test(r[i] || ''));
      col.type = hasHtml ? 'raw' : 'string';
      const w = ((getAttr(ta, 'style') || '').match(/(?:^|;)\s*width\s*:\s*([^;]+)/) || [])[1] || getAttr(ta, 'width');
      if (w) col.width = /^\d+$/.test(w.trim()) ? w.trim() + 'px' : w.trim();
      if (/text-align\s*:\s*right|\btext-right\b/.test(th[1])) col.align = 'right';
      return col;
    });
    const dec = t => t.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
    const data = rows.filter(r => r.length).map(r => Object.fromEntries(r.map((v, i) => [cols[i].field, cols[i].type === 'raw' ? v : dec(textOf(v))])));
    const enc = o => JSON.stringify(o).replace(/&/g, '&amp;').replace(/'/g, '&#39;');
    const out = [];
    if (id) out.push({ name: 'id', value: id, q: '"' });
    /* lớp của trang có luật nhắm vào phần tử con của bảng (`.x td`, `.x th`, `.x tr:hover`…) → không gắn lên sd-table:
       luật đó sẽ đè vào ô của bảng Core (lệch đệm / viền / màu). Lớp chỉ đặt khoảng cách / bố cục thì giữ. */
    const css = (ctx.pc && ctx.pc.css) || '';
    const leaks = x => new RegExp('\\.' + x.replace(/[-]/g, '\\-') + '(?![\\w-])[^{},]*\\b(td|th|tr|thead|tbody|tfoot|table|caption)\\b').test(css);
    const keep = cls.filter(x => !/^(table|data-table|table-striped|table-bordered|table-hover|table-sm)$/.test(x) && !leaks(x));
    const dropped = cls.filter(x => leaks(x));
    if (dropped.length) ctx.note(what + ' — bỏ lớp .' + dropped.join(' .') + ' khỏi sd-table (luật CSS của trang nhắm vào ô bảng, sẽ đè bảng Core)');
    if (keep.length) out.push({ name: 'class', value: keep.join(' '), q: '"' });
    out.push({ name: 'hide-inline-filter', value: null, q: '' });
    /* bảng HTML cũ không có cột "#" — `no-index` để chế độ trang cũ (data-legacy-dom) không thêm cột đó */
    out.push({ name: 'no-index', value: null, q: '' });
    out.push({ name: 'columns', value: enc(cols), q: "'" }, { name: 'data', value: enc(data), q: "'" });
    st.comp['sd-table'] = (st.comp['sd-table'] || 0) + 1;
    /* bọc <div>: sd-table là con trực tiếp của .content-zone thì layout chuyển sang chế độ "bảng chiếm hết chiều cao"
       (Browse) — bảng tĩnh cũ nằm giữa trang không phải vậy, giữ dòng chảy như cũ */
    return { from: t.index, to: close.end, text: '<div><sd-table' + buildAttrs(out, t.quote) + '></sd-table></div>' };
  });
}

/* ───────────────────────── 6. Modal / drawer tự dựng ───────────────────────── */
const MODAL_OVERLAY = /^(overlay|backdrop|[\w-]+-(?:overlay|backdrop|mask)|modal-wrapper|modal-container)$/;
const MODAL_BOX = /^(modal|modal-dialog|modal-content|dialog|popup|modal-box|modal-panel)$/;
const DRAWER = /^(drawer|side-drawer|side-panel|offcanvas|slide-panel|drawer-panel|sidesheet|side-sheet)$/;
function pickPart(html, re) {
  /* tìm trên bản đã xoá trắng chú thích HTML (cùng độ dài → vị trí khớp bản gốc): markup nằm trong <!-- … --> không phải
     phần đang hiện (2026-10-15) */
  const blank = html.replace(/<!--[\s\S]*?-->/g, x => ' '.repeat(x.length));
  const m = blank.match(new RegExp('<(div|header|footer|section|h[1-6])\\b([^>]*class\\s*=\\s*"[^"]*\\b(?:' + re + ')\\b[^"]*"[^>]*)>', 'i'));
  if (!m) return null;
  const tag = m[1]; const start = m.index; const cl = findClose(blank, tag, start + m[0].length);
  if (!cl) return null;
  return { start, end: cl.end, attrs: parseAttrs(m[2]), inner: html.slice(cl.innerStart, cl.innerEnd), tag };
}
function convertOverlays(s, ctx) {
  const { st, js } = ctx;
  return eachTag(s, /^(div|section|aside)$/i, (t, c, src) => {
    const attrs = parseAttrs(t.attrsRaw); const cls = clsOf(attrs);
    const role = (getAttr(attrs, 'role') || '').toLowerCase();
    const isOverlay = cls.some(x => MODAL_OVERLAY.test(x));
    const isBox = cls.some(x => MODAL_BOX.test(x)) || role === 'dialog' || hasAttr(attrs, 'aria-modal');
    const isDrawer = cls.some(x => DRAWER.test(x));
    if (!isOverlay && !isBox && !isDrawer) return null;
    if (c !== 'html') { ctx.once('modal-js', 'modal / drawer dựng bằng JS — đổi tay sang <sd-modal> / <sd-side-drawer> và gọi .open() / .close()'); return null; }
    const close = findClose(src, t.name, t.end); if (!close) return null;
    let inner = src.slice(close.innerStart, close.innerEnd);
    let boxAttrs = attrs, ids = [getAttr(attrs, 'id')].filter(Boolean);
    if (isOverlay && !isBox && !isDrawer) {
      /* lớp phủ bọc hộp: lấy hộp bên trong */
      /* hộp = phần tử con DUY NHẤT của lớp phủ (lớp gì cũng được: .import-dialog, .modal-dialog…) */
      const bm = inner.replace(/<!--[\s\S]*?-->/g, m => ' '.repeat(m.length)).match(/^\s*<(div|section|aside|form)\b((?:[^>"']|"[^"]*"|'[^']*')*)>/i);
      if (!bm) return null;
      const bs = bm[0].search(/\S/); const bc = findClose(inner, bm[1], bm[0].length); if (!bc) return null;
      if (textOf(inner.slice(0, bs) + inner.slice(bc.end))) return null;
      boxAttrs = parseAttrs(bm[2]); const bid = getAttr(boxAttrs, 'id'); if (bid) ids.push(bid);
      inner = inner.slice(bc.innerStart, bc.innerEnd);
    }
    const drawer = isDrawer || clsOf(boxAttrs).some(x => DRAWER.test(x));
    const kind = drawer ? 'sd-side-drawer' : 'sd-modal';
    if (ids.length > 1 && ids.every(i => referenced(js, i))) { ctx.note('modal #' + ids.join(' / #') + ' — JS gọi cả lớp phủ lẫn hộp → đổi tay sang <' + kind + '>'); return null; }
    const id = ids.find(i => referenced(js, i)) || ids[0];
    /* đầu / thân / chân */
    const head = pickPart(inner, '[\\w-]*(?:modal|dialog|drawer|panel|popup|sheet)-header|header');
    let title = '', headLeft = '', headRight = '', onClose = '';
    let rest = inner;
    const CLOSE_BTN = /<(button|sd-button|a)\b[^>]*>[\s\S]*?<\/\1>/gi;
    const openTag = b => b.slice(0, b.indexOf('>') + 1);
    /* nút đóng góc hộp (X) — KHÔNG phải nút có nhãn ("Bỏ qua", "Thoát"…) ở chân hộp */
    const isClose = b => {
      const o = openTag(b), oa = parseAttrs(o.replace(/^<[\w-]+|\/?>$/g, ''));
      const label = /^<sd-button/i.test(o) ? (getAttr(oa, 'title') || '') : textOf(b.replace(ICON_SPAN_G, ''));
      if (label && !/^(×|&times;|✕|x)$/i.test(label.trim())) return false;
      if (/(^|\s)(close|modal-close|drawer-close|btn-close|panel-close|dialog-close)(\s|$)/.test(getAttr(oa, 'class') || '')) return true;
      if (/^close$/i.test(getAttr(oa, 'prefixIcon') || '')) return true;
      if (/>\s*(×|&times;|✕)\s*</.test(b)) return true;
      if (/material-(icons|symbols)[^>]*>\s*close\s*</.test(b)) return true;
      return /^(Đóng|Close|Thoát|Bỏ qua)$/i.test(getAttr(oa, 'aria-label') || '');
    };
    const ocOf = b => getAttr(parseAttrs(openTag(b).replace(/^<[\w-]+|\/?>$/g, '')), 'onclick');
    if (head) {
      let h = head.inner;
      /* nút đóng → component đã có nút X; onclick cũ giữ ở data-legacy-onclose, legacy-shim gọi khi đóng */
      h = h.replace(CLOSE_BTN, b => { if (!isClose(b)) return b; const oc = ocOf(b); if (oc) onClose = oc; return ''; });
      const tEl = h.match(/<(h[1-6])\b([^>]*)>([\s\S]*?)<\/\1>/i) || h.match(/<(div|span|p)\b([^>]*class\s*=\s*"[^"]*title[^"]*"[^>]*)>((?:(?!<div\b)[\s\S])*?)<\/\1>/i);
      let tid = '';
      if (tEl) { title = textOf(tEl[3].replace(ICON_SPAN_G, '')); tid = getAttr(parseAttrs(tEl[2]), 'id') || ''; h = h.replace(tEl[0], ''); }
      h = h.replace(ICON_SPAN_G, '');
      const btns = []; h = h.replace(/<(sd-button|button)\b[\s\S]*?<\/\1>/gi, b => { btns.push(b); return ''; });
      /* phần còn lại của đầu hộp (phụ đề, mã…) hoặc tiêu đề có id JS ghi vào → vùng trái [sdHeaderLeft] */
      const leftHasContent = textOf(h) || /\sid\s*=/.test(h);
      if (leftHasContent || (tid && referenced(js, tid))) {
        const subs = [...h.matchAll(/<(span|div|p|small)\b([^>]*)>((?:(?!<\/?(?:span|div|p|small)\b)[\s\S])*?)<\/\1>/gi)].filter(x => textOf(x[3]) || /\sid\s*=/.test(x[2]))
          .map(x => { const xa = parseAttrs(x[2]).filter(a => /^(id|data-[\w-]+)$/i.test(a.name)); return '<div class="T14R text-secondary"' + buildAttrs(xa) + '>' + x[3] + '</div>'; });
        headLeft = '<div sdHeaderLeft><div class="T20M"' + (tid ? ' id="' + tid + '"' : '') + '>' + (tEl ? tEl[3].replace(ICON_SPAN_G, '').trim() : '') + '</div>' + subs.join('') + '</div>';
      }
      if (btns.length) headRight = '<div sdHeaderRight class="d-flex align-items-center gap-8">' + btns.join('') + '</div>';
      rest = rest.slice(0, head.start) + rest.slice(head.end);
    } else {
      const h = rest.match(/^\s*<(h[1-6])\b([^>]*)>([\s\S]*?)<\/\1>/i);
      if (h) { title = textOf(h[3]); const tid = getAttr(parseAttrs(h[2]), 'id'); if (tid) headLeft = '<div sdHeaderLeft><div class="T20M" id="' + tid + '">' + h[3] + '</div></div>'; rest = rest.replace(h[0], ''); }
    }
    /* nút đóng ở góc hộp, ngoài đầu hộp */
    {
      const cut = rest.search(/<[a-z][\w-]*\b[^>]*class\s*=\s*"[^"]*(?:modal|dialog|drawer|panel|popup|sheet)-(?:body|content|footer)\b/i);
      const top = cut < 0 ? rest.slice(0, 400) : rest.slice(0, cut);
      const topNew = top.replace(CLOSE_BTN, b => { if (!isClose(b)) return b; const oc = ocOf(b); if (oc && !onClose) onClose = oc; return ''; });
      rest = topNew + rest.slice(top.length);
    }
    if (!title) { ctx.note('hộp ' + (id ? '#' + id : '') + ' không thấy tiêu đề — sd-modal không tiêu đề sẽ mất cả nút X (catalog) → kiểm tra'); }
    const foot = pickPart(rest, '[\\w-]*(?:modal|dialog|drawer|panel|popup)-footer|footer|modal-actions|dialog-actions');
    let footer = '';
    if (foot) { footer = foot.inner; rest = rest.slice(0, foot.start) + rest.slice(foot.end); }
    const out = [];
    if (id) out.push({ name: 'id', value: id, q: '"' });
    /* sd-side-drawer vẽ CẢ title lẫn [sdHeaderLeft] cạnh nhau (catalog) → có vùng trái thì bỏ title; sd-modal thì vùng trái
       thay chỗ tiêu đề mặc định, còn title rỗng là mất cả header + nút X → giữ title */
    out.push({ name: 'title', value: drawer && headLeft ? '' : attrText(title, c), q: '"' });
    const st0 = getAttr(boxAttrs, 'style') || '';
    const w = (st0.match(/(?:^|;)\s*(?:max-)?width\s*:\s*([^;]+)/) || [])[1];
    const bcls = clsOf(boxAttrs);
    const wcls = bcls.includes('modal-sm') ? '40vw' : bcls.includes('modal-lg') ? '80vw' : bcls.includes('modal-xl') ? '80vw' : '';
    if (w || wcls) out.push({ name: 'width', value: (w || wcls).trim(), q: '"' });
    for (const a of [...attrs, ...boxAttrs]) if (/^(data-[\w-]+|aria-label)$/i.test(a.name) && !out.some(o => o.name === a.name)) out.push(a);
    const hook = [...new Set([...cls, ...bcls])].filter(x => !MODAL_OVERLAY.test(x) && !MODAL_BOX.test(x) && !DRAWER.test(x) && !/^(open|show|active|hidden|modal-(sm|lg|xl)|fade|in)$/.test(x));
    if (hook.length) out.push({ name: 'class', value: hook.join(' '), q: '"' });
    const visible = /(^|\s)(open|show|active)(\s|$)/.test(getAttr(attrs, 'class') || '');
    if (kind === 'sd-modal') out.push({ name: 'lazyLoadContent', value: 'false', q: '"' });   // JS cũ ghi vào nội dung TRƯỚC khi mở
    out.push({ name: 'data-legacy-modal', value: visible ? 'open' : '', q: '"' });
    if (onClose) out.push({ name: 'data-legacy-onclose', value: onClose, q: '"' });
    const bodyPart = pickPart(rest, '[\\w-]*(?:modal|dialog|drawer|panel|popup)-body|body');
    let body = rest;
    if (!bodyPart) body = '<div class="' + (drawer ? 'p-16' : 'pb-16') + '">' + rest + '</div>';
    const text = '<' + kind + buildAttrs(out, t.quote) + '>' + headLeft + headRight + body +
      (footer.trim() ? '<div sdFooter class="d-flex align-items-center justify-content-end gap-8">' + footer + '</div>' : '') + '</' + kind + '>';
    st.comp[kind] = (st.comp[kind] || 0) + 1;
    ctx.once('modal', 'modal / drawer tự dựng → <sd-modal> / <sd-side-drawer>: mở / đóng bằng JS cũ (style.display, classList open/show/active, hidden) vẫn chạy nhờ legacy-shim.js; trang mới gọi el.open() / el.close()');
    return { from: t.index, to: close.end, text };
  });
}

/* ───────────────────── 6b. Thanh tab tự dựng → sd-tab-group ───────────────────── */
const TABBAR = /^(tabs|tab-list|tab-bar|nav-tabs|tabs-nav|tab-header|tab-nav|tab-buttons|page-tabs)$/;
const TABITEM = /^(tab|tab-btn|tab-button|tab-item|nav-link|tab-link)$/;
function convertTabs(s, ctx) {
  const { st, js } = ctx;
  return eachTag(s, /^(div|nav|ul)$/i, (t, c, src) => {
    if (c !== 'html') return null;
    const attrs = parseAttrs(t.attrsRaw); const cls = clsOf(attrs);
    if (!cls.some(x => TABBAR.test(x)) && !/^tablist$/i.test(getAttr(attrs, 'role') || '')) return null;
    const close = findClose(src, t.name, t.end); if (!close) return null;
    const bar = src.slice(close.innerStart, close.innerEnd);
    /* nút tab */
    const items = [];
    for (const m of bar.matchAll(/<(button|a|div|span|li)\b((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/\1\s*>/gi)) {
      const ia = parseAttrs(m[2]); const icl = clsOf(ia);
      const inner = m[3].replace(/^\s*<(a|button)\b[^>]*>([\s\S]*?)<\/\1>\s*$/i, '$2');
      const linkAttrs = m[1].toLowerCase() === 'li' ? parseAttrs(((m[3].match(/<(?:a|button)\b([^>]*)>/i) || [])[1]) || '') : ia;
      const all = [...ia, ...linkAttrs];
      if (![...icl, ...clsOf(linkAttrs)].some(x => TABITEM.test(x)) && !/^tab$/i.test(getAttr(all, 'role') || '')) continue;
      let target = (getAttr(all, 'data-tab') || getAttr(all, 'data-target') || getAttr(all, 'data-panel') || getAttr(all, 'aria-controls') || (getAttr(all, 'href') || '').replace(/^#/, '') || '').replace(/^#/, '');
      if (!target) {
        /* onclick="showTab('info')" → khối có id info / info-panel / panel-info / tab-info-panel… nằm sau thanh tab */
        const arg = ((getAttr(all, 'onclick') || '').match(/\(\s*['"]([\w-]+)['"]/) || [])[1];
        if (arg) target = [arg, arg + '-panel', 'panel-' + arg, arg + '-tab', 'tab-' + arg, arg + '-content', 'tab-panel-' + arg].find(x => new RegExp('\\sid\\s*=\\s*["\']' + x + '["\']').test(src.slice(close.end))) || '';
      }
      const ic = inner.match(ICON_SPAN);
      const badge = (inner.match(/<span\b[^>]*class\s*=\s*"[^"]*(count|badge|tab-count)[^"]*"[^>]*>([^<]*)<\/span>/i) || [])[2];
      const label = textOf(inner.replace(ICON_SPAN_G, '').replace(/<span\b[^>]*class\s*=\s*"[^"]*(count|badge|tab-count)[^"]*"[^>]*>[^<]*<\/span>/gi, ''));
      items.push({ label, icon: ic && ic[3], badge, target, id: getAttr(all, 'id'), onclick: getAttr(all, 'onclick'), active: /(^|\s)(active|selected|is-active)(\s|$)/.test(getAttr(all, 'class') || '') || getAttr(all, 'aria-selected') === 'true',
        hook: [...new Set([...icl, ...clsOf(linkAttrs)])].filter(x => !TABITEM.test(x) && !/^(active|selected|is-active|nav-item)$/.test(x)), disabled: hasAttr(all, 'disabled') });
    }
    if (items.length < 2) return null;
    if (items.some(i => isDynamic(i.label) || !i.label)) { ctx.note('thanh tab có nhãn dựng bằng JS / rỗng → đổi tay sang <sd-tab-group>'); return null; }
    /* thân tab: theo id đích, hoặc khối .tab-content/.tab-panels liền sau với số ô bằng số tab */
    const after = src.slice(close.end);
    let panels = [], spanEnd = close.end;
    const byId = items.every(i => i.target) && items.map(i => {
      const m = after.match(new RegExp('<(div|section|article)\\b([^>]*\\sid\\s*=\\s*["\']' + i.target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '["\'][^>]*)>', 'i'));
      if (!m) return null;
      const st0 = close.end + after.indexOf(m[0]); const cl = findClose(src, m[1], st0 + m[0].length); if (!cl) return null;
      return { start: st0, end: cl.end, open: m[0], tag: m[1], attrs: parseAttrs(m[2]), inner: src.slice(cl.innerStart, cl.innerEnd) };
    });
    if (byId && byId.every(Boolean)) panels = byId;
    else {
      const wm = after.match(/^\s*<(div|section)\b([^>]*class\s*=\s*"[^"]*(?<![\w-])(tab-content|tab-panels|tab-body|tabs-content)(?![\w-])[^"]*"[^>]*)>/i);
      if (wm) {
        const ws = close.end + wm[0].search(/<\S/); const wc = findClose(src, wm[1], close.end + wm[0].length);
        if (wc) {
          const wi = src.slice(wc.innerStart, wc.innerEnd); const ps = []; let mm; const re = /<(div|section)\b((?:[^>"']|"[^"]*"|'[^']*')*)>/gi;
          while ((mm = re.exec(wi))) { const pc0 = findClose(wi, mm[1], mm.index + mm[0].length); if (!pc0) break; ps.push({ start: wc.innerStart + mm.index, end: wc.innerStart + pc0.end, attrs: parseAttrs(mm[2]), inner: wi.slice(pc0.innerStart, pc0.innerEnd) }); re.lastIndex = pc0.end; }
          if (ps.length === items.length) { panels = ps; panels.wrap = { start: ws, end: wc.end }; }
        }
      }
    }
    if (panels.length !== items.length) { ctx.note('thanh tab "' + items.map(i => i.label).join(' / ') + '" — không ghép được nút tab với khối nội dung → đổi tay sang <sd-tab-group>'); return null; }
    /* các khối thân phải nằm liền nhau ngay sau thanh tab (chỉ cách nhau khoảng trắng / chú thích) */
    const order = panels.slice().sort((a, b) => a.start - b.start);
    const region = panels.wrap || { start: order[0].start, end: order[order.length - 1].end };
    let gap = src.slice(close.end, region.start);
    for (let i = 1; i < order.length && !panels.wrap; i++) gap += src.slice(order[i - 1].end, order[i].start);
    if (textOf(gap.replace(/<!--[\s\S]*?-->/g, '')) || /<[a-z]/i.test(gap.replace(/<!--[\s\S]*?-->/g, ''))) { ctx.note('thanh tab "' + items.map(i => i.label).join(' / ') + '" — giữa thanh tab và nội dung có khối khác → đổi tay sang <sd-tab-group>'); return null; }
    /* JS gọi id nút tab bằng getElementById … → id chuyển sang sd-tab (vẫn tồn tại). Khối thân giữ nguyên id/lớp bên trong sd-tab. */
    const sel = Math.max(0, items.findIndex(i => i.active));
    const tabs = items.map((it, k) => {
      const p = panels[k];
      const a = [{ name: 'label', value: attrText(it.label, c), q: '"' }];
      if (it.icon) a.push({ name: 'icon', value: it.icon, q: '"' });
      if (it.badge && textOf(it.badge)) a.push({ name: 'badge', value: textOf(it.badge), q: '"' });
      if (it.disabled) a.push({ name: 'disabled', value: null, q: '' });
      if (it.id) a.push({ name: 'id', value: it.id, q: '"' });
      if (it.hook.length) a.push({ name: 'class', value: it.hook.join(' '), q: '"' });
      if (it.onclick) a.push({ name: 'data-legacy-onselect', value: it.onclick, q: '"' });
      const pa = p.attrs.filter(x => /^(id|class|data-[\w-]+)$/i.test(x.name)).map(x => x.name.toLowerCase() === 'class' ? { ...x, value: clsOf([x]).filter(y => !/^(active|show|hidden|d-none|tab-pane|tab-panel|fade|in)$/.test(y)).concat(['legacy-tab-panel']).join(' ') } : x);
      return '<sd-tab' + buildAttrs(a) + '><div' + buildAttrs(pa) + ' data-legacy-panel>' + p.inner + '</div></sd-tab>';
    });
    const ga = [{ name: 'selectedIndex', value: String(sel), q: '"' }];
    const id = getAttr(attrs, 'id'); if (id) ga.push({ name: 'id', value: id, q: '"' });
    const hook = cls.filter(x => !TABBAR.test(x)); if (hook.length) ga.push({ name: 'class', value: hook.join(' '), q: '"' });
    const text = '<sd-tab-group' + buildAttrs(ga) + '>' + tabs.join('') + '</sd-tab-group>';
    st.comp['sd-tab-group'] = (st.comp['sd-tab-group'] || 0) + 1;
    /* thay thanh tab bằng nhóm tab, xoá khối thân ở chỗ cũ */
    const tail = src.slice(region.end);
    ctx.once('tabs', 'thanh tab tự dựng → <sd-tab-group>: onclick cũ của nút tab chạy khi chọn tab (legacy-shim), khối thân giữ id / lớp');
    return { from: t.index, to: region.end, text };
  });
}

/* ───────────────────── 7. Card / section / info item (kit cũ) ───────────────────── */
function convertCards(s, ctx) {
  const { st } = ctx;
  return eachTag(s, /^(div|section)$/i, (t, c, src) => {
    if (c !== 'html') return null;
    const attrs = parseAttrs(t.attrsRaw); const cls = clsOf(attrs);
    const kind = cls.find(x => /^(card|form-card|detail-section)$/.test(x));
    if (!kind) return null;
    const close = findClose(src, t.name, t.end); if (!close) return null;
    const inner = src.slice(close.innerStart, close.innerEnd);
    const head = pickPart(inner, kind + '-header');
    const body = pickPart(inner, kind + '-body');
    if (!head || !body) return null;
    const titleM = head.inner.match(new RegExp('<(\\w+)\\b[^>]*class\\s*=\\s*"[^"]*\\b' + kind + '-title\\b[^"]*"[^>]*>([\\s\\S]*?)<\\/\\1>', 'i'));
    if (!titleM) return null;
    const ic = head.inner.match(ICON_SPAN);
    let extra = head.inner.replace(titleM[0], '').replace(ICON_SPAN, '');
    const collapsible = /chevron|expand_(more|less)|-chevron/.test(extra);
    extra = extra.replace(/<(span|i|button)\b[^>]*(chevron|toggle)[^>]*>[\s\S]*?<\/\1>/gi, '');
    const footerPart = pickPart(inner, kind + '-footer');
    const out = [{ name: 'title', value: attrText(textOf(titleM[2]), c), q: '"' }];
    if (ic) out.push({ name: 'icon', value: ic[3], q: '"' });
    if (collapsible) out.push({ name: 'collapsible', value: null, q: '' });
    if (/(^|\s)collapsed(\s|$)/.test(getAttr(attrs, 'class') || '')) out.push({ name: 'collapsed', value: null, q: '' });
    for (const a of attrs) if (/^(id|data-[\w-]+)$/i.test(a.name)) out.push(a);
    const keep = cls.filter(x => x !== kind && !/^(collapsed|open)$/.test(x));
    if (keep.length) out.push({ name: 'class', value: keep.join(' '), q: '"' });
    const right = textOf(extra) || /<sd-|<button/i.test(extra) ? '<div sdHeaderRight class="d-flex align-items-center gap-8">' + extra.trim() + '</div>' : '';
    const text = '<sd-section' + buildAttrs(out, t.quote) + '>' + right + body.inner + (footerPart ? footerPart.inner : '') + '</sd-section>';
    st.comp['sd-section'] = (st.comp['sd-section'] || 0) + 1;
    return { from: t.index, to: close.end, text, resume: ('<sd-section' + buildAttrs(out, t.quote) + '>').length };
  });
}
function convertInfoItems(s, ctx) {
  const { st } = ctx;
  return eachTag(s, /^div$/i, (t, c, src) => {
    const attrs = parseAttrs(t.attrsRaw); const clsRaw = getAttr(attrs, 'class') || '';
    if (isDynamic(clsRaw) || !/(^|\s)(detail-info-item|info-item)(\s|$)/.test(clsRaw)) return null;
    const close = findClose(src, 'div', t.end); if (!close) return null;
    const inner = src.slice(close.innerStart, close.innerEnd);
    const lab = pickPart(inner, 'detail-info-label|info-label'); const val = pickPart(inner, 'detail-info-value|info-value');
    if (!lab || !val) return null;
    const out = [{ name: 'label', value: attrText(isDynamic(lab.inner) ? lab.inner.trim() : textOf(lab.inner), c), q: '"' }];
    for (const a of attrs) if (/^(id|data-[\w-]+)$/i.test(a.name)) out.push(a);
    const vid = getAttr(val.attrs, 'id');
    const content = vid ? '<span id="' + vid + '">' + val.inner + '</span>' : val.inner;
    st.comp['sd-section-item'] = (st.comp['sd-section-item'] || 0) + 1;
    return { from: t.index, to: close.end, text: '<sd-section-item' + buildAttrs(out, t.quote) + '>' + content + '</sd-section-item>' };
  });
}

/* ───────────────────── 8. Header trang viết tay → DOM header của sd-page ───────────────────── */
function convertHandHeader(s, ctx) {
  const { st } = ctx;
  return eachTag(s, /^(div|header)$/i, (t, c, src) => {
    if (c !== 'html') return null;
    const attrs = parseAttrs(t.attrsRaw); const cls = clsOf(attrs);
    if (!cls.includes('page-header') || hasAttr(attrs, 'data-pattern')) return null;
    const close = findClose(src, t.name, t.end); if (!close) return null;
    let inner = src.slice(close.innerStart, close.innerEnd);
    if (/c-page-header/.test(inner)) return null;
    /* markup nằm trong chú thích HTML (template cũ để sẵn `<!-- <span class="record-id">#{{RECORD_ID}}</span> … -->`) không
       phải nội dung đang hiện — trước 2026-10-15 công cụ bốc cả vào header mới, lộ ra "#{{RECORD_ID}} {{STATUS}}". Cất chú
       thích ra, giữ nguyên văn ở đầu khối header mới. */
    const comments = (inner.match(/<!--[\s\S]*?-->/g) || []).join('\n');
    inner = inner.replace(/<!--[\s\S]*?-->/g, '');
    const titleM = inner.match(/<(h[1-6]|div|span)\b([^>]*class\s*=\s*"[^"]*(?<![\w-])page-title(?![\w-])[^"]*"[^>]*)>([\s\S]*?)<\/\1>/i);
    if (!titleM) { ctx.note('header viết tay không có .page-title — đổi tay sang data-pattern="page-header"'); return null; }
    const tAttrs = parseAttrs(titleM[2]); const tid = getAttr(tAttrs, 'id');
    const actM = inner.match(/<div\b([^>]*class\s*=\s*"[^"]*(?<![\w-])page-header-actions(?![\w-])[^"]*"[^>]*)>/i);
    let actions = '';
    if (actM) { const as = inner.indexOf(actM[0]); const ac = findClose(inner, 'div', as + actM[0].length); if (ac) { actions = inner.slice(ac.innerStart, ac.innerEnd); inner = inner.slice(0, as) + inner.slice(ac.end); } }
    const rid = inner.match(/<(span|div)\b([^>]*class\s*=\s*"[^"]*(?<![\w-])record-id(?![\w-])[^"]*"[^>]*)>([\s\S]*?)<\/\1>/i);
    const sub = inner.match(/<(p|div|span)\b([^>]*class\s*=\s*"[^"]*(?<![\w-])page-subtitle(?![\w-])[^"]*"[^>]*)>([\s\S]*?)<\/\1>/i);
    const back = inner.match(/<a\b([^>]*class\s*=\s*"[^"]*(?<![\w-])back-link(?![\w-])[^"]*"[^>]*)>[\s\S]*?<\/a>/i) || inner.match(/<sd-button\b[^>]*prefixIcon="arrow_back"[^>]*><\/sd-button>/i);
    const badges = [...inner.matchAll(/<sd-badge\b[\s\S]*?<\/sd-badge>/gi)].map(m => m[0]).join('');
    let backBtn = '';
    if (back) {
      if (back[0].startsWith('<sd-button')) backBtn = back[0];
      else { const href = getAttr(parseAttrs(back[1]), 'href') || ''; backBtn = '<sd-button prefixIcon="arrow_back" tooltip="Quay lại" type="link" aria-label="Quay lại" onclick="' + (href && href !== '#' ? "location.href='" + href.replace(/'/g, "\\'") + "'" : 'history.back()') + '"></sd-button>'; }
    }
    const ttl = '<div class="T20M page-title"' + (tid ? ' id="' + tid + '"' : '') + '>' + titleM[3].trim() + '</div>';
    const left = '<div class="d-flex"><div headerLeft class="d-flex align-items-center gap-8">' + backBtn + '<div><div class="d-flex align-items-center flex-wrap gap-8">' + ttl +
      (rid ? '<span class="T20M text-primary record-id"' + buildAttrs(parseAttrs(rid[2]).filter(a => a.name !== 'class')) + '>' + rid[3] + '</span>' : '') + badges + '</div>' +
      (sub ? '<div class="T14R text-secondary \u2063mt-4 page-subtitle"' + buildAttrs(parseAttrs(sub[2]).filter(a => a.name !== 'class')) + '>' + sub[3] + '</div>' : '') + '</div></div></div>';
    const right = '<div headerRight class="d-flex align-items-center flex-wrap gap-8 justify-content-end page-header-actions">' + actions + '</div>';
    const keep = attrs.filter(a => a.name.toLowerCase() !== 'class');
    const text = '<div class="' + cls.join(' ') + '"' + buildAttrs(keep) + '>' + (comments ? comments + '\n' : '') + '<div class="c-page-header bg-white"><div class="p-16 d-flex align-items-center w-full justify-content-between page-header-content">' + left + right + '</div></div></div>';
    st.comp['page-header'] = (st.comp['page-header'] || 0) + 1;
    ctx.once('header', 'header viết tay → khung header của sd-page (như pattern page-header). Trang mới: dùng data-pattern="page-header"');
    return { from: t.index, to: close.end, text, resume: text.indexOf('<div headerRight') };
  });
}

/* ───────────────────── 9. Báo phần còn lại (tab, phân trang, toast, dropdown, avatar…) ───────────────────── */
function reportRest(s, ctx) {
  const regs = regions(s);
  const has = re => { const m = s.match(re); return m && ctxAt(regs, s.indexOf(m[0])) !== 'skip'; };
  const R = [
    [/class\s*=\s*"[^"]*(?<![\w-])(tabs|tab-list|nav-tabs|tab-bar|tab-header|tab-nav|tab-buttons)(?![\w-])/, 'thanh tab tự dựng (chưa đổi được) → <sd-tab-group><sd-tab label="…">nội dung</sd-tab>…</sd-tab-group>'],
    [/class\s*=\s*"[^"]*\b(pagination|table-footer|pager)\b/, 'phân trang tự dựng → bỏ; dùng `paginated` + `pageSize` của <sd-table>'],
    [/class\s*=\s*"[^"]*\b(toast|snackbar)(-container)?\b/, 'toast tự dựng → SdNotifyService của kit (xem design-system/components/sd-overlay.md)'],
    [/class\s*=\s*"[^"]*\bdropdown-menu\b/, 'menu thả xuống tự dựng → cột command / menu của sd-table, hoặc sd-button + danh sách (catalog 19.0.10 không có menu nút)'],
    [/class\s*=\s*"[^"]*\b(user-avatar|avatar)\b(?!-)/, 'avatar tự dựng → <sd-avatar name="…" src="…">'],
    [/class\s*=\s*"[^"]*\bstatus-dot\b/, 'chấm trạng thái tự dựng → <sd-badge color="…" icon="…" title="…"> theo STATUS_MAP'],
    [/class\s*=\s*"[^"]*\b(empty-state|no-data)\b/, 'khối trống tự dựng → ảnh trống của kit (design-system/core/assets/) theo Rule 12'],
    [/class\s*=\s*"[^"]*\b(stepper|steps|wizard-steps)\b/, 'thanh bước tự dựng → <sd-stepper>'],
    [/<progress\b|class\s*=\s*"[^"]*\bprogress-bar\b/, 'thanh tiến độ tự dựng → giữ (catalog không có progress) hoặc hỏi PD'],
    [/<input\b[^>]*type\s*=\s*["']file/i, 'ô chọn tệp <input type="file"> → <sd-upload-file>'],
    [/<input\b[^>]*type\s*=\s*["'](time|month|week|range|color)/i, 'ô <input type="time|month|week|range|color"> → sd-datetime / sd-input-color / hỏi PD (catalog không có slider)']
  ];
  for (const [re, msg] of R) if (has(re)) ctx.note('còn ' + msg);
}

/* ─────────────────────────────── chạy ─────────────────────────────── */
const scriptsOf = s => [...s.matchAll(/<script\b(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi)].filter(m => !/type\s*=\s*["']?module/i.test(m[1])).map(m => m[2]);
const compiles = code => { try { new vm.Script(code); return true; } catch (e) { return false; } };
export function convertComponents(src, st, env) {
  /* Đổi lần 1 (cả HTML tĩnh lẫn markup trong chuỗi JS). Nếu một <script> vốn chạy được mà sau khi đổi hỏng cú pháp → đổi lại
     lần 2 CHỈ phần HTML tĩnh, markup trong JS để nguyên (báo `!`). Không bao giờ trả về trang có JS hỏng. */
  const before = scriptsOf(src).map(compiles);
  const snap = JSON.stringify(st);
  let out = convertOnce(src, st, env);
  const after = scriptsOf(out);
  if (after.length !== before.length || after.some((c, i) => before[i] && !compiles(c))) {
    Object.assign(st, JSON.parse(snap));
    eachTag.noJs = true;
    try { out = convertOnce(src, st, env); } finally { eachTag.noJs = false; }
    st.notes.push('markup component trong chuỗi JS chưa đổi (đổi tự động làm hỏng cú pháp JS) → đổi tay theo ai-instructions/migrate-components.md');
  }
  return out;
}
function convertOnce(src, st, env) {
  const js = [...src.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]).join('\n');
  const seen = new Set();
  const ctx = { ...env, st, js, later: [],
    note: m => st.notes.push(m),
    once: (k, m) => { if (!seen.has(k)) { seen.add(k); st.notes.push(m); } },
    widget: (k, cls) => { const key = k + ':' + cls.join('.'); if (!seen.has(key)) { seen.add(key); st.widgets.push('<' + k + ' class="' + cls.join(' ') + '">'); } } };
  st.comp = st.comp || {}; st.widgets = st.widgets || [];
  let s = src;
  s = fixAliases(s, st);
  s = convertOverlays(s, ctx);
  s = convertTabs(s, ctx);
  s = convertCards(s, ctx);
  s = convertInfoItems(s, ctx);
  s = convertToggles(s, ctx);
  s = convertButtons(s, ctx);
  s = convertBadges(s, ctx);
  s = convertSelects(s, ctx);
  s = convertTextareas(s, ctx);
  s = convertInputs(s, ctx);
  s = convertTables(s, ctx);
  s = convertHandHeader(s, ctx);
  /* nhãn <label for> đã chuyển vào thuộc tính `label` → xoá (từ cuối lên) */
  for (const lf of ctx.later) { const i = s.indexOf(lf.raw); if (i >= 0) s = s.slice(0, i) + s.slice(i + lf.raw.length); }
  reportRest(s, ctx);
  if (st.widgets.length) st.notes.push('giữ nguyên ' + st.widgets.length + ' kiểu nút là WIDGET riêng của trang (có CSS của trang, Rule 0b nhóm B): ' + st.widgets.slice(0, 6).join(' ') + (st.widgets.length > 6 ? ' …' : '') + ' — nếu thực chất là nút bấm thường thì đổi tay sang <sd-button>');
  return s;
}
