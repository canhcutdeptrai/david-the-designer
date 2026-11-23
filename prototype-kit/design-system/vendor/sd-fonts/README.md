# sd-fonts — font của @sd-angular/core 19.0.10

> **2026-11-18:** kit chuyển font chữ sang **Geist** (theme components.build — `vendor/geist-fonts/`). Từ thư mục này kit chỉ còn
> dùng **Material Icons / Icons Outlined / Symbols Outlined**. `roboto/` giữ lại cho đủ bản chép nguyên văn của thư viện; không
> trang nào khai `font-family: Roboto` nữa nên trình duyệt không tải các file đó.

Chép nguyên `assets/fonts/` của thư viện (portal thật tự host các font này, không gọi Google Fonts):

| Thư mục | Font | Giấy phép |
|---|---|---|
| `roboto/` | Roboto 400 · 400 italic · 500 · 600 (latin + vietnamese) | SIL Open Font License 1.1 |
| `material-icons/` | Material Icons (filled) v145 · Material Icons Outlined v110 | Apache License 2.0 |
| `material-symbols/` | Material Symbols Outlined v29 | Apache License 2.0 |

`fonts.css` = `assets/fonts/fonts.scss` biên dịch nguyên văn (sass 1.79). Kit nạp nó bằng
`@import` ở dòng đầu `design-system/core/styles/tokens.css`, nên mọi trang có font đúng của
thư viện kể cả khi không vào được fonts.googleapis.com. Thư viện KHÔNG có Roboto 300/700:
`font-weight-bolder` (700) hiển thị bằng nét đậm giả lập của trình duyệt — giống portal.
