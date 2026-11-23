# sd-* Interactive Components

*Group: Button, Checkbox, Radio, Badge — các component tương tác cơ bản, dùng trên mọi loại trang.*

---

## Tooltip dùng chung: `data-sd-tooltip`

Mọi phần tử đều bật tooltip bằng thuộc tính `data-sd-tooltip="nội dung"`, không cần thêm class hay viết JS riêng. Cơ chế do JS toàn cục trong `sd-components.js` lo, mirror directive `sdTooltip` của portal (`@sdcorejs/angular`).

- Một node dùng chung (`role="tooltip"`, `position: fixed`) gắn vào `document.body`, nên không bị cắt bởi khung `overflow: hidden` / `max-height` của section, drawer...
- Hiện khi hover hoặc focus, ẩn khi rời khỏi cả phần tử gốc lẫn tooltip, hoặc nhấn Escape, mất focus, scroll/resize. Độ trễ mặc định **100ms** (đúng `[sdTooltipDelay] = 100` của catalog; kit cũ để 200ms), đổi được bằng `data-sd-tooltip-delay`.
- Tooltip tương tác được: chuột di vào trong tooltip không làm nó đóng (có trễ rời 150ms cho khe hở), nút/link bên trong bấm và chạy sự kiện bình thường.
- Nội dung phong phú bằng `data-sd-tooltip-template`: trỏ tới id của một thẻ `<template>`, mỗi lần hiện thì chèn bản sao nội dung của template đó. Dùng cho tooltip nhiều dòng, có ảnh, có nút bấm.
- Vị trí mặc định phía dưới, canh giữa; hết chỗ thì lật sang phía đối diện, luôn kẹp trong khung nhìn.
- **Nhiều dòng (2026-10-11):** nội dung có ký tự xuống dòng (`\n`) thì node tooltip tự gắn lớp `sd-multiline-tooltip` (`white-space: pre-line`) và xuống dòng thật. Đây đúng cách catalog làm — `sd-badge` của thư viện dựng tooltip với `matTooltipClass="sd-multiline-tooltip"`. Trước đợt này `white-space: normal` nuốt mất xuống dòng, tooltip hai dòng dồn thành một.
- **Tên lớp của catalog:** node tooltip mang thêm `c-sd-tooltip-container` và dòng chữ mang `c-sd-tooltip-text`, đúng tên catalog dùng, nên CSS viết theo catalog khớp được. Lớp định vị `.c-sd-tooltip-panel.pos-*` là của Angular CDK — kit định vị bằng JS trên một node dùng chung nên không có (ghi ở `_memory/known-gaps.md`).
- Không dùng `title`: `title` là thuộc tính toàn cục của trình duyệt, tooltip gốc lan ra toàn vùng phần tử. Mọi phần tử đặt `data-sd-tooltip` trên chính thẻ. Ngoại lệ duy nhất là `sd-badge`: thư viện có input `tooltip` thật nên kit mirror lại, và nó nối xuống chính `data-sd-tooltip` bên trong.

| Attribute | Giá trị | Mặc định | Mô tả |
|-----------|--------|----------|-------|
| `data-sd-tooltip` | string | - | Nội dung text hiển thị |
| `data-sd-tooltip-position` | `top`, `bottom`, `left`, `right` | `bottom` | Vị trí tooltip; hết chỗ thì tự lật sang phía đối diện |
| `data-sd-tooltip-delay` | số mili giây | **`100`** | Độ trễ trước khi hiện |
| `data-sd-tooltip-color` | CSS color / token | **`#616161`** | Màu nền riêng cho tooltip này |
| `data-sd-tooltip-template` | id của thẻ `<template>` | - | Nội dung phong phú: sao chép nội dung thẻ `<template>` có id này. Không tìm thấy hoặc không phải `<template>` thì tự quay về text của `data-sd-tooltip` |

> **Hình thức (rà soát 2026-10-11 theo Core UI Catalog `#c-tooltip`,
> `.c-sd-tooltip-container`):** nền mặc định **`#616161`** (kit cũ `--sd-black500`
> `#212121`), bề ngang tối đa **250px** (kit cũ 320px), đệm `6px 8px`, bo 4px,
> chữ 12px trắng, **đổ bóng ba lớp của Material**
> (`0 2px 4px -1px #0003, 0 4px 5px #00000024, 0 1px 10px #0000001f`), chữ dài
> tự ngắt (`word-wrap: break-word`) và **bôi đen được**. Khoảng cách tới phần tử
> gốc 8px. Bốn vị trí `top` / `bottom` / `left` / `right` đúng tên catalog —
> `above`/`below`/`before`/`after` của Material vẫn nhận làm bí danh.

```html
<button data-sd-tooltip="Giải thích thêm">Mở</button>
<sd-button type="link" color="secondary" size="sm" prefixIcon="settings" title="Cài đặt" data-sd-tooltip="Mở cài đặt"></sd-button>

<template id="tpl-tooltip-mua-ngay">
  <div class="fs-12">
    <div class="font-weight-medium mb-4">Gói dịch vụ Vận hành - Nâng cao</div>
    <div>Phù hợp đơn vị có từ 50 nhân sự vận hành trở lên.</div>
    <sd-button type="fill" color="primary" size="sm" title="Mua ngay"></sd-button>
  </div>
</template>
<button data-sd-tooltip-template="tpl-tooltip-mua-ngay" data-sd-tooltip="Mua ngay">Xem dịch vụ</button>
```

