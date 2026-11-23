# sd-* Web Components — Index

*API Reference cho tất cả sd-* Web Components trong OMEU Prototype Kit.*
*Đọc file group tương ứng khi cần chi tiết về component cụ thể.*

**Preview page:** `design-system/preview/components/sd-components.html`
**JS bundle:** `design-system/sd-components/sd-components.js`
---

## Files theo functional group

| File | Components |
|------|-----------|
| `sd-interactive.md` | **sd-button**, **sd-badge** + STATUS_MAP |
| `sd-form.md` | **sd-input**, **sd-select**, **sd-textarea**, **sd-date**, **sd-datetime**, **sd-input-number**, **sd-switch**, **sd-chip**, **sd-chip-calendar**, **sd-upload-file**, viewed mode |
| `sd-layout.md` | **sd-section** (5 variants + slots), **sd-section-item**, **sd-tab-group**, **sd-tab**, **sd-stepper**, **sd-step**, **sd-anchor**, **sd-anchor-item**, **sd-splitter**, **sd-splitter-panel** |
| `sd-data.md` | **sd-table** (column types, status/link/values, filter rules), **sd-query-bar** (filter chip row 7 field types), **sd-data-state** (loading/empty/error), **sd-bar-chart · sd-line-chart · sd-pie-chart · sd-doughnut-chart** (Chart.js) |
| `sd-overlay.md` | **sd-modal**, **sd-side-drawer**, **sd-avatar** |
| `sd-service.md` | **SdNotifyService**, **SdConfirmService**, **SdLoadingService** (services - window globals, không phải thẻ HTML) |

---

## Quick lookup — Component → Group file

| Cần gì | File |
|--------|------|
| Nút bấm | `sd-interactive.md` → sd-button |
| Badge trạng thái / STATUS_MAP | `sd-interactive.md` → sd-badge |
| Input text, số, ngày, dropdown, textarea | `sd-form.md` |
| Upload file | `sd-form.md` → sd-upload-file |
| Switch / toggle boolean | `sd-form.md` → sd-switch |
| Viewed (read-only field) | `sd-form.md` → viewed mode |
| Nhập danh sách chip tự do (Enter/Comma) | `sd-form.md` → sd-chip |
| Chọn danh sách ngày từ lịch (chip calendar) | `sd-form.md` → sd-chip-calendar |
| Section card (form/detail/repeatable) | `sd-layout.md` → sd-section |
| Label-value pair | `sd-layout.md` → sd-section-item |
| Tab / chuyển nhóm nội dung | `sd-layout.md` → sd-tab-group + sd-tab |
| Wizard nhiều bước có thứ tự | `sd-layout.md` → sd-stepper + sd-step |
| Điều hướng giữa các phần của trang dài | `sd-layout.md` → sd-anchor + sd-anchor-item |
| Bố cục panel co dãn (workspace, sidebar + main) | `sd-layout.md` → sd-splitter + sd-splitter-panel |
| Thẻ số liệu chỉ xem (KPI) | `sd-components.md` → bpm-kpi-card |
| Thẻ đếm bấm để lọc nhanh bảng | `sd-components.md` → bpm-filter-scorecard |
| Data table, column types | `sd-data.md` → sd-table |
| Filter chip row (7 field types, popover/inline, saved filters) | `sd-data.md` → sd-query-bar |
| Trạng thái vùng dữ liệu (loading/empty/error) | `sd-data.md` → sd-data-state |
| Biểu đồ cột / đường / tròn / vành khuyên (Chart.js) | `sd-data.md` → sd-bar-chart · sd-line-chart · sd-pie-chart · sd-doughnut-chart |
| Modal dialog / bottom-sheet | `sd-overlay.md` → sd-modal |
| Side drawer, slide panel | `sd-overlay.md` → sd-side-drawer |
| Avatar / User initials | `sd-overlay.md` → sd-avatar |
| Preview ảnh inline (zoom, xoay, fullscreen, download, thumbnail) | `sd-overlay.md` → sd-preview-image |
| Viewer PDF (thumbnail sidebar, tìm chữ, zoom, download) | `sd-overlay.md` → sd-preview-pdf |
| Toast / confirm dialog / loading overlay | `sd-service.md` → SdNotifyService, SdConfirmService, SdLoadingService |
| Công cụ dev/QA soát `data-autoid` của cả trang | `sd-components.md` → sd-autoid-inspector (ngay dưới) |

