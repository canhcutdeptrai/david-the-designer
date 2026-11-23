# geist-fonts — font của theme components.build

Font chữ của kit từ 2026-11-18 (theme [vercel/components.build](https://github.com/vercel/components.build), `lib/geistdocs/fonts.ts`).

| File | Font | Giấy phép |
|---|---|---|
| `geist-{latin,latin-ext,vietnamese}.woff2` | Geist — biến thiên, `font-weight: 100 900` | SIL Open Font License 1.1 (Vercel) |
| `geist-mono-{latin,latin-ext,vietnamese}.woff2` | Geist Mono — biến thiên, `font-weight: 100 900` | SIL Open Font License 1.1 (Vercel) |

Tải từ Google Fonts ngày 2026-11-18 (bản v5), chỉ giữ ba subset kit cần. `fonts.css` khai `@font-face` theo
`unicode-range` — trình duyệt chỉ tải subset mà trang thực sự dùng. Nạp bằng `@import` ở dòng đầu
`design-system/core/styles/theme.css`, nên mọi trang có font kể cả khi không vào được fonts.googleapis.com.

Vì là font biến thiên nên đủ mọi độ đậm (400 / 500 / 600 / 700…), không bị nét đậm giả lập như Roboto cũ.
Token dùng font: `--font-sans` / `--font-mono` (theme.css) → `--font-family-sans` / `--font-family-mono` (tokens.css) → `--sd-font-family`.
