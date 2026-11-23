## 1. File đã sửa

| File | Số lượt bỏ fallback | CRLF còn nguyên |
|---|---|---|
| prototypes/cam-nang-phan-quyen/chi-tiet-orgbase.html | 2 | Có |
| prototypes/cam-nang-phan-quyen/chi-tiet-position.html | 4 | Có |
| prototypes/cam-nang-phan-quyen/chi-tiet-workitem.html | 10 | Có |
| prototypes/cam-nang-phan-quyen/danh-sach-cam-nang.html | 15 | Có |
| prototypes/cam-nang-phan-quyen/danh-sach-loai-dieu-kien.html | 1 | Có |
| prototypes/cam-nang-phan-quyen/danh-sach-luong.html | 1 | Có |
| prototypes/cam-nang-phan-quyen/danh-sach-position.html | 41 | Có |
| prototypes/cam-nang-phan-quyen/danh-sach-workitem.html | 18 | Có |
| prototypes/cam-nang-phan-quyen/quan-ly-cam-nang.html | 21 | Có |
| prototypes/cam-nang-phan-quyen/quan-ly-orgbase.html | 7 | Có |
| prototypes/cam-nang-phan-quyen/sua-cam-nang.html | 8 | Có |
| prototypes/cam-nang-phan-quyen/sua-luong.html | 2 | Có |
| prototypes/cam-nang-phan-quyen/sua-orgbase.html | 12 | Có |
| prototypes/cam-nang-phan-quyen/sua-position.html | 17 | Có |
| prototypes/cam-nang-phan-quyen/sua-workitem.html | 106 | Có |
| prototypes/cam-nang-phan-quyen/tao-cam-nang.html | 9 | Có |
| prototypes/cam-nang-phan-quyen/tao-luong.html | 2 | Có |
| prototypes/cam-nang-phan-quyen/tao-orgbase.html | 9 | Có |
| prototypes/cam-nang-phan-quyen/tao-position.html | 14 | Có |
| prototypes/cam-nang-phan-quyen/tao-workitem.html | 106 | Có |
| prototypes/cam-nang-phan-quyen/uy-quyen-noi-bo.html | 1 | Có |

Tất cả file HTML trong phạm vi dùng CRLF, sau khi sửa `file` vẫn báo "with CRLF line terminators"; file CSS `styles/tra-cuu-cam-nang-v2.css` cũng giữ nguyên CRLF. Số lượt bỏ fallback cộng theo bảng là 406.

## 2. Token không có định nghĩa trong DS, đã giữ nguyên

| Tên token | File | Dòng | Fallback |
|---|---|---|---|
| --detail-content-min-width | prototypes/cam-nang-phan-quyen/styles/tra-cuu-cam-nang-v2.css | 1252 | 760px |

Lưu ý: fallback ở đây là giá trị `760px` chứ không phải hex.

## 3. Tổng

Đã bỏ fallback: 406 lượt. Giữ nguyên: 1 lượt. Tổng 406 + 1 = 407, khớp với số đo 407 trong bản giao việc.

## 4. Điều đáng nói ngoài phạm vi

`--detail-content-min-width` không phải token bịa: nó là custom property được JavaScript đặt runtime qua `style.setProperty('--detail-content-min-width', ...)` trong hai file `tra-cuu-cam-nang.html` và `tra-cuu-cam-nang-v2.html`. Tôi giữ nguyên đúng theo quy trình vì không có định nghĩa CSS trong design-system; nếu coi runtime custom property là hợp lệ thì có thể bỏ fallback này sau, nhưng đó là quyết định ngoài phạm vi của tôi.

Còn nhiều hex hardcode trực tiếp nằm ngoài `var()` trong các file prototype, ví dụ `background:#fff`, `color:#fff`, `rgba(...)`, màu vùng diff kiểu `#fecaca`, `#fff1f2`. Chúng không phải fallback nên không đụng tới, nhưng đáng để một phiên sau rà soát.

Trong số fallback vừa bỏ có nhiều cặp hex lệch màu so với giá trị thật của token và cùng một token có nhiều giá trị fallback khác nhau, ví dụ `--border-secondary` từng kèm `#ddd`, `#e5e7eb`, `#d1d5db`, `#eee`. Nay đã bỏ hết, không còn chỗ nào đọc nhầm hex dự phòng là màu thật.

Về phạm vi: hai file đóng băng `tra-cuu-cam-nang.html` và `styles/tra-cuu-cam-nang.css` không bị đụng tới, không có file nào ngoài `prototypes/` bị sửa ngoài chính file báo cáo này.
