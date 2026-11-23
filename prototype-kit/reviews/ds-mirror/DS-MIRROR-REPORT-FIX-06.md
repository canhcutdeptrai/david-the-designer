# DS Mirror Report Fix 06

Vòng sửa 7 lỗi mirror được Builder review + nâng version v2.11.0. Toàn bộ sửa trong đúng phạm vi file được giao, không đụng prototypes/, không đọc `_memory/session-handoff.md`.

## Lỗi 1 - Stepper dọc: đường nối giữa các bước quá dày

Nơi sửa: `design-system/core/styles/sd-tokens.css`, rule `sd-stepper .sd-stepper--vertical .sd-stepper__connector`.

Những gì đã làm: thêm `min-width: 0` vào rule dọc.

Nguyên nhân thật: đúng hướng chẩn đoán là dùng chung rule với đường nối ngang, nhưng không phải ở chỗ chiều cao/chiều rộng mà ở `min-width`. Rule gốc `.sd-stepper__connector` đặt `min-width: 24px` (để đường ngang co giãn); rule dọc chỉ ghi đè `width: 2px` nhưng không reset `min-width`, nên trong CSS `min-width` thắng `width` và đường dọc bị kẹp rộng 24px thay vì 2px - thành dải to đúng như Builder thấy. Thêm `min-width: 0` cho rule dọc là đường nối còn mảnh 2px theo chiều ngang, dài 24px theo chiều dọc. Không đụng gì ở chế độ ngang.

## Lỗi 2 - sd-anchor: nav phải nằm bên phải và sai tên class

Nơi sửa: `design-system/sd-components/sd-components.js` (class `SdAnchor`) và `design-system/core/styles/sd-tokens.css`.

Những gì đã làm: đổi toàn bộ tên class sang đúng tên Portal theo bảng phiếu giao: `.c-anchor-vertical`, `.c-anchor-content`, `.c-anchor-list`, `.c-anchor-list-item`, trạng thái active là `.c-anchor-list-item.active`, nhãn `.c-anchor-list-item-text`, icon `.c-anchor-list-item-icon`, và thêm lớp phụ `.c-stop-scroll-propagation` lên phần tử bọc ngoài. Đảo thứ tự DOM để content nằm bên trái, nav/list nằm bên phải (portal đo content x=571 w=183, list x=764 w=200), đổi border của list sang bên trái.

Các hành vi giữ nguyên: scroll tracking, bấm mục để nhảy, `sidebarWidth` (default 200px, dùng CSS variable `--sd-anchor-sidebar-width`), `hideNav`, `ellipsis`, `overScroll`. Hai class trạng thái `hideNav` và `ellipsis` không nằm trong bảng phiếu giao nên tôi đặt theo tiền tố Portal thành `.c-anchor-vertical--hidden-nav` và `.c-anchor-vertical--ellipsis` cho đồng bộ; nếu Portal dùng tên khác cho hai trạng thái này thì báo lại để tôi chỉnh.

## Lỗi 3 - sd-splitter: kéo nhẹ là chạy hết về một phía + splitter lồng nhau thanh kéo ngắn tũn

Nơi sửa: `design-system/sd-components/sd-components.js` (class `SdSplitter`) và `design-system/core/styles/sd-tokens.css`.

Những gì đã làm:

- Chụp nhanh toàn bộ trạng thái tại `pointerdown` (`_buildDragSnapshot`): vị trí con trỏ, `pxSize` của hai panel liền kề, tổng `others`, và tổng kích thước wrapper. Mọi `pointermove` tính delta từ mốc cố định ấy và áp lên kích thước trong snapshot (`_applyResizeDelta` nhận thêm tham số `base`), không đọc lại `pxSize` live và không cộng dồn. Keyboard (`_onGutterKeyDown`) và API (`resizePanel`) vẫn đi đường cũ không có `base` - hành vi không đổi.
- `_bounds(m)` nhận tham số total override để min/max của cả hai panel tính cùng một tổng cố định của snapshot, không phải đọc lại kích thước wrapper.
- CSS: thêm `align-self: stretch` tường minh cho gutter cả `horizontal` lẫn `vertical`, để thanh kéo luôn trải hết cạnh chung của hai panel ở mọi cấp lồng nhau (default của flex đã là stretch, nhưng khai tường minh để không bị rule nào trong trang đè).

