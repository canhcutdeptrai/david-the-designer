# DS Mirror Report 03 - sd-stepper/sd-step + sd-anchor/sd-anchor-item

## 1. Danh sách file đã sửa / đã tạo

Đã sửa:
- `design-system/sd-components/sd-components.js` - thêm `sd-step`, `sd-stepper`, `sd-anchor-item`, `sd-anchor` vào cuối nhóm Layout (sau `sd-tab-group`, trước `sd-upload-file`).
- `design-system/core/styles/sd-tokens.css` - thêm 2 khối style `sd-stepper + sd-step` và `sd-anchor + sd-anchor-item` ở cuối file, chỉ dùng token có sẵn.
- `design-system/preview/shared-nav.js` - thêm 2 mục "Stepper" và "Anchor" vào nhóm `Layout` (`sub-layout`), không đặt `legacy`, không đụng mục cũ.
- `design-system/preview/index.html` - thêm 2 thẻ card: `sd-stepper` (icon `linear_scale`) và `sd-anchor` (icon `toc`).
- `design-system/components/sd-layout.md` - thêm 4 mục `sd-stepper`, `sd-step`, `sd-anchor`, `sd-anchor-item`.
- `design-system/components/sd-components.md` - cập nhật bảng "Files theo functional group" và "Quick lookup".

Đã tạo:
- `design-system/preview/components/stepper.html`
- `design-system/preview/components/anchor.html`
- `DS-MIRROR-REPORT-03.md` (file này)

Không chạm `prototypes/`, không chạm `DS-MIRROR-REVIEW.md`, `DS-MIRROR-REPORT-01.md`, `DS-MIRROR-REPORT-02.md`, không sửa/dọn phần thay đổi của các lượt trước trong cùng các file được sửa.

## 2. Component mirror + thuộc tính Portal CỐ Ý bỏ

### sd-stepper

Đã mirror đủ API Portal: `selectedIndex` (mặc định 0), `linear` (mặc định false), `orientation` (horizontal/vertical, mặc định horizontal), `labelPosition` (bottom/end, mặc định bottom), `animationDuration` (string). Đọc cả camelCase lẫn thường, kiểu `sd-checkbox`. Method `.goTo(index)` phơi đúng tên Portal (`wizard()?.goTo(position)`). Event `sd-step-change` với `detail: { index: number }`, `bubbles: true`, ánh xạ tới `[(selectedIndex)]` bên Angular. Giữ nguyên node DOM nội dung từng `sd-step` (ẩn bằng CSS `.sd-step-panel-hidden`), không chép innerHTML.

Thuộc tính Portal CÓ nhưng mirror CỐ Ý bỏ: `stepControl` (FormGroup). Lý do: Web Component không nhận object qua attribute. Thay thế đã dựng: attribute boolean `completed` trên `sd-step`, `linear` chặn nhảy bước dựa trên các bước `completed` (chỉ nhảy tới bước có toàn bộ bước trước `completed`; bước đã qua chỉ bấm lại được khi có `editable`). Đã ghi rõ trong tài liệu và trang preview.

### sd-step

Đã mirror: `label`, `icon`, `optional` (hiện chữ phụ "Không bắt buộc"), `editable`. Thêm `completed` là thay thế mirror cho `stepControl` (không phải input gốc của Portal). Vòng tròn số bước: bước đã qua hiện icon `check`; bước đang ở và chưa tới hiện số thứ tự, trừ khi có `icon` thì hiện icon đó. Màu dùng token: bước active/completed `--sd-primary` + chữ trắng, bước chưa tới `--sd-black100` nền + viền `--sd-black300` + số `--sd-black400`.

### sd-anchor

Đã mirror đủ API Portal: `sidebarWidth` (mặc định 200px), `ellipsis` (false), `overScroll` (false), `hideNav` (false). Sidebar điều hướng bên trái theo `title` và `icon`, vùng nội dung cuộn bên phải, highlight mục active khi cuộn, bấm sidebar để nhảy tới phần.

