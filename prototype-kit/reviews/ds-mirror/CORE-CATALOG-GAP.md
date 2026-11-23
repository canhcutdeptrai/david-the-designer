# Đối chiếu kit với Core UI Catalog — lộ trình "đồng bộ đầy đủ"

---

## CẬP NHẬT 2026-10-11 — rà soát TOÀN BỘ, chốt lại con số

Lượt này quét cả 63 mục catalog bằng ba lớp kiểm, không chỉ một:

1. **So CSS theo selector** (`cat/cssdiff.py`) — tìm rule catalog có mà kit không
   khai, và thuộc tính khai khác giá trị.
2. **Giải giá trị trong trình duyệt** (`cat/resolve.mjs`) — bước MỚI. So chữ thôi
   là sai: `.6` ≡ `0.6`, `#0000008a` ≡ `rgba(0,0,0,.54)`, `var(--sd-black200)` ≡
   `#e6e6e6`, `1px var(--x) dashed` ≡ `1px dashed var(--x)`. Đặt từng giá trị lên
   một phần tử thật rồi đọc computed mới biết có lệch thật không.
   Kết quả: **64 cặp bị báo lệch → 31 chỉ khác CHỮ**.
3. **Đối chiếu API** (`cat/api-gap.py`) — lấy danh sách input ở khối `cmp-api`
   của catalog, so với `observedAttributes` của class tương ứng trong kit.

### Phạm vi: 63 mục catalog

| | Số mục |
|---|---|
| Kit đã dựng | **34** (27 + 7 dựng mới 2026-10-11, xem mục bên dưới) — con số này là của lượt đầu, xem mục "Kiểm lại bằng máy" bên dưới để có số chốt |
| Kit có nhưng catalog xếp vào Directive/Service (không phải thẻ) | **4** — `[sdTooltip]`, `SdConfirmService`, `SdLoadingService`, `SdNotifyService` |
| **Chưa dựng** | **13** |

> ### Cập nhật 2026-10-11 (lượt sau) — đã dựng 5 mục
>
> Builder chọn "dựng component còn thiếu", theo thứ tự hay gặp nhất trong
> back-office. Đã dựng và ghim bằng test trình duyệt thật:
>
> | Mục | Section catalog | Test |
> |---|---|---|
> | `sd-label` | `#c-label` | `test-newcomp.mjs` |
> | `sd-view` | `#c-view` | `test-newcomp.mjs` |
> | `sd-inline-text` | `#c-inline-text` | `test-newcomp.mjs` |
> | `sd-autocomplete` | `#c-autocomplete` | `test-autocomplete.mjs` |
> | `sd-date-range` | `#c-date-range` | `test-date-range.mjs` |
> | `sd-quick-action` | `#c-quick-action` | `test-tree.mjs` |
> | `sd-tree` | `#c-tree` | `test-tree.mjs` |
>
> Chi tiết đối chiếu từng mục: `DOI-NGUON-CATALOG-2026-10-10.md` mục 46–53.
>
> **Nhóm "đáng làm trước cho back-office" đã xong hết.** 25 mục còn lại thuộc
> bốn nhóm nặng hơn và không mục nào là component form/điều hướng thường dùng:
> soạn thảo & tài liệu (6), chart & org-chart (5), dựng form động (2),
> nhập/xuất + hạ tầng + directive + lib-bpm (12).

### Kiểm lại bằng máy, 2026-10-11 — 55 dựng / 4 tương đương / 4 chưa dựng

> **[CẬP NHẬT 2026-10-13]** `c-chart` (4 thẻ `sd-bar-chart` · `sd-line-chart` · `sd-pie-chart` ·
> `sd-doughnut-chart`) đã dựng bằng Chart.js thật → **56 dựng / 4 tương đương / 3 chưa dựng**
> (`c-tab-router`, `c-base`, `c-form-template-defs` — nhóm C còn 1, nhóm D 2). Các số bên dưới là của lượt 2026-10-11.

Trước đây các con số trong mục này đếm bằng tay và **cộng không khớp** (bảng liệt
kê 34 mục dưới nhãn "32"). Lượt này đếm bằng script: lấy đủ 63 `<section class="cmp">`
của catalog, lấy tên thẻ ở khối API của từng mục, rồi so với toàn bộ
`customElements.define()` trong `sd-components.js`.

| | Số mục |
|---|---|
| Khớp thẻ `sd-*`/`bpm-*` hoặc attribute directive — **kit đã dựng** | **55** |
| Catalog xếp là Directive/Service, kit có tương đương (`[sdTooltip]` → `data-sd-tooltip`; `SdConfirmService` / `SdLoadingService` / `SdNotifyService` đều có) | **4** |
| **Chưa dựng** | **4** |

