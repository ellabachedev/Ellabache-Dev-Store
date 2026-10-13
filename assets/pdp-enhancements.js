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
    var stickyPrice = bar.querySelector('[data-pdp-sticky-price]');
    var mainPrice = document.querySelector('.product-hero-content [data-product-price]');

    function syncFromMain() {
      var mainLabel = mainButton.querySelector('[data-add-to-cart-text]');
      stickyButton.disabled = mainButton.disabled;
      if (mainButton.disabled && mainLabel) {
        stickyLabel.textContent = mainLabel.textContent.trim();
      }
      if (mainPrice && stickyPrice) {
        stickyPrice.textContent = mainPrice.textContent.trim();
      }
    }

    function setVisible(visible) {
      if (visible) syncFromMain();
      bar.classList.toggle('is-visible', visible);
      document.body.classList.toggle('pdp-sticky-atc-visible', visible);
      bar.setAttribute('aria-hidden', visible ? 'false' : 'true');
      stickyButton.tabIndex = visible ? 0 : -1;
      if (visible) {
        bar.removeAttribute('inert');
      } else {
        bar.setAttribute('inert', '');
      }
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
    window.addEventListener('resize', requestUpdate);
    update();

    stickyButton.addEventListener('click', function () {
      if (mainButton.disabled) return;
      mainButton.click();
    });
  }

  function init() {
    initInfoTabs();
    initStickyAtc();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
