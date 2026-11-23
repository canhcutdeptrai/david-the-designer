# DS Mirror - Báo cáo sửa lỗi vòng 2 (FIX-02)

## Lỗi 1 - TypeError lúc khởi tạo sd-tab-group

Đã thêm guard `if (!this._wrapper) return;` vào đầu hàm `_applyAppearance()` của `SdTabGroup` trong `design-system/sd-components/sd-components.js`. Lỗi gốc: `attributeChangedCallback` chạy trước `connectedCallback` với các attribute đã có sẵn trong HTML, mà tại thời điểm đó `this.isConnected` đã là `true` nên guard cũ không chặn, và `_wrapper` chưa được tạo (chỉ được tạo trong `_render()` từ `connectedCallback`) nên đọc `this._wrapper.classList` ném TypeError. Sau khi guard, lần gọi quá sớm bị bỏ qua; khi `connectedCallback()` chạy, `_render()` tạo `_wrapper` rồi tự gọi lại `_applyAppearance()` nên không mất hiệu ứng nào.

Đã rà thêm theo yêu cầu và phát hiện cùng mẫu bệnh ở hai chỗ khác, đã guard y như trên:

- `SdStepper._applyAppearance()`: `attributeChangedCallback` gọi thẳng hàm này khi `_wrapper` chưa tồn tại, cùng cơ chế và cùng lỗi tiềm ẩn với `SdTabGroup` - đã thêm `if (!this._wrapper) return;`.
- `SdAnchor._applyAppearance()`: đọc thẳng `this._wrapper` mà không có guard riêng trong hàm. Hiện tại nó chỉ được gọi qua `_rebuild()` vốn đã có guard `if (!this.isConnected || !this._wrapper || !this._nav) return;` nên chưa gây lỗi thực tế, nhưng để phòng cùng lớp lỗi, đã thêm guard tương tự cho chính hàm.

Đã kiểm các component còn lại trong phạm vi yêu cầu: `SdChip` và `SdTab` không có hàm nào đọc thẳng thuộc tính nội bộ do `_render()` tạo ra mà thiếu guard - `_bind()` và `_syncChipsUi()` của `SdChip` đều null-check qua `querySelector`, `_chipsHtml()` chỉ đọc `this._values` khởi tạo trong constructor, `_notifyGroup()` của `SdTab` chỉ đọc `parentElement` - nên không đụng tới.

## Lỗi 2 - sd-chip cao hơn sd-input 2px ở cả 3 size

Đã chỉnh chiều cao ngoài của `.sd-form-field` bên trong `sd-chip` trong `design-system/core/styles/sd-tokens.css` bằng cách đổi giá trị padding dọc, không thêm `!important`:

- `sd-chip .sd-form-field`: padding-top/bottom từ 6px đổi thành 5px.
- `sd-chip .sd-form-field.sd-sm`: padding-top/bottom từ 4px đổi thành 3px.
- `sd-chip .sd-form-field.sd-lg`: padding-top/bottom từ 8px đổi thành 7px.

Cách `sd-input` tính chiều cao mà tôi làm theo: `.sd-form-field` base dùng `min-height: var(--sd-input-height)` (28/36/44px) với `border: 1px solid` và không có padding dọc, và toàn bộ trang dùng reset `*, *::before, *::after { box-sizing: border-box; }` trong `layout.css` nên chiều cao ngoài của sd-input bằng đúng giá trị token - phần tử input `.sd-input` chiếm `height: 100%` bên trong min-height đó. Với cùng border-box, sd-chip đang có padding dọc 6/4/8px mỗi bên cộng border 1px mỗi bên cộng chip/input cao 24/20/28px khiến tổng ngoài vượt min-height nên thực đo 38/30/46px. Đổi padding dọc thành 5/3/7px mỗi bên để tổng ngoài = content (24/20/28) + border (2) + padding (10/6/14) = đúng 36/28/44px, khớp token và khớp sd-input. Chip xuống nhiều dòng vẫn cao hơn tự nhiên do flex-wrap - đó là đúng, không đổi.

## Phạm vi đã thực hiện

Chỉ sửa đúng hai file được giao: `design-system/sd-components/sd-components.js` (thêm 3 guard vào `_applyAppearance` của `SdTabGroup`, `SdStepper`, `SdAnchor`) và `design-system/core/styles/sd-tokens.css` (đổi 3 cặp giá trị padding dọc của sd-chip). Tạo mới `DS-MIRROR-REPORT-FIX-02.md`. Không đổi API, tên class, không đụng trang preview, không đụng các file report khác, không git commit. Kiểu xuống dòng LF của cả hai file được giữ nguyên.
