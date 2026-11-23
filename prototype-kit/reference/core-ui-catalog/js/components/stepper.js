/* Stepper — #c-stepper */
(function () {
  const root = document.getElementById('c-stepper');
  if (!root) return;
  const ICON = function (name) {
    return '<mat-icon role="img" class="mat-icon notranslate material-icons mat-ligature-font mat-icon-no-color" aria-hidden="true" data-mat-icon-type="font">' + name + '</mat-icon>';
  };
  root.querySelectorAll('mat-stepper').forEach(function (st) {
    const vertical = st.classList.contains('mat-stepper-vertical');
    const headers = Array.from(st.querySelectorAll('mat-step-header'));
    const linear = st.dataset.linear === 'true';
    const editable = st.dataset.editable.split(',').map(function (v) { return v === '1'; });
    const optional = st.dataset.optional.split(',').map(function (v) { return v === '1'; });
    let sel = headers.findIndex(function (h) { return h.getAttribute('aria-selected') === 'true'; });
    const interacted = headers.map(function (_, i) { return i < sel; });

    function canSelect(index) {
      if (!linear) return true;
      for (let i = 0; i < index; i++) if (!interacted[i] && !optional[i]) return false;
      return true;
    }
    function render() {
      headers.forEach(function (h, i) {
        const selected = i === sel;
        const state = (!interacted[i] || selected) ? 'number' : (editable[i] ? 'edit' : 'done');
        const nav = interacted[i] || selected || !linear;
        h.setAttribute('aria-selected', selected ? 'true' : 'false');
        h.setAttribute('tabindex', selected ? '0' : '-1');
        if (nav) h.removeAttribute('aria-disabled'); else h.setAttribute('aria-disabled', 'true');
        const ic = h.querySelector('.mat-step-icon');
        ic.className = 'mat-step-icon-state-' + state + ' mat-step-icon' + (selected ? ' mat-step-icon-selected' : '');
        ic.firstElementChild.innerHTML = state === 'number' ? '<span aria-hidden="true">' + (i + 1) + '</span>'
          : '<span class="cdk-visually-hidden">' + (state === 'done' ? 'Completed' : 'Editable') + '</span>' + ICON(state === 'edit' ? 'create' : 'done');
        const lab = h.querySelector('.mat-step-label');
        lab.classList.toggle('mat-step-label-active', nav);
        lab.classList.toggle('mat-step-label-selected', selected);
      });
      if (vertical) {
        st.querySelectorAll('.mat-vertical-content-container').forEach(function (c, i) {
          c.classList.toggle('mat-vertical-content-container-active', i === sel);
          if (i === sel) c.removeAttribute('inert'); else c.setAttribute('inert', '');
        });
      } else {
        st.querySelectorAll('[role="tabpanel"]').forEach(function (c, i) {
          c.className = 'mat-horizontal-stepper-content mat-horizontal-stepper-content-' + (i === sel ? 'current' : (i < sel ? 'previous' : 'next'));
          if (i === sel) c.removeAttribute('inert'); else c.setAttribute('inert', '');
        });
      }
    }
    function go(index) {
      if (index < 0 || index >= headers.length || index === sel) return;
      if (index > sel && !canSelect(index)) { interacted[sel] = true; if (!canSelect(index)) { render(); return; } }
      if (index < sel && !editable[index] && interacted[index]) return;
      interacted[sel] = true;
      sel = index;
      render();
    }
    headers.forEach(function (h, i) {
      h.addEventListener('click', function () { if (h.getAttribute('aria-disabled') !== 'true') go(i); });
      h.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); h.click(); } });
    });
    st.addEventListener('click', function (e) {
      const b = e.target.closest('sd-button[data-step]');
      if (!b || !st.contains(b)) return;
      const act = b.dataset.step;
      if (act === 'next') go(sel + 1);
      else if (act === 'prev') go(sel - 1);
      else if (act === 'done') { interacted[sel] = true; render(); }
    });
  });
})();
