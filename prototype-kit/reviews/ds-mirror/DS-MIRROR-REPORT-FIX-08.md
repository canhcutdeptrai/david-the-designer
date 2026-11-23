# Bản giao việc FIX-08: Nút huỷ trong hộp thoại đổi sang dạng link

## Bối cảnh

Lượt trước (FIX-06) đổi nút huỷ trong hộp thoại từ `type="outline"` sang `type="light"` dựa trên số đo Portal. Điều phối đưa Builder xem 3 phương án trên trình duyệt (outline, light xám nhạt, light nâu nhạt) và Builder chốt: nút "Bỏ qua" / "Thoát" / "Quay lại" phải là dạng LINK - không nền, không viền. Đây là quyết định có chủ đích khác Portal (Portal dùng nền xám nhạt); vì Builder là PD, đây là chuẩn của DS, không phải lệch cần sửa.

## Các chỗ đã đổi

1. `design-system/sd-components/sd-components.js` —
   - `_renderPopover()` của SdQueryBar: nút `data-qb-role="popover-cancel"` nhãn "Bỏ qua" trong popover bộ lọc: `type="light"` → `type="link"`.
   - `_open()` của SdConfirmService: `noBtn.setAttribute('type', 'light')` → `'link'` (dùng chung một nhánh cho confirm / withInput / withRadio / withDate).
2. `design-system/preview/components/modal.html` —
   - Footer `modal-basic`: nút "Thoát" → `type="link"`.
   - Footer `modal-bottom-sheet`: nút "Thoát" → `type="link"`.
   - Footer `modal-warning`: nút "Bỏ qua" → `type="link"`.
   - Footer trái `modal-slots`: nút "Thoát" → `type="link"`.
   - Footer `modal-hide-close`: nút "Thoát" → `type="link"`.
   - Footer `modal-width`: nút "Thoát" → `type="link"`.
   - Tab "Hướng dẫn Dev" (đoạn code mẫu): nút "Thoát" dạng escaped `&lt;sd-button title="Thoát" type="light"` → `type="link"`.
3. `design-system/components/sd-overlay.md` — ví dụ `sd-modal` trong tài liệu: nút "Thoát" `type="outline"` → `type="link"` (nằm trong footer hộp thoại, đúng diện rà thêm).
4. Tài liệu: thêm ghi chú vào `sd-overlay.md` (mục sd-modal) và `sd-service.md` (mục SdConfirmService) nêu rõ nút huỷ dùng `type="link"` theo quyết định PD, cố ý khác Portal.
5. `CHANGELOG.md`: thêm mục `### Fix — Nút huỷ trong hộp thoại đổi sang dạng link` vào `## v2.11.0` hiện có (không tạo version mới), theo văn phong Nguồn / Vấn đề / Giải pháp / Files chạm.

Tất cả chỗ đổi đều giữ nguyên `color="secondary"` (chữ xám), không đụng nút hành động chính (`type="fill"`), không đổi `justify-content` footer, không đổi khoảng cách giữa các nút.

## Kết quả rà thêm (grep toàn `design-system/`)

Đã rà toàn bộ `design-system/` với hai nhãn nhóm: nút "Bỏ qua" / "Thoát" / "Quay lại" kết hợp `type="light"` hoặc `type="outline"` trong bối cảnh hộp thoại / popover. Kết quả: các nút thuộc diện đều đã đổi sang `type="link"` (liệt kê ở trên).

## Các chỗ giữ nguyên, kèm lý do

- `design-system/preview/components/query-bar.html` (`qb-saved-clear`, nút "Xoá bộ lọc đã lưu", `type="outline"`): nằm trên thanh công cụ, không phải hộp thoại / popover - brief ghi rõ không đổi.
- `design-system/preview/components/service.html` (các nút trigger demo toast / loading): nút hành động trên trang, không phải nút huỷ trong hộp thoại - không đổi.
- `design-system/sd-components/sd-components.js` (comment usage của `sd-side-drawer`, nút "Huỷ" `type="outline"`): chỉ là đoạn comment minh hoạ, nhãn "Huỷ" không thuộc bộ nhãn cho phép (Bỏ qua / Thoát / Quay lại) - giữ nguyên, đề nghị điều phối xem xét nếu muốn xử lý.
- `design-system/preview/components/stepper.html` (3 nút "Quay lại" `type="outline"`): là nút điều hướng bước của stepper nằm trên trang, không phải hộp thoại - không đổi.
- `design-system/preview/components/preview-pdf.html` (nút "Thoát" `type="outline"` trong lightbox PDF) và `design-system/preview/components/preview-image.html` (nút "Thoát" `type="outline"` trong lightbox ảnh): lightbox là overlay viewer toàn màn hình, không phải hộp thoại modal thuộc diện đợt này; hai file này cũng không nằm trong phạm vi file được phép sửa của bản giao việc - giữ nguyên để điều phối quyết.

## Phạm vi tuân thủ

Chỉ sửa đúng các file trong danh sách được phép: `sd-components.js`, `modal.html`, `sd-overlay.md`, `sd-service.md`, `CHANGELOG.md`; không đụng `_memory/session-handoff.md`, không đụng `prototypes/`, không commit, không đổi file nào khác. Báo cáo này là file mới `DS-MIRROR-REPORT-FIX-08.md` theo yêu cầu.
