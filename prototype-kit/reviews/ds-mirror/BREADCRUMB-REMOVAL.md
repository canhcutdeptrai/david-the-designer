# BREADCRUMB-REMOVAL - Báo cáo nghiệm thu

## 1. `prototypes/shared-nav.js` - hàm nào xoá, hàm nào giữ

Xoá toàn bộ 8 hàm chỉ phục vụ breadcrumb: `getEntryLabel`, `getPageTitle`, `uniqueTrail`, `findBreadcrumb`, `fallbackBreadcrumb`, `escapeHtml`, `breadcrumbHref`, `injectBreadcrumb`, cùng lời gọi `injectBreadcrumb();` ở cuối IIFE.

Giữ nguyên mọi hàm còn lại vì không liên quan breadcrumb và vẫn có người gọi: `applyPageOverrides` (ẩn action zone của trang Tra cứu đóng băng khi mở trực tiếp), `groupHasActive` (renderGroup dùng để mở sẵn nhánh menu đang active), `renderItem`/`renderGroup`/`navState*`/`remember*` (dựng sidebar và nhớ trạng thái thu gọn).

Thuộc tính `breadcrumbLabel` còn đúng 2 chỗ trong dữ liệu menu, người đọc duy nhất là `getEntryLabel` đã xoá, nên xoá luôn cả 2.

## 2. Bảng theo file

| File | Rule CSS xoá | Số dòng xoá | Markup/JS xoá |
|---|---|---|---|
| `danh-sach-workitem.html` | 6 rule (1 `.page-breadcrumb` + 5 `.wi-breadcrumb`) | 32 dòng | Markup: comment `<!-- Breadcrumb -->` + div `.wi-breadcrumb` (6 dòng kể cả dòng trống). JS: hàm `updateBreadcrumb` + comment nhóm (18 dòng) và 2 lời gọi `updateBreadcrumb(id);` |
| `chi-tiet-workitem.html` | 2 rule (`.page-breadcrumb`, `html.embedded-mode .page-breadcrumb`) | 2 dòng | Không |
| `tao-workitem.html` | 2 rule (`.page-breadcrumb`, `html.embedded-mode .page-breadcrumb`) | 2 dòng | Không |
| `sua-workitem.html` | 2 rule (`.page-breadcrumb`, `html.embedded-mode .page-breadcrumb`) | 2 dòng | Không |
| `CHANGELOG.html` | 1 rule viết 3 dòng | 7 dòng (3 dòng comment + 3 dòng rule + dòng trống) | Không |
| `styles/tra-cuu-cam-nang-v2.css` | 1 rule | 3 dòng (comment + rule + dòng trống) | Không |
| `design-system/preview/patterns/page-header.html` | Không - sửa chữ tài liệu | 1 dòng đổi | Không |

JS trong `danh-sach-workitem.html`: trước khi xoá markup đã kiểm, hàm `updateBreadcrumb` có null-check (`if (!bc) return`) nên xoá markup không gây lỗi runtime, nhưng thân hàm vẫn chứa chuỗi `'wi-breadcrumb'` làm phép kiểm grep số 3 fail, nên xoá luôn hàm và 2 call site cho khớp yêu cầu "gỡ tận gốc".

## 3. Rule CSS giữ lại vì selector dùng chung

Không có rule nào bị giữ. Mọi rule chứa `.page-breadcrumb`, `.page-breadcrumb-item`, `.page-breadcrumb-link`, `.page-breadcrumb-current`, `.page-breadcrumb-separator`, `.wi-breadcrumb` hoặc biến thể đều là selector thuần breadcrumb hoặc ghép `html.embedded-mode` đang nhắm vào chính đối tượng breadcrumb, nên xoá sạch không mất dáng của phần tử khác. Không cần giữ cái nào.

## 4. Kết quả 4 phép kiểm bắt buộc

Phép 1 - `node --check prototypes/shared-nav.js`: không lỗi cú pháp.

Phép 2 - đếm `{` và `}`, tất cả bằng nhau:

```
prototypes/cam-nang-phan-quyen/danh-sach-workitem.html  open=388 close=388
prototypes/cam-nang-phan-quyen/chi-tiet-workitem.html  open=213 close=213
prototypes/cam-nang-phan-quyen/tao-workitem.html  open=574 close=574
prototypes/cam-nang-phan-quyen/sua-workitem.html  open=644 close=644
prototypes/cam-nang-phan-quyen/CHANGELOG.html  open=26 close=26
prototypes/cam-nang-phan-quyen/styles/tra-cuu-cam-nang-v2.css  open=398 close=398
```

