# DS Mirror - Báo cáo lượt 02 (sd-tab-group + sd-tab, sd-chip)

Bản giao việc làm đủ cả 2 nhóm component, mỗi nhóm đủ 6 đầu việc: component JS, CSS token, trang preview, nav, card index, tài liệu. Chỉ sửa đúng phạm vi file được liệt kê, không đụng phần sd-switch/sd-modal của lượt trước.

## 1. Danh sách file đã sửa / tạo

Đã sửa:

- `design-system/sd-components/sd-components.js` - thêm `SdChip`, `SdTab`, `SdTabGroup`, cập nhật header comment
- `design-system/core/styles/sd-tokens.css` - thêm khối style sd-tab-group và sd-chip
- `design-system/preview/shared-nav.js` - thêm Tab Group vào nhóm Layout, Chip vào nhóm Form
- `design-system/preview/index.html` - thêm 2 card (sd-tab-group icon `tab`, sd-chip icon `label`)
- `design-system/components/sd-layout.md` - thêm mục sd-tab-group + sd-tab
- `design-system/components/sd-form.md` - thêm mục sd-chip
- `design-system/components/sd-components.md` - cập nhật bảng Files theo functional group và Quick lookup

Đã tạo:

- `design-system/preview/components/tab-group.html`
- `design-system/preview/components/chip.html`
- `DS-MIRROR-REPORT-02.md` (file này)

## 2. Thuộc tính đã mirror và thuộc tính cố ý bỏ

### sd-tab-group

Đã mirror đủ 4 input của Portal: `variant` (line/pills/segmented, mặc định line), `selectedIndex` (mặc định 0), `stretchTabs`, `animationDuration`. Đọc cả camelCase lẫn thường (giống `helperText` của sd-checkbox). Event `sd-tab-change` `{ index }` ánh xạ tới `(selectedIndexChange)`; event `sd-tab-close` `{ index, label }`, `cancelable: true`, ánh xạ tới `(close)`. Phơi đúng 4 CSS custom property trên host: `--sd-tab-indicator-color`, `--sd-tab-label-active-color`, `--sd-tab-badge-bg`, `--sd-tab-badge-color` với đúng mặc định `var(--sd-primary)` / `var(--sd-primary-light)`. Dùng đúng 2 tên class DOM đã đo: `.sd-tab-group` và `.sd-tab__label`. Nội dung tab di chuyển node gốc vào `.sd-tab-panels` (không chép innerHTML) nên event listener bên trong tab vẫn sống.

Cố ý bỏ: `beforeClose` của Portal (hàm trả boolean/Observable chặn đóng). Web Component không nhận hàm qua attribute nên mirror không dựng input này; thay thế bằng việc event `sd-tab-close` có `cancelable: true` - trang gọi `preventDefault()` là chặn đóng, không gọi thì mirror tự xoá tab khỏi DOM (bên Angular parent tự xoá khỏi model sau khi nhận `(close)`).

### sd-chip

Đã mirror toàn bộ API Portal: `model` ánh xạ sang attribute `value` (danh sách phân tách bằng dấu phẩy) + property JS `.value` trả về mảng `(string | number)[]`; `label`, `placeholder`, `size` (sm/md/lg dùng token `--sd-input-height-sm` / `--sd-input-height` / `--sd-input-height-lg` theo đúng cách `sd-input` đang dùng), `required`, `min` (chặn xoá dưới mức), `max` (chạm mức thì không nhận thêm), `removable`, `disabled`. Không thêm thuộc tính nào Portal không có. Event `sd-change` `{ value: Array }` ánh xạ tới `[(model)]`. Khung ngoài dùng lại `.sd-form-field` (shared form-field wrapper có sẵn trong sd-tokens.css), không dựng khung riêng. Icon xoá là `<span class="material-icons-outlined mi-16">cancel</span>` đúng brief.

## 3. Những chỗ phải tự quyết