**4 mục chưa dựng** — xếp theo **có dựng nổi ở mức prototype tĩnh hay không**

Catalog tự dựng mấy mục này ở dạng **bản sao tĩnh**: nó ghi thẳng trong ghi chú
cuối mục rằng "vùng soạn thảo gõ được, nút toolbar không hoạt động", "dropdown,
chèn bảng/ảnh, xoay giấy không hoạt động", "menu toán tử và panel của select
không mở". Tức là mức mirror khả thi cho kit **chính là mức catalog đang có**:
đúng CSS, đúng markup, hành vi thật thì không.

| Nhóm | Mục | Dựng được tới đâu |
|---|---|---|
| **A. Dựng được đầy đủ** — **ĐÃ XONG HẾT 2026-10-11** | ~~`c-operator`~~, ~~`c-modal-resizable`~~, ~~`c-import-excel`~~, ~~`c-autoid-inspector`~~ | Hành vi là DOM thuần. `c-import-excel` dựng đủ khung + bảng xem trước + luật kiểm ô; chỉ bước ĐỌC file `.xlsx` là cần thư viện nên không dựng. `c-autoid-inspector` quét DOM thật, tô viền thật, xuất JSON/CSV/MD thật; hai chỗ không dựng đã ghi ở known-gaps |
| **B. Dựng được phần VỎ, đúng mức catalog** — **ĐÃ XONG HẾT 2026-10-11** | ~~`c-ckeditor-styles`~~, ~~`c-code-editor`~~, ~~`c-mini-editor`~~, ~~`c-editor`~~, ~~`c-form-generic`~~, ~~`c-query-builder`~~, ~~`c-document-builder`~~, ~~`c-form-builder`~~ | Catalog cũng chỉ là vỏ tĩnh. Dựng đúng CSS + markup + vùng `contenteditable`; nút toolbar để trơ, đúng như catalog. `c-ckeditor-styles` thì **chỉ là** một tệp CSS global, không render gì — chép CSS là xong |
| **C. Cần thư viện ngoài, không mirror nổi** (~~2~~ → 1) | ~~`c-chart`~~ **ĐÃ DỰNG 2026-10-13** (nhúng Chart.js 4.5.1 vào `design-system/vendor/chartjs/`, theo tiền lệ pdf.js / CKEditor 5 / exceljs — xem known-gaps mục chart), `c-tab-router` | (ghi chú cũ, `c-chart` nay đã dựng:) `c-chart` là "wrapper mỏng quanh **Chart.js**" — không có Chart.js thì không có gì để bọc; catalog chụp sẵn `<canvas>` đã vẽ. `c-tab-router` thay `router-outlet` của **Angular Router**, kit không có router |
| **D. Không có giao diện** (2) | `c-base` (`SdBaseSecureComponent`), `c-form-template-defs` | `c-base` là lớp cơ sở kiểm license, catalog ghi "Không có UI". `c-form-template-defs` là bốn `ng-template` directive, catalog ghi "Bản thân chúng không có giao diện" |

> Dựng thêm 2026-10-11: `c-kpi-card`, `c-filter-scorecard`, `c-org-chart`
> (mục **59–60**), rồi `c-operator`, `c-modal-resizable` (mục **61–62**).
> rồi `c-import-excel` (mục **63**), rồi `c-autoid-inspector` (mục **64**) —
> **đóng nốt nhóm A**; rồi `c-ckeditor-styles` · `c-code-editor` ·
> `c-mini-editor` (mục **65–67**) — **nhóm B đợt 1**; rồi `c-editor` ·
> `c-form-generic` (mục **68–69**) — **nhóm B đợt 2**; rồi `c-query-builder`
> (mục **70**) — **nhóm B đợt 3**, và là mục đầu tiên kit dựng VƯỢT mức catalog
> (menu toán tử + panel select mở được); rồi `c-document-builder` ·
> `c-form-builder` (mục **71–72**) — **ĐÓNG HẾT NHÓM B**.
> Chi tiết: `DOI-NGUON-CATALOG-2026-10-10.md`.

**Không mục nào trong 4 mục này là component form hay điều hướng thường dùng
trong back-office** — nhóm đó đã dựng hết ngày 2026-10-11.

Đáng làm trước cho back-office, xếp theo mức hay gặp: ~~`sd-label`~~,
~~`sd-view`~~, ~~`sd-autocomplete`~~, ~~`sd-date-range`~~, ~~`sd-inline-text`~~,
~~`sd-tree`~~, ~~`sd-quick-action`~~ — **cả bảy đã dựng 2026-10-11**.

### Sau khi lọc hết báo nhầm: 0 giá trị CSS lệch ở 27 component kit đang dựng

