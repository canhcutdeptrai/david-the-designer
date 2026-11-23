# Brief chung — chuyển HTML thuần sang sd-* trong prototype `cam-nang-phan-quyen`

Kit: `/home/claude/kit/prototype-kit-CATALOG-1012m/` (gọi tắt KIT). Prototype: `KIT/prototypes/cam-nang-phan-quyen/`.
Builder (người dùng) yêu cầu: *"1. Sửa các chỗ vỡ … 2. Giảm HTML thường: `<button>` → `sd-button`, `<select>` → `sd-select`,
`<table>` → `sd-table` (hoặc ghi rõ lý do giữ lại). 3. Đổi tên cũ sang tên catalog … bỏ các thuộc tính Core UI không có."*
→ *"Ok làm đầy đủ đi"*. Mọi thứ phải theo Core UI catalog (`@sd-angular/core` 19.0.10) mà kit mirror.

## ĐỌC TRƯỚC (bắt buộc)
- `KIT/AGENTS.md` (Rules 0, 0b, 4, 9, 10, 11, 15, 16, 17, 18, 19).
- `KIT/_memory/lessons.md` (bẫy đã gặp) và `KIT/prototypes/cam-nang-phan-quyen/memory.md` (mục 🔥 Hot + các mục "Bẫy").
- `KIT/prototypes/cam-nang-phan-quyen/_qc-spec.md` — chỉ áp cho trang tra cứu; không được làm trang lệch QC.
- API component: `KIT/design-system/components/sd-form.md`, `sd-interactive.md`, `sd-data.md` (sd-table), `sd-layout.md`
  (sd-section, sd-tab-group/sd-tab), `KIT/ai-instructions/generate-components.md`. Trang mẫu sống:
  `KIT/design-system/preview/components/*.html` và `KIT/design-system/preview/patterns/table.html`
  (mẫu `sd-table addable` + cột `raw` dựng `sd-select`/`sd-input` trong ô, nối sự kiện `sd-change` / `sd-table-add-row`).
  Đọc mã thật khi nghi ngờ: `KIT/design-system/sd-components/sd-components.js` (tìm `class SdSelect`, `class SdTable`…).

## CẤM
- **Không sửa gì trong `KIT/design-system/`** (cũng không sửa `sd-components.js`). Thiếu năng lực thì GIỮ HTML thuần
  kèm comment lý do và ghi vào báo cáo "thiếu năng lực gì".
- **Không chạm `tra-cuu-cam-nang.html` và `styles/tra-cuu-cam-nang.css`** (bản đóng băng QC).
- Không đọc/ghi `KIT/_memory/session-handoff.md`. Không sửa file ngoài danh sách được giao.
- Không đổi nghiệp vụ / nội dung chữ / dữ liệu demo; không xoá tính năng đang chạy. Nút huỷ chỉ "Bỏ qua"/"Thoát"/"Quay lại"
  (Rule 16) — trừ nút nghiệp vụ "Hủy ủy quyền" đã ghi trong memory.md.
- Không thêm thư viện ngoài, không fetch mạng.

## Quy ước chuyển đổi
- `<button>` hành động → `<sd-button type=… color=… size=… title=… prefixIcon=…>` (icon-only: bỏ `title`, thêm
  `aria-label`). Bậc nút theo Rule 17 (fill / light / link primary). `outline` hạn chế (Rule 19). Click: `onclick` trên
  host vẫn chạy; `disabled` là attribute của host.
- Tab tự dựng (`.tab`, `*-tab`, pill tab…) → `<sd-tab-group variant="line|pills|segmented">` + `<sd-tab label badge>`
  (sự kiện `sd-tab-change` detail `{index}`; `selectedIndex`). Tab cấp trang do `page-header` sinh qua `data-page-tabs`
  thì GIỮ (pattern).
- `<select>` → `<sd-select items='[{"id":..,"name":..}]' value=… placeholder=… size="sm|md" label=…>`;
  đọc `el.value`, nghe `sd-change` (`e.detail.value`). sd-select KHÔNG có `.options` / `.selectedIndex` / `<option>` con —
  JS dùng mấy thứ đó phải viết lại theo `items` + `value`. Ô lọc trong hàng công cụ / ô bảng: `size="sm"` + `hideInlineError`.
