# BUTTON-CLEANUP-03 - Dọn nút custom theo rule 0b - đợt 3: uy-quyen-noi-bo, danh-sach-position, chi-tiet-workitem, danh-sach-luong, danh-sach-loai-dieu-kien, memory

Đã đọc mục 8 của `BUTTON-CLEANUP-02.md` trước khi bắt đầu và áp dụng đúng bốn bài học: giữ nguyên tắc `sd-button` sở hữu toàn bộ dáng, chỉ giữ thuộc tính bố cục; không bỏ `title=""` khỏi nút icon; chuyển `title`/`aria-label` đúng kiểu; soát selector dạng `<gì đó> button`. Tổng 32 thẻ được đổi sang `sd-button` trong 5 file, file `memory.html` không có thẻ nào để đổi (xem mục 2). Không dùng `type="outline"` ở bất kỳ chỗ nào.

## 1. Bảng: class | số thẻ đã đổi | đổi thành gì | có giữ class cho JS không

| File | Class cũ | Số thẻ đổi | Đổi thành | Giữ class cho JS |
|---|---|---|---|---|
| uy-quyen-noi-bo | `.pg-action-btn` | 6 (refresh x2, trang trước x2, trang sau x2) | `sd-button type="link" color="primary" size="sm"`; nút có chữ dùng `prefixIcon` + `title` ("Tải lại", "Trang trước"), nút icon dùng `title=""` | Không |
| uy-quyen-noi-bo | `.icon-only-action` | 4 (Từ chối x2, Xác nhận x2 ở bảng chờ xác nhận) | `sd-button type="light" color="primary" size="sm"`, chỉ icon, `title=""` + `aria-label` | Không |
| uy-quyen-noi-bo | `.document-icon-button` | 3 (chuỗi JS `renderDelegationDocuments`: Preview, Tải xuống, Mở liên kết) | `sd-button type="light" color="primary" size="sm"`, chỉ icon, `title=""` + `aria-label`; giữ `data-doc-name`/`data-doc-url` | Không |
| uy-quyen-noi-bo | `.link-remove` | 3 (2 HTML tĩnh + 1 chuỗi JS `addDelegationLinkRow`) | `sd-button type="link" color="secondary" size="sm"`, chỉ icon `delete_outline`, `title=""` + `aria-label="Xóa liên kết"`; giữ `onclick` | Không |
| danh-sach-position | `.pg-action-btn` | 2 (Tải lại, Thiết lập) | `sd-button type="link" color="primary" size="sm"`, `prefixIcon` + `title` | Không |
| danh-sach-position | `.pg-nav-btn` | 2 (trang trước `disabled`, trang sau) | `sd-button type="link" color="primary" size="sm"`, chỉ icon, `title=""` + `aria-label`; giữ attribute `disabled` | Không |
| danh-sach-position | `.spc-close` | 1 (popup hồ sơ ghế) | `sd-button type="link" color="secondary" size="sm"`, chỉ icon `close`, `title=""` + thêm `aria-label="Thoát"`; giữ `onclick="closeSeatCard()"` | Không |
| chi-tiet-workitem | `.version-action` | 3 (nút Xem v1/v2/v3) | `sd-button type="light" color="primary" size="sm"`, `prefixIcon="visibility"` + `title="Xem"`; giữ `class="version-action"` và `onclick` | Giữ class vì giữ CSS bố cục (xem mục 3) |
| chi-tiet-workitem | `.snapshot-close` | 1 (nút đóng hộp thoại phiên bản) | `sd-button type="link" color="secondary" size="sm"`, chỉ icon `close`, `title=""`, đổi `aria-label` từ "Đóng" thành "Thoát"; giữ `onclick="closeVersionSnapshot()"` | Không |
| danh-sach-luong | `.pg-action-btn` | 2 (Tải lại, Thiết lập) | `sd-button type="link" color="primary" size="sm"`, `prefixIcon` + `title` | Không |
| danh-sach-luong | `.pg-nav-btn` | 2 (trang trước và trang sau, cả hai `disabled`) | `sd-button type="link" color="primary" size="sm"`, chỉ icon, `title=""` + `aria-label`; giữ attribute `disabled` | Không |
| danh-sach-loai-dieu-kien | `.pg-action-btn` | 2 (Tải lại, Thiết lập) | `sd-button type="link" color="primary" size="sm"`, `prefixIcon` + `title` | Không |
| memory.html | - | 0 | - | - |

