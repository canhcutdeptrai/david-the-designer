# Portfolio Prototype Kit

Bộ khung HTML chạy trực tiếp, dùng để xây dựng portfolio cho UI/UX Designer kiêm Business Analyst và AI Solution. Kit không gắn với thương hiệu hoặc ngành cụ thể, không cần build tool và không tải tài nguyên từ CDN.

## Có gì trong kit

- Một portfolio hoàn chỉnh gồm tổng quan, danh sách dự án, case study động, dịch vụ cho client, hồ sơ năng lực, liên hệ và checklist nội dung.
- Design token, layout, Web Components `sd-*`, sidebar và page header dùng lại được.
- Font Geist, Material Icons và các thư viện cần thiết được self-host.
- Hướng dẫn viết case study dựa trên bằng chứng, bảo vệ dữ liệu nhạy cảm và thể hiện rõ ba vai trò UI/UX, BA, AI Solution.

## Xem portfolio

Mở `prototypes/index.html` trực tiếp bằng trình duyệt. Nếu trình duyệt hạn chế tài nguyên khi dùng `file://`, chạy một static server tại thư mục `prototype-kit`, ví dụ:

```bash
python3 -m http.server 4173
```

Sau đó mở `http://localhost:4173/prototypes/`.

## Bắt đầu tuỳ biến

1. Đọc `PORTFOLIO-CONTENT-GUIDE.md`.
2. Thay các đoạn có nhãn `Nội dung mẫu`, `[Điền ...]` và `Cần bổ sung bằng chứng`.
3. Thêm object dự án vào `prototypes/portfolio/portfolio-data.js`; trang Work và Case Study sẽ tự render.
4. Chỉ tạo trang riêng khi dự án cần cấu trúc nội dung khác với case study động.
5. Đặt hình ảnh đã tối ưu trong `prototypes/portfolio/assets/`; luôn có alt text phù hợp.
6. Chạy kiểm tra:

```bash
node ai-instructions/tools/validate-portfolio.mjs
```

## Nguyên tắc quan trọng

- Không bịa số liệu, khách hàng, testimonial hoặc kết quả.
- Ẩn danh thông tin nhạy cảm trước khi đưa vào portfolio.
- Một case study tốt ưu tiên quyết định, trade-off và bằng chứng hơn số lượng màn hình.
- Tên thư viện và license bên thứ ba được giữ nguyên vì là phụ thuộc kỹ thuật, không phải thương hiệu của portfolio.

## Tuỳ chỉnh giao diện

- Token toàn cục: `design-system/core/styles/theme.css`
- Style riêng portfolio: `prototypes/portfolio/portfolio.css`
- Điều hướng: `prototypes/shared-nav.js`
- Tương tác nhẹ: `prototypes/portfolio/portfolio.js`
- Nội dung hồ sơ và dự án: `prototypes/portfolio/portfolio-data.js`