18 cặp còn lại sau bước giải giá trị đều đã truy ngược tận nơi và đều **không phải
lỗi kit**:

| Nguồn báo | Vì sao không phải lỗi |
|---|---|
| `c-form-generic` (7), `c-modal-resizable` (1), `c-tab-router` (4) | Component kit **chưa dựng**; selector `.c-document-container`, `.c-action`, `.c-badge-title` trùng tên với component khác của kit |
| `c-query-bar .c-token-value-edit sd-select` (3) | Popover sửa chip của catalog dựng bằng `mat-menu`; kit dựng lớp nổi riêng — đã ghi ở mục "Chưa xong" |
| `c-table` `table{border-collapse}` + `td{border-bottom-width}` (2) | `table{border-collapse:collapse}` là **reset của trang catalog**, không phải style component. Đo bảng kit đang render: `separate`, ô `.c-td` có `border-bottom-width: 0` — khớp |
| `c-upload-file .c-area.c-view` (1) | Kit dùng `var(--sd-uf-border)` khai trên thẻ host = `var(--sd-black200)`; đầu dò không giải được biến phạm vi host. Đo component đang render: `1px solid rgb(230,230,230)` — khớp |

### Input catalog có khai nhưng KHÔNG có ví dụ nào trong catalog

Không dựng, vì không có bằng chứng về hành vi — dựng là đoán:

| Component | Input | Catalog cho thấy gì |
|---|---|---|
| `sd-input`, `sd-date`, `sd-datetime`, `sd-chip`, `sd-chip-calendar` | `appearance` | Chỉ có tên trong khối API; mọi ví dụ đều là `outline` mặc định |
| `sd-date` | `floatLabel` | Chỉ có tên trong khối API |
| `sd-radio` | `hyperlink` | Chỉ có tên; biến thể minh hoạ không dùng tới (`sd-view` thì CÓ ví dụ `hyperlink`) |
| `sd-preview-pdf` | `httpHeaders` | Header HTTP cho pdf.js — prototype tĩnh không gọi mạng |


**Mốc so:** catalog Builder gửi 2026-10-10 (`@sd-angular/core 19.0.10`, theme
`portal-fins`) làm **phạm vi và mốc hình thức**; `.d.ts` + source map của
`@sdcorejs/angular` v22.2.12 làm **mốc API** theo đúng `AGENTS.md`. Chỗ nào hai
nguồn mâu thuẫn thì ghi rõ chứ không im.

**Số liệu chốt 2026-10-10 — bản sửa sau khi đổi phương pháp đo.** Lần đo trước
grep `InputSignal` trong `.d.ts` nên **bỏ sót im lặng** những component khai input
theo kiểu khác (`sd-select`, `sd-table`, `sd-upload-file`, `sd-autocomplete`,
`sd-tree` không ra một dòng nào). Nay đọc bảng `ɵɵComponentDeclaration` do chính
trình biên dịch Angular sinh ra — không sót được, vì đó là thứ Angular dùng để nối
template với class.

Kết quả: **36 tag kit đang dựng, 0 input thiếu** — nhưng con số này chỉ có nghĩa
vì lần này nó được kiểm bằng **hành vi trong trình duyệt**, không phải bằng
`observedAttributes.includes(...)`. Lượt trước có 8 input chỉ có TÊN mà không có
hành vi và vẫn được báo là "đủ". Chi tiết ở `RA-SOAT-TOAN-BO-2026-10-10.md`.

**Hai nguồn không cùng tập component.** Catalog (`@sd-angular/core` 19.0.10) có 63
mục; gói npm thật (`@sdcorejs/angular` 22.2.12) có 85 selector `sd-*`. Mỗi bên có
thứ bên kia không có:

- Catalog có, gói thật không: `sd-document-builder`, `sd-form-builder` (dạng khác),
  4 loại chart, `bpm-filter-scorecard`, `bpm-kpi-card`.
- Gói thật có, catalog không trưng: `sd-card`/`sd-card-group`, `sd-breadcrumb`,
  `sd-job-progress`, `sd-audit-diff`, `sd-api-contract-builder`, `sd-entity-picker`,
  `sd-tree-select`, `sd-time`/`sd-time-range`, `sd-icon`, nhóm `sd-layout`/`sd-sidebar-*`.

Theo `AGENTS.md`: **gói npm là mốc API**, catalog là mốc phạm vi và hình thức.

