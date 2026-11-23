<!--
BÀN GIAO PHIÊN

Chỉ giữ ĐÚNG MỘT bàn giao đang chờ. Mỗi lần "tách phiên" ghi đè toàn bộ file này,
không append, không giữ lịch sử - lịch sử đã nằm ở git log.

File đang RỖNG khi không có dòng nào bắt đầu bằng "## " ở ngoài khối comment này.
Kiểm nhanh: grep -c "^## " _memory/session-handoff.md  →  0 là rỗng.

KHUÔN MẪU - viết lại thành heading "## " thật khi điền:

  Bối cảnh
    Vì sao tách phiên, việc này thuộc feature/nhiệm vụ nào.

  Đã xong
    Commit hash kèm mô tả ngắn từng commit. Nếu không commit thì mô tả thay đổi đang nằm
    trong working tree và nói rõ vì sao chưa commit.

  Còn lại
    Đủ chi tiết để phiên mới làm tiếp mà không phải hỏi lại: file nào, sửa gì, ràng buộc gì,
    đã thử cách nào không được.

  Câu hỏi còn mở
    Có / Không. Nếu có thì ghi rõ đang chờ Builder quyết gì.

  Ngày tách
    YYYY-MM-DD
-->