---

## Directive — DỰNG MỚI 2026-10-11

Catalog có bốn directive; Web Component không có cơ chế directive nên kit dựng
lại bằng **attribute + xử lý uỷ quyền trên `document`**, giữ nguyên tên attribute
của catalog.

| Attribute | Hành vi |
|---|---|
| `a[sdHref="…"]` | Link `http(s)` mở **tab mới**; link nội bộ điều hướng thường. Rỗng → không làm gì |
| `[sdHoverCopy="…"]` | Rê chuột vào phần tử thì hiện nút sao chép ở mép phải; bấm thì chép vào clipboard, tooltip đổi thành "Copied" trong 1 giây |
| `[sdHoverCopyDisabled]` | Nút sao chép **bị gỡ khỏi DOM** (không phải ẩn) |
| `[sdScroll]` | Vùng cuộn dọc; thanh cuộn ngang chỉ hiện khi rê chuột vào. Đưa về đầu bằng `sdScrollTop(el)` hoặc `sdScrollTop('#id')` |
| `*sdDesktop` / `*sdMobile` | Phần tử **không** thuộc loại thiết bị hiện tại bị gỡ khỏi DOM. Kiểm tra một lần lúc khởi tạo, không theo dõi resize |

```html
<a sdHref="https://www.sbv.gov.vn">sbv.gov.vn</a>
<td sdHoverCopy="HS-2026-00125">HS-2026-00125</td>
<div sdScroll style="height:150px">…</div>
<sd-table sdDesktop></sd-table>
<div sdMobile class="loan-cards">…</div>
```

Preview: [components/directives.html](../preview/components/directives.html)

---

## bpm-kpi-card · bpm-filter-scorecard — DỰNG MỚI 2026-10-11

Hai thẻ của màn **Trung tâm công việc**. Không thuộc `@sd-angular/core` —
component của **lib-bpm**, nên giữ tiền tố `bpm-`.

### bpm-kpi-card

Thẻ chỉ số tĩnh: icon primary + nhãn + con số. Không bấm/hover.

| Attribute | Ý nghĩa |
|---|---|
| `key` | → `data-testid="work-center-kpi-{key}"` |
| `icon` · `label` · `value` | `value = 0` **vẫn render bình thường** |

```html
<div style="display:flex;gap:16px">
  <bpm-kpi-card key="pending-approval" icon="approval" label="Chờ tôi duyệt" value="12"></bpm-kpi-card>
  <bpm-kpi-card key="done-today" icon="task_alt" label="Đã xử lý hôm nay" value="0"></bpm-kpi-card>
</div>
```

Hàng thẻ chỉ là flex row `gap:16px` — catalog không có component bọc.

### bpm-filter-scorecard

Thẻ đếm **bấm được** để lọc nhanh bảng. Là `<button>` thật có `aria-pressed`.

| Attribute | Ý nghĩa |
|---|---|
| `key` | `soon` · `overdue` · `done` → `data-testid` + `data-key` |
| `label` · `value` | Con số **không** đổi theo bộ lọc |
| `active` | Thẻ đang chọn: viền primary, icon lọc nền primary chữ trắng |

Sự kiện `sd-filter-toggle` → `{ key, active }` (`active` là trạng thái **trước**
khi bấm).

> **Quy tắc "tối đa MỘT thẻ active" do TRANG CHA giữ**, đúng như catalog. Component
> chỉ báo ra sự kiện; trang tự quyết bật/tắt:
> ```js
> strip.addEventListener('sd-filter-toggle', e => {
>   const next = e.detail.active ? null : e.detail.key;   // bấm lại thẻ đang chọn = bỏ lọc
>   strip.querySelectorAll('bpm-filter-scorecard').forEach(c => c.active = c.getAttribute('key') === next);
> });
> ```

Preview: [components/work-center.html](../preview/components/work-center.html)

---

## sd-autoid-inspector — DỰNG MỚI 2026-10-11

Công cụ **dev/QA**, không phải component giao diện của trang. Nút tròn 36px cố
định góc phải dưới; bấm mở panel ba tab. Quét toàn trang tìm thẻ `sd-*` thiếu
hoặc trùng `data-autoid`, tô viền thẳng lên DOM, và xuất danh sách element cho
người viết auto-test.

