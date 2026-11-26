(function () {
  'use strict';

  var data = window.PORTFOLIO_DATA;
  if (!data) return;

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Mọi trang nằm cùng cấp ở gốc site nên đường dẫn là tên file.
  function pageHref(file) {
    return file;
  }

  function currentPage() {
    var file = window.location.pathname.split('/').pop() || 'index.html';
    return file === '' ? 'index.html' : file;
  }

  function renderSiteChrome() {
    var headerHost = document.querySelector('[data-site-header]');
    var footerHost = document.querySelector('[data-site-footer]');
    var routes = [
      { file: 'index.html', label: 'Home' },
      { file: 'work.html', label: 'Work' },
      { file: 'services.html', label: 'For clients' },
      { file: 'profile.html', label: 'Profile' }
    ];
    var current = currentPage();
    if (current === 'case-study.html') current = 'work.html';

    if (headerHost) {
      headerHost.innerHTML =
        '<header class="site-header">' +
          '<div class="portfolio-wrap site-nav" data-site-nav>' +
            '<a class="site-brand" href="' + pageHref('index.html') + '" aria-label="Van The Duy — Home">' +
              '<span class="site-brand-mark" aria-hidden="true">' + escapeHtml(data.person.initials) + '</span>' +
              '<span class="site-brand-copy"><strong>' + escapeHtml(data.person.name) + '</strong><span>Product · UX · Business · AI</span></span>' +
            '</a>' +
            '<button class="site-nav-menu" type="button" aria-expanded="false" aria-controls="site-navigation" data-nav-toggle>' +
              '<span class="material-icons-outlined" aria-hidden="true">menu</span><span class="sr-only">Toggle navigation</span>' +
            '</button>' +
            '<nav class="site-nav-links" id="site-navigation" aria-label="Main navigation">' +
              routes.map(function (route) {
                var active = route.file === current;
                return '<a class="site-nav-link" href="' + pageHref(route.file) + '"' + (active ? ' aria-current="page"' : '') + '>' + escapeHtml(route.label) + '</a>';
              }).join('') +
            '</nav>' +
            '<a class="p-button primary" href="' + pageHref('contact.html') + '"' + (current === 'contact.html' ? ' aria-current="page"' : '') + '>Contact</a>' +
          '</div>' +
        '</header>';
    }

    if (footerHost) {
      footerHost.innerHTML =
        '<footer class="site-footer">' +
          '<div class="portfolio-wrap">' +
            '<div class="site-footer-grid">' +
              '<div><p class="section-kicker">Let\'s work together</p><h2>Complex product, workflow, or digital transformation challenge?</h2><p>I can help turn it into a clear, testable path forward.</p><div class="portfolio-actions"><a class="p-button primary" href="' + pageHref('contact.html') + '">Contact <span class="material-icons-outlined" aria-hidden="true">arrow_forward</span></a></div></div>' +
              '<div><p class="section-kicker">Explore</p><ul class="footer-list">' +
                routes.map(function (route) { return '<li><a href="' + pageHref(route.file) + '">' + escapeHtml(route.label) + '</a></li>'; }).join('') +
              '</ul></div>' +
              '<div><p class="section-kicker">Contact</p><ul class="footer-list"><li><a href="mailto:' + escapeHtml(data.person.email) + '">' + escapeHtml(data.person.email) + '</a></li><li>' + escapeHtml(data.person.location) + '</li><li>' + escapeHtml(data.person.languages) + '</li></ul></div>' +
            '</div>' +
            '<div class="site-footer-bottom"><span>© <span data-current-year></span> ' + escapeHtml(data.person.name) + '</span><span>Designed as an extensible, data-driven portfolio.</span></div>' +
          '</div>' +
        '</footer>';
    }
  }

  function setupNavigation() {
    var nav = document.querySelector('[data-site-nav]');
    var toggle = document.querySelector('[data-nav-toggle]');
    if (!nav || !toggle) return;
    toggle.addEventListener('click', function () {
      var open = nav.getAttribute('data-nav-open') === 'true';
      nav.setAttribute('data-nav-open', open ? 'false' : 'true');
      toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
      var icon = toggle.querySelector('.material-icons-outlined');
      if (icon) icon.textContent = open ? 'menu' : 'close';
    });
  }

  function renderVisual(project) {
    var cells = project.visual === 'control' ? 4 : 3;
    var bars = project.visual === 'api' ? 4 : 2;
    return '<div class="artifact-frame" aria-hidden="true">' +
      '<div class="artifact-bar primary"></div>' +
      Array.from({ length: bars - 1 }).map(function () { return '<div class="artifact-bar"></div>'; }).join('') +
      '<div class="artifact-grid">' + Array.from({ length: cells }).map(function () { return '<div class="artifact-cell"></div>'; }).join('') + '</div>' +
    '</div>';
  }

  function projectCard(project, index, featured) {
    return '<a class="project-card project-card-index-' + (index + 1) + (featured ? ' project-card-featured' : '') + '" href="' + pageHref('case-study.html') + '?project=' + encodeURIComponent(project.slug) + '" data-project-disciplines="' + escapeHtml(project.disciplines.join(' ')) + '">' +
      '<div class="project-visual project-visual-' + escapeHtml(project.visual) + '">' + renderVisual(project) + '</div>' +
      '<div class="project-content">' +
        '<div class="project-meta"><span class="project-type">' + escapeHtml(project.timeframe) + '</span><span class="p-tag">' + escapeHtml(project.disciplines.map(function (id) { return id === 'design' ? 'UX' : id === 'analysis' ? 'BA' : id === 'ai' ? 'AI' : 'Systems'; }).join(' · ')) + '</span></div>' +
        '<h3>' + escapeHtml(project.title) + '</h3>' +
        '<p>' + escapeHtml(project.summary) + '</p>' +
        '<span class="project-link">View contribution <span class="material-icons-outlined" aria-hidden="true">arrow_forward</span></span>' +
      '</div>' +
    '</a>';
  }

  function renderProjectGrids() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-project-grid]'), function (grid) {
      var limit = Number(grid.getAttribute('data-project-limit') || data.projects.length);
      grid.innerHTML = data.projects.slice(0, limit).map(function (project, index) {
        return projectCard(project, index, grid.hasAttribute('data-feature-first') && index === 0);
      }).join('');
    });
  }

  function setupProjectFilters() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-project-filter]'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-project-disciplines]'));
    var empty = document.querySelector('[data-project-empty]');
    if (!buttons.length || !cards.length) return;
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var filter = button.getAttribute('data-project-filter');
        var visible = 0;
        buttons.forEach(function (item) { item.setAttribute('aria-pressed', item === button ? 'true' : 'false'); });
        cards.forEach(function (card) {
          var show = filter === 'all' || (card.getAttribute('data-project-disciplines') || '').split(' ').indexOf(filter) !== -1;
          card.hidden = !show;
          if (show) visible += 1;
        });
        if (empty) empty.classList.toggle('is-visible', visible === 0);
      });
    });
  }

  function renderCapabilities() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-capability-grid]'), function (grid) {
      grid.innerHTML = data.capabilities.map(function (capability) {
        return '<article class="discipline-card">' +
          '<span class="discipline-card-number">' + escapeHtml(capability.number) + '</span>' +
          '<span class="material-icons-outlined" aria-hidden="true">' + escapeHtml(capability.icon) + '</span>' +
          '<h3>' + escapeHtml(capability.title) + '</h3>' +
          '<p>' + escapeHtml(capability.statement) + '</p>' +
          '<div class="tag-list">' + capability.skills.slice(0, 3).map(function (skill) { return '<span class="p-tag">' + escapeHtml(skill) + '</span>'; }).join('') + '</div>' +
        '</article>';
      }).join('');
    });
  }

  function renderExperience() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-experience-list]'), function (list) {
      list.innerHTML = data.experience.map(function (item) {
        return '<article class="experience-row"><time>' + escapeHtml(item.period) + '</time><div><h3>' + escapeHtml(item.title) + '</h3><p class="organization">' + escapeHtml(item.organization) + '</p></div><p>' + escapeHtml(item.summary) + '</p></article>';
      }).join('');
    });
  }

  function listMarkup(items) {
    return '<ul>' + items.map(function (item) { return '<li>' + escapeHtml(item) + '</li>'; }).join('') + '</ul>';
  }

  function renderCaseStudy() {
    var host = document.querySelector('[data-case-study]');
    if (!host) return;
    var requested = new URLSearchParams(window.location.search).get('project');
    var project = data.projects.find(function (item) { return item.slug === requested; }) || data.projects[0];
    document.title = project.title + ' — Van The Duy Portfolio';
    host.innerHTML =
      '<header class="case-hero"><div class="portfolio-wrap"><p class="portfolio-eyebrow">Selected contribution · ' + escapeHtml(project.timeframe) + '</p><h1>' + escapeHtml(project.title) + '</h1><p>' + escapeHtml(project.summary) + '</p>' +
        '<dl class="case-facts"><div class="case-fact"><dt>Role</dt><dd>' + escapeHtml(project.role) + '</dd></div><div class="case-fact"><dt>Focus</dt><dd>' + escapeHtml(project.disciplines.map(function (id) { return id === 'design' ? 'Product & UX' : id === 'analysis' ? 'Business Analysis' : id === 'ai' ? 'AI-enabled delivery' : 'Systems & data'; }).join(' · ')) + '</dd></div><div class="case-fact"><dt>Timeline</dt><dd>' + escapeHtml(project.timeframe) + '</dd></div><div class="case-fact"><dt>Disclosure</dt><dd>Public CV summary</dd></div></dl>' +
      '</div></header>' +
      '<section class="portfolio-section"><div class="portfolio-wrap case-layout">' +
        '<nav class="case-index" aria-label="Project navigation"><ol><li><a href="#challenge">01 · Challenge</a></li><li><a href="#contribution">02 · Contribution</a></li><li><a href="#deliverables">03 · Deliverables</a></li><li><a href="#outcomes">04 · Outcomes</a></li></ol></nav>' +
        '<div class="case-content">' +
          '<section class="case-block" id="challenge"><div class="case-heading"><div><p class="section-kicker">01 · Challenge</p><h2>What needed to become clear</h2></div><p>' + escapeHtml(project.challenge) + '</p></div><article class="content-card"><h3>Context</h3><p>' + escapeHtml(project.summary) + '</p><p><strong>My role:</strong> ' + escapeHtml(project.role) + '</p></article></section>' +
          '<section class="case-block" id="contribution"><div class="case-heading"><div><p class="section-kicker">02 · Contribution</p><h2>How I connected product, business, and delivery</h2></div><p>Verified contributions consolidated from the supplied CV set.</p></div><article class="content-card"><h3>Selected responsibilities</h3>' + listMarkup(project.contributions) + '</article></section>' +
          '<section class="case-block" id="deliverables"><div class="case-heading"><div><p class="section-kicker">03 · Deliverables</p><h2>Artifacts that moved the work forward</h2></div><p>The public portfolio lists artifact types without exposing confidential source material.</p></div><div class="tag-list">' + project.deliverables.map(function (item) { return '<span class="p-tag">' + escapeHtml(item) + '</span>'; }).join('') + '</div></section>' +
          '<section class="case-block" id="outcomes"><div class="case-heading"><div><p class="section-kicker">04 · Outcomes</p><h2>What the contribution enabled</h2></div><p>Qualitative outcomes only; no unsupported performance metrics are claimed.</p></div><article class="content-card"><h3>Verified impact</h3>' + listMarkup(project.outcomes) + '</article><div class="note-box mt-16">' + escapeHtml(project.disclosure) + '</div><div class="portfolio-actions"><a class="p-button primary" href="' + pageHref('work.html') + '"><span class="material-icons-outlined" aria-hidden="true">arrow_back</span> Back to selected work</a></div></section>' +
        '</div>' +
      '</div></section>';
  }

  function renderProfileLists() {
    var mappings = [
      ['[data-education-list]', data.education],
      ['[data-certification-list]', data.certifications],
      ['[data-tool-list]', data.tools],
      ['[data-activity-list]', data.activities]
    ];
    mappings.forEach(function (mapping) {
      Array.prototype.forEach.call(document.querySelectorAll(mapping[0]), function (host) {
        host.innerHTML = mapping[1].map(function (item) { return '<li>' + escapeHtml(item) + '</li>'; }).join('');
      });
    });
  }

  function renderPersonFields() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-person-name]'), function (node) { node.textContent = data.person.name; });
    Array.prototype.forEach.call(document.querySelectorAll('[data-person-email]'), function (node) { node.textContent = data.person.email; if (node.tagName === 'A') node.href = 'mailto:' + data.person.email; });
    Array.prototype.forEach.call(document.querySelectorAll('[data-current-year]'), function (node) { node.textContent = String(new Date().getFullYear()); });
  }

  function setupPrintProfile() {
    var button = document.querySelector('[data-print-profile]');
    if (!button) return;
    button.addEventListener('click', function () { window.print(); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderSiteChrome();
    setupNavigation();
    renderCapabilities();
    renderProjectGrids();
    setupProjectFilters();
    renderExperience();
    renderCaseStudy();
    renderProfileLists();
    renderPersonFields();
    setupPrintProfile();
  });
})();

