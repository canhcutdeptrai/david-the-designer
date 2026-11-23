/**
 * Pattern: Filter Bar  (outgrid filter)
 * =====================================
 * Mirror của `external-filter` trong Core UI Catalog `#c-table`.
 * Rà soát lại toàn mục 2026-10-12 — trước đó pattern này chỉ "na ná" catalog.
 *
 * Cây DOM của catalog:
 *   external-filter.mb-16
 *     sd-section
 *       div.rounded-8.bg-white.c-shadow-section
 *         div.d-flex.align-items-center.justify-content-between.w-full.px-16.py-8.cursor-pointer
 *           div.d-flex.align-items-center
 *             span.mr-8.material-icons-outlined.text-secondary  (filter_alt, 24px)
 *                 (kit: `text-black400` — QUYẾT ĐỊNH CỦA BUILDER 2026-10-14, xem dưới)
 *             div > div.T16M  "Bộ lọc"
 *           div.d-flex
 *             div.d-flex.mr-4[sdHeaderRight]  → 2 × sd-button (link / square / sm)
 *                 (catalog: cleaning_services + settings. Kit đổi nút đầu sang
 *                  `restart_alt` — QUYẾT ĐỊNH CỦA BUILDER 2026-10-12, xem known-gaps)
 *             div.d-flex.align-items-center   → mat-icon expand_less (24px)
 *         div.p-16 { border-top: 1px solid #e6e6e6 }
 *           div.row.mx-0 { row-gap:16px } → div.col-lg-3.col-md-3.col-sm-6.px-8 × n
 *
 * Ba chỗ kit cố ý khác, đều có lý do:
 *   1. Dùng lớp `.c-shadow-section` của kit (đã mirror đúng công thức bóng/viền
 *      inset của catalog ở `sd-section`) thay vì lồng thật một thẻ `<sd-section>`
 *      — `sd-section` của kit là component SỐNG, tự vẽ lại innerHTML nên không
 *      làm vỏ thụ động được. Cùng kiểu lệch đã ghi cho `sd-select` ở sd-query-bar.
 *   2. Lưới dựng bằng CSS grid + media query thay cho hệ `.row/.col-*` của
 *      Bootstrap — kit không nạp Bootstrap. Số cột theo đúng breakpoint catalog.
 *   4. Bốn icon của header (filter_alt, đặt lại, thiết lập, mũi tên thu/mở) màu NHẠT
 *      `--sd-black400` #757575 thay vì #212121 / #000 của catalog — Builder 2026-10-14:
 *      „Trừ fields thì các icon trong external filter … để màu nhẹ hơn“. Ô lọc giữ nguyên.
 *      CSS ở components.css (mục FILTER BAR).
 *   3. Chevron bọc trong <button> để điều hướng bàn phím được (Rule 9 của
 *      AGENTS.md); catalog để `mat-icon` trần vì cả header là vùng bấm.
 *
 * Ô lọc — viết giống `externalFilters: [{ field, title, type }]` của thư viện:
 * `title` là NHÃN NỔI (`[label]="item.title"` trong ExternalFilterComponent) — lúc
 * trống nằm trong ô, focus / có giá trị thì nổi lên viền như ô form thường; cỡ md,
 * `hide-inline-error`. `pattern-loader.js` (normalizeFilterField) tự chuẩn hoá các
 * con trực tiếp là ô nhập sd-*: chỉ có `placeholder` → thêm `label` cùng chữ;
 * placeholder = label; bỏ `size`; thêm `hideInlineError`. (2026-10-23 — trước đổi
 * ngược `label` → placeholder nên nhãn không bao giờ nổi.)
 *
 * Rà soát lần 2 (2026-10-12), đo cùng bốn ô với catalog ở bề ngang 1242px:
 *   · lưới thiếu lề ngoài 8px của `.px-8` → ô đầu ở x=16 thay vì 24;
 *   · body có `max-height:500px` + hiệu ứng trượt — catalog không có, gỡ;
 *   · mũi tên sd-select: keyboard_arrow_down 20px, cách mép phải 12px;
 *   · placeholder trong mục bảng rgba(0,0,0,.6); chữ trong khung form giãn 0.496px.
 *
 * LỌC THẬT bảng phía dưới (2026-10-15 — Builder: „select field trong External filter thì các giá trị trong table
 * phía dưới apply theo“). Mỗi ô = một mục `externalFilters` của thư viện: `data-field` = field (cột / dữ liệu),
 * kiểu theo thẻ (sd-input string · sd-select values · sd-date-range daterange …). Ô chọn / ngày lọc ngay khi đổi,
 * ô chữ / số lọc khi nhấn Enter (như thư viện). Nút đầu (đặt lại) xoá mọi ô + lọc theo cột của bảng.
 * Bảng = `data-for="<id>"`, không khai thì `sd-table` đầu tiên phía sau khung. Logic: sd-components.js mục
 * "Bộ lọc ngoài → sd-table". Ô không có `data-field` (trang cũ) → kit suy từ nhãn trùng tiêu đề cột; nhãn
 * "Tìm kiếm" → tìm trên mọi cột.
 *
 * Cách dùng:
 *   <div data-pattern="filter-bar" data-id="filter-main" data-for="hoSoTable">
 *     <sd-input placeholder="Mã hồ sơ" data-field="code"></sd-input>
 *     <sd-select placeholder="Trạng thái" data-field="status" items='[...]'></sd-select>
 *   </div>
 *   <sd-table id="hoSoTable" columns='[...]' data='[...]'></sd-table>
 */

var PROTOTYPE_PATTERNS = window.PROTOTYPE_PATTERNS || {};

PROTOTYPE_PATTERNS['filter-bar'] = {
  template: /* html */`
<div class="filter-bar mb-16" id="{{id}}"{{#if for}} data-for="{{for}}"{{/if}}>
  <div class="filter-bar-shell c-shadow-section">
    <div class="filter-bar-header" onclick="toggleFilterBar('{{id}}')">
      <div class="filter-bar-header-left">
        <span class="material-icons-outlined mi-xl text-black400 mr-8">filter_alt</span>
        <div class="T16M">Bộ lọc</div>
      </div>
      <div class="filter-bar-header-right">
        <div class="filter-bar-actions" onclick="event.stopPropagation()">
          <sd-button type="link" color="secondary" size="sm" prefixIcon="restart_alt" aria-label="Đặt lại bộ lọc"></sd-button>
          <sd-button type="link" color="secondary" size="sm" prefixIcon="settings" aria-label="Thiết lập bộ lọc"></sd-button>
        </div>
        <button class="filter-bar-collapse" type="button" aria-label="Thu gọn bộ lọc">
          <span class="material-icons-outlined mi-xl" id="{{id}}-chevron">expand_less</span>
        </button>
      </div>
    </div>
    <div class="filter-bar-body" id="{{id}}-body">
      <div class="filter-bar-grid">
        <!-- SLOT -->
      </div>
    </div>
  </div>
</div>`,

  defaults: {
    'id': 'filter-bar-main',
    'for': ''
  }
};
