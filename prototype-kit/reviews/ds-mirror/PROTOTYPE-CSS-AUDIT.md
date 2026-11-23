# Báo cáo rà CSS custom - PROTOTYPE-CSS-AUDIT

Phạm vi: `prototypes/cam-nang-phan-quyen/*.html`, bỏ qua `tra-cuu-cam-nang.html` (bản đóng băng). Chỉ đọc, không sửa file prototype. Token đối chiếu lấy từ `design-system/core/styles/tokens.css` và `sd-tokens.css`.

## 1. Tóm tắt số liệu

- File đã quét: 30 file HTML (31 file trong thư mục trừ `tra-cuu-cam-nang.html`).
- Thẻ `<button>` thuần: 282 thẻ, đúng con số đối chiếu do điều phối đưa. Đúng 18 file có ít nhất một thẻ `<button>` thuần: chi-tiet-workitem, danh-sach-loai-dieu-kien, danh-sach-luong, danh-sach-position, danh-sach-workitem, memory, quan-ly-cam-nang, quan-ly-orgbase, sua-cam-nang, sua-orgbase, sua-position, sua-workitem, tao-cam-nang, tao-orgbase, tao-position, tao-workitem, tra-cuu-cam-nang-v2, uy-quyen-noi-bo. Lưu ý danh sách này gồm cả `memory.html` (viewer) và `tra-cuu-cam-nang-v2.html` (không có inline CSS, xem mục 7 và 8).
- Class CSS custom gắn trên thẻ `<button>`: tôi đếm được 49 class (315 lần class xuất hiện). Số của điều phối là 38; chênh lệch do cách đếm - nếu loại bỏ class legacy `.btn...` (5 thẻ) và các class chỉ canh layout (`wi-tree-menu-btn`, `version-save-close`, `cond-toggle`, `activity-sequence-drag`, `btn-drag-handle`, `mock-combo-option`, `add-flow-btn`, `spc-close`, `snapshot-close`) thì ra cỡ 38-40. Cần điều phối đối chiếu thước đo trước khi nghiệm thu (xem mục 8).
- Loại 1: 49 class nút custom-styled + khoảng 30 nhóm class custom cho input, select, textarea, date, checkbox/radio, switch, badge/chip, tab + 15 thẻ button có inline style + 12 thẻ input/select/textarea có inline style.
- Loại 2: 660 giá trị hex trong toàn bộ inline `<style>`; bảng mục 3 liệt kê các trường hợp tạo dáng component cơ bản.
- Loại 3: 423 lượt `var(--token, hex)` (sau khi lọc fallback không phải hex), quy về 195 cặp token+hex duy nhất; 81 cặp lệch/thiếu, trong đó 1 cặp chỉ lệch cách viết (`#fff` = `#FFFFFF`), còn lại 80 cặp lệch màu thật. Có 8 tên token không tồn tại trong DS nên fallback chạy ngay từ bây giờ.
- Loại 4: 50 rule chứa `!important`; 21 selector khớp lặp, trong đó 10 cặp là trùng lặp thật sự, số còn lại là override responsive trong `@media` (không tính vi phạm).
- Loại 5: 23 class nút có border (mục 6).

## 2. Loại 1 - Custom component cơ bản mà DS đã có

### 2a. Class CSS tạo dáng nút (gắn trên thẻ `<button>`)

Cách đếm "Số lần dùng": số lần class xuất hiện trên thẻ `<button>` thuần (một thẻ nhiều class thì mỗi class đếm một lần).

