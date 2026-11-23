/* Label — #c-label */
(function () {
  const root = document.getElementById('c-label');
  let panel = null;
  function hide() { if (panel) { panel.remove(); panel = null; } }
  root.querySelectorAll('mat-icon[data-tip]').forEach(function (icon) {
    if (icon.parentElement.classList.contains('lb-tipwrap')) return;
    icon.addEventListener('mouseenter', function () {
      hide();
      const stage = icon.closest('.stage');
      panel = document.createElement('div');
      panel.className = 'mat-mdc-tooltip-panel mat-mdc-tooltip-panel-below mat-mdc-tooltip-panel-non-interactive';
      const tip = document.createElement('div');
      tip.className = 'mdc-tooltip mat-mdc-tooltip mat-mdc-tooltip-show';
      const surface = document.createElement('div');
      surface.className = 'mat-mdc-tooltip-surface mdc-tooltip__surface';
      surface.textContent = icon.getAttribute('data-tip');
      tip.appendChild(surface);
      panel.appendChild(tip);
      stage.appendChild(panel);
      const s = stage.getBoundingClientRect();
      const r = icon.getBoundingClientRect();
      const p = panel.getBoundingClientRect();
      panel.style.left = Math.max(4, r.left - s.left + (r.width - p.width) / 2) + 'px';
      panel.style.top = (r.bottom - s.top + 8) + 'px';
    });
    icon.addEventListener('mouseleave', hide);
  });
})();
