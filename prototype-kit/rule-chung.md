# Quy tắc UI dùng chung cho portfolio

## PORT-01 — Narrative

Trang tổng quan phải dẫn người xem qua: định vị → năng lực → dự án → cách làm → lời mời liên hệ. Không lặp lại cùng một lời giới thiệu ở nhiều section.

## PORT-02 — Evidence

Mọi claim quan trọng phải có bằng chứng đi kèm: artefact, quyết định, trích dẫn đã được phép dùng hoặc chỉ số có nguồn. Thiếu dữ liệu thì dùng placeholder có nhãn rõ ràng.

## PORT-03 — Case study

Mỗi case study có tối thiểu:

1. Tóm tắt và vai trò.
2. Bối cảnh, vấn đề và ràng buộc.
3. Research/analysis và insight.
4. Quy trình hoặc user flow.
5. Quyết định thiết kế và trade-off.
6. Phần AI nếu có: dữ liệu vào, human-in-the-loop, guardrail, evaluation.
7. Kết quả, mức độ chắc chắn và bài học.

## PORT-04 — Three-discipline story

UI/UX, BA và AI Solution phải kết nối trong cùng một câu chuyện. Dùng nhãn vai trò ở từng artefact để người xem hiểu đóng góp cụ thể.

## PORT-05 — Privacy

Không đưa dữ liệu mật hoặc thông tin nhận diện khách hàng khi chưa được phép. Dùng tên trung tính, làm mờ dữ liệu và nêu rõ mức độ ẩn danh khi cần.

## PORT-06 — Components and tokens

Component cơ bản dùng `sd-*` khi đã có. Layout presentation có thể dùng HTML semantic và CSS riêng, nhưng mọi màu, font, radius, shadow và spacing chính phải dựa trên token.

## PORT-07 — Responsive

- Desktop: bố cục nhiều cột khi nội dung đủ rộng.
- Tablet: giảm cột nhưng giữ thứ tự đọc.
- Mobile: một cột, CTA chạm được, chữ không nhỏ hơn 14px cho nội dung chính.
- Không có scroll ngang ngoài carousel hoặc bảng được chỉ định.

## PORT-08 — Accessibility

- Có skip link, landmark và heading theo thứ tự.
- Link/nút có tên truy cập rõ ràng.
- Focus phải nhìn thấy.
- Không truyền đạt trạng thái chỉ bằng màu.
- Tôn trọng `prefers-reduced-motion`.

## PORT-09 — Interaction

Tương tác chỉ dùng khi giúp khám phá nội dung: lọc dự án, mở chi tiết, sao chép liên hệ. Không thêm animation trang trí hoặc auto-play.

## PORT-10 — Content states

Phân biệt ba trạng thái:

- `Thật` — dữ liệu đã xác nhận và được phép công khai.
- `Ẩn danh` — dữ liệu thật đã loại thông tin nhận diện.
- `Nội dung mẫu` — cấu trúc minh hoạ cần được thay trước khi xuất bản.

## Checklist trước khi hoàn tất

- [ ] Không còn tên brand/dự án/nghiệp vụ cũ trong nguồn active.
- [ ] Không có claim giả hoặc placeholder trông như dữ liệu thật.
- [ ] Tất cả link nội bộ hoạt động.
- [ ] Trang dùng được ở 360px, 768px và desktop.
- [ ] Tab order và focus hợp lý.
- [ ] Ảnh có alt text; icon trang trí được ẩn với screen reader khi phù hợp.
- [ ] Không tải font, script hoặc tracking ngoài.
- [ ] Validation script chạy qua.

