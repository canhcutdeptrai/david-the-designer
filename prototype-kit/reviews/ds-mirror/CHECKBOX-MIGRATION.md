# CHECKBOX-MIGRATION - chuyển 114 ô checkbox/radio/switch thuần sang sd-checkbox / sd-radio / sd-switch

Bản giao việc: mục CHECKBOX-MIGRATION của brief check multi-kit. Phạm vi làm theo thứ tự: uy-quyen-noi-bo (38), danh-sach-workitem (19), danh-sach-loai-dieu-kien (12), danh-sach-position (11), quan-ly-orgbase (6), sua-workitem (6), tao-workitem (6), rồi các file còn lại trong `prototypes/cam-nang-phan-quyen/` có `<input type="checkbox">` hoặc `type="radio"`. Tổng cộng 114 ô ở 13 file, đổi hết, không còn thẻ thô nào trong phạm vi.

## 1. Bảng theo file

| Thứ tự | File | Checkbox | Radio | Switch | Còn sót |
|---|---|---|---|---|---|
| 1 | `uy-quyen-noi-bo.html` | 38 | 0 | 0 | 0 |
| 2 | `danh-sach-workitem.html` | 19 | 0 | 0 | 0 |
| 3 | `danh-sach-loai-dieu-kien.html` | 12 | 0 | 0 | 0 |
| 4 | `danh-sach-position.html` | 11 | 0 | 0 | 0 |
| 5 | `quan-ly-orgbase.html` | 3 | 0 | 3 | 0 |
| 6 | `sua-workitem.html` | 4 | 2 | 0 | 0 |
| 7 | `tao-workitem.html` | 4 | 2 | 0 | 0 |
| 8a | `danh-sach-luong.html` | 3 | 0 | 0 | 0 |
| 8b | `sua-luong.html` | 2 | 0 | 0 | 0 |
| 8c | `tao-luong.html` | 2 | 0 | 0 | 0 |
| 8d | `sua-position.html` | 0 | 3 | 0 | 0 |
| 8e | `tao-position.html` | 0 | 3 | 0 | 0 |
| 8f | `sua-orgbase.html` | 0 | 0 | 3 | 0 |

Tổng cộng: 98 checkbox + 10 radio + 6 switch = 114 ô đã đổi. Tất cả các file trong phạm vi sau khi rà lại đều còn 0 thẻ `<input type="checkbox">` và `<input type="radio">`.

## 2. Năm bẫy

### Bẫy 1 - gán property không có tác dụng

Đã gặp và đổi sang `toggleAttribute`:

- `danh-sach-workitem.html`: `master.indeterminate = checked.length > 0 && ...` đổi thành `master.toggleAttribute('indeterminate', checked.length > 0 && checked.length < all.length)`.
- `danh-sach-workitem.html`: hai selector `.row-check-r:not(:disabled)` đổi thành `.row-check-r:not([disabled])` vì custom element không bao giờ match `:disabled`.
- `uy-quyen-noi-bo.html`: `input.disabled` trong `toggleScopeRowConditions` đổi thành `input.hasAttribute('disabled')` (sd-checkbox không có property `disabled`).
- `uy-quyen-noi-bo.html`: `checkbox.disabled = disabled` đổi thành `checkbox.toggleAttribute('disabled', disabled)`.
- `sua-workitem.html` và `tao-workitem.html`: `checkbox.disabled = true` trong `initEditSelfDelegationInheritance` / `initSelfDelegationInheritance` đổi thành `checkbox.toggleAttribute('disabled', true)`.

Cố ý giữ `.checked` (không đổi sang toggleAttribute, theo ngoại lệ của brief):

- `danh-sach-workitem.html`: `master.checked = ...`, `c.checked = src.checked` trong `toggleAllRight`, bộ lọc `checked = all.filter(c => c.checked)`.
- `uy-quyen-noi-bo.html`: `checkbox.checked = input.checked`, `checkbox.checked = false` trong các hàm scope picker, `option.checked = false` trên radio tiện nhóm.
- `sua-workitem.html` / `tao-workitem.html`: `checkbox.checked = true`, các phép so `item.checked`, `input.checked` trong multi-picker.

### Bẫy 2 - querySelector tìm thẻ input thuần

Đổi selector sang `sd-checkbox` / `sd-radio` ở chỗ cần thẻ ngoài:

