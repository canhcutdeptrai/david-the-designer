# Ví dụ của trang tài liệu 3.1 (stepper-demo.component.html) viết lại bằng cú pháp kit
B=lambda t,ty='fill',c='primary',extra='': '<sd-button size="sm" type="%s" color="%s" title="%s"%s></sd-button>'%(ty,c,t,extra)
EX=[]
EX.append(('Cơ bản: horizontal','orientation=horizontal · selectedIndex two-way',None,'''<div class="full">
  <sd-stepper id="st-basic">
    <sd-step label="Chọn dịch vụ" icon="storefront">
      <div class="step-body">
        <p>Khách hàng chọn dịch vụ muốn đăng ký.</p>
        %s
      </div>
    </sd-step>
    <sd-step label="Cung cấp thông tin" icon="person">
      <div class="step-body">
        <p>Nhập thông tin liên hệ.</p>
        <div class="row">
          %s
          %s
        </div>
      </div>
    </sd-step>
    <sd-step label="Xác nhận" icon="check_circle">
      <div class="step-body">
        <p>Kiểm tra thông tin trước khi xác nhận.</p>
        %s
      </div>
    </sd-step>
  </sd-stepper>
</div>'''%(B('Tiếp tục',extra=' data-go="st-basic:1"'),B('Quay lại','light','secondary',' data-go="st-basic:0"'),B('Tiếp tục',extra=' data-go="st-basic:2"'),B('Bắt đầu lại','light','secondary',' data-go="st-basic:0"'))))
EX.append(('Hướng dọc','orientation=vertical · selectedIndex two-way',None,'''<div class="full">
  <sd-stepper orientation="vertical">
    <sd-step label="Tạo tài khoản" icon="account_circle">
      <p>Form tạo tài khoản đặt ở đây.</p>
    </sd-step>
    <sd-step label="Liên kết ngân hàng" icon="account_balance">
      <p>Form liên kết tài khoản ngân hàng.</p>
    </sd-step>
    <sd-step label="Hoàn tất" icon="done_all">
      <p>Setup xong, bắt đầu sử dụng.</p>
    </sd-step>
  </sd-stepper>
</div>'''))
EX.append(('Linear wizard','linear=true · stepControl=FormGroup','Linear=true: chỉ qua được step sau khi step trước hợp lệ. Mỗi sd-step bind stepControl tới 1 FormGroup.','''<div class="full">
  <sd-stepper id="st-linear" linear="true" color="primary">
    <sd-step label="Tài khoản" icon="badge" invalid>
      <form class="step-form" data-form="account">
        <label>Tên đăng nhập</label>
        <input name="username" placeholder="ít nhất 3 ký tự" />
        <label>Email</label>
        <input name="email" placeholder="user@onemount.com" />
        <div class="row">
          %s
        </div>
      </form>
    </sd-step>

    <sd-step label="Hồ sơ" icon="contact_page" invalid>
      <form class="step-form" data-form="profile">
        <label>Họ và tên</label>
        <input name="fullName" />
        <label>Số điện thoại</label>
        <input name="phone" placeholder="09xx xxx xxx" />
        <div class="row">
          %s
          %s
        </div>
      </form>
    </sd-step>

    <sd-step label="Xác nhận" icon="task_alt" invalid>
      <form class="step-form" data-form="confirm">
        <label>
          <input type="checkbox" name="agree" />
          Tôi đồng ý với điều khoản dịch vụ
        </label>
        <div class="row">
          %s
          %s
          %s
        </div>
      </form>
    </sd-step>

    <sd-step label="Kết quả" icon="celebration">
      <div class="step-body" data-result>
        <p class="hint">Bấm Hoàn tất ở bước Xác nhận để xem dữ liệu tổng hợp.</p>
      </div>
    </sd-step>
  </sd-stepper>
</div>'''%(B('Tiếp tục',extra=' data-lin="next" disabled'),B('Quay lại','light','secondary',' data-lin="prev"'),B('Tiếp tục',extra=' data-lin="next" disabled'),B('Quay lại','light','secondary',' data-lin="prev"'),B('Hoàn tất',extra=' data-lin="submit" disabled'),B('Bắt đầu lại','light','secondary',' data-lin="reset"'))))
EX.append(('Optional step','optional=true','Step 2 đánh dấu optional — user có thể qua step 3 mà không cần điền.','''<div class="full">
  <sd-stepper id="st-optional">
    <sd-step label="Cơ bản" icon="info">
      <div class="step-body">
        <p>Thông tin bắt buộc.</p>
        %s
      </div>
    </sd-step>
    <sd-step label="Khuyến mãi" icon="local_offer" optional>
      <div class="step-body">
        <p>Mã giới thiệu (tùy chọn — có thể bỏ qua).</p>
        <div class="row">
          %s
          %s
          %s
        </div>
      </div>
    </sd-step>
    <sd-step label="Hoàn tất" icon="done">
      <p>Xong.</p>
    </sd-step>
  </sd-stepper>
</div>'''%(B('Tiếp tục',extra=' data-go="st-optional:1"'),B('Quay lại','light','secondary',' data-go="st-optional:0"'),B('Bỏ qua','light','secondary',' data-go="st-optional:2"'),B('Áp dụng',extra=' data-go="st-optional:2"'))))
EX.append(('Error state','state=error · errorMessage=text',"Step có thể override state='error' để hiện icon X đỏ + errorMessage.",'''<div class="row" style="margin-bottom: 12px">
  %s
</div>
<div class="full">
  <sd-stepper id="st-error" selectedIndex="1" color="error">
    <sd-step label="Step OK" icon="check">
      <p>OK.</p>
    </sd-step>
    <sd-step label="Validate fail" icon="warning" state="error" errorMessage="Mã đơn không hợp lệ">
      <div class="step-body">
        <p>Mã đơn không khớp với hệ thống. Vui lòng kiểm tra lại.</p>
        %s
      </div>
    </sd-step>
    <sd-step label="Step 3" icon="done">
      <p>Step cuối.</p>
    </sd-step>
  </sd-stepper>
</div>'''%(B('Bỏ lỗi step 2','light','warning',' data-toggle-error'),B('Quay lại','light','secondary',' data-go="st-error:0"'))))
EX.append(('Vị trí nhãn','labelPosition=end / bottom','Bước hiện tại dùng nền fill và icon tương phản; bước hoàn thành dùng nền light. Đường nối thẳng hàng với tâm icon khi nhãn nằm dưới.','''<div class="row" style="margin-bottom: 12px">
  %s
  %s
  <span class="hint">Đang chọn: <code data-lp-out>bottom</code></span>
</div>
<div class="full">
  <sd-stepper id="st-labelpos" labelPosition="bottom">
    <sd-step label="Đăng ký"><p>Bước 1.</p></sd-step>
    <sd-step label="Xác minh"><p>Bước 2.</p></sd-step>
    <sd-step label="Thanh toán"><p>Bước 3.</p></sd-step>
    <sd-step label="Hoàn tất"><p>Xong.</p></sd-step>
  </sd-stepper>
</div>'''%(B('end','light','secondary',' data-lp="end"'),B('bottom','light','secondary',' data-lp="bottom"'))))
cs=''.join('''
  <sd-stepper color="%s">
    <sd-step label="%s"><p>...</p></sd-step>
    <sd-step label="%s"><p>...</p></sd-step>
    <sd-step label="%s"><p>...</p></sd-step>
  </sd-stepper>'''%(c,c,c,c) for c in ['primary','success','warning','error'])
