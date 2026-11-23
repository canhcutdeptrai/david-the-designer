/* Button — #c-button */
(function () {
  const root = document.getElementById('c-button');
  const idle = root.querySelector('sd-button[data-demo="save"]');
  const busy = root.querySelector('sd-button[data-demo="saving"]');
  if (!idle || !busy) return;
  idle.addEventListener('click', function () {
    idle.hidden = true;
    busy.hidden = false;
    setTimeout(function () { busy.hidden = true; idle.hidden = false; }, 1500);
  });
})();
