# sd-* Layout Components

*Group: Section containers — dùng để nhóm nội dung trong Add / Edit / Read pages.*

---

## sd-section

Card/section container — dùng cho cả form cards (Add/Edit) và detail cards (Read).

> ⚠️ **KHÔNG dùng `icon` trên title của `sd-section`** — áp dụng cho mọi trường hợp: Add/Edit form, Read page (`detail-cards-row` hay section full-width), 2-column sub-sections. Theo Figma: MAG Sales Platform | Design System, node 62938:1961 (anatomy "sd-section" không có icon trên title, chỉ có icon ở component khác như status/action). Card đánh số (Variant D) ghi số ngay trong `title` ("1. Masterise → Coteccons", "Luồng 2") — `avatar` đã gỡ 2026-10-12 vì catalog không có.

| Attribute | Values | Default |
|-----------|--------|---------|
| `title` | Section title | — |
| `subTitle` | Secondary text | — |
| `icon` | Material Icon outlined, 24px, cách tiêu đề 8px — **không dùng** trên trang của kit (quy ước ở trên) | — |
| `iconColor` | `primary`, `info`, `success`... | `primary` |
| `collapsible` | boolean — bấm cả header để gập/mở (chevron 24px bên phải). **Đây là tên thật của thư viện.** | — |
| `collapsable` | boolean — bí danh cũ của kit, vẫn đọc được để không vỡ trang đã dựng | — |
| `collapsed` | boolean — đang thu gọn: body ẩn (`hidden`), vỏ mất bóng. `el.collapsed` đọc/ghi; bấm header bắn `sd-collapsed-change` (`detail.collapsed`) ≈ `[(collapsed)]` của catalog | — |
| `hideHeader` | boolean — chỉ còn khung trắng; body luôn hiện kể cả khi `collapsed` | — |
| `noPaddingBody` | boolean — bắt buộc khi dùng sd-section-item | — |

Hình theo catalog `#c-section` (rà 2026-10-12, Builder: *"làm giống y hệt"*): component **không có margin** — khoảng 16px giữa các section xếp chồng do bố cục trang của kit lo (`page-patterns.css`; `.mb-0` trên section vẫn tắt được); header đệm 8px 16px, **không** min-height (chỉ tiêu đề = 40px, có phụ đề = 56px), con trỏ tay cả khi không collapsible; đường kẻ #e6e6e6 là **viền trên của body** (không có khi `hideHeader`); body đệm 16px hoặc 0.

**Slots:**

| Slot | Mô tả |
|------|-------|
| `[sdHeaderRight]` | Phần tử đặt NGUYÊN bên phải header, sát trước chevron (catalog không chừa khe) — tự xếp con bằng `d-flex align-items-center gap-8`. Click vào actions trong vùng này **không** collapse card. `slot="header-right"` cũ đã gỡ 2026-10-12 |
| `[sdHeaderLeft]` | Nội dung thêm vào CUỐI vùng trái, sau icon và cụm title/subTitle. `slot="header-left"` cũ đã gỡ 2026-10-12 |

**CSS helpers:**

| Class | Mô tả |
|-------|-------|
| `.c-header-divider` | Divider dọc (1×12px) ngăn cách nhóm actions trong `[sdHeaderRight]` |
| `.form-grid-2` | Grid 2 cột cho form fields |
| `.form-sections-2col` | Grid 2 cột cho 2 sd-section song song |

### Variant A — Form card (Add/Edit)

```html
<sd-section title="Thông tin chung" collapsible>
  <div class="form-sub-group">
    <div class="form-sub-group-label">Nhóm field</div>
    <div class="form-sub-group-content">
      <div class="form-grid-4">
        <!-- sd-input, sd-select, ... -->
      </div>
    </div>
  </div>
</sd-section>
```

### Variant B — Detail card (Read) với section items

```html
<sd-section title="Thông tin cơ bản" noPaddingBody collapsible>
  <sd-section-item label="Mã">SP-001</sd-section-item>
  <sd-section-item label="Tên">Sản phẩm A</sd-section-item>
  <sd-section-item label="Trạng thái">
    <sd-badge color="success" icon="play_circle" title="Hoạt động"></sd-badge>
  </sd-section-item>
</sd-section>
```

### Variant C — Subtitle metadata (lịch sử, ghi chú)

**Không dùng `icon`** — chỉ `subtitle` để hiện metadata phụ (VD: số bản ghi).

```html
<sd-section title="Lịch sử thay đổi" subtitle="3 bản ghi" collapsible noPaddingBody>
  <sd-section-item label="13/04/2026">Cập nhật bởi Admin</sd-section-item>
</sd-section>
```

### Variant F — Full-width section chia nhóm con (Read)

Dùng khi 1 section full-width có nhiều field không chia đều cho `detail-cards-row` (3 cột). Title nhóm con là text đậm full-width (`.detail-section-group-title`) — **KHÔNG dùng `.form-sub-group`** (pattern đó có cột label trái 160px, chỉ đúng cho Add/Edit). Theo Figma: MAG Sales Platform | Design System, node 62938:1961.

> ⚠️ **Mỗi row phải đồng nhất độ rộng cột** — không trộn field `col-span-1` và `col-span-2` trong CÙNG 1 row (nhìn lệch, không đúng Figma). Sắp field ngắn (giá trị 1 dòng) thành 1 row toàn `col-span-1`, field dài (giá trị nhiều chữ) thành row riêng toàn `col-span-2`/`col-span-4`.
>
> ⚠️ **Row chỉ có 2 field, 1 ngắn + 1 dài** — KHÔNG chia đều `col-span-2` + `col-span-2` (field 2 sẽ bị đẩy sang track thứ 3, nhìn như "nhảy cột"). Dùng `col-span-1` cho field ngắn + `col-span-3` cho field dài — field dài bắt đầu ngay ở cột 2 (liền sau field ngắn) và vẫn lấp đầy hết 4 cột.

