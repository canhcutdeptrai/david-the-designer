# Port HTML portfolio to Angular

- Giữ semantic structure, content order và responsive behavior.
- Ánh xạ `sd-*` sang component Angular tương ứng của thư viện đang dùng; kiểm API theo đúng phiên bản.
- Tách dữ liệu dự án khỏi template thành model có trạng thái `real`, `anonymized`, `sample`.
- Chuyển filter và navigation thành state có keyboard support.
- Không copy DOM nội bộ của Web Component.
- Kiểm visual regression, a11y và đường dẫn sau khi port.

