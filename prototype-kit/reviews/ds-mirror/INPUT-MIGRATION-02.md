# INPUT-MIGRATION-02 - chuyển input/textarea thô sang sd-input / sd-date cho tao-workitem và sua-workitem

Bản giao việc: brief input-migration đợt 2, hai file `prototypes/cam-nang-phan-quyen/tao-workitem.html` (làm trước, xong hẳn) rồi `sua-workitem.html`. Nền: SD-MODEL-PROPERTY đã thêm property `model`/`value` cho bảy component form, JS cũ đọc `.value` chạy nguyên, không sửa. Nguồn đối chiếu cách làm: INPUT-MIGRATION-01 (chín file đợt trước).

## 1. Bảng theo file

Số trong brief là "xấp xỉ". Tôi đếm trên đĩa: tao-workitem có 36 thẻ `<input>` (14 date, 13 text, 2 url, 6 không ghi type, 1 file), sua-workitem có 32 thẻ (14 date, 14 text, 3 url, 6 không ghi type, 1 file).

| File | sd-input | sd-date | Còn thẻ thô | Ghi chú |
|---|---|---|---|---|
| `tao-workitem.html` | 4 | 6 | 26 | File làm xong hẳn trước, cách sang file kia |
| `sua-workitem.html` | 5 | 6 | 20 | Áp đúng cách của file 1 |

Chi tiết đã đổi:

- `tao-workitem.html`: 2 ô publish-validity (validity-from, validity-to), 4 ô ngày hiệu lực của tệp đính kèm trong HTML static, 2 ô ngày trong chuỗi `renderAttachFileItem`, 1 ô url static + 1 ô url trong `addLinkRow`, 1 ô ghi chú modal, 1 ô mock-combo, 1 ô multi-search.
- `sua-workitem.html`: 2 ô publish-validity (edit-validity-from, edit-validity-to), 2 ô ngày hiệu lực tệp static, 2 ô ngày trong `enhanceAttachmentValidity`, 2 ô url static + 1 ô url trong `addLinkRowEdit`, 1 ô ghi chú modal, 1 ô mock-combo, 1 ô multi-search.

Thẻ thô còn lại gần như toàn bộ thuộc "hệ điều kiện" (condition builder): dòng row static (từ 3 đến 6 thẻ mỗi file), chuỗi runtime `renderConditionRow*`, `renderTierConditionRow*`, `renderValueInputs*`, `addGenericConditionRow` và các `tag-input-field` đi kèm. Lý do giữ nguyên ở mục 4. Còn `input type="file"` (1 thẻ mỗi file) giữ theo brief.

## 2. Sáu bẫy: chỗ gặp và cách xử lý

Bẫy 1 - `.value` không đụng: đúng như brief, property `value` đã chạy trên sd-input và sd-date. Tính riêng vùng các ô vừa đổi: tao-workitem có 8 điểm đọc/ghi `.value` (mock-combo 3, multi-search 1, formatValNum/fmtMoney 4) và sua-workitem có 13 điểm (mock-combo 3, multi-search 1, formatValNum/fmtMoney 4, `handleEditStatusChange` trên edit-validity 5). Toàn bộ đều cố ý giữ nguyên, không sửa. Tổng số `.value` trong hai file lần lượt 69 và 75, phần lớn nằm trên select và thẻ thô của hệ điều kiện - ngoài phạm vi đợt này nên cũng không đụng.

Bẫy 2 - gán property khác không chạy: không có chỗ gán `disabled`/`placeholder`/`required` bằng property lên ô đã đổi. Hai dòng `input.type = isDate ? 'date' : 'text'` (tao-workitem 1200, sua-workitem 1638) nhắm vào các thẻ input thô của hệ điều kiện, được giữ nguyên thẻ thô nên không cần sửa. Các ô mock-combo/multi-search không bị JS gán property nào ngoài `.value`.

Bẫy 3 - `.focus()`/`.select()`: các cuộc gọi `.focus()` (3 chỗ mỗi file) đều nằm trong chuỗi `tag-input-wrap` của hệ điều kiện, nơi tôi giữ nguyên thẻ input thô nên không có gì để sửa. Ô mock-combo và multi-search đã đổi không có cuộc gọi focus/select trong JS.