```html
<!-- ❌ Sai: field 2 bắt đầu ở cột 3, nhìn như nhảy cột -->
<div class="form-field-group col-span-2"><sd-input label="Mã điều khoản" value="PTTT-24" disabled viewed></sd-input></div>
<div class="form-field-group col-span-2"><sd-input label="Tên phương án" value="Tiến độ tiêu chuẩn 24 đợt" disabled viewed></sd-input></div>

<!-- ✅ Đúng: field 2 bắt đầu ngay ở cột 2 -->
<div class="form-field-group"><sd-input label="Mã điều khoản" value="PTTT-24" disabled viewed></sd-input></div>
<div class="form-field-group col-span-3"><sd-input label="Tên phương án" value="Tiến độ tiêu chuẩn 24 đợt" disabled viewed></sd-input></div>
```

```html
<sd-section title="Thông tin đợt thu">
  <div class="detail-section-group">
    <div class="detail-section-group-title">Đợt thu</div>
    <div class="form-grid-4">
      <div class="form-field-group">
        <sd-input label="Loại đợt thu" value="HDMB" disabled viewed></sd-input>
      </div>
      <!-- thêm field... -->
    </div>
  </div>
  <div class="detail-section-group">
    <div class="detail-section-group-title">Điều khoản thanh toán</div>
    <div class="form-grid-4"><!-- fields --></div>
  </div>
</sd-section>
```

### Variant G — Full-width section, chia nhóm bằng title dòng (Read, list style)

Biến thể khác của Variant F: cũng là 1 section full-width cần chia nhóm con, nhưng dùng `sd-section-item` (label-trái/value-phải, giống mọi card khác trên trang) thay vì lưới `form-grid` + `sd-input viewed`. Chọn Variant G khi muốn **toàn trang chỉ có 1 kiểu trình bày field duy nhất** — tránh cảm giác "section lạc loài" khi 1 box hiển thị khác kiểu các box còn lại (Variant B/C). Đánh đổi: mất khả năng hiển thị nén nhiều field/hàng của lưới — mỗi field chiếm nguyên 1 dòng.

Dùng `noPaddingBody` trên `sd-section`. Title nhóm con là `.section-item-group-title` (không phải `.detail-section-group-title` — class đó dành riêng cho Variant F). Không cần border-top/divider riêng cho title nhóm con thứ 2 trở đi — `border-bottom` sẵn có của `sd-section-item` cuối nhóm trước đã đóng vai trò divider.

> `.section-item-group-title` là **optional** — nếu field trong section không cần chia nhóm rõ ràng (hoặc BA/PO thấy chia nhóm là thừa), bỏ hẳn các title này, liệt kê phẳng toàn bộ `sd-section-item` trong 1 list duy nhất. Không bắt buộc phải có ít nhất 1 nhóm con.

```html
<!-- Có chia nhóm con -->
<sd-section title="Thông tin đợt thu" noPaddingBody collapsible>
  <div class="section-item-group-title">Đợt thu</div>
  <sd-section-item label="Loại đợt thu">HDMB</sd-section-item>
  <!-- thêm field... -->
  <div class="section-item-group-title">Điều khoản thanh toán</div>
  <sd-section-item label="Mã điều khoản thanh toán">PTTT-STANDARD-24</sd-section-item>
  <!-- thêm field... -->
</sd-section>

<!-- Không chia nhóm con — liệt kê phẳng -->
<sd-section title="Thông tin đợt thu" noPaddingBody collapsible>
  <sd-section-item label="Loại đợt thu">HDMB</sd-section-item>
  <sd-section-item label="Mã điều khoản thanh toán">PTTT-STANDARD-24</sd-section-item>
  <!-- thêm field... -->
</sd-section>
```

### Variant D — Repeatable items + header-right actions

Dùng cho N items đồng nhất có thể thêm/xóa — mỗi item có trạng thái và actions riêng.

```html
<sd-section title="1. Masterise → Coteccons"
            subTitle="H2H · 5.000.000.000 VND · CF: CF_OUT_001"
            collapsible>
  <div class="d-flex align-items-center gap-8" sdHeaderRight>
    <sd-badge color="secondary" icon="edit_note" fontSet="material-icons-outlined" title="Nháp"></sd-badge>
    <div class="c-header-divider"></div>
    <sd-button type="light" color="primary" size="sm" prefixIcon="content_copy" title="Nhân bản"></sd-button>
    <sd-button type="light" color="primary" size="sm" prefixIcon="delete_outline" title="Xóa"></sd-button>
    <div class="c-header-divider"></div>
    <sd-button type="light" color="primary" size="sm" prefixIcon="save" title="Lưu nháp"></sd-button>
  </div>
  <!-- body: form fields -->
</sd-section>

<!-- Item collapsed -->
<sd-section title="2. ..." subTitle="..." collapsible collapsed>
  <div sdHeaderRight>...</div>
</sd-section>
```

### Variant E — 2-column sub-sections (dữ liệu đối xứng)

```html
<div class="form-sections-2col">
  <sd-section title="Bên chuyển">
    <div class="form-grid-2"><!-- fields --></div>
  </sd-section>
  <sd-section title="Bên nhận">
    <div class="form-grid-2"><!-- fields --></div>
  </sd-section>
</div>
```

**Khi nào dùng variant nào:**

