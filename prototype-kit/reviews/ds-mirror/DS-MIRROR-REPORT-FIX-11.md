# DS-MIRROR-REPORT-FIX-11

Báo cáo của phiên xử lý bản giao FIX-11: dọn nốt `type="outline"` trong `prototypes/` theo rule 17 và 18 của `AGENTS.md`. Chỉ sửa đúng 8 file liệt kê, tạo mới `DS-MIRROR-REPORT-FIX-11.md`, không commit, không đụng `tra-cuu-cam-nang.html` (bản đóng băng) và không đụng file nào khác.

Ghi chú về số lượng trước khi vào bảng: điều phối đếm 43 "chỗ" dùng `type="outline"` và con số này khớp chính xác với 43 dòng lệnh thay đổi trong `git diff --stat`. Số nút thực tế là 52 vì một số dòng trong `danh-sach-luong.html` và `danh-sach-loai-dieu-kien.html` chứa 2 nút outline trên cùng một dòng (icon Xem + icon Sửa). Toàn bộ 52 nút trong 43 dòng đều đã được xử lý.

## 1. Bảng chi tiết từng nút đã đổi

### `prototypes/cam-nang-phan-quyen/uy-quyen-noi-bo.html`: 20 dòng / 20 nút, đổi hết

| Dòng | Nút | Nhóm | Trước | Sau |
|------|-----|------|-------|-----|
| 1042 | "Xuất Excel" (icon-button, prefixIcon download) | 2 - hành động phụ | `type="outline" color="secondary"` | `type="light" color="secondary"` |
| 1411 | "Thêm liên kết" trong drawer tạo ủy quyền | 2 - hành động phụ | `type="outline" color="primary"` | `type="light" color="primary"` |
| 1422 | "Hủy" (đóng drawer tạo, không làm gì) | 1 - nút thoát | `type="outline" color="secondary"` | `type="link" color="primary"` |
| 1507 | "Thêm liên kết" trong drawer sửa ủy quyền | 2 - hành động phụ | `type="outline" color="primary"` | `type="light" color="primary"` |
| 1518 | "Hủy" (đóng drawer sửa, không làm gì) | 1 - nút thoát | `type="outline" color="secondary"` | `type="link" color="primary"` |
| 1528 | "Đóng" (đóng drawer chi tiết, không làm gì) | 1 - nút thoát | `type="outline" color="secondary"` | `type="link" color="primary"` |
| 1833 | "Quay lại" (đóng form ủy quyền, không làm gì) | 1 - nút thoát | `type="outline" color="secondary"` | `type="link" color="primary"` |
| 1837 | "Hủy" (đóng form ủy quyền, không làm gì) | 1 - nút thoát | `type="outline" color="secondary"` | `type="link" color="primary"` |
| 1967, 1972, 1977, 1981, 2017 | "Đóng" trong JS render footer drawer chi tiết (5 nút) | 1 - nút thoát | `type="outline" color="secondary"` | `type="link" color="primary"` |
| 1968, 1973, 2019 | "Từ chối" (rejectPendingDetail, 3 nút) | 2 - hành động phụ | `type="outline" color="secondary"` | `type="light" color="secondary"` |
| 1978 | "Ngừng hiệu lực" (stopActiveDetail) | 2 - hành động phụ | `type="outline" color="secondary"` | `type="light" color="secondary"` |
| 2047, 2052 | "Xem" (openDetailDrawer, 2 nút) | 2 - hành động phụ | `type="outline" color="secondary"` | `type="light" color="secondary"` |
| 2053 | "Từ chối" (resolveConfirmation rejected) | 2 - hành động phụ | `type="outline" color="secondary"` | `type="light" color="secondary"` |

Lưu ý phân loại: các nút "Từ chối" trong file này mang `color="secondary"`, không phải `color="error"`/`color="warning"`, nên xếp nhóm 2 (hành động phụ, giữ nguyên color) thay vì nhóm 3. Kết quả khớp với bản giao: `type="light"`, giữ nguyên `color="secondary"`.

### `prototypes/cam-nang-phan-quyen/danh-sach-luong.html`: 6 dòng / 10 nút, đổi hết

