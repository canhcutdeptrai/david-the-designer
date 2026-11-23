# BUTTON-CLEANUP-02 - Dọn nút custom theo rule 0b - đợt 2: tao-workitem.html và sua-workitem.html

Làm xong hẳn cả hai file theo thứ tự bản giao việc. Đã đọc `BUTTON-CLEANUP-01.md` trước khi bắt đầu và áp dụng nguyên hai bẫy ở đó: giữ class trên thẻ `sd-button` ngoài cho `closest`/`querySelector`, và soát toàn bộ phép gán `.disabled`. Cả hai file vẫn báo `CRLF line terminators` khi chạy `file`.

## 1. Bảng: class | số thẻ đã đổi | đổi thành gì | có giữ class cho JS không

### tao-workitem.html - 30 thẻ đổi sang `sd-button`, 1 thẻ đổi class

| Class cũ | Số thẻ | Đổi thành | Giữ class cho JS |
|---|---|---|---|
| `.add-action-btn` | 7 | `sd-button type="light" color="primary" size="sm"`; 4 nút có sẵn icon add thì thêm `prefixIcon="add"` ("Thêm hoạt động" x2, "Thêm" x2), 3 nút text-only ("Hủy", "Lưu cấu hình", "Áp dụng") không thêm prefixIcon vì icon add sai ngữ nghĩa | Không |
| `.cond-remove` | 5 | `sd-button type="link" color="secondary" size="sm" prefixIcon="close" title=""` | Không |
| `.link-remove` | 2 | `sd-button type="link" color="secondary" size="sm" prefixIcon="delete_outline" title=""` | Không |
| `.attach-file-remove` | 3 | `sd-button type="link" color="secondary" size="sm" prefixIcon="close" title=""` | Không |
| `.assignment-remove-btn` | 1 | nt, `prefixIcon="close"` | Không |
| `.cond-group-remove` | 1 | nt, `prefixIcon="close"` | Không |
| `.tier-clone-btn` | 3 | `sd-button type="light" color="secondary" size="sm" prefixIcon="content_copy" title="Nhân bản luồng xuống dưới"` | Có - JS dòng 2638 (`sec.querySelector('.tier-clone-btn')` để set aria-label) |
| `.activity-config-btn` | 2 | `sd-button type="light" color="primary" size="md" prefixIcon="groups"/"low_priority" title=""` | Không |
| `.activity-config-close` | 1 | `sd-button type="link" color="secondary" size="sm" prefixIcon="close" title=""` | Không |
| Nhóm D - 5 thẻ không class | 5 | xem mục 2 | Không |

`.mock-combo-option` (nhóm B): giữ thẻ `<button>`, đổi class thành `class="mock-combo-option sd-dropdown-item"`. Giữ class cũ vì JS dòng 1715 `combo.querySelectorAll('.mock-combo-option')` dùng để lọc option theo từ khoá. Tổng `sd-button` trong file sau khi sửa là 37 (30 mới + 7 có sẵn).

### sua-workitem.html - 36 thẻ đổi sang `sd-button`, 1 thẻ đổi class

