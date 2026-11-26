# Cấu trúc dữ liệu

Nội dung động của site nằm trong một object duy nhất, `window.PORTFOLIO_DATA`, ở `assets/js/portfolio-data.js`. `assets/js/portfolio.js` đọc object này để render header, footer, thẻ dự án, case study, kinh nghiệm và hồ sơ.

Phần chữ còn lại (tiêu đề trang, đoạn giới thiệu, thẻ dịch vụ) viết thẳng trong từng file HTML; bản tiếng Việt của chúng nằm ở `assets/js/i18n.js`.

## Chuỗi song ngữ

Trường nào hiện ra trang đều nhận một trong hai dạng:

```js
title: 'BeeTrade AI Trading Platform'                      // dùng chung cho cả hai ngôn ngữ
summary: { en: 'A data-heavy trading…', vi: 'Trải nghiệm giao dịch…' }   // song ngữ
```

Dùng chuỗi thường cho tên riêng, tên công ty, tên công cụ. Phần tử trong mảng (`skills[]`, `contributions[]`, `education[]`…) cũng theo quy tắc này. Thiếu `vi` thì trang hiện bản `en`.

## `person`

| Trường | Ý nghĩa | Hiện ở |
|---|---|---|
| `name`, `initials` | Tên và chữ viết tắt cho logo | Header, footer |
| `location`, `languages` | Nơi làm việc, ngôn ngữ | Footer |
| `email` | Email liên hệ | Footer, mọi phần tử có `data-person-email` |
| `preferredName`, `title`, `summary`, `yearsProduct`, `yearsBA` | Tên gọi, chức danh, câu định vị, số năm kinh nghiệm | Chưa được `portfolio.js` đọc. Các chữ này đang viết thẳng trong HTML, sửa ở đây không đổi gì trên trang |

## `capabilities[]`

Bốn mảng năng lực. `id` của mỗi mảng được dự án tham chiếu qua `disciplines`.

| Trường | Ý nghĩa |
|---|---|
| `id` | Khoá: `design`, `analysis`, `ai`, `systems` |
| `number` | Số thứ tự hiển thị (`01`…`04`) |
| `title`, `statement` | Tên và một câu mô tả |
| `icon` | Tên icon Material Icons Outlined |
| `skills[]` | Danh sách kỹ năng, hiện dạng thẻ |

## `projects[]`

Mỗi object là một dự án. Thêm object mới thì trang Work và Case study tự có.

| Trường | Ý nghĩa |
|---|---|
| `slug` | Khoá trên URL: `case-study.html?project=<slug>`. Chữ thường, gạch nối, không trùng |
| `title`, `shortTitle` | Tên đầy đủ và tên ngắn |
| `timeframe` | Thời gian, dạng chữ tự do |
| `role` | Vai trò trong dự án |
| `disciplines[]` | Các `id` trong `capabilities` |
| `visual` | Kiểu hình minh hoạ trên thẻ: `market`, `control`, `journey`, `api` |
| `summary` | Một đoạn tóm tắt, hiện trên thẻ |
| `challenge` | Bài toán (mục 01 của case study) |
| `contributions[]` | Đóng góp (mục 02) |
| `deliverables[]` | Sản phẩm bàn giao (mục 03) |
| `outcomes[]` | Kết quả định tính (mục 04) |
| `disclosure` | Ghi chú về phần đã lược vì bảo mật |

Thứ tự trong mảng là thứ tự hiển thị. Dự án đầu tiên là dự án mặc định khi `slug` trên URL không khớp.

## `experience[]`

| Trường | Ý nghĩa |
|---|---|
| `period` | Khoảng thời gian |
| `title` | Chức danh |
| `organization` | Công ty hoặc nhóm công ty |
| `summary` | Một câu mô tả phạm vi công việc |

## Các danh sách còn lại

`education[]`, `certifications[]`, `tools[]`, `activities[]` — đều là mảng chuỗi (thường hoặc song ngữ), hiện ở trang Profile.

## Quy ước

- Mọi chuỗi đều được escape HTML trước khi chèn vào trang, nên không viết thẻ HTML trong dữ liệu.
- Không đưa số liệu, tên khách hàng hay ảnh màn hình chưa được phép công khai. Quy tắc đầy đủ ở [CONTENT-GUIDE.md](CONTENT-GUIDE.md).
- Khi thêm hoặc sửa một tuyên bố lấy từ CV, ghi lại nguồn ở [CV-SOURCE-MAP.md](CV-SOURCE-MAP.md).
