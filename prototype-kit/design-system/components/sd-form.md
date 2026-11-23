# sd-* Form Components

*Group: Input fields + Upload — dùng trong trang Add / Edit.*

---

## DOM Material dùng chung — MỌI ô nhập (đồng bộ 2026-10-13)

Từ 2026-10-13, cả mười ô nhập — `sd-input`, `sd-input-number`, `sd-textarea`, `sd-select`,
`sd-autocomplete`, `sd-date`, `sd-datetime`, `sd-date-range`, `sd-chip`, `sd-chip-calendar` —
in **đúng cây `mat-form-field` của Core UI Catalog** (`@sd-angular/core` 19.0.10), không còn
khung `.sd-form-field` / `.sd-label` / `.sd-input` của kit. CSS là bản chép nguyên thứ tự
của từng mục catalog (`css/components/<tên>.css`, phạm vi theo tag), giữ đúng độ ưu tiên
tương đối của catalog.

```
<host>[.sd-has-label|.sd-viewed|.sd-bare]
└ div  (khung bọc — lớp tuỳ mục, xem bảng)
  └ mat-form-field.mat-mdc-form-field.sd-{md|sm}[.hide-inline-error] .mat-mdc-form-field-type-…
      .mat-form-field-appearance-outline[.mat-form-field-hide-placeholder] .mat-primary
      [.mat-mdc-form-field-has-icon-suffix][.mat-form-field-invalid|-disabled][.mat-focused]
    ├ .mat-mdc-text-field-wrapper.mdc-text-field.mdc-text-field--outlined[--no-label|--focused|--invalid|--disabled]
    │ └ .mat-mdc-form-field-flex
    │   ├ .mdc-notched-outline  leading · notch (label.mdc-floating-label > mat-label) · trailing
    │   ├ .mat-mdc-form-field-infix   ← ô điều khiển (bảng dưới)
    │   └ .mat-mdc-form-field-icon-suffix
    └ .mat-mdc-form-field-subscript-wrapper   ← hint rỗng | mat-error   (cao 20px)
```

| Ô | Khung bọc | Ô điều khiển trong infix | Đuôi |
|---|---|---|---|
| `sd-input` | `div.d-flex.align-items-center.sd-input-container[.c-focused\|.c-disabled]` > `.sd-input-field-wrap` (+ bộ đếm) | `input.mat-mdc-input-element` | lỗi · × · hậu tố / `.sd-input-action-icon` |
| `sd-input-number` | `div.d-flex.align-items-center[.c-focused\|.c-disabled]` | `input.mat-mdc-input-element` | lỗi · × · hậu tố |
| `sd-textarea` | `….sd-textarea-container` > `.sd-textarea-field-wrap[.sd-inline-textarea]` (+ bộ đếm) | `textarea.mat-mdc-form-field-textarea-control` | icon lỗi |
| `sd-select` | `div.d-flex.align-items-center[.c-focused]` (khoá: KHÔNG `c-disabled`) | `mat-select.mat-mdc-select[-empty\|-multiple\|-required\|-invalid\|-disabled] > .mat-mdc-select-trigger` | `keyboard_arrow_down`, có giá trị & không required → nút × (`data-replace`) |
| `sd-autocomplete` | `div.d-flex.align-items-center[.c-focused]` | `input[role=combobox][data-clear-placeholder][.c-selected]` — giá trị đã chọn nằm ở **placeholder** (đen), nhãn `label-always-float` | `search`, đã chọn → nút × (`data-replace`) |
| `sd-date` | `div.d-flex.align-items-center[.c-focused\|.c-disabled]` | `input.mat-datepicker-input[maxlength=10]` + `<mat-datepicker>` | lỗi · × · `today` |
| `sd-datetime` | như `sd-date` | `input.mat-mdc-input-element` | lỗi · × · SVG lịch-đồng-hồ |
| `sd-date-range` | `<div>` trơn | `mat-date-range-input > .mat-date-range-input-container` (2 ô + mirror + `–`) | `cancel` (khi có giá trị) · `today` · `<mat-date-range-picker>` |
| `sd-chip` | `div[tabindex=0].d-flex.align-items-center[.c-focused\|.c-disabled]` | `mat-chip-grid > .mdc-evolution-chip-set__chips > mat-chip-row… + input.sd-chip-input.mat-mdc-chip-input` | (icon lỗi khi `hideInlineError`) |
| `sd-chip-calendar` | `div.d-flex.align-items-center[.c-focused]` | như `sd-chip`, ô nhập `readonly` + `.mat-mdc-menu-trigger` | — (catalog không có icon đuôi) |

**Ba điều dễ vấp khi dựng trang:**

1. **Vạch dưới 20px** — `mat-form-field` của catalog luôn chừa 20px dưới khung cho hint/lỗi.
   Ô nằm trong thanh lọc / ô tìm kiếm / hàng công cụ thì khai **`hideInlineError`** (lỗi thành
   icon + tooltip, không có vạch dưới). Kit tự bật `hideInlineError` trong `thead`,
   `column-filter`, `.filter-row`, `.filter-bar`, `external-filter` và thanh lọc
   `data-pattern="filter-bar"`.
2. **Nền ô trong suốt** như catalog (ô khoá nền `--sd-black100`). Ô lọc trong đầu `sd-table`
   giữ nền trắng (`#c-table … .mat-mdc-text-field-wrapper{background-color:#fff}`).
3. **Đừng chọc vào `.sd-form-field` / `.sd-input` / `.sd-label` bên trong `sd-*`** — các lớp
   đó không còn. Dùng `.mat-mdc-text-field-wrapper`, `input.mat-mdc-input-element`,
   `.mdc-floating-label`. Lớp `.sd-form-field` vẫn còn CSS cho markup viết tay (không phải `sd-*`).

Bảng chọn / lịch (`.sd-dropdown-menu`, `mat-datepicker-content` của `sd-date` / `sd-date-range`, `sd-datetime-picker`,
`.mat-mdc-menu-panel` của `sd-chip-calendar`, `.sd-autocomplete-panel`) **nằm ở overlay** như catalog (2026-10-14):
`body > .cdk-overlay-container > .cdk-overlay-pane.sd-<tên>-pane` khi mở, đóng thì không còn — thẻ host chỉ chứa ô.
Mở ngay dưới khung ô, lật lên khi dưới thiếu chỗ, dời sang trái khi tràn mép phải; không bị bảng / khung cuộn cắt.
JS trang tìm popup thì gọi trên **chính thẻ**: `el.querySelector('mat-datepicker-content')` vẫn trả về khối (thẻ tự tìm cả
trong overlay); `document.querySelector('sd-date mat-datepicker-content')` thì KHÔNG còn thấy. CSS viết cho phần trong popup
phải là `:is(sd-date, :where(.sd-date-pane)) …` (xem `sdFloatInstall` trong sd-components.js).
Ruột lịch (2026-10-14) là DOM `mat-calendar` của catalog: ô ngày `button.mat-calendar-body-cell[data-day]` (khoá:
`.mat-calendar-body-disabled[aria-disabled=true]`), nút ‹ › `.mat-calendar-previous-button` / `.mat-calendar-next-button`.

---

## sd-input

Text input với floating label. Validation mirror theo `input.component.ts` thật
(`@sdcorejs/angular` v22.2.12) — rà soát 2026-09-23, xem trang preview
[Validation & hideInlineError](../preview/components/validation.html).

| Attribute | Values | Default |
|-----------|--------|---------|
| `label` | Field label | — |
| `placeholder` | Placeholder text | — |
| `helperText` | Hint text dưới field — tự ẩn khi đang hiện lỗi | — |
| `size` | `sm`, `md` — catalog chỉ có hai cỡ; `lg` / `xs` cũ của kit vẫn nhận, hiển thị như `md` (bí danh) | `md` |
| `value` | Pre-filled value | — |
| `required` | boolean — hiện `*`, lỗi "Vui lòng nhập thông tin" | — |
| `type` | `text` · `number` · `password` · `email` | `text` |
| `readonly` | boolean — đọc được, không sửa được (khác `disabled`: vẫn focus được) | `false` |
| `suffix` | string — chữ cuối ô (đơn vị "VNĐ", "%"…), trải phẳng `<ng-template sdSuffixDef>` | — |
| `suffixIcon` | string — icon cuối ô thay cho `suffix` | — |
| `inlineError` | Lỗi do **bên ngoài** truyền vào — hiện ngay, không chờ touched/dirty | — |
| `viewed` | `false` · `true` · `inline` — xem `SdViewed` | `false` |
| `minlength` | number — validator viền đỏ khi ngắn hơn. **Không hiện message riêng** (xem "lệch có chủ ý") | — |
| `maxlength` | number — lỗi "Số ký tự tối đa: {max}" khi vượt quá | — |
| `pattern` | regex string, hoặc tên `ValidationPatternType` có sẵn: `EMAIL`, `PHONE`, `VN_PHONE`, `VN_ID`, `PASSPORT`, `VN_ID_OR_PASSPORT`, `TIME`, `URL`, `DOMAIN`, `IPV4`, `IPV6`, `IMAGE_URL`, `SLUG`, `NUMBER`, `INTEGER`, `DECIMAL`, `POSITIVE_NUMBER`, `UUID`, `CODE_16`, `CODE_32`, `HEX_COLOR`, `BASE64` (+ 3 tên cũ back-compat: `PHONE_VN`, `IDVN`, `IDVN_OR_PASSPORT`) — tự tra regex + message tiếng Việt | — |
| `patternErrorMessage` | string — custom, luôn thắng message tự tra từ `pattern` | — |
| `hideInlineError` | boolean — ẩn text lỗi, chuyển thành icon + tooltip (dùng trong cell table) | — |
| `autoId` | string — QA data attr, render `data-autoId="forms-input-{autoId}"` | — |
| `name` | string | — |
| `disabled` | boolean | — |

