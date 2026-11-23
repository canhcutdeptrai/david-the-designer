# Rà soát toàn bộ kit với Core — 2026-10-10

Builder yêu cầu "rà soát lại tất cả với core". Lượt này **đổi phương pháp đo**, và
chính việc đổi phương pháp đã lật lại kết luận "0 input thiếu" của lượt trước.

## Phương pháp — và vì sao phương pháp cũ sai

| | Lượt trước | Lượt này |
|---|---|---|
| Danh sách input thật | Grep `InputSignal` trong `.d.ts` | Đọc `ɵɵComponentDeclaration<Class, "selector", _, {inputs}, {outputs}>` — **bảng input/output do chính trình biên dịch Angular sinh ra**, có cả `alias` (tên công khai) |
| Giá trị mặc định | Suy từ demo Portal, nhiều chỗ ghi "giả định mirror" | Đọc `input(<default>)` trong `sourcesContent` của source map |
| Kiểm chứng | `observedAttributes.includes('tên')` | Dựng element trong trình duyệt rồi **đo kết quả** |

Grep `InputSignal` bỏ sót mọi component khai input theo kiểu khác — `sd-select`,
`sd-table`, `sd-upload-file`, `sd-autocomplete`, `sd-tree` **không ra một dòng nào**.
Bảng `ɵɵComponentDeclaration` thì không thể sót, vì nó là thứ Angular dùng để
nối template với class.

## Ba nhóm lỗi tìm được

### 1. Input có TÊN mà không có HÀNH VI (8 cái)

`startIndex` (preview-image) · `startPage`, `scrollMode`, `password` (preview-pdf) ·
`keyboardStep` (splitter) · `fullPage`, `actionLabel`, `icon`, `fontSet`, `compact`
(data-state) · `collapsible` (section) · `collapsed` (splitter-panel).

Mỗi cái chỉ xuất hiện **đúng một lần** trong `sd-components.js`: trong
`observedAttributes`. Không chỗ nào đọc ra để dùng.

Tệ hơn: 6 assertion viết ra để "kiểm chứng" chúng đều có dạng
`observedAttributes.includes('startIndex')` — **kiểm tôi có gõ đúng chuỗi hay
không**, không kiểm gì về hành vi. Test lặp lại đúng giả định của code nên không
thể đỏ. Đã thay bằng assertion đo kết quả: `startIndex=2` phải cho bộ đếm "3 / 4",
`startPage=7` phải ghép `#page=7` vào `src` của iframe, `keyboardStep=40` phải làm
bước dịch khác với mặc định, `actionLabel` phải dựng nút và bấm phải bắn sự kiện.

Nhân tiện lòi ra một lỗi cũ hơn: `_bindRetry()` của `sd-data-state` kiểm
`if (!btn._bound)` để khỏi gắn listener hai lần — nhưng `_bound` là **cờ nội bộ
của chính `SdButton`**, nó tự đặt `this._bound = true` trong `connectedCallback`.
Nên điều kiện luôn sai và **`sd-retry` chưa từng bắn một lần nào**. Đổi sang cờ
riêng `_sdDataStateBound`.

### 2. Mặc định sai so với thư viện (12 cái thật)

| Component | Input | Thư viện thật | Kit trước đây | Hậu quả thấy được |
|---|---|---|---|---|
| `sd-modal` | `width` | thang `sx/sm/md/lg` → 20/40/60/80vw, mặc định `md` | `'560px'` | mọi modal sai bề rộng |
| `sd-modal` | `disableBackdropClose` | **`true`** | `false` | bấm nền là đóng — ngược hẳn |
| `sd-modal` | `lazyLoadContent` | **`true`** | `false` | nội dung dựng sớm hơn thật |
| `sd-tab-group` | `stretchTabs` | **`true`** | `false` | tab không giãn đều |
| `sd-tab-group` | `animationDuration` | `'500ms'` | `'300ms'` | |
| `sd-preview-image` | `showToolbar`, `loop`, `zoomable`, `downloadable` | **`true`** cả 4 | `false` cả 4 | không khai thì mất sạch toolbar |
| `sd-preview-pdf` | `showToolbar`, `downloadable`, `sidebarOpen` | **`true`** cả 3 | `false` cả 3 | |
| `sd-preview-pdf` | `scrollMode` | `'page'` | không đọc | |
| `sd-data-state` | `state` | `'success'` | không có mặc định | |
| `sd-select` / `sd-radio` | `valueField`, `displayField` | `''` | `'id'` / `'name'` | **`items=["a","b"]` hỏng hoàn toàn** |
| `sd-textarea` | `rows` | `5` | `3` | |
| `sd-query-bar` | `showClearAll` | **`true`** | `false` | |

