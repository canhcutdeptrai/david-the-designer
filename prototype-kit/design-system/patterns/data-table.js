/**
 * Pattern: Data Table — NGỪNG DÙNG (2026-10-14)
 * ===================
 * Bảng của kit là `<sd-table>` (catalog #c-table): phân trang, chọn dòng, thao tác hàng loạt
 * (`option.selector.actions`), chân bảng (reload/export/config) đều có sẵn. Không trang nào còn dùng
 * `data-pattern="data-table"`. File được giữ lại vì bản đóng băng `tra-cuu-cam-nang.html` vẫn nạp nó.
 * Trang mới: KHÔNG nạp file này, KHÔNG dùng pattern này.
 *
 * Bảng dữ liệu với footer, pagination, bulk actions.
 * PD kiểm soát: table-container, table-scroll, table-footer,
 *   pagination, bulk-bar, checkbox/seq column injection.
 * BA cung cấp (slot): <table class="data-table"> với thead + tbody.
 *
 * Cách dùng:
 *   <div data-pattern="data-table"
 *        data-selectable="true"
 *        data-paginated="true"
 *        data-page-sizes="10,20,50,100"
 *        data-page-size-default="20"
 *        data-total="156"
 *        data-footer-actions="refresh,download"
 *        data-bulk-actions="Xuất Excel">
 *     <table class="data-table">
 *       <thead><tr><th>Cột 1</th>...</tr></thead>
 *       <tbody><tr><td>Data</td>...</tr></tbody>
 *     </table>
 *   </div>
 */

var PROTOTYPE_PATTERNS = window.PROTOTYPE_PATTERNS || {};

PROTOTYPE_PATTERNS['data-table'] = {
  template: /* html */`
<div class="table-container">
  <div class="table-scroll">
    <!-- SLOT -->
  </div>
  {{TABLE_FOOTER}}
</div>`,

  defaults: {
    'selectable': 'false',
    'paginated': 'false',
    'page-sizes': '10,20,50,100',
    'page-size-default': '20',
    'total': '0',
    'footer-actions': 'refresh,download',
    'bulk-actions': ''
  }
};
