/**
 * Pattern: Sidebar
 * ================
 * HTML template cho sidebar (rail + detail panel).
 * Dùng bởi shared-nav.js — KHÔNG dùng qua data-pattern.
 *
 * PD sửa cấu trúc sidebar ở đây.
 * shared-nav.js chỉ chứa menu data, gọi render() để inject.
 *
 * Cách dùng (trong shared-nav.js):
 *   var html = PROTOTYPE_PATTERNS['sidebar'].render({
 *     logoPath: '',   // tuỳ chọn — bỏ trống thì không vẽ logo
 *     railIcons: [
 *       { href: 'button.html', icon: 'widgets', title: 'Components', active: true },
 *       { href: '../prototypes/index.html', icon: 'web', title: 'Prototypes', active: false }
 *     ],
 *     title: 'Design System',
 *     searchPlaceholder: 'Tìm component',
 *     menuHTML: '<a class="menu-item">...</a>'
 *   });
 *   document.getElementById('sidebar').innerHTML = html;
 */

var PROTOTYPE_PATTERNS = window.PROTOTYPE_PATTERNS || {};

PROTOTYPE_PATTERNS['sidebar'] = {

  render: function (config) {
    var logoPath = config.logoPath || '';
    var title = config.title || '';
    var searchPlaceholder = config.searchPlaceholder || 'Tìm kiếm';
    var menuHTML = config.menuHTML || '';

    // Build rail icons
    var railIconsHTML = '';
    if (config.railIcons) {
      config.railIcons.forEach(function (icon) {
        var activeClass = icon.active ? ' active' : '';
        railIconsHTML +=
          '<a class="rail-icon' + activeClass + '" href="' + icon.href + '" title="' + icon.title + '">' +
            '<span class="material-icons-outlined mi-xl">' + icon.icon + '</span>' +
          '</a>';
      });
    }

    // ── Sidebar HTML — PD edit template bên dưới ──

    return '' +
      '<div class="sidebar-rail">' +
      /* Logo: chỉ vẽ khi trang khai logoPath. Logo là tuỳ chọn và mặc định để trống. */
      (logoPath ? '  <div class="rail-logo"><img src="' + logoPath + '" alt="" width="23" height="32"></div>' : '  <div class="rail-logo"></div>') +
      '  <div class="rail-menu">' +
           railIconsHTML +
      '  </div>' +
      '  <div class="rail-spacer"></div>' +
      '  <div class="rail-profile">' +
      /* Avatar người dùng mẫu "Nguyen Van A" của portal cũ đã gỡ 2026-11-18 — kit không có tài khoản. */
      '    <button class="rail-toggle" onclick="toggleSidebar()" aria-label="Toggle sidebar">' +
      '      <span class="material-icons-outlined mi-xl toggle-expand">chevron_right</span>' +
      '      <span class="material-icons-outlined mi-xl toggle-collapse">chevron_left</span>' +
      '    </button>' +
      '  </div>' +
      '</div>' +
      '<div class="sidebar-detail">' +
      '  <div class="detail-title"><h2>' + title + '</h2></div>' +
      '  <div class="detail-search">' +
      '    <div class="detail-search-field">' +
      '      <span class="material-icons-outlined mi-md">search</span>' +
      /* aria-label bắt buộc: ô này không có <label> đi kèm, chỉ có icon. */
      '      <input type="text" class="detail-search-input" autocomplete="off"' +
      '             aria-label="' + searchPlaceholder + '" placeholder="' + searchPlaceholder + '">' +
      '    </div>' +
      '  </div>' +
      '  <div class="detail-menu">' +
           menuHTML +
      '  </div>' +
      '</div>';
  },

  /* ══════════════════════════════════════════════════════════════════
     Lọc menu theo ô "Tìm component"

     Trước 2026-10-12 ô này CHỈ LÀ Ô TRỐNG: `render()` in ra `<input>` mà
     không có một dòng JS nào gắn sự kiện — gõ vào thì không có gì xảy ra.
     Builder báo "thanh search chưa hoạt động"; đúng là chưa bao giờ hoạt động.

     Vì sao đặt ở đây chứ không ở `shared-nav.js`: có HAI file shared-nav
     (`design-system/preview/` và `prototypes/`), cả hai cùng gọi `render()`
     của pattern này. Viết ở đây thì một lần ăn cả hai, và PD sửa cấu trúc
     sidebar ở đâu thì sửa luôn hành vi ở đó.

     Không thêm CSS mới (Rule 1): ẩn/hiện bằng `style.display`, dòng "không
     tìm thấy" dùng utility class sẵn có.
     ══════════════════════════════════════════════════════════════════ */
  mountSearch: function (root) {
    root = root || document;
    var input = root.querySelector('.detail-search-input');
    var menu = root.querySelector('.detail-menu');
    if (!input || !menu || input._sdSearchBound) return;
    input._sdSearchBound = true;

    /* Bỏ dấu + hạ chữ thường để "tim" ra "Tìm", "input number" ra "Input Number".
       `đ` không tách ra được bằng NFD nên phải thay tay. */
    function norm(str) {
      return (str || '').toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/\s+/g, ' ')
        .trim();
    }
    /* Khớp cả NHÃN lẫn `data-kw` (từ khoá phụ tiếng Việt + tên thẻ sd-*, do
       shared-nav.js gắn). Nhãn menu toàn tiếng Anh nên không có data-kw thì gõ
       "bảng", "nút", "ngày giờ" đều ra 0 kết quả. */
    function labelOf(el) {
      var lb = el.querySelector('.menu-item-label');
      return norm((lb ? lb.textContent : el.textContent) + ' ' + (el.getAttribute('data-kw') || ''));
    }

    /* Dựng cây từ DOM: header nhóm là <a>, ngay sau nó là <div class="submenu">
       (xem renderGroup trong shared-nav.js). Nhóm lồng nhóm cũng theo mẫu đó. */
    function buildNodes(box) {
      var nodes = [], kids = box.children;
      for (var i = 0; i < kids.length; i++) {
        var el = kids[i];
        if (el.classList.contains('submenu')) continue;   // đã gắn vào header phía trước
        var next = kids[i + 1];
        if (next && next.classList.contains('submenu')) {
          /* Nhớ trạng thái đóng/mở BAN ĐẦU để khi xoá ô tìm thì trả về y như cũ
             (mặc định: nhóm chứa trang đang mở thì bung, còn lại thì cụp). */
          next.dataset.sdCollapsed = next.classList.contains('collapsed') ? '1' : '0';
          nodes.push({ group: true, head: el, box: next, children: buildNodes(next) });
          i++;
        } else {
          nodes.push({ group: false, el: el });
        }
      }
      return nodes;
    }
    var tree = buildNodes(menu);

    function setChevron(head, open) {
      var ic = head.querySelector('.menu-item-chevron .material-icons-outlined');
      if (ic) ic.textContent = open ? 'expand_less' : 'expand_more';
    }

    function apply(nodes, q, parentHit) {
      var anyShown = false;
      nodes.forEach(function (n) {
        if (!n.group) {
          /* Nhóm cha đã khớp thì mọi con hiện hết — gõ "BREAD" phải thấy đủ
             Browse/Read/Edit/Add chứ không phải danh sách rỗng. */
          var hit = !q || parentHit || labelOf(n.el).indexOf(q) >= 0;
          n.el.style.display = hit ? '' : 'none';
          if (hit) anyShown = true;
          return;
        }
        var selfHit = !!q && labelOf(n.head).indexOf(q) >= 0;
        var childShown = apply(n.children, q, selfHit);
        var show = !q || selfHit || childShown;
        n.head.style.display = show ? '' : 'none';
        n.box.style.display = show ? '' : 'none';
        if (q) {
          n.box.classList.remove('collapsed');            // đang tìm thì bung hết
          setChevron(n.head, true);
        } else {
          var wasCollapsed = n.box.dataset.sdCollapsed === '1';
          n.box.classList.toggle('collapsed', wasCollapsed);
          n.box.style.display = '';                        // trả quyền cho class
          setChevron(n.head, !wasCollapsed);
        }
        if (show) anyShown = true;
      });
      return anyShown;
    }

    var empty = null;
    function showEmpty(on, q) {
      if (on && !empty) {
        empty = document.createElement('div');
        empty.className = 'T14R text-black400 text-center py-12';
        menu.appendChild(empty);
      }
      if (empty) {
        empty.style.display = on ? '' : 'none';
        if (on) empty.textContent = 'Không có mục nào khớp "' + q + '"';
      }
    }

    function run() {
      var q = norm(input.value);
      var found = apply(tree, q, false);
      showEmpty(!!q && !found, input.value.trim());
    }

    input.addEventListener('input', run);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { input.value = ''; run(); }
      else if (e.key === 'Enter') {
        /* Enter → mở mục đầu tiên còn hiện. Bỏ qua header nhóm (href="#")
           và mục disabled (<span>, không có href). */
        var first = [].slice.call(menu.querySelectorAll('a.menu-item'))
          .filter(function (a) {
            var h = a.getAttribute('href');
            return h && h !== '#' && a.offsetParent !== null;
          })[0];
        if (first) first.click();
      }
    });
  }
};

