/* Scroll — #c-scroll */
(function () {
  const root = document.getElementById('c-scroll');
  root.querySelectorAll('[sdScroll]').forEach(function (el) {
    // ngOnInit()
    el.style.webkitTransform = 'translate3d(0, 0, 0)';
    el.style.overflowX = 'hidden';
    el.style.overflowY = 'auto';
    el.addEventListener('mouseover', function () { el.style.overflowX = 'auto'; });
    el.addEventListener('mouseout', function () { el.style.overflowX = 'hidden'; });
  });
})();