> `mode` · `mask` · `clearable` · `blurOnEnter` · `focusForceBlur` · `field` **đã gỡ 2026-10-12** (Rule 18 — catalog `#c-input` không có); trang cũ khai vẫn không lỗi, chỉ không có tác dụng.

**Lớp trên thẻ host — `sd-has-label` / `sd-viewed` (2026-10-11):**

Mọi component form (`sd-input`, `sd-select`, `sd-textarea`, `sd-date`,
`sd-datetime`, `sd-input-number`, `sd-chip`, `sd-chip-calendar`) tự gắn
`sd-has-label` lên **chính thẻ host** khi có `label`, và `sd-viewed` khi ở chế độ
xem. Catalog khai `sd-x.sd-has-label{padding-top:4px}` /
`sd-x.sd-viewed{padding-top:0}`: nhãn nổi nằm ở `top:-7.75px` nên nó tràn lên
trên khung ô, 4px đó là chỗ cho nó. Trang **không cần tự thêm**; nếu chép markup
từ catalog có sẵn `class="sd-has-label"` thì cũng không sao.

**Màu qua lớp `sd-c-{color}` (2026-10-11):**

`sd-checkbox`, `sd-radio`, `sd-switch` nhận màu theo **cả hai** cách: attribute
`color="success"` (cách kit dùng từ đầu) hoặc lớp `class="sd-c-success"` (cách
catalog render input `color`). Component chỉ **gắn lớp**, không ghi ngược vào
attribute — selector kiểu `sd-checkbox:not([color])` của trang vẫn đúng nghĩa cũ.

**Bộ đếm ký tự `maxlength` (2026-10-11, theo Core UI Catalog `#c-input` / `#c-textarea`):**

Khai `maxlength` thì kit dựng thêm `<div class="sd-maxlength-counter"> 18/50 </div>`
nấp ở mép dưới phải ô nhập. Nó **mờ 0** cho tới khi ô được focus hoặc rê chuột lên,
rồi chuyển sang mờ 1 trong `.12s`. Vượt quá giới hạn thì thêm lớp
`sd-maxlength-counter--exceeded` (đỏ `--sd-error`, đậm 600) và
`title="Vượt quá số ký tự tối đa"`.

Bộ đếm nằm trong `.sd-input-field-wrap` / `.sd-textarea-field-wrap`
(`position:relative`) — cũng là phần tử mang lớp `c-focused` khi focus. Số đếm
cập nhật **tại chỗ theo từng phím**, không vẽ lại cụm, nên con trỏ không nhảy.
Không khai `maxlength` thì không dựng bộ đếm.


> **[LỊCH SỬ — thay bởi mục "DOM Material dùng chung" ở đầu file, 2026-10-13]**
> **Khung ô nhập dùng chung — rà soát 2026-10-11 theo Core UI Catalog
> `@sd-angular/core` 19.0.10.** Số đo dưới đây từng áp cho khung `.sd-form-field` của kit
> (nay chỉ còn cho markup viết tay); các `sd-*` đã chuyển sang DOM `mat-form-field`.
>
> | | Catalog (`.sd-md` / `.sd-sm`) | Kit trước 2026-10-11 |
> |---|---|---|
> | Chiều cao | **43.5px** / 32px | 36px / 28px |
> | Lề trong | 16px | 12px |
> | Ô chữ | cao 21px, `rgba(0,0,0,.87)` | 16px, `#212121` |
> | Placeholder | `rgba(0,0,0,.54)` | `#757575` |
> | Nhãn lúc nghỉ | cách mép 16px, 14px, `rgba(0,0,0,.54)` | 12px, `#212121` |
> | Nhãn lúc nổi | đỉnh `-6.75px`, chữ **10.5px** (= 14 × .75) | `-10px`, 12px |
>
> ⚠️ **Ba trạng thái viền khác bản cũ của kit.** Catalog ghim màu viền ô nhập ở
> **mọi trạng thái** bằng `!important`
> (`.mat-mdc-notch-piece.mdc-notched-outline__leading{border-color:var(--sd-black200)!important}`),
> nên **hover không đổi màu viền**, **focus chỉ dày lên 2px** chứ không chuyển nâu,
> và **ô lỗi vẫn giữ viền xám** — chỉ khi `hideInlineError` (không có dòng lỗi ở dưới
> để báo) viền mới đỏ. Kit mirror đúng như vậy; nếu thấy khó dùng, cách hoàn tác nằm
> trong `_memory/known-gaps.md`.
>
> Cỡ `sd-lg` (**52px**) và `sd-xs` (24px, hàng lọc trong bảng, giữ lề 12px) là **cỡ
> riêng của kit** — catalog chỉ có `sd-sm` và `sd-md`.

Lỗi hiện khi field **đang gõ (dirty) HOẶC đã rời khỏi (touched)** — khác nhóm
sd-chip/sd-date/sd-chip-calendar (chỉ touched). Gõ sai định dạng là thấy lỗi
ngay, không cần blur trước. `onBlur` cũng tự trim khoảng trắng đầu/cuối.

```html
<sd-input label="Họ và tên" placeholder="Nhập họ tên..." required></sd-input>
<sd-input label="Email" value="a@email.com" helperText="Email công ty"></sd-input>
<sd-input label="Mã SP" value="SP-001" disabled></sd-input>
<sd-input label="Tên" value="Nguyễn Văn A" viewed></sd-input>

<!-- Validation: regex tùy chỉnh -->
<sd-input label="Mã nhân viên" required pattern="[A-Z0-9]{4,10}"
  patternErrorMessage="Chỉ gồm chữ IN HOA và số (4-10 ký tự)"></sd-input>

<!-- Validation: ValidationPatternType có sẵn — tự tra regex + message -->
<sd-input label="Email" required pattern="EMAIL"></sd-input>
<sd-input label="SĐT VN" required pattern="PHONE_VN"></sd-input>

<!-- hideInlineError: dùng trong cell table -->
<sd-input required hideInlineError size="sm"></sd-input>
```

**Lệch có chủ ý / ngoài phạm vi** (đợt Form/Validation & hideInlineError, rà soát 2026-09-23):

| Điểm | Ghi chú |
|------|---------|
| `minlength` không hiện message | Mirror đúng thư viện thật — validator có thật (control invalid → viền đỏ) nhưng `errorMessage()` thật **không có nhánh nào** đọc `errors['minlength']` |
| `hyperlink`, `appearance`, `floatLabel`, `validator` (async custom) | Chưa mirror. (`type`, `readonly`, `inlineError`, `viewed="inline"` đã có; `mask`, `clearable`, `blurOnEnter` đã gỡ 2026-10-12 vì catalog không có) |

### `inlineError` — dùng chung cho cả nhóm form

`inlineError` có mặt ở `sd-input`, `sd-select`, `sd-textarea`, `sd-date`,
`sd-datetime`, `sd-input-number` với **cùng một ngữ nghĩa**: đây là lỗi từ
server hoặc nghiệp vụ truyền vào, nên **hiện ngay** chứ không chờ người dùng
chạm vào field như lỗi `required` tự tính. Kèm `hideInlineError` thì nó thành
icon ⚠ + tooltip, y như các lỗi khác.

---

## sd-select

Dropdown select với items JSON. Validation mirror theo `select.component.ts`
thật — rà soát 2026-09-23, xem trang preview
[Validation & hideInlineError](../preview/components/validation.html).

