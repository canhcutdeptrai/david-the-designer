# DS Mirror - Báo cáo vòng sửa FIX-03

Ngày: 2026-09-19

File sửa: `design-system/sd-components/sd-components.js`

## Lỗi chính - sd-anchor mất scroll tracking sau khi bị chuyển chỗ trong DOM

Đã di chuyển đoạn gắn listener cuộn ra khỏi nhánh chạy-một-lần `if (!this._wrapper)` của `_render()`, đưa vào `connectedCallback()` ngay sau `this._render()` (vì cần `this._content` đã tồn tại), theo đúng khuôn `_resizeBound` của `SdTabGroup`:

```js
if (!this._scrollBound && this._content) {
  this._scrollBound = function () {
    self._updateActive();
  };
  this._content.addEventListener('scroll', this._scrollBound);
}
```

Chưa sửa gì khác: giữ nguyên `disconnectedCallback()`, công thức chọn mục active, ngưỡng 80px, không đổi API, không rewrite component. Trước đây `_render()` gắn listener bên trong khối dựng `_wrapper` nên disconnect/reconnect làm `connectedCallback()` chạy lại, `_render()` thấy `_wrapper` còn tồn tại bỏ qua cả khối, và listener không bao giờ được gắn lại (`_scrollBound` = false). Sau sửa, mỗi lần connect lại đều tự gắn lại listener nếu chưa có.

## Kết quả rà cùng lớp lỗi ở toàn bộ file

Đã rà mọi nơi có `addEventListener` / `MutationObserver` / `disconnectedCallback` trong `design-system/sd-components/sd-components.js`:

- `SdAnchor` - CÓ LỖI, đã sửa. Listener scroll gắn trong `_render()` nhánh chạy-một-lần nhưng bị gỡ ở `disconnectedCallback()`. Đã chuyển việc gắn sang `connectedCallback()` với guard `!this._scrollBound`. Observer của `SdAnchor` đặt đúng trong `connectedCallback()` nên không lỗi.
- `SdTabGroup` - đã đúng sẵn. `_resizeBound` gắn trong `connectedCallback()` với guard, `disconnectedCallback()` gỡ đúng. `_observer` cũng tạo và observe trong `connectedCallback()` với guard, ngoài nhánh chạy-một-lần, nên reconnect gắn lại được. Lưu ý `_rebuildHeader()` có ngắt observer quanh lúc sửa header và không tự tạo lại observer vì observer sống ở `connectedCallback()`, không rơi vào mẫu lỗi.
- `SdStepper` - đã đúng sẵn. `_observer` tạo và observe trong `connectedCallback()` với guard `!this._observer`, ngoài nhánh `if (!this._wrapper)` của `_render()`, nên disconnect/reconnect gắn lại được. Không có listener nào khác bị gỡ ở `disconnectedCallback()` (header dựng lại thêm listener click mới cho từng phần tử mới, không cần gắn lại trên host).
- `SdSelect` - đã đúng sẵn. `_clickHandler` / `_outsideHandler` được gắn trong `_bindEvents()` (chạy từ `connectedCallback`), bản thân `_bindEvents()` còn tự gỡ listener cũ trước khi gắn lại để tránh duplicate, và `disconnectedCallback()` gỡ đúng. Không rơi vào mẫu chạy-một-lần.
- `SdTable` - đã đúng sẵn, không rơi vào mẫu lỗi. `_bind()` gắn listener một lần qua guard `_bound` nhưng `SdTable` không có `disconnectedCallback()` gỡ listener nào, nên không có chuyện "gỡ rồi không gắn lại". Listener document click đóng menu cũng không bị gỡ theo lifecycle của element.
- `SdChip` - đã đúng sẵn. Không có `disconnectedCallback()` gỡ listener; `connectedCallback()` luôn gọi `_render()` + `_bind()` mỗi lần connect nên không thể mất listener sau khi chuyển chỗ DOM.
- `SdSideDrawer` - đã đúng sẵn, không rơi vào mẫu lỗi. Listener backdrop/close gắn trên element mới được tạo trong `_render()`; không có `disconnectedCallback()` gỡ chúng. `connectedCallback()` dùng guard `!_rendered` nên element chỉ render một lần, không nhân đôi listener.
- `SdModal` - đã đúng sẵn, không rơi vào mẫu lỗi. Listener backdrop/close gắn trên element mới dựng trong render; không có `disconnectedCallback()` gỡ chúng nên không có chuyện gỡ mà không gắn lại.
- `SdSection` / `SdSectionItem` - đã đúng sẵn, không rơi vào mẫu lỗi. Không có listener nào bị gỡ trong lifecycle; guard `_rendered` chỉ chặn render trùng lặp, listener collapse gắn lên element mới.
- `SdScorecard` / `SdInform` / `SdUploadFile` / `SdInput` / `SdDate` / `SdDatetime` / `SdInputNumber` / `SdTextarea` / `SdButton` / `SdCheckbox` / `SdRadio` / `SdSwitch` / `SdBadge` / `SdAvatar` - đã kiểm, không có `disconnectedCallback()` gỡ listener, listener gắn lại qua `_bind()`/`_bindEvents()` hoặc trên phần tử mới ở mỗi lần render, không rơi vào mẫu lỗi.

Kết luận: chỉ đúng một chỗ dính mẫu lỗi là `SdAnchor` scroll tracking, đã sửa xong theo đúng khuôn có sẵn trong file.
