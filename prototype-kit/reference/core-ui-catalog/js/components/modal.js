/* Modal — #c-modal */
(function () {
  'use strict';
  const root = document.getElementById('c-modal');
  if (!root) return;
  const COLORS = ['primary', 'secondary', 'info', 'success', 'warning', 'error'];
  const WIDTH = { sx: '20%', sm: '40%', md: '60%', lg: '80%' };

  root.querySelectorAll('.vp').forEach((vp) => {
    const ov = vp.querySelector('[data-ov]');
    if (!ov) return;
    const open = () => { ov.hidden = false; };
    const close = () => { ov.hidden = true; };
    vp.querySelectorAll('[data-open]').forEach((b) => b.addEventListener('click', open));
    ov.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', close));
    // disableBackdropClose mặc định = true trong sd-modal: bấm nền không đóng.
    const bd = ov.querySelector('[data-backdrop]');
    if (bd) bd.addEventListener('click', () => { if (ov.hasAttribute('data-backdrop-close')) close(); });

    // Biến thể theo màu: `color` không được template dùng — chỉ nút footer [color] đổi màu.
    vp.querySelectorAll('[data-color]').forEach((b) => b.addEventListener('click', () => {
      const c = b.getAttribute('data-color');
      const t = ov.querySelector('[data-title]');
      if (t) t.textContent = 'Modal màu ' + c;
      ov.querySelectorAll('[data-colored] button').forEach((btn) => {
        COLORS.forEach((x) => btn.classList.remove('mat-' + x));
        btn.classList.add('mat-' + c);
      });
      open();
    }));

    // Biến thể kích thước: sx/sm/md/lg → 20/40/60/80vw (trong catalog tính theo bề ngang stage).
    vp.querySelectorAll('[data-width]').forEach((b) => b.addEventListener('click', () => {
      const w = WIDTH[b.getAttribute('data-width')];
      const pane = ov.querySelector('.cdk-overlay-pane');
      pane.style.width = w;
      pane.style.maxWidth = w;
      vp.querySelectorAll('[data-width] button').forEach((btn) => {
        btn.classList.toggle('mat-primary', btn.parentElement === b);
        btn.classList.toggle('mat-secondary', btn.parentElement !== b);
      });
      open();
    }));
  });
})();
