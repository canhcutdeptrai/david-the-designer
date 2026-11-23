# sd-* Service

*Group: 3 services - Toast, Confirm dialog, Loading overlay. Không phải thẻ HTML: bên Angular lấy bằng `inject(SdNotifyService)` / `inject(SdConfirmService)` / `inject(SdLoadingService)`, mirror này phơi 3 singleton toàn cục trên `window` với đúng tên class Angular. Lời gọi trong prototype chuyển thẳng sang Angular, chỉ khác cách lấy đối tượng.*

**Preview page:** `design-system/preview/components/service.html`
**JS bundle:** `design-system/sd-components/sd-components.js`

**Ánh xạ Angular → mirror:**

| Angular | Mirror |
|---------|--------|
| `inject(SdNotifyService)` | `window.SdNotifyService` |
| `inject(SdConfirmService)` | `window.SdConfirmService` |
| `inject(SdLoadingService)` | `window.SdLoadingService` |

---

## SdNotifyService

> **Icon toast dùng bộ FILLED** (`material-icons`), cả 4 loại success/info/warning/error đều đặc.
> Lý do: trong font Material Icons **Outlined**, `warning` và `error` không có bản nét viền nên vẫn
> vẽ đặc, còn `check_circle`/`info` thì có — để nguyên outlined thì 4 toast lệch nhau, 2 đặc 2 viền.
> Cùng cách `STATUS_MAP` của `sd-badge` đã xử lý cho success/warning/error.
>
> **Đối chiếu Core:** toast thật không dùng icon font mà vẽ inline SVG
> (`fill: none; stroke: currentColor; stroke-width: 1.8`) nên cả 4 đều là **nét viền**, đặt trong
> vòng tròn nền nhạt 32px. Kit cố ý chọn filled theo yêu cầu của Builder (2026-10-06) — đây là
> khác biệt có chủ ý, không phải sót.
>
> **Chữ trong toast:** tiêu đề 14px/600; **text description dùng T14R** (14px / 400 / line-height 20px)
> và **màu Default** `--sd-black500` (#212121, cùng màu tiêu đề). Core cũng để body 14px và không set
> màu, tức kế thừa màu chữ mặc định.

Toast - hiển thị thông báo ngắn ở góc màn hình, hỗ trợ hàng chờ. Bên Angular gọi `inject(SdNotifyService).success(message, options)`.

| Phương thức | Tham số | Trả về | Mô tả |
|-------------|---------|--------|-------|
| `success(message, options)` | `message: string`, `options` | `void` | Toast loại success |
| `info(message, options)` | `message: string`, `options` | `void` | Toast loại info |
| `warning(message, options)` | `message: string`, `options` | `void` | Toast loại warning |
| `error(message, options)` | `message: string`, `options` | `void` | Toast loại error |

**Tuỳ chọn:**

| Tuỳ chọn | Giá trị | Mặc định | Mô tả |
|----------|--------|----------|-------|
| `title` | string | - | Tiêu đề toast |
| `actionLabel` | string | - | Nhãn nút hành động; có thì hiện nút trong toast |
| `duration` | number (ms) | 4000 | Tự đóng toast sau khoảng thời gian; 0 = không tự đóng |

Portal chỉ đọc trực tiếp được `.success()`; `.info()` / `.warning()` / `.error()` suy ra từ bộ giá trị của `type` (success, info, warning, error). Portal không có phương thức chung kiểu `.show(type, ...)` nên mirror không tự thêm.

```js
SdNotifyService.success('Bản ghi đã được lưu trữ thành công.', {
  title: 'Lưu thành công',
  actionLabel: 'Xem chi tiết'
});
```

---

## SdConfirmService

Modal xác nhận dựng trên `sd-modal` + `sd-input` + `sd-radio` + `sd-date` có sẵn. Cả bốn phương thức trả về Promise: resolve khi chọn Đồng ý, reject khi hủy (Portal ghi rõ ngữ nghĩa này - hủy là reject, không phải resolve(false)).

| Phương thức | Tham số | Trả về | Mô tả |
|-------------|---------|--------|-------|
| `confirm(message, options)` | `message: string`, `options` | `Promise<void>` | Xác nhận đơn giản; chỉ phương thức này có tuỳ chọn `width` |
| `withInput(message, options)` | `message: string`, `options` | `Promise<string>` | Nhập text trong dialog |
| `withRadio(message, options)` | `message: string`, `options` | `Promise<string>` | Chọn 1 item; trả về `value` của mục được chọn |
| `withDate(message, options)` | `message: string`, `options` | `Promise<string>` | Chọn/nhập ngày trong dialog |

**Tuỳ chọn dùng chung:**

| Tuỳ chọn | Giá trị | Mặc định | Mô tả |
|----------|--------|----------|-------|
| `title` | string | - | Tiêu đề dialog |
| `yesTitle` | string | `Đồng ý` | Nhãn nút xác nhận |
| `noTitle` | string | `Bỏ qua` | Nhãn nút bỏ qua - kit chỉ dùng Bỏ qua / Thoát / Quay lại |
| `yesButtonColor` | `primary`, `secondary`, `success`, `error`, `warning`, `info` | `primary` | Màu nút xác nhận |
| `noButtonColor` | `primary`, `secondary`, `success`, `error`, `warning`, `info` | `secondary` | Màu nút bỏ qua |

**Tuỳ chọn riêng:**

| Phương thức | Tuỳ chọn | Mô tả |
|-------------|----------|-------|
| `confirm` | `width` | CSS width, mặc định `400px` - Portal ghi rõ chỉ `.confirm()` hỗ trợ, 3 phương thức kia không có |
| `withInput` | `maxlength`, `defaultValue`, `required` | Giới hạn ký tự, giá trị khởi tạo, bắt buộc |
| `withRadio` | `items`, `valueField`, `displayField`, `display` (`column`/`row`), `defaultValue`, `required` | Nguồn item và field hiển thị; `required` vô hiệu nút Đồng ý tới khi chọn |
| `withDate` | `placeholder`, `defaultValue`, `required` | Placeholder, ngày khởi tạo, bắt buộc |

`required = true` thì nút Đồng ý bị vô hiệu tới khi có giá trị hợp lệ. Nút dùng `sd-button`, màu theo `yesButtonColor` / `noButtonColor`, không custom CSS.

Nút huỷ (theo `noTitle`) là `sd-button` kiểu mặc định (`light`) màu `noButtonColor || 'secondary'` — nền xám nhạt, chữ đen — đúng thư viện / catalog `#c-confirm`. Builder chốt 2026-10-13: *"Kiểu catalog, giữ chữ Bỏ qua"* — chữ mặc định vẫn "Bỏ qua" (Rule 16; thư viện là "Hủy bỏ"). Bản trước (link primary theo Rule 17) đã đổi.

```js
const value = await SdConfirmService.withRadio('Vui lòng chọn quyền truy cập phù hợp:', {
  title: 'Chọn quyền',
  yesTitle: 'Áp dụng',
  noTitle: 'Bỏ qua',
  items: [
    { id: '1', name: 'Hiển thị dữ liệu Vùng Cơ bản' },
    { id: '2', name: 'Giới hạn danh sách nhân viên' }
  ],
  valueField: 'id',
  displayField: 'name',
  display: 'column',
  required: false
});
```

---

## SdLoadingService

Phủ lớp trắng mờ (opacity 0.6) kèm spinner vòng tròn màu primary lên một phần tử
(chọn bằng CSS selector) hoặc cả `body`. Mỗi phần tử chỉ có một lớp phủ; `stop()`
gỡ nó ra. Mirror `SdLoadingService` của Core UI Catalog `#c-loading`
(rà soát 2026-10-12).

| Phương thức | Tham số | Trả về | Mô tả |
|-------------|---------|--------|-------|
| `start(selector = 'body')` | CSS selector | — | Phủ lớp loading lên phần tử. Phần tử đã đang loading thì không làm gì |
| `stop(selector = 'body')` | CSS selector | — | Gỡ lớp phủ khỏi **đúng phần tử đó** |
| `isLoading(selector = 'body')` | CSS selector | `boolean` | Phần tử có đang loading không |

**Điểm dễ sai:**

- **`start` và `stop` phải cùng selector.** `stop()` không tham số chỉ gỡ lớp phủ
  của `body` — gọi `start('#khung')` rồi `stop()` thì lớp phủ trên `#khung` **còn
  nguyên**. Bản trước của kit chỉ có một lớp phủ toàn cục nên `stop()` gỡ được hết;
  thư viện thật thì không.
- **Phần tử đích phải có `position: relative`.** Service KHÔNG tự đặt: lớp phủ là
  `position: absolute; 100% × 100%`, nên nó bám vào tổ tiên gần nhất có position.
  Dùng lớp tiện ích `relative`.
- **Spinner cũng mờ** theo opacity 0.6 của lớp phủ — đúng hành vi thật, không phải lỗi.
- **`start()` phủ `body`** bằng `absolute` 100% × 100%, không phải `fixed` — trang dài
  cuộn xuống thì lớp phủ cuộn theo.

```js
SdLoadingService.start('#funding-plan-card');      // <div id="funding-plan-card" class="position-relative">
try { await fetchSomething(); } finally { SdLoadingService.stop('#funding-plan-card'); }

SdLoadingService.start();                    // phủ body
const busy = SdLoadingService.isLoading();   // true
SdLoadingService.stop();
```

> Dạng cũ `start({ target, duration })` vẫn chạy (bí danh tương thích ngược) nhưng
> **không dùng cho trang mới**.
