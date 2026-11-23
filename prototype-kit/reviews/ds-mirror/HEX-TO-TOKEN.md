# HEX-TO-TOKEN - Đối chiếu màu cứng trong prototype với token DS

Người thực thi: Codex (phiên thực thi nhận việc từ điều phối).

Phạm vi: khối `<style>` của các file `.html` và file `.css` trong `prototypes/`, trừ `tra-cuu-cam-nang.html`, `tra-cuu-cam-nang-v2.html`, `styles/tra-cuu-cam-nang.css`, `styles/tra-cuu-cam-nang-v2.css`. Không đụng `design-system/`. Không đụng mã màu trong HTML markup, inline style attribute, hay chuỗi JavaScript.

Phương pháp: quét toàn bộ khai báo `--ten-token: #hex;` trong `design-system/core/styles/*.css`, nở dạng 3 ký tự thành 6, rồi resolve chuỗi `var(--ten-token)` để có bản đồ hex đầy đủ gồm cả token ngữ nghĩa (`--surface-*`, `--text-*`, `--border-*`, `--icon-*`). Với mỗi mã màu cứng trong phạm vi, thường hoá rồi tra bản đồ; khớp tuyệt đối mới thay.

Kết quả đo được: trong phạm vi có 183 lượt mã màu cứng, trong đó 66 lượt khớp chính xác token DS (đã sửa) và 117 lượt không khớp (chỉ đề xuất, không sửa). Bản giao việc ghi 185/68/117; chênh lệch 2 lượt nằm trong comment của `tra-cuu-cam-nang-v2.css` (`#BBBBBB`, `#757575`) - file đã loại khỏi phạm vi, nên số đúng trong phạm vi là 183/66/117.

## 1. Kết quả theo file

| File | Số lượt đã thay | Ngoặc `{`/`}` trước | Ngoặc `{`/`}` sau | CRLF |
|---|---|---|---|---|
| chi-tiet-workitem.html | 2 | 215/215 | 215/215 | còn nguyên |
| danh-sach-position.html | 8 | 209/209 | 209/209 | còn nguyên |
| danh-sach-workitem.html | 19 | 399/399 | 399/399 | còn nguyên |
| quan-ly-cam-nang.html | 1 | 153/153 | 153/153 | còn nguyên |
| sua-position.html | 2 | 39/39 | 39/39 | còn nguyên |
| sua-workitem.html | 16 | 646/646 | 646/646 | còn nguyên |
| tao-orgbase.html | 1 | 61/61 | 61/61 | còn nguyên |
| tao-position.html | 2 | 26/26 | 26/26 | còn nguyên |
| tao-workitem.html | 15 | 576/576 | 576/576 | còn nguyên |

CRLF xác nhận bằng lệnh `file` trên cả 9 file sau khi sửa, tất cả báo "with CRLF line terminators". Mỗi dòng đổi chỉ có đúng một chuỗi hex được thay bằng `var(--token)`, không đổi thụt đầu dòng, không gộp hay sắp xếp lại dòng.

## 2. Bảng ánh xạ đã sửa

| Hex gốc | Token thay | Số lượt |
|---|---|---|
| `#fff` | `var(--surface-primary)` (background) | 44 |
| `#fff` | `var(--text-inverse)` (color) | 11 |
| `#f5f5f5` | `var(--surface-hover)` (background) | 2 |
| `#757575` | `var(--text-secondary)` (color) | 5 |
| `#757575` | `var(--color-neutral-800)` (border-color) | 2 |
| `#212121` | `var(--text-primary)` (color) | 2 |

Tổng 66 lượt. Tất cả token thay đều resolve về đúng hex gốc, nên không đổi diện mạo.

## 3. Hex khớp nhiều token

`#FFFFFF` khớp `--color-neutral-0`, `--surface-primary`, `--surface-sidebar`, `--surface-page-alt`, `--text-inverse`, `--text-on-primary`, `--icon-on-primary`, `--icon-on-color`. Chọn theo thuộc tính: dùng làm `background` thì `--surface-primary`, dùng làm `color` thì `--text-inverse`. Không dùng `--surface-sidebar` hay `--surface-page-alt` vì vai trò hẹp hơn (sidebar / page-alt) không đúng ngữ cảnh chung.

`#757575` khớp `--color-neutral-800`, `--text-secondary`, `--sd-secondary`, `--sd-black400`. Dùng làm `color` thì `--text-secondary`. Dùng làm `border-color` (2 lượt ở `danh-sach-position.html`: viền khối external card và legend external) thì họ `--border-*` không có token giá trị `#757575` (border-strong là `#BFBFBF`, border-primary là `#E6E6E6`), nên theo nguyên tắc "không rơi vào nhóm nào chọn token chung nhất", chọn `--color-neutral-800`.