- `stretchTabs` mặc định `false`: đây là GIẢ ĐỊNH, không phải số đọc được - mọi demo trên Portal đều truyền `[stretchTabs]="false"` tường minh. Chọn `false` vì đó là hành vi duy nhất quan sát được.
- `animationDuration` mặc định `300ms`: portal mặc định để trống, không có số đo; chọn 300ms là giá trị transition hợp lý và dễ ghi đè.
- Hành vi `beforeClose` nêu ở mục 2: mirror tự xoá tab khi không bị chặn, dựa trên giả định parent Angular sau khi nhận `(close)` cũng xoá khỏi model. Đây là thay thế hợp lý duy nhất cho prototype mà không có Angular parent.
- `removable` mặc định: Portal để trống nên không đọc được; mirror giả định mặc định CHO xoá, `removable` có mặt vẫn như vậy. Nếu điều phối xác nhận lại được từ Portal rằng mặc định khác, chỉ cần đổi điều kiện hiện nút X.
- Pills và segmented không có số đo từ Portal (chỉ line được đo): tự chốt giá trị theo token hiện có - pills cao 32px, padding 0 16px, bo 100px, active dùng `var(--sd-primary-light)`; segmented là container border 1px, padding 3px, segment cao 28px, active nền `var(--color-neutral-0)` + shadow nhẹ. Phần này điều phối sẽ xác nhận trực quan.
- Indicator line variant: làm indicator di chuyển thật (position absolute, left/width đặt bằng JS, transition theo `animationDuration`) thay vì chỉ đổi màu tab, để `animationDuration` có ý nghĩa như Portal. Vị trí đo lại trên window resize và sau requestAnimationFrame; nếu group nằm trong vùng ẩn lúc khởi tạo thì indicator chỉ định vị sau khi hiển thị.
- Phát hiện và chặn một vòng lặp vô hạn tiềm ẩn: MutationObserver giám sát subtree host sẽ bị chính `_rebuildHeader` kích hoạt lại khi sửa DOM header, nên `_rebuildHeader` ngắt observer quanh lúc rebuild rồi nối lại.
- `mi-16`: brief yêu cầu class này nhưng utilities.css của kit không định nghĩa `.mi-16` (các trang preview cũ cũng đang dùng `mi-16` như một no-op). Với icon bên trong component, mirror tự set `font-size: 16px` trong CSS riêng nên hiển thị đúng 16px bất kể `mi-16` có hiệu lực hay không.

## 4. Token thiếu phải hardcode

Không thiếu token màu nào: mọi màu lấy từ CSS variables. Hai chỗ dùng giá trị kỹ thuật không phải màu là box-shadow rgba(0,0,0,...) cho segmented active và shadow của dropdown/badge - file gốc đã hardcode shadow dạng rgba từ trước, mirror làm theo. Chiều cao/bo góc dùng token có sẵn (`--sd-input-height-*`, `--sd-border-radius`), font dùng `var(--sd-font-family)`.

## 5. Chỗ chưa chắc khớp Portal

- Số đo pills/segmented (mục 3) - không có số liệu Portal, cần nghiệm thu trực quan.
- Hành vi khi chạm `max` của chip: mirror để ô nhập vẫn gõ được nhưng Enter/Comma không thêm chip; Portal không rõ có chặn gõ hẳn hay đổi UX khác.
- Indicator: Portal đo mẫu là mày `rgb(0, 92, 187)` theo theme của Portal; kit này `--sd-primary` là màu brand riêng (hiện là mh-brown), mirror dùng token chứ không hardcode hex.
- Enter phân tách nhiều giá trị `a,b` thành 2 chip trong một lần gõ: là hành vi hợp lý của "Enter hoặc Comma" nhưng không có bằng chứng Portal làm vậy.
- Kích thước 3 size của chip (sm 20px, md 24px, lg 28px cho thân chip) tự chốt để tổng chiều cao khớp token `--sd-input-height-*` (28/36/44px); không có số đo chip cụ thể từ Portal.
