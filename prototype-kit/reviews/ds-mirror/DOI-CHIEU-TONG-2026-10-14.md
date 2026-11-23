# Đối chiếu tổng kit ↔ Core UI Catalog — 2026-10-14

> Builder: *„vòng đối chiếu tổng kit ↔ catalog“*. Chỉ ĐỐI CHIẾU — chưa sửa gì. Công cụ: `reviews/ds-mirror/audit-tong/`
> (`extract.mjs` trích mẫu, `compare.py` so, `map.json` mục catalog ↔ trang preview kit, `result.json` kết quả chi tiết).

## Cách so

- **Catalog:** mọi thẻ `sd-*` / `bpm-*` chính của từng mục (`#c-xxx .stage`), 56 mục có mẫu tĩnh (bỏ 7 mục không có hình:
  base, ckeditor-styles, device, hover-copy, href, scroll, form-template-defs).
- **Kit:** cùng thẻ trên trang `design-system/preview/components/<mục>.html` (tab → `tab-group.html`; confirm / loading / notify →
  `service.html`; kpi-card / filter-scorecard → `work-center.html`).
- **Ghép mẫu** theo chữ hiển thị (trùng hẳn, hoặc ≥ 80% từ). Mẫu kit dùng dữ liệu khác catalog thì **không ghép được** → chưa so.
- **Mỗi cặp so 2 tầng:** (1) cấu trúc — cây thẻ + tập lớp từng nút; (2) computed style 37 thuộc tính / nút (khoảng cách, viền,
  chữ, màu, nền, bóng, flex…) + chiều cao hộp (lệch > 0,6px). Bề ngang chỉ so khi < 400px (khung chứa hai bên khác nhau).
- **Đã lọc nhiễu:** `text-align: start` ≡ `left`; `cursor` (catalog chỉ đặt `pointer` lúc rê chuột); thuộc tính trên chính thẻ host
  (kit buộc phải có `color` / `type`… — HTML không có `[input]`); nội dung demo bên trong tab (`.demo-*` của catalog / `sd-tab` của kit).

## Kết quả theo mục

| Mục | Mẫu catalog | Ghép được | Khớp hẳn | Lệch giá trị CSS | Lệch cấu trúc |
|---|---|---|---|---|---|
| `c-anchor` | 2 | 2 | 2 | 0 | 0 |
| `c-autoid-inspector` | 4 | 0 | 0 | 0 | 0 |
| `c-avatar` | 15 | 15 | 15 | 0 | 0 |
| `c-badge` | 32 | 28 | 28 | 0 | 0 |
| `c-button` | 40 | 40 | 40 | 0 | 0 |
| `c-chart` | 2 | 0 | 0 | 0 | 0 |
| `c-code-editor` | 3 | 3 | 0 | 2 | 1 |
| `c-document-builder` | 1 | 1 | 0 | 0 | 1 |
| `c-editor` | 5 | 5 | 0 | 0 | 5 |
| `c-form-builder` | 1 | 1 | 0 | 0 | 1 |
| `c-form-generic` | 4 | 4 | 0 | 0 | 4 |
| `c-history` | 2 | 2 | 2 | 0 | 0 |
| `c-import-excel` | 16 | 0 | 0 | 0 | 0 |
| `c-inform` | 13 | 13 | 11 | 1 | 1 |
| `c-mini-editor` | 5 | 5 | 0 | 0 | 5 |
| `c-modal` | 23 | 9 | 0 | 0 | 9 |
| `c-modal-resizable` | 14 | 1 | 0 | 0 | 1 |
| `c-operator` | 8 | 8 | 0 | 8 | 0 |
| `c-org-chart` | 3 | 3 | 3 | 0 | 0 |
| `c-preview-image` | 4 | 4 | 4 | 0 | 0 |
| `c-preview-pdf` | 4 | 3 | 0 | 1 | 2 |
| `c-query-bar` | 6 | 6 | 0 | 6 | 0 |
| `c-query-builder` | 7 | 7 | 2 | 1 | 4 |
| `c-quick-action` | 2 | 2 | 0 | 2 | 0 |
| `c-section` | 5 | 5 | 0 | 0 | 5 |
| `c-side-drawer` | 8 | 3 | 0 | 0 | 3 |
| `c-splitter` | 4 | 0 | 0 | 0 | 0 |
| `c-stepper` | 4 | 0 | 0 | 0 | 0 |
| `c-tab` | 5 | 5 | 0 | 3 | 2 |
| `c-tab-router` | — | — | — | — | kit chưa có trang mẫu |
| `c-table` | 3 | 2 | 0 | 0 | 2 |
| `c-tree` | 4 | 4 | 1 | 0 | 3 |
| `c-upload-file` | 5 | 5 | 0 | 0 | 5 |
| `c-view` | 14 | 14 | 0 | 14 | 0 |
| `c-autocomplete` | 7 | 6 | 0 | 2 | 4 |
| `c-checkbox` | 13 | 13 | 0 | 0 | 13 |
| `c-chip` | 6 | 5 | 1 | 1 | 3 |
| `c-chip-calendar` | 3 | 2 | 0 | 0 | 2 |
| `c-date` | 10 | 9 | 0 | 2 | 7 |
| `c-date-range` | 8 | 7 | 0 | 1 | 6 |
| `c-datetime` | 6 | 5 | 0 | 1 | 4 |
| `c-inline-text` | 9 | 8 | 1 | 6 | 1 |
| `c-input` | 15 | 15 | 0 | 10 | 5 |
| `c-input-color` | 7 | 5 | 0 | 5 | 0 |
| `c-input-number` | 13 | 13 | 0 | 7 | 6 |
| `c-label` | 7 | 6 | 0 | 6 | 0 |
| `c-radio` | 8 | 8 | 8 | 0 | 0 |
| `c-select` | 8 | 8 | 0 | 1 | 7 |
| `c-switch` | 13 | 13 | 2 | 0 | 11 |
| `c-textarea` | 7 | 2 | 0 | 2 | 0 |
| `c-tooltip` | 12 | 12 | 9 | 3 | 0 |
| `c-confirm` | 6 | 0 | 0 | 0 | 0 |
| `c-loading` | 2 | 2 | 2 | 0 | 0 |
| `c-notify` | 4 | 4 | 4 | 0 | 0 |
| `c-filter-scorecard` | 7 | 7 | 7 | 0 | 0 |
| `c-kpi-card` | 4 | 4 | 4 | 0 | 0 |