| Class CSS | Số lần | File | sd-* thay thế | Thiếu năng lực nếu thay không được |
|---|---|---|---|---|
| `.pg-action-btn` | 14 | danh-sach-loai-dieu-kien, danh-sach-luong, danh-sach-position, danh-sach-workitem, uy-quyen-noi-bo | Có - `sd-button type="link" color="primary" size="sm"`; nút chỉ icon bỏ `title` thành icon-only | Không |
| `.pg-nav-btn` | 6 | danh-sach-luong, danh-sach-position, danh-sach-workitem | Có - `sd-button size="sm"` không `title` (28x28) | Không |
| `.add-fixed-btn` | 8 | quan-ly-orgbase, sua-orgbase, tao-orgbase | Có - `sd-button type="light" size="sm"` | Thiếu variant viền dashed "thêm mới" |
| `.link-remove` | 8 | sua-workitem, tao-workitem, uy-quyen-noi-bo | Có - `sd-button type="link" size="sm"` icon-only | Không |
| `.org-lvl-btn` | 40 | quan-ly-orgbase, sua-orgbase, tao-orgbase | Có - `sd-button size="sm" type="light"` hoặc nhóm filter `sd-scorecard compact` | Thiếu trạng thái selected/active cho sd-button |
| `.add-action-btn` | 13 | sua-workitem, tao-workitem | Có - `sd-button type="light" size="sm" prefixIcon="add"` | Không |
| `.tier-logic-toggle` | 2 | sua-workitem, tao-workitem | Có - `sd-button size="sm"` | Thiếu trạng thái selected (AND/OR) |
| `.cond-remove` | 9 | sua-workitem, tao-workitem | Có - `sd-button size="sm"` icon-only `color="error"` | Không |
| `.mock-combo-option` | 2 | sua-workitem, tao-workitem | Có - `sd-dropdown-item` | Không |
| `.activity-config-btn` | 4 | sua-workitem, tao-workitem | Có - `sd-button size="md"` icon-only | Không |
| `.dept-chip` | 16 | sua-workitem, tao-workitem | Không có sd-* tương đương | Pill chip lọc tương tác có selected state; `sd-chip` là input, `sd-badge` không click, `sd-button` không pill 12px |
| `.holder-action-btn` | 6 | sua-position, tao-position | Có - `sd-button size="md"` icon-only hoặc `size="sm"` + icon | Không |
| `.assignment-remove-btn` | 2 | sua-workitem, tao-workitem | Có - `sd-button size="sm"` icon-only | Không |
| `.attach-file-remove` | 6 | sua-workitem, tao-workitem | Có - `sd-button size="sm"` icon-only `color="error"` | Không |
| `.version-action` | 6 | chi-tiet-workitem, sua-workitem | Có - `sd-button type="light"`/`link` size sm + prefixIcon | Không |
| `.fc-remove` | 4 | quan-ly-orgbase, sua-orgbase | Có - `sd-button size="sm"` icon-only | Không |
| `.activity-sequence-drag` | 2 | sua-workitem, tao-workitem | Có thể - `sd-button size="sm"` icon-only | Drag handle cần cursor grab; phân vân mục 7 |
| `.note-editor-btn` | 12 | sua-cam-nang, tao-cam-nang | Có thể - `sd-button type="light" size="sm"` | Thiếu pressed state; glyph B/I/U đậm nghiêng không biểu diễn được qua title |
| `.cond-group-remove` | 2 | sua-workitem, tao-workitem | Có - `sd-button size="sm"` icon-only `color="error"` | Không |
| `.activity-config-close` | 2 | sua-workitem, tao-workitem | Có - `sd-button size="sm"` icon-only | Không |
| `.multi-picker-box` | 2 | sua-workitem, tao-workitem | Không | Trigger chọn nhiều giá trị; `sd-select` chưa multi-select; phân vân mục 7 |
| `.cond-logic-btn` | 4 | sua-workitem, tao-workitem | Có thể - `sd-button size="sm"` | Thiếu selected state; phân vân mục 7 |
| `.tier-clone-btn` | 6 | sua-workitem, tao-workitem | Có - `sd-button size="sm"` icon-only | Không |
| `.dept-add-btn` | 4 | sua-workitem, tao-workitem | Có - `sd-button size="sm"` | Thiếu pill viền dashed |
| `.btn-drag-handle` | 2 | sua-workitem, tao-workitem | Có thể - `sd-button size="sm"` icon-only | Drag handle cần cursor grab; phân vân mục 7 |
| `.action-menu-btn` | 1 | danh-sach-workitem | Có - `sd-button size="sm"` icon-only | Không |
| `.remove-flow-btn` | 2 | tao-orgbase | Có - `sd-button size="sm"` icon-only `color="error"` | Không |
| `.document-icon-button` | 3 | uy-quyen-noi-bo | Có - `sd-button size="sm"` icon-only | Không |
| `.import-drop-zone` | 1 | danh-sach-workitem | Có thể - `sd-upload-file` | Flow import template + preview chưa chắc khớp; phân vân mục 7 |
| `.import-workitem-btn` | 1 | danh-sach-workitem | Có - `sd-button type="light" size="sm"` | Không |
| `.spc-close` | 1 | danh-sach-position | Có - `sd-button size="sm"` icon-only | Không |
| `.workitem-action-btn` | 10 | danh-sach-workitem | Có - `sd-button size="sm"` icon-only | Không |
| `.delegation-tab` | 2 | uy-quyen-noi-bo | Có - `sd-tab-group` (không nên dùng sd-button cho tab) | Không |
| `.import-small-btn` | 2 | danh-sach-workitem | Có - `sd-button size="sm"` | Không |
| `.snapshot-tab` | 2 | chi-tiet-workitem | Có - `sd-tab-group variant="pills"` | Không |
| `.version-save-close` | 1 | sua-workitem | Có - `sd-button size="sm"` icon-only | Không |
| `.import-footer-btn` | 3 | danh-sach-workitem | Có - `sd-button type="fill"` (variants primary) và `type="light"` | Không |
| `.action-menu-item` | 7 | danh-sach-workitem | Có - `sd-dropdown-item` | Không |
| `.wi-tree-menu-btn` | 9 | danh-sach-workitem | Có - gom chung với `.workitem-action-btn` (`sd-button size="sm"` icon-only) | Không |
| `.cond-toggle` | 1 | sua-workitem | Có - `sd-button size="sm"` icon-only | Không |
| `.clone-tree-option` | 1 | danh-sach-workitem | Có - `sd-dropdown-item` | Không |
| `.bulk-publish-btn` | 3 | danh-sach-workitem | Có - `sd-button type="light"` hoặc `type="fill"` size sm | Không |
| `.icon-only-action` | 4 | uy-quyen-noi-bo | Có - `sd-button size="sm"` icon-only | Không |
| `.import-dialog-close` | 1 | danh-sach-workitem | Có - `sd-button size="sm"` icon-only | Không |
| `.wi-expand-btn` | 5 | danh-sach-workitem | Không thay được nguyên dạng | sd-button nhỏ nhất `sm` = 28px; nút này 18x18 trong hàng cây. Thiếu năng lực size xs (16-18px) cho icon button trong table/tree row |
| `.snapshot-close` | 1 | chi-tiet-workitem | Có - `sd-button size="sm"` icon-only | Không |
| `.add-flow-btn` | 1 | tao-orgbase | Có - `sd-button type="light" size="sm"` | Thiếu viền dashed |
| `.root-create-btn` | 2 | danh-sach-workitem | Có - `sd-button type="fill" size="sm"` | Không |
| `.btn` cùng `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-sm`, `.btn-md` | 5 thẻ / 13 lần class | quan-ly-orgbase, sua-workitem | Có - mapping legacy cũ: `.btn-primary` -> `sd-button type="fill" color="primary"`, `.btn-secondary` -> `type="light"`, `.btn-ghost` -> `type="link"`, `.btn-sm` -> `size="sm"` | Không. Lưu ý đây là class legacy DS còn tồn tại trong `components.css`, không phải CSS custom, nhưng vẫn vi phạm quy tắc bắt buộc dùng sd-button |

