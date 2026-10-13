function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}
function addCommas(nStr) {
  nStr += "";
  x = nStr.split(".");
  x1 = x[0];
  x2 = x.length > 1 ? "." + x[1] : "";
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, "$1" + "," + "$2");
  }
  return x1 + x2;
}

function moneyFilter(num) {
  var numMoney = num / 100;
  numMoney = numMoney.toFixed(2);
  numMoney = addCommas(numMoney);
  return "$" + numMoney;
}

function moneyFilterRaw(num) {
  var numMoney = num / 100;
  numMoney = numMoney.toFixed(2);
  return numMoney;
}

function getCartJson() {
  var crt = null;
  $.ajax({
    url: "/cart.js",
    dataType: "json",
    async: false,
    success: function (cartRes) {
      crt = cartRes;
    },
  });
  return crt;
}

function check(type) {
  return $("body").find(type).length;
}

function tabMenuContent() {
  $("div.tab-content .tab-content-item:first-child")
    .stop()
    .css("display", "block");
  $("div.tab-menu .tab-menu-item:first-child")
    .find("a")
    .stop()
    .addClass("active");
  $("div.tab-menu .tab-menu-item a").on("click", function (e) {
    e.preventDefault();
    $("div.tab-content .tab-content-item").stop().css("display", "none");
    $("div.tab-menu .tab-menu-item a").stop().removeClass("active");
    $(this).stop().addClass("active");
    var dataTab = $(this).attr("data-tab");
    $("#" + dataTab)
      .stop()
      .css("display", "block");
    miniCartFormHeightCalc();
  });
}

function wishlistMiniCartOpener() {
  $(".cart-opener").trigger("click");
  $("div.tab-content .tab-content-item").stop().css("display", "none");
  $("div.tab-menu .tab-menu-item a").stop().removeClass("active");
  $('.tab-menu .tab-menu-item a[data-tab="tabWishlist"]')
    .stop()
    .addClass("active");
  $("#tabWishlist").stop().css("display", "block");
}

function wishlistContainerHeightCalc() {
  // Wishlist Container Height -----------------------------------------------------
  var carMiniHeight = $("#cart-mini").innerHeight(),
    cartHeaderHeight = $(".cart-header").innerHeight();
  $("#tabWishlist form.cart").css(
    "height",
    carMiniHeight - cartHeaderHeight - 160
  );
}

function miniCartFormHeightCalc() {
  if ($(".eb-cart-upsell").length > 0) {
    var upsellplusAppHeight = $(".eb-cart-upsell").innerHeight();
  } else {
    var upsellplusAppHeight = 0;
  }
  var miniCartFooter = $("#cart-mini .mini-cart-footer").innerHeight(),
    headerActionsHeight = $(".header-actions").innerHeight(),
    miniCartHeader = $("#cart-mini .cart-header").innerHeight(),
    miniCartSecHeader = $("#cart-mini .mini-cart-header").innerHeight(),
    totalHeaderHeight = miniCartHeader + miniCartSecHeader,
    totalHeight =
      miniCartFooter +
      miniCartHeader +
      miniCartSecHeader +
      upsellplusAppHeight +
      3;
  jQuery(".mini-cart-form").css(
    "height",
    "calc(100vh - " + totalHeaderHeight + "px)"
  );
  jQuery("#cart-mini .cart-info").css(
    "height",
    "calc(100vh - " + totalHeight + "px)"
  );
}

function addHalterOverlay() {
  if ($("#halterOverlay").length < 1) {
    var halterHtml =
      '<div id="halterOverlay" class="body-overlay"><svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="40px" height="40px" viewBox="0 0 128 128" xml:space="preserve"><rect x="0" y="0" width="100%" height="100%" fill="#17324A" /><g><path d="M59.6 0h8v40h-8V0z" fill="#ffffff" fill-opacity="1"/><path d="M59.6 0h8v40h-8V0z" fill="#ffffff" fill-opacity="0.2" transform="rotate(30 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#ffffff" fill-opacity="0.2" transform="rotate(60 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#ffffff" fill-opacity="0.2" transform="rotate(90 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#ffffff" fill-opacity="0.2" transform="rotate(120 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#ffffff" fill-opacity="0.3" transform="rotate(150 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#ffffff" fill-opacity="0.4" transform="rotate(180 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#ffffff" fill-opacity="0.5" transform="rotate(210 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#ffffff" fill-opacity="0.6" transform="rotate(240 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#ffffff" fill-opacity="0.7" transform="rotate(270 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#ffffff" fill-opacity="0.8" transform="rotate(300 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#ffffff" fill-opacity="0.9" transform="rotate(330 64 64)"/><animateTransform attributeName="transform" type="rotate" values="0 64 64;30 64 64;60 64 64;90 64 64;120 64 64;150 64 64;180 64 64;210 64 64;240 64 64;270 64 64;300 64 64;330 64 64" calcMode="discrete" dur="1080ms" repeatCount="indefinite"></animateTransform></g></svg></div>';
    $("body").prepend(halterHtml);
  }
}

