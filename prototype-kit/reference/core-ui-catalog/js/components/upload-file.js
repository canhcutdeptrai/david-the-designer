/* Upload File — #c-upload-file */
(function () {
  const root = document.getElementById('c-upload-file');
  if (!root) return;
  // xoá tài liệu / ảnh (bản gốc: hỏi xác nhận trước)
  root.addEventListener('click', function (e) {
    const x = e.target.closest('.c-close, .c-btn-remove');
    if (x && root.contains(x)) {
      const item = x.closest('.c-document-container') || x.closest('.c-area');
      if (item) item.remove();
      return;
    }
    const z = e.target.closest('[data-zoom]');
    if (z) {
      const pv = root.querySelector('[data-preview]');
      if (pv) pv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
  // thêm file thật từ máy vào danh sách tài liệu (chỉ hiển thị, không upload)
  const box = root.querySelector('[data-docs]');
  if (box) {
    const picker = box.querySelector('[data-picker]');
    const area = box.querySelector('.c-area-upload');
    const fmt = function (n) { return n.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };
    area.addEventListener('click', function () { picker.click(); });
    picker.addEventListener('change', function () {
      const col = box.querySelector('sd-upload-file > .d-flex');
      Array.prototype.forEach.call(picker.files, function (f) {
        const ext = (f.name.split('.').pop() || '').toLowerCase();
        const row = box.querySelector('.c-document-container').cloneNode(true);
        row.querySelector('.c-document-image').className = 'c-document-image ' + ext;
        row.querySelector('.c-file-name').textContent = f.name;
        const spans = row.querySelectorAll('span.T12R');
        if (spans.length) { spans[1].textContent = fmt(f.size / 1024) + 'KB'; }
        col.appendChild(row);
      });
      picker.value = '';
    });
  }
  // PreviewComponent: chọn thumbnail, ‹ ›
  const files = [['img', 'Nha_xuong_KCN_Bac_Thang_Long.jpg'], ['img', 'Phieu_chuyen_tien.png'], ['pdf', 'Hop_dong_tin_dung_VCB.pdf'], ['xlsx', 'KH_Funding_Q4-2026.xlsx']];
  const pv = root.querySelector('[data-preview]');
  if (pv) {
    const main = pv.querySelector('[data-main]');
    const thumbs = pv.querySelectorAll('.thumbnail-wrapper');
    let active = 2;
    function render() {
      thumbs.forEach(function (t, i) { t.style.border = i === active ? '2px solid rgb(41, 98, 255)' : 'none'; });
      const f = files[active];
      const keep = main.querySelectorAll('.next-icon, .back-icon');
      Array.prototype.slice.call(main.children).forEach(function (c) { if (!c.matches('.next-icon, .back-icon')) c.remove(); });
      let html;
      if (f[0] === 'img') {
        html = '<img fill="" priority="" class="main-image ' + thumbs[active].querySelector('img').className.split(' ').pop() + '" alt="Main display image">';
      } else {
        html = '<img class="main-document file ' + f[0] + '" alt="Main display image"><div class="T14M"></div>' + '<sd-button><button type="button" class="c-button c-fill mdc-button mdc-button--unelevated mat-mdc-unelevated-button mat-primary mat-mdc-button-base c-sm" data-disabled="false" data-loading="false"><span class="mat-mdc-button-persistent-ripple mdc-button__ripple"></span><span class="mdc-button__label"><div class="c-button-content-wrapper"><span class="c-title">Tải file</span></div></span><span class="mat-focus-indicator"></span><span class="mat-mdc-button-touch-target"></span></button></sd-button>';
      }
      keep[0].insertAdjacentHTML('beforebegin', html);
      const nm = main.querySelector('.T14M');
      if (nm) nm.textContent = f[1];
    }
    thumbs.forEach(function (t, i) { t.addEventListener('click', function () { active = i; render(); }); });
    pv.querySelectorAll('[data-step]').forEach(function (b) {
      b.addEventListener('click', function () { active = (active + Number(b.getAttribute('data-step')) + files.length) % files.length; render(); });
    });
  }
})();