Bẫy 4 - selector CSS trông thấy input thật: không có rule dạng `<gì đó> input.sd-input` nào bị đè dáng sau khi đổi, vì các rule `input.sd-input` hiện có (trang tự định nghĩa) vẫn nhắm đúng input thật bên trong `sd-input`/`sd-date` cho vùng `val-with-currency` và `.sd-form-field input.sd-input`. Rule `.attach-file-item input[type="date"]` và `.between-inputs input[type="date"]` đều là rule rỗng từ đợt token, tôi xoá hẳn hai rule rỗng đầu. Không viết rule mới.

Bẫy 5 - `this` trong handler inline: mọi `this` trên thẻ đã đổi chỉ đọc `.value` (`openMockCombo`, `filterMockCombo`, `filterMultiOptions`, `formatValNum`, `fmtMoney`, `updatePreview`), chạy đúng nhờ alias value của component; không chỗ nào đọc `this.type`/`this.form`/`this.validity`.

Bẫy 6 - sự kiện hai lần: các ô đã đổi giữ nguyên đúng handler inline cũ (oninput/onchange/onfocus/onclick) và tôi không thêm listener `sd-change` nào. Component bắn `sd-change` thêm nhưng không code nào nghe, nên không tạo vòng lặp.

## 3. CSS

Không cắt rule nào của `sd-input`/`sd-date` trong DS. Chỉ rút gọn/xoá rule trang:

- `multi-search` mỗi file: rút từ 7 declaration còn 2 (giữ `width:100%`, `margin-bottom:5px`; xoá height, border, border-radius, padding, font-size, font-family). Giữ class trên thẻ `sd-input` để phần bố cục còn lại ăn đúng host.
- `attach-validity input` (sua-workitem): rút từ 3 declaration còn 1 (`box-sizing:border-box`; xoá `height:36px`, `font-size:13px` vì sd-date size="sm" tự lo 28px).
- `link-row .sd-label` (mỗi file): xoá hẳn 1 dòng selector khỏi rule dùng chung (label HTML đã gỡ, không còn phần tử để style).
- Rule rỗng còn sót từ đợt token: `.attach-file-item input[type="date"]` và `.attach-validity input[type="date"]` (tao-workitem) và `.attach-file-item input[type="date"]` (sua-workitem): xoá hẳn.

Tổng dòng CSS xoá/rút: tao-workitem 4 dòng xoá hẳn + 1 dòng rút gọn; sua-workitem 4 dòng xoá hẳn + 2 dòng rút gọn. Không viết rule mới, không thêm inline style mới.

## 4. Thẻ nào KHÔNG đổi được và vì sao

Ngoài hai nhóm brief đã cấm đổi (file input và hidden - hai file này không có hidden), còn một nhóm tôi cố ý không đổi: toàn bộ ô nhập trong hệ điều kiện (condition builder), gồm cả chuỗi runtime lẫn 2 dòng row static.

Lý do: hệ này chưa thể chuyển trong đợt này vì hai ràng buộc của chính brief giao kèm. Thứ nhất, brief cấm đụng `<select>` và JS `.options`/`.selectedIndex` (17 lần `.options`, 10 lần `.selectedIndex`), mà loại field/operator trong hệ này do select quyết định. Thứ hai, các chuỗi builder chủ động tạo lại input `type="date"` hoặc `type="text"` theo loại field (dòng `input.type = isDate ? 'date' : 'text'`), và `onFieldChange`/`renderTierConditionRow` re-render nguyên cả block. Đổi chúng sang `sd-input`/`sd-date` bắt buộc phải viết lại cơ chế chuyển mode date/text và JS điều khiển select đi kèm - đúng thứ brief tách thành đợt riêng. Để nguyên thì hệ chạy đúng như trước, không làm hỏng demo tương tác trong trang.

Đó là lý do số thẻ thô còn lại cao hơn nhiều so với mức "xấp xỉ" brief ước lượng: phần lớn 26/21 thẻ đó nằm trong hệ điều kiện, không phải sót ô nhỏ lẻ. Đánh dấu đây là việc riêng cần làm cùng đợt sd-select.

