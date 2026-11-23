# sd-* Data Components

*Group: Data table — dùng trong Browse pages và Read pages.*

> `sd-scorecard` **đã gỡ 2026-10-12** (Core UI catalog không có). Thẻ số liệu / thẻ lọc: xem `sd-components.md` → `bpm-kpi-card`, `bpm-filter-scorecard`.
> Trang CŨ còn thẻ `<sd-scorecard>`: từ 2026-10-15 kit vẽ nó bằng chính hai thẻ đó (`interactive="false"` → `bpm-kpi-card`, còn lại →
> `bpm-filter-scorecard`; `unit` nối sau `value`; sự kiện `sd-scorecard-click` giữ nguyên) để số liệu không biến mất. **Trang mới không dùng.**

---

## sd-table

> **Theo `@sdcorejs/angular` 22.2.14 từ 2026-10-30** (Builder: *„Cập nhật các table trong Kit theo Core UI này“* — ngoại lệ như
> `sd-stepper`, AGENTS mục „Ngoại lệ phiên bản“). Khác bản catalog 19.0.10: khung `div.sd-table-surface` (nền trắng, bo 6px);
> tiêu đề sắp xếp `th[aria-sort] > .sd-table-sort-header` (cả cột canh phải có mũi tên); **tổng ≤ số dòng/trang → ẩn phân trang, chỉ
> hiện "Đang hiển thị: 1-N/N"**; thêm **Tìm nhanh** (`option.filter.quickSearch`) và **Dòng tổng**
> (`column.aggregate`), **Nhóm dòng**, menu **Export**. **Thanh chọn dòng giữ snackbar nổi kiểu 19.0.10** (Builder 2026-10-30). Các ô lọc / nút trong bảng vẫn là `sd-select` / `sd-input` / `sd-button` của kit (catalog 19.0.10).

> **`data-legacy-dom` — chế độ trang kit cũ (2026-10-15).** `migrate-prototype.mjs` gắn lên mọi sd-table của trang dựng bằng kit cũ:
> giữ cột "#" như kit cũ, không chèn `tr.c-detail-row`, không cắt trang phía client, giữ ô trang tự sửa qua lần vẽ lại (chọn dòng /
> sắp xếp), nhận ô chọn trang tự tick bằng JS. Để CSS `nth-child` / JS `cells[n]` / `tbody tr` thứ i viết cho DOM cũ vẫn đúng ô, đúng
> dòng. **Trang mới không dùng** — catalog không có cột "#" và có dòng chi tiết sau mỗi dòng.

Config-driven data table — tự render columns, filters, pagination từ JSON.

**`option` — một object thay cho loạt attribute phẳng (2026-10-11):**

Catalog chỉ có **một** input: `<sd-table [option]="option">` với `SdTableOption`
gồm `type · items · selector · commands · filter · paginate · reload · export ·
config`. Kit nhận `option` qua property JS (`el.option = {...}`) hoặc attribute
JSON, và ánh xạ sang cờ phẳng:

| Khoá catalog | Tương đương trong kit |
|---|---|
| `selector.visible` | `selectable` — cột chọn dòng |
| `paginate.pageSize` · `paginate.pages` | `paginated` + `pageSize` + `pageSizes` |
| `reload.visible` | `reload-visible` |
| `export.visible` (`true` · `'ALL'` · `'EXCEL'` · `'CSV'`) hoặc `export.type: 'custom'` | `export-visible` (≙ `'ALL'`: menu Excel / CSV) |
| `config.visible` | `config-visible` |

Attribute phẳng khai tay **vẫn thắng**, nên trang cũ không đổi.

**`option.items` dạng hàm — chế độ `type: 'server'` (2026-10-11):**

```js
tableEl.option = {
  type: 'server',
  paginate: { pageSize: 5 },
  items: (filter, paging) => fetch(...).then(r => r.json())  // → { items, total }
};
tableEl.reload();   // bắt lấy lại dữ liệu
```

Kit gọi lại đúng hàm trang đưa vào, nhận cả kết quả **đồng bộ** lẫn **Promise**;
`total` trong kết quả được dùng cho dòng "1–5 / 37". `paging` = `{ page, pageSize }` với `page` là
**trang đang xem (bắt đầu từ 1)** — bấm ‹ › / đổi ô "Đang hiển thị" thì kit gọi lại hàm với trang mới; đổi lọc
hoặc sắp xếp thì về trang 1. Hàm trả **mảng trơn** (không `total`) thì kit coi đó là toàn bộ dữ liệu: chân bảng
giữ `total` khai trên thẻ và ‹ › khoá.

**Ô "Đang hiển thị" (2026-10-14)** là `mat-select` như catalog (không còn `<select>` thuần): bấm ô mở panel ở
overlay `<body>` (`.cdk-overlay-pane.sd-paginator-pane mat-option[data-value]`). Kịch bản kiểm thử: click
`[data-sd-pagesize]` rồi click `mat-option[data-value="50"]`; đọc số đang chọn ở
`.mat-mdc-paginator-page-size .mat-mdc-select-min-line` (đừng dùng `.mat-mdc-select-min-line` trơn — ô lọc cột cũng có lớp này).

**DOM dòng / ô (2026-10-14) = mat-table của catalog.** JS trang / kịch bản kiểm thử tìm theo:
dòng `tr.c-row` (có `data-row-key`), ô dữ liệu `td.c-td.mat-column-<field>` (ô chọn / ô lệnh **không** có `c-td`),
ô chọn `mat-checkbox[data-sel-row]` / `[data-sel-all]` (bấm vào `input` bên trong; đang chọn = `.mat-mdc-checkbox-checked`),
nút lệnh `desktop-command button[title="…"]`, nút ⋮ `button[data-menu-target]`. Menu lệnh của dòng chỉ có khi mở và nằm ở
overlay `<body>` (`.cdk-overlay-pane.sd-table-pane .c-table-menu-dropdown .c-table-menu-item`), không nằm trong ô. Bảng rỗng:
chữ là `.c-no-data-row > .T16R` (lọc rỗng: `.T16M` + `.T16R`).

**Badge trạng thái trong bảng (2026-10-14)**: trạng thái lifecycle vẽ kiểu `icon` — cột `type:"status"`, hoặc `useBadge` trả
`{ type: 'icon', color, icon, title }` lấy từ `window.sdStatusBadgeAttrs(khoá, nhãn)` (không truyền `fontSet` — ô bảng thư viện
không nhận). `round` chỉ cho nhãn phân loại (nguồn, cấp, vai trò, có / không) và cột `boolean` (thư viện cố định `round`).

**`option.items` dạng mảng** (chế độ client, 2026-10-14) = như attribute `data`; attribute `data` khai tay vẫn thắng.

**Phân trang (2026-10-14 — trước đó chỉ là UI tĩnh):** `paginated` (hoặc `option.paginate`) cắt dòng THẬT theo
trang như MatPaginator của catalog: ‹ › chuyển trang, ô "Đang hiển thị" đổi số dòng, nhãn `x–y/tổng` tính trên số
dòng SAU khi lọc; đổi lọc / sắp xếp → về trang 1. Hai trường hợp giữ hiển thị tĩnh (hiện hết dòng, ‹ › khoá):
trang khai `total` **lớn hơn** số dòng có sẵn (tổng giả của prototype, vd `total="156"` với 14 dòng mẫu), và bảng
cây (`tree`). Chọn tất cả chỉ chọn các dòng của trang đang xem.

`filter.externalFilters` và `commands` thì không mirror — xem
`_memory/known-gaps.md` để biết lý do từng cái.

Trước 2026-10-11 `option` **có trong `observedAttributes` nhưng không dòng nào
đọc** — trang viết đúng theo catalog thì không có tác dụng gì.

| Attribute | Values | Default |
|-----------|--------|---------|
| `columns` | JSON column definitions | `[]` |
| `data` | JSON row data | `[]` |
| `selectable` | boolean — checkbox column | — |
| ~~`no-index`~~ | **Không còn tác dụng** — cột `#` đã gỡ 2026-10-12 (catalog không có) | — |
| `paginated` | boolean — show pagination | — |
| `pageSize` | Default page size | `10` |
| `pageSizes` | Comma-separated options | `5,10,25` |
| `total` | Total records count | data.length |
| `config-visible` | boolean — settings button | — |
| `reload-visible` | boolean — reload button | — |
| `export-visible` | boolean — export button | — |
| `hide-inline-filter` | boolean — ẩn column filters | — |
| `addable` | boolean — thêm footer "+ Thêm dòng" | — |
| `add-label` | Custom label cho nút thêm | `Thêm dòng` |

### Column definition

```json
{
  "field": "fieldName",
  "title": "Tên cột",
  "type": "string",
  "align": "left",
  "option": {}
}
```

### Column types

| Type | Filter render | Cell render | option keys |
|------|--------------|-------------|-------------|
| `string` | sd-input (sm) | Plain text | — |
| `number` | sd-input-number (sm) | `.` tách hàng nghìn, `,` tách thập phân; **mặc định 2 số lẻ** (catalog: "kiểu number mặc định hiện 2 số lẻ") — số đếm / tiền nguyên khai `option.precision: 0` hoặc `transform` | `precision` |
| `date` | sd-date-range (sm) — "Từ – đến" | dd/MM/yyyy | — |
| `datetime` | sd-date-range (sm) — "Từ – đến" | `div.T14R` dd/MM/yyyy + giờ xám | — |
| `boolean` | sd-select (sm) | sd-badge `round` success / error (như thư viện) — chữ mặc định **True / False** | `displayOnTrue`, `displayOnFalse` |
| `values` | sd-select (sm) | Lookup display text | `items`, `valueField`, `displayField` |
| `status` | sd-select (sm) | sd-badge kiểu `icon` (`color` + `icon` tra STATUS_MAP) — icon luôn bộ đặc như ô bảng của thư viện (thư viện không truyền `fontSet` vào ô) | `items` (id = khoá STATUS_MAP) |
| `link` | sd-input (sm) | Clickable link | `href` |
| `raw` | — (hidden) | Raw HTML — dùng cho cells chứa sd-components động | — |
| `action` | — (hidden) | Icon button đơn (1 hành động) | `icon`, `tooltip`, `onclick` hoặc `href`, `width` |
| `menu` | — (hidden) | Icon (mặc định 3 chấm) — click xổ dropdown nhiều hành động, mirror command có children | `items` (mảng `{icon,label,id,color,href}`), `icon`, `width` |

**Ô không có dữ liệu → hiện `---`** (Builder 2026-10-30; thư viện để trống — kit quy ước, ghi known-gaps). Áp khi nội dung ô vẽ ra
rỗng: giá trị `null` / `undefined` / `""` (kể cả `transform` trả chuỗi rỗng, `values` không tra được tên mà giá trị rỗng). Không áp
cho cột `raw` và cột không tiêu đề (`"title":" "` — cột tiện ích trang tự chèn nội dung). Số `0` và `false` là có dữ liệu.
Trang KHÔNG tự viết `"---"` vào `data` cho ô trống — để trống, kit tự hiện.

### Cấu hình theo catalog — `option` (rà soát `#c-table` 2026-10-12)

Ngoài attribute phẳng, sd-table nhận property `option` đúng `SdTableOption` của catalog:

| Khoá | Ý nghĩa |
|---|---|
| `columns[]` | như attribute `columns`, thêm `width`, `transform(value,row)`, `useBadge(value,row,items) → {color,title}` (hàm chỉ truyền được qua property) |
| `items` | mảng dòng, hoặc **hàm** `(filter, paging) => {items,total}` / Promise — chế độ server: trang tự lọc/sắp xếp; `filter` có giá trị ô lọc + `orderBy`/`orderDirection`; Promise chưa xong → lớp phủ `.c-loading` + spinner 100px |
| `selector` | `{ visible, actions:[{title,icon,color,type,click(rows)}], message }` — cột chọn + thanh `selector-action` (mục „Chọn dòng“) |
| `filter.quickSearch` | 22.2.14 — thanh **Tìm nhanh** trên đầu bảng (mục „Tìm nhanh“) |
| `aggregate` | 22.2.14 — `{ scope: 'page' \| 'filtered', group, tree: { items, subtotal } }` cho **Dòng tổng**; phép tính khai trên từng cột `columns[].aggregate` (mục „Dòng tổng“) |
| `group` | 22.2.14 — `{ fields, collapsible, defaultCollapsed }` (+ kit `template`) — **Nhóm dòng** (mục „Nhóm dòng“) |
| `commands` | `[{key,type:'normal',icon,title,click(row)}, {type:'children',children:[…]}]` — cột lệnh dính trái sau cột chọn: lệnh đầu là nút icon, còn lại gom vào `more_vert` "Thao tác khác" |
| `paginate` | `{ pageSize, pages:[…] }` — 22.2.14: tổng ≤ `pageSize` → ẩn phân trang (cả ô số dòng/trang), thay bằng "Đang hiển thị: 1-N/N" |
| `reload` / `export` / `config` | `{ visible }` — nút "Tải lại" / "Export" / "Thiết lập" ở chân bảng; `export` 22.2.14: `'ALL'` → menu Excel / CSV, xuất thật file (mục „Export“) |

Bảng rỗng: ảnh + câu theo 3 trạng thái của catalog, ô "chọn tất cả" bỏ trống, "Tải lại" khoá, "Export" ẩn, phân trang ẩn.

### Sortable columns

Bất kỳ cột nào (trừ `action`/`menu`/`raw`) đều thêm được `"sortable": true` — cả vùng tiêu đề bấm được (`.sd-table-sort-header`, role button, Enter / Space cũng đổi), mũi tên 16px `#7A7A7A` ở mép phải (unfold_more / arrow_upward / arrow_downward — `background-image` CSS, không có phần tử riêng). Từ 2026-10-30 (22.2.14) cột canh phải (`align: "right"`) **cũng có mũi tên** (19.0.10 thì không):

```json
{"field": "amount", "title": "Giá trị (VND)", "type": "number", "align": "right", "sortable": true}
```

Click header: chu kỳ `unfold_more` (chưa sort) → `arrow_upward` (asc) → `arrow_downward` (desc) → quay lại `unfold_more`. Bấm sang cột `sortable` khác **luôn reset** về cột vừa bấm — **chỉ một cột active tại một thời điểm**, đúng `SdTableFilterRequest.orderBy: string` (không phải mảng) của thư viện thật; `SdTableOptionSort` thật cũng chỉ có `enable`, không có cấu hình multi-sort nào.

> **Rà soát 2026-09-23 (Portal: `/pattern/table/children`):** bản mirror trước đó có shift+click để cộng dồn nhiều cột sort cùng lúc kèm badge số thứ tự ưu tiên — tính năng này **không tồn tại** trong `.d.ts` thật (bịa API, xem `AGENTS.md`), đã bỏ.

Sắp xếp **thật** trên `data` tĩnh đang có sẵn (số so numeric, ngày so theo `Date`, còn lại so chuỗi theo locale `vi`) — không cần trang tự sort trước. Muốn hàng có thứ tự mặc định cụ thể lúc load thì khai `defaultSort: "asc"|"desc"` trên đúng cột đó (chỉ cột ĐẦU TIÊN khai `defaultSort` trong `columns` được áp dụng) để icon hiển thị đúng trạng thái active ngay từ đầu — bản thân việc sort mặc định vẫn chạy qua đúng cơ chế sort thật ở trên, không phải một cơ chế riêng.

### Inline filter ("ingrid filter")

Mặc định (không thêm `hide-inline-filter`), mỗi cột có filter (trừ `noFilter: true`, `action`, `menu`) hiện 1 ô filter dưới tiêu đề — component render đúng loại input theo `type` cột (xem bảng "Column types" ở trên) và **lọc thật** trên `data` tĩnh đang có, không cần page tự wire gì thêm:

| Type cột | Cách so khớp |
|---|---|
| `string`, `link`, `values`/`status` (không có `option.items`) | Substring, không phân biệt hoa/thường |
| `number` | **Bằng đúng số**, hoặc toán tử gõ kèm `>=` `<=` `>` `<` — như `matchesColumnFilter` của thư viện (2026-10-15; trước kit so chuỗi con: `"25"` khớp cả `1250`) |
| `boolean` | Đúng giá trị đã chọn (`true`/`false`) |
| `values`, `status` (có `option.items`) | Đúng `id` đã chọn trong dropdown |
| `date`, `datetime` | Cùng ngày (so theo `Date`, bỏ giờ/phút/giây) |
| `date`/`datetime` + `option.rangeFilter: true` | Nằm trong khoảng `[Từ, Đến]` — thiếu bên nào bỏ qua bên đó |

Nhiều cột filter cùng lúc → kết hợp **AND** (phải khớp hết). Filter chữ/số cập nhật theo từng ký tự gõ (trừ `number` — cập nhật khi rời khỏi ô, đúng hành vi có sẵn của `sd-input-number`: format lúc gõ, commit lúc blur).

> **Rà soát 2026-09-23:** trước đó hàng filter chỉ VẼ input/select ra, không có logic đọc giá trị để lọc gì cả — cùng loại lỗi với sort ở trên trước khi sửa (comment cũ trong code còn ghi "filter... decorative"). Nay đã lọc thật, không thêm attribute/API nào mới trên `sd-table` — chỉ đổi hành vi render nội bộ.

### Bộ lọc ngoài ("outgrid filter") — LỌC THẬT từ 2026-10-15

Khung `data-pattern="filter-bar"` (vỏ `external-filter` của catalog, đặt ngay trên bảng) **lọc `sd-table` phía sau nó**
— trước 2026-10-15 chỉ có giao diện, trang phải tự nối (bản tự nối của prototype thật bám DOM bên trong kit cũ nên vỡ khi
kit cập nhật). Mỗi ô = một mục `externalFilters` của thư viện:

| Khai trên trang | ↔ thư viện | Ghi chú |
|---|---|---|
| `data-for="<id bảng>"` trên khung | `<sd-table>` chứa `externalFilters` | bỏ trống = `sd-table` đầu tiên phía sau khung |
| `data-field="<field>"` trên ô | `field` | field của cột hoặc của dòng `data`; field không có ở đâu (vd `keyword`) → tìm trên mọi cột |
| thẻ của ô | `type` | `sd-input` string · `sd-input-number` number · `sd-select` / `sd-autocomplete` values (`multiple` → nhiều) · `sd-date` date · `sd-datetime` datetime · `sd-date-range` daterange · `sd-checkbox` / `sd-switch` boolean |
| `data-operator` | `defaultOperator` | `EQUAL` (string: bằng; có dấu phẩy → một trong) · `GREATER_OR_EQUAL` / `LESS_OR_EQUAL` (number, date) |

Luật so khớp = toán tử thư viện gửi backend (`SdConvertToPagingReq`): string CONTAIN (không phân biệt hoa thường) · number /
values / boolean EQUAL · values nhiều → IN · daterange từ ngày `from` tới hết ngày `to`. Nhịp như `ExternalFilterComponent`:
ô chọn / ngày áp ngay khi đổi, ô chữ / số áp khi **Enter** (lúc đó lấy giá trị mọi ô); nút đặt lại xoá mọi ô + lọc theo cột
(`filterRegister.value.remove()`) — nút luôn ở trạng thái thường, không khoá xám khi chưa lọc (Builder 2026-10-23, lệch thư viện có chủ ý). Nút bánh răng mở menu **Thiết lập** (`mat-menu.sd-custom-panel-filter-configuration`, mỗi ô một dòng `sd-checkbox`): bỏ tick → ẩn ô (ô đang có giá trị thì xoá giá trị + lọc lại), ô `required` không tắt được, nhớ theo phiên trình duyệt. AND với lọc theo cột; đổi lọc → trang 1; chân bảng đếm
đúng số dòng sau lọc (kể cả khi `total` là tổng giả).

> **LỆCH CORE CÓ CHỦ Ý:** thư viện chỉ gửi giá trị lọc ngoài vào `items(filter)` ở **chế độ server** — bảng `local` của
> thư viện **không** lọc theo nó (`filterLocalItems` bỏ qua `rawExternalFilter`). Prototype không có backend nên kit lọc
> tại chỗ theo đúng các toán tử trên. Bảng chế độ server của kit (`option.items` là hàm) giữ đúng Core: kit không lọc,
> giá trị nằm ở `filter.rawExternalFilter`. Dịch sang Angular: `html-to-angular.md` (dòng filter-bar).

Luật nghiệp vụ riêng (vd "Quá hạn" tính từ hạn xử lý): thêm trường tính sẵn vào `data` rồi trỏ `data-field` vào đó. Trang cũ
không có `data-field`: kit suy field từ nhãn ô trùng tiêu đề cột ("Tìm kiếm" → tìm mọi cột); ô chọn mà không mục nào khớp dữ
liệu cột thì bỏ qua (không lọc sai ra bảng rỗng). Ô không gắn được → console + `prototypes/_migrate-report.md`.

**`values` type — text label:**
```json
{
  "type": "values",
  "option": {
    "items": [{"id":"active","name":"Hoạt động"},{"id":"inactive","name":"Ngừng"}],
    "valueField": "id",
    "displayField": "name"
  }
}
```

**`status` type — lifecycle badge (dùng thay `values` khi cần màu + icon):**
```json
{
  "type": "status",
  "option": {
    "items": [
      {"id":"pending","name":"Nháp"},
      {"id":"waiting","name":"Chờ duyệt"},
      {"id":"approved","name":"Đã duyệt"},
      {"id":"denied","name":"Từ chối"}
    ]
  }
}
```
> `id` = STATUS_MAP key (quyết định màu + icon), `name` = label hiển thị.
> **KHÔNG dùng `type: "values"`** cho cột lifecycle status — đó chỉ là text thuần, không có màu.

**`link` type — clickable cell (dùng cho cột mã/ID):**
```json
{"field":"code","title":"Mã","type":"link","option":{"href":"xem-chi-tiet.html"}}
```

**`boolean` type:**
```json
{
  "type": "boolean",
  "option": {"displayOnTrue": "Có", "displayOnFalse": "Không"}
}
```