| Class cũ | Số thẻ | Đổi thành | Giữ class cho JS |
|---|---|---|---|
| `.add-action-btn` | 6 | `sd-button type="light" color="primary" size="sm"`, 4 thẻ có icon add (`prefixIcon="add"`), 2 thẻ text-only ("Hủy", "Lưu cấu hình") | Có - JS dòng 2701 `closest('.add-action-btn, ...')` |
| `.cond-remove` | 4 | `sd-button type="link" color="secondary" size="sm" prefixIcon="close" title=""` | Không |
| `.link-remove` | 3 | nt, `prefixIcon="delete_outline"` | Có - JS dòng 2701 `closest('.link-remove')` |
| `.attach-file-remove` | 3 | nt, `prefixIcon="close"` | Có - JS dòng 1577 `item.querySelector('.attach-file-remove')` dùng `insertBefore(validity, removeBtn)` |
| `.assignment-remove-btn` | 1 | nt, `prefixIcon="close"` | Có - JS dòng 2701 `closest('.assignment-remove-btn')` |
| `.cond-group-remove` | 1 | nt, `prefixIcon="close"` | Không |
| `.tier-clone-btn` | 3 | `type="light" color="secondary" size="sm" prefixIcon="content_copy" title="Nhân bản luồng xuống dưới"` | Có - JS dòng 2764 `querySelector('.tier-clone-btn')` |
| `.activity-config-btn` | 2 | `type="light" color="primary" size="md" prefixIcon="groups"/"low_priority" title=""` | Có - JS dòng 2701 `closest('.activity-config-btn')` |
| `.activity-config-close` | 1 | `type="link" color="secondary" size="sm" prefixIcon="close" title=""` | Không |
| `.cond-toggle` | 1 | `type="link" color="secondary" size="sm" prefixIcon="toggle_on" title=""` | Không theo nghĩa selector, nhưng JS `toggleCondDisable` vẫn nhận `this` và tự `classList.toggle('is-disabled')` nên không cần class trên thẻ |
| `.version-action` | 3 | `type="light" color="primary" size="sm" prefixIcon="visibility" title="Xem"`, thêm `class="ml-auto"` (utility DS) để giữ căn phải vốn do `margin-left:auto` của class cũ | Không |
| `.version-save-close` | 1 | `type="link" color="secondary" size="sm" prefixIcon="close" title=""`, giữ `aria-label="Đóng"` có sẵn | Không |
| `.btn` + `.btn-secondary` | 1 | `type="light" color="primary"` (md mặc định), title "Hủy" | Không |
| `.btn` + `.btn-primary` | 1 | `type="fill" color="primary"`, title "Lưu" | Không |
| Nhóm D - 5 thẻ không class | 5 | xem mục 2 | Không |

`.mock-combo-option` (nhóm B): giữ thẻ `<button>`, đổi class thành `class="mock-combo-option sd-dropdown-item"` vì JS dòng 1931 `querySelectorAll('.mock-combo-option')`. Tổng `sd-button` sau khi sửa là 43 (36 mới + 7 có sẵn).

Lý do giữ class ở file 2 nhiều hơn file 1: file 2 có sẵn handler `initEditVersionSensitiveTracking` (dòng 2701) dùng `event.target.closest('.add-action-btn, .assignment-remove-btn, .activity-config-btn, .btn-drag-handle, .tier-condition-delete, .link-remove')` để đánh dấu dữ liệu nhạy cảm. Click thật rơi vào `<button class="c-button">` con bên trong `sd-button`, nên các class đó phải nằm trên thẻ `sd-button` ngoài thì `closest` mới tìm thấy.

## 2. Nhóm D - 5 thẻ không class mỗi file

### tao-workitem.html

1. Thẻ close icon không onclick ở thẻ Rule-01 ("Đang áp dụng cho 12 WorkItem") - là nút bấm thường dáng icon close, chỉ chưa nối hành vi. Đổi sang `sd-button type="link" color="secondary" size="sm" prefixIcon="close" title="" aria-label="Thoát"` (thêm aria-label theo rule 9).
2. Thẻ close icon tương tự ở thẻ Rule-02 ("Đang áp dụng cho 5 WorkItem") - xử lý như trên.
3. Nút "×" xoá tag trong `onTagKeydown` (`this.closest('.tag-item').remove()`, `aria-label="Xóa"`) - đổi sang `sd-button type="link" color="secondary" size="sm" prefixIcon="close" title=""`, ký tự "×" thay bằng icon close, giữ onclick và aria-label.
4. Nút "+ Them dieu kien" trong `cond-group-footer` (JS `condGroupTpl`, onclick `addCondToGroup`) - đổi sang `sd-button type="light" color="primary" size="sm" title="+ Them dieu kien"`, không thêm prefixIcon để giữ nguyên nhãn.
5. Nút "+ Nhom long" cùng footer - đổi sang `sd-button type="light" color="secondary" size="sm" title="+ Nhom long"` (giữ phân cấp màu primary/secondary như bản cũ).

### sua-workitem.html

