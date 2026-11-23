/* ============================================================
   OMEU DS — Shared Preview Navigation

   Menu data cho sidebar trong design-system/preview/ pages.
   Sidebar HTML template nằm ở design-system/patterns/sidebar.js.

   Supports 2 depths:
     preview/index.html            (root)
     preview/{subfolder}/page.html (nested)

   Usage: <script src="../shared-nav.js"></script> (from subfolder)
          <script src="shared-nav.js"></script>    (from root)
   Requires: sidebar.js loaded trước file này
   ============================================================ */

(function () {
  // -- Menu structure --
  // Supports: { label, file } | { group, id, items[] } | nested { group, id, items[] } inside items
  // Items with disabled:true render as non-clickable text
  var menu = [
    { kw: 'mẫu trang', group: 'Patterns', id: 'sub-patterns', items: [
      { kw: 'sd-page-header tiêu đề trang', label: 'Page Header', file: 'patterns/page-header.html' },
      { kw: 'bảng danh sách filter bar', label: 'Table', file: 'patterns/table.html' },
      { kw: 'trang bread', group: 'BREAD', id: 'sub-bread', items: [
        { kw: 'danh sách duyệt', label: 'Browse', file: 'patterns/browse-page.html' },
        { kw: 'danh sách lọc ngoài lưới', label: 'Browse — Outgrid filter', file: 'patterns/browse-page-outgrid.html' },
        { kw: 'chi tiết xem', label: 'Read', file: 'patterns/read-page.html' },
        { kw: 'chỉnh sửa cập nhật', label: 'Edit', file: 'patterns/edit-page.html' },
        { kw: 'tạo mới thêm', label: 'Add', file: 'patterns/add-page.html' },
        { kw: 'tạo mới ngăn kéo drawer', label: 'Add — Side-sheet', file: 'patterns/add-side-drawer.html' },
        { kw: 'xoá', label: 'Delete', disabled: true }
      ]}
    ]},
    { kw: 'tương tác', group: 'Interactive', id: 'sub-interactive', items: [
      { kw: 'sd-button nút', label: 'Button', file: 'components/button.html' },
      { kw: 'sd-checkbox ô tích chọn nhiều', label: 'Checkbox', file: 'components/checkbox.html' },
      { kw: 'sd-radio chọn một nút tròn', label: 'Radio', file: 'components/radio.html' },
      { kw: 'sd-badge nhãn trạng thái', label: 'Badge', file: 'components/badge.html' },
      { kw: 'sd-inform thông báo cảnh báo banner', label: 'Inform', file: 'components/inform.html' }
    ]},
    { kw: 'biểu mẫu nhập liệu', group: 'Form', id: 'sub-form', items: [
      { kw: 'sd-label nhãn', label: 'Label', file: 'components/label.html' },
      { kw: 'sd-view chế độ xem', label: 'View', file: 'components/view.html' },
      { kw: 'sd-input ô nhập văn bản', label: 'Input', file: 'components/input.html' },
      { kw: 'sd-input-number ô nhập số tiền', label: 'Input Number', file: 'components/input-number.html' },
      { kw: 'sd-input-color chọn màu', label: 'Input Color', file: 'components/input-color.html' },
      { kw: 'sd-inline-text sửa tại chỗ', label: 'Inline Text', file: 'components/inline-text.html' },
      { kw: 'sd-select chọn dropdown danh sách', label: 'Select', file: 'components/select.html' },
      { kw: 'sd-autocomplete gợi ý tìm kiếm', label: 'Autocomplete', file: 'components/autocomplete.html' },
      { kw: 'lỗi kiểm tra bắt buộc validate', label: 'Validation & hideInlineError', file: 'components/validation.html' },
      { kw: 'sd-textarea ô nhập nhiều dòng', label: 'Textarea', file: 'components/textarea.html' },
      { kw: 'sd-date ngày lịch', label: 'Date', file: 'components/date.html' },
      { kw: 'sd-date-range khoảng ngày từ đến', label: 'Date Range', file: 'components/date-range.html' },
      { kw: 'sd-datetime ngày giờ', label: 'Date Time', file: 'components/datetime.html' },
      { kw: 'sd-upload-file tải lên tệp đính kèm', label: 'Upload File', file: 'components/upload-file.html' },
      { kw: 'sd-switch bật tắt công tắc', label: 'Switch', file: 'components/switch.html' },
      { kw: 'sd-chip thẻ nhiều giá trị', label: 'Chip', file: 'components/chip.html' },
      { kw: 'sd-chip-calendar nhiều ngày lịch', label: 'Chip Calendar', file: 'components/chip-calendar.html' }
      /* 2026-10-14: gỡ 4 trang HTML cũ Password · OTP · Unit · Tag Chip (Rule 18 — catalog không có).
         Thay bằng: sd-input type="password" · (không có) · suffix của sd-input / sd-input-number · sd-chip / sd-badge type="round". */
    ]},
    { kw: 'bố cục', group: 'Layout', id: 'sub-layout', items: [
      { kw: 'sd-section khối nhóm', label: 'Section', file: 'components/section.html' },
      { kw: 'sd-tab-group tab thẻ', label: 'Tab Group', file: 'components/tab-group.html' },
      { kw: 'sd-stepper bước quy trình', label: 'Stepper', file: 'components/stepper.html' },
      { kw: 'sd-anchor neo mục lục', label: 'Anchor', file: 'components/anchor.html' },
      { kw: 'sd-splitter chia cột kéo', label: 'Splitter', file: 'components/splitter.html' }
    ]},
    { kw: 'dữ liệu', group: 'Data', id: 'sub-data', items: [
      // Đổi nhãn từ "Table" -> "sd-table" (2026-09-23): sidebar có 2 mục trùng tên
      // "Table" — mục Patterns (patterns/table.html, filter-bar + sd-table trong
      // Browse page, KHÔNG có sort/menu) và mục Data này (components/table.html,
      // demo sd-table riêng, CÓ sort cột + row command menu mới) — không cách nào
      // phân biệt trên sidebar, khiến Builder bấm nhầm mục kia rồi tưởng tính năng
      // mới "chưa hoạt động". Xem CHANGELOG v2.12.0.
      { kw: 'bảng sắp xếp sort cột', label: 'sd-table', file: 'components/table.html' },
      { kw: 'sd-query-bar thanh lọc bộ lọc', label: 'Query Bar', file: 'components/query-bar.html' },
      { kw: 'sd-query-builder điều kiện lọc', label: 'Query Builder', file: 'components/query-builder.html' },
      { kw: 'sd-operator toán tử', label: 'Operator', file: 'components/operator.html' },
      { kw: 'sd-tree cây phân cấp', label: 'Tree', file: 'components/tree.html' },
      { kw: 'sd-history lịch sử', label: 'History', file: 'components/history.html' },
      { kw: 'sd-org-chart sơ đồ tổ chức', label: 'Org Chart', file: 'components/org-chart.html' },
      { kw: 'sd-bar-chart sd-line-chart sd-pie-chart sd-doughnut-chart biểu đồ chart.js', label: 'Chart', file: 'components/chart.html' },
      { kw: 'bpm trung tâm công việc kpi thẻ số liệu scorecard filter scorecard thẻ lọc', label: 'Work Center (lib-bpm)', file: 'components/work-center.html' },
      { kw: 'trạng thái rỗng loading', label: 'Data State', file: 'components/data-state.html' }
    ]},
    { kw: 'lớp phủ nổi', group: 'Overlay', id: 'sub-overlay', items: [
      { kw: 'sd-modal hộp thoại popup', label: 'Modal', file: 'components/modal.html' },
      { kw: 'hộp thoại thu nhỏ phóng to', label: 'Modal Resizable', file: 'components/modal-resizable.html' },
      { kw: 'sd-import-excel nhập excel', label: 'Import Excel', file: 'components/import-excel.html' },
      { kw: 'sd-side-drawer ngăn kéo bên', label: 'Side Drawer', file: 'components/side-drawer.html' },
      { kw: 'sdTooltip chú thích', label: 'Tooltip', file: 'components/tooltip.html' },
      { kw: 'sd-avatar ảnh đại diện', label: 'Avatar', file: 'components/avatar.html' },
      { kw: 'xem ảnh', label: 'Preview Image', file: 'components/preview-image.html' },
      { kw: 'xem pdf tài liệu', label: 'Preview PDF', file: 'components/preview-pdf.html' },
      { kw: 'sd-quick-action hành động nhanh', label: 'Quick Action', file: 'components/quick-action.html' },
      { kw: 'sdHref sdHoverCopy sdScroll sdDevice', label: 'Directive', file: 'components/directives.html' },
      { kw: 'autoid kiểm tra e2e', label: 'AutoId Inspector', file: 'components/autoid-inspector.html' },
      { kw: 'sd-editor soạn thảo ckeditor', label: 'Editor', file: 'components/editor.html' },
      { kw: 'soạn văn bản a4 word', label: 'Document Builder', file: 'components/document-builder.html' },
      { kw: 'sd-form-builder dựng biểu mẫu', label: 'Form Builder', file: 'components/form-builder.html' },
      { kw: 'sd-form-render biểu mẫu động', label: 'Form Generic', file: 'components/form-generic.html' },
      { kw: 'soạn thảo rút gọn mention', label: 'Mini Editor', file: 'components/mini-editor.html' },
      { kw: 'mã nguồn json prism', label: 'Code Editor', file: 'components/code-editor.html' }
    ]},
    { kw: 'dịch vụ', group: 'Service', id: 'sub-service', items: [
      { kw: 'toast xác nhận đang tải service', label: 'Notify / Confirm / Loading', file: 'components/service.html' }
    ]}
  ];

  // Detect depth: root (preview/index.html) vs nested (preview/subfolder/page.html)
  var pathParts = window.location.pathname.split('/');
  var previewIdx = pathParts.indexOf('preview');
  var depth = previewIdx >= 0 ? pathParts.length - previewIdx - 2 : 0;
  // depth=0 → root (preview/index.html), depth=1 → nested (preview/sub/page.html)

  var isRoot = depth === 0;
  var prefix = isRoot ? '' : '../';  // path from current file to preview/
  var corePrefix = isRoot ? '../core/' : '../../core/';
  var patternsPrefix = isRoot ? '../patterns/' : '../../patterns/';
  var protoPrefix = isRoot ? '../../prototypes/' : '../../../prototypes/';

  // Detect current file for active state
  var currentPath = '';
  if (previewIdx >= 0 && pathParts.length > previewIdx + 1) {
    // e.g. "components/button.html" or "index.html"
    currentPath = pathParts.slice(previewIdx + 1).join('/');
  }

  // Check if any item in a group (recursively) matches currentPath
  function groupHasActive(items) {
    return items.some(function (c) {
      if (c.group) return groupHasActive(c.items);
      return c.file === currentPath;
    });
  }

  // Render a single menu item (leaf)
  function renderItem(item, level) {
    var legacySuffix = item.legacy
      ? '<span style="font-size:10px;color:var(--sd-black300);margin-left:4px;">HTML</span>'
      : '';
    /* data-kw: từ khoá phụ để ô "Tìm component" khớp được cả tiếng Việt và tên
       thẻ sd-* ("bảng" → sd-table, "nút" → Button, "sd-datetime" → Date Time).
       Nhãn menu toàn tiếng Anh nên thiếu cái này thì gõ tiếng Việt ra 0 kết quả
       — xem mountSearch() trong patterns/sidebar.js. */
    var kwAttr = item.kw ? ' data-kw="' + item.kw + '"' : '';
    if (item.disabled) {
      return '<span class="menu-item disabled" data-level="' + level + '"' + kwAttr + '>' +
        '<span class="menu-item-label">' + item.label + legacySuffix + '</span></span>';
    }
    var active = item.file === currentPath ? ' active' : '';
    return '<a class="menu-item' + active + '" href="' + prefix + item.file + '" data-level="' + level + '"' + kwAttr + '>' +
      '<span class="menu-item-label">' + item.label + legacySuffix + '</span></a>';
  }

  // Render a group (with nested support)
  function renderGroup(entry, level) {
    var hasActive = groupHasActive(entry.items);
    var collapsed = hasActive ? '' : ' collapsed';
    var chevron = hasActive ? 'expand_less' : 'expand_more';

    var gkw = entry.kw ? ' data-kw="' + entry.kw + '"' : '';
    var html = '<a class="menu-item" href="#" onclick="toggleSubmenu(event, \'' + entry.id + '\')" data-level="' + level + '"' + gkw + '>' +
      '<span class="menu-item-label">' + entry.group + '</span>' +
      '<span class="menu-item-chevron"><span class="material-icons-outlined mi-md">' + chevron + '</span></span>' +
      '</a>';
    html += '<div id="' + entry.id + '" class="submenu' + collapsed + '">';
    entry.items.forEach(function (c) {
      if (c.group) {
        html += renderGroup(c, level + 1);
      } else {
        html += renderItem(c, level + 1);
      }
    });
    html += '</div>';
    return html;
  }

  // Build menu HTML
  var menuHTML = '';
  menu.forEach(function (entry) {
    if (entry.group) {
      menuHTML += renderGroup(entry, 1);
    } else {
      var active = entry.file === currentPath ? ' active' : '';
      menuHTML += '<a class="menu-item' + active + '" href="' + prefix + entry.file + '">' +
        '<span class="menu-item-label">' + entry.label + '</span></a>';
    }
  });

  // Render sidebar using pattern
  var sidebar = document.getElementById('sidebar');
  if (sidebar && PROTOTYPE_PATTERNS && PROTOTYPE_PATTERNS['sidebar']) {
    sidebar.innerHTML = PROTOTYPE_PATTERNS['sidebar'].render({
      railIcons: [
        { href: prefix + 'components/button.html', icon: 'widgets', title: 'Components', active: true },
        { href: protoPrefix + 'index.html', icon: 'web', title: 'Prototypes', active: false }
      ],
      title: 'Design System',
      searchPlaceholder: 'Tìm component',
      menuHTML: menuHTML
    });
    /* Gắn hành vi cho ô tìm kiếm — `render()` chỉ trả về HTML tĩnh.
       Thiếu dòng này thì ô search là ô trống (dẫm 2026-10-12). */
    PROTOTYPE_PATTERNS['sidebar'].mountSearch(sidebar);
  }
})();
