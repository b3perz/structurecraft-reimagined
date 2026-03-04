/* ============================================
   STRUCTURECRAFT 2.0 — MOUSE REACTIVE SYSTEM
   "Latent feel" — the website breathes
   ============================================ */

(function () {
  'use strict';

  // Skip on mobile/touch
  if ('ontouchstart' in window || window.innerWidth < 768) return;

  // --- State ---
  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const cursor = { x: mouse.x, y: mouse.y };
  const LERP = 0.08;

  // --- Cursor Element ---
  const cursorEl = document.createElement('div');
  cursorEl.className = 'cursor';
  document.body.appendChild(cursorEl);

  // --- Track Mouse ---
  document.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // Grain texture shift
    const grainX = (e.clientX / window.innerWidth - 0.5) * 2;
    const grainY = (e.clientY / window.innerHeight - 0.5) * 2;
    document.body.style.setProperty('--grain-x', grainX + 'px');
    document.body.style.setProperty('--grain-y', grainY + 'px');

    // Mouse-reactive elements (opposite direction shift)
    var reactiveEls = document.querySelectorAll('.mouse-reactive');
    for (var i = 0; i < reactiveEls.length; i++) {
      var el = reactiveEls[i];
      var rect = el.getBoundingClientRect();
      var centerX = rect.left + rect.width / 2;
      var centerY = rect.top + rect.height / 2;
      var distX = (e.clientX - centerX) / rect.width;
      var distY = (e.clientY - centerY) / rect.height;

      if (
        e.clientX > rect.left - 50 &&
        e.clientX < rect.right + 50 &&
        e.clientY > rect.top - 50 &&
        e.clientY < rect.bottom + 50
      ) {
        el.style.transform =
          'translate(' + (-distX * 5) + 'px, ' + (-distY * 5) + 'px)';
      } else {
        el.style.transform = 'translate(0, 0)';
      }
    }

    // Accent glow proximity
    var accentEls = document.querySelectorAll('.accent-glow');
    for (var j = 0; j < accentEls.length; j++) {
      var aEl = accentEls[j];
      var aRect = aEl.getBoundingClientRect();
      var aCenterX = aRect.left + aRect.width / 2;
      var aCenterY = aRect.top + aRect.height / 2;
      var dist = Math.sqrt(
        Math.pow(e.clientX - aCenterX, 2) + Math.pow(e.clientY - aCenterY, 2)
      );
      if (dist < 100) {
        aEl.classList.add('glowing');
      } else {
        aEl.classList.remove('glowing');
      }
    }

    // Divider pulse
    var dividers = document.querySelectorAll('.divider');
    for (var k = 0; k < dividers.length; k++) {
      var dRect = dividers[k].getBoundingClientRect();
      if (
        e.clientY > dRect.top - 10 &&
        e.clientY < dRect.bottom + 10 &&
        e.clientX > dRect.left &&
        e.clientX < dRect.right
      ) {
        dividers[k].classList.add('pulsed');
      } else {
        dividers[k].classList.remove('pulsed');
      }
    }
  });

  // --- Cursor state changes ---
  document.addEventListener('mouseover', function (e) {
    var target = e.target;
    if (
      target.closest('a') ||
      target.closest('button') ||
      target.closest('.project-card') ||
      target.closest('.btn')
    ) {
      cursorEl.classList.add('cursor-interactive');
      cursorEl.classList.remove('cursor-text');
    } else if (
      target.closest('p') ||
      target.closest('.text-body') ||
      target.closest('.detail-narrative')
    ) {
      cursorEl.classList.add('cursor-text');
      cursorEl.classList.remove('cursor-interactive');
    } else {
      cursorEl.classList.remove('cursor-interactive', 'cursor-text');
    }
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', function () {
    cursorEl.style.opacity = '0';
  });
  document.addEventListener('mouseenter', function () {
    cursorEl.style.opacity = '';
  });

  // --- Animation Loop ---
  function updateCursor() {
    cursor.x += (mouse.x - cursor.x) * LERP;
    cursor.y += (mouse.y - cursor.y) * LERP;
    cursorEl.style.transform =
      'translate(' + cursor.x + 'px, ' + cursor.y + 'px) translate(-50%, -50%)';

    // Grain texture follows mouse subtly
    var bStyle = document.body.style;
    bStyle.setProperty(
      '--grain-translate',
      'translate(' +
        ((mouse.x / window.innerWidth - 0.5) * 2) +
        'px, ' +
        ((mouse.y / window.innerHeight - 0.5) * 2) +
        'px)'
    );

    requestAnimationFrame(updateCursor);
  }

  requestAnimationFrame(updateCursor);

  // Update grain pseudo-element with mouse-driven transform
  var style = document.createElement('style');
  style.textContent =
    'body::before { transform: var(--grain-translate, translate(0,0)); }';
  document.head.appendChild(style);
})();
