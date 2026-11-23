/* Badge — #c-badge */
(function () {
  const root = document.getElementById('c-badge');
  let panel = null;
  function hide() { if (panel) { panel.remove(); panel = null; } }
  root.querySelectorAll('[data-tip]').forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      hide();
      const stage = el.closest('.stage');
      panel = document.createElement('div');
      panel.className = 'mat-mdc-tooltip-panel mat-mdc-tooltip-panel-above mat-mdc-tooltip-panel-non-interactive';
      const tip = document.createElement('div');
      tip.className = 'mdc-tooltip mat-mdc-tooltip sd-multiline-tooltip mat-mdc-tooltip-show';
      const text = el.getAttribute('data-tip');
      if (text.indexOf('\n') >= 0) tip.classList.add('mdc-tooltip--multiline');
      const surface = document.createElement('div');
      surface.className = 'mat-mdc-tooltip-surface mdc-tooltip__surface';
      surface.textContent = text;
      tip.appendChild(surface);
      panel.appendChild(tip);
      stage.appendChild(panel);
      const s = stage.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const p = panel.getBoundingClientRect();
      panel.style.left = Math.max(4, r.left - s.left + stage.scrollLeft + (r.width - p.width) / 2) + 'px';
      panel.style.top = (r.top - s.top - p.height - 8) + 'px';
    });
    el.addEventListener('mouseleave', hide);
  });
})();
