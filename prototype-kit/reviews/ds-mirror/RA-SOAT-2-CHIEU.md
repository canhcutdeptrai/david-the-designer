# Rà soát HAI CHIỀU với catalog — quy trình bắt buộc

**Lý do có file này (2026-10-12).** `sd-modal` của kit có hai slot mà thư viện
không hề có: `sdHeader` (thay toàn bộ header) và `sdFooter` (vùng GIỮA footer).
Chúng sống sót qua **mọi** vòng rà soát trước, rồi Builder mở trang preview lên
và thấy ngay: *"trên Core không tìm thấy các phần này, UI nhìn như đang bị lỗi."*

Chúng sống sót được vì mọi vòng rà soát trước chỉ chạy **một chiều**.

---

## Ba phép, không phải một

| # | Phép | Bắt được gì | Đã có từ |
|---|---|---|---|
| 1 | **Catalog → kit, theo GIÁ TRỊ** — so `getComputedStyle` từng selector khớp nhau | Sai màu, sai số đo, sai font | từ đầu |
| 2 | **Catalog → kit, theo SỰ TỒN TẠI** — class/tính năng catalog có mà kit không có | "Dựng thiếu", và "dựng đúng một thứ KHÁC" (ca `sd-datetime` 10-12) | 2026-10-12 |
| 3 | **KIT → CATALOG** — attribute/slot/biến thể kit có mà catalog **không** có | "Tự thêm thứ thư viện không có" (ca `sd-modal` 10-12) | 2026-10-12 |

Thiếu phép 2 thì không thấy `sd-datetime` đang dựng popup của gói npm cũ.
Thiếu phép 3 thì không thấy `sd-modal` có hai slot bịa ra.
**Vòng rà soát nào thiếu một trong ba phép thì chưa phải rà soát.**

---

## Chạy phép 3

    node reviews/ds-mirror/audit-kit-extras.mjs      # cần playwright + SD_KIT

So `observedAttributes` + danh sách slot mà mỗi component ĐỌC, với bảng API
(`cmp-api`) của mục catalog tương ứng, đã chụp sẵn trong
`catalog-api-19.0.10.json` (63 mục) để khỏi phải tách lại từ file 2.7 MB. Bản catalog gốc để
đối chiếu phép 1 / 2: `reference/core-ui-catalog/` (phát hành riêng — `core-ui-catalog-19.0.10.zip`, xem AGENTS).

**Đọc kết quả — script là máy SÀNG, không phải quan toà.** Ba loại nhiễu đã biết:

1. **Bí danh tương thích ngược.** Kit nhận cả tên của catalog lẫn tên cũ của
   chính kit: `collapsible`/`collapsable`, `closable`/`dismissible`,
   `actionLabel`/`cta`, `hideNav`/`hideNavOnMobile`. Không phải thừa.
2. **Trải phẳng object cấu hình.** Catalog gói nhiều thứ trong `[option]`
   (rõ nhất ở `sd-table`, `sd-query-bar`); HTML không truyền được object nên kit
   trải thành attribute rời (`paginated`, `pagesize`, `show-search`…). Không phải thừa.
3. **Khác lối viết.** Catalog ghi cú pháp Angular (`[(model)]`, `[items]`,
   `(sdClosed)`), kit ghi attribute HTML (`value`, `items`, event `sd-closed`);
   camelCase của Angular thành kebab-case của HTML.

**Phần KHÔNG được bỏ qua: slot.** Slot là cấu trúc nhìn thấy được — thừa một
slot là đẻ ra một bố cục mà **không ai từng thiết kế**. Script phải ra
**0 slot thừa**; ra khác 0 là phải gỡ hoặc giải trình.

---

## Khi phép 3 ra kết quả

Hỏi đúng một câu: **thứ này có trong catalog không?**

- **Có** (kể cả khác tên) → giữ, ghi bí danh vào tài liệu component.
- **Không, nhưng HTML buộc phải có** (`name`, `value`, `disabled`…) hoặc là trải
  phẳng của `[option]` → giữ, ghi lý do.
- **Không, và chỉ là do kit tự nghĩ ra** → **GỠ**. Không phải "ghi known-gaps rồi
  giữ". Xem Rule 19 của `AGENTS.md`.

Trước khi gỡ: `grep` xem trang nào đang dùng, và **tra bảng API của từng mục
catalog** — đừng tìm-thay theo tên. `sdFooter` là slot bịa ở `sd-modal` nhưng
là slot THẬT ở `sd-side-drawer` và `sd-modal-resizable`.