| Attribute | Values | Default |
|-----------|--------|---------|
| `label` | Field label | — |
| `placeholder` | Placeholder | `Chọn...` |
| `items` | JSON string `[{"id":"..","name":".."}]` | `[]` |
| `valueField` | Key for value | `id` |
| `displayField` | Key for display | `name` |
| `value` | Selected value | — |
| `size` | `sm`, `md` — catalog chỉ có hai cỡ; `lg` / `xs` cũ của kit vẫn nhận, hiển thị như `md` (bí danh) | `md` |
| `required` | boolean — lỗi "Vui lòng nhập thông tin" | — |
| `hideInlineError` | boolean — ẩn text lỗi, chuyển thành icon + tooltip | — |
| `disabled` | boolean | — |
| `viewed` | `false` · `true` · `inline` — xem `SdViewed` | `false` |
| `multiple` | boolean — đa chọn, `value` là comma-separated ids | — |
| `disabledField` | Tên trường đánh dấu item bị khoá | `disabled` |
| `helperText` | Chữ phụ dưới field (ẩn khi đang hiện lỗi) | — |
| `inlineError` | Lỗi do **bên ngoài** truyền vào — hiện ngay, không chờ touched | — |
| `hideReadError` | boolean — ẩn trạng thái lỗi khi đọc dữ liệu | — |
| `limit` | Số item tối đa panel dựng ra; `0` = không giới hạn | `0` |
| `minWidthPanel` | Bề rộng tối thiểu của panel (`320` → `320px`). Như thư viện: `viewed="inline"` không khai thì `200px`; ô lọc của `sd-table` luôn `200px` | — (inline: `200px`) |
| `.selectedTemplate` (JS) | Hàm `item => '<html>'` vẽ phần giá trị đã chọn (chọn đơn) — trải phẳng `sdSelectedDef` của catalog vì HTML không truyền được `ng-template` | — |
| `showSelectAll` | boolean — hàng "Tất cả" đầu panel, **chỉ tác dụng với `multiple`** | `false` |
| `clearable` | boolean — × xoá giá trị ở mặt chữ `viewed="inline"` | **`true`** |
| `name` | Tên field, áp vào input bên trong | — |
| `autoId` | Ra `data-autoid="forms-select-{giá trị}"` | — |
| `cacheChecksum` | Đổi giá trị là dựng lại danh sách | — |

**Panel nổi trong overlay ở `<body>`** (từ 2026-10-13, như `mat-select`): `body > .cdk-overlay-container >
.cdk-overlay-pane.sd-select-pane > .mat-mdc-select-panel`. Nhờ vậy panel không bị khung cuộn / ô `overflow:hidden`
cắt (ô lọc trong hàng tiêu đề `sd-table`, `sd-section`, khay `sd-side-drawer`) và không bị dòng bên dưới đè; phía
dưới không đủ chỗ thì tự lật lên trên. JS trang muốn tìm panel đang mở: `el._pane.querySelector('.sd-dropdown-menu')`
(không còn là con của `el` khi mở).

**`viewed` có ba trạng thái, không phải boolean.** `viewed` trần hoặc
`viewed="true"` là xem tĩnh; `viewed="false"` **vẫn sửa được** (đúng
`booleanAttribute`); `viewed="inline"` là editor nhưng mặt ngoài chỉ còn chữ —
bấm vào mới mở panel, rê chuột mới hiện mũi tên và nút ×. Bản trước chỉ đọc
`hasAttribute('viewed')` nên `viewed="false"` bị hiểu thành xem tĩnh.

**Hàng "Tất cả" (`showSelectAll`)** tính trạng thái trên item **enabled**, bỏ
qua item bị khoá: chọn hết → `checked`, chọn một phần → `indeterminate`. Đang
`checked` mà bấm lại thì bỏ chọn cả phạm vi; ngược lại chọn thêm cả phạm vi.
`showSelectAll` là tính năng **riêng của kit** — catalog 19.0.10 không có input
này. (Rà soát 2026-10-11 phát hiện chuỗi nhãn của hàng này chưa bao giờ được khai
nên render ra **rỗng**; đã sửa thành "Tất cả".)

### Ô tìm kiếm trong panel — tự hiện khi danh sách > 10 mục

Catalog: *"tự hiện ô tìm kiếm khi danh sách > 10 phần tử hoặc `items` là hàm tải
từ server"*. Kit nhận `items` qua attribute nên chỉ còn vế đầu: **`items.length
> 10`**. Không có input nào để bật/tắt — đúng catalog, ngưỡng là cố định.

| | Số đo (đo trên chính trang catalog) |
|---|---|
| Khung `.c-filter-input-container` | đệm 8px, nền trắng, **dính trên đầu panel** (`position: sticky`), gạch dưới `0 1px #f2f2f2` |
| Hộp `.filter-input-wrapper` | cao 38px, đệm `4px 8px`, viền 1px `--sd-black200`, bo 4px |
| Ô chữ `.c-search-input` | cao 28px, đệm 4px, không viền không outline |
| Icon kính lúp | 24px, màu `#dadada` |

Hành vi: mở panel là con trỏ **nhảy thẳng vào ô**; gõ thì lọc theo chữ hiển thị,
không phân biệt hoa thường; hàng "Tất cả" luôn giữ; không dòng nào khớp thì hiện
"Không có kết quả". Lọc bằng cách **ẩn/hiện dòng**, không vẽ lại panel — vẽ lại là
ô nhập mất focus giữa chừng gõ. Đóng panel thì xoá từ khoá.

Hai chỗ kit tự quyết vì catalog không có bằng chứng (đã ghi `_memory/known-gaps.md`):
ô **không có placeholder** (markup catalog cũng không có, kit chỉ gắn `aria-label`),
và **đóng panel là xoá từ khoá** để lần mở sau không còn bộ lọc ẩn.
Chuỗi "Tất cả" lấy từ `core.form.select.selectAll` trong bundle i18n thật.

Lỗi `required` chỉ hiện **SAU KHI đã mở rồi đóng dropdown** (mirror `touched`
thật) — khác `sd-input`, `sd-select` không có khái niệm "dirty" cho control kiểu
chọn. Riêng `inlineError` hiện ngay vì đó là lỗi từ nghiệp vụ, không phải lỗi
người dùng vừa gây ra.

```html
<sd-select label="Danh mục" placeholder="Chọn danh mục..." required
  items='[{"id":"food","name":"Thực phẩm"},{"id":"drink","name":"Đồ uống"}]'
></sd-select>

<sd-select label="Trạng thái" value="active"
  items='[{"id":"active","name":"Hoạt động"},{"id":"inactive","name":"Ngừng"}]'
></sd-select>

<sd-select label="Phòng ban" value="Kế toán" viewed></sd-select>

<!-- inline: mặt ngoài là chữ, bấm vào mới mở panel, rê chuột mới hiện × -->
<sd-select label="Phòng ban" value="hr" viewed="inline"
  items='[{"id":"hr","name":"Nhân sự"}]'></sd-select>

<!-- đa chọn kèm hàng "Tất cả" -->
<sd-select label="Trạng thái" multiple showSelectAll
  items='[{"id":"a","name":"Đang áp dụng"},{"id":"b","name":"Nháp"}]'></sd-select>

<!-- hideInlineError: dùng trong cell table -->
<sd-select required hideInlineError size="sm"
  items='[{"id":"hr","name":"Nhân sự"}]'></sd-select>
```

**Lệch có chủ ý / ngoài phạm vi** (đợt Form/Validation & hideInlineError, rà soát 2026-09-23):

| Điểm | Ghi chú |
|------|---------|
| `inlineError`, `autoId`, `name`, `viewed="inline"`, `showSelectAll`, `clearable`, `helperText`, `limit`, `minWidthPanel`, `disabledField`, `hideReadError`, `cacheChecksum` | **Đã mirror 2026-10-10** — bảng attribute bên trên |
| `validator` (customValidator) | Chưa mirror — nhận một hàm JS, không diễn đạt được bằng attribute HTML |
| `appearance`, `floatLabel`, `form`, `hyperlink`, `model` | Không mirror — thuộc Angular Reactive Forms / Material form-field, không có nghĩa trong HTML tĩnh |
| footer actions, `SdSearch` lazy-load | Chưa mirror — `sd-select` trong kit chỉ nhận `items` tĩnh dạng JSON |

---

## sd-textarea

Ô nhập nhiều dòng. **Rà soát 2026-10-10** — bản trước hoàn toàn không có
validation: `required` chỉ vẽ dấu `*` chứ không báo lỗi, và không có
`maxlength`/`pattern`/`helperText` nào cả.

| Attribute | Values | Default |
|-----------|--------|---------|
| `label` | Field label | — |
| `placeholder` | Placeholder | — |
| `rows` | Số dòng ban đầu | **`5`** |
| `size` | `sm`, `md` — catalog chỉ có hai cỡ; `lg` / `xs` cũ của kit vẫn nhận, hiển thị như `md` (bí danh) | `md` |
| `value` | Giá trị có sẵn | — |
| `required` | boolean — lỗi "Vui lòng nhập thông tin" | — |
| `maxlength` | number — lỗi "Số ký tự tối đa: {max}" | — |
| `pattern` | regex string — lỗi "Định dạng không hợp lệ" | — |
| `helperText` | Chữ phụ dưới ô, tự ẩn khi đang hiện lỗi | — |
| `hideInlineError` | boolean — đổi chữ lỗi thành icon ⚠ + tooltip | `false` |
| `inlineError` | Lỗi từ bên ngoài — hiện ngay, không chờ gõ hay rời ô | — |
| `autoHeight` | boolean — ô tự cao theo nội dung, không còn thanh cuộn trong ô | `false` |
| `name` | Tên field | — |
| `autoId` | Ra `data-autoid="forms-textarea-{giá trị}"` | — |
| `disabled` | boolean | — |
| `viewed` | boolean | — |

Lỗi hiện sau khi gõ (dirty) hoặc rời ô (touched), trừ `inlineError` hiện ngay —
cùng quy ước với `sd-input`. Phần lỗi cập nhật tại chỗ, không dựng lại ô nhập,
nên con trỏ đang gõ không bị nhảy.

```html
<sd-textarea label="Ghi chú" placeholder="Nhập chi tiết..." rows="4"></sd-textarea>
<sd-textarea label="Mô tả" value="Nội dung..." rows="4" viewed></sd-textarea>
```