---

## sd-button

Nút bấm — **ĐỒNG BỘ 2026-10-13 theo Core UI Catalog `#c-button` + mã thư viện
(`sd-angular-core-components-button.mjs` 19.0.10)** trên nền `mat-flat-button` /
`mat-stroked-button` / `mat-button`. API dưới đây là **đủ và chỉ đúng** khối API
của catalog (Rule 18).

| Attribute | Values | Default |
|-----------|--------|---------|
| `type` | `fill`, `light`, `outline`, `link` (bí danh cũ của kit: `text`) | `light` |
| `color` | `primary`, `secondary`, `info`, `success`, `warning`, `error` | `secondary` |
| `size` | `sm`, `md`, `lg` — cao 32 / 40 / 48px. **Trọng số chữ: sm 400 · md 400 · lg 500** (xem ghi chú dưới) | `sm` |
| `title` | Chữ trên nút | — |
| `prefixIcon` / `suffixIcon` | Tên Material Icon | — |
| `fontSet` | Bộ icon cho cả hai icon trên | `material-icons-outlined` |
| `tooltip` | string — `matTooltip`: bong bóng kiểu Material (`data-sd-tooltip-kind="mat"`), hiện ngay, vị trí `above` | — |
| `width` | CSS width đặt thẳng lên `<button>`, ví dụ `200px` — title dài bị cắt ba chấm | — |
| `disabled` | boolean | `false` |
| `loading` | boolean — thay `prefixIcon` bằng vòng xoay 18px, khoá nút, mờ .85 | `false` |
| `block` | boolean — chiếm trọn chiều ngang | `false` |
| `htmlType` | `button`, `submit`, `reset` | `button` |
| `autoId` | string — ra `data-autoid="components-button-{giá trị}"` | — |
| `(click)` | sự kiện `click` trên thẻ (`onclick` / `addEventListener('click')`) | — |

> **Trọng số chữ KHÔNG đều giữa ba cỡ — đúng catalog, không phải lỗi kit.**
> `sm` và `md` là **400 Regular**, `lg` là **500 Medium**. Catalog khai rõ `font-weight: 400` cho `.c-sm` và `.c-md` nhưng **quên khai cho `.c-lg`**, nên `lg` rơi về nền 500 của Material (`--mat-sys-label-large-weight`). Builder đã xem ảnh so ba phương án và chốt 2026-10-12 là **mirror nguyên chỗ mâu thuẫn này**.
> Trong CSS, con số nằm ở rule nền `sd-button .c-button { font-weight: 500 }` rồi `.c-sm`/`.c-md` đè 400 — **`.c-lg` cố ý không khai**. Muốn 500 cả ba thì xoá hai dòng `font-weight: 400`; đừng thêm dòng mới vào `.c-lg`.

**Không có trong thư viện 19.0.10 — kit đã GỠ 2026-10-13 (Rule 18):** menu hành động
`sd-button-item` / `sd-button-item-divider` (cùng `openOnHover`, `openMenu()` / `closeMenu()`),
màu `black`, sự kiện `sd-click`, và **nhãn viết trong thẻ** — thư viện không có `ng-content`,
nên `<sd-button>Lưu</sd-button>` ra nút **trống**: luôn dùng `title`. Catalog không có nút mở
menu — trang cần thì báo Builder là **thiếu năng lực** (Rule 0b), đừng tự chế.

**Nút chỉ-icon dùng `prefixIcon`.** Có icon mà không có `title` → lớp `c-square`, nút vuông
đúng bằng chiều cao của size. Riêng trường hợp **chỉ khai `suffixIcon`** (không title, không
prefixIcon), template thư viện có hai nhánh cùng khớp nên vẽ **hai icon** cạnh nhau — kit giữ
y bản thật; đừng viết kiểu đó.

**Tên kiểu nút thứ tư.** Catalog 19.0.10 gọi là `link` và sinh class `c-link`;
gói npm 22.2.12 gọi là `text`. Kit **sinh ra `c-link`** đúng catalog và vẫn
nhận `text` làm bí danh đầu vào (Rule 18 ngoại lệ 3).

**Số đo theo `size`:**

| size | cao | chữ | padding | icon | nút vuông |
|---|---|---|---|---|---|
| `sm` | 32px | 14px | 2px 12px | 16px | 32×32, padding 0 |
| `md` | 40px | 16px | 2px 16px | 20px | 40×40, padding 0 |
| `lg` | 48px | 16px | 2px 16px | 24px | 48×48, padding 0 |

`size` khác ba giá trị trên → thư viện không gắn lớp cỡ nào (kit y vậy). **`type` khác bốn giá trị
`fill` / `light` / `outline` / `link` (so đúng chữ, kể cả hoa / thường) → thư viện KHÔNG vẽ nút**, thẻ rỗng — kit y
vậy (bí danh `text` vẫn nhận). Bỏ trống `type` thì ra `light`.

