# Đổi nguồn chuẩn sang Core UI Catalog — 2026-10-10

## Quyết định

Builder chốt: **mốc chuẩn của kit là `@sd-angular/core` 19.0.10** như Core UI Catalog
trình bày, phạm vi **cả bộ, một lượt**. Nguyên văn: *"Tôi cần mọi thứ phải dùng giống
catalog @sd-angular/core 19.0.10"*.

## Vì sao có quyết định này

Builder chỉ vào mục `#c-inform` của catalog và nói kit làm khác. Tôi sửa `sd-inform`
theo catalog, rồi khi đọc `inform.component.html` / `.scss` thật trong gói npm
`@sdcorejs/angular` 22.2.12 thì thấy **kit vốn đã khớp 1:1 với gói npm** — tức là
bản trước không sai, chỉ là đang theo một nguồn khác. Tôi hoàn tác, dựng ảnh đối
chiếu ba cột rồi hỏi Builder chọn nguồn nào.

![ba cột](inform-catalog-vs-npm-vs-kit.png)

Kết quả đo khi đó (harness `scratchpad/inform/`):

| Cặp so | Số thuộc tính lệch |
|---|---|
| Kit ↔ gói npm 22.2.12 | **0** (14 dòng còn lại là do cột tham chiếu tôi dựng tay, không phải lệch thật) |
| Kit ↔ catalog 19.0.10 | **446**, cộng 2 nút thừa/thiếu |

## Hai nguồn khác nhau ở đâu — lấy `sd-inform` làm ví dụ

| | Catalog 19.0.10 (mốc MỚI) | Gói npm 22.2.12 (mốc CŨ) |
|---|---|---|
| Viền | `1px solid var(--sd-{color})` — đặc, bão hoà | `color-mix(tone 22%, #fff)` — nhạt |
| Nền | `var(--sd-{color}-light)` nguyên bản | `color-mix(soft 28%, #fff)` — nhạt hơn nữa |
| Icon | trần, 20px, **ăn màu chủ đề** | bọc ô tròn 32px nền `-light` |
| Tiêu đề | **cùng màu với icon** | màu chữ đen `--sd-text` |
| Thân | đen, line-height 20px | đen, line-height 21px |
| `gap` của content | 2px | 4px |
| `padding` | `12px 16px` | `16px` |
| `actionLabel` | **link chữ** màu `--sd-info` | **`sd-button`** `size="sm" type="light"` |
| Nút đóng | 24×24, bo tròn 50%, hover nền `rgba(0,0,0,.06)` + chữ đỏ | 32×32, bo 6px, hover nền `--sd-black100` |
| Nút trong `[sdInformAction]` | cao **24px** (`--mat-button-*-container-height: 24px` đặt trên `#c-inform`) | cao 32px theo `size="sm"` thường |

Nói cách khác: catalog vẽ Inform **đậm và phẳng**, gói npm vẽ **nhạt và có ô icon**.
Đây là khác biệt THIẾT KẾ giữa hai phiên bản thư viện, không phải lỗi mirror.

## Hệ quả với các ghi chú cũ

Mọi dòng trong `CHANGELOG.md`, `_memory/known-gaps.md` và `design-system/components/*.md`
trước ngày 2026-10-10 có dạng *"mặc định THẬT của thư viện là X"* đều đang nói về gói
npm. Khi rà từng component theo catalog, chỗ nào catalog nói khác thì **catalog thắng**,
và phải sửa luôn ghi chú cũ chứ không để hai câu mâu thuẫn nằm cạnh nhau.

Riêng **danh sách input/output** thì vẫn tra gói npm được, vì catalog chỉ liệt kê tên
chứ không có bảng đầy đủ — nhưng số đo, màu và markup thì theo catalog.


---

## Tiến độ chuyển sang catalog

### Đã xong

**1. Bảng màu `--sd-*` — đòn bẩy lớn nhất, ảnh hưởng MỌI component.**
Trước đó khối token ánh xạ sang thang màu OMEU (`--color-*`) và **17/25 token lệch**
so với catalog. Nay lấy giá trị nguyên văn của catalog:

| Token | Trước (OMEU) | Nay (catalog) |
|---|---|---|
| `--sd-info` | `#3062eb` | `#1890ff` |
| `--sd-info-light` | `#eaedf6` | `#e6f7ff` |
| `--sd-info-dark` | `#1e46d7` | `#0050b3` |
| `--sd-secondary` | `#757575` | `#212121` |
| `--sd-secondary-dark` | `#000000` | `#757575` |
| `--sd-error` | `#e73722` | `#f82c13` |
| `--sd-warning` | `#f0930d` | `#ff9600` |
| `--sd-primary-light` | `#f7f2ed` | `#f5eee6` |
| `--sd-primary-dark` | `#9c5c10` | `#834111` |
| `--sd-dark` | `#212121` | `#343a40` |
| …và 7 token nữa | | |

Thang `--color-*` của OMEU **không bị đụng** — pattern riêng của kit (page-header,
sidebar, filter-bar…) vẫn dùng nó.

**2. `sd-inform`** — dựng lại toàn bộ phần nhìn theo catalog: viền đặc màu chủ đề
thay cho `color-mix` nhạt, nền là token `-light` nguyên bản, icon **trần 20px** bỏ ô
tròn 32px, tiêu đề **cùng màu icon**, `gap` 2px, `padding` 12px 16px, `actionLabel`
là **link chữ màu info** thay cho `sd-button`, nút đóng 24px bo tròn 50%.
Đo bằng harness: **0 thuộc tính lệch** (chỉ còn khác thẻ `<mat-icon>` vs `<span>`,
xem mục "Khác biệt vĩnh viễn" bên dưới).

**3. `sd-badge`** — màu chữ/viền lấy **token gốc** thay cho biến thể `-dark`;
`.c-badge-icon` `min-width: 50px`; icon trong type `icon` có **khung tròn + padding
`2px 2px 2px 0`** và to hơn (sm 20px, md 22px, lg 28px thay vì 16/18/24); thêm lớp
màu `c-black400`; khai số đo của `T14R`/`T12R`/`T10R`.

**4. `sd-switch` — dựng lại hoàn toàn.** Catalog render `sd-switch` bằng
`mat-slide-toggle` của Angular Material, tức cấu trúc MDC switch:
`button.mdc-switch > .mdc-switch__track + .mdc-switch__handle-track > .mdc-switch__handle
> __shadow + __ripple + __icons`. Track xám khi tắt / tô tông nhạt khi bật (trượt
ngang bằng hai lớp `::before` và `::after`); tay nắm 20px tròn, **xám đậm khi tắt và
màu chủ đề khi bật**, bên trong **có icon** ✓ (bật) hoặc — (tắt). Số đo catalog:
khung 36 · track 14 bo 7 · tay nắm 20 bo 10 · icon 18.

Bản trước là pill viền + tay nắm trắng không icon, ba cỡ 36/52/60. Nay cỡ chuẩn là
cỡ **duy nhất** của catalog (36); `sm`/`lg` giữ lại làm phần mở rộng riêng của kit
để 20 chỗ đang khai `size` không vỡ.

**5. `sd-chip`.** Nền chip đổi từ `--sd-primary-light` + chữ `--sd-primary` (nâu
thương hiệu) sang **xám trung tính** `color-mix(rgba(0,0,0,.87) 12%)` + chữ
`rgba(0,0,0,.87)`, bo **16px**, đệm trái 12px, chữ 14px/20px weight 500. Nút xoá để
`opacity .54` rõ lên khi hover/focus, thay vì đổi nền thành màu thương hiệu.

**6. `sd-section`.** `.c-item` căn **giữa** theo chiều dọc (trước là `flex-start`),
đệm `8px 16px` (trước `10px 16px`), khoảng cách cột 8px (trước `gap: 16px`), đường kẻ
`--sd-black100` (trước `--sd-black200`). `.c-shadow-section` dùng **bốn đường `inset`
1px** làm viền cộng một bóng rất nhẹ, thay cho một bóng đổ chung.

**7. `sd-upload-file`.** `.c-document-container` đệm và khoảng cách 4px (trước 8px),
bo 4px (trước 8px), nền `--sd-light`. Nút xoá trong hàng tài liệu 16px **bo tròn**
(trước 32px bo 6px). Nút gỡ ảnh dùng viền trắng và chữ đen đúng catalog.

**8. `sd-table`.** Dòng đang chọn đổi sang `#eef2ff` (xanh rất nhạt) thay cho
`--sd-primary-light` — nền chọn là tông trung tính để không lẫn với nhãn màu thương
hiệu trong bảng. `.c-th` thêm `vertical-align: middle` và `line-height: 20px`.

**9. `sd-query-bar` — dựng lại bố cục, đây là phần lệch nhiều nhất.** Catalog chia
thanh làm hai vùng: `.c-query-bar__main` (ô tìm kiếm · vạch ngăn · chip · nút "+",
có `flex-wrap`) và `.c-query-bar__actions` (AND/OR · xoá hết · bộ lọc đã lưu · tìm,
`nowrap`, dồn phải). Chính nhờ `__main` xuống dòng mà chip nằm **hàng riêng** dưới ô
tìm kiếm — bản trước xếp tất cả trên một hàng nên nhìn khác hẳn.

Chip đổi từ `button + button` anh em sang **`div[role="button"]` chứa
`span[role="button"].c-chip-remove`** — đúng cách catalog tránh lồng button; thêm
chevron `arrow_drop_down` ở cuối; chip chưa có giá trị là `c-chip-inactive` (nền
trắng, không in `:`) thay vì in `—` như trước. Ba nút bên phải thành **nút icon 28px
có viền** (`delete_sweep` / `bookmark_border` / `search`) thay cho `sd-button` chữ;
nút "+" thành nút tròn **viền nét đứt**; AND/OR in chữ tiếng Anh thay cho "VÀ"/"HOẶC".
Icon chip ưu tiên `field.icon` như catalog khai.

Toàn bộ bộ class `qb-*` ở cấp thanh đổi sang tên của catalog (`c-query-bar`,
`c-search`, `c-chip`, `c-add-filter`, `c-logic-toggle`, `c-clear-all`,
`c-saved-filters`, `c-search-trigger`). Các `qb-*` còn lại chỉ nằm trong popover và
menu — catalog style chúng qua `.mat-mdc-menu-panel` của Angular CDK, kit không có
tầng đó nên giữ tên riêng.

Bộ test mới `test-query-bar.mjs`: **20 assertion**, đo khung hai vùng, số đo hai
density, cấu trúc chip, icon từng nút.

**10. `sd-table` và `sd-upload-file` — đóng nốt số đo.**

`sd-table`: host thành **cột flex tự cuộn** (`display:flex; flex-direction:column;
overflow:auto`) thay cho `display:block`; `.c-container` và `.c-table` cũng là cột
flex để khối "không có dữ liệu" giãn hết chỗ trống. Thêm **`.c-no-data-row`** —
trước đây bảng rỗng render ra **không có gì** dưới phần đầu bảng; nay có minh hoạ
96px và câu chữ, `position: sticky; left: 0` để vẫn nằm giữa khung nhìn khi bảng
cuộn ngang, và câu chữ đổi theo việc đang có bộ lọc hay chưa. `border-collapse`
thành `separate` (catalog cần vậy cho header dính). Thêm `.c-header-title` 40px,
`.c-loading` phủ `inset: 0 0 56px`, `.sd-selection-cell` 42px cố định,
`.c-selection` thu nhỏ 85%, `.c-detail-row` cao 0. Paginator `space-between`.
Nút lệnh trên dòng từ 32px xuống **24px**, icon 16px màu `--sd-black400`.
Dòng đang chọn nhận cả tên `.selected` của catalog lẫn `.c-selected` của kit.

**Và một thay đổi đáng Builder xem lại:** catalog **bỏ hẳn đường kẻ ngang** giữa
các dòng dữ liệu. Kit đã làm theo, nhưng bảng back-office dày đặc mất đường kẻ thì
dò theo hàng khó hơn — đã ghi vào `_memory/known-gaps.md` kèm cách hoàn tác bằng
một dòng.

`sd-upload-file`: **đổi bộ icon theo đuôi file sang bộ của catalog** (bốn cái: mặc
định · pdf · xls/xlsx · doc/docx, nét phẳng nền be). Bộ cũ lấy từ gói npm có thêm
png/jpg/ppt/csv/zip nhưng vẽ theo phong cách khác hẳn — giữ lẫn hai bộ thì mỗi hàng
tài liệu một kiểu, nên bỏ các đuôi catalog không định nghĩa để chúng rơi về icon
mặc định, đúng như catalog làm.

Sau đợt này `sd-table` và `sd-upload-file` **không còn giá trị nào lệch**.

**11. `sd-avatar` — bảng màu, initials, cỡ mặc định (2026-10-11).**

Kit chỉ có **12 màu** và xếp theo thứ tự khác, nên cùng một cái tên ra màu khác hẳn
catalog ("Nguyễn Văn An" ra xanh dương thay vì xám `#7f8c8d`). Nay chép nguyên bảng
**19 màu** và hàm băm của catalog. Cùng lúc sửa ba điểm nữa: cỡ mặc định **32px**
(kit để 40), tên **một từ** chỉ lấy **một** chữ cái đầu (kit lấy hai ký tự), rỗng →
`?` nền `#bdc3c7`. Thêm input `src` — ở catalog đây là input DUY NHẤT, vừa là URL
ảnh vừa là tên; `name` của kit giữ lại làm bí danh cho các trang đã viết. Cỡ chữ
`size / 2.5` (không làm tròn, nên 32 → 12.8px đúng catalog). Các khai báo nền/căn/bo
chuyển từ inline style của JS sang CSS `.sd-avatar` đúng như catalog, bỏ
`letter-spacing: .5px` mà catalog không có.

**12. `sd-stepper` — dựng lại theo catalog thay vì theo npm.**

Bản 2026-10-08 bám SCSS của `@sdcorejs/angular` 22.2.12; catalog 19.0.10 khác thật:

| | Catalog 19.0.10 | Kit (theo npm) |
|---|---|---|
| Chiều cao một bước | 40px, không bo góc | 72px, bo 8px |
| Vòng tròn | 24px | 32px |
| Icon trong vòng tròn | 16px | 18px |
| Chưa tới | nền `#e0e0e0`, chữ `rgba(0,0,0,.54)` | `#f2f2f2` / `#757575` |
| Đã qua | nền **primary ĐẶC**, ký hiệu trắng | nền primary-light, chữ primary |
| Ký hiệu bước đã qua | `create` (bút chì) hoặc `done` nếu `editable="false"` | luôn `check` |
| Đường nối | min-width 32px, `rgba(0,0,0,.12)` | 16px, `#e6e6e6` |
| Nhãn | mọi bước bấm được: `#1a1a1a` / 500 | đã qua 500, đang làm primary 600 |

Điểm đáng kể nhất là **ký hiệu**: catalog dùng `_getDefaultIndicatorLogic` của
`MatStepHeader` — bước đang làm hiện SỐ, bước đã đi qua hiện bút chì (vì `editable`
mặc định true) hoặc dấu tích khi `editable="false"`. Kit trước đây chỉ coi là "đã
xong" khi trang khai `state="completed"`, nên bấm Tiếp tục xong bước cũ vẫn là số
xám. Nay suy ra từ chỉ số bước (`i < selectedIndex` = đã đi qua) và vẽ lại mỗi lần
đổi bước, qua hàm `_paintCircle` mới.

Về nhãn bước đang làm: catalog **có** rule `.mat-step-label-selected
.mat-step-text-label{color: active; font-weight:600}` nhưng rule
`.mat-step-label.mat-step-label-active .mat-step-text-label{color:#1a1a1a;
font-weight:500}` đứng trước lại **nhiều class hơn** nên luôn thắng → trên trang
thật nhãn bước đang làm KHÔNG đổi màu. Kit chép lại cả hai rule với đúng tương quan
điểm đó, nên hành vi giống hệt và vẫn còn chỗ bám nếu trang nào muốn tô riêng.

Một chỗ kit cố tình khác: `state="error"` của kit là khai **bằng tay**, nên hiện dấu
lỗi kể cả ở bước đang làm; Material giấu dấu lỗi ở bước đang làm vì ở đó lỗi được
suy ra từ form. Catalog không có ví dụ lỗi nào để đối chiếu.

**13. `sd-tab-group` — thanh tab, nhãn, badge.**

| | Catalog | Kit (trước) |
|---|---|---|
| Thanh tab | cao 36px, **không đường kẻ dưới** (`--mat-tab-divider-height: 0`) | 48px, kẻ 1px |
| Nhãn | 14px / 400; chưa chọn `rgba(0,0,0,.54)`, đang chọn `#ae7129` | 14/400, chưa chọn `#212121`; đang chọn đậm 500 |
| Hover | **không đổi màu** | chuyển sang primary |
| Icon | 18px | 16px |
| Khoảng cách icon ↔ chữ | 4px | 8px |
| Badge | cao 18, min-width 18, `0 6px`, bo 10px, cách chữ 2px | 16 / 16 / `0 5px` / 100px / 0 |
| Nút đóng | 16px, mờ `.6`, hover rõ + đỏ | đổi NỀN khi hover |

