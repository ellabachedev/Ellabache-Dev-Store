/* Mobile sticky header: always pinned to the top on phones, like the desktop header.
   Matches the max-width: 768px rules in header.css / header-minify.css. */
(function () {
  'use strict';
  var header = document.querySelector('.site-header');
  if (!header || header.dataset.stickyMobileInit) return;
  header.dataset.stickyMobileInit = 'true';

  var mobile = window.matchMedia('(max-width: 768px)');
  var body = document.body;
  var root = document.documentElement;
  var announcement = header.querySelector('.announcement-bar') || document.querySelector('.announcement-bar');
  var currentY = window.pageYOffset;
  var menuOpen = body.classList.contains('mobile-menu-open');
  var savedY = null;
  var ticking = false;

  /* Space reserved on the body = the full header height, counting the announcement bar even
     while header.js has slid it up, so the page never jumps when it collapses or expands. */
  function updateReservedHeight() {
    if (!mobile.matches || menuOpen) return;
    var height = header.offsetHeight;
    // The slide-down menu is inside the header; while it fades out after closing it still has a
    // height, which pushed the page ~270px down for a moment. It never takes page space.
    // (header.js also tucks it away with a negative margin-top, so count only the space it really takes.)
    var nav = header.querySelector('.desktop-navigation');
    if (nav) height -= Math.max(0, nav.offsetHeight + (parseFloat(getComputedStyle(nav).marginTop) || 0));
    if (announcement) {
      // The current (mid-animation) margin, not the inline end value: while the bar slides up the
      // header is only partly shrunk, and using the end value made the page jump ~40px on every scroll.
      var marginTop = parseFloat(getComputedStyle(announcement).marginTop) || 0;
      if (marginTop < 0) height -= marginTop;
    }
    root.style.setProperty('--mobile-header-height', height + 'px');
  }

  // Soft shadow under the header once the page is scrolled.
  function updateShadow() {
    ticking = false;
    body.classList.toggle('mobile-header-scrolled', mobile.matches && !menuOpen && window.pageYOffset > 0);
  }

  /* Opening the menu fixes the body (base.css), which loses the scroll position, so closing it
     used to drop shoppers back at the top of the page. Remember it and put them back. */
  new MutationObserver(function () {
    var open = body.classList.contains('mobile-menu-open');
    if (open === menuOpen) return;
    menuOpen = open;
    if (open) {
      savedY = currentY;
      // Keep the page where it was behind the fading menu backdrop (instead of jumping to the top).
      if (mobile.matches) body.style.top = -savedY + 'px';
    } else {
      body.style.top = '';
      if (savedY !== null && mobile.matches) {
        window.scrollTo(0, savedY);
        currentY = savedY;
      }
      savedY = null;
    }
    updateReservedHeight();
    updateShadow();
  }).observe(body, { attributes: true, attributeFilter: ['class'] });

  window.addEventListener('scroll', function () {
    if (!menuOpen) currentY = window.pageYOffset;
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateShadow);
    }
  }, { passive: true });
  window.addEventListener('resize', updateReservedHeight);
  if (mobile.addEventListener) {
    mobile.addEventListener('change', function () {
      updateReservedHeight();
      updateShadow();
    });
  }
  if ('ResizeObserver' in window) new ResizeObserver(updateReservedHeight).observe(header);

  updateReservedHeight();
  updateShadow();
})();
