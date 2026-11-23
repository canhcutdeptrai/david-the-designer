/* Splitter — #c-splitter */
(function () {
  'use strict';
  const root = document.getElementById('c-splitter');
  if (!root) return;
  const NEAR_ZERO = 1e-9;

  // Bản JS của SplitterStateService.applyDelta + effect áp flex của SdSplitterComponent.
  root.querySelectorAll('sd-splitter').forEach((host) => {
    const isH = host.classList.contains('sd-splitter--horizontal');
    const panels = Array.from(host.children).filter((n) => n.tagName === 'SD-SPLITTER-PANEL');
    const handles = Array.from(host.children).filter((n) => n.tagName === 'SD-SPLITTER-HANDLE');
    const metas = panels.map((p) => ({
      el: p, unit: p.dataset.unit, minSize: +p.dataset.min || 0,
      maxSize: p.dataset.max != null ? +p.dataset.max : undefined,
      collapsible: p.hasAttribute('data-collapsible'), declaredSize: +p.dataset.size, lastSize: +p.dataset.size,
      size: +p.dataset.size, collapsed: p.hasAttribute('data-collapsed'),
    }));
    function flexBudget(c) { let used = 0; metas.forEach((m) => { if (m.unit === 'px' && !m.collapsed) used += m.size; }); return Math.max(c - used, 0); }
    function totalFlex() { let t = 0; metas.forEach((m) => { if (m.unit === 'flex' && !m.collapsed) t += m.size; }); return t; }
    function toPx(m, v, b, t) { return m.unit === 'px' ? v : (b * v) / Math.max(t, NEAR_ZERO); }
    function apply() {
      const t = totalFlex();
      metas.forEach((m) => {
        m.el.style.flex = m.collapsed ? '0 0 0' : m.unit === 'px' ? '0 0 ' + m.size + 'px' : (t > 0 ? m.size / t : 1) + ' 1 0';
      });
    }
    function collapse(m) { if (!m.collapsible) return; if (m.size > 0) m.lastSize = m.size; m.collapsed = true; }
    function expand(m) { let r = m.lastSize; if (!r || r <= 0) r = m.minSize > 0 ? m.minSize : m.declaredSize; m.size = r; m.collapsed = false; }
    function applyDelta(i, d, c) {
      const prev = metas[i], next = metas[i + 1];
      if (prev.collapsed || next.collapsed) {
        const b = flexBudget(c), t = totalFlex();
        if (prev.collapsed && prev.collapsible) { const mp = toPx(prev, prev.minSize, b, t); if (d >= mp) { expand(prev); return mp; } }
        if (next.collapsed && next.collapsible) { const mn = toPx(next, next.minSize, b, t); if (-d >= mn) { expand(next); return -mn; } }
        return 0;
      }
      const b = flexBudget(c), t = totalFlex();
      const prevPx = prev.unit === 'px' ? prev.size : (b * prev.size) / Math.max(t, NEAR_ZERO);
      const nextPx = next.unit === 'px' ? next.size : (b * next.size) / Math.max(t, NEAR_ZERO);
      const pMin = toPx(prev, prev.minSize, b, t), nMin = toPx(next, next.minSize, b, t);
      if (prev.collapsible && pMin > 0 && prevPx + d < pMin * 0.5) { collapse(prev); prev.size = 0; return -prevPx; }
      if (next.collapsible && nMin > 0 && nextPx - d < nMin * 0.5) { collapse(next); next.size = 0; return nextPx; }
      const pMax = prev.maxSize != null ? toPx(prev, prev.maxSize, b, t) : Infinity;
      const nMax = next.maxSize != null ? toPx(next, next.maxSize, b, t) : Infinity;
      let delta = d;
      delta = Math.max(delta, pMin - prevPx); delta = Math.min(delta, pMax - prevPx);
      delta = Math.max(delta, nextPx - nMax); delta = Math.min(delta, nextPx - nMin);
      if (delta === 0) return 0;
      const pxDelta = (prev.unit === 'px' ? delta : 0) + (next.unit === 'px' ? -delta : 0);
      const nb = Math.max(b - pxDelta, 0);
      const live = (m, px) => {
        if (m.unit === 'px') return px;
        if (nb <= NEAR_ZERO || t <= NEAR_ZERO) return Math.max(m.size, m.lastSize, m.declaredSize, m.minSize, NEAR_ZERO);
        return px <= 0 ? 0 : (px * t) / nb;
      };
      const ps = live(prev, prevPx + delta), ns = live(next, nextPx - delta);
      prev.size = ps; next.size = ns;
      return delta;
    }
    handles.forEach((h, i) => {
      if (h.classList.contains('sd-splitter__handle--disabled')) return;
      let pid = null, start = 0, last = 0, cpx = 0;
      const begin = () => { const r = host.getBoundingClientRect(); cpx = isH ? r.width : r.height; last = 0; host.classList.add('sd-splitter--dragging'); };
      const move = (since) => { last += applyDelta(i, since - last, cpx); apply(); };
      const end = () => { host.classList.remove('sd-splitter--dragging'); };
      h.addEventListener('pointerdown', (e) => {
        if (e.button !== 0 && e.pointerType === 'mouse') return;
        pid = e.pointerId; start = isH ? e.clientX : e.clientY; h.setPointerCapture(pid); e.preventDefault(); begin();
      });
      h.addEventListener('pointermove', (e) => { if (pid == null || e.pointerId !== pid) return; move((isH ? e.clientX : e.clientY) - start); });
      const up = (e) => { if (pid == null || e.pointerId !== pid) return; h.releasePointerCapture(pid); pid = null; end(); };
      h.addEventListener('pointerup', up);
      h.addEventListener('pointercancel', up);
      const toggle = () => {
        const target = metas[i].collapsible ? metas[i] : metas[i + 1].collapsible ? metas[i + 1] : null;
        if (!target) return;
        if (target.collapsed) expand(target); else collapse(target);
        apply();
      };
      h.addEventListener('dblclick', toggle);
      h.addEventListener('keydown', (e) => {
        let d = null;
        if (e.key === 'ArrowRight' && isH) d = 10; else if (e.key === 'ArrowLeft' && isH) d = -10;
        else if (e.key === 'ArrowDown' && !isH) d = 10; else if (e.key === 'ArrowUp' && !isH) d = -10;
        else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); return; }
        if (d == null) return;
        e.preventDefault(); begin(); move(d); end();
      });
    });
    apply();
  });
})();