```html
<!-- chỉ bật ở môi trường dev/test, đặt NGOÀI .app-shell -->
<sd-autoid-inspector id="aid"></sd-autoid-inspector>
<script>
  document.getElementById('aid').config = {
    requireSelectors: ['sd-select', 'sd-button', 'sd-table', 'sd-checkbox']
  };
</script>
```

| Thuộc tính | Ý nghĩa |
|---|---|
| `enabled` | `"false"` thì không dựng gì cả. Mặc định bật |
| `config` | Attribute (chuỗi JSON) hoặc property. Có `requireSelectors` và `host` |
| `config.requireSelectors` | Chỉ các thẻ khớp mới bị đòi autoid. Không khai → đòi **mọi** thẻ `sd-*` |
| `config.host` | Có host mới hiện khối "Tạo E2E test" (giao diện; kit không gọi host) |
| `window.SD_AUTOID_INSPECTOR_CONFIGURATION` | Cấu hình mặc định toàn trang; `config` của thẻ **thắng** |

| Phương thức | Ý nghĩa |
|---|---|
| `open()` · `close()` | Mở / đóng panel |
| `rescan()` | Quét lại DOM rồi vẽ lại (nút `refresh` trên panel gọi hàm này) |

**Ba tab**

- **Audit** — công tắc "Highlight DOM", ba ô đếm (Tổng autoid / Trùng / Thiếu),
  bảng autoid bị trùng, bảng element thiếu autoid kèm selector.
- **Elements** — ô lọc theo autoid/name/tag, bảng STT · Name · Autoid · Tag ·
  State · Value, nút copy xpath từng dòng. `sd-*` nằm trong một `sd-table` tách
  thành nhóm "Inside &lt;autoid bảng&gt;" riêng.
- **Export** — Copy JSON · JSON · CSV · MD POM · MD Table.

**Viền tô lên DOM:** xanh liền = hợp lệ · đỏ liền = trùng · cam nét đứt = thiếu.
Tắt công tắc là trả lại `style` gốc của từng phần tử.

> **Hai chỗ không dựng, cố ý:** dialog "Ngữ cảnh QC cho Robot Framework" (chính
> catalog ghi "không dựng") và việc sinh file `.zip` bộ test E2E (cần host
> ngoài). Xem `_memory/known-gaps.md`.

Preview: [components/autoid-inspector.html](../preview/components/autoid-inspector.html)

---

## sd-code-editor — DỰNG MỚI 2026-10-11

Khung xem/sửa code tô màu cú pháp, kiểu cửa sổ macOS tối, có nút copy.

```html
<sd-code-editor id="ce" language="json"></sd-code-editor>
<script>
  document.getElementById('ce').model = { maKeHoach: 'KH-FUND-2026-Q4', tongNhuCau: 1250000000000 };
  document.getElementById('ce').addEventListener('sd-change', e => console.log(e.detail.model));
</script>
```

| Thuộc tính | Ý nghĩa |
|---|---|
| `language` | `json` · `typescript` · `html` · `css` · `scss`. Mặc định `json` |
| `viewed` | Chỉ xem — bỏ `<textarea>`, nhãn đổi thành `(READ ONLY)` |
| `maxHeight` | Chiều cao tối đa vùng code. Mặc định `500px`; số trần thì hiểu là px |
| `.model` (property) | Chuỗi, hoặc **object** khi `language="json"` (tự `JSON.stringify(…, null, 2)`) |
| `.text` (chỉ đọc) | Nội dung dạng chuỗi đang hiển thị |

Sự kiện `sd-change` → `{ model, text }`. Với `language="json"`, `model` là object
khi JSON hợp lệ và là chuỗi khi chưa hợp lệ.

> **Tô màu** dùng bộ tách tối giản của kit, sinh đúng lớp `.token.*` của PrismJS
> (bảng màu prism-tomorrow). Catalog cũng không nạp PrismJS. `css`/`scss` catalog
> không có ví dụ nên kit chỉ tách ở mức selector/property/value — xem
> `_memory/known-gaps.md`.

Preview: [components/code-editor.html](../preview/components/code-editor.html)

---

## sd-mini-editor — CKEditor 5 THẬT (đồng bộ 2026-10-13)

Editor đơn giản cho ô bình luận: đậm / nghiêng / gạch chân, màu chữ, danh sách,
liên kết, mention `@`, xuất HTML hoặc Markdown. Chạy **CKEditor 5 ClassicEditor thật**
đúng bản thư viện dùng (`ckeditor5` 48.0.0, `licenseKey: 'GPL'`), đóng gói ở
`design-system/vendor/ckeditor5/ckeditor5.min.js` — tự nạp khi trang có `<sd-mini-editor>`.