Năm thẻ giống hệt file 1 tại 5 vị trí: 2 nút close không onclick ở thẻ Rule-01/Rule-02 (dòng cũ 698 và 872), nút "×" xoá tag trong `onTagKeydown` (dòng cũ 1237), và 2 nút "+ Them dieu kien"/"+ Nhom long" trong `condGroupTpl`. Xử lý y hệt file 1.

## 3. Các chỗ JS dùng class bị đổi, và mọi chỗ `.disabled`

- file 1: `.tier-clone-btn` là class duy nhất JS còn truy vấn (dòng 2638), giữ trên 3 thẻ `sd-button` kèm CSS. `.mock-combo-option` JS dùng `querySelectorAll` (dòng 1715), giữ class trên thẻ `<button>`. Các class khác không có codepath JS nào đọc bằng selector, classList, matches hay closest, nên bỏ class và xoá CSS.
- file 2: giữ class trên `sd-button` ở `.tier-clone-btn` (dòng 2764), `.attach-file-remove` (dòng 1577), và bộ `.add-action-btn`, `.assignment-remove-btn`, `.activity-config-btn`, `.link-remove` (dòng 2701). `.mock-combo-option` giữ class trên thẻ `<button>` (dòng 1931). `.cond-toggle` không cần giữ class vì JS chỉ nhận `this` rồi tự toggle class `is-disabled` lên chính nút.
- `.disabled`: không có nút nào bị đổi có phép gán `.disabled = ...`. Cả hai file chỉ có đúng 1 phép gán `.disabled` trên checkbox (file 1 dòng 2096, file 2 dòng 2635), không liên quan, không đụng. Không có chỗ nào cần chuyển sang `toggleAttribute`.

## 4. CSS đã xoá và CSS giữ lại mỗi file

### tao-workitem.html

Xoá 17 rule, đúng 22 dòng, gồm các selector: `.cond-remove` (block 6 dòng), `.cond-remove:hover`, `.attach-file-remove`, `.attach-file-remove:hover`, `.link-remove`, `.link-remove:hover`, `.assignment-remove-btn`, `.assignment-remove-btn:hover`, `.activity-config-btn`, `.activity-config-btn:hover`, `.activity-config-btn .material-icons-outlined`, `.activity-config-close`, `.activity-config-close:hover`, `.add-action-btn`, `.add-action-btn:hover`, `.cond-group-remove`, `.cond-group-remove:hover`.

Giữ lại vì class còn trong file cho JS: `.tier-clone-btn`, `.tier-clone-btn:hover` (2 rule), `.mock-combo-option`, `.mock-combo-option:hover`, `.mock-combo-option[hidden]` (3 rule). Giữ thêm `.tag-item button`, `.tag-item button:hover` (2 rule) vì đây là selector ghép với `.tag-item` theo điều kiện GIỮ của bản giao việc - nhưng hai rule này giờ rò rỉ vào `<button>` thật bên trong `sd-button` của nút xoá tag, xem mục 7.

### sua-workitem.html

Xoá 14 rule, đúng 22 dòng, gồm: `.cond-toggle`, `.cond-toggle:hover`, `.cond-toggle.is-disabled` (3 rule), `.version-action`, `.version-action:hover` (2 rule), `.version-save-close`, `.version-save-close:hover` (2 rule), `.cond-remove`, `.cond-remove:hover` (2 rule), block `.cond-remove` thứ hai kiểu override "Sync condition builder layout" (1 rule, 9 dòng), `.cond-group-remove`, `.cond-group-remove:hover` (2 rule), `.activity-config-close`, `.activity-config-close:hover` (2 rule).

Giữ lại vì class còn trên thẻ `sd-button` cho JS: `.tier-clone-btn` (2 rule), `.mock-combo-option` (3 rule), `.add-action-btn` (2 rule), `.assignment-remove-btn` (2 rule), `.activity-config-btn` (3 rule), `.link-remove` (2 rule), `.attach-file-remove` (2 rule) - tổng 16 rule, 16 dòng. Giữ thêm `.tag-item button`, `.tag-item button:hover` (2 rule) vì selector ghép, cùng hiện tượng rò rỉ như file 1.

