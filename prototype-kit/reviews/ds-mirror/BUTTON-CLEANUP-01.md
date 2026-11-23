# BUTTON-CLEANUP-01 - Dọn nút custom theo rule 0b - đợt 1: danh-sach-workitem.html

## 1. Bảng: class | số thẻ đã đổi | đổi thành gì | có phải giữ lại class cho JS không

| Class cũ | Số thẻ đã đổi | Đổi thành | Giữ class cũ cho JS |
|---|---|---|---|
| `.workitem-action-btn` | 10 | `sd-button type="link" color="primary" size="sm"`, chỉ icon `more_vert`, `title=""` | Có - giữ `workitem-action-btn` trên thẻ `sd-button` (xem mục 2) |
| `.wi-tree-menu-btn` | 9 | Cùng 9 thẻ với `.workitem-action-btn` ở trên, `sd-button type="link" color="primary" size="sm"`, chỉ icon | Không |
| `.bulk-publish-btn` | 3 | Không thẻ nào kèm class `primary` nên cả 3 là `sd-button type="light" color="primary" size="sm"`, prefixIcon `campaign`/`visibility_off` | Có - giữ `bulk-publish-btn` cho `classList.toggle('show')` và CSS ẩn/hiện (xem mục 2) |
| `.import-footer-btn` | 3 | Nút chính "Xác nhận ghi dữ liệu" `type="fill" color="primary" size="sm"`; nút phụ "Tải kết quả" và "Tải tệp lỗi" `type="light" color="primary" size="sm"` (rule 17, nút thoát trong dialog là nút X đã thành link) | Không |
| `.root-create-btn` | 2 | `sd-button type="fill" color="primary" size="sm"`, prefixIcon `add`, title "Tạo mới" | Không - JS chỉ dùng id |
| `.pg-action-btn` | 2 | `sd-button type="link" color="primary" size="sm"`, prefixIcon `refresh`/`settings` kèm title | Không |
| `.pg-nav-btn` | 2 | `sd-button type="link" color="primary" size="sm"`, chỉ icon `chevron_left`/`chevron_right`, `title=""` | Không |
| `.import-small-btn` | 2 | `sd-button type="light" color="primary" size="sm"` | Không |
| `.import-dialog-close` | 1 | `sd-button type="link" color="primary" size="sm"`, chỉ icon `close`, `title=""` | Không |
| `.import-workitem-btn` + `.header-import-workitem-btn` | 1 | `sd-button type="light" color="primary" size="sm"`, prefixIcon `upload_file`, title "Nhập đầu việc" | Không |
| `.action-menu-btn` | 1 | `sd-button type="link" color="primary" size="sm"`, chỉ icon | Không - thẻ này vẫn giữ `workitem-action-btn` |
| `.action-menu-item` | 7 | Giữ `<button>`, đổi class sang `class="sd-dropdown-item"` | Không |
| `.clone-tree-option` | 1 | Giữ `<button>`, class thành `clone-tree-option sd-dropdown-item` | Có - giữ `clone-tree-option` cho JS chọn đích (xem mục 2) |

Chú thích số thẻ vật lý: 9 thẻ `.wi-tree-menu-btn` chính là 9 trong 10 thẻ `.workitem-action-btn` (8 thẻ HTML tĩnh + 1 chuỗi JS trong `renderTreeNode`), thẻ thứ 10 của `.workitem-action-btn` là nút menu của hàng bảng (có kèm `.action-menu-btn`). Tổng 26 thẻ được đổi sang `sd-button` (20 thẻ HTML tĩnh + 6 chuỗi JS dựng nội dung) và 8 thẻ giữ `<button>` nhưng đổi class sang `sd-dropdown-item`. Hai `sd-button` có sẵn ở footer dialog Clone không thuộc đợt này, để nguyên.

Không dùng `type="outline"` ở bất kỳ chỗ nào, không gặp tình huống buộc phải outline.

## 2. Các chỗ JS dùng class bị đổi