---

## sd-date

Chọn một ngày: gõ tay `dd/MM/yyyy` (tự chèn `/` khi đang gõ) hoặc chọn từ lịch popup. Model là canonical `yyyy/MM/dd`. Mirror `SdDate` của `@sdcorejs/angular`. Portal: `/form/date`.

**Điểm dễ hiểu sai:** `value`/`model` lưu **canonical `yyyy/MM/dd`**, không phải chuỗi hiển thị `dd/MM/yyyy` — input chỉ hiển thị `dd/MM/yyyy`, không phải giá trị thật của attribute. Model chỉ **chốt lại lúc blur** (đã parse hợp lệ) hoặc lúc chọn ngày trên lịch — gõ dở/gõ sai rồi rời khỏi ô sẽ bị **xoá trắng**, không giữ lại chuỗi gõ dở.

| Attribute | Values | Default | Mô tả |
|-----------|--------|---------|-------|
| `label` | string | — | Floating label |
| `placeholder` | string | = `label` | Placeholder khi trống |
| `value` | canonical `yyyy/MM/dd` | — | Model — hiển thị lại thành `dd/MM/yyyy`. Bí danh: `model` |
| `min` | `yyyy/MM/dd` hoặc literal `"TODAY"` | — | Ngày nhỏ nhất được chọn; ngày ngoài khoảng bị khoá trên lịch |
| `max` | `yyyy/MM/dd` hoặc literal `"TODAY"` | — | Ngày lớn nhất được chọn |
| `required` | boolean | `false` | Hiện dấu `*` + báo lỗi "Vui lòng nhập thông tin" khi trống lúc blur |
| `disabled` | boolean | `false` | Vô hiệu hoá input + nút mở lịch |
| `viewed` | boolean | `false` | Chế độ xem — hiện label/value dạng text tĩnh |
| `size` | `sm`, `md` | `md` | Chiều cao field — catalog chỉ có hai cỡ; `lg` / `xs` cũ của kit vẫn nhận, hiển thị như `md` (bí danh) |
| `helperText` | string | — | Dòng chú thích dưới field khi không có lỗi |
| `hideInlineError` | boolean | `false` | Ẩn dòng lỗi chữ, thay bằng icon đỏ + tooltip (`data-sd-tooltip`) cạnh input |
| `autoId` | string | — | Sinh `data-autoId="forms-date-{autoId}"` cho E2E |
| `name` | string | — | Tên field (tương thích form) |

**Property:** `model` / `value` — canonical `yyyy/MM/dd` hoặc `null`, two-way.

**Event:** `sd-change` (`{ value: string \| null }`, chỉ bắn khi model thật sự đổi), `sd-focus`.

**Method:** `open()`, `focus()`, `blur()`.

```html
<sd-date label="Ngày hiệu lực" placeholder="dd/MM/yyyy" required></sd-date>
<sd-date label="Không được chọn quá khứ" min="TODAY"></sd-date>
<sd-date label="Ngày duyệt" value="2026/04/10" viewed></sd-date>
```

**Lệch có chủ ý so với `@sdcorejs/angular`** (ghi ra để không ai tưởng là thiếu sót):

| Chỗ lệch | Lý do |
|---|---|
| `helperText` hiện thành dòng chữ dưới field như input khác của kit | Thư viện thật chỉ hiện icon info + tooltip cạnh label khi `appearance` được set — kit không mirror `appearance` |
| `hideInlineError` dùng `data-sd-tooltip` chung của kit | Thư viện dùng `matTooltip` của Angular Material — kit không có |
| Không mirror `appearance`, `floatLabel`, `form`, `transform`, `hyperlink`, `inlineError`, `viewed="inline"` | Chi tiết tích hợp Angular Material/Reactive Forms, không có ý nghĩa trong prototype HTML tĩnh |
| Bỏ thông báo lỗi "Sai định dạng" | Trong thư viện thật, lỗi này chỉ tồn tại khi `touched === false` rồi bị chính `onBlur` xoá ngay khi `touched` bật `true` — không bao giờ thấy được trên UI thật. Mirror giữ đúng hành vi quan sát được (xoá trắng khi gõ sai/dở rồi blur), bỏ hẳn message không thể hiển thị |
| Lịch popup dùng lại nguyên `.form-field-datepicker*` của `components.css` | AGENTS.md Rule 1 — không viết CSS lịch mới, bộ class đó đã đúng yêu cầu |

---

## sd-datetime

Chọn ngày + giờ: gõ tay `dd/MM/yyyy HH:mm` hoặc mở popup **một panel dọc rộng 320px** — lịch ở trên, kẻ ngang, rồi bộ đếm giờ `HH : MM` có nút ▲▼, dưới cùng là **Bây giờ** | **Bỏ qua** · **Xác nhận**; chọn xong bấm **Xác nhận** mới ghi. (Dựng lại 2026-10-12 theo catalog `@sd-angular/core` 19.0.10 — bản cũ có tab Ngày/Giờ và mặt đồng hồ tròn, đó là hình dạng của `@sdcorejs/angular`.) Model canonical `yyyy/MM/dd HH:mm:00` (hoặc `:ss`). Mirror `SdDatetime`. Portal: `/form/datetime`.

**Điểm dễ hiểu sai:** `value`/`model` lưu **canonical `yyyy/MM/dd HH:mm:ss`** (khi không `showSeconds` thì giây là `:00`), input chỉ hiển thị `dd/MM/yyyy HH:mm[:ss]`. Popup theo cơ chế **draft-then-apply**: chọn ngày/giờ chưa ghi ngay, phải bấm **Xác nhận**; **Bỏ qua** đóng không lưu; **Bây giờ** đặt draft = thời điểm hiện tại. Bộ đếm giờ: ▲▼ cộng/trừ 1 **quay vòng** (23→00, 59→00); gõ thẳng vào ô rồi Enter/blur thì **kẹp về biên** (gõ `99` phút ra `59`); phím ↑↓ trong ô cũng chạy. Chọn ngày xong **không** tự nhảy sang chọn giờ — lịch và giờ nằm cùng một panel. Gõ sai định dạng rồi blur → báo **"Sai định dạng"** (khác `sd-date`, lỗi này ở datetime hiển thị được vì `onConfirmInput` bật `touched` cùng lúc set lỗi).

| Attribute | Values | Default | Mô tả |
|-----------|--------|---------|-------|
| `label` | string | — | Floating label |
| `placeholder` | string | = `label` / `dd/MM/yyyy HH:mm` | Placeholder khi trống |
| `value` | canonical `yyyy/MM/dd HH:mm[:ss]` | — | Model — hiển thị lại `dd/MM/yyyy HH:mm[:ss]`. Bí danh: `model` |
| `min` / `minDate` | `yyyy/MM/dd[ HH:mm]` hoặc `"TODAY"` | — | Ngày nhỏ nhất; ngày ngoài khoảng bị khoá trên lịch |
| `max` / `maxDate` | `yyyy/MM/dd[ HH:mm]` hoặc `"TODAY"` | — | Ngày lớn nhất |
| `required` | boolean | `false` | Dấu `*` + lỗi "Vui lòng nhập thông tin" khi trống lúc blur |
| `disabled` | boolean | `false` | Vô hiệu hoá input + nút mở picker |
| `viewed` | boolean | `false` | Chế độ xem — text tĩnh |
| `size` | `sm`, `md` | `md` | Chiều cao field — catalog chỉ có hai cỡ; `lg` / `xs` cũ của kit vẫn nhận, hiển thị như `md` (bí danh) |
| `showSeconds` | boolean | `false` | Thêm cột giây; hiển thị & lưu tới `ss` |
| `hideInlineError` | boolean | `false` | Ẩn dòng lỗi chữ, thay bằng icon đỏ + tooltip |
| `autoId` | string | — | Sinh `data-autoId="forms-datetime-{autoId}"` |
| `name` | string | — | Tên field (tương thích form) |

**Property:** `model` / `value` — canonical `yyyy/MM/dd HH:mm:ss` hoặc `null`, two-way.

**Event:** `sd-change` (`{ value: string \| null }`), `sd-focus`.

**Method:** `open()`, `close()`, `focus()`, `blur()`.

```html
<sd-datetime label="Thời gian bắt đầu" required></sd-datetime>
<sd-datetime label="Có giây" value="2026/09/22 14:30:45" showSeconds></sd-datetime>
<sd-datetime label="Hoàn thành" value="2026/04/12 09:15" viewed></sd-datetime>
```

**Lệch có chủ ý so với `@sdcorejs/angular`:**

| Chỗ lệch | Lý do |
|---|---|
| Nhãn nút "Hủy" trong popup đổi thành "Bỏ qua"; cụm nút theo Rule 17 (Xác nhận `fill`, Bây giờ/Bỏ qua `link`) | AGENTS.md Rule 16 cấm nhãn "Hủy" |
| `helperText` là dòng chữ dưới field; `hideInlineError` dùng `data-sd-tooltip` | Kit không mirror `appearance` (icon info) và không có `matTooltip` |
| Không mirror `appearance`, `floatLabel`, `form`, `transform`, `hyperlink`, `inlineError`, `viewed="inline"` | Chi tiết Angular Material/Reactive Forms |
| Popup lịch + đồng hồ dùng lại `.form-field-datetime*` / `.form-field-timepicker*` / `.form-field-datepicker*` của `components.css` | AGENTS.md Rule 1 — không viết CSS popup mới |
| Message min/max hiện theo **ngày** (`toLocaleDateString('vi-VN')`) | Đúng thư viện thật, dù so sánh ở mức thời điểm đầy đủ |