| Variant | Khi nào |
|---------|---------|
| A. Basic | Form đơn, 1 nhóm thông tin (Add/Edit) |
| B. Detail | Read page — hiển thị label-value pairs |
| C. Subtitle metadata | Read page — lịch sử, ghi chú, section có metadata (không icon) |
| D. Repeatable + actions | **Repeatable items**: N dòng lệnh, batch items — mỗi item có trạng thái + actions riêng (Add/Edit) |
| E. 2-col sections | **Dữ liệu đối xứng** (Add/Edit): Bên chuyển/Bên nhận, Debit/Credit |
| F. Grouped full-width (grid) | Read page — section full-width nhiều field dạng cấu hình/số liệu ngắn, chia nhóm con bằng `.detail-section-group` + lưới `form-grid` |
| G. Grouped full-width (list) | Read page — section full-width nhiều field, muốn đồng bộ kiểu trình bày với các `sd-section-item` card khác trên trang, chia nhóm con bằng `.section-item-group-title` |

**Mapping từ CSS cũ:**
- `.form-card` → `<sd-section title="..." collapsible>`
- `.detail-card` → `<sd-section title="..." noPaddingBody>`
- `.detail-section` → `<sd-section title="...">` (không icon)

---

## sd-section-item

Label-value pair bên trong sd-section. Dùng cho Read pages. Bắt buộc có `noPaddingBody` trên sd-section cha.

| Attribute | Values | Default |
|-----------|--------|---------|
| `label` | Label text (left) | — |
| `labelWidth` | CSS width | `150px` |

Content (slot) là value bên phải.

```html
<sd-section title="Thông tin" noPaddingBody>
  <sd-section-item label="Họ và tên">Nguyễn Văn A</sd-section-item>
  <sd-section-item label="Email">a@email.com</sd-section-item>
  <sd-section-item label="Trạng thái">
    <sd-badge color="success" icon="play_circle" title="Hoạt động"></sd-badge>
  </sd-section-item>
</sd-section>
```

Hình theo catalog: hàng `flex` căn giữa, khe 8px, đệm 8px 16px, kẻ dưới #f2f2f2 ở **mọi** hàng kể cả hàng cuối; nhãn T14R --sd-black400. Ô giá trị (`div[style=flex:1]`) **không có lớp chữ** — cỡ, độ đậm, màu, cao dòng đều kế thừa trang (21px → hàng cao 38px). Muốn giá trị đậm như mọi ví dụ catalog thì bọc `<span class="T14M">…</span>`.

> `field` (tooltip QA) đã **gỡ** 2026-10-12 — catalog không có (Rule 18), giống `sd-input` trước đó. Markup cũ có `field` vẫn chạy, chỉ bị bỏ qua.

**Mapping từ CSS cũ:** `.info-list` + `.info-list-item` + `.info-list-label` + `.info-list-value`

---

## sd-tab-group

Tab container - bọc nhiều `sd-tab` để chuyển giữa các nhóm nội dung trong cùng một màn hình. Portal: `/pattern/tab-group/*`. Quy tắc dùng: **line** cho nhóm nội dung, **pills** cho nhóm độc lập, **segmented** cho ít lựa chọn ngang hàng.

| Attribute | Values | Default |
|-----------|--------|---------|
| `variant` | `line`, `pills`, `segmented` | `line` |
| `selectedIndex` | number | `0` |
| `stretchTabs` | boolean | **`true`** | **Nhận nhưng KHÔNG có tác dụng** — theme `portal-fins` đè `.mat-mdc-tab{flex-grow:0!important;min-width:auto!important}` nên tab luôn rộng theo nội dung. Đo catalog: 4 tab ra 164/140/197/150px. Kit mirror đúng (sửa 2026-10-12) |
| `animationDuration` | string - ví dụ `"0ms"`, `"300ms"` | **`500ms`** |
| `alignTabs` | `start`, `center`, `end` | `start` | Canh thanh tab trong khung |
| `color` | `primary`, `secondary`, `success`, `warning`, `error`, `info` | `primary` | Đổi **gạch chân + badge**. Ở `line`, **chữ tab đang chọn KHÔNG đổi** (vẫn `--sd-primary`) — catalog ghi rõ; ở `pills`/`segmented` thì có đổi nền viên / chữ ô (sửa 2026-10-12) |
| `headerPosition` | `above`, `below` | `above` | `below` đẩy thanh tab xuống DƯỚI phần nội dung |
| `dynamicHeight` | boolean | `false` | Khung co giãn theo chiều cao tab đang chọn thay vì giữ chiều cao lớn nhất |
| ~~`autoId`~~ | — | — | **Đã gỡ 2026-10-12** (Rule 18) — bảng API `#c-tab` không có, markup mục đó không có `data-autoid` nào |

> **`disableRipple` ĐÃ BỎ 2026-10-12** (Rule 18) — bảng API catalog `#c-tab` không có input này (đến từ gói npm 22.2.12, mốc chuẩn CŨ), kit không vẽ ripple, và class `sd-tab-group--no-ripple` nó gắn ra không có một rule CSS nào.

**Events:**

| Event | detail | Khi nào fire |
|-------|--------|--------------|
| `sd-tab-change` | `{ index: number }` | User chuyển tab - bên Angular là `(selectedIndexChange)` |
| `sd-tab-close` | `{ index: number, label: string }` - cancelable | User bấm X đóng tab - bên Angular là `(close)` |