```html
<sd-mini-editor id="me">
  <p>Nội dung ban đầu viết thẳng trong thẻ (≙ ngModel).</p>
</sd-mini-editor>
<script>
  document.getElementById('me').option = {
    placeholder: 'Viết bình luận cho hồ sơ...',
    maxHeight: '120px',
    outputFormat: 'markdown',
    enableMention: true,
    mentionConfig: { feeds: [{ marker: '@', feed: timNguoiDung, minimumCharacters: 1 }] },
    onMentionSelect: item => taggedUsers.push(item)
  };
</script>
```

| Thành viên | Ý nghĩa |
|---|---|
| `disabled` | readOnly mode của CKEditor — toolbar vô hiệu, vùng soạn thảo chỉ đọc |
| `.option` | `placeholder` · `maxHeight` · `enableMention` · `mentionConfig.feeds` · `outputFormat` · `onChange` · `onFocus` · `onBlur` · `onMentionSelect` |
| `.value` | ≙ `[(ngModel)]` (`.content` là bí danh cũ) |
| `setContent(html)` · `getContent()` · `getHtmlContent()` | `editor.setData` / `getData` (Markdown khi `outputFormat: 'markdown'`) |
| `focusEditor()` | Focus vùng soạn thảo |
| `insertMention({ id, name, marker? })` | Chèn mention tại con trỏ |
| `getMentions()` | Nguyên văn thư viện (thực tế trả `[]` — xem known-gaps) |
| `.editor` | Đối tượng CKEditor 5 thật |

Sự kiện: `sd-change` → `{ value, content, format }` (throttle 500ms leading + trailing như
thư viện) · `sd-focus` · `sd-blur` · `sd-ready` → `{ editor }`.

Feed mention theo dạng CKEditor: `{ id: '@...', text }` (id có marker). Feed kiểu cũ của kit
`{ id, name }` vẫn nhận (tự đổi). Panel gợi ý / ô liên kết / bảng màu là của CKEditor, gắn vào
`body` (`.ck-body-wrapper`) như bản thật.

> **Đổi từ vỏ tĩnh sang CKEditor thật** — Builder chọn "Nhúng CKEditor 5 vào kit" (2026-10-13).
> Catalog vẫn là mock tĩnh; kit khớp catalog về hình (đo computed style 0 lệch ngoài các chỗ
> do CKEditor thật sinh — `<i>` thay `<em>`, `data-list-item-id`, panel mention trong
> `ck-balloon-rotator` không mũi tên — xem `_memory/known-gaps.md`). Đặt thư viện chỗ khác:
> `window.SD_CKEDITOR_BASE = '…/ckeditor5/'` trước khi nạp `sd-components.js`.

Preview: [components/mini-editor.html](../preview/components/mini-editor.html)

---

## sd-ckeditor-styles — không có giao diện

Không render gì. Việc duy nhất: nạp **một lần** stylesheet global của CKEditor 5
(`core/styles/sd-ckeditor-styles.css`, nguyên văn `SdCKEditorStyles` của thư viện) vào
`<head>`. Catalog không vẽ thẻ này trong cây DOM của `sd-mini-editor` → component gọi thẳng
hàm nạp; thẻ vẫn dùng được khi cần nạp CSS ở chỗ khác.

```html
<sd-ckeditor-styles></sd-ckeditor-styles>
```

Không có trang preview riêng (không có gì để xem); phần giải thích nằm cuối trang
[components/mini-editor.html](../preview/components/mini-editor.html).

---

## sd-editor — ĐỒNG BỘ 2026-10-13 (catalog `#c-editor` + mã thư viện 19.0.10, CKEditor 5 thật)

Trình soạn thảo rich-text gắn với form: label, bắt buộc, giới hạn ký tự kèm bộ đếm, chỉ đọc, upload ảnh.
Chạy **CKEditor 5 48.0.0 thật** (ClassicEditor, cấu hình đúng thư viện) — mọi nút toolbar chạy được:
Bold · Italic · Underline | Font Size (10–20) · Font Color | căn trái / giữa / phải / đều | danh sách chấm · số
[| Upload image khi có hàm upload].

