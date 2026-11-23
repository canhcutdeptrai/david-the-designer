/* Anchor — #c-anchor */
(function () {
  const root = document.getElementById('c-anchor');
  root.querySelectorAll('sd-anchor').forEach(function (anchor) {
    const wrapper = anchor.querySelector('.c-anchor-vertical');
    const sections = Array.from(wrapper.querySelectorAll(':scope > .c-anchor-content > sd-anchor-item'));
    const navItems = Array.from(wrapper.querySelectorAll('anchor-nav .c-anchor-list-item'));
    const visible = new Set();
    let clickScrolling = false;
    let debounce = null;
    function setActive(i) { navItems.forEach(function (n, k) { n.classList.toggle('active', k === i); }); }
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target); });
        if (clickScrolling) return;
        for (let i = 0; i < sections.length; i++) { if (visible.has(sections[i])) { setActive(i); break; } }
      }, { root: wrapper, threshold: 0 });
      sections.forEach(function (s) { io.observe(s); });
    }
    function go(i) {
      setActive(i);
      const target = sections[i];
      const prev = wrapper.scrollTop;
      const top = prev + target.getBoundingClientRect().top - wrapper.getBoundingClientRect().top;
      clickScrolling = true;
      const done = function () { clickScrolling = false; wrapper.removeEventListener('scrollend', done); };
      wrapper.addEventListener('scrollend', done);
      setTimeout(function () { if (wrapper.scrollTop === prev) done(); }, 200);
      setTimeout(done, 1200);
      wrapper.scrollTo({ top: top, behavior: 'smooth' });
    }
    navItems.forEach(function (n, i) {
      const fire = function () { clearTimeout(debounce); debounce = setTimeout(function () { go(i); }, 200); };
      n.addEventListener('click', fire);
      n.addEventListener('keydown', function (e) { if (e.key === 'Enter') fire(); });
    });
  });
})();