Thuộc tính bảng điều khiển thử nghiệm của Portal KHÔNG mirror: `containerHeight`. Lý do: chính trang Portal không liệt kê nó trong mục "API & Properties", nhiều khả năng là ô chỉnh chiều cao của div bọc ngoài trong trang demo. Ghi rõ trong tài liệu và báo cáo là chỗ còn lệch chưa xác minh được.

Portal CÓ input `title` trên `sd-anchor-item` nhưng `title` là global attribute HTML: mirror đã xử lý đúng bẫy - đọc vào `_title` rồi `removeAttribute('title')` với cờ `_strippingTitle`, đúng khuôn `SdInform` (gồm cả trường hợp `attributeChangedCallback` bị kích hoạt lại khi gỡ attribute).

Xử lý bẫy bắt buộc: mọi demo anchor đều bọc `<div style="height: 600px">`, cảnh báo parent có chiều cao cụ thể hiện ngay trên preview bằng `sd-inform` type warning và ghi trong tài liệu.

## 3. Các quyết định tự quyết

1. **Scroll tracking của sd-anchor**: cân nhắc `IntersectionObserver` (chính xác, root là vùng cuộn) và so `scrollTop` + offset từng item. Chọn so `scrollTop` + `offsetTop` vì: gọn hơn về logic, dễ kiểm soát ngưỡng highlight (80px), và kết hợp đơn giản với `overScroll` (thêm paddingBottom để mục cuối cuộn lên được đỉnh). Ghi lựa chọn + lý do trong tài liệu.
2. **Ngưỡng highlight (threshold 80px)**: chọn ngưỡng cố định 80px để mục kế tiếp bắt đầu highlight khi đã cuộn ngang qua 80px tính từ đỉnh vùng nội dung, không cần cuộn tới khít đỉnh. Đây là con số UX tự chọn, không đọc được từ Portal.
3. **Cách mô phỏng `linear`**: trong linear, click vòng tròn chỉ tới được bước có toàn bộ bước trước `completed`; bước đã qua phải `editable` mới click lại được. `goTo()` luôn chạy (imperative) vì demo Portal dùng `wizard()?.goTo()` để nhảy dù đang linear.
4. **Vị trí connector của sd-stepper**: đặt connector dạng flex line giữa các bước, active khi bước liền trước `completed` (chuyển sang `--sd-primary`).
5. **`labelPosition="end"`**: dựng cả hai, class `sd-stepper--label-end` đổi step thành row (circle + text ngang) - là suy diễn từ Material vì Portal không có demo nào dùng `end`.
6. **`animated` transition**: dùng `animationDuration` cho chuyển màu vòng tròn/connector/label qua CSS variable `--sd-stepper-animation-duration` (mặc định 300ms, mặc định này là giả định mirror, không đọc được từ Portal vì Portal không show default).
7. **`sd-anchor` không có event output**: Portal không liệt kê event nào cho anchor nên mirror không thêm event, không tự bịa.

## 4. Token còn thiếu phải hardcode

Không hardcode màu nào ngoài token. Cần chú ý: màu trắng trên vòng tròn primary và nền card anchor dùng `var(--color-neutral-0)` từ `tokens.css` vì layer `sd-tokens` không có token on-primary/white riêng; nếu muốn khép kín trọn layer `sd-tokens`, nên thêm token on-primary, nhưng đó là việc ngoài phạm vi bản giao việc nên tôi không thêm. Inline style chỉ xuất hiện đúng code mẫu Portal trong preview anchor (`height: 600px; padding: 20px` trên div bọc và nội dung item) và `paddingBottom` do JS của chính component đặt khi `overScroll`.

## 5. Chỗ chưa chắc khớp Portal

- `labelPosition="end"` chưa xác nhận được trên Portal (chỉ có `bottom` trong mọi demo), mirror dựng theo suy diễn Material.
- Mặc định `animationDuration` mirror giả định `300ms` (Portal để trống, không show default).
- `containerHeight` là chỗ lệch chưa xác minh - xem mục 2.
- Ngưỡng highlight 80px và kiểu highlight sidebar (nền `--sd-primary-light` + chữ primary) là tự quyết vì Portal không chép CSS ra được; cần đối chiếu trên bản Angular thật khi có.
- Màu hover vòng tròn bước (viền primary) tự quyết theo hành vi Material, chưa xác nhận trên Portal.