Cấu trúc markup cũng đổi cho khớp tên của catalog: `button > span.sd-tab__label`
(bọc, flex gap 4px) `> .sd-tab__icon + span.sd-tab__text + .sd-tab__badge`. Trước
đây kit nhét thẳng vào `button` và dùng `.sd-tab__label` cho **chính chữ** — ngược
nghĩa với catalog. Hai biến thể `pills` và `segmented` cũng chỉnh theo catalog:
viên thuốc đang chọn tô **đặc** màu chủ đạo chữ trắng (trước là nền nhạt chữ nâu),
segmented nền `#f0f3f7` bo 8px không viền, ô đang chọn nền trắng + bóng nhẹ.

**14. Ô nhập dùng chung (`.sd-form-field`) — ảnh hưởng cả nhóm form.**

Đây là thay đổi có bán kính rộng nhất đợt này: `sd-input`, `sd-select`, `sd-date`,
`sd-datetime`, `sd-input-number`, `sd-textarea`, `sd-chip`, `sd-chip-calendar` dùng
chung khung này.

| | Catalog (`.sd-md` / `.sd-sm`) | Kit (trước) |
|---|---|---|
| Chiều cao | **43.5px** / 32px | 36px / 28px |
| Lề trong | 16px | 12px |
| Ô chữ | cao 21px, `rgba(0,0,0,.87)` | 16px, `#212121` |
| Placeholder | `rgba(0,0,0,.54)` | `#757575` |
| Nhãn lúc nghỉ | cách mép 16px, 14px, `rgba(0,0,0,.54)` | 12px, `#212121` |
| Nhãn lúc nổi | đỉnh `-6.75px`, chữ 10.5px (= 14 × .75) | `-10px`, 12px |

Và ba trạng thái khác hẳn — catalog **ghim màu viền ở mọi trạng thái** bằng
`!important`:

```
.mat-mdc-form-field .mat-mdc-notch-piece.mdc-notched-outline__leading{
  border-color: var(--sd-black200) !important }
```

nên **hover không đổi màu viền**, **focus chỉ dày lên 2px** chứ không chuyển nâu,
và **ô lỗi vẫn giữ viền xám** — chỉ khi `hideInlineError` (không có dòng lỗi ở dưới
để báo) viền mới đỏ, qua rule riêng `.hide-inline-error.mat-form-field-invalid`.
Kit đã làm đúng như vậy; đây là chỗ catalog khó dùng hơn bản cũ của kit nên đã ghi
vào `_memory/known-gaps.md`.

Hai cỡ riêng của kit giữ nguyên tinh thần cũ: `sd-xs` (hàng lọc trong bảng, 24px)
giữ lề 12px vì lề 16px sẽ ăn gần hết bề ngang ô lọc; `sd-lg` nâng 44 → 52px cho
khỏi trùng `md` mới.

**15. `sd-radio` — số đo và trạng thái.**

| | Catalog | Kit (trước) |
|---|---|---|
| Vùng bấm | 28×28 | 24×24 |
| Vòng ngoài | 20×20, viền **2px** | 16×16, viền 1.5px |
| Chấm trong | 10×10 | 8×8 |
| Chưa chọn | `rgba(0,0,0,.54)` | `--border-primary` |
| Hover chưa chọn | **chỉ đậm viền** lên `rgba(0,0,0,.87)` | đổi viền + tô nền primary-light |
| Hover đã chọn | **giữ nguyên màu** | chuyển primary-dark |
| Nhãn cách ô | 4px | 8px |
| Xếp dọc | cách nhau **0** | 8px |
| Disabled | viền/chấm `rgba(0,0,0,.87)` mờ `.38` | cả cụm mờ `.4` |

**Bộ test mới `test-catalog-sweep.mjs` — 29 assertion** neo toàn bộ số đo của năm
mục trên. Trước lượt này **không có test nào ghim chiều cao `.sd-form-field`**, nên
đổi 36 → 43.5px mà cả bộ vẫn xanh — đúng loại lỗ hổng cần bịt.

**16. `sd-button` — tám chỗ lệch, trong đó một chỗ là mâu thuẫn của chính catalog.**

Builder chỉ thẳng vào `#c-button`. Bản 2026-10-10 dựng theo SCSS của
`@sdcorejs/angular` 22.2.12: **khung thì đúng** (32/40/48px, padding 2px 12/16px,
bo 4px, icon 16/20/24px, ba mặc định light/secondary/sm) nhưng phần **nhìn** khác
ở tám chỗ:

| | Catalog 19.0.10 | Bản kit theo npm 22.2.12 |
|---|---|---|
| Chữ trên nút | **400** | 500 |
| `color="secondary"` | **#000 đen tuyền** (trùng `black`) | `--sd-secondary` = `#212121` |
| Viền `outline` | **#d3d3d3** | `--sd-black300` = `#bfbfbf` |
| Nút vuông (`c-square`) | padding **0** | vẫn giữ `2px 12/16px` |
| Khoảng cách icon ↔ chữ | `.ml-8` / `.mr-8` gắn **trên nhãn** | `gap` trên wrapper (sm 6px, md/lg 8px) |
| `disabled` | nền `#e9e9e9`, chữ `#a6a6a6`, mờ `.5` — **mọi type** | `#e6e6e6` / `#757575`, không mờ; outline & link nền trong suốt |
| Hover / focus | phủ **lớp màu mờ** 4% / 12% | `filter: brightness()` |
| Con trỏ | `wait` khi loading, `not-allowed` khi disabled, trên **thẻ host** | trên `<button>` — vô hiệu vì nút đã `pointer-events:none` |

Chỗ **nút vuông** là một bài học về thứ tự rule: catalog có cả
`.c-square{padding:0!important}` lẫn `.c-sm{padding:2px 12px!important}`, và
`.c-sm` đứng sau nên thắng. Kit đã chép đúng thứ tự đó từ đợt trước và kết luận
"nút vuông giữ padding của size". Nhưng catalog còn một rule thứ ba —
`.c-sm.c-square{padding:0!important}` — **bốn class**, cao điểm hơn cả hai. Đo cột
catalog ra `padding: 0px`, đúng rule thứ ba. Nhìn thiếu một rule là lệch.

Chỗ **hover** đáng kể nhất vì sai cả **hướng**: Material không đổi màu nền mà phủ
một lớp màu mờ lên trên, và màu lớp phủ đổi theo `.mat-primary`:

| | `color="primary"` | các màu còn lại |
|---|---|---|
| `fill`, `light` | `#fff` → nút **SÁNG** lên | `rgba(0,0,0,.87)` → tối đi |
| `outline`, `link` | màu chủ đạo | `rgba(0,0,0,.87)` |

Kit trước đây dùng `filter: brightness(.92)` cho mọi nút `fill`, nên nút chính
(fill + primary) **tối đi** khi rê chuột — ngược hẳn catalog. Nay dựng lại bằng
chính lớp `.mat-mdc-button-persistent-ripple` mà kit vẫn render sẵn trong DOM
(trước đó bị `display:none`).

**Và một chỗ catalog tự mâu thuẫn, kit chép lại nguyên tình trạng đó.** Catalog
để `[disabled]{color:#a6a6a6!important; background-color:#e9e9e9!important}` đấu
với `.c-fill.mat-secondary{background-color:#000!important}`. Cả hai đều
`!important`, nhưng rule sau **năm class** còn rule trước **hai class + một
attribute**, nên rule màu thắng → nút `color="secondary"` lúc disabled **vẫn giữ
nền đen / chữ đen** trong khi mọi màu khác chuyển xám. Trước khi chép, đã dựng
lại một trang chỉ dùng **CSS nguyên văn của catalog** với đúng bốn tổ hợp class
(`btn/cat-disabled.html` trong scratchpad) để xác nhận, rồi đối chiếu kit ra
**đúng bốn giá trị giống hệt**:

```
fill+secondary  disabled → bg #000     color #a6a6a6  opacity .5
fill+primary    disabled → bg #e9e9e9  color #a6a6a6  opacity .5
light+secondary disabled → bg #e9e9e9  color #000     opacity .5
link+secondary  disabled → bg #e9e9e9  color #000     opacity .5
```

Cùng lượt đổi tên class của type thứ tư: catalog gọi là `link` và sinh `c-link`;
kit trước đây sinh `c-text` theo tên của gói npm. Nay sinh `c-link`, giữ `text`
làm **bí danh đầu vào** và giữ `.c-text` trong selector CSS cho các trang viết
trước đó — 224 chỗ đang viết `type="link"` cùng Rule 17/18 của `AGENTS.md` không
phải sửa gì.

Một lỗi nhỏ tự bắt được: vòng xoay `loading` của kit thiếu `box-sizing:border-box`
nên viền 2px cộng thêm 4px, làm nút loading rộng hơn catalog đúng 4px.

Sau đợt này `sd-button` **khớp từng giá trị computed** trên cả bảy khối ví dụ của
catalog (4 type × 6 màu, ba cỡ + nút vuông, prefix/suffix icon, chỉ-icon, loading,
disabled, block/width). Bộ test `test-button.mjs` lên **62 assertion**, và
`test-catalog-sweep.mjs` thêm **5 assertion** neo lớp phủ hover — trước đó không
test nào ghim nó.

**17. Rà soát TOÀN BỘ 63 mục catalog — năm chỗ lệch thật, bảy báo nhầm.**

Builder yêu cầu soát lại cả bộ "xem còn gì không". Quét ba lớp: so CSS theo
selector · **giải giá trị trong trình duyệt** · đối chiếu danh sách input. Chi
tiết và bảng phạm vi đầy đủ ở `CORE-CATALOG-GAP.md` (mục cập nhật 2026-10-11).

**Bước giải giá trị là bước mới và nó đổi hẳn kết luận.** Công cụ cũ so CHỮ, nên
64 cặp bị báo lệch thì **31 cặp chỉ khác cách viết**: `.6` ≡ `0.6`,
`#0000008a` ≡ `rgba(0,0,0,.54)`, `var(--sd-black200)` ≡ `#e6e6e6`,
`1px var(--x) dashed` ≡ `1px dashed var(--x)`. Nay mỗi giá trị được đặt lên một
phần tử thật rồi đọc computed, chỉ cặp nào giải xong **vẫn khác** mới tính.

**Năm chỗ lệch thật, đã sửa:**

| Chỗ | Catalog | Kit (trước) |
|---|---|---|
| `sd-select` — ô tìm kiếm trong panel | **Tự hiện khi danh sách > 10 mục** | **Không có** |
| `sd-tooltip` | max-width 250px · nền `#616161` · có đổ bóng 3 lớp · trễ 100ms | 320px · `#212121` · không bóng · trễ 200ms |
| `sd-splitter` thanh chia | Vùng bấm **8px**, thanh **4px** màu **`#b0bec5`**, hover **`#1976d2`** | Gutter 4px màu `#e6e6e6`, hover nâu primary |
| `sd-upload-file` khung tài liệu | nền **`#f9f9f9`** | `var(--sd-light)` = `#f8f9fa` |
| `sd-anchor` nhãn mục | khai đủ 4 tiền tố `user-select` | thiếu `-moz-` và `-ms-` |

Chỗ đáng kể nhất là **ô tìm kiếm của `sd-select`** — đây là **tính năng**, không
phải nước sơn: catalog ghi rõ *"tự hiện ô tìm kiếm khi danh sách > 10 phần tử hoặc
items là hàm tải từ server"* và có hẳn một biến thể minh hoạ. Kit chưa bao giờ có.
Dựng lại đúng số đo đo trên trang catalog: khung 8px nền trắng dính trên đầu panel,
hộp cao 38px viền 1px `--sd-black200` bo 4px, ô chữ cao 28px đệm 4px, icon kính lúp
24px màu `#dadada`. Lọc bằng cách **ẩn/hiện dòng** chứ không vẽ lại panel — vẽ lại
là ô nhập mất focus giữa chừng gõ.

**Thanh chia `sd-splitter` là chỗ dễ "sửa cho sai".** Catalog khai
`--sd-splitter-handle-color: var(--sd-color-primary-light, #b0bec5)`, nhìn qua
tưởng phải theo màu nâu của theme. Nhưng **portal không khai `--sd-color-primary*`**
— chính ghi chú của catalog nói vậy — nên màu thật rơi về **xanh xám**. Đã dựng lại
CSS nguyên văn của catalog để đo cho chắc: `rgb(176,190,197)`.

**Một lỗi của kit tự lòi ra trong lúc soát:** hàng "Tất cả" của `sd-select`
(`showSelectAll`) tham chiếu `SD_SELECT_TEXT.selectAll` mà chuỗi đó **chưa bao giờ
được khai** — nhãn render ra RỖNG. Đã bổ sung.

**Bảy chỗ còn lại là báo nhầm, đã truy ngược tận nơi** — bốn mục thuộc component
kit chưa dựng (`sd-form-render`, `sd-modal-resizable`, `sd-tab-router-outlet`) mà
trùng tên class với component khác; `c-table` thì `table{border-collapse:collapse}`
là reset của chính trang catalog (bảng kit đang render đo ra `separate`, ô `.c-td`
`border-bottom-width: 0` — khớp); `c-upload-file .c-area.c-view` thì kit dùng biến
khai trên thẻ host nên đầu dò không giải được (component đang render đo ra
`1px solid rgb(230,230,230)` — khớp).

**Bốn input catalog khai nhưng KHÔNG có ví dụ: không dựng.** `appearance` (5 ô
nhập), `floatLabel` (`sd-date`), `hyperlink` (`sd-radio`), `httpHeaders`
(`sd-preview-pdf`). Catalog chỉ liệt kê tên, không có biến thể nào dùng tới, nên
dựng là đoán. Đã ghi vào `_memory/known-gaps.md`.

**Phạm vi còn lại:** 63 mục catalog · kit dựng **27** · thêm **4** mục catalog xếp
là directive/service mà kit có tương đương (`[sdTooltip]`, ba service) · **32 chưa
dựng**. Danh sách đầy đủ theo nhóm ở `CORE-CATALOG-GAP.md`.

**Công cụ đo sai thêm hai lần nữa (lần 7 và 8), cả hai đều im lặng:**
selector của catalog giữ nguyên danh sách phân tách bằng dấu phẩy nên khoá đầy đủ
không khớp (báo "kit tô đỏ hết 6 màu inform" trong khi kit đúng); và bảng tra phía
kit **gộp** mọi rule cùng khoá nên rule biến thể che mất rule gốc (`.c-clear-all`
28px bị `.c-density-comfortable` 32px che, `.c-item` có kẻ bị `:last-child` che).
Đã sửa cả hai, và tách khối `@media` ở phía catalog cho khớp phía kit.

**Bộ test `test-catalog-sweep.mjs` lên 56 assertion**, thêm 22 cái neo đúng năm
chỗ vừa sửa. Toàn bộ **966 PASS / 0 FAIL / 0 CRASH**.

**18. Bộ đếm ký tự `maxlength` — tính năng catalog CÓ mà kit KHÔNG có.**

Catalog `#c-input` và `#c-textarea` đều hiện một bộ đếm nhỏ ` 18/50 ` nấp ở mép
dưới phải ô nhập, **mờ 0 cho tới khi focus hoặc rê chuột**, và chuyển đỏ đậm
(`font-weight:600`) kèm `title="Vượt quá số ký tự tối đa"` khi vượt. Kit **không
có một dòng nào** về `maxlength-counter` — grep cả bundle ra rỗng.

Đã dựng đúng theo CSS catalog: `.sd-input-field-wrap` / `.sd-textarea-field-wrap`
(`position:relative;flex:1;min-width:0`) bọc ô nhập, bên trong là
`.sd-maxlength-counter` (`position:absolute; right:4px; top:calc(100% - 16px);
font-size:10px; line-height:1.1; color:#00000061; pointer-events:none;
transition:opacity .12s ease; z-index:1`). Catalog treo điều kiện hiện lên
`.sd-input-container.c-focused` / `:hover`; kit không dựng container riêng nên
**chính `.sd-input-field-wrap` đóng vai trò đó** và JS bật/tắt lớp `c-focused`
khi focus/blur. Bộ đếm cập nhật **tại chỗ theo từng phím** (không vẽ lại cụm, để
không mất con trỏ) — đo trong trình duyệt: gõ 3 ký tự vào ô 18/50 ra `21/50`,
`selectionStart` vẫn là 21.

**19. `sd-side-drawer` — slot sai tên, thiếu hai thuộc tính đọc, thiếu bốn rule.**