Về nguyên nhân thật: tôi đọc kỹ code hiện hành và thấy mốc con trỏ lúc `pointerdown` đã được lưu vào `_dragStart` và mỗi `pointermove` tính `coord - _dragStart` - tức code hiện hành KHÔNG còn lỗi "cộng dồn delta từ vị trí gutter hiện tại" như hướng chẩn đoán mô tả. Số đo phiếu giao (kéo ~77px thì panel nhảy 114px, kéo ~20px thì đứng im) không tái hiện được bằng toán của code đang trên đĩa (kéo 77px từ 250px phải ra 327px). Với bài học trong `_memory/lessons.md` về cache JS cũ làm số đo của bản cũ, khả năng cao phiếu đo phải bản JS cũ trong cache trình duyệt hơn là bản code đang sửa. Dù vậy tôi vẫn làm đúng yêu cầu cấu trúc: kích thước panel giờ cũng được chụp tại `pointerdown` chứ không đọc live, nên ngay cả khi có thao tác trung gian làm lệch model giữa các lần move thì vẫn kéo N px đổi đúng N px (trừ khi chạm min/max hoặc snap collapse).

## Lỗi 4 - sd-table tree: đóng/mở dòng con không có chuyển động

Nơi sửa: `design-system/sd-components/sd-components.js` (class `SdTable`) và `design-system/core/styles/sd-tokens.css`.

Lựa chọn: dùng opacity thuần qua CSS keyframes (160ms), không dùng transform và không dùng max-height/grid-template-rows.

Vì sao: toggle của sd-table hiện đang re-render cả bảng (`this.innerHTML`), nên chọn cơ chế đánh dấu lớp hai chiều: lúc đóng, thêm `.sd-tree-row-collapsing` cho các dòng con đang hiển thị rồi chờ 160ms mới re-render gỡ chúng; lúc mở, re-render ngay với `.sd-tree-row-entering` cho những dòng mới xuất hiện. Transform bị loại vì áp trên thẻ `<tr>` bảng (table-row) không được engine nào hỗ trợ đồng nhất; max-height bị loại vì chiều cao thật của dòng bảng khó đo ổn định và dễ dính cảnh báo hai đầu khác đơn vị đã trả giá ở repo này. Opacity là thuộc tính an toàn nhất trên table-row, đủ để người dùng nhận thấy dòng con tan ra/hiện vào. Không đụng gì khác trong sd-table ngoài nhánh tree.

Để cơ chế này chạy, tôi thêm `data-tree-key` trên `<tr>` (chỉ khi isTree) và giữ `_treePrevKeys`/`_treeAnim`/`_treeAnimating` trong class; thêm dòng cũ không bị nháy do mở/đóng dòng khác vì chỉ so với tập key của render trước.

## Lỗi 5 - Nút huỷ trong modal phải là light, không phải outline

Nơi sửa: `design-system/sd-components/sd-components.js` (popover của `SdQueryBar` và `SdConfirmService`), `design-system/preview/components/modal.html`. Trong `design-system/preview/components/query-bar.html` không có nút huỷ/thoát nào (nút "Xoá bộ lọc đã lưu" ở line 128 là action ngoài modal, không thuộc diện này) nên trang đó không có gì để sửa.

Những gì đã làm: đổi `type="outline"` sang `type="light"` cho nút "Bỏ qua" trong popover của `sd-query-bar`, cho nút huỷ của cả 4 phương thức `SdConfirmService` (confirm/withInput/withRadio/withDate dùng chung một nhánh `_open`), và cho nút Thoát/Bỏ qua trong footer modal của `modal.html` (modal-basic, modal-bottom-sheet, modal-warning, modal-hide-close, modal-width) cùng code mẫu trong tab Dev. Tôi GIỮ NGUYÊN `color` hiện tại (mặc định secondary) như phiếu yêu cầu.