function removeHalterOverlay() {
  if ($("#halterOverlay").length > 0) {
    $("#halterOverlay").remove();
  }
}

function renderMiniCartUpsell() {
  var upsellEnable = false;
  var upsellIntent = "related";
  var upsellLimit = 3;
  var upsellProductId = null;
  if ($(".eb-cart-upsell").length > 0) {
    upsellEnable =
      $(".eb-cart-upsell").attr("data-upsell-enable") == "true" ? true : false;
    upsellIntent = $(".eb-cart-upsell").attr("data-upsell-intent")
      ? $(".eb-cart-upsell").attr("data-upsell-intent")
      : "related";
    upsellLimit = $(".eb-cart-upsell").attr("data-upsell-limit")
      ? parseInt($(".eb-cart-upsell").attr("data-upsell-limit"))
      : 3;
  }
  if (upsellEnable) {
    $.ajax({
      url: "/cart.js",
      dataType: "json",
      async: true,
      success: function (cartRes) {
        console.log('getCartJson', cartRes);
        if (cartRes.items.length > 0) {
          cartRes.items.forEach(function (item, itmIdx) {
            if (item.line_price > 0 && upsellProductId == null) {
              upsellProductId = item.product_id;
            }
          });
          if (upsellProductId != null) {
            $.ajax({
              url: "/recommendations/products.json",
              method: "GET",
              data: {
                product_id: upsellProductId,
                intent: upsellIntent,
                limit: 10,
              },
              dataType: "json",
              async: true,
              success: function (res) {
                console.log("UPSELL", res);
                if (res.products.length > 0) {
                  var upsellProdCount = 0;
                  var upsellHtml = "";
                  upsellHtml += '<div class="upsell-products">';
                  res.products.forEach(function (upsellProd, upIdx) {
                    var featuredImg = upsellProd.featured_image;
                    var title = upsellProd.title;
                    var upsellProdUrl = upsellProd.url;
                    var price = moneyFilter(upsellProd.price);
                    var variantId = null;
                    upsellProd.variants.forEach(function (varItm, varIdx) {
                      if (
                        variantId == null &&
                        varItm.available &&
                        varItm.price > 0
                      ) {
                        variantId = varItm.id;
                      }
                    });
                    if (variantId != null) {
                      upsellProdCount++;
                      if (upsellProdCount <= upsellLimit) {
                        upsellHtml += '<div class="upsell-products__item">';
                        upsellHtml += '    <div class="upsell-products__image">';
                        upsellHtml += '      <a href="' + upsellProdUrl + '">';
                        upsellHtml +=
                          '        <img draggable="false" src="' +
                          featuredImg +
                          '" loading="lazy" alt="">';
                        upsellHtml += "      </a>";
                        upsellHtml += "    </div>";
                        upsellHtml += '    <div class="upsell-products__info">';
                        upsellHtml += '      <p class="upsell-products__title">';
                        upsellHtml += '        <a href="' + upsellProdUrl + '">';
                        upsellHtml += "          <span>" + title + "</span>";
                        upsellHtml += "        </a>";
                        upsellHtml += "      </p>";
                        upsellHtml +=
                          '      <div class="upsell-products__actions">        ';
                        upsellHtml +=
                          '        <p style="margin:0;" class="prod-price">';
                        upsellHtml += "          <span>";
                        upsellHtml += "            <span>" + price + "</span>";
                        upsellHtml += "          </span>";
                        upsellHtml += "        </p>";
                        upsellHtml +=
                          '        <div class="upsell-products__add-to-cart">';
                        upsellHtml +=
                          '          <button class="btn" data-cart-addclaims="[{&quot;id&quot;:&quot;' +
                          variantId +
                          '&quot;,&quot;quantity&quot;:&quot;1&quot;}]"><span>Add To Cart</span></button>';
                        upsellHtml += "        </div>";
                        upsellHtml += "      </div>";
                        upsellHtml += "    </div>";
                        upsellHtml += "</div>";
                      }
                    }
                  });
                  upsellHtml += "</div>";
                  $(".eb-cart-upsell").html(upsellHtml);
                } else {
                  $(".eb-cart-upsell").html("");
                }
                $(".eb-cart-upsell").prepend(
                  "<h3 class='title'>You may also like</h3>"
                );
                $(".eb-cart-upsell .upsell-products").slick({
                  infinite: true,
                  slidesToShow: 1,
                  slidesToScroll: 1,
                });
                miniCartFormHeightCalc();
              },
            });
          } else {
            $(".eb-cart-upsell").html("");
          }
        } else {
          $(".eb-cart-upsell").html("");
        }
      },
    });
  } else {
    $(".eb-cart-upsell").html("");
  }
  return 1;
}

