/* ============================================================
   PROTOTYPE DESIGN SYSTEM — Shell JavaScript

   Core interactivity for the app shell:
   sidebar toggle, submenu toggle, keyboard shortcuts,
   toast dismiss, tab switching, dropdown, modal.
   ============================================================ */

// ── Sidebar Toggle ──────────────────────────────────────────
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('collapsed');
}

// ── Submenu Toggle ──────────────────────────────────────────
function toggleSubmenu(event, submenuId) {
  event.preventDefault();
  var sub = document.getElementById(submenuId);
  if (sub) {
    sub.classList.toggle('collapsed');
    var isOpen = !sub.classList.contains('collapsed');
    // Material Icons: swap icon name text
    // Menu dùng class .material-icons-outlined (rule 4 của AGENTS.md cấm bản filled),
    // nên selector chỉ bắt .material-icons sẽ KHÔNG khớp và mũi tên đứng im mãi.
    // Bắt cả hai để không phụ thuộc trang dùng biến thể nào.
    var chevronIcon = event.currentTarget.querySelector(
      '.menu-item-chevron .material-icons-outlined, .menu-item-chevron .material-icons'
    );
    if (chevronIcon) {
      chevronIcon.textContent = isOpen ? 'expand_less' : 'expand_more';
    }
  }
}

// ── Modal Toggle ────────────────────────────────────────────
function toggleModal(modalId) {
  var id = modalId || 'demoModal';
  var modal = document.getElementById(id);
  if (modal) modal.classList.toggle('open');
}

// ── Collapsible Card/Section Toggle ────────────────────────
// Supports: .form-card, .detail-section
document.addEventListener('click', function(e) {
  var header = e.target.closest('.form-card-header, .detail-section-header');
  if (!header) return;
  var card = header.closest('.form-card, .detail-section');
  if (!card) return;
  card.classList.toggle('collapsed');
});

// ── detail-cards-row: Equal Height Equalizer ───────────────
// CSS percentage heights don't propagate into custom elements reliably.
// JS measures the tallest sd-section and applies an explicit px height to all.
function equalizeDetailCards() {
  document.querySelectorAll('.detail-cards-row').forEach(function(row) {
    var sections = Array.from(row.querySelectorAll(':scope > sd-section'));
    if (sections.length < 2) return;
    // Reset all heights first
    sections.forEach(function(s) { s.style.height = ''; });
    void row.offsetHeight;

    // Explicitly pin collapsed sections to header height — works regardless of
    // whether the CSS max-height transition has finished (no rendering-frame dependency).
    sections.forEach(function(s) {
      var body = s.querySelector('.c-section-body');
      if (body && body.hidden) {
        var hdr = s.querySelector('.c-section-header');
        s.style.height = (hdr ? hdr.getBoundingClientRect().height : 48) + 'px';
      }
    });

    // Equalize only the expanded sections
    var expanded = sections.filter(function(s) {
      var body = s.querySelector('.c-section-body');
      return body && !body.hidden;
    });
    if (expanded.length < 2) return;
    void row.offsetHeight;
    var maxH = 0;
    expanded.forEach(function(s) {
      maxH = Math.max(maxH, s.getBoundingClientRect().height);
    });
    if (maxH > 0) {
      expanded.forEach(function(s) { s.style.height = maxH + 'px'; });
    }
  });
}

// Re-equalize after collapse/expand — wait for the 0.25s CSS transition to finish
document.addEventListener('click', function(e) {
  var header = e.target.closest('.c-section-header.c-collapsable');
  if (!header) return;
  var row = header.closest('.detail-cards-row');
  if (!row) return;
  setTimeout(equalizeDetailCards, 300);
});

// ── Inline Table: Add / Remove rows ───────────────────────
function updateInlineTableRemoveButtons(table) {
  var rows = table.querySelectorAll('tbody tr');
  var btns = table.querySelectorAll('.inline-table-remove');
  btns.forEach(function(btn) {
    btn.disabled = rows.length <= 1;
  });
}