Catalog ghi hẳn một cảnh báo trong ví dụ: *"⚠ `sdFooter`, KHÔNG `slot="footer"`:
SdSideDrawer chiếu footer bằng `<ng-content select="[sdFooter]">`"*. Kit chỉ nhận
`slot="header-left"` / `slot="footer"` — tức là trang viết đúng theo catalog thì
nội dung rơi thẳng vào thân. Nay nhận **cả hai**, ưu tiên tên của catalog
(`sdHeaderLeft`, `sdHeaderRight`, `sdFooter`), giữ `slot=` cho trang cũ.

Thêm `isOpened` / `isLoading` (catalog khai trong bảng API) và `data-opened` /
`data-loading` trên tấm trượt đúng như DOM mẫu. Bốn rule còn thiếu: thân
(`position:relative`) + nội dung (`position:absolute; inset:0; overflow:auto`) —
nhờ vậy vùng cuộn không bị header/footer đẩy cao; nút đóng theo rule nguyên văn
(`inline-flex`, `line-height:0`, chặn bôi chọn, chuyển màu **80ms**, `:focus-visible`
có vòng primary); nền mờ `#0006` + `transition: all .3s ease-in-out`; tấm trượt
`translate3d(100%,0,0)` → `translateZ(0)` khi mở. Vì `display:none` chặn
transition trong cùng khung hình, `open()` bật lớp `sd-side-drawer-mounted`
trước, ép tính lại bố cục, rồi mới bật `sd-side-drawer-active`.

