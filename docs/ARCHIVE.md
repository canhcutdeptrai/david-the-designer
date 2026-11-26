# Những phần đã gỡ khỏi repo

Ngày 2026-11-26 repo được dọn lại để chỉ còn portfolio. File này ghi lại những gì đã gỡ, vì sao, đang nằm ở đâu và cách lấy lại.

## Nơi lưu

| Nơi | Chứa gì | Có trên máy khác không |
|---|---|---|
| Lịch sử git, commit `1657c2e` | Toàn bộ repo trước khi dọn, gồm cả `prototype-kit/` | Có. `git clone` hoặc `git pull` là có đủ lịch sử |
| `docs/` | CV (dạng md), hướng dẫn nội dung, mô tả dữ liệu, file này | Có, nằm trong repo |
| `_archive/` ở gốc repo | Bản sao `prototype-kit/` cũ để mở nhanh (~22 MB) | Không. Đã khai trong `.gitignore`, chỉ có ở máy đã dọn repo. Xoá đi cũng không mất gì vì git còn giữ |

Lấy lại bộ kit trên bất kỳ máy nào:

```bash
git show 1657c2e:prototype-kit/CHANGELOG.md                  # xem một file
git archive 1657c2e prototype-kit | tar -x -C /đường/dẫn/khác   # xuất cả bộ kit ra ngoài repo
git checkout 1657c2e -- prototype-kit/design-system          # đưa một thư mục trở lại repo
```

Điều kiện: không viết lại lịch sử (rebase/force-push xoá commit `1657c2e`). Nếu sau này cần xoá lịch sử, hãy xuất bộ kit ra chỗ khác trước.

## Đã gỡ

### 1. `prototype-kit/` — bộ khung prototype (570 file, ~22 MB)

Portfolio được dựng bên trong một bộ kit prototype cho portal doanh nghiệp. Site chỉ dùng một phần rất nhỏ, phần còn lại đã gỡ.

| Thư mục cũ | Nội dung | Dung lượng | Vì sao gỡ |
|---|---|---|---|
| `design-system/core/` | CSS, JS và ảnh minh hoạ của khung portal: sidebar, page header, bảng, form, trạng thái rỗng | ~1.5 MB | Portfolio chỉ dùng phần reset và 5 class utility; đã chép phần đó sang `assets/css/base.css` |
| `design-system/sd-components/` | Web Components `sd-*` (table, select, modal, date picker, upload…) | 1 file JS lớn | Không trang nào của portfolio dùng thẻ `sd-*` |
| `design-system/components/` | Tài liệu md cho từng nhóm component `sd-*` | 7 file | Tài liệu của kit |
| `design-system/patterns/`, `shell/` | Mẫu sidebar, filter bar, data table, khung trang | 5 file | Portfolio có header/footer riêng trong `portfolio.js` |
| `design-system/preview/` | 60+ trang xem thử từng component và pattern | — | Trang nội bộ, không thuộc portfolio |
| `design-system/vendor/` | CKEditor 5, pdf.js, ExcelJS, Chart.js, document builder, font Roboto, Material Icons (filled), Material Symbols | ~7 MB | Không dùng. Chỉ giữ Geist và Material Icons Outlined trong `assets/fonts/` |
| `reviews/ds-mirror/` | 242 file: bản vá `.patch`, báo cáo đối chiếu design system, script kiểm tra | 9 MB | Nhật ký làm việc của kit |
| `reference/core-ui-catalog/` | Catalog UI tham chiếu (CSS/JS/font cho ~60 component) | 3.1 MB | Tài liệu tham chiếu của kit |
| `ai-instructions/` | Hướng dẫn cho AI: dựng prototype, xuất file, chuyển HTML sang Angular, script validate | 208 KB | Quy trình của kit, không khớp cấu trúc mới |
| `.claude/`, `CLAUDE.md`, `AGENTS.md`, `rule-chung.md`, `_memory/` | Cấu hình và luật cho AI agent khi làm trong kit | — | Gắn với cấu trúc thư mục cũ |
| `CHANGELOG.md`, `README.md` | Lịch sử và hướng dẫn của kit | — | README mới ở gốc repo thay thế |
| `prototypes/shared-nav.js` | Menu sidebar kiểu portal | — | Chỉ trang content-guide dùng |
| `prototypes/portfolio/content-guide.html` | Trang checklist biên tập (bản HTML) | — | Trang nội bộ; nội dung tương ứng ở `docs/CONTENT-GUIDE.md` |

Đã giữ lại và chuyển chỗ:

| Cũ | Mới |
|---|---|
| `prototype-kit/prototypes/index.html` | `index.html` |
| `prototype-kit/prototypes/portfolio/*.html` (5 trang) | `*.html` ở gốc |
| `prototype-kit/prototypes/portfolio/portfolio.css` | `assets/css/portfolio.css` |
| `prototype-kit/prototypes/portfolio/portfolio*.js` | `assets/js/` |
| `design-system/core/styles/theme.css`, `tokens.css` | `assets/css/` |
| Phần reset trong `layout.css`, biến `--sd-*` trong `sd-tokens.css`, 5 class trong `utilities.css` | `assets/css/base.css` |
| `design-system/vendor/geist-fonts/` | `assets/fonts/geist/` |
| Material Icons Outlined trong `vendor/sd-fonts/` | `assets/fonts/icons/` |
| `PORTFOLIO-CONTENT-GUIDE.md`, `PORTFOLIO-CV-SOURCE-MAP.md` | `docs/` |
| `cv/**/*.pdf` | `docs/cv/*.md` (chỉ nội dung chữ) |

`components.css` (102 KB) bị bỏ hẳn vì không rule nào tác động lên trang. CSS mỗi trang tải giảm từ khoảng 1.2 MB xuống 78 KB. Ảnh chụp 6 trang ở hai bề rộng 1440 px và 390 px trước và sau khi dọn giống nhau từng pixel.

### 2. `cv/` — chuyển thành Markdown

11 file PDF đã được chuyển thành 10 file md trong [`docs/cv/`](cv/README.md) rồi xoá khỏi repo. Bảng đối chiếu tên PDF cũ và file md nằm trong `docs/cv/README.md`.

PDF gốc chỉ còn trong lịch sử git:

```bash
git archive 1657c2e cv | tar -x -C /đường/dẫn/khác
```

### 3. Rác

`.DS_Store` (5 chỗ) và thư mục `tmp/` rỗng. `.gitignore` ở gốc đã chặn `.DS_Store`.
