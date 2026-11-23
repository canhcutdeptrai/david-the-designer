# sd-* Overlay & Misc Components

*Group: Modal + Side drawer + Avatar - dùng cho overlay panels và user display.*

---

## sd-modal

Modal dialog / bottom-sheet - xác nhận action, form ngắn giữ ngữ cảnh trang. **Đồng bộ 2026-10-13** theo
Core UI Catalog `#c-modal` **và mã thật của thư viện** `@sd-angular/core` 19.0.10. So 5 ví dụ catalog: DOM
overlay (backdrop · wrapper · pane · `mat-dialog-container` / `mat-bottom-sheet-container` · surface ·
`.sd-modal-root`), tên lớp, toạ độ / màu / chữ **trùng** (đo cả khi đặt cùng khung với catalog).

| Attribute | Values | Default |
|-----------|--------|---------|
| `title` | Tiêu đề header. **Rỗng → không có header** (cả nút X) | - |
| `width` | `sx` 20vw · `sm` 40vw · `md` 60vw · `lg` 80vw, hoặc giá trị CSS thô — đặt cả `width` lẫn `max-width` của pane | `md` |
| `height` | ~~CSS height~~ — **input chết** | — |
| `view` | `dialog`, `bottom-sheet`. Không khai: dialog; thiết bị di động (UA `Mobi\|Android`) → bottom sheet | - |
| `color` | ~~tone header~~ — **input chết** | — |
| `hideClose` | boolean - ẩn nút X | `false` |
| `disableBackdropClose` | boolean — chặn cả bấm nền lẫn **Esc** (disableClose của MatDialog) | **`true`** |
| `modalClass` | lớp thêm vào `.cdk-overlay-pane` (panelClass) | - |
| `autoId` | `data-autoId="components-modal-{id}"` trên `.sd-modal-root`, `…-close` trên nút X | - |
| `lazyLoadContent` | boolean - chưa mở lần nào thì `.sd-modal-root` rỗng | **`true`** |

**Slots** (con trực tiếp như `ng-content select` — lấy MỌI phần tử khớp; khoảng trắng giữa các thẻ bị bỏ):

| Slot | Vị trí trong template thư viện |
|------|-------|
| `sdHeaderLeft` | Thay `<div class="T18M">title</div>` |
| `sdHeaderRight` · `sdHeader` | `.d-flex.align-items-center.ml-auto` bên phải, trước nút X |
| `sdFooterLeft` | Con trực tiếp của footer `.d-flex.align-items-center.p-8` |
| `sdFooterRight` · `sdFooter` | Trong `<div class="ml-auto">` của footer |
| (default) | Thân `.overflow-auto.w-full.px-16` (`max-height: 80vh`) |

> **`sdHeader` / `sdFooter` có lại (2026-10-13)** — nhưng ĐÚNG nghĩa thư viện: chỉ là slot phụ nối SAU
> `sdHeaderRight` / `sdFooterRight` (catalog `#c-import-excel` dùng `[sdFooter]`). Bản bị gỡ 2026-10-12 là
> nghĩa riêng của kit ("thay cả header", "vùng GIỮA footer") — không quay lại.
> **Hai nút footer sát nhau 0px** như catalog (không còn gap 8px tự chèn). Cần khoảng cách thì đặt `class="ml-8"`
> cho nút sau — đúng cách `SdConfirmService` của thư viện làm.

**Event:** `sd-closed` - fire khi đóng bằng X, backdrop / Esc (khi được phép), hoặc `.close()`. Bên Angular là `(sdClosed)`.

**JavaScript API:** `element.open()` / `element.close()` · `isOpened`

**Hành vi như MatDialog:** focus vào phần tử bấm được đầu tiên lúc mở (bottom sheet: focus khung), Tab vòng
trong hộp thoại, đóng thì trả focus về chỗ cũ, Esc chỉ tác động modal trên cùng, khoá cuộn trang khi trang cuộn
được (`html.cdk-global-scrollblock`). Overlay nằm **trong thẻ host** (`display:contents`, container
`position:fixed`) thay vì `body` — để sự kiện / `querySelector` từ nội dung modal vẫn đi qua thẻ `sd-modal`.