Bỏ `background: var(--surface-page)` (#EBECED) mà kit tự thêm cho vùng nội dung:
catalog không khai nền, nội dung thừa hưởng #fff của tấm trượt.

**20. Công cụ đo sai lần thứ tám — và đây là lần nặng nhất.**

Bộ lọc của `cssdiff.py` có một dòng: `if not any('.c-…' in k for k in ks): continue`.
Nghĩa là **mọi rule đặt tên theo lối `sd-…` bị bỏ qua im lặng** —
`.sd-preview-thumb__badge`, `.sd-toast__bar`, `.sd-side-drawer-content`,
`.sd-maxlength-counter`, `.sd-form-field`… Bảng báo `c-preview-image 0 lệch`
trong khi kit dùng **hẳn một bộ tên khác** cho cả component. Mục 17 ("rà soát
TOÀN BỘ 63 mục") vì thế chỉ soát được phần đặt tên `.c-…`.

Sau khi mở bộ lọc cho cả `.sd-…`, số mục có chênh nhảy từ 24 lên 48, và ba
component **đang dựng** lộ ra là viết theo bộ tên riêng chứ không theo catalog.

**21. `sd-preview-image` — dựng lại toàn bộ theo catalog.**

Kit cũ: lưới ba hàng, thanh công cụ nằm trên cùng, tên class `-main`,
`-toolbar-group`, `-thumb-num`. Catalog: `.sd-preview-shell` (bo 12px, đổ bóng
`0 30px 80px #0000008c`) > `.sd-preview-header` **cao 68px** (icon + tên file +
dung lượng, bộ đếm `2 / 4` là viên thuốc canh **giữa tuyệt đối**) +
`.sd-preview-body` > `.sd-preview-stage` + `.sd-preview-thumbs`.

Thanh công cụ **nổi ở đáy khung ảnh** (`bottom:24px`, nền mờ + `backdrop-filter`,
bo 12px), hai mũi tên tròn 48px nằm hai bên, gợi ý phím `← →` ở góc trên trái,
nền stage là ca-rô 24px. Thumbnail 120×76 (dọc thì 128px, dải rộng 152px), có
`__badge` số thứ tự góc phải trên. Hai khối trạng thái (`__tile--muted` cho
"Không có thông tin ảnh", `__tile--danger` + nút **Thử lại** cho ảnh hỏng) chép
nguyên cả chữ.

Dòng phụ dưới tên file là **dung lượng** — item của kit chưa có trường đó, nay
thêm `size`: nhận chuỗi sẵn hoặc số byte rồi đổi sang `2.4 MB` / `844.0 KB` đúng
cách catalog hiển thị. Đo lại trong trình duyệt: header 68px · bộ đếm 24px ·
nav 48px · dải thumb 116px · thumb 120×76 · ô trạng thái 96×96 — khớp hết.

**22. `sd-preview-pdf` — dựng lại khung theo catalog, giữ iframe.**

Catalog: `.sd-preview-pdf-shell` > `__header` **cao 57px** (nút menu bật thanh
bên, gạch dọc, huy hiệu `PDF` 32px nền đỏ nhạt, tên + số trang, rồi tìm/tải/toàn
màn hình) + `__body` > thanh bên **240px ba tab** (Trang · Mục lục · Tìm) +
`.sd-preview-pdf-stage` chứa trang và **thanh công cụ nổi** (đầu/trước/ô số
trang 36×24/sau/cuối · thu nhỏ/`68%`/phóng to · Vừa trang · Vừa rộng · xoay ·
Từng trang). Có cả `.sd-preview-pdf-searchbar` khi `sidebar="search"`.

Kit dựng đúng bộ khung đó, **nội dung trang vẫn là `<iframe>` của trình duyệt**
(Rule 2 cấm kéo pdf.js về), nên mọi nút chỉ làm được bằng pdf.js vẫn `disabled`
kèm tooltip "cần pdf.js" như trước. Riêng rule
`.sd-preview-pdf-page{width:340px;aspect-ratio:612/792}` **không chép**: đó là cỡ
trang GIẢ mà trang demo của catalog tự vẽ, không phải style component.

`sidebar` nay nhận `search` (catalog có ví dụ) bên cạnh `thumbnails`; giá trị
khác vẫn quy về `thumbnails`.

**23. Toast (`SdNotifyService`) — dải màu là phần tử riêng, không phải viền trái.**

Catalog `#c-notify`: `<toast>` **rộng 350px**, bo 8px, `overflow:hidden`, bóng
`0 4px 12px #00000026`; bên trong là `.sd-toast__bar` **rộng 6px** tô màu loại,
`.sd-toast__icon` (đệm `12px 0 0 12px`, icon 24px), rồi `.sd-toast__content` gồm
`__header` (`__title` 16px/600 + nút `__close` là ký tự `×`, `opacity .5`) và
`__body` 14px/1.4. Kit cũ: một khối `padding:12px 16px`, **viền trái 4px**, tên
class `-icon/-content/-title/-message/-close`, nút đóng là icon `close`.

Đã dựng lại theo catalog, kể cả lớp `.sd-toast--closing` chạy `sd-toast-leave .2s`
rồi mới gỡ khỏi DOM — bản trước gỡ ngay nên hoạt ảnh rời **chưa bao giờ chạy**.
Container về `top/right: 20px; z-index: 9999` đúng catalog.

**24. Ba chỗ nhỏ còn lại.**

`sd-modal` nút đóng: thêm `margin-left:8px`, `line-height:0`, chặn bôi chọn,
`transition: background-color 80ms ease, color 80ms ease`, `:focus-visible` vòng
primary — chép nguyên rule catalog. `sd-splitter`: thiếu
`.sd-splitter--dragging sd-splitter-panel{transition:none!important}`, không có
nó thì mỗi lần chuột nhích panel lại chạy đuổi `.2s` → kéo giật.
`sd-upload-file`: `.sd-image-image-error` thiếu `content:url(...)` của catalog nên
thẻ `<img>` không có src hiện biểu tượng ảnh hỏng mặc định của trình duyệt.

**25. Bộ lọc của công cụ đo lại cắt mất một lối đặt tên — lần thứ chín, và lần này là lối `sd-…`.**

Vòng 5 đã mở bộ lọc từ `.c-…` sang `.c-…` **và** `.sd-…`. Vòng này soát tiếp
những gì lộ ra sau khi mở, xếp theo **mức ảnh hưởng** chứ không theo thứ tự
component.

**26. `sd-has-label` / `sd-viewed` trên thẻ host — thiếu ở CẢ NHÓM FORM.**

Catalog khai cho **từng** component form, cùng một cặp rule:

```
sd-input:not(._ng).sd-has-label { padding-top: 4px }
sd-input:not(._ng).sd-viewed    { padding-top: 0 }
```

và y hệt cho `select`, `textarea`, `date`, `datetime`, `input-number`, `chip`,
`chip-calendar`, `date-range`, `autocomplete`. Markup catalog dùng lớp
`sd-has-label` **98 lần**. Kit không có lớp nào trong số đó.

4px ấy không phải trang trí: nhãn nổi nằm ở `top:-7.75px` nên nó **tràn lên trên**
khung ô. Đo trên kit trước khi sửa: nhãn thò ra ngoài hộp host **6.8px** — xếp
hai ô sát nhau là nhãn của ô dưới đè lên ô trên. Nay JS gắn hai lớp đó lên host
cho cả 8 component kit dựng, và CSS chép đúng cặp rule của catalog.

**27. `sd-c-{color}` — catalog render input `color` thành LỚP TRÊN HOST.**

`<sd-checkbox class="sd-c-success">`, rồi lớp đó khai `--sd-c: var(--sd-success)`
và cả tầng CSS phía dưới đọc `var(--sd-c)`. Kit đọc thẳng attribute `color`, nên
markup chép từ catalog ra **không có màu**. Nay nhận cả hai chiều: đọc màu từ
attribute **hoặc** từ lớp, rồi gắn lớp `sd-c-*` lên host; CSS màu của
`sd-checkbox` nhận cả `[color="x"]` lẫn `.sd-c-x`.

Một chi tiết suýt sai: bản đầu tôi cho nó **ghi ngược** vào attribute `color` cho
tiện. Bộ test đỏ ngay — `test-checkbox.mjs` có selector `sd-checkbox:not([color])`
để kiểm màu mặc định, và việc ghi thêm attribute đã **đổi nghĩa DOM của trang**.
Sửa lại: chỉ gắn lớp, không đụng attribute.

**28. `sd-step` — `icon` nằm sai chỗ.**

Catalog: `<sd-step label="Thông tin chung" icon="description">` render thành
`<span class="sd-step__label"><mat-icon class="sd-step__icon">description</mat-icon>
<span class="sd-step__text">Thông tin chung</span></span>`, còn **vòng tròn vẫn là
số bước** (`1`). Kit làm ngược: nhét `icon` vào vòng tròn, nuốt mất số, và đặt
chữ thẳng vào `.sd-stepper__label` không có hai lớp con nào. Đã dựng lại đúng,
kèm ba rule `.sd-step__label/__icon/__text`.

**29. `sd-select` — giá trị dài bị cắt cụt, không có dấu `…`.**

Catalog gọi ô hiện giá trị đã chọn là `.sd-trigger-text` và khai
`text-overflow: ellipsis`. Kit dựng ô này bằng `<input readonly>` (để dùng chung
CSS `.sd-form-field` với các ô nhập khác) nhưng không khai `text-overflow`, nên
đo ra `clip`: tên chi nhánh dài bị **cắt ngang chữ**. Đã gắn thêm lớp của catalog
và chép rule.

**30. Tooltip nhiều dòng — `\n` bị nuốt.**

`sd-badge` của catalog dựng tooltip với `matTooltipClass="sd-multiline-tooltip"`
(`white-space: pre-line`), và chính script demo của catalog chỉ thêm lớp đó khi
`text.indexOf('\n') >= 0`. Kit để `white-space: normal` nên tooltip hai dòng dồn
thành một. Nay thêm lớp đúng điều kiện đó. Node tooltip cũng mang thêm tên
`.c-sd-tooltip-container` của catalog để CSS viết theo catalog khớp được.

**31. `sd-table` — ba khối rỗng, không phải một.**

Catalog có ba `<template data-empty="…">` với **ba ảnh và ba câu chữ khác nhau**:

| Trạng thái | Ảnh | Chữ |
|---|---|---|
| `data` | `sd-image-data-empty` | "Chưa có dữ liệu" |
| `filter` | `sd-image-filter-empty` | "Không có kết quả phù hợp" + "Vui lòng tìm kiếm hoặc lọc theo tiêu chí khác" |
| `required` | `sd-image-filter-required` | "Vui lòng chọn bộ lọc để bắt đầu" |

Kit dùng **chung một** minh hoạ và tự viết câu chữ khác ("Không tìm thấy dữ liệu
phù hợp với bộ lọc"), không có dòng gợi ý. Ba SVG trích nguyên văn từ
`content:url(...)` của catalog, lưu thành file trong `core/assets/` theo Rule 12.
Chữ cũng sửa theo: 16px/24px (`T16R`/`T16M`) thay cho 14px/20px, trạng thái
`filter` có tiêu đề đậm 500 + dòng gợi ý màu phụ.

Trạng thái `required` **không tự suy ra được**: catalog chỉ có nút bật/tắt trong
trang demo, bảng API không khai tên input nào. Kit đặt tên riêng `filterRequired`
và ghi vào `known-gaps.md` chứ không đoán tên của thư viện.

**32. `sd-splitter` — đổi sang bộ tên và cấu trúc của catalog.**

Catalog: `<sd-splitter class="sd-splitter sd-splitter--horizontal">` chứa
`<sd-splitter-panel class="sd-splitter__panel">` và **thẻ riêng**
`<sd-splitter-handle class="sd-splitter__handle sd-splitter__handle--horizontal">`
bọc `<span class="sd-splitter__handle-bar">`. Kit dùng `div.sd-splitter__gutter`
với thanh vẽ bằng `::before` và hướng đọc từ `data-orientation`. Đã dựng đúng
cấu trúc catalog (giữ thêm lớp `sd-splitter__gutter` cho trang cũ), kèm
`--disabled`, `--dragging`, `__panel--collapsed`.

Bẫy trong lúc sửa: `_applyOrientation()` chạy **trước** `_rebuildGutters()`, nên
thanh vừa dựng không được nó quét tới — đo ra thanh `0×0`, con trỏ `auto`. Phải
đặt lớp hướng ngay lúc tạo thanh **và** quét lại sau khi dựng xong.

**33. `sd-query-bar` — thiếu vạch ngăn, phần còn lại khớp.**

Soát riêng vì Builder hỏi cả **pattern**. Thanh chính của kit dùng đúng bộ tên
catalog (`.c-chip`, `.c-chip-label`, `.c-chip-sep`, `.c-chip-value`,
`.c-chip-remove`, `.c-logic-toggle`, `.c-clear-all`, `.c-saved-filters`,
`.c-search-trigger`, `.c-divider`, `.c-query-bar__main` / `__actions`) — khớp.
Thiếu đúng một thứ: `<span class="c-bar-divider">` (1px, cao tối thiểu 28px,
`#e2e4e7`) ngăn giữa vùng chip và vùng hành động. Đã thêm.

Nhóm `.c-token*`, `.c-seamless*`, `.c-bool-*`, `.c-op-*` còn thiếu thuộc về
**popover sửa chip** và **query-builder** — đó là cấu trúc Angular CDK mà kit
dựng khác, đã ghi trong bảng "Chưa xong" từ trước, không phải thanh chính.

**34. Công cụ đo còn ba vùng mù nữa — và cả ba là do chính nó tự lọc.**

Vòng 5 mở bộ lọc selector từ `.c-…` sang cả `.sd-…`. Vòng này soi lại chính
`cssdiff.py` xem nó còn giấu gì:

| Dòng code | Lý do lúc viết | Thứ bị mất |
|---|---|---|
| `if prop.startswith('--'): continue` | "biến thì so giá trị cuối là đủ" | **Toàn bộ 108 token `--sd-*`** |
| bỏ khối `@media` ở **cả hai** phía | "tránh rule mobile đè giá trị gốc" | Mọi rule đáp ứng và `prefers-reduced-motion` |
| chỉ quét rule thường | (không ai nghĩ tới) | Mọi `@keyframes` |

Viết ba script riêng (`cat/tokdiff2.py`, `cat/mediadiff.py`, `cat/keydiff.py`)
để soi từng vùng.

**35. `--sd-stepper-completed-color` — kit chiếm tên của catalog với nghĩa NGƯỢC LẠI.**

Catalog có **một** token cho mỗi trạng thái vòng tròn, và nó là **màu nền**; màu
ký hiệu bên trong viết cứng:

```
.mat-step-icon-selected   { background: var(--sd-stepper-active-bg);       color:#fff!important }
.mat-step-icon-state-done { background: var(--sd-stepper-completed-color); color:#fff!important }
.mat-step-icon-state-error{ background: var(--sd-stepper-error-color);     color:#fff!important }
```

Kit đẻ thêm bốn token (`--sd-stepper-completed-bg`, `-active-contrast`,
`-error-bg`, `-error-contrast`) và dùng `--sd-stepper-completed-color` làm
**màu chữ** (`#fff`). Nhìn thì y hệt — chỉ lòi ra khi ai đó đọc tài liệu catalog
rồi đặt `--sd-stepper-completed-color: red` và nhận được **chữ đỏ** thay vì vòng
tròn đỏ. Đã bỏ bốn token tự đẻ và trả tên về đúng nghĩa.

Kèm theo đó một lỗi nữa cùng chỗ: `_applyAppearance()` **luôn** ghi bộ token này
thành inline style trên host, kể cả khi trang không khai `color`. Catalog khai
chúng trong CSS của component nên trang vẫn đè được; kit ghi inline thì mỗi lần
vẽ lại là xoá mất giá trị trang đặt. Nay chỉ ghi khi có `color`.

**36. `--sd-tab-close-hover-color` — lại đúng cái bẫy `--sd-color-*`.**

Catalog: `var(--sd-color-error, #d32f2f)`. Portal **không khai** `--sd-color-error`
(cùng họ với `--sd-color-primary` của sd-splitter), nên giá trị thật là
**#d32f2f**, không phải `--sd-error` (#f82c13) của theme. Dựng lại CSS catalog
trong trình duyệt rồi rê chuột: `rgb(211, 47, 47)`. Kit đang dùng `--sd-error`.

Nhân thể kiểm luôn cả bộ `--sd-tab-*`: chúng đều viết `var(--sd-color-*, …)` nên
mặc định của component là **xanh #1565c0**. Nhưng mọi ví dụ trong catalog đều có
inline style `--sd-tab-indicator-color: var(--sd-primary)` … đè sang nâu. Đo
trên trang catalog dựng lại: `rgb(174,113,41)` — tức **kit đang đúng**, chỉ riêng
`close-hover-color` là không bị đè nên phải theo #d32f2f. Khác hẳn sd-splitter,
nơi catalog KHÔNG đè nên giá trị xanh xám mới là thật.

**37. `prefers-reduced-motion` — catalog khai cho ba component, kit chỉ có một.**

```
#c-inform .c-inform .c-inform-close{transition:none}
#c-side-drawer .sd-side-drawer,.sd-side-drawer-backdrop{transition:none}
#c-notify toast, toast.sd-toast--closing{animation:none}
```

Kit chỉ tắt vòng xoay của `sd-button`. Chỗ side-drawer đáng kể nhất vì vòng 5
vừa thêm `transition: all .3s ease-in-out` cho tấm trượt và nền mờ.

Một bẫy nhỏ khi sửa: đặt cả ba vào một khối `@media` ở ĐẦU file thì không ăn —
rule gốc nằm sau, cùng độ ưu tiên nên thắng. Phải đặt khối giảm-chuyển-động
**ngay sau** phần của từng component, đúng cách catalog làm.

**38. `sd-section` — thiếu hẳn vùng `[sdHeaderLeft]`.**

Bảng API catalog khai `[sdHeaderLeft]` và `[sdHeaderRight]`; ví dụ dùng
`<div class="d-flex align-items-center gap-8" sdHeaderRight>`. Kit chỉ nhận
`slot="header-right"` và **không có vùng header-left nào** — trang viết theo
catalog thì nội dung rơi thẳng vào thân. Nay nhận cả hai tên (cùng cách đã làm
với `sd-side-drawer` ở vòng 5), và `[sdHeaderLeft]` nối vào cuối vùng trái, sau
icon và cụm title/subTitle.

**39. `sd-table` — `option` khai trong `observedAttributes` nhưng CHƯA BAO GIỜ được đọc.**

Catalog chỉ có **một** input: `<sd-table [option]="option">` với `SdTableOption`
gồm `type · items · selector · commands · filter · paginate · reload · export ·
config`. Kit tách thành attribute phẳng (`selectable`, `paginated`,
`reload-visible`…) và có để `'option'` trong danh sách theo dõi — nhưng không
dòng nào đọc nó. Trang viết đúng theo catalog thì **không có tác dụng gì**.

Nay đọc `option` (property JS hoặc attribute JSON) và ánh xạ các khoá catalog ghi
rõ trong ví dụ của nó: `selector.visible` → cột chọn dòng, `paginate.pageSize/pages`
→ phân trang, `reload/export/config.visible` → ba nút. Attribute phẳng khai tay
vẫn thắng. `items` dạng hàm (chế độ server) và `filter.externalFilters` không
mirror — đã ghi vào `known-gaps.md` kèm lý do.

**40. Đếm ngoặc cân bằng không chứng minh CSS đúng cấu trúc.**

Chèn khối `@media` sau `@keyframes sd-toast-leave` bằng cách tìm dấu `}` thứ hai
— nhưng keyframes có ngoặc LỒNG nên khối media rơi **vào trong** keyframes. Số
`{` và `}` vẫn cân bằng tuyệt đối. Chỉ lộ ra khi đo trong trình duyệt. Đã viết
`cat/cssvalid.py` đi từng ký tự để bắt loại lỗi này.

**41. Soát lại nhóm "kit đã dựng nhưng bên trong chưa đủ" — hai mục tôi đã kết luận VỘI.**

Builder yêu cầu sửa đúng nhóm này. Rà lại từng mục, tách "thật sự không dựng
được" khỏi "tôi kết luận vội":

| Mục | Kết luận cũ | Đúng ra |
|---|---|---|
| `option.items` dạng hàm (sd-table) | "prototype tĩnh không gọi API" | **Sai lý do.** Kit không gọi API nào — nó gọi lại hàm TRANG đưa vào, y như Angular. Dựng được |
| Lớp `sd-bare` (sd-select) | "không rõ bare bỏ đi những gì" | **Có đủ bằng chứng**: markup + CSS trong `#c-query-bar` cho thấy `sd-bare` + `sd-viewed` = bỏ nhãn và khung xem tĩnh, chỉ còn `.sd-inline-view` bấm được |
| `mode="inline"` của sd-query-bar | (chưa soát) | Catalog có **BA** hình chip, kit chỉ có một |
| Tìm chữ / chuyển trang / zoom của sd-preview-pdf | cần pdf.js | **Giữ nguyên kết luận** — nhưng xem mục 44 |

**42. `sd-query-bar` `mode="inline"` — catalog có BA hình chip, kit chỉ có MỘT.**

Catalog chọn hình chip theo **kiểu field**, không dùng một hình chung:

| Kiểu field | Hình | Cấu trúc |
|---|---|---|
| `string` · `number` | `.c-seamless` — **chip CHÍNH LÀ ô nhập** | `__label` (icon + `__field` + `__sep`) · `__input` > `sd-inline-text` > `input.sd-inline-text__input` · `button.__x` |
| `values` · `lazy-values` | `.c-token` + **tóm tắt chỉ-đọc** | `.c-token-value-edit` > `.sd-inline-view` > `.c-token-multi-head` + "+N"; bấm vào mới mở bảng chọn |
| `boolean` | `.c-token.c-token-building` | `.c-bool-toggle` gồm `.c-bool-btn.c-bool-true` / `.c-bool-false` |

Kit dựng `.qb-inline` + `.qb-inline-value` + `.qb-inline-remove` cho mọi loại, và
với field nhiều lựa chọn thì **đổ nguyên danh sách checkbox lên thanh** — chip cao
**96px** thay vì 30px. Đã dựng lại đủ ba hình.

Đo đối chiếu 18 selector giữa trang catalog dựng lại và kit: **18/18 khớp tuyệt
đối** trên mọi thuộc tính đo (cao, cỡ chữ, đậm, màu, nền, đệm, bo, gap, viền).

Hai chỗ phải tự tay bù vì cấu trúc khác:
- Catalog bọc `.sd-inline-view` trong `<sd-select class="sd-bare sd-viewed">` làm
  vỏ chiếu nội dung. `sd-select` của kit là component **sống** — nó tự vẽ lại
  `innerHTML` nên lớp con bị xoá sạch. Kit phát thẳng `.sd-inline-view`.
- Vì bỏ thẻ vỏ đó nên mất luôn `line-height: 1` mà catalog đặt trên nó → ô cao
  17px thay vì 15px. Đã chuyển `line-height` sang `.c-token-value-edit`.

**43. `sd-select.sd-bare` — dựng được, gỡ khỏi known-gaps.**

Markup catalog: `<sd-select size="sm" class="sd-bare sd-viewed"><span
class="sd-inline-view" role="button" tabindex="0"><sd-view>…</sd-view></span></sd-select>`.
Tức `sd-bare` + chế độ xem = **bỏ nhãn và khung xem tĩnh**, chỉ còn một ô chữ
bấm được. Đã dựng trong `SdSelect._render`.

**44. `sd-preview-pdf` — vẫn không dựng, và lần này KIỂM CHỨNG được là không kiểm chứng được.**

Ý định ban đầu của tôi vòng này: nối nút chuyển trang / zoom / vừa trang bằng
**PDF Open Parameters** (`#page=`, `#zoom=`, `#view=FitH`) trên chính iframe —
kit đã dùng `#page=` cho `startPage` nên cơ chế có sẵn.

Dựng một PDF 12 trang rồi đổi fragment và chụp màn hình: **PDF viewer của
Chromium headless không vẽ ra ảnh chụp** — vùng tài liệu đen trơn ở cả 5 lần
chụp. Tức tôi **không có cách nào xác nhận** nút có thật sự chuyển trang hay
không. Nối rồi nói "chạy được" thì đúng là đoán.

→ Giữ nguyên trạng thái `disabled` + tooltip "cần pdf.js", và ghi vào
`known-gaps.md` **cả lý do không kiểm chứng được**, chứ không chỉ lý do kỹ thuật.

**45. Một lỗi có sẵn của `sd-query-bar` lộ ra khi viết test.**

`_bind()` khai `var self = this;` **bên trong** nhánh `if (!this._bound)`, nhưng
dùng `self` ở nhánh `if (!this._docBound)` phía sau. `var` theo phạm vi HÀM nên
`self` vẫn tồn tại — giá trị `undefined`. Khi nhánh đầu bị bỏ qua mà nhánh sau
thì không, listener trên `document` ném
`Cannot read properties of undefined (reading '_onDocClick')`. Đã đưa `var self`
lên đầu hàm. Đây là lần thứ ba cùng một kiểu lỗi `self` trong file này.

## 46. `sd-label` — DỰNG MỚI (catalog `#c-label`)

Catalog: *"Nhãn của trường nhập liệu: tên trường, dấu * bắt buộc, icon gợi ý kèm
tooltip và dòng mô tả phụ. Không render gì khi `label` rỗng."*
Input: `label`, `required`, `description`, `helperText`.

Khối `<style>` của `#c-label` **không có một luật nào của component** — chỉ có CSS
bày trang demo (`.lb-box`, `.stage`, `.lb-tall`, `.lb-tipwrap`) và hai `@keyframes`.
Toàn bộ hình thức đến từ utility class trong markup. Cây DOM chép nguyên:

```
<sd-label>
  <div class="mb-0 d-flex">
    <div style="display:flex;align-items:center;gap:4px">
      <span class="T14M">{label}</span>
      <mat-icon …>info_outline</mat-icon>      ← khi có helperText
    </div>
    <span class="text-error mb-2 T14M">*</span>  ← khi required
  </div>
  <div class="text-black400 T12R">{description}</div>
</sd-label>
```

Hai chỗ kit đổi, đều có lý do:

- Catalog ghi `style="display:flex;align-items:center;gap:4px"` trên div trong.
  Kit dùng `class="d-flex align-items-center gap-4"` — ba utility này đã có sẵn và
  khai đúng ba dòng đó (Rule 11 của AGENTS.md cấm inline style cho layout).
- `.mb-2` của catalog là **2px**; `utilities.css` của kit đã khai `.mb-2` = 8px và
  14 trang preview đang dùng theo nghĩa 8px. Đổi toàn cục sẽ vỡ 14 trang → thu hẹp
  phạm vi về `sd-label .mb-2 { margin-bottom: 2px }`.

## 47. `sd-view` — DỰNG MỚI (catalog `#c-view`)

Catalog: *"Hiển thị chỉ đọc một cặp nhãn/giá trị… Đây là đường render chung cho
mọi form control ở chế độ xem (`[viewed]="true"`); STYLE-GUIDE yêu cầu dùng nó
thay vì tự dựng cặp label/value trên màn DETAIL."*

Khối `<style>` của `#c-view` **tự ghi**: *"sd-view không có styles riêng: chỉ dùng
utility của sd-core + reboot cho `<a>`"*. Đúng hai luật:

```
sd-view a       { color:#007bff; text-decoration:none; background-color:transparent }
sd-view a:hover { text-decoration:underline }
```

Không thêm `display:block` hay bất kỳ luật nào khác.

- `display` rỗng / thiếu → `--` (catalog ghi là `EMPTY_STR` của `@sdcorejs/utils`,
  gói không có trong bundle, *"trang hiển thị `--` theo quy ước lib"*).
- `label` rỗng → **bỏ hẳn** dòng nhãn.
- `hyperlink` → `<a href>` **trần**: không bọc div, không mang class `T14M`.
- `target="_blank"`: trong DOM catalog **không có** attribute này (đếm `target=`
  trong cả section = 0) vì trang catalog là bản dựng tĩnh. Nhưng mô tả biến thể ghi
  rõ *"link nội bộ đi qua Router, link http mở tab mới"* → kit theo câu mô tả.
- `#sdLabel` / `#sdValue` là `ng-template` của Angular. Web component không có cơ
  chế đó, kit nhận hai đường: con mang attribute `[sdValue]`/`[sdLabel]`, hoặc —
  nếu không đánh dấu gì — coi **toàn bộ nội dung có sẵn** là `#sdValue`. Đường thứ
  hai là thứ giữ cho `sd-query-bar` không vỡ: chip token của nó phát
  `<sd-view><span class="c-token-multi-head">…</span></sd-view>` không kèm attribute.

Dựng `sd-view` cũng **mở khoá `hyperlink`**, trước đây ghi known-gaps là "chỉ có
tên, không có ví dụ" cho `sd-radio` — ví dụ nằm ở `#c-view`.

## 48. `sd-inline-text` — DỰNG MỚI (catalog `#c-inline-text`)

Catalog: *"Ô nhập không viền, co giãn theo nội dung qua thuộc tính `size` (tối
thiểu `minSize`). Là primitive dùng chung cho `sd-input` / `sd-input-number` khi
`viewed='inline'` và cho chip của query-bar / query-builder."*

Hành vi **không phải suy đoán**: trang catalog kèm sẵn script điều khiển của chính
nó, chép nguyên văn vào chú thích trong `sd-components.js`:

```js
var min = +(host.getAttribute('data-min') || 2);
host.setAttribute('data-state', forced || (focused ? 'focus' : (el.value ? 'active' : 'pending')));
el.size = Math.max(min, el.value ? el.value.length : el.placeholder.length);
if (clr) clr.hidden = !el.value;
```

→ `minSize` mặc định **2**; `size` = max(minSize, dài value, hoặc dài placeholder
khi chưa có value); bốn trạng thái; nút xoá ẩn khi chưa có giá trị và — ở chrome
`standalone` — chỉ hiện khi hover/focus.

CSS chuyển từ khối cũ (`sd-query-bar sd-inline-text …`, phạm vi hẹp) thành component
dùng chung, bỏ tiền tố `#c-inline-text`, giải `var(--sd-text-secondary, #6b7280)`
thành `#6b7280` (portal không khai biến này — bẫy `--sd-color-*` đã ghi ở
`_memory/lessons.md`).

**Markup trang tự viết thì component KHÔNG đụng vào.** `sd-query-bar` tự phát đủ
`<input class="sd-inline-text__input">` bên trong chip seamless và tự lo sự kiện +
`size` riêng (`max(7, min(28, len+1))`); vẽ đè sẽ xoá mất `data-qb-role` và làm
hỏng cả thanh lọc. Đây cũng đúng cách catalog bày `#c-inline-text`: markup tĩnh +
script điều khiển tách rời.

## 49. `sd-autocomplete` — DỰNG MỚI (catalog `#c-autocomplete`)

Catalog: *"Ô nhập có gợi ý (`mat-autocomplete`): lọc danh sách tĩnh theo
`displayField` hoặc gọi hàm tìm kiếm phía server; giá trị đã chọn hiển thị như
placeholder đậm, có nút xoá."*

Khối CSS dài 169 dòng nhưng ~150 dòng đầu là nguyên bộ `mat-form-field` outlined —
đúng thứ kit đã dựng lại bằng `.sd-form-field` (mục 14, 15). Chỉ chép phần RIÊNG.
Bốn điểm nhận dạng, lấy thẳng từ markup:

1. Giá trị đã chọn nằm ở **placeholder** (`input.c-selected` + nhãn luôn nổi
   `mat-mdc-form-field-label-always-float`), **không** nằm ở `value`; `input.c-selected::placeholder{color:#000;opacity:1}`.
2. Nút xoá **thay chỗ** icon `search` — catalog ghi
   `data-replace="<mat-icon …>search</mat-icon>"` ngay trên nút.
3. Panel option `min-height:36px !important`, `padding:8px 12px !important`,
   chữ 14px — khác `mat-option` mặc định 48px.
4. `viewed` → `<sd-view>`; `viewed="inline"` → `.sd-bare` + `.sd-inline-view` +
   `.sd-inline-clear` (nút xoá hiện khi hover).

`items` nhận **mảng tĩnh hoặc hàm**; catalog ghi
`searchBanks = (text) => this.api.searchBanks(text)`. Kit nhận cả hai, hàm trả
Promise thì vẽ lại khi Promise xong (có token chống kết quả cũ về sau).

## 50. `sd-date-range` — DỰNG MỚI (catalog `#c-date-range`)

Catalog: *"Ô chọn khoảng ngày 'Từ – đến' (`mat-date-range-input` +
`mat-date-range-picker`), giá trị `{ from, to }`, có nút xoá, min/max, bắt buộc và
chế độ xem dạng 'từ → đến'."*

Bảng đổi tên lớp (kit dựng khung bằng `.sd-form-field`, không bằng
`.mat-mdc-text-field-wrapper` — y như sd-input/sd-select đã làm từ trước):

| Catalog | Kit |
|---|---|
| `mat-date-range-input` | `.sd-range-input` |
| `.mat-date-range-input-container` | `.sd-range-input__container` |
| `.mat-date-range-input-wrapper` | `.sd-range-input__wrapper` |
| `.mat-date-range-input-end-wrapper` | `.sd-range-input__wrapper--end` |
| `.mat-date-range-input-inner` | `.sd-range-input__inner` |
| `.mat-date-range-input-mirror` | `.sd-range-input__mirror` |
| `.mat-date-range-input-separator` | `.sd-range-input__separator` |

Ba chi tiết lấy thẳng từ markup, không suy luận:

- Dấu ngăn là **EN DASH `–` (U+2013)**, không phải `-`; cả hai ô trống thì nó mang
  `-separator-hidden` (`opacity:0`, vẫn chiếm chỗ).
- Đuôi ô: rỗng chỉ có `today`; **có giá trị thì `cancel` đứng TRƯỚC `today`**.
  (sd-date dùng `close`; date-range dùng `cancel` — đã đối chiếu từng ví dụ.)
- Nền dải giữa khoảng: `.mat-calendar-body-in-range::before{background:color-mix(in srgb, #ae7129 20%, transparent)}`
  — `#ae7129` chính là `--sd-primary`.

Lịch dùng lại `.form-field-datepicker` của kit, thêm ba trạng thái khoảng
(`sd-range-start` / `sd-range-in` / `sd-range-end`). `padding-top:12px` mà catalog
đặt lên `mat-date-range-input` thì **bỏ**: nó để chừa chỗ cho nhãn nổi bên trong
khung Material vốn không có padding dọc, còn khung của kit căn giữa bằng
`align-items:center` nên 12px đó đẩy chữ lệch xuống. Ghi ở `known-gaps.md`.

## 51. PHÁT HIỆN CHƯA XỬ LÝ — lịch của catalog dùng locale enUS, lịch của kit dùng tiếng Việt

Bắt được khi dựng `sd-date-range`. Catalog ghi ở cuối mục `#c-date-range`:
*"Lịch dùng locale enUS (component tự provide), nên tiêu đề tháng và thứ bằng
tiếng Anh như app thật."* Kiểm lại markup **cả `#c-date`, `#c-chip-calendar` và
`#c-date-range`**: hàng `<th>` đều là `Sunday S · Monday M · Tuesday T · …`, tức
**tuần bắt đầu từ Chủ nhật** và nhãn bằng tiếng Anh.

Kit thì ngược lại ở **cả ba** component: `SD_DATE_MONTHS_VI` (`Tháng 1`…),
`SD_DT_WEEKDAYS_VI`, và hàng thứ `T2 T3 T4 T5 T6 T7 CN` — **tuần bắt đầu từ Thứ
hai** (`startDow = (firstDay.getDay() + 6) % 7`).

Lệch này **chưa sửa trong lượt 2026-10-11** và `sd-date-range` dựng theo bản tiếng
Việt của kit để ba cái lịch trong cùng một app không khác nhau. Lý do dừng lại:
đổi sang enUS là đổi **hành vi nhìn thấy được** của ba component đã dựng, cho một
hệ back-office mà người dùng là nhân viên vận hành người Việt — AGENTS.md dặn
*"Chỗ nào hai nguồn mâu thuẫn mà không quyết được thì hỏi Builder, đừng đoán."*
Đã ghi vào `_memory/known-gaps.md`; **chờ Builder quyết**.

## 52. `sd-quick-action` — DỰNG MỚI (catalog `#c-quick-action`)

Catalog: *"Thanh công cụ nổi ở giữa đáy màn hình (cách đáy 90px), hiện khi
`opened` = true; thường dùng cho thao tác hàng loạt sau khi chọn nhiều dòng. Nội
dung chiếu qua `[sdMessage]` và `[sdAction]`."* API đúng ba mục.

CSS chép nguyên văn khối `.c-quick-action` — lấy bản trong **bundle `#c-tree`**
chứ không lấy bản của trang demo `#c-quick-action`: trang demo đổi
`position:fixed` thành `absolute` để nhốt thanh trong khung ảnh và **tự ghi chú
điều đó** (*"Thanh dùng `position:fixed` trong app; ở đây là `absolute` trong
khung"*). Bản thật là `fixed; bottom:90px`.

Markup:

```
<sd-quick-action>
  <div class="c-quick-action d-flex align-items-center [active]">
    <div class="c-quick-action-message T14R"> …[sdMessage]… </div>
    <div class="c-quick-action-action">     …[sdAction]…  </div>
  </div>
</sd-quick-action>
```

`[sdAction]` rỗng thì CSS tự lo, không cần JS:
`.c-quick-action-action:empty{display:none}` +
`.c-quick-action:has(.c-quick-action-action:empty){gap:0;padding-right:16px}`.

Component **không tự thêm padding** cho phần thông điệp — catalog ghi rõ: *"chỉ
`gap:16px`, và `padding-right:16px` khi không có hành động, nên ví dụ tự thêm
`px-16` / `p-8`"*. Kit giữ đúng vậy; trang tự đặt padding bằng utility.

## 53. `sd-tree` — DỰNG MỚI (catalog `#c-tree`)

Catalog: *"Cây phân cấp dạng danh sách phẳng thụt lề theo cấp: hỗ trợ dữ liệu
tĩnh hoặc tải lười (lazy), chọn nhiều bằng checkbox kèm thanh thao tác nhanh,
menu lệnh trên từng dòng, lọc theo từ khoá (`filter()`) và template dòng tuỳ
biến."*

**Điểm dễ dựng sai nhất — cây là DANH SÁCH PHẲNG.** Không `<ul>` lồng `<ul>`,
không thẻ bọc nhánh. Mỗi dòng là một `div.sd-tree__row` **anh em**, thụt lề bằng
biến `--sd-tree-level`, dòng nằm dưới nhánh đóng thì mang attribute `hidden`. Đã
đếm từng dòng trong DOM catalog để chắc: 10 dòng, cùng một cấp DOM, `data-id` +
`data-parent` nằm trên dòng.

Dòng:

```
<div role="treeitem" class="sd-tree__row" style="--sd-tree-level:N"
     data-id data-parent [aria-expanded] [aria-selected] [hidden]>
  <div class="sd-tree__main">
    <button class="sd-tree__toggle[ --placeholder]">…</button>
    [<sd-checkbox class="sd-tree__checkbox">]
    [<icon class="sd-tree__item-icon">]
    <div class="sd-tree__content"><span class="sd-tree__label">…</span></div>
  </div>
  [<button class="sd-tree__command-trigger">more_vert</button> + menu]
</div>
```

Bốn chi tiết lấy thẳng từ markup:

- Nhánh **mở** icon `folder_open`, **đóng** icon `folder`; mũi tên `expand_more`
  / `chevron_right`. **Lá KHÔNG có icon** trừ khi item tự khai `icon`.
- Lá vẫn render nút mũi tên, nhưng `--placeholder` (`visibility:hidden`) +
  `disabled` — giữ chỗ để nhãn các dòng cùng cấp thẳng hàng.
- `aria-label` của nút nguyên văn tiếng Anh: `Expand tree item` /
  `Collapse tree item` (catalog để vậy, không dịch).
- Lazy: nhánh **chưa tải** vẫn hiện mũi tên; **đang tải** thì nút `disabled` và
  chứa vòng xoay 16px.

### 53b. ⚠ Checkbox của `sd-tree` là INDIGO `#3f51b5`, không phải nâu `--sd-primary`

Catalog ghi nguyên văn ở cuối mục: *"Checkbox hiện màu accent indigo (`#3f51b5`)
của theme M2 trong portal: `sd-tree` chỉ đặt biến cũ `--mdc-checkbox-*`,
Material 20 không đọc các biến này."*

Tức là `sd-tree` khai `--mdc-checkbox-selected-icon-color: var(--sd-primary)`
nhưng Material 20 đọc `--mat-checkbox-selected-icon-color`, mà theme portal đặt
biến đó bằng `#3f51b5`. **Kết quả thật trên màn là indigo** — khác hẳn
`sd-checkbox` thường của kit (nâu primary). Kit mirror **kết quả thật**, và ghi
vào `_memory/known-gaps.md` để Builder quyết có giữ hay sửa. Đây nhiều khả năng
là lỗi còn sót của thư viện, nhưng sửa nó là **cố ý lệch catalog**, nên không tự
quyết.

### 53c. `tree.defaultExpanded` — KHÔNG dựng, vì một ví dụ không đủ

Ví dụ cây tĩnh viết `tree: { loadType: 'static', defaultExpanded: 2 }`. Cách hiểu
hiển nhiên — *"mở sẵn mọi nhánh tới cấp 2"* — **không khớp DOM của chính ví dụ
đó**:

| Dòng | Cấp | `aria-expanded` |
|---|---|---|
| `tc` Khối Tài chính | 0 | **true** |
| `nv` Phòng Nguồn vốn | 1 | **true** |
| `kt` Phòng Kế toán | 1 | **false** |
| `nh` Ngân hàng đối tác | 0 | **false** |

`kt` cùng cấp với `nv` mà đóng; `nh` cùng cấp với `tc` mà cũng đóng. Còn lại ít
nhất ba cách hiểu vừa khít một ví dụ đó (mở N nhánh đầu theo thứ tự duyệt sâu /
mở nhánh đầu tiên đi sâu N cấp / chính dữ liệu `units` khai `expanded: true` trên
hai item — kiểu item mà catalog ghi là
`{ id, label, icon?, data, expanded?, children? }` **có** trường `expanded`).
Chọn cái nào cũng là đoán, nên kit **chỉ dựng `expanded: true` trên từng item** —
thứ duy nhất xác định được — và ghi `defaultExpanded` vào known-gaps.

### 53d. Menu lệnh

Catalog dựng menu bằng overlay CDK (`.mat-mdc-menu-panel.sd-tree__command-menu`),
kit dựng lớp nổi riêng — cùng kiểu đã ghi cho popover của `sd-query-bar`. Nhưng
**tên lớp và số đo bên trong giữ đúng catalog**: `.sd-tree__command-menu-item`
`min-height:40px; padding:0 12px`, `.sd-tree__command-menu-content` `gap:6px`,
`.sd-tree__command-menu-icon` 16px màu `--sd-black400`. Nút ⋮ 24px,
`opacity:0` → `1` khi rê chuột vào dòng hoặc khi menu đang mở.

## 54. `sd-history` — DỰNG MỚI (catalog `#c-history`)

Catalog: *"Dòng thời gian dọc hiển thị lịch sử thao tác: mỗi mục là một thẻ gồm
tiêu đề, trạng thái (sd-badge), thời điểm, người thực hiện, nguồn và mô tả (tối
đa 2 dòng)."*

CSS chép nguyên văn (đường dọc `#94b0ff` rộng 2px ở `left:8px`, chấm 12px tròn ở
`left:-16px; top:12px`, thẻ bo 6px bóng `0 2px 4px #0000001a`, mô tả
`-webkit-line-clamp: 2`). Trạng thái render bằng `sd-badge` **kiểu icon** — kit
đã có sẵn nhánh đó nên chỉ việc phát thẻ.

Chi tiết dễ bỏ sót: **mục thiếu trường vẫn render thẻ bọc RỖNG**
(`<span class="status">`, `<span class="date">`, `<div class="meta">` trống) —
đã kiểm trên ví dụ "Hệ thống" của catalog. Giữ đúng vậy thì bố cục không nhảy.

`min-width: 470px` là của catalog: trên màn hẹp component sẽ cuộn ngang, chính
catalog ghi chú điều đó.

## 55. `sd-input-color` — DỰNG MỚI (catalog `#c-input-color`)

Catalog: *"Ô nhập mã màu HEX (**bọc `sd-input`**) kèm ô màu xem trước; bấm ô màu
mở bảng chọn màu native của trình duyệt. Tự kiểm tra định dạng `#RGB` /
`#RRGGBB` / `#RRGGBBAA`."*

"Bọc `sd-input`" không phải cách nói cho gọn — markup catalog bên trong
`<sd-input-color>` đúng là một `<sd-input>` đầy đủ, phần riêng chỉ là cụm suffix
`.sd-input-color__suffix` (nút ô màu 22px + `<input type="color">` ẩn). Kit dựng
y vậy nên thừa hưởng toàn bộ nhãn nổi / lỗi / `viewed` / `clearable` của
`sd-input` mà không chép lại dòng CSS nào.

Ô màu rỗng **hoặc mã sai** đều hiện ô caro (`--swatch--empty`, bốn
`linear-gradient` 8px). Thông báo lỗi cố định trong component:
*"Mã màu HEX không hợp lệ (vd #1565C0)"* — catalog ghi "patternErrorMessage cố
định trong component".

## 56. Bốn directive — DỰNG MỚI (`#c-href`, `#c-hover-copy`, `#c-scroll`, `#c-device`)

Angular có directive, Web Component không. Kit dựng lại bằng **attribute + xử lý
uỷ quyền trên `document`**, giữ NGUYÊN tên attribute của catalog để markup chép
từ catalog chạy được ngay.

| Catalog | Kit |
|---|---|
| `a[sdHref]` | `a[sdHref]` — link `http(s)` mở tab mới (`window.open(url,'_blank')`), link nội bộ điều hướng thường (kit không có Angular Router). `sdHref` rỗng → không làm gì (catalog: *"rỗng thì `javascript:;`"*) |
| `[sdHoverCopy]` + `[sdHoverCopyDisabled]` | Chèn nút sao chép vào phần tử; `Disabled` thì nút **bị gỡ khỏi DOM**, không chỉ ẩn — đúng câu catalog |
| `[sdScroll]` | CSS thuần: `overflow-y:auto`, `overflow-x:hidden` → `auto` khi `:hover`, `translate3d(0,0,0)`. Hàm `scrollTop()` mở ra thành `window.sdScrollTop(el)` |
| `*sdDesktop` / `*sdMobile` | Gỡ phần tử KHÔNG thuộc loại thiết bị hiện tại khỏi DOM (directive cấu trúc, không phải ẩn). Kiểm tra **một lần** lúc khởi tạo — catalog ghi rõ "không theo dõi khi đổi kích thước cửa sổ" |

Hai chỗ đổi theo Rule của AGENTS.md: nút sao chép của catalog dùng **inline SVG**
và **inline style** → kit dùng `<span class="material-icons-outlined">content_copy</span>`
14px (Rule 4) và class `.sd-hover-copy-btn` / `.sd-hover-copy-tip` (Rule 11),
giá trị tính ra giống hệt.

## 57. `sd-input` — nút xoá dựng lại theo catalog (đây là lỗ hổng NHÓM 2, không phải dựng mới)

Bắt được khi đọc markup `#c-input-color`. Bản trước của kit phát
`<span class="material-icons-outlined sd-input-clear">` nằm **tuyệt đối** ở mép
phải ô và **luôn hiện** khi có giá trị. Catalog (`#c-input` 11 lần, `#c-input-color`)
thì phát:

```html
<button type="button" class="sd-clear-btn sd-hover" title="Xóa" aria-label="Xóa">
  <mat-icon …>close</mat-icon>
</button>
```

với `.sd-clear-btn{width:20px;height:20px;border-radius:50%;color:#757575}`,
`:hover{background:rgba(0,0,0,.06);color:var(--sd-error)}`, và
`.sd-clear-btn.sd-hover{visibility:hidden}` chỉ hiện khi
`.mat-mdc-form-field-flex:hover` hoặc `:focus-within`. Đã đổi cả markup lẫn CSS;
lớp khai ở tầng dùng chung vì `sd-autocomplete` cũng dùng đúng lớp này.

## 58. Chế độ `viewed` của TOÀN BỘ form control đi qua `<sd-view>` (lỗ hổng NHÓM 2)

Cũng bắt được từ markup `#c-input-color`. Catalog gọi `sd-view` là *"đường render
chung cho mọi form control ở chế độ xem"*, và markup xác nhận ở cả
`#c-input-color`, `#c-autocomplete`, `#c-date-range`:

```html
<sd-x class="sd-has-label sd-viewed">
  <sd-view>
    <div class="T14R text-black400">{label}</div>
    <div class="T14M">{display}</div>
  </sd-view>
</sd-x>
```

Kit **từng bỏ thẻ `<sd-view>` đi** — CHANGELOG cũ ghi "bỏ thẻ `<sd-view>` chết" —
vì hồi đó `sd-view` chưa phải component, chỉ là thẻ trống không làm gì. Dựng
`sd-view` ngày 2026-10-11 làm lý do đó hết hiệu lực.

Đã đổi **11 chỗ** trong `sd-components.js` sang hàm dùng chung `sdViewHtml()`.
Ba thứ đi kèm:

- Bỏ hẳn `.sd-view-mode` / `.sd-view-label` / `.sd-view-value` — **catalog không
  có ba lớp này ở bất kỳ đâu**. Kèm theo là bỏ `gap:2px` giữa nhãn và giá trị và
  bỏ `color:var(--sd-black500)` trên giá trị (catalog để giá trị thừa hưởng màu
  chữ của trang).
- Giá trị rỗng ra `--` (EMPTY_STR của `@sdcorejs/utils`, qua `sd-view`) thay vì
  `—` (em dash) mà kit tự chọn trước đây.
- Nhãn rỗng thì `sd-view` tự bỏ dòng nhãn — trước kia mỗi component tự lo.

Sáu file test phải đổi selector theo (`.sd-view-value` → `sd-view .T14M`…).

## 59. `bpm-kpi-card` và `bpm-filter-scorecard` — DỰNG MỚI (catalog `#c-kpi-card`, `#c-filter-scorecard`)

Hai thẻ của màn **Trung tâm công việc**. Không thuộc `@sd-angular/core` —
component của **lib-bpm** (commit 68dfd6e), nên giữ tiền tố `bpm-`.

**`bpm-kpi-card`** (DS-COMP-022) — icon primary + nhãn + con số. Catalog ghi rõ
*"Hiển thị tĩnh, không bấm/hover; `value = 0` vẫn render bình thường"* — nên code
không được dùng `value || ''`, phải phân biệt `0` với rỗng. Hàng thẻ chỉ là flex
row `gap:16px`, catalog ghi *"không có component bọc"*, nên kit cũng không dựng
thẻ bọc.

**`bpm-filter-scorecard`** (DS-COMP-023) — thẻ đếm bấm được. Ba điểm lấy thẳng
từ markup/CSS:

- Là **`<button>` thật** có `aria-pressed`, không phải `div` bắt click.
- Icon lọc `filter_alt` nằm ở ô 20px góc trên phải, `opacity:0` mặc định; hiện
  khi hover, và ở thẻ **active** thì luôn hiện với nền `--sd-primary` chữ trắng.
- `key` đi vào `data-testid="work-center-filter-card-{key}"` + `data-key`.

Quy tắc **"tối đa MỘT thẻ active" do TRANG CHA giữ** — catalog ghi trong ví dụ
`component.ts` (`activeCard.update(cur => cur === key ? null : key)`). Kit bắn
`sd-filter-toggle` kèm `{ key, active }` (trạng thái TRƯỚC khi bấm) và **không**
tự bỏ chọn thẻ khác; trang preview làm đúng vòng đó để minh hoạ.

## 60. `sd-org-chart` — DỰNG MỚI (catalog `#c-org-chart`)

Catalog: *"Sơ đồ tổ chức dạng cây từ trên xuống, vẽ **hoàn toàn bằng CSS** (danh
sách lồng nhau và đường nối giả lập)."*

**Đối lập hoàn toàn với `sd-tree`** — và đây là chỗ dễ dựng sai nhất nếu vừa làm
xong `sd-tree`:

| | `sd-tree` | `sd-org-chart` |
|---|---|---|
| Cấu trúc DOM | danh sách **PHẲNG**, mọi dòng là anh em | `<ul>` **LỒNG** trong `<ul>` thật |
| Thụt lề / đường nối | biến `--sd-tree-level` | `:before`/`:after` của từng `<li>` |
| Vì sao khác | chỉ cần thụt lề | đường nối cần quan hệ cha–con **thật** trong DOM |

Đường nối dựng bằng ba mảnh, chép nguyên văn:

- `:before` / `:after` của `<li>` con = **nửa trái / nửa phải** đường ngang nối
  các anh em. Con **đầu** tắt nửa trái, con **cuối** tắt nửa phải → đường không
  thò ra ngoài hai bên.
- `:only-child` tắt cả hai và giảm `padding-top` còn nửa `--sd-org-gap-y`.
- `:before` của `.sd-org-chart__node-shell` = đường **dọc** từ cha xuống; node
  gốc tắt nó đi.

Ba biến thể thẻ suy ra TỪ MARKUP, không đoán: có `image` → thẻ đầy đủ
(min-height 110px); không `image` → `--no-image` (78px); không `image` **và**
không `description` → thêm `--compact` (74×40). `color` ra
`style="--sd-org-node-color: …"` trên thẻ, và viền tự trộn theo
`color-mix(… 36% …)`.

**CHƯA DỰNG:** `[itemTemplate]` / `sdOrgChartItemDef` — `ng-template` của Angular.

## 61. `sd-operator` — DỰNG MỚI (catalog `#c-operator`)

Catalog: *"Nút chọn toán tử so sánh cho bộ lọc (bằng, lớn hơn, chứa, trong
khoảng…): nút icon mở `mat-menu` liệt kê các toán tử được phép **theo đúng thứ
tự truyền vào**. Được `sd-query-bar` dùng khi dựng điều kiện lọc."*