EX.append(('Bảng màu','color=primary / success / warning / error','primary / success / warning / error — driving indicator + connector màu.','<div class="color-stack">'+cs+'\n</div>'))
EX.append(('Điều khiển từ ngoài','next() · previous() · goTo() · reset()',None,'''<div class="row" style="margin-bottom: 12px">
  %s
  %s
  %s
  %s
</div>
<div class="full">
  <sd-stepper id="st-external">
    <sd-step label="Step A"><p>Step A.</p></sd-step>
    <sd-step label="Step B"><p>Step B.</p></sd-step>
    <sd-step label="Step C"><p>Step C.</p></sd-step>
  </sd-stepper>
</div>'''%(B('Prev','light','secondary',' data-ext="previous"'),B('Next','light','secondary',' data-ext="next"'),B('Đến cuối','light','secondary',' data-ext="last"'),B('Reset','light','warning',' data-ext="reset"'))))
EX.append(('Editable = false','editable=false','Step 1 đặt editable=false. Sau khi qua step 2, click vào step 1 sẽ không trở lại.','''<div class="full">
  <sd-stepper id="st-noedit">
    <sd-step label="Bước 1 (locked sau khi qua)" icon="lock" editable="false">
      <div class="step-body">
        <p>Sau khi bấm Tiếp tục, bước này sẽ không click lại được.</p>
        %s
      </div>
    </sd-step>
    <sd-step label="Bước 2">
      <p>Đã ở bước 2. Thử click vào bước 1 trên header — sẽ không quay lại được.</p>
    </sd-step>
  </sd-stepper>
</div>'''%(B('Tiếp tục',extra=' data-go="st-noedit:1"'))))

