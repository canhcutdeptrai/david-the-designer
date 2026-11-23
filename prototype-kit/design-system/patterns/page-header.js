/**
 * Pattern: Page Header
 * ====================
 * VIẾT LẠI 2026-10-14 theo Core (Builder: *„đồng bộ theo core như file tôi đã gửi, cùng với link phần sd-page“*):
 *   · KHUNG = đúng DOM header của `sd-page` (@sd-angular/core 19.0.10 `modules/layout`, bản 22.3.1 giống hệt):
 *       div.c-page-header.bg-white > div.p-16.d-flex.align-items-center.w-full.justify-content-between
 *         > div.d-flex > [headerLeft]   ·   [headerRight]
 *     Không có headerLeft thì sd-page tự vẽ: div.d-flex.flex-column > div.T20M (title) + div.T14R.text-secondary.mt-4 (description).
 *   · NỘI DUNG headerLeft / headerRight = pattern "Page Header" của portal-template
 *     (src/modules/pattern/features/header, docs/pattern.md):
 *       danh sách  — tiêu đề (+ mô tả) | nút chính fill primary
 *       chi tiết   — tiêu đề · #mã (text-primary) · sd-badge trạng thái | Thoát · Lịch sử · nút chính light primary (rule-chung HDR-READ)
 *       tạo / sửa  — tiêu đề | Thoát · Lưu (fill primary, icon save)
 *     Nút ← Quay lại: catalog 19.0.10 không có type "text" của 22.3.1 → `type="link"` (kit vốn coi text là bí danh của link),
 *     màu mặc định (secondary) như portal. Cỡ nút: portal không khai size → mặc định 19.0.10 là `sm`, đúng như kit vẫn dùng.
 *     Tiêu đề theo `sd-page` (`T20M`), KHÔNG theo `record-header` 20px/600 của portal (Builder: „Dùng theo Core nhé“).
 *   · GIỮ các tác vụ kit có mà portal không có (Builder: „giữ tác vụ“): nút "Lịch sử thay đổi" (chỉ icon + tooltip như biến thể
 *     "Tác vụ nhỏ gọn" của portal), nút thoát (link primary — Rule 16/17) và "Lưu nháp" (light primary).
 *   · THEO rule-chung.md (2026-11-02, Builder chọn „Sửa pattern cho cả kit“):
 *       HDR-BACK   — ← Quay lại mặc định KHÔNG vẽ (cả khoảng trống); chỉ khi khai data-back="true".
 *       HDR-READ   — chi tiết: Thoát (link primary) → Lịch sử (light primary) → nút chính (light primary, vd Chỉnh sửa).
 *       HDR-ADD / HDR-EDIT — tạo / sửa: Thoát (mặc định, link primary) → nút chính (fill primary, icon save cho "Lưu").
 *       HDR-LAYOUT — trái: tiêu đề → mã → badge; phải: Thoát đầu tiên, nút chính cuối cùng (thứ tự DOM = thứ tự hiển thị).
 *     Portal-template có ← Quay lại và nút Lịch sử light secondary — kit lệch CÓ CHỦ Ý theo rule-chung.
 *   · GIỮ lớp móc của bản cũ — prototype và trang preview đang tìm theo chúng: `.page-header` (vỏ ngoài), `.page-header-content`,
 *     `.page-title`, `.record-id`, `.page-subtitle`, `.page-header-actions`, `.page-tab-zone .tab`. Lớp móc không còn CSS riêng
 *     (trừ `.page-header-actions` giữ flex/gap cho trang tự tạo vùng này) — hình do lớp sd-core của `sd-page` quyết định.
 *
 * Biến thể (data-variant): browse · read · read-approval · edit · add (= edit)
 *   read-approval: như read, tác vụ lấy từ data-actions "icon:nhãn,…" và tô theo luật portal:
 *     "Từ chối" → light warning (icon close) · "Duyệt" / "Phê duyệt" → light success (icon check) ·
 *     "Chỉnh sửa" → light primary (icon edit, rule-chung HDR-READ) đặt NGOÀI CÙNG bên phải · nhãn khác → light secondary.
 *
 * Vùng tuỳ chọn:
 *   (data-site-tabs — tab kiểu trình duyệt — ĐÃ GỠ 2026-10-14: Core không có; Builder: „không hiện trong kit và các prototype“)
 *   data-page-tabs   — tab trong trang, nằm DƯỚI khung header và là `sd-tab-group` của kit (portal-template:
 *                      `div.bg-white > sd-tab-group [stretchTabs]="false"` ngay dưới header). Nút tab mang thêm lớp móc
 *                      `.tab` / `.tab.active` cho JS cũ (bản đóng băng, ~45 trang preview) — xem phBindPageTabs.
 *   data-subtitle    — mô tả dưới tiêu đề (sd-page `description`)
 *
 * read / read-approval — action buttons đều optional:
 *   data-primary-action  — bỏ trống thì KHÔNG vẽ nút chính.
 *   data-primary-icon    — read / edit: không khai thì "Chỉnh sửa" → edit, "Lưu" → save (như portal), nhãn khác không icon.
 *   data-show-history    — mặc định "true". "false" để ẩn nút Lịch sử thay đổi. Nút mang `data-ph-history` để trang gắn
 *                          việc mở drawer Lịch sử (rule-chung HISTORY-CORE).
 *   data-back-href       — đích của nút Thoát (và ← Quay lại khi bật); không khai thì history.back().
 *   data-back            — "true" mới vẽ ← Quay lại (rule-chung HDR-BACK: mặc định ẩn, chỉ khi người dùng yêu cầu).
 *
 * edit / add — thêm 2026-10-14 cho trang tạo NHIỀU BƯỚC (sd-stepper), để AI không phải tự viết header:
 *   data-cancel-label    — nhãn nút thoát: CHỈ "Thoát" (mặc định — rule-chung HDR-ADD / HDR-EDIT) · "Bỏ qua" · "Quay lại" (Rule 16);
 *                          nhãn khác → "Thoát".
 *   data-primary-suffix-icon — icon ĐUÔI của nút chính (`suffixIcon` của sd-button), vd "arrow_forward" cho "Tiếp tục".
 *   Biến thể lạ (wizard, stepper, create, form…) không còn làm mất header: pattern-loader quy về add / read / browse.
 *
 * data-badge-status — khoá STATUS_MAP (active, pending, waiting, approved…). pattern-loader tra ra color / icon / fontSet
 *                     rồi vẽ `<sd-badge>` kiểu `icon` (mặc định của sd-badge — icon + chữ, không nền).
 *                     2026-10-14 (Builder: „Page-header: đổi theo“ — trạng thái lifecycle toàn kit dùng kiểu icon):
 *                     portal-template vẽ `statusBadge(status, 'round')` — kit lệch CÓ CHỦ Ý, ghi known-gaps.
 *
 * `{{primary-icon-attr}}` do pattern-loader tính sẵn (chuỗi `prefixIcon="…" ` hoặc rỗng) — interpolate() KHÔNG hỗ trợ
 * {{#if}} lồng nhau, nên không viết điều kiện icon bên trong {{#if primary-action}}.
 *
 * Mỗi template dưới đây là NỘI DUNG của hàng `.p-16` (div.d-flex bên trái + vùng phải); vỏ `.page-header`,
 * `.c-page-header` và các vùng tab do processPageHeader trong pattern-loader.js dựng.
 */