---

## sd-input-number

Nhập số có phân cách hàng nghìn khi gõ, giới hạn số chữ số thập phân được gõ, kiểm min/max. Model luôn là số thô (dấu chấm cho thập phân), không phụ thuộc `format` hiển thị. Mirror `SdInputNumber` của `@sdcorejs/angular`. Portal: `/form/input-number`.

**DOM — Material y hệt catalog `#c-input-number` (đồng bộ 2026-10-13).** Như mọi ô nhập
khác (xem mục "DOM Material dùng chung" ở đầu file), `sd-input-number` in đúng cây
`mat-form-field` của thư viện:

```
sd-input-number[.sd-has-label]
└ div.d-flex.align-items-center[.c-focused|.c-disabled]
  └ mat-form-field.mat-mdc-form-field.sd-{md|sm}[.hide-inline-error][.mat-form-field-hide-placeholder]
      .mat-primary[.mat-mdc-form-field-has-icon-suffix][.mat-form-field-invalid|-disabled][.mat-focused] ng-*
    ├ .mat-mdc-text-field-wrapper.mdc-text-field.mdc-text-field--outlined[--no-label|--focused|--invalid|--disabled]
    │ └ .mat-mdc-form-field-flex
    │   ├ .mdc-notched-outline(--upgraded[--notched] | --no-label)
    │   │   leading · notch (label.mdc-floating-label[--float-above] > mat-label …) · trailing
    │   ├ .mat-mdc-form-field-infix > input.mat-mdc-input-element.mdc-text-field__input
    │   └ .mat-mdc-form-field-icon-suffix  ← icon lỗi · button.sd-clear-btn.sd-hover · hậu tố
    └ .mat-mdc-form-field-subscript-wrapper ← hint (rỗng) | mat-error
```

Nhãn nổi khi có giá trị hoặc đang focus; khe viền rộng `calc(<bề ngang nhãn>px × 0.75 + 9px)`
(đo lại khi font tải xong / ô hết bị ẩn). Lớp `ng-touched|untouched`, `ng-dirty|pristine`,
`ng-valid|invalid` theo trạng thái. CSS là bản chép nguyên văn `input-number.css` của
catalog (phạm vi `sd-input-number`) + cỡ `sd-sm`. Trang nào trước đây chọc vào
`.sd-form-field` / `.sd-input` bên trong `sd-input-number` phải đổi sang
`.mat-mdc-text-field-wrapper` / `input.mat-mdc-input-element`.

**Điểm dễ hiểu sai:** `precision` chỉ giới hạn **số chữ số thập phân được phép gõ thêm** qua bàn phím (chặn ký tự ở tầng `keydown`) — nó **không** làm tròn hay đệm số 0 vào một giá trị đã được set sẵn qua `value`. Một `<sd-input-number value="3.14159">` (không set `precision`) vẫn hiển thị đủ `3,14159` dù mặc định `precision` là `3`. `format` mặc định `1.234.567,89` (chấm nghìn, phẩy thập phân) mirror đúng cấu hình thật của Core UI demo app, không phải fallback quốc tế của bản thư viện trần.

| Attribute | Values | Default | Mô tả |
|-----------|--------|---------|-------|
| `label` | string | — | Floating label |
| `placeholder` | string | = `label` | Placeholder khi trống |
| `value` | number (dấu chấm cho thập phân) | — | Model thô — hiển thị lại theo `format`. Bí danh: `model` |
| `format` | `1.234.567,89` hoặc `1,234,567.89` | `1.234.567,89` | Kiểu phân cách nghìn/thập phân khi hiển thị |
| `precision` | number | `3` | Số chữ số thập phân **được phép gõ thêm** — không làm tròn/đệm giá trị đã có sẵn |
| `type` | `positive`, `negative` | — | Giới hạn chỉ cho gõ số dương hoặc âm; để trống thì cho cả hai |
| `min` | number | — | Giá trị nhỏ nhất — báo lỗi khi blur nếu vi phạm |
| `max` | number | — | Giá trị lớn nhất |
| `required` | boolean | `false` | Hiện dấu `*` + báo lỗi "Vui lòng nhập thông tin" khi trống lúc blur |
| `disabled` | boolean | `false` | Vô hiệu hoá input |
| `readonly` | boolean | `false` | Chỉ đọc — vẫn focus/copy được, không sửa |
| `viewed` | `true` \| `'inline'` | `false` | `true`: `sd-view` (nhãn + giá trị đã format). `'inline'`: `sd-inline-text` standalone (nền xám, × khi rê chuột) |
| `size` | `sm`, `md` | `md` | `sd-md` khung 43.5px, `sd-sm` 32px (catalog chỉ có hai cỡ; `lg` cũ của kit quy về `md` — bí danh) |
| `clearable` | — | luôn có | Nút × (`sd-clear-btn sd-hover`) có ở mọi ô có giá trị, hiện khi rê chuột / focus; không có ở ô `disabled`/`readonly`. Thuộc tính cũ được bỏ qua |
| `helperText` | string | — | Icon `info_outline` ngay sau chữ nhãn, gợi ý ở `title` — đúng catalog `#c-input` |
| `hideInlineError` | boolean | `false` | Ẩn dòng lỗi chữ, thay bằng icon đỏ + tooltip (`data-sd-tooltip`) |
| `suffix` | string | — | Text hiện cuối field (đơn vị: "VNĐ", "%"...) — mirror `<ng-template sdSuffixDef>`, đứng sau cùng (bên phải nhất, sau cả nút xoá/icon lỗi) |
| `suffixIcon` | string | — | Icon hiện cuối field thay cho `suffix` text (vd `payments`) |
| `autoId` | string | — | Sinh `data-autoId="forms-input-number-{autoId}"` cho E2E |
| `name` | string | — | Tên field (tương thích form) |

**Property:** `model` / `value` — số thô hoặc `null`, two-way.

**Event:** `sd-change` (`{ value: number \| null }`, chỉ bắn khi model thật sự đổi), `sd-focus`, `sd-cleared`.

**Method:** `focus()`, `blur()`.

```html
<sd-input-number label="Đơn giá" value="150000" required></sd-input-number>
<sd-input-number label="Tỷ lệ" value="3.5" precision="1"></sd-input-number>
<sd-input-number label="Giá bán" value="1500000" suffix="VNĐ"></sd-input-number>
<sd-input-number label="Tổng tiền" value="2500000" viewed></sd-input-number>
```

**Lệch có chủ ý so với `@sdcorejs/angular`:**

| Chỗ lệch | Lý do |
|---|---|
| Gợi ý của `helperText` ở `title` | Thư viện dùng `matTooltip`; catalog `#c-input` in `title` |
| `hideInlineError` dùng `data-sd-tooltip` chung của kit | Thư viện dùng `matTooltip` của Angular Material — kit không có |
| Không mirror `appearance`, `floatLabel`, `form`, `validator` (custom async validator) | Chi tiết tích hợp Angular Material/Reactive Forms, không có ý nghĩa trong prototype HTML tĩnh |
| `format` mặc định `1.234.567,89` | Không phải "lệch mặc định" — mirror đúng cấu hình thật của Core UI demo app (`portal-config.ts`: `numberFormat: '1.234.567,89'`), không dùng fallback quốc tế của bản thư viện trần |
| Suffix chỉ nhận qua 2 attribute tĩnh `suffix` (text) / `suffixIcon` (icon) | Thư viện thật dùng content projection `<ng-template sdSuffixDef>` — chèn được bất kỳ markup nào. Web component vanilla JS không có cơ chế tương đương; 2 attribute này khớp đúng 2 kiểu duy nhất trang demo chính thức của Core UI minh hoạ (text đơn vị hoặc icon) |

---

## sd-upload-file

Trường upload file: click hoặc kéo thả để chọn, lọc theo nhóm file và đuôi file, chặn dung lượng, xem trước ảnh dạng thumbnail, kéo thả đổi thứ tự, xoá có hộp thoại xác nhận. Portal: `/component/upload-file`.

**Điểm dễ hiểu sai:** `model` là **mảng id/key do backend trả về**, không phải mảng `File`. Component không tự gửi file lên server - bên Angular phải gọi `uploadRef.upload()` trước khi submit form.

