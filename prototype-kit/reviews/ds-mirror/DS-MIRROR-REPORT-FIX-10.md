# DS-MIRROR-REPORT-FIX-10

Báo cáo của phiên xử lý bản giao FIX-10: ghi hai quy tắc mới về `sd-button` (phân cấp nút trong hộp thoại + hạn chế outline) và dọn `type="outline"` trong `design-system/`. Không commit, không ghi ngoài danh sách file được duyệt, không đụng `prototypes/`.

## 1. Nội dung hai rule đã thêm vào AGENTS.md

Rule 17 (thêm sau rule 16, trước separator `---`):

> **17. **Cụm nút trong hộp thoại phân cấp ba bậc, cùng `color="primary"`** - bậc 1 hành động chính dùng `type="fill"`, bậc 2 hành động phụ trong cùng cụm CTA dùng `type="light"`, bậc 3 thoát ra không làm gì (Bỏ qua / Thoát / Quay lại) dùng `type="link"`. Nút thoát **không dùng** `light`/`outline` vì nó nổi ngang hàng các bậc trên; `link color="secondary"` thì chữ quá mờ nhìn như bị disable, nên luôn là `type="link" color="primary"`.**

Rule 18:

> **18. **Hạn chế tối đa `type="outline"`** - viền gây tải thị giác cho giao diện back-office vốn đã dày đặc; chỉ dùng khi không còn lựa chọn nào khả dĩ và phải ghi comment lý do.**

Đồng thời đã thêm tiểu mục `### Chọn type theo vai trò nút` ngay sau bảng thuộc tính của `sd-button` trong `design-system/components/sd-interactive.md`: bảng ba bậc (fill / light / link, cùng `color="primary"`), hai điểm cốt lõi (nút thoát phải kém hẳn, `link` màu secondary trông như disable) và quy tắc hạn chế outline kèm lý do viền gây tải thị giác.

## 2. Bảng liệt kê các chỗ outline đã đổi

| File | Dòng | Nút / vai trò | Trước | Sau | Nhóm, lý do |
|------|------|----------------|-------|-----|-------------|
| `design-system/sd-components/sd-components.js` | 4081 | "Tải xuống" trong usage comment `sd-side-drawer` (header-right) | `type="outline"` (mặc định primary) | `type="light" color="primary"` | Hành động phụ |
| `design-system/sd-components/sd-components.js` | 4085 | "Huỷ" trong footer `sd-side-drawer` (usage comment) | `type="outline" color="secondary"` | `type="link" color="primary"` | Nút thoát trong hộp thoại |
| `design-system/components/sd-overlay.md` | 83 | "Tải xuống" header-right drawer, ví dụ | `type="outline"` | `type="light" color="primary"` | Hành động phụ |
| `design-system/components/sd-interactive.md` | 73 | "Xóa" trong ví dụ (dòng 59 cũ) | `type="outline" color="error"` | `type="light" color="error"` | Hành động phụ, giữ màu cảnh báo |
| `design-system/preview/patterns/add-side-drawer.html` | 45 | "Tạo mới (form phức tạp)" | `type="outline" color="primary"` | `type="light" color="primary"` | Hành động phụ |
| `design-system/preview/components/button.html` | 99 | "Chỉnh sửa" (phần minh hoạ icon) | `type="outline" color="primary"` | `type="light" color="primary"` | Hành động phụ |
| `design-system/preview/components/button.html` | 104 | "Tiếp tục" (phần minh hoạ icon) | `type="outline" color="primary"` | `type="light" color="primary"` | Hành động phụ |
| `design-system/preview/components/service.html` | 47 | "Có actionLabel" | `type="outline" color="primary"` | `type="light" color="primary"` | Hành động phụ |
| `design-system/preview/components/service.html` | 48 | "Bắn 4 toast liên tiếp" | `type="outline" color="secondary"` | `type="light" color="secondary"` | Hành động phụ |
| `design-system/preview/components/service.html` | 72 | "Loading trong khung #preview-box" | `type="outline" color="secondary"` | `type="light" color="secondary"` | Hành động phụ |
| `design-system/preview/components/service.html` | 73 | "Dừng ngay" | `type="outline" color="secondary"` | `type="light" color="secondary"` | Hành động phụ |
| `design-system/preview/components/query-bar.html` | 128 | "Xoá bộ lọc đã lưu" | `type="outline" color="secondary"` | `type="light" color="secondary"` | Hành động phụ |
| `design-system/preview/components/side-drawer.html` | 47 | "Full Layout (header + footer)" | `type="outline" color="primary"` | `type="light" color="primary"` | Hành động phụ |
| `design-system/preview/components/side-drawer.html` | 165 | "Tải xuống" header-right drawer | `type="outline"` (mặc định primary) | `type="light"` | Hành động phụ |
| `design-system/preview/components/splitter.html` | 110-113, 133, 155 | 6 nút demo API / storage / disabled | `type="outline" color="primary"` | `type="light" color="primary"` | Hành động phụ |
| `design-system/preview/components/tooltip.html` | 141 | "Xem chi tiết" | `type="outline" color="primary"` | `type="light" color="primary"` | Hành động phụ |
| `design-system/preview/components/modal.html` | 46, 50, 52, 54, 56, 58 | 6 nút trigger mở các modal variants | `type="outline"`, giữ nguyên color tương ứng | `type="light"`, giữ nguyên color | Hành động phụ |
| `design-system/preview/components/modal.html` | 103 | "Tải xuống" header-right modal | `type="outline" color="secondary"` | `type="light" color="secondary"` | Hành động phụ |
| `design-system/preview/components/stepper.html` | 61, 92, 139 | 3 nút "Quay lại" | `type="outline" color="secondary"` | `type="link" color="primary"` | Nút thoát trong luồng |
| `design-system/preview/components/preview-pdf.html` | 79 | "Thoát" (btn-pdf-lightbox-close) | `type="outline" color="secondary"` | `type="link" color="primary"` | Nút thoát trong modal/lightbox |
| `design-system/preview/components/preview-image.html` | 105 | "Thoát" (btn-img-lightbox-close) | `type="outline" color="secondary"` | `type="link" color="primary"` | Nút thoát trong modal/lightbox |

