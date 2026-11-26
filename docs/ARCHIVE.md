# Những phần đã gỡ khỏi repo

Ngày 2026-11-26 repo được dọn lại để chỉ còn portfolio. File này ghi lại những gì đã gỡ, vì sao, đang nằm ở đâu và cách lấy lại.

## Nơi lưu

| Nơi | Chứa gì | Lưu ý |
|---|---|---|
| `_archive/` ở gốc repo | Bản nguyên vẹn của `prototype-kit/` và `cv/` (586 file, ~23 MB) | Chỉ có trên máy. Đã khai trong `.gitignore` nên không lên GitHub, không deploy. Xoá thư mục này là mất bản cục bộ. |
| Lịch sử git, commit `1657c2e` | Toàn bộ repo trước khi dọn | Còn trên GitHub chừng nào lịch sử nhánh `main` cũ còn được giữ. |

Khôi phục một phần từ git:

```bash
git checkout 1657c2e -- prototype-kit/design-system     # một thư mục
git show 1657c2e:prototype-kit/CHANGELOG.md             # xem một file
```

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

`components.css` (102 KB) bị bỏ hẳn vì không rule nào tác động lên trang. CSS mỗi trang tải giảm từ khoảng 1.2 MB xuống 78 KB. Ảnh chụp 6 trang ở hai bề rộng 1440 px và 390 px trước và sau khi dọn giống nhau từng pixel.

### 2. `cv/` — 11 file PDF

Site không liên kết tới file CV nào, còn repo là nơi công khai, nên toàn bộ CV chuyển về `_archive/cv/`.

| Nhóm | File |
|---|---|
| Dùng nhiều | `David_UIUX.pdf`, `David_Product_Graphic_Design.pdf`, `Digital Solution Consultan.pdf` |
| Ít dùng — BA | `CV_Business_Analyst_2026.pdf`, `David_BA_Cr.pdf`, `David_BA_Planer.pdf` |
| Ít dùng — UI/UX | `David_ESG_BI_CV.pdf`, `David_UIUX_C_BI.pdf` |
| Ít dùng — khác | `IT_Helpdesk___Văn_Thế_Duy.pdf`, `Marketing___Văn_Thế_Duy.pdf`, `Văn Thế Duy Sale.pdf` |

Nội dung CV đã được chọn lọc đưa lên site như thế nào: xem [CV-SOURCE-MAP.md](CV-SOURCE-MAP.md).

Muốn cho tải CV trên site: chép bản cần công khai vào `assets/cv/` với tên không dấu, không khoảng trắng (ví dụ `van-the-duy-uiux.pdf`), kiểm tra lại số điện thoại và địa chỉ trong file trước khi đưa lên.

### 3. Rác

`.DS_Store` (5 chỗ) và thư mục `tmp/` rỗng. `.gitignore` ở gốc đã chặn `.DS_Store`.
