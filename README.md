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
│   │   ├── portfolio-data.js   NỘI DUNG: hồ sơ, năng lực, dự án, kinh nghiệm
│   │   └── portfolio.js        Render header/footer, thẻ dự án, case study
│   └── fonts/               Geist, Geist Mono, Material Icons Outlined (tự host)
├── docs/                Tài liệu nội bộ và bộ CV (có trên git, không deploy)
└── _archive/            Kho lưu trữ cục bộ (không lên git, không deploy)
```

## Sửa nội dung

Hầu hết nội dung nằm trong `assets/js/portfolio-data.js`. Thêm một object vào `projects` là trang Work và Case study tự hiển thị. Mô tả từng trường: [docs/DATA-MODEL.md](docs/DATA-MODEL.md).

Quy tắc viết case study và bảo vệ thông tin nhạy cảm: [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md).

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
| [docs/cv/](docs/cv/README.md) | 11 bản CV: PDF gốc và bản md |
| [docs/ARCHIVE.md](docs/ARCHIVE.md) | Những phần đã gỡ khỏi repo, đang nằm ở đâu, cách khôi phục |

## Làm việc trên nhiều máy

Mọi thứ cần để làm tiếp đều nằm trong repo: mã nguồn site, tài liệu và bộ CV trong `docs/`.

```bash
git clone https://github.com/canhcutdeptrai/david-the-designer.git
git pull        # trước khi bắt đầu làm
git push        # sau khi commit
```

Chỉ `_archive/` là không đồng bộ; bộ kit cũ trong đó lấy lại được từ lịch sử git, cách làm ở [docs/ARCHIVE.md](docs/ARCHIVE.md).