// Remove row
document.addEventListener('click', function(e) {
  var btn = e.target.closest('.inline-table-remove');
  if (!btn || btn.disabled) return;
  var tr = btn.closest('tr');
  var table = btn.closest('.inline-table');
  if (!tr || !table) return;
  tr.remove();
  updateInlineTableRemoveButtons(table);
});

// Add row — clone from first row (template), reset all fields, re-init dropdowns
document.addEventListener('click', function(e) {
  var btn = e.target.closest('.inline-table-add');
  if (!btn) return;
  var wrapperEl = btn.closest('.inline-table-wrapper');
  var table = wrapperEl ? wrapperEl.querySelector('.inline-table') : null;
  if (!table) return;
  var firstRow = table.querySelector('tbody tr:first-child');
  if (!firstRow) return;

  // Store original first-row HTML as template (before any user modifications)
  if (!table._rowTemplate) {
    table._rowTemplate = firstRow.cloneNode(true);
    // Clear values in template
    table._rowTemplate.querySelectorAll('input').forEach(function(input) { input.value = ''; });
    table._rowTemplate.querySelectorAll('.form-field-dropdown-item.selected').forEach(function(item) {
      item.classList.remove('selected');
      var check = item.querySelector('.material-icons');
      if (check) check.remove();
    });
    table._rowTemplate.querySelectorAll('.form-field-label').forEach(function(l) { l.remove(); });
  }

  var newRow = table._rowTemplate.cloneNode(true);
  table.querySelector('tbody').appendChild(newRow);

  // Re-init dropdown listeners on the new row
  initDropdownsInRow(newRow);

  updateInlineTableRemoveButtons(table);

  // Dispatch event for page-specific scripts
  table.dispatchEvent(new CustomEvent('inline-table:row-added', { detail: { row: newRow } }));
});

// Re-init dropdown click handlers for a given container (used after cloning rows)
function initDropdownsInRow(container) {
  container.querySelectorAll('.form-field-dropdown').forEach(function(wrapper) {
    var field = wrapper.querySelector('.form-field');
    var menu = wrapper.querySelector('.form-field-dropdown-menu');
    if (!field || !menu) return;

    field.addEventListener('click', function(e) {
      e.stopPropagation();
      if (field.classList.contains('disabled') || field.classList.contains('readonly')) return;
      document.querySelectorAll('.form-field-dropdown.open').forEach(function(dd) {
        if (dd !== wrapper) { dd.classList.remove('open'); dd.querySelector('.form-field-dropdown-menu').classList.remove('open'); }
      });
      wrapper.classList.toggle('open');
      menu.classList.toggle('open');
    });

    menu.querySelectorAll('.form-field-dropdown-item').forEach(function(item) {
      item.addEventListener('click', function(e) {
        e.stopPropagation();
        var value = item.getAttribute('data-value') || item.textContent.trim();
        var input = field.querySelector('.form-field-input');
        if (input) { input.value = value; input.placeholder = ''; }
        menu.querySelectorAll('.form-field-dropdown-item').forEach(function(it) {
          it.classList.remove('selected');
          var checkIcon = it.querySelector('.material-icons');
          if (checkIcon) checkIcon.remove();
        });
        item.classList.add('selected');
        var check = document.createElement('span');
        check.className = 'material-icons';
        check.textContent = 'check';
        item.appendChild(check);
        // Add floating label only if NOT inside inline-table
        if (!wrapper.closest('.inline-table') && !field.querySelector('.form-field-label')) {
          var placeholder = input.getAttribute('data-label') || 'Field label';
          var label = document.createElement('label');
          label.className = 'form-field-label';
          label.textContent = placeholder;
          field.appendChild(label);
        }
        wrapper.classList.remove('open');
        menu.classList.remove('open');
      });
    });
  });
}