**`menu` type — row action menu / command có children (icon 3 chấm hoặc tuỳ chỉnh, dropdown nhiều hành động):**
```json
{
  "field": "_menu",
  "title": "",
  "type": "menu",
  "option": {
    "icon": "more_horiz",
    "width": "48px",
    "items": [
      {"id": "view", "icon": "visibility", "label": "Xem chi tiết", "href": "xem-chi-tiet.html"},
      {"id": "approve", "icon": "task_alt", "label": "Duyệt đơn hàng", "color": "success"},
      {"id": "complete", "icon": "done_all", "label": "Hoàn tất đơn hàng", "color": "info"},
      {"id": "reject", "icon": "cancel", "label": "Từ chối", "color": "error"}
    ]
  }
}
```
> `title` luôn để trống (`""`). `width` mặc định `44px` — chỉ đủ 1 icon button, không cần chỉnh trừ khi cần rộng hơn. `option.icon` — icon nút trigger, mặc định `more_vert`; Portal `/pattern/table/children` dùng `more_horiz` cho command có children (đổi được, không bắt buộc giữ mặc định). Đặt ngay sau cột checkbox (`selectable`) — trước cột `#`/cột đầu tiên.
>
> **Mỗi item:** `id` (định danh action, trả nguyên trong event) + `color` (Color token — tái dùng class `.text-*` có sẵn, KHÔNG phải token màu mới, mirror `color` của command con thật, vd `success` cho hành động duyệt/`info` cho hoàn tất). Item có `href` → render `<a>` (điều hướng, không bắn event); item không có `href` → render `<button>` và bắn `CustomEvent('sd-table-menu-click', { bubbles: true, detail: { field, itemId, itemIndex, label, row, rowIndex } })` — `row` là object dòng thật (đọc từ lần render gần nhất), `rowIndex` là display index. Trang tự lắng nghe event này để wire hành vi thật (đổi status, gọi API…):
> ```js
> document.getElementById('my-table').addEventListener('sd-table-menu-click', function (e) {
>   var d = e.detail;
>   if (d.itemId === 'approve') { /* d.row.id, d.row.code... */ }
> });
> ```
> **Rà soát 2026-09-23 (Portal: `/pattern/table/children`):** trước đây item không-href hoàn toàn no-op (chỉ đóng dropdown) — không có cách nào biết user vừa chọn action nào trên dòng nào, khác hẳn `command.commands[].children` thật (mỗi child luôn có `click: (rowData) => void`). Đã thêm event để bù đắp — attribute `columns='[...]'` không giữ được function nên không thể nhận thẳng callback như Angular, phải qua event bubble.
>
> **Không dùng `onclick`** trong `option.items` — JSON này nằm trong attribute `columns='[...]'` (bọc bằng nháy đơn), nháy đơn trong `onclick` sẽ làm gãy attribute. Dropdown tự định vị bằng `position: fixed` (thoát khỏi vùng scroll của table), mở về **phía bên phải** của nút trigger (clamp lại nếu tràn viewport), dùng `z-index: var(--z-max)` (cao nhất, luôn nổi trên sidebar/navigation), và tự đóng khi click ra ngoài hoặc scroll.
>
> **Lệnh trên dòng theo catalog:** dùng `option.commands` (cột lệnh dính trái sau cột chọn; lệnh đầu hiện thành nút icon, các lệnh còn lại gom vào nút `more_vert` "Thao tác khác"). Cột `type: "action"` / `type: "menu"` là cơ chế cũ của kit, giữ để trang cũ không vỡ. Thao tác hàng loạt: xem mục `selector` cuối file.

### Full example — Browse page

```html
<sd-table
  selectable
  paginated pageSize="20" pageSizes="10,20,50,100" total="156"
  reload-visible export-visible
  columns='[
    {"field":"code","title":"Mã","type":"link","option":{"href":"xem-chi-tiet.html"}},
    {"field":"name","title":"Tên","type":"string"},
    {"field":"price","title":"Giá","type":"number","align":"right","option":{"precision":0}},
    {"field":"status","title":"Trạng thái","type":"status","option":{"items":[
      {"id":"pending","name":"Nháp"},
      {"id":"active","name":"Hoạt động"},
      {"id":"denied","name":"Ngừng"}
    ]}},
    {"field":"createdAt","title":"Ngày tạo","type":"datetime"}
  ]'
  data='[
    {"code":"SP-001","name":"Sản phẩm A","price":50000,"status":"active","createdAt":"2026/04/01 09:00"},
    {"code":"SP-002","name":"Sản phẩm B","price":75000,"status":"pending","createdAt":"2026/04/05 14:30"}
  ]'
></sd-table>
```

### Read page — inline table (no filter, no pagination)

> **Bảng trong `sd-section`** (Builder 2026-10-14): `sd-table` nằm trong thân section tự có khung viền 1px
> `--sd-black200`, bo 8px, đường kẻ trên chân bảng, và cách mép thân 16px — kể cả khi section khai `noPaddingBody`
> (bảng tự lùi 16px). Bảng đặt thẳng trong `content-zone` (trang danh sách) giữ nguyên, không khung. Không cần
> tự thêm class / style.
>
> **Dòng có ô nhập** (bảng `addable`, cột `raw` chứa `sd-input` / `sd-select`…; Builder 2026-10-14): ô căn đầu, đệm
> **trên = dưới = 8px** → dòng cao 48px. Vạch lỗi KHÔNG chừa chỗ sẵn (kiểu `subscriptSizing="dynamic"`): ô báo lỗi
> thì riêng dòng đó cao thêm đúng dòng chữ lỗi, nút × vẫn thẳng hàng khung ô.

```html
<sd-section title="Chi tiết" icon="list" collapsible noPaddingBody>
  <sd-table
    hide-inline-filter
    columns='[
      {"field":"item","title":"Hạng mục","type":"string"},
      {"field":"qty","title":"Số lượng","type":"number","align":"right"},
      {"field":"price","title":"Đơn giá","type":"number","align":"right","option":{"precision":0}}
    ]'
    data='[
      {"item":"Hạng mục 1","qty":10,"price":50000}
    ]'
  ></sd-table>
</sd-section>
```

### Quy tắc

- **Browse:** Mặc định dùng inline column filter ("ingrid filter") — không thêm `hide-inline-filter`. **Chỉ thêm filter-bar ("outgrid filter") khi BA/PO yêu cầu tường minh** bằng tên — không tự thêm chỉ vì cần full-text search hoặc filter phức tạp. Khi đã dùng filter-bar, **bắt buộc** thêm `hide-inline-filter`.
- **Read:** Luôn thêm `hide-inline-filter` — table chỉ hiển thị data.
- **Cột mã/ID** luôn dùng `type: "link"` trỏ về trang Read — entry point duy nhất vào chi tiết.
- **Cột `#` (số thứ tự) đã gỡ 2026-10-12** — catalog không có; `no-index` còn nhận nhưng không có tác dụng.
- **Bulk action:** Khi `selectable`, khai `option.selector.actions` — thanh thao tác của chính sd-table (xem mục `selector` cuối file). Không dùng page-header buttons để thay thế.
- **Cột `menu` (cách cũ của kit — nên dùng `option.commands`):** đặt ngay sau cột `selectable` (checkbox). `title` để trống. Dùng khi row có nhiều hành động (>1) — nếu chỉ 1 hành động, dùng `type: "action"` thay vì `menu`. Đặt `color` cho item để mirror đúng command con thật (vd `success` cho hành động duyệt) — không để tất cả item cùng màu xám mặc định nếu Core UI phân biệt màu.
- **Cột `sortable`:** chỉ thêm khi Core UI thật có sort trên cột đó (kiểm bên portal, không tự thêm tràn lan). Nhớ: đây là UI thuần, không tự sắp xếp `data` — nếu cần thứ tự đúng ngay khi load, tự sort `data` trước và khai `defaultSort` khớp.
- Dùng 10–15 rows data mẫu trong prototype.

### Tree mode

Kích hoạt bằng attribute `tree` (JSON). Dùng khi data có cấu trúc phân cấp (hạng mục ngân sách, BOM, danh mục).

| Attribute `tree` key | Kiểu | Mặc định | Mô tả |
|----------------------|------|----------|-------|
| `childrenKey` | string | `"children"` | Tên field trong data chứa mảng con |
| `maxDepth` | number | 10 | Giới hạn độ sâu render |
| `defaultExpanded` | false \| true \| number | false | false=thu gọn hết; true=mở hết; N=mở N cấp đầu |
| `indentSize` | number (px) | 20 | Indent thêm mỗi cấp, áp vào cột đầu tiên |

**Luôn dùng kèm:**
- `hide-inline-filter` tự động bị ẩn (component tự xử lý)
- `total` = số root rows (level 0) khi `paginated`

**Indent áp vào cột đầu tiên** trong `columns` — đặt cột định danh (STT, tên) lên đầu.

**Root rows** (level 0): background `--sd-black50`. **Parent có con**: in đậm. Leaf nodes: style bình thường.

```html
<!-- Tree table — hạng mục chi phí -->
<sd-table
  paginated pageSize="10" total="6"
  tree='{"childrenKey":"children","maxDepth":3,"defaultExpanded":1,"indentSize":24}'
  columns='[
    {"field":"stt","title":"STT","type":"string"},
    {"field":"name","title":"Tên hạng mục","type":"string"},
    {"field":"unit","title":"Đơn vị","type":"string"},
    {"field":"quantity","title":"SL","type":"number","align":"right"},
    {"field":"unitPrice","title":"Đơn giá (đ)","type":"number","align":"right"},
    {"field":"totalCost","title":"Thành tiền (đ)","type":"number","align":"right"}
  ]'
  data='[
    {"stt":"1","name":"Hạng mục #1","totalCost":225000000},
    {"stt":"3","name":"Hạng mục #3","totalCost":275000000,"children":[
      {"stt":"3.1","name":"Con 3.1 — Nhân công","unit":"m²","quantity":2,
       "unitPrice":100000000,"totalCost":100000000,"children":[
        {"stt":"3.1.1","name":"Chi tiết 3.1.1","totalCost":60000000},
        {"stt":"3.1.2","name":"Chi tiết 3.1.2","totalCost":40000000}
      ]},
      {"stt":"3.2","name":"Con 3.2 — Máy móc","unit":"Cái","quantity":3,
       "unitPrice":175000000,"totalCost":175000000}
    ]}
  ]'
></sd-table>
```

---

## sd-query-bar

Unified filter chip row  -  component của thư viện thật `@sdcorejs/angular` (Portal `/component/query-bar`, 3 trang basic/modes/fields). Cấu hình `fields[]`, bind 2-way `[(filters)]`, lắng `(apply)` để gọi API. Khác `filter-bar` pattern của kit: đây là component động theo cấu hình field, còn `filter-bar` là pattern HTML cố định (xem mục "Quan hệ với pattern filter-bar" bên dưới).

**Cấu trúc DOM (rà soát 2026-10-13 — khớp 1:1 catalog `#c-query-bar`, 6 biến thể + 3 popup):**

```
sd-query-bar
└ .c-query-bar.c-density-{compact|comfortable}
  ├ .c-query-bar__main
  │   ├ sd-query-chip-popover            ← vỏ rỗng (display:contents)
  │   ├ .c-search                        ← khi showSearch (+ span.c-divider)
  │   ├ sd-query-popover-chip > div.c-chip.mat-mdc-menu-trigger   (mode popover)
  │   │   sd-query-inline-value-chip / sd-query-inline-chip / sd-query-build-chip (mode inline)
  │   ├ span.c-or-connector "OR"         ← giữa 2 chip khi logic = OR
  │   └ button.c-add-filter
  ├ sd-query-field-picker                ← vỏ rỗng (menu nằm ở overlay, xem dưới)
  └ sd-query-actions-bar
      ├ span.c-bar-divider
      └ .c-query-bar__actions ← .c-logic-toggle · .c-clear-all
                                · sd-query-saved-filters-menu > .c-saved-filters
                                · .c-search-trigger
```

Chip: `div.c-chip` (`c-chip-active` khi có giá trị / `c-chip-inactive` khi chưa)
› `mat-icon.c-chip-icon` › `.c-chip-label` › `.c-chip-sep` ":" (hoặc
`sd-operator.c-chip-operator` **disabled** khi `showOperatorOnChip`) ›
`.c-chip-value` › chevron `arrow_drop_down` › `span.c-chip-remove`. **Chip
inactive không có nút xoá** (đúng catalog). Giá trị trên chip: values = nhãn mục
đầu + " +N"; number in **thô** (`1000000000 — 5000000000`), BETWEEN nối bằng " — ".

**Ba popup** (mat-menu, `.mat-mdc-menu-panel` + `mat-menu-below`) nằm **ngoài thẻ host**,
trong overlay dùng chung như CDK: `body > div.cdk-overlay-container > div.cdk-overlay-pane >
.mat-mdc-menu-panel` (không thêm thuộc tính nào; CSS nhận pane bằng `:has()`), đặt sát mép dưới
nút kích hoạt. Muốn tìm panel bằng JS thì tìm ở `document`, không phải trong thẻ `sd-query-bar`:

| Popup | Mở bằng | Cấu trúc |
|---|---|---|
| `.c-chip-popover` (`mat-menu-after`) | bấm chip | `.c-pop-header` (icon · `.c-pop-header-field` · `sd-operator.c-pop-header-operator` khi field có `operators`) · `.c-pop-body` (number BETWEEN = `.c-pop-between` hai `sd-input-number size="sm"`). **Không footer** — đóng (bấm ngoài / Esc) là commit |
| `.c-field-picker-menu` (`mat-menu-after`) | nút "+" | MỌI field; field đã có chip bị `disabled` + `mat-icon.c-field-item-check`; mỗi dòng `.c-field-item-label` + `.c-field-item-type` (tên type, font mono) |
| `.c-saved-filters-menu` (`mat-menu-before`, canh phải) | nút bookmark | `button.c-sf-row` (icon `filter_alt` · `.c-sf-name` · `span.c-sf-del`) · `hr.c-sf-divider` · `button.c-sf-save` "Lưu bộ lọc hiện tại". Chọn dòng → nạp lại + `sd-apply`; lưu xong menu đóng |

Catalog chỉ vẽ popover cho number BETWEEN; thân popover của các type khác
(sd-input, sd-checkbox list, sd-radio, sd-date…) là kit tự dựng — xem known-gaps.

**`mode="inline"` — BA hình dạng chip (rà soát 2026-10-11 lần 2):**

Catalog không dùng một hình chip chung cho mọi field; nó chọn theo **kiểu field**:

| Kiểu field | Hình chip | Cấu trúc |
|---|---|---|
| `string` · `number` | `.c-seamless` — **chip CHÍNH LÀ ô nhập** | `.c-seamless__label` (icon + `__field` + `__sep`) · `.c-seamless__input` > `sd-inline-text` > `input.sd-inline-text__input` · `button.c-seamless__x` |
| `values` · `lazy-values` | `.c-token` — nhãn + **bản tóm tắt chỉ-đọc** | `.c-token-field` · `.c-token-value-edit` > `sd-select.sd-bare.sd-viewed` > `.sd-inline-view` > `sd-view` > `.c-token-multi-head` + " +N" · `button.c-token-remove`. Bấm vào tóm tắt mới mở bảng chọn |
| `boolean` | `.c-token` + `.c-bool-toggle` | hai nút `.c-bool-btn.c-bool-true` / `.c-bool-false`; chưa chọn giá trị thì là `sd-query-build-chip > .c-token.c-token-building` (viền **nét đứt**, KHÔNG icon, `sd-operator.c-token-op` disabled khi toán tử cố định) và **không tính** vào "Xóa tất cả (N)" |

`data-state` trên `.c-seamless`: `pending` khi chưa có giá trị, `active` khi có.
Ô nhập trong chip seamless cập nhật **tại chỗ theo từng phím** (không vẽ lại cụm
nên con trỏ không nhảy); `size` = `max(2, độ dài giá trị || placeholder)` — đúng
công thức catalog. Chip **số** ở mode inline in giá trị định dạng vi-VN
(`1.250.000.000`); gõ kèm dấu chấm vẫn đọc ra số.

Bản trước kit dựng **một** hình duy nhất (`.qb-inline` + `.qb-inline-value` +
`.qb-inline-remove`) cho mọi loại, và với field nhiều lựa chọn thì đổ nguyên
danh sách checkbox lên thanh — chip cao **96px** thay vì 30px.

### Attributes

| Attribute | Giá trị | Mặc định | Mô tả |
|-----------|--------|----------|-------|
| `fields` | JSON mảng field config | `[]` | Định nghĩa field lọc (7 type) - set qua attribute JSON hoặc property JS `.fields` |
| `filters` | JSON mảng Filter | `[]` | Shape `{field, operator, data}` - two-way `[(filters)]`, property `.filters` ghi vào là render lại |
| `logic` | `AND` \| `OR` | `AND` | Cách kết hợp các filter - two-way |
| `search` | string | `''` | Free text tìm kiếm - two-way |
| `mode` | `popover` \| `inline` | `popover` | popover: click chip mở menu chỉnh operator + value, đóng là commit; inline: operator + value render thẳng trên bar, edit live |
| `density` | `compact` \| `comfortable` | `compact` | Chiều cao bar: compact 28px, comfortable 32px (số Portal ghi thẳng) |
| `showSearch` | boolean | `false` | Ô tìm kiếm tự do bên trái |
| `showLogicToggle` | boolean | `false` | AND/OR segmented - chỉ render khi có ≥2 filter |
| `showOperatorOnChip` | boolean | `false` | Thay dấu ":" trên chip bằng icon toán tử `sd-operator.c-chip-operator` (disabled — chỉ hiển thị; đổi toán tử trong popover) |
| `showClearAll` | boolean | **`true`** | Nút "Xoá hết" khi có filter active. Mặc định BẬT - khai `showClearAll="false"` để tắt |
| `showSavedFilters` | boolean | `false` | Lưu / khôi phục bộ lọc qua localStorage |
| `savedFiltersKey` | string | - | localStorage key `sd-query-bar:savedFilters:<savedFiltersKey>` (đúng catalog; khoá cũ `sd-query-bar:<key>` của kit vẫn được đọc và tự chuyển). Mọi truy cập đều bọc try/catch |

> **Markup và số đo dựng lại theo catalog `#c-query-bar` (2026-10-11).** Thanh
> chia **hai vùng** chứ không còn là một hàng phẳng:
>
> ```
> .c-query-bar.c-density-{compact|comfortable}
>   .c-query-bar__main      ← ô tìm kiếm · vạch ngăn · các chip · nút "+"  (flex-wrap)
>   .c-query-bar__actions   ← AND/OR · xoá hết · bộ lọc đã lưu · tìm       (nowrap, dồn phải)
> ```
>
> Nhờ `__main` tự xuống dòng mà chip nằm hàng riêng dưới ô tìm kiếm khi nhiều chip.
> Chip là `div[role="button"]` chứa `span[role="button"].c-chip-remove` — đúng cách
> catalog tránh lồng `<button>` trong `<button>`. Chip kết thúc bằng chevron
> `arrow_drop_down`; chip **chưa có giá trị** mang class `c-chip-inactive` (nền
> trắng, không in dấu `:`), chip có giá trị mang `c-chip-active` (nền
> `--sd-primary-light`, giá trị tô `--sd-primary`).
>
> Ba nút bên phải là **nút icon 28px có viền** (comfortable 32px), không phải
> `sd-button` chữ: `delete_sweep` (xoá hết) · `bookmark_border` (bộ lọc đã lưu) ·
> `search` (tìm). Nút "+" là nút tròn **viền nét đứt**. AND/OR in chữ tiếng Anh
> viết hoa bằng font mono, không phải "VÀ"/"HOẶC".
>
> Icon của chip lấy từ **`field.icon`** nếu khai — catalog khai icon trên từng
> field (`text_fields`, `list`, `account_balance`, `event`, `tag`); thiếu thì mới
> rơi về bảng suy theo `type` của kit.

> **Viết tên attribute ĐÚNG KIỂU camelCase như API thật (rà soát 2026-10-10).**
> Năm input `showLogicToggle`, `showClearAll`, `showSavedFilters`, `savedFiltersKey`,
> `showOperatorOnChip` trước đây chỉ được khai trong `observedAttributes` dưới dạng
> kebab (`show-clear-all`). HTML hạ mọi tên attribute về chữ thường, nên viết đúng
> tên thư viện thì trình duyệt thấy `showclearall` — không khớp dòng nào, và gắn/gỡ
> attribute sau khi render **không vẽ lại**. Nay khai đủ cả hai dạng; cả hai cách
> viết đều chạy.
>
> **Sự kiện gộp `sd-query-change`** (↔ `(queryChange)`): bắn mỗi khi `filters`,
> `logic` hoặc `search` đổi, `detail` mang cả ba. Trước đây trang muốn "có gì đổi
> là nạp lại" phải nghe cả ba sự kiện rời.

`fields`/`filters`/`logic`/`search` ngoài attribute JSON còn là property JS đọc/ghi được (`.fields`, `.filters`, `.logic`, `.search`) - khuôn nhận cấu hình mảng theo `SdTable`. **Bắt buộc dùng property cho `lazy-values`** vì `option.search` là hàm, không vào JSON attribute được.

### 7 loại field

| Type | Operator mặc định | UI value | Icon mặc định (khi field không khai `icon`) |
|------|------------------|----------|--------------------------|
| `string` | CONTAIN | sd-input | `text_fields` (catalog) |
| `number` | EQUAL | sd-input-number (BETWEEN = 2 ô, `.c-pop-between`) | `tag` (catalog) |
| `boolean` | EQUAL | sd-radio (popover) · cặp Có/Không (inline) | `toggle_on` |
| `date` | BETWEEN | sd-date (BETWEEN = 2 ô) | `event` (catalog) |
| `datetime` | BETWEEN | sd-datetime (BETWEEN = 2 ô) | `event` |
| `values` | IN | sd-checkbox list (multi-select) | `list` (catalog) |
| `lazy-values` | IN | search + sd-checkbox list | `list` |

Ví dụ cấu hình 9 field đủ 7 type chép nguyên cấu hình mẫu của Portal:

```js
[
  { type: 'string', key: 'name', label: 'Họ tên (simple)' },                       // simple: luôn CONTAIN
  { type: 'string', key: 'email', label: 'Email', operators: true },               // đủ bộ string
  { type: 'values', key: 'department', label: 'Phòng ban', operators: true,
    option: { items: DEPT_OPTIONS, valueField: 'value', displayField: 'display' } }, // multi-select khi IN/NOT_IN
  { type: 'values', key: 'status', label: 'Trạng thái',
    option: { items: STATUS_OPTIONS, valueField: 'value', displayField: 'display' } }, // simple: luôn IN
  { type: 'lazy-values', key: 'city', label: 'Thành phố (lazy)', operators: ['IN', 'NOT_IN'],
    option: { search: async (req) => api.searchCities(req),
              valueField: 'value', displayField: 'display' } },                     // req.type SEARCH | VALUE
  { type: 'number', key: 'salary', label: 'Lương',
    operators: ['EQUAL', 'GREATER_OR_EQUAL', 'LESS_OR_EQUAL', 'BETWEEN'],
    min: 0, max: 100_000_000, step: 1_000_000 },
  { type: 'boolean', key: 'active', label: 'Đang hoạt động', trueLabel: 'Có', falseLabel: 'Không' },
  { type: 'date', key: 'joinDate', label: 'Ngày vào', operators: true },             // mặc định BETWEEN
  { type: 'datetime', key: 'lastLogin', label: 'Đăng nhập cuối', operators: true }
]
```

`operators` của một field nhận 3 dạng: bỏ trống = simple (một operator cố định, không có dropdown); `true` = đủ bộ operator của type; mảng = subset (`['IN','NOT_IN']`). Bộ operator mirror dựng theo mô tả Portal:

| Type | Operator set (khi `operators: true` hoặc mảng) |
|------|--------------------------------------------------|
| `string` | CONTAIN, EQUAL, NOT_EQUAL, START_WITH, END_WITH, NULL, NOT_NULL |
| `number` | EQUAL, GREATER_OR_EQUAL, LESS_OR_EQUAL, BETWEEN |
| `date` / `datetime` | EQUAL, LESS_THAN, GREATER_THAN, BETWEEN, NULL |
| `values` / `lazy-values` | IN, NOT_IN |
| `boolean` | EQUAL, NULL, NOT_NULL (NULL/NOT_NULL là suy ra, Portal không hiện) |

Mã toán tử là bảng `OPERATORS` dùng chung với `sd-operator` (icon + nhãn lấy từ đó, vd BETWEEN = "Trong khoảng"). Mã cũ của kit `START` / `END` / `BEFORE` / `AFTER` vẫn nhận (bí danh tương thích ngược) và được quy về `START_WITH` / `END_WITH` / `LESS_THAN` / `GREATER_THAN`. Đổi toán tử trong popover: sang BETWEEN thì data thành `{from, to}`; rời BETWEEN thì giữ cận "từ".