```html
<sd-editor id="ed" label="Nội dung tờ trình" helperText="Mô tả ngắn gọn mục đích"
           required maxlength="500" height="200px" maxHeight="320px" key="noiDung">
  <p>Nội dung ban đầu viết thẳng trong thẻ.</p>
</sd-editor>
<script>
  // ≙ provider SD_EDITOR_CONFIGURATION — bật nút upload ảnh (chọn theo `key`; không khai key = mọi editor không key)
  window.SD_EDITOR_CONFIGURATION = { key: 'noiDung', upload: files => api.upload(files) /* → [{ cdn, name, idOrKey }] */ };
  var ed = document.getElementById('ed');
  ed.validator = v => (v || '').length < 20 ? 'Nội dung quá ngắn' : null;   // hoặc Promise
  ed.addEventListener('sd-change', e => console.log(e.detail.model));
  // trước khi lưu (uploadMode 'deferred' mặc định): const html = await ed.upload();
</script>
```

| Thành viên | Ý nghĩa |
|---|---|
| `label` · `helperText` · `required` | Đẩy qua `<sd-label>` |
| `placeholder` · `maxlength` · `height` (mặc định 250px) · `maxHeight` (250px) | Như thư viện; `maxlength` bật bộ đếm (ẩn khi `disabled` / `hideInlineError`) |
| `readonly` · `disabled` | readOnly của CKEditor (toolbar vô hiệu) |
| `hideInlineError` | Lỗi hiện bằng icon góc dưới phải (tooltip) thay cho `mat-error` |
| `inlineError` · `.validator` | Câu lỗi từ ngoài / hàm kiểm (trả câu lỗi hoặc Promise) |
| `key` · `autoId` | Chọn cấu hình upload · `data-autoId="components-editor-{autoId}"` |
| `.model` (`.value`) · `.option` | Nội dung HTML · `{ imageConfig: { uploadFn, uploadMode, validation, batchSize, maxConcurrentUploads, maxImagesPerSelection, lazyLoad } }` |
| `.length` · `.errorMessage` · `.editor` | Số ký tự (chữ thật) · câu lỗi hiện tại · đối tượng CKEditor |
| `markAsTouched()` · `focusEditor()` · `upload()` | Hiện lỗi khi bấm Lưu · focus · đẩy ảnh blob lên rồi trả nội dung cuối |

Lỗi theo thứ tự thư viện, chỉ hiện khi đã chạm (blur): required "Vui lòng nhập nội dung" → maxlength
"Số ký tự tối đa: {max}" → validator → inlineError. Sự kiện: `sd-change` → `{ model }` (debounce 100ms) ·
`sd-focus` · `sd-blur` · `sd-ready` → `{ editor }`.

> Chế độ `readonly` **không** có nền xám — rule của thư viện không bao giờ khớp (catalog tự ghi), kit giữ y vậy.

Preview: [components/editor.html](../preview/components/editor.html)

---

## sd-form-render — ĐỒNG BỘ 2026-10-13 (catalog `#c-form-generic` + mã thư viện 19.0.10)

Form động theo cấu hình JSON (`SdFormGeneric` của thư viện), lưới 12 cột. Cấu hình **đúng schema
thư viện** — giống hệt thứ `sd-form-builder` của portal xuất ra:

```html
<sd-form-render id="fr"></sd-form-render>
<script>
  var fr = document.getElementById('fr');
  fr.configuration = { components: [
    { id: 'c1', type: 'textfield', key: 'soHopDong', label: 'Số hợp đồng',
      layout: { columns: 6 }, validate: { required: true, maxlength: 50 } },
    { id: 'c2', type: 'select', key: 'nganHang', label: 'Ngân hàng', layout: { columns: 6 },
      values: [{ value: 'vcb', label: 'Vietcombank' }, { value: 'bidv', label: 'BIDV' }] },
    { id: 'c3', type: 'datetime', subtype: 'date', key: 'ngayGiaiNgan', label: 'Ngày giải ngân', layout: { columns: 6 } },
    { id: 'c4', type: 'radio', key: 'phuongThuc', label: 'Phương thức trả nợ', layout: { columns: 12 },
      properties: { direction: 'row' }, values: [{ value: 'deu', label: 'Trả góp đều' }, { value: 'cuoi', label: 'Cuối kỳ' }] },
    { id: 'g1', type: 'group', label: 'Tài sản bảo đảm', properties: { icon: 'verified_user' }, components: [ /* … */ ] },
    { id: 'u1', type: 'upload', key: 'hoSo', label: 'Hồ sơ', properties: { type: 'file', extensions: ['pdf'], maxSize: 10, max: 5 } },
    { id: 't1', type: 'table', key: 'lichTraNo', label: 'Lịch trả nợ', columns: [{ key: 'ky', label: 'Kỳ', type: 'string' }, { key: 'goc', label: 'Gốc', type: 'number' }] },
    { id: 'd1', type: 'textfield', key: 'lyDo', label: 'Lý do ngoại lệ', layout: { columns: 6 },
      properties: { visibleWhenExpression: { field: 'coNgoaiLe', operator: 'EQUAL', value: 'yes' },
                    requiredWhenExpression: { field: 'coNgoaiLe', operator: 'EQUAL', value: 'yes' } } }
  ] };
  fr.entity = { soHopDong: 'HĐTD-2026/0158', nganHang: 'vcb' };
  fr.addEventListener('sd-form-change', e => console.log(e.detail.entity));
  // tệp của upload: window.SD_UPLOAD_FILE_CONFIGURATION = { upload(files), details(keys) }
</script>
```

