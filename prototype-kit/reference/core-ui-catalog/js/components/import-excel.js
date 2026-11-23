/* Import Excel — #c-import-excel */
(function () {
  const root = document.getElementById('c-import-excel');
  if (!root) return;
  const D = {"w": ["150px", "150px", "190px", "130px", "140px", "140px", "170px"], "v2": {"title": "Nhập danh sách khoản vay", "rows": [[3, "success", "<span class='text-success'>Dữ liệu hợp lệ</span>", ["FD-2026-0141", "VCB", "1.250.000.000", "12", "15/10/2026", "6,8", "QSDĐ số CT-01234 – 12 Lý Thái Tổ, Hoàn Kiếm;Tiền gửi kỳ hạn 12 tháng tại VCB"], {}], [4, "success", "<span class='text-success'>Dữ liệu hợp lệ</span>", ["FD-2026-0142", "BIDV", "3.500.000.000", "24", "20/10/2026", "7,2", "Nhà xưởng KCN Bắc Thăng Long;Dây chuyền sản xuất;Hàng tồn kho luân chuyển"], {}], [5, "warning", "Khoản vay FD-2026-0143 đã tồn tại, hệ thống sẽ cập nhật thông tin", ["FD-2026-0143", "VietinBank", "850.000.000", "6", "01/11/2026", "6,5", "Tiền gửi kỳ hạn 6 tháng tại VietinBank"], {}], [6, "error", "<strong>[Ngân hàng]</strong> Giá trị ACB Bank không thuộc danh sách cho phép [VCB,BIDV,VietinBank,Techcombank,MB]", ["FD-2026-0144", "ACB Bank", "2.000.000.000", "12", "05/11/2026", "7,0", ""], {"1": "Giá trị ACB Bank không thuộc danh sách cho phép [VCB,BIDV,VietinBank,Techcombank,MB]"}], [7, "success", "<span class='text-success'>Dữ liệu hợp lệ</span>", ["FD-2026-0145", "Techcombank", "2.000.000.000", "36", "05/11/2026", "7,5", "QSDĐ số BT-00871 – Lô C5, KĐT Sala"], {}], [8, "error", "<strong>[Số tiền giải ngân (VND)]</strong> 2,5 tỷ không phải số hợp lệ", ["FD-2026-0146", "MB", "2,5 tỷ", "18", "10/11/2026", "6,9", ""], {"2": "2,5 tỷ không phải số hợp lệ"}], [9, "error", "<strong>[Ngày giải ngân]</strong> Ngày 31/11/2026 không đúng định dạng dd/MM/yyyy", ["FD-2026-0147", "VCB", "4.200.000.000", "12", "31/11/2026", "6,8", "Khoản phải thu HĐ 02/2026"], {"4": "Ngày 31/11/2026 không đúng định dạng dd/MM/yyyy"}], [10, "success", "<span class='text-success'>Dữ liệu hợp lệ</span>", ["FD-2026-0148", "BIDV", "1.800.000.000", "18", "12/11/2026", "7,1", "Tiền gửi kỳ hạn 12 tháng tại BIDV"], {}], [11, "error", "<strong>[Mã khoản vay]</strong> Dữ liệu bắt buộc", ["", "MB", "600.000.000", "6", "15/11/2026", "6,4", ""], {"0": "Dữ liệu bắt buộc"}]]}, "v3": {"title": "Nhập danh sách khoản vay", "rows": [[3, "success", "<span class='text-success'>Dữ liệu hợp lệ</span>", ["FD-2026-0141", "VCB", "1.250.000.000", "12", "15/10/2026", "6,8", "QSDĐ số CT-01234 – 12 Lý Thái Tổ, Hoàn Kiếm;Tiền gửi kỳ hạn 12 tháng tại VCB"], {}], [4, "success", "<span class='text-success'>Dữ liệu hợp lệ</span>", ["FD-2026-0142", "BIDV", "3.500.000.000", "24", "20/10/2026", "7,2", "Nhà xưởng KCN Bắc Thăng Long;Dây chuyền sản xuất;Hàng tồn kho luân chuyển"], {}], [7, "success", "<span class='text-success'>Dữ liệu hợp lệ</span>", ["FD-2026-0145", "Techcombank", "2.000.000.000", "36", "05/11/2026", "7,5", "QSDĐ số BT-00871 – Lô C5, KĐT Sala"], {}], [10, "success", "<span class='text-success'>Dữ liệu hợp lệ</span>", ["FD-2026-0148", "BIDV", "1.800.000.000", "18", "12/11/2026", "7,1", "Tiền gửi kỳ hạn 12 tháng tại BIDV"], {}]]}};
  // ---------- dựng DOM giống bản render của Angular (dùng lại khung modal của biến thể 1) ----------
  const MAT = { fill: 'mdc-button mdc-button--unelevated mat-mdc-unelevated-button', light: 'mdc-button mdc-button--unelevated mat-mdc-unelevated-button', outline: 'mdc-button mdc-button--outlined mat-mdc-outlined-button' };
  function ico(n, cls, set, st) {
    return '<mat-icon role="img" class="mat-icon notranslate ' + (cls ? cls + ' ' : '') + (set || 'material-icons') + ' mat-ligature-font mat-icon-no-color" aria-hidden="true" data-mat-icon-type="font"' + (st ? ' style="' + st + '"' : '') + '>' + n + '</mat-icon>';
  }
  function btn(title, type, color, o) {
    o = o || {};
    let cls = 'c-button c-' + type + ' ' + MAT[type] + ' mat-' + color + ' mat-mdc-button-base c-sm';
    let ba = '';
    if (o.tip) { cls += ' mat-mdc-tooltip-trigger'; ba = ' data-tip="' + o.tip + '"'; }
    let inner = o.prefix ? ico(o.prefix, 'c-icon-prefix', 'material-icons-outlined') : '';
    inner += '<span class="c-title' + (o.prefix ? ' ml-8' : '') + '">' + title + '</span>';
    return '<sd-button' + (o.host || '') + '><button type="button" class="' + cls + '" data-disabled="false" data-loading="false"' + ba +
      '><span class="mat-mdc-button-persistent-ripple mdc-button__ripple"></span><span class="mdc-button__label"><div class="c-button-content-wrapper">' + inner +
      '</div></span><span class="mat-focus-indicator"></span><span class="mat-mdc-button-touch-target"></span></button></sd-button>';
  }
  function menuBtn(id) {
    return '<button mat-icon-button type="button" class="mdc-icon-button mat-mdc-icon-button mat-mdc-button-base c-mat-menu mat-unthemed" aria-haspopup="menu" aria-expanded="false" data-menu="' + id +
      '" style="width: 24px; height: 24px; line-height: 24px"><span class="mat-mdc-button-persistent-ripple mdc-icon-button__ripple"></span>' + ico('open_in_new', '', '', 'font-size: 18px') +
      '<span class="mat-focus-indicator"></span><span class="mat-mdc-button-touch-target"></span></button>';
  }
  function rowHtml(r, vid) {
    const idx = r[0], st = r[1], cells = r[3], errs = r[4];
    let h = '<tr data-status="' + st.toUpperCase() + '"' + (cells[6] ? ' data-items="' + cells[6] + '"' : '') + '><td class="text-center c-sticky-left px-4"><sd-badge type="tag"><div class="c-badge c-badge--tag c-' + st +
      ' c-badge--sm" aria-hidden="true"><div class="c-icon d-flex align-items-center"><div class="d-flex flex-column align-items-start"><span class="T14R c-badge-title">' + idx +
      '</span></div></div></div></sd-badge></td><td style="min-width: 250px; width: 250px"><div class="text-wrap">' + r[2] + '</div></td>';
    cells.forEach(function (v, i) {
      const e = errs[i];
      let inner;
      if (i === 6) {
        const n = v ? v.split(';').length : 0;
        inner = '<div class="d-flex align-items-center justify-content-between"><span>' + n + ' tài sản</span>' + (n ? menuBtn(vid + '-' + idx) : '') + '</div>';
      } else {
        inner = '<span>' + v + '</span>';
      }
      h += '<td class="align-middle' + (e ? ' bg-error-light mat-mdc-tooltip-trigger' : '') + '"' + (e ? ' data-tip="' + e + '"' : '') + ' style="min-width: ' + D.w[i] + ';"><div class="c-ellipsis">' + inner + '</div></td>';
    });
    return h + '</tr>';
  }
  const tpl = root.querySelector('.vp[data-vid="v1"]');
  root.querySelectorAll('.vp[data-build]').forEach(function (ph) {
    const id = ph.getAttribute('data-build');
    const cfg = D[id];
    const vp = tpl.cloneNode(true);
    vp.setAttribute('data-vid', id);
    vp.style.height = ph.style.height;
    vp.querySelector('.T18M').textContent = cfg.title;
    const rows = cfg.rows;
    const c = { success: 0, warning: 0, error: 0 };
    rows.forEach(function (r) { c[r[1]]++; });
    vp.querySelector('.mb-12').innerHTML = '<div class="d-flex">' +
      btn('Xem tất cả', 'outline', 'secondary', { host: ' class="mr-2" icon="cached" data-view="ALL"' }) +
      btn(String(c.success), 'light', 'success', { tip: 'Số dòng dữ liệu hợp lệ', host: ' class="mr-2" icon="done" data-view="SUCCESS"' }) +
      btn(String(c.warning), 'light', 'warning', { tip: 'Số dòng dữ liệu có lỗi', host: ' class="mr-2" icon="warning" data-view="WARNING"' }) +
      btn(String(c.error), 'light', 'error', { tip: 'Số dòng dữ liệu có cảnh báo', host: ' icon="error" data-view="ERROR"' }) + '</div>';
    vp.querySelector('thead th').insertAdjacentHTML('afterend', '<th class="text-center" style="min-width: 250px; width: 250px">Trạng thái</th>');
    vp.querySelector('tbody').innerHTML = rows.map(function (r) { return rowHtml(r, id); }).join('');
    vp.querySelector('.mat-mdc-paginator-range-label').textContent = ' 1 – ' + rows.length + ' of ' + rows.length + ' ';
    const acc = vp.querySelector('[data-accept]');
    acc.insertAdjacentHTML('beforebegin', btn('Tải về', 'outline', 'success', { prefix: 'get_app', host: ' class="mr-4"' }));
    if ((c.success || c.warning) && !c.error) {
      const b = acc.querySelector('button');
      b.removeAttribute('disabled');
      b.classList.remove('c-disabled', 'mat-mdc-button-disabled');
      b.setAttribute('data-disabled', 'false');
    }
    ph.replaceWith(vp);
  });
  // ---------- tooltip (mat-tooltip, đặt trong stage) ----------
  function place(pane, target, stage) {
    const r = target.getBoundingClientRect();
    const s = stage.getBoundingClientRect();
    pane.hidden = false;
    const tip = pane.querySelector('.mat-mdc-tooltip');
    tip.classList.remove('mdc-tooltip--multiline');
    if (pane.getBoundingClientRect().height > 30) tip.classList.add('mdc-tooltip--multiline');
    const p = pane.getBoundingClientRect();
    let left = r.left - s.left + r.width / 2 - p.width / 2;
    left = Math.max(4, Math.min(left, s.width - p.width - 4));
    pane.style.left = left + 'px';
    pane.style.top = Math.max(4, r.top - s.top - p.height - 8) + 'px';
  }
  root.querySelectorAll('.stage').forEach(function (stage) {
    const pane = document.createElement('div');
    pane.className = 'cdk-overlay-pane mat-mdc-tooltip-panel mat-mdc-tooltip-panel-above mat-mdc-tooltip-panel-non-interactive';
    pane.hidden = true;
    pane.innerHTML = '<div class="mdc-tooltip mat-mdc-tooltip _mat-animation-noopable"><div class="mat-mdc-tooltip-surface mdc-tooltip__surface"></div></div>';
    stage.appendChild(pane);
    const surface = pane.querySelector('.mat-mdc-tooltip-surface');
    let pinned = stage.hasAttribute('data-pin-tip') ? stage.querySelector('td[data-tip]') : null;
    function show(t) { surface.textContent = t.getAttribute('data-tip'); place(pane, t, stage); }
    stage._pin = function () { if (pinned && !pinned.closest('.vp-closed')) show(pinned); };
    stage._hideTip = function () { pinned = null; pane.hidden = true; };
    stage.addEventListener('mouseover', function (e) {
      const t = e.target.closest('[data-tip]');
      if (t && stage.contains(t)) show(t);
    });
    stage.addEventListener('mouseout', function (e) {
      const t = e.target.closest('[data-tip]');
      if (!t || (e.relatedTarget && t.contains(e.relatedTarget))) return;
      stage._hideTip();
    });
    stage.querySelectorAll('.table-responsive').forEach(function (sc) { sc.addEventListener('scroll', stage._hideTip); });
  });
  // ---------- lọc theo trạng thái: view('ALL' | 'SUCCESS' | 'WARNING' | 'ERROR') ----------
  root.querySelectorAll('[data-view]').forEach(function (host) {
    host.addEventListener('click', function () {
      const vp = host.closest('.vp');
      const v = host.getAttribute('data-view');
      let n = 0;
      vp.querySelectorAll('tbody tr[data-status]').forEach(function (tr) {
        const show = v === 'ALL' || tr.dataset.status === v;
        tr.hidden = !show;
        if (show) n++;
      });
      vp.querySelector('.mat-mdc-paginator-range-label').textContent = ' ' + (n ? '1 – ' + n + ' of ' + n : '0 of 0') + ' ';
    });
  });
  // ---------- tải tệp mẫu (isDownloadTemplate → mat-spinner) ----------
  root.querySelectorAll('.empty-state-wrapper').forEach(function (w) {
    w.addEventListener('click', function () {
      const sp = w.querySelector('.ie-tpl-spinner');
      if (!sp || !sp.hidden) return;
      sp.hidden = false;
      setTimeout(function () { sp.hidden = true; }, 1500);
    });
  });
  // ---------- mat-menu của cột kiểu array ----------
  function placeMenu(stage, b, pane) {
    const r = b.getBoundingClientRect();
    const s = stage.getBoundingClientRect();
    pane.hidden = false;
    const p = pane.getBoundingClientRect();
    let left = r.left - s.left;
    if (left + p.width > s.width - 4) left = r.right - s.left - p.width;
    pane.style.left = Math.max(4, left) + 'px';
    pane.style.top = (r.bottom - s.top) + 'px';
  }
  root.querySelectorAll('[data-menu]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      const stage = b.closest('.stage');
      let pane = stage.querySelector('.ie-menu-pane');
      const id = b.getAttribute('data-menu');
      if (pane && pane.dataset.menuPane === id && !pane.hidden) { pane.hidden = true; b.setAttribute('aria-expanded', 'false'); return; }
      if (pane) pane.remove();
      pane = document.createElement('div');
      pane.className = 'cdk-overlay-pane ie-menu-pane';
      pane.dataset.menuPane = id;
      pane.innerHTML = '<div class="mat-mdc-menu-panel" role="menu" tabindex="-1"><div class="mat-mdc-menu-content"><div class="px-3 py-2" style="max-width: 300px; max-height: 250px; overflow: auto" aria-hidden="true"></div></div></div>';
      const box = pane.querySelector('.px-3');
      (b.closest('tr').dataset.items || '').split(';').forEach(function (x) {
        const d = document.createElement('div');
        d.className = 'border-bottom py-2 text-wrap';
        d.textContent = x;
        box.appendChild(d);
      });
      stage.appendChild(pane);
      b.setAttribute('aria-expanded', 'true');
      placeMenu(stage, b, pane);
    });
  });
  root.addEventListener('click', function (e) {
    if (e.target.closest('.ie-menu-pane') || e.target.closest('[data-menu]')) return;
    root.querySelectorAll('.ie-menu-pane').forEach(function (p) { p.hidden = true; });
  });
  // ---------- đóng modal / mở lại ----------
  root.querySelectorAll('.sd-modal-close-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      const vp = b.closest('.vp');
      const stage = vp.closest('.stage');
      vp.classList.add('vp-closed');
      if (stage._hideTip) stage._hideTip();
      stage.querySelectorAll('.ie-menu-pane').forEach(function (p) { p.hidden = true; });
      let again = vp.querySelector('.vp-reopen');
      if (!again) {
        again = document.createElement('div');
        again.className = 'vp-reopen';
        again.innerHTML = btn('Import Excel', 'fill', 'primary', { prefix: 'upload_file' });
        vp.appendChild(again);
        again.addEventListener('click', function () { vp.classList.remove('vp-closed'); again.hidden = true; });
      }
      again.hidden = false;
    });
  });
  // ---------- trạng thái chụp hình: tooltip lỗi + menu mở sẵn ----------
  function initial() {
    root.querySelectorAll('[data-pin-tip]').forEach(function (st) { if (st._pin) st._pin(); });
    root.querySelectorAll('[data-pin-menu]').forEach(function (st) {
      const b = st.querySelector('[data-menu="' + st.getAttribute('data-pin-menu') + '"]');
      if (!b || b.closest('.vp-closed')) return;
      const sc = b.closest('.table-responsive');
      if (sc && !st._scrolled) { sc.scrollLeft = sc.scrollWidth; st._scrolled = true; }
      const pane = st.querySelector('.ie-menu-pane');
      if (pane && !pane.hidden) placeMenu(st, b, pane); else if (!pane) b.click();
    });
  }
  initial();
  if (document.readyState !== 'complete') window.addEventListener('load', initial);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { requestAnimationFrame(initial); });
})();