Nhóm cờ boolean là một **lớp lỗi**, không phải lỗi lẻ: thư viện khai
`input(true, { transform: booleanAttribute })`, nghĩa là *không khai attribute =
bật*, *khai `="false"` = tắt*. Kit dùng `sdHasFlag` (có mặt = bật, vắng = tắt) cho
tất, nên mọi cờ loại này đều ngược. Đã thêm `sdFlagDefaultTrue()` dùng chung.

`lazyLoadContent = true` kéo theo một hệ quả thật: nội dung modal chỉ dựng ở lần
`open()` đầu, nên trang nào với tay vào trong một modal chưa mở sẽ gặp `null` —
đúng như bên Angular. Hai trang preview đang làm vậy, đã khai
`lazyLoadContent="false"` tường minh thay vì lặng lẽ đổi lại mặc định.

### 3. Event thật kit không có đối ứng (12 cái)

Đã bổ sung: `keyupEnter` → `sd-keyup-enter` (có TRIM trước khi bắn, y
`onKeyupEnter()` thật) · `sdBlur` → `sd-blur` · `cleared` → `sd-cleared` ·
`sdFocusForceBlur` → `sd-focus-force-blur` · `sdClosed` cho `sd-side-drawer`
(trước đó component này **không phát sự kiện nào cả**) · `sdCloseError` →
`sd-close-error` · `resizeEnd` → `sd-resize-end` · `collapsedChange` →
`sd-collapsed-change` · `queryChange` → `sd-query-change` · `sdAction` →
`sd-action`.

`sdFocusForceBlur` không mirror được 1:1 về cách BẬT: thư viện kiểm
`this.sdFocusForceBlur.observed` — tức "có ai đang nghe output này không" — mà DOM
không có cách hỏi điều đó cho CustomEvent. Mirror đổi sang bật tường minh bằng
attribute/property `focusForceBlur`; hành vi sau khi bật thì giống hệt.

`sdReadStateChange` (`sd-select`, `sd-table`) **cố ý không mirror**: nó báo trạng
thái của một lượt GỌI API, mà component trong kit không gọi API bao giờ. Ghi ở
`_memory/known-gaps.md`.

## Một lỗi nữa: tên attribute camelCase không ăn

`sd-query-bar` nhận `showClearAll`, `showLogicToggle`, `showSavedFilters`,
`savedFiltersKey`, `showOperatorOnChip` — nhưng `observedAttributes` chỉ khai dạng
kebab. HTML hạ mọi tên attribute về chữ thường, nên viết **đúng tên thư viện**
(`showClearAll`) thì trình duyệt thấy `showclearall`, không khớp dòng nào, và
gắn/gỡ sau khi render không vẽ lại. Hàm `_flag()` thì vốn đã đọc cả hai dạng — chỉ
thiếu ở `observedAttributes`. Đã khai đủ cả hai cho cả 6 input.

## Phạm vi: catalog 63 mục vs gói npm thật

Hai nguồn **không cùng tập component**, nên đừng coi catalog là danh sách đầy đủ:

- Catalog có mà gói `@sdcorejs/angular` 22.2.12 không có: `sd-document-builder`,
  `sd-form-builder` (dạng khác), 4 loại chart, `bpm-filter-scorecard`, `bpm-kpi-card`.
- Gói thật có mà catalog không trưng: `sd-card` / `sd-card-group`, `sd-breadcrumb`,
  `sd-job-progress`, `sd-audit-diff`, `sd-api-contract-builder`,
  `sd-entity-picker`, `sd-tree-select`, `sd-time` / `sd-time-range`, `sd-icon`,
  cùng nhóm `sd-layout` / `sd-sidebar-*`.

Theo `AGENTS.md`, **gói npm là mốc API**, catalog là mốc phạm vi và hình thức.

## Trạng thái sau đợt này

- 36 tag kit đang dựng: **0 input thiếu**, và lần này con số được kiểm bằng hành vi
  chứ không bằng khai báo.
- **50 tag** có trong gói thật mà kit chưa dựng (xem `CORE-CATALOG-GAP.md`).
- Bộ test: **774 PASS / 0 FAIL**, trong đó
  `test-core-defaults.mjs` là bộ mới chuyên đo mặc định và sự kiện.

## Công cụ đo cũng phải được kiểm — lần thứ hai

Script `kitgap.py` bắt `observedAttributes` bằng regex
`\{\s*return\s*\[`. Tôi thêm một dòng chú thích `/* */` giữa `{` và `return`, và
script lập tức báo **toàn bộ 10 input** của `sd-query-bar` là "thiếu". Nếu tin
ngay thì đã đi sửa một thứ không hỏng. Đã bóc comment trước khi khớp. Đây là lần
thứ hai trong hai lượt liên tiếp công cụ đo tự đẻ ra việc không có thật.