**Còn 50 tag `sd-*` trong gói thật mà kit chưa dựng.** Đáng làm trước cho
back-office: `sd-autocomplete` (25 input) · `sd-date-range` (17) · `sd-input-color`
(15) · `sd-inline-text` (10) · `sd-tree` (10) · `sd-view` (7) · `sd-label` (4) ·
`sd-card`/`sd-card-group` · `sd-breadcrumb` · `sd-time`/`sd-time-range` ·
`sd-operator` · `sd-quick-action` · `sd-history`. Nặng/để sau: `sd-editor`,
`sd-mini-editor`, `sd-code-editor`, `sd-org-chart`, `sd-query-builder`,
`sd-import-excel`, `sd-form-render`, `sd-entity-picker`, `sd-tree-select`,
`sd-modal-resizable`, `sd-tab-router-outlet`, `sd-autoid-inspector`,
`sd-api-contract-builder`, `sd-audit-diff`, `sd-job-progress`, `sd-feel-expression`,
nhóm `sd-layout`/`sd-sidebar-*`/`sd-page`.

Cập nhật file này mỗi khi đóng xong một mục — xoá dòng, đừng để số cũ.

## Đã đủ API — toàn bộ 36 tag kit đang dựng (kiểm bằng hành vi, 2026-10-10)

`sd-anchor` · `sd-anchor-item` · `sd-avatar` · `sd-badge` · `sd-button` ·
~~`sd-button-item`~~ (**gỡ 2026-10-13** — 19.0.10 không có, Rule 18) · `sd-checkbox` · `sd-chip` · `sd-chip-calendar` ·
`sd-data-state` · `sd-date` · `sd-datetime` · `sd-inform` · `sd-input` ·
`sd-input-number` · `sd-modal` · `sd-preview-image` · `sd-preview-pdf` ·
`sd-query-bar` · `sd-radio` · `sd-section` · `sd-section-item` · `sd-select` ·
`sd-side-drawer` · `sd-splitter` · `sd-splitter-panel` · `sd-step` ·
`sd-stepper` · `sd-switch` · `sd-tab` · `sd-tab-group` · `sd-table` ·
`sd-textarea` · `sd-upload-file`

> Con số "27" đếm theo **mục catalog**, danh sách trên liệt kê theo **tag**, nên
> dài hơn: `sd-tab`/`sd-tab-group`, `sd-splitter`/`sd-splitter-panel`,
> `sd-stepper`/`sd-step`, `sd-anchor`/`sd-anchor-item`, `sd-section`/`sd-section-item`,
> `sd-button`/`sd-button-item` mỗi cặp chỉ là một mục.

**Cách đếm:** script `rescan.py` đọc `observedAttributes` **và** property accessor
(`get`/`set`) của từng class rồi so với `.d.ts`. Bản đầu chỉ đọc
`observedAttributes` nên báo nhầm `upload`/`details`/`download`/`imageValidator`
của `sd-upload-file` là thiếu, trong khi chúng vốn đã có dạng property — xem
`_memory/lessons.md`.

**Khác biệt cố ý còn giữ** (không tính là thiếu, mỗi dòng có lý do đã tra nguồn):
xem `_memory/known-gaps.md`, mục "Lệch có chủ ý".

## Catalog có, kit chưa dựng — xem thêm 50 tag ở phần đầu file

**Đáng làm cho back-office prototype**

`sd-autocomplete` · `sd-date-range` · `sd-time`* · `sd-label` ·
`sd-inline-text` · `sd-input-color` · `sd-tree` · `sd-view` · `sd-quick-action` ·
`sd-history` · `sd-operator` · Directive `[sdHoverCopy]`, `a[sdHref]`,
`[sdScroll]`, `*sdDesktop`/`*sdMobile`

**Nặng, cần đợt riêng, hoặc không hợp prototype tĩnh**

`sd-editor` · `sd-mini-editor` · `sd-code-editor` · `sd-ckeditor-styles` ·
`sd-document-builder` · `sd-form-builder` · `sd-form-render` ·
`sd-query-builder` · `sd-org-chart` · `sd-import-excel` · `sd-modal-resizable` ·
`sd-tab-router-outlet` · `sd-autoid-inspector` · `SdBaseSecureComponent` ·
4 loại chart (`sd-bar-chart`/`line`/`pie`/`doughnut`) · `bpm-filter-scorecard` ·
`bpm-kpi-card`

\* `sd-time`/`sd-time-range` có trong gói npm nhưng không có mục riêng trong catalog.

**Kit đã có bản tương đương, chỉ khác tên — KHÔNG phải thiếu**

| Catalog | Kit |
|---|---|
| `SdNotifyService` | `SdNotify` (toast) |
| `SdConfirmService` | `SdConfirm` |
| `SdLoadingService` | `SdLoading` |
| `[sdTooltip]` | thuộc tính chung `data-sd-tooltip` |
| `sd-table` của thư viện | `sd-table` kit tự dựng, API không trùng |
