/* View — #c-view */
(function () {
  const root = document.getElementById('c-view');
  // sdHref: link nội bộ đi qua Angular Router, link http mở tab mới — trên trang tĩnh chỉ chặn điều hướng.
  root.querySelectorAll('sd-view a[href]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); });
  });
})();