### `filters` shape

```js
[
  { "field": "name",       "operator": "CONTAIN", "data": "Nguyễn" },
  { "field": "department", "operator": "IN",      "data": ["TECH", "SALES"] },
  { "field": "salary",     "operator": "BETWEEN", "data": { "from": 10000000, "to": 50000000 } },
  { "field": "active",     "operator": "EQUAL",   "data": true }
]
```

### Events

| Event | detail | Khi nào fire |
|-------|--------|--------------|
| `sd-apply` | `{ filters, logic, search }` | Bấm nút Tìm bên phải, hoặc chọn một bộ lọc đã lưu - ánh xạ `(apply)` |
| `sd-filters-change` | `{ filters }` | Bất kỳ thay đổi filter nào - ánh xạ `[(filters)]` |
| `sd-search-change` | `{ search }` | Gõ ô tìm kiếm - ánh xạ `[(search)]` (mirror thêm) |
| `sd-logic-change` | `{ logic }` | Bấm segmented AND/OR - ánh xạ `[(logic)]` (mirror thêm) |

Popover chỉnh giá trị dùng lại component có sẵn: `sd-operator` cho toán tử (ở header), `sd-input` cho string, `sd-input-number` cho number, `sd-checkbox` cho multi-select values/lazy-values, `sd-radio` cho boolean, `sd-date`/`sd-datetime` cho date/datetime (mirror gỡ `readonly` ở runtime để nhập thật - cơ chế giống `SdConfirmService`).

### Quan hệ với pattern filter-bar

`filter-bar` là pattern riêng của kit (`data-pattern="filter-bar"`) - khung "Bộ lọc" mở/đóng, grid cố định, PD kiểm soát HTML, BA chỉ cấp nội dung. `sd-query-bar` là component của thư viện thật - chip row động theo `fields[]`, 2-way filters, popover/inline, saved filters. Dùng `sd-query-bar` khi cần bộ lọc chip nhiều field với payload chuẩn gửi backend; giữ `filter-bar` khi prototype đã có khung lọc layout cố định hoặc BA/PO mô tả đúng kiểu khung lọc.

### Quy tắc

- Browse page cần lọc nâng cao kiểu chip động mới dùng `sd-query-bar`; lọc mặc định vẫn là inline column filter của `sd-table`, không tự thay thế.
- `lazy-values` phải set qua property `.fields`, không qua attribute JSON.

---

## sd-tree — DỰNG MỚI 2026-10-11

Cây phân cấp dạng **danh sách phẳng** thụt lề theo cấp (không `<ul>` lồng `<ul>`).

Cấu hình qua property `option` (hoặc các mảnh rời `items` / `commands` /
`selector`):

```js
document.querySelector('sd-tree').option = {
  items: units,                       // mảng tĩnh, HOẶC hàm () => Promise<item[]> cho lazy
  tree: {
    loadType: 'static' | 'lazy',
    onExpandChildren: item => api.getChildren(item.id)   // lazy: trả mảng hoặc Promise
  },
  selector: {
    visible: true,                    // checkbox mỗi dòng + thanh sd-quick-action
    actions: [{ icon: 'send', title: 'Gửi duyệt', color: 'primary', click: items => submit(items) }]
  },
  commands: [                          // menu ⋮ trên từng dòng
    { key: 'view', title: 'Xem chi tiết', icon: 'visibility', click: item => open(item) },
    { key: 'del',  title: 'Xóa', icon: 'delete', hidden: item => item.locked, click: item => remove(item) }
  ],
  onSelectedItemsChange: items => { /* … */ }
};
```

**Item**: `{ id, label, icon?, data?, expanded?, children? }`. Ở chế độ lazy thêm
`leaf: true` (hoặc `hasChildren: false`) cho dòng không có con.

| Phương thức / property | Ý nghĩa |
|---|---|
| `filter(text)` | Lọc theo nhãn — giữ dòng khớp **và mọi tổ tiên**, tự mở đường tới nó. `filter('')` trả lại cây đầy đủ |
| `reload()` | Bỏ cache nhánh lazy rồi dựng lại |
| `selectedItems` | Đọc: mảng item đang chọn. Gán (`[selectedItems]` của catalog): mảng item hoặc id để chọn sẵn |
| `tree` · `commands` · `selector` · `items` | Gán rời từng mảnh thay vì cả `option` |

> Rà soát `#c-tree` 2026-10-12: đã gỡ `expand()` / `collapse()` / `clearSelection()` / `selectedIds` / `autoId` — không có trong bảng API catalog (Rule 18). Nút ❌ trên thanh thao tác bỏ tooltip (catalog không có), giữ `aria-label`.

Sự kiện: `sd-selected-items-change` · `sd-select-change` · `sd-expand-change` ·
`sd-collapse-change`.

**Hình dáng theo catalog:** nhánh mở icon `folder_open`, đóng `folder`; **lá
không có icon** trừ khi item tự khai `icon`; lá vẫn render nút mũi tên dạng
`--placeholder` để nhãn thẳng hàng. Dòng cao tối thiểu 44px, thụt lề
`4px + cấp × 20px`.

> **Checkbox trong `sd-tree` là indigo `#3f51b5`, không phải nâu `--sd-primary`.**
> Đây là kết quả thật của thư viện (catalog giải thích: `sd-tree` đặt nhầm nhóm
> biến `--mdc-checkbox-*` mà Material 20 không đọc). Kit mirror đúng, đã ghi
> `_memory/known-gaps.md` chờ Builder quyết.

Preview: [components/tree.html](../preview/components/tree.html)

---

## sd-history — DỰNG MỚI 2026-10-11 · ĐỒNG BỘ 2026-10-13 (catalog `#c-history` + mã thư viện 19.0.10)

Dòng thời gian dọc hiển thị lịch sử thao tác. Nhận mảng qua property `items`
(hoặc attribute `items` dạng JSON). So 2/2 ví dụ catalog: DOM (kể cả badge bên
trong) và computed style **trùng 100%**.

```js
document.querySelector('sd-history').items = [
  { title: 'Giám đốc Tài chính',
    status: { title: 'Đã duyệt', color: 'success', icon: 'check_circle' },
    date: '2026-10-07T16:42:00', actor: 'nguyen.van.an', source: 'Portal FINS',
    description: 'Phê duyệt Kế hoạch Funding KH-2026-0012…' },
  { title: 'Chuyên viên Treasury',
    status: { title: 'Lưu nháp', color: 'secondary', icon: 'fiber_manual_record' },  // secondary → icon xám c-black400
    date: '2026-10-04T17:05:00', actor: 'le.minh.chau', description: 'Khởi tạo kế hoạch.' },
  { title: 'Hệ thống', description: 'Đồng bộ dữ liệu từ core banking.' }  // thiếu trường cũng được
];
```

| Trường | Ý nghĩa |
|---|---|
| `title` | Tiêu đề mục (vai trò người thực hiện) |
| `status` | `{ title, color, icon }` → `<sd-badge [icon] [title] [color]>` của thư viện (type mặc định `icon`; không có `color` → `secondary`; không có `icon` → `fiber_manual_record`) |
| `date` | Pipe `viewDateTime`: `HH:mm dd/MM/yyyy` (qua `isDate` / `toFormat` của @sdcorejs/utils). Không có → trống (như catalog); không phải ngày → `--` (EMPTY_STR của thư viện); chuỗi đã định dạng sẵn `HH:mm dd/MM/yyyy` → giữ nguyên (mở rộng của kit) |
| `actor` | Render thành `Bởi @actor` |
| `source` | Render thành `· source` |
| `description` | **Cắt 2 dòng** (`-webkit-line-clamp: 2`) |

Mục thiếu trường vẫn render thẻ bọc rỗng (`span.status`, `span.date`, `div.meta`) để bố cục không nhảy.
Component có `min-width: 470px` → màn hẹp sẽ cuộn ngang.
Thẻ `.card` của history KHÔNG có viền (chỉ `box-shadow 0 2px 4px #0000001a`) — CSS đã gỡ `.card` chung của kit.

Preview: [components/history.html](../preview/components/history.html)

---

## sd-org-chart — ĐỒNG BỘ 2026-10-13 (catalog `#c-org-chart` + mã thư viện 19.0.10)

Sơ đồ tổ chức dạng cây từ trên xuống, **vẽ hoàn toàn bằng CSS**. So 3/3 ví dụ catalog:
DOM, tên lớp, toạ độ / màu / chữ và mọi đường nối `:before` / `:after` **trùng 100%**.

```js
const el = document.querySelector('sd-org-chart');
el.items = [{
  id: 'cfo', title: 'Nguyễn Văn An', description: 'Giám đốc Tài chính', image: '/assets/an.png',
  children: [
    { id: 'nv', title: 'Trần Thị Bình', description: 'Trưởng phòng Nguồn vốn', children: [...] },
    { id: 'p2', title: 'Phòng Kế toán', expanded: false, children: [...] }   // thu sẵn
  ]
}];
// hoặc: el.option = { items, collapsible, itemTemplate, onToggle, autoId } — option.* thắng input rời
```

| Input | Giá trị | Mặc định |
|---|---|---|
| `items` | property JS (hoặc JSON qua attribute) | `[]` |
| `option` | `{ items?, collapsible?, itemTemplate?, onToggle?, autoId? }` | - |
| `collapsible` | boolean — `"false"`: không nút thu gọn, luôn mở hết (bỏ qua `expanded: false`) | `true` |
| `itemTemplate` | `function (ctx) → HTML` thay nội dung thẻ (≙ `[itemTemplate]` / `<ng-template sdOrgChartItemDef>`) | - |
| `autoId` | host `data-autoid="components-org-chart-{autoId}"`; thẻ con `…-{node, image, title, description, toggle}-{id}` (ký tự lạ trong id → `-`) | - |

`ctx` của `itemTemplate` y hệt thư viện: `$implicit` · `item` · `depth` · `parent` · `expanded` ·
`hasChildren` · `isLeaf` · `toggle`. HTML trả về không gọi được hàm, nên phần tử mang
`data-sd-org-toggle` trong thẻ bấm vào = `ctx.toggle()` (kit thêm).

| Trường item | Ý nghĩa |
|---|---|
| `id` | Khoá node — lưu trạng thái mở / đóng, sinh autoId |
| `title` · `description` | Tiêu đề · dòng mô tả |
| `image` | Ảnh tròn 44px trên thẻ |
| `color` | Tô nền thẻ (`--sd-org-node-color`), viền tự trộn 36% |
| `expanded: false` | Thu sẵn nhánh con |
| `children` | Nhánh con |

Ba biến thể thẻ tự chọn theo dữ liệu: có `image` → thẻ đầy đủ (cao ≥ 110px); không `image` →
`--no-image` (≥ 78px); không `image` **và** không `description` → `--compact` (74×40).

Trạng thái mở / đóng: `state[id] ?? item.expanded ?? true`, **giữ nguyên khi gán items mới** (như
thư viện). Nút thu gọn: `aria-label` "Collapse children" / "Expand children" (nguyên văn thư viện,
không dịch), icon `expand_more` / `chevron_right`.

**Method / event:** `toggle(item | id)`, `isExpanded(item | id)`; `option.onToggle({ item, expanded })`
(đúng chữ ký thư viện); event kebab `sd-toggle` → `{ item, id, expanded }`.

> **Khác `sd-tree`:** `sd-tree` là danh sách **phẳng** thụt lề theo biến;
> `sd-org-chart` **lồng `<ul>` thật** vì đường nối vẽ bằng `:before`/`:after` của
> từng `<li>`, cần quan hệ cha–con thật trong DOM.

Preview: [components/org-chart.html](../preview/components/org-chart.html)

---

## sd-bar-chart · sd-line-chart · sd-pie-chart · sd-doughnut-chart — DỰNG MỚI 2026-10-13 (catalog `#c-chart` + mã thư viện 19.0.10)