`#212121` khớp `--color-neutral-900`, `--text-primary`, `--surface-inverse`, `--sd-dark`, `--sd-black500`. Dùng làm `color` nên chọn `--text-primary`.

`#f5f5f5` khớp `--color-neutral-100` và `--surface-hover`. Dùng làm `background` nên chọn `--surface-hover`.

Các họ `--chart-*`, `--si-*`, `--sd-*` có cùng giá trị hex nhưng bị loại khỏi lựa chọn: `--chart-*` gắn scoped bảng dữ liệu, `--si-*` gắn scoped `sd-inform`, `--sd-*` là alias shim của bản cũ, không nằm trong danh sách họ được chọn.

## 4. Bảng đề xuất phần B (117 lượt không khớp, chưa sửa)

Nguyên tắc: chọn token DS phù hợp ngữ nghĩa nhất; màu gốc thuộc bảng Material nên gần như mọi dòng đều đổi màu nhìn thấy nếu áp dụng. Một số hex dùng ở nhiều vai trò (text / border / background) nên tách nhiều dòng đề xuất với cùng hex.

| Hex | Số lượt | File | Dùng ở thuộc tính gì | Vai trò ngữ nghĩa | Token DS đề xuất |
|---|---|---|---|---|---|
| `#e3f2fd` | 6 | danh-sach-position, sua-position, tao-position | background | Nền tag nguồn SAP, nền hover, nền picker đang chọn | `--color-info-50` |
| `#1565c0` | 2 | danh-sach-position | color | Chữ tag nguồn SAP, chữ icon hover | `--color-info-700` |
| `#90caf9` | 4 | sua-position, tao-position | border, border-color | Viền picker / panel đang chọn | `--color-info-200` |
| `#1976d2` | 2 | sua-position, tao-position | border-color | Viền hover picker | `--color-info-500` |
| `#f5f9ff` | 3 | danh-sach-position, sua-position, tao-position | background | Nền hàng hover, nền picker đang chọn | `--color-info-50` |
| `#e8f5e9` | 2 | danh-sach-position | background | Nền tag trạng thái active, nền hover action thành công | `--color-success-50` |
| `#2e7d32` | 4 | danh-sach-position | color | Chữ trạng thái active, chữ icon / action thành công | `--color-success-700` |
| `#1b5e20` | 3 | danh-sach-position | color | Chữ hover action thành công, tên ghế, icon success | `--color-success-700` |
| `#388e3c` | 2 | danh-sach-position | border, border-color | Viền thẻ ghế và legend ghế | `--color-success-500` |
| `#8bc34a` | 2 | danh-sach-position | border-color | Viền thẻ ghế manual | `--color-success-200` |
| `#a5d6a7` | 2 | danh-sach-position | background | Gradient thẻ ghế (điểm sáng) | `--color-success-100` |
| `#66bb6a` | 2 | danh-sach-position | background | Gradient thẻ ghế (điểm tối) | `--color-success-500` |
| `#c5e1a5` | 2 | danh-sach-position | background | Gradient thẻ ghế manual (điểm sáng) | `--color-success-100` |
| `#9ccc65` | 2 | danh-sach-position | background | Gradient thẻ ghế manual (điểm tối) | `--color-success-500` |
| `#dcfce7` | 1 | danh-sach-workitem | background | Nền trạng thái hàng valid khi import | `--color-success-50` |
| `#15803d` | 2 | chi-tiet-workitem, danh-sach-workitem | color | Chữ dòng diff mới, chữ trạng thái valid | `--color-success-700` |
| `#bbf7d0` | 1 | chi-tiet-workitem | border | Viền dòng diff mới | `--color-success-100` |
| `#f0fdf4` | 1 | chi-tiet-workitem | background | Nền dòng diff mới | `--color-success-50` |
| `#fff3e0` | 2 | danh-sach-position | background | Nền tag manual, nền tag vacant | `--color-warning-50` |
| `#e65100` | 2 | danh-sach-position | color | Chữ tag manual, chữ tag vacant | `--color-warning-700` |
| `#e65100` | 2 | danh-sach-position | border-color | Viền khối công ty và legend công ty trong org chart | `--color-warning-500` |
| `#fffde7` | 1 | danh-sach-position | background | Nền hàng thủ công (row-manual) | `--color-warning-50` |
| `#fff9c4` | 3 | danh-sach-position | background | Nền hover hàng thủ công, gradient khối team | `--color-warning-50` |
| `#ffd54f` | 1 | danh-sach-position | background | Gradient khối org (điểm sáng) | `--color-warning-200` |
| `#ffb300` | 1 | danh-sach-position | background | Gradient khối org (điểm tối) | `--color-warning-500` |
| `#ffcc80` | 2 | danh-sach-position | background | Gradient khối công ty (điểm sáng) | `--color-warning-100` |
| `#ff9800` | 2 | danh-sach-position | background | Gradient khối công ty (điểm tối) | `--color-warning-500` |
| `#ffe082` | 2 | danh-sach-position | background | Gradient khối division (điểm sáng) | `--color-warning-100` |
| `#ffc107` | 2 | danh-sach-position | background | Gradient khối division (điểm tối) | `--color-warning-500` |
| `#fff59d` | 2 | danh-sach-position | background | Gradient khối department (điểm sáng) | `--color-warning-50` |
| `#ffeb3b` | 2 | danh-sach-position | background | Gradient khối department (điểm tối) | `--color-warning-200` |
| `#fff176` | 2 | danh-sach-position | background | Gradient khối team (điểm tối) | `--color-warning-200` |
| `#d4a017` | 1 | danh-sach-position | border | Viền khối org (vàng gold) | `--color-warning-500` |
| `#fbc02d` | 2 | danh-sach-position | border-color | Viền khối department | `--color-warning-500` |
| `#ffa000` | 2 | danh-sach-position | border-color | Viền khối division | `--color-warning-500` |
| `#f9a825` | 2 | danh-sach-position | border-color | Viền khối team | `--color-warning-500` |
| `#fffaf5` | 1 | danh-sach-workitem | background | Nền vùng drop file khi import (kem nhạt) | `--color-warning-50` |
| `#c0842d` | 1 | danh-sach-workitem | color | Chữ nhánh clone workitem | `--color-warning-600` |
| `#fef3c7` | 1 | danh-sach-workitem | background | Nền trạng thái hàng warning khi import | `--color-warning-50` |
| `#b45309` | 1 | danh-sach-workitem | color | Chữ trạng thái hàng warning khi import | `--color-warning-700` |
| `#ffebee` | 1 | danh-sach-position | background | Nền hover action nguy hiểm | `--color-error-50` |
| `#c62828` | 2 | danh-sach-position | color | Chữ hover action nguy hiểm, chữ trạng thái ghế | `--color-error-600` |
| `#fee2e2` | 1 | danh-sach-workitem | background | Nền trạng thái hàng blocked khi import | `--color-error-50` |
| `#b91c1c` | 2 | chi-tiet-workitem, danh-sach-workitem | color | Chữ dòng diff cũ, chữ trạng thái blocked | `--color-error-600` |
| `#fecaca` | 1 | chi-tiet-workitem | border | Viền dòng diff cũ | `--color-error-100` |
| `#fff1f2` | 1 | chi-tiet-workitem | background | Nền dòng diff cũ | `--color-error-50` |
| `#e0e0e0` | 2 | danh-sach-position | border, border-bottom | Viền khung bảng, viền dưới header bảng | `--border-primary` |
| `#e0e0e0` | 1 | danh-sach-position | background | Gradient khối external (điểm sáng) | `--color-neutral-300` |
| `#bdbdbd` | 2 | sua-position, tao-position | border | Viền ô picker cơ quan | `--border-strong` |
| `#bdbdbd` | 1 | danh-sach-position | background | Gradient khối external (điểm tối) | `--color-neutral-400` |
| `#fafafa` | 1 | danh-sach-position | background | Nền header bảng | `--surface-secondary` |
| `#f0f0f0` | 1 | danh-sach-position | border-bottom | Đường chia dòng dữ liệu | `--border-secondary` |
| `#616161` | 2 | danh-sach-position | color | Chữ header bảng, chữ badge external | `--text-secondary` |
| `#455a64` | 1 | danh-sach-position | color | Chữ cột mã trong bảng | `--text-secondary` |
| `#9e9e9e` | 4 | sua-position, tao-position | color | Chữ placeholder và icon placeholder của picker | `--text-secondary` |
| `#424242` | 2 | sua-position, tao-position | color | Chữ giá trị trong panel thông tin đã chọn | `--text-primary` |
| `#b0bec5` | 6 | danh-sach-position | background | Đường nối cây org chart | `--border-primary` |
| `#eceff1` | 1 | danh-sach-position | background | Gradient thẻ external (điểm sáng) | `--color-neutral-200` |
| `#cfd8dc` | 1 | danh-sach-position | background | Gradient thẻ external (điểm tối) | `--color-neutral-400` |
| `#37474f` | 1 | danh-sach-position | color | Chữ tên trong thẻ external | `--text-primary` |
| `#546e7a` | 1 | danh-sach-position | color | Chữ chức danh trong thẻ external | `--text-secondary` |
| `#3e2723` | 1 | danh-sach-position | color | Chữ tên khối org chart (nâu) | `--text-primary` |
| `#5d4037` | 1 | danh-sach-position | color | Chữ loại khối org chart (nâu nhạt) | `--text-secondary` |