17 toán tử + nhãn tiếng Việt (`VI_MESSAGES`) + **icon SVG** đều trích nguyên văn
từ markup catalog:

`EQUAL` · `NOT_EQUAL` · `GREATER_THAN` · `LESS_THAN` · `GREATER_OR_EQUAL` ·
`LESS_OR_EQUAL` · `BETWEEN` · `CONTAIN` · `NOT_CONTAIN` · `START_WITH` ·
`NOT_START_WITH` · `END_WITH` · `NOT_END_WITH` · `IN` · `NOT_IN` · `NULL` ·
`NOT_NULL`.

Icon ở đây là **glyph riêng của component** (hai gạch ngang = bằng, mũi tên hai
đầu = trong khoảng…), không phải icon chọn theo tên như Material — nên giữ SVG
đúng catalog, cùng ngoại lệ đã áp cho dấu tích của `sd-checkbox`. Tất cả dùng
chung một bộ thuộc tính: `viewBox="0 0 24 24" width/height=20 fill=none
stroke=currentColor stroke-width=2 stroke-linecap/linejoin=round`.

Chưa chọn gì → icon **cái phễu** (`M4 5h16l-6.5 7.5V19l-3 2v-8.5z`), không có
`title`. Đã chọn → icon của toán tử và `title` là nhãn đã dịch.

