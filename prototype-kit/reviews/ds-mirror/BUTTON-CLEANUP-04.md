# BUTTON-CLEANUP-04 - Dọn nút đợt cuối và chuyển modal

Làm đủ PHẦN 1 trên cả bảy file trong phạm vi, tổng 19 thẻ đổi sang `sd-button`. PHẦN 2 (chuyển modal) không thực thi được vì hai file position không còn markup modal nào để chuyển - chi tiết ở mục 3. Không sửa `design-system/`, không commit, không đụng file ngoài danh sách.

## 1. Bảng: file | class | số thẻ đổi | đổi thành gì | có giữ class cho JS không

| File | Class cũ | Số thẻ đổi | Đổi thành | Giữ class cho JS |
|---|---|---|---|---|
| sua-position.html | `.holder-action-btn` | 4 | `sd-button type="light" color="primary" size="sm"`; 3 thẻ icon edit chỉ icon (`prefixIcon="edit" title=""` + `aria-label` giữ chú thích cũ), 1 thẻ "Thêm người giữ" có `prefixIcon="add" title="Thêm người giữ"` và giữ inline `style="margin-top:10px;"`; thẻ record cũ từ class `disabled` chuyển thành attribute `disabled` | Không, JS không query class này |
| tao-position.html | `.holder-action-btn` | 2 | `type="light" color="primary" size="sm"`; 1 thẻ icon `delete_outline` chỉ icon (`title="" aria-label="Xóa dòng"`), 1 thẻ "Thêm người giữ" `prefixIcon="add" title="Thêm người giữ"` giữ inline `margin-top:10px` | Không |
| quan-ly-orgbase.html | `.fc-remove` | 2 | `type="link" color="secondary" size="sm"` chỉ icon `close`, `title="" aria-label="Xóa"` | Không theo nghĩa JS; giữ class `fc-remove` trên thẻ để CSS giữ `margin-left:3px` (bố cục) |
| quan-ly-orgbase.html | `.btn` + `.btn-ghost` + `.btn-sm` | 1 | `type="link" color="primary" size="sm"` chỉ icon `close`, `title="" aria-label="Thoát"`, giữ `onclick="closeDrawer()"`, bỏ inline `padding:4px` và lớp bọc span | Không |
| quan-ly-orgbase.html | `.btn` + `.btn-ghost` + `.btn-md` | 1 | `type="link" color="primary"` title "Hủy", giữ `onclick="closeDrawer()"` | Không |
| quan-ly-orgbase.html | `.btn` + `.btn-primary` + `.btn-md` | 1 | `type="fill" color="primary"` title "Lưu" | Không |
| sua-orgbase.html | `.fc-remove` | 2 | giống quan-ly-orgbase `.fc-remove` | Không theo nghĩa JS; giữ class cho CSS margin-left |
| tao-orgbase.html | `.remove-flow-btn` | 2 (1 thẻ HTML tĩnh + 1 chuỗi trong `addFlow()`) | `type="link" color="secondary" size="sm"` chỉ icon `close`, `title="" aria-label="Xóa hoạt động"`, giữ `onclick="removeFlow(this)"` | Không, JS chỉ dùng `btn.closest('.flow-section')` |
| quan-ly-cam-nang.html | thẻ button không class | 3 | nút đóng `type="link" color="primary"` chỉ icon `close`, `title="" aria-label="Thoát"`; nút Hủy `type="light" color="primary"` title "Hủy"; nút Tạo/Lưu `type="fill" color="primary"` `prefixIcon="save"` `id="handbook-save-label"` title động | Không, nhưng giữ `id="handbook-save-label"` và JS đổi từ `textContent` sang `setAttribute('title')` (xem mục 2) |
| sua-cam-nang.html | thẻ button không class trong JS `onTagKeydown` | 1 | `type="link" color="primary" size="sm"` chỉ icon `close`, `title="" aria-label="Xóa"`, giữ `onclick="removeTag(this)"` | Không |

