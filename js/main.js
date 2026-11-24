/* =========================================================
   «Мій Харків» — анімації Fade In / Fade Out і кнопка «Нагору»
   ========================================================= */
(function () {
  'use strict';

  // Якщо в системі вимкнено анімації — показуємо все одразу, без ефектів
  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Fade In: блоки з класом .reveal плавно з'являються під час прокручування ---------- */
  var revealItems = document.querySelectorAll('.reveal');

  function showAll() {
    for (var i = 0; i < revealItems.length; i++) {
      revealItems[i].classList.add('is-visible');
    }
  }

  if (reduceMotion || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // кожен блок з'являється лише один раз
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });

    for (var i = 0; i < revealItems.length; i++) {
      observer.observe(revealItems[i]);
    }
  }

  /* ---------- 2. Fade Out: сторінка плавно зникає перед переходом на іншу сторінку сайту ---------- */
  var FADE_OUT_MS = 350; // має збігатися з тривалістю анімації fadeOut у style.css

  document.addEventListener('click', function (event) {
    var link = event.target.closest ? event.target.closest('a[href]') : null;
    if (!link || event.defaultPrevented) return;

    // Не заважаємо відкривати посилання в новій вкладці (Ctrl/Shift/середня кнопка миші)
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    if (link.target && link.target !== '_self') return;
    if (link.hasAttribute('download')) return;

    var href = link.getAttribute('href');
    if (!href || href.charAt(0) === '#') return; // якір на цій же сторінці — просто прокручуємо

    var url = new URL(link.href, window.location.href);
    var sameSite = url.protocol === window.location.protocol && url.host === window.location.host;
    var samePage = url.pathname === window.location.pathname && url.search === window.location.search;
    if (!sameSite || samePage || reduceMotion) return;

    event.preventDefault();
    document.body.classList.add('is-leaving');
    setTimeout(function () {
      window.location.href = link.href;
    }, FADE_OUT_MS);
  });

  // Повернення кнопкою «Назад»: браузер може показати збережену (вже згаслу) сторінку
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
      document.body.classList.remove('is-leaving');
    }
  });

  /* ---------- 3. Кнопка «Нагору»: плавно з'являється після прокручування і зникає вгорі ---------- */
  var toTop = document.querySelector('.to-top');

  if (toTop) {
    var toggleButton = function () {
      toTop.classList.toggle('is-shown', window.scrollY > 500);
    };

    window.addEventListener('scroll', toggleButton, { passive: true });
    toggleButton();

    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }
})();