## Đọc kết quả — nhóm theo mức độ

### A. Khớp (cấu trúc + style trùng mọi nút đã so)

`sd-button` (40/40), `sd-badge` (28/28), `sd-avatar` (15/15), `sd-radio` (8/8), `sd-anchor`, `sd-history`, `sd-org-chart`,
`sd-preview-image`, loading, notify, `bpm-filter-scorecard`, `bpm-kpi-card`; `sd-inform` 11/13 (2 mẫu còn lại: nút × chữ 13,33px ở
catalog / 14px ở kit, và một hàng demo); `sd-tooltip` 9/12 (3 mẫu còn lại chỉ khác `display` của nút do khung demo);
`sd-tab-group` (thanh tab trùng từng ký tự — phần "lệch" là chiều cao nội dung demo và lớp stretch đã ghi ở known-gaps).

### B. Lệch giá trị nhỏ — gần như không nhìn thấy

| Mục | Lệch | Ghi chú |
|---|---|---|
| `sd-input` / `-number` / `-color` / `sd-textarea` | thẻ host `position: static → relative` | không đổi hình (không có con absolute neo theo host) |
| `sd-label` | host `display: inline → block`, cao 20 → 22px | **có thể thấy** — lệch 2px chiều cao hàng nhãn |
| `sd-inline-text` | `display: inline-flex → flex`; nền hover `.06 → .04` | thấy nhẹ |
| `sd-chip` | icon xoá `display: flex → block` | căn icon có thể lệch ≤ 1px |
| `sd-operator`, nút trong `sd-query-bar` / `sd-query-builder`, nút × `sd-inform` | chữ nút 13,33px (mặc định trình duyệt) ở catalog → 14px ở kit | đã biết từ 2026-10-13; icon cỡ cố định nên ít thấy |
| `sd-section` | kit thêm lớp `c-section-wrap` | không đổi hình |
| `sd-table` | `<table>` thiếu lớp `cdk-table mat-sort mdc-data-table__table` | cần xem có rule nào của catalog bám các lớp này không |
| `sd-input` trong form-generic | `mat-error` lớp `bottom-align` thay `bare-error`; thêm `hint-wrapper` | lệch vị trí dòng lỗi có thể thấy |
| nút trong `sd-modal` / `sd-side-drawer` / `sd-modal-resizable` | thứ tự lớp khác + thêm `mat-mdc-tooltip-trigger` | không đổi hình |