// Init: disable remove buttons if only 1 row + equalize detail cards
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.inline-table').forEach(updateInlineTableRemoveButtons);
  // sd-section AND sd-section-item both render asynchronously.
  // Run multiple passes to catch late-rendering custom elements.
  setTimeout(equalizeDetailCards, 150);
  setTimeout(equalizeDetailCards, 400);
  setTimeout(equalizeDetailCards, 800);
});

// ── Init on DOM Ready ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {

  // Tab switching
  document.querySelectorAll('.tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      this.parentElement.querySelectorAll('.tab').forEach(function(t) {
        t.classList.remove('active');
      });
      this.classList.add('active');
    });
  });

  // Toast dismiss
  document.querySelectorAll('.toast-close').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var toast = this.closest('.toast');
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 300ms ease';
      setTimeout(function() { toast.remove(); }, 300);
    });
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      var searchInput = document.querySelector('.detail-search-field input');
      if (searchInput) searchInput.focus();
    }
    if (e.key === 'Escape') {
      document.querySelectorAll('.dropdown-menu.open').forEach(function(menu) {
        menu.classList.remove('open');
      });
      document.querySelectorAll('.modal-overlay.open').forEach(function(modal) {
        modal.classList.remove('open');
      });
      if (document.activeElement && document.activeElement.closest('.detail-search-field')) {
        document.activeElement.blur();
      }
    }
  });

  // Dropdown toggle (click on .dropdown > .btn)
  document.querySelectorAll('.dropdown').forEach(function(dropdown) {
    var trigger = dropdown.querySelector('.btn');
    var menu = dropdown.querySelector('.dropdown-menu');
    if (trigger && menu) {
      trigger.addEventListener('click', function(e) {
        e.stopPropagation();
        document.querySelectorAll('.dropdown-menu.open').forEach(function(m) {
          if (m !== menu) m.classList.remove('open');
        });
        menu.classList.toggle('open');
      });
    }
  });

  // Close dropdowns on outside click
  document.addEventListener('click', function() {
    document.querySelectorAll('.dropdown-menu.open').forEach(function(menu) {
      menu.classList.remove('open');
    });
    // Close form-field dropdowns
    document.querySelectorAll('.form-field-dropdown.open').forEach(function(dd) {
      dd.classList.remove('open');
      dd.querySelector('.form-field-dropdown-menu').classList.remove('open');
    });
    // Close datepickers
    document.querySelectorAll('.form-field-datepicker.open').forEach(function(dp) {
      dp.classList.remove('open');
    });
  });

  // ── Form Field: Dropdown ───────────────────────────────────
  document.querySelectorAll('.form-field-dropdown').forEach(function(wrapper) {
    var field = wrapper.querySelector('.form-field');
    var menu = wrapper.querySelector('.form-field-dropdown-menu');
    if (!field || !menu) return;

    field.addEventListener('click', function(e) {
      e.stopPropagation();
      if (field.classList.contains('disabled') || field.classList.contains('readonly')) return;

      // Close other open dropdowns/datepickers
      document.querySelectorAll('.form-field-dropdown.open').forEach(function(dd) {
        if (dd !== wrapper) {
          dd.classList.remove('open');
          dd.querySelector('.form-field-dropdown-menu').classList.remove('open');
        }
      });
      document.querySelectorAll('.form-field-datepicker.open').forEach(function(dp) {
        dp.classList.remove('open');
      });

      wrapper.classList.toggle('open');
      menu.classList.toggle('open');
    });

    // Item selection
    menu.querySelectorAll('.form-field-dropdown-item').forEach(function(item) {
      item.addEventListener('click', function(e) {
        e.stopPropagation();
        var value = item.getAttribute('data-value') || item.textContent.trim();
        var input = field.querySelector('.form-field-input');
        if (input) {
          input.value = value;
          input.placeholder = '';
        }

        // Mark selected
        menu.querySelectorAll('.form-field-dropdown-item').forEach(function(it) {
          it.classList.remove('selected');
          var checkIcon = it.querySelector('.material-icons');
          if (checkIcon) checkIcon.remove();
        });
        item.classList.add('selected');
        var check = document.createElement('span');
        check.className = 'material-icons';
        check.textContent = 'check';
        item.appendChild(check);

        // Add floating label if not exists
        if (!field.querySelector('.form-field-label')) {
          var placeholder = input.getAttribute('data-label') || 'Field label';
          var label = document.createElement('label');
          label.className = 'form-field-label';
          label.textContent = placeholder;
          field.appendChild(label);
        }

        // Close
        wrapper.classList.remove('open');
        menu.classList.remove('open');
      });
    });
  });

  // ── Form Field: Datepicker ─────────────────────────────────
  document.querySelectorAll('.form-field-datepicker-wrapper').forEach(function(wrapper) {
    var field = wrapper.querySelector('.form-field');
    var picker = wrapper.querySelector('.form-field-datepicker');
    if (!field || !picker) return;

    var currentDate = new Date();
    var viewYear = currentDate.getFullYear();
    var viewMonth = currentDate.getMonth();
    var selectedDate = null;

    var MONTHS_VI = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                     'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
    var WEEKDAYS_VI = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

    function renderCalendar() {
      var titleEl = picker.querySelector('.form-field-datepicker-title');
      var daysEl = picker.querySelector('.form-field-datepicker-days');
      if (!titleEl || !daysEl) return;

      titleEl.textContent = MONTHS_VI[viewMonth] + ', ' + viewYear;

      var firstDay = new Date(viewYear, viewMonth, 1);
      var lastDay = new Date(viewYear, viewMonth + 1, 0);
      // Monday = 0, Sunday = 6
      var startDow = (firstDay.getDay() + 6) % 7;
      var daysInMonth = lastDay.getDate();

      var html = '';

      // Previous month trailing days
      var prevMonthLast = new Date(viewYear, viewMonth, 0).getDate();
      for (var i = startDow - 1; i >= 0; i--) {
        html += '<button class="form-field-datepicker-day other-month" data-date="">' + (prevMonthLast - i) + '</button>';
      }

      // Current month days
      var today = new Date();
      for (var d = 1; d <= daysInMonth; d++) {
        var classes = 'form-field-datepicker-day';
        if (d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()) {
          classes += ' today';
        }
        if (selectedDate && d === selectedDate.getDate() && viewMonth === selectedDate.getMonth() && viewYear === selectedDate.getFullYear()) {
          classes += ' selected';
        }
        var dateStr = String(d).padStart(2, '0') + '/' + String(viewMonth + 1).padStart(2, '0') + '/' + viewYear;
        html += '<button class="' + classes + '" data-date="' + dateStr + '">' + d + '</button>';
      }

      // Next month leading days
      var totalCells = startDow + daysInMonth;
      var remaining = (7 - (totalCells % 7)) % 7;
      for (var j = 1; j <= remaining; j++) {
        html += '<button class="form-field-datepicker-day other-month" data-date="">' + j + '</button>';
      }

      daysEl.innerHTML = html;

      // Attach day click handlers
      daysEl.querySelectorAll('.form-field-datepicker-day:not(.other-month)').forEach(function(dayBtn) {
        dayBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          var dateVal = dayBtn.getAttribute('data-date');
          if (!dateVal) return;

          var parts = dateVal.split('/');
          selectedDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));

          var input = field.querySelector('.form-field-input');
          if (input) {
            input.value = dateVal;
            input.placeholder = '';
          }

          // Add floating label if not exists
          if (!field.querySelector('.form-field-label')) {
            var placeholder = input.getAttribute('data-label') || 'Field label';
            var label = document.createElement('label');
            label.className = 'form-field-label';
            label.textContent = placeholder;
            field.appendChild(label);
          }

          picker.classList.remove('open');
          renderCalendar();
        });
      });
    }

    // Toggle datepicker on field click
    field.addEventListener('click', function(e) {
      e.stopPropagation();
      if (field.classList.contains('disabled') || field.classList.contains('readonly')) return;

      // Close other pickers/dropdowns
      document.querySelectorAll('.form-field-datepicker.open').forEach(function(dp) {
        if (dp !== picker) dp.classList.remove('open');
      });
      document.querySelectorAll('.form-field-dropdown.open').forEach(function(dd) {
        dd.classList.remove('open');
        dd.querySelector('.form-field-dropdown-menu').classList.remove('open');
      });

      picker.classList.toggle('open');
      if (picker.classList.contains('open')) {
        renderCalendar();
      }
    });

    // Prevent picker clicks from closing
    picker.addEventListener('click', function(e) {
      e.stopPropagation();
    });

    // Prev/Next month
    var prevBtn = picker.querySelector('.form-field-datepicker-nav-prev');
    var nextBtn = picker.querySelector('.form-field-datepicker-nav-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        viewMonth--;
        if (viewMonth < 0) { viewMonth = 11; viewYear--; }
        renderCalendar();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        viewMonth++;
        if (viewMonth > 11) { viewMonth = 0; viewYear++; }
        renderCalendar();
      });
    }

    // Initial render
    renderCalendar();
  });

  // Escape also closes form-field dropdowns, datepickers & datetime
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.form-field-dropdown.open').forEach(function(dd) {
        dd.classList.remove('open');
        dd.querySelector('.form-field-dropdown-menu').classList.remove('open');
      });
      document.querySelectorAll('.form-field-datepicker.open').forEach(function(dp) {
        dp.classList.remove('open');
      });
      document.querySelectorAll('.form-field-datetime-popup.open').forEach(function(dp) {
        dp.classList.remove('open');
      });
    }
  });

  // ── Form Field: Password toggle ────────────────────────────
  document.querySelectorAll('.form-field-password').forEach(function(field) {
    var toggle = field.querySelector('.form-field-trailing');
    var input = field.querySelector('.form-field-input');
    if (!toggle || !input) return;

    toggle.addEventListener('click', function(e) {
      e.stopPropagation();
      if (input.type === 'password') {
        input.type = 'text';
        toggle.textContent = 'visibility';
      } else {
        input.type = 'password';
        toggle.textContent = 'visibility_off';
      }
    });
  });

  // ── Form Field: Currency formatting (thousand separator) ───
  document.querySelectorAll('.form-field-currency .form-field-input').forEach(function(input) {
    function formatCurrency(value) {
      // Remove all non-digit characters
      var digits = value.replace(/\D/g, '');
      if (!digits) return '';
      // Add thousand separator with dot "."
      return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    input.addEventListener('input', function() {
      var pos = input.selectionStart;
      var oldLen = input.value.length;
      var formatted = formatCurrency(input.value);
      input.value = formatted;
      // Adjust cursor position after formatting
      var newLen = formatted.length;
      var diff = newLen - oldLen;
      input.setSelectionRange(pos + diff, pos + diff);
    });

    // Format on load if has value
    if (input.value) {
      input.value = formatCurrency(input.value);
    }
  });

  // ── Form Field: DateTime (Date + Time picker) ──────────────
  document.querySelectorAll('.form-field-datetime').forEach(function(wrapper) {
    var field = wrapper.querySelector('.form-field');
    var popup = wrapper.querySelector('.form-field-datetime-popup');
    if (!field || !popup) return;

    var now = new Date();
    var viewYear = now.getFullYear();
    var viewMonth = now.getMonth();
    var selectedDate = null;
    var selectedHour = now.getHours();
    var selectedMinute = now.getMinutes();
    var clockMode = 'hour'; // 'hour' or 'minute'

    var MONTHS_VI = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
                     'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];
    var MONTHS_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var DAYS_EN = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

    // Elements
    var yearEl = popup.querySelector('.form-field-datetime-year');
    var dateEl = popup.querySelector('.form-field-datetime-date');
    var timeEl = popup.querySelector('.form-field-datetime-time');
    var calendarView = popup.querySelector('.dt-calendar-view');
    var clockView = popup.querySelector('.dt-clock-view');
    var tabDate = popup.querySelector('.dt-tab-date');
    var tabTime = popup.querySelector('.dt-tab-time');
    var calHeader = popup.querySelector('.form-field-datepicker-title');
    var calDays = popup.querySelector('.form-field-datepicker-days');
    var clockEl = popup.querySelector('.form-field-timepicker-clock');
    var handEl = popup.querySelector('.form-field-timepicker-hand');
    var modeEl = popup.querySelector('.form-field-timepicker-mode');

    function pad(n) { return n < 10 ? '0' + n : '' + n; }

    function updateLeftPanel() {
      var d = selectedDate || now;
      if (yearEl) yearEl.textContent = d.getFullYear();
      if (dateEl) dateEl.innerHTML = MONTHS_EN[d.getMonth()] + ' ' + pad(d.getDate()) + ',<br>' + DAYS_EN[d.getDay()];
      if (timeEl) {
        var hClass = clockMode === 'hour' ? ' dt-active' : '';
        var mClass = clockMode === 'minute' ? ' dt-active' : '';
        timeEl.innerHTML = '<span class="dt-hour-display' + hClass + '">' + pad(selectedHour) + '</span>:<span class="dt-min-display' + mClass + '">' + pad(selectedMinute) + '</span>';
      }
    }

    function renderCalendar() {
      if (!calHeader || !calDays) return;
      calHeader.textContent = MONTHS_VI[viewMonth] + ', ' + viewYear;

      var firstDay = new Date(viewYear, viewMonth, 1);
      var lastDay = new Date(viewYear, viewMonth + 1, 0);
      var startDow = (firstDay.getDay() + 6) % 7;
      var daysInMonth = lastDay.getDate();
      var today = new Date();
      var html = '';

      var prevLast = new Date(viewYear, viewMonth, 0).getDate();
      for (var i = startDow - 1; i >= 0; i--) {
        html += '<button class="form-field-datepicker-day other-month">' + (prevLast - i) + '</button>';
      }
      for (var d = 1; d <= daysInMonth; d++) {
        var cls = 'form-field-datepicker-day';
        if (d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()) cls += ' today';
        if (selectedDate && d === selectedDate.getDate() && viewMonth === selectedDate.getMonth() && viewYear === selectedDate.getFullYear()) cls += ' selected';
        html += '<button class="' + cls + '" data-day="' + d + '">' + d + '</button>';
      }
      var total = startDow + daysInMonth;
      var rem = (7 - (total % 7)) % 7;
      for (var j = 1; j <= rem; j++) {
        html += '<button class="form-field-datepicker-day other-month">' + j + '</button>';
      }
      calDays.innerHTML = html;

      calDays.querySelectorAll('.form-field-datepicker-day:not(.other-month)').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          var day = parseInt(btn.getAttribute('data-day'));
          selectedDate = new Date(viewYear, viewMonth, day);
          renderCalendar();
          updateLeftPanel();
        });
      });
    }

    function renderClock() {
      if (!clockEl) return;
      // Clear old numbers
      clockEl.querySelectorAll('.form-field-timepicker-number').forEach(function(n) { n.remove(); });

      var cx = 110, cy = 110; // center of 220px clock
      var outerR = 90, innerR = 60;

      if (clockMode === 'hour') {
        if (modeEl) modeEl.textContent = 'Chọn giờ';
        // Outer ring: 1-12
        for (var h = 1; h <= 12; h++) {
          var angle = (h * 30 - 90) * Math.PI / 180;
          var x = cx + outerR * Math.cos(angle) - 16;
          var y = cy + outerR * Math.sin(angle) - 16;
          var el = document.createElement('button');
          el.className = 'form-field-timepicker-number' + (selectedHour === h ? ' selected' : '');
          el.style.left = x + 'px';
          el.style.top = y + 'px';
          el.textContent = h;
          el.setAttribute('data-val', h);
          clockEl.appendChild(el);
        }
        // Inner ring: 13-24 (0 shown as 00)
        for (var h2 = 13; h2 <= 24; h2++) {
          var angle2 = ((h2 - 12) * 30 - 90) * Math.PI / 180;
          var x2 = cx + innerR * Math.cos(angle2) - 14;
          var y2 = cy + innerR * Math.sin(angle2) - 14;
          var el2 = document.createElement('button');
          var dispVal = h2 === 24 ? 0 : h2;
          el2.className = 'form-field-timepicker-number inner' + (selectedHour === dispVal ? ' selected' : '');
          el2.style.left = x2 + 'px';
          el2.style.top = y2 + 'px';
          el2.textContent = h2 === 24 ? '00' : h2;
          el2.setAttribute('data-val', dispVal);
          clockEl.appendChild(el2);
        }
      } else {
        if (modeEl) modeEl.textContent = 'Chọn phút';
        // Minutes: 0,5,10,...,55
        for (var m = 0; m < 60; m += 5) {
          var angle3 = (m * 6 - 90) * Math.PI / 180;
          var x3 = cx + outerR * Math.cos(angle3) - 16;
          var y3 = cy + outerR * Math.sin(angle3) - 16;
          var el3 = document.createElement('button');
          el3.className = 'form-field-timepicker-number' + (selectedMinute === m ? ' selected' : '');
          el3.style.left = x3 + 'px';
          el3.style.top = y3 + 'px';
          el3.textContent = pad(m);
          el3.setAttribute('data-val', m);
          clockEl.appendChild(el3);
        }
      }

      // Update hand rotation
      if (handEl) {
        var handAngle, handLen;
        if (clockMode === 'hour') {
          handAngle = selectedHour * 30;
          handLen = (selectedHour >= 13 || selectedHour === 0) ? innerR - 16 : outerR - 16;
        } else {
          handAngle = selectedMinute * 6;
          handLen = outerR - 16;
        }
        handEl.style.height = handLen + 'px';
        handEl.style.transform = 'translateX(-50%) rotate(' + handAngle + 'deg)';
      }

      // Click handlers on numbers
      clockEl.querySelectorAll('.form-field-timepicker-number').forEach(function(num) {
        num.addEventListener('click', function(e) {
          e.stopPropagation();
          var val = parseInt(num.getAttribute('data-val'));
          if (clockMode === 'hour') {
            selectedHour = val;
            clockMode = 'minute';
          } else {
            selectedMinute = val;
          }
          renderClock();
          updateLeftPanel();
          updateTabs();

          // If minute selected, set value
          if (clockMode === 'minute' && selectedDate) {
            setFieldValue();
          }
        });
      });
    }

    function updateTabs() {
      if (tabDate && tabTime) {
        var isCalendar = calendarView && calendarView.style.display !== 'none';
        tabDate.classList.toggle('active', isCalendar);
        tabTime.classList.toggle('active', !isCalendar);
      }
    }

    function showCalendar() {
      if (calendarView) calendarView.style.display = '';
      if (clockView) clockView.style.display = 'none';
      updateTabs();
      renderCalendar();
    }

    function showClock() {
      if (calendarView) calendarView.style.display = 'none';
      if (clockView) clockView.style.display = '';
      updateTabs();
      renderClock();
    }

    function setFieldValue() {
      if (!selectedDate) return;
      var input = field.querySelector('.form-field-input');
      if (!input) return;
      var val = pad(selectedDate.getDate()) + '/' + pad(selectedDate.getMonth() + 1) + '/' + selectedDate.getFullYear() + ' ' + pad(selectedHour) + ':' + pad(selectedMinute);
      input.value = val;
      input.placeholder = '';
      if (!field.querySelector('.form-field-label')) {
        var lbl = document.createElement('label');
        lbl.className = 'form-field-label';
        lbl.textContent = input.getAttribute('data-label') || 'Ngày giờ';
        field.appendChild(lbl);
      }
    }

    // Tab clicks
    if (tabDate) tabDate.addEventListener('click', function(e) { e.stopPropagation(); showCalendar(); });
    if (tabTime) tabTime.addEventListener('click', function(e) { e.stopPropagation(); showClock(); });

    // Left panel hour/min click to switch mode
    if (timeEl) {
      timeEl.addEventListener('click', function(e) {
        e.stopPropagation();
        var target = e.target;
        if (target.classList.contains('dt-hour-display')) {
          clockMode = 'hour';
          showClock();
          updateLeftPanel();
        } else if (target.classList.contains('dt-min-display')) {
          clockMode = 'minute';
          showClock();
          updateLeftPanel();
        }
      });
    }

    // Prev/next month
    var prevBtn = popup.querySelector('.form-field-datepicker-nav-prev');
    var nextBtn = popup.querySelector('.form-field-datepicker-nav-next');
    if (prevBtn) prevBtn.addEventListener('click', function(e) {
      e.stopPropagation(); viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; } renderCalendar();
    });
    if (nextBtn) nextBtn.addEventListener('click', function(e) {
      e.stopPropagation(); viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; } renderCalendar();
    });

    // OK button
    var okBtn = popup.querySelector('.dt-ok-btn');
    if (okBtn) okBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (selectedDate) setFieldValue();
      popup.classList.remove('open');
    });

    // Toggle popup on field click
    field.addEventListener('click', function(e) {
      e.stopPropagation();
      if (field.classList.contains('disabled') || field.classList.contains('readonly')) return;
      document.querySelectorAll('.form-field-datetime-popup.open').forEach(function(p) { if (p !== popup) p.classList.remove('open'); });
      document.querySelectorAll('.form-field-datepicker.open').forEach(function(p) { p.classList.remove('open'); });
      document.querySelectorAll('.form-field-dropdown.open').forEach(function(dd) { dd.classList.remove('open'); dd.querySelector('.form-field-dropdown-menu').classList.remove('open'); });
      var wasOpen = popup.classList.contains('open');
      popup.classList.toggle('open');
      if (!wasOpen) {
        clockMode = 'hour';
        showCalendar();
        updateLeftPanel();
      }
    });

    popup.addEventListener('click', function(e) { e.stopPropagation(); });

    // Initial
    updateLeftPanel();
    renderCalendar();
    renderClock();
  });

  // Close datetime popups on outside click
  document.addEventListener('click', function() {
    document.querySelectorAll('.form-field-datetime-popup.open').forEach(function(p) {
      p.classList.remove('open');
    });
  });

  // ── DS Guide — Copy code button (sd-button) ───────────────
  document.querySelectorAll('sd-button.ds-guide-copy-btn').forEach(function(sdBtn) {
    sdBtn.addEventListener('click', function() {
      var pre = sdBtn.closest('.ds-guide-code-wrap').querySelector('.ds-guide-code');
      if (!pre) return;
      var code = pre.textContent;
      function onCopied() {
        sdBtn.setAttribute('prefixIcon', 'check');
        sdBtn.setAttribute('title', 'Đã copy!');
        sdBtn.setAttribute('color', 'success');
        setTimeout(function() {
          sdBtn.setAttribute('prefixIcon', 'content_copy');
          sdBtn.setAttribute('title', 'Copy');
          sdBtn.setAttribute('color', 'secondary');
        }, 2000);
      }
      if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(onCopied).catch(onCopied);
      } else {
        var ta = document.createElement('textarea');
        ta.value = code;
        ta.style.cssText = 'position:fixed;opacity:0;';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        onCopied();
      }
    });
  });
});