`pg-action-btn`/`pg-nav-btn` dùng `color="primary"` khớp với đợt 1 ở `danh-sach-workitem.html`. Mọi nút icon-only giữ `title=""` theo đúng API `sd-button` (bỏ hẳn attribute không được, component nhớ title cũ), và đủ `aria-label` theo rule 9.

## 2. memory.html: thẻ button trần trong bản giao việc là gì, xử lý sao, vì sao

Không có thẻ `<button>` nào trong `memory.html`. Chuỗi `<button>` xuất hiện đúng một lần ở dòng 254, nhưng đó là văn bản markdown nằm trong thẻ `<script type="text/markdown" id="memory-md-source">` (nội dung ghi lại bài học "Worker bỏ sót ví dụ nút bấm - dò `<button>` bên trong `<template>`, mà custom element trong template chưa được nâng cấp"), không phải thẻ HTML thật. `memory.html` là viewer render `memory.md`, không thuộc BREAD; phần JS render chỉ dựng `sd-section` từ markdown đã parse, không sinh nút bấm nào. Vì không có nút để đổi, không sửa gì file này, không ghi diff.

## 3. CSS sau khi rút gọn, chứng minh không còn thuộc tính dáng

Nguyên tắc: `sd-button` sở hữu dáng, CSS của trang chỉ giữ bố cục mà component không tự biết (align-self, margin, flex-shrink/flex-grow, grid-column/grid-row, position + top/right/bottom/left, order, z-index). Với từng class đã đổi:

- uy-quyen-noi-bo: xoá hẳn `.pg-action-btn`, `.pg-action-btn:hover`, `.icon-only-action`, `.icon-only-action:hover`, `.document-icon-button`, `.document-icon-button:hover`, `.link-remove`, `.link-remove:hover` (8 rule). Không còn rule nào của các class này.
- danh-sach-position: xoá hẳn `.pg-action-btn`, `.pg-action-btn:hover`, `.pg-nav-btn`, `.pg-nav-btn:hover:not(:disabled)`, `.pg-nav-btn:disabled`, `.spc-close`, `.spc-close:hover` (7 rule).
- danh-sach-luong: xoá hẳn `.pg-action-btn`, `.pg-action-btn:hover`, `.pg-nav-btn`, `.pg-nav-btn:hover:not(:disabled)`, `.pg-nav-btn:disabled` (5 rule).
- danh-sach-loai-dieu-kien: xoá hẳn `.pg-action-btn`, `.pg-action-btn:hover` (2 rule).
- chi-tiet-workitem: xoá hẳn `.version-action:hover` và `.snapshot-close` (2 rule; `.snapshot-close` không có `:hover`). Rule `.version-action` được rút gọn, sau rút gọn nguyên văn là:

```
.version-action { margin-left:auto; align-self:center; }
```

Chỉ còn `margin-left` và `align-self`, đều thuộc nhóm bố cục; đã bỏ toàn bộ thuộc tính dáng (border, background, border-radius, padding, color, cursor, display, align-items, gap, font-size) và class vẫn nằm trên 3 thẻ `sd-button` nên căn phải giữa hàng không đổi. Ngoài rule này, không có rule CSS nào được giữ lại cho các class đã đổi.

## 4. Ba bẫy: `.disabled`, `.title`, selector `<gì đó> button`

