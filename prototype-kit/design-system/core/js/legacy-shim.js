/* ============================================================
   LEGACY SHIM — chỉ cho prototype dựng bằng kit CŨ, đã qua ai-instructions/tools/migrate-prototype.mjs
   ─────────────────────────────────────────────────────────────
   Công cụ nâng đổi markup tự dựng sang component Core (`<select>` → `<sd-select>`, modal viết tay → `<sd-modal>`…).
   Hình theo Core; còn JS CŨ của trang vẫn viết theo phần tử HTML thường. File này nối hai bên, KHÔNG đổi hình
   hay hành vi của component:
     1. [data-legacy-change]  sd-select / sd-date / sd-datetime / sd-autocomplete / sd-input-number… chỉ phát `sd-change`
        → phát thêm sự kiện `change` thường (onchange="…" và addEventListener('change') của trang cũ chạy như trước).
        Ô có ô nhập thật bên trong (đã tự phát `change`) thì không phát lặp.
     2. `el.disabled = true/false` và `el.focus()` trên sd-* — thuộc tính / hàm của phần tử HTML thường mà vài component
        kit chỉ có getter → thêm setter / focus() phản chiếu đúng thuộc tính `disabled` của component.
     3. [data-legacy-modal]  sd-modal / sd-side-drawer từ modal viết tay: JS cũ mở / đóng bằng `style.display`,
        `classList.add/remove('open'|'show'|'active')`, `hidden` → gọi open() / close() của component. Đóng bằng nút X / nền
        của component → chạy lại onclick của nút đóng cũ ([data-legacy-onclose]) để trang dọn trạng thái như trước.
     4. [data-legacy-toggle] sd-switch từ `<button class="toggle">`: lớp `active` ↔ `checked`.
     5. [data-legacy-title]  thẻ ẩn giữ id tiêu đề modal cũ: JS ghi textContent vào đó → đổi `title` của modal.
     6. [data-legacy-onselect] / [data-legacy-panel]  sd-tab-group từ thanh tab viết tay: chọn tab → chạy onclick cũ của nút
        tab; khối thân cũ luôn hiện (ẩn / hiện do sd-tab-group).
     7. select[data-legacy-upgrade]  <select> có option dựng bằng JS: giữ làm nguồn dữ liệu (ẩn), vẽ <sd-select> Core thay hình.
   Trang MỚI không nạp file này — dùng thẳng API của component (sd-change, open(), close()).
   ============================================================ */
