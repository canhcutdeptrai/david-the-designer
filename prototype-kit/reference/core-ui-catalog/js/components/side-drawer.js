/* Side drawer — #c-side-drawer */
(function () {
  'use strict';
  const root = document.getElementById('c-side-drawer');
  if (!root) return;
  root.querySelectorAll('.vp').forEach((vp) => {
    const drawer = vp.querySelector('.sd-side-drawer');
    const backdrop = vp.querySelector('[data-backdrop]');
    if (!drawer) return;
    const loadingTpl = drawer.querySelector('[data-loading-el]');
    let timer = null;
    function stopLoading() {
      const el = drawer.querySelector('[data-loading-el]');
      if (el) el.remove();
      drawer.setAttribute('data-loading', 'false');
    }
    function open(withLoading) {
      drawer.classList.add('sd-side-drawer-active');
      drawer.setAttribute('data-opened', 'true');
      backdrop.hidden = false;
      if (withLoading && loadingTpl && !drawer.querySelector('[data-loading-el]')) {
        drawer.appendChild(loadingTpl.cloneNode(true));
        drawer.setAttribute('data-loading', 'true');
        clearTimeout(timer);
        timer = setTimeout(stopLoading, 2000);
      }
    }
    function close() {
      drawer.classList.remove('sd-side-drawer-active');
      drawer.setAttribute('data-opened', 'false');
      backdrop.hidden = true;
      clearTimeout(timer);
      stopLoading(); // close() của SdSideDrawer gọi stopLoading()
    }
    vp.querySelectorAll('[data-open]').forEach((b) => b.addEventListener('click', () => open(b.hasAttribute('data-loading-open'))));
    drawer.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', close));
    // disableBackdropClose mặc định false: bấm nền là đóng.
    backdrop.addEventListener('click', close);
  });
})();