## 5. Xác nhận nhóm file cấm và CRLF

Bốn nhóm cấm không bị đụng: `tra-cuu-cam-nang.html`, `styles/tra-cuu-cam-nang.css`, `tra-cuu-cam-nang-v2.html`, và toàn bộ `design-system/`. Cả hai file sửa công nhận bằng `file` ra "CRLF line terminators" sau khi chuẩn hoá `perl -pi -e 's/\r?\n/\r\n/g'`. Không chạm thẻ `<select>` (23 tao, 24 sua, không đổi), không đụng file prototype nào khác.

## 6. Chỗ tự quyết mà brief không nói rõ

6.1 - Giữ nguyên toàn bộ hệ điều kiện (mục 4) thay vì chuyển mỗi ô lẻ: chọn chuyển đủ "vùng ngoài điều kiện" (publish-validity, tệp đính kèm, URL, modal ghi chú, mock-combo, multi-search) rồi dừng, để hệ điều kiện thành một khối duy nhất cho đợt sau, tránh nửa raw nửa sd-* trong cùng một cơ chế re-render.

6.2 - Ô date của tệp đính kèm dùng `size="sm"`: height cũ 28px, s-mm của DS là 28px, s-mm là lựa chọn gần mật độ cũ nhất (y như lựa chọn `size="sm"` của 12 ô bảng ở đợt 1).

6.3 - URL trong link-row chuyển chữ label "URL" vào `label="URL"` trên sd-input và gỡ thẻ `<label>` cũ, giữ wrapper `<div class="sd-form-field">` ngoài để bố cục cột không đổi. Đây đúng cách đợt 1 đã làm với link-row của uy-quyen-noi-bo (báo cáo INPUT-MIGRATION-01 mục 6.5/7). Riêng trong wrap dòng cùng `.sd-form-field` của component, label "URL" sẽ hiện dạng nhãn nổi bên trong ô - chấp nhận khác biệt so với label tĩnh phía trên.

6.4 - Không đặt `label` cho hai ô mock-combo và multi-search: các ô này nằm trong dropdown/widget tự dựng, label không có trong HTML cũ, brief chỉ bảo chuyển chữ của thẻ `<label>` có sẵn.

6.5 - Giữ class `sd-input` trong chuỗi mock-combo (`<sd-input class="sd-input" ...>`) để rule `.mock-combo:focus-within .mock-combo-menu` không đổi và JS cũ `.mock-combo input` vẫn trỏ vào input thật bên trong; class không mang dáng riêng sau khi DS render.

## 7. Rủi ro

- Mất picker lịch native của hai ô publish-validity và các ô ngày tệp: sd-date render input text readonly kèm icon, picker hiện tại mới là component mù - đây là giới hạn đã ghi ở đợt 1, hành vi picker mất nhưng chuỗi ngày vẫn hiển thị đúng định dạng dd/MM/yyyy.
- Mock-combo và multi-search đổi chiều cao: multi-search từ 30px (rule trang) xuống 28px (sd-sm), mock-combo vẫn 36px. Khoảng cách dropdown có thể co lại 2px ở ô tìm.
- Rule `.attach-validity input` bỏ height:36px, các ô ngày tệp đổ về 28px theo size="sm", bằng đúng height inline 28px cũ trong HTML nên bố cục hàng tệp giữ nguyên.
- Label nổi URL xuất hiện bên trong ô thay cho label đứng trên, giống đợt 1; chiều cao hàng link-row không đổi vì wrapper ngoài giữ nguyên.
- `sd-date` không có min/max: hai file này không có attribute min/max trên ngày nên không mất thêm.
- Giá trị `value` của sd-date luôn qua getter đọc attribute: khi component vừa dựng xong sau khi code gán `.value` trong `handleEditStatusChange` thì getter trả giá trị mới (setter ghi attribute trước khi re-render), hành vi hiện tại được giữ.
- Trong trang vẫn còn 26 và 21 thẻ input thô (hệ điều kiện + file input). Nếu nghiệm thu bằng grep "không còn input thô" thì sẽ thấy sót lớn; đây là chủ đích, đọc kỹ mục 4 trước khi cho làm đợt tiếp.