- `danh-sach-workitem.html`: `.row-check-r:not(:disabled)` thành `.row-check-r:not([disabled])`; `.row-check-r:checked` bỏ hẳn pseudo-class, thay bằng `Array.from(...).filter(c => c.checked)`; `checkbox.dataset.id` giờ lấy trên thẻ sd-checkbox.
- `uy-quyen-noi-bo.html`: `.scope-condition-option input[type="checkbox"]` thành `.scope-condition-option`; `.scope-picker-row > input[type="checkbox"]:not(:disabled)` thành `.scope-picker-row > sd-checkbox:not([disabled])`; `.scope-condition-option:not(.scope-condition-select-all) input[type="checkbox"]:not(:disabled)` thành `.scope-condition-option:not(.scope-condition-select-all):not([disabled])`; `.scope-picker-row > input[type="checkbox"]` thành `.scope-picker-row > sd-checkbox`.

Cố ý giữ selector bấm vào input thật bên trong (vẫn chạy vì sd-checkbox / sd-radio render sẵn `name`, `value`, `checked` vào thẻ input thật):

- `sua-workitem.html` / `tao-workitem.html`: `.multi-option input`, `.multi-option input:checked`, `.dept-dropdown-flat input`, `.dept-dropdown-flat input:checked` đọc `value` và `checked` của input thật nên đúng; riêng `syncMultiPicker(this)` với `this` là sd-checkbox thì `input.value` đổi thành `input.getAttribute('value')` vì sd-checkbox cố ý không có property `value`.
- `tao-workitem.html`: `input[name="workitem-kind"]` và `:checked` vẫn trỏ vào input radio thật bên trong sd-radio.
- `sua-workitem.html`: `input[name="edit-version-save-mode"]:checked` vẫn trỏ vào input thật bên trong sd-radio.

### Bẫy 3 - selector CSS có dấu cách với vào input thật

Không còn rule nào dạng `<chỗ cũ> input` nhắm vào các ô vừa đổi. Các rule đã xử lý:

- `.table-multi-filter-menu input` xoá hẳn ở 6 file (danh-sach-workitem, danh-sach-loai-dieu-kien, danh-sach-position, danh-sach-luong, quan-ly-orgbase, uy-quyen-noi-bo). Rule này nếu giữ sẽ đè lên input thật bên trong sd-checkbox và bóp hit area 24px xuống 14px.
- `.self-delegation-box input` đổi thành `.self-delegation-box > sd-checkbox` (sua-workitem, tao-workitem).
- `.activity-dept-scope-control input` xoá hẳn (sua-workitem, tao-workitem).
- `.version-save-option input` đổi thành `.version-save-option > sd-radio` (sua-workitem).
- `.workitem-kind-card input` đổi thành `.workitem-kind-card > sd-radio` (tao-workitem).
- `.activity-action-scope-option input` xoá hẳn (sua-luong, tao-luong).
- `.seat-mark-option input` xoá hẳn (sua-position, tao-position).
- `.toggle-switch input` xoá hẳn (quan-ly-orgbase, sua-orgbase).

### Bẫy 4 - sự kiện change bắn hai lần

Không chỗ nào nghe cả hai. sd-checkbox / sd-radio giữ nguyên `onchange` (change của input thật bọt lên host nên inline handler chạy đúng một lần) và không thêm listener `sd-change` nào cho các ô này. Riêng sd-switch thì SdSwitch không render input thật mà render button `role="switch"`, không có sự kiện change native, chỉ bắn `sd-change`, nên 6 chỗ switch đổi `onchange` thành `onclick="toggleRole(this, ...)"`.

### Bẫy 5 - this trong handler

- `toggleRole(this, bodyId)` ở quan-ly-orgbase / sua-orgbase: `this` là sd-switch, `checkbox.checked` chạy nhờ property `checked` mới.
- `toggleAllScopeRows(this)`, `toggleScopeRowConditions(this)`, `toggleScopeConditionAll(this)` ở uy-quyen-noi-bo: `this` là sd-checkbox, `input.closest('.scope-picker-row')`, `input.checked` chạy đúng; `input.disabled` đã sửa theo bẫy 1.
- `synceMultiPicker(this)` ở sua-workitem / tao-workitem: `this` là sd-checkbox, `input.checked` đúng, `input.value` đã đổi thành `input.getAttribute('value')`.
- `onRowCheckR()` ở danh-sach-workitem không nhận `this` nên không đổi; `toggleAllRight(this)` nhận sd-checkbox `src`, `src.checked` đúng.
- `onHandbookCheckboxChange(event, ...)` ở danh-sach-workitem dùng `evt.currentTarget` là sd-checkbox, `option.checked` đúng.

## 3. CSS

### Rule rút gọn (nguyên văn phần còn lại)

`danh-sach-workitem.html`, `danh-sach-loai-dieu-kien.html`, `danh-sach-position.html`, `danh-sach-luong.html`, `quan-ly-orgbase.html`:

```css
.table-multi-filter-menu sd-checkbox { display:flex; padding:6px 7px; white-space:nowrap; }
```

`uy-quyen-noi-bo.html`:

```css
.table-multi-filter-menu sd-checkbox {
  display: flex;
  padding: var(--space-2);
  white-space: nowrap;
}
```

