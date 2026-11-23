/* Code editor — #c-code-editor */
(function () {
  const root = document.getElementById('c-code-editor');
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function tok(c, t) { return '<span class="token ' + c + '">' + esc(t) + '</span>'; }
  function hlJson(src) {
    const re = /("(?:[^"\\]|\\.)*")(\s*:)?|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|\b(true|false)\b|\b(null)\b|([{}\[\],])|(:)|(\s+)|([\s\S])/g;
    let out = '', m;
    while ((m = re.exec(src))) {
      if (m[1] !== undefined) out += m[2] ? tok('property', m[1]) + m[2].replace(':', '') + tok('operator', ':') : tok('string', m[1]);
      else if (m[3]) out += tok('number', m[3]);
      else if (m[4]) out += tok('boolean', m[4]);
      else if (m[5]) out += tok('keyword', m[5]);
      else if (m[6]) out += tok('punctuation', m[6]);
      else if (m[7]) out += tok('operator', m[7]);
      else out += esc(m[8] || m[9] || '');
    }
    return out;
  }
  root.querySelectorAll('.sd-code-wrapper').forEach(function (w) {
    const ta = w.querySelector('.code-textarea');
    const code = w.querySelector('.code-display code');
    if (ta) ta.addEventListener('input', function () { code.innerHTML = hlJson(ta.value || ' ') + '\n'; });
    const btn = w.querySelector('.copy-btn');
    btn.addEventListener('click', function () {
      const icon = btn.querySelector('mat-icon');
      const label = btn.querySelector('span');
      const text = ta ? ta.value : code.textContent;
      try { navigator.clipboard.writeText(text).catch(function () {}); } catch (e) {}
      icon.textContent = 'check'; icon.classList.add('text-success'); label.textContent = 'Copied';
      setTimeout(function () { icon.textContent = 'content_copy'; icon.classList.remove('text-success'); label.textContent = 'Copy'; }, 2000);
    });
  });
})();
