# DS Mirror Report 07 - sd-query-bar

## 1. File đã sửa / tạo

Sửa:
- `design-system/sd-components/sd-components.js` - thêm class `SdQueryBar` + helpers (`QB_OPERATOR_LABELS`, `QB_OPERATOR_SETS`, `QB_DEFAULT_OPERATOR`, `QB_TYPE_ICONS`, storage wrapper) ngay sau `SdDataState`, trước phần Global click handler.
- `design-system/core/styles/sd-tokens.css` - thêm khối `/* --- sd-query-bar styles --- */` ở cuối file, chỉ dùng token có sẵn.
- `design-system/preview/shared-nav.js` - thêm `{ label: 'Query Bar', file: 'components/query-bar.html' }` vào nhóm Data (`sub-data`), không `legacy`.
- `design-system/preview/index.html` - thêm card `sd-query-bar` (icon `filter_alt`) ngay sau card `sd-table`.
- `design-system/components/sd-data.md` - thêm mục `## sd-query-bar` (trước `sd-data-state`): attributes, 7 type field, operator set, filters shape, events, quan hệ với pattern `filter-bar`.
- `design-system/components/sd-components.md` - cập nhật dòng group cho `sd-data.md` và 2 dòng trong bảng "Quick lookup".

Tạo mới:
- `design-system/preview/components/query-bar.html` - trang preview đủ 7 nhóm demo + 3 tab (Preview / BA-PO / Dev) theo đúng khuôn `checkbox.html`.
- `DS-MIRROR-REPORT-07.md` - báo cáo này.

Không chạm bất kỳ file nào khác, không chạm `prototypes/`, không chạm các báo cáo mirror cũ.

## 2. Thuộc tính và type field đã mirror

Đủ 13 input: `fields`, `filters`, `logic`, `search`, `mode`, `density`, `showSearch`, `showLogicToggle`, `showOperatorOnChip`, `showClearAll`, `showSavedFilters`, `savedFiltersKey`; cộng event `(apply)` (= `sd-apply`) và 2-way `[(filters)]` (= `sd-filters-change`). Đúng 7 type: `string`, `number`, `boolean`, `date`, `datetime`, `values`, `lazy-values`; `operators` nhận cả 3 dạng (bỏ trống / `true` / mảng); `lazy-values` gọi đúng chữ ký `option.search(req)` với `req.type === 'SEARCH' | 'VALUE'`.

Không cố ý bỏ thuộc tính nào của Portal. Có 2 thứ Portal mô tả nhưng mirror tự chọn hiện thực và ghi nhận:
- `showSavedFilters` + `savedFiltersKey`: Portal chỉ nói "lưu bộ lọc". Mirror dựng menu "Lưu bộ lọc hiện tại" + danh sách đã lưu (click khôi phục, X xoá), tên tự động "Bộ lọc N", toàn bộ localStorage bọc try/catch kèm fallback bộ nhớ tạm trong tab để preview chạy đúng chế độ riêng tư.
- Nút huỷ/thoát trong popover dùng đúng nhãn "Bỏ qua" (rule 16), nút xác nhận "Áp dụng".

Mirror bổ sung nhưng nằm trong ngữ nghĩa 2-way của góc Angular: `sd-search-change` cho `[(search)]`, `sd-logic-change` cho `[(logic)]`, input `icon` cho phép override icon mặc định của field. Cả 2 event bổ sung đều đã ghi vào tài liệu.

## 3. Cách nhận fields / filters

`SdTable` nhận mảng cột qua **attribute JSON** (`columns='[...]'`, parse bằng `JSON.parse`), không có setter property riêng. Mirror `SdQueryBar` theo đúng khuôn đó cho attribute (`fields` / `filters`), NHƯNG đồng thời cài property JS `.fields` / `.filters` / `.logic` / `.search` (getter + setter) - vì `fields` của query-bar có thể chứa hàm `option.search` (lazy-values) không thể nằm trong JSON attribute được; preview demo 7-type bắt buộc dùng property. Setter không reflect ngược ra attribute để tránh loop; attribute vẫn thắng khi nạp trang. Ghi rõ lựa chọn kép này trong `sd-data.md`.

## 4. Icon tự chọn cho date / datetime / lazy-values

- `date` → `calendar_today` (khớp suffix icon của `sd-date`).
- `datetime` → `schedule` (khớp suffix icon của `sd-datetime`; card preview của sd-datetime cũng dùng `schedule`).
- `lazy-values` → `location_city` (demo Portal của type này là "Thành phố").