**DOM (2026-10-14 — giống hệt catalog `#c-tab`):** `sd-tab-group > mat-tab-group.mat-mdc-tab-group.sd-tab-group.mat-primary >
mat-tab-header.mat-mdc-tab-header (+ 2 nút phân trang) > .mat-mdc-tab-label-container > .mat-mdc-tab-list > .mat-mdc-tab-labels >
div.mdc-tab.mat-mdc-tab[role=tab]` (đang chọn: `.mdc-tab--active.mdc-tab-indicator--active`; gạch chân là `.mdc-tab-indicator` của
từng tab) và `.mat-mdc-tab-body-wrapper > mat-tab-body[role=tabpanel] > .mat-mdc-tab-body-content > sd-tab`. Thẻ `sd-tab` còn nằm
trong thân tab (display: contents) — chỗ khác catalog duy nhất. Tìm nhãn tab bằng `.mat-mdc-tab-labels > .mat-mdc-tab`
(không còn `.sd-tab__button` / `.sd-tab--active` / `.sd-tab-indicator`). `stretchTabs` / `headerPosition="below"` /
`dynamicHeight` / `alignTabs` là lớp / thuộc tính Material trên `mat-tab-group` (`mat-mdc-tab-group-stretch-tabs`,
`-inverted-header`, `-dynamic-height`, `mat-align-tabs`). Chữ tab đang chọn ở `line` luôn `--sd-primary`
(`--mat-tab-active-label-text-color` của theme) — `color` chỉ đổi gạch chân + badge.

**CSS custom properties trên host** - prototype ghi đè được như bên Angular:

| Property | Mặc định |
|----------|----------|
| `--sd-tab-indicator-color` | `var(--sd-primary)` |
| `--sd-tab-label-active-color` | `var(--sd-primary)` — nền viên `pills`, chữ ô `segmented`; **`color` đổi biến này** |
| `--sd-tab-label-color` | `var(--sd-text-primary, #1a1a1a)` |
| `--sd-tab-badge-bg` | `var(--sd-primary-light)` |
| `--sd-tab-badge-color` | `var(--sd-primary)` |
| `--sd-tab-badge-radius` / `-padding` / `-min-width` | `10px` / `0 6px` / `18px` |
| `--sd-tab-close-color` / `-hover-color` | `var(--sd-text-secondary, #6b6b6b)` / `var(--sd-error)` |