| Thành viên | Ý nghĩa |
|---|---|
| `.configuration` | `{ components, variables?, validations?, onLoaded? }` — được format lại (SdFormatComponent: tự sinh `id`/`key`, `layout.columns` mặc định `'12'`, `subtype` `'date'`, radio `direction: 'row'`…) |
| `.entity` | `[(model)]` của mọi control — giá trị người dùng nhập chảy ngược vào đây |
| `.defaultEntity` | Gán vào entity những key còn trống |
| `viewed` | Chế độ xem (textfield/select/date: `sd-view`; number: `text-secondary` + `T16M`; radio: `T14R` + `T14M`; upload: nhãn + danh sách tệp khoá) |
| `getValidationMessages(alert)` | Form thiếu ô bắt buộc → đánh dấu mọi ô đã chạm (hiện lỗi), trả `undefined`; ngược lại trả mảng message của `configuration.validations` kiểu `expression` |

**Ô theo `type`** (lib-item của thư viện): `textfield` → `sd-input` · `textarea` → `sd-textarea` ·
`number` → `sd-input-number` (`validate.min/max`) · `datetime` → `sd-date` / `sd-datetime` theo `subtype` ·
`select` → `sd-select` (`properties.multiple`) · `radio` → `sd-radio` nhóm · `chip-string` / `chip-calendar` →
`sd-chip` / `sd-chip-calendar` · `upload` → `sd-upload-file` · `table` → bảng tĩnh + "Thêm mới" ·
`html` → nội dung `entity[key]` (biến `${key}` từ `properties.variables`) · `break` → ô trống 12 cột ·
`group` → `sd-section [title] [icon]`. `checkbox` không render (đúng thư viện).

**Biểu thức** (`properties.*WhenExpression`): `{ field, operator, value }` với `EQUAL · NOT_EQUAL ·
GREATER_THAN · LESS_THAN · GREATER_OR_EQUAL · LESS_OR_EQUAL · NULL · NOT_NULL`, hoặc
`{ type: 'combinator', combinator: '&&' | '||', conditions: [...] }`. Giá trị ngày nhận `now`, `3LastDay`.
Ẩn tĩnh: `properties.hidden`; khoá tĩnh: `disabled`; bắt buộc: `validate.required`. Đổi giá trị → sau 500ms
(debounce của thư viện) form tính lại.

Nguồn lựa chọn ngoài `values`: `valuesKey` tra `window.SD_FORM_GENERIC_CONFIGURATION.form.selections`
(≙ token `SD_FORM_GENERIC_CONFIGURATION`).

Sự kiện (kit): `sd-form-change` → `{ key, value, entity }` · `sd-form-add-row` → `{ key }` (nút "Thêm mới" — side-drawer
không dựng, đúng catalog).

> Cấu hình kiểu CŨ của kit (`columns`, `required: true`, `properties.items [{id,name}]`, hàm `hidden/required/disabled`)
> vẫn chạy (trang cũ). `sd-form-builder` từ 2026-10-13 sinh đúng schema thư viện. Trang mới viết theo schema ở trên.

Preview: [components/form-generic.html](../preview/components/form-generic.html)

---

## sd-document-builder + sd-header-footer-builder — CKEditor 5 thật, ĐỒNG BỘ THƯ VIỆN 2026-10-13

