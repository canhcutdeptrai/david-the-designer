/* Shared navigation for the neutral portfolio starter. */
(function () {
  'use strict';

  var menu = [
    {
      group: 'Portfolio',
      id: 'portfolio-pages',
      items: [
        { label: 'Tổng quan', file: 'index.html', icon: 'home' },
        { label: 'Dự án chọn lọc', file: 'portfolio/work.html', icon: 'grid_view' },
        { label: 'Case study mẫu', file: 'portfolio/case-study.html', icon: 'article' },
        { label: 'Dịch vụ cho client', file: 'portfolio/services.html', icon: 'handshake' },
        { label: 'Hồ sơ năng lực', file: 'portfolio/profile.html', icon: 'person' },
        { label: 'Liên hệ', file: 'portfolio/contact.html', icon: 'alternate_email' }
      ]
    },
    {
      group: 'Xây dựng nội dung',
      id: 'portfolio-guides',
      items: [
        { label: 'Content guide', file: 'portfolio/content-guide.html', icon: 'checklist' }
      ]
    }
  ];

  var nested = /\/prototypes\/portfolio\//.test(window.location.pathname);
  var prefix = nested ? '../' : '';
  var current = window.location.pathname.split('/').pop() || 'index.html';
  var currentKey = nested ? 'portfolio/' + current : current;
  var storageKey = 'portfolio-nav-groups';

  function pathFor(file) {
    return prefix + file;
  }

  function iconMarkup(icon) {
    return icon ? '<span class="material-icons-outlined mi-md" aria-hidden="true">' + icon + '</span>' : '';
  }

  function renderItem(item) {
    var active = item.file === currentKey;
    return '<a class="menu-item' + (active ? ' active' : '') + '" href="' + pathFor(item.file) + '"' +
      (active ? ' aria-current="page"' : '') + '>' +
      iconMarkup(item.icon) +
      '<span class="menu-item-label">' + item.label + '</span>' +
      '</a>';
  }

  function renderGroup(group, state) {
    var active = group.items.some(function (item) { return item.file === currentKey; });
    var collapsed = state[group.id] === undefined ? !active : !!state[group.id];
    return '<a class="menu-item menu-item-parent" href="#" onclick="toggleSubmenu(event, \'' + group.id + '\')" aria-controls="' + group.id + '">' +
      '<span class="menu-item-label">' + group.group + '</span>' +
      '<span class="menu-item-chevron"><span class="material-icons-outlined mi-sm" aria-hidden="true">' +
      (collapsed ? 'expand_more' : 'expand_less') + '</span></span>' +
      '</a>' +
      '<div class="submenu' + (collapsed ? ' collapsed' : '') + '" id="' + group.id + '">' +
      group.items.map(renderItem).join('') +
      '</div>';
  }

  var state = {};
  try { state = JSON.parse(localStorage.getItem(storageKey) || '{}'); } catch (error) { state = {}; }

  var sidebar = document.getElementById('sidebar');
  if (!sidebar || typeof PROTOTYPE_PATTERNS === 'undefined' || !PROTOTYPE_PATTERNS.sidebar) return;

  sidebar.innerHTML = PROTOTYPE_PATTERNS.sidebar.render({
    railIcons: [
      { href: pathFor('index.html'), icon: 'home', title: 'Tổng quan portfolio', active: currentKey === 'index.html' },
      { href: pathFor('portfolio/content-guide.html'), icon: 'checklist', title: 'Content guide', active: currentKey === 'portfolio/content-guide.html' }
    ],
    title: 'Portfolio Kit',
    searchPlaceholder: 'Tìm trang',
    menuHTML: menu.map(function (group) { return renderGroup(group, state); }).join('')
  });

  PROTOTYPE_PATTERNS.sidebar.mountSearch(sidebar);

  sidebar.addEventListener('click', function (event) {
    var parent = event.target.closest('.menu-item-parent');
    if (!parent) return;
    window.setTimeout(function () {
      var id = parent.getAttribute('aria-controls');
      var submenu = document.getElementById(id);
      if (!submenu) return;
      state[id] = submenu.classList.contains('collapsed');
      try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch (error) { /* local storage may be unavailable */ }
    }, 0);
  });

  if (window.matchMedia && window.matchMedia('(max-width: 760px)').matches) {
    sidebar.classList.add('collapsed');
  }

  window.PORTFOLIO_NAV_RAIL = {
    menu: menu,
    open: function () { sidebar.classList.remove('collapsed'); },
    close: function () { sidebar.classList.add('collapsed'); }
  };
})();

