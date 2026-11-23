/* Notify (toast) — #c-notify */
(function () {
  const root = document.getElementById('c-notify');
  const ICON = {
    success: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
    info: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
    warning: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
    error: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'
  };
  const TITLE = { success: 'Thành công', info: 'Thông tin', warning: 'Cảnh báo', error: 'Lỗi' };
  const SAMPLE = {
    success: ['Đã phê duyệt hồ sơ HS-2026-00125.'],
    info: ['Kế hoạch Funding quý IV đã được đồng bộ từ hệ thống ngân hàng.'],
    warning: ['Khoản vay KV-2026-0140 đến hạn trả gốc sau 3 ngày.'],
    error: ['Không kết nối được cổng ngân hàng BIDV.', 'Tỷ giá USD/VND chưa được cập nhật cho ngày 08/10/2026.']
  };
  const MAX_SHOW = 2;
  const MAX_TOASTS = 5;

  function el(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }

  // Gắn hành vi cho một <toast> (có sẵn hoặc mới tạo): đóng, mở rộng, tự tắt.
  function wire(t, duration, persistent) {
    const type = t.getAttribute('data-type');
    const msgs = (t.getAttribute('data-message') || '').split(' | ');
    let expanded = !!t.querySelector('.toggle-more') && t.querySelectorAll('.msg-list li').length > MAX_SHOW;
    let timer = null; let start = 0; let remaining = duration || 0; let closing = false;
    function close() {
      if (closing) return;
      closing = true; clearTimeout(timer);
      t.classList.add('sd-toast--closing');
      setTimeout(function () {
        const parent = t.parentNode;
        t.remove();
        if (persistent && parent) {
          // Toast mẫu: dựng lại sau một nhịp để khối chụp hình không bị trống.
          setTimeout(function () { t.classList.remove('sd-toast--closing'); closing = false; parent.appendChild(t); }, 900);
        }
      }, 200);
    }
    function resume() { if (remaining <= 0 || timer || closing) return; start = Date.now(); timer = setTimeout(close, remaining); }
    function pause() { if (!timer || closing) return; clearTimeout(timer); timer = null; remaining = Math.max(remaining - (Date.now() - start), 0); }
    t.querySelector('.sd-toast__close').addEventListener('click', close);
    const more = t.querySelector('.toggle-more');
    if (more) {
      more.addEventListener('click', function () {
        expanded = !expanded;
        const ul = t.querySelector('.msg-list');
        ul.textContent = '';
        (expanded ? msgs : msgs.slice(0, MAX_SHOW)).forEach(function (m) { ul.appendChild(el('li', null, '- ' + m)); });
        more.textContent = expanded ? 'Thu gọn' : 'Hiện thêm (' + (msgs.length - MAX_SHOW) + ')';
      });
    }
    const action = t.querySelector('.btn-action');
    if (action) action.addEventListener('click', function () { /* onAction() của app */ });
    if (!persistent) {
      t.addEventListener('mouseenter', pause);
      t.addEventListener('mouseleave', resume);
      resume();
    }
    void type;
  }

  function makeToast(type, title, messages, duration) {
    const multi = messages.length > 1;
    const t = el('toast', 'bg-white sd-toast');
    t.setAttribute('data-autoid', 'services-notify-toast-' + type);
    t.setAttribute('data-type', type);
    if (title) t.setAttribute('data-title', title);
    t.setAttribute('data-message', messages.join(' | '));
    t.appendChild(el('div', 'sd-toast__bar bg-' + type));
    const icon = el('div', 'sd-toast__icon text-' + type);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('fill', 'currentColor');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', ICON[type]); svg.appendChild(path); icon.appendChild(svg);
    t.appendChild(icon);
    const content = el('div', 'sd-toast__content');
    const header = el('div', 'sd-toast__header');
    header.appendChild(el('strong', 'sd-toast__title', title || TITLE[type]));
    const x = el('button', 'sd-toast__close'); x.innerHTML = '&times;'; header.appendChild(x);
    content.appendChild(header);
    const body = el('div', 'sd-toast__body');
    if (!multi) { body.appendChild(el('div', null, messages[0])); } else {
      const ul = el('ul', 'msg-list');
      messages.slice(0, MAX_SHOW).forEach(function (m) { ul.appendChild(el('li', null, '- ' + m)); });
      body.appendChild(ul);
      if (messages.length > MAX_SHOW) {
        const b = el('button', 'toggle-more btn-link text-' + type, 'Hiện thêm (' + (messages.length - MAX_SHOW) + ')');
        b.type = 'button'; body.appendChild(b);
      }
    }
    content.appendChild(body);
    t.appendChild(content);
    wire(t, duration, false);
    return t;
  }

  // Toast mẫu có sẵn: không tự tắt.
  root.querySelectorAll('toast').forEach(function (t) { wire(t, 0, true); });

  // Mô phỏng SdNotifyService: success/info ngay (3s); warning/error gom 500ms rồi hiện (5s).
  const container = root.querySelector('[data-nt-container]');
  const buffer = {}; const timers = {};
  function push(t) {
    container.insertBefore(t, container.firstChild);
    const all = container.querySelectorAll('toast');
    for (let i = MAX_TOASTS; i < all.length; i++) all[i].remove();
  }
  function call(type) {
    if (type === 'success' || type === 'info') { push(makeToast(type, null, SAMPLE[type].slice(0, 1), 3000)); return; }
    buffer[type] = (buffer[type] || []).concat(SAMPLE[type]);
    clearTimeout(timers[type]);
    timers[type] = setTimeout(function () {
      const msgs = Array.from(new Set(buffer[type])); buffer[type] = [];
      const title = msgs.length > 1 ? TITLE[type] + ' (' + msgs.length + ')' : TITLE[type];
      push(makeToast(type, title, msgs, 5000));
    }, 500);
  }
  root.querySelectorAll('[data-nt]').forEach(function (b) {
    b.addEventListener('click', function () { call(b.getAttribute('data-nt')); });
  });
})();
