# SD Migration TODO

Việc còn lại để mirror bám sát thư viện Angular thật.

**Căn cứ đã đổi.** File này viết lần đầu 2026-06-22, khi tiêu chí là "component nào có preview HTML thì dựng `sd-*` tương đương". Từ đợt mirror v2.11.0 (2026-09-19), tiêu chí là **Portal chuẩn có gì thì mirror cái đó**: https://sdcorejs.github.io/portal-template/ . Portal không có thì mirror không dựng, dù preview HTML cũ có tồn tại.

Đối chiếu đầy đủ với Portal nằm ở `../DS-MIRROR-REVIEW.md`.

---

## Bốn component HTML cũ — ĐÃ GỠ 2026-10-14

Trang preview `password.html`, `otp.html`, `unit.html`, `tag-chip.html` (cờ `legacy: true`) đã gỡ khỏi kit
theo Rule 18 — catalog `@sd-angular/core` 19.0.10 không có component nào trong số này. Dùng thay:

| Cũ | Dùng |
|---|---|
| Password | `<sd-input type="password">` (catalog `#c-input` có `type`) |
| OTP | Không có trong catalog — không dựng. Cần thì hỏi Builder |
| Unit (ô có đơn vị) | `suffix` / `suffixIcon` của `sd-input` · `sd-input-number` |
| Tag Chip | Ô nhập danh sách: `sd-chip`. Nhãn hiển thị: `sd-badge type="round"` |

CSS cũ (`.form-field-otp*`, `.form-field-unit*`…) còn trong `components.css` cho trang đã dựng; trang mới không dùng.

---

## Pattern page — ĐÃ CHUYỂN 2026-10-14

`preview/patterns/add-page.html` · `edit-page.html` · `add-side-drawer.html`: `.form-field-dropdown` / `.form-field-unit`
/ `.form-check` / `<table class="inline-table">` → `sd-select` · `sd-input-number suffix` · `sd-checkbox` / `sd-radio`
· `sd-table addable` (cột `raw`). `read-page.html`: `.tabs > button.tab` → `sd-tab-group`.

---

## Prototype chưa chuyển hết sang sd-*

Phần này nói về `prototypes/`, khác với mục trên nói về `preview/` và `patterns/`. Bản đóng băng `tra-cuu-cam-nang.html` và CSS của nó không tính vào đây - nó giữ nguyên làm mốc so sánh QC.

### Tab: `sd-tab-group` đã có nhưng chưa prototype nào dùng

| Nơi | Số chỗ `.tab` | Ghi chú |
|---|---|---|
| `tra-cuu-cam-nang-v2.html` | 6 | Gồm 3 loại khác nhau, xem bên dưới |
| `danh-sach-position.html` | 6 | Chưa rà |
| `uy-quyen-noi-bo.html` | 2 | `.delegation-tab` |
| `chi-tiet-workitem.html` | 2 | `.snapshot-tab`, hợp `variant="pills"` |

`sd-tab-group` hiện chỉ xuất hiện ở `preview/components/tab-group.html` và `preview/index.html`, chưa vào prototype nào.

**Nguyên nhân gốc, tìm ra sau khi đọc kỹ cả hai bên:** `sd-tab-group` gắn liền thanh tab với phần thân - nó nhận các thẻ `sd-tab` con rồi tự ẩn hiện nội dung bên trong chúng. Còn pattern `page-header` chỉ sinh **thanh tab**, qua attribute `data-page-tabs="Tất cả,Đang bán,Ngừng bán"`; phần thân hoàn toàn do trang tự quản, trang tự gắn `onclick` để đổi nội dung.

Hai mô hình không khớp nhau. **DS đang thiếu một thanh tab đứng độc lập**, loại chỉ phát ra "người dùng vừa chọn tab thứ mấy" rồi để trang tự lo phần thân. Dùng `sd-tab-group` với các `sd-tab` rỗng thì chạy được, nhưng là lách chứ không phải dùng đúng.

Hệ quả: chuyển tab cấp 1 sang `sd-tab-group` không phải sửa một pattern, mà là sửa pattern **cộng** với việc dựng lại cách nối tab của mọi trang đang dùng `data-page-tabs`. Đây là lý do thật, chính xác hơn cách diễn đạt "kiến trúc lệch" ở đoạn dưới.

**Quyết định đã chốt cho `tra-cuu-cam-nang-v2.html`: hoãn, không nâng tab trong đợt này.** Lý do không phải ngại việc, mà là 6 chỗ đó thuộc ba loại khác nhau và chỉ một loại đáng chuyển:

1. Tab cấp 1 (Theo hạng mục / Theo nhân sự / Ủy quyền nội bộ) do **pattern `page-header` sinh ra** qua `data-page-tabs`, không nằm trong HTML của trang. Muốn chuyển thì phải sửa `patterns/page-header.js`, tức là việc của DS chứ không phải của trang. Đây mới là chỗ đáng làm nhất vì nó ảnh hưởng mọi trang dùng pattern.
2. `.delegation-subtabs` chỉ có **đúng một tab**, sinh trong chuỗi template JS. Một tab thì không phải nhóm tab, chuyển sang `sd-tab-group` là vô nghĩa.
3. `.inline-detail-tabs` là nhóm tab thật (Luồng phê duyệt / Lịch sử thay đổi) nhưng **kiến trúc lệch với `sd-tab-group`**: thanh tab và thân tab nằm ở hai vùng DOM tách rời, thân do JS ghi đè `innerHTML`, lại có thêm nút đóng nằm chung hàng với tab. `sd-tab-group` thì gom nội dung vào `sd-tab` con rồi tự ẩn hiện. Chuyển là phải dựng lại luồng render, mà đây là tương tác lõi của trang đang chuẩn bị giao.