Bốn wrapper mỏng quanh **Chart.js 4.5.1 thật** (đúng `chart.js ^4.5.1` của thư viện, đã
`register(...registerables)`), nạp lười từ `design-system/vendor/chartjs/chart.umd.min.js` khi
biểu đồ đầu tiên vào trang. Catalog chỉ vẽ SVG tĩnh; kit vẽ canvas thật nên có tooltip,
animation, bấm legend ẩn dataset.

```html
<sd-bar-chart id="barChart"></sd-bar-chart>
<script>
  barChart.data = {
    labels: ['Vietcombank', 'BIDV', 'Techcombank'],
    datasets: [
      { label: 'Hạn mức (tỷ VND)', data: [500, 450, 300] },
      { label: 'Đã sử dụng (tỷ VND)', data: [320, 410, 120] }
    ]
  };
  barChart.options = { plugins: { legend: { position: 'bottom' } } };   // tuỳ chọn
</script>

<!-- hoặc JSON trong attribute (HTML không truyền được object) -->
<sd-pie-chart data='{"labels":["A","B"],"datasets":[{"data":[60,40]}]}'></sd-pie-chart>
```

| Input | Giá trị | Mặc định |
|---|---|---|
| `data` | `ChartData` của Chart.js — **bắt buộc**. Property JS hoặc JSON qua attribute | - |
| `options` | `ChartOptions` của Chart.js. Property JS hoặc JSON qua attribute | `{}` |
| `plugins` | mảng plugin Chart.js — property JS, **chỉ đọc lúc tạo biểu đồ** (như thư viện) | `[]` |

- **Đổi `data` / `options` sau khi vẽ** = effect của thư viện: `chart.data = data; if (options) chart.options = options; chart.update()` — giữ nguyên đối tượng Chart, có animation chuyển.
- **Cột / đường > 15 nhãn** → khung `overflow-x: auto`, `min-width = số nhãn × 50px` (cuộn ngang). Pie / doughnut không cuộn.
- **Kích thước**: Chart.js `responsive` + `maintainAspectRatio` mặc định — rộng theo vật chứa, cao = rộng ÷ 2 (cột / đường) hoặc = rộng (pie / doughnut). Muốn cao cố định thì đặt chiều cao cho thẻ và `options: { maintainAspectRatio: false }`.
- **Màu**: không khai báo màu → plugin *Colors* mặc định của Chart.js (`#36A2EB`, `#FF6384`, `#FF9F40`, `#FFCD56`, `#4BC0C0`, `#9966FF`, `#C9CBCF`; cột / đường: viền màu đặc + nền alpha 0.5; pie / doughnut: mỗi phần tử một màu đặc, viền trắng).
- **Component không có nền / viền.** Khung trắng của catalog là lớp `.chart-demo-box` của trang demo — muốn khung thì bọc trong `sd-section`.
- Đọc thêm: getter `chart` (đối tượng Chart.js, ≙ thuộc tính public `chart` của component) · sự kiện `sd-ready { chart }` khi vẽ xong lần đầu. Gỡ thẻ khỏi trang → `chart.destroy()` (ngOnDestroy); chuyển chỗ trong cùng một nhịp thì giữ biểu đồ.
- `window.Chart` có sẵn thì dùng luôn; `window.SD_CHARTJS_BASE` đổi thư mục nạp.

DOM (template thư viện):

```
sd-bar-chart / sd-line-chart
  └ div[style="width: 100%; height: 100%; overflow-x: visible|auto;"]
     └ div[style="position: relative; height: 100%; (min-width: N×50px)"]
        └ canvas
sd-pie-chart / sd-doughnut-chart
  └ div[style="position: relative; height: 100%; width: 100%;"]
     └ canvas
```

Preview: [components/chart.html](../preview/components/chart.html)

---

## sd-operator — ĐỒNG BỘ 2026-10-13 (catalog `#c-operator` + mã thư viện 19.0.10)

Nút icon mở `mat-menu` liệt kê các toán tử được phép **theo đúng thứ tự truyền vào**.
`sd-query-bar` / `sd-query-builder` dùng khi dựng điều kiện. So 8/8 nút + 2/2 menu của catalog:
DOM, tên lớp, toạ độ / màu / chữ **0 lệch**.

| Attribute / property | Ý nghĩa | Default |
|---|---|---|
| `model` (bí danh cũ `value`) | Mã toán tử đang chọn. Rỗng / mã lạ → icon **phễu**, không tooltip | — |
| `operators` | Mảng mã được phép, giữ thứ tự. JSON, `"A,B,C"` hoặc property JS | **`[]`** (như thư viện — menu rỗng) |
| `disabled` | boolean | `false` |
| `autoId` | `data-autoId` trên **nút**, nguyên giá trị (thư viện không thêm tiền tố) | — |

17 mã (bảng `OPERATORS` của `@sdcorejs/utils` 1.1.4, nhãn `VI_MESSAGES`): `EQUAL` Bằng · `NOT_EQUAL` ·
`GREATER_THAN` · `LESS_THAN` · `GREATER_OR_EQUAL` · `LESS_OR_EQUAL` · `CONTAIN` · `NOT_CONTAIN` ·
`START_WITH` · `NOT_START_WITH` · `END_WITH` · `NOT_END_WITH` · `IN` · `NOT_IN` · `BETWEEN` · `NULL` · `NOT_NULL`.

- Nút: `button.c-op-trigger.mat-mdc-menu-trigger.mat-mdc-tooltip-trigger` (`aria-haspopup`, `aria-expanded`)
  + thẻ `<mat-menu>` rỗng. Tooltip `matTooltip` phía trên = nhãn đã dịch.
- Menu mở nằm trong `.cdk-overlay-pane` ở `body > .cdk-overlay-container` (overlay CDK):
  `.mat-mdc-menu-panel.c-op-menu.mat-menu-after.mat-menu-below > .mat-mdc-menu-content >
  button.mat-mdc-menu-item.c-op-row[data-value]` (icon · `.c-op-label` · `.c-op-code`), dòng đang chọn
  `.c-op-active`. Đặt dưới nút, mép trái thẳng nút; thiếu chỗ thì lật `mat-menu-above` / `-before`.
- Bàn phím như mat-menu: Enter / Space mở (focus mục đầu, tô nền), ↑ ↓ (vòng) · Home · End, Enter chọn,
  Esc / Tab đóng; chọn xong / Esc trả focus về nút. Bấm ra ngoài là đóng.
- Đặt trong `sd-query-bar` / `sd-query-builder`: nút vẽ đúng DOM catalog của mục đó (xem known-gaps).

Phương thức `open()` (thư viện) / `close()` (kit); sự kiện `sd-change` → `{ value }` ≙ `(modelChange)`,
chỉ phát khi đổi giá trị.

```html
<sd-operator model="GREATER_OR_EQUAL" autoId="loc-so-tien"
  operators='["EQUAL","NOT_EQUAL","GREATER_THAN","LESS_THAN","GREATER_OR_EQUAL","LESS_OR_EQUAL","BETWEEN"]'>
</sd-operator>
```

Preview: [components/operator.html](../preview/components/operator.html)

---

## sd-import-excel — ĐỒNG BỘ 2026-10-13 (đọc / ghi .xlsx thật)

Modal nhập dữ liệu từ file Excel: tải tệp mẫu, đọc file người dùng chọn, kiểm tra từng ô theo cấu hình
cột rồi xem trước với trạng thái hợp lệ / cảnh báo / lỗi trước khi lưu. Logic, chuỗi tiếng Việt và DOM
theo mã thư viện `@sd-angular/core` 19.0.10 + catalog `#c-import-excel` (13 phép so DOM / computed style
trùng). Đọc / ghi file bằng **exceljs 4.4.0** (đúng bản thư viện khai) ở `design-system/vendor/exceljs/`,
tự nạp lần đầu dùng.

```js
const ie = document.querySelector('sd-import-excel');
ie.option = {
  title: 'Nhập danh sách khoản vay',
  fileName: 'Mau_import_khoan_vay',
  columns: [
    { field: 'loanCode', title: 'Mã khoản vay', type: 'string', required: true, width: '150px' },
    { field: 'bank', title: 'Ngân hàng', type: 'values', values: ['VCB','BIDV'], checkValueInArray: true, width: '150px' },
    { field: 'amount', title: 'Số tiền', type: 'number', required: true, min: 1, width: '190px' },
    { field: 'date', title: 'Ngày giải ngân', type: 'date', format: 'dd/MM/yyyy' },
    { field: 'collaterals', title: 'Tài sản đảm bảo', type: 'array', divideString: ';', unitString: 'tài sản' }
  ],
  validateItem: (item, idx) => existed(item.loanCode)
    ? { idx, warningMessage: `Khoản vay ${item.loanCode} đã tồn tại…` } : { idx },
  accept: (items, { file }) => api.import(items, file)
};
ie.open();
```

| Phương thức | Ý nghĩa |
|---|---|
| `open()` · `close()` | Mở (xoá dữ liệu cũ) / đóng modal |
| `upload()` · `downloadTemplate()` · `export()` | Như nút Tải lên / khung nét đứt / Tải về |
| `view('ALL'\|'SUCCESS'\|'WARNING'\|'ERROR')` | Lọc như các nút đếm |
| `setValidation(list)` | Thay lỗi / cảnh báo bằng kết quả server `[{ idx, errorMessage?, warningMessage? }]` |
| `setData(items)` | **Kit thêm** cho prototype: nạp mảng dữ liệu như vừa đọc từ file (không cần file thật); dạng cũ `{ data, status, message, errors }` vẫn nhận |

Sự kiện: `sd-closed` ≙ `(sdClosed)`. Option: `title` · `fileName` · `columns` · `transform` · `validateItem` ·
`validateItems` · `accept` · `limit` (1000) · `sheets`. Cột: `type` string · number · bool · values · date ·
datetime · time · array; `required` · `defaultValue` · `minlength`/`maxlength` · `min`/`max` · `values` +
`checkValueInArray` · `format` · `divideString`/`unitString` · `width` (300px) · `hidden` · `description` ·
`fill`/`fontColor` · `transform`.

Nút **"Xác nhận & Lưu"** bật khi có dòng hợp lệ / cảnh báo và không còn dòng lỗi, khoá lại sau khi bấm.
Bảng phân trang 50 dòng (mat-paginator, nhãn tiếng Anh như catalog).

Preview: [components/import-excel.html](../preview/components/import-excel.html)

---

## sd-data-state

Trạng thái vùng nội dung: loading / empty / error. Dùng bên trong tab, panel hoặc section khi dữ liệu đang tải, chưa có bản ghi, hoặc tải thất bại.

**Dựng lại 1:1 ngày 2026-10-10** từ `data-state.component.ts` / `.html` / CSS đã
biên dịch trong gói npm thật. Ghi chú cũ ở đây nói "Portal không có trang tài liệu
riêng, API dưới đây SUY RA từ cách dùng" — nay không còn phải suy nữa.

Hai điều khác hẳn bản trước:

1. **`state` có 5 giá trị và mặc định là `success`** — không phải 3 giá trị và
   không có mặc định. `state="success"` **chiếu thẳng nội dung bên trong ra**
   (như `<ng-content>`), tức component đóng vai lớp bọc trong suốt khi dữ liệu
   bình thường. Trước đây state lạ/thiếu thì kit render ra rỗng.
2. **Năm input `icon`, `fontSet`, `actionLabel`, `compact`, `fullPage` giờ mới
   thật sự chạy.** Trước đó chúng chỉ nằm trong `observedAttributes` mà không chỗ
   nào đọc ra dùng.

