# Migrate legacy pages into the portfolio

1. Chỉ lấy artefact và nội dung đã được phép sử dụng.
2. Loại tên brand, dữ liệu ngành, ID, email, avatar và metadata cũ.
3. Gắn nhãn nội dung là `Thật`, `Ẩn danh` hoặc `Nội dung mẫu`.
4. Chuyển control cơ bản sang `sd-*`; layout trình bày sang class trong `portfolio.css`.
5. Không mang theo namespace, localStorage key hoặc comment lịch sử của dự án cũ.
6. Chạy validation và kiểm render.