(function () {
  'use strict';
  if (window.__sdLegacyShim) return;
  window.__sdLegacyShim = true;

  /* 1. change */
  document.addEventListener('change', function (e) {
    if (!e.isTrusted) return;
    var host = e.target && e.target.closest && e.target.closest('[data-legacy-change]');
    if (host && host !== e.target) host.__legacyNativeChange = Date.now();
  }, true);
  document.addEventListener('sd-change', function (e) {
    var host = e.target;
    if (!host || !host.hasAttribute || !host.hasAttribute('data-legacy-change')) return;
    setTimeout(function () {
      if (host.__legacyNativeChange && Date.now() - host.__legacyNativeChange < 300) return;
      host.dispatchEvent(new Event('change', { bubbles: true }));
      host.dispatchEvent(new Event('input', { bubbles: true }));
    }, 0);
  });

  /* 2. disabled / focus */
  var TAGS = ['sd-button', 'sd-input', 'sd-input-number', 'sd-select', 'sd-textarea', 'sd-date', 'sd-datetime', 'sd-date-range',
    'sd-autocomplete', 'sd-checkbox', 'sd-radio', 'sd-switch', 'sd-chip', 'sd-chip-calendar'];
  function patch(tag) {
    var C = customElements.get(tag);
    if (!C || C.__legacyPatched) return;
    C.__legacyPatched = true;
    var proto = C.prototype, d = Object.getOwnPropertyDescriptor(proto, 'disabled');
    if (!d || !d.set) {
      Object.defineProperty(proto, 'disabled', {
        configurable: true,
        get: d && d.get ? d.get : function () { var v = this.getAttribute('disabled'); return v !== null && v !== 'false'; },
        set: function (v) { if (v) this.setAttribute('disabled', ''); else this.removeAttribute('disabled'); }
      });
    }
    if (!Object.prototype.hasOwnProperty.call(proto, 'focus')) {
      proto.focus = function () {
        var f = this.querySelector('input:not([type=hidden]), textarea, button, [tabindex]:not([tabindex="-1"])');
        if (f) f.focus(); else HTMLElement.prototype.focus.apply(this, arguments);
      };
    }
  }
  TAGS.forEach(function (t) { if (customElements.get(t)) patch(t); else customElements.whenDefined(t).then(function () { patch(t); }); });

  /* 3. modal / drawer */
  function wantOpen(el) {
    if (el.hasAttribute('hidden')) return false;
    var d = el.style.display;
    if (d && d !== 'none') return true;
    if (d === 'none') return false;
    return /(^|\s)(open|show|active|is-open|visible)(\s|$)/.test(el.className);
  }
  function syncModal(el) {
    if (el.__legacySyncing) return;
    var open = wantOpen(el), hadSignal = el.hasAttribute('hidden') || !!el.style.display;
    el.__legacySyncing = true;
    /* host là display:contents — không để style / hidden của JS cũ đè lên host */
    if (el.style.display) el.style.removeProperty('display');
    if (el.hasAttribute('hidden')) el.removeAttribute('hidden');
    el.__legacySyncing = false;
    var isOpen = !!el.isOpened;
    if (open && !isOpen && typeof el.open === 'function') el.open();
    else if (!open && isOpen && (hadSignal || el.__legacyClassOpen) && typeof el.close === 'function') { el.__legacyClosingByJs = true; el.close(); }
    el.__legacyClassOpen = /(^|\s)(open|show|active|is-open|visible)(\s|$)/.test(el.className);
  }
  function bindModal(el) {
    if (el.__legacyModal) return;
    el.__legacyModal = true;
    new MutationObserver(function () { syncModal(el); }).observe(el, { attributes: true, attributeFilter: ['style', 'class', 'hidden'] });
    /* đóng bằng X / nền: bỏ lớp mở cũ để lần mở sau của JS cũ lại có tác dụng */
    el.addEventListener('sd-closed', function () {
      var cl = ['open', 'show', 'active', 'is-open', 'visible'].filter(function (c) { return el.classList.contains(c); });
      if (cl.length) { el.__legacySyncing = true; el.classList.remove.apply(el.classList, cl); el.__legacySyncing = false; }
      el.__legacyClassOpen = false;
      /* đóng bằng nút X / nền của component → chạy onclick của nút đóng cũ (dọn trạng thái của trang) */
      var code = el.getAttribute('data-legacy-onclose');
      if (el.__legacyClosingByJs) { el.__legacyClosingByJs = false; return; }
      if (code) { try { new Function('event', code).call(el, new Event('click')); } catch (e) { console.error(e); } }
    });
    if (el.getAttribute('data-legacy-modal') === 'open') setTimeout(function () { if (typeof el.open === 'function') el.open(); }, 0);
  }

  /* 4. toggle */
  function bindToggle(el) {
    if (el.__legacyToggle) return;
    el.__legacyToggle = true;
    var fromClass = function () {
      var on = el.classList.contains('active');
      if (!!el.checked !== on) el.checked = on;
      el.setAttribute('aria-checked', on ? 'true' : 'false');
    };
    fromClass();
    new MutationObserver(fromClass).observe(el, { attributes: true, attributeFilter: ['class'] });
    if (!el.hasAttribute('onclick')) el.addEventListener('sd-change', function () { if (el.classList.contains('active') !== !!el.checked) el.classList.toggle('active', !!el.checked); });
  }

  /* 6. tab: sd-tab-group từ thanh tab viết tay — chọn tab thì chạy onclick cũ của nút tab ([data-legacy-onselect]);
        khối thân cũ ([data-legacy-panel]) luôn hiện — ẩn / hiện do sd-tab-group lo, JS cũ có ẩn bằng style / lớp cũng bỏ qua */
  function clearPanel(p) {
    if (p.__legacyClearing) return;
    p.__legacyClearing = true;
    if (p.style.display === 'none') p.style.removeProperty('display');
    if (p.hasAttribute('hidden')) p.removeAttribute('hidden');
    /* chỉ đụng khi cần — classList.add/remove luôn ghi lại thuộc tính (sinh mutation) dù không đổi gì */
    if (p.classList.contains('d-none')) p.classList.remove('d-none');
    if (p.classList.contains('hidden')) p.classList.remove('hidden');
    if (!p.classList.contains('active')) p.classList.add('active');
    p.__legacyClearing = false;
  }
  function bindPanel(p) {
    if (p.__legacyPanel) return;
    p.__legacyPanel = true;
    clearPanel(p);
    new MutationObserver(function () { clearPanel(p); }).observe(p, { attributes: true, attributeFilter: ['style', 'class', 'hidden'] });
  }
  document.addEventListener('sd-tab-change', function (e) {
    var g = e.target; if (!g || !g.querySelectorAll) return;
    var tabs = Array.prototype.filter.call(g.querySelectorAll('sd-tab'), function (t) { return t.closest('sd-tab-group') === g; });
    var tab = tabs[e.detail && e.detail.index];
    var code = tab && tab.getAttribute('data-legacy-onselect');
    if (code) { try { new Function('event', code).call(tab, new Event('click')); } catch (err) { console.error(err); } }
    tabs.forEach(function (t) { var p = t.querySelector('[data-legacy-panel]'); if (p) clearPanel(p); });
  });

  /* 7. <select data-legacy-upgrade> — option dựng bằng JS / JS dùng .options: <select> gốc ẩn, vẫn là nguồn dữ liệu;
        một <sd-select> Core đứng trước nó thay hình. Đổi option / value / disabled / ẩn hiện của select → đồng bộ sang;
        chọn trên sd-select → ghi value vào select + phát change / input (listener cũ chạy như trước). */
  var proxies = [];
  function selItems(sel) {
    var out = [];
    Array.prototype.forEach.call(sel.options, function (o) {
      if (o.value === '' && (o.disabled || o.hidden)) return;
      var it = { id: o.value, name: o.text }; if (o.disabled) it.disabled = true; out.push(it);
    });
    return out;
  }
  function selPlaceholder(sel) {
    var o = Array.prototype.find.call(sel.options, function (x) { return x.value === '' && (x.disabled || x.hidden); });
    return o ? o.text : '';
  }
  function selValue(sel) {
    return sel.multiple ? Array.prototype.filter.call(sel.options, function (o) { return o.selected; }).map(function (o) { return o.value; }) : sel.value;
  }
  function syncProxy(sel, p) {
    var items = JSON.stringify(selItems(sel));
    if (p.getAttribute('items') !== items) p.setAttribute('items', items);
    var ph = selPlaceholder(sel); if (ph && p.getAttribute('placeholder') !== ph) p.setAttribute('placeholder', ph);
    if (sel.disabled !== p.hasAttribute('disabled')) { if (sel.disabled) p.setAttribute('disabled', ''); else p.removeAttribute('disabled'); }
    var hide = sel.hidden || sel.style.display === 'none';
    if ((p.style.display === 'none') !== hide) p.style.display = hide ? 'none' : '';
    var v = JSON.stringify(selValue(sel));
    if (p.__legacyLast !== v) { p.__legacyLast = v; p.__legacySetting = true; try { p.value = selValue(sel); } catch (e) { p.setAttribute('value', sel.value); } p.__legacySetting = false; }
  }
  function upgradeSelect(sel) {
    if (sel.__legacyProxy || !sel.isConnected) return;
    var p = document.createElement('sd-select');
    sel.__legacyProxy = p;
    if (sel.multiple) p.setAttribute('multiple', '');
    if (sel.required) p.setAttribute('required', '');
    if (sel.id) { var lab = document.querySelector('label[for="' + sel.id + '"]'); if (lab && !lab.querySelector('input,select,textarea')) { p.setAttribute('label', lab.textContent.replace(/\s*\*\s*$/, '').trim()); if (/\*\s*$/.test(lab.textContent)) p.setAttribute('required', ''); lab.remove(); } }
    if (sel.className) { p.className = sel.className; p.setAttribute('data-legacy-ctl', ''); }
    if (sel.closest('td, th')) { p.setAttribute('size', 'sm'); p.setAttribute('hideInlineError', ''); }
    var aria = sel.getAttribute('aria-label'); if (aria) p.setAttribute('aria-label', aria);
    /* <select> trần rộng theo option dài nhất; sd-select rộng theo vật chứa (co về ~0 trong hàng flex) → giữ bề rộng tối thiểu
       — CHỈ khi nằm trong hàng flex. Trong ô lưới / khối có bề rộng định sẵn thì không: min-width làm ô chọn tràn đè cột bên
       cạnh (2026-10-15, sua-workitem "Cách so sánh"). */
    if (!sel.style.width && !sel.style.minWidth) { var mx = 4; Array.prototype.forEach.call(sel.options, function (o) { mx = Math.max(mx, o.text.length); }); p.setAttribute('data-legacy-minw', (mx + 7) + 'ch'); }
    else p.style.width = sel.style.width;
    sel.setAttribute('data-legacy-proxied', '');
    syncProxy(sel, p);
    sel.parentNode.insertBefore(p, sel);
    if (p.hasAttribute('data-legacy-minw')) applyMinW(p);
    /* mũi tên tự vẽ cạnh <select> cũ (span icon expand_more đặt tuyệt đối) → sd-select đã có mũi tên → ẩn, khỏi hai mũi tên */
    Array.prototype.forEach.call(sel.parentNode.children, function (c) {
      if (c !== sel && c !== p && /material-(icons|symbols)/.test(c.className || '') && /^(expand_more|arrow_drop_down|keyboard_arrow_down|unfold_more)$/.test((c.textContent || '').trim())) c.style.display = 'none';
    });
    p.addEventListener('sd-change', function (e) {
      if (p.__legacySetting) return;
      var v = e.detail ? e.detail.value : p.value;
      if (sel.multiple) { var vs = [].concat(v || []).map(String); Array.prototype.forEach.call(sel.options, function (o) { o.selected = vs.indexOf(o.value) >= 0; }); }
      else sel.value = v == null ? '' : String(v);
      p.__legacyLast = JSON.stringify(selValue(sel));
      sel.dispatchEvent(new Event('input', { bubbles: true }));
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    });
    new MutationObserver(function () { syncProxy(sel, p); }).observe(sel, { childList: true, subtree: true, attributes: true, characterData: true });
    proxies.push([sel, p]);
    if (proxies.length === 1) setInterval(function () {   // JS gán sel.value = … không phát sự kiện nào → dò định kỳ
      proxies = proxies.filter(function (x) { if (!x[0].isConnected) { if (x[1].isConnected) x[1].remove(); return false; } return true; });
      proxies.forEach(function (x) { syncProxy(x[0], x[1]); });
    }, 250);
  }

  /* 5. tiêu đề modal cũ */
  function bindTitle(el) {
    if (el.__legacyTitle) return;
    el.__legacyTitle = true;
    var host = el.closest('sd-modal, sd-side-drawer');
    if (!host) return;
    new MutationObserver(function () { host.setAttribute('title', el.textContent.trim()); }).observe(el, { childList: true, characterData: true, subtree: true });
  }

  /* 7. bề rộng tối thiểu của ô nhập / ô chọn đã đổi (data-legacy-minw): chỉ áp khi cha là hàng flex — nơi sd-* co về ~0 */
  function applyMinW(el) {
    var par = el.parentElement; if (!par) return;
    var cs = getComputedStyle(par);
    var row = /flex/.test(cs.display) && !/column/.test(cs.flexDirection);
    el.style.minWidth = row ? el.getAttribute('data-legacy-minw') : '';
  }
  function scan(root) {
    if (!root.querySelectorAll) return;
    root.querySelectorAll('[data-legacy-minw]').forEach(applyMinW);
    /* sd-table do JS cũ tạo (createElement / innerHTML lúc chạy) → cũng bật chế độ trang cũ như bảng tĩnh đã nâng */
    root.querySelectorAll('sd-table:not([data-legacy-dom])').forEach(function (t) { t.setAttribute('data-legacy-dom', ''); });
    if (root.matches && root.matches('sd-table:not([data-legacy-dom])')) root.setAttribute('data-legacy-dom', '');
    if (root.matches && root.matches('[data-legacy-minw]')) applyMinW(root);
    root.querySelectorAll('[data-legacy-modal]').forEach(bindModal);
    root.querySelectorAll('[data-legacy-toggle]').forEach(bindToggle);
    root.querySelectorAll('[data-legacy-title]').forEach(bindTitle);
    root.querySelectorAll('[data-legacy-panel]').forEach(bindPanel);
    root.querySelectorAll('select[data-legacy-upgrade]').forEach(upgradeSelect);
    if (root.matches) {
      if (root.matches('[data-legacy-modal]')) bindModal(root);
      if (root.matches('[data-legacy-toggle]')) bindToggle(root);
      if (root.matches('[data-legacy-title]')) bindTitle(root);
      if (root.matches('[data-legacy-panel]')) bindPanel(root);
      if (root.matches('select[data-legacy-upgrade]')) upgradeSelect(root);
    }
  }
  function start() {
    scan(document);
    new MutationObserver(function (ms) { ms.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1) scan(n); }); }); })
      .observe(document.documentElement, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