Không dùng `type="outline"` ở bất kỳ chỗ nào. Các nút icon-only đều có `title=""` theo đúng API (bỏ hẳn attribute không được, component nhớ title cũ) và đủ `aria-label` theo rule 9.

## 2. Bốn thẻ inline style: style gốc, ánh xạ, lý do

1. Nút đóng modal trong `quan-ly-cam-nang.html`: style gốc `background:none; border:none; cursor:pointer; padding:4px; border-radius:6px; color:var(--color-neutral-500);` với icon close bên trong. Ánh xạ `type="link" color="primary" prefixIcon="close" title="" aria-label="Thoát"`. Lý do: nút trong suốt chỉ có icon nên theo mục B chọn link primary; thêm aria-label theo rule 9 vì thẻ cũ không có; nhãn thoát dùng "Thoát" thay cho chữ "Đóng" đang dựa theo rule 16.
2. Nút Hủy trong `quan-ly-cam-nang.html`: style gốc `padding:8px 16px; border:1px solid var(--color-neutral-300); border-radius:6px; background:#fff; cursor:pointer; font-size:13px; font-weight:500;` nhãn Hủy. Ánh xạ `type="light" color="primary" title="Hủy"`. Lý do: dáng là nút outline trắng đứng bậc phụ trong cụm CTA, rule 18 cấm `outline` nên ánh xạ sang light primary (gần nhất, không phải link vì nó vẫn là nút phụ có nền); giữ nguyên nhãn Hủy như quyết định các đợt trước và ghi vào nợ rule 16 ở mục 8.
3. Nút Tạo/Lưu trong `quan-ly-cam-nang.html`: style gốc `padding:8px 20px; border:none; border-radius:6px; background:var(--color-primary-600); color:#fff; cursor:pointer; font-size:13px; font-weight:600; display:flex; align-items:center; gap:6px;` kèm icon save và span nhãn động `id="handbook-save-label"`. Ánh xạ `type="fill" color="primary" prefixIcon="save" id="handbook-save-label" onclick="saveHandbook()" title="Tạo"`. Lý do: nền đậm primary chữ trắng là fill primary theo mục B. Vì `sd-button` render đè innerHTML, span nhãn động không thể ở trong light DOM, nên giữ id trên `sd-button` và đổi hai dòng JS `document.getElementById('handbook-save-label').textContent = ...` thành `setAttribute('title', ...)` tại dòng 523 và 537; `attributeChangedCallback` của component re-render, hành vi đổi nhãn Tạo/Lưu giữ nguyên.
4. Nút xoá tag trong `sua-cam-nang.html`: thẻ này không có inline style như bản giao việc mô tả, dáng nằm ở rule CSS của trang `.tag-chip button { background:none; border:none; cursor:pointer; color:inherit; padding:0; display:flex; align-items:center; font-size:14px; }`. Ánh xạ `type="link" color="primary" size="sm" prefixIcon="close" title="" aria-label="Xóa"`. Lý do: giống "trong suốt, chỉ có chữ" nên link primary; chip mang `color:var(--color-primary-700)` và nút kế thừa màu nên chọn primary khớp trực quan; rule `.tag-chip button` đã xoá hẳn để không rò dáng vào nút thật bên trong `sd-button` (bẫy 3).

## 3. Hai modal

Không có modal nào để chuyển trong `sua-position.html` và `tao-position.html`. Đã grep cả hai file cho `.modal-overlay`, `.modal-dialog`, `.modal`, `.modal-header`, `.modal-body`, `.modal-footer`, `.modal-close`, `sd-modal`, hàm mở/đóng modal và `classList.add('open')`: hai file chỉ còn CSS chết của bộ class modal cũ và khối `.org-tree-modal` (được copy từ template), không có markup modal, không có JS dựng modal, không có nút `.modal-close`. Đối chiếu git log: từ commit đầu tiên, hai file chưa từng chứa markup modal, chỉ có CSS này. Giả định của bản giao việc ("mỗi file còn một modal") không khớp hiện trạng; không dựng modal giả để hợp lệ brief, không xoá CSS chết vì nằm ngoài bảng phạm vi. Điểm (c) và bẫy NodeList sống của `SD-MODAL-MIGRATION` do đó không áp dụng; nếu sau này modal được thêm lại thì cách xử lý đúng đã có sẵn trong báo cáo kia: gắn đủ con vào phần tử trước khi `appendChild`, và dùng `while (content.firstChild) modal.appendChild(content.firstChild)` thay vì duyệt NodeList sống.