> **`color` và `height` không làm gì cả — đúng thư viện, không phải thiếu sót.**
> Catalog `#c-modal` ghi nguyên văn: *"Ở bản 19.0.10, template không dùng `color` và `height`: sáu modal theo màu trông như nhau, chỉ nút footer (`[color]` của `sd-button`) đổi màu; câu 'đổi màu dải tiêu đề' là chữ của trang /ui-demo"*.

**Số đo:** bo **4px** · nền trắng · bóng elevation 24 · nền mờ `rgba(0,0,0,.32)` · header đệm 16px · tiêu đề
18/500/28 · thân đệm ngang 16px, chặn 80vh · footer đệm 8px · nút X 32×32 tròn `--sd-black400`, icon 20px, lề trái
8px, `aria-label="Close"`. **Bottom sheet** cỡ *large*: min 512px · max `calc(100vw - 256px)` · đệm 8px 16px · cao
tối đa 80vh · bo 4px hai góc trên · bóng elevation 16.

**Lưu ý (quyết định PD):** nút huỷ trong `sd-modal` dùng `type="link" color="primary"` - không nền, không viền, chữ màu nâu brand OMEU. Cố ý khác Portal (Portal dùng nền xám nhạt); đây là chuẩn DS của OMEU, không phải lệch mirror.

```html
<sd-modal id="modal1" title="Xác nhận thao tác" width="400px">
  <p>Nội dung modal đặt vào default slot.</p>
  <sd-button sdFooterRight title="Quay lại" type="link" color="primary" onclick="document.getElementById('modal1').close()"></sd-button>
  <sd-button sdFooterRight title="Xác nhận" type="fill" color="primary"></sd-button>
</sd-modal>

<!-- Trigger -->
<sd-button title="Mở modal" type="fill" color="primary"
  onclick="document.getElementById('modal1').open()"></sd-button>
```

---

## sd-side-drawer

Drawer trượt từ phải — dùng cho xem chi tiết nhanh, form nhỏ, ghi chú.

| Attribute | Values | Default |
|-----------|--------|---------|
| `title` | Header title | — |
| `width` | CSS width | `480px` |
| `hideClose` | boolean — ẩn nút X | — |
| `disableBackdropClose` | boolean — không đóng khi click backdrop | — |
| `autoId` | string | — |

**Slots** (2026-10-11 — catalog ghi **cảnh báo thẳng**: *"⚠ `sdFooter`, KHÔNG
`slot="footer"`: SdSideDrawer chiếu footer bằng `<ng-content select="[sdFooter]">`"*.
Kit nay nhận **cả hai**, ưu tiên tên của catalog; `slot=` giữ cho trang cũ):

| Slot | Mô tả |
|------|-------|
| `[sdHeaderLeft]` (cũ: `slot="header-left"`) | Nội dung trong vùng title |
| `[sdHeaderRight]` (cũ: `slot="header-right"`) | Actions trước nút X |
| `[sdFooter]` (cũ: `slot="footer"`) | Footer buttons |
| (default) | Body content |

> **Rà soát `#c-side-drawer` 2026-10-12:**
> - `[sdHeaderLeft]` chiếu vào **đúng chỗ tiêu đề** (khối, không flex) — muốn chữ + badge cùng hàng thì đặt cả hai trong `<div sdHeaderLeft class="d-flex align-items-center gap-8">`. Tiêu đề là chữ trần 20px/28px/500; đổi `title` lúc chạy thì tiêu đề đổi theo.
> - Footer **không tự căn** — `[sdFooter]` tự khai `class="d-flex align-items-center justify-content-end gap-8"` như catalog. Bí danh cũ `slot="footer"` vẫn được căn phải để trang cũ không đổi hình.
> - `startLoading()` chèn đúng DOM của SdLoadingService (`div.sd-loading` trắng 60% + vòng 5rem).
> - Lớp global `.side-drawer-body-custom` (portal) + `.content-wrapper` cho thân dạng thẻ — xem mục "Header tuỳ biến + thân dạng thẻ" ở preview.

**JavaScript API:** `element.open()` / `element.close()` / `element.startLoading()` / `element.stopLoading()`
**Thuộc tính đọc:** `element.isOpened` / `element.isLoading` (catalog khai trong
bảng API). Tấm trượt mang `data-opened` / `data-loading` tương ứng.

