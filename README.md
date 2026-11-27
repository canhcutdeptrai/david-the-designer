# david-the-designer

Portfolio của Van The Duy (David) — Product Designer · Business Analyst · Solution Consultant.

Site tĩnh thuần HTML/CSS/JS: không build step, không phụ thuộc CDN. Deploy trên Vercel trực tiếp từ gốc repo.

## Cấu trúc

```
├── index.html           Trang chủ
├── work.html            Danh sách dự án
├── case-study.html      Chi tiết dự án (render theo ?project=<slug>)
├── services.html        Dịch vụ cho client
├── profile.html         Hồ sơ năng lực
├── contact.html         Liên hệ
├── assets/
│   ├── css/
│   │   ├── theme.css        Giá trị gốc: màu, font, bo góc, bóng
│   │   ├── tokens.css       Tên vai trò (--color-*, --surface-*…) trỏ về theme.css
│   │   ├── base.css         Reset + vài utility dùng chung
│   │   └── portfolio.css    Toàn bộ style của site
│   ├── js/
│   │   ├── portfolio-data.js   NỘI DUNG: hồ sơ, năng lực, dự án, kinh nghiệm (song ngữ)
│   │   ├── i18n.js             Bản tiếng Việt của chữ trong HTML + chữ của header/footer
│   │   └── portfolio.js        Render header/footer, thẻ dự án, case study, đổi ngôn ngữ
│   └── fonts/               Geist, Geist Mono, Material Icons Outlined (tự host)
├── docs/                Tài liệu nội bộ và hồ sơ CV tổng hợp (có trên git, không deploy)
└── _archive/            Kho lưu trữ cục bộ (không lên git, không deploy)
```

## Sửa nội dung

Hầu hết nội dung nằm trong `assets/js/portfolio-data.js`. Thêm một object vào `projects` là trang Work và Case study tự hiển thị. Mô tả từng trường: [docs/DATA-MODEL.md](docs/DATA-MODEL.md).

Quy tắc viết case study và bảo vệ thông tin nhạy cảm: [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md).

## Hai ngôn ngữ (EN / VI)

Nút EN/VI trên header đổi ngôn ngữ cho cả trang và ghi nhớ lựa chọn trong trình duyệt. Tiếng Anh là mặc định; thêm `?lang=vi` vào URL để mở thẳng bản tiếng Việt.

Khi sửa chữ, sửa cả hai bản:

| Chữ nằm ở | Bản tiếng Anh | Bản tiếng Việt |
|---|---|---|
| File HTML (tiêu đề, đoạn dẫn, thẻ dịch vụ) | Viết thẳng trong HTML, phần tử mang `data-i18n="khoá"` | Cùng khoá trong `vi` của `assets/js/i18n.js` |
| Header, footer, nhãn thẻ dự án, khung case study | `ui.en` trong `i18n.js` | `ui.vi` trong `i18n.js` |
| Dự án, năng lực, kinh nghiệm | `{ en: '…', vi: '…' }` trong `portfolio-data.js` | Cùng object đó |

Thiếu bản tiếng Việt ở đâu thì chỗ đó hiện tiếng Anh, không lỗi.

Bố cục không xê dịch khi đổi ngôn ngữ: mỗi đoạn chữ luôn giữ chỗ cho cả hai bản (bản không được chọn nằm ẩn trong cùng một ô), nên ô rộng và cao bằng bản dài hơn. Riêng tag và chip lọc thì co theo đúng nhãn đang hiện. Vì vậy hai bản dịch nên dài gần bằng nhau; bản nào dài hơn hẳn sẽ để lại khoảng trống ở ngôn ngữ kia.

Nút có icon khai báo icon bằng thuộc tính thay vì viết thẻ icon bên trong: `data-i18n-icon="arrow_forward"` (icon sau nhãn) hoặc `data-i18n-icon-before="print"` (icon trước nhãn).

## Xem ở máy

Mở thẳng `index.html` bằng trình duyệt, hoặc chạy một static server tại gốc repo:

```bash
python3 -m http.server 4173
```

## Deploy

Vercel: Framework Preset `Other`, Root Directory để trống (gốc repo), không cần Build Command. `.vercelignore` loại `docs/` và `_archive/` khỏi bản deploy.

## Tài liệu

| File | Nội dung |
|---|---|
| [docs/DATA-MODEL.md](docs/DATA-MODEL.md) | Cấu trúc dữ liệu trong `portfolio-data.js` |
| [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md) | Hướng dẫn biên tập nội dung |
| [docs/CV-SOURCE-MAP.md](docs/CV-SOURCE-MAP.md) | Nội dung CV nào đã được đưa lên portfolio và vì sao |
| [docs/CV.md](docs/CV.md) | Hồ sơ tổng hợp: nội dung 9 bản CV gộp thành một file, sắp theo ba vai trò chính (UI/UX · Product Design, Business Analysis · Product Owner, Solution · Consulting) và ba kỹ năng hỗ trợ (Graphic Design, Sales, Marketing) |
| [docs/DAVID-AI-SDLC.md](docs/DAVID-AI-SDLC.md) | Ghi chú tham khảo: bản chép bộ 40 slide "AI trong SDLC — Chiến lược chuyển đổi" của OneMount. Không phải tác phẩm của chủ repo |
| [docs/ARCHIVE.md](docs/ARCHIVE.md) | Những phần đã gỡ khỏi repo, đang nằm ở đâu, cách khôi phục |

## Làm việc trên nhiều máy

Mọi thứ cần để làm tiếp đều nằm trong repo: mã nguồn site, tài liệu và hồ sơ CV tổng hợp trong `docs/`.

```bash
git clone https://github.com/canhcutdeptrai/david-the-designer.git
git pull        # trước khi bắt đầu làm
git push        # sau khi commit
```

Chỉ `_archive/` là không đồng bộ; bộ kit cũ trong đó lấy lại được từ lịch sử git, cách làm ở [docs/ARCHIVE.md](docs/ARCHIVE.md).