### 2b. Class CSS tạo dáng component cơ bản khác (input, select, textarea, date, checkbox/radio, switch, badge, tab)

| Class / selector CSS | File | sd-* thay thế |
|---|---|---|
| `.table-multi-filter-menu input` (checkbox trong menu lọc) | danh-sach-loai-dieu-kien, danh-sach-luong, danh-sach-position, danh-sach-workitem, quan-ly-orgbase, uy-quyen-noi-bo | `sd-checkbox` |
| `.activity-action-scope-option input`, `.seat-mark-option input`, `.workitem-kind-card input`, `.version-save-option input`, `.self-delegation-box input`, `.activity-dept-scope-control input` | sua-luong, tao-luong, sua-position, tao-position, sua-workitem, tao-workitem | `sd-radio` hoặc `sd-checkbox` |
| `.toggle-switch input` + `.toggle-slider`, `.has-role-toggle` | quan-ly-orgbase, sua-orgbase | `sd-switch` |
| `.holder-date`, `.between-inputs input[type="date"]`, `.date-range-wrap input[type="date"]`, `.attach-file-item input[type="date"]`, `.attach-validity input[type="date"]` | sua-position, tao-position, sua-workitem, tao-workitem, chi-tiet-workitem | `sd-date` / `sd-datetime` |
| `.holder-search`, `.wi-tree-search-input`, `.th-input`, `.table-filter-control`, `.multi-search` + raw `input.sd-input` (33 chỗ sua-workitem, 30 chỗ tao-workitem) | danh-sach-workitem, sua-position, tao-position, quan-ly-orgbase, sua-workitem, tao-workitem, uy-quyen-noi-bo | `sd-input` |
| `.wi-tree-filter select`, `.wi-filter-bar select`, `.cond-sel-wrap select`, `.currency-sel-wrap select`, `.pg-size-sel`, `.pg-page-size`, `.th-select` + raw `select.sd-input` (14 chỗ sua-workitem, 14 chỗ tao-workitem) | danh-sach-workitem, danh-sach-luong, danh-sach-position, chi-tiet-workitem, quan-ly-orgbase, sua-workitem, tao-workitem | `sd-select` |
| `.import-number-input` | danh-sach-workitem | `sd-input-number` |
| raw `textarea.sd-input` | sua-cam-nang, tao-cam-nang | `sd-textarea` |
| `.status-active`, `.status-inactive`, `.status-effective`, `.org-lvl-badge`, `.role-chip`, `.fixed-chip`, `.type-chip`, `.level-chip`, `.org-legend-badge`, `.pos-external-badge`, `.badge-tag`, `.badge-active`, `.badge-handbook`, `.tree-node-badge`, `.usage-badge`, `.matrix-role-chip`, `.scope-badge`, `.scope-chip`, `.cond-connector-badge`, `.esc-level-badge`, `.disabled-badge`, `.assignment-order-badge`, `.cond-num`, `.import-row-status`, `.source-tag`, `.status-tag` | nhiều file | `sd-badge type="round"` / `type="status"` kèm `color` tương ứng; `.cond-num` và `.assignment-order-badge` là số thứ tự trong widget custom - phân vân mục 7 |
| `.tag-chip button`, `.pos-chip button`, `.tag-item button` (nút X trong chip/tag) | sua-cam-nang, tao-cam-nang, sua-workitem, tao-workitem | `sd-button type="link" size="sm"` icon-only hoặc cơ chế removable của `sd-chip` |
| `.workitem-kind-options` (segmented radio card) | sua-workitem, tao-workitem | `sd-radio`; sd-radio chưa có dạng card - phân vân mục 7 |
| `.delegation-tab`, `.snapshot-tab`, `.drawer-tab`, `.inline-detail-tab` | uy-quyen-noi-bo, chi-tiet-workitem, sua-workitem | `sd-tab-group` |
| `.val-with-currency input.sd-input`, `.currency-sel-wrap` (bọc input rồi ghi đè sd-input) | sua-workitem, tao-workitem | Không nên tự bọc/ghi đè; dùng `sd-input` + layout currency riêng |
| `.sd-input` (định nghĩa lại class DS ngay trong `<style>` của danh-sach-workitem) | danh-sach-workitem | Xoá custom, dùng `sd-input` thật của DS; ghi đè class DS là Loại 1 + Loại 4 |