```html
<sd-side-drawer id="drawer1" width="560px">
  <div sdHeaderLeft class="d-flex align-items-center gap-8">
    <span>Chi tiết giao dịch</span>
    <sd-badge color="success" icon="play_circle" title="Đã thanh toán"></sd-badge>
  </div>
  <sd-button sdHeaderRight title="Tải xuống" size="sm" type="light" color="primary"></sd-button>

  <!-- Body: bọc trong p-16 (16px) để tạo khoảng cách với cạnh drawer -->
  <div class="p-16">
    <sd-section title="Thông tin" noPaddingBody>
      <sd-section-item label="Mã GD">GD-001</sd-section-item>
      <sd-section-item label="Số tiền">5,000,000 VNĐ</sd-section-item>
    </sd-section>
  </div>

  <!-- Footer: catalog tự căn bằng class trên [sdFooter] — footer của drawer không tự căn -->
  <div sdFooter class="d-flex align-items-center justify-content-end gap-8">
    <sd-button title="Bỏ qua" type="link" color="primary"></sd-button>
    <sd-button title="Duyệt" type="fill" color="primary"></sd-button>
  </div>
</sd-side-drawer>

<!-- Trigger -->
<sd-button title="Mở drawer" type="fill" color="primary"
  onclick="document.getElementById('drawer1').open()"></sd-button>
```

---

> **`autoId` (rà soát 2026-10-10):** dùng cho E2E, sinh ra `data-autoId` trên host.
> Thư viện thật GẮN TIỀN TỐ theo tên component, mirror chép đúng:
> `sd-modal` → `components-modal-<giá trị>`, `sd-side-drawer` → `components-side-drawer-<giá trị>`,
> `sd-preview-image` → `components-preview-image-<giá trị>`, `sd-preview-pdf` → `components-preview-pdf-<giá trị>`,
> `sd-table` → `components-table-<giá trị>`, `sd-query-bar` → `components-query-bar-<giá trị>`.
> (`sd-tab-group` không còn nhận `autoId` — đã gỡ 2026-10-12 theo catalog `#c-tab`.)
>
> **`beforeClose` ĐÃ GỠ 2026-10-12 (Rule 18).** Chuỗi "beforeClose" **không xuất hiện
> một lần nào** trong Core UI Catalog 19.0.10 — không ở bảng API `#c-modal` /
> `#c-side-drawer` / `#c-tab`, không ở markup, không ở ví dụ. Nó đến từ gói npm
> 22.2.12 tức mốc chuẩn CŨ, cùng loại với `disableRipple`. Sự kiện `sd-close-error`
> vốn chỉ phục vụ nó cũng gỡ theo.
> Bảng API catalog của hai component này chỉ phơi `(sdClosed)` · `open()` · `close()`,
> nên trang tự quyết khi nào gọi `close()`. Riêng tab thì `sd-tab-close` vẫn
> `cancelable: true` — `preventDefault()` là chặn, đúng `(close)` của catalog.

> **Mặc định in đậm ở các bảng trên là mặc định THẬT, đọc từ `input(<default>)`
> trong source map của `@sdcorejs/angular` 22.2.12 (rà soát 2026-10-10).** Trước
> đợt đó kit đoán sai gần hết nhóm này.
>
> **Cờ boolean mặc định `true`** (`disableBackdropClose`, `lazyLoadContent`,
> `showToolbar`, `loop`, `zoomable`, `downloadable`, `sidebarOpen`): thư viện khai
> `input(true, { transform: booleanAttribute })`, nên **không khai attribute = BẬT**,
> khai `="false"` = tắt. Đây là ngược với trực giác HTML thông thường.
>
> **`width` của `sd-modal` là một THANG TÊN**, không phải số px:
> `sx` = 20vw · `sm` = 40vw · `md` = 60vw (mặc định) · `lg` = 80vw. Giá trị CSS thô
> (`"720px"`) vẫn đi thẳng. Trên thiết bị di động (UA) thư viện trả thẳng giá trị thô và mặc định mở bottom sheet.
>
> **`lazyLoadContent="true"` có hệ quả thật:** nội dung modal chỉ được dựng ở lần
> `open()` ĐẦU TIÊN. Trang nào cần gán dữ liệu vào một component nằm trong modal
> TRƯỚC khi mở (ví dụ `document.getElementById('viewer').items = [...]`) thì phải
> khai `lazyLoadContent="false"` tường minh — bên Angular cũng vậy.