### C. Lệch cấu trúc thật — nên sửa

| Mục | Catalog | Kit |
|---|---|---|
| **`sd-checkbox`** (13/13 mẫu) | `mat-checkbox.mat-mdc-checkbox` (DOM Material) | `label.c-checkbox-wrap` tự dựng |
| **`sd-switch`** (11/13) | `mat-slide-toggle.mat-mdc-slide-toggle` | `span.c-switch-wrap` tự dựng |
| **`sd-tree`** | ô chọn `mat-checkbox`; nút lệnh `mat-mdc-icon-button`; đang tải `mat-progress-spinner` | `sd-checkbox` lồng; nút thường; icon thay spinner |
| **Popup trong thẻ** — `sd-select`, `sd-autocomplete`, `sd-date`, `sd-date-range`, `sd-datetime`, `sd-chip-calendar` | thẻ chỉ có ô nhập (popup nằm ở overlay khi mở) | còn một khối popup ẩn bên trong thẻ (`.sd-select-panel`, `.sd-date-popup`…) — trùng vấn đề "popup bị khung cắt" ở known-gaps |
| `sd-upload-file` | có thẻ `<preview>` ở cuối | thiếu |
| `sd-chip` chế độ xem (`viewed`) | dựng đủ ô (34 nút) | rút gọn (4 nút) |
| `sd-query-builder` | mũi tên `mat-mdc-select-arrow` ở một số ô; khối mở có lớp `is-open` | dựng khác ở vài ô (2/4 mẫu khớp) |
| `sd-editor` / `sd-mini-editor` / `sd-document-builder` | thanh công cụ CKEditor | kit có thêm panel dropdown dựng sẵn — do CKEditor, mức ưu tiên thấp |
| `sd-preview-pdf` | trang PDF là `div` giữ chỗ (bản chụp tĩnh) | `canvas` vẽ PDF thật — **không phải lỗi** |

### D. Chưa so tự động được

| Mục | Vì sao |
|---|---|
| `sd-modal`, `sd-side-drawer`, `sd-modal-resizable`, confirm | khung mở nằm ở overlay — catalog chụp sẵn, kit chỉ dựng khi bấm; mới so được nút mở |
| `sd-stepper`, `sd-splitter`, `sd-chart`, `sd-import-excel`, `sd-autoid-inspector` | trang preview kit dùng dữ liệu demo khác catalog (stepper theo 22.3.1) → không ghép được mẫu |
| `sd-tab-router` | kit chưa có component / trang mẫu (nằm trong 12 mục catalog chưa dựng) |

## Đề xuất thứ tự sửa

1. `sd-checkbox`, `sd-switch` → DOM Material (dùng ở rất nhiều trang; cách làm như ô chọn số dòng / tab group).
2. Popup → overlay cho date / date-range / datetime / chip-calendar / autocomplete; bỏ khối popup ẩn trong thẻ `sd-select`.
3. `sd-tree` (ô chọn / nút lệnh / spinner), `sd-upload-file` (`<preview>`), `sd-chip viewed`, `sd-query-builder`.
4. Nhóm B có thể thấy: `sd-label` (2px), dòng lỗi form-generic, `sd-table` lớp bảng.
5. Nhóm D: dựng mẫu preview trùng dữ liệu catalog để so được, rồi so.

## Cập nhật sau vòng sửa — 2026-10-14 (Builder: *„Làm phần này trước: 1. Checkbox và switch … 4. Các lệch nhỏ“*)

| | Ghép được | Khớp hẳn | Lệch CSS | Lệch cấu trúc |
|---|---|---|---|---|
| Trước | 354 | 146 | 85 | 123 |
| **Sau** | **360** | **232** | **64** | **64** |

Các mục đổi số (trước → sau, dạng *ghép · khớp · CSS · cấu trúc*):