Tổng số dòng đề xuất: các dòng trên cộng dồn bằng 117 lượt hiện có (mỗi lượt được gán đúng một dòng trong bảng; một số hex xuất hiện ở 2 dòng vì khác vai trò).

## 5. Màu không có token phù hợp

Các cặp gradient của org chart trong `danh-sach-position.html` không có token nào thay được, vì DS không có hệ token gradient và quy ước OMEU cấm gradient; các mã như `#ffd54f`, `#ffb300`, `#ffcc80`, `#ff9800`, `#ffe082`, `#ffc107`, `#fff59d`, `#ffeb3b`, `#fff9c4`, `#fff176`, `#a5d6a7`, `#66bb6a`, `#c5e1a5`, `#9ccc65`, `#e0e0e0`, `#bdbdbd`, `#eceff1`, `#cfd8dc` chỉ dùng làm điểm dừng gradient. Nếu chỉ thay từng mã bằng token đơn sẽ vẫn còn gradient và màu nhìn khác hẳn; quyết định đúng là chuyển sang nền solid bằng token warning/success/neutral (đã đề xuất ở mục 4 cho từng vai trò) hoặc để nguyên như bản đóng băng, và cần Builder chốt.

`#fffaf5` (nền drop zone khi import) là tông kem rất nhạt, không có token tint nào trùng tông; `--color-warning-50` là gần nhất về ngữ nghĩa nhưng lệch màu thấy rõ. Nếu muốn giữ đúng tông kem thì đây là khoảng trống bảng màu, không có token phù hợp.