Menu: catalog dùng overlay CDK; kit dựng lớp nổi riêng (cùng kiểu đã ghi cho
`sd-tree`, `sd-query-bar`) nhưng giữ đúng tên lớp `.c-op-menu` / `.c-op-row` /
`.c-op-label` / `.c-op-code` và số đo (dòng `min-height:48px`, `padding:0 16px`,
cột mã 11px monospace `#7a7a7a` — `--sd-text-muted` không có trong bộ token nên
giá trị thật là fallback). Thêm `position:relative` trên host vì menu của kit là
**con** của host.

## 62. `sd-modal-resizable` — DỰNG MỚI (catalog `#c-modal-resizable`)

Catalog: *"Panel nổi neo ở góc phải dưới màn hình (kiểu cửa sổ soạn thư), **gắn
vào `<body>`**: thu nhỏ còn thanh tiêu đề, phóng toàn màn hình, đóng; **nhiều
panel tự xếp hàng ngang**. Nội dung chiếu qua `[sdTitle]`, `[sdBody]`,
`[sdFooter]`."*

Ba trạng thái = ba lớp, số đo đọc thẳng từ `style=` trong markup catalog:

| Trạng thái | Lớp | `style` |
|---|---|---|
| Đang mở | `.modal-resizable--active` | `width:480px; right:0px` |
| Thu nhỏ | `+ .c-minium` | `width:300px; right:0px` |
| Toàn màn hình | `+ .c-fullscreen` | `width:calc(100% - 16px); right:8px` |

"Tự xếp hàng ngang": mỗi panel đặt `right` = tổng bề ngang các panel bên phải nó
cộng 8px mỗi khoảng; panel ngoài cùng `right:0`. Kit dựng lại đúng vòng đó trong
`SdModalResizable._layout()`.

Hai điểm phải xử lý vì kit là Web Component chứ không phải Angular:

- Thẻ host để `display:contents` và **panel thật được chuyển sang `<body>`** lúc
  dựng — đúng câu "gắn vào `<body>`". Để trong `.content-zone` thì
  `position:absolute` sẽ neo nhầm vào khung cha.
- Sau khi chụp ba slot phải **dọn sạch `innerHTML` của host**. `display:contents`
  không ẩn nội dung còn sót, nên nó hiện thẳng trên trang phía sau panel — đã
  thấy thật khi chụp preview.

### 62b. ⚠ Chữ trên thanh tiêu đề là chữ TỐI trên nền xám, dù lớp tên là `--white`

Nút hành động mang lớp `.c-action--white`, nhưng **bundle CSS mà catalog chụp
không có luật nào tô trắng** cho nó hay cho `.modal-resizable__title`. Dựng lại
nguyên văn CSS catalog rồi đo trong trình duyệt: chữ ra `#212529` (thừa hưởng
của trang) trên nền header `#5d6165`.

Đây là **cùng loại với màu checkbox indigo của `sd-tree`**: tên lớp nói một
đằng, CSS thật làm một nẻo. Kit mirror kết quả thật (không khai `color`) và ghi
`_memory/known-gaps.md` chờ Builder quyết.

## 63. `sd-import-excel` — DỰNG MỚI (catalog `#c-import-excel`)

Catalog: *"Modal nhập dữ liệu từ file Excel: tải tệp mẫu, đọc file người dùng
chọn, kiểm tra từng ô theo cấu hình cột (bắt buộc, số, ngày, danh sách giá trị,
độ dài…) rồi hiển thị bảng xem trước với trạng thái hợp lệ / cảnh báo / lỗi
trước khi xác nhận lưu."*

Khung modal dùng lại `sd-modal` của kit (kit đã mirror `.sd-modal-root` /
`.sd-modal-close-btn` từ `#c-modal`), nên chỉ chép phần riêng: bảng xem trước,
khung nét đứt "chưa có dữ liệu", thanh đếm, chân bảng.

**Thanh đếm** (`.mb-12`) — bốn nút, lấy thẳng từ script của catalog:

| Nút | type/color | icon | tooltip |
|---|---|---|---|
| Xem tất cả | `outline` `secondary` | `cached` | — |
| *n* hợp lệ | `light` `success` | `done` | "Số dòng dữ liệu hợp lệ" |
| *n* cảnh báo | `light` `warning` | `warning` | **"Số dòng dữ liệu có lỗi"** |
| *n* lỗi | `light` `error` | `error` | **"Số dòng dữ liệu có cảnh báo"** |

⚠ Hai tooltip cuối **catalog ghi ngược nhau**. Kit chép nguyên văn và ghi
known-gaps — sửa là lệch catalog.

**Bảng**: có dữ liệu thì chèn thêm cột **"Trạng thái"** (250px) ngay sau cột `#`.
Mỗi dòng mang `data-status="SUCCESS|WARNING|ERROR"`; ô `#` là
`sd-badge type="tag"` tô theo trạng thái, nội dung là số thứ tự. Ô có lỗi tô nền
`--sd-error-light` kèm tooltip là câu lỗi của ô; dòng cảnh báo tô
`--sd-warning-light`. Cột `type:'array'` hiện **"N {unitString}"** chứ không liệt
kê giá trị.

Nút **"Xác nhận & Lưu"** chỉ bật khi `(success || warning) && !error` — đúng điều
kiện trong script catalog. Nút **"Tải về"** chỉ xuất hiện khi đã có dữ liệu.

**Ba chỗ kit phải xử lý thêm:**

1. **Thu hẹp phạm vi CSS.** Catalog khai `.sd-table`, `.table-responsive`,
   `.empty-state-wrapper`, `.c-sticky-left`, `.c-ellipsis` ở mức toàn cục trong
   section của nó. `.sd-table` là tên quá chung — kit đã có **thẻ** `<sd-table>`
   riêng — nên bó tất cả dưới `sd-import-excel`.
2. **Utility xung đột thang đo.** Kit đã có `.mr-2` = `var(--space-2)` = **8px**
   và `.px-4` = **16px**; catalog khai `.mr-2` = **2px**, `.px-4` = **4px**. Lặp
   lại đúng bẫy `.mb-2` của `sd-label` → khai đè trong phạm vi component. Mấy
   lớp kit chưa có (`bg-error-light`, `text-wrap`, `mb-12`, `border-0`…) cũng
   khai ở đó cho gọn.
3. **`sd-modal` của kit chỉ dựng DOM khi `open()`.** Mỗi lần `_render()` mà modal
   đang mở thì phải mở lại, không thì bảng biến mất giữa chừng. Và lọc theo
   trạng thái chỉ bật/tắt `hidden` từng dòng, KHÔNG dựng lại modal.

**CHƯA DỰNG:** đọc file Excel thật (cần thư viện ngoài; kit là prototype tĩnh).
Kit mở `setData(rows)` để trang nạp thẳng dữ liệu đã đọc, và `setValidation()`
đúng như catalog (server trả lỗi từng dòng sau khi accept).

## 64. `sd-autoid-inspector` — DỰNG MỚI (catalog `#c-autoid-inspector`)

**Mục cuối của nhóm A.** Công cụ dev/QA: nút tròn 36px cố định góc phải dưới,
mở panel ba tab **Audit / Elements / Export**. Quét toàn trang tìm thẻ `sd-*`
thiếu hoặc trùng `data-autoid`, tô viền thẳng lên DOM, liệt kê element kèm state
chip, xuất JSON / CSV / Markdown.

**Chép nguyên văn từ catalog:** toàn bộ khối CSS `#c-autoid-inspector` (98 rule),
chỉ đổi tiền tố `#c-autoid-inspector ` → `sd-autoid-inspector ` và `mat-icon` →
`.material-icons-outlined`. Markup bốn biến thể (FAB đóng · Audit · Elements ·
Export) dựng đúng cây thẻ catalog in ra, kể cả `data-segment`,
`data-highlight-on`, `data-element-count`, `data-missing-count`,
`data-duplicate-count` trên panel và `data-autoid="sd-autoid-inspector-fab"` /
`"sd-autoid-inspector-panel"`. Chuỗi inline style service gắn lên element được
chép y nguyên, kể cả fallback `rgba(76, 175, 80, 0.12)` dù kit có token thật.

**API catalog → kit**

| Catalog | Kit |
|---|---|
| `[enabled]` | attribute `enabled` / property `.enabled`; `false` thì không dựng gì |
| `[config]` | attribute `config` (chuỗi JSON) hoặc property `.config` |
| `SD_AUTOID_INSPECTOR_CONFIGURATION` (token DI) | biến toàn cục cùng tên `window.SD_AUTOID_INSPECTOR_CONFIGURATION`, độ ưu tiên THẤP HƠN `[config]` của thẻ |
| `config.requireSelectors` | mảng selector; khai thì chỉ các thẻ khớp mới bị đòi autoid |
| `config.host` | có host mới hiện khối "Tạo E2E test" — đúng nhãn biến thể Export của catalog |

**Bốn chỗ phải quyết vì catalog không nói**

1. **Mặc định của `requireSelectors`.** Catalog không nêu. Kit chọn: không khai
   thì đòi autoid ở MỌI thẻ `sd-*` quét được.
2. **`data-autoid` nằm ở đâu.** Thư viện thật gắn lên HOST bằng
   `@HostBinding('attr.data-autoId')`. Kit thì tuỳ component: nhóm gọi
   `sdSyncAutoId` (sd-table, sd-modal, sd-tree, sd-view…) gắn lên host, còn
   sd-button / sd-select / sd-checkbox / sd-radio gắn xuống phần tử BÊN TRONG.
   Inspector vì thế dò thêm một cấp — nhưng **chỉ nhận phần tử không phải `sd-*`**,
   không thì `sd-section` bọc ngoài sẽ "mượn" autoid của `sd-table` bên trong.