### 2c. Button và control bị tạo dáng bằng INLINE STYLE (không nằm trong `<style>`)

| File | Tồn tại | Trích đoạn đại diện | Vi phạm |
|---|---|---|---|
| quan-ly-cam-nang.html | 3 button + 4 control | `<button onclick="saveHandbook()" style="...background:var(--color-primary-600,#2563eb); color:#fff; ...">`; `<input id="hb-code" ... style="...border:1px solid var(--color-neutral-300,#d1d5db); background:#fff;">` | Loại 1 (phải sd-button/sd-input/sd-select/sd-textarea) + Loại 2 (`#fff`) + Loại 3 (fallback xanh trên token nâu) + Loại 5 (border) |
| sua-workitem.html | 4 button | `<button onclick="addCondToGroup(...)" style="...border:1px solid var(--border-secondary); ...color:var(--color-primary-600);">` | Loại 1 + Loại 5; màu dùng token không fallback nên chưa dính Loại 3 |
| tao-workitem.html | 4 button | giống sua-workitem (`addCondToGroup`, `addGroupToGroup`) | Loại 1 + Loại 5 |
| quan-ly-orgbase.html | 1 button | `<button class="btn btn-ghost btn-sm" ... style="padding:4px;">` | Layout nhẹ, nhưng dính class legacy `.btn...` (Loại 1) |
| danh-sach-workitem.html | 1 button | `style="padding-left:..."` trên `.clone-tree-option` | Layout, không đáng kể |
| sua-position.html, tao-position.html | 1 button mỗi file | `style="margin-top:10px;"` trên `.holder-action-btn` | Layout, nhưng nằm trên class nút đã sai (Loại 1) |

