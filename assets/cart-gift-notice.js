/* Free gift notice in the mini cart.
   When a cart update adds a free gift (a line whose title contains "% off", as added by the Free
   Gifts app), a small navy popup slides in from the right over the cart's top bar (so it never
   covers the products), with a little confetti burst from the gift:
   "Free gift added" (or "2 free gifts added"), a "View" button that scrolls to the gift line and highlights it,
   and a close button. It hides itself after a few seconds (paused while hovered or focused).
   Gifts already in the cart when the page loads, or already announced earlier in this visit,
   are not announced again. */
(function () {
  'use strict';
  var STORE_KEY = 'eb-announced-gifts';
  var SHOW_MS = 6000;
  // Gift lines already in the cart when the page was built (from Liquid) + gifts announced earlier
  // in this visit: none of these are announced.
  var script = document.currentScript;
  var known = ((script && script.getAttribute('data-initial-gifts')) || '').split(',').filter(Boolean);
  var notice = null;
  var hideTimer = null;
  var newGiftKeys = [];

  function isGift(item) { return (item.title || '').indexOf('% off') !== -1; } // same test as the cart template
  function giftName(item) { return (item.product_title || item.title || '').replace(/\s*\(\d+% off\)\s*/i, '').trim(); }

  function readStored() {
    try { return JSON.parse(sessionStorage.getItem(STORE_KEY)) || []; } catch (e) { return []; }
  }
  function store(keys) {
    try { sessionStorage.setItem(STORE_KEY, JSON.stringify(keys)); } catch (e) { /* private mode: fine */ }
  }

  function build() {
    var drawer = document.getElementById('cart-mini');
    if (!drawer) return null;
    var el = document.createElement('div');
    el.className = 'cart-gift-notice';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.hidden = true;
    el.innerHTML =
      '<span class="cart-gift-notice__icon" aria-hidden="true">&#127873;</span>' + // one gift emoji, whatever the count
      '<span class="cart-gift-notice__body">' +
        '<strong class="cart-gift-notice__title"></strong>' +
      '</span>' +
      '<button type="button" class="cart-gift-notice__view">View</button>' +
      '<button type="button" class="cart-gift-notice__close" aria-label="Close">' +
        '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>' +
      '</button>';
    drawer.appendChild(el); // positioned over the drawer's top bar (CSS)
    el.querySelector('.cart-gift-notice__close').addEventListener('click', hide);
    el.querySelector('.cart-gift-notice__view').addEventListener('click', function () { hide(); showGiftLines(); });
    // Pause while the shopper is reading or using it
    el.addEventListener('mouseenter', function () { clearTimeout(hideTimer); });
    el.addEventListener('mouseleave', schedule);
    el.addEventListener('focusin', function () { clearTimeout(hideTimer); });
    el.addEventListener('focusout', schedule);
    return el;
  }

  function schedule() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, SHOW_MS);
  }

  function hide() {
    clearTimeout(hideTimer);
    if (!notice || notice.hidden) return;
    notice.classList.remove('is-visible');
    setTimeout(function () { if (!notice.classList.contains('is-visible')) notice.hidden = true; }, 320);
  }

  function show(names) {
    notice = notice || build();
    if (!notice) return;
    // Just "Free gift added" / "2 free gifts added" (no product names); View shows the gifts.
    notice.querySelector('.cart-gift-notice__title').textContent =
      names.length === 1 ? 'Free gift added' : names.length + ' free gifts added';
    notice.hidden = false;
    // next frame so the open transition runs; then make sure it's in view if the cart was scrolled
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      notice.classList.add('is-visible');
      burst();
    }); });
    schedule();
  }

  // A small confetti burst from the gift emoji (brand colours). Skipped for reduced motion.
  var CONFETTI = ['#f2d3c9', '#8b4063', '#1f6f74', '#e8c27a', '#ffffff', '#c4e4e3'];
  function burst() {
    if (!notice || !notice.animate) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var icon = notice.querySelector('.cart-gift-notice__icon');
    icon.animate([{ transform: 'scale(0.4) rotate(-15deg)' }, { transform: 'scale(1.35) rotate(8deg)' }, { transform: 'scale(1)' }],
      { duration: 520, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1.2)' });
    var layer = document.createElement('span');
    layer.className = 'cart-gift-notice__confetti';
    layer.setAttribute('aria-hidden', 'true');
    icon.appendChild(layer);
    for (var i = 0; i < 16; i++) {
      var piece = document.createElement('i');
      var angle = (Math.PI * 2 * i) / 16 + (Math.random() - 0.5) * 0.5;
      var distance = 26 + Math.random() * 26;
      var size = 4 + Math.random() * 4;
      piece.style.width = size + 'px';
      piece.style.height = (Math.random() < 0.5 ? size : size * 0.45) + 'px';
      piece.style.background = CONFETTI[i % CONFETTI.length];
      layer.appendChild(piece);
      piece.animate([
        { transform: 'translate(-50%, -50%) rotate(0deg)', opacity: 1 },
        { transform: 'translate(calc(-50% + ' + Math.cos(angle) * distance + 'px), calc(-50% + ' + Math.sin(angle) * distance + 'px)) rotate(' + (Math.random() * 360) + 'deg)', opacity: 1, offset: 0.7 },
        { transform: 'translate(calc(-50% + ' + Math.cos(angle) * distance * 1.15 + 'px), calc(-50% + ' + (Math.sin(angle) * distance + 14) + 'px)) rotate(' + (Math.random() * 540) + 'deg)', opacity: 0 }
      ], { duration: 750 + Math.random() * 250, easing: 'cubic-bezier(0.15, 0.7, 0.3, 1)', fill: 'forwards' });
    }
    setTimeout(function () { layer.remove(); }, 1100);
  }

  // Scroll the cart to the first new gift line and highlight the new ones briefly.
  function showGiftLines() {
    var items = (window.CartJS && CartJS.cart && CartJS.cart.items) || [];
    var lines = document.querySelectorAll('#minicart-items-wrap > .cart-line-item');
    var first = null;
    items.forEach(function (item, index) {
      if (newGiftKeys.indexOf(item.key) === -1 || !lines[index]) return;
      var line = lines[index];
      first = first || line;
      line.classList.remove('is-new-gift');
      void line.offsetWidth; // restart the highlight animation
      line.classList.add('is-new-gift');
    });
    if (first) first.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }

  function onCart(cart) {
    if (!cart || !cart.items) return;
    var gifts = cart.items.filter(isGift);
    var keys = gifts.map(function (g) { return g.key; });
    var fresh = gifts.filter(function (g) { return known.indexOf(g.key) === -1; });
    known = keys.slice(); // removed gifts can be announced again if they come back
    store(keys);
    if (!fresh.length) return;
    newGiftKeys = fresh.map(function (g) { return g.key; });
    show(fresh.map(giftName));
  }

  known = known.concat(readStored());
  if (!window.jQuery) return;
  jQuery(document).on('cart.requestComplete', function (event, cart) { onCart(cart || (window.CartJS && CartJS.cart)); });
  // Closing the drawer also closes the notice
  jQuery(document).on('click', '#cart-mini a[aria-label="close"]', hide);
})();