Markup và tên class chép đúng thư viện: `.sd-data-state` + `__symbol` / `__icon` /
`__title` / `__message` / `__actions`, biến thể `--compact` / `--full-page` /
`--with-icon`, thuộc tính `data-state`, `role` (`alert` khi error/forbidden,
`status` còn lại), `aria-busy` khi loading. Tên class cũ `.sd-data-state-title` /
`-message` / `-retry` giữ làm bí danh.

| `state` | `loading`, `empty`, `error`, `forbidden`, `success` | **`success`** | `success` = chiếu nội dung bên trong ra, không vẽ gì |
| `title` | string | theo `state` | Dòng chính. Bỏ trống thì lấy câu mặc định của trạng thái |
| `message` | string | theo `state` | Dòng phụ. Bỏ trống thì lấy câu mặc định của trạng thái |
| `retryable` | boolean | `false` | Hiện nút Thử lại. Bấm → bắn `sd-retry` |
| `retryLabel` | string | `Thử lại` (giả định mirror) | Nhãn nút thử lại; đọc cả `retryLabel` lẫn `retrylabel` |
| `actionLabel` | string | - | Nhãn nút hành động phụ bên cạnh nút thử lại (bắn `sd-action`) |
| `icon` | string - tên Material icon | theo `state` | Mặc định: loading `autorenew` · empty `inbox` · error `error_outline` · forbidden `lock` · success không icon |
| `fontSet` | `material-icons`, `material-icons-outlined`, `material-symbols-outlined` | `material-icons-outlined` | Bộ icon dùng cho `icon` |
| `compact` | boolean | `false` | Bản gọn - icon nhỏ, bớt khoảng đệm, dùng trong panel/tab hẹp |
| `fullPage` | boolean | `false` | Chiếm trọn chiều cao khung chứa và canh giữa dọc |

```html
<sd-data-state state="loading" title="Đang tải dữ liệu…" />

<sd-data-state
  state="error"
  title="Không tải được dữ liệu"
  message="Vui lòng thử lại để tải nội dung của tab này."
  retryable
  retryLabel="Thử lại" />

<sd-data-state state="empty" title="Chưa có dữ liệu trong nhóm này" message="Dữ liệu sẽ hiển thị tại đây khi có bản ghi." />
```

**Event:** `sd-retry` (↔ `(sdRetry)`) khi bấm nút Thử lại · `sd-action` (↔ `(sdAction)`)
khi bấm nút `actionLabel`. Cả hai `bubbles: true`, không kèm detail.

> **Lỗi cũ, đã sửa 2026-10-10:** `sd-retry` **chưa từng bắn lần nào**. Hàm gắn
> listener kiểm `if (!btn._bound)` để khỏi gắn hai lần, nhưng `_bound` là cờ nội
> bộ của chính `SdButton` — nó tự đặt `this._bound = true` trong
> `connectedCallback`. Nên điều kiện luôn sai và listener không bao giờ được gắn.
> Nay dùng cờ riêng. Bài học chung: **đừng mượn tên thuộc tính nội bộ trên một
> element thuộc component khác.**

**Hành vi render:**
- `loading` - spinner (dùng lại `@keyframes sd-spin`) + `title`.
- `empty` - theo quy ước kit dùng SVG từ `design-system/core/assets/empty-state-illustration.svg` (KHÔNG dùng Material Icon). Đây là quy ước của kit, không phải của Portal.
- `error` - `title`, `message`, và nút `sd-button` Thử lại khi có `retryable`.
- `title` là attribute HTML toàn cục: mirror nhớ giá trị rồi gỡ khỏi thẻ host để không hiện tooltip gốc của trình duyệt (cơ chế giống `SdInform`).

---

## Chọn dòng + thao tác hàng loạt — `selector` (`selector-action` — snackbar)

Thanh thao tác hàng loạt là **của chính `sd-table`** — không tự dựng thanh. **Snackbar nổi giữa đáy màn hình** (cách đáy 90px) kiểu
catalog 19.0.10 — Builder 2026-10-30: *„Phần tick checkbox thì hiện snackbar như cũ chứ không hiện dòng ở dưới table“* → *„Trả lại hẳn
bản cũ“* (22.2.14 đặt thanh trong bảng; kit không theo chỗ này).

- Hiện khi có ≥ 1 dòng được chọn (kể cả bảng không khai `actions` — thanh chỉ có nút ❌), ẩn khi bỏ chọn hết.
- Bên trái: khối số nâu `.c-bg-length` (số dòng đã chọn) + " dữ liệu được chọn " (hoặc `selector.message` — chuỗi, hay hàm
  `(rows) => chuỗi`).
- Bên phải: **2 hành động đầu** là nút `sd-button` light sm (màu mặc định primary); từ hành động **thứ 3** gom vào nút "Thêm" (⋯) mở
  bảng chọn; cuối cùng nút ❌ bỏ chọn (outline secondary).

```js
var t = document.getElementById('main-table');   // columns / data vẫn khai bằng attribute
t.option = {
  selector: {
    visible: true,                               // = attribute `selectable`
    actions: [
      { title: 'Gửi phê duyệt', icon: 'send',   color: 'primary', click: function (rows) { /* rows = các dòng đã chọn */ } },
      { title: 'Xóa',           icon: 'delete', color: 'error',   click: function (rows) { /* … */ } },
      { title: 'Xuất danh sách', icon: 'download', click: function (rows) { /* → vào nút "Thêm" */ } }
    ]
  }
};
```

- Cột chọn dòng là `mat-checkbox` thu 85%, rộng 42px, dính trái; dòng đang chọn nền `#eef2ff`.
- Ô "chọn tất cả" ở đầu cột; bảng rỗng thì ô này để trống.
- `click(rows)` nhận mảng **object dòng** đang chọn (theo `id` nếu dòng có `id`).
- **Hành động nhóm** (22.2.14 `{ variant: 'group', title, icon, color, children: [...] }`, giữ trong snackbar): nằm trong 2 vị trí đầu
  → nút (icon mặc định `more_horiz`, `secondary` `light`) mở menu các hành động con; nằm trong "Thêm" → vạch ngăn + tiêu đề nhóm + các hành động
  con. Nhóm không có con thì bỏ. Mỗi hành động con có `click(rows)` riêng.

```js
selector: { visible: true, actions: [
  { title: 'Gửi phê duyệt', icon: 'send', click: fn },
  { variant: 'group', title: 'Chuyển trạng thái', icon: 'swap_horiz', children: [
    { title: 'Chờ phê duyệt', icon: 'schedule', click: fn },
    { title: 'Đã phê duyệt', icon: 'task_alt', click: fn } ] },
  { title: 'Xóa', icon: 'delete', color: 'error', click: fn },              // → "Thêm"
  { variant: 'group', title: 'Giao việc', children: [ /* … */ ] }           // → "Thêm": vạch ngăn + "Giao việc" + con
] }
```

- Chưa mirror: lọc hành động theo từng dòng (`meta.selector.actions` — hành động chỉ hiện khi MỌI dòng đã chọn cho phép), `tooltip`
  dạng tooltip Material (kit dùng `title`).

## Nhóm dòng — `option.group` (22.2.14)

Gom các dòng **của trang** theo giá trị các field (giữ thứ tự xuất hiện). Mỗi nhóm có một dòng tiêu đề nền `#f5f7fc`: ô chọn cả
nhóm (bảng `selectable`; chọn một phần → ô gạch ngang) · nút thu / mở (`collapsible`) · nhãn.

```js
t.option = {
  group: {
    fields: ['bankId'],                 // nhiều field → nhóm theo tổ hợp giá trị
    collapsible: true,                  // có nút thu / mở
    defaultCollapsed: false,            // nhóm mở sẵn (mặc định)
    template: function (ctx) {          // KIT — thay <ng-template sdGroupDef> của thư viện; trả HTML
      return '<span class="T14M">' + bankName(ctx.values.bankId) + '</span>' +
             '<span class="T14R text-black400 ml-8">' + ctx.items.length + ' hồ sơ</span>';
    }
  },
  aggregate: { group: true }            // tổng con sau mỗi nhóm đang mở (mục „Dòng tổng“)
};
```

- Không khai `template` → nhãn là JSON giá trị nhóm, đúng mặc định thư viện (`{"bankId": "vcb"}`) — prototype nên khai `template`.
  `ctx` = `{ key, values, items, data, isExpanded, isSelected, indeterminate }` (`items` = các object dòng của nhóm).
- Thu gọn nhóm không bỏ chọn; dòng trong nhóm đang thu gọn vẫn tính vào "chọn tất cả" và vào `click(rows)`.
- Bảng cây không nhóm được (thư viện: cây thắng nhóm).
- Angular: `group.template` ≙ `<ng-template sdGroupDef let-values="values" let-items="items">` (Rule 18 ngoại lệ 2 — template không
  truyền được qua HTML).

## Export — `option.export` (22.2.14)

Nút "Export" ở chân bảng xuất **thật** file (ẩn khi bảng rỗng):

| `export` | Nút |
|---|---|
| `{ visible: 'ALL' }` / `true` / attribute `export-visible` | mở menu "Export Excel" · "Export CSV" |
| `{ visible: 'EXCEL' }` · `{ visible: 'CSV' }` | xuất thẳng một định dạng |
| `{ type: 'custom', onExport: function (filter) { return Promise } }` | gọi hàm của trang (nút quay trong lúc chờ) |

- Dữ liệu: mọi dòng **sau lọc + sắp xếp, không cắt trang**; bảng cây = mọi node của cây đã lọc (cha trước con). Chế độ server: kit
  gọi `items(filter, { page, pageSize: export.maxItemsPerRequest || 1000 })` lần lượt tới hết `total`, hoặc `export.items(filter)`
  nếu khai. `export.mapping(rows)` đổi dữ liệu trước khi ghi.
- Cột: mọi cột trừ `action` / `menu` / `raw` (kiểu riêng của kit) và cột `export: { disabled: true }`; `export.columns` thêm cột chỉ
  có trong file. Giá trị: `transform(value, row, { isExport: true })` nếu có; ngày `yyyy/MM/dd`, ngày giờ `yyyy/MM/dd HH:mm:ss`;
  `values` → tên hiển thị; `boolean` → `displayOnTrue` / `displayOnFalse`; số giữ số.
- Excel: dòng 1 = tên field, dòng 2 = tiêu đề cột (nền xanh đậm), dữ liệu từ dòng 3 — đúng mẫu `SdExcelService` của thư viện. Tên
  file `export.fileName` (kit thêm `.xlsx` nếu thiếu đuôi). CSV: UTF-8 có BOM, phân cách `,`, tên `<fileName|CSV>_yyyy-MM-dd-HH-mm-ss.csv`.
- Chưa mirror: `export.sheets` (sheet phụ), % tiến độ trên nút, `export.batch`.

## Tìm nhanh — `option.filter.quickSearch` (22.2.14)

Thanh trên đầu bảng: các dropdown lọc (áp **ngay** khi chọn) + một ô từ khoá (áp khi bấm **Enter**; ✕ xoá và áp luôn). Lọc thật
trên dữ liệu local, AND với lọc theo cột / Bộ lọc ngoài; về trang 1 mỗi lần đổi.

```js
t.option = {
  columns: [ /* … */ ],
  items: ROWS,
  filter: { quickSearch: {
    containFields: ['code', 'name'],     // từ khoá: CHỨA (không phân biệt hoa thường) ở một trong các field — OR
    equalFields: ['taxCode'],            // từ khoá: BẰNG ĐÚNG ở field này — cũng OR
    placeholder: 'Tìm theo mã hoặc tên…', // mặc định "Tìm kiếm…"
    filters: [                           // dropdown — AND giữa các dropdown
      { field: 'bankId', title: 'Ngân hàng', type: 'values', required: true,
        option: { items: BANKS, valueField: 'id', displayField: 'name' } },
      { field: 'status', title: 'Trạng thái', type: 'values', default: ['pending'],
        option: { items: STATUSES, valueField: 'code', displayField: 'name', selection: 'MULTIPLE' } }   // chọn nhiều → IN
    ]
  } }
};
```

