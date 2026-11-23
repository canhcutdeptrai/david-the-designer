# INPUT-MIGRATION-01 - chuyển input/textarea thô sang sd-input / sd-date / sd-textarea / sd-input-number

Bản giao việc: brief input-migration đợt 1 cho chín file trong `prototypes/cam-nang-phan-quyen/`. Nền: SD-MODEL-PROPERTY đã thêm property `model` và bí danh `value` cho bảy component (SdInput, SdSelect, SdTextarea, SdDate, SdCheckbox, SdRadio, SdSwitch); CHECKBOX-MIGRATION đã chuyển xong 114 ô tích chọn. Phiên này chỉ đổi các ô nhập dạng chữ, ngày, số, textarea.

## 1. Bảng theo file

| File | sd-input | sd-date | sd-textarea | sd-input-number | Còn sót |
|---|---|---|---|---|---|
| `uy-quyen-noi-bo.html` | 11 (6 search + 2 text + 3 url) | 0 | 0 | 0 | 0 |
| `sua-position.html` | 3 (2 disabled + 1 list) | 6 (3 disabled + 3 active) | 0 | 0 | 0 |
| `danh-sach-workitem.html` | 3 (tree-search + 2 th-input) | 1 (th-input date) | 0 | 1 (import-template-capacity) | 0 |
| `quan-ly-cam-nang.html` | 2 (hb-code, hb-name) | 0 | 1 (hb-desc) | 0 | 0 |
| `quan-ly-orgbase.html` | 2 (mã, tên nguyên tắc) | 0 | 1 (mô tả) | 0 | 0 |
| `tao-position.html` | 1 (holder-search) | 2 (holder-date) | 0 | 0 | 0 |
| `sua-cam-nang.html` | 0 | 0 | 1 (hb-desc) | 0 | 0 |
| `tao-cam-nang.html` | 0 | 0 | 1 (hb-desc) | 0 | 0 |
| `sua-orgbase.html` | 0 | 0 | 1 (ghi chú thay đổi) | 0 | 0 |

Tổng cộng: 22 sd-input + 9 sd-date + 5 sd-textarea + 1 sd-input-number = 37 ô đã đổi. Sót trong phạm vi: 0. Hai thẻ thô còn lại là `input type="hidden"` (clone-target-parent) và `input type="file"` (workitem-import-file) ở danh-sach-workitem, cố ý giữ theo lệnh "để nguyên" của brief.

## 2. Sáu bẫy

Bẫy 1 - `.value` cố ý không đụng: 11 chỗ. `quan-ly-cam-nang.html`: 10 chỗ trên hb-code/hb-name/hb-desc (524, 526, 527, 537, 539, 540 gán; 549, 550, 557, 567 đọc). `danh-sach-workitem.html`: 1 chỗ `filterTree(this.value)` (oninput inline, `this` là sd-input, alias value chạy đúng). MỘT ngoại lệ phải sửa: `downloadImportTemplate()` đọc `import-template-capacity.value` đổi thành `.getAttribute('value')` vì sd-input-number KHÔNG nằm trong bảy component được thêm alias (xem mục 6.2) - để nguyên `.value` sẽ luôn trả undefined.

Bẫy 2 - gán property khác: `quan-ly-cam-nang.html` hai chỗ `.readOnly = false/true` trên hb-code đổi thành `toggleAttribute('disabled', false/true)`, và xoá hai dòng `.style.background` (DS disabled tự xử lý nền xám). Lý do: mirror sd-input không có attribute/hành vi `readonly`, disabled là trạng thái gần nhất với intent read-only cũ (không sửa được + nền nhạt). Các chỗ khác như `el.disabled = true` trong `applyHandbookViewMode()` của sua-cam-nang nằm ngoài phạm vi (nhắm tag-input thô còn lại, không nhắm ô đã đổi nên không sửa).

Bẫy 3 - `.focus()` / `.select()`: rà hết chín file, 0 chỗ gọi focus/select/blur/setSelectionRange lên các ô trong phạm vi. Không có gì để sửa.

Bẫy 4 - selector CSS dấu cách với vào input thật: đúng một chỗ đã trả giá: `danh-sach-workitem.html` có rule `.sd-input { padding:8px 12px; ... }` và `.sd-input:focus` - selector trùng tên class input thật mà SdInput/SdTextarea/SdInputNumber/SdDate render bên trong, nên sau migration mọi sd-* trong trang sẽ bị đè dáng. Đổi selector thành `select.sd-input` / `select.sd-input:focus` (còn một `<select class="sd-input">` clone-target-handbook trong trang cần dáng cũ; sd-* không còn dính). `quan-ly-orgbase.html` còn rule `.filter-row .sd-form-field ... .sd-input::placeholder` nhắm vào ô lọc đầu trang (đã là sd-input từ trước, không thuộc nhóm đổi) nên để nguyên.