| Mục | Trước | Sau |
|---|---|---|
| `c-inform` | 13 · 11 · 1 · 1 | 13 · **12** · 0 · 1 |
| `c-operator` | 8 · 0 · 8 · 0 | 8 · **8** · 0 · 0 |
| `c-query-bar` | 6 · 0 · 6 · 0 | 6 · **6** · 0 · 0 |
| `c-query-builder` | 7 · 2 · 1 · 4 | 7 · **3** · 0 · 4 |
| `c-tab` | 5 · 0 · 3 · 2 | 5 · **0** · 5 · 0 |
| `c-tree` | 4 · 1 · 0 · 3 | 4 · **1** · 2 · 1 |
| `c-upload-file` | 5 · 0 · 0 · 5 | 5 · **3** · 0 · 2 |
| `c-autocomplete` | 6 · 0 · 2 · 4 | 7 · **0** · 6 · 1 |
| `c-checkbox` | 13 · 0 · 0 · 13 | 13 · **12** · 1 · 0 |
| `c-chip` | 5 · 1 · 1 · 3 | 6 · **6** · 0 · 0 |
| `c-chip-calendar` | 2 · 0 · 0 · 2 | 3 · **3** · 0 · 0 |
| `c-date` | 9 · 0 · 2 · 7 | 10 · **9** · 0 · 1 |
| `c-date-range` | 7 · 0 · 1 · 6 | 8 · **2** · 5 · 1 |
| `c-datetime` | 5 · 0 · 1 · 4 | 6 · **0** · 5 · 1 |
| `c-input` | 15 · 0 · 10 · 5 | 15 · **12** · 0 · 3 |
| `c-input-number` | 13 · 0 · 7 · 6 | 13 · **11** · 0 · 2 |
| `c-switch` | 13 · 2 · 0 · 11 | 13 · **13** · 0 · 0 |
| `c-textarea` | 2 · 0 · 2 · 0 | 2 · **2** · 0 · 0 |

Phần còn lệch, đã phân loại (chi tiết `_memory/known-gaps.md`):

- **Việc lớn, chờ Builder quyết:** ruột lịch `mat-calendar` (date / date-range / datetime / chip-calendar — hiện lưới `.form-field-datepicker-*` của kit); DOM dòng / ô của `sd-table` theo mat-table.
- **Của trang preview, không phải component:** bề ngang khung demo (316 vs 280), ô lưới / flex của trang (`sd-label`, `sd-inline-text`, `sd-view`), chiều cao nội dung demo trong tab, mẫu "đang focus" catalog có mà preview chưa dựng, lớp demo của catalog (`ui-demo__row`, `uf-i-*`, `demo-hover`).
- **Bản giản lược của trang catalog:** dòng dưới ô ở #c-form-generic / #c-query-builder / #c-form-builder (dựng bằng JS `mat-form-field[data-ff]`); #c-select bỏ `div.mat-mdc-select-arrow` mà 24 mẫu khác có.
- **Kit giữ có lý do:** `sd-open` trên host khi mở select / autocomplete, `.c-section-wrap`, `aria-label` nút icon (Rule 9), `data-*` móc JS.
- **Chưa so được (như trước):** modal / drawer / confirm (overlay), stepper, splitter, chart, import-excel, CKEditor.

Công cụ cập nhật: `extract.mjs` đếm nút bằng `Element.prototype.querySelectorAll` (thẻ có popup ghi đè `querySelectorAll`), nhận `ONLY=c-x,c-y` để trích lại vài mục; `compare.py` bỏ lớp demo `*-cat-touch` / `*-cat-focus` của trang preview kit.

## Cập nhật sau vòng "cả 3 mục" (2026-10-14 — lịch `mat-calendar`, DOM `sd-table`, mũi tên `sd-select`)

Tổng: ghép được **361** mẫu, khớp hẳn **236** (trước 232), lệch style 64, lệch cấu trúc **61** (trước 64).

- **Lịch** (`c-date` / `c-date-range` / `c-datetime` / `c-chip-calendar`): bộ so ô đóng không đổi (popup không thuộc `.stage`); so riêng popup
  catalog ↔ kit (`reviews/ds-mirror/calendar/panecmp.*`, cùng ngày 08/10/2026): số nút 185/185 · 185/185 · 212/212 · 186/186, style trùng
  (chỉ `text-align start/left` và toạ độ touch-target ẩn).
- **`c-table`**: 3 mẫu ghép được (trước 2), vẫn "lệch cấu trúc" vì ô lọc giản lược của catalog, lớp `mat-column-bank` (catalog tự mâu thuẫn
  với mã ví dụ `bankId`), icon ‹ › (Rule 4). So riêng bỏ ô lọc (`reviews/ds-mirror/table/tblcmp.py`): dòng / ô / chân bảng trùng style 100%.
- **`c-select`**: 8 · 4 · 1 · 3 — `div.mat-mdc-select-arrow` nay theo ngữ cảnh như catalog; còn lại là `sd-open` trên host và mẫu focus.
- Hai "việc lớn chờ Builder quyết" ở mục trên đã làm xong.