`sua-workitem.html` / `tao-workitem.html`:

```css
.dept-option { display:flex; padding:6px 8px; }
.multi-option { display:flex; padding:6px 7px; }
.self-delegation-box > sd-checkbox { margin-top:2px; }
.activity-dept-scope-field .sd-label { align-items:start; cursor:pointer; display:grid; gap:6px; grid-template-columns:24px minmax(0,1fr); line-height:1.25; margin:0; white-space:normal; }
.activity-dept-scope-control { align-items:center; display:inline-flex; height:24px; justify-content:center; margin-top:1px; }
```

`sua-workitem.html` thêm:

```css
.version-save-option > sd-radio { margin-top:2px; }
.version-save-option { display:grid; grid-template-columns:24px 1fr; gap:10px; padding:12px; border:1px solid var(--border-secondary); border-radius:8px; cursor:pointer; background:var(--surface-primary); }
```

`tao-workitem.html` thêm:

```css
.workitem-kind-card > sd-radio {
  display:none;
}
```

### Rule xoá hẳn

- 6 file có menu lọc: xoá `.table-multi-filter-menu label:hover` và `.table-multi-filter-menu input`, tổng cộng 2 dòng mỗi file.
- `uy-quyen-noi-bo.html`: xoá `.table-multi-filter-menu label:hover` (2 dòng nội dung), `.scope-condition-option` (8 dòng), `.scope-condition-option.scope-condition-select-all` (5 dòng).
- `sua-workitem.html` / `tao-workitem.html`: xoá `.dept-option:hover`, `.multi-option:hover`, `.activity-dept-scope-control input`, mỗi rule 1 dòng.
- `sua-luong.html` / `tao-luong.html`: xoá `.activity-action-scope-option` và `.activity-action-scope-option input`, mỗi rule 1 dòng.
- `sua-position.html` / `tao-position.html`: xoá `.seat-mark-option` và `.seat-mark-option input`, mỗi rule 1 dòng.
- `quan-ly-orgbase.html` / `sua-orgbase.html`: xoá 6 dòng `.toggle-switch`, `.toggle-switch input`, `.toggle-slider`, `.toggle-slider::before`, `.toggle-switch input:checked + .toggle-slider`, `.toggle-switch input:checked + .toggle-slider::before`.

Không viết CSS mới. Các sửa ở `.activity-dept-scope` và `.version-save-option` chỉ đổi giá trị số cột/chiều cao cho vừa hit area 24px của DS, không thêm rule mới.

## 4. Ô nào KHÔNG đổi được và vì sao

Không có ô nào bị bỏ lại; toàn bộ 114 ô đều chuyển được sang sd-*. Trường hợp gần nhất với việc không đổi được là nhóm radio card `workitem-kind-card` ở tao-workitem (segmented card ẩn radio bằng `display:none`, sd-radio chưa có dạng card): tôi xử lý bằng cách giữ label bọc ngoài, ẩn thẻ sd-radio bằng `.workitem-kind-card > sd-radio { display:none; }`, giữ `.workitem-kind-card:has(input:checked)` cho highlight vì input thật bên trong vẫn phản ánh trạng thái được chọn. Hành vi này cần kiểm trực quan trên trình duyệt vì phụ thuộc label activation của browser.

## 5. Xác nhận ba file cấm và CRLF

`prototypes/cam-nang-phan-quyen/tra-cuu-cam-nang.html`, `tra-cuu-cam-nang-v2.html` và `styles/tra-cuu-cam-nang.css` không bị đụng: chỉ đọc để tham khảo, không có lệnh ghi nào chạm vào; hai file HTML giữ nguyên 8 thẻ input thô và 1 thẻ sd-checkbox như trạng thái ban đầu. `design-system/` không đụng.

Toàn bộ 13 file HTML đã sửa chạy `file` đều ra "CRLF line terminators" sau khi làm xong. Các file vốn có BOM giữ nguyên BOM (quan-ly-orgbase, danh-sach-luong, sua-luong, tao-luong, sua-orgbase). Không chạy node --check trên file HTML; đã trích các khối `<script>` (loại trừ script có src) sang file tạm và chạy `node --check` cho cả 13 file, tất cả đều OK.

## 6. Chỗ tôi tự quyết mà bản giao việc không nói rõ