| Dòng | Nút | Nhóm | Trước | Sau |
|------|-----|------|-------|-----|
| 110, 116, 122, 128 | Mỗi dòng 2 nút: "Xem chi tiết" (visibility) + "Sửa" (edit), tổng 8 nút | 2 - hành động phụ | `type="outline" color="secondary"` | `type="light" color="secondary"` |
| 191, 192 | 2 nút "Xem chi tiết" + "Sửa" trong JS render table | 2 - hành động phụ | `type="outline" color="secondary"` | `type="light" color="secondary"` |

### `prototypes/cam-nang-phan-quyen/danh-sach-loai-dieu-kien.html`: 5 dòng / 10 nút, đổi hết

| Dòng | Nút | Nhóm | Trước | Sau |
|------|-----|------|-------|-----|
| 113, 122, 131, 140, 149 | Mỗi dòng 2 nút: "Xem chi tiết" (visibility) + "Sửa" (edit), tổng 10 nút | 2 - hành động phụ | `type="outline" color="secondary"` | `type="light" color="secondary"` |

### `prototypes/cam-nang-phan-quyen/quan-ly-orgbase.html`: 4 dòng / 4 nút, đổi hết

| Dòng | Nút | Nhóm | Trước | Sau |
|------|-----|------|-------|-----|
| 174, 199, 224, 253 | "Xem chi tiết" (visibility, 4 nút) | 2 - hành động phụ | `type="outline" color="secondary"` | `type="light" color="secondary"` |

### `prototypes/cam-nang-phan-quyen/quan-ly-cam-nang.html`: 3 nút, đổi hết

| Dòng | Nút | Nhóm | Trước | Sau |
|------|-----|------|-------|-----|
| 393 | "Tạo WorkItem" (chuyển trang tạo mới) | 2 - hành động phụ | `type="outline" color="primary"` | `type="light" color="primary"` |
| 444 | "Sửa" (chuyển trang sửa) | 2 - hành động phụ | `type="outline" color="primary"` | `type="light" color="primary"` |
| 496 | "Cấu hình Tier" (mang màu cảnh báo) | 3 - giữ màu cảnh báo | `type="outline" color="warning"` | `type="light" color="warning"` |

### `prototypes/cam-nang-phan-quyen/tao-workitem.html`: 2 nút, đổi hết

| Dòng | Nút | Nhóm | Trước | Sau |
|------|-----|------|-------|-----|
| 984 | "Thêm" (thêm dòng trong form) | 2 - hành động phụ | `type="outline" color="primary"` | `type="light" color="primary"` |
| 1074 | "Thêm URL" (addLinkRow) | 2 - hành động phụ | `type="outline" color="primary"` | `type="light" color="primary"` |

### `prototypes/cam-nang-phan-quyen/sua-workitem.html`: 2 nút, đổi hết

| Dòng | Nút | Nhóm | Trước | Sau |
|------|-----|------|-------|-----|
| 958 | "Thêm" (thêm dòng trong form) | 2 - hành động phụ | `type="outline" color="primary"` | `type="light" color="primary"` |
| 1051 | "Thêm URL" (addLinkRowEdit) | 2 - hành động phụ | `type="outline" color="primary"` | `type="light" color="primary"` |

### `prototypes/cam-nang-phan-quyen/danh-sach-workitem.html`: 1 nút, đổi hết

| Dòng | Nút | Nhóm | Trước | Sau |
|------|-----|------|-------|-----|
| 547 | "Hủy" (đóng dialog clone, không làm gì) | 1 - nút thoát | `type="outline" color="secondary"` | `type="link" color="primary"` |

Tổng: 43 dòng / 52 nút, trong đó 11 nút thoát sang `type="link" color="primary"` và 41 nút hành động sang `type="light"`, gồm 40 nút giữ nguyên color secondary/primary và 1 nút giữ `color="warning"`.

## 2. Chỗ giữ nguyên và lý do

Không có chỗ nào giữ nguyên trong 8 file này: đây đều là trang prototype chức năng, không có trang nào đang minh hoạ chính kiểu outline như `design-system/preview/components/button.html` ở lượt FIX-10, nên không có ngoại lệ nhóm 4. Toàn bộ nút đều phân loại rõ ràng vào nhóm 1 (thoát) hoặc nhóm 2/3 (hành động), không có chỗ phân vân phải để lại.

