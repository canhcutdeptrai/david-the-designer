# DS-MIRROR-REPORT-08 - sd-preview-image + sd-preview-pdf

## 1. File đã sửa / tạo

- Sửa: `design-system/sd-components/sd-components.js` - thêm `SdPreviewImage` (define `sd-preview-image`) và `SdPreviewPdf` (define `sd-preview-pdf`) ngay sau `sd-query-bar`, cập nhật comment header của file.
- Sửa: `design-system/core/styles/sd-tokens.css` - thêm toàn bộ style của hai component ở cuối file, chỉ dùng token có sẵn.
- Sửa: `design-system/preview/shared-nav.js` - thêm `Preview Image` và `Preview PDF` vào nhóm Overlay (`sub-overlay`), không đặt `legacy: true`, không đụng mục cũ.
- Sửa: `design-system/preview/index.html` - thêm 2 card theo đúng khuôn card đang có, icon `image` và `picture_as_pdf`, đặt cạnh card sd-modal.
- Sửa: `design-system/components/sd-overlay.md` - thêm mục `## sd-preview-image` và `## sd-preview-pdf` (văn phong theo các mục đang có, không hard-wrap, không dùng em dash).
- Sửa: `design-system/components/sd-components.md` - chỉ cập nhật bảng "Quick lookup - Component → Group file" như yêu cầu.
- Tạo: `design-system/preview/components/preview-image.html`.
- Tạo: `design-system/preview/components/preview-pdf.html`.
- Tạo: `DS-MIRROR-REPORT-08.md` (file này).

## 2. Thuộc tính và event đã mirror; cái nào bỏ + vì sao

`sd-preview-image`: mirror đủ 8 input của Portal (`items`, `thumbnailPosition`, `theme`, `loop`, `showToolbar`, `zoomable`, `downloadable`, `title`) và đủ 4 event (`close`, `activeIndexChange`, `download`, `imageError`). Mirror bổ sung thêm `src` attribute chấp nhận một URL ảnh - đây là tiện ích cho prototype được brief cho phép ("nếu làm vậy thì GHI vào tài liệu"), không phải input của Portal, đã ghi rõ trong tài liệu và báo cáo.

`sd-preview-pdf`: mirror đủ 8 input (`source`, `sidebar`, `sidebarOpen`, `initialZoom`, `theme`, `showToolbar`, `downloadable`, `title`) và đủ 6 event (`loaded`, `pageChange`, `zoomChange`, `download`, `loadError`, `close`). `httpHeaders`/`withCredentials` trong `PdfSource` được ghi nhận và giữ lại trong object chuẩn hoá nhưng mirror không dùng được - iframe trình duyệt không gửi header custom; đã ghi vào tài liệu.

Không có input nào của Portal bị cố ý bỏ. Không thêm input nào ngoài Portal ngoài `src` convenience đã được brief đồng ý. `sidebar` chỉ nhận giá trị `thumbnails` (default đọc được từ Portal) - giá trị khác Portal chưa công bố nên mirror không tự thêm, mọi giá trị khác quy về `thumbnails` (không hỗ trợ `none`).

## 3. Giá trị SUY RA (không đọc được từ bảng thử nghiệm Portal)

- `thumbnailPosition`: `bottom` là mặc định đọc được từ Portal; `top`, `left`, `right` là suy ra hợp lý theo tên input.
- `theme`: `dark` là mặc định đọc được từ Portal; `light` là suy ra.
- `sidebar`: chỉ `thumbnails` đọc được từ Portal; không suy ra thêm giá trị nào khác.
- `sidebarOpen`: mặc định `false` (bảng Portal hiện "-").
- `loop`: mặc định `false`; `showToolbar`: mặc định `false`; `zoomable`: mặc định `true`; `downloadable`: mặc định `true` (bảng Portal hiện "-" cho cả bốn).
- `initialZoom`: `page-fit`, `width`, `actual`, số cụ thể đã đọc được; scale chạy 0.25-4 lấy theo mô tả event `zoomChange` của Portal. Mirror nhận thêm dạng "150%" và "150" rồi quy về scale (suy ra).
- `sd-preview-pdf` event page/zoom: mirror chỉ phát trạng thái khởi tạo (page=1, zoom=giá trị initialZoom) đúng một lần khi iframe load xong, vì đổi trang/zoom thật cần pdf.js.

