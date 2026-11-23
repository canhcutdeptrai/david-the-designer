# Nguồn

Chép nguyên văn từ [vercel/components.build](https://github.com/vercel/components.build) — thư mục `skills/building-components/`,
commit `0861fbc`, ngày 2026-11-18. Giấy phép Apache 2.0 (xem `LICENSE`). Không sửa nội dung; cần cập nhật thì chép lại từ repo gốc.

## Áp dụng trong Prototype Kit

Skill viết cho React + Tailwind. Trong kit (HTML tĩnh + web component `sd-*`) chỉ lấy **nguyên tắc**:

- Chỉ dùng khi dựng **component nhóm B** (AGENTS.md Rule 0b) — component `sd-*` có sẵn thì vẫn bắt buộc dùng `sd-*`.
- Màu / bo góc / bóng lấy từ token của `design-system/core/styles/theme.css` (cùng tên shadcn: `--primary`, `--border`, `--radius-md`…).
- Trạng thái và phần con đánh dấu bằng `data-state` / `data-slot` (references/data-attributes.mdx); a11y theo references/accessibility.mdx.
- Bỏ qua phần npm / registry / marketplace / TypeScript — kit không đóng gói component.