## 4. CSS sau khi rút gọn

Nguyên tắc: `sd-button` sở hữu toàn bộ dáng, CSS trang chỉ giữ bố cục (`align-self`, `margin`, `flex-shrink/grow`, `grid-column/row`, `position + top/right/bottom/left`, `order`, `z-index`).

quan-ly-orgbase.html và sua-orgbase.html còn đúng một rule cho class đã đổi, nguyên văn:

```
.fixed-chip .fc-remove { margin-left:3px; }
```

Rule này chỉ còn `margin-left` thuộc nhóm bố cục, toàn bộ thuộc tính dáng (background, border, cursor, color, padding, font-size, line-height, border-radius) đã bỏ, và class `fc-remove` vẫn nằm trên thẻ `sd-button` nên margin chạy qua host. Các class còn lại (`.holder-action-btn`, `.remove-flow-btn`, `.tag-chip button`) không còn rule nào trong bốn file có chúng. Bộ `.btn`, `.btn-primary`, `.btn-ghost`, `.btn-sm`, `.btn-md` của quan-ly-orgbase nằm trong `design-system/core/styles/components.css`, file bị cấm sửa theo brief và lesson của kit, nên không có CSS trang nào để xử lý cho nhóm này.

## 5. Ba bẫy

Bẫy 1 (`disabled` gán bằng property): không có phép gán `.disabled =` nào lên nút trong bảy file; chỗ duy nhất là `el.disabled = true` ở `sua-cam-nang.html` trong `applyHandbookViewMode`, áp lên `input, textarea, select`, không phải nút, không đụng. Nút record cũ của sua-position dùng class `disabled` (CSS dáng) nên chuyển thành attribute `disabled` đúng API của `sd-button`, không có code nào bật/tắt nó.

Bẫy 2 (gán `.title` bằng property): sau khi sửa không còn chỗ nào gán `.title` property lên nút. `document.title = 'Chi tiết Cẩm nang ...'` ở sua-cam-nang là tiêu đề cửa sổ, không phải nút. Hai dòng gán `textContent` lên `#handbook-save-label` đã đổi sang `setAttribute('title', ...)` để `sd-button` re-render đúng.

Bẫy 3 (selector `<gì đó> button`): trong bảy file chỉ có đúng một rule page dạng này chạm nút trong phạm vi là `.tag-chip button` ở sua-cam-nang; rule đã xoá hẳn nên không còn kênh nào rò dáng vào `<button class="c-button">` thật bên trong `sd-button`. Các selector khác trong phạm vi đều nhắm host `sd-button` (ví dụ `.page-header-actions sd-button[title="Tạo"]` ở tao-orgbase) hoặc nhóm C còn giữ thẻ button thuần, không cần đổi.

## 6. CSS đã xoá mỗi file

| File | Rule xoá hẳn | Dòng xoá | Ghi chú khác |
|---|---|---|---|
| sua-position.html | `.holder-action-btn`, `.holder-action-btn:hover`, `.holder-action-btn.disabled` | 3 | thẻ đã bỏ class, không còn rule nào |
| tao-position.html | `.holder-action-btn`, `.holder-action-btn:hover` | 2 | thẻ đã bỏ class |
| quan-ly-orgbase.html | `.fixed-chip .fc-remove:hover` | 1 | rule `.fixed-chip .fc-remove` rút gọn còn 1 dòng, giữ class trên 2 thẻ |
| sua-orgbase.html | `.fixed-chip .fc-remove:hover` | 1 | như trên |
| tao-orgbase.html | `.remove-flow-btn`, `.remove-flow-btn:hover` | 2 | cả HTML tĩnh lẫn chuỗi JS đều thành sd-button |
| quan-ly-cam-nang.html | 0 rule, 0 dòng CSS | 0 | xoá sạch inline style trên 3 thẻ (gồm padding, border, border-radius, background, color, cursor, font, display, gap); sửa 2 dòng JS `textContent` thành `setAttribute('title')` |
| sua-cam-nang.html | `.tag-chip button` | 1 | 6 nút `.note-editor-btn` và rule của chúng để nguyên (nhóm C) |

