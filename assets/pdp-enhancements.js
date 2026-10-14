/* PDP enhancements: product info tabs (desktop) and sticky add to cart. */
(function () {
  'use strict';

  /* ---------- Info tabs ----------
     Builds a tab bar from the existing accordion items. On mobile the tab bar is hidden
     by CSS and the accordion (product-accordion.js) keeps working unchanged. */
  function initInfoTabs() {
    var block = document.querySelector('.product-single [data-pdp-tabs]');
    if (!block || block.querySelector('.pdp-info-tabs')) return;
    var items = Array.prototype.filter.call(block.children, function (el) {
      return el.classList.contains('item') && el.querySelector('.header h3');
    });
    if (items.length < 2) return;

    var nav = document.createElement('div');
    nav.className = 'pdp-info-tabs';
    nav.setAttribute('role', 'tablist');
    nav.setAttribute('aria-label', 'Product information');

    var tabs = items.map(function (item, index) {
      var content = item.querySelector('.content');
      var tabId = 'pdp-info-tab-' + index;
      var panelId = 'pdp-info-panel-' + index;
      var tab = document.createElement('button');
      tab.type = 'button';
      tab.className = 'pdp-info-tabs__tab';
      tab.id = tabId;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', panelId);
      tab.textContent = item.querySelector('.header h3').textContent.trim();
      if (content) {
        content.id = content.id || panelId;
        tab.setAttribute('aria-controls', content.id);
        content.setAttribute('role', 'tabpanel');
        content.setAttribute('aria-labelledby', tabId);
      }
      tab.addEventListener('click', function () { select(index, false); });
      tab.addEventListener('keydown', function (event) {
        var next = null;
        if (event.key === 'ArrowRight') next = (index + 1) % items.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = items.length - 1;
        if (next === null) return;
        event.preventDefault();
        select(next, true);
      });
      nav.appendChild(tab);
      return tab;
    });

    function select(activeIndex, focus) {
      items.forEach(function (item, index) {
        var active = index === activeIndex;
        item.classList.toggle('is-active', active);
        tabs[index].setAttribute('aria-selected', active ? 'true' : 'false');
        tabs[index].tabIndex = active ? 0 : -1;
      });
      if (focus) tabs[activeIndex].focus();
    }

    block.insertBefore(nav, items[0]);
    block.classList.add('pdp-tabs-enabled');
    select(0, false);
  }

  /* ---------- Sticky add to cart ---------- */
  function initStickyAtc() {
    var bar = document.querySelector('[data-pdp-sticky-atc]');
    var mainButton = document.getElementById('pdp-addtocart');
    if (!bar || !mainButton) return;
    if (bar.dataset.pdpStickyInit) return;
    bar.dataset.pdpStickyInit = 'true';

    var stickyButton = bar.querySelector('[data-pdp-sticky-button]');
    var stickyLabel = bar.querySelector('[data-pdp-sticky-label]');
    var stickyPrices = bar.querySelectorAll('[data-pdp-sticky-price]');
    var stickyQty = bar.querySelector('[data-pdp-sticky-qty-input]');
    var focusables = bar.querySelectorAll('a, button, input');
    var mainPrice = document.querySelector('.product-hero-content [data-product-price]');
    var mainQty = document.querySelector('.product-form .quantity-wrapper input[name="quantity"]');

    function syncFromMain() {
      var mainLabel = mainButton.querySelector('[data-add-to-cart-text]');
      stickyButton.disabled = mainButton.disabled;
      if (mainButton.disabled && mainLabel) {
        stickyLabel.textContent = mainLabel.textContent.trim();
      }
      if (mainPrice) {
        Array.prototype.forEach.call(stickyPrices, function (el) {
          el.textContent = mainPrice.textContent.trim();
        });
      }
      if (mainQty && stickyQty) stickyQty.value = mainQty.value || 1;
    }

    /* Quantity: the sticky stepper drives the main quantity input, which keeps the
       add-to-cart claim quantity up to date (product-info-new listens for its change event). */
    function setQuantity(value) {
      var qty = Math.max(1, parseInt(value, 10) || 1);
      if (stickyQty) stickyQty.value = qty;
      if (mainQty) {
        mainQty.value = qty;
        mainQty.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
    if (stickyQty) {
      bar.querySelectorAll('[data-pdp-sticky-qty-step]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          setQuantity((parseInt(stickyQty.value, 10) || 1) + parseInt(btn.getAttribute('data-pdp-sticky-qty-step'), 10));
        });
      });
      stickyQty.addEventListener('change', function () { setQuantity(stickyQty.value); });
      // The theme's spinner updates the main input through jQuery, so listen the same way.
      // Bound on load: window.jQuery seen by this deferred script is not the instance the theme ends up using.
      window.addEventListener('load', function () {
        if (mainQty && window.jQuery) {
          window.jQuery(mainQty).on('change', function () { stickyQty.value = mainQty.value || 1; });
        }
      });
    }

    /* Chat: while the bar is showing, lift the Tidio launcher above it (unless the chat is open). */
    var chatOpen = false;
    function updateChatLift() {
      document.documentElement.style.setProperty('--pdp-sticky-atc-height', bar.offsetHeight + 'px');
      document.body.classList.toggle('pdp-sticky-lift-chat', isVisible && !chatOpen);
    }
    function bindTidio() {
      if (!window.tidioChatApi || bindTidio.done) return;
      bindTidio.done = true;
      window.tidioChatApi.on('open', function () { chatOpen = true; updateChatLift(); });
      window.tidioChatApi.on('close', function () { chatOpen = false; updateChatLift(); });
    }
    document.addEventListener('tidioChat-ready', bindTidio);
    bindTidio();

    function setVisible(visible) {
      if (visible) syncFromMain();
      bar.classList.toggle('is-visible', visible);
      document.body.classList.toggle('pdp-sticky-atc-visible', visible);
      bar.setAttribute('aria-hidden', visible ? 'false' : 'true');
      Array.prototype.forEach.call(focusables, function (el) { el.tabIndex = visible ? 0 : -1; });
      if (visible) {
        bar.removeAttribute('inert');
      } else {
        bar.setAttribute('inert', '');
      }
      updateChatLift();
    }

    // Position check on scroll rather than IntersectionObserver: an observer only fires when
    // the button crosses the viewport edge, so jumps (anchor links, scroll restore) would be missed.
    var isVisible = false;
    var ticking = false;
    function update() {
      ticking = false;
      // Only show once the button has scrolled up past the top of the viewport.
      var visible = mainButton.getBoundingClientRect().bottom < 0;
      if (visible !== isVisible) {
        isVisible = visible;
        setVisible(visible);
      }
    }
    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', function () {
      requestUpdate();
      updateChatLift();
    });
    update();

    // The sticky button simply runs the main Add to Cart (same quantity, same cart behaviour).
    stickyButton.addEventListener('click', function () {
      if (mainButton.disabled) return;
      mainButton.click();
    });
  }

  /* ---------- Wishlist: works from the keyboard, announces the saved state ---------- */
  function initWishlistButton() {
    var button = document.querySelector('.product-single .add_to_wishlist');
    if (!button || button.dataset.pdpWishlistInit) return;
    button.dataset.pdpWishlistInit = 'true';
    button.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      button.click();
    });
    function sync() {
      var saved = button.classList.contains('addedtoquote');
      button.setAttribute('aria-label', saved ? 'Saved to wishlist' : 'Add to wishlist');
    }
    new MutationObserver(sync).observe(button, { attributes: true, attributeFilter: ['class'] });
    sync();
  }

  /* ---------- Trust row: keep the free-shipping line in step with the cart ---------- */
  function initFreeShippingLine() {
    var item = document.querySelector('[data-pdp-free-shipping]');
    var text = item && item.querySelector('[data-pdp-free-shipping-text]');
    if (!text) return;
    var threshold = parseInt(item.getAttribute('data-threshold'), 10) || 0;
    var price = parseInt(item.getAttribute('data-price'), 10) || 0;
    var productId = parseInt(item.getAttribute('data-product-id'), 10);
    if (!threshold || price >= threshold) return; // "Free standard shipping on this item" never changes

    function money(cents) {
      return '$' + (cents / 100).toFixed(2); // matches the store's money format ($143.00)
    }
    function render(cart) {
      if (!cart || typeof cart.total_price !== 'number') return;
      var inCart = (cart.items || []).some(function (line) { return line.product_id === productId; });
      var total = cart.total_price + (inCart ? 0 : price);
      if (total >= threshold) {
        text.innerHTML = '<strong>Free standard shipping</strong> on your order';
      } else {
        text.innerHTML = (inCart ? 'You’re ' : 'With this item you’re ') + '<strong>' + money(threshold - total) + '</strong> away from free standard shipping';
      }
    }
    window.addEventListener('load', function () {
      if (!window.jQuery) return;
      window.jQuery(document).on('cart.requestComplete', function (event, cart) {
        render(cart || (window.CartJS && window.CartJS.cart));
      });
    });
  }

  /* ---------- Desktop sticky gallery: keep it just below the fixed header ---------- */
  function initGalleryOffset() {
    var header = document.querySelector('.site-header');
    if (!header || !document.querySelector('.product-single .pdp-image-gallery')) return;
    var root = document.documentElement;
    var current = null;
    var ticking = false;
    function update() {
      ticking = false;
      var offset = Math.max(0, Math.round(header.getBoundingClientRect().bottom));
      if (offset === current) return;
      current = offset;
      root.style.setProperty('--pdp-header-offset', offset + 'px');
    }
    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    if ('ResizeObserver' in window) new ResizeObserver(requestUpdate).observe(header);
    update();
  }

  /* ---------- Reviews: collapse long reviews to 5 lines with "Read more" ---------- */
  function initReviewClamp() {
    var widget = document.getElementById('stamped-main-widget');
    if (!widget || widget.dataset.pdpClampInit) return;
    widget.dataset.pdpClampInit = 'true';
    var scheduled = false;
    function clamp() {
      scheduled = false;
      widget.querySelectorAll('.stamped-review-content-body:not([data-pdp-clamp])').forEach(function (body) {
        body.setAttribute('data-pdp-clamp', '');
        body.classList.add('pdp-review-clamped');
        // Only keep the clamp (and add the button) when the text is actually cut off.
        if (body.scrollHeight <= body.clientHeight + 2) {
          body.classList.remove('pdp-review-clamped');
          return;
        }
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'pdp-review-more';
        button.textContent = 'Read more';
        button.setAttribute('aria-expanded', 'false');
        button.addEventListener('click', function () {
          var expanded = body.classList.toggle('is-expanded');
          button.textContent = expanded ? 'Read less' : 'Read more';
          button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        });
        body.insertAdjacentElement('afterend', button);
      });
    }
    function schedule() {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(clamp);
    }
    // Stamped renders the reviews later (and again on "Load more" or filtering).
    new MutationObserver(schedule).observe(widget, { childList: true, subtree: true });
    schedule();
  }

  function init() {
    initGalleryOffset();
    initReviewClamp();
    initInfoTabs();
    initStickyAtc();
    initWishlistButton();
    initFreeShippingLine();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