Đổi lại, modal của trang này **đã chuyển xong** sang `sd-modal` trong cùng đợt, vì cấu trúc header/body/footer khớp thẳng và rủi ro thấp hơn hẳn.

### Gradient trong prototype vs rule 6, và vì sao 117 mã màu không tokenize được

Rule 6 của `AGENTS.md`: **"Không dùng gradient, glassmorphism, decorative animations"**. Nhưng prototype còn **17 gradient**: 15 trong `danh-sach-position.html` (tô nền các cấp của sơ đồ tổ chức, kiểu `linear-gradient(180deg, #ffd54f 0%, #ffb300 100%)`) và 2 trong `danh-sach-workitem.html`.

Hai vi phạm này dính vào nhau. Đợt dọn mã màu cứng đã thay được 66 lượt có token khớp chính xác, nhưng **119 lượt còn lại phần lớn là điểm dừng của chính các gradient đó**. Không thể thay từng mã bằng token đơn: thay xong vẫn còn gradient, mà màu lại nhìn khác hẳn. Phải xử lý gradient trước thì phần màu mới giải được.

Hướng đúng theo rule 2 và rule 6: đổi sang nền **solid** bằng token DS. Nhưng chọn token nào là quyết định thiết kế thật, không phải việc dọn dẹp:

- Màu các cấp sơ đồ tổ chức là một **thang bậc**, không phải trạng thái. Ánh xạ sang `success`/`warning`/`error` là sai ngữ nghĩa - cấp 2 không "cảnh báo" hơn cấp 1.
- Hướng hợp lý hơn là dùng thang đậm nhạt trong cùng một họ, ví dụ `--color-primary-50/100/200/500` hoặc `--color-neutral-*`, để giữ ý "bậc".

Bảng đề xuất chi tiết cho từng mã màu nằm ở `reviews/ds-mirror/HEX-TO-TOKEN.md` mục 4 và 5. Báo cáo đó cũng chỉ ra ba tông không có token nào thay được: `#fffaf5` (nền vùng thả tệp), `#fff1f2` và `#f0fdf4` (nền so sánh cũ/mới) - pastel nhạt hơn hẳn `--color-error-50` và `--color-success-50`. Đó là khoảng trống bảng màu cần Builder bổ sung hoặc chấp nhận lệch tông.

Chưa tự làm vì đổi bảng màu của cả sơ đồ tổ chức là thay đổi nhìn thấy rõ trên trang, cần Builder chốt trước.

### Breadcrumb: đã gỡ theo quyết định của Builder

Builder chốt 2026-09-20: **bỏ breadcrumb, tuyệt đối không dùng ở bất kỳ đâu.** Rule 5 giữ nguyên, code sửa cho khớp.

Trước đó `prototypes/shared-nav.js` chủ động sinh breadcrumb cho mọi trang - có từ commit đầu tiên `191c3b8`, viết kỹ với logic dò đường trong menu và phương án dự phòng. Đã gỡ tận gốc phần sinh, không chặn bằng CSS.

Điểm đáng ghi lại: rà ra **nhiều trang đã tự chặn bằng `.page-breadcrumb { display:none !important; }`** từ trước. Nghĩa là người viết trang không muốn breadcrumb, nhưng thay vì gỡ chỗ sinh ra nó thì lại đi chặn ở từng trang. Gỡ gốc xong thì mấy dòng `!important` đó cũng bỏ được luôn.

Hai file đóng băng `tra-cuu-cam-nang.html` và CSS của nó giữ nguyên breadcrumb - chúng là ảnh chụp một thời điểm để đối chiếu QC, không phải trang cho người xem.

### Modal: còn 2 file dùng `.modal-overlay` của DS

`sua-position.html` và `tao-position.html`, mỗi file 2 chỗ. `tra-cuu-cam-nang-v2.html` đã chuyển sang `sd-modal` rồi nên hai file này là phần còn lại.

Lưu ý khi chuyển: `sd-modal` nhặt slot **một lần** trong `connectedCallback` rồi ghi đè `innerHTML` của chính nó. Với modal dựng động phải gắn đủ node con **trước khi** `appendChild` vào DOM, và khi chuyển node thì đừng vừa duyệt vừa chuyển trên `childNodes` - đó là NodeList sống, danh sách co lại giữa vòng lặp làm mất node. Đã dẫm bẫy này một lần khi chuyển `tra-cuu-cam-nang-v2.html`, chi tiết ở `reviews/ds-mirror/SD-MODAL-MIGRATION.md` mục 6.

---

## Pattern chưa có sd-* và không cần có

| Pattern | Lý do |
|---|---|
| Sidebar (`patterns/sidebar.js`) | Portal có `sd-layout` và `sd-sidebar-v1` nhưng đó là tầng shell riêng của Portal; kit đã có shell riêng. Giữ HTML |
| Data table footer, page header | Là pattern của kit, không phải component thư viện. Giữ `data-pattern` |

---

## Lịch sử

Danh sách bug và mismatch đã sửa xong trước đây đã chuyển vào `../CHANGELOG.md`. File này chỉ giữ việc **còn mở**.