### Hình thức (catalog 19.0.10)

| | Giá trị |
|---|---|
| `color="secondary"` | **#000 đen tuyền** |
| Viền `outline` | **#d3d3d3** |
| Khoảng cách icon ↔ chữ | `.ml-8` / `.mr-8` **trên nhãn** |
| `disabled` | nền **#e9e9e9**, chữ **#a6a6a6**, mờ **.5** — **mọi type** |
| Hover / focus bàn phím / bấm | phủ **lớp màu mờ** (state layer) 4% / 12% / 12% — không có viền focus (`:focus{outline:none}`) |
| Con trỏ | `pointer` khi rê, `wait` khi loading, `not-allowed` khi disabled (đặt trên thẻ host) |

**Lớp phủ hover (state layer)** đổi màu theo type + color, đúng Material:

| | `color="primary"` | các màu còn lại |
|---|---|---|
| `fill`, `light` | `#fff` → nút **SÁNG** lên | `rgba(0,0,0,.87)` → tối đi |
| `outline`, `link` | màu chủ đạo | `rgba(0,0,0,.87)` |

**Một chỗ catalog tự mâu thuẫn, kit chép lại nguyên tình trạng:** rule màu
`secondary` mang `!important` và nhiều class hơn rule `[disabled]`, nên nút
`color="secondary"` lúc disabled **vẫn giữ nền/chữ đen** thay vì xám như các
màu khác.

**Hành vi click giống hệt thư viện:** khi `disabled` hoặc `loading`, click bị
nghiền nát ngay ở **pha capture** — không listener nào nhận được, kể cả
`onclick` đặt trên thẻ cha. Click hợp lệ bị **throttle 300ms** (chỉ tính lần
đầu trong mỗi 300ms), nên bấm hai phát liên tiếp chỉ chạy một lần.

### Chọn type theo vai trò nút

Cụm nút trong hộp thoại (modal, drawer, popover) xếp theo ba bậc phân cấp thị giác, mạnh xuống yếu, tất cả cùng `color="primary"`:

| Bậc | Vai trò | Kiểu nút |
|-----|---------|----------|
| 1 | Hành động chính (Lưu, Gửi duyệt, Xác nhận) | `type="fill" color="primary"` |
| 2 | Hành động phụ trong cùng cụm CTA | `type="light" color="primary"` |
| 3 | Thoát ra, không làm gì (Bỏ qua, Thoát, Quay lại) | `type="link" color="primary"` |

- Nút thoát phải kém hẳn hai bậc trên: dùng `light color="secondary"` hay `outline` làm nó nổi ngang hàng các nút CTA, sai.
- `type="link"` với `color="secondary"` thì chữ quá mờ, nhìn giống nút bị vô hiệu hoá. Nên bậc 3 vẫn phải `color="primary"`.
- Hạn chế tối đa `type="outline"`: viền của dạng nút này gây tải thị giác không cần thiết cho giao diện enterprise portal vốn đã rối rắm. Chỉ dùng khi không còn lựa chọn nào khả dĩ, và prototype phải ghi comment lý do.

```html
<sd-button type="fill" color="primary" title="Lưu"></sd-button>
<sd-button type="light" color="error" prefixIcon="delete" title="Xóa"></sd-button>
<sd-button type="link" color="primary" title="Bỏ qua"></sd-button>
<sd-button type="light" color="primary" size="sm" prefixIcon="add" title="Thêm"></sd-button>
```

**type mapping:**

| type | Dùng khi |
|------|---------|
| `fill` | Primary CTA (Lưu, Tạo mới, Thực thi) — chỉ 1 per page |
| `outline` | Secondary action (Tạm dừng) — hạn chế tối đa (Rule 19) |
| `light` | Tertiary action trong section header / card |
| `text` (hay `link`) | Ghost / table footer actions (Tải lại, Xuất, Bỏ qua) |

**Mapping từ CSS cũ:**
- `.btn .btn-primary` → `<sd-button type="fill" color="primary">`
- `.btn .btn-secondary` → `<sd-button type="light" color="primary">`
- `.btn .btn-ghost` → `<sd-button type="link" color="primary">`
- `.btn .btn-outline-primary` → `<sd-button type="outline" color="primary">` - bảng tra cứu di trú CSS cũ, không phải khuyến nghị dùng; outline là kiểu ít dùng nhất, xem mục "Chọn type theo vai trò nút" khi nào được dùng.
- `.btn .btn-danger` → `<sd-button type="fill" color="error">`

---

## sd-checkbox

Chọn nhiều lựa chọn độc lập (đa lựa chọn), hoặc xác nhận một hành động đơn lẻ. Figma: OMEU Checkbox & Radio.

| Attribute | Values | Default |
|-----------|--------|---------|
| `label` | string | — |
| `color` | `primary` \| `secondary` \| `info` \| `success` \| `warning` \| `error` | `primary` |
| `checked` | boolean | `false` |
| `disabled` | boolean | `false` |
| `viewed` | `false` \| `true` | `false` |
| `inlineError` | string | `''` |
| `autoId` | string | — |
| `name` | string | — |

