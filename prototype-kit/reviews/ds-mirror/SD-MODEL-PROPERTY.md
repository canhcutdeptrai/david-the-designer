# SD-MODEL-PROPERTY - Bổ sung property `model` cho bảy component form

File sửa: `design-system/sd-components/sd-components.js`. Phạm vi cứng: chỉ thêm getter/setter `model`, hai bí danh JS, và sự kiện `sd-change` còn thiếu của `SdDate`. Không đổi attribute nào, không sửa file trong `prototypes/`.

## 1. Bảng ánh xạ bảy component

| Component | Nhóm | `model` ánh xạ vào | Bí danh đã thêm | Attribute `value` có sẵn | Số dòng thêm |
|---|---|---|---|---|---|
| SdInput | chữ | attribute `value` + input thật bên trong | `value` | có (giá trị người dùng nhập) | 24 |
| SdSelect | chữ | attribute `value` (nguồn duy nhất, mọi lần chọn đều setAttribute) | `value` | có (giá trị đã chọn) | 14 |
| SdTextarea | chữ | attribute `value` + textarea thật bên trong | `value` | có (giá trị người dùng nhập) | 24 |
| SdDate | chữ | attribute `value` (giá trị thô, input bên trong chỉ hiển thị dd/MM/yyyy) | `value` | có (giá trị thô) | 25 + 2 dòng lifecycle sửa |
| SdCheckbox | boolean | attribute `checked` | `checked` | có nhưng là giá trị form gửi đi, không đụng | 19 |
| SdRadio | boolean | attribute `checked` | `checked` | có nhưng là giá trị form gửi đi, không đụng | 19 |
| SdSwitch | boolean | attribute `checked` | `checked` | không có | 14 |

Tổng cộng 141 dòng thêm và 2 dòng sửa (connectedCallback + attributeChangedCallback của SdDate để gọi `_bind()`). Nhóm boolean không thêm property `value` vì `value` của checkbox/radio đã có nghĩa riêng (giá trị form gửi đi), đè lên sẽ hỏng ngầm.

## 2. Trích nguyên văn code đã thêm

SdInput (đại diện nhóm chữ):

```js
    get model() {
      var input = this.querySelector('.sd-input');
      return input ? input.value : (this.getAttribute('value') || '');
    }
    set model(v) {
      var val = (v === null || v === undefined) ? '' : String(v);
      var input = this.querySelector('.sd-input');
      if (!input) {
        this.setAttribute('value', val);
        return;
      }
      input.value = val;
      var field = this.querySelector('.sd-form-field');
      if (field) field.classList.toggle('sd-has-value', !!val);
      this._userInput = true;
      this.setAttribute('value', val);
      this._userInput = false;
    }
    get value() { return this.model; }
    set value(v) { this.model = v; }
```

SdCheckbox (đại diện nhóm boolean):

```js
    get model() {
      var input = this.querySelector('.c-checkbox-input');
      return input ? input.checked : this.hasAttribute('checked');
    }
    set model(v) {
      var checked = !!v;
      var input = this.querySelector('.c-checkbox-input');
      if (input) input.checked = checked;
      this._userToggle = true;
      this.toggleAttribute('checked', checked);
      this._userToggle = false;
    }
    get checked() { return this.model; }
    set checked(v) { this.model = v; }
```

Comment ngay tại chỗ của từng component ghi rõ: `model` là tên của thư viện thật (@sd-angular/core dùng `[(model)]`), `value`/`checked` là bí danh cố ý giữ cho JS sẵn có của prototype, không phải sót tên để sau này đem "sửa" lại cho khớp Portal.

## 3. Bốn quy tắc hành vi

a. Getter đọc từ thẻ thật, chỉ lùi về attribute khi chưa render. SdInput đọc `.sd-input`, SdTextarea đọc `.sd-textarea`, SdCheckbox/SdRadio đọc `.checked` của input thật, SdSwitch đọc `aria-checked` của track đang sống; tất cả đều có nhánh fallback đọc attribute khi chưa có DOM con (viewed mode hoặc chưa render). Hai ngoại lệ có lý do được ghi comment trong code: SdSelect vì input bên trong chỉ hiển thị display text, giá trị model sống trong attribute `value` và luôn được đồng bộ ngay mỗi lần người dùng chọn; SdDate vì input bên trong hiển thị ngày đã đổi định dạng dd/MM/yyyy, đọc input đó sẽ trả sai dạng so với model (giá trị thô trong attribute).

b. Setter không bắn sự kiện thay đổi. Toàn bộ setter chỉ ghi vào input thật và/hoặc attribute, không có lệnh `dispatchEvent` nào. Nguồn `sd-change` duy nhất vẫn là listener gắn cho thao tác người dùng đã có sẵn (input/change/click). Vì vậy không thể tạo vòng lặp ở chỗ nào có listener ghi ngược giá trị vào element.

