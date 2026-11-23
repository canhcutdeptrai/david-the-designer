# DS Mirror Report 05 - SdNotifyService / SdConfirmService / SdLoadingService

## 1. File đã sửa / tạo

Đã sửa:
- `design-system/sd-components/sd-components.js` - thêm 3 service vào cuối IIFE sẵn có (sau các component, đúng vị trí cần thiết để dùng `sd-modal`, `sd-input`, `sd-radio`, `sd-date`), cập nhật header comment.
- `design-system/core/styles/sd-tokens.css` - thêm CSS cho toast, nội dung dialog confirm, overlay loading.
- `design-system/preview/shared-nav.js` - thêm nhóm `Service` vào cuối mảng `menu`.
- `design-system/preview/index.html` - thêm 1 card `sd-* Service` theo đúng khuôn card sẵn có, icon `notifications_active`.
- `design-system/components/sd-components.md` - cập nhật cả bảng "Files theo functional group" và bảng "Quick lookup".

Đã tạo:
- `design-system/preview/components/service.html` - một trang preview cho cả ba service, chép nguyên cấu trúc từ `checkbox.html`.
- `design-system/components/sd-service.md` - tài liệu service theo văn phong các file `sd-*.md`.
- `DS-MIRROR-REPORT-05.md` - báo cáo này.

## 2. Từng service: phương thức và tuỳ chọn đã mirror

**SdNotifyService** (`window.SdNotifyService`): `.success()`, `.info()`, `.warning()`, `.error()`, mỗi cái nhận `(message, options)`. Options: `title`, `actionLabel`, `duration`. Toast xếp hàng ở góc phải trên, có nút đóng, tự tắt theo `duration`, hiện nút hành động khi có `actionLabel`, màu theo `type` lấy từ `--sd-success` / `--sd-info` / `--sd-warning` / `--sd-error`.

**SdConfirmService** (`window.SdConfirmService`): `.confirm()` → `Promise<void>`, `.withInput()` → `Promise<string>`, `.withRadio()` → `Promise<string>`, `.withDate()` → `Promise<string>`. Options chung: `title`, `yesTitle`, `noTitle`, `yesButtonColor`, `noButtonColor`. Riêng: `.confirm()` có `width` (mặc định 400px, Portal ghi rõ chỉ phương thức này có); `.withInput()` có `maxlength`, `defaultValue`, `required`; `.withRadio()` có `items`, `valueField`, `displayField`, `display` (column/row), `defaultValue`, `required`; `.withDate()` có `placeholder`, `defaultValue`, `required`. Giữ đúng ngữ nghĩa resolve/reject: Đồng ý resolve, hủy (X, backdrop, nút trái) reject.

**SdLoadingService** (`window.SdLoadingService`): `.start(options)` với `duration`, `target` (CSS selector, mặc định body), `.stop()` dừng ngay.

Không có tuỳ chọn nào của Portal bị cố ý bỏ: `type` của Notify được thể hiện qua 4 phương thức riêng thay vì option `type` (đúng mã mẫu Angular gọi `.success(...)`), còn `message` là tham số đầu tiên như Portal liệt kê.

## 3. Chỗ SUY RA thay vì đọc trực tiếp từ Portal

- `.info()` / `.warning()` / `.error()` của Notify: Portal chỉ show `.success()`; ba phương thức còn lại suy ra từ bộ giá trị của `type` (success, info, warning, error).
- `.start(options)` của Loading: mã mẫu Portal gọi `start()` không tham số; chữ ký `start(options)` suy ra từ bảng thuộc tính `duration` + `target`.
- Mặc định `duration` của toast = 4000ms: Portal không nêu giá trị cụ thể.
- Giá trị trả về của `.withDate()`: Portal không nêu format chuẩn; mirror trả về đúng chuỗi người dùng nhập theo placeholder (dd/MM/yyyy).
- Lý do reject khi hủy: Portal chỉ nói "reject"; mirror dùng `new Error('canceled')` để preview phân biệt trạng thái.

## 4. Chỗ phải TỰ QUYẾT: phương án, chọn cái nào, căn cứ

- **Toast hàng chờ**: chọn giới hạn 3 toast hiển thị đồng thời, toast thừa xếp queue và tự lên khi có chỗ. Căn cứ: cụm "hỗ trợ hàng chờ" trong mô tả Portal, xếp hàng mà không đè lên nhau.
- **Gọi SdConfirmService chồng nhau**: chọn xếp hàng (queue) - lời gọi thứ hai chờ, tự mở khi modal hiện tại đóng. Căn cứ: không được phép làm mất lời gọi, và đồng nhất với tinh thần hàng chờ của Notify. Trang preview không khuyến khích mở chồng nhưng hành vi vẫn an toàn.
- **SdLoadingService gọi chồng**: chọn không nhân đôi overlay - `start()` khi đang chạy sẽ dừng overlay cũ rồi tạo lại trên target mới, vì Portal chỉ có `stop()` không tham số nên mirror giữ mô hình một overlay tại một thời điểm.
- **sd-date trong `.withDate()`**: sd-date mirror render input `readonly`, người dùng không nhập được; mirror gỡ `readonly` ở runtime chỉ trong dialog confirm (không sửa component). Căn cứ: brief bắt buộc dùng sd-date, không cho sửa component.
- **maxlength của `.withInput()`**: sd-input mirror chưa mirror attribute `maxlength`; mirror set `maxlength` cho input thật ở runtime khi mở dialog. Không sửa sd-input.
- **Nhãn mặc định `noTitle`**: dùng "Bỏ qua" (một trong 3 nhãn quy ước kit) thay vì "Hủy" như mã mẫu Portal - demo của kit theo quy ước kit.

## 5. Token thiếu phải hardcode

- Bóng toast: `box-shadow: 0 4px 12px rgba(15, 23, 42, 0.12)` - không có token tương đương.
- Nền overlay loading: `rgba(255, 255, 255, 0.7)` - không có token tương đương; ghi chú trong CSS giống cách `sd-modal` hardcode backdrop.
- Nền toast trắng dùng `var(--color-neutral-0)` (token có sẵn), viền dùng `var(--sd-black200)`.

## 6. Xử lý gọi chồng nhau và gắn overlay vào target không phải body

**Gọi chồng**: Notify xếp queue tối đa 3 toast hiển thị; Confirm xếp queue lời gọi và mở tuần tự (reject/queue không bao giờ làm mất promise, mỗi promise chỉ settle đúng một lần nhờ cờ `settled`); Loading không nhân đôi overlay - `start()` khi đang chạy dừng overlay cũ, tạo lại trên target mới, timer `duration` cũ được clear.

**Target không phải body**: overlay dùng `position: absolute; inset: 0`, service kiểm tra `getComputedStyle(target).position`; nếu đang `static` thì tạm set `position: relative` lúc `start()` và restore đúng giá trị cũ lúc `stop()`. Target `body` dùng `position: fixed` phủ toàn màn hình.