> **Hình thức (2026-10-14):** DOM `mat-checkbox` Material và CSS **nguyên văn catalog `#c-checkbox`** (67 luật) — ô 18px,
> viền 2px, bo 2px, nền trong suốt khi chưa tích, vùng bấm / state layer 28px (mật độ −3), nhãn cách ô 4px, lỗi inline là
> `mat-error`. Một cỡ (catalog không có `size`). Không viết CSS đè vào ruột `mat-checkbox` (Rule 0b nhóm A).

Ba điểm dễ hiểu sai, đều đã đối chiếu source thật của `@sdcorejs/angular` v22.2.12:

- **`color` chỉ đổi màu ô ĐÃ TÍCH** (và vòng focus bàn phím) — chưa tích thì mọi màu viền
  giống hệt nhau. Thư viện chỉ ghi đè nhóm biến `--mdc-checkbox-selected-*`.
- **`viewed`** (boolean, catalog 19.0.10): `true` = hai dòng tĩnh — nhãn `T14R text-black400` + **"Có" / "Không"** `T14M`.
  `viewed="false"` là KHÔNG viewed (`booleanAttribute`). Giá trị `inline` cũ của kit nay coi như `true`.
- **`inlineError` chỉ hiện SAU KHI người dùng chạm vào ô** (`formControl.touched` bên thư
  viện) — mới tải trang thì chưa thấy gì, giống cách `sd-input` của kit báo lỗi.

```html
<sd-checkbox label="Nhận thông báo qua email"></sd-checkbox>
<sd-checkbox label="Đã chọn" checked></sd-checkbox>
<sd-checkbox label="Đã duyệt" color="success" checked></sd-checkbox>
<sd-checkbox label="Disabled — đã chọn" checked disabled></sd-checkbox>
<sd-checkbox label="Bắt buộc đồng ý điều khoản" inlineError="Vui lòng đồng ý để tiếp tục"></sd-checkbox>
<sd-checkbox label="Đồng ý điều khoản" viewed="true" checked></sd-checkbox>
```

**Legacy — KHÔNG có trong `SdCheckbox` thật, chỉ giữ để trang đã tạo không vỡ. Trang mới không dùng:**

| Attribute | Dùng gì thay thế |
|-----------|------------------|
| `indeterminate` | Thư viện thật đặt nó trên mat-checkbox **nội bộ của `sd-table`** (`[indeterminate]="isGroupIndeterminate(item)"`), không phơi ra trên `sd-checkbox`. Cần chọn-tất-cả tri-state thì dùng cột `selectable` của `sd-table`. |
| `helperText` | Không có tương đương — `SdCheckbox` chỉ có `label` |
| `error` (boolean) | `inlineError` (chuỗi) |
| `value` | Không có tương đương — `SdCheckbox` chỉ có `name` + `model` |

> `checked` là **bí danh cố ý** của `model` bên Angular (`<sd-checkbox [(model)]="value">`),
> giữ cho JS sẵn có của prototype — không phải sót tên.
> Input thứ 10 của thư viện là `form` (`ɵSdFormControlParent`): thuần Angular Reactive Forms,
> không có nghĩa trong HTML tĩnh nên kit không mirror.

**Checkbox Group (vertical) — dùng `.flex.flex-col.gap-4`:**

```html
<div class="flex flex-col gap-4">
  <sd-checkbox name="channel" label="Email" checked></sd-checkbox>
  <sd-checkbox name="channel" label="SMS"></sd-checkbox>
  <sd-checkbox name="channel" label="Push notification"></sd-checkbox>
</div>
```

**Events:** `sd-change` — `detail: { checked: boolean, value: string }`.

**Dùng khi:** đa lựa chọn trong form/filter, đồng ý điều khoản (single checkbox). Chọn tất cả/chọn hàng loạt trong bảng thì dùng cột `selectable` của `sd-table`, không tự dựng bằng `sd-checkbox`.
**Không dùng khi:** chỉ chọn 1 trong nhiều — dùng `sd-radio`; bật/tắt cài đặt ngay lập tức — dùng Switch (DS chưa có).

---

## sd-radio

Bắt buộc chọn đúng 1 trong số các lựa chọn loại trừ lẫn nhau.

**Rà soát 2026-10-10 — hai bản không cùng một thứ.** `sd-radio` của thư viện là
**một NHÓM radio**: nhận `items` rồi tự dựng từng lựa chọn, và `model` là **giá
trị đang chọn**. Bản trước của kit là **một nút đơn lẻ**, `model` là boolean đã
tích chưa, gom nhóm bằng cách dùng chung `name`.

Cách hoà: **có `items` thì chạy chế độ nhóm (đúng thư viện), không có `items`
thì giữ nguyên chế độ nút đơn cũ.** 20 chỗ trong kit đang dùng nút đơn, không
chỗ nào phải sửa.

### Chế độ nhóm — đúng thư viện