Bẫy 5 - `this` trong handler inline: một chỗ `oninput="filterTree(this.value)"` ở danh-sach-workitem. `this` là thẻ sd-input, handler chỉ đọc `.value` nên chạy đúng nhờ alias; không xử lý thêm. Không chỗ nào đọc `this.type` / `this.form` / `this.validity`.

Bẫy 6 - sự kiện hai lần: không thêm listener `sd-change` nào. Các ô mới chỉ giữ đúng handler inline cũ (một chỗ oninput duy nhất ở danh-sach-workitem), không có ô nào vừa có inline handler vừa nghe sd-change nên không tạo vòng lặp.

## 3. CSS

Tóm tắt theo quy trình "giữ bố cục, xoá dáng".

Rule rút gọn (nguyên văn phần còn lại):

- `uy-quyen-noi-bo.html`: `table-filter-control` còn `max-width:100%; min-width:0; width:100%;` (5 dòng - xoá background, border, border-radius, color, font, font-size, font-weight, height, padding = 9 dòng).
- `sua-position.html`: `holder-search` còn `width:100%; min-width:260px;` (1 dòng); `holder-date` còn `width:150px;` (1 dòng).
- `danh-sach-workitem.html`: `wi-tree-search-input` còn `flex:1;` (1 dòng); `th-input` còn `width:100%;` (1 dòng).
- `tao-position.html`: `holder-search` còn `width:100%; min-width:240px;` (1 dòng); `holder-date` còn `width:150px;` (1 dòng).

Rule xoá hẳn:

- `uy-quyen-noi-bo.html`: `table-filter-control::placeholder` (3 dòng) và `link-row .sd-label` (7 dòng, label HTML đã gỡ nên không còn phần tử để style).
- `sua-position.html`: `holder-date:disabled, .holder-search:disabled` (1 dòng).
- `danh-sach-workitem.html`: `wi-tree-search-input:focus` (1 dòng), `th-input:focus` (1 dòng), `import-number-input` (1 dòng).

Rule đổi selector, không đổi nội dung:

- `danh-sach-workitem.html`: `.sd-input` thành `select.sd-input`, `.sd-input:focus` thành `select.sd-input:focus` (2 dòng).

Tổng cộng dòng nội dung CSS xoá: uy-quyen-noi-bo 19, sua-position 10, danh-sach-workitem 3, tao-position 0. Năm file còn lại không có rule CSS trang cho các ô đổi (dáng cũ nằm toàn bộ trong inline style của thẻ, đã gỡ khỏi thẻ mới). Không viết rule CSS mới.

## 4. Thẻ nào KHÔNG đổi được

- `input type="hidden"` (danh-sach-workitem, clone-target-parent): không phải control nhìn thấy, không có component tương ứng, giữ nguyên theo brief.
- `input type="file"` (danh-sach-workitem, workitem-import-file): cần sd-upload-file và luồng tải tệp riêng, giữ nguyên theo brief.
- Attribute `min` trên sd-date: 4 chỗ bị bỏ (sua-position dòng hiện tại 127, 132, 133 và tao-position dòng 202) vì sd-date không hỗ trợ min/max. Brief bắt gặp thì báo, không làm ngơ.
- Attribute `list` trên sd-input: 2 chỗ bị bỏ (sua-position holder-search và tao-position holder-search) vì SdInput không chuyển list xuống input thật bên trong; datalist còn lại trong HTML nhưng không còn hoạt động.
- Attribute `step` trên sd-input-number: 1 chỗ bỏ (danh-sach-workitem) vì SdInputNumber không có attribute step.
- `type="url"` và `type="search"` trên sd-input: DS không có biến thể, mọi sd-input render `type="text"` nên đánh mất semantic URL/search nhưng đó là giới hạn DS, không tự chế.

## 5. Xác nhận file cấm và CRLF

Bốn nhóm file cấm không bị đụng: `tra-cuu-cam-nang.html`, `styles/tra-cuu-cam-nang.css`, `tra-cuu-cam-nang-v2.html`, `sua-workitem.html` + `tao-workitem.html`, và toàn bộ `design-system/`. Lệnh ghi của phiên này chỉ chạm đúng chín file trong bảng mục 1 (apply_patch hoặc perl mechanical). `git status` có hiển thị M trên một số file cấm nhưng đó là thay đổi của các phiên trước để lại trong worktree, không phải của phiên này.

Cả chín file sau khi xong đều chạy `file` ra "CRLF line terminators". `quan-ly-orgbase.html` và `sua-orgbase.html` giữ nguyên BOM. Một số dòng apply_patch viết thành LF đã được chuẩn hoá lại về CRLF bằng `perl -pi -e 's/\r?\n/\r\n/g'` đúng chín file; không chạm file khác.

## 6. Chỗ tự quyết mà bản giao việc không nói rõ

6.1 - readOnly của hb-code đổi thành disabled thay vì đặt attribute readonly: mirror không có attribute/hành vi readonly, giữ `readonly` chỉ là attribute chết và ô vẫn gõ được. `disabled` chặn sửa và cho nền xám đúng intent cũ (read-only + background neutral-100), setter `.value` vẫn đọc/ghi được trên sd-input disabled.