## 7. Xác nhận nhóm C và CRLF

Nhóm C để nguyên cả HTML lẫn CSS: `.org-lvl-btn` 40 thẻ (quan-ly-orgbase 15, sua-orgbase 15, tao-orgbase 10, trong đó tao-orgbase có 5 thẻ sinh trong chuỗi JS), `.add-fixed-btn` 8 thẻ (3 + 3 + 2, tao-orgbase gồm 1 trong chuỗi JS), `.add-flow-btn` 1 thẻ, `.note-editor-btn` 6 thẻ. Đã rà rule CSS, thẻ và selector JS của cả bốn class, không thay đổi gì. Chỉ sửa đúng bảy file trong danh sách và tạo file báo cáo này; không chạm `design-system/`, không commit. `file` trên cả bảy file đều báo `CRLF line terminators`; các file orgbase vẫn kèm BOM và dòng dài như trạng thái gốc, không phải do sửa này.

## 8. Rủi ro - chỗ hành vi hoặc bố cục có thể đổi

- Nút icon edit/delete của holder table về `light primary sm` 28px thay cho hộp cũ 32px có viền; hàng bảng có thể hơi chật nhưng vẫn nằm trong cột thao tác 88-92px, đáng nhìn ở sua-position và tao-position.
- Nút record cũ của sua-position từ class `disabled` (opacity .35, pointer-events none) sang attribute `disabled` của DS: mục đích chặn thao tác giữ nguyên, dáng disabled do DS thay vì dáng tự dựng.
- Nút xoá trong chip cố định và flow section: từ ký tự/bộ icon nhỏ 15-16px sang `sd-button` link secondary sm 28px, nên chip `.fixed-chip` và header `.flow-section` cao hơn khoảng vài px. Mất hover đỏ (có chủ ý, cùng khoản nợ đã ghi từ ba đợt trước).
- Quan-ly-orgbase: nút đóng drawer từ ghost viền xám sang link primary sm; hai nút footer từ `.btn` DS cũ sang fill/light primary. Nhãn Hủy của drawer footer giữ nguyên, đây là nợ rule 16 đã tồn tại từ trước (nhãn cancel chỉ nên là Bỏ qua / Thoát / Quay lại), gửi PD quyết định đổi nhãn trong đợt dọn nhãn riêng.
- Quan-ly-cam-nang: 3 nút modal về sd-button nhưng khung modal vẫn là div inline style tự dựng; nút Hủy từ outline trắng sang light primary có nền nhạt là đổi trực quan rõ nhất. Nhãn Hủy giữ nguyên (cùng nợ rule 16). Nút Tạo/Lưu dùng `setAttribute('title', ...)` nên mỗi lần mở modal sd-button re-render; nếu sau này có code khác đọc gì đó bằng textContent trên id này thì hành vi đổi, hiện không có.
- Sua-cam-nang: nút xoá tag từ ký tự × 14px (padding 0) sang sd-button sm 28px làm chip tag cao hơn rõ; chưa có size xs trong DS nên đây là chỗ cần PD xác nhận, cùng dạng vấn đề đã để lại cho `.wi-expand-btn` ở đợt 1.
- PHẦN 2 không thực thi: không có modal để kiểm; nếu hiện trạng hai file khác với kỳ vọng của Builder thì cần kiểm lại bản brief hoặc xác định modal thật nằm ở file khác trước khi giao việc tiếp.