Không viết CSS mới ở bất kỳ chỗ nào; `class="ml-auto"` trên 3 nút Xem là utility class có sẵn trong `design-system/core/styles/utilities.css`, không phải CSS mới.

## 5. Số nút mất hiệu ứng hover đỏ

Mất hover đỏ ở 12 nút mỗi file: cond-remove (5 ở file 1, 4 ở file 2), link-remove (2 ở file 1, 3 ở file 2), attach-file-remove (3 mỗi file), assignment-remove-btn (1 mỗi file), cond-group-remove (1 mỗi file). Tổng 24 nút. Nút "×" xoá tag không mất hover đỏ vì `.tag-item button:hover` còn tác dụng lên button bên trong `sd-button` (rò rỉ style, ghi mục 7). Đưa con số 24 vào nợ gửi PD cùng lý do đã chọn `color="secondary"` thay vì `color="error"`.

## 6. Nút không đổi được vì nội dung phức tạp, và xác nhận nhóm C

Không có nút nào trong nhóm A bị để nguyên vì nội dung phức tạp; toàn bộ biểu diễn được bằng `prefixIcon`/`title`. Trường hợp gần nhất là nút "×" của tag: ký tự "×" không phải Material Icon nên chuyển thành `prefixIcon="close"`, đây là chuyển có chủ ý và đã ghi ở mục 2.

Nhóm C xác nhận để nguyên cả HTML lẫn CSS, không đụng thẻ nào: `.dept-chip` (8 thẻ/file), `.dept-add-btn` (2 thẻ/file), `.cond-logic-btn` (2 thẻ/file, trong `.cond-logic-toggle`), `.tier-logic-toggle` (1 thẻ/file), `.btn-drag-handle` (1 thẻ/file), `.activity-sequence-drag` (1 thẻ/file), `.multi-picker-box` (1 thẻ/file). Không dùng `type="outline"` ở bất kỳ chỗ nào, không gặp tình huống buộc phải outline.

## 7. Rủi ro - chỗ hành vi có thể đổi, nên nhìn vào đâu khi kiểm bằng trình duyệt

- Toàn bộ `onclick` đã chuyển nguyên vẹn sang thẻ `sd-button`, nên `this` trong handler giờ là `<sd-button>` ngoài, không phải button thật. Mọi hàm được gọi đều chỉ dùng `closest`/`insertAdjacentHTML`/`querySelector` quanh nút nên vẫn đúng; đã kiểm từng hàm. Chỉ có file 2 dòng 2708 `e.target.closest('button')` là lấy button thật bên trong `sd-button`, `textContent` vẫn là "Lưu" nên luồng mở modal lưu vẫn chạy. Nếu sau này có code so `e.target === btn` hay đọc `tagName` thì sẽ đổi hành vi.
- Nút `.cond-toggle` (file 2): JS `toggleCondDisable` gán `btn.title = 'Bật điều kiện'/'Tắt điều kiện'`. Với `sd-button`, gán `title` qua IDL tạo attribute title rồi `attributeChangedCallback` render title thành text nhìn thấy, nên sau lần bấm đầu nút có thể hiện thêm chữ bên cạnh icon (trước là icon-only). Icon vẫn đổi toggle_on/toggle_off được vì `querySelector('.material-icons-outlined')` tìm thấy span trong `sd-button`. Trạng thái màu xanh success khi bật bị mất, về xám secondary.
- CSS cũ còn giữ vì class còn trên `sd-button` cho JS (nhất là file 2): `.add-action-btn`, `.link-remove`, `.attach-file-remove`, `.assignment-remove-btn`, `.activity-config-btn`, `.tier-clone-btn` áp lên outer `<sd-button>` nên có thể lẫn dáng hai lớp (viền/hộp ngoài cũ + button DS bên trong), đặc biệt nút xoá dòng assignment giữ `width:24px; margin-top:22px` cũ. Chỗ cần nhìn: hàng assignment rule, hàng cây luồng, dòng file đính kèm/URL.
- `.tag-item button` CSS rò rỉ vào button bên trong `sd-button` của nút xoá tag: icon sẽ có màu primary-400 cỡ 13px thay vì xám secondary chuẩn của DS (hover đỏ vẫn còn). Vì quy tắc cấm CSS mới và điều kiện GIỮ selector ghép, để nguyên và ghi lại để PD quyết có dọn hai rule này ở đợt sau.
- Nút Xem phiên bản (file 2): bỏ class `.version-action` nên mất `align-self:center`, nút căn theo đầu hàng thay vì giữa hàng; đã thêm `ml-auto` để giữ căn phải. Nếu lệch nốt thì nhìn vào khối "Lịch sử phiên bản".
- Kích thước: loạt nút icon về đúng sm 28px / md 32px của DS (trước có nút 24px nền trong suốt, nút 32px viền); nút "+ Them dieu kien"/"+ Nhom long" về md? Không, về sm 28px thay vì cao ~26px như cũ. Đây là hệ quả đúng của việc để DS dựng dáng.
- Nút `version-save-close` giữ `aria-label="Đóng"` có sẵn và nút "Hủy" ở hai modal (file 1 activity config, file 2 activity config và version save) vẫn mang nhãn "Hủy" vi phạm rule 16 - nằm ngoài phạm vi, ghi lại để Builder xử lý đợt sau.
- Lưu ý diff: cả hai file đang có sẵn thay đổi chưa commit của phiên khác (dọn fallback hex trong CSS, vài dòng JS) không thuộc đợt này; tôi chỉ sửa đúng hai file trong phạm vi và tạo file báo cáo này, không đụng file khác, không commit.

