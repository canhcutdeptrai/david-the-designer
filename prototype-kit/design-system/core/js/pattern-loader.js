/**
 * Prototype Pattern Loader
 * ====================
 * Runtime engine: tìm [data-pattern] elements → render từ registry.
 * Chạy TRƯỚC shell.js để DOM sẵn sàng cho event binding.
 *
 * Yêu cầu: Các pattern files (design-system/patterns/*.js) phải load trước file này.
 * Mỗi pattern file tự register vào window.PROTOTYPE_PATTERNS.
 */

(function () {
  'use strict';

  // ── Utilities ─────────────────────────────────────────────

  /**
   * Lấy tất cả data-* attributes thành object { key: value }
   * data-primary-icon="add" → { 'primary-icon': 'add' }
   */
  function getAttrs(el) {
    var attrs = {};
    for (var i = 0; i < el.attributes.length; i++) {
      var a = el.attributes[i];
      if (a.name.indexOf('data-') === 0 && a.name !== 'data-pattern' && a.name !== 'data-variant') {
        attrs[a.name.slice(5)] = a.value;
      }
    }
    return attrs;
  }

  /**
   * Replace {{attr}} placeholders với values.
   * Replace {{#if attr}}...{{/if}} conditional blocks.
   */
  function interpolate(tpl, attrs, defaults) {
    var merged = {};
    var k;
    if (defaults) {
      for (k in defaults) merged[k] = defaults[k];
    }
    for (k in attrs) merged[k] = attrs[k];

    // Process conditionals: {{#if key}}content{{/if}}
    tpl = tpl.replace(/\{\{#if\s+([\w-]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, function (_, key, content) {
      var val = merged[key];
      if (val && val !== 'false' && val !== '0' && val !== '') {
        return content;
      }
      return '';
    });

    // Process attribute placeholders: {{key}}
    tpl = tpl.replace(/\{\{([\w-]+)\}\}/g, function (match, key) {
      return merged[key] !== undefined ? merged[key] : '';
    });

    return tpl;
  }


  // ── Pattern Processors ────────────────────────────────────

  /* buildSiteTabZone (data-site-tabs — tab kiểu trình duyệt) ĐÃ GỠ 2026-10-14: Core / portal-template không có
     (Builder: „không hiện trong kit và các prototype“). Thuộc tính data-site-tabs nay bị bỏ qua. */

  /**
   * Build page-tab zone HTML from comma-separated string.
   * Format: "Thông tin,Lịch sử,Đính kèm"  — first tab is always active.
   * Optionally prefix a tab with "*" to make it active: "Thông tin,*Lịch sử"
   *
   * 2026-10-14 (Builder: „tôi đã đồng bộ phần tab group vào kit rồi mà, sao không dùng luôn“): tab trang là
   * `sd-tab-group` của kit, như portal-template (detail-tabbed: `div.bg-white > sd-tab-group [stretchTabs]="false"`)
   * — trước là `.tabs > button.tab` tự dựng. Lớp móc `.tab` / `.tab.active` vẫn được gắn lên nút của sd-tab-group
   * (xem phBindPageTabs) để JS các trang cũ — kể cả bản đóng băng — chạy như trước.
   */
  function phEscAttr(v) {
    return String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function buildPageTabZone(pageTabsStr) {
    if (!pageTabsStr) return '';
    var tabs = pageTabsStr.split(',');
    var activeIdx = 0;
    var items = tabs.map(function (label, i) {
      var trimmed = label.trim();
      if (trimmed.charAt(0) === '*') { trimmed = trimmed.slice(1).trim(); activeIdx = i; }
      return '<sd-tab label="' + phEscAttr(trimmed) + '"></sd-tab>';
    }).join('');
    return '<div class="page-tab-zone bg-white"><sd-tab-group stretchTabs="false" selectedIndex="' + activeIdx + '">' + items + '</sd-tab-group></div>';
  }

  /**
   * Cầu tương thích cho tab trang (2026-10-14). JS cũ của trang (preview, tra-cuu-cam-nang*.html) làm việc với
   * `.page-tab-zone .tab`: gắn click, đặt id / hidden, bật tắt `.active`. Ở đây:
   *   · gắn lớp `tab` lên từng nhãn `div.mat-mdc-tab` (CSS `.tab` toàn cục đã loại nhãn này ra — layout.css);
   *   · sd-tab-group đổi tab (bấm) → `.active` theo đúng nút đang chọn;
   *   · JS trang bật `.active` cho một nút → sd-tab-group chọn theo (selectedIndex), để hình khớp trạng thái;
   *   · JS trang đặt `hidden` cho nút → đo lại gạch chân.
   */
  function phBindPageTabs(root) {
    var group = root.querySelector('.page-tab-zone sd-tab-group');
    if (!group) return;
    function buttons() { return Array.prototype.slice.call(group.querySelectorAll('.mat-mdc-tab-labels > .mat-mdc-tab')); }
    function selected() {
      var v = parseInt(group.getAttribute('selectedIndex') || '0', 10);
      return isNaN(v) ? 0 : v;
    }
    function decorate() {
      var sel = selected();
      buttons().forEach(function (b, i) {
        b.classList.add('tab');
        b.classList.toggle('active', i === sel);
      });
    }
    decorate();
    group.addEventListener('sd-tab-change', function (e) {
      var idx = e.detail ? e.detail.index : selected();
      buttons().forEach(function (b, i) { b.classList.toggle('active', i === idx); });
    });
    var mo = new MutationObserver(function (muts) {
      var reposition = false, rebuilt = false;
      muts.forEach(function (m) {
        if (m.type === 'childList') { rebuilt = true; return; }
        var t = m.target;
        if (!t.classList || !t.classList.contains('mat-mdc-tab')) return;
        if (m.attributeName === 'hidden') { reposition = true; return; }
        if (m.attributeName === 'class' && t.classList.contains('active')) {
          var idx = buttons().indexOf(t);
          if (idx >= 0 && idx !== selected()) group.setAttribute('selectedIndex', String(idx));
        }
      });
      if (rebuilt && buttons().some(function (b) { return !b.classList.contains('tab'); })) decorate();
      if (reposition && typeof group._positionIndicator === 'function') group._positionIndicator();
    });
    mo.observe(group, { subtree: true, childList: true, attributes: true, attributeFilter: ['class', 'hidden'] });
  }

  /**
   * page-header: variant-based, no slot.
   * VIẾT LẠI 2026-10-14 — khung là header của `sd-page` (@sd-angular/core 19.0.10):
   *   div.page-header (vỏ — chỉ là lớp móc cho prototype/preview, không có CSS hình)
   *     div.c-page-header.bg-white > div.p-16.d-flex.align-items-center.w-full.justify-content-between.page-header-content
   *       > (nội dung biến thể: div.d-flex bên trái + [headerRight])
   *     [page-tab zone — DƯỚI khung, như sd-tab-group nằm ngay dưới header trong portal-template]
   */
  var PH_ICON_BY_LABEL = { 'Chỉnh sửa': 'edit', 'Lưu': 'save' };   /* portal header: Chỉnh sửa → edit · Lưu → save */

  function phApprovalButton(entry) {
    var parts = entry.trim().split(':');
    var icon = '', label = entry.trim();
    if (parts.length >= 2) { icon = parts[0].trim(); label = parts.slice(1).join(':').trim(); }
    /* Luật portal (docs/pattern.md): "Detail đặt Chỉnh sửa primary fill bên phải, Duyệt success light,
       Từ chối warning light". Nhãn khác = tác vụ phụ light secondary (như Import của portal). */
    var type = 'light', color = 'secondary', last = false;
    /* rule-chung HDR-READ: Chỉnh sửa ở trang chi tiết là light primary (portal: fill) — vẫn ngoài cùng bên phải */
    if (/^chỉnh sửa/i.test(label)) { type = 'light'; color = 'primary'; icon = icon || 'edit'; last = true; }
    else if (/từ chối/i.test(label)) { color = 'warning'; icon = icon || 'close'; }
    else if (/duyệt/i.test(label)) { color = 'success'; icon = icon || 'check'; }
    return {
      last: last,
      html: '<sd-button type="' + type + '" color="' + color + '" size="sm"' + (icon ? ' prefixIcon="' + icon + '"' : '') + ' title="' + label + '"></sd-button>'
    };
  }

  /* Biến thể AI hay đoán mà pattern không có → quy về biến thể gần nghĩa nhất (2026-10-14). Trước: bỏ qua cả
     phần tử → trang mất hẳn header (hoặc lộ HTML thô viết bên trong). */
  var PH_VARIANT_ALIAS = {
    create: 'add', 'new': 'add', wizard: 'add', stepper: 'add', step: 'add', form: 'add', update: 'edit',
    detail: 'read', view: 'read', approval: 'read-approval', list: 'browse', index: 'browse'
  };
  var PH_CANCEL_LABELS = ['Bỏ qua', 'Thoát', 'Quay lại'];   /* Rule 16 */

  function processPageHeader(el, pattern, attrs) {
    var variant = el.getAttribute('data-variant') || 'browse';
    var tpl = pattern.variants[variant];
    if (!tpl) {
      var fb = PH_VARIANT_ALIAS[String(variant).toLowerCase()] ||
        (attrs['back-href'] || attrs['primary-action'] ? 'add' : 'browse');
      console.warn('[Prototype Kit] page-header: biến thể "' + variant + '" không có → dùng "' + fb + '" (có: browse · read · read-approval · edit · add)');
      variant = fb;
      tpl = pattern.variants[variant];
    }
    /* nhãn nút thoát của edit / add — chỉ nhận 3 nhãn của Rule 16 */
    if (attrs['cancel-label'] && PH_CANCEL_LABELS.indexOf(attrs['cancel-label'].trim()) === -1) {
      console.warn('[Prototype Kit] page-header: data-cancel-label "' + attrs['cancel-label'] + '" không thuộc Rule 16 → "Thoát"');
      attrs['cancel-label'] = 'Thoát';
    }
    attrs['primary-suffix-attr'] = attrs['primary-suffix-icon'] ? 'suffixIcon="' + attrs['primary-suffix-icon'] + '" ' : '';

    // read-approval: tác vụ từ data-actions ("icon:nhãn,…" hoặc "nhãn,…"), nút chính dời ra ngoài cùng bên phải
    if (variant === 'read-approval') {
      var btns = (attrs.actions || '').split(',').filter(function (x) { return x.trim(); }).map(phApprovalButton);
      var ordered = btns.filter(function (b) { return !b.last; }).concat(btns.filter(function (b) { return b.last; }));
      tpl = tpl.replace('{{ACTIONS_BUTTONS}}', ordered.map(function (b) { return b.html; }).join('\n  '));
    }

    // Icon nút chính của read / edit: khai data-primary-icon thì theo đó, không thì theo nhãn như portal
    var pIcon = el.hasAttribute('data-primary-icon') ? (attrs['primary-icon'] || '') : (PH_ICON_BY_LABEL[(attrs['primary-action'] || '').trim()] || '');
    attrs['primary-icon-attr'] = pIcon ? 'prefixIcon="' + pIcon + '" ' : '';

    /* data-badge-status → color / icon / fontSet của sd-badge (API catalog) qua STATUS_MAP của sd-components.js */
    var bKey = attrs['badge-status'] || (pattern.defaults && pattern.defaults['badge-status']) || '';
    var bAttr = window.sdStatusBadgeAttrs ? window.sdStatusBadgeAttrs(bKey, 'x') : { color: 'secondary', icon: 'fiber_manual_record', fontSet: '' };
    attrs['badge-color'] = bAttr.color;
    attrs['badge-icon'] = bAttr.icon;
    attrs['badge-font'] = bAttr.fontSet || 'material-icons';
    var contentHtml = interpolate(tpl, attrs, pattern.defaults);
    var pageTabHtml = buildPageTabZone(attrs['page-tabs'] || '');

    var html = '<div class="page-header">' +
      '<div class="c-page-header bg-white">' +
        '<div class="p-16 d-flex align-items-center w-full justify-content-between page-header-content">' +
          contentHtml +
        '</div>' +
      '</div>' +
      pageTabHtml +
    '</div>';

    /* Thay bằng node thật (không dùng outerHTML) để còn gắn cầu tương thích cho tab trang */
    var holder = document.createElement('div');
    holder.innerHTML = html;
    var node = holder.firstElementChild;
    el.parentNode.replaceChild(node, el);
    phBindPageTabs(node);
  }

  /**
   * filter-bar: slot-based (children → filter-bar-grid)
   */
  /* Ô lọc của external filter — thư viện dựng từ `externalFilters: [{ field,
     title, type }]` và LUÔN ra cùng một kiểu. Mã nguồn @sd-angular/core 19.0.10
     (ExternalFilterComponent, fesm2022/sd-angular-core-components-table.mjs):
       <sd-input [label]="item.title" appearance="outline" hideInlineError …>
     tức `title` là NHÃN NỔI của mat-form-field — lúc trống nằm trong ô (đúng hình
     catalog: `mat-form-field-hide-placeholder` + nhãn trong notch), focus / có giá
     trị thì NỔI LÊN viền như ô form thường; placeholder = chính tên đó;
       · cỡ `sd-md` (43.5px) — không có tuỳ chọn cỡ;
       · `hide-inline-error` — không chừa dòng lỗi bên dưới, lỗi tô viền đỏ.
     2026-10-23 (Builder: „Các field trong pattern table phần external đang không
     nhảy label lên giống component form field -> fix lại“): bản trước đổi `label`
     → placeholder (đọc nhầm ảnh chụp tĩnh của catalog là „không nhãn nổi“) nên nhãn
     không bao giờ nổi. Nay ngược lại: ô chỉ có `placeholder` → thêm `label` cùng
     chữ; placeholder = label (như thư viện); bỏ `size`, thêm `hideInlineError`.
     Chỉ đụng các ô NHẬP là con trực tiếp. */
  var FILTER_FIELD_TAGS = ['SD-INPUT', 'SD-SELECT', 'SD-DATE', 'SD-DATE-RANGE',
    'SD-DATETIME', 'SD-AUTOCOMPLETE', 'SD-INPUT-NUMBER', 'SD-CHIP', 'SD-CHIP-CALENDAR'];

  function normalizeFilterField(f) {
    if (FILTER_FIELD_TAGS.indexOf(f.tagName) === -1) return;
    var label = (f.getAttribute('label') || '').trim();
    var ph = (f.getAttribute('placeholder') || '').trim();
    var title = label || ph;
    if (title) {
      f.setAttribute('label', title);
      f.setAttribute('placeholder', title);
    }
    f.removeAttribute('size');
    if (!f.hasAttribute('hideInlineError') && !f.hasAttribute('hideinlineerror')) {
      f.setAttribute('hideInlineError', '');
    }
  }

  function processFilterBar(el, pattern, attrs) {
    /* Chỉ chuẩn hoá khi MỌI con trực tiếp đều là ô nhập sd-* — tức bộ lọc dựng
       đúng kiểu externalFilters. Có con nào khác (vd. `<details>` lọc nhiều lựa
       chọn tự dựng ở danh-sach-position.html) là trang đã tự căn bố cục riêng
       theo cỡ ô của nó; đổi cỡ một mình ô sd-* sẽ làm lệch hàng. */
    var kids = Array.prototype.slice.call(el.children);
    var allFields = kids.length && kids.every(function (k) {
      return FILTER_FIELD_TAGS.indexOf(k.tagName) !== -1;
    });
    if (allFields) kids.forEach(normalizeFilterField);
    else kids.forEach(function (k) {
      /* Bố cục tự dựng: giữ cỡ/nhãn của trang, nhưng ô lọc của catalog (externalFilters,
         ô lọc cột) LUÔN `hide-inline-error` — không chừa dải lỗi 20px dưới ô. */
      if (FILTER_FIELD_TAGS.indexOf(k.tagName) !== -1 &&
          !k.hasAttribute('hideInlineError') && !k.hasAttribute('hideinlineerror')) {
        k.setAttribute('hideInlineError', '');
      }
    });
    var slotContent = el.innerHTML.trim();
    var html = interpolate(pattern.template, attrs, pattern.defaults);
    html = html.replace('<!-- SLOT -->', slotContent);
    el.outerHTML = html;
  }

  /**
   * data-table: slot-based (children = <table>) + auto-inject columns + footer
   */
  function processDataTable(el, pattern, attrs) {
    var defaults = pattern.defaults;
    var selectable = (attrs.selectable || defaults.selectable) === 'true';
    var paginated = (attrs.paginated || defaults.paginated) === 'true';
    var pageSizes = (attrs['page-sizes'] || defaults['page-sizes']).split(',');
    var pageSizeDefault = attrs['page-size-default'] || defaults['page-size-default'];
    var total = attrs.total || defaults.total;
    var footerActionsStr = attrs['footer-actions'] !== undefined ? attrs['footer-actions'] : defaults['footer-actions'];
    var bulkActionsStr = attrs['bulk-actions'] !== undefined ? attrs['bulk-actions'] : defaults['bulk-actions'];

    // Get the <table> from slot
    var tableEl = el.querySelector('table');
    if (!tableEl) {
      console.warn('[Prototype Kit] data-table: no <table> found in slot');
      return;
    }

    // ── Inject checkbox + seq columns ──
    if (selectable) {
      // thead
      var theadRow = tableEl.querySelector('thead tr');
      if (theadRow) {
        var checkTh = document.createElement('th');
        checkTh.className = 'col-check';
        checkTh.innerHTML = '<input type="checkbox" aria-label="Chọn tất cả">';
        var seqTh = document.createElement('th');
        seqTh.className = 'col-seq';
        seqTh.textContent = '#';
        theadRow.insertBefore(seqTh, theadRow.firstChild);
        theadRow.insertBefore(checkTh, theadRow.firstChild);
      }

      // tbody rows
      var tbodyRows = tableEl.querySelectorAll('tbody tr');
      tbodyRows.forEach(function (tr, i) {
        var checkTd = document.createElement('td');
        checkTd.className = 'col-check';
        checkTd.innerHTML = '<input type="checkbox" class="row-check">';
        var seqTd = document.createElement('td');
        seqTd.className = 'col-seq';
        seqTd.textContent = String(i + 1);
        tr.insertBefore(seqTd, tr.firstChild);
        tr.insertBefore(checkTd, tr.firstChild);
      });
    }

    // ── Build table footer ──
    var footerHtml = '';

    if (selectable || paginated || footerActionsStr) {
      footerHtml = '<div class="table-footer">';

      // Bulk snackbar (if selectable)
      if (selectable) {
        var bulkButtons = '';
        if (bulkActionsStr) {
          bulkActionsStr.split(',').forEach(function (action) {
            bulkButtons += '<sd-button type="light" color="primary" size="sm" title="' + action.trim() + '"></sd-button>';
          });
        }
        footerHtml +=
          '<div class="bulk-snackbar-wrapper">' +
            '<div class="bulk-snackbar">' +
              '<div class="bulk-snackbar-count">00</div>' +
              '<div class="bulk-snackbar-content"><span>dòng đã chọn</span></div>' +
              '<div class="bulk-snackbar-actions">' + bulkButtons + '</div>' +
              '<button class="bulk-snackbar-close" aria-label="Bỏ chọn">' +
                '<span class="material-icons-outlined mi-md">close</span>' +
              '</button>' +
            '</div>' +
          '</div>';
      }

      // Footer actions (refresh, download)
      if (footerActionsStr) {
        var actionMap = {
          'refresh': { icon: 'refresh', label: 'Tải lại' },
          'download': { icon: 'download', label: 'Tải xuống' }
        };
        footerHtml += '<div class="table-footer-actions">';
        footerActionsStr.split(',').forEach(function (key) {
          var act = actionMap[key.trim()];
          if (act) {
            footerHtml +=
              '<sd-button type="link" color="secondary" size="sm" prefixIcon="' + act.icon + '" title="' + act.label + '"></sd-button>';
          }
        });
        footerHtml += '</div>';
      }

      // Pagination
      if (paginated) {
        var pageDefault = parseInt(pageSizeDefault, 10) || 20;
        var totalNum = parseInt(total, 10) || 0;
        function fmtNum(n) { return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
        var pageCount = '1\u2013' + fmtNum(Math.min(pageDefault, totalNum)) + ' / ' + fmtNum(totalNum);

        var optionsHtml = pageSizes.map(function (size) {
          var s = size.trim();
          var sel = s === pageSizeDefault ? ' selected' : '';
          return '<option' + sel + '>' + s + '</option>';
        }).join('');

        footerHtml +=
          '<div class="table-footer-center">' +
            '<span class="footer-label">Đang hiển thị:</span>' +
            '<select class="table-page-select">' + optionsHtml + '</select>' +
            '<span class="table-page-divider">|</span>' +
            '<span class="table-page-count">' + pageCount + '</span>' +
          '</div>';

        footerHtml +=
          '<div class="table-footer-nav">' +
            '<button class="pagination-btn" disabled aria-label="Trang đầu">' +
              '<span class="material-icons-outlined mi-sm">first_page</span>' +
            '</button>' +
            '<button class="pagination-btn" disabled aria-label="Trang trước">' +
              '<span class="material-icons-outlined mi-sm">chevron_left</span>' +
            '</button>' +
            '<button class="pagination-btn" aria-label="Trang tiếp">' +
              '<span class="material-icons-outlined mi-sm">chevron_right</span>' +
            '</button>' +
            '<button class="pagination-btn" aria-label="Trang cuối">' +
              '<span class="material-icons-outlined mi-sm">last_page</span>' +
            '</button>' +
          '</div>';
      }

      footerHtml += '</div>';
    }

    // ── Assemble final HTML ──
    var tpl = pattern.template;
    tpl = tpl.replace('<!-- SLOT -->', tableEl.outerHTML);
    tpl = tpl.replace('{{TABLE_FOOTER}}', footerHtml);
    // Clean up any remaining unreplaced placeholders
    tpl = interpolate(tpl, attrs, defaults);
    el.outerHTML = tpl;
  }


  // ── Processor map ─────────────────────────────────────────

  var processors = {
    'page-header': processPageHeader,
    'filter-bar': processFilterBar,
    'data-table': processDataTable
  };


  // ── Main: process all patterns ────────────────────────────

  function processPatterns() {
    if (typeof PROTOTYPE_PATTERNS === 'undefined') {
      console.warn('[Prototype Kit] Pattern registry not loaded. Include pattern files (design-system/patterns/*.js) before pattern-loader.js');
      return;
    }

    // Process in document order — use a snapshot since outerHTML replaces elements
    var elements = Array.prototype.slice.call(document.querySelectorAll('[data-pattern]'));

    elements.forEach(function (el) {
      var name = el.getAttribute('data-pattern');
      var pattern = PROTOTYPE_PATTERNS[name];

      if (!pattern) {
        console.warn('[Prototype Kit] Unknown pattern: "' + name + '"');
        return;
      }

      var attrs = getAttrs(el);
      var processor = processors[name];

      if (processor) {
        processor(el, pattern, attrs);
      } else {
        // Generic: simple template + slot
        var html = interpolate(pattern.template, attrs, pattern.defaults);
        if (html.indexOf('<!-- SLOT -->') !== -1) {
          html = html.replace('<!-- SLOT -->', el.innerHTML.trim());
        }
        el.outerHTML = html;
      }
    });

    // Dispatch event so shell.js and other scripts know DOM is ready
    document.dispatchEvent(new Event('patterns:loaded'));
  }


  // ── Interactive behaviors (moved from inline scripts) ─────

  /**
   * Filter bar toggle — used by onclick in filter-bar pattern
   */
  window.toggleFilterBar = function (id) {
    var bar = document.getElementById(id);
    var chevron = document.getElementById(id + '-chevron');
    if (!bar) return;
    bar.classList.toggle('minimized');
    if (chevron) {
      chevron.textContent = bar.classList.contains('minimized') ? 'expand_more' : 'expand_less';
    }
  };

  /**
   * Table checkbox selection + bulk snackbar
   */
  function updateSnackbar(table) {
    var container = table.closest('.table-container');
    if (!container) return;
    var snackbar = container.querySelector('.bulk-snackbar-wrapper');
    if (!snackbar) return;
    var checks = table.querySelectorAll('tbody input[type="checkbox"]:checked');
    var countEl = snackbar.querySelector('.bulk-snackbar-count');
    if (checks.length > 0) {
      snackbar.classList.add('visible');
      if (countEl) countEl.textContent = String(checks.length).padStart(2, '0');
    } else {
      snackbar.classList.remove('visible');
    }
    var allChecks = table.querySelectorAll('tbody input[type="checkbox"]');
    var headerCb = table.querySelector('thead input[type="checkbox"]');
    if (headerCb) {
      headerCb.indeterminate = checks.length > 0 && checks.length < allChecks.length;
      headerCb.checked = allChecks.length > 0 && checks.length === allChecks.length;
    }
    table.querySelectorAll('tbody tr').forEach(function (tr) {
      var cb = tr.querySelector('input[type="checkbox"]');
      tr.classList.toggle('selected', cb && cb.checked);
    });
  }

  // Checkbox change handler (event delegation)
  document.addEventListener('change', function (e) {
    var cb = e.target;
    if (!cb.matches('.row-check, thead input[type="checkbox"]')) return;
    var table = cb.closest('.data-table');
    if (!table) return;
    if (cb.closest('thead')) {
      table.querySelectorAll('tbody input[type="checkbox"]').forEach(function (r) {
        r.checked = cb.checked;
      });
    }
    updateSnackbar(table);
  });

  // Page tab: `.active` nay do phBindPageTabs giữ theo sd-tab-group (sd-tab-change) — bỏ bộ bắt click cũ (2026-10-14)

  // Site tab click / close — đã gỡ cùng data-site-tabs (2026-10-14)

  // Bulk snackbar close handler
  document.addEventListener('click', function (e) {
    var closeBtn = e.target.closest('.bulk-snackbar-close');
    if (!closeBtn) return;
    var container = closeBtn.closest('.table-container');
    if (!container) return;
    var table = container.querySelector('.data-table');
    if (!table) return;
    table.querySelectorAll('tbody input[type="checkbox"]').forEach(function (cb) {
      cb.checked = false;
    });
    var headerCb = table.querySelector('thead input[type="checkbox"]');
    if (headerCb) {
      headerCb.checked = false;
      headerCb.indeterminate = false;
    }
    updateSnackbar(table);
  });

  // Init snackbar state after patterns loaded
  document.addEventListener('patterns:loaded', function () {
    document.querySelectorAll('.data-table').forEach(function (t) {
      updateSnackbar(t);
    });
  });


  // ── Run ───────────────────────────────────────────────────

  // Run synchronously — registry.js is already loaded
  processPatterns();

})();
