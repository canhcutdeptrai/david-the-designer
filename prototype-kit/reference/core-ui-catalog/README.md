# Core UI Catalog: portal-fins

Trang HTML/CSS/JS tĩnh. Trang trưng bày toàn bộ component của `@sd-angular/core` 19.0.10, cộng thẻ Score card của lib-bpm.
Mỗi component được dựng lại từ template và CSS gốc trong bundle của thư viện và tô theo theme của portal-fins.
Không cần Node hay Angular, không cần chạy app.

## Mở trang

Nhấp đúp `index.html`, hoặc kéo file vào Chrome/Edge/Safari. Không cần web server.

Mọi font (Roboto, Material Icons, Material Symbols) nằm sẵn trong `fonts/`. Đây đúng là các file portal nạp từ
`@sd-angular/core/assets/fonts`, nên trang chạy được cả khi không có mạng. Chỉ font Roboto Mono dùng cho các khối code
được tải từ Google Fonts. Khi mất mạng, các khối code dùng font monospace của hệ thống.

Muốn gửi cho người khác: nén cả thư mục rồi gửi file zip.

## Cấu trúc

```
index.html                  Toàn bộ markup: mục lục, 63 khối component, 227 biến thể
css/
  fonts.css                 @font-face theo assets/fonts/fonts.scss của sd-core
  material-tokens.css       Token hệ thống Material 3 (--mat-sys-*), theme azure/blue như src/styles.scss
  catalog.css               Khung trang (sidebar, khối component, sân khấu) và token --sd-* theo src/theme.scss
  components/<id>.css       CSS của từng component; mọi selector đều nằm trong #c-<id> nên không lấn sang nhau
js/
  components/<id>.js        Tương tác của từng component (đóng/mở, chuyển tab, chọn...), mỗi file là một IIFE
  catalog.js                Dựng mục lục, ô tìm kiếm, nút "Sao chép" cho mọi khối code; chạy sau cùng
fonts/                      Font woff2 copy từ @sd-angular/core 19.0.10
```

Mỗi component có id `c-<id>` trên thẻ `<section>`. Ví dụ `index.html#c-button` mở thẳng tới Button.

## Nguồn

| Phần | Lấy từ |
|---|---|
| Template, CSS component | `@sd-angular/core@19.0.10` (bản khoá trong `package-lock.json`), `fesm2022/*.mjs` |
| Phần Material bên trong | `@angular/material@20.2.14` |
| Màu | `src/theme.scss`: primary `#AE7129`, info `#1890FF`. Các màu còn lại lấy mặc định theo `assets/STYLE-GUIDE.md` |
| Toán tử lọc, `EMPTY_STR` | `@sdcorejs/utils@1.1.4` |
| Chuỗi giao diện | `VI_MESSAGES` trong `sd-angular-core-i18n.mjs` |
| Score card | lib-bpm, commit `68dfd6e` (đúng commit portal đang ghim) |

Phần Material lấy **màu, bo góc và mật độ** từ theme M2 trong `src/theme.scss` (nâu `#AE7129`, density -3).
**Font chữ** thì lấy từ theme M3 trong `src/styles.scss`.

## Giới hạn

- Đây là bản dựng lại bằng HTML/JS thường, không chạy Angular. Hiệu ứng ripple và animation đóng/mở không được dựng.
- Overlay (modal, drawer, tooltip, danh sách của select, lịch, toast) được vẽ sẵn ở trạng thái mở bên trong khung của từng biến thể.
  Trong app thật, overlay nổi trên toàn màn hình.
- CKEditor, code editor, Chart.js và trình xem PDF là bản dựng tĩnh, không nạp thư viện thật. Icon trên thanh công cụ CKEditor là vẽ gần đúng.
- Mỗi khối có ghi chú riêng (dòng chữ nhỏ dưới các biến thể) về phần giản lược và các hành vi của thư viện thật dễ bị tưởng là lỗi.
  Ví dụ: lịch hiển thị tiếng Anh, ô nhập cỡ md cao 43,5px, `sd-modal` không dùng input `color`.
