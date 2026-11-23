# DS Mirror Report 06 — sd-chip-calendar + sd-data-state

## 1. File đã sửa / tạo

Đã sửa:
- `design-system/sd-components/sd-components.js` - thêm class `SdChipCalendar`, `SdDataState`, helper `sdAssetPath`.
- `design-system/core/styles/sd-tokens.css` - thêm style cho `sd-chip-calendar` (chip + field + suffix + popup) và `sd-data-state`, chỉ dùng token có sẵn.
- `design-system/preview/shared-nav.js` - thêm "Chip Calendar" vào nhóm Form (sau Chip, trước legacy) và "Data State" vào nhóm Data.
- `design-system/preview/index.html` - thêm 2 card (icon `event_note` và `hourglass_empty`).
- `design-system/components/sd-form.md` - thêm mục `## sd-chip-calendar`.
- `design-system/components/sd-data.md` - thêm mục `## sd-data-state`.
- `design-system/components/sd-components.md` - cập nhật bảng group file và Quick lookup.

Đã tạo:
- `design-system/preview/components/chip-calendar.html`.
- `design-system/preview/components/data-state.html`.
- `DS-MIRROR-REPORT-06.md`.

## 2. Thuộc tính đã mirror và cái cố ý bỏ

`sd-chip-calendar` (Portal `/form/chip-calendar`):
- `model` (two-way) → attribute `value` (danh sách `yyyy/MM/dd` phân tách dấu phẩy) + property JS `.value` trả mảng + event `sd-change { value: Array }`.
- `label`, `size` (sm/md/lg, mặc định md), `required`, `min`, `max`, `disabled` - mirror đủ, mặc định khớp bảng Portal.
- Portal có ô "Định dạng" trong bảng thử nghiệm nhưng KHÔNG nêu input tương ứng trong mã mẫu; mô tả ghi cứng "Định dạng: yyyy/MM/dd". Chưa xác minh được input nào đang điều khiển ô này nên mirror CỐ Ý KHÔNG thêm input định dạng, cố định lưu `yyyy/MM/dd`.

`sd-data-state`:
- `state` (loading/empty/error), `title`, `message`, `retryable`, `retrylabel` - mirror đủ, đọc cả `retryLabel` (camelCase trong tài liệu) lẫn `retrylabel` (dạng DOM thật sau khi HTML parser lowercase).
- CỐ Ý KHÔNG thêm `icon`, `image`, `size` dù rất dễ nghĩ tới, vì Portal không cho thấy chúng và brief cấm tự thêm.

## 3. sd-data-state: suy từ usage vs quy ước kit

Suy từ usage (mã nguồn thật Portal công bố ở `/pattern/tab-group/basic`, file `tab-group.component.html`, 3 lần dùng):
- Bộ attribute `state`, `title`, `message`, `retryable`, `retryLabel`.
- Event `(sdRetry)` không kèm detail quan sát được → mirror `sd-retry` bubbles, không detail.
- `loading` không có message trong cách dùng thấy được.
- Rất có thể component thật còn thuộc tính khác không nhìn thấy từ 3 lần dùng - đã ghi rõ cảnh báo này trên trang preview, tài liệu và báo cáo.

Theo quy ước kit (KHÔNG phải Portal):
- `state="empty"` dùng SVG từ `design-system/core/assets/empty-state-illustration.svg` (rule 12 trong AGENTS.md), không dùng Material Icon.
- `state="loading"` dùng lại `.sd-loading-spinner` + `@keyframes sd-spin` có sẵn trong kit, không viết keyframes mới.
- Nút Thử lại dùng `sd-button` chuẩn, không custom CSS.

## 4. Chỗ phải TỰ QUYẾT

1. Calendar popup cho chip-calendar: brief nói "dùng sd-date làm bộ chọn ngày, đừng tự dựng lịch mới", nhưng `sd-date` trong mirror chỉ là readonly field, không có popup. Phương án chọn: dựng popup bên trong component dùng lại đúng markup/CSS `.form-field-datepicker` đã có trong kit (calendar 280px có sẵn), field visual giống sd-date + sd-chip (`.sd-form-field` + chip + icon `today`). Căn cứ: không viết lịch mới kiểu mới, dùng lại calendar sẵn của kit, đúng tinh thần brief; lệch duy nhất là popup này do component tự wire vì shell.js chỉ wire `.form-field-datepicker-wrapper` tĩnh.
2. Giữ popup mở sau mỗi lần chọn ngày để chọn tiếp nhiều ngày (ngày đã chọn đánh dấu `selected`); đóng khi bấm ra ngoài hoặc Escape.
3. Khi danh sách rỗng hiện placeholder "Chọn ngày" (visual affordance thuần, không phải attribute mới).
4. Popup mở ở tháng hiện tại, không tự nhảy tới tháng có ngày đã chọn.
5. `min`/`max` hành xử im lặng giống `sd-chip`: chặn xoá khi đã chạm `min`, chặn thêm khi đã chạm `max`, không báo lỗi trực quan.
6. `retryLabel` mặc định "Thử lại" khi thiếu (bảng Portal để trống mặc định nhưng nút cần có nhãn).
7. `retryable="false"` được đọc là false, không chỉ dựa vào presence của attribute.
8. `state` thiếu hoặc không thuộc loading/empty/error → render rỗng (bảng Portal ghi "Bắt buộc").

## 5. Token thiếu phải hardcode

- `gap: 4px` giữa các chip, chip height 24/20/28px, font-size chip 13/12/14px, padding chip `0 4px 0 10px` - chép đúng rule `sd-chip` đang có trong `sd-tokens.css` (không token tương ứng cho những số này).
- Suffix icon: `font-size: 18px`, `margin-left: 4px` - giữ đúng khuôn inline style của `sd-date`/`sd-datetime`.
- Ảnh empty state: `width: 96px` theo đúng viewBox của asset.
- Không hardcode màu hay font nào; mọi màu từ token `--sd-*` / `--color-*` / `--text-*`.

## 6. Xác nhận hai bẫy vòng đời và bẫy thuộc tính `title`

- Bẫy 1 (attributeChangedCallback chạy trước connectedCallback): `SdChipCalendar` và `SdDataState` đều đi qua `_render()` tự dựng innerHTML nên không phụ thuộc element cũ; các hàm đọc element nội bộ (`_syncChipsUi`, `_renderCalendar`, `_popupOpen`, `_bindRetry`, `_bindField`) đều có guard `if (!...) return;` ở đầu. Đã xử lý.
- Bẫy 2 (listener mất khi chuyển chỗ trong DOM): listener document (click ngoài, Escape) gắn trong `connectedCallback` với guard `if (!this._boundOutside)` / `if (!this._boundEscape)`, gỡ và null trong `disconnectedCallback` nên gắn lại được. Listener field dùng cờ `field._bound`; `_render()` dựng field mới nên bind lại được. Đã xử lý.
- Bẫy `title` của `sd-data-state`: chép đúng cơ chế `SdInform` - nhớ giá trị vào `this._title`, dùng cờ `this._strippingTitle` quanh `removeAttribute('title')` để `attributeChangedCallback` không tự kích hoạt đọc ra rỗng. Đã xử lý.