c. Giá trị sống sót qua lần vẽ lại. Kịch bản "gõ chữ rồi đổi disabled" trên từng component: SdInput gõ "ABC" thì listener input đã có sẵn chạy `setAttribute('value', 'ABC')` và cờ `_userInput` chặn re-render ngay lúc gõ (không mất focus); sau đó code đổi `disabled`, attributeChangedCallback chạy `_render()` đọc `this.getAttribute('value')` = "ABC", input mới được dựng có đúng "ABC" nên chữ giữ nguyên. SdTextarea cùng cơ chế `_userInput` + setAttribute. SdCheckbox/SdRadio khi click đã `toggleAttribute('checked', ...)` với cờ `_userToggle`, đổi disabled sau đó re-render đọc `hasAttribute('checked')` nên trạng thái tích không mất. SdSwitch click đã toggle attribute checked và mọi re-render đọc từ attribute đó. SdSelect giá trị chọn luôn nằm trong attribute value nên re-render dựng lại đúng lựa chọn. SdDate không có đường người dùng gõ (input readonly), value chỉ đến từ attribute nên không có gì để mất. Setter model cũng ghi ngược attribute bằng đúng cơ chế `_userInput` nên giá trị do code set cũng sống qua các lần vẽ lại sau. Kết luận: kịch bản "gõ chữ rồi đổi disabled" giữ được giá trị trên cả bảy component.

d. Không phá hành vi attribute đang có. Không đổi tên hay kiểu attribute nào, `value="x"` đặt trong HTML vẫn đi qua đúng đường render cũ. `_render()` và attributeChangedCallback của sáu component không bị sửa; riêng SdDate thêm lời gọi `_bind()` sau render nhưng nội dung render giữ nguyên. Property `value`/`checked`/`model` mới chỉ là đường đọc/ghi JS, không can thiệp vào đường attribute.

## 4. SdDate - sự kiện thay đổi đã thêm

Thêm `_bind()` và gọi từ connectedCallback lẫn attributeChangedCallback. Listener bắt native `change` của input bên trong, rồi `setAttribute('value', val)` để giữ attribute đồng bộ và bắn `CustomEvent('sd-change', { detail: { value: val }, bubbles: true })` đúng dạng detail của nhóm chữ. Chọn native `change` thay vì `input` vì input của SdDate là readonly, không có đường gõ từng ký tự; sự kiện phục vụ luồng picker tương lai hoặc code đặt giá trị rồi phát change. Trước đây SdDate không hề có dòng bắn sự kiện nào, đợt này đã bổ sung đúng như yêu cầu Việc 4.

## 5. Xác nhận kiểm tra

`node --check design-system/sd-components/sd-components.js` trả về exit code 0, không lỗi cú pháp, đã chạy lại trước khi viết báo cáo. Không sửa file nào trong `prototypes/`: các thay đổi prototypes trong worktree là có sẵn từ phiên khác, phiên này chỉ ghi đúng `design-system/sd-components/sd-components.js` (141 dòng thêm, 2 dòng sửa) và tạo file báo cáo này.

## 6. Rủi ro

Property `value`/`checked`/`model` giờ trả giá trị thật thay vì undefined như trước; nếu code prototype nào đó đang kiểm tra `el.value === undefined` để suy ra "chưa khởi tạo" thì hành vi có thể đổi, dù khả năng thấp. SdDate giờ có listener change và bắn sd-change khi giá trị đổi, còn trước đây không bắn gì; trên trang preview DS chưa có script nào đặt value rồi phát change nên không đổi hành vi hiển thị, nhưng đây là sự kiện mới có thể lọt vào code đang lắng nghe. Setter không bắn sd-change (cố ý theo quy ước DOM), nên code nào quen kiểu Angular `modelChange` sẽ không nghe được khi set bằng JS. SdRadio set `model`/`checked` không tự bỏ checked các anh em radio cùng `name` (đường click của người dùng có sync sibling, đường setter thì không), hành vi này khớp với `setAttribute('checked')` trước đây nên không phải hồi quy, nhưng code điều khiển nhóm radio bằng JS phải tự set cả nhóm. SdSelect model luôn là chuỗi, kể cả mode multiple là chuỗi phân tách bằng dấu phẩy chứ không phải mảng, code JS mới đọc model multiple cần biết quy ước này. Getter SdSelect và SdDate đọc attribute thay vì child DOM (đã giải thích ở mục 3a); nếu sau này ai thêm picker viết thẳng vào input mà không đồng bộ attribute thì getter SdDate sẽ trả giá trị cũ, nhưng handler change vừa thêm đã tự setAttribute nên đường đó kín. SdSwitch getter đọc aria-checked của track đang sống, sau mọi toggle đều có re-render nên luôn khớp, chỉ lệch nếu code ngoài sửa DOM thủ công.