> **Hình thức (rà soát 2026-10-11 theo Core UI Catalog `@sd-angular/core` 19.0.10):**
> thanh tab cao **36px** và **KHÔNG có đường kẻ dưới** (`--mat-tab-divider-height: 0`).
> Nhãn 14px / **500** (sửa 2026-10-12 — lấy `--mat-sys-title-small-weight: 500` của khối token Material M3
> trên `html`; bản trước ghi 400): chưa chọn `rgba(0,0,0,.54)`, đang chọn `--sd-primary` và **không đậm thêm**;
> **hover không đổi màu**. Icon **18px**, cách chữ **4px**. Badge cao **18px**, `min-width` 18,
> padding `0 6px`, bo **10px**, cách chữ 2px. Nút đóng 16px, mờ `.6` → rõ + đỏ khi hover.
> Cấu trúc trong mỗi nút: `span.sd-tab__label` (bọc) `> .sd-tab__icon + span.sd-tab__text + .sd-tab__badge`
> — đúng tên của catalog. **`pills`**: viên thuốc đang chọn tô **đặc** màu chủ đạo chữ trắng.
> **`segmented`**: nền **TRẮNG** bo 8px không viền (sửa 2026-10-12 — rule của component ghi `#f0f3f7`
> nhưng portal đè `.mat-mdc-tab-header{background-color:#ffffff!important}` lên trên, nhãn biến thể
> của catalog cũng ghi vậy), đệm 3px, min-height 34px; ô cao 28px đệm `0 14px` bo 6px, ô đang chọn
> nền trắng + bóng `0 1px 3px`, chữ 13px/**600** (chưa chọn 13px/500).
> **`pills`**: header min-height 36px, khoảng cách viên 4px, viên cao 32px đệm `0 14px` bo 999px.
> Thanh tab **luôn căn trái** (`justify-content: flex-start`) vì portal đè
> `.mat-mdc-tab-label-container{justify-content:flex-start!important}`.

```html
<sd-tab-group variant="line" selectedindex="0" color="primary" alignTabs="start">
  <sd-tab label="Cấu hình" icon="settings" badge="12" closable>Nội dung tab...</sd-tab>
  <sd-tab label="Đã đóng" disabled>Nội dung tab...</sd-tab>
  <sd-tab label="Nhật ký" closable>Nội dung tab...</sd-tab>
</sd-tab-group>
```

> **`beforeClose` ĐÃ GỠ 2026-10-12 (Rule 18):** chuỗi "beforeClose" **không xuất hiện một lần nào**
> trong Core UI Catalog 19.0.10 — không ở bảng API `#c-tab` / `#c-modal` / `#c-side-drawer`, không ở
> markup, không ở ví dụ. Nó đến từ gói npm 22.2.12 (mốc chuẩn CŨ), cùng loại với `disableRipple`.
> Gỡ luôn ở cả `sd-modal` và `sd-side-drawer` cùng lượt, kèm sự kiện `sd-close-error` vốn chỉ phục vụ nó.
> **Không mất năng lực nào:** `sd-tab-close` vẫn `cancelable: true`, gọi `preventDefault()` trong listener
> là chặn đóng — đúng cái `(close)` của catalog dùng để làm.
>
> **stretchTabs / animationDuration (sửa 2026-10-10, bổ sung 2026-10-12):** mặc định THẬT đọc từ
> `input(<default>)` trong source map là `stretchTabs = true` và `animationDuration = '500ms'`.
> Nhưng `stretchTabs` **không có tác dụng gì** trên theme `portal-fins` — xem bảng attribute phía trên.
>
> **Tràn hàng / pagination (Portal: `/pattern/tab-group/many`):** `SdTabGroup` thật bọc `mat-tab-group` của Angular Material, có sẵn cơ chế PAGINATION của `MatTabHeader` - khi tổng bề rộng các tab vượt bề rộng khung nhìn, tự hiện 2 nút mũi tên trái/phải để cuộn thanh tab, và tự cuộn tab đang chọn vào tầm nhìn nếu đang bị che khuất (bấm tab hoặc đổi `selectedIndex` bằng code đều kích hoạt). Đây là hành vi mặc định đi kèm bất kỳ số lượng tab nào - **không có attribute riêng để bật/tắt**, không cần khai báo gì thêm, chỉ cần khung chứa hẹp hơn tổng bề rộng tab. Xem demo "Nhiều nhóm nội dung" trong preview.

## sd-tab

Một tab bên trong `sd-tab-group`. Nội dung (slot) giữ nguyên node DOM - không chép innerHTML, nên component và event listener bên trong tab vẫn sống bình thường.

| Attribute | Values | Default |
|-----------|--------|---------|
| `label` | string | - |
| `icon` | string - tên Material icon Outlined, đặt trước nhãn | - |
| `badge` | number - hiện bên phải nhãn; bỏ trống = không hiện | - |
| `disabled` | boolean | `false` |
| `closable` | boolean - hiện nút X | `false` |

Đúng bằng bảng API của catalog: `sd-tab: label · icon · badge · disabled · closable · (close)`.
`beforeClose` đã gỡ 2026-10-12 — chặn đóng bằng `preventDefault()` trên `sd-tab-close`.

Xem cú pháp ở mục `sd-tab-group` phía trên.

---

## sd-stepper

Wizard nhiều bước - container bọc nhiều `sd-step` để chia quy trình có thứ tự thành từng bước kiểm soát được.

> **Mốc chuẩn (Builder 2026-10-14):** *„Cập nhật phần Stepper theo Core UI này https://sdcorejs.github.io/sdcorejs-angular/3.1/v/22.3.1/components/stepper/examples“* → RIÊNG stepper theo gói npm **`@sdcorejs/angular` 22.3.1** (`fesm2022/sdcorejs-angular-components-stepper.mjs`) chạy trên **`@angular/material` 22.1.5** — không còn theo catalog `@sd-angular/core` 19.0.10. Đã đối chiếu từng node DOM, class, aria và style tính toán với trang demo tài liệu 3.1 dựng lại thật (`showcase/src/app/pages/components/stepper/stepper-demo.component.*`, nhánh `release/angular-3.1`), qua 8 kịch bản thao tác (bấm header, linear, reset, điều khiển từ ngoài, bàn phím, chuột…). Trang preview `preview/components/stepper.html` dựng lại đúng 9 ví dụ của trang tài liệu.

| Attribute | Values | Default |
|-----------|--------|---------|
| `selectedIndex` | number (≙ `[(selectedIndex)]`; đặt attribute để nhảy bước — vẫn theo luật linear / editable) | `0` |
| `linear` | boolean | `false` |
| `orientation` | `horizontal`, `vertical` | `horizontal` |
| `labelPosition` | `end`, `bottom` (chỉ horizontal) | **`end`** |
| `headerPosition` | `top`, `bottom` (chỉ horizontal) | `top` |
| `animationDuration` | string - ví dụ `"0ms"`, `"500ms"` | **`500ms`** |
| `disableRipple` | boolean — nhận cho khớp API, kit không chạy hiệu ứng ripple | `false` |
| `color` | `primary` \| `secondary` \| `info` \| `success` \| `warning` \| `error` | `primary` |
| `autoId` | string → `data-autoId` trên host | - |

> **DOM = MatStepper thật:** `sd-stepper[style=--sd-stepper-*] > mat-stepper.sd-stepper.mat-stepper-{horizontal|vertical}[.mat-stepper-label-position-{end|bottom}].mat-stepper-animations-enabled`.
> Ngang: `.mat-horizontal-stepper-wrapper > .mat-horizontal-stepper-header-container[role=tablist]` (các `mat-step-header[role=tab]` + `.mat-stepper-horizontal-line`) rồi `.mat-horizontal-content-container > div.mat-horizontal-stepper-content-{previous|current|next}[role=tabpanel]`.
> Dọc: `.mat-vertical-stepper-wrapper > .mat-step` × n, mỗi bước = `mat-step-header[role=button]` + `.mat-vertical-content-container[.mat-stepper-vertical-line]` (bước cuối không có đường kẻ) `> .mat-vertical-stepper-content[role=region] > .mat-vertical-content` — nội dung mở NGAY DƯỚI bước đang chọn.
> Header: `.mat-step-header-ripple` + `.mat-step-icon.mat-step-icon-state-{number|edit|done}[.mat-step-icon-selected] > .mat-step-icon-content` (icon `sd-icon` 18px hoặc số) + `.mat-step-label > .mat-step-text-label > span.sd-step__label > span.sd-step__text` (+ `.mat-step-optional` "Optional").
>
> **Màu (`color`):** host ghi inline `--sd-stepper-active-color/-active-bg = var(--sd-{color})`, `--sd-stepper-active-contrast = var(--sd-{color}-contrast)`, `--sd-stepper-completed-bg = var(--sd-{color}-light)`, `--sd-stepper-completed-color = var(--sd-{color})`, `--sd-stepper-line-active-color`. Bước **đang chọn**: nền đặc màu + số/icon trắng, nhãn màu đó 600. Bước **đã xong**: nền `-light` + dấu tích màu đó. Bước **chưa tới**: nền `#1a1b1f` 8% + chữ 60%. Nhãn khác 14/500 `#1a1b1f`. Đường nối 1px `--sd-border` (`#c4c6d0`), luôn xám.
>
> **Số đo (22.3.1, density 0):** header ngang cao **72px**, đệm `0 24px`, bo **8px**; vòng tròn **32×32**, cách nhãn 8px; đường nối `margin: 0 -16px`, `min-width: 16px`; khung nội dung `0 24px 16px`. `labelPosition="bottom"`: đệm header `24px`, nhãn dưới vòng tròn. Dọc: header đệm `24px`, nội dung thụt `36px`, đệm `0 24px 24px`. Nền stepper `#faf9fd` (surface của theme Material).

Logic = CdkStepper 22.1:

- Bước **completed** = đã ghé và rời đi (`interacted`) **và** không `invalid` — hoặc ép bằng bí danh `completed` / `state="completed"`.
- **`linear`**: chỉ tới được bước sau khi mọi bước trước completed hoặc `optional`; header bước chưa với tới mang `aria-disabled="true"`.
- **Ký hiệu vòng tròn:** đang chọn hoặc chưa xong → số / `icon` của bước; đã xong → `check` (state `edit` nếu `editable`, `done` nếu `editable="false"`).
- **`editable="false"`**: đã qua thì không quay lại được (cả khi không linear).
- **`state="error"` / `errorMessage` không hiển thị gì** — thư viện không bật `STEPPER_GLOBAL_OPTIONS.showError` (trang tài liệu cũng vậy).
- Bàn phím: ←/→ (dọc ↑/↓), Home/End, Enter/Space như `FocusKeyManager` của CDK.

**Events:**

| Event | detail | Khi nào fire |
|-------|--------|--------------|
| `sd-step-change` | `{ index }` | Bước chọn đổi (≙ `selectedIndexChange`) |
| `sd-selection-change` | `{ selectedIndex, previouslySelectedIndex, previousIndex, selectedStep, previouslySelectedStep }` | ≙ `(selectionChange)` |
| `sd-select-change` | - | Bắn trên chính `sd-step` vừa được chọn, không nổi bọt (≙ `(selectChange)` của SdStep) |

**Methods:**

| Method | Mô tả |
|--------|-------|
| `next()` | Sang bước kế tiếp |
| `previous()` | Quay lại bước trước |
| `goTo(index)` | Nhảy tới bước `index` (kẹp 0 … n-1) |
| `reset()` | Về bước đầu, xoá trạng thái đã ghé / đã xong |

```html
<sd-stepper id="wizard" linear>
  <sd-step label="Tài khoản" icon="badge" invalid>...form...</sd-step>
  <sd-step label="Khuyến mãi" icon="local_offer" optional>...</sd-step>
  <sd-step label="Xác nhận" icon="task_alt" editable="false">...</sd-step>
</sd-stepper>
<script>
  // ≙ stepControl.invalid — gỡ `invalid` khi form của bước hợp lệ
  form.addEventListener('input', () => step.toggleAttribute('invalid', !form.checkValidity()));
</script>
```

> **stepControl → `invalid` (Rule 18-2):** input thật nhận `FormGroup`; HTML không truyền được object nên kit trải phẳng thành boolean `invalid` trên `sd-step` (≙ `stepControl.invalid`). Trang tự bật/tắt `invalid` theo form của bước — xem ví dụ "Linear wizard".
>
> **Khác thư viện, có lý do:** thẻ `<sd-step>` nằm lại trong host (ẩn) để trang đọc/ghi attribute; nội dung của nó được **chuyển** (không chép) vào khung nội dung → listener và dữ liệu đã gõ còn nguyên. Thư viện chỉ dựng nội dung bước lần đầu được chọn; kit dựng sẵn (khung chưa chọn vẫn ẩn). Ripple không chạy. Xem `_memory/known-gaps.md` mục `sd-stepper — theo 22.3.1`.

## sd-step

Một bước bên trong `sd-stepper`.

| Attribute | Values | Default |
|-----------|--------|---------|
| `label` | string | - (bắt buộc) |
| `icon` | string - Material icon Outlined, thay số thứ tự trong vòng tròn khi bước chưa xong / đang chọn | - |
| `optional` | boolean — bỏ qua được khi linear, hiện "Optional" | `false` |
| `editable` | boolean | **`true`** |
| `invalid` | boolean — ≙ `stepControl.invalid` | `false` |
| `state` | string — nhận cho khớp API, không hiển thị (xem trên) | - |
| `errorMessage` | string — không hiển thị | - |
| `completed` | boolean — bí danh cũ: ép "đã xong" (như `state="completed"`) | - |

Xem cú pháp ở mục `sd-stepper` phía trên.

---

## sd-anchor

Trang dài chia mục, kèm **mục lục dính bên phải**: gom các `sd-anchor-item` con, theo dõi mục đang hiển thị bằng
IntersectionObserver và cuộn mượt khi bấm vào mục lục. **ĐỒNG BỘ 2026-10-13 theo catalog `#c-anchor` + mã thư viện
(`sd-angular-core-components-anchor.mjs` 19.0.10)** — DOM 2/2 ví dụ trùng nguyên văn, toạ độ + computed 0 lệch,
mục active khi cuộn trùng catalog. Preview: [components/anchor.html](../preview/components/anchor.html).

> ⚠️ **Chiều cao do trang chứa quyết định** — component chỉ đặt `height: 100%` cho khung cuộn bên trong, thẻ
> `sd-anchor` **không có style** (như thư viện). Viết như catalog: `<sd-anchor style="display: block; height: 340px">`
> (hoặc `height: 100%` trong một khung có chiều cao).

| Attribute | Values | Default |
|-----------|--------|---------|
| `sidebarWidth` | string - CSS width | `200px` |
| `color` | `primary` \| `secondary` \| `info` \| `success` \| `warning` \| `error` → `var(--sd-{color})` | `primary` |
| `ellipsis` | boolean — cắt tiêu đề dài bằng "…" | `false` |
| `overScroll` | boolean | `false` |
| `hideNav` | boolean | **`true` trên điện thoại** (userAgent khớp `/Mobi\|Android/i`), `false` trên máy tính |
| `autoId` | string | - |

> **Hình thức (styles nguyên văn):** mục lục kiểu **thanh dọc bên trái mỗi mục** (`border-left: 2px`), khoảng cách
> nội dung ↔ nav 16px, mục padding `.5rem 1.5rem`, chữ `--sd-black500` cỡ chữ của trang, icon `mat-icon` 24px.
> Mục active: thanh + chữ + icon đổi sang `color`, **in đậm 700**, không nền, không hover. Cả khối
> `.c-anchor-vertical` là vùng cuộn, nav dính lại nhờ `position: sticky`.

Ba điểm dễ hiểu sai:

- **`overScroll` KHÔNG phải "cuộn quá phần cuối".** `false` (mặc định) = **chặn** cuộn lan ra trang ngoài
  (`overscroll-behavior: contain`); `true` = cho lan.
- **`hideNav` mặc định BẬT trên điện thoại** (thư viện `BrowserUtilities.isMobile()` = dò `Mobi|Android` trong
  userAgent, không theo bề rộng màn hình). Khi ẩn thì mục lục **không được dựng** (không chỉ là ẩn bằng CSS).
  Muốn luôn hiện: `hideNav="false"`. *Bản trước có `hideNavOnMobile` theo bề rộng < 768px — đó là input của gói
  npm 22.2.12, 19.0.10 không có → đã gỡ 2026-10-13.*
- **`autoId` chỉ sinh ra `data-autoid` khi item cũng có `key`**: `components-anchor-{autoId}-{key}`, gắn trên mục nav.

> **Mục lục dài hơn khung:** thư viện không cho nav tự cuộn và flex có thể bóp mục (chữ xuống dòng bị `overflow:
> hidden` xén). Kit nay chép đúng như vậy (2026-10-13 — bản trước tự thêm `flex: 0 0 auto` + nav tự cuộn). Tiêu
> đề dài thì bật `ellipsis` như ví dụ thứ hai của catalog, hoặc giữ tiêu đề ngắn.

```html
<sd-anchor style="display: block; height: 600px" sidebarWidth="200px" color="primary">
  <sd-anchor-item title="Giới thiệu" key="intro">
    <div style="height: 600px; padding: 20px">Nội dung...</div>
  </sd-anchor-item>
  <sd-anchor-item title="Tính năng" icon="star" key="feature">
    <div style="height: 600px; padding: 20px">Nội dung...</div>
  </sd-anchor-item>
</sd-anchor>
```

> **DOM:** `sd-anchor > div.c-anchor-vertical > div.c-anchor-content > sd-anchor-item > section > …` và
> `div.c-anchor-list[style="flex-basis: W"] > anchor-nav > div.c-anchor-list[style="width: W; --anchor-active-color: …"]
> > div[tabindex=0].c-anchor-list-item`. Nội dung mỗi item được bọc trong `<section>` như template thư viện.
>
> **Scroll tracking:** `IntersectionObserver` (root = `.c-anchor-vertical`, threshold 0), mục active = section
> **đầu tiên** đang nằm trong tập "đang thấy". Bấm / Enter một mục → **debounce 200ms** → cuộn `smooth`; trong lúc
> cuộn do bấm thì bỏ qua observer, tắt cờ ở `scrollend` (hoặc sau 200ms nếu không cuộn được). JS gọi tay được
> `anchor.scrollSectionByClick(chỉ số | key)`.

## sd-anchor-item

Một mục bên trong `sd-anchor`. Tiêu đề hiển thị trong mục lục; nội dung (slot) giữ nguyên node DOM, bọc trong `<section>` như template thư viện.

| Attribute | Values | Default |
|-----------|--------|---------|
| `title` | string - required | - |
| `icon` | string - tên Material icon (bộ `material-icons` đặc, `mat-icon` 24px — như catalog), đặt trước tiêu đề | - |
| `key` | string - khoá ổn định, ghép với `autoId` của `sd-anchor` thành `data-autoid` | - |

Vì `title` là global attribute HTML, mirror gỡ `title` khỏi thẻ host để tránh tooltip gốc của trình duyệt (cơ chế `_strippingTitle`, cùng cách `SdInform` xử lý).

Xem cú pháp ở mục `sd-anchor` phía trên.

---

## sd-splitter

Bố cục panel co dãn - horizontal/vertical, mix px + flex, nested, collapsible, lưu layout vào localStorage. Kéo divider để resize; double-click handle (panel collapsible) để toggle; tab vào handle rồi dùng arrow / Home / End / Enter / Space. Portal: `/component/splitter/*`.

> ⚠️ **Bắt buộc:** sd-splitter phải được bọc trong thẻ parent có chiều cao cụ thể (height: 200-300px, 100%, ...) để hiển thị đúng.

| Attribute | Values | Default |
|-----------|--------|---------|
| `orientation` | `horizontal`, `vertical` | `horizontal` |
| `snapThreshold` | number - ví dụ `0.4` | - |
| `storageKey` | string - khoá localStorage | - |
| `disabled` | boolean - không kéo được | `false` |
| `keyboardStep` | number (px) - bước dịch thanh chia khi bấm mũi tên; giữ Shift đi gấp 5 lần | `10` |

> **Hình thức thanh chia (rà soát 2026-10-11 theo Core UI Catalog `#c-splitter`):**
> vùng bấm rộng **8px**, thanh nhìn thấy chỉ **4px** nằm giữa, bo 0.
> **Màu là XANH XÁM `#b0bec5`, hover `#1976d2` — KHÔNG theo nâu primary.**
> **Cấu trúc DOM (rà soát 2026-10-11 lần 2, theo catalog `#c-splitter`):**
> thẻ host mang `class="sd-splitter sd-splitter--horizontal|--vertical"`
> (thêm `--disabled`, `--dragging` theo trạng thái); panel mang
> `sd-splitter__panel` (+ `--collapsed`); thanh chia là **thẻ riêng**
> `<sd-splitter-handle class="sd-splitter__handle sd-splitter__handle--horizontal">`
> bọc `<span class="sd-splitter__handle-bar">`. Bản trước kit dùng
> `div.sd-splitter__gutter` với thanh vẽ bằng `::before`; lớp `sd-splitter__gutter`
> vẫn giữ trên cùng phần tử nên trang cũ không vỡ.
>
> Catalog khai `--sd-splitter-handle-color: var(--sd-color-primary-light, #b0bec5)`
> nhưng portal **không khai** `--sd-color-primary*` nên giá trị rơi về mặc định —
> chính ghi chú của catalog nói vậy, và dựng lại CSS nguyên văn của nó cũng đo ra
> `rgb(176,190,197)`. Bản trước của kit tô `--sd-black200` / hover nâu.
> Thanh bị khoá thì mờ `.5` (trước là đổi sang nền `--sd-black100`).
> Bộ biến đổi được trên thẻ host: `--sd-splitter-handle-size`, `-color`,
> `-hover-color`, `-active-color`, `-hit-area`, `-radius`, `--sd-splitter-disabled-opacity`.

**Events:**

| Event | detail | Khi nào fire |
|-------|--------|--------------|
| `sd-layout-change` | `{ layout: [{ panelId, size, unit, collapsed }] }` | Layout thay đổi - bên Angular là `(layoutChange)` |
| `sd-resize-end` | `{ gutterIndex, layout }` | **Thả chuột xong** sau khi kéo - bên Angular là `(resizeEnd)`. Khác `sd-layout-change` vốn bắn liên tục suốt lúc kéo; trang cần lưu layout thì nghe cái này (thêm 2026-10-10) |
| `sd-collapsed-change` | `{ panelId, collapsed }` | Một panel vừa gập/mở - bên Angular là `(collapsedChange)`. Cho biết ĐÚNG panel nào, khác `sd-layout-change` phải tự dò (thêm 2026-10-10) |

**Methods (trên phần tử sd-splitter):**

| Method | Mô tả |
|--------|-------|
| `toggle(panelId)` | Gập/mở panel collapsible |
| `resizePanel(panelId, px)` | Đặt kích thước panel theo px |
| `expand(panelId)` | Mở panel đang gập |
| `resetLayout()` | Khôi phục layout theo size đã khai, xoá dữ liệu đã lưu |

```html
<sd-splitter orientation="horizontal" snapThreshold="0.4" storageKey="my-layout">
  <sd-splitter-panel panelId="sidebar" size="250" unit="px" minSize="100" maxSize="400" collapsible>...</sd-splitter-panel>
  <sd-splitter-panel size="1">...</sd-splitter-panel>
  <sd-splitter-panel panelId="detail" size="1" minSize="0.3" collapsible>...</sd-splitter-panel>
</sd-splitter>
```

> **snapThreshold:** Portal mô tả "Kéo Sidebar/Detail xuống dưới 40% min → snap collapse" - mirror dùng ngưỡng = `minSize × snapThreshold` (flex tính theo % tổng kích thước, px tính theo số px); chỉ áp dụng khi panel khai `minSize`. Chưa xác nhận được công thức chính xác trên Portal, cần đối chiếu lại khi có bản Angular thật.
>
> **Double-click handle:** mirror toggle panel bên trái handle; nếu panel đó không collapsible thì thử panel bên phải.
>
> **storageKey:** chỉ panel có `panelId` mới được lưu vào localStorage. Mirror bọc toàn bộ truy cập localStorage trong try/catch - chế độ riêng tư ném lỗi thì splitter vẫn hiển thị đúng.
>
> **DOM:** nội dung từng panel giữ NGUYÊN node DOM (không chép innerHTML) nên splitter lồng nhau và event listener bên trong panel vẫn sống. Splitter chỉ nhận `sd-splitter-panel` là con trực tiếp - không quét cả cây, nên splitter cha không nuốt panel của splitter con.
>
> **Phím tắt handle:** arrow dịch 10px (giữ Shift = 50px), Home/End về min/max, Enter/Space toggle khi panel collapsible. Con trỏ: `col-resize` cho horizontal, `row-resize` cho vertical.

## sd-splitter-panel

Một panel bên trong `sd-splitter`. Nội dung (slot) giữ nguyên node DOM.

| Attribute | Values | Default |
|-----------|--------|---------|
| `panelId` | string - dùng cho method và localStorage | - |
| `size` | number - nghĩa phụ thuộc `unit` | - |
| `unit` | `px` cho kích thước cố định; bỏ trống = phần flex | bỏ trống |
| `minSize` | number - flex là tỉ lệ (0.2, 0.3), px là số px | - |
| `maxSize` | number - cùng quy ước minSize | - |
| `collapsible` | boolean - cho gập, double-click handle để bật/tắt | `false` |
| `resizable` | boolean - `resizable="false"` (chuỗi) thì 2 handle kề bị vô hiệu | `true` |
| `collapsed` | boolean - khởi tạo ở trạng thái đã gập | `false` |

Xem cú pháp ở mục `sd-splitter` phía trên.