| Attribute | Values | Default | Mô tả |
|-----------|--------|---------|-------|
| `label` | string | - | Nhãn trường |
| `description` | string | tự sinh | Mô tả phụ. Bỏ trống thì ghép từ `extensions` + `maxSize` |
| `helperText` | string | - | Icon `info_outline` cạnh nhãn (trong `sd-label`), rê chuột hiện gợi ý — đúng catalog `#c-upload-file` |
| `type` | `image`, `document`, `file` | `file` | Nhóm file cho phép |
| `extensions` | string[] | `[]` | Đuôi file hợp lệ. Prototype nhận chuỗi ngăn bằng dấu phẩy: `extensions="pdf,docx"` |
| `maxSize` | number (MB) | - | Dung lượng tối đa mỗi file |
| `max` | number | `10` | Số file tối đa |
| `maxOfImage` | number | `3` | Số ảnh hiển thị khi `disabled`; dư ra gộp vào overlay `+N` |
| `previewWidth` | string | `50px` | Bề rộng ô upload / thumbnail |
| `previewHeight` | string | `50px` | Chiều cao ô upload / thumbnail |
| `align` | `left`, `center` | `left` | Canh hàng thumbnail |
| `required` | boolean | `false` | Dấu `*` và validator required |
| `disabled` | boolean | `false` | Khoá click, kéo thả, chọn file |
| `scaleToPixel` | number | - | Tự thu nhỏ ảnh. **Mirror không dựng lại**, thuộc tính vẫn nhận |
| `key` | string | - | Chọn đúng provider khi app có nhiều cấu hình upload |
| `name` | string | uuid | Tên control trong FormGroup |

**Property (đặt bằng JS, không phải attribute):**

| Property | Kiểu | Mô tả |
|----------|------|-------|
| `model` | `(string \| number)[]` | Two-way. Mảng id/key |
| `upload` | `(files) => Promise<string[]>` | Đẩy file lên, trả mảng id/key. Không set thì dùng adapter cục bộ trong phiên |
| `details` | `(keys) => Promise<Detail[]>` | Lấy metadata để render danh sách file |
| `download` | `(key) => Promise<void>` | Tải file qua API thay vì mở thẳng URL |
| `args` | bất kỳ | Tham số phụ app muốn kèm theo mọi lần gọi API. Truyền làm **tham số thứ hai**: `upload(files, args)`, `details(keys, args)`, `download(key, args)`. Nhận cả attribute dạng JSON (`args='{"folder":"hd"}'`) lẫn property gán từ JS - gán property thì đè attribute |

`Detail` = `{ idOrKey, cdn, name?, extension?, size? }` - `size` tính bằng **MB**.

**Event:** `sd-change` (`{ model }`), `loaded` (`{ files }`), `filesChanged` (`{ files }`). Bên Angular tương ứng `(modelChange)` / `(loaded)` / `(filesChanged)`.

**Method:** `upload()`, `preview()` (mở modal "Xem ảnh": thumbnail mọi tệp bên trái, nút ‹ ›, "Tải file" cho tài liệu).

> Rà soát theo Core UI Catalog `#c-upload-file` 2026-10-12: đã gỡ `maxWidth`, `maxHeight`, `imageValidator`, `autoId`, `getFiles()` — catalog không có. Markup cũ vẫn chạy, thuộc tính bị bỏ qua.

```html
<sd-upload-file label="Ảnh sản phẩm" type="image"
                extensions="jpg,jpeg,png,webp" maxSize="5" max="3" required></sd-upload-file>
```

Nạp sẵn file cho màn Read / Edit - dùng đúng contract của thư viện, **không có** attribute kiểu `files="..."`:

```js
var el = document.querySelector('sd-upload-file');
el.details = async (keys) => keys.map(k => ({
  idOrKey: k, cdn: '/api/file/' + k, name: 'hop-dong.pdf', extension: 'pdf', size: 1.2
}));
el.model = ['file-001'];
```

**Lệch có chủ ý so với `@sdcorejs/angular`** (ghi ra để không ai tưởng là thiếu sót):

| Chỗ lệch | Lý do |
|---|---|
| Gallery xem ảnh dựng bằng `sd-modal` + `sd-preview-image` | Kit không mirror `PreviewComponent` riêng của thư viện; hai thứ cùng vai trò |
| Nhãn hộp thoại xoá là **"Bỏ qua"**, thư viện trả "Hủy" | AGENTS.md Rule 16 cấm nhãn "Hủy" trong kit |
| `scaleToPixel` không nén ảnh | Prototype không cần nén; thuộc tính vẫn nhận để markup không lệch |
| Nhãn dùng class `.sd-label-top` | Kit chưa có thẻ `sd-label` |

---

## sd-switch

Công tắc nhị phân boolean - bật/tắt cài đặt ngay lập tức.

| Attribute | Values | Default |
|-----------|--------|---------|
| `checked` | boolean - trạng thái bật, mirror của `[(model)]` bên Angular | - |
| `label` | Label text bên phải track | - |
| `color` | `primary`, `secondary`, `info`, `success`, `warning`, `error` | `primary` |
| `disabled` | boolean | - |
| `viewed` | `false` · `true` · `inline` - `true` là xem tĩnh, hiện label + Bật/Tắt | `false` |
| `required` | boolean - dấu `*` đỏ sau label | - |
| `hideInlineError` | boolean - HTML viết thường `hideinlineerror` | - |
| `name` | Tên field, áp vào nút switch | - |
| `autoId` | Ra `data-autoid="forms-switch-{giá trị}"` | - |

> `size` **đã gỡ 2026-10-12** — catalog `#c-switch` chỉ có MỘT cỡ (track 52×32, tay nắm 24, quãng trượt 20px).

`viewed` là `SdViewed` ba trạng thái chứ không phải boolean: `viewed="false"`
**vẫn bật tắt được** (đúng `booleanAttribute`). Bản trước đọc `hasAttribute`
nên hiểu nhầm thành xem tĩnh.

```html
<sd-switch label="Nhận thông báo qua email" color="success" checked></sd-switch>
<sd-switch label="Nhận SMS" disabled></sd-switch>
<sd-switch label="Trạng thái" checked viewed></sd-switch>
```

**Event:** `sd-change` với `detail: { checked: boolean }`. Bên Angular tương ứng `[(model)]` two-way binding.

---

## sd-chip

Chip input — ô nhập liệu tạo danh sách chip. Gõ chữ rồi nhấn Enter hoặc dấu phẩy thì thành một chip; mỗi chip có nút X để xoá. Mirror `SdChip` của `@sdcorejs/angular`. Portal: `/form/chip`.

**Điểm dễ hiểu sai:** `min`/`max` trong thư viện thật **chỉ là validator hiển thị lỗi**, KHÔNG chặn thao tác — vẫn xoá được xuống dưới `min` hoặc thêm được quá `max`, component chỉ báo lỗi "Vui lòng nhập ít nhất/tối đa N giá trị" khi blur. Bản mirror trước đây của kit coi min/max là rào chặn cứng (không cho xoá dưới min, im lặng bỏ qua khi thêm quá max) — sai với thư viện thật, đã sửa.

| Attribute | Values | Default | Mô tả |
|-----------|--------|---------|-------|
| `label` | string | — | Floating label |
| `placeholder` | string | = `label` | Placeholder của ô nhập khi trống |
| `value` | string (phân tách bằng dấu phẩy) | — | Danh sách chip. Property `.value` trả về mảng string, two-way. Bí danh: `model` |
| `size` | `sm`, `md` | `md` | Chiều cao field — catalog chỉ có hai cỡ; `lg` / `xs` cũ của kit vẫn nhận, hiển thị như `md` (bí danh) |
| `required` | boolean | `false` | Hiện dấu `*` + báo lỗi "Vui lòng nhập thông tin" khi danh sách rỗng lúc blur |
| `min` | number | — | Số chip tối thiểu — chỉ báo lỗi khi blur nếu ít hơn, không chặn xoá |
| `max` | number | — | Số chip tối đa — chỉ báo lỗi khi blur nếu nhiều hơn, không chặn thêm |
| `removable` | boolean | `true` | Hiện/ẩn nút xoá (x) trên từng chip |
| `addable` | boolean | `true` | Cho phép gõ thêm chip mới; `false` vẫn xoá trắng ô nhập khi Enter nhưng không tạo chip |
| `disabled` | boolean | `false` | Vô hiệu hoá toàn bộ (nhập + xoá) |
| `viewed` | boolean | `false` | Chế độ xem — text tĩnh, các giá trị nối bằng ", " |
| `hideInlineError` | boolean | `false` | Ẩn dòng lỗi chữ, thay bằng icon đỏ + tooltip (`data-sd-tooltip`) |
| `autoId` | string | — | Sinh `data-autoId="forms-chip-{autoId}"` cho E2E |
| `name` | string | — | Tên field (tương thích form) — chỉ lưu, không có tác dụng hiển thị |

**Property:** `model` / `value` — mảng string, two-way. `document.getElementById('chip').value` → `['JavaScript', 'TypeScript']`; gán `.value = [...]` cũng hợp lệ.

**Event:** `sd-change` (`{ value: string[] }`, chỉ bắn khi danh sách thật sự đổi).

**Method:** `focus()`.

```html
<sd-chip label="Ngôn ngữ lập trình" placeholder="Nhập rồi Enter..."
  value="JavaScript,TypeScript,Angular" min="1" max="5"></sd-chip>
```

**Lệch có chủ ý so với `@sdcorejs/angular`:**

