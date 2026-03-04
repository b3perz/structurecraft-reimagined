/* ============================================
   STRUCTURECRAFT 2.0 — MOUSE REACTIVE SYSTEM
   ============================================ */

(function () {
  'use strict';

  /* ---- bail on touch / small screens ---- */
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;
  if (window.innerWidth < 768) return;

  /* ---- create cursor element on <html> to avoid body stacking issues ---- */
  var cursor = document.createElement('div');
  cursor.className = 'cursor';
  document.documentElement.appendChild(cursor);

  /* ---- state ---- */
  var mouseX = -100;
  var mouseY = -100;
  var cursorX = -100;
  var cursorY = -100;
  var active = false;

  /* ---- positioning loop (LERP) ---- */
  function render() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(render);
  }
  render();

  /* ---- show cursor ---- */
  function showCursor(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!active) {
      cursorX = mouseX;
      cursorY = mouseY;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      active = true;
    }
    cursor.classList.add('visible');
  }

  /* ---- mouse tracking ---- */
  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!active) {
      cursorX = mouseX;
      cursorY = mouseY;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      cursor.classList.add('visible');
      active = true;
    }
  });

  /* ---- hide on leave, show on enter ---- */
  document.addEventListener('mouseleave', function () {
    cursor.classList.remove('visible');
    cursor.classList.remove('cursor-hover');
  });

  document.addEventListener('mouseenter', function (e) {
    showCursor(e);
  });

  /* ---- hover state on interactive elements ---- */
  var interactiveSelector = 'a, button, [role="button"], .project-card, .btn, .filter-btn, .accordion-toggle, input, textarea, select, label';

  document.addEventListener('mouseover', function (e) {
    if (e.target.closest && e.target.closest(interactiveSelector)) {
      cursor.classList.add('cursor-hover');
    } else {
      cursor.classList.remove('cursor-hover');
    }
  });

  /* ---- grain texture shift ---- */
  document.addEventListener('mousemove', function (e) {
    var gx = (e.clientX / window.innerWidth - 0.5) * 2;
    var gy = (e.clientY / window.innerHeight - 0.5) * 2;
    document.body.style.setProperty('--grain-x', gx + 'px');
    document.body.style.setProperty('--grain-y', gy + 'px');
  });

  /* ---- mouse-reactive parallax ---- */
  document.addEventListener('mousemove', function (e) {
    var els = document.querySelectorAll('.mouse-reactive');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var r = el.getBoundingClientRect();
      var cx = r.left + r.width / 2;
      var cy = r.top + r.height / 2;

      if (
        e.clientX > r.left - 50 && e.clientX < r.right + 50 &&
        e.clientY > r.top - 50 && e.clientY < r.bottom + 50
      ) {
        var fx = (e.clientX - cx) / r.width;
        var fy = (e.clientY - cy) / r.height;
        el.style.transform = 'translate(' + (-fx * 5) + 'px,' + (-fy * 5) + 'px)';
      } else {
        el.style.transform = '';
      }
    }
  });

  /* ---- accent glow proximity ---- */
  document.addEventListener('mousemove', function (e) {
    var els = document.querySelectorAll('.accent-glow');
    for (var i = 0; i < els.length; i++) {
      var r = els[i].getBoundingClientRect();
      var dist = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
      els[i].classList.toggle('glowing', dist < 100);
    }
  });

  /* ---- divider pulse ---- */
  document.addEventListener('mousemove', function (e) {
    var els = document.querySelectorAll('.divider');
    for (var i = 0; i < els.length; i++) {
      var r = els[i].getBoundingClientRect();
      var near = e.clientY > r.top - 10 && e.clientY < r.bottom + 10 && e.clientX > r.left && e.clientX < r.right;
      els[i].classList.toggle('pulsed', near);
    }
  });
})();