## 4. sd-preview-pdf - mirror được gì, cần pdf.js cái gì

Mirror được: hiển thị tài liệu qua `<iframe>` trình duyệt, bật/tắt sidebar (nút menu), chuyển tab Trang/Mục lục trong sidebar (khung UI, nội dung bên trong là ghi chú), tải xuống (nút download + event), fullscreen, phát đủ 6 event. `sd-loaded` phát `totalPages: null` và không giả vờ số trang thật.

Cần pdf.js nên render disabled kèm `data-sd-tooltip` giải thích: dải thumbnail từng trang, ô tìm chữ + nút "Tìm", nhảy tới trang cụ thể (first/last, prev/next, page indicator), zoom theo từng trang (`remove`, phần trăm, `add`, vừa trang `fit_screen`, vừa rộng `swap_horiz`), xoay (`rotate_right`), chế độ từng trang (`description`), chế độ view_carousel, in (`print`).

Ngoài ra: `sd-load-error` thật (invalid/password/network) không bắt được từ iframe - mirror chỉ phát `reason: "unknown"` khi thiếu source; đã ghi vào tài liệu.

## 5. Cách nhận items / source

`items` (sd-preview-image) và `source` (sd-preview-pdf) nhận theo property JS `.items` / `.source` - ghi vào là chuẩn hoá và render lại, bám đúng khuôn property setter + `_scheduleRender` của `SdQueryBar` và cách nhận cấu hình của `SdTable`. `items` cũng nhận attribute JSON `items='[...]'`; cả hai nhận attribute `src` chứa một URL đơn (mirror thêm, ghi trong tài liệu). File/Blob/ArrayBuffer/Uint8Array qua property - object URL tạo lazy và chỉ revoke khi thay `items`/`source`, KHÔNG revoke lúc `disconnectedCallback` vì kit tự di chuyển node (sd-modal, sd-section, pattern-loader) - revoke lúc di chuyển sẽ làm vỡ ảnh/PDF thật trong modal.

## 6. Token thiếu phải hardcode

Không thiếu token cho nền tối: `theme="dark"` dùng `--sd-dark` (= `--color-neutral-900`) có sẵn, toolbar dùng `--color-neutral-950`, text/chip dùng thang neutral có sẵn. Chỗ phải hardcode: hai lớp overlay mờ `rgba(0,0,0,0.55)` (counter góc trên, số thứ tự thumbnail) và `rgba(0,0,0,0.55)` không có token tương đương trong kit - danh sách này đã được cân nhắc: kit không có token surface overlay tối. Ngoài ra zoom/xoay dùng inline `style="transform:scale(...) rotate(...)"` sinh lúc render (trạng thái động, không phải hardcode style tĩnh), đây là điểm cần nghiệm thu nếu luật "inline style chỉ cho 3 trường hợp" tính là vi phạm.

## 7. Xác nhận ba bẫy vòng đời + bẫy attribute title

- Bẫy 1 - `attributeChangedCallback` chạy trước `connectedCallback`: đã xử lý. Cả hai component guard `if (this._strippingTitle) return; if (!this._rendered) return;` trước khi đụng DOM, `_render()` chỉ tạo DOM mới sau khi các biến nội bộ đã set, `_readAttributes()` đọc từ attribute chứ không từ DOM do `_render()` tạo.
- Bẫy 2 - listener document bị mất khi node chuyển chỗ: đã xử lý. Keydown + fullscreenchange của cả hai component được gắn trong `connectedCallback` với guard `if (!this._docKeyBound)` / `if (!this._fsBound)` và gỡ trong `disconnectedCallback` (đối chiếu `_resizeBound` của `SdTabGroup` và `_docKeyBound` của `SdQueryBar`). Listener click gắn trên host một lần (`this._bound`), không gắn lại khi reconnect để tránh nhân đôi.
- Bẫy 3 - `document.currentScript` muộn ra null: không dính - hai component này không cần asset path, không gọi `document.currentScript`, không gọi `sdAssetPath`.
- Bẫy attribute `title`: chép đúng cơ chế `SdInform` - đọc `title` vào `this._title`, `removeAttribute('title')` với cờ `this._strippingTitle` chặn `attributeChangedCallback` đọc ra rỗng; cả hai component nhận `title` vào `observedAttributes` và dùng `_title` cho tên tài liệu/file hiển thị.