| Attribute | Values | Default |
|-----------|--------|---------|
| `items` | JSON `[{"id":"..","name":".."}]`; item có `disabled: true` thì bị khoá | `[]` |
| `valueField` / `displayField` | Tên trường lấy giá trị / chữ hiển thị | `id` / `name` |
| `value` | Giá trị đang chọn (= `model`) | — |
| `display` | `row` · `column` | `row` |
| `label` | Nhãn của cả nhóm | — |
| `placeholder` | Chữ hiện khi `items` rỗng | — |
| `color` | 6 màu hệ thống — đổi màu chấm và viền ô đã chọn | `primary` |
| `required` | boolean — lỗi "Vui lòng nhập thông tin" sau khi chạm vào | `false` |
| `inlineError` | Lỗi từ bên ngoài — hiện ngay, không chờ chạm | — |
| `viewed` | `false` · `true` · `inline` — `true` hiện chữ của lựa chọn đang chọn | `false` |
| `autoId` | Ra `data-autoid="forms-radio-{giá trị}"` | — |

```html
<sd-radio label="Loại khách hàng" value="personal"
  items='[{"id":"personal","name":"Cá nhân"},{"id":"business","name":"Doanh nghiệp"}]'
></sd-radio>
```

Sự kiện `sd-change` mang `detail: { value }`.

**DOM (2026-10-13) — Material đúng `#c-radio`:** `<section class="c-section">` (xếp dọc: `<section>`) ›
`<sd-label>` › `mat-radio-group.mat-mdc-radio-group.c-radio-group-row|column` › `mat-radio-button.mat-mdc-radio-button
.mr-16|m-0.mat-accent[.mat-mdc-radio-checked]` › `.mdc-radio` (input `.mdc-radio__native-control` + vòng) +
`label.mdc-label`; lỗi là `mat-error` trong `section`; host mang lớp `sd-c-{color}`. CSS chép nguyên `radio.css`
của catalog. Trong `sd-form-render` vẽ dạng rút gọn của `#c-form-generic` (`mat-primary`, không touch-target / ripple).
Chế độ xem: `div.T14R.text-black400` + `div.T14M` (không qua `sd-view`, đúng template thư viện).

### Chế độ nút đơn — bản cũ của kit, vẫn chạy

| Attribute | Values | Default |
|-----------|--------|---------|
| `label` | string | — |
| `helperText` | string | — |
| `checked` | boolean (= `model` ở chế độ này) | `false` |
| `disabled` | boolean | `false` |
| `error` | boolean | `false` |
| `name` | **Bắt buộc trùng nhau** giữa các `sd-radio` cùng nhóm | — |
| `value` | string | — |

> Radio chỉ có **1 cỡ duy nhất** (không có attribute `size`).

> **Hình thức (rà soát 2026-10-11 theo Core UI Catalog `@sd-angular/core` 19.0.10):**
> vùng bấm **28×28**, vòng ngoài **20×20 viền 2px**, chấm trong **10×10**, nhãn cách ô **4px**.
> Chưa chọn `rgba(0,0,0,.54)`; đã chọn viền + chấm cùng màu theo `color`.
> **Hover chưa chọn chỉ ĐẬM viền** lên `rgba(0,0,0,.87)`, **không tô nền**; **hover đã chọn giữ
> nguyên màu** (catalog dùng chung một biến cho cả hai trạng thái). Xếp **dọc thì các lựa chọn
> cách nhau 0**, xếp ngang cách nhau 16px. Disabled: viền/chấm `rgba(0,0,0,.87)` mờ `.38`,
> nhãn mờ 38% — không phải mờ cả cụm.

```html
<sd-radio name="payment" value="card" label="Thẻ tín dụng / ghi nợ" checked></sd-radio>
<sd-radio name="payment" value="bank" label="Chuyển khoản ngân hàng"></sd-radio>
<sd-radio name="payment" value="ewallet" label="Ví điện tử" disabled></sd-radio>
<sd-radio name="payment" value="cod" label="Thanh toán khi nhận hàng"></sd-radio>
```

**Events:** `sd-change` — `detail: { checked: boolean, value: string }`.

**Dùng khi:** bắt buộc chọn đúng 1 lựa chọn (2-5 items, hiển thị tất cả cùng lúc), phương thức thanh toán, loại tài khoản.
**Không dùng khi:** cho phép chọn nhiều — dùng `sd-checkbox`; danh sách dài (>5 items) — dùng `sd-select`.

---

## sd-badge

Nhãn trạng thái và nhãn phân loại — **ĐỒNG BỘ 2026-10-13 theo catalog `#c-badge` + mã thư viện
(`sd-angular-core-components-badge.mjs` 19.0.10)**: 32/32 badge của catalog trùng DOM, toạ độ, màu,
chữ; tooltip trùng từng px. (Lần rà đầu 2026-10-10 theo gói npm 22.2.12 — cùng API.)

