# DS Mirror - Báo cáo vòng sửa FIX-01

## Việc 1 - Sửa số đo CSS của sd-modal

Sửa trong `design-system/core/styles/sd-tokens.css` cho khớp số đo computed đúng của Portal:

- `.sd-modal-header`: `min-height: 45px` → `height: 56px; min-height: 56px`; `gap: 8px` → `16px`. Giữ `padding: 12px 16px`, `background: var(--color-neutral-0)` (computed là `#fff` nên dùng token thay vì hardcode), không có border-bottom.
- `.sd-modal-title`: khai tường minh `font-size: 18px; font-weight: 600; line-height: 25px` thay vì dựa vào `.T18M`.
- `.sd-modal-close-btn`: `width/height: 26px` → `32px`, thêm `padding: 0`, giữ `border: none`, `background: transparent`, `border-radius: 50%`.
- `.sd-modal-close-btn .material-icons-outlined`: `font-size: 16px` → `20px`.
- `.sd-modal-body`: giữ nguyên `padding: 12px 16px; overflow-y: auto` (đã đúng, không đổi).
- `.sd-modal-footer`: thêm `min-height: 56px; height: auto`, `justify-content: flex-end` → `space-between`, `gap: 8px` → `16px`, thêm `border-top: 1px solid rgb(196, 198, 208)`. Giữ `padding: 12px 16px`, `background: var(--color-neutral-0)` (computed là `#fff`).
- `.sd-modal-panel` và `.sd-modal-root`: `max-width: calc(100vw - 32px)` và `max-height: calc(100vh - 32px); overflow: hidden` đã đúng sẵn, không đổi.

Số đo cũ `45px`, `26x26`, icon `16px` trước đó bị sai do điều phối đo bằng `getBoundingClientRect()` lúc modal dừng ở `transform: scale(0.8)`. Số mới là giá trị `getComputedStyle()` trên Portal.

## Token cho border-top của footer

Đã rà `design-system/core/styles/sd-tokens.css` và `design-system/core/styles/tokens.css`. Không có token nào khớp hoặc gần khớp `rgb(196, 198, 208)` (#C4C6D0): các token viền hiện có là `--border-primary` (#E6E6E6), `--border-secondary` (#EBECED), `--border-strong` (#BFBFBF), neutral tương ứng là 300/200/400. Khoảng cách màu đều đáng kể so với #C4C6D0 nên không thể coi là gần khớp.

Vì vậy đã hardcode `border-top: 1px solid rgb(196, 198, 208)` trong `.sd-modal-footer`. Cần bổ sung token viền cho #C4C6D0 (khả năng cao là một neutral-bậc mới trong bảng màu Portal) ở vòng sau.

## Việc 1B - Sửa cấu trúc DOM header modal

Sửa trong `design-system/sd-components/sd-components.js`, chỉ đúng phần dựng header của `SdModal`:

- Trước: `.sd-modal-header` có ba con ngang hàng gồm `.sd-modal-header-left` (chỉ dựng khi có `sdHeaderLeft`), `.sd-modal-title`, `.sd-modal-header-right`.
- Sau: `.sd-modal-header-left` luôn được dựng, bên trong chứa nội dung slot `sdHeaderLeft` (nếu có) trước rồi `.sd-modal-title` sau, sau đó `.sd-modal-header-right` mới là anh em của `.sd-modal-header-left`.

Điều này khớp Portal: `.sd-modal-header-left` luôn tồn tại kể cả modal không truyền `sdHeaderLeft`, và selector `.sd-modal-header-left .sd-modal-title` của dev bên Angular sẽ khớp.

## Việc 2 - Sửa font-weight của .T18M

Trong `design-system/core/styles/sd-tokens.css`:

`.T18M { font-size: 18px; font-weight: 600; line-height: 28px; }` → `.T18M { font-size: 18px; font-weight: 500; line-height: 28px; }`

Kết quả rà `T18M` trong `design-system/`: chỉ có 2 chỗ, gồm một khai báo CSS trong `sd-tokens.css` và một chỗ gán class `sd-modal-title T18M` trong `sd-components.js`. Không có nơi nào khác dùng `.T18M` để lấy chữ đậm 600. `.sd-modal-title` đã tự khai `font-weight: 600; line-height: 25px` theo Portal nên không bị ảnh hưởng bởi việc đổi `.T18M` về 500. Không cần thêm class mới.

## Việc 3 - Tài liệu

Đã rà `design-system/components/sd-overlay.md` và `design-system/preview/components/modal.html`: không ghi con số cũ `45px`, `26x26`, icon `16px` nên không cần sửa gì.