var btnPopupCheckoutClicked = false;
function bogos2CartPopupOfferCheck(showHalterOverlay = true) {
  if ($("#halterOverlay").length < 1 && showHalterOverlay) {
    addHalterOverlay();
  }
  var showPopup = false;
  showPopup = bogosCheckPopupCanShow();
  console.log("showPopup2", showPopup);
  if (showPopup) {
    //$('#btnPopupCheckout').removeAttr('style');
    $("#btnPopupCheckout").removeAttr("data-fg-checkout-btn");
    $("#btnPopupCheckout").val("Check Out");
    $("#btnClaimSamplesMain").show();
    $("#btnCheckout").hide();
    $("#btnPopupCheckout").show();
    miniCartFormHeightCalc();
  } else {
    $("#btnClaimSamplesMain").hide();
    $("#btnPopupCheckout").hide();
    $("#btnCheckout").show();
    miniCartFormHeightCalc();
    if (btnPopupCheckoutClicked === true) {
      window.location.href = "/checkout";
    }
  }
  setTimeout(function () {
    removeHalterOverlay();
  }, 1000);
}

function hideShowGwpPopup(show){
  var popup = document.getElementById('free_gwp-warning-popup');
  if(popup != null && popup != undefined){
    popup.style.display = 'none';
    $("body").removeClass("overlay-blur");
    console.log('GWP Popup hide');
    $('.gwp_product').hide();
    if($('.gwp_product').hasClass('slick-initialized')){
      $('.gwp_product').slick('unslick');
      console.log('GWP Popup unslick');
    }
    if(show && $("body").hasClass("cart-open")){
      var popupLoadDelay = parseInt(parseFloat(jQuery('.free_gwp-warning').attr('data-delay')) * 1000);
      console.log('sleep ms', popupLoadDelay);
      setTimeout(function(){
        $('.gwp_product').hide();
        if($('.gwp_product').hasClass('slick-initialized')){
          $('.gwp_product').hide();
          $('.gwp_product').slick('unslick');
          console.log('GWP Popup unslick');
        }
        $('.gwp_product').slick({
          infinite: true,
          slidesToShow: 1,
          slidesToScroll: 1
        });
        console.log('GWP Popup slick');
        $('.gwp_product').show();
        popup.style.display = 'flex';
        $("body").addClass("overlay-blur");
        console.log('GWP Popup show');
      }, popupLoadDelay);
    }
  }
}
function gwpPopupCloseBtnClickHandler(){
  hideShowGwpPopup(false);
}
function checkoutFromGwpButtonClickHandler(e){
  e.preventDefault();
  hideShowGwpPopup(false);
  if(bogosCheckPopupCanShow() === true){
    jQuery('#btnPopupCheckout').trigger('click');
  }else{
    jQuery('#btnCheckout').trigger('click');
  }
}
function closeGwpPopupOnClickingOut(){
  hideShowGwpPopup(false);
}
var gwpWarningPopupForCartPrev = null;
function calcGwpThresholdWarning(){
    console.log("CALC GWP RUN");
    $.ajax({
      url: "/cart.js",
      dataType: "json",
      async: true,
      success: function (cartObj) {
        var gwpWarningPopupForCartNow = null;
        var gwpWarningPopupForCartArr = [];
        cartObj.items.forEach(item => {
          if(item.final_line_price > 0){
            gwpWarningPopupForCartArr.push('variant:' + item.variant_id + ',qty:' + item.quantity + ',price:' + item.final_line_price);
          }
        });
        gwpWarningPopupForCartNow = gwpWarningPopupForCartArr.join('|');
        console.log('gwpWarningPopupForCartPrev', gwpWarningPopupForCartPrev);
        console.log('gwpWarningPopupForCartNow', gwpWarningPopupForCartNow);
        console.log('gwpWarningPopupForCartNow != gwpWarningPopupForCartPrev', (gwpWarningPopupForCartNow != gwpWarningPopupForCartPrev));
        if(gwpWarningPopupForCartNow != gwpWarningPopupForCartPrev){
          console.log('RELOAD GWP POPUP');
          var gwpOffer = null;
          var currentDateTime = new Date();
          fgData.offers.forEach(offer => {
              var offerName = offer.offer_name.toLowerCase();
              var fromDateTime = new Date(offer.start_time);
              var toDateTime = new Date(offer.end_time);
              if(offerName.indexOf('gwp') != -1){
                  if(fromDateTime <= currentDateTime && currentDateTime < toDateTime){
                      gwpOffer = offer;
                      return 1;
                  }
              }
          });
          console.log('gwpOffer', gwpOffer);
          console.log('cartObj.items', cartObj.items);
          if(gwpOffer !== null){
              var gwpOfferCondReln = gwpOffer.condition_relationship;
              var gwpOfferMinAmt = 0;
              var gwpOfferMaxAmt = 9999999999;
              var gwpOfferMinQty = 0;
              var gwpOfferMaxQty = 9999999999;
              var gwpOfferUnit = [];
              var gwpOfferProductTypesInc = [];
              var gwpOfferProductTypesEx = [];
              gwpOffer.offer_conditions.forEach(cond => {
                  cond.product_narrow.forEach(nar => {
                      if(nar.type == 'product_types' && nar.filter_option == 'include'){
                          gwpOfferProductTypesInc = gwpOfferProductTypesInc.concat(Object.values(nar.value));
                      }else if(nar.type == 'product_types' && nar.filter_option == 'exclude'){
                          gwpOfferProductTypesEx = gwpOfferProductTypesEx.concat(Object.values(nar.value));
                      }
                  });
                  gwpOfferUnit.push(cond.unit);
                  if(cond.unit == 'money'){
                      gwpOfferMinAmt = (gwpOffer.offer_conditions[0].min_amount == null ? parseFloat(0) : parseFloat(gwpOffer.offer_conditions[0].min_amount));
                      gwpOfferMaxAmt = (gwpOffer.offer_conditions[0].max_amount == null ? parseFloat(9999999999) : parseFloat(gwpOffer.offer_conditions[0].max_amount));
                  }
                  if(cond.unit == 'number_of_products'){
                      gwpOfferMinQty = (gwpOffer.offer_conditions[0].min_amount == null ? parseInt(0) : parseInt(gwpOffer.offer_conditions[0].min_amount));
                      gwpOfferMaxQty = (gwpOffer.offer_conditions[0].max_amount == null ? parseInt(9999999999) : parseInt(gwpOffer.offer_conditions[0].max_amount));
                  }
              });
              var cartAmount = 0;
              var cartQty = 0;
              var itemType = null;
              cartObj.items.forEach(item => {
                  //console.log(getProductJson(item.handle));
                  if(gwpOfferProductTypesInc.length > 0){
                      if(gwpOfferProductTypesInc.includes(item.product_type)){
                          itemType = item.product_type;
                          cartQty += item.quantity;
                          cartAmount += item.line_price;
                      }
                  }else if(gwpOfferProductTypesEx.length > 0){
                      if(!gwpOfferProductTypesEx.includes(item.product_type)){
                          itemType = item.product_type;
                          cartQty += item.quantity;
                          cartAmount += item.line_price;
                      }
                  }
              });
              cartAmount = parseFloat(moneyFilterRaw(cartAmount));
          
              var gwpOfferElligible = -1;
              if(itemType != null){
                  if(gwpOfferCondReln == 'or'){
                      if(cartQty >= gwpOfferMinQty || cartAmount >= gwpOfferMinAmt){
                          gwpOfferElligible = 1;
                      }else{
                          gwpOfferElligible = 0
                      }
                  }else{
                      if(cartQty >= gwpOfferMinQty && cartAmount >= gwpOfferMinAmt){
                          gwpOfferElligible = 1;
                      }else{
                          gwpOfferElligible = 0
                      }
                  }
              }
          
              console.log('gwpOfferCondReln', gwpOfferCondReln);
              console.log('gwpOfferMinAmt', gwpOfferMinAmt);
              console.log('gwpOfferMaxAmt', gwpOfferMaxAmt);
              console.log('gwpOfferMinQty', gwpOfferMinQty);
              console.log('gwpOfferMaxQty', gwpOfferMaxQty);
              console.log('gwpOfferUnit', gwpOfferUnit);
              console.log('gwpOfferProductTypesInc', gwpOfferProductTypesInc);
              console.log('gwpOfferProductTypesEx', gwpOfferProductTypesEx);
              console.log('cartAmount', cartAmount);
              console.log('cartQty', cartQty);
              console.log('itemType', itemType);
              console.log('gwpOfferElligible', gwpOfferElligible);
          
              if(gwpOfferElligible == 0){
                  var popupLoadDelay = parseInt(parseFloat(jQuery('.free_gwp-warning').attr('data-delay')) * 1000);
                  var warningMsg = "";
                  var warningMsgQtyCase = jQuery('.free_gwp-warning').attr('data-free_gwp_message');
                  var warningMsgAmtCase = jQuery('.free_gwp-warning').attr('data-free_gwp_message_amount_case');
                  var thresholdValue = 999999999;
                  var cartTotalValue = 0;
                  if(gwpOfferUnit.includes('money')){
                      thresholdValue = gwpOfferMinAmt;
                      cartTotalValue = cartAmount;
                      warningMsg = warningMsgAmtCase;
                  }else{
                      thresholdValue = gwpOfferMinQty;
                      cartTotalValue = cartQty;
                      warningMsg = warningMsgQtyCase;
                  }
                  var	cartValueNeeded = thresholdValue - cartTotalValue;
                  var indicatorPercentage = parseInt((cartTotalValue * 100) / thresholdValue);
                  if(gwpOfferUnit.includes('money')){
                      cartValueNeeded = moneyFilter(cartValueNeeded * 100);
                      cartValueNeeded = cartValueNeeded;
                  }else{
                      //cartValueNeeded = cartValueNeeded + ' ' + itemType;
                  }
                  warningMsg = warningMsg.replaceAll('NNN', cartValueNeeded);
                  warningMsg = warningMsg.replaceAll('XXX', itemType);
                  jQuery('.free_gwp-warning').html(warningMsg);
                  jQuery('.free_gwp-warning').css("display", "block");
                  jQuery(".free_gwp_threshold--indicator").css("display", "block");
                  jQuery("div.free_gwp_threshold--indicator div.indicator-track .indicator-level").css('width', indicatorPercentage + '%');
                  var giftsHtml = '';
                  gwpOffer.gift_products.forEach(prodItm => {
                    var prodTitle = prodItm.title.replaceAll(' (100% off)', '');
                    var prodImg = prodItm.thumbnail;
                    giftsHtml += '<div class="item">';
                    giftsHtml += '  <div class="flex-container">';
                    giftsHtml += '    <img src="' + prodImg + '" loading="lazy" alt="">';
                    giftsHtml += '    <h4>' + prodTitle + '</h4>';
                    giftsHtml += '  </div>';
                    giftsHtml += '</div>';
                  });
                  jQuery('.gwp_product').html(giftsHtml);
          
                  hideShowGwpPopup(true);
              }else{
                  jQuery('.free_gwp-warning').css("display", "none");
                  jQuery('.free_gwp-warning').html('');
                  jQuery(".free_gwp_threshold--indicator").css("display", "none");
                
                  hideShowGwpPopup(false);
              }
      
              var checkoutFromGwpButton = document.getElementById('checkoutFromGwp');
              if(checkoutFromGwpButton != null && checkoutFromGwpButton != undefined){
                checkoutFromGwpButton.removeEventListener('click', checkoutFromGwpButtonClickHandler);
                checkoutFromGwpButton.addEventListener('click', checkoutFromGwpButtonClickHandler);
              }
            
              var closePopupButton = document.getElementById('closePopup');
              if(closePopupButton != null && closePopupButton != undefined){
                closePopupButton.removeEventListener('click', gwpPopupCloseBtnClickHandler);
                closePopupButton.addEventListener('click', gwpPopupCloseBtnClickHandler);
              }
      
              var gwpPopupOverlay = document.querySelector(".gpw_popup-overlay");
              if(gwpPopupOverlay != null && gwpPopupOverlay != undefined){
                gwpPopupOverlay.removeEventListener('click', closeGwpPopupOnClickingOut);
                gwpPopupOverlay.addEventListener('click', closeGwpPopupOnClickingOut);
              }
          } 
          gwpWarningPopupForCartPrev = gwpWarningPopupForCartNow;
        }
      }
    });
}

