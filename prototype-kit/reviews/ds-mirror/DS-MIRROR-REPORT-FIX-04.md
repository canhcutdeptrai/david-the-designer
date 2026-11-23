# DS Mirror - Báo cáo vòng sửa FIX-04

Ngày: 2026-09-19

File sửa: `design-system/core/styles/sd-tokens.css`

## Lỗi - sd-splitter không cao bằng thẻ bọc

Thẻ host `sd-splitter` là `display: block` nhưng không nhận chiều cao từ cha, nên co về chiều cao nội dung (18px = một dòng chữ) thay vì lấp đầy div bọc đã có height 200-260px. Wrapper `.sd-splitter` và các panel kế thừa theo nên cũng co, làm mỗi demo chỉ còn một vạch mỏng.

## Thay đổi trong khối CSS sd-splitter

`sd-splitter` (thẻ host):

```css
sd-splitter { display: block; height: 100%; min-height: 0; }
```

Thêm `height: 100%` để host lấp đầy cha. Giữ `display: block` thay vì đổi sang `display: flex` vì host chỉ cần nhận đủ chiều cao từ cha; toàn bộ bố cục flex đã nằm ở wrapper `.sd-splitter` bên trong (display: flex, flex-direction theo data-orientation), đổi display của host không thêm được gì mà còn làm thay đổi mô hình layout hiện có. `min-height: 0` đảm bảo host không bị nội dung bên trong đẩy phình khi panel cha dùng flex.

`sd-splitter-panel`:

```css
sd-splitter-panel {
  display: block;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  box-sizing: border-box;
}
```

Có sẵn `min-height: 0` và `min-width: 0` để panel không bị nội dung dài/đẩy ra khỏi splitter phình kích thước.

`sd-splitter .sd-splitter` (wrapper bên trong host):

```css
sd-splitter .sd-splitter {
  display: flex;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
}
```

Có `height: 100%` để wrapper kế thừa đúng chiều cao host, và `min-height: 0` để các flex item là panel được phép co nhỏ hơn nội dung.

## Lý do chuỗi height khép kín

Div bọc có `height: 220px` (hoặc 200/240/260px) - trang preview đã làm đúng phần của nó. Host `sd-splitter` nhận `height: 100%` của div bọc, wrapper `.sd-splitter` nhận `height: 100%` của host, các panel flex chiếm phần còn lại. Splitter lồng nhau nằm trong `sd-splitter-panel` cũng nhận `height: 100%` của panel cha, nên tự giãn theo - trước đây cái lồng nhau cao 92px chỉ vì panel cha bị co, không phải quan hệ lồng có vấn đề.

## Không đụng gì ngoài phạm vi

Không đổi logic JS, không đổi chiều rộng gutter, cursor, tabindex, role, không thêm `!important`, không sửa trang preview, không đụng các file report khác, không git commit. Kiểu xuống dòng sẵn có của file được giữ nguyên.