6.2 - Một chỗ `.value` phải sửa dù brief cấm đụng `.value`: `import-template-capacity.value` đổi thành `.getAttribute('value')`. SD-MODEL-PROPERTY chỉ thêm alias cho bảy component, SdInputNumber không có property value nên `.value` trả undefined vô điều kiện; getAttribute('value') trả raw value do chính component đồng bộ mỗi lần gõ. Đây là ngoại lệ duy nhất, liệt kê riêng để không bị coi là vi phạm bẫy 1.

6.3 - Thêm `size="sm"` vào 12 ô đang trong vùng bảng/tree (8 ô lọc uy-quyen-noi-bo, tree-search + 2 th-input + 1 th-date danh-sach-workitem): chiều cao cũ của các ô này 30-32px, sd-input md là 36px sẽ làm hàng bảng cao hơn; sm là 28px gần mật độ cũ nhất có trong DS.

6.4 - Thêm `required` vào hb-code, hb-name, mã nguyên tắc, tên nguyên tắc: label cũ có dấu sao đỏ HTML mà attribute label không giữ được, required là cách duy nhất để DS vẽ asterisk cho các field bắt buộc như cũ.

6.5 - Nội dung text ban đầu của textarea chuyển thành attribute `value`: SdTextarea chỉ đọc value từ attribute, text nằm giữa thẻ bị `_render()` đè mất (quan-ly-orgbase mô tả, sua-cam-nang hb-desc).

6.6 - Scope `.sd-input` thành `select.sd-input` ở danh-sach-workitem thay vì xoá luôn: `<select class="sd-input">` clone-target-handbook còn trong trang cần dáng field cũ, trong khi selector gốc sẽ đè lên input thật bên trong mọi sd-*.

6.7 - Ô ghi chú sua-orgbase không đặt `label`: HTML không có thẻ label, chỉ có strong tiêu đề box ngoài; brief chỉ bảo chuyển chữ của thẻ `<label>`, không có thì không đặt.

6.8 - Bỏ inline styles khỏi thẻ thay vì giữ: mọi `width:100%` và dáng trên input/textarea cũ (quan-ly-cam-nang, sua-cam-nang, tao-cam-nang, sua-orgbase) nằm trong inline style không thể chuyển thành CSS trang (cấm viết CSS mới); sd-* tự lo chiếm chiều ngang container và toàn bộ dáng.

## 7. Rủi ro

- SdInputNumber không có property `.value`: code tương lai đọc `.value` trên sd-input-number sẽ nhận undefined; chỗ duy nhất hiện tại đã đổi sang getAttribute. min/max là attribute có tên nhưng mirror không enforce (chỉ trigger re-render), step không tồn tại, nên ô số không còn chặn khoảng/nhảy bước như native number cũ.
- Mất gợi ý datalist trên 2 ô tìm người giữ (sua-position, tao-position): sd-input không chuyển list vào input thật, hành vi gợi ý danh sách mất hẳn.
- Mất min ngày trên 4 sd-date: picker cho phép chọn ngày không hợp lệ (trước browser native chặn nhạt).
- Mất mono font trên mã nguyên tắc (quan-ly-orgbase) và mã cẩm nang (quan-ly-cam-nang): brief cấm hardcode font-family, DS không có lớp mono cho giá trị input nên bỏ; mã sẽ hiển thị font thường.
- Mất semantic `type="search"` / `type="url"`: keyboard URL, clearing UI của search browser mất; chỉ là giới hạn component.
- Floating label khác label nằm trên: URL trong link-row, các label modal cẩm nang, Mã/Tên nguyên tắc chuyển sang floating thu nhỏ label vào trong ô, chiều cao hàng giảm nhẹ so với bố cục cũ.
- `.sd-form-field` của DS có `max-width:420px`: các ô bảng rộng (holder-search) bị chặn ở 420px thay vì tràn hết cột như input cũ.
- Hàng bảng filter cao hơn hoặc thấp hơn vài px: uy-quyen-noi-bo filter sm là 28px so với 32px cũ; holder-date md 36px vừa bằng cũ; sd-date/sd-input disabled có kiểu xám riêng của DS khác native.
- Rows/height textarea thay đổi: ghi chú sua-orgbase mất min-height 60px tuỳ chỉnh, sd-textarea mặc định 3 rows; mô tả quan-ly-orgbase dùng rows=2 nên thấp hơn trước.
- Hành vi pre-existing ngoài phạm vi, chỉ ghi nhận không sửa: `sua-orgbase.html` dòng 100 có `<sd-textarea` chứa text giữa thẻ mà không có attribute value - component sẽ render rỗng; thay đổi này có từ trước phiên này.
- Giao diện cần nghiệm thu trực quan toàn bộ chín trang, đặc biệt các hàng bảng (holder table, filter rows), modal quan-ly-cam-nang và drawer quan-ly-orgbase vì chiều cao và kiểu label đổi.