`#fff1f2` / `#f0fdf4` (nền diff cũ / mới) là pastel đỏ / xanh rất nhạt; `--color-error-50` (`#FED5D0`) và `--color-success-50` (`#EDF7ED`) là hướng thay duy nhất theo ngữ nghĩa nhưng bão hòa hơn hẳn, làm mất vẻ "diff mờ". Nếu muốn giữ đúng gam pastel hiện tại thì đây cũng là khoảng trống bảng màu.

## 6. Rủi ro

Phần A: cả 66 lượt đều khớp tuyệt đối về giá trị hex nên không đổi diện mạo. Tôi đã kiểm không có style block nào định nghĩa lại các token `--surface-primary`, `--text-inverse`, `--surface-hover`, `--text-secondary`, `--text-primary`, `--color-neutral-800`, nên không có chuyện local override làm lệch màu. Rủi ro duy nhất mang tính dài hạn: `--surface-hover` được dùng cho 2 nền "vùng" (nền org chart, nền tag inactive), nếu sau này token hover đổi thì các nền đó đổi theo dù không phải vai trò hover; chọn token này là bắt buộc theo quy tắc "background dùng họ `--surface-*`" vì không còn surface token nào giá trị `#F5F5F5`.

Con số lệch với bản giao việc: tôi đếm 183 lượt trong phạm vi và 66 lượt khớp, không phải 185/68. Hai lượt thừa nằm trong comment của `tra-cuu-cam-nang-v2.css` (`#BBBBBB` và `#757575`, cả hai đều khớp token), đã bị loại khỏi phạm vi. Đề nghị đối chiếu lại trước khi tin vào "68 lượt" trên bản giao việc; 66 là số chính xác đã sửa.

Phần B chưa sửa nên không có rủi ro trước mắt, nhưng khi áp dụng đề xuất thì các điểm dễ lệch mắt nhất là: tag nguồn/trạng thái trong bảng (Material Blue/Green/Orange đổi sang gam OMEU, rõ nhất ở `#e65100`, `#1565c0`, `#2e7d32`), viền picker `#90caf9` sang `--color-info-200` (gần khớp), khối org chart giữ nguyên gradient nhưng từng mã màu nếu thay lẻ sẽ đổi gam cam vàng đậm nhạt, và dòng diff old/new nếu dùng error-50/success-50 sẽ bão hòa hơn hẳn hiện tại. Quyết định ngữ nghĩa của những dòng này phải do Builder chốt, tôi mới chỉ đề xuất.

Kiểm tra cuối: toàn bộ 9 file sau sửa giữ CRLF, số `{` và `}` bằng nhau trước và sau (xem mục 1), số lượt màu cứng còn lại trong phạm vi đúng 117.