3. **"Top-level" tính theo gì.** Catalog chạy trên trang giả lập không có thẻ bọc.
   Trang kit nào cũng bọc trong `sd-section`, nên nếu lấy "tổ tiên `sd-*` gần nhất
   là null" thì bảng Top-level RỖNG. Kit đổi thành: tổ tiên `sd-*` gần nhất mà
   CHÍNH NÓ có autoid — thẻ bọc không autoid là trong suốt.
4. **Bộ chip state.** Mẫu catalog cho `sd-date` không có chip `disabled=` còn
   `sd-select`/`sd-input-number` thì có; catalog không nêu quy tắc nào sinh ra
   khác biệt đó. Kit dùng một bộ chung cho mọi ô nhập
   (`disabled` · `empty` · `required?` · `invalid?` · `error:?`). Quy tắc màu thì
   suy đúng từ mẫu: `required=true` → `is-warning`, `invalid`/`error:` →
   `is-error`, mọi true/số còn lại → `is-info`, false → chip thường.

**KHÔNG DỰNG (catalog tự ghi hoặc không có markup mẫu)**

- Dialog "Ngữ cảnh QC cho Robot Framework": chính ghi chú cuối mục catalog ghi
  **"không dựng"**. CSS `__context-*` + `@media(max-width:560px)` đi kèm cũng
  không chép — có CSS mà không có markup thì theo luật "không được tự đoán".
- `__success-card` và `__empty`: có CSS, không có markup mẫu. Trạng thái 0 lỗi
  của tab Audit chỉ còn ba ô thống kê.
- Hai nút Playwright / Robot Framework chỉ dựng giao diện; sinh file `.zip` cần
  host generator ngoài. Bấm vào thì hiện `__export-message.is-error` — markup và
  CSS vẫn là của catalog, chỉ câu chữ là của kit.

**Một bẫy mới ghi được:** `sd-select` giữ **id** ở `.value` ("vcb") còn chữ đang
hiện ("Vietcombank") nằm ở ô `.sd-trigger-text`. Catalog in ra chữ đang hiện, nên
inspector đọc ô trước rồi mới tới `.value`. Cùng nhóm: ô bật/tắt
(checkbox/switch/radio) có `.value` của `<input>` ruột luôn là `"on"` — phải đọc
`checked`.

**Ghim bằng test trình duyệt thật:** `test-batch6.mjs` — **88 PASS**.

---

## 65–67. Nhóm B đợt 1 — `sd-ckeditor-styles`, `sd-code-editor`, `sd-mini-editor`

**Nhóm B là gì.** Catalog tự ghi trong ghi chú cuối mỗi mục: *"Mock tĩnh, không
nạp CKEditor"*, *"vùng soạn thảo gõ được; nút toolbar không hoạt động"*. Mức
mirror khả thi cho kit **chính là mức catalog đang có**: đúng CSS, đúng markup,
gõ được, nút toolbar để trơ. Dựng quá mức đó là tự đoán thư viện.

### 65. `sd-ckeditor-styles` (`#c-ckeditor-styles`) — component KHÔNG có giao diện

Catalog: *"Component không render gì (template rỗng, `ViewEncapsulation.None`)
chỉ để nạp một lần stylesheet global của CKEditor 5 vào `<head>` khi editor đầu
tiên được mount."*

Kit giữ đúng cơ chế: thẻ `<sd-ckeditor-styles>` chèn **một** `<link>` tới
`design-system/core/styles/sd-ckeditor-styles.css` vào `<head>`, một lần cho cả
trang (kiểm bằng `id`). `sd-mini-editor` tự nhúng thẻ này ở đầu template, đúng
như `sd-editor` / `sd-mini-editor` / `sd-document-builder` của thư viện thật.

Nội dung tệp: **134 rule**, lấy nguyên văn từ khối chú thích *"sd-ckeditor-styles
(CKEditor 5 global CSS + override của sd) — chỉ giữ rule dùng tới"* của mục
`#c-mini-editor`. Đổi duy nhất: bỏ tiền tố `#c-mini-editor ` (cách catalog giả
lập phạm vi global) và `#c-mini-editor{--ck-…}` thành `:root{--ck-…}` — đúng chỗ
tệp thật khai các biến này. Tệp thật ~148 KB; catalog chỉ in phần dùng tới, nên
kit cũng chỉ có phần đó (ghi ở known-gaps).

**Vì sao KHÔNG nhét vào `sd-tokens.css`:** làm thế thì trang nào cũng có sẵn 60
biến `--ck-*` và vài chục rule `.ck-*`, và mất luôn hành vi quan sát được của
component (không có thẻ thì không có style). Tách tệp giữ đúng cả hai.

### 66. `sd-code-editor` (`#c-code-editor`)

Khung xem/sửa code kiểu cửa sổ macOS tối. Chép nguyên văn 35 rule CSS của
catalog, bỏ tiền tố và đổi `mat-icon` → `.material-icons-outlined`.

Markup đủ ba biến thể: `.sd-code-wrapper` (+ `is-editable` khi sửa được) · ba
chấm macOS · `.lang-badge` với nhãn phụ mang **nguyên văn inline style**
`opacity: 0.6; margin-left: 4px; font-weight: normal;` và chữ `(EDITING)` /
`(READ ONLY)` · nút copy `content_copy`/`Copy` → `check`/`Copied` (title đổi
`Copy code` → `Đã copy!`) · `textarea.code-textarea` chữ trong suốt chồng lên
`pre.code-display` tô màu, caret trắng.

**Tô màu cú pháp.** Catalog ghi rõ *"Không nạp PrismJS: token màu được tách sẵn
theo lớp `.token.*` của Prism (gần đúng ngữ pháp thật)"*. Kit cũng không thêm
phụ thuộc (AGENTS.md), nên viết bộ tách tối giản sinh **đúng hình dạng DOM**
catalog in ra:

| Ngôn ngữ | Token kit sinh ra |
|---|---|
| `json` | `property` (khoá) · `operator` (`:`) · `string` · `number` · `boolean` · `keyword` (`null`) · `punctuation` |
| `typescript` | `keyword` · `class-name` · `builtin` · `comment` · `function` · `number` · `operator` (`=>`) · `punctuation` (kể cả `:`) |
| `markup` (html) | `tag` bọc ngoài, trong có `punctuation` (`<`) · `attr-name` · `attr-value` bọc `attr-equals` + `punctuation` (`"`) |
| `css` / `scss` | `selector` ngoài ngoặc · `property` · `variable` (`$x`) · `number` · `atrule` · `comment` |

`language="html"` ra lớp `language-markup` — đúng tên Prism đặt. `css`/`scss`
catalog **không có ví dụ**, bảng màu `.token.*` thì có đủ, nên kit tách ở mức
selector/property/value; ghi ở known-gaps.

`language="json"` + model là object: tự `JSON.stringify(…, null, 2)`; gõ JSON hợp
lệ thì `sd-change` trả lại **object**, gõ hỏng thì trả **string** — đúng câu
catalog ghi ở khối code.

**Bẫy đã tránh:** gõ thì CHỈ vẽ lại `<code>` phía dưới, không vẽ lại cả cây —
cùng họ bẫy `innerHTML` đã ghi cho `sd-inline-text`.

### 67. `sd-mini-editor` (`#c-mini-editor`)

Dựng đúng cây DOM ClassicEditor v48 mà catalog in ra: `<ckeditor class="sd-mini-editor">`
→ `.ck.ck-reset.ck-editor` → `.ck-editor__top` → `.ck-sticky-panel__content` →
`.ck-toolbar` → `.ck-toolbar__items`, rồi `.ck-editor__main` →
`.ck-content.ck-editor__editable_inline[contenteditable]`.

Toolbar **đúng thứ tự cấu hình của component**: Bold · Italic · Underline |
Font Color (dropdown) | Bulleted List · Numbered List | Link. Tooltip giữ
**tiếng Anh** đúng catalog (*"component không đặt `language` cho CKEditor"*).

Năm biến thể catalog đều có: nội dung có định dạng · `option.placeholder`
(`<p class="ck-placeholder" data-placeholder>` + `<br data-cke-filler>`) ·
mention (chip `.ck-custom-mention` + panel `.ck-balloon-panel.ck-mentions`) ·
`option.maxHeight` (đặt biến `--sd-mini-editor-max-height`) · `disabled`
(`ck-read-only` + `contenteditable=false` + nút `ck-disabled`).

API dựng thêm: `.option`, `.content`, `getContent()`, `getMentions()`,
`insertMention()`, `showMentions()` / `hideMentions()`, sự kiện `sd-change` /
`sd-focus` / `sd-blur`.

**Ba chỗ lệch, đều ghi ở known-gaps**

1. **Icon**: catalog vẽ lại bằng `<svg class="ck ck-icon … ck-button__icon">`.
   Rule 4 của `AGENTS.md` bắt dùng `material-icons-outlined`, nên kit đổi sang
   tên icon Material tương đương — nhưng **giữ nguyên bộ lớp** catalog đặt trên
   `<svg>`, kể cả `ck-button__icon`, không thì rule làm mờ icon lúc `ck-disabled`
   không khớp.
2. **Panel mention**: CKEditor thật gắn `.ck-body-wrapper` vào `body` cạnh con
   trỏ; catalog cũng chỉ đặt tuyệt đối trong khung demo. Kit đặt làm **con** của
   host — cùng kiểu lệch đã ghi cho sd-operator / sd-tree / sd-autocomplete.
3. **`option.outputFormat: 'markdown'`**: catalog chỉ nêu tên tuỳ chọn, không in
   ra chuỗi markdown nào. Kit đổi những thẻ có tương đương một-một
   (`strong`/`em`/`a`/`p`/`ul`/`ol`/`li`/mention), phần còn lại giữ HTML.

**Một quirk của catalog mirror đúng:** `sd-mini-editor .ck-editor__editable_inline`
khai `border: var(--ck-focus-ring)` (giải ra `1px solid #ccced1`), nhưng viền
thật **trong suốt** vì rule nền `.ck.ck-editor__editable_inline{border:1px solid #0000}`
hơn điểm (2 lớp so với 1 lớp + 1 thẻ). Tương quan điểm này y hệt trong catalog
nên catalog cũng không có viền — cùng loại với nhãn bước của `sd-stepper`.

**Ghim bằng test trình duyệt thật:** `test-batch7.mjs` — **90 PASS**.

---

## 68. `sd-editor` — DỰNG MỚI (catalog `#c-editor`)

Trình soạn thảo rich-text gắn với form. Cùng nhóm B với `sd-mini-editor`: catalog
tự ghi *"Mock tĩnh, không nạp CKEditor… Vùng soạn thảo gõ được, bộ đếm ở biến
thể 2 chạy thật; nút toolbar và dropdown cỡ chữ/màu chữ không hoạt động."*

**Chép nguyên văn:** 17 rule CSS của khối "sd-editor (styles component)" + 3 rule
`mat-error`, bỏ tiền tố `#c-editor `. Cây DOM đủ năm biến thể, kể cả
`data-disabled` / `data-empty` trên `.sd-editor` và `--sd-editor-content-min-height`
/ `--sd-editor-content-max-height` ở `style`.