- Không khai `containFields` / `equalFields` nào → từ khoá bị bỏ qua (đúng thư viện).
- Dropdown `required: true` chưa chọn → ô từ khoá khoá + dòng gợi ý "Chọn các bộ lọc bắt buộc trước khi tìm kiếm.", bảng rỗng ở
  trạng thái "Vui lòng chọn bộ lọc để bắt đầu" (chế độ server: không gọi `items`).
- Lọc ra rỗng → trạng thái "Không có kết quả phù hợp".
- Chế độ server (`items` là hàm): kit truyền `filter.quickSearch = { term, filters }` (giá trị đã áp) — trang tự lọc trong hàm.
- Dropdown đổi giá trị → gọi `filters[i].onChange(value)` nếu khai.
- **Bảng cây** (attribute `tree`): giữ nhánh nào có node khớp (chính nó hoặc con cháu), con không khớp bị ẩn; các node có con cháu
  khớp tự mở mỗi khi giá trị tìm đổi. Chân bảng đếm số node gốc còn lại.
- Chưa mirror: `hidden` / `disabled` dạng signal, dropdown nạp `items` bằng hàm / Observable, slot `sdQuickSearchRight`.

## Dòng tổng — `columns[].aggregate` + `option.aggregate` (22.2.14)

Một dòng tổng dính đáy bảng (nền xám nhạt, chữ 500), mỗi ô thẳng cột của nó; cột không khai `aggregate` để trống.

| `aggregate` | Kiểu cột dùng được | Kết quả |
|---|---|---|
| `'SUM'` · `'AVERAGE'` | `number` | tổng / trung bình — định dạng số 2 số lẻ (`1.250.000,00`) |
| `'MIN'` · `'MAX'` | `number`, `date`, `datetime` | nhỏ / lớn nhất (ngày hiện `dd/MM/yyyy`) |
| `'COUNT'` | mọi kiểu | số ô có giá trị (bỏ ô rỗng) — số nguyên |
| hàm `(items, ctx) => giá trị` | mọi kiểu (chỉ qua property `option`) | giá trị hàm trả về (số / Date / chuỗi) |

```js
t.option = {
  aggregate: { scope: 'filtered' },          // 'page' (mặc định) = các dòng đang hiện ở trang này · 'filtered' = mọi dòng sau lọc
  columns: [
    { field: 'code',   title: 'Mã hồ sơ', type: 'string', aggregate: 'COUNT' },
    { field: 'amount', title: 'Số tiền', type: 'number', align: 'right', aggregate: 'SUM' },
    { field: 'disbursedAt', title: 'Ngày giải ngân', type: 'date', aggregate: 'MAX' }
  ]
};
```

- Phép không hợp kiểu cột (vd `SUM` trên cột chữ), `scope: 'filtered'` ở chế độ server, hay chưa chọn dropdown bắt buộc → ô hiện
  `---` (thư viện `--`; kit theo quy ước ô trống của Builder 2026-10-30).
- **Tổng con nhóm**: `aggregate: { group: true }` + `option.group` → một dòng tổng (`tr.sd-aggregate-row`) sau các dòng của mỗi
  nhóm đang mở.
- **Bảng cây**: `aggregate: { tree: { items: 'leaves' | 'roots' | 'all', subtotal: true } }` — `items` chọn node đem tính
  (`leaves` mặc định = node không có con · `roots` = node gốc · `all` = mọi node); tổng chung tính trên cây đã lọc; `subtotal` → dòng
  tổng con sau các con cháu của mỗi nhánh **đang mở** (tính trên con cháu, không gồm chính nó).

```js
tbl.setAttribute('tree', JSON.stringify({ childrenKey: 'children', defaultExpanded: 1 }));
tbl.option = {
  aggregate: { tree: { items: 'leaves', subtotal: true } },
  columns: [ { field: 'name', title: 'Hạng mục', aggregate: 'COUNT' },
             { field: 'cost', title: 'Thành tiền', type: 'number', align: 'right', aggregate: 'SUM' } ],
  items: TREE
};
```

- Chưa mirror: `templateRef` riêng cho ô tổng, dòng tổng trên mobile, cây tải lười (lazy).

## sd-etable (Editable Table)

CSS class pattern cho **inline-edit table** — table có editable cells (select, input trong từng ô). Mirrors `OMEU/Table/Edit` trong Figma DS (node `235:2858`).

**Khi nào dùng `sd-etable` vs `sd-table`:**

| | `sd-table` | `sd-etable` |
|---|---|---|
| Loại | Web component (JS config-driven) | CSS class pattern (HTML thuần) |
| Cells | Display-only | Editable (input, select, …) |
| Dùng khi | Browse page, Read page | Form page cần nhập liệu theo dòng |
| Ví dụ | Danh sách hợp đồng | Điều kiện áp dụng, BOM, danh mục cấu hình |

**Không dùng `sd-table` cho editable rows** — `sd-table` không hỗ trợ interactive controls trong cells.

### Cấu trúc HTML

```html
<div class="sd-etable">
  <table>
    <thead>
      <!-- Hàng tên cột -->
      <tr class="etable-name-row">
        <th class="etable-ctrl" colspan="2"></th>  <!-- control cols -->
        <th>Thông số</th>
        <th>Điều kiện</th>
        <th>Giá trị</th>
        <th style="width:44px;"></th>              <!-- delete col -->
      </tr>
      <!-- Hàng filter (tuỳ chọn — bỏ nếu không cần filter) -->
      <tr class="etable-filter-row">
        <th class="etable-ctrl" colspan="2"></th>
        <th>
          <div class="etable-filter-cell">
            <span class="material-icons-outlined">filter_alt</span>
            <input class="etable-filter-input" placeholder="Lọc...">
          </div>
        </th>
        <th>...</th>
        <th>...</th>
        <th></th>
      </tr>
    </thead>
    <tbody id="etable-body">
      <!-- rows injected by JS -->
    </tbody>
    <!-- Empty state (ẩn khi có rows) -->
    <tfoot>
      <tr><td colspan="6">
        <div class="etable-empty" id="etable-empty">
          Chưa có dòng nào — nhấn "Thêm dòng" để bổ sung.
        </div>
      </td></tr>
    </tfoot>
  </table>
  <!-- Footer -->
  <div class="etable-footer">
    <sd-button type="light" color="primary" size="sm" prefixIcon="add" title="Thêm dòng" onclick="addRow()"></sd-button>
  </div>
</div>
```

### Row template (JS)

```js
function buildRow() {
  return `
    <tr>
      <td class="etable-ctrl">
        <span class="etable-drag-handle material-icons-outlined">drag_indicator</span>
      </td>
      <td class="etable-ctrl">
        <span class="etable-add-row-btn material-icons-outlined" onclick="addRowAfter(this)">add</span>
      </td>
      <td>
        <select class="etable-select">
          <option value="">Chọn...</option>
          <option value="a">Mục A</option>
        </select>
      </td>
      <td>
        <select class="etable-select">...</select>
      </td>
      <td>
        <input type="text" class="etable-input" placeholder="Nhập giá trị...">
      </td>
      <td class="etable-ctrl" style="border-left:1px solid var(--border-secondary);">
        <sd-button type="link" color="error" size="sm" prefixIcon="close"
          aria-label="Xóa dòng" onclick="removeRow(this)"></sd-button>
      </td>
    </tr>`;
}
```

### Range input (cho thông số kiểu number)

```html
<div class="etable-range">
  <input type="number" class="etable-input" placeholder="Từ...">
  <span class="etable-range-sep">đến</span>
  <input type="number" class="etable-input" placeholder="Đến...">
</div>
```

### Quy tắc

- **Control columns bên trái** — drag handle + add-below button. Hiện on hover, ẩn mặc định (opacity 0).
- **Delete button** — `sd-button type="link" color="error" size="sm" prefixIcon="close"`, cột cuối bên phải.
- **Add row footer** — `sd-button type="light" color="primary" size="sm" prefixIcon="add"` trong `.etable-footer`. Không dùng `ctable-add-row` div tự làm.
- **Filter row tuỳ chọn** — thêm `etable-filter-row` nếu cần filter theo cột. Bỏ hoàn toàn nếu table nhỏ hoặc không cần lọc.
- **Empty state** — ẩn `<tfoot>` hoặc `.etable-empty` khi tbody có rows.
- **Không dùng inline style** để thay thế DS tokens — luôn dùng `var(--...)`.
- **Tối đa ~10 columns** — nếu nhiều hơn, cân nhắc chia thành nhiều bước nhập.

---

## sd-query-builder — DỰNG MỚI 2026-10-11

Trình dựng bộ lọc trực quan: nhóm AND/OR lồng nhau, mỗi điều kiện là
**trường – toán tử – giá trị**, phát ra Filter chuẩn.

```html
<sd-query-builder id="qb"></sd-query-builder>
<script>
  var qb = document.getElementById('qb');
  qb.fields = [
    { key: 'bankCode', label: 'Ngân hàng cho vay', type: 'values', icon: 'account_balance',
      values: [{ value: 'VCB', display: 'Vietcombank' }] },
    { key: 'loanAmount', label: 'Số tiền vay (VND)', type: 'number' },
    { key: 'disbursementDate', label: 'Ngày giải ngân', type: 'date' },
    { key: 'contractNo', label: 'Số hợp đồng', type: 'text' }
  ];
  qb.value = { logic: 'AND', filters: [
    { field: 'bankCode', operator: 'IN', data: ['VCB'] },
    { logic: 'OR', filters: [ /* nhóm con */ ] }
  ] };
  qb.addEventListener('sd-change', e => console.log(e.detail.value));
</script>
```

| Thành viên | Ý nghĩa |
|---|---|
| `.fields` | `[{ key, label, type, icon?, values?, operators?, min? }]`. `type`: `values` · `number` · `date` · `text` |
| `.option` | `{ fields, comparisonMode, onValueChange }` |
| `.value` · `.filters` · `.rootLogic` | Filter chuẩn; `value` là tổng của hai cái kia |
| `mode="view"` | Chuỗi truy vấn chỉ đọc, tô màu theo token |
| `comparisonMode="value-or-field"` | Thêm ô chọn nguồn: nhập giá trị **hoặc** so với trường khác |
| `disabled` | Như catalog: khoá nút AND/OR, +, ✕, toán tử và nút × của ô chọn; khung mờ `.7` và chặn chuột — **ô chọn / ô nhập không mang `disabled`** nên vẫn vẽ như thường |
| `autoId` | Như mọi component khác |

Sự kiện: `sd-change` → `{ value }` · `sd-logic-change` → `{ path, logic }`.

Ô chọn trường / nguồn giá trị / chế độ ngày / trường so sánh hiện mục đã chọn theo
mẫu `qb-opt` của catalog (icon 18px + nhãn) — kit dựng bằng `selectedTemplate` của
`sd-select`. Icon trường: `icon` khai trong `fields`, không khai thì theo kiểu
(`number` → `tag` · `date` → `event` · `values` → `list` · `text` → `text_fields`).
`addRule` / `addGroup` / `removeAt` đã gỡ khỏi API công khai (catalog không có).

**Cấu trúc rule**: `{ field, operator, dataType?, data }` —
`BETWEEN` dùng `data: [từ, đến]`, `IN`/`NOT_IN` dùng mảng,
`dataType: 'field'` thì `data` là **key** của trường đem so sánh,
trường `date` thêm `dateMode: 'relative'|'absolute'` và `unit`.

> Catalog ghi *"menu toán tử và panel của select không mở"* vì nó dán DOM đã
> render. Kit dùng `sd-operator` và `sd-select` chạy thật nên **mở được** —
> lệch theo hướng nhiều hơn, đã ghi ở `_memory/known-gaps.md`.

Preview: [components/query-builder.html](../preview/components/query-builder.html)