- `<table>` dữ liệu → `<sd-table columns='…' data='…'>` (types: string, number, date, datetime, boolean, values, status,
  link, raw, action, menu; `paginated pageSize pageSizes total`, `selectable`, `hide-inline-filter`, `addable`; property
  `el.option` cho `commands` / `selector` / `items` hàm). Cột chứa markup (badge, link nhiều dòng, nút) → `type:"raw"`.
  Phân trang / chọn số dòng tự dựng (`.pg-*`, `pg-size-sel`) bỏ khi bảng đã là sd-table `paginated`.
  Bảng ma trận phức tạp (rowspan/colspan, cây lồng, bảng trong tài liệu) mà sd-table không diễn đạt nổi → GIỮ + comment.
- Checkbox / radio / toggle tự dựng → `sd-checkbox` / `sd-radio` (nhóm: `items` + `value`) / `sd-switch`.
  Ô nhập `<input>` → `sd-input` / `sd-input-number` / `sd-date` / `sd-datetime` / `sd-textarea` (đơn vị → `suffix`).
  Chip/tag tự dựng: ô nhập danh sách → `sd-chip`; nhãn hiển thị → `sd-badge type="round"`.
- Mục menu dùng lớp DS `sd-dropdown-item` (`<button class="sd-dropdown-item">` trong `sd-dropdown-menu`) là mẫu DS — GIỮ.
  Hàng cây / dòng kết quả / nút node tự vẽ mà kit chưa có component tương ứng (hoặc chuyển là dựng lại cả tương tác lõi)
  → được GIỮ nhưng phải ghi lý do.
- **Mọi chỗ còn giữ HTML thuần phải có comment `<!-- Giữ HTML thuần (2026-10-14): <lý do> -->`** (trong chuỗi JS thì
  comment JS ngay trên chỗ sinh markup). Gom được thì một comment đầu file liệt kê.
- Utility class sd-core là PIXEL (`mb-12` = 12px) và `!important`; phần tử có `d-flex`/`d-block` không ẩn được bằng
  `style.display` — dùng `hidden`/`d-none` (xem AGENTS Rule 15). Giữ nguyên line ending và encoding UTF-8 của file.
- Xoá CSS custom trong `<style>` của trang đã thành thừa sau khi chuyển (nhưng không xoá CSS còn dùng).

## Kiểm tra (bắt buộc trước khi báo xong)
1. `node /home/claude/work/round/pagecheck.mjs <file.html> /home/claude/work/round/agents/<file>.png` — phải "Không lỗi JS";
   dòng RAW cho biết số HTML thuần còn lại (đối chiếu với danh sách giữ lại có lý do).
2. Viết thêm kịch bản Playwright riêng (đặt trong `/home/claude/work/round/agents/`) bấm thử các tương tác đã đổi
   (chọn select, đổi tab, phân trang, nút hành động, thêm/xoá dòng…) — chạy được, không lỗi JS, kết quả đúng như trước.
   Chromium: `executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'`, `args:['--allow-file-access-from-files']`,
   chặn mạng `page.route(/^https?:/, r => r.abort())`. Mở dropdown sd-select: click `mat-form-field` của nó, chọn mục
   `.cdk-overlay-pane .sd-dropdown-item:has-text("…")`.
3. Xem ảnh chụp trước/sau: ảnh TRƯỚC ở `/home/claude/work/shots_before/prototypes__cam-nang-phan-quyen__<file>.png`.
   Bố cục không được vỡ; khác biệt nhìn thấy chỉ được là do đổi sang component chuẩn.

## Báo cáo trả về (ngắn, tiếng Việt)
- File đã sửa; số `<button>/<select>/<table>/<input>` trước → sau (theo pagecheck).
- Bảng: đã chuyển gì → thành gì.
- Danh sách GIỮ HTML thuần + lý do + "thiếu năng lực gì" của DS (nếu có).
- Tương tác đã kiểm, kết quả; rủi ro / chỗ Builder nên xem.
