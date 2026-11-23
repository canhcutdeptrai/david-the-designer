# Portfolio Prototype Kit — Hướng dẫn cho AI

Đây là nguồn quy ước chính khi chỉnh sửa kit. Mục tiêu của repo là xây dựng portfolio cá nhân cho một chuyên gia kết hợp ba năng lực:

- UI/UX Designer — nghiên cứu, kiến trúc thông tin, interaction, visual và validation.
- Business Analyst — làm rõ bài toán, quy trình, yêu cầu, ưu tiên và acceptance criteria.
- AI Solution — xác định use case, thiết kế human-in-the-loop, guardrail, evaluation và đo lường.

Kit phải trung tính về thương hiệu và ngành. Không đưa lại tên tổ chức, sản phẩm, khách hàng, giáo trình, ngân hàng hoặc nghiệp vụ từ các dự án trước.

## Nguyên tắc nội dung

1. Không bịa khách hàng, chỉ số, testimonial, giải thưởng, chức danh hoặc kết quả kinh doanh.
2. Nội dung chưa có dữ liệu thật phải ghi rõ `Nội dung mẫu`, `[Điền ...]` hoặc `Cần bổ sung bằng chứng`.
3. Mỗi case study cần trả lời: bối cảnh, vấn đề, vai trò, ràng buộc, cách làm, quyết định, giải pháp, kết quả và bài học.
4. Thể hiện vai trò BA và AI bằng artefact cụ thể; không chỉ liệt kê kỹ năng.
5. Không đưa thông tin mật. Dữ liệu nhạy cảm phải ẩn danh hoặc tổng quát hoá.
6. Viết ngắn, chủ động, ưu tiên bằng chứng và quyết định thiết kế.

## Nguyên tắc thiết kế

1. Portfolio là presentation-led: mỗi section phải bổ sung một lớp thông tin mới.
2. Tập trung vào khả năng đọc, hierarchy, khoảng trắng và luồng xem; không dùng hiệu ứng trang trí không phục vụ nội dung.
3. Responsive từ mobile đến desktop; không tạo scroll ngang ngoài vùng chủ đích.
4. Tất cả trạng thái tương tác phải dùng được bằng bàn phím và có focus rõ ràng.
5. Màu, font, radius và shadow lấy từ token trong `design-system/core/styles/theme.css`.
6. Component cơ bản ưu tiên dùng `sd-*`; layout portfolio có thể dùng HTML semantic và CSS riêng nhưng phải dựa trên token.
7. Icon dùng Material Icons đã self-host; không thêm font hoặc CDN bên ngoài.
8. Chỉ dùng hình ảnh khi có ý nghĩa. Placeholder phải được ghi rõ là placeholder.

## Cấu trúc chính

```text
prototype-kit/
├── AGENTS.md
├── README.md
├── PORTFOLIO-CONTENT-GUIDE.md
├── rule-chung.md
├── design-system/
│   ├── core/                 # token, layout và runtime styles
│   ├── patterns/             # page header, sidebar, filter
│   ├── sd-components/        # Web Components dùng lại được
│   └── vendor/               # thư viện self-host và license
└── prototypes/
    ├── index.html            # trang tổng quan
    ├── shared-nav.js
    └── portfolio/
        ├── work.html
        ├── case-study.html
        ├── services.html
        ├── profile.html
        ├── contact.html
        ├── content-guide.html
        ├── portfolio-data.js
        ├── portfolio.css
        └── portfolio.js
```

## Workflow chỉnh sửa

1. Đọc `rule-chung.md` và `PORTFOLIO-CONTENT-GUIDE.md`.
2. Xác định nội dung là dữ liệu thật, dữ liệu đã ẩn danh hay placeholder.
3. Sửa dữ liệu/nội dung trước; chỉ mở rộng component khi layout hiện có không đáp ứng.
4. Kiểm các đường dẫn, responsive, bàn phím, focus và contrast trên bản render.
5. Chạy `node ai-instructions/tools/validate-portfolio.mjs` trước khi báo hoàn tất.

## Ranh giới an toàn

- Không sửa file trong `design-system/vendor/` trừ khi nâng dependency có chủ đích.
- Giữ nguyên license và attribution của thư viện bên thứ ba.
- Không thêm tracking, form gửi dữ liệu hoặc tích hợp mạng nếu chưa được yêu cầu.
- Không công khai email, số điện thoại, CV hoặc tài liệu thật nếu người dùng chưa cung cấp và xác nhận.
- Không dùng tên brand trong mã, localStorage key, CSS namespace hoặc nội dung mẫu.