- Bẫy 1 `.disabled` gán bằng property: không có chỗ nào cần sửa. Đã rà 5 file: phép gán `.disabled =` duy nhất trong phạm vi là `checkbox.disabled = disabled` ở uy-quyen `toggleScopeRowConditions` (checkbox trong scope-picker, không liên quan nút vừa đổi). Các nút `pg-nav-btn` có sẵn attribute `disabled` tĩnh trong HTML, `sd-button` đọc attribute này qua `hasAttribute` nên giữ nguyên attribute là đủ, không có code nào bật/tắt nó.
- Bẫy 2 `.title` gán bằng property: không có phép gán `.title =` nào lên nút trong 6 file (`document.title =` ở chi-tiet `initPageTitle` là tiêu đề cửa sổ, không phải nút). Các nút vừa đổi đều dùng `title`/`aria-label` trong attribute tĩnh.
- Bẫy 3 selector `<gì đó> button`: rà 5 file, không có selector dạng dấu cách nào chạm tới `<button>` thật bên trong `sd-button`. Các selector kiểu button còn lại là `.tag-item button` (file tao/sua workitem, không thuộc đợt này), `.pos-chip button`/`.tag-chip button` (chỉ chạm button thuần không nằm trong sd-button, đã xử lý từ đợt 2), và `.confirm-actions .admin-only-action` (là class div, không phải selector button). Không selector nào cần đổi sang `>` trong 6 file này.

## 5. CSS đã xoá mỗi file: số rule, số dòng

| File | Rule xoá hẳn | Dòng CSS xoá | CRLF giảm thật trong file |
|---|---|---|---|
| uy-quyen-noi-bo | 8 rule (4 class + 4 `:hover`) | 71 dòng (pg-action-btn 14+4, icon-only-action 12+4, document-icon-button 12+4, link-remove 11+3) | 70 (bắt nguồn: 8 block CSS xoá 64 CRLF, 3 khối link-remove chuyển từ 3 dòng về 1 dòng bớt 6 CRLF, thành 64 + 6 = 70) |
| danh-sach-position | 7 rule | 7 dòng | 7 |
| chi-tiet-workitem | 2 rule (`.version-action:hover`, `.snapshot-close`) | 2 dòng | 13 (như trên, cộng 9 dòng của 3 nút Xem mỗi nút 4 dòng bó về 1 và 2 dòng của nút đóng 3 dòng bó về 1) |
| danh-sach-luong | 5 rule | 5 dòng | 5 |
| danh-sach-loai-dieu-kien | 2 rule | 2 dòng | 2 |

Bổ chính cho hàng uy-quyen: con số 71 là tổng số dòng nằm trong 8 rule CSS khi đếm trên bản nháp, còn số CRLF thật bị bỏ khỏi file là 64 từ 8 rule đó cộng 6 từ ba khối link-remove chuyển 3 dòng về 1 dòng, ra đúng 70; `2136 - 70 = 2066` khớp số đo trên file. Chi-tiet `919 - 13 = 906`, đã đo đúng.

## 6. Xác nhận nhóm B không bị đụng và CRLF còn nguyên

Nhóm B để nguyên cả HTML lẫn CSS: `.delegation-tab` (uy-quyen, 2 thẻ ở `delegation-tabs`), `.drawer-tab` (danh-sach-position, 3 thẻ ở drawer), `.snapshot-tab` (chi-tiet-workitem, 2 thẻ sinh trong JS `openVersionSnapshot`). Đã rà cả rule CSS lẫn thẻ và JS selector liên quan (`.delegation-tab[data-tab=...]`, `document.querySelectorAll('.drawer-tab')`, `#versionSnapshot .snapshot-tab`), không thay đổi gì.

Hai nút tab `delegation-tab` là nút `<button>` thuần duy nhất còn lại trong uy-quyen, ba `.drawer-tab` và hai `.snapshot-tab` tương tự ở file còn lại, đều đúng chủ đích. `memory.html` không bị sửa.