var PROTOTYPE_PATTERNS = window.PROTOTYPE_PATTERNS || {};

(function () {
  /* headerLeft của trang chi tiết / tạo / sửa — portal header.component.html (example.id !== 'list') */
  var DETAIL_LEFT = /* html */`
<div class="d-flex">
  <div headerLeft class="d-flex align-items-center gap-8">
    {{#if back}}<sd-button prefixIcon="arrow_back" tooltip="Quay lại" type="link" aria-label="Quay lại" onclick="var h='{{back-href}}';if(h)location.href=h;else history.back();"></sd-button>{{/if}}
    <div>
      <div class="d-flex align-items-center flex-wrap gap-8">
        <div class="T20M page-title">{{title}}</div>
        {{#if record-id}}<span class="T20M text-primary record-id" title="{{record-id-field}}">{{record-id}}</span>{{/if}}
        {{#if badge}}<sd-badge color="{{badge-color}}" icon="{{badge-icon}}" fontSet="{{badge-font}}" title="{{badge}}"></sd-badge>{{/if}}
      </div>
      {{#if subtitle}}<div class="T14R text-secondary mt-4 page-subtitle">{{subtitle}}</div>{{/if}}
    </div>
  </div>
</div>`;

  var RIGHT_OPEN = '<div headerRight class="d-flex align-items-center flex-wrap gap-8 justify-content-end page-header-actions">';

  /* rule-chung HDR-READ / HDR-LAYOUT: Thoát (text) luôn đứng đầu nhóm phải, Lịch sử (light primary) ngay sau */
  var EXIT_BTN = '<sd-button type="link" color="primary" size="sm" title="Thoát" onclick="var h=\'{{back-href}}\';if(h)location.href=h;else history.back();"></sd-button>';

  var HISTORY_BTN = '{{#if show-history}}<sd-button type="light" color="primary" size="sm" prefixIcon="history" tooltip="Lịch sử thay đổi" aria-label="Lịch sử thay đổi" data-ph-history></sd-button>{{/if}}';

  var EDIT_TPL = DETAIL_LEFT + `
` + RIGHT_OPEN + `
  <sd-button type="link" color="primary" size="sm" title="{{cancel-label}}" onclick="var h='{{back-href}}';if(h)location.href=h;else history.back();"></sd-button>
  {{#if has-draft}}<sd-button type="light" color="primary" size="sm" title="Lưu nháp"></sd-button>{{/if}}
  <sd-button type="fill" color="primary" size="sm" {{primary-icon-attr}}{{primary-suffix-attr}}title="{{primary-action}}"></sd-button>
</div>`;

  PROTOTYPE_PATTERNS['page-header'] = {
    variants: {

      /* Danh sách — sd-page không có headerLeft: tiêu đề + mô tả mặc định của sd-page */
      'browse': /* html */`
<div class="d-flex">
  <div class="d-flex flex-column">
    <div class="T20M page-title">{{title}}</div>
    {{#if subtitle}}<div class="T14R text-secondary mt-4 page-subtitle">{{subtitle}}</div>{{/if}}
  </div>
</div>
{{#if primary-action}}` + RIGHT_OPEN + `
  <sd-button type="fill" color="primary" size="sm" prefixIcon="{{primary-icon}}" title="{{primary-action}}" onclick="var h='{{primary-href}}';if(h)location.href=h;"></sd-button>
</div>{{/if}}`,

      'read': DETAIL_LEFT + `
` + RIGHT_OPEN + `
  ` + EXIT_BTN + `
  ` + HISTORY_BTN + `
  {{#if primary-action}}<sd-button type="light" color="primary" size="sm" {{primary-icon-attr}}title="{{primary-action}}" onclick="var h='{{primary-href}}';if(h)location.href=h;"></sd-button>{{/if}}
</div>`,

      'read-approval': DETAIL_LEFT + `
` + RIGHT_OPEN + `
  ` + EXIT_BTN + `
  ` + HISTORY_BTN + `
  {{ACTIONS_BUTTONS}}
</div>`,

      'edit': EDIT_TPL,

      /* `add` từng được ghi trong tài liệu nhưng pattern không có → trang khai data-variant="add" không ra header.
         Nay là bí danh của edit (tạo mới và sửa cùng một header trong portal). */
      'add': EDIT_TPL
    },

    defaults: {
      'primary-icon': 'add',
      'primary-action': '',
      'badge-status': 'active',
      'badge': '',
      'record-id': '',
      'record-id-field': '',
      'show-history': 'true',
      'back-href': '',
      'back': '',
      'actions': '',
      'subtitle': '',
      'page-tabs': '',
      'cancel-label': 'Thoát'
    }
  };
})();