## 8. Vòng sửa đợt 2 - bốn lỗi kiểm trên trình duyệt thật

### Lỗi 1 - hai file lệch nhau, CSS dáng còn đè lên sd-button

Nguyên tắc áp dụng cho cả hai file: `sd-button` sở hữu toàn bộ dáng; CSS của trang chỉ được giữ thuộc tính bố cục mà `sd-button` không tự biết (align-self, margin / margin-top / margin-right / margin-bottom / margin-left, flex-shrink, flex-grow, grid-column, grid-row, position + top/right/bottom/left, order, z-index). Xoá hết nhóm thuộc tính dáng (border, border-*, background, color, padding, border-radius, font-size, font-family, font-weight, width, height, min-width, min-height, display, align-items, justify-content, gap, cursor, white-space, box-shadow, outline) và xoá mọi rule `:hover` của các class đang nằm trên sd-button.

Kết quả sau sửa:

- `.add-action-btn`: cả hai file đều giữ class trên thẻ `sd-button` (file 1: 7 thẻ, file 2: 6 thẻ) và rule CSS rút gọn giống hệt nhau đúng một dòng `.add-action-btn { align-self: flex-start; }`, xoá `:hover`. File 1 trước đây bỏ hẳn class nên nút giãn cả hàng (736px); nay đã giữ lại class và rule bố cục này.
- `.tier-clone-btn`: cả hai file xoá hẳn rule + `:hover`, class giữ trên 3 thẻ vì JS dùng làm điểm neo (`querySelector('.tier-clone-btn')`). Hết hiện tượng hộp 28x28 viền đôi.
- File 2: `.attach-file-remove`, `.link-remove`, `.activity-config-btn` xoá hẳn CSS (class giữ trên thẻ cho JS dòng 2701 và 1577); `.assignment-remove-btn` rút còn đúng một dòng bố cục `.assignment-remove-btn { margin-top: 22px; }` và xoá `:hover`.
- `.mock-combo-option` (nhóm B, nằm trên thẻ `<button>` chứ không phải sd-button): CSS giữ nguyên và giống hệt hai file.

Về yêu cầu hai file khớp nhau: mọi class dùng chung (`.add-action-btn`, `.tier-clone-btn`) và `.mock-combo-option` có cùng nội dung rule CSS, đã so chính xác chuỗi. Tập class trên sd-button chỉ lệch đúng 4 class điểm neo JS riêng của file 2 (`.attach-file-remove`, `.link-remove`, `.activity-config-btn`, `.assignment-remove-btn`) vì file 2 có `closest` compound dòng 2701 và `insertBefore` dòng 1577 mà file 1 không có; đây là khác biệt có chủ ý, không phải lệch dáng.