- **Đổi `onchange` thành `onclick` cho sd-switch** (6 chỗ ở quan-ly-orgbase và sua-orgbase): brief bảo giữ nguyên `onchange`, nhưng SdSwitch render button `role="switch"` không có sự kiện change native, nên `onchange` chết im; giữ nguyên là hỏng hành vi bật/tắt thân luồng duyệt. Không dùng `onsd-change` vì inline handler chỉ tự nối cho danh sách sự kiện chuẩn của HTML, custom event `sd-change` không được parser nối tự động. Dùng `onclick` thay vì thêm listener JS: listener của SdSwitch nằm trên `.c-switch-wrap` là con của host, click bọt từ button lên wrap chạy toggle trước rồi mới tới attribute `onclick` của host, nên `toggleRole(this, ...)` đọc `checkbox.checked` tại đúng trạng thái mới. Không tạo vòng lặp vì sd-change không có listener nào trong trang.
- **Rule `.table-multi-filter-menu label` được chuyển selector sang `.table-multi-filter-menu sd-checkbox`** và giữ lại `display`, `padding`, `white-space`: danh sách XOÁ của brief có liệt kê `display`, `padding`, `align-items`, `gap`, nhưng xoá hết sẽ làm các mục menu lọc nằm ngang cạnh nhau (host inline-block) thay vì xếp dọc, hỏng bố cục dropdown. Tôi giữ tối thiểu các thuộc tính làm cho hàng mục xếp dọc và có khoảng cách, bỏ phần còn lại.
- **Giữ `display:flex` + `padding` cho `.multi-option` và `.dept-option`** với cùng lý do xếp dọc hàng trong dropdown; các thuộc tính dáng còn lại xoá theo quy trình.
- **Nới ô chứa checkbox của widget custom lên 24px** ở hai chỗ: `.activity-dept-scope-field .sd-label` (grid-template-columns 16px đến 24px, `.activity-dept-scope-control` height 16px đến 24px) và `.version-save-option` (grid-template-columns 18px đến 24px). Lý do: hit area DS checkbox/radio là 24px rộng, giữ 16px/18px sẽ tràn ô. Đây là đổi giá trị trong rule có sẵn, không thêm rule mới.
- **Giữ một số selector JS trỏ vào input thật bên trong** thay vì đổi hết sang thẻ ngoài: các selector `.multi-option input`, `.dept-dropdown-flat input`, `input[name="workitem-kind"]`, `input[name="edit-version-save-mode"]` chỉ đọc `value`/`checked` của input thật, và sd-checkbox/sd-radio render sẵn các attribute đó vào input trong, nên đúng và ít rủi ro hơn việc chuyển sang API thẻ ngoài (thẻ ngoài không có property `value` cố ý). Những chỗ cần thẻ ngoài (dataset, closest, disabled) thì đã đổi lên thẻ ngoài.

## 7. Rủi ro

- **Cỡ chữ nhãn tăng**: nhãn của sd-checkbox/sd-radio/ở menu lọc, multi-option, dept-option, scope-condition-option là 14px cố định của DS, trong khi nhãn cũ nhiều chỗ chỉ 12-13px. Hàng menu/dropdown có thể rộng hoặc cao hơn vài pixel.
- **Kích thước ô toggles tăng**: sd-switch là 52x32 trong khi toggle cũ 36x20 ở quan-ly-orgbase và sua-orgbase, header của role-section sẽ cao hơn hẳn.
- **Mất hover cả hàng**: các rule `:hover` nền nhạt của menu/label cũ đã bị xoá theo bước 2; sd-checkbox chỉ có hover riêng trên ô tích, không highlight cả hàng. Đây là thay đổi thị giác có chủ đích theo quy trình brief nhưng cần nghiệm thu xem có chấp nhận được không.
- **`workitem-kind-card` phụ thuộc label activation và `:has()`**: sd-radio ẩn bằng display:none, click vào text card sẽ forward qua label bọc ngoài để toggle input thật; highlight dựa trên `.workitem-kind-card:has(input:checked)`. Nếu trình duyệt hoặc bản nâng cấp sd-radio đổi cấu trúc DOM thì chỗ này dễ vỡ, cần kiểm trực quan.
- **self-delegation-box và version-save-option**: ô checkbox/radio DS to hơn native cũ nên box văn bản dịch xuống chút; version-save khi bị khoá còn hứng chồng mờ hai lớp (wrapper `.is-disabled` opacity .72 và sd-radio disabled opacity .4).
- **JS ghi checked/native trên input thật giữ host attribute cũ**: các luồng multi-picker và workitem-kind vẫn set `input.checked` trên input thật bên trong thay vì qua property host; visual và `:checked` đúng ngay, nhưng attribute `checked` trên thẻ sd-* chưa đồng bộ cho tới lần người dùng click kế tiếp. Hiện không có chỗ nào re-render từ attribute trong các luồng này nên chưa gây lỗi, nhưng nếu sau này thêm code re-render từ attribute sẽ cần xem lại.
- **Sự kiện sd-change là sự kiện mới với sd-switch**: mọi code tương lai muốn nghe switch phải dùng `addEventListener('sd-change', ...)`, không được dùng inline `onsd-change` hay `onchange`.
