# DS Mirror Report - FIX-07

## Lỗi

Splitter dọc lồng trong panel của splitter ngang (demo "Nested - IDE layout" trên `components/splitter.html`) bị thanh kéo co thành ô vuông 4 x 4px, trong khi splitter đứng độc lập vẫn đúng 660 x 4px. Người dùng không bấm trúng được thanh kéo.

## Nguyên nhân

Trùng với chẩn đoán của điều phối: không phải do markup khác nhau. Cùng thẻ, cùng class, cùng `data-orientation`, cùng `align-self: stretch` ở cả hai trường hợp, nhưng rule CSS của splitter ngang viết bằng selector hậu duệ nên lọt xuống gutter của splitter con:

```css
sd-splitter .sd-splitter[data-orientation="horizontal"] .sd-splitter__gutter { width: 4px; ... }
```

Gutter của splitter dọc con cũng là hậu duệ của splitter ngang cha nên bị dính `width: 4px; cursor: col-resize`. Khi trục ngang đã bị đặt cứng 4px thì `align-self: stretch` không còn tác dụng, thanh kéo co thành ô vuông. Chẩn đoán gốc là đúng, không phát hiện nguyên nhân khác.

## Selectors đã đổi (trước -> sau)

Trước:
`sd-splitter .sd-splitter[data-orientation="horizontal"] { flex-direction: row; }`
Sau:
`sd-splitter > .sd-splitter[data-orientation="horizontal"] { flex-direction: row; }`

Trước:
`sd-splitter .sd-splitter[data-orientation="vertical"] { flex-direction: column; }`
Sau:
`sd-splitter > .sd-splitter[data-orientation="vertical"] { flex-direction: column; }`

Trước:
`sd-splitter .sd-splitter[data-orientation="horizontal"] .sd-splitter__gutter { ... }`
Sau:
`sd-splitter > .sd-splitter[data-orientation="horizontal"] > .sd-splitter__gutter { ... }`

Trước:
`sd-splitter .sd-splitter[data-orientation="vertical"] .sd-splitter__gutter { ... }`
Sau:
`sd-splitter > .sd-splitter[data-orientation="vertical"] > .sd-splitter__gutter { ... }`

Trước:
`sd-splitter .sd-splitter__gutter:hover,`
`sd-splitter .sd-splitter__gutter:focus-visible,`
`sd-splitter .sd-splitter--dragging .sd-splitter__gutter { ... }`
Sau:
`sd-splitter > .sd-splitter > .sd-splitter__gutter:hover,`
`sd-splitter > .sd-splitter > .sd-splitter__gutter:focus-visible,`
`sd-splitter > .sd-splitter--dragging > .sd-splitter__gutter { ... }`

Trước:
`sd-splitter .sd-splitter__gutter--disabled { ... }`
Sau:
`sd-splitter > .sd-splitter > .sd-splitter__gutter--disabled { ... }`

Trước:
`sd-splitter .sd-splitter--disabled .sd-splitter__gutter { ... }`
Sau:
`sd-splitter > .sd-splitter--disabled > .sd-splitter__gutter { ... }`

Ví dụ lỗi: với markup `host ngang -> wrap ngang -> sd-splitter-panel -> host dọc -> wrap dọc -> gutter dọc`, trước đây rule `...horizontal .sd-splitter__gutter` match được gutter dọc (hậu duệ xa của host/wrap ngang) và đè `width: 4px` lên nó. Sau khi đổi sang dấu `>` thì gutter dọc không còn là con trực tiếp của wrap ngang nên không bị đè; rule chỉ chạm gutter là con trực tiếp của chính wrap đó.

## Đã rà cả khối

Đã rà toàn bộ khối `sd-splitter + sd-splitter-panel` trong `design-system/core/styles/sd-tokens.css`, không chỉ rule chiều rộng. Tất cả rule phụ thuộc hướng hoặc chạm gutter (kích thước gutter, con trỏ `col-resize`/`row-resize`, `flex-direction`, trạng thái hover/focus của gutter, trạng thái dragging/disabled của gutter) đều đã chuyển sang selector con trực tiếp. Giữ nguyên 3 rule không phụ thuộc hướng: `sd-splitter` (host), `sd-splitter-panel`, `sd-splitter .sd-splitter` (wrap base và `display: flex; width/height 100%`), `sd-splitter .sd-splitter__gutter` (rule base `flex: 0 0 4px`, background, box-sizing, outline, transition - thuộc tính giống nhau cho mọi gutter nên không bị lỗi ngữ cảnh), và `sd-splitter .sd-splitter--dragging` (không chạm gutter, không phụ thuộc hướng). Không còn rule phụ thuộc hướng nào viết bằng selector hậu duệ trong khối này.

## Kết quả mong đợi

- Splitter dọc lồng trong panel: gutter cao 4px, rộng bằng panel (460px trong demo), con trỏ `row-resize`.
- Splitter ngang lồng trong panel: gutter rộng 4px, cao bằng panel, con trỏ `col-resize`.
- Splitter đứng độc lập: giữ nguyên hành vi hiện tại.

Không đổi logic JS, không đổi chiều dày 4px, không thêm `!important`, không đụng trang preview.