Trình soạn văn bản khổ A4 (catalog `#c-document-builder`): Times New Roman 13pt, heading, font, màu, bảng,
ảnh, ngắt trang, xoay khổ giấy, biến `{{…}}` bind được, bình luận theo đoạn chọn, xuất Word kèm header/footer.
**CKEditor 5 thật** với đúng cấu hình + plugin của thư viện (plugin nguyên văn ở
`vendor/sd-document-builder/`, nạp tự động sau `vendor/ckeditor5/ckeditor5.min.js`).

```html
<!-- host mặc định inline-block (thư viện) → trang tự đặt khung, như mục catalog -->
<sd-document-builder id="db" style="display:block;width:100%;height:640px">
  <p>Nội dung ban đầu (≙ setContent sau khi editor sẵn sàng)…</p>
</sd-document-builder>
<sd-header-footer-builder id="hf"><p style="text-align:center;">CÔNG TY …</p></sd-header-footer-builder>
<script>
  db.option = { orientation: 'PORTRAIT', onOrientation: o => console.log(o),
                comment: { onPendingComment: c => db.getCommentPluginAPI().setPendingSelection(c.startPath, c.endPath) } };
  db.addEventListener('sd-change', e => save(e.detail.content));        // ≙ (contentChange), throttle 500ms
  db.addEventListener('sd-ready', () => db.getVariablePluginAPI().bindValue('Hạn mức', '500.000.000.000'));
  db.exportDocx({ fileName: 'to-trinh.doc', header: hf.model, footer: '…' });
</script>
```

| Thành viên | Ý nghĩa |
|---|---|
| `.option` | `{ orientation, onOrientation, onSelection, comment: {…callbacks}, onDropVariable, onPasteVariable }` |
| `disabled` | Chỉ đọc (cả nút xoay giấy) |
| sự kiện `sd-change` · `sd-ready` · `sd-orientation-change` | `{ content }` (màu rgb/hsl → hex) · `{ editor }` · `{ orientation }` |
| `setContent()` · `getContent()` | HTML (setContent làm sạch biến HTML kiểu cũ) |
| `setOrientation('PORTRAIT'\|'LANDSCAPE')` · `getOrientation()` · `scrollToTop()` | Khổ giấy (`.ck-content.landscape` = 297mm) |
| `heading.all()` · `heading.scroll(id)` | Mục lục heading (tô vàng 5 giây) |
| `getVariablePluginAPI()` | `.all()` · `.scroll(uuid)` · `.bindValue(id, value)` · `.clearValue(id)` · `.bindValues({id: value})` · `.clearValues(ids)` · `.clearAllValues()` |
| `getCommentPluginAPI()` | `.setConfig()` · `.addComment()` · `.removeComment()` · `.selectComment()` · `.setComments()` · `.comments` · `.setPendingSelection()` · `.clearPendingSelection()` |
| `exportDocx({ fileName, header, footer })` · `exportWord(fileName, header, footer)` | Tải file Word (HTML Office, `mso-header/footer`); `exportWord` là tên catalog in |
| `hightSelectRange(range)` · `removeHighlightSeclectRange()` · `.editor` | Tô vùng chọn / đối tượng CKEditor |

**Biến** (`span.variable-widget.ck-widget` cần `data-id`, `data-value`, `data-display`): thêm bằng **kéo-thả**
(`dataTransfer.setData('ck-variable', JSON.stringify({ id, value, display }))`) hoặc dán `{{Tên}}`;
`bindValue` chuỗi → gạch chân xanh lá, chuỗi HTML → khối nét đứt (`data-binding="html"`).

`sd-header-footer-builder`: `.model` (thư viện chỉ nạp MỘT lần khi editor sẵn sàng) · sự kiện `sd-change { model }`;
hai nút cuối chèn `[PAGE]` / `[TOTAL]`.

> Lệch có chủ ý: xem `_memory/known-gaps.md` mục `sd-document-builder`. Bản export một file phải inline
> `ckeditor5.min.js` + `document-builder-plugins.min.js` (`ai-instructions/export.md`).

Preview: [components/document-builder.html](../preview/components/document-builder.html)

---

## sd-form-builder — ĐỒNG BỘ THƯ VIỆN 2026-10-13

