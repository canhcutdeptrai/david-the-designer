(function () {
  'use strict';
  const GROUPS = ['Components', 'Forms', 'Directives', 'Services', 'lib-bpm'];
  const main = document.getElementById('main');
  const nav = document.getElementById('nav');
  const sections = Array.from(main.querySelectorAll('section.cmp'));

  // Mục lục theo nhóm
  const byGroup = {};
  sections.forEach((s) => { const g = s.dataset.group || 'Components'; (byGroup[g] = byGroup[g] || []).push(s); });
  const links = [];
  GROUPS.concat(Object.keys(byGroup).filter((g) => !GROUPS.includes(g))).forEach((g) => {
    const list = byGroup[g];
    if (!list) return;
    const wrap = document.createElement('div');
    wrap.className = 'nav-group';
    const h = document.createElement('h4');
    h.innerHTML = '<b></b><span></span>';
    h.firstChild.textContent = g;
    h.lastChild.textContent = String(list.length);
    wrap.appendChild(h);
    list.forEach((s) => {
      const a = document.createElement('a');
      a.href = '#' + s.id;
      const t = document.createElement('span');
      t.textContent = s.dataset.title || s.id;
      a.appendChild(t);
      const sel = s.querySelector('.cmp-sel');
      if (sel) { const c = document.createElement('code'); c.textContent = sel.textContent; a.appendChild(c); }
      a.dataset.target = s.id;
      wrap.appendChild(a);
      links.push(a);
    });
    nav.appendChild(wrap);
  });

  // Số liệu đầu trang
  const facts = document.getElementById('facts');
  const variants = main.querySelectorAll('.variant').length;
  [['Component', sections.length], ['Biến thể', variants], ['Primary', '#AE7129'], ['Font', 'Roboto']].forEach(([k, v]) => {
    const f = document.createElement('span');
    f.className = 'fact';
    f.textContent = k + ' ';
    const b = document.createElement('b');
    b.textContent = String(v);
    f.appendChild(b);
    facts.appendChild(f);
  });

  // Nút sao chép cho mọi khối code
  main.querySelectorAll('pre.code').forEach((pre) => {
    if (pre.parentElement.classList.contains('code-wrap')) return;
    const wrap = document.createElement('div');
    wrap.className = 'code-wrap';
    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(pre);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy';
    btn.textContent = 'Sao chép';
    btn.addEventListener('click', () => {
      const done = (m) => { btn.textContent = m; setTimeout(() => { btn.textContent = 'Sao chép'; }, 1500); };
      const fallback = () => { const r = document.createRange(); r.selectNodeContents(pre); const s = getSelection(); s.removeAllRanges(); s.addRange(r); done('Đã chọn'); };
      try { navigator.clipboard.writeText(pre.textContent).then(() => done('Đã sao chép'), fallback); } catch (e) { fallback(); }
    });
    wrap.appendChild(btn);
  });

  // Tìm kiếm
  const search = document.getElementById('search');
  search.addEventListener('input', () => {
    const q = search.value.trim().toLowerCase();
    sections.forEach((s) => {
      const hay = ((s.dataset.title || '') + ' ' + (s.querySelector('.cmp-sel') || {}).textContent + ' ' + s.id).toLowerCase();
      s.hidden = q !== '' && !hay.includes(q);
    });
    links.forEach((a) => { a.hidden = q !== '' && document.getElementById(a.dataset.target).hidden; });
    main.querySelectorAll('.group-title').forEach((h) => {
      const g = h.dataset.group;
      h.hidden = !sections.some((s) => (s.dataset.group || 'Components') === g && !s.hidden);
    });
  });

  // Đánh dấu mục đang xem
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.classList.toggle('active', a.dataset.target === e.target.id));
      });
    }, { rootMargin: '-10% 0px -80% 0px' });
    sections.forEach((s) => io.observe(s));
  }
})();
