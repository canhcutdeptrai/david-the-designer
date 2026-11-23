# DS Mirror Report - FIX-09: nút huỷ dạng link chuyển màu secondary sang primary

**Ngày:** 2026-09-19

**Quyết định PD:** Bỏ qua / Thoát / Quay lại trong hộp thoại dùng `type="link"`, chữ màu nâu brand (`color="primary"`). Phương án E thắng phương án D (chữ xám secondary).

## Các chỗ đã đổi

1. `design-system/sd-components/sd-components.js` - `_renderPopover()` của SdQueryBar: nút `data-qb-role="popover-cancel"` nhãn "Bỏ qua" đổi `color="secondary"` sang `color="primary"` (dòng 5382).
2. `design-system/sd-components/sd-components.js` - `_open()` của SdConfirmService: `noBtn` đổi mặc định `options.noButtonColor || 'secondary'` thành `options.noButtonColor || 'primary'` (dòng 7203), dùng chung cho confirm / withInput / withRadio / withDate. Giữ nguyên tuỳ chọn ghi đè `noButtonColor`.
3. `design-system/preview/components/modal.html` - 6 nút huỷ demo + 1 code mẫu đổi `color="secondary"` sang `color="primary"`: nút "Thoát" của `modal-basic` (dòng 73), `modal-bottom-sheet` (dòng 82), `modal-slots` footer trái (dòng 110), `modal-hide-close` (dòng 133), `modal-width` (dòng 140), nút "Bỏ qua" của `modal-warning` (dòng 93), và đoạn code mẫu trong tab "Hướng dẫn Dev" (dòng 211).
4. `design-system/components/sd-overlay.md` - ghi chú quyết định PD ở mục sd-modal đổi thành nút huỷ `type="link" color="primary"` chữ nâu brand OMEU (dòng 37), ví dụ nút "Thoát" chuyển sang `color="primary"` (dòng 43).
5. `design-system/components/sd-service.md` - cột mặc định của `noButtonColor` chuyển từ `secondary` sang `primary` (dòng 67), ghi chú nút huỷ dùng `type="link"` mặc định `color="primary"` theo quyết định PD, phân biệt rõ với Portal dùng nền xám nhạt (dòng 80).
6. `CHANGELOG.md` - sửa lại đúng mục `### Fix - Nút huỷ trong hộp thoại đổi sang dạng link` trong `## v2.11.0`: Nguồn bổ sung việc PD so 2 phương án màu chữ rồi chốt `color="primary"`, Giải pháp bỏ cụm "giữ nguyên color=secondary (chữ xám)" và thay bằng màu chữ primary nâu brand. Không tạo version mới, không thêm mục Fix thứ hai.

## Xác nhận không đụng nút link khác

Các nút `type="link" color="secondary"` sau đây được thấy trong các file chạm nhưng để nguyên vì không thuộc diện nút huỷ trong hộp thoại trong danh sách FIX-09:

- `design-system/sd-components/sd-components.js` - footer actions của SdDataState: "Cài đặt" (dòng 3808), "Tải lại" (dòng 3809), "Xuất" (dòng 3810); "Xoá hết" của SdQueryBar (dòng 4992); "Bộ lọc đã lưu" (dòng 5183). Đây là nút hành động utility, không phải nút huỷ hộp thoại.
- `design-system/preview/components/modal.html` - nút "Copy" trong thanh code mẫu (dòng 206) được giữ nguyên theo yêu cầu tường minh của bản giao việc.
- `design-system/components/sd-overlay.md` - nút "Bỏ qua" trong ví dụ `sd-side-drawer` (dòng 96): không nằm trong danh sách FIX-09, nên để nguyên `color="secondary"`. Nếu PD muốn drawer cũng theo quyết định này thì cần một vòng sửa riêng.
- `design-system/preview/components/modal.html` - nút "Quay lại" ở footer giữa của `modal-slots` (dòng 113, không có onclick, chỉ demo slot) và nút "Thoát" trong header tự dựng của `modal-header-full` (dòng 124) cũng không nằm trong danh sách FIX-09 nên giữ nguyên `color="secondary"`.

Các nút hành động chính (`type="fill" color="primary"` / `color="error"`) trong toàn bộ phạm vi không bị đụng.

## Ghi chú ngoài phạm vi (đề nghị điều phối xem xét)

- `design-system/preview/components/service.html` (dòng 278) vẫn ghi mặc định `noButtonColor` là `secondary`, trong khi code và tài liệu giờ mặc định `primary`. File này không nằm trong phạm vi FIX-09 nên không sửa; nếu cần đồng bộ thì làm vòng sau.
