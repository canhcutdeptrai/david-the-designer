# DS Mirror Report 01 - sd-switch và sd-modal

Báo cáo nghiệm thu mirror hai component mới: `sd-switch` (Portal /form/switch) và `sd-modal` (Portal /component/modal/*). Chỉ sửa đúng 7 file trong danh sách phạm vi và tạo 2 trang preview + file báo cáo này.

## 1. Danh sách file đã sửa / đã tạo

Đã sửa:

- `design-system/sd-components/sd-components.js` - thêm `SdSwitch` (sau sd-radio) và `SdModal` (sau sd-side-drawer), cập nhật comment header.
- `design-system/core/styles/sd-tokens.css` - thêm utility `.T18M`, block CSS sd-switch, block CSS sd-modal + 2 keyframes (`sd-modal-in`, `sd-modal-slide-up`).
- `design-system/preview/shared-nav.js` - thêm `Switch` vào nhóm Form sau Upload File, thêm `Modal` vào nhóm Overlay trước Side Drawer.
- `design-system/preview/index.html` - thêm card sd-switch vào nhóm Form Components, card sd-modal vào nhóm sd-* Components.
- `design-system/components/sd-form.md` - thêm mục `## sd-switch`, thêm dòng sd-switch vào bảng Viewed mode.
- `design-system/components/sd-overlay.md` - thêm mục `## sd-modal` đặt trước `## sd-side-drawer`.
- `design-system/components/sd-components.md` - cập nhật bảng Files theo group và bảng Quick lookup.

Đã tạo:

- `design-system/preview/components/switch.html`
- `design-system/preview/components/modal.html`
- `DS-MIRROR-REPORT-01.md`

## 2. Thuộc tính đã mirror và thuộc tính cố ý bỏ qua

### sd-switch

Đã mirror: `label`, `color` (primary, secondary, info, success, warning, error), `disabled`, `viewed`, `required`, `hideInlineError`. Input `model` two-way của Angular được biểu diễn bằng attribute boolean `checked` (đúng khuôn sd-checkbox), ánh xạ này được ghi rõ trong tài liệu và preview.

Không bỏ thuộc tính nào. `hideInlineError` được đọc nhưng là no-op: mirror không render inline-error nên attribute không có hiệu ứng thị giác (ghi chú trong docs).

### sd-modal

Đã mirror: `title`, `width` (mặc định 560px), `height` (mặc định auto), `view` (dialog, bottom-sheet), `color` (primary, success, warning, error), `hideClose`, `disableBackdropClose`, `modalClass` (string phân tách space), `lazyLoadContent`. Events `(sdClosed)` mirror thành `sd-closed` bubbles, methods `.open()` / `.close()`.

Cố ý không thêm `closeOnEsc`: Portal không nêu input này. Nếu cần đóng bằng Esc thì nên xác nhận lại với nguồn chuẩn trước khi thêm.

## 3. Những chỗ phải tự quyết

1. Render modal vào đâu: chọn render ngay trong thẻ host `<sd-modal>` với `position: fixed` khi mở (giống sd-side-drawer). Cân nhắc phương án render vào `document.body` (tránh bị overflow clip của layout) nhưng bỏ vì host `position: fixed; inset: 0` đã thoát khỏi luồng layout, và giữ modal gắn với host giúp dev đọc DOM trực quan hơn.
2. Tách slot: giữ tham chiếu node thật (không chép innerHTML) cho cả 6 slot attribute + default slot, để event listener trang preview gắn vào không bị mất qua mỗi lần re-render. `connectedCallback` nhặt slot trước khi render đè, guard `_saved !== undefined` giống SdInform.
3. Footer 3 vùng: vùng giữa dùng đúng class `.sd-modal-footer` theo danh sách class DOM đo trên Portal (nằm trong container cũng tên `.sd-modal-footer`); CSS dùng selector direct-child (specificity cao hơn) để vùng giữa không bị dính padding/background của container.
4. Viewed của switch: dùng chung `.sd-view-mode` (label + value) như các form component khác, value hiển thị "Bật"/"Tắt" theo `checked`.
5. `required` của switch: hiển thị dấu `*` đỏ sau label (color `var(--sd-error)`).
6. `color` của modal: chọn đổi background header sang tone light (`--sd-primary-light` / `--sd-success-light` / `--sd-warning-light` / `--sd-error-light`), title giữ màu tối. Portal chỉ nêu "đổi tone header" không kèm số đo, đây là cách nhìn rõ nhất trong preview.
7. Card sd-modal trong index.html: index hiện không có group "chứa Side Drawer" - file chỉ có 3 group (Patterns, sd-* Components, Form Components) và không có card nào cho side-drawer/avatar. Tôi đặt card Modal vào group "sd-* Components" ngay sau card Shared Tooltip (nhóm chứa các component overlay duy nhất hiện có). Nếu điều phối muốn có hẳn group Overlay riêng thì là việc nằm ngoài phạm vi file liệt kê, cần brief bổ sung.
8. Track OFF của switch: token gần nhất là `--sd-black200` (#E6E6E6) so với rgb(227,226,230) đo trên Portal, chênh lệch không đáng kể.
9. Label switch: dùng class `T14M` (14/500/20) + color `--sd-black500` (#212121, gần nhất với rgb(26,27,31)).
10. Modal root background: `--color-neutral-50` (#F9F9F9) thay cho rgb(250,249,253), chênh lệch (1,0,4).
11. Click label switch cũng bật/tắt: listener gắn trên `.c-switch-wrap` nên cả track lẫn label đều toggle, tránh người dùng click nhầm label thấy không phản hồi.
12. Bottom sheet: demo dùng `width="90vw"` (một preset của Portal), root bo góc trên, animation trượt lên.

## 4. Token thiếu và phải hardcode

- Backdrop modal rgba(0, 0, 0, 0.32): không có token tương đương (side-drawer đang hardcode 0.4).
- Box-shadow `.sd-modal-root` dùng đúng giá trị đo trên Portal: `rgba(15,23,42,0.18) 0 6px 18px 0` + `rgba(15,23,42,0.12) 0 1px 3px 0`; bộ shadow token có sẵn chỉ dùng rgba(0,0,0,...).
- Shadow handle switch `0 1px 3px rgba(0,0,0,0.25)`.
- `border-radius: 8px` của modal root (dimension; token `--sd-border-radius` chỉ có 4px).

Các màu khác đều nằm trong token có sẵn (`--sd-black*`, `--color-neutral-*`, `--sd-*-light/dark`).

## 5. Chỗ chưa chắc chắn khớp Portal

- `.T18M`: kit chưa có class này, tôi thêm `.T18M { font-size: 18px; font-weight: 600; line-height: 28px; }`. Portal xác nhận 18px/600 nhưng không đo được line-height chính xác - giả định 28px theo thang heading hiện có.
- Cách `color` đổi tone header: chỉ là suy đoán header nền light, Portal không cung cấp số đo nào cho trạng thái này.
- Viewed của switch hiển thị "Bật"/"Tắt": không có số đo/text minh hoạ trên Portal, tôi tự chọn chuỗi tiếng Việt.
- Cấu trúc footer 3 vùng (vùng giữa có cùng class `.sd-modal-footer`): suy ra từ danh sách class đo được, không chắc chắn 100% về vị trí/wrapper thật trong DOM Angular.
- Kích thước/kiểu bottom-sheet (full width hay giữ nguyên `width`, animation chính xác): chưa có số đo, demo dùng 90vw theo preset.
- `required` của switch: Portal chỉ liệt kê attribute, không có ảnh chụp trạng thái này; dấu `*` là quy đổi theo convention form của kit.
- Track OFF / handle shadow / modal root bg là các giá trị gần đúng bằng token có sẵn như mục 3 và 4.
