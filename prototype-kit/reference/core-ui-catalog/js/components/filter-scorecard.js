/* Filter scorecard — #c-filter-scorecard */
(function () {
  const root = document.getElementById('c-filter-scorecard');
  const group = root.querySelector('[data-fs-group]');
  const cards = Array.from(group.querySelectorAll('.filter-scorecard'));
  let activeKey = 'overdue';
  function render() {
    cards.forEach(function (c) {
      const on = c.getAttribute('data-key') === activeKey;
      c.classList.toggle('filter-scorecard--active', on);
      c.setAttribute('aria-pressed', on ? 'true' : 'false');
      const icon = c.querySelector('.filter-scorecard__filter > span');
      icon.className = on ? 'material-icons' : 'material-icons-outlined';
    });
  }
  cards.forEach(function (c) {
    c.addEventListener('click', function () {
      const key = c.getAttribute('data-key');
      activeKey = activeKey === key ? null : key;
      render();
    });
  });
})();