## 3. Loại 2 - Hardcode giá trị thay vì dùng token

Bảng dưới liệt kê những trường hợp tạo dáng component cơ bản đáng chú ý nhất. Toàn bộ 660 hex trong `<style>` đã quét; các cặp `var(--token, #hex)` được tách sang Loại 3.

| File | Class | Giá trị hardcode | Token nên dùng |
|---|---|---|---|
| danh-sach-position.html | `.data-table` và biến thể | `background:#fafafa`, `border:1px solid #e0e0e0`, `#f0f0f0`, `#f5f9ff`, `color:#616161`, `#455a64`, `#fffde7`, `#fff9c4` | `sd-table` hoặc `--surface-secondary`, `--border-primary`, `--text-secondary` |
| danh-sach-position.html | `.source-tag.sap`, `.source-tag.manual`, `.status-tag.active/vacant/inactive` | `#e3f2fd`, `#1565c0`, `#fff3e0`, `#e65100`, `#e8f5e9`, `#2e7d32`, `#f5f5f5`, `#757575` | `sd-badge` + `--color-info-100/700`, `--color-warning-100/700`, `--color-success-100/700`, `--color-neutral-100/800` |
| danh-sach-position.html | `.oc-node-box`, `.oc-position-card`, `.legend-box`, `.oc-position-card.external-card` | `#d4a017`, `#ffb300`, `#ffcc80`, `#ff9800`, `#388e3c`, `#a5d6a7`, `#66bb6a`, `#eceff1`, `#cfd8dc`, `#37474f`, `#546e7a` và linear-gradient | Toàn bộ nên lấy từ `--chart-*` / token semantic; linear-gradient vi phạm rule 6 cấm gradient |
| danh-sach-position.html | `.action-icon`, `.action-icon-danger`, `.action-icon-success`, `.action-icons` | `#757575`, `#e3f2fd`, `#1565c0`, `#ffebee`, `#c62828`, `#2e7d32`, `#1b5e20` | `--icon-default`, `--icon-error`, `--icon-success`; đang dùng `.material-icons` filled (rule 4 cấm) |
| danh-sach-position.html | `.oc-legend`, `.action-icons .material-icons` | `var(--color-gray-200)` / `var(--color-gray-500)` - token không tồn tại, không fallback, thuộc tính trở thành invalid | `--border-primary`, `--icon-default` |
| danh-sach-position.html | `.pos-external-badge` | `rgba(117,117,117,0.15)`, `#616161` | `--surface-disabled`, `--text-secondary` |
| danh-sach-position.html | `.seat-card:hover`, `.oc-node-box:hover` | `box-shadow:0 2px 6px rgba(37,99,235,.1)` | `--shadow-focus` / token shadow |
| danh-sach-workitem.html | `.import-row-status.valid/warning/blocked` | `#dcfce7`/`#15803d`, `#fef3c7`/`#b45309`, `#fee2e2`/`#b91c1c` | `--color-success-100/700`, `--color-warning-100/700`, `--color-error-100/700` |
| danh-sach-workitem.html | `.import-drop-zone` | `background:#fffaf5` | `--color-primary-50` |
| danh-sach-workitem.html | `.clone-tree-branch` | `color:#c0842d` | `--color-primary-500` |
| danh-sach-workitem.html | `.wi-right-table`, `.clone-dialog`, `.import-dialog`, `.import-preview-card`, `.import-summary-card` | `background:#fff` | `--surface-primary` |
| quan-ly-cam-nang.html | `input#hb-code`, `input#hb-name`, `textarea#hb-desc`, `select#hb-status` (inline) | `background:#fff`, `border:1px solid var(--color-neutral-300,#d1d5db)` | `--surface-primary`, `--border-primary` |
| quan-ly-cam-nang.html | nút Lưu handbook (inline) | `color:#fff`, `background:var(--color-primary-600,#2563eb)` | `--text-on-primary`; bỏ fallback sai |
| chi-tiet-workitem.html | `.diff-old`, `.diff-new` | `#fecaca`, `#fff1f2`, `#b91c1c`, `#bbf7d0`, `#f0fdf4`, `#15803d` | `--color-error-100/50/700`, `--color-success-100/50/700` |
| chi-tiet-workitem.html | `.version-icon.current` | `color:#fff` | `--text-on-primary` |
| sua-workitem.html, tao-workitem.html | `select.sd-input, input.sd-input`, `.currency-sel-wrap select`, `.tag-input-wrap`, `.val-with-currency`, `.multi-picker-box` | `background:#fff` | `--surface-primary` |
| sua-workitem.html, tao-workitem.html | `.val-with-currency input.sd-input` | `border:0 !important; box-shadow:none !important; border-radius:0 !important` | Ghi đè component sd-input - Loại 1 + 4, không nên có |
| sua-position.html, tao-position.html | `.orgunit-picker` và toàn bộ `.org-tree-modal` | `#bdbdbd`, `#1976d2`, `#e3f2fd`, `#90caf9`, `#9e9e9e`, `#424242`, `#e0e0e0`, `#b0bec5`, linear-gradient | Bảng màu Material - phải đổi hết về token OMEU; đồng thời nên là `sd-select` tree picker thay vì custom |
| sua-position.html, tao-position.html | `.holder-search`, `.holder-date` | `border:1px solid var(--border-secondary,#d1d5db)` (fallback lệch, xem Loại 3) | `--border-primary` |
| uy-quyen-noi-bo.html | `.table-filter-control`, `.pg-page-size` | `font:inherit`, `height:32px` trực tiếp | Nên dùng `sd-input size="sm"` / `sd-select size="sm"` |