**Toolbar đúng cấu hình catalog in ra:** Bold · Italic · Underline | Font Size ·
Font Color | Align left · center · right · Justify | Bulleted · Numbered, cộng
nút **Upload image** chỉ khi cấu hình có `upload` (catalog: *"nút upload ảnh khi
có cấu hình upload"*). Tooltip giữ tiếng Anh đúng catalog.

**API catalog → kit**

| Catalog | Kit |
|---|---|
| `[(model)]` | property `.model` + sự kiện `sd-change` |
| `label` · `helperText` · `required` | đẩy thẳng qua `<sd-label>` đã dựng từ trước |
| `placeholder` · `[maxlength]` · `height` · `maxHeight` · `readonly` · `disabled` | attribute cùng tên |
| `hideInlineError` · `inlineError` | attribute cùng tên |
| `[validator]` | property `.validator = fn(model) => câu lỗi` |
| `[form]` · `key` | `key` giữ nguyên; `[form]` là FormGroup của Angular, không mirror được (ghi known-gaps) |
| `[option]` + `SD_EDITOR_CONFIGURATION` | `.option` của thẻ **thắng** `window.SD_EDITOR_CONFIGURATION` |
| `(sdChange)` · `(sdBlur)` · `(sdFocus)` | `sd-change` · `sd-blur` · `sd-focus` |

**Bộ đếm ký tự chạy thật:** đếm **chữ thật** (bỏ thẻ), vượt `maxlength` thì thêm
`sd-editor-counter--over` và cả khung (editable + toolbar + hàng đếm) chuyển đỏ,
kèm `mat-error` nguyên văn *"Số ký tự tối đa: 500"*. Gõ thì chỉ cập nhật bộ đếm
tại chỗ, không vẽ lại cây.

**`hideInlineError`:** lỗi hiện bằng `<span class="material-icons-outlined sd-error-icon">error</span>`
ở góc dưới phải thay cho `mat-error`. Catalog không đặt `title` lên icon nhưng
ghi chú cuối mục nói tooltip của nó "chỉ hiện bằng `title`" — nên kit đặt câu lỗi
vào `title`.

**Một quirk của catalog mirror đúng:** rule `.sd-editor--readonly sd-editor .ck-editor__editable{background:#0000000a}`
**không bao giờ khớp** (`.sd-editor` là CON của `sd-editor`, không phải tổ tiên),
nên chế độ chỉ đọc **không có nền xám**. Catalog ghi thẳng điều này trong ghi chú
cuối mục; kit giữ nguyên rule và giữ nguyên kết quả.

**Ghim bằng test trình duyệt thật:** `test-batch8.mjs` — **55 PASS**.

---

## 69. `sd-form-render` — DỰNG MỚI (catalog `#c-form-generic`)

Form động theo cấu hình JSON, lưới 12 cột theo `layout.columns`.

**Chỗ kit KHÁC catalog một cách cố ý — và đây là bản mirror ĐÚNG HƠN.** Catalog
dán DOM Angular Material đã render (`mat-form-field`, `mdc-notched-outline`,
`mat-radio-button`) vì trang catalog không chạy được Angular; ghi chú cuối mục
nói rõ đó là *"DOM đã render của sd-input, sd-input-number, sd-select, sd-date,
sd-textarea, sd-radio"*. Kit **có** các component đó chạy thật nên dựng thẳng
chúng. Khung ngoài thì chép nguyên văn: `.row.mx-0` · `lib-item` ·
`.col-{n}.px-8.py-8` · `lib-textfield`/`lib-select`/`lib-number`/`lib-datetime`/
`lib-radio`/`lib-textarea`/`lib-upload`/`lib-table`, tất cả `display: contents`.

**Ánh xạ kiểu → component**

| `type` | Kit dựng |
|---|---|
| `textfield` · `textarea` · `number` · `datetime` · `select` | `sd-input` · `sd-textarea` · `sd-input-number` · `sd-date` · `sd-select` |
| `radio` | `sd-label` + hàng `sd-radio` (kit: `sd-radio` là MỘT nút, không phải group) |
| `upload` | `sd-upload-file` |
| `group` | `sd-section` có `title` + `icon`, nằm NGOÀI `lib-item`, chiếm `col-12 mt-16` |
| `table` | bảng tĩnh `.fg-table` + nút "Thêm mới" — catalog ghi rõ *"bảng của lib-table là bảng tĩnh"* |
| `html` | nội dung HTML tĩnh |
| `break` · `checkbox` | **không dựng** — xem dưới |

**Chế độ xem `[viewed]`:** `sd-input`/`sd-select`/`sd-date`/`sd-textarea` đã tự
render qua `<sd-view>` từ đợt mục 58, khớp đúng catalog. Riêng `radio` và
`upload` thì **catalog tự mâu thuẫn** — nó render hai dòng chữ `T14R`/`T14M`
(radio) và `.text-secondary` + danh sách tệp (upload) thay vì `<sd-view>`. Kit
chép đúng chỗ mâu thuẫn đó, như đã làm với tooltip ngược của `sd-import-excel`.

**Biểu thức ẩn/bắt buộc/vô hiệu:** catalog nói "theo biểu thức FEEL" nhưng
**không in ra cú pháp nào**. Kit nhận `hidden` / `required` / `disabled` là
boolean **hoặc hàm** `(entity, setVariables) => boolean`, tính lại mỗi lần
`entity` đổi. Ghi ở known-gaps.

**Lưới:** catalog chỉ dùng `col-6` và `col-12`; `layout.columns` là lưới 12 cột
nên kit sinh đủ `col-1`..`col-12`, quy đổi `c.columns` theo tỉ lệ. Không khai thì
chiếm nửa lưới.

**KHÔNG DỰNG:** `break` (catalog nêu tên kiểu, không có ví dụ) · `checkbox`
(chính catalog ghi *"kiểu checkbox chỉ có trong builder — lib-item của
form-render không render nó"*) · side-drawer "Tạo mới/cập nhật" của `lib-table`
(catalog ghi "không mở") · `[form]` FormGroup của Angular.

**Ghim bằng test trình duyệt thật:** `test-batch9.mjs` — **46 PASS**.

---

## 70. `sd-query-builder` — DỰNG MỚI (catalog `#c-query-builder`)

Trình dựng bộ lọc trực quan: nhóm AND/OR lồng nhau, mỗi điều kiện là
**trường – toán tử – giá trị**, phát ra Filter chuẩn qua `[(value)]`.

**Chép nguyên văn:** đủ 56 rule `.qb-*` / `.c-op-*` của khối CSS catalog, bỏ
tiền tố `#c-query-builder `. Cây DOM đúng từng lớp: `.qb-container` →
`.qb-group.is-root` → `.qb-header` (`.qb-logic-switch` + `.qb-actions`) →
`.qb-body` → `.qb-treenode.is-rule` / `.is-group`, kể cả hai đường nối **nét
đứt** vẽ bằng `::before` / `::after` của `.qb-treenode`.

**KHÔNG chép** phần `mat-*` / `mdc-*` của khối CSS đó: đấy là giàn giáo Angular
Material mà trang catalog cần vì nó DÁN DOM đã render của `sd-select` /
`sd-input` / `sd-input-number`. Kit dựng thẳng ba component thật — cùng quyết
định đã ghi cho `sd-form-render` ở mục 69.

**Kit làm được NHIỀU HƠN catalog ở đúng chỗ này.** Ghi chú cuối mục catalog:
*"menu toán tử và panel của select không mở"*. Kit có `sd-operator` (mục 61) và
`sd-select` chạy thật, nên đổi trường / toán tử / giá trị đều hoạt động và
`[(value)]` cập nhật ngay. Đây là lần đầu trong cả đợt mirror mà kit vượt mức
catalog — và vượt bằng component đã dựng từ trước, không phải bịa thêm.

**Mô hình dữ liệu** (suy từ khối code catalog, trong đó có nguyên văn
`{ field: 'requestedAmount', operator: 'LESS_OR_EQUAL', dataType: 'field', data: 'remainingLimit' }`):

```
value  = { logic: 'AND'|'OR', filters: [rule | group] }
rule   = { field, operator, dataType?, data }     // dataType:'field' -> data là KEY trường
group  = { logic, filters: [...] }                // lồng được nhiều cấp
```

**API catalog → kit**

| Catalog | Kit |
|---|---|
| `[fields]` | property `.fields` hoặc attribute JSON |
| `[option]` | `.option` = `{ fields, comparisonMode, onValueChange }` |
| `mode="view"` | `mode` attribute |
| `comparisonMode="value-or-field"` | attribute hoặc `option.comparisonMode` |
| `[disabled]` · `autoId` | attribute cùng tên |
| `[(value)]` · `[(filters)]` · `[(rootLogic)]` | ba property, `value` là tổng của hai cái kia |

**`mode="view"` khớp ĐÚNG TỪNG CHỮ với catalog.** Chuỗi kit sinh ra:

> Ngân hàng cho vay in ('Vietcombank', 'BIDV') and Số tiền vay (VND) between
> 1000000000 and 5000000000 and Ngày giải ngân > 30 ngày trước and (Trạng thái
> hồ sơ = 'Chờ phê duyệt' or Hạn mức còn lại (VND) < 500000000)

đúng từng ký tự với `.qb-view` của catalog, kể cả lớp token (`qb-tok-field`,
`-op`, `-value`, `-logic`, `-paren`, `-plain`) và cách gói `IN` trong ngoặc
tròn, `BETWEEN` nối bằng `" and "`, ngày tương đối in `30 ngày trước`.

**Ba chỗ phải quyết vì catalog không nói**

1. **Toán tử ở `mode="view"`.** Catalog in ra đúng NĂM cái: `in` · `between` ·
   `>` · `=` · `<`. Mười hai mã còn lại kit dùng ký hiệu SQL thông dụng
   (`>=`, `<=`, `!=`, `not in`, `like`, `is null`…).
2. **Toán tử hợp lệ theo kiểu trường.** Catalog không nêu bảng; kit suy từ đúng
   các toán tử nó dùng cho từng kiểu rồi thêm các mã cùng họ. Khai
   `field.operators` thì ghi đè.
3. **Ô chế độ ngày.** Catalog chỉ in "Tương đối" và đơn vị "ngày trước"; kit
   thêm "Ngày cụ thể" và ba đơn vị còn lại (tuần/tháng/năm trước).

**Lệch có ghi:** ô chọn trường của catalog hiện **icon + nhãn** (`.qb-opt` +
`.qb-opt-icon`); `sd-select` của kit dựng ô hiện giá trị bằng `<input readonly>`
nên **chỉ hiện nhãn**. CSS `.qb-opt*` vẫn chép đủ.

**Ghim bằng test trình duyệt thật:** `test-batch10.mjs` — **65 PASS**.

---

## 71. `sd-document-builder` + `sd-header-footer-builder` — DỰNG MỚI (catalog `#c-document-builder`)

Trình soạn văn bản khổ A4 để dựng mẫu tờ trình/hợp đồng. Nhóm B, đúng mức
catalog tự ghi: *"Mock tĩnh, không nạp CKEditor… Vùng soạn thảo gõ được;
dropdown, chèn bảng/ảnh, xoay giấy không hoạt động."*

**Chép nguyên văn:** 32 rule "styles component" của hai thẻ. Trang A4 đo đúng —
rộng `210mm` (793.69px), cao tối thiểu `1123px`, lề `20mm` (75.59px), nền trắng
có đổ bóng, font **Times New Roman 13pt**. Toolbar đúng thứ tự cấu hình: nút
xoay giấy · Heading · Font Family · Font Size · Font Color · Font Background
Color · Bold/Italic/Underline/Subscript/Superscript · Text alignment ·
Bulleted/Numbered · Insert table · Upload image · Page break · Undo/Redo.

**Bổ sung `sd-ckeditor-styles.css` thêm 25 rule** (widget, bảng, ô lồng
`ck-editor__nested-editable`, dropdown Heading) — đúng điều đã ghi ở known-gaps
từ đợt 1: *"đủ cho sd-mini-editor; dựng sd-editor / sd-document-builder sau có
thể phải bổ sung"*.

**Ba trạng thái của `.variable-widget`** mirror đủ, theo `data-binding`:
`false` → chip xanh dương, `font-size: 0`, chữ hiện bằng `::before` lấy
`attr(data-display)`; `true` → nền xanh lá nhạt, gạch chân 2px `#4caf50`, hết bo
góc, hiện giá trị thật; `html` → khối nét đứt. Bình luận `.ck-comment-marker`
hai trạng thái `normal` (#3b82f6) / `pending` (#f59e0b).

**API dựng thật** (đều là thao tác DOM thuần nên kit làm được):
`setContent()` · `getContent()` · `setOrientation()` + `option.onOrientation` ·
`heading.all()` / `heading.scroll()` · `getVariablePluginAPI()` (all / insert /
bind) · `getCommentPluginAPI()` (all / setState) · `exportWord()`.

`sd-header-footer-builder`: toolbar rút gọn (Undo/Redo | Font Size/Color |
B/I/U | Text alignment | **Số trang hiện tại** · **Tổng số trang**) — hai nút
cuối giữ **tiếng Việt** đúng catalog (*"nút số trang lấy chuỗi VI_MESSAGES"*) và
chèn `[PAGE]` / `[TOTAL]` kèm inline style nguyên văn.

**Quirk của catalog mirror đúng (lần thứ tư):** component khai
`position: sticky` cho `.ck-editor__top`, nhưng rule nền
`.ck.ck-reset_all{…position:static}` (2 lớp) hơn điểm rule component (1 lớp +
1 thẻ), nên thanh công cụ **không dính**. Tương quan điểm y hệt trong catalog.

## 72. `sd-form-builder` — DỰNG MỚI (catalog `#c-form-builder`)

Trình thiết kế form của bộ Form Generic: ba cột palette / canvas / thuộc tính.

**Chép 118 rule** `.fb-*` + các `*-control` / `*-attribute` của catalog. Palette
đủ 4 nhóm × 13 component kèm tên icon; canvas bố cục theo dòng với lớp
`column-{n}`; ba chip trạng thái `conditional` / `readonly` / `hidden`; group có
header màu brand + đếm `N fields`; `fb-item.is-break` cho ngắt dòng; panel phải
có ba mục `<details>` mở sẵn (Thông tin chung · Hiển thị · Ràng buộc) và ba ô
biểu thức badge **FEEL**.

**Một chỗ đổi CSS:** lớp `.msi` khai font **Material Symbols Rounded** mà cả
portal lẫn kit đều không nạp — chính catalog ghi *"ở đây cho rơi về Symbols
Outlined; trên portal thật biểu tượng có thể hiện thành chữ"*. Kit đổi thẳng
sang `'Material Icons Outlined'` (Rule 4), tên icon giữ nguyên văn.

**Kit dựng thêm ba thứ catalog để tĩnh**, vì cả ba là DOM thuần và không đoán gì:

1. **Bấm item để chọn** → đổi `is-selected` và panel thuộc tính vẽ lại theo
   (tên, khoá, thẻ `<textfield-attribute>` / `<radio-attribute>`…).
2. **Đổi tab Thiết kế / Xem thử** → Xem thử render bằng chính `sd-form-render`
   đã dựng ở mục 69, nhận `formGeneric` làm `configuration`.
3. **Lọc palette** bằng ô tìm component (chỉ vẽ lại palette, không vẽ lại khung
   — giữ focus).

**KHÔNG dựng, đúng catalog:** kéo-thả CDK · bốn modal (Xem JSON, Cấu hình biến,
Cấu hình xác thực, trình dựng biểu thức FEEL — chỉ hiện ô "FEEL") · thuộc tính
của control `html` dùng CKEditor.

**Chip "Có điều kiện" bám ĐÚNG cờ `conditional`**, không suy từ biểu thức:
catalog có item vừa mang `disableExpression` trong panel vừa **không** có chip
trên canvas, nên suy từ biểu thức là sai.

**Ghim bằng test trình duyệt thật:** `test-batch11.mjs` — **64 PASS**.

**→ NHÓM B ĐÓNG HẾT.** Bốn mục còn lại đều không mirror nổi: nhóm C cần thư viện
ngoài (`c-chart` cần Chart.js, `c-tab-router` cần Angular Router), nhóm D không
có giao diện (`c-base`, `c-form-template-defs`).

## 73. Rà soát toàn kit, đợt cuối (2026-10-12) — 7 chỗ SỬA

Không dựng component mới; quét lại **từng selector** catalog ↔ kit.

| # | Chỗ | Catalog | Kit TRƯỚC | Kit SAU |
|---|---|---|---|---|
| 73.1 | `sd-datetime` popup | Một panel dọc 320px: `.picker-calendar` + `.picker-divider` + `.picker-time` (`sd-time-spinner` HH:MM, ▲▼) + `.picker-footer` | Hai cột, có tab Ngày/Giờ, mặt đồng hồ tròn (hình dạng npm 22.2.12) | Dựng lại đúng catalog |
| 73.2 | `sd-tab-group` — mặc định của 4 biến | Rule: literal `#1565c0` / `#e8f0ff`. **Nhưng mọi thẻ đều có style inline `var(--sd-primary)`** do input `color` ghi ra ⇒ màu hiện ra là NÂU | Rule để `var(--sd-primary)`; JS cũng ghi inline `var(--sd-primary)` | Rule đổi về literal catalog; JS giữ nguyên ⇒ **màu hiện ra không đổi** ("khai mà không ăn" ca thứ 6) |
| 73.3 | Tiện ích màu | 69 class `bg-`/`border-`/`text-`, class nào cũng `!important` | 9 class `.text-*`, không `!important` | Đủ 69 + 11 tiện ích khác (`border-top/bottom`, `text-center`, `align-middle`, `justify-content-end`, `m-0`, `mb-8`, `mb-16`, `py-12`, `px-0`, `px-3`, `T24M`) |
| 73.4 | `.T10R` | `line-height:12px` | 14px | 12px (`.T10M` chỉnh theo cặp) |
| 73.5 | `sd-splitter` host | `display:flex;width:100%;height:100%;overflow:hidden;box-sizing:border-box` | `display:block` | Theo catalog, giữ `min-height:0` |
| 73.6 | `sd-radio` nhóm dọc | class `c-radio-group-column` | chỉ `c-column` (tên riêng kit) | Phát cả hai + rule chép nguyên văn |
| 73.7 | `sd-modal-resizable` nút thu nhỏ | script đổi `c-min` ↔ `c-max`, title "Thu nhỏ" ↔ "Phóng to" | phát cứng `c-min` | Đổi theo trạng thái |

**Bẫy `--sd-color-*`, nói cho đủ.** Năm biến này **không được khai ở bất kỳ đâu** trong 2.7 MB của catalog: `--sd-color-primary`, `--sd-color-primary-light`, `--sd-color-error`, `--sd-text-primary`, `--sd-text-secondary`. Chúng chỉ xuất hiện bên trong các `var(…, fallback)`, nên trong CSS thì **fallback literal là giá trị thật**.

**Nhưng CSS chưa phải câu trả lời cuối.** Phải tìm nốt **style inline trong markup**:

- `sd-splitter`: không thẻ nào có style inline ⇒ màu thật đúng là `#b0bec5` / `#1976d2` (xanh xám / xanh dương). Chính ghi chú catalog cũng nói vậy.
- `sd-tab-group`: **mọi** thẻ đều mang `style="--sd-tab-indicator-color: var(--sd-primary); --sd-tab-label-active-color: var(--sd-primary); --sd-tab-badge-bg: var(--sd-primary-light); --sd-tab-badge-color: var(--sd-primary);"` do input `color` ghi ra ⇒ màu thật là **nâu**, literal `#1565c0` không bao giờ hiện. `--sd-tab-close-hover-color` thì **không** bị ghi đè inline nên `#d32f2f` vẫn là màu thật (đã sửa đúng từ 10-11).

Biến catalog CÓ khai là `--sd-primary: #ae7129` — chỉ một lần.

**238 class của catalog vắng mặt trong kit** đã được phân loại hết: 69 là tiện ích màu (nay đã dựng), 9 là popup `sd-datetime` (nay đã dựng), 2 là `c-radio-group-column` / `c-max` (nay đã dựng); số còn lại là nội thất Angular Material, style của trang trình bày, hoặc class không có markup mẫu — tất cả đã ghi lý do trong `_memory/known-gaps.md`, mục 2026-10-12.

---

### Chưa xong — xếp theo mức dễ thấy

| Component | Khác ở đâu | Độ nặng |
|---|---|---|
| `sd-query-bar` — popover/menu | Phần THANH đã xong (xem mục 9). Còn lại là popover sửa chip, menu chọn field và menu bộ lọc đã lưu: catalog dựng bằng `mat-menu` của Angular CDK (`.mat-mdc-menu-panel`), kit tự dựng lớp nổi riêng. Khác tầng hạ tầng, không chỉ khác CSS | Vừa |
| `sd-table` — thanh chọn hàng loạt | Catalog có `selector-action` (`.c-bg-length` khối màu chủ đề 48px mang số dòng đã chọn + `.c-message`). Kit dùng pattern `snackbar-batch` riêng. Khác cấu trúc, không chỉ khác CSS | Vừa |
| `sd-quick-action` | Component catalog có, kit chưa dựng (nằm trong danh sách 50 tag chưa dựng) | — |
| Nhóm form (`select`/`input`/`textarea`/`radio`) | Số đo khung chung đã khớp (mục 14, 15). Còn lại: catalog vẽ viền bằng ba mảnh `mdc-notched-outline` tuyệt đối và cắt một khe cho nhãn; kit dùng viền thật + nền trắng sau nhãn. Nhìn như nhau, cấu trúc khác | Nhẹ |
| `sd-modal`, `sd-side-drawer`, `sd-anchor`, `sd-tooltip` | **0 giá trị lệch** sau khi đổi token; phần "thiếu" đều là selector của Angular Material, không phải style component | — |
| `sd-input-number` — nút tăng/giảm | Catalog không có ví dụ nút spinner trong mục `c-input-number`; chưa đối chiếu được | — |

### Khác biệt vĩnh viễn, không đóng được

Catalog render bằng Angular Material nên có những thẻ kit không thể có:
`<mat-icon>` (kit dùng `<span class="material-icons*">`), `<mat-form-field>`,
`.mat-mdc-*`, lớp ripple. Phần **nhìn** thì mirror được, phần **tên thẻ** thì không.
Harness nào cũng sẽ còn lại đúng loại chênh này — đó là nền, không phải lỗi.