| Chỗ lệch | Lý do |
|---|---|
| `removable` chỉ nhận boolean qua HTML attribute | Thư viện thật nhận boolean HOẶC callback `(item) => boolean` (xoá được từng item khác nhau) — web component không có content projection kiểu function |
| Không mirror `appearance`, `floatLabel`, `form`, `hyperlink`, `viewed="inline"` | Chi tiết Angular Material/Reactive Forms hoặc content-projection, không có ý nghĩa trong prototype HTML tĩnh |
| Label dùng floating `.sd-label` (nổi lên trong field khi có giá trị/focus) | Đúng convention mặc định của mọi input khác trong kit (sd-input mode "floating" là mặc định); thư viện thật render `<sd-label>` tĩnh phía trên box khi không set `appearance`, nhưng kit theo convention riêng nhất quán giữa các component |

**Chú ý:** giá trị chip chứa dấu phẩy không round-trip được qua attribute (dấu phẩy là ký tự phân tách) — dùng property `.value` cho trường hợp này.

---

## sd-chip-calendar

Chọn danh sách ngày tháng từ calendar popup. Không gõ tay (ô nhập chỉ đọc): bấm vào ô mở lịch, chọn ngày thì thành chip; bấm lại đúng ngày đó trong lịch (hoặc bấm X trên chip) để bỏ chọn. Mirror `SdChipCalendar` của `@sdcorejs/angular`. Portal: `/form/chip-calendar`.

**Định dạng:** giá trị lưu cố định `yyyy/MM/dd`, chip hiển thị `dd/MM/yyyy` — hai định dạng khác nhau có chủ đích (đúng Portal, giống `sd-date`).

**Điểm dễ hiểu sai (giống `sd-chip`):** `min`/`max` trong thư viện thật **chỉ là validator hiển thị lỗi** (`Validators.minLength`/`maxLength`), KHÔNG chặn thao tác — vẫn bỏ chọn được xuống dưới `min` hoặc chọn thêm được quá `max`, component chỉ báo lỗi khi lịch đóng lại (tương đương blur). Bản mirror trước đây của kit coi min/max là rào chặn cứng — sai với thư viện thật, đã sửa. Bản trước đó cũng thiếu hẳn hành vi **toggle**: bấm lại một ngày đã chọn trong lịch trước đây không có tác dụng (no-op); thư viện thật luôn toggle (đã chọn thì bỏ, chưa chọn thì thêm) — đã sửa.

| Attribute | Values | Default | Mô tả |
|-----------|--------|---------|-------|
| `label` | string | — | Floating label |
| `placeholder` | string | = `label` | Placeholder của ô khi chưa chọn ngày nào |
| `value` | string — danh sách `yyyy/MM/dd` phân tách bằng dấu phẩy | — | Danh sách ngày đã chọn. Property `.value` trả về mảng string[], two-way. Bí danh: `model` |
| `size` | `sm`, `md` | `md` | Chiều cao field — catalog chỉ có hai cỡ; `lg` / `xs` cũ của kit vẫn nhận, hiển thị như `md` (bí danh) |
| `required` | boolean | `false` | Hiện dấu `*` + báo lỗi "Vui lòng nhập thông tin" khi danh sách rỗng lúc đóng lịch |
| `min` | number | — | Số ngày tối thiểu — chỉ báo lỗi khi đóng lịch nếu ít hơn, không chặn bỏ chọn |
| `max` | number | — | Số ngày tối đa — chỉ báo lỗi khi đóng lịch nếu nhiều hơn, không chặn chọn thêm |
| `removable` | boolean | `true` | Hiện/ẩn nút xoá (x) trên từng chip — không ảnh hưởng việc bỏ chọn qua lịch |
| `disabled` | boolean | `false` | Vô hiệu hoá toàn bộ (mở lịch + xoá chip) |
| `viewed` | boolean | `false` | Chế độ xem — text tĩnh, các giá trị nối bằng ", " |
| `hideInlineError` | boolean | `false` | Ẩn dòng lỗi chữ, thay bằng icon đỏ + tooltip (`data-sd-tooltip`) |
| `autoId` | string | — | Sinh `data-autoId="forms-chip-{autoId}"` cho E2E |
| `name` | string | — | Tên field (tương thích form) — chỉ lưu, không có tác dụng hiển thị |

**Property:** `model` / `value` — mảng string `yyyy/MM/dd`, two-way. `document.getElementById('cc').value` → `['2026/04/17', '2026/04/18']`; gán `.value = [...]` cũng hợp lệ.

**Event:** `sd-change` (`{ value: string[] }`, chỉ bắn khi danh sách thật sự đổi).

**Không có** `addable` và **không expose** `focus()` làm method public — cả hai đều không tồn tại trong `.d.ts` thật của `sd-chip-calendar` (khác `sd-chip`): ô nhập chỉ đọc, không có đường gõ tay để thêm giá trị.

```html
<sd-chip-calendar
  label="Chọn các ngày"
  size="md"
  value="2026/04/17,2026/04/18,2026/04/20"></sd-chip-calendar>
```

**Lệch có chủ ý so với `@sdcorejs/angular`:**

| Chỗ lệch | Lý do |
|---|---|
| Chip tự sắp xếp lại theo ngày tăng dần sau mỗi lần chọn/bỏ chọn | Thư viện thật giữ đúng thứ tự người dùng bấm chọn (không sắp xếp) — kit cố ý sắp xếp để danh sách ngày dễ đọc hơn |
| `removable` chỉ nhận boolean qua HTML attribute | Thư viện thật nhận boolean HOẶC callback `(item) => boolean` — web component không có content projection kiểu function |
| Không mirror `appearance`, `floatLabel`, `form`, `hyperlink`, autocomplete gõ chữ chọn nhiều item | Chi tiết Angular Material/Reactive Forms hoặc content-projection; `separatorKeysCodes` tồn tại trong API thật nhưng không được dùng ở đâu trong template thật — vestigial, không mirror |
| Label dùng floating `.sd-label` (nổi lên trong field khi có giá trị/focus) | Đúng convention mặc định của mọi input khác trong kit; thư viện thật render `<sd-label>` tĩnh phía trên box khi không set `appearance`, nhưng kit theo convention riêng nhất quán giữa các component |

**Chú ý:** calendar popup dùng lại class `.form-field-datepicker` sẵn có của kit (không dựng lịch mới); `min`/`max` ở đây là **số lượng ngày**, không phải khoảng ngày cho phép chọn (component này không giới hạn ngày nào được/không được chọn trong lịch).

---

## sd-label — DỰNG MỚI 2026-10-11

Nhãn của trường nhập liệu, dùng khi dựng form **không qua** `sd-input`/`sd-select`
(ví dụ nhãn cho một widget tự dựng). Catalog `#c-label`:
*"Không render gì khi `label` rỗng."*

| Attribute | Ý nghĩa | Default |
|---|---|---|
| `label` | Tên trường — chữ `T14M` (14px/500/20px) | — |
| `required` | boolean — thêm `*` màu `--sd-error` sau nhãn | `false` |
| `description` | Dòng mô tả phụ bên dưới — `T12R` màu `--sd-black400` | — |
| `helperText` | Icon `info_outline` 16px cạnh nhãn, nội dung vào tooltip | — |

```html
<sd-label label="Hạn mức đề xuất" required
          description="Không vượt quá hạn mức tín dụng còn lại của ngân hàng"></sd-label>
<sd-label label="Kỳ hạn vay" helperText="Tính theo tháng, tối đa 60 tháng"></sd-label>
```

Preview: [components/label.html](../preview/components/label.html)

---

## sd-view — DỰNG MỚI 2026-10-11

Cặp nhãn/giá trị **chỉ đọc**. Catalog gọi đây là *"đường render chung cho mọi form
control ở chế độ xem"* và STYLE-GUIDE **yêu cầu dùng nó** thay vì tự dựng cặp
label/value trên màn DETAIL.

| Attribute | Ý nghĩa | Default |
|---|---|---|
| `label` | Nhãn — `T14R` màu `--sd-black400`. **Rỗng thì bỏ hẳn dòng nhãn** | — |
| `display` | Giá trị hiển thị — `T14M`. Rỗng/thiếu → `--` | — |
| `value` | Bí danh của `display` khi không khai `display` | — |
| `hyperlink` | Biến giá trị thành `<a>`. `http(s)://` → mở tab mới; `/…` → điều hướng thường | — |

Nội dung riêng thay dòng giá trị (tương đương `#sdValue` của Angular): đặt con có
attribute `[sdValue]`, hoặc chỉ cần đặt nội dung bất kỳ bên trong thẻ.

```html
<sd-view label="Mã hồ sơ" display="FUND-2026-Q4-018"></sd-view>
<sd-view label="Hợp đồng tín dụng" display="HĐTD-2026-0915"
         hyperlink="/loans/contracts/HDTD-2026-0915"></sd-view>
<sd-view label="Ngân hàng tham gia">
  <div class="d-flex align-items-center gap-4">
    <span class="T14M">Vietcombank</span><span class="T12R text-black400">+2</span>
  </div>
</sd-view>
```

Preview: [components/view.html](../preview/components/view.html)

---

## sd-inline-text — DỰNG MỚI 2026-10-11