Trình thiết kế form của bộ Form Generic (catalog `#c-form-builder`, API `[formGeneric]` ·
`(formGenericChange)`): palette trái, canvas lưới 12 cột, panel thuộc tính phải, Xem thử bằng
`sd-form-render`. Cấu hình vào/ra là **`SdFormGeneric` của thư viện** — đúng thứ `sd-form-render` nhận.

```html
<div style="height: 760px">            <!-- component chiếm 100% vùng chứa -->
  <sd-form-builder id="fb"></sd-form-builder>
</div>
<script>
  var fb = document.getElementById('fb');
  fb.formGeneric = {                                  // ≙ [formGeneric] — builder clone sâu
    components: [
      { id: 'c1', type: 'textfield', key: 'soHopDong', label: 'Số hợp đồng', layout: { columns: '6' },
        validate: { required: true, maxlength: 50 },
        properties: { disabledWhenExpression: { type: 'combinator', combinator: '&&', conditions: [
          { type: 'condition', field: 'trangThai', operator: 'EQUAL', value: 'DA_DUYET' } ] } } },
      { id: 'g1', type: 'group', label: 'Tài sản', layout: { columns: '12' },
        properties: { icon: 'verified_user', color: 'primary' }, components: [ /* … */ ] },
      { id: 'b1', type: 'break', label: 'Break', layout: { columns: '12' } }
    ],
    variables: [{ id: 'v1', key: 'trangThai', label: 'Trạng thái' }],
    validations: []
  };
  fb.addEventListener('sd-form-generic-change', e => save(e.detail.formGeneric));   // ≙ (formGenericChange)
</script>
```

| Thành viên | Ý nghĩa |
|---|---|
| `.formGeneric` (set) | `{ components, variables, validations }` — clone sâu sang mảng nội bộ |
| `getForm()` · `getComponents()` · `getVariables()` | Bản sao sâu cấu hình hiện tại (thư viện "chìa ra cho bên ngoài") |
| sự kiện `sd-form-generic-change` | `{ formGeneric }` sau mỗi thay đổi (gộp 200ms) — catalog in `(formGenericChange)` |
| `select(id)` · `.selected` | Chọn / đọc component đang chọn (thư viện chọn bằng bấm) |
| `addComponent(type)` · `removeComponent(id)` · `setMode(true\|false)` | Các hàm của class thư viện |

Bố cục dòng: component xếp theo thứ tự, dòng mới khi tổng `layout.columns` vượt 12
(`#syncComponentsToRows`); `layout.row` tự đánh lại. Kiểu: `textfield · textarea · number ·
datetime · select · radio · checkbox · chip-string · chip-calendar · upload · table · group · html ·
break` (break không có trong palette — nút **Ngắt dòng** ở mép phải mỗi dòng).

**Chạy thật** (class thư viện): bấm/kéo component từ palette · tìm component · chọn ·
Chỉ xem / Nhân bản / Ẩn / Xóa · co dãn cột (kéo pill, bắt theo 12 cột) · kéo dòng lên/xuống ·
kéo item trong dòng / sang dòng khác (quá 12 cột → cảnh báo) · **Thiết kế group** (Xác nhận / Bỏ qua
hoàn tác) · Xem thử + Gửi (`getValidationMessages`) · modal Xem JSON / Cấu hình biến / Cấu hình xác
thực / Thiết lập biểu thức FEEL (2 cấp điều kiện) / Gán tham số / Cấu hình cột. Chip trên canvas:
`properties.hidden` → “Đã ẩn” > `properties.viewed` → “Chỉ đọc” > có `*WhenExpression` → “Có điều kiện”.

`window.SD_FORM_GENERIC_CONFIGURATION.form` (≙ token): `templates` → “Dữ liệu mẫu” · `selections` →
“Dữ liệu API” · `tables` → “Dữ liệu cột” · `htmls` → mẫu HTML · `validation.functions` → “Phương thức
sẵn có”. Không khai thì các ô đó không hiện.

> Lệch có chủ ý (xem `_memory/known-gaps.md` mục `sd-form-builder`): kéo-thả tự dựng bằng pointer
> events (không có ô giữ chỗ trượt của CDK); nút huỷ “Bỏ qua” (Rule 16); `.msi` nạp Material Symbols
> Outlined từ Google; vài rule thư viện “không ăn” được mirror đúng như bản thật (icon/màu của group,
> CSS trong modal). Build-queries / build-variables (điều kiện truy vấn của Select API) **không dựng**.

Preview: [components/form-builder.html](../preview/components/form-builder.html)
