# Rà soát style chung (color · typography · spacing · shadow · radius) — 2026-10-13

Builder: *„Rà soát kỹ tất cả style chung như color, typography, spacing, shadow, border radius xem đã khớp chưa“*.

**Mốc chuẩn:** stylesheet toàn cục của thư viện `@sd-angular/core` 19.0.10 — `assets/scss/sd-core.scss`
(reboot `core/utilities/_base.scss` + `core/utilities/*` + `core/color.scss`), biên dịch bằng sass, cộng 25 token
`--sd-*` của theme portal-fins lấy từ catalog (`css/catalog.css`). **Cách đo:** dựng 4.519 lớp tiện ích của sd-core
lên hai trang (chuẩn / kit, cùng khung chứa), so computed style của từng lớp; so riêng reboot trên 42 thẻ HTML thô.
Script + kết quả thô: `reviews/ds-mirror/global-styles-audit/`.

## 1. Color

| | Kết quả |
|---|---|
| 25 token `--sd-*` (primary/info/success/warning/error × thường/light/dark, secondary, light, dark, black100–500) | **25/25 khớp** catalog |
| Lớp màu sd-core `text-* / bg-* / border-*` (81 lớp, `!important`) | **81/81 khớp** |
| Bộ token thứ hai của kit `--color-* / --text-* / --surface-* / --border-* / --icon-*` (Figma OMEU) | **KHÁC catalog** ở các màu trạng thái: info `#3062EB` (catalog `#1890FF`), warning `#F0930D` (`#FF9600`), error `#E73722` (`#F82C13`), primary hover `#9C5C10` (`--sd-primary-dark #834111`), primary-50 `#F7F2ED` (`--sd-primary-light #F5EEE6`). Dùng **~2.900 lần** (CSS lõi 850, prototype ~2.050). Component `sd-*` KHÔNG dùng bộ này (đã theo `--sd-*`); bộ này tô **shell / pattern / trang prototype** |
| Chữ thân trang | catalog `#212529` (reboot) · kit `#212121` |
| Link `<a>` | catalog `#007bff`, không gạch chân, gạch khi hover · kit: **không có rule** → xanh mặc định trình duyệt `#0000EE` + gạch chân |
| `.text-secondary` | khớp sd-core (= `--sd-secondary` **#212121 đậm**), nhưng 471 chỗ trong kit dùng nó với ý "chữ phụ màu xám" (kiểu Tailwind/OMEU) → đang hiện **đậm** |

## 2. Typography

| | Kết quả |
|---|---|
| Phông | cả hai Roboto. Chuỗi dự phòng khác: catalog `Roboto, 'Helvetica Neue', Arial, sans-serif` · kit `Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` |
| Cỡ / dòng thân trang | 14px / 1.5 — khớp |
| Lớp `T*` (T10–T48, M/R) | 13/20 khớp; **thiếu 7**: `T18R T20R T24R T32M T32R T48M T48R` |
| `fs-0 … fs-200` | thiếu 200/201 (chỉ có `fs-14`) |
| `font-weight-light/medium/bold/bolder` | thiếu 4/5 |
| `text-uppercase/lowercase/capitalize/nowrap/ellipsis/break/justify` | thiếu 7 |
| Reboot chữ | `small` 80% (kit 83%), `th` 600 (kit 700), `dt` 700 (kit 400), `legend` 24px, `code/pre` chuỗi phông mono của sd-core (kit `monospace`) |
| Ô nhập / nút trần (`input, button, select, textarea`) | catalog **thừa hưởng** Roboto 14px · kit: phông mặc định trình duyệt (Arial 13.33px, textarea monospace) |
| Hệ cỡ chữ riêng của kit | `.text-sm` (12px) dùng 472 lần, `.text-xs`, `.font-medium`, `.font-semibold` — **không có trong sd-core** (sd-core dùng `T12R`, `font-weight-medium`…) |

## 3. Spacing

| | Kết quả |
|---|---|
| Thang của sd-core | `m/p/mt/…/gap-N` = **N pixel** (0–200): `mb-4` = 4px, `gap-3` = 3px |
| Thang của kit (`utilities.css`) | kiểu Tailwind **N × 4px**: `mb-4` = 16px, `gap-3` = 12px |
| **Cùng tên, khác giá trị** | 20 lớp: `mb-1…6 · mt-1…6 · p-4 p-5 p-6 · px-4 · py-2 · mr-2 · gap-1 gap-2 gap-3 gap-6` — dùng **732 lần** trong kit (`mb-3` 215, `mb-2` 113, `gap-3` 74, `mb-4` 66…). Rule 15 của AGENTS.md còn hướng dẫn `mb-4`, `mb-6` theo nghĩa Tailwind |
| Khớp | 27 lớp có giá trị trùng tình cờ (`mb-8 mb-16 p-8 p-16 gap-4 gap-8 gap-12 gap-16 ml-4…`) |
| **Thiếu** | ~2.900 lớp margin/padding, 600 lớp `gap / gap-x / gap-y` |
| Dùng mà kit không có (đang không ăn) | `p-3` ×10, `my-4` ×4, `mb-12` ×3, `py-3` ×2, `ml-2`, `mx-4`, `w-8`, `h-8` |
| Reboot | catalog: `h1–h6` mb .5rem, `p / ul / ol / dl / pre / blockquote / figure` mb 1rem, `ul/ol` padding-left 40px, `label` inline-block mb .5rem, `table` collapse, `th/td` theo trình duyệt · kit: **reset hết về 0** (kiểu Tailwind preflight) |

## 4. Shadow

| | Kết quả |
|---|---|
| sd-core | 9 lớp Material `mat-elevation-z0…z8` |
| Kit | **thiếu cả 9**; kit có `--shadow-xs/sm/md/lg/xl/inner/focus` = **bóng Tailwind** (vd `0 1px 3px rgba(0,0,0,.1)…`), dùng 26 lần trong shell / pattern / prototype. Bóng bên trong component `sd-*` đã theo catalog từng component |

## 5. Border radius

| | Kết quả |
|---|---|
| sd-core | `rounded-0 … rounded-200` (px) + `rounded-full` |
| Kit | có 2/202 (`rounded-0`, `rounded-8`); thiếu `rounded-full` (đang dùng 1 lần, không ăn). Kit có `.rounded-lg` (19 lần) + token `--radius-sm/md/lg/xl` — không có trong sd-core |
| Viền | `.border` (1px `--sd-black200`) **thiếu** (đang dùng 1 lần), `border-left/right` thiếu; `border-0/top/bottom` khớp |

## Lớp khác của sd-core kit đang thiếu

`d-inline / d-inline-block / d-inline-flex / d-grid`, `position-*`, `overflow-*`, `align-items-start/end/baseline/stretch`,
`align-self-*`, `align-content-*`, `justify-content-around/evenly`, `flex-auto/none/row-reverse/column-reverse`,
`cursor-default/not-allowed`, `invisible`, `w-N / h-N`, `w-fit / w-screen / min-* / max-*`, lưới `row / col-* /
grid-container`, `sd-image-*` (ảnh trạng thái rỗng). Tổng: kit có **190 / 4.519** lớp sd-core (170 khớp, 20 lệch giá trị).

## Kết luận

- **Phần component (`sd-*`) đã khớp** — màu, chữ, khoảng cách, bóng, bo góc bên trong từng component đã đối chiếu từng vòng.
- **Phần style chung CHƯA khớp**: kit đang chạy song song hệ tiện ích kiểu Tailwind + token Figma OMEU, trong khi Core UI
  dùng hệ tiện ích px + reboot Bootstrap của sd-core. Lệch nặng nhất là **thang spacing cùng tên khác nghĩa** (732 chỗ).
- Sửa cần Builder chọn hướng (đụng mọi trang) — xem câu hỏi trong phiên.

---

## ĐÃ XỬ LÝ — 2026-10-13 (Builder: spacing *„Theo Core UI, giữ hình“* · shell *„Theo Core UI hết“*)

| Mảng | Làm gì | Kiểm |
|---|---|---|
| Tiện ích | `utilities.css` = 14 partial sd-core biên dịch nguyên văn (spacing, sizing, border, typography, gap, display, flexbox, overflow, position, misc, grid, elevation, color, image) — so khớp từng ký tự với bản biên dịch. 125 bản sao trùng tên trong `sd-tokens.css` + `.gap-*` trong `layout.css` gỡ. Bí danh kit (Rule 18-3) giữ ở phần 2 | — |
| Spacing | 732 chỗ đổi sang số px tương ứng (`mb-3` → `mb-12`…), không đụng `sd-components.js` (đã theo px). 3 chỗ `mb-4` của khối catalog `side-drawer-body-custom` giữ nguyên (đúng 4px) | csdump trước/sau: 0 lệch spacing |
| Bí danh → tên sd-core | `text-sm/xs` → `fs-12` · `font-medium` → `font-weight-medium` · `font-semibold` → `font-weight-bold` · `items-center` → `align-items-center` · `rounded-lg` → `rounded-8` · `text-muted` → `text-black400` · `relative` → `position-relative` (698 chỗ). Giữ bí danh hiển thị `flex`/`flex-col`/`inline-flex`/`hidden` (không `!important` — JS bật/tắt) | dispaudit: 0 lần ẩn/hiện bị chặn mới |
| Lớp no-op | 26 lớp kiểu Tailwind trước đây không ăn (`p-3`, `py-3`, `mx-4`, `w-8`, `h-8`, `my-4`, `ml-2`, `rounded-full`, `border`, `overflow-hidden`) gỡ — sd-core sẽ cho chúng nghĩa khác (`p-3` = 3px, `w-8` = 8px) | giữ hình |
| Reboot | `layout.css`: `*{margin:0;padding:0}` → `_base.scss` + `scrollbar.scss` nguyên văn. Khung kit (page-title/subtitle, tab, ô tìm sidebar), thẻ `.card-title`, `.form-check`, `.modal-close`, nhãn checkbox/radio/form-field tự khai lề; 415 phần tử trang được thêm `mb-0`/`pl-0`/`p-0` để giữ hình | chiều cao 100 trang: prototype 0 đổi, preview ≤ 19px |
| Màu | `--color-*` 25 bậc trỏ `var(--sd-*, #hex)`; `--border-secondary` → `#e6e6e6`; `text-secondary` (chữ phụ) → `text-black400` ở 470 chỗ trang | — |
| Chữ | font thư viện tự host `vendor/sd-fonts/` (Roboto 400/500/600/italic, Material Icons/Symbols), bỏ Roboto Google; body Roboto 14/1.5 `#212529`; `.material-icons` inline-block như thư viện | — |
| Bóng | `--shadow-xs/sm/md/lg/xl` → mat-elevation z1/z2/z8/z8/24; lớp `mat-elevation-z0…z8` có sẵn | — |
| Bo góc | `rounded-0…200`, `rounded-full` có sẵn; `--radius-*` giữ | — |

Harness catalog (26 mục, `fcmp`): tổng lệch bằng hoặc giảm ở 23 mục; tăng ở `c-operator` / `c-query-bar` / `c-inform`
chỉ là `font-size`/`line-height` kế thừa của `<button>`/`<input>` (reboot `font: inherit`) — toạ độ không đổi, trừ ô tìm
`sd-query-bar` 224 → 220px (Roboto hẹp hơn Arial mặc định của catalog). Công cụ: `global-styles-audit/` (csdump, cscmp2,
dispaudit, rw, rw2, fixrb, mkutil).