`file` trên sáu file đều báo `CRLF line terminators` (`uy-quyen-noi-bo.html` còn báo kèm `CR line terminators`, bản chất là dòng `\r\n` chuẩn đã có từ trước khi sửa, không thêm ký tự LF). Số dòng hiện tại: uy-quyen 2066, danh-sach-position 1400, chi-tiet-workitem 906, danh-sach-luong 225, danh-sach-loai-dieu-kien 171, memory 314.

Kiểm khác: không còn chuỗi nào của 4 class đã đổi trong 5 file; mọi block script JS của 6 file đều parse sạch bằng `vm.Script` (riêng block `text/markdown` của memory được loại trừ, không phải JS).

## 7. Rủi ro - chỗ hành vi hoặc bố cục có thể đổi, nên nhìn vào đâu

- Kích thước dáng: `.icon-only-action` và `.document-icon-button` trước là hộp 28-30px có viền `--border-primary`, giờ về nút `light primary` chuẩn DS (nền nhạt viền đậm khi hover, không còn viền tĩnh). Số đo mỗi nút có thể chênh 2px trong hàng action và văn bản đính kèm; hàng `.confirm-actions` và `.document-actions` vẫn giữ flex gap nên không vỡ.
- Mất hover đỏ: `.link-remove` trước đỏ khi hover, giờ về `color="secondary"` xám chuẩn DS theo quyết định của bản giao việc (nợ đã ghi gửi PD, không tự đổi sang error). Đợt này thêm 3 nút nữa vào cùng khoản nợ (đợt 1 và 2 đã có 24 nút).
- Nút phân trang: `.pg-nav-btn` từ hộp viền 28px sang `link primary` icon-only, dáng disabled từ `opacity .4` sang dáng disabled của DS; vì là prototype tĩnh nên không có luồng bật/tắt disabled, hành vi giữ nguyên.
- `title` của nút icon-only: các nút cũ dùng `title` làm tooltip, giờ chuyển hết sang `aria-label` và `title=""` như đợt 2; `sd-button` không chuyển `aria-label` xuống nút thật bên trong (nợ quen thuộc, đã ghi cho PD).
- `this` trong onclick là `<sd-button>` ngoài thay vì `<button>` thật, nhưng các hàm đều dùng `closest`/`getElementById` (resolveConfirmation dùng id, link-remove dùng `this.closest('.link-row')`, closeSeatCard/closeVersionSnapshot gọi hàm global) nên hành vi giữ nguyên. Nếu sau này có code so `e.target === btn` hoặc đọc `tagName`, sẽ đổi hành vi.
- Chi-tiet: nút `snapshot-close` đổi `aria-label` từ "Đóng" thành "Thoát" theo rule 16, đây là thay đổi chủ ý trong phạm vi dọn nhãn cancel (khớp quyết định đợt 2 cho `version-save-close`). Nút Xem phiên bản giữ `class="version-action"` + rule bố cục nên căn phải và căn giữa hàng không đổi, nhưng nút từ hộp viền cao ~31px sang `light primary` cao 28px, độ lệch trong hàng `.version-row` (align-items flex-start) sẽ thấy nếu đo kỹ.
- Văn bản đính kèm trong drawer ủy quyền: nút Mở liên kết giờ mặc định 28px `light primary` có nền nhạt, trước chỉ chữ xám viền mảnh; là hệ quả đúng của việc để DS dựng dáng, không phải lỗi.
- Ghi chú ngoài phạm vi (báo để người duyệt quyết, không tự sửa): `uy-quyen-noi-bo.html` còn nút nghiệp vụ "Hủy" ở hàng bảng (title Hủy, hành động hủy ủy quyền, không phải cancel-label) và các file trong thư mục đang có thay đổi chưa commit từ phiên trước (dọn fallback hex, chỉnh lề) không thuộc đợt này. Tôi chỉ sửa đúng 5 file trong phạm vi và tạo báo cáo này, không commit.
