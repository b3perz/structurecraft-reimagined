/* ============================================
   STRUCTURECRAFT 2.0 — MAIN JS
   Navigation, scroll reveals, counters, etc.
   ============================================ */

(function () {
  'use strict';

  // --- Page Enter Animation ---
  document.body.classList.add('page-enter');

  // --- Sticky Navigation ---
  var nav = document.querySelector('.nav');
  if (nav) {
    var isHomepage = document.body.classList.contains('page-home');
    if (isHomepage) {
      var heroSection = document.querySelector('.home-opening');
      if (heroSection) {
        var navObserver = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                nav.classList.remove('visible');
              } else {
                nav.classList.add('visible');
              }
            });
          },
          { threshold: 0.1 }
        );
        navObserver.observe(heroSection);
      }
    } else {
      nav.classList.add('always-visible');
    }
  }

  // --- Mobile Navigation ---
  var hamburger = document.querySelector('.nav-hamburger');
  var overlay = document.querySelector('.nav-overlay');
  var overlayClose = document.querySelector('.nav-overlay-close');

  if (hamburger && overlay) {
    hamburger.addEventListener('click', function () {
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    if (overlayClose) {
      overlayClose.addEventListener('click', function () {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    // Close overlay on link click
    var overlayLinks = overlay.querySelectorAll('a');
    overlayLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Scroll Reveal (IntersectionObserver) ---
  var revealElements = document.querySelectorAll('.reveal');

  if (revealElements.length > 0) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // --- Sequential Fade Reveal ---
  var seqFadeElements = document.querySelectorAll('.seq-fade');
  if (seqFadeElements.length > 0) {
    var seqObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            seqObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    seqFadeElements.forEach(function (el) {
      seqObserver.observe(el);
    });
  }

  // --- Wipe Reveal ---
  var wipeElements = document.querySelectorAll('.wipe-reveal');
  if (wipeElements.length > 0) {
    var wipeObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            wipeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    wipeElements.forEach(function (el) {
      wipeObserver.observe(el);
    });
  }

  // --- Timeline Reveal ---
  var timelineEntries = document.querySelectorAll('.timeline-entry');
  if (timelineEntries.length > 0) {
    var tlObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            tlObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    timelineEntries.forEach(function (el, i) {
      el.classList.add(i % 2 === 0 ? 'from-left' : 'from-right');
      tlObserver.observe(el);
    });
  }

  // --- Counter Animation ---
  function animateCounter(el) {
    var target = el.getAttribute('data-target');
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var isFloat = target.indexOf('.') > -1;
    var targetNum = parseFloat(target);
    var duration = 2000;
    var startTime = null;

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var easedProgress = easeOutExpo(progress);
      var current = easedProgress * targetNum;

      if (isFloat) {
        el.textContent = prefix + current.toFixed(1) + suffix;
      } else {
        el.textContent = prefix + Math.floor(current) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + target + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  var counters = document.querySelectorAll('.counter[data-target]');
  if (counters.length > 0) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  // --- Filter Bar (Work page) ---
  var filterBtns = document.querySelectorAll('.filter-btn');
  var projectCards = document.querySelectorAll('.masonry-grid .project-card');

  if (filterBtns.length > 0) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = btn.getAttribute('data-filter');

        // Update active state
        filterBtns.forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');

        // Filter cards
        projectCards.forEach(function (card) {
          if (filter === 'all' || card.getAttribute('data-type') === filter) {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
            card.style.pointerEvents = 'auto';
            card.style.position = 'relative';
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            card.style.pointerEvents = 'none';
            card.style.position = 'absolute';
          }
        });
      });
    });
  }

  // --- Accordion ---
  var accordionToggles = document.querySelectorAll('.accordion-toggle');
  accordionToggles.forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      var item = toggle.closest('.accordion-item');
      var isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.accordion-item').forEach(function (ai) {
        ai.classList.remove('open');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });

  // --- Horizontal Scroll Gallery Navigation ---
  var galleryPrev = document.querySelector('.gallery-prev');
  var galleryNext = document.querySelector('.gallery-next');
  var gallery = document.querySelector('.h-scroll');

  if (galleryPrev && galleryNext && gallery) {
    var scrollAmount = window.innerWidth * 0.72;

    galleryNext.addEventListener('click', function () {
      gallery.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    galleryPrev.addEventListener('click', function () {
      gallery.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
  }

  // --- Parallax (lightweight) ---
  var parallaxEls = document.querySelectorAll('.parallax');
  if (parallaxEls.length > 0) {
    var lastScroll = 0;
    var ticking = false;

    function updateParallax() {
      parallaxEls.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        var speed = parseFloat(el.getAttribute('data-speed')) || 0.15;
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          var offset = -(rect.top * speed);
          el.style.transform = 'translateY(' + offset + 'px)';
        }
      });
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      lastScroll = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    });
  }

  // --- Debounced Resize ---
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      // Recalculate scroll amount for gallery
      if (gallery) {
        scrollAmount = window.innerWidth * 0.72;
      }
    }, 250);
  });
})();