### Lỗi 2 - `.cond-toggle` gán title làm hiện chữ thừa

Xoá dòng `btn.title = isNowDisabled ? 'Bật điều kiện' : 'Tắt điều kiện';` trong `toggleCondDisable` (chỉ có ở file 2). Dòng `btn.setAttribute('aria-label', isNowDisabled ? 'Bật lại điều kiện' : 'Tắt điều kiện');` ngay sau đó giữ nguyên nên nút vẫn đổi aria-label theo trạng thái; phần đổi icon `toggle_on`/`toggle_off` giữ nguyên. Đã rà cả hai file: không còn phép gán `.title =` nào lên phần tử đã thành sd-button (`grep 'btn.title ='` ra 0); hai chỗ `setAttribute('title', ...)` còn lại trong `cloneConditionSet` đặt lên thẻ `sd-section`, không phải nút, nên không đổi.

### Lỗi 3 - `.tag-item button` rò dáng vào button con của sd-button

Đổi selector ở cả hai file: `.tag-item button` thành `.tag-item > button`, và `.tag-item button:hover` thành `.tag-item > button:hover`. Button thật do `sd-button` dựng bên trong không còn bị quy ước dáng của nút "×" đè lên. Đã rà mọi selector dạng `<thứ gì đó> button` còn lại: `.pos-chip button` (cả hai file) và `.tag-chip button` (file 2) đều chỉ chạm các `<button>` thuần không nằm trong sd-button (đã kiểm không có sd-button nào bên trong pos-chip/tag-chip), nên không cần sửa.

### Lỗi 4 - nhãn "Hủy" vi phạm rule 16

- Modal activity config (cả hai file): nút thoát modal đổi nhãn "Hủy" thành "Bỏ qua", type từ `light primary` sang `link primary` theo rule 17.
- Modal version save (file 2): nút "Hủy" thành "Bỏ qua", type từ `light primary` sang `link primary`.
- Rà kỹ còn phát hiện hai chỗ vi phạm rule 16 khác trong file 2 và sửa luôn: nút secondary action "Hủy" của page-header Edit (`data-secondary-actions='[{"title":"Hủy","icon":"close"}]'`) đổi thành "Bỏ qua"; nút close icon-only `version-save-close` có `aria-label="Đóng"` đổi thành `aria-label="Thoát"`. File 1 không có page-header secondary action và không có modal version save.
- Không có nút nào mang nhãn "Hủy" theo nghĩa hành động nghiệp vụ (hủy bản ghi, thu hồi ủy quyền) cần giữ nguyên. Sau sửa, grep "Hủy"/"Huỷ"/"Cancel"/"Đóng" ra 0 ở cả hai file.

### Ba phép tự kiểm bằng đối chiếu văn bản

1. Rule CSS còn lại của mọi class nằm trên sd-button: file 1 chỉ còn đúng một dòng `.add-action-btn { align-self: flex-start; }`; file 2 còn đúng hai dòng `.add-action-btn { align-self: flex-start; }` (giống hệt file 1) và `.assignment-remove-btn { margin-top: 22px; }`. Không rule nào còn thuộc tính dáng; mọi `:hover` của các class này đã xoá.
2. Hai file khớp nhau cho các class dùng chung: `.add-action-btn` CSS giống hệt từng chuỗi, `.tier-clone-btn` không còn CSS ở cả hai, `.mock-combo-option` CSS giống hệt; chỉ khác đúng 4 class điểm neo JS riêng của file 2 đã ghi ở mục Lỗi 1.
3. Không còn chỗ nào gán `.title` lên sd-button; `node --check` tất cả khối script của cả hai file đều pass; `file` xác nhận cả hai file vẫn báo `CRLF line terminators`.

Vòng sửa này chỉ cắt bớt rule CSS có sẵn và điều chỉnh nhãn/JS trong hai file phạm vi; không viết CSS mới, không đụng file khác, không commit.
