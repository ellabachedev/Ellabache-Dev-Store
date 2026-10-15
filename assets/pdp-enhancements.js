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

    // Narrower screens (tablets, small laptops): the tabs scroll sideways instead of wrapping onto
    // a second row, with ‹ › at the edges so it's clear there are more tabs.
    var wrap = document.createElement('div');
    wrap.className = 'pdp-info-tabs-wrap';
    var arrow = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'pdp-info-tabs__arrow pdp-info-tabs__arrow--prev';
    prev.setAttribute('aria-hidden', 'true'); // keyboard users move between tabs with the arrow keys
    prev.tabIndex = -1;
    prev.innerHTML = arrow;
    var next = prev.cloneNode(true);
    next.className = 'pdp-info-tabs__arrow pdp-info-tabs__arrow--next';
    wrap.appendChild(prev);
    wrap.appendChild(nav);
    wrap.appendChild(next);

    function updateArrows() {
      var max = nav.scrollWidth - nav.clientWidth;
      wrap.classList.toggle('can-prev', max > 2 && nav.scrollLeft > 2);
      wrap.classList.toggle('can-next', max > 2 && nav.scrollLeft < max - 2);
    }
    prev.addEventListener('click', function () { nav.scrollBy({ left: -nav.clientWidth * 0.6, behavior: 'smooth' }); });
    next.addEventListener('click', function () { nav.scrollBy({ left: nav.clientWidth * 0.6, behavior: 'smooth' }); });
    nav.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);

    function select(activeIndex, focus) {
      items.forEach(function (item, index) {
        var active = index === activeIndex;
        item.classList.toggle('is-active', active);
        tabs[index].setAttribute('aria-selected', active ? 'true' : 'false');
        tabs[index].tabIndex = active ? 0 : -1;
      });
      if (focus) tabs[activeIndex].focus({ preventScroll: true });
      // Bring the chosen tab fully into view inside the row (without scrolling the page)
      var tab = tabs[activeIndex];
      var left = tab.offsetLeft - nav.offsetLeft;
      if (left < nav.scrollLeft) nav.scrollTo({ left: left - 24, behavior: 'smooth' });
      else if (left + tab.offsetWidth > nav.scrollLeft + nav.clientWidth) nav.scrollTo({ left: left + tab.offsetWidth - nav.clientWidth + 24, behavior: 'smooth' });
    }

    block.insertBefore(wrap, items[0]);
    block.classList.add('pdp-tabs-enabled');
    select(0, false);
    updateArrows();
  }

  /* ---------- Info cards ----------
     "How to use", "Benefits" and "Therapist tips" are written in admin as bullet lists. Show
     them as cards: numbered steps, icon cards (icon picked from the wording) and tip cards.
     Content that isn't a single list (e.g. paragraphs) is left exactly as written. */
  var BENEFIT_ICONS = [
    [/cleans|remov|purif|pore|impurit/i, 'check'],
    [/hydrat|moist|plump|nourish|water/i, 'drop'],
    [/protect|uv|spf|sun|barrier|free radical|antioxidant|defen|prevent/i, 'shield'],
    [/sooth|calm|sensitiv|redness|gentle|comfort|heal|condition/i, 'leaf'],
    [/bright|glow|radian|luminous|tone|pigment|clarity/i, 'sparkle'],
    [/smooth|line|wrinkle|firm|lift|texture|volume|refine/i, 'waves']
  ];

  /* Splits a panel's content into { lead, rows }:
     - bullets (any number) become rows; paragraphs after a list become rows too;
     - paragraphs before the first list are a short lead-in shown above the rows;
     - with no list at all, paragraphs become rows, except for Description (left as text);
     - anything else (tables, images, headings…) → null, and the content is left as written. */
  function infoEntries(content, type) {
    var nodes = Array.prototype.filter.call(content.childNodes, function (node) {
      return node.textContent.trim() !== '' || (node.nodeType === 1 && node.querySelector('img'));
    });
    if (!nodes.length) return null;
    var hasList = nodes.some(function (node) { return /^(UL|OL)$/.test(node.nodeName); });
    if (!hasList && type === 'description') return null;
    var lead = [];
    var rows = [];
    var seenList = false;
    for (var i = 0; i < nodes.length; i++) {
      var node = nodes[i];
      if (/^(UL|OL)$/.test(node.nodeName)) {
        seenList = true;
        Array.prototype.forEach.call(node.children, function (li) {
          if (li.nodeName === 'LI' && li.textContent.trim() !== '') rows.push(li.innerHTML.trim());
        });
        continue;
      }
      var html;
      if (node.nodeType === 3) html = node.textContent.trim().replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; });
      else if (/^(P|DIV|SPAN)$/.test(node.nodeName) && !node.querySelector('img, table, ul, ol, h1, h2, h3, h4')) html = node.innerHTML.trim();
      else return null;
      if (hasList && !seenList) lead.push(html);
      else rows.push(html);
    }
    return rows.length ? { lead: lead, rows: rows } : null;
  }

  // Which tabs become icon rows, and the icon each row gets (benefits: picked from the wording)
  var INFO_LISTS = [
    [/descri/i, 'description', 'check'],
    [/benefit/i, 'benefits', null],
    [/how to use|directions/i, 'steps', 'number'],
    [/tip/i, 'tips', 'bulb']
  ];

  function initInfoCards() {
    var block = document.querySelector('.product-single .accordion-block');
    if (!block || block.dataset.pdpCardsInit) return;
    block.dataset.pdpCardsInit = 'true';
    var icons = document.querySelector('[data-pdp-card-icons]');

    Array.prototype.forEach.call(block.children, function (item) {
      var heading = item.querySelector('.header h3');
      var content = item.querySelector('.content');
      if (!heading || !content) return;
      var title = heading.textContent.trim();
      var type = null;
      for (var t = 0; t < INFO_LISTS.length; t++) {
        if (INFO_LISTS[t][0].test(title)) { type = INFO_LISTS[t]; break; }
      }
      if (!type) return;
      var parts = infoEntries(content, type[1]);
      if (!parts) return;
      var entries = parts.rows;

      var list = document.createElement(type[1] === 'steps' ? 'ol' : 'ul');
      list.className = 'pdp-info-list pdp-info-list--' + type[1];
      entries.forEach(function (html, index) {
        var li = document.createElement('li');
        li.className = 'pdp-info-row';
        li.innerHTML = '<span class="pdp-info-row__icon" aria-hidden="true"></span><p class="pdp-info-row__text"></p>';
        var icon = type[2];
        if (icon === 'number') {
          li.firstChild.textContent = index + 1;
        } else {
          if (!icon) {
            var text = html.replace(/<[^>]+>/g, ' ');
            icon = 'check';
            for (var i = 0; i < BENEFIT_ICONS.length; i++) {
              if (BENEFIT_ICONS[i][0].test(text)) { icon = BENEFIT_ICONS[i][1]; break; }
            }
          }
          var source = icons && icons.content.querySelector('[data-icon="' + icon + '"] svg');
          if (source) li.firstChild.appendChild(source.cloneNode(true));
        }
        li.lastChild.innerHTML = html;
        list.appendChild(li);
      });
      content.innerHTML = '';
      if (parts.lead.length) {
        var lead = document.createElement('div');
        lead.className = 'pdp-info-lead';
        lead.innerHTML = parts.lead.map(function (html) { return '<p>' + html + '</p>'; }).join('');
        content.appendChild(lead);
      }
      content.appendChild(list);
    });
  }

  /* ---------- Long info content ----------
     Keeps each info tab / accordion panel a sensible height. Card lists (benefits, steps, tips)
     show the first few cards with "Show all N …"; long text (e.g. ingredients) is cut to a few
     lines with a fade and "Read more". Collapsing again scrolls back to the panel if needed. */
  // [word for the button, rows shown first on desktop]; phones show one fewer
  var CARD_LIMITS = { description: ['details', 5], benefits: ['benefits', 4], steps: ['steps', 4], tips: ['tips', 3] };
  var LONG_TEXT_CHARS = 450;

  function moreButton(label) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'pdp-info-more';
    button.setAttribute('aria-expanded', 'false');
    button.textContent = label;
    return button;
  }

  function backToPanel(item) {
    var top = item.getBoundingClientRect().top;
    if (top < 0) window.scrollTo({ top: window.pageYOffset + top - 120, behavior: 'smooth' });
  }

  function initInfoCollapse() {
    var block = document.querySelector('.product-single .accordion-block');
    if (!block || block.dataset.pdpCollapseInit) return;
    block.dataset.pdpCollapseInit = 'true';

    Array.prototype.forEach.call(block.children, function (item) {
      var content = item.querySelector('.content');
      if (!content) return;

      // Card lists: show the first few cards
      var list = content.querySelector('.pdp-info-list');
      if (list) {
        var rule = CARD_LIMITS[list.className.replace(/.*pdp-info-list--(\w+).*/, '$1')];
        var cards = Array.prototype.slice.call(list.children);
        if (!rule) return;
        // Phones: one fewer card before "Show all" (the text wraps more on a narrow screen)
        var limit = window.matchMedia('(max-width: 768px)').matches ? Math.max(rule[1] - 1, 2) : rule[1];
        if (cards.length <= limit + 1) return; // hiding a single card isn't worth a click
        var showAll = 'Show all ' + cards.length + ' ' + rule[0];
        var hideExtra = function (hide) {
          cards.forEach(function (card, index) { if (index >= limit) card.hidden = hide; });
        };
        hideExtra(true);
        var cardsButton = moreButton(showAll);
        cardsButton.addEventListener('click', function () {
          var expand = cardsButton.getAttribute('aria-expanded') !== 'true';
          hideExtra(!expand);
          cardsButton.setAttribute('aria-expanded', expand ? 'true' : 'false');
          cardsButton.textContent = expand ? 'Show less' : showAll;
          if (!expand) backToPanel(item);
        });
        content.appendChild(cardsButton);
        return;
      }

      // Long text: a few lines with a fade
      if (content.textContent.trim().length < LONG_TEXT_CHARS) return;
      var clamp = document.createElement('div');
      clamp.className = 'pdp-info-clamp';
      while (content.firstChild) clamp.appendChild(content.firstChild);
      content.appendChild(clamp);
      var textButton = moreButton('Read more');
      textButton.addEventListener('click', function () {
        var expand = !clamp.classList.contains('is-expanded');
        clamp.classList.toggle('is-expanded', expand);
        textButton.setAttribute('aria-expanded', expand ? 'true' : 'false');
        textButton.textContent = expand ? 'Read less' : 'Read more';
        if (!expand) backToPanel(item);
      });
      content.appendChild(textButton);
    });
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

  /* ---------- Reviews carousel ----------
     The Stamped review list is laid out as a sideways row of cards (CSS). Stamped redraws the
     list on filter / page change and appends on "Load more", so the ‹ › buttons and the dots
     under the row are (re)attached and recounted whenever it changes. One dot per scroll stop.
     With a mouse the row can also be dragged sideways. */
  function initReviewCarousel() {
    var widget = document.getElementById('stamped-main-widget');
    if (!widget || widget.dataset.pdpCarouselInit) return;
    widget.dataset.pdpCarouselInit = 'true';
    var scheduled = false;
    var current = null; // { list, nav, dots } for the list on screen now
    window.addEventListener('resize', function () { if (current) update(current); });

    function step(list) {
      var card = list.querySelector('.stamped-review');
      return card ? card.getBoundingClientRect().width + 16 : list.clientWidth;
    }

    function update(c) {
      var list = c.list;
      var max = list.scrollWidth - list.clientWidth;
      var scrollable = max > 2;
      c.nav.hidden = !scrollable; // the bar holds the arrows and the dots
      c.nav.querySelector('[data-dir="-1"]').disabled = list.scrollLeft <= 2;
      c.nav.querySelector('[data-dir="1"]').disabled = list.scrollLeft >= max - 2;
      if (!scrollable) return;

      var size = step(list);
      var pages = Math.ceil((max - 2) / size) + 1;
      if (c.dots.children.length !== pages) {
        c.dots.innerHTML = '';
        for (var i = 0; i < pages; i++) {
          var dot = document.createElement('button');
          dot.type = 'button';
          dot.className = 'pdp-review-dots__dot';
          dot.setAttribute('aria-label', 'Go to reviews ' + (i + 1) + ' of ' + pages);
          dot.dataset.index = i;
          c.dots.appendChild(dot);
        }
      }
      var active = list.scrollLeft >= max - 2 ? pages - 1 : Math.round(list.scrollLeft / size);
      Array.prototype.forEach.call(c.dots.children, function (dot, index) {
        var on = index === active;
        dot.classList.toggle('is-active', on);
        if (on) dot.setAttribute('aria-current', 'true'); else dot.removeAttribute('aria-current');
      });
    }

    // Mouse only: drag the row sideways (touch screens already swipe).
    function enableDrag(list) {
      var start = null;
      var moved = false;
      list.addEventListener('pointerdown', function (event) {
        if (event.pointerType !== 'mouse' || event.button !== 0 || event.target.closest('button, input, select, textarea')) return;
        start = { x: event.clientX, left: list.scrollLeft };
        moved = false;
      });
      window.addEventListener('pointermove', function (event) {
        if (!start) return;
        var dx = event.clientX - start.x;
        if (!moved && Math.abs(dx) < 5) return;
        if (!moved) { moved = true; list.classList.add('is-dragging'); }
        list.scrollLeft = start.left - dx;
      });
      window.addEventListener('pointerup', function () {
        if (!start) return;
        start = null;
        if (!moved) return;
        list.classList.remove('is-dragging');
        // Settle on the nearest card, as a swipe does.
        var size = step(list);
        list.scrollTo({ left: Math.round(list.scrollLeft / size) * size, behavior: 'smooth' });
      });
      // A drag must not also count as a click on a review photo or link.
      list.addEventListener('click', function (event) {
        if (moved) { event.preventDefault(); event.stopPropagation(); moved = false; }
      }, true);
      // Stop the browser's own image/link dragging from taking over.
      list.addEventListener('dragstart', function (event) { event.preventDefault(); });
    }

    function attach() {
      scheduled = false;
      var list = widget.querySelector('.stamped-reviews');
      if (!list) return;
      if (list.dataset.pdpCarousel) {
        // Same list, more cards ("Load more"): just recount.
        if (current && current.list === list) update(current);
        return;
      }
      list.dataset.pdpCarousel = 'true';
      // A redraw may have replaced the list: drop the previous controls first.
      Array.prototype.forEach.call(widget.querySelectorAll('.pdp-review-nav'), function (old) { old.remove(); });
      list.setAttribute('tabindex', '0');
      list.setAttribute('aria-label', 'Customer reviews');

      var nav = document.createElement('div');
      nav.className = 'pdp-review-nav';
      nav.innerHTML =
        '<button type="button" class="pdp-review-nav__btn" data-dir="-1" aria-label="Previous reviews"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
        '<button type="button" class="pdp-review-nav__btn" data-dir="1" aria-label="Next reviews"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>';
      // One bar under the cards: ‹ dots ›
      var dots = document.createElement('div');
      dots.className = 'pdp-review-dots';
      nav.insertBefore(dots, nav.lastElementChild);
      list.parentNode.insertBefore(nav, list.nextSibling);
      nav.addEventListener('click', function (event) {
        var button = event.target.closest('[data-dir]');
        if (button) list.scrollBy({ left: step(list) * Number(button.dataset.dir), behavior: 'smooth' });
      });
      dots.addEventListener('click', function (event) {
        var dot = event.target.closest('[data-index]');
        if (dot) list.scrollTo({ left: step(list) * Number(dot.dataset.index), behavior: 'smooth' });
      });

      current = { list: list, nav: nav, dots: dots };
      var ticking = false;
      list.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () { ticking = false; update(current); });
      }, { passive: true });
      enableDrag(list);
      update(current);
    }

    function schedule() {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(attach);
    }
    new MutationObserver(schedule).observe(widget, { childList: true, subtree: true });
    schedule();
  }

  /* ---------- Sticky bar rating ----------
     The sticky bar is rendered from Stamped's saved product data, which Stamped only refreshes
     now and then (e.g. it said 4.8 / 11 reviews while the live badge said 4.5 / 12). Once the
     live badge under the title loads, copy its rating and count into the sticky bar. */
  function initStickyRatingSync() {
    var link = document.querySelector('[data-pdp-sticky-reviews]');
    if (!link) return;
    function sync() {
      // Stamped swaps the badge element when it loads, so look it up each time.
      var caption = document.querySelector('.pdp-title-block .stamped-badge-caption[data-reviews]');
      if (!caption) return false;
      var count = parseInt(caption.getAttribute('data-reviews'), 10);
      var rating = parseFloat(caption.getAttribute('data-rating'));
      if (!count || isNaN(rating)) return true;
      var text = rating.toFixed(1);
      link.querySelector('.pdp-sticky-atc__stars').style.setProperty('--rating', rating);
      link.querySelector('.pdp-sticky-atc__rating-value').textContent = text;
      link.querySelector('.pdp-sticky-atc__count').textContent = count + (count === 1 ? ' review' : ' reviews');
      link.setAttribute('aria-label', 'Rated ' + text + ' out of 5 from ' + count + ' reviews. Go to reviews');
      return true;
    }
    // The badge can first show the saved numbers and update to the live ones a moment later,
    // so keep following it for a while instead of stopping at the first match.
    sync();
    var block = document.querySelector('.pdp-title-block') || document.body;
    var observer = new MutationObserver(sync);
    observer.observe(block, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-reviews', 'data-rating'] });
    setTimeout(function () { observer.disconnect(); }, 20000);
  }

  function init() {
    initGalleryOffset();
    initReviewClamp();
    initReviewCarousel();
    initInfoCards();
    initInfoCollapse();
    initInfoTabs();
    initStickyAtc();
    initStickyRatingSync();
    initWishlistButton();
    initFreeShippingLine();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
