# sd-stepper — đối chiếu với @sdcorejs/angular 22.3.1 (2026-10-14)

Builder: *„Cập nhật phần Stepper theo Core UI này https://sdcorejs.github.io/sdcorejs-angular/3.1/v/22.3.1/components/stepper/examples“*.

| File | Dùng làm gì |
|---|---|
| `ng-harness/` | App Angular 22 tối thiểu nạp nguyên văn trang demo tài liệu 3.1 (`showcase/src/app/pages/components/stepper/stepper-demo.component.html`, nhánh `release/angular-3.1` của repo tài liệu). `npm i && npx ng build` (Node ≥ 22.22) rồi phục vụ `dist/browser` ở cổng 8765 |
| `kit-harness.html` | Cùng 9 ví dụ đó viết bằng thẻ kit (sinh từ `examples.py`) |
| `examples.py` | 9 ví dụ (EX), wiring demo (SCRIPT), CSS demo (PAGECSS) — nguồn chung cho harness và trang preview |
| `stepcmp.mjs` | So DOM + style tính toán node-theo-node: `SC=<kịch bản> node stepcmp.mjs all`. Kịch bản: (trống), `nav`, `linear`, `linreset`, `ext`, `misc`, `kbd`, `mouse` |
| `gen-preview.py` + `guide-tabs.html` | Sinh `preview/components/stepper.html` (đã chạy một lần) |

Kết quả 2026-10-14: 12 stepper × 8 kịch bản = 0 khác biệt, trừ `.mat-vertical-content` của bước dọc chưa ghé
(thư viện dựng lười, kit dựng sẵn) — ghi ở `_memory/known-gaps.md` mục `sd-stepper — theo @sdcorejs/angular 22.3.1`.
