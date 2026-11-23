/* Tooltip — #c-tooltip */
(function () {
  const root = document.getElementById('c-tooltip');
  let active = null;
  root.querySelectorAll('[data-tt-delay]').forEach(function (anchor) {
    const delay = Number(anchor.getAttribute('data-tt-delay')) || 0;
    let pane = null;
    let showT = 0;
    let hideT = 0;
    function build() {
      pane = document.createElement('div');
      pane.className = 'cdk-overlay-pane c-sd-tooltip-panel pos-bottom';
      const host = document.createElement('sd-tooltip-container');
      const box = document.createElement('div');
      box.className = 'c-sd-tooltip-container';
      box.style.backgroundColor = '#616161';
      const text = document.createElement('span');
      text.className = 'c-sd-tooltip-text';
      text.textContent = anchor.getAttribute('data-tt-text');
      box.appendChild(text);
      host.appendChild(box);
      pane.appendChild(host);
      pane.addEventListener('mouseenter', function () { clearTimeout(hideT); });
      pane.addEventListener('mouseleave', function () { hideT = setTimeout(hide, 200); });
    }
    function show() {
      if (!pane) build();
      if (!pane.isConnected) anchor.appendChild(pane);
    }
    function hide() { if (pane && pane.isConnected) pane.remove(); }
    const api = { forceHide: function () { clearTimeout(showT); clearTimeout(hideT); hide(); } };
    const trigger = anchor.querySelector('sd-button');
    trigger.addEventListener('mouseenter', function () {
      if (active && active !== api) active.forceHide();
      active = api;
      clearTimeout(showT); clearTimeout(hideT);
      showT = setTimeout(show, delay);
    });
    trigger.addEventListener('mouseleave', function () {
      clearTimeout(showT); clearTimeout(hideT);
      hideT = setTimeout(hide, 300);
    });
  });
})();