## sd-avatar

Avatar — hiển thị ảnh hoặc initials từ tên.

**ĐỒNG BỘ 2026-10-13 theo catalog `#c-avatar` + mã thư viện (`sd-angular-core-components-avatar.mjs` 19.0.10)** —
15/15 avatar của catalog trùng DOM (cả chuỗi `style`), toạ độ, màu. Preview: [components/avatar.html](../preview/components/avatar.html).

| Attribute | Values | Default |
|-----------|--------|---------|
| `src` | **Input duy nhất của catalog** — vừa là URL ảnh vừa là TÊN. Khớp `^(http\|https\|data:image\|/)` thì hiện ảnh, ngược lại sinh initials + màu nền | — |
| `size` | Pixel (width = height); cỡ chữ = `size / 2.5` | **`32`** |
| `name` | **Riêng kit** — bí danh cũ của `src` (chỉ dùng khi không có `src`) cho trang viết trước đây; trang mới dùng `src` | — |

Quy tắc sinh initials và màu — chép nguyên của catalog:

- Tên **nhiều từ** (tách theo **dấu cách**, như thư viện `split(' ')`) → chữ cái đầu của **từ đầu + từ cuối** (`"Nguyễn Văn An"` → `NA`).
- Tên **một từ** → **chỉ một** chữ cái đầu (`"Minh"` → `M`). *Bản cũ của kit lấy hai ký tự.*
- Rỗng → `?` trên nền `#bdc3c7`.
- **Ảnh tải lỗi** → bỏ `<img>`, hiện chữ đầu của **chính chuỗi URL** trên nền băm từ URL (`/assets/…` → `/`); đổi `src` thì thử ảnh lại (2026-10-13 — trước đó kit để ảnh vỡ).
- Màu nền: băm chuỗi (`hash = char + (hash<<5) - hash`) rồi lấy dư trên **bảng 19 màu cố định**
  `#1abc9c #2ecc71 #3498db #9b59b6 #34495e #16a085 #27ae60 #2980b9 #8e44ad #2c3e50 #f1c40f
  #e67e22 #e74c3c #95a5a6 #f39c12 #d35400 #c0392b #bdc3c7 #7f8c8d`.
  *Bản cũ của kit chỉ có 12 màu và xếp thứ tự khác → cùng một tên ra màu khác hẳn.*
- Nền tô **ĐẶC**, chữ **trắng**, `font-weight: 500`, bo tròn 50%. Thẻ host **không có style** (như thư viện — `inline`); đặt trong hàng flex như ví dụ catalog.

```html
<!-- Ảnh -->
<sd-avatar src="https://example.com/photo.jpg" size="48"></sd-avatar>

<!-- Initials (màu băm từ chính chuỗi tên) -->
<sd-avatar src="Nguyễn Văn An"></sd-avatar>          <!-- NA, nền #7f8c8d, 32px -->
<sd-avatar src="Trần Thị Bích Ngọc" size="40"></sd-avatar>  <!-- TN, nền #1abc9c -->
```

Cỡ catalog dùng trong ví dụ: `24`, `32`, `40`, `56`, `80`.

---

## sd-preview-image

Khung xem nhiều ảnh tự co theo phần tử cha (đặt trong khung có chiều cao: `<div style="height:540px">`,
`sd-modal`, `sd-side-drawer`…). **Đồng bộ 2026-10-13** theo Core UI Catalog `#c-preview-image` **và mã
thật của thư viện** `@sd-angular/core` 19.0.10 (`fesm2022/sd-angular-core-components-preview.mjs` —
template, logic, mặc định, chuỗi tiếng Việt `core.component.preview-image.*`). So DOM + số đo với
catalog: 4/4 ví dụ khớp 100%.

