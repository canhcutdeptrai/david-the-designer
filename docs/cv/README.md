# Bộ CV

Nội dung của 11 bản CV, chuyển từ PDF sang Markdown ngày 2026-11-26 để đọc, tìm kiếm và chỉnh sửa được trên mọi máy. Repo không còn giữ file PDF.

Thư mục `docs/` không được deploy lên Vercel (xem `.vercelignore`) nhưng có trên GitHub. Các file ở đây có số điện thoại và địa chỉ.

| Nhóm | CV | Ngôn ngữ | File | File PDF cũ trong `cv/` |
|---|---|---|---|---|
| Chính | UI/UX · Product Designer | Anh | [uiux.md](uiux.md) | `MAIN - Dùng nhiều/David_UIUX.pdf`, `Ít dùng/UI:UX/David_UIUX_C_BI.pdf` |
| Chính | Product & Graphic Design (Visual Designer) | Anh | [product-graphic-design.md](product-graphic-design.md) | `MAIN - Dùng nhiều/David_Product_Graphic_Design.pdf` |
| Chính | Digital Solution Consultant | Anh | [digital-solution-consultant.md](digital-solution-consultant.md) | `MAIN - Dùng nhiều/Digital Solution Consultan.pdf` |
| Ít dùng | Business Analyst (bản 2026) | Anh | [ba-2026.md](ba-2026.md) | `Ít dùng/BA/CV_Business_Analyst_2026.pdf` |
| Ít dùng | Business Analyst · Solution Consultant (bản Cr) | Anh | [ba-cr.md](ba-cr.md) | `Ít dùng/BA/David_BA_Cr.pdf` |
| Ít dùng | Business Analyst (bản Planner) | Anh | [ba-planner.md](ba-planner.md) | `Ít dùng/BA/David_BA_Planer.pdf` |
| Ít dùng | Senior Product Designer · BI Dashboard · ESG | Anh | [uiux-esg-bi.md](uiux-esg-bi.md) | `Ít dùng/UI:UX/David_ESG_BI_CV.pdf` |
| Ít dùng | IT Support Specialist | Việt | [it-helpdesk.md](it-helpdesk.md) | `Ít dùng/IT_Helpdesk___Văn_Thế_Duy.pdf` |
| Ít dùng | Marketing Strategist | Việt | [marketing.md](marketing.md) | `Ít dùng/Marketing___Văn_Thế_Duy.pdf` |
| Ít dùng | Sales & Solution Consultant | Việt | [sales.md](sales.md) | `Ít dùng/Văn Thế Duy Sale.pdf` |

## Ghi chú

- 11 file PDF thành 10 file md: `David_UIUX.pdf` và `David_UIUX_C_BI.pdf` có nội dung chữ giống hệt nhau nên dùng chung `uiux.md`.
- Mỗi bản md đã được đối chiếu với PDF gốc: đủ các mục, ngày tháng nằm đúng vị trí, dòng bị ngắt giữa chừng đã nối lại.
- Phần không giữ được là hình thức: font, bố cục, màu. Ba liên kết Figma trong hai bản UI/UX và Product & Graphic Design (Full Portfolio, BeeTrade, Western Harbour) đã được chép sang md.
- Khi cần file PDF để gửi đi, phải dàn trang và xuất lại từ nội dung md.
- PDF gốc vẫn lấy lại được từ lịch sử git: `git archive 1657c2e cv | tar -x -C /đường/dẫn/khác`.
- Nội dung CV nào đã được đưa lên site: xem [../CV-SOURCE-MAP.md](../CV-SOURCE-MAP.md).
