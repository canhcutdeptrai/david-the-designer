/* Modal resizable — #c-modal-resizable */
(function () {
  'use strict';
  const root = document.getElementById('c-modal-resizable');
  if (!root) return;
  const ICON = (btn, name, title) => { btn.querySelector('mat-icon').textContent = name; btn.title = title; };

  root.querySelectorAll('.vp').forEach((vp) => {
    const panels = Array.from(vp.querySelectorAll('.modal-resizable'));
    // Bản rút gọn #arrangePanels: duyệt theo thứ tự DOM, chỉ trong khung này.
    function arrange() {
      let totalRight = 0;
      panels.forEach((p) => {
        if (p.classList.contains('c-minium')) {
          p.style.width = '300px'; p.style.right = totalRight + 'px'; totalRight += 308; return;
        }
        if (p.classList.contains('c-closed')) return;
        const w = parseInt(p.dataset.width || '', 10);
        if (Number.isNaN(w)) return;
        if (p.classList.contains('c-fullscreen')) { p.style.width = 'calc(100% - 16px)'; p.style.right = '8px'; }
        else { p.style.width = w + 'px'; p.style.right = totalRight + 'px'; }
        totalRight += w + 8;
      });
    }
    panels.forEach((p) => {
      const minBtn = p.querySelector('[data-act="min"], [data-act="max"]');
      const fullBtn = p.querySelector('[data-act="full"]');
      function setMin(on) {
        p.classList.toggle('c-minium', on);
        minBtn.classList.toggle('c-min', !on); minBtn.classList.toggle('c-max', on);
        ICON(minBtn, 'remove', on ? 'Phóng to' : 'Thu nhỏ');
        arrange();
      }
      minBtn.addEventListener('click', () => setMin(!p.classList.contains('c-minium')));
      fullBtn.addEventListener('click', () => {
        const on = !p.classList.contains('c-fullscreen');
        p.classList.toggle('c-fullscreen', on);
        ICON(fullBtn, on ? 'fullscreen_exit' : 'open_in_full', on ? 'Thoát toàn màn hình' : 'Toàn màn hình');
        arrange();
      });
      p.querySelectorAll('[data-act="close"]').forEach((b) => b.addEventListener('click', () => {
        p.classList.remove('modal-resizable--active', 'modal-resizable--loading', 'c-minium');
        p.classList.add('c-closed');
        const l = p.querySelector('[data-loading-el]'); if (l) l.remove();
        arrange();
      }));
    });
    vp.querySelectorAll('[data-open]').forEach((b) => b.addEventListener('click', () => {
      panels.forEach((p) => { p.classList.remove('c-closed'); p.classList.add('modal-resizable--active'); });
      arrange();
    }));
  });
})();