| Attribute | Values | Default |
|-----------|--------|---------|
| `items` | property JS `.items` (hoặc JSON qua attribute) | `[]` |
| `thumbnailPosition` | `bottom`, `top`, `left`, `right`, `dots`, `none` | `bottom` |
| `startIndex` | number - mở sẵn ở ảnh thứ mấy (0-based) | `0` |
| `showToolbar` | boolean | **`true`** |
| `zoomable` | boolean | **`true`** |
| `downloadable` | boolean | **`true`** |
| `loop` | boolean | **`true`** |
| `theme` | `dark`, `light` → host `data-theme` | `dark` |
| `title` | string - **chỉ hiện khi không có ảnh** (header đơn giản) | - |
| `autoId` | string → `data-autoId="components-preview-image-{autoId}-{prev, next, zoom-in, zoom-out, fit, rotate, download, fullscreen, retry, thumb-N, dot-N}"` | - |
| `src` | một URL ảnh - bí danh cũ của kit (ngoại lệ 3 Rule 18) | - |

Bốn cờ boolean mặc định **true** (`input(true, { transform: booleanAttribute })`): không khai = bật, khai `="false"` = tắt.

`items: (string | File | { url?, file?, name?, caption?, alt?, size? })[]`
- string / `url` → `fetch` thành blob (như thư viện). `size` khai sẵn thì dùng (chuỗi `"2.4 MB"` hoặc số byte), không thì lấy cỡ blob thật. Tên mặc định = đoạn cuối đường dẫn.
- Trang mở bằng `file://` chặn `fetch` → kit thử nạp thẳng bằng `<img>` (ảnh hiện được thì dùng URL gốc); hỏng hẳn → bản ghi lỗi: "Không tải được ảnh" + **Thử lại**.
- `File` / `{ file }` không phải `image/*` bị bỏ qua yên lặng.

**Cấu trúc DOM** (y hệt template thư viện):

```
sd-preview-image.sd-preview-image-host[tabindex=0][data-theme]
└ .sd-preview-shell.sd-preview-shell--pos-{bottom|top|left|right|dots|none}[.--fullscreen]
  ├ .sd-preview-header                 (cao 68px; ẩn khi không có ảnh, hoặc --simple chỉ có title)
  │ ├ .sd-preview-header__left > icon + .sd-preview-header__meta (__name.T14M + __sub = dung lượng)
  │ └ .sd-preview-header__counter      (chỉ khi > 1 ảnh)
  └ .sd-preview-body
    ├ .sd-preview-stage[--dragging khi zoom > 1]
    │ ├ .sd-preview-status (rỗng / đang tải) | .sd-preview-image-broken | img.sd-preview-image + .sd-preview-caption
    │ ├ .sd-preview-kbd-hint · .sd-preview-nav--prev / --next     (chỉ khi > 1 ảnh)
    │ ├ .sd-preview-dots                                          (thumbnailPosition="dots")
    │ └ .sd-preview-toolbar  − % + │ Vừa khung · Xoay │ Tải xuống · Toàn màn hình
    └ .sd-preview-thumbs[--vertical]   (left/right: dọc + tên file; ẩn với dots/none)
      └ button.sd-preview-thumb[data-i] > img | .sd-preview-thumb__broken, __badge, __name
```

Thao tác: zoom bước 10% (25%–400%), lăn chuột ×1.1/×0.9, nhấp đúp 200% ↔ vừa khung, kéo để di ảnh khi
zoom > 1, vuốt ngang ≥ 40px để chuyển ảnh, pinch 2 ngón. Phím (khi viewer đang focus — viewer tự focus lúc
dựng): ← → · `+` `=` `-` · `0` vừa khung · `r` / `R` xoay phải / trái · `f` toàn màn hình · `d` tải xuống.
**Esc không làm gì** (thư viện không bắt Esc).

**Method:** `updateCurrentImage(±1)`, `onClickThumbnailImage(i)`, `zoomIn()`, `zoomOut()`, `fitToScreen()`,
`rotate('right'|'left')`, `downloadCurrent()`, `toggleFullscreen()`, `retryActive()`, `requestClose()`;
thuộc tính `activeIndex` (đọc; gán được là tiện ích riêng của kit — kẹp biên, không phát sự kiện).

**Events - ánh xạ kebab sang Angular:**

| Mirror (kebab) | Angular | detail | Khi nào fire |
|----------------|---------|--------|--------------|
| `sd-active-index-change` | `activeIndexChange` | `{ activeIndex }` (Angular emit thẳng số) | Đổi ảnh đang xem |
| `sd-download` | `download` | `{ index, item }` | Nút tải xuống / phím `d` |
| `sd-image-error` | `imageError` | `{ index, reason: 'render-failed' }` | Thẻ `<img>` không vẽ được |
| `sd-close` | `close` | `{}` | **Chỉ** khi gọi `requestClose()` |