Ô nhập **không viền**, co giãn theo nội dung. Catalog: *"primitive dùng chung cho
`sd-input` / `sd-input-number` khi `viewed='inline'` và cho chip của query-bar"*.

| Attribute | Values | Default |
|---|---|---|
| `value` | Giá trị | — |
| `placeholder` | — | — |
| `chrome` | `standalone` (nền xám nhạt, bo 4px) · `seamless` (không nền, chữ đậm, active tô primary) | `standalone` |
| `state` | `auto` · `pending` · `active` · `focus` · `error` — ép trạng thái từ ngoài | `auto` |
| `clearable` | boolean — nút ×. Ở `standalone` chỉ hiện khi hover/focus | `true` |
| `minSize` | number — bề rộng tối thiểu tính theo ký tự | `2` |
| `disabled` | boolean | `false` |

Sự kiện: `sd-change` · `sd-cleared` · `sd-keyup-enter` · `sd-keydown-escape` ·
`sd-focus` · `sd-blur`.

> **Markup trang tự viết thì component không đụng vào.** Nếu bên trong thẻ đã có
> sẵn `<input class="sd-inline-text__input">` thì `sd-inline-text` chỉ đóng vai vỏ
> CSS — đúng cách `sd-query-bar` đang dùng.

Preview: [components/inline-text.html](../preview/components/inline-text.html)

---

## sd-autocomplete — DỰNG MỚI 2026-10-11

Ô nhập có gợi ý. Khác `sd-select` ở chỗ **gõ để lọc**, và **giá trị đã chọn hiển
thị bằng placeholder màu đen** chứ không nằm ở `value` của ô nhập.

| Attribute | Ý nghĩa | Default |
|---|---|---|
| `label` · `placeholder` · `size` · `helperText` | như nhóm form | — |
| `items` | JSON mảng (attribute) **hoặc** `el.items = array | fn` (property). Hàm nhận từ khoá, trả mảng hoặc Promise → tìm kiếm phía server | `[]` |
| `valueField` · `displayField` · `disabledField` | Tên trường trong item | `value` · `label` · `disabled` |
| `value` / `model` | Giá trị đã chọn | — |
| `limit` | number — cắt bớt số dòng gợi ý | `0` (không giới hạn) |
| `clearable` | boolean — nút xoá **thay chỗ** icon kính lúp | `true` |
| `required` · `disabled` · `hideInlineError` · `inlineError` | như nhóm form | — |
| `viewed` | `false` · `true` (ra `<sd-view>`) · `inline` (mặt chữ bấm được) | `false` |

Sự kiện: `sd-change` (`{ value }`) · `sd-selection` (`{ value, item }`).

```html
<sd-autocomplete label="Ngân hàng cho vay"
                 valueField="code" displayField="name" disabledField="suspended"
                 items='[{"code":"VCB","name":"Vietcombank"}]'></sd-autocomplete>
<script>
  // tìm kiếm phía server
  document.querySelector('sd-autocomplete').items = (text) => api.searchBanks(text);
</script>
```

Preview: [components/autocomplete.html](../preview/components/autocomplete.html)

---

## sd-date-range — DỰNG MỚI 2026-10-11

Ô chọn khoảng ngày *"Từ – đến"*, giá trị `{ from, to }`.

| Attribute | Ý nghĩa | Default |
|---|---|---|
| `label` · `size` · `helperText` · `required` · `disabled` · `hideInlineError` · `inlineError` | như nhóm form | — |
| `from` · `to` | Canonical `yyyy/MM/dd` (hiển thị `dd/MM/yyyy`) | — |
| `min` · `max` | Canonical `yyyy/MM/dd` hoặc literal `TODAY` | — |
| `viewed` | boolean — ra `<sd-view>` dạng `dd/MM/yyyy → dd/MM/yyyy` | `false` |

Property `model` đọc/ghi `{ from, to }`. Sự kiện `sd-change` với
`detail = { from, to }`.

Hành vi lịch: bấm lần 1 đặt `from` và xoá `to` (lịch **vẫn mở**); bấm lần 2 đặt
`to` rồi đóng. Bấm ngày trước `from` thì đảo lại thành khoảng hợp lệ. Gõ tay vào
hai ô cũng được, chốt lúc rời ô.

```html
<sd-date-range label="Kỳ báo cáo dòng tiền" from="2026/10/05" to="2026/10/20"></sd-date-range>
<sd-date-range label="Thời hạn hạn mức" required min="TODAY"></sd-date-range>
```

Preview: [components/date-range.html](../preview/components/date-range.html)

---

## sd-input-color — DỰNG MỚI 2026-10-11

Ô nhập mã màu HEX, **bọc `sd-input`** nên thừa hưởng toàn bộ nhãn nổi / lỗi /
`viewed` / `clearable` của nó.

| Attribute | Ý nghĩa | Default |
|---|---|---|
| `label` · `size` · `helperText` · `required` · `disabled` · `readonly` · `viewed` | chuyển thẳng xuống `sd-input` | — |
| `value` / `model` | Mã màu. Hợp lệ: `#RGB` · `#RRGGBB` · `#RRGGBBAA` | — |
| `placeholder` | | `#RRGGBB` |

Property `valid` cho biết mã hiện tại có đúng định dạng không. Mã sai → ô màu
quay về caro và hiện lỗi cố định *"Mã màu HEX không hợp lệ (vd #1565C0)"*.
Bấm ô màu mở bảng chọn màu native của trình duyệt. Sự kiện `sd-change`.

```html
<sd-input-color label="Màu nhãn trạng thái" value="#006BFF"></sd-input-color>
```

Preview: [components/input-color.html](../preview/components/input-color.html)

---

## Viewed mode — Tổng hợp

> **Cập nhật 2026-10-11 — chế độ xem của MỌI control nay đi qua `<sd-view>`.**
> Markup đổi từ
> `<div class="sd-view-mode"><div class="sd-view-label T14R text-black400">…</div><div class="sd-view-value T14M">…</div></div>`
> thành
> `<sd-view label="…" display="…"></sd-view>` — `sd-view` tự vẽ hai dòng
> `.T14R.text-black400` + `.T14M`. Ba lớp `.sd-view-mode` / `.sd-view-label` /
> `.sd-view-value` **đã bỏ hẳn** (catalog không có chúng ở đâu cả). Giá trị rỗng
> nay là `--` chứ không phải `—`. Trang nào đang query ba lớp cũ phải đổi sang
> `sd-view .T14M` / `sd-view .T14R`.


Tất cả form components hỗ trợ `viewed` attribute → render read-only label + value. Dùng cho Read pages khi cần hiển thị data dạng form field (thay vì sd-section-item).

| Component | Viewed output |
|-----------|--------------|
| sd-input | Label + plain text |
| sd-select | Label + lookup display text |
| sd-textarea | Label + plain text |
| sd-date | Label + dd/MM/yyyy |
| sd-datetime | Label + dd/MM/yyyy HH:mm |
| sd-input-number | Label + formatted number (1,500,000) |
| sd-switch | Label + Bật/Tắt |

```html
<sd-input label="Tên" value="Nguyễn Văn A" viewed></sd-input>
<sd-select label="Phòng ban" value="Kế toán" viewed></sd-select>
<sd-input-number label="Tổng" value="2500000" viewed></sd-input-number>
```


---

## Rà soát 2026-10-10 — những chỗ nhóm form vừa sửa

**Mảng chuỗi/số thuần dùng được.** `valueField` / `displayField` của thư viện mặc
định là **rỗng**, và template có nhánh riêng cho trường hợp cả hai đều rỗng: khi
đó **item CHÍNH LÀ value và label**. Kit vốn ép mặc định `'id'` / `'name'` nên
`<sd-select items='["Hà Nội","Đà Nẵng"]'>` hỏng hoàn toàn. Nay chạy đúng, ở cả
`sd-select` lẫn `sd-radio`. Item là OBJECT mà không khai field thì vẫn dự phòng
`'id'` / `'name'` như cũ — đây là lệch có chủ ý, ghi ở `_memory/known-gaps.md`.

**Bốn sự kiện mới của `sd-input` / `sd-input-number`**, đối ứng output thật:

| Kit | Angular | Khi nào |
|---|---|---|
| `sd-keyup-enter` | `(keyupEnter)` | Nhả phím Enter. Giá trị đã được **trim** trước khi bắn, y `onKeyupEnter()` thật |
| `sd-blur` | `(sdBlur)` | Rời ô, sau khi đã trim và cập nhật lỗi |
| `sd-cleared` | `(cleared)` | Bấm nút X. Tách khỏi `sd-change` để trang phân biệt "người dùng chủ động xoá" với "giá trị đổi vì lý do khác" |
| `sd-focus-force-blur` | `(sdFocusForceBlur)` | Chỉ khi khai `focusForceBlur`: focus vào ô là nhả ra ngay. Dùng cho ô "bấm để mở bảng chọn, không gõ tay" |

`focusForceBlur` là chỗ **không mirror 1:1 được**: thư viện bật nó theo
`EventEmitter.observed` — "có ai đang nghe output này không" — mà DOM không có
cách hỏi điều đó cho một `CustomEvent`. Nên kit đổi sang bật tường minh bằng
attribute/property. Hành vi sau khi bật thì giống hệt.
