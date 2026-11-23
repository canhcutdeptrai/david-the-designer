# Component guidance

## Dùng component có sẵn

| Nhu cầu | Component |
|---|---|
| Nút | `sd-button` hoặc link `.p-button` cho CTA điều hướng |
| Badge/tag trạng thái | `sd-badge` |
| Input/select/textarea | `sd-input`, `sd-select`, `sd-textarea` |
| Section/tab | `sd-section`, `sd-tab-group` |
| Modal/drawer | `sd-modal`, `sd-side-drawer` |
| Empty state | `sd-data-state` |

Trang presentation có thể dùng HTML semantic và các class trong `portfolio.css`. Không tự dựng control có hành vi phức tạp nếu `sd-*` đã có.

## Quy tắc

- Màu, font, radius và shadow chỉ lấy từ token.
- Link/nút phải có accessible name và focus rõ ràng.
- Icon trang trí có `aria-hidden="true"`.
- Không bám vào DOM bên trong Web Component.
- Không dùng CDN hoặc font ngoài bộ self-host.
- Không thêm animation trang trí; tôn trọng `prefers-reduced-motion`.