```html
<div style="height: 560px">
  <sd-preview-image id="ho-so" startIndex="1" thumbnailPosition="bottom" autoId="ho-so-khach-hang"></sd-preview-image>
</div>
<script>
  document.getElementById('ho-so').items = [
    { url: 'https://cdn.example.vn/cccd.jpg', name: 'CCCD_mat_truoc.jpg' },
    { url: 'https://cdn.example.vn/dkkd.png', name: 'Giay_DKKD_trang_1.png', caption: 'Bản scan có dấu đỏ – nhận ngày 02/10/2026' }
  ];
</script>
```

---

## sd-preview-pdf

Trình xem PDF tự co theo phần tử cha (đặt trong khung có chiều cao: `<div style="height:600px">`,
`sd-modal`, `sd-side-drawer`…). **Đồng bộ 2026-10-13** theo Core UI Catalog `#c-preview-pdf` **và mã
thật của thư viện** `@sd-angular/core` 19.0.10 (template, logic, chuỗi tiếng Việt). Kit chạy đúng
**pdf.js 4.10.38** như thư viện — đóng gói sẵn ở `design-system/vendor/pdfjs/` (script thường, tự nạp
khi trang có viewer; mở bằng file:// vẫn chạy vì worker chạy trên luồng chính).

| Attribute | Values | Default |
|-----------|--------|---------|
| `source` | URL (attribute) · property JS: `File` · `Blob` · `ArrayBuffer` · `Uint8Array` · `{ url, httpHeaders?, withCredentials? }` · `{ data }`. Bí danh cũ `src` | - |
| `title` | string — tên hiển thị ở header | tên file |
| `startPage` | number | `1` |
| `initialZoom` | `page-fit` · `page-width` · `page-actual` · số (1 = 100%). Bí danh cũ: `width` · `actual` · `"150"`/`"150%"` | `page-fit` |
| `sidebar` | `thumbnails` · `outline` · `search` · `none` | `thumbnails` |
| `sidebarOpen` | boolean | `true` |
| `scrollMode` | `page` · `continuous` (thư viện chưa dựng — vẫn từng trang + console.warn) | `page` |
| `showToolbar` | boolean | `true` |
| `downloadable` | boolean | `true` |
| `password` | string (attribute / property) | - |
| `httpHeaders` | JSON (attribute) · object (property) | - |
| `theme` | `dark` · `light` | `dark` |
| `autoId` | string → `data-autoId` cho từng nút: `components-preview-pdf-{id}-first` · `-next` · `-search` · `-thumb-0` … | - |

**Events (bubbles) ↔ outputs Angular:**

| Kit | Angular | detail | Khi nào |
|-----|---------|--------|---------|
| `sd-loaded` | `loaded` | `{ totalPages, meta: { title, author, subject, numPages } }` | Mở tài liệu xong |
| `sd-page-change` | `pageChange` | `{ page }` | Lúc mở + mỗi lần đổi trang |
| `sd-zoom-change` | `zoomChange` | `{ zoom }` | Sau mỗi lần vẽ trang |
| `sd-search-change` | `searchChange` | `{ term, total, current }` | Mỗi lần tìm / chuyển kết quả / xoá |
| `sd-download` | `download` | `{ filename }` | Bấm tải xuống |
| `sd-load-error` | `loadError` | `{ reason: invalid · password · network · unknown, message }` | Không mở được |
| `sd-close` | `close` | `{}` | **Chỉ** khi gọi `requestClose()` — Esc KHÔNG phát (thư viện để trang tự đóng) |

**Phương thức (tên y hệt thư viện):** `goToPage(n)` · `nextPage()` · `prevPage()` · `firstPage()` ·
`lastPage()` · `zoomIn()` · `zoomOut()` · `setZoom(mode)` · `rotate('right'|'left')` · `toggleSidebar()` ·
`setSidebarMode(mode)` · `setScrollMode(mode)` · `search(term, { caseSensitive, wholeWord })` ·
`searchNext()` · `searchPrev()` · `clearSearch()` · `openSearch()` · `closeSearch()` ·
`toggleSearchCaseSensitive()` · `toggleSearchWholeWord()` · `downloadFile()` · `toggleFullscreen()` ·
`retryLoad()` · `requestClose()` · `printFile()` (thư viện chưa làm — console.warn).

**Phím tắt (gắn trên host, host tự focus sau lần vẽ đầu):** ← / PageUp · → / PageDown · Home · End ·
`+` `=` `-` `0` (vừa trang) · `r` / `R` (xoay phải / trái) · `f` (toàn màn hình) · Ctrl/Cmd+F (mở tìm) ·
trong ô tìm: Enter / Shift+Enter / F3 chuyển kết quả, Esc đóng. Ctrl/Cmd + lăn chuột trên trang = zoom.

**Cấu trúc DOM (template thư viện):**

```
sd-preview-pdf.sd-preview-pdf-host[tabindex=0][data-theme][.sd-preview-pdf-host--fullscreen]
└ .sd-preview-pdf-shell[role=region]
  ├ .sd-preview-pdf-header            ← chỉ khi đã mở xong (ẩn ở trạng thái rỗng / đang tải / lỗi)
  │   __left: nút menu · __divider · .sd-preview-pdf-fileicon "PDF" · __meta (__name · __sub "12 trang")
  │   __right: tìm kiếm · tải xuống (downloadable) · toàn màn hình
  ├ .sd-preview-pdf-searchbar         ← khi mở thanh tìm (icon tìm / Ctrl+F / tab "Tìm")
  │   icon · input · __counter "1 / 3" · ↑ ↓ · __divider · match_case · text_fields · __spacer · ×
  └ .sd-preview-pdf-body
    ├ aside.sd-preview-pdf-sidebar    ← khi mở xong + sidebarOpen + sidebar ≠ none
    │   __tabs: Trang · Mục lục · Tìm
    │   __content: thumb-list (canvas vẽ lười) | __deferred "Mục lục sẽ được bổ sung…" | search-list
    └ .sd-preview-pdf-stage
        status (rỗng · spinner + % · lỗi + Thử lại / Tải file gốc) | page-wrap > canvas.sd-preview-pdf-page
        .sd-preview-pdf-toolbar (showToolbar): ⏮ ‹ [n] / N › ⏭ · − 68% + · Vừa trang · Vừa rộng · ↻ · Từng trang
```

```html
<div style="height: 600px">
  <sd-preview-pdf title="Hop_dong_tin_dung_VCB_2026.pdf" startPage="2" initialZoom="page-fit" sidebar="thumbnails"></sd-preview-pdf>
</div>
<script>
  viewer.source = 'https://cdn.example.vn/hop-dong.pdf';   // hoặc File / Blob / Uint8Array
</script>
```

Lưu ý: "Vừa trang / Vừa rộng" đo khung **lúc vẽ** (như thư viện) — viewer nằm trong khung đang ẩn
(modal chưa mở) thì gán `source` sau khi khung hiện. PDF mẫu cho trang thử:
`design-system/preview/assets/sd-preview-pdf-demo.js` → `sdDemoPdf('contract' | 'locked')`.

---

## sd-quick-action — DỰNG MỚI 2026-10-11

Thanh công cụ nổi ở **giữa đáy màn hình** (`position:fixed; bottom:90px`), hiện
khi `opened` = true. Dùng cho thao tác hàng loạt sau khi chọn nhiều dòng.

| Attribute / property | Ý nghĩa | Default |
|---|---|---|
| `opened` | boolean — bật/tắt thanh. Đọc/ghi được cả bằng attribute lẫn property | `false` |

Hai slot, khai bằng attribute trên thẻ con:

| Slot | Vào vùng |
|---|---|
| `[sdMessage]` | `.c-quick-action-message` (T14R), co giãn |
| `[sdAction]` | `.c-quick-action-action`, không co |

```html
<sd-quick-action id="qa" opened>
  <div sdMessage class="px-16">Đã chọn <b>3</b> hồ sơ đề xuất</div>
  <div sdAction class="d-flex align-items-center gap-8" style="padding:8px">
    <sd-button type="link" color="secondary" size="sm" title="Bỏ chọn"></sd-button>
    <sd-button type="fill" color="primary" size="sm" prefixIcon="check" title="Phê duyệt"></sd-button>
  </div>
</sd-quick-action>
```

> Component **không tự thêm padding** cho phần thông điệp — chỉ có `gap:16px`, và
> `padding-right:16px` khi slot `[sdAction]` rỗng. Trang tự đặt padding bằng
> utility (`px-16`, `p-8`…), đúng như ví dụ của catalog.

Kèm theo là khối số đếm `.c-bg-length` + `.c-message` mà `sd-tree` dùng cho thanh
chọn hàng loạt, và `sd-table` cho snackbar chọn dòng (`selector-action`, xem `sd-data.md` mục „Chọn dòng“).

Preview: [components/quick-action.html](../preview/components/quick-action.html)

---

## sd-modal-resizable — ĐỒNG BỘ 2026-10-13 (catalog `#c-modal-resizable` + mã thư viện 19.0.10)

Panel nổi neo góc phải dưới màn hình (kiểu cửa sổ soạn thư). **Gắn thẳng vào `<body>`** ngay khi
thẻ dựng xong (CdkPortal), `position:fixed`, cách đỉnh 80px. Nhiều panel tự xếp hàng ngang từ phải
sang theo thứ tự trong trang, cách nhau 8px. So 4 ví dụ catalog (đang mở · nhiều panel + một panel thu
nhỏ · toàn màn hình · đang tải): DOM panel, toạ độ, `style` (width / right), `data-width`, màu / chữ
**trùng hết**.

| Attribute | Ý nghĩa | Default |
|---|---|---|
| `width` | Bề rộng lúc mở (`[style.width]`); lúc mở đo lại thành px vào `data-width` | `480px` |
| `editable` | boolean — có trong API, template không có UI | `false` |

Ba slot (con trực tiếp, như `ng-content select`): `[sdTitle]` · `[sdBody]` · `[sdFooter]` — phần
không khớp bị bỏ. Thanh tiêu đề / thân / chân **chỉ có trong DOM khi đang mở**; node của slot được giữ
lại và chiếu lại ở lần mở sau.

| Phương thức / property | Ý nghĩa |
|---|---|
| `open()` · `close()` | Mở / đóng. Đóng: gỡ nội dung, `stopLoading()`, sau 100ms panel `width:0; right:0` + lớp `c-closed` |
| `minimize()` · `maximize()` | Thu còn thanh tiêu đề 300px ở đáy (`c-minium`) · **bung lại** (tên của thư viện — không phải toàn màn hình). Trên thanh: nút `c-min` "Thu nhỏ" ↔ `c-max` "Phóng to". `restore()` là bí danh cũ của kit |
| `toggleMaximum()` | Bật / tắt toàn màn hình (`c-fullscreen`: top 0, `calc(100% - 16px)`, `right:8px`); nút đổi thành "Thoát toàn màn hình" (`fullscreen_exit`). Đóng khi đang toàn màn hình → mở lại vẫn toàn màn hình (như thư viện) |
| `startLoading()` · `stopLoading()` | Lớp phủ `SdLoadingService` trên panel + lớp `modal-resizable--loading` |
| `toggleEditable()` | Đảo `isEditing`, phát `sd-editing-changed` `{ editing }` ≙ `(editingChanged)` |
| `isOpened` · `isMinimum` · `isMaximum` · `isLoading` · `isEditing` · `panel` | Trạng thái / phần tử panel ở body |
| `sd-open` · `sd-close` | Event kit thêm (thư viện không có output mở / đóng) |

```html
<sd-modal-resizable id="mr" width="480px">
  <span sdTitle>Hồ sơ phê duyệt HS-2026-0142</span>
  <div sdBody>…</div>
  <div sdFooter class="d-flex justify-content-end gap-8 px-16">…</div>
</sd-modal-resizable>
<sd-button title="Mở hồ sơ" onclick="document.getElementById('mr').open()"></sd-button>
```

> **Thanh tiêu đề nền `#5d6165`:** thư viện không đặt màu chữ — tiêu đề thừa hưởng màu body
> (`#212529`); ba nút icon là `mat-icon-button` nên mang màu token `--mat-sys-on-surface-variant`
> (`#44474e`), đúng như catalog đo được. Lớp `.c-action--white` không có luật màu nào.

Preview: [components/modal-resizable.html](../preview/components/modal-resizable.html)