Duy nhất một điểm cần ghi nhận để điều phối nắm: các nút "Từ chối" trong `uy-quyen-noi-bo.html` có sẵn `color="secondary"`, đã xếp nhóm 2 và giữ `color="secondary"`. Nếu điều phối muốn coi đây là nhóm 3 (hành động nguy hiểm) thì kết quả vẫn ra `type="light" color="secondary"` y hệt vì màu sẵn có vốn là secondary.

## 3. Kết quả `grep -c 'type="outline"'` sau khi sửa

| File | Số dòng còn chứa outline |
|------|--------------------------|
| `prototypes/cam-nang-phan-quyen/uy-quyen-noi-bo.html` | 0 |
| `prototypes/cam-nang-phan-quyen/danh-sach-luong.html` | 0 |
| `prototypes/cam-nang-phan-quyen/danh-sach-loai-dieu-kien.html` | 0 |
| `prototypes/cam-nang-phan-quyen/quan-ly-orgbase.html` | 0 |
| `prototypes/cam-nang-phan-quyen/quan-ly-cam-nang.html` | 0 |
| `prototypes/cam-nang-phan-quyen/tao-workitem.html` | 0 |
| `prototypes/cam-nang-phan-quyen/sua-workitem.html` | 0 |
| `prototypes/cam-nang-phan-quyen/danh-sach-workitem.html` | 0 |

Đã kiểm thêm `grep -o 'type="outline"' | wc -l` (đếm nút, kể cả nhiều nút trên một dòng): cả 8 file đều ra 0.

## 4. Kết quả `file` từng file - xác nhận CRLF còn nguyên

Toàn bộ 8 file vẫn báo CRLF line terminators sau khi sửa: `uy-quyen-noi-bo.html` (HTML document text, Unicode text, UTF-8 text, with very long lines (444), with CRLF line terminators), `danh-sach-luong.html` (HTML document text, Unicode text, UTF-8 (with BOM) text, with very long lines (354), with CRLF line terminators), `danh-sach-loai-dieu-kien.html` (giống danh-sach-luong, UTF-8 không BOM), `quan-ly-orgbase.html` (UTF-8 with BOM, CRLF), `quan-ly-cam-nang.html` (UTF-8, CRLF), `tao-workitem.html` (UTF-8, very long lines (356), CRLF), `sua-workitem.html` (UTF-8, very long lines (353), CRLF), `danh-sach-workitem.html` (UTF-8, very long lines (392), CRLF). Không file nào chuyển sang LF.

## 5. Kết quả `git diff --stat prototypes/`

```
 .../danh-sach-loai-dieu-kien.html                  | 10 +++---
 .../cam-nang-phan-quyen/danh-sach-luong.html       | 12 +++----
 .../cam-nang-phan-quyen/danh-sach-workitem.html    |  2 +-
 .../cam-nang-phan-quyen/quan-ly-cam-nang.html      |  6 ++--
 .../cam-nang-phan-quyen/quan-ly-orgbase.html       |  8 +++---
 prototypes/cam-nang-phan-quyen/sua-workitem.html   |  4 +--
 prototypes/cam-nang-phan-quyen/tao-workitem.html   |  4 +--
 .../cam-nang-phan-quyen/uy-quyen-noi-bo.html       | 40 +++++++++++-----------
 8 files changed, 43 insertions(+), 43 deletions(-)
```

Số dòng đổi khớp đúng 43 chỗ điều phối đếm, không có file nào bị ghi đè cả dòng, và `git diff` chỉ thấy đúng 8 file trong phạm vi. Trước khi áp dụng vào repo, tôi đã chạy cùng một bộ phép thay thế trên bản sao trong /tmp, đối chiếu từng file và xác nhận CRLF; sau khi áp dụng, `cmp` 8 file thật với 8 file đã kiểm trước cho kết quả khớp từng byte.

Kết quả phân loại theo nhóm: 11 nút thoát sang `type="link" color="primary"` (áp dụng đúng nút "Hủy", "Đóng", "Quay lại" đóng modal/drawer/form), 40 nút hành động sang `type="light"` giữ nguyên color secondary/primary, 1 nút `color="warning"` sang `type="light"` giữ `color="warning"`. Toàn bộ nút trong cả 8 file chỉ đổi `type` và (với nhóm thoát) `color`; không đụng `href`, `id`, `class`, `prefixIcon`, `title`, `onclick` hay bất kỳ phần nào khác của trang.