SCRIPT='''<script>
  (function () {
    /* [(selectedIndex)] của trang demo: nút trong bước gán chỉ số */
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('sd-button[data-go]');
      if (b) { var p = b.getAttribute('data-go').split(':'); document.getElementById(p[0]).setAttribute('selectedIndex', p[1]); }
      var x = e.target.closest && e.target.closest('sd-button[data-ext]');
      if (x) { var st = document.getElementById('st-external'), a = x.getAttribute('data-ext');
        if (a === 'last') st.goTo(2); else st[a](); }
      var lp = e.target.closest && e.target.closest('sd-button[data-lp]');
      if (lp) { var v = lp.getAttribute('data-lp'); document.getElementById('st-labelpos').setAttribute('labelPosition', v);
        document.querySelector('[data-lp-out]').textContent = v; }
      var te = e.target.closest && e.target.closest('sd-button[data-toggle-error]');
      if (te) { var s2 = document.querySelectorAll('#st-error > sd-step')[1], on = s2.getAttribute('state') === 'error';
        if (on) s2.removeAttribute('state'); else s2.setAttribute('state', 'error');
        te.setAttribute('title', on ? 'Đặt lỗi step 2' : 'Bỏ lỗi step 2'); }
    });

    /* Linear wizard — `invalid` trên sd-step ≙ stepControl.invalid (FormGroup của trang tài liệu) */
    var lin = document.getElementById('st-linear');
    if (lin) {
      var steps = lin.querySelectorAll(':scope > sd-step');
      var RULES = {
        account: function (f) { return f.username.value.length >= 3 && /^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(f.email.value); },
        profile: function (f) { return !!f.fullName.value && !!f.phone.value; },
        confirm: function (f) { return f.agree.checked; }
      };
      var check = function () {
        lin.querySelectorAll('form[data-form]').forEach(function (f) {
          var ok = RULES[f.getAttribute('data-form')](f.elements);
          var step = steps[['account', 'profile', 'confirm'].indexOf(f.getAttribute('data-form'))];
          if (ok) step.removeAttribute('invalid'); else step.setAttribute('invalid', '');
          f.querySelectorAll('sd-button[data-lin="next"], sd-button[data-lin="submit"]').forEach(function (b) {
            if (ok) b.removeAttribute('disabled'); else b.setAttribute('disabled', '');
          });
        });
      };
      lin.addEventListener('input', check);
      lin.addEventListener('change', check);
      lin.addEventListener('click', function (e) {
        var b = e.target.closest && e.target.closest('sd-button[data-lin]');
        if (!b || b.hasAttribute('disabled')) return;
        var a = b.getAttribute('data-lin');
        if (a === 'next') lin.next();
        else if (a === 'prev') lin.previous();
        else if (a === 'submit') {
          var v = {}; lin.querySelectorAll('form[data-form]').forEach(function (f) {
            Array.prototype.forEach.call(f.elements, function (el) { if (el.name) v[el.name] = el.type === 'checkbox' ? el.checked : el.value; });
          });
          var out = lin.querySelector('[data-result]');
          out.innerHTML = '<p>Đã gửi dữ liệu:</p><pre class="output"></pre>' +
            '<sd-button size="sm" type="light" color="secondary" title="Bắt đầu lại" data-lin="reset"></sd-button>';
          out.querySelector('pre').textContent = JSON.stringify({ account: { username: v.username, email: v.email },
            profile: { fullName: v.fullName, phone: v.phone }, agree: v.agree }, null, 2);
        } else if (a === 'reset') {
          lin.querySelectorAll('form[data-form]').forEach(function (f) { f.reset(); });
          lin.querySelector('[data-result]').innerHTML = '<p class="hint">Bấm Hoàn tất ở bước Xác nhận để xem dữ liệu tổng hợp.</p>';
          check(); lin.reset();
        }
      });
    }
  })();
</script>'''

PAGECSS='''  /* = stepper-demo.component.scss của trang tài liệu 3.1 (CHỈ của trang demo) */
  .full { width: 100%; }
  .step-body { display: flex; flex-direction: column; gap: 12px; padding: 12px 0; }
  .step-form { display: flex; flex-direction: column; gap: 8px; padding: 12px 0; }
  .step-form label { font-size: 13px; color: #4a4a4a; display: flex; align-items: center; gap: 6px; }
  .step-form input[type='text'], .step-form input:not([type]) { padding: 8px 10px; border: 1px solid #d0d4da; border-radius: 4px; font-size: 14px; width: 320px; }
  .step-form input[type='text']:focus, .step-form input:not([type]):focus { border-color: var(--sd-primary, #005cbb); outline: none; }
  .row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .hint { font-size: 13px; color: #6b6b6b; margin: 0; }
  .output { background: #f5f7fa; padding: 12px; border-radius: 6px; font-size: 12px; margin: 8px 0 0; }
  .color-stack { display: flex; flex-direction: column; gap: 16px; }
  code { background: #f0f3f7; padding: 2px 6px; border-radius: 4px; font-size: 12px; }
  .step-body > sd-button { align-self: flex-end; }
  .step-body > .row, .step-form > .row { justify-content: flex-end; }
  .step-form input { max-width: 100%; box-sizing: border-box; }
  @media (max-width: 600px) { .step-form label { flex-wrap: wrap; } }'''