| Attribute | Values | Default |
|-----------|--------|---------|
| `type` | `icon`, `round`, `tag` | `icon` |
| `color` | `primary`, `secondary`, `info`, `success`, `warning`, `error` | `secondary` |
| `primary` … `error` | boolean — 6 cờ, bật cái nào thắng `color` | `false` |
| `size` | `sm`, `md`, `lg` | `sm` |
| `title` | Chữ chính | — |
| `description` | Chữ phụ — **chỉ `icon` và `tag` hiện**, `round` bỏ qua | — |
| `icon` | Tên Material Icon | `fiber_manual_record` |
| `fontSet` | `material-icons`, `material-icons-outlined`, … | `material-icons` (đặc — đúng catalog; trước 2026-10-13 kit để outlined theo gói npm) |
| `tooltip` | string, xuống dòng bằng `&#10;` — `matTooltip` (bong bóng Material, hiện ngay, `above`) | — |

### Ba type thật của thư viện

```html
<!-- icon (mặc định): icon + chữ, không nền. Không khai icon thì ra chấm tròn -->
<sd-badge color="success" title="Đã duyệt"></sd-badge>
<sd-badge color="error" icon="error" size="lg" title="Quá hạn" description="trễ 5 ngày"></sd-badge>

<!-- round: viên thuốc, bo 20px, nền --sd-{color}-light + chữ --sd-{color} -->
<!-- (quy ước kit 2026-10-14) round chỉ cho nhãn PHÂN LOẠI — trạng thái lifecycle dùng kiểu icon + STATUS_MAP -->
<sd-badge type="round" color="info" title="SAP HCM"></sd-badge>
<sd-badge type="round" color="secondary" icon="person" fontSet="material-icons-outlined" title="Cấp 2"></sd-badge>

<!-- tag: khung viền 1px, bo 4px — type duy nhất hiện description trong khung -->
<sd-badge type="tag" color="warning" icon="event"
          title="Đến hạn 15/10/2026" description="Kỳ trả lãi số 4"></sd-badge>
```

Số đo theo `size` (lấy từ SCSS biên dịch của thư viện):

| size | icon | chữ title | padding round | padding tag |
|---|---|---|---|---|
| `sm` | 16px | 14px | 2px 10px | 1px 7px |
| `md` | 18px | 16px | 4px 12px | 2px 10px |
| `lg` | 24px | 18px | 6px 16px | 4px 12px |

Nền dùng `--sd-{color}-light`, chữ và viền dùng `--sd-{color}` — cả 6 màu. `size` / `color` / `fontSet`
ngoài danh sách → **không có lớp** tương ứng (ngClass của thư viện chỉ sinh lớp cho giá trị đã biết); `type` lạ →
nhánh cuối của template (`d-flex`, không `c-badge-icon`).

**Đổi nghĩa cần biết khi đọc code cũ:** trước 2026-10-10, `type="tag"` của kit
render ra viên thuốc còn `type="round"` render ra vòng tròn đếm số — cả hai đều
không có trong thư viện. Đã đổi toàn bộ call site `tag` cũ sang `round` để giữ
nguyên hình thức; `tag` nay mang đúng nghĩa khung viền. Không còn kiểu badge
tròn đếm số — cần con số thì dùng `round` có `title` là số.

**Badge bấm được:** đặt `onclick` hoặc `data-sd-clickable` thì khung badge nhận
lớp `pointer` — đúng nhánh `click.observed` của thư viện. Thư viện KHÔNG gắn
`role` / `tabindex` (khung mang `aria-hidden="true"`), kit cũng không (rà soát
2026-10-13; bản trước tự thêm role=button + Enter/Space). Cần bấm bằng bàn phím
thì bọc badge trong `<button>` của trang.

**Click không nổi lên cha:** thư viện `(click)="onClick($event)"` → `event.stopPropagation(); click.emit(event)`
— LUÔN chặn, kể cả khi không ai nghe. Kit y vậy (2026-10-13): `onclick` / `addEventListener('click')` trên
chính `<sd-badge>` vẫn chạy, nhưng hàng `tr[onclick]` / thẻ cha chứa badge **không** nhận cú bấm vào badge.

**DOM theo catalog (2026-10-13):** khung `<div aria-hidden="true" class="…">` có
`mat-mdc-tooltip-trigger`; nhánh icon là `d-flex c-badge-icon` › `c-icon d-flex
align-items-center` › `span.c-material-icon.mr-4.c-SIZE.FONT.c-COLOR` + `div.d-flex.flex-column`
(secondary của icon ra `c-black400`). Thứ tự lớp theo mục chứa: `#c-history` ra
`d-flex c-badge-icon mat-mdc-tooltip-trigger`; trong `sd-table` / `sd-import-excel`
không có trigger. Component của kit tự sinh badge (sd-history, sd-table useBadge,
sd-import-excel) truyền cấu hình qua `data-sd-cfg` — badge đọc rồi gỡ, host trống
thuộc tính như catalog.

### Trạng thái lifecycle — bảng tra STATUS_MAP → `color` + `icon` (API catalog)

