(function () {
  'use strict';

  var data = window.PORTFOLIO_DATA;
  var i18n = window.PORTFOLIO_I18N || { ui: { en: {}, vi: {} }, vi: {} };
  if (!data) return;

  // ── Ngôn ngữ ─────────────────────────────────────────────
  var LANGS = ['en', 'vi'];
  var LANG_KEY = 'portfolio-lang';
  var lang = readLang();
  var activeFilter = 'all';

  function readLang() {
    var fromUrl = new URLSearchParams(window.location.search).get('lang');
    if (LANGS.indexOf(fromUrl) !== -1) return fromUrl;
    try {
      var saved = window.localStorage.getItem(LANG_KEY);
      if (LANGS.indexOf(saved) !== -1) return saved;
    } catch (error) { /* localStorage có thể bị chặn; dùng mặc định */ }
    return 'en';
  }

  function saveLang(value) {
    try { window.localStorage.setItem(LANG_KEY, value); } catch (error) { /* bỏ qua */ }
  }

  // Chữ do script sinh ra (header, footer, thẻ, case study)
  function ui(key) {
    var table = i18n.ui[lang] || {};
    return table[key] != null ? table[key] : (i18n.ui.en[key] != null ? i18n.ui.en[key] : key);
  }

  // Giá trị trong portfolio-data.js: chuỗi thường hoặc { en, vi }
  function tr(value) {
    if (value && typeof value === 'object' && 'en' in value) {
      return value[lang] != null ? value[lang] : value.en;
    }
    return value;
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function text(value) {
    return escapeHtml(tr(value));
  }

  function each(selector, callback) {
    Array.prototype.forEach.call(document.querySelectorAll(selector), callback);
  }

  // Chữ viết thẳng trong HTML: bản tiếng Anh là nội dung gốc, bản tiếng Việt lấy từ i18n.vi
  var sourceHtml = new WeakMap();
  var sourceAttrs = new WeakMap();

  function translated(key, fallback) {
    return lang === 'vi' && i18n.vi[key] != null ? i18n.vi[key] : fallback;
  }

  function applyStaticText() {
    each('[data-i18n]', function (node) {
      if (!sourceHtml.has(node)) sourceHtml.set(node, node.innerHTML);
      var next = translated(node.getAttribute('data-i18n'), sourceHtml.get(node));
      if (node.innerHTML !== next) node.innerHTML = next;
    });
    each('[data-i18n-attr]', function (node) {
      if (!sourceAttrs.has(node)) sourceAttrs.set(node, {});
      var source = sourceAttrs.get(node);
      node.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var parts = pair.split(':');
        var attr = (parts[0] || '').trim();
        var key = (parts[1] || '').trim();
        if (!attr || !key) return;
        if (!(attr in source)) source[attr] = node.getAttribute(attr) || '';
        // Thuộc tính nhận chữ thuần, nên đổi &amp; trong từ điển về &
        node.setAttribute(attr, translated(key, source[attr]).replace(/&amp;/g, '&'));
      });
    });
  }

  // Mọi trang nằm cùng cấp ở gốc site nên đường dẫn là tên file.
  function pageHref(file) {
    return file;
  }

  function currentPage() {
    var file = window.location.pathname.split('/').pop() || 'index.html';
    return file === '' ? 'index.html' : file;
  }

  // ── Header, footer ───────────────────────────────────────
  function languageSwitch() {
    var labels = { en: 'English', vi: 'Tiếng Việt' };
    return '<div class="lang-switch" role="group" aria-label="' + escapeHtml(ui('lang.label')) + '">' +
      LANGS.map(function (code) {
        return '<button class="lang-option" type="button" data-lang-option="' + code + '" lang="' + code + '" title="' + labels[code] + '" aria-pressed="' + (code === lang ? 'true' : 'false') + '">' +
          '<span aria-hidden="true">' + code.toUpperCase() + '</span><span class="sr-only">' + labels[code] + '</span>' +
        '</button>';
      }).join('') +
    '</div>';
  }

  function renderSiteChrome() {
    var headerHost = document.querySelector('[data-site-header]');
    var footerHost = document.querySelector('[data-site-footer]');
    var routes = [
      { file: 'index.html', label: ui('nav.home') },
      { file: 'work.html', label: ui('nav.work') },
      { file: 'services.html', label: ui('nav.services') },
      { file: 'profile.html', label: ui('nav.profile') }
    ];
    var current = currentPage();
    if (current === 'case-study.html') current = 'work.html';

    if (headerHost) {
      headerHost.innerHTML =
        '<header class="site-header">' +
          '<div class="portfolio-wrap site-nav" data-site-nav>' +
            '<a class="site-brand" href="' + pageHref('index.html') + '" aria-label="' + escapeHtml(ui('nav.brand')) + '">' +
              '<span class="site-brand-mark" aria-hidden="true">' + escapeHtml(data.person.initials) + '</span>' +
              '<span class="site-brand-copy"><strong>' + escapeHtml(data.person.name) + '</strong><span>Product · UX · Business · AI</span></span>' +
            '</a>' +
            '<button class="site-nav-menu" type="button" aria-expanded="false" aria-controls="site-navigation" data-nav-toggle>' +
              '<span class="material-icons-outlined" aria-hidden="true">menu</span><span class="sr-only">' + escapeHtml(ui('nav.toggle')) + '</span>' +
            '</button>' +
            '<nav class="site-nav-links" id="site-navigation" aria-label="' + escapeHtml(ui('nav.main')) + '">' +
              routes.map(function (route) {
                var active = route.file === current;
                return '<a class="site-nav-link" href="' + pageHref(route.file) + '"' + (active ? ' aria-current="page"' : '') + '>' + escapeHtml(route.label) + '</a>';
              }).join('') +
            '</nav>' +
            languageSwitch() +
            '<a class="p-button primary" href="' + pageHref('contact.html') + '"' + (current === 'contact.html' ? ' aria-current="page"' : '') + '>' + escapeHtml(ui('cta.contact')) + '</a>' +
          '</div>' +
        '</header>';
    }

    if (footerHost) {
      footerHost.innerHTML =
        '<footer class="site-footer">' +
          '<div class="portfolio-wrap">' +
            '<div class="site-footer-grid">' +
              '<div><p class="section-kicker">' + escapeHtml(ui('footer.kicker')) + '</p><h2>' + escapeHtml(ui('footer.title')) + '</h2><p>' + escapeHtml(ui('footer.text')) + '</p><div class="portfolio-actions"><a class="p-button primary" href="' + pageHref('contact.html') + '">' + escapeHtml(ui('cta.contact')) + ' <span class="material-icons-outlined" aria-hidden="true">arrow_forward</span></a></div></div>' +
              '<div><p class="section-kicker">' + escapeHtml(ui('footer.explore')) + '</p><ul class="footer-list">' +
                routes.map(function (route) { return '<li><a href="' + pageHref(route.file) + '">' + escapeHtml(route.label) + '</a></li>'; }).join('') +
              '</ul></div>' +
              '<div><p class="section-kicker">' + escapeHtml(ui('footer.contact')) + '</p><ul class="footer-list"><li><a href="mailto:' + escapeHtml(data.person.email) + '">' + escapeHtml(data.person.email) + '</a></li><li>' + text(data.person.location) + '</li><li>' + text(data.person.languages) + '</li></ul></div>' +
            '</div>' +
            '<div class="site-footer-bottom"><span>© ' + new Date().getFullYear() + ' ' + escapeHtml(data.person.name) + '</span><span>' + escapeHtml(ui('footer.note')) + '</span></div>' +
          '</div>' +
        '</footer>';
    }
  }

  // ── Dự án ────────────────────────────────────────────────
  function renderVisual(project) {
    var cells = project.visual === 'control' ? 4 : 3;
    var bars = project.visual === 'api' ? 4 : 2;
    return '<div class="artifact-frame" aria-hidden="true">' +
      '<div class="artifact-bar primary"></div>' +
      Array.from({ length: bars - 1 }).map(function () { return '<div class="artifact-bar"></div>'; }).join('') +
      '<div class="artifact-grid">' + Array.from({ length: cells }).map(function () { return '<div class="artifact-cell"></div>'; }).join('') + '</div>' +
    '</div>';
  }

  function disciplineLabels(project, prefix) {
    return project.disciplines.map(function (id) { return ui(prefix + '.' + id); }).join(' · ');
  }

  function projectCard(project, index, featured) {
    return '<a class="project-card project-card-index-' + (index + 1) + (featured ? ' project-card-featured' : '') + '" href="' + pageHref('case-study.html') + '?project=' + encodeURIComponent(project.slug) + '" data-project-disciplines="' + escapeHtml(project.disciplines.join(' ')) + '">' +
      '<div class="project-visual project-visual-' + escapeHtml(project.visual) + '">' + renderVisual(project) + '</div>' +
      '<div class="project-content">' +
        '<div class="project-meta"><span class="project-type">' + text(project.timeframe) + '</span><span class="p-tag">' + escapeHtml(disciplineLabels(project, 'short')) + '</span></div>' +
        '<h3>' + text(project.title) + '</h3>' +
        '<p>' + text(project.summary) + '</p>' +
        '<span class="project-link">' + escapeHtml(ui('card.view')) + ' <span class="material-icons-outlined" aria-hidden="true">arrow_forward</span></span>' +
      '</div>' +
    '</a>';
  }

  function renderProjectGrids() {
    each('[data-project-grid]', function (grid) {
      var limit = Number(grid.getAttribute('data-project-limit') || data.projects.length);
      grid.innerHTML = data.projects.slice(0, limit).map(function (project, index) {
        return projectCard(project, index, grid.hasAttribute('data-feature-first') && index === 0);
      }).join('');
    });
    applyProjectFilter();
  }

  function applyProjectFilter() {
    var buttons = document.querySelectorAll('[data-project-filter]');
    if (!buttons.length) return;
    var visible = 0;
    Array.prototype.forEach.call(buttons, function (button) {
      button.setAttribute('aria-pressed', button.getAttribute('data-project-filter') === activeFilter ? 'true' : 'false');
    });
    each('[data-project-disciplines]', function (card) {
      var show = activeFilter === 'all' || (card.getAttribute('data-project-disciplines') || '').split(' ').indexOf(activeFilter) !== -1;
      card.hidden = !show;
      if (show) visible += 1;
    });
    var empty = document.querySelector('[data-project-empty]');
    if (empty) empty.classList.toggle('is-visible', visible === 0);
  }

  // ── Năng lực, kinh nghiệm, hồ sơ ─────────────────────────
  function renderCapabilities() {
    each('[data-capability-grid]', function (grid) {
      grid.innerHTML = data.capabilities.map(function (capability) {
        return '<article class="discipline-card">' +
          '<span class="discipline-card-number">' + escapeHtml(capability.number) + '</span>' +
          '<span class="material-icons-outlined" aria-hidden="true">' + escapeHtml(capability.icon) + '</span>' +
          '<h3>' + text(capability.title) + '</h3>' +
          '<p>' + text(capability.statement) + '</p>' +
          '<div class="tag-list">' + capability.skills.slice(0, 3).map(function (skill) { return '<span class="p-tag">' + text(skill) + '</span>'; }).join('') + '</div>' +
        '</article>';
      }).join('');
    });
  }

  function renderExperience() {
    each('[data-experience-list]', function (list) {
      list.innerHTML = data.experience.map(function (item) {
        return '<article class="experience-row"><time>' + text(item.period) + '</time><div><h3>' + text(item.title) + '</h3><p class="organization">' + text(item.organization) + '</p></div><p>' + text(item.summary) + '</p></article>';
      }).join('');
    });
  }

  function listMarkup(items) {
    return '<ul>' + items.map(function (item) { return '<li>' + text(item) + '</li>'; }).join('') + '</ul>';
  }

  function renderProfileLists() {
    var mappings = [
      ['[data-education-list]', data.education],
      ['[data-certification-list]', data.certifications],
      ['[data-tool-list]', data.tools],
      ['[data-activity-list]', data.activities]
    ];
    mappings.forEach(function (mapping) {
      each(mapping[0], function (host) {
        host.innerHTML = mapping[1].map(function (item) { return '<li>' + text(item) + '</li>'; }).join('');
      });
    });
  }

  function renderPersonFields() {
    each('[data-person-name]', function (node) { node.textContent = data.person.name; });
    each('[data-person-email]', function (node) { node.textContent = data.person.email; if (node.tagName === 'A') node.href = 'mailto:' + data.person.email; });
  }

  // ── Case study ───────────────────────────────────────────
  function caseHeading(number, labelKey, titleKey, lead) {
    return '<div class="case-heading"><div><p class="section-kicker">' + number + ' · ' + escapeHtml(ui(labelKey)) + '</p><h2>' + escapeHtml(ui(titleKey)) + '</h2></div><p>' + lead + '</p></div>';
  }

  function renderCaseStudy() {
    var host = document.querySelector('[data-case-study]');
    if (!host) return;
    var requested = new URLSearchParams(window.location.search).get('project');
    var project = data.projects.find(function (item) { return item.slug === requested; }) || data.projects[0];
    var sections = ['challenge', 'contribution', 'deliverables', 'outcomes'];
    document.title = tr(project.title) + ui('case.titleSuffix');
    host.innerHTML =
      '<header class="case-hero"><div class="portfolio-wrap"><p class="portfolio-eyebrow">' + escapeHtml(ui('case.eyebrow')) + ' · ' + text(project.timeframe) + '</p><h1>' + text(project.title) + '</h1><p>' + text(project.summary) + '</p>' +
        '<dl class="case-facts">' +
          '<div class="case-fact"><dt>' + escapeHtml(ui('case.role')) + '</dt><dd>' + text(project.role) + '</dd></div>' +
          '<div class="case-fact"><dt>' + escapeHtml(ui('case.focus')) + '</dt><dd>' + escapeHtml(disciplineLabels(project, 'focus')) + '</dd></div>' +
          '<div class="case-fact"><dt>' + escapeHtml(ui('case.timeline')) + '</dt><dd>' + text(project.timeframe) + '</dd></div>' +
          '<div class="case-fact"><dt>' + escapeHtml(ui('case.disclosure')) + '</dt><dd>' + escapeHtml(ui('case.disclosureValue')) + '</dd></div>' +
        '</dl>' +
      '</div></header>' +
      '<section class="portfolio-section"><div class="portfolio-wrap case-layout">' +
        '<nav class="case-index" aria-label="' + escapeHtml(ui('case.nav')) + '"><ol>' +
          sections.map(function (id, index) { return '<li><a href="#' + id + '">0' + (index + 1) + ' · ' + escapeHtml(ui('case.' + id)) + '</a></li>'; }).join('') +
        '</ol></nav>' +
        '<div class="case-content">' +
          '<section class="case-block" id="challenge">' + caseHeading('01', 'case.challenge', 'case.challengeTitle', text(project.challenge)) + '<article class="content-card"><h3>' + escapeHtml(ui('case.context')) + '</h3><p>' + text(project.summary) + '</p><p><strong>' + escapeHtml(ui('case.myRole')) + '</strong> ' + text(project.role) + '</p></article></section>' +
          '<section class="case-block" id="contribution">' + caseHeading('02', 'case.contribution', 'case.contributionTitle', escapeHtml(ui('case.contributionLead'))) + '<article class="content-card"><h3>' + escapeHtml(ui('case.responsibilities')) + '</h3>' + listMarkup(project.contributions) + '</article></section>' +
          '<section class="case-block" id="deliverables">' + caseHeading('03', 'case.deliverables', 'case.deliverablesTitle', escapeHtml(ui('case.deliverablesLead'))) + '<div class="tag-list">' + project.deliverables.map(function (item) { return '<span class="p-tag">' + text(item) + '</span>'; }).join('') + '</div></section>' +
          '<section class="case-block" id="outcomes">' + caseHeading('04', 'case.outcomes', 'case.outcomesTitle', escapeHtml(ui('case.outcomesLead'))) + '<article class="content-card"><h3>' + escapeHtml(ui('case.impact')) + '</h3>' + listMarkup(project.outcomes) + '</article><div class="note-box mt-16">' + text(project.disclosure) + '</div><div class="portfolio-actions"><a class="p-button primary" href="' + pageHref('work.html') + '"><span class="material-icons-outlined" aria-hidden="true">arrow_back</span> ' + escapeHtml(ui('case.back')) + '</a></div></section>' +
        '</div>' +
      '</div></section>';
  }

  // ── Dựng trang, đổi ngôn ngữ ─────────────────────────────
  function renderAll() {
    document.documentElement.lang = lang;
    applyStaticText();
    renderSiteChrome();
    renderCapabilities();
    renderProjectGrids();
    renderExperience();
    renderCaseStudy();
    renderProfileLists();
    renderPersonFields();
  }

  function setLang(next) {
    if (LANGS.indexOf(next) === -1 || next === lang) return;
    lang = next;
    saveLang(next);
    renderAll();
    // Header vừa được dựng lại: trả focus về nút ngôn ngữ đang chọn
    var button = document.querySelector('[data-lang-option="' + next + '"]');
    if (button) button.focus();
  }

  // Một bộ lắng nghe cho cả trang, nên không mất khi header và thẻ được dựng lại
  function handleClick(event) {
    var target = event.target.closest('[data-lang-option], [data-nav-toggle], [data-project-filter], [data-print-profile]');
    if (!target) return;

    if (target.hasAttribute('data-lang-option')) {
      setLang(target.getAttribute('data-lang-option'));
    } else if (target.hasAttribute('data-nav-toggle')) {
      var nav = document.querySelector('[data-site-nav]');
      var open = nav.getAttribute('data-nav-open') === 'true';
      nav.setAttribute('data-nav-open', open ? 'false' : 'true');
      target.setAttribute('aria-expanded', open ? 'false' : 'true');
      var icon = target.querySelector('.material-icons-outlined');
      if (icon) icon.textContent = open ? 'menu' : 'close';
    } else if (target.hasAttribute('data-project-filter')) {
      activeFilter = target.getAttribute('data-project-filter');
      applyProjectFilter();
    } else if (target.hasAttribute('data-print-profile')) {
      window.print();
    }
  }

  document.documentElement.lang = lang;
  document.addEventListener('click', handleClick);
  document.addEventListener('DOMContentLoaded', renderAll);
})();