Chênh lệch "light primary" của Builder và số đo Portal: Portal đo nút "Trở lại" có nền `rgb(233, 233, 233)`, viền `0px none`, chữ `rgb(117, 117, 117)` - đây là `type="light"` với `color="secondary"`, KHÔNG phải light primary (light primary trên Portal là nền xanh nhạt, không phải xám nhạt). Tôi làm đúng phiếu: đổi type sang light, giữ color secondary, không tự chọn màu. Đề nghị điều phối hỏi lại Builder xem ông ấy muốn xám nhạt như Portal hay light primary thật sự.

## Lỗi 6 - Cụm nút CTA của modal phải dồn về góc phải

Nơi sửa: `design-system/core/styles/sd-tokens.css` (rule `.sd-modal .sd-modal-footer`).

Những gì đã làm: đổi `justify-content` mặc định của container footer từ `space-between` sang `flex-end`; `space-between` giờ chỉ còn áp dụng khi `data-zones="2"` hoặc `data-zones="3"` (có 2-3 vùng `sdFooterLeft`/`sdFooter`/`sdFooterRight`). Cả `sd-modal` và `SdConfirmService` đều dựng trên cùng rule này nên được áp chung. Modal 1 cụm nút (data-zones=1) giờ dồn phải; demo 7-slot (3 vùng) giữ space-between.

## Lỗi 7 - Nút CTA của SdConfirmService dính liền nhau

Nơi sửa: `design-system/core/styles/sd-tokens.css`.

Những gì đã làm: cho div slot `sdFooterLeft`/`sdFooter`/`sdFooterRight` `display: contents` để các `sd-button` bên trong trở thành flex item trực tiếp của zone, nhận đúng `gap: 8px` đã có sẵn trong CSS (không hardcode số mới). Lý do dính trước đây: zone `.sd-modal-footer-right` đã là flex có gap nhưng con của nó là một div slot bọc cả hai nút, nên gap không áp giữa hai nút; `display: contents` gỡ lớp bọc đó ra.

## Việc 8 - Nâng version v2.11.0 và đồng bộ CHANGELOG/README

Nơi sửa: `CHANGELOG.md`, `README.md`.

Những gì đã làm: thêm mục `## v2.11.0 — 2026-09-19` ngay dưới dòng `---` và trên `## v2.10.0`, theo đúng văn phong cũ: đầu mục `### New —` / `### Fix —`, mỗi mục có **Nguồn** / **Vấn đề** / **Giải pháp**. Ghi đủ 13 component mirror (sd-modal, sd-switch, sd-tab-group + sd-tab, sd-chip, sd-stepper + sd-step, sd-anchor + sd-anchor-item, sd-splitter + sd-splitter-panel, sd-chip-calendar, sd-data-state, sd-query-bar, sd-preview-image, sd-preview-pdf), 3 service toàn cục (SdNotifyService, SdConfirmService, SdLoadingService), fix `.T18M` 600 -> 500, giới hạn đã biết `sd-preview-pdf` (không dùng pdf.js nên tìm chữ/thumbnail/zoom từng trang/xoay/in disabled kèm tooltip), và Files chạm. `README.md` đổi dòng đầu từ `v1.7.0` sang `v2.11.0`.

Chênh lệch pre-existing: `README.md` vốn ghi `v1.7.0` trong khi `CHANGELOG.md` đã lên tới `v2.10.0` từ trước lượt này - tôi chỉ đồng bộ sang v2.11.0, không phải lỗi do lượt sửa này gây ra.

## Lỗi chưa sửa được

Không có lỗi bỏ trống hoàn toàn. Điểm cần lưu ý khi nghiệm thu: (1) phần khuếch đại splitter tôi không tái hiện được bằng code đang trên đĩa, tôi làm theo đúng cấu trúc "snapshot tại pointerdown" và nghiêng về nguyên nhân cache JS cũ; nếu coordinator vẫn đo ra khuếch đại sau khi bust cache trang + file JS thì cần đo lại với `fetch(url, {cache:'reload'})` trước rồi mới nói lỗi còn nguyên. (2) Hai class trạng thái `--hidden-nav` và `--ellipsis` của anchor tôi đặt tên theo tiền tố Portal nhưng chưa có số đo Portal để đối chiếu tên chính xác. (3) Nút huỷ đang là light secondary (xám nhạt) chứ không phải light primary - chờ Builder xác nhận.
