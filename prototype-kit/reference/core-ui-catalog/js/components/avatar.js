/* Avatar — #c-avatar */
(function () {
  const root = document.getElementById('c-avatar');
  const PALETTE = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50", "#f1c40f", "#e67e22", "#e74c3c", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"];
  const input = root.querySelector('.av-try input');
  const live = root.querySelector('.av-live .sd-avatar');
  if (!input || !live) return;
  function color(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return PALETTE[Math.abs(hash) % PALETTE.length];
  }
  function initials(name) {
    const words = name.trim().split(' ').filter(Boolean);
    if (!words.length) return '';
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  input.addEventListener('input', function () {
    const v = input.value || '';
    const span = live.querySelector('.sd-avatar-text');
    live.style.backgroundColor = v ? color(v) : '#bdc3c7';
    span.textContent = ' ' + (v ? initials(v) : '?') + ' ';
  });
})();