- Dòng 1148: `document.addEventListener('click', ...)` dùng `e.target.closest('.workitem-action-btn')` để quyết định đóng action menu. Click thật giờ rơi vào `<button class="c-button">` con bên trong `sd-button`, nên class phải nằm trên `<sd-button>` (outer) để `closest` tìm thấy; đã giữ class trên cả 10 thẻ. Vì `sd-button` không dùng shadow root, `e.target` vẫn là node thật nên `closest` đi xuyên lên tới `<sd-button class="workitem-action-btn">`.
- Dòng 1032-1033: `onRowCheckR` chạy trên hai id `bulk-publish-btn` và `bulk-unpublish-btn` (nút ở header). Xử lý: giữ class `bulk-publish-btn` trên thẻ để `bulk.classList.toggle('show', ...)` và CSS `.bulk-publish-btn.show` tiếp tục ẩn/hiện; đổi `bulk.disabled = checked.length === 0` thành `bulk.toggleAttribute('disabled', checked.length === 0)`.
- Dòng 1151: `updateRootCreateButton` dùng `getElementById('root-create-btn')` rồi gán `style.display`; thẻ mới giữ nguyên id nên không cần class cũ.
- Dòng 1378: `chooseCloneTargetParent` dùng `document.querySelectorAll('#clone-target-tree .clone-tree-option')` + `option.classList.toggle('selected', ...)`, và CSS `.clone-tree-option.selected` giữ trạng thái chọn. Xử lý: giữ class `clone-tree-option` trên thẻ (kèm thêm `sd-dropdown-item` theo bảng quyết định) để JS và trạng thái selected còn chạy.
- Dòng 1271, 1275-1277, 1308-1310: bốn id `import-preview-btn`, `import-confirm-btn`, `import-result-btn`, `import-error-btn` được gán trạng thái bằng property `.disabled = true/false`. Xử lý: đổi toàn bộ sang `toggleAttribute('disabled', ...)`. Lý do: `sd-button` là custom element, gán JS property `disabled` chỉ tạo expando, không đổi attribute nên `attributeChangedCallback` của component không chạy và nút không re-render; `toggleAttribute` mới đổi attribute thật.
- `class="action-menu-item"` (7 chỗ, dòng 1050-1064) chỉ xuất hiện trên chính các thẻ nút, JS không query theo class này nên đổi trực tiếp sang `sd-dropdown-item` không phá gì; popup vẫn được đóng/mở qua `.action-menu-popup` (giữ nguyên).

## 3. CSS đã xoá và CSS giữ lại

Xoá 20 rule, đúng 20 dòng, gồm các selector: `.wi-tree-menu-btn`; `.pg-action-btn`, `.pg-action-btn:hover`; `.pg-nav-btn`, `.pg-nav-btn:hover:not(:disabled)`, `.pg-nav-btn:disabled`; `.action-menu-item`, `.action-menu-item:hover`; `.root-create-btn`, `.root-create-btn:hover`; `.import-workitem-btn`, `.import-workitem-btn:hover`; `.import-dialog-close`, `.import-dialog-close:hover`; `.import-small-btn`, `.import-small-btn:hover:not(:disabled)`, `.import-small-btn:disabled`; `.import-footer-btn`, `.import-footer-btn.primary`, `.import-footer-btn:disabled`.

Khối rule chung của nút 3 chấm (trước là 3 rule nhóm `.workitem-action-btn, .action-menu-btn, .wi-tree-menu-btn`) được rút còn đúng 3 rule chỉ cho `.workitem-action-btn` (bỏ selector `.action-menu-btn` và `.wi-tree-menu-btn` khỏi từng rule) - tính là sửa, không tính vào 20 rule xoá.

CSS giữ lại và lý do: `.workitem-action-btn`, `.workitem-action-btn .material-icons-outlined`, `.workitem-action-btn:hover` (3 rule) vì class còn nằm trên 10 thẻ sd-button cho JS dòng 1148; `.bulk-publish-btn`, `.bulk-publish-btn.show`, `.bulk-publish-btn:disabled` (3 rule) vì class còn trên 3 thẻ cho JS `toggle('show')` và CSS ẩn/hiện (lưu ý `.bulk-publish-btn:disabled` không còn khớp nút tắt vì custom element không match `:disabled`; dáng disabled giờ do DS của sd-button đảm nhiệm); `.clone-tree-option`, `.clone-tree-option:hover`, `.clone-tree-option.selected` (3 rule) vì class còn cho JS chọn đích và CSS selected; `.import-template-action .import-small-btn` (1 rule) là selector ghép gồm `.import-small-btn` kèm class khác nên theo nguyên tắc brief giữ selector dùng chung - thực chất rule này đã chết vì không còn phần tử nào mang `.import-small-btn`, giữ để báo và để người duyệt quyết xoá ở đợt sau.

## 4. Nút không đổi được vì nội dung phức tạp