**`type="status"` / `status="…"` đã GỠ 2026-10-13** — thư viện 19.0.10 chỉ có `icon` / `round` / `tag`
(Builder chọn "giống catalog nhất"). Trạng thái lifecycle nay viết bằng **`type="icon"` (mặc định) +
`color` + `icon`** (+ `fontSet="material-icons-outlined"` khi icon viền) tra từ bảng dưới — bảng là quy
ước của kit để mọi trang thống nhất, không phải thuộc tính của `sd-badge`. **Trang mới không viết `type="status"`.**
Trang CŨ còn `type="status" status="…"` (nhất là badge dựng bằng JS mà `migrate-prototype.mjs` không với tới) thì kit vẫn nhận làm
bí danh (2026-10-15, Rule 18 ngoại lệ 3): vẽ đúng badge icon tra bảng dưới, chữ = `title` hoặc khoá viết hoa chữ đầu — trước đó rơi về
chấm tròn xám không chữ. Angular không có bí danh này. JS: `sdStatusBadge(khoá, nhãn)` trả về
thẻ đúng; cột `type:"status"` của `sd-table` và `data-badge-status` của page-header tự tra bảng này.

```html
<sd-badge color="success" icon="play_circle" title="Active"></sd-badge>
<sd-badge color="info" icon="access_time" fontSet="material-icons-outlined" title="Chờ duyệt"></sd-badge>
<sd-badge color="success" icon="thumb_up" fontSet="material-icons-outlined" title="Đã duyệt"></sd-badge>
<sd-badge color="error" icon="thumb_down" fontSet="material-icons-outlined" title="Từ chối"></sd-badge>
```

**Status key → semantic mapping:**

| Semantic | Trạng thái | `icon` | `color` |
|----------|-----|------|-------|
| **New** | `unknown` | help_outline | info |
| | `new` | circle | info |
| **Processing** | `pending` | pending | info |
| | `waiting` | access_time | info |
| | `inprogress` | timelapse | info |
| **Success** | `checked` | task_alt | success |
| | `active` | play_circle | success |
| | `success` | check_circle | success |
| **Warning** | `paused` | pause_circle | warning |
| | `warning` | warning | warning |
| **Error** | `blocked` | block | error |
| | `error` | error | error |
| **End** | `cancelled` | cancel | secondary |
| | `deactivated` | remove_circle | secondary |
| | `removed` | remove_circle_outline | secondary |
| **Extend** | `approved` | thumb_up | success |
| | `denied` | thumb_down | error |

**Cách chọn status:**

| Khi label là... | Dùng status |
|----------------|-------------|
| Đang bán / Đang hoạt động | `active` |
| Nháp / Chưa rõ | `pending` |
| Chờ duyệt / Chờ kiểm tra | `waiting` |
| Đang xử lý | `inprogress` |
| Đã duyệt | `approved` |
| Từ chối | `denied` |
| Đã hoàn tất | `success` |
| Tạm dừng | `paused` |
| Đã huỷ | `cancelled` |
| Ngừng hoạt động | `deactivated` |

> ⚠️ `pending` = Nháp (chưa bắt đầu) — **không phải** Chờ duyệt. Dùng `waiting` cho Chờ duyệt.

---

## sd-inform

Dải thông báo nằm trong trang (không phải toast). **Luôn dùng `<sd-inform>` cho mọi alert/banner — KHÔNG viết HTML thuần (`<div class="alert alert-...">`).**

**Đồng bộ 2026-10-13** theo catalog `#c-inform` + mã thư viện `@sd-angular/core` 19.0.10 — DOM, lớp và
computed style trùng 13 mẫu catalog. Preview: [components/inform.html](../preview/components/inform.html).

