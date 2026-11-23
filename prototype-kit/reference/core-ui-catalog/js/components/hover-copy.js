/* Hover copy — #c-hover-copy */
(function () {
  const root = document.getElementById('c-hover-copy');
  const ICON = 'M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM20 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H20C21.1 23 22 22.1 22 21V7C22 5.9 21.1 5 20 5ZM20 21H8V7H20V21Z';
  const DEFAULT_TIP = 'Sao chép';
  function setStyles(el, styles) { Object.keys(styles).forEach(function (k) { el.style[k] = styles[k]; }); }
  root.querySelectorAll('.hc-cell').forEach(function (cell) {
    let btn = cell.querySelector('button');
    let tip;
    if (!btn) {
      // Tạo giống #createAndAppendCopyButton()
      cell.style.position = 'relative';
      btn = document.createElement('button');
      setStyles(btn, { position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '4px', display: 'none', zIndex: '10', background: 'transparent', border: 'none', cursor: 'pointer', padding: '5px', borderRadius: '3px', lineHeight: '1', backgroundColor: 'var(--sd-black100)' });
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'text-secondary');
      svg.setAttribute('width', '14'); svg.setAttribute('height', '14');
      svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('fill', 'none');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', ICON); path.setAttribute('fill', 'currentColor');
      svg.appendChild(path); btn.appendChild(svg);
      tip = document.createElement('span');
      tip.innerText = DEFAULT_TIP;
      setStyles(tip, { position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '4px', background: '#333', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', whiteSpace: 'nowrap', opacity: '0', transition: 'opacity 0.2s', pointerEvents: 'none', userSelect: 'none' });
      btn.appendChild(tip);
      cell.appendChild(btn);
    } else {
      tip = btn.querySelector('span');
    }
    const live = cell.hasAttribute('data-live');
    btn.addEventListener('click', function () {
      try { navigator.clipboard.writeText(cell.getAttribute('data-copy')); } catch (e) { /* bỏ qua */ }
      tip.innerText = 'Copied';
      tip.style.opacity = '1';
      setTimeout(function () { tip.innerText = DEFAULT_TIP; tip.style.opacity = '0'; }, 1000);
    });
    if (live) {
      cell.addEventListener('mouseenter', function () { btn.style.display = 'block'; });
      cell.addEventListener('mouseleave', function () { btn.style.display = 'none'; tip.innerText = DEFAULT_TIP; tip.style.opacity = '0'; });
    }
  });
})();