Không có nút nào trong nhóm A bị để nguyên vì nội dung phức tạp; toàn bộ nút trong bảng quyết định biểu diễn hết được bằng `prefixIcon`/`title`. Nhóm B (`.action-menu-item` và `.clone-tree-option`) giữ nguyên thẻ `<button>` vì `sd-dropdown-item` là class CSS của DS chứ không phải custom element, không phải vì bất biểu diễn được.

Nhóm C để nguyên theo quyết định của bản giao việc: `.wi-expand-btn` (5 thẻ) thiếu size xs của `sd-button` (sm nhỏ nhất là 28px, nút này 18x18 trong hàng cây), `.import-drop-zone` (1 thẻ) là vùng thả file cần `sd-upload-file` chứ không phải `sd-button`.

## 5. Xác nhận CRLF và nhóm C

File sau khi sửa vẫn báo `CRLF line terminators` khi chạy `file`; mọi thay đổi thực hiện tại chỗ bằng thay thế chuỗi bảo toàn `\r\n`, không ghi lại file bằng LF. Nhóm C (`.wi-expand-btn`, `.import-drop-zone`) giữ nguyên cả HTML lẫn CSS, đã kiểm không có thẻ nào trong nhóm bị đổi. Chỉ sửa đúng file `prototypes/cam-nang-phan-quyen/danh-sach-workitem.html` và tạo file báo cáo này theo mục BÁO CÁO; không đụng file nào khác.

## 6. Rủi ro - chỗ hành vi có thể đổi sau khi sửa

- Nhóm liên quan `closest` / `event.target` như cảnh báo: click thật rơi vào `<button class="c-button">` con bên trong `sd-button`. Mọi chỗ đang dùng đều đã kiểm và vẫn chạy (dòng 1148 nhờ class trên outer, `treeMenu` dùng `evt.currentTarget` là chính sd-button nên `parentNode` vẫn là `.wi-tree-item`, `toggleActionMenu(event, this, ...)` nhận `this` là sd-button và `btn.nextElementSibling` vẫn là popup). Nếu sau này có code so `e.target === btn` hay đọc `e.target.tagName` thì sẽ đổi hành vi, hiện chưa có chỗ nào.
- `disabled`: đã chuyển 7 phép gán bằng property sang `toggleAttribute` để component re-render. Đã soát cả file, không còn chỗ gán `.disabled` nào khác; nếu có luồng demo mới đọc `.disabled` bằng property thì sẽ đọc expando chứ không phải trạng thái thật của nút.
- Căn chỉnh nút 3 chấm trong hàng cây: `.wi-tree-menu-btn` có `margin-top:-4px` và rule này bị xoá vì class không còn (brief yêu cầu xoá CSS class không còn dùng, JS không đụng class này). Nút menu trong cây có thể dịch xuống khoảng 4px so với bản cũ; tôi không viết CSS mới do bị cấm, chỗ cần nhìn khi kiểm bằng trình duyệt là hàng cây bên trái.
- Kích thước và dáng: một loạt nút về chuẩn sm 28px thay vì 32px cũ (Nhập đầu việc, Tạo mới, footer import), `.pg-nav-btn` 28px thay vì 26px và dáng disabled đổi sang nền xám chuẩn DS, pagination action chuyển sang link màu primary thay vì chữ xám có nền hover, menu item hover chuyển từ xanh nhạt sang xám của `sd-dropdown-item`. Đây là hệ quả của việc để DS dựng đúng dáng, không phải vá bằng CSS.
- Nút chỉ icon: mọi nút đều có `title=""` đúng API (bỏ hẳn attribute thì component nhớ title cũ từ attributeChangedCallback nên không được bỏ); nút phân trang dùng `prefixIcon="chevron_left"`/`chevron_right` thay cho ký tự `&#8249;`/`&#8250;` và có thêm `aria-label` mới (thẻ cũ không có) theo rule 9.
- `.clone-tree-option` giờ mang thêm `sd-dropdown-item`, nhưng CSS của trang load sau `sd-tokens.css` với cùng specificity nên `.clone-tree-option` thắng, hình dáng gần như giữ nguyên; không tạo khác biệt trực quan ngoài dự kiến.
- Ghi chú ngoài phạm vi (báo để người duyệt quyết, không tự sửa): hai `sd-button` có sẵn ở footer dialog Clone vẫn dùng `title="Hủy"` cho nút đóng dialog, nhãn "Hủy" vi phạm rule 16 (cancel label chỉ được Bỏ qua / Thoát / Quay lại) nhưng thẻ này không nằm trong bảng quyết định của đợt 1.
