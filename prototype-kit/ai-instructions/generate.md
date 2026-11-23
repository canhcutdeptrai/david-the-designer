# Generate portfolio pages

## Trước khi tạo

1. Đọc `AGENTS.md`, `rule-chung.md` và `PORTFOLIO-CONTENT-GUIDE.md`.
2. Xác định nội dung là thật, đã ẩn danh hay placeholder.
3. Không bịa tên khách hàng, số liệu, testimonial hoặc kết quả.

## Loại trang

- Tổng quan: định vị → năng lực → dự án → cách làm → CTA.
- Project library: các card dự án có filter theo UI/UX, BA, AI.
- Case study: context → discovery → solution → AI layer (nếu có) → outcome.
- Profile: định vị, năng lực có bằng chứng, kinh nghiệm theo tác động.
- Contact: thông tin đã xác nhận; form mặc định không gửi dữ liệu.
- Content guide: checklist nội dung và quyền riêng tư.

## Workflow

1. Nhân bản trang gần nhất trong `prototypes/portfolio/`.
2. Giữ shell, skip link, landmark và các file CSS/JS chung.
3. Thêm page vào `prototypes/shared-nav.js`.
4. Dùng token và component hiện có; chỉ thêm CSS khi layout portfolio cần nó.
5. Chạy `node ai-instructions/tools/validate-portfolio.mjs`.
6. Kiểm render ở mobile, tablet và desktop.

