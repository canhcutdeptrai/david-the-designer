# SD-MODAL-MIGRATION - chuyển hai modal của tra-cuu-cam-nang-v2 sang sd-modal

## 1. Việc 1 - modal Preview tài liệu

- HTML dòng 159-166: thay khối `.modal-overlay / .modal / .modal-header / .modal-body / .modal-footer` bằng `<sd-modal id="attachment-preview-modal" title="Preview tài liệu" width="520px">`. Giữ nguyên khối `.resolver-summary` (icon `visibility` + `<span id="attachment-preview-content">`) làm nội dung thân, thêm `<div sdFooterRight>` bọc nút Thoát. Bỏ hẳn nút `.modal-close` viết tay, className `modal-md` (không tồn tại trong DS), `onclick` trên lớp phủ và `event.stopPropagation()` - ba thứ đó giờ do component lo.
- Ba hàm JS sửa theo: `openAttachmentPreviewFromButton` (dòng 4409) và `downloadAttachmentMock` (dòng 4417) đổi `modal.classList.add('open')` thành `modal.open()`; `closeAttachmentPreview` (dòng 4431) bỏ tham số `event` và dòng kiểm `event.target`, thân hàm chỉ còn `modal.close()`. Không còn chỗ nào gọi `closeAttachmentPreview(event)`.

## 2. Việc 2 - modal Thiết lập bảng

`ensureTableConfigModal` (dòng 1939) giờ xoá sd-modal cũ khỏi DOM nếu có (thay cho nhánh `if (modal) return modal;` cũ), tạo `document.createElement('sd-modal')`, đặt `id`, `title="Thiết lập bảng"`, `width="900px"`. Bỏ `className`, `addEventListener('click', closeTableConfigModal)` và ba attribute `role` / `aria-modal` / `aria-label` theo đúng bản giao việc. `renderTableConfigDialog` (dòng 1982) không trả về khung modal nữa, chỉ trả về `<table class="table-config-table">...</table>`; khung header, nút đóng và footer do sd-modal dựng. `closeTableConfigModal` (dòng 2013) bỏ tham số `event` và dòng kiểm target, gọi `modal.close()`; `applyTableConfigDraft` (dòng 2032) gọi không tham số nên khớp.

Điểm (c) xử lý đúng thứ tự như sau: `openTableConfigModal` (dòng 1992) không gán `innerHTML` lên sd-modal đang trong DOM. Nó lấy một element sd-modal mới còn detached, gán đủ con vào trước - bảng thân do `renderTableConfigDialog()` trả về và `<div sdFooterRight>` chứa cụm ba nút - qua một container trung gian (`var content = document.createElement('div')`, gán `innerHTML` trên container đó rồi dùng `Array.prototype.forEach.call(content.childNodes, ...)` chuyển từng node element sang sd-modal), sau đó mới `appendChild` vào body để `connectedCallback` nhặt slot và render, rồi `open()` và cuối cùng `bindTableConfigControls()`. `id="table-config-rows"` và mọi `data-config-field` / `data-config-index` giữ nguyên.

Lệch một chi tiết so với bản giao việc: bản giao việc viết `ensureTableConfigModal` rồi appendChild vào body, còn phần mô tả `openTableConfigModal` lại yêu cầu gắn con trước khi append. Hai câu này mâu thuẫn nhau - nếu `ensureTableConfigModal` append cái element rỗng vào body trước thì element đã render xong nội dung rỗng, thêm con sau không vào được slot. Tôi chọn theo phần mô tả `openTableConfigModal` (là "Cách đúng" và đúng luôn điểm c): `ensureTableConfigModal` chỉ tạo element detached và trả về, `openTableConfigModal` đảm nhận bước gắn con rồi append. Nếu Builder muốn `ensureTableConfigModal` tự append thì báo lại để tôi chỉnh.

## 3. Việc 3 - ba nút sửa theo rule 17

- Thoát (Preview): `type="link" color="secondary"` thành `type="link" color="primary"`.
- Bỏ qua (Thiết lập bảng): `type="link" size="sm" color="secondary"` thành `type="link" size="sm" color="primary"`.
- Mặc định (Thiết lập bảng): `type="light" size="sm" color="secondary"` thành `type="light" size="sm" color="primary"`.
- Áp dụng đã đúng từ trước (`type="fill" size="sm" color="primary"`), để nguyên. Đã grep lại cả file, không còn nút nào của hai modal này dùng `color="secondary"` và không sót nút nào cần sửa.

## 4. Việc 4 - dọn comment đã sai

- HTML xoá hai comment `DS khong co nut dong modal component; moi modal phai gan ham dong rieng nen dung button thuan.` - một trong khối Preview (dòng cũ 163), một trong `renderTableConfigDialog` (dòng cũ 1998). Chỗ thứ hai thay bằng comment mới cho đúng: `sd-modal lo khung header / nut dong / footer; ham nay chi tra ve ruot la bang.`.
- CSS `styles/tra-cuu-cam-nang-v2.css` dòng 2709-2710: sửa comment `Khung modal dung .modal-overlay / .modal / ... cua DS - giong hai modal con lai cua trang.` thành `Khung modal do sd-modal lo (header, nut dong, footer); CSS o day chi tao dang cho bang table-config-table ben trong.`. Chỉ sửa chữ trong comment, không đụng dòng CSS nào.