/* ============================================================
   Build stamp — dấu mốc phiên bản hiện góc dưới trái MỌI trang

   Lý do có cái này (2026-10-07): nhiều lần Builder tải bản mới về, mở bằng
   tab ẩn danh mà vẫn báo "chưa thấy update gì", và cả hai bên mất vòng lặp
   chỉ để xác định xem đang mở đúng bản nào — trong khi file zip thì đã đúng.
   Nguyên nhân thường gặp: giải nén đè vào thư mục cũ, hoặc mở nhầm thư mục
   của lần tải trước (tab ẩn danh KHÔNG giúp gì ở đây vì đây là file:// trên
   đĩa, không phải cache trình duyệt).

   Nay mỗi trang tự in tên bản build ra góc màn hình: nhìn một cái là biết
   ngay đang xem bản nào, khỏi đoán. `sidebar.js` được MỌI trang preview lẫn
   prototype nạp nên đặt ở đây là phủ hết, không phải sửa từng trang.
   Bấm vào badge thì ẩn đi (nếu vướng khi chụp màn hình).
   ============================================================ */
window.SD_KIT_BUILD = 'prototype-kit-CATALOG-1012m · 2026-10-12';

(function () {
  function mountBuildStamp() {
    if (document.querySelector('.ds-build-stamp')) return;
    var el = document.createElement('button');
    el.type = 'button';
    el.className = 'ds-build-stamp';
    el.title = 'Bản build đang mở — bấm để ẩn';
    el.textContent = 'Build: ' + window.SD_KIT_BUILD;
    el.addEventListener('click', function () { el.remove(); });
    document.body.appendChild(el);
  }
  /* Nhãn "Build: …" ở góc màn hình đã tắt 2026-11-18 (Builder: gỡ nhãn kỹ thuật khỏi giao diện portfolio).
     Cần soi bản build khi gỡ lỗi thì gọi window.sdShowBuildStamp() trong console. */
  window.sdShowBuildStamp = mountBuildStamp;
})();
