/* ============================================
   STRUCTURECRAFT 2.0 — MOUSE REACTIVE SYSTEM
   ============================================ */

(function () {
  'use strict';

  // Skip on mobile/touch
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;
  if (window.innerWidth < 768) return;

  // --- Custom Cursor ---
  var dot = document.createElement('div');
  dot.className = 'cursor';
  document.body.appendChild(dot);

  var mx = 0, my = 0;   // actual mouse position
  var dx = 0, dy = 0;   // drawn (lerped) position
  var visible = false;

  function show() {
    if (!visible) { dot.style.display = ''; visible = true; }
  }
  function hide() {
    if (visible) { dot.style.display = 'none'; visible = false; }
  }

  // Start hidden
  hide();

  document.addEventListener('mousemove', function (e) {
    mx = e.clientX;
    my = e.clientY;
    if (!visible) {
      // First move: snap instantly, no lerp lag
      dx = mx;
      dy = my;
      show();
    }
  });

  document.addEventListener('mouseleave', hide);
  document.addEventListener('mouseenter', function (e) {
    mx = e.clientX;
    my = e.clientY;
    dx = mx;
    dy = my;
    show();
  });

  // Cursor state: expand ring on interactive elements
  document.addEventListener('mouseover', function (e) {
    var t = e.target;
    if (t.closest('a') || t.closest('button') || t.closest('.project-card') || t.closest('.btn')) {
      dot.classList.add('cursor-hover');
    } else {
      dot.classList.remove('cursor-hover');
    }
  });

  // Animation loop — position via left/top, center via negative margins
  (function tick() {
    dx += (mx - dx) * 0.15;
    dy += (my - dy) * 0.15;
    dot.style.left = dx + 'px';
    dot.style.top = dy + 'px';
    requestAnimationFrame(tick);
  })();

  // --- Grain texture shift ---
  document.addEventListener('mousemove', function (e) {
    var gx = (e.clientX / window.innerWidth - 0.5) * 2;
    var gy = (e.clientY / window.innerHeight - 0.5) * 2;
    document.body.style.setProperty('--grain-x', gx + 'px');
    document.body.style.setProperty('--grain-y', gy + 'px');
  });

  // --- Mouse-reactive parallax ---
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

  // --- Accent glow proximity ---
  document.addEventListener('mousemove', function (e) {
    var els = document.querySelectorAll('.accent-glow');
    for (var i = 0; i < els.length; i++) {
      var r = els[i].getBoundingClientRect();
      var dist = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
      els[i].classList.toggle('glowing', dist < 100);
    }
  });

  // --- Divider pulse ---
  document.addEventListener('mousemove', function (e) {
    var els = document.querySelectorAll('.divider');
    for (var i = 0; i < els.length; i++) {
      var r = els[i].getBoundingClientRect();
      var near = e.clientY > r.top - 10 && e.clientY < r.bottom + 10 && e.clientX > r.left && e.clientX < r.right;
      els[i].classList.toggle('pulsed', near);
    }
  });
})();
