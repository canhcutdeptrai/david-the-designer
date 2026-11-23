/* Inform — #c-inform */
(function () {
  'use strict';
  const root = document.getElementById('c-inform');
  if (!root) return;
  const T = { more: 'Xem thêm', less: 'Thu gọn' };

  // closable: giống signal `dismissed` — dải biến mất hẳn. Nút "Hiện lại" là của trang catalog, không thuộc component.
  root.querySelectorAll('[data-closable]').forEach((slot) => {
    const tpl = slot.innerHTML;
    function bind() {
      const btn = slot.querySelector('.c-inform-close');
      if (!btn) return;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const host = slot.querySelector('sd-inform');
        host.textContent = '';
        const again = document.createElement('button');
        again.type = 'button';
        again.className = 'inform-again';
        again.textContent = 'Hiện lại (catalog)';
        again.addEventListener('click', () => { slot.innerHTML = tpl; bind(); });
        slot.appendChild(again);
      });
    }
    bind();
  });

  // lineClamp: đo tràn như SdInform (scrollHeight > clientHeight + 1), toggle chỉ hiện khi tràn hoặc đang mở rộng.
  root.querySelectorAll('sd-inform[data-clamp]').forEach((host) => {
    const n = parseInt(host.getAttribute('data-clamp'), 10);
    const body = host.querySelector('.c-inform-body');
    const toggle = host.querySelector('.c-inform-toggle');
    if (!body || !toggle) return;
    let expanded = false;
    let overflowing = true;
    function render() {
      if (expanded) { body.classList.remove('is-clamped'); body.style.webkitLineClamp = ''; }
      else { body.classList.add('is-clamped'); body.style.webkitLineClamp = String(n); }
      toggle.textContent = expanded ? T.less : T.more;
      toggle.hidden = !(overflowing || expanded);
    }
    function measure() {
      if (expanded) return;
      const over = body.scrollHeight > body.clientHeight + 1;
      if (over !== overflowing) { overflowing = over; render(); }
    }
    toggle.addEventListener('click', () => { expanded = !expanded; render(); if (!expanded) requestAnimationFrame(measure); });
    render();
    requestAnimationFrame(measure);
    if (typeof ResizeObserver !== 'undefined') new ResizeObserver(measure).observe(body);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  });
})();