`string` = `text_fields`, `number` = `payments`, `boolean` = `toggle_on`, `values` = `apartment` - 4 icon đọc từ giao diện Portal, ghi nguyên trong báo cáo.

## 5. Bộ operator từng type

Đọc trực tiếp từ Portal:
- `string` (khi `operators: true`): CONTAIN, EQUAL, NOT_EQUAL, START, END, NULL, NOT_NULL - Portal ghi nguyên.
- `date` / `datetime`: EQUAL, BEFORE, AFTER, BETWEEN, NULL - Portal ghi nguyên, mặc định BETWEEN.
- `number`: EQUAL, GREATER_OR_EQUAL, LESS_OR_EQUAL, BETWEEN - đọc từ cấu hình field mẫu "Lương" của Portal.
- `values` / `lazy-values`: IN, NOT_IN - đọc từ demo "Phòng ban" và cấu hình "Thành phố (lazy)".

Suy ra (Portal không hiện cả bộ): `boolean` = EQUAL + NULL/NOT_NULL khi bật operators; bộ string thêm NOT_EQUAL/START/END suy từ câu mô tả string của Portal. `GREATER_THAN` / `LESS_THAN` có trong bảng nhãn nhưng không trong số operator mặc định của type nào - chỉ hiện nếu field khai mảng operators có chúng.

## 6. Quyết định mirror và hạn chế

- Popover mở bằng click chip, chỉnh operator + value bản nháp, "Áp dụng" hoặc click ra ngoài = commit (đúng câu Portal "đóng → commit"), Escape = bỏ qua. Nhãn operator trên chip chỉ hiện khi `showOperatorOnChip`; trong popover luôn có dropdown operator.
- Trong inline mode, operator + value render thẳng trên bar, edit live - đúng mô tả GitLab-style của Portal.
- Có thêm dropdown "Thêm bộ lọc" liệt kê field chưa active. Portal mô tả chip row nhưng không chỉ cách thêm filter; không có nút thêm thì demo không thao tác được, nên tự chọn thêm và ghi rõ.
- `density comfortable` = 32px là số Portal ghi thẳng nhưng kit không có token 32px cho input (sm = 28px, md = 36px). CSS bar/chip cao 32px đúng Portal; control bên trong vẫn dùng `size="sm"` (28px) vì không có mức 32px trong `sd-*` - hạn chế của mirror, ghi nhận.
- `sd-date` / `sd-datetime` trong kit render input readonly - popover gỡ readonly ở runtime (cơ chế giống `SdConfirmService`) để nhập thật, phân tích input `dd/MM/yyyy` / `dd/MM/yyyy HH:mm` thành canonical `YYYY/MM/DD` lúc commit.
- Segmented AND/OR dựng bằng HTML thuần thay vì `sd-tab-group` (tab-group là component điều hướng nội dung, không phải control logic) - ghi chú CSS trong file.
- CSS dùng hardcode hợp lệ: 32px comfortable (Portal ghi thẳng), nền trắng `#fff` và shadow rgba theo khuôn modal/menu/table đang có sẵn, `z-index: var(--z-max, 9999)`.

## 7. Ba bẫy vòng đời - xác nhận đã xử lý

1. `attributeChangedCallback` chạy trước `connectedCallback`: mọi thay đổi chỉ nạp state, `_render()` có guard `if (this._rendered)` - đúng tinh thần khuôn `SdTabGroup`/lessons.md. Các hàm đọc DOM do `_render` tạo (`_afterRender`, `_fixDatePlaceholders`, `_resolveLazyChips`, `_positionFloating`, handlers) chỉ chạy sau khi `_rendered = true` hoặc sau connected.
2. Listener chỉ gắn nhánh chạy-một-lần bị mất khi node di chuyển: listener của element gắn trong `_bind()` với guard `_bound` và KHÔNG gỡ ở `disconnectedCallback` (giữ qua các lần disconnect/reconnect); listener document gắn riêng với guard `_docBound`, gỡ/nối lại ở `_unbindDocument()` / connectedCallback - đúng khuôn `_resizeBound`.
3. Listener "click ra ngoài" trên document: `_docClickBound` bắt buộc gỡ trong `disconnectedCallback` (qua `_unbindDocument`), kèm `_docKeyBound` (Escape) và `_docScrollBound` (scroll đóng popover/menu để vị trí fixed không lệch), tất cả đều gỡ - không còn nguy cơ chồng listener mỗi lần trang dựng lại.