## 5. Rủi ro và chỗ phân vân

- Vị trí hộp thoại đổi: sd-modal căn giữa viewport, còn `.modal-overlay` cũ căn theo `padding-top: 10vh` nên hộp cũ nằm lệch lên trên. Cả hai modal giờ hiện giữa màn hình, kích thước không đổi (520px cho Preview, 900px cho Thiết lập bảng).
- Cấu trúc header/footer đổi: header sd-modal cao 56px nền trắng, footer min-height 56px, body padding 12px 16px và footer padding 12px 16px, trong khi modal cũ dùng padding rộng hơn (`--space-5` cho body, `--space-4 --space-5` cho footer). Bảng và block bên trong giữ nguyên token, chỉ tỉ lệ đệm quanh mép đổi chút.
- Vẻ ngoài chi tiết đổi: modal cũ dùng `--radius-xl`, `--shadow-xl`, nền `--surface-primary`; sd-modal dùng radius 8px, shadow phần cứng (mirror Portal), nền root `--color-neutral-50` với header/footer trắng. Có animation fade/slide của sd-modal thay cho transition cũ.
- Mỗi lần mở Thiết lập bảng là tạo hẳn một element sd-modal mới và xoá element cũ khỏi DOM, khác hành vi cũ chỉ ẩn/hiện cùng một hộp. Kết quả nhìn ngoài giống nhau, nhưng nếu sau này có code nào giữ tham chiếu cũ tới `#table-config-modal` thì sẽ trỏ vào element đã tháo khỏi DOM - hiện tại không có.
- sd-modal đóng được bằng X, nút thoát và click backdrop; không có xử lý phím Esc trong component, modal cũ cũng không có nên không đổi hành vi nào ở đây. `document.body.style.overflow` component tự set/clear.
- Điểm cần test kỹ nhất khi mở Thiết lập bảng: checkbox/cột hiển thị, đổi tiêu đề/rộng, drag đổi thứ tự và nút Mặc định/Áp dụng - mấy thứ này phụ thuộc `#table-config-rows` được dựng đúng trước khi `bindTableConfigControls` chạy. Tôi đã kiểm node --check toàn bộ script inline của file (không lỗi cú pháp), nhưng không tự mở trình duyệt được nên nhờ Builder kiểm trực quan phần tương tác.

## 6. Vòng sửa - modal Thiết lập bảng mất footer

- Lỗi do Builder kiểm trên trình duyệt thật xác nhận: mở Thiết lập bảng thì bảng vào đúng nhưng footer mất sạch (coBang: true, coFooter: false), hộp thoại không dùng được.
- Nguyên nhân nằm ở vòng lặp cũ trong `openTableConfigModal` (trước sửa): `Array.prototype.forEach.call(content.childNodes, ...)` duyệt một NodeList sống; `appendChild` gỡ node ra khỏi `content` ngay giữa vòng nên danh sách co lại trong khi forEach vẫn tăng chỉ số. Với hai con, lần lặp i=0 chuyển được `<table>`, danh sách còn 1 phần tử, i=1 vượt quá length nên `<div sdFooterRight>` kẹt lại mãi trong `content` - sd-modal không nhặt được slot footer. Đây không phải lỗi của sd-modal.
- Cách sửa (dòng 2005-2007 trong `openTableConfigModal`): thay vòng lặp bằng `while (content.firstChild) modal.appendChild(content.firstChild);` - mỗi bước đọc lại `firstChild` nên không phụ thuộc chỉ số của danh sách sống. Bỏ luôn bộ lọc `nodeType === 1` theo đúng yêu cầu: `content.innerHTML` do chính đoạn gần đó tạo ra nên chỉ có hai con element, không có text node rác.
- Tự kiểm bằng logic, vì không mở được trình duyệt: `content.innerHTML = renderTableConfigDialog() + '<div sdFooterRight>...'` tạo đúng 2 con là `<table class="table-config-table">` và `<div sdFooterRight>`. Vòng `while` chạy: lần 1 chuyển table, lần 2 chuyển div, lần 3 `firstChild` là null thì dừng; sau đó `content` rỗng và `modal` có đúng 2 con theo thứ tự table rồi footer. Confirmed thêm bằng mô phỏng NodeList sống trên Node: vòng cũ để lại 1 node trong content (div footer) và modal chỉ nhận table; vòng mới content rỗng, modal nhận cả hai.
- Rà soát toàn bộ thay đổi của phiên này trong file, tìm chỗ nào vừa duyệt vừa chuyển/xoá node của NodeList hay HTMLCollection sống: chỉ có đúng một chỗ là vòng lặp ở `openTableConfigModal` - đã sửa. Hai dòng `Array.prototype.forEach.call` khác trong file (dòng 1904 `row.cells` chỉ setAttribute, dòng 1934 `querySelectorAll` trả list tĩnh và chỉ set style) đều là code có sẵn từ trước, không duyệt kèm chuyển node nên không dính lỗi này và không nằm trong phạm vi sửa.