$(document).ready(function () {
  jQuery(".cart-opener").addClass("show");
  $("#cart-mini .checkout-view .button").on("click", function () {
    $(this)
      .attr("value", "please wait")
      .css("background-color", "#a5a5a8")
      .css("border-color", "#a5a5a8");
  });
  CartJS.init(RESOURCES.cartJSON, {
    requestBodyClass: "loading",
  });
  var compareAtCache = {};

  function fetchVariantCompareAtMap(handle) {
    if (compareAtCache[handle]) {
      return Promise.resolve(compareAtCache[handle]);
    }
    return fetch('/products/' + handle + '.js')
      .then(function(res) { return res.json(); })
      .then(function(product) {
        var map = {};
        product.variants.forEach(function(v) {
          map[v.id] = v.compare_at_price;
        });
        compareAtCache[handle] = map;
        return map;
      });
  }

  function enrichCartWithCompareAtPrices() {
    var items = CartJS.cart.items;
    var uniqueHandles = [];
    items.forEach(function(item) {
      if (uniqueHandles.indexOf(item.handle) === -1) uniqueHandles.push(item.handle);
    });

    return Promise.all(uniqueHandles.map(fetchVariantCompareAtMap)).then(function() {
      items.forEach(function(item) {
        var map = compareAtCache[item.handle] || {};
        var compareAt = map[item.variant_id];
        if (compareAt && compareAt > item.price) {
          item.compare_at_price = compareAt;
          item.compare_at_line_price = compareAt * item.quantity;
        } else {
          item.compare_at_price = null;
          item.compare_at_line_price = null;
        }
      });
    });
  }
  // Run once immediately for the initial page load
  enrichCartWithCompareAtPrices().then(function() {
    if (window.CartJS && CartJS.Rivets) {
      CartJS.Rivets.bindViews(); // re-bind so rivets picks up compare_at_price on first load
    }
  });

  // Re-run on every subsequent cart update
  jQuery(document).on('cart.requestComplete', function() {
    enrichCartWithCompareAtPrices();
  });

    // Re-run every time the cart loads or updates
    jQuery(document).on('cart.ready cart.requestComplete', function() {
      enrichCartWithCompareAtPrices();
  });

  tabMenuContent();

  $(".tab-menu-item a[data-tab='tabWishlist']").on("click", function () {
    wishlistContainerHeightCalc();
  });

  function initCartEventHandlers() {
    $(document).on("cart.requestStarted", function (event, cart) {
      var magnificPopupBtn = check(".quick-view-popup");
      if (magnificPopupBtn > 0) {
        $.magnificPopup.close();
      }

      // Active Mincart Cart Tab ----------------------------------------------------------
      $("div.tab-content .tab-content-item").stop().css("display", "none");
      $("div.tab-menu .tab-menu-item a").stop().removeClass("active");
      $('.tab-menu .tab-menu-item a[data-tab="tabCart"]')
        .stop()
        .addClass("active");
      $("#tabCart").stop().css("display", "block");
      //-----------------------------------------------------------------------------------
      $(".inline-loader").css("display", "block");
      $("body").addClass("sticky-nav-min");
      $("body").addClass("cart-open");
      $(".cart-action-wrapper").addClass("active");
      $("html").addClass("safari-scroll-disable");
      var headerActionsHeight = $("div.header-actions").innerHeight();
      //$("#cart-mini").css('top', headerActionsHeight);
    });
    $(document).on("cart.requestComplete", function (event, cart) {
      updateMiniCartCount(cart.item_count);

      var totalCartPriceRaw = parseFloat(cart.total_price);
      var giftCardPrice = 0.0;
      var hasOnlyGiftCard = true;
      $.each(cart.items, function (cIKey, line_item) {
        console.log(line_item);
        if (line_item.gift_card) {
          giftCardPrice = giftCardPrice + line_item.final_line_price;
        } else if (
          line_item.product_title == "E-Gift Card" &&
          line_item.product_type == "Gift Cards"
        ) {
          giftCardPrice = giftCardPrice + line_item.final_line_price;
        } else {
          hasOnlyGiftCard = false;
        }
      });
      var totalCartPrice = totalCartPriceRaw - giftCardPrice;

      var free_shipping_threshold_warning_enabled =
        RESOURCES.free_shipping_threshold_warning_enabled;
      if (free_shipping_threshold_warning_enabled === true) {
        var threshold_one_ammount = RESOURCES.threshold_one_ammount;
        var threshold_one_message = RESOURCES.threshold_one_message;
        var threshold_two_ammount = RESOURCES.threshold_two_ammount;
        var threshold_two_message = RESOURCES.threshold_two_message;
        var threshold_three_ammount = RESOURCES.threshold_three_ammount;
        var threshold_three_message = RESOURCES.threshold_three_message;
        var free_shipping = RESOURCES.free_shipping;
        var free_express_shipping = RESOURCES.free_express_shipping;
        var threshold_3_output_msg = RESOURCES.threshold_3_output_msg;
        var money_format = RESOURCES.money_format;
        var decimal = 100;

        if (!hasOnlyGiftCard && totalCartPrice < threshold_one_ammount) {
          console.log("threshold one Condition");
          var threshold_one_ammount_needed =
            (threshold_one_ammount - totalCartPrice) / decimal;
          var free_val_needed = money_format.replace(
            "{{amount}}",
            threshold_one_ammount_needed
          );
          var threshold_one_message = threshold_one_message.replace(
            "XXX",
            free_val_needed
          );

          var indicatorPercentage =
            (totalCartPrice * 100) / threshold_one_ammount;
          if (threshold_one_ammount >= totalCartPrice) {
            jQuery(".shipping__threshold--indicator").css("display", "block");
            miniCartFormHeightCalc();
            jQuery(
              "div.shipping__threshold--indicator div.indicator-track .indicator-level"
            ).css("width", indicatorPercentage + "%");
          }
          $(".free-shipping-message").removeClass("show");
          $(".shipping-warning").html(threshold_one_message);
        } else if (
          hasOnlyGiftCard ||
          (totalCartPrice >= threshold_one_ammount &&
            threshold_two_ammount == 0)
        ) {
          //alert(hasOnlyGiftCard);
          console.log("free_shipping Condition");
          $(".free-shipping-message").removeClass("show");
          setTimeout(function () {
            $(".free-shipping-message").html(free_shipping).addClass("show");
          }, 300);

          $(".shipping-warning").html(free_shipping);
          jQuery(".shipping__threshold--indicator").css("display", "none");
          miniCartFormHeightCalc();
        } else if (
          !hasOnlyGiftCard &&
          totalCartPrice >= threshold_one_ammount &&
          totalCartPrice <= threshold_two_ammount
        ) {
          console.log("threshold two Condition");
          $(".free-shipping-message").removeClass("show");
          var threshold_two_ammount_needed =
            (threshold_two_ammount - totalCartPrice) / decimal;
          var exprs_val_needed = money_format.replace(
            "{{amount}}",
            threshold_two_ammount_needed
          );
          var threshold_two_message = threshold_two_message.replace(
            "XXX",
            exprs_val_needed
          );

          var indicatorPercentage =
            (totalCartPrice * 100) / threshold_two_ammount;
          if (threshold_two_ammount >= totalCartPrice) {
            jQuery(".shipping__threshold--indicator").css("display", "block");
            miniCartFormHeightCalc();
            jQuery(
              "div.shipping__threshold--indicator div.indicator-track .indicator-level"
            ).css("width", indicatorPercentage + "%");
          }
          if ($(".free-shipping-message").length > 0) {
            setTimeout(function () {
              $(".free-shipping-message").addClass("show");
            }, 300);
            $(".free-shipping-message").html(free_shipping);
          } else {
            $("#cart-mini .mini-cart-header").prepend(
              "<div class='free-shipping-message text-center'>" +
                free_shipping +
                "</div>"
            );
            setTimeout(function () {
              $(".free-shipping-message").addClass("show");
            }, 300);
          }

          $(".shipping-warning").html(threshold_two_message);
        } else if (
          hasOnlyGiftCard ||
          (totalCartPrice >= threshold_two_ammount &&
            threshold_three_ammount == 0)
        ) {
          console.log("free_express_shipping Condition");
          //$(".free-shipping-message").html(free_shipping);
          $(".shipping-warning").html(free_express_shipping);
          jQuery(".shipping__threshold--indicator").css("display", "none");
          miniCartFormHeightCalc();
          $(".free-shipping-message").removeClass("show");
          var threshold_two_message = $(".shipping-warning").text();
          var incStr = free_express_shipping.toLowerCase();
          var incStr1 = incStr.includes("free express shipping");
          if (incStr1) {
            setTimeout(function () {
              //$('#cart-mini .free-shipping-message').text('Enjoy Your Free Express Shipping');
              //$(".free-shipping-message").addClass('show');
            }, 300);
          } else {
            setTimeout(function () {
              $(".free-shipping-message").html(free_shipping);
              $(".free-shipping-message").addClass("show");
            }, 300);
          }
        } else if (
          !hasOnlyGiftCard &&
          totalCartPrice >= threshold_two_ammount &&
          totalCartPrice <= threshold_three_ammount
        ) {
          console.log("threshold three Condition");
          $(".free-shipping-message").removeClass("show");
          var threshold_three_ammount_needed =
            (threshold_three_ammount - totalCartPrice) / decimal;
          var exprs_val_needed = money_format.replace(
            "{{amount}}",
            threshold_three_ammount_needed
          );
          var threshold_three_message = threshold_three_message.replace(
            "XXX",
            exprs_val_needed
          );
          var incStr = free_express_shipping.toLowerCase();
          var incStr1 = incStr.includes("free express shipping");
          if (incStr1) {
            setTimeout(function () {
              $("#cart-mini .free-shipping-message").html(
                "Enjoy Your Free Express Shipping"
              );
              $(".free-shipping-message").addClass("show");
            }, 300);
          } else {
            setTimeout(function () {
              $(".free-shipping-message").html(free_shipping);
              $(".free-shipping-message").addClass("show");
            }, 300);
          }

          var indicatorPercentage =
            (totalCartPrice * 100) / threshold_three_ammount;
          if (threshold_three_ammount >= totalCartPrice) {
            jQuery(".shipping__threshold--indicator").css("display", "block");
            miniCartFormHeightCalc();
            jQuery(
              "div.shipping__threshold--indicator div.indicator-track .indicator-level"
            ).css("width", indicatorPercentage + "%");
          }
          $(".shipping-warning").html(threshold_three_message);
        } else if (
          !hasOnlyGiftCard ||
          totalCartPrice >= threshold_three_ammount
        ) {
          console.log("free_express_shipping Condition");
          var incStr = free_express_shipping.toLowerCase();
          var incStr1 = incStr.includes("free express shipping");
          if (incStr1) {
            $("#cart-mini .free-shipping-message").text(
              "Enjoy Your Free Express Shipping"
            );
            $(".free-shipping-message").addClass("show");
          } else {
            $(".free-shipping-message").removeClass("show");
            setTimeout(function () {
              $(".free-shipping-message").html(free_shipping);
              $(".free-shipping-message").addClass("show");
            }, 300);
          }
          $(".shipping-warning").html(threshold_3_output_msg);
          jQuery(".shipping__threshold--indicator").css("display", "none");
          miniCartFormHeightCalc();
        }
      }
      setTimeout(function () {
        $(".inline-loader").css("display", "none");
      }, 200);
      var cartMiniInfoHeight = $("#cart-mini .cart-info").innerHeight();
      // $("#cart-mini .cart-info").animate({
      //     scrollTop: cartMiniInfoHeight
      // }, 500);
      var freeExpressItem = $(
        "#cart-mini .cart-line-item .free-express-shipping"
      ).is(":visible");
      // if (freeExpressItem == true) {
      //   $("#cart-mini .shipping-warning").html(
      //     "<strong>Enjoy Free Express Shipping on us</strong>"
      //   );
      // }
    });

    $("body").on("click touchstart", function (evt) {
      if (evt.target.id == "cart-mini") return;
      if ($(evt.target).closest("#cart-mini").length) return;
      if(evt.target.className == 'gpw_popup-overlay') return
      if ($(evt.target).closest(".gpw_popup-overlay").length) return;
      if (evt.target.id == "free_gwp-warning-popup") return;
      if ($(evt.target).closest("#free_gwp-warning-popup").length) return;
      $("body").removeClass("cart-open");
      $(".cart-action-wrapper").removeClass("active");
      $("html").removeClass("safari-scroll-disable");
      headerTopBarMinView();
    });

    //open cart
    $(document).on("click", ".cart-opener", function (e) {
      $("body").addClass("cart-open");
      $(document).trigger("cartopen");
      var cartMiniInfoHeight = $("#cart-mini .cart-info").innerHeight();
      $("#cart-mini .cart-info").scrollTop(cartMiniInfoHeight);
      e.preventDefault();
      console.log(".cart-opener");
      $("body").addClass("sticky-nav-min");
      $(this).parents(".header-action").addClass("active");
      var headerActionsHeight = $(".header-actions").innerHeight();
      //$("#cart-mini").css("top", headerActionsHeight);
    });

    // close cart
    $(document).on("click", ".close-cart", function (e) {
      e.preventDefault();
      $("body").removeClass("cart-open");
      $(".cart-action-wrapper").removeClass("active");
      $("html").removeClass("safari-scroll-disable");
      headerTopBarMinView();
    });
  }

  function updateMiniCartCount(count) {
    // add text before replacing element
    if (count == 1) {
      //count += " item";
    } else {
      //count += " items";
    }
    $("#mini-cart-count").text(count).attr("data-count", count);
  }

  initCartEventHandlers();
  setTimeout(function () {
    miniCartFormHeightCalc();
  }, 500);

  //BOGOS 2.0
  $("#btnPopupCheckout").on("click", function (e) {
    e.preventDefault();
    btnPopupCheckoutClicked = true;
    ShowBOGOSpopup();
    $("#btnPopupCheckout").removeAttr("style");
    $("#btnPopupCheckout").removeAttr("data-fg-checkout-btn");
    $("#btnPopupCheckout").val("Check Out");
  });
  $("#btnClaimSamplesMain").on("click", function (e) {
    e.preventDefault();
    ShowBOGOSpopup();
  });
  $("#freegifts-main-popup-container").on("click", function (e) {
    var closeBtnObj = $("#freegifts-main-popup-container .sca-close-modal-fg");
    var closeBtn = closeBtnObj.get(0);
    console.log("SHOULD BE ", this);
    console.log("OR SHOULD BE ", closeBtn);
    console.log("CLICKED ON ", e.target);
    if (e.target !== this && e.target !== closeBtn) {
      return;
    }
    document
      .querySelector("#freegifts-main-popup-container")
      ?.setAttribute("style", "display: none !important;");
  });
  $(document).keyup(function (e) {
    if (e.key === "Escape") {
      // escape key maps to keycode `27`
      document
        .querySelector("#freegifts-main-popup-container")
        ?.setAttribute("style", "display: none !important;");
    }
  });
  $(document).on("cartopen", function () {
    renderMiniCartUpsell();
    calcGwpThresholdWarning();
    //await bogos2CartPopupOfferCheck(true);
    bogos2CartPopupOfferCheck(true);
  });
  $(document).on("cart.requestStarted", function () {
    console.log("CART OP STARTED");
    addHalterOverlay();
  });
  $(document).on("cart.requestComplete", function () {
    console.log("CART OP COMPLETED");
    //renderMiniCartUpsell();
  });
  $(document).on("fg-cart:end-process", function () {
    console.log("CART ITEMS", FGSECOMAPP.cartItems);
    renderMiniCartUpsell();
    bogos2CartPopupOfferCheck(false);
    calcGwpThresholdWarning();
  });
});
$(document).ajaxComplete(function (event, xhr, settings) {
  if ((settings.url = "/cart/add.js")) {
    $("#cart-mini .errMsg").remove();
  }
});
$(document).ajaxError(function (event, jqXHR, settings, thrownError) {
  if ((settings.url = "/cart/add.js")) {
    var errMSG = JSON.parse(jqXHR.responseText);
    console.log("errMSG", errMSG);
    setTimeout(function () {
      $("#cart-mini  .errMsg").remove();
      $("#cart-mini .cart-info").prepend(
        '<div class="errMsg">' + errMSG.description + "</div>"
      );
      $("#cart-mini .noItem").prepend(
        '<div class="errMsg">' + errMSG.description + "</div>"
      );
      if (
        errMSG.status == "bad_request" &&
        errMSG.message == "no valid id or line parameter"
      ) {
        location.reload();
      }
    }, 450);
  }
});