Phép 3 - `grep -rn "breadcrumb" prototypes/ design-system/`, nguyên văn output:

```
prototypes/cam-nang-phan-quyen/styles/tra-cuu-cam-nang.css:2:    /* Rule 5 cua kit: OMEU khong dung breadcrumb. Pattern page-header sinh no luc chay nen phai an bang CSS. */
prototypes/cam-nang-phan-quyen/styles/tra-cuu-cam-nang.css:3:    .page-breadcrumb { display:none !important; }
prototypes/cam-nang-phan-quyen/_qc-spec.md:14:- To-be (QC): không sidebar, không breadcrumb, trang standalone full-width, chỉ gồm header + nội dung.
design-system/SD_MIGRATION_TODO.md:102:Builder chốt 2026-09-20: **bỏ breadcrumb, tuyệt đối không dùng ở bất kỳ đâu.** Rule 5 giữ nguyên, code sửa cho khớp.
design-system/SD_MIGRATION_TODO.md:104:Trước đó `prototypes/shared-nav.js` chủ động sinh breadcrumb cho mọi trang - có từ commit đầu tiên `191c3b8`, viết kỹ với logic dò đường trong menu và phương án dự phòng. Đã gỡ tận gốc phần sinh, không chặn bằng CSS.
design-system/SD_MIGRATION_TODO.md:106:Điểm đáng ghi lại: rà ra **nhiều trang đã tự chặn bằng `.page-breadcrumb { display:none !important; }`** từ trước. Nghĩa là người viết trang không muốn breadcrumb, nhưng thay vì gỡ chỗ sinh ra nó thì lại đi chặn ở từng trang. Gỡ gốc xong thì mấy dòng `!important` đó cũng bỏ được luôn.
design-system/SD_MIGRATION_TODO.md:108:Hai file đóng băng `tra-cuu-cam-nang.html` và CSS của nó giữ nguyên breadcrumb - chúng là ảnh chụp một thời điểm để đối chiếu QC, không phải trang cho người xem.
```

Kết quả chỉ còn nằm ở: `styles/tra-cuu-cam-nang.css` (file đóng băng), `_qc-spec.md` và `design-system/SD_MIGRATION_TODO.md` (file tài liệu .md). Đạt.

Phép 4 - `file` trên các file HTML đã sửa: 5 file prototype đều báo "with CRLF line terminators" thuần sau khi chuẩn hoá. `page-header.html` vốn là LF ngay từ trước khi sửa, không phải CRLF, nên không chuyển để tránh làm bẩn diff.

Note: `apply_patch` chèn dòng LF vào file gốc CRLF làm file thành "CRLF, LF line terminators"; đã chuẩn hoá về CRLF thuần để không kẹt bẫy CRLF của kit (~ đúng bài học trong `_memory/lessons.md`).

## 5. Xác nhận hai file đóng băng không bị đụng

`prototypes/cam-nang-phan-quyen/tra-cuu-cam-nang.html` và `prototypes/cam-nang-phan-quyen/styles/tra-cuu-cam-nang.css` không xuất hiện trong `git status` (không bị sửa). CSS breadcrumb trong file đóng băng giữ nguyên làm mốc đối chiếu như yêu cầu.

## 6. Rủi ro - chỗ nào bố cục đầu trang có thể xê dịch

Nói thật: trong phạm vi các file được sửa, `danh-sach-workitem.html`, `chi-tiet-workitem.html`, `tao-workitem.html`, `sua-workitem.html`, `CHANGELOG.html` và `tra-cuu-cam-nang-v2.css` đều từng chặn breadcrumb bằng `display:none`, nên gỡ không làm xê dịch gì trên chúng.

Breadcrumb được `shared-nav.js` inject vào đầu `.page-header-left` của mọi trang dùng pattern page-header, cao cỡ một dòng nội dung. Trang nào trước đây đã tự chặn bằng CSS thì không đổi; trang nào KHÔNG có rule chặn (ví dụ `danh-sach-cam-nang.html`, `chi-tiet-position.html`, `danh-sach-luong.html` và các trang BREAD khác của Cẩm nang) sẽ mất một dòng breadcrumb cao cỡ 28-30px, kéo title và toàn bộ nội dung bên dưới dịch lên đúng khoảng đó. Đây là hành vi đúng theo Rule 5 nhưng cần mắt người kiểm lại nhịp dọc của các trang đó, không đoán là vô hại.

Rủi ro kỹ thuật thêm: không còn ai đụng DOM breadcrumb, `applyPageOverrides`, `groupHasActive` và logic sidebar giữ nguyên, không có chỗ nào syntax hoặc ngoặc lệch theo phép kiểm ở trên.
