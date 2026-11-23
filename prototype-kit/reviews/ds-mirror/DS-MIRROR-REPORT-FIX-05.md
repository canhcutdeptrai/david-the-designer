# DS-MIRROR-REPORT-FIX-05

Vòng sửa 3 lỗi của mirror: asset path của `sd-data-state`, chiều cao chip compact của `sd-query-bar`, và input thừa `icon` của field trong `sd-query-bar`.

## Lỗi 1 - ảnh empty state của sd-data-state luôn 404

Đã sửa trong `design-system/sd-components/sd-components.js`.

Nguyên nhân đúng như chẩn đoán: `sdAssetPath()` đọc `document.currentScript.src` trong lúc chạy, nhưng hàm này được gọi muộn, khi component render trong `connectedCallback`. Lúc đó `document.currentScript` đã là `null`, nên hàm luôn rơi vào nhánh dự phòng trả chuỗi tương đối `design-system/core/assets/` tính theo trang đang mở, thành 404.

Cách sửa: di chuyển thời điểm đọc lên cấp cao nhất của IIFE, ngay sau `'use strict'`, trước mọi định nghĩa class - lúc đó script tag tĩnh còn hợp lệ. Lưu vào biến `sdScriptSrc`, `sdAssetPath()` dùng lại biến này. Với mọi trang preview/prototype đang nạp `sd-components.js` bằng `<script src>` tĩnh, hàm giờ trả đường dẫn tuyệt đối đúng theo vị trí file script.

Nhánh dự phòng: chọn trả chuỗi rỗng, kết hợp sửa `SdDataState` để bỏ qua thẻ `<img>` khi src rỗng. Lý do chọn phương án này theo hướng điều phối đã nghiêng: nếu script bị nạp kiểu module hoặc chèn động thì không có cơ sở nào đoán đúng đường dẫn gốc ở mọi độ sâu, trả một đường dẫn ước đoán chỉ tái lập 404 trên các trang khác. Không có ảnh còn tốt hơn ảnh vỡ: vừa hết lỗi console `Failed to load resource: 404`, vừa không render phần tử hỏng. Thay đổi ở `SdDataState` chỉ là bọc `<img>` trong điều kiện src khác rỗng, không đổi API, không đổi visual khi đường dẫn bình thường có đủ.

Kết quả grep toàn file `sd-components.js`: còn đúng 1 định nghĩa `sdAssetPath` (kèm biến `sdScriptSrc`) và 1 chỗ gọi duy nhất là render state `empty`. Không còn chỗ nào tự ghép chuỗi `core/assets` hay `design-system/core/assets` khác trong file.

## Lỗi 2 - chip của sd-query-bar ở density="compact" cao 29px thay vì 28px

Đã sửa trong `design-system/core/styles/sd-tokens.css`, khối `sd-query-bar .qb-chip`:

- `height: 28px` đổi thành `min-height: 28px`
- `padding: 0 8px` đổi thành `padding: 3px 8px`

Cách tính này cho chiều cao ngoài của chip compact đúng 28px ở cả hai chế độ box-sizing: nội dung (line-height 20px) + padding dọc 3+3px + border 1+1px = 28px, và nếu reset `box-sizing: border-box` áp dụng thì content box vừa khít 20px trong min-height 28px. Không đụng `comfortable`, không thêm `!important`.

## Lỗi 3 - gỡ input `icon` của field trong sd-query-bar

Đã gỡ ở các chỗ sau:

- `design-system/sd-components/sd-components.js`: hàm `_fieldIcon(field)` bỏ `field.icon ||`, chỉ còn `QB_TYPE_ICONS[field.type] || 'filter_alt'`. Icon của chip/menu/popover giờ hoàn toàn theo `type`, không còn đường dẫn nào đọc `icon` từ định nghĩa field.
- `design-system/preview/components/query-bar.html`: gỡ hàng `<tr><td>icon</td>...<td>Override icon mặc định của type (mirror)</td></tr>` trong bảng `Cấu hình field - keys trong field config`. Không demo nào trong file từng đặt `"icon"` trong `fields[]`, nên không còn chỗ demo để gỡ. Các từ `icon` còn lại trong file chỉ là link font Google và icon Material trong guide text, không liên quan field config.
- `design-system/components/sd-data.md`: phần `sd-query-bar` không có dòng nào nhắc input `icon` của field nên không có gì để gỡ. Cột `Icon mặc định (mirror)` trong bảng 7 loại field mô tả icon mặc định theo type - giữ lại vì đúng Portal.

Kết quả grep xác nhận: `rg "field\.icon"` trong `sd-components.js` ra 0 kết quả; `rg "Override icon mặc định của type"` trong `query-bar.html` và `sd-data.md` ra 0 kết quả. Chỗ duy nhất còn nhắc "Override icon mặc định" trong `sd-data.md` thuộc `sd-scorecard`, ngoài phạm vi lỗi này, không đụng.