> **Lệch catalog CÓ CHỦ Ý — màu tiêu đề** (Builder 2026-10-15: *„Tiêu đề trong inform đang để màu theo loại inform -> update lại theo
> màu của text. Chấp nhận khác core“*): catalog tô tiêu đề theo màu của loại (warning cam, info xanh…); kit để tiêu đề **cùng màu chữ
> thân** `--sd-black500` (#212121), vẫn 14px/600. Viền, nền, icon giữ màu của loại như catalog. Lớp cũ `.alert.alert-X` vẽ theo cùng
> quy tắc. Dịch sang Angular: thêm CSS ghi đè `.c-inform-title { color: var(--sd-black500) }` cho dự án nếu muốn giữ hình này.

| Attribute | Values | Default |
|-----------|--------|---------|
| `color` | `primary`, `secondary`, `info`, `success`, `warning`, `error` | `primary` |
| `primary` … `error` | boolean — 6 cờ, bật cái nào thắng `color` | `false` |
| `title` | Tiêu đề 14px/600, cùng màu icon | — |
| `description` | Phần thân | — |
| `icon` | **Tên** Material Icon — ghi đè icon mặc định của màu | theo màu |
| `hideIcon` | boolean — bỏ icon | `false` |
| `fontSet` | `material-icons` · `material-icons-outlined` · `-round` · `-sharp` | `material-icons` (đặc, như thư viện) |
| `closable` | boolean — nút X: bỏ nội dung (thẻ host ở lại, rỗng), phát `sd-closed` | `false` |
| `actionLabel` | Link chữ màu info dưới phần thân, phát `sd-action` (bị bỏ qua khi có slot) | — |
| `lineClamp` | number — cắt thân còn N dòng; Xem thêm / Thu gọn chỉ hiện khi tràn | — |
| `autoId` | `data-autoid` trên `.c-inform` | — |

Slot `[sdInformAction]`: vùng hành động riêng dưới phần thân (vd. hai `sd-button size="sm"`), thắng `actionLabel`.

Icon mặc định theo màu: `primary`/`secondary`/`info` → `info`, `success` → `check_circle`,
`warning` → `warning`, `error` → `error`. `error` và `warning` nhận `role="alert"`, bốn màu còn lại
`role="status"` — đúng `liveRole()` của thư viện.

```html
<sd-inform color="warning" title="Khoản thu đã quá hạn 14 ngày"
           description="Hạn thanh toán 20/06/2026. Số tiền còn phải thu 450.000.000 VNĐ."></sd-inform>

<!-- Dải báo trạng thái hồ sơ (bị từ chối / trả về) — KHÔNG tự dựng div tô màu -->
<sd-inform color="warning" class="mb-16"
           title="Chuyên viên thẩm định Vũ Kim Ngân đã từ chối hồ sơ này và trả về bạn"
           description="Hồ sơ pháp lý của nhà thầu chưa đầy đủ: thiếu hợp đồng gốc đã ký và biên bản nghiệm thu giai đoạn 2."></sd-inform>

<sd-inform color="error" closable actionLabel="Tải lại"
           title="Không tải được dữ liệu" description="Kết nối tới dịch vụ bị gián đoạn."></sd-inform>

<sd-inform color="warning" title="Vùng hành động tuỳ biến" description="Dùng [sdInformAction] khi cần nhiều hơn một link.">
  <div sdInformAction class="flex align-items-center gap-12">
    <sd-button type="light" color="warning" size="sm" title="Để sau"></sd-button>
    <sd-button type="fill" color="warning" size="sm" title="Xử lý ngay"></sd-button>
  </div>
</sd-inform>
```

**Bí danh cũ của kit, vẫn chạy (Rule 18 ngoại lệ 3) — trang mới dùng API catalog ở trên:**

| Cũ | Nay là |
|---|---|
| `type="neutral · inform · positive · warning · negative"` | `color="secondary · info · success · warning · error"` |
| `dismissible` | `closable` |
| `cta="..."` | `actionLabel="..."` |
| nội dung viết trong thẻ (cho phép `<strong>`) | `description` (thân chữ thường); không khai `description` thì nội dung trong thẻ làm thân |
| sự kiện `sd-inform-dismiss` | `sd-closed` (cả hai đều được phát) |

Khai `type` là chạy theo lối cũ về icon: không khai attribute `icon` thì **không có icon** (16 banner cũ
cố ý không icon). Khai `color` là chạy theo thư viện: luôn có icon trừ khi `hideIcon`.

**Dùng khi:** banner cảnh báo/lưu ý ở đầu trang hoặc trong section (quá hạn, đang chờ duyệt, ghi chú điều kiện áp dụng...).
**Không dùng khi:** trạng thái lifecycle của 1 record cụ thể — dùng `sd-badge` (color + icon theo bảng tra STATUS_MAP); thông báo thoáng qua — dùng `SdNotifyService`.

**Mapping từ CSS cũ:** `.alert.alert-info` → `<sd-inform color="info">`, `.alert.alert-warning` → `<sd-inform color="warning">`, `.alert.alert-success` → `<sd-inform color="success">`, `.alert.alert-error` → `<sd-inform color="error">`.

---

## sd-dropdown-menu / sd-dropdown-item

Kiểu menu bung ra dùng chung, không bị khoá trong `sd-select`. Rule global chỉ lo phần kiểu dáng (nền, viền, bo góc, đổ bóng cho menu; padding, chữ, màu, con trỏ, hover cho item). `sd-select` vẫn giữ rule riêng cho vị trí và đóng/mở, nên menu ngoài select tự lo vị trí và display.

**.sd-dropdown-menu** - nền trắng, viền `--sd-black200`, bo góc, đổ bóng.
**.sd-dropdown-item** - reset nền/viền mặc định của `<button>`, padding `8px 12px`, font 14px, chữ `--sd-black500`, con trỏ tay, hover nền `--sd-black100`.

```html
<div class="sd-dropdown-menu">
  <button type="button" class="sd-dropdown-item">Hành động 1</button>
  <button type="button" class="sd-dropdown-item">Hành động 2</button>
</div>
```

> `.sd-dropdown-menu` không đặt vị trí: khung bung ra phải tự định vị (ví dụ `position: absolute` trong wrapper tương đối) và tự bật/tắt display.
> `.sd-dropdown-item` không đặt bố cục (display, width, text-align): trang dùng ngoài select tự lo bố cục, DS chỉ lo kiểu dáng.
> Không dùng `sd-button` làm dòng menu khi hover cần nền trung tính `--sd-black100` - mọi kiểu nút của DS đều sơn nền thương hiệu khi hover.

**Dùng khi:** menu hành động (action menu) trong card/bảng, khi DS chưa có thành phần dropdown riêng.
**Không dùng khi:** chọn giá trị trong form - dùng `sd-select`.
