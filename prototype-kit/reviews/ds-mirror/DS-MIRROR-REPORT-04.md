# DS Mirror Report 04 - sd-splitter + sd-splitter-panel

## 1. File đã sửa / tạo

Sửa:
- `design-system/sd-components/sd-components.js` - thêm `SdSplitterPanel` + `SdSplitter`
- `design-system/core/styles/sd-tokens.css` - thêm block style sd-splitter, chỉ dùng token có sẵn
- `design-system/preview/shared-nav.js` - thêm mục Splitter vào nhóm Layout
- `design-system/preview/index.html` - thêm 1 card sd-splitter (icon `splitscreen`)
- `design-system/components/sd-layout.md` - thêm mục `## sd-splitter` và `## sd-splitter-panel`
- `design-system/components/sd-components.md` - cập nhật bảng Files + Quick lookup

Tạo mới:
- `design-system/preview/components/splitter.html` - trang preview 3 tab, 8 demo
- `DS-MIRROR-REPORT-04.md` - file này

## 2. Thuộc tính đã mirror, thuộc tính Portal có mà cố ý bỏ

`sd-splitter`: `orientation` (mặc định horizontal), `snapThreshold`, `storageKey`, `disabled` (mặc định false).

`sd-splitter-panel`: `panelId`, `size`, `unit` (px hoặc bỏ trống = flex), `minSize`, `maxSize`, `collapsible` (mặc định false), `resizable`.

Không bỏ thuộc tính nào. Riêng `resizable`: Portal viết `resizable="false"` là chuỗi nên mirror chỉ coi là vô hiệu khi giá trị đúng bằng chuỗi `"false"` - attribute boolean kiểu có/không (`resizable=""`) vẫn resizable bình thường.

## 3. Chỗ phải TỰ QUYẾT

- **Gutter 4px, hover/focus/dang kéo chuyển sang `var(--sd-primary)`:** Portal không quy định chi tiết, chọn 4px để đủ rộng cho pointer + tab focus mà không tốn diện tích.
- **Snap collapse:** Portal mô tả "Kéo Sidebar/Detail xuống dưới 40% min → snap collapse". Mirror giải thích là ngưỡng = `minSize × snapThreshold` (flex tính theo % tổng kích thước, px tính theo số px tuyệt đối), chỉ áp dụng khi panel khai `minSize`. Công thức chính xác chưa xác nhận được trên Portal.
- **Double-click handle:** toggle panel bên trái; nếu panel đó không collapsible thì thử panel bên phải.
- **Kích thước nội bộ:** mirror quy mọi panel về px nội bộ (flex ratio ban đầu chia theo % tổng). Khi container đổi kích thước, panel px giữ nguyên, panel flex giãn lại theo tỉ lệ - user không mất trạng thái collapsed/size đã kéo.
- **Chiều cao host:** `sd-splitter` styled `height: 100%` (giống sd-anchor) để kích thước truyền xuyên qua chuỗi parent → splitter → wrapper → panel, giữ splitter lồng nhau (vertical) chạy đúng khi panel duy trì chiều cao cụ thể.
- **Event `sd-layout-change`:** detail là `{ layout: [{ panelId, size, unit, collapsed }] }` (map `(layoutChange)`), vì Portal không công bố hình dạng payload.
- **Panel gập:** ẩn về 0px có chủ đích nhưng gutter vẫn hiện để double-click / Enter / Space mở lại.
- **Phím tắt:** arrow dịch 10px (giữ Shift = 50px), Home/End về min/max, Enter/Space toggle.

## 4. Token phải hardcode

Không hardcode màu hoặc font mới. Toàn bộ màu dùng `var(--sd-primary)`, `var(--sd-black200)`, `var(--sd-black100)`. Chữ dùng `var(--sd-font-family)` kế thừa mặc định. Preview chỉ dùng inline token `var(--color-neutral-XXX)` / `var(--text-secondary)` cho nền panel demo (giống các trang preview khác).

## 5. Chỗ không chắc khớp Portal

- Công thức `snapThreshold` (mục 3).
- Kích thước/độ dày gutter và trạng thái hover - Portal không công bố.
- Hình dạng chính xác payload event `(layoutChange)` và format JSON `storageKey` - Portal chỉ nói "state lưu vào localStorage".
- Cách phục hồi layout khi container đổi kích thước (px giữ nguyên, flex giãn theo tỉ lệ) - chưa có bản Angular thật để đối chiếu.

## 6. Xác nhận đã xử lý hai bẫy vòng đời

**Bẫy 1 - `attributeChangedCallback` chạy trước `connectedCallback`:** mọi hàm đọc nội bộ do `_render()` tạo ra (wrapper, models, gutter...) đều guard `if (!this._wrapper) return;` ở đầu, kể cả `attributeChangedCallback` của SdSplitter. Đã kiểm bằng harness DOM giả lập: set attribute trước khi connect không crash, sau khi connect dựng wrapper và layout đúng.

**Bẫy 2 - listener mất vĩnh viễn khi node bị di chuyển:** window resize listener gắn trong `connectedCallback` bằng guard `if (!this._resizeBound)` và gỡ/null trong `disconnectedCallback` nên khi splitter bị chuyển chỗ vẫn gắn lại. Gutter được tạo mới mỗi lần `_rebuildGutters()` (gồm cả nhánh reconnect) và listener gắn ngay trên gutter mới, nên không bao giờ rơi vào nhánh chạy-một-lần mất listener. Harness xác nhận sau reconnect gutter được dựng lại có listener.