Tổng đã đổi: 33 chỗ (27 sang `type="light"`, 6 sang `type="link" color="primary"`). Toàn bộ chỉ đổi giá trị thuộc tính, không viết lại nội dung.

## 3. Những chỗ GIỮ NGUYÊN và lý do

- `design-system/preview/components/button.html` dòng 69-73: khối `<sd-section title='type="outline"'>` + 3 nút outline Primary/Secondary/Error. Đây là trang minh hoạ 4 type của `sd-button`, xoá đi là mất tài liệu. Đã thêm một dòng ghi chú ngay dưới khối: outline là kiểu ít dùng nhất, chỉ dùng khi không còn lựa chọn nào khả dĩ.
- `design-system/components/sd-interactive.md` dòng 93 (gốc dòng 79): dòng ánh xạ `.btn .btn-outline-primary` → `<sd-button type="outline" color="primary">` trong bảng tra cứu di trú CSS cũ. Không phải khuyến nghị dùng nên giữ, thêm ghi chú ngay cuối dòng nói rõ đây là bảng di trú và outline là kiểu ít dùng nhất.

## 4. Chỗ phân vân, không đổi

Trong danh sách 38 chỗ không có chỗ nào phân vân: mọi nút đều phân loại rõ ràng thành thoát (link primary) hoặc hành động phụ (light, giữ color). Các điểm sau nằm NGOÀI danh sách 38 chỗ outline nhưng mâu thuẫn trực tiếp với hai quy tắc mới, để nguyên chờ điều phối quyết:

1. Các ví dụ/guide còn dùng `type="link" color="secondary"` cho nút thoát (vi phạm quy tắc 17, chữ mờ nhìn như disable): `sd-interactive.md` dòng 74 (ví dụ ngay dưới tiểu mục mới), `sd-overlay.md` dòng 96, `side-drawer.html` dòng 184, `add-side-drawer.html` dòng 125, 157, 216, 287, `modal.html` dòng 113 ("Quay lại") và 124 ("Thoát" size sm).
2. Bảng "type mapping" trong `sd-interactive.md` còn ghi `outline` = "Secondary action (Tạm dừng, Hủy bỏ)", mâu thuẫn với quy tắc 18. Để nguyên, chưa sửa.
3. `sd-components.js` dòng 4085 trong usage comment vẫn giữ label "Huỷ" (vi phạm rule 16 - label chuẩn là Bỏ qua / Thoát / Quay lại). Bản giao chỉ yêu cầu đổi type/color nên không đổi label.

Ghi chú nhỏ: `side-drawer.html` dòng 165 không thêm `color="primary"` tường minh mà chỉ đổi type sang `light` (quy tắc chung là giữ nguyên color đang có; mặc định vốn là primary nên render giống hệt hai ví dụ cùng cụm đã thêm color tường minh ở `sd-overlay.md` và `sd-components.js`).

## 5. Số chỗ `type="outline"` còn lại trong design-system/

Trước khi dọn: 38 (khớp đúng số điều phối đếm). Sau khi dọn, `grep -rn 'type="outline"' design-system/` còn 6 dòng:

- 4 dòng là usage thật của `sd-button`, giữ cố ý: `button.html` 71-73 (khối minh hoạ) + `sd-interactive.md` 93 (bảng di trú).
- 2 dòng là text, không phải usage: `button.html` 69 (tiêu đề section `title='type="outline"'`) + `sd-interactive.md` 69 (dòng ghi chú cấm outline vừa thêm).

Kết luận: không còn chỗ nào dùng `type="outline"` ngoài hai khối tài liệu hoá đã duyệt giữ nguyên.

## 6. Việc khác

- `CHANGELOG.md`: đã thêm mục `### New` cho "Chuẩn chọn type cho sd-button và hạn chế outline" vào `## v2.11.0` (không tạo version mới), đúng cấu trúc Nguồn / Vấn đề / Giải pháp / Files chạm, nguồn ghi là quyết định của PD.
