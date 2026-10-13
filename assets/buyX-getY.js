var checkoutAfterSampleSelectionPopup = false;
// Mini Cart Padding Bottom -----------------------------------------
var miniCartFooter = $("#cart-mini .mini-cart-footer").innerHeight();
jQuery(".mini-cart-form").css("padding-bottom", miniCartFooter);

function setCookie(name, value, hours) {
  var expires = "";
  if (hours) {
    var date = new Date();
    date.setTime(date.getTime() + hours * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function deleteCookie(name) {
  document.cookie = name + "=; Max-Age=-99999999;";
}

function getUrlVars() {
  var vars = [],
    hash;
  var hashes = window.location.href
    .slice(window.location.href.indexOf("?") + 1)
    .split("&");
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split("=");
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
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

function sortByPriorityAsc(a, b) {
  var aPriority = a.priority;
  var bPriority = b.priority;
  return aPriority < bPriority ? -1 : aPriority > bPriority ? 1 : 0;
}

function sortByPriorityDesc(a, b) {
  var aPriority = a.priority;
  var bPriority = b.priority;
  return aPriority > bPriority ? -1 : aPriority < bPriority ? 1 : 0;
}

jQuery(document).ready(function ($) {
  var urlQueryParams = getUrlVars();
  var fgUrlPromoCode = "";
  var fgUrlPromoCodeApplied = false;
  if (
    urlQueryParams["freegifts_code"] != undefined &&
    urlQueryParams["freegifts_code"] != null &&
    urlQueryParams["freegifts_code"].trim().length > 0
  ) {
    fgUrlPromoCode = urlQueryParams["freegifts_code"];
    setCookie("freegifts_code", fgUrlPromoCode, 12);
    fgUrlPromoCodeApplied = true;
  } else if (
    getCookie("freegifts_code") != null &&
    getCookie("freegifts_code").trim().length > 0
  ) {
    fgUrlPromoCode = getCookie("freegifts_code").trim();
    fgUrlPromoCodeApplied = true;
  } else {
    fgUrlPromoCode = "";
    fgUrlPromoCodeApplied = false;
  }

  checkoutAfterSampleSelectionPopup = false;
  var chooseXText = $("#claimSamplesPopup").attr("data-choose-x-text");
  var limitReachedText = $("#claimSamplesPopup").attr(
    "data-limit-reached-text"
  );
  var nextBtnText = $("#claimSamplesPopup").attr("data-next-btn-text");
  var doneBtnText = $("#claimSamplesPopup").attr("data-done-btn-text");
  var doneNextBtnDisabledText = $("#claimSamplesPopup").attr(
    "data-done-btn-disabled-text"
  );
  var minRequiredSamples = parseInt(
    $("#claimSamplesPopup").attr("data-min-required-samples")
  );

  var giftsToBeAddedCollectively = [];
  var giftsToBeAddedCollectivelyStr = "";

  var buyXgetYEnabled = parseInt($("#buyXgetYEnabled").text());

  if (buyXgetYEnabled == 1) {
    showClaimButton();
  }

  miniCartFormHeightCalc();
  jQuery(".cart-opener").addClass("show");
  var eligibleProds = JSON.parse($("#eligibleProdsJson").text());
  var freeProds = JSON.parse($("#freeproductsJson").text());
  eligibleProds = eligibleProds.split(",");
  freeProds = freeProds.split(" , ");
  var freeProdHandles = [];
  $.each(freeProds, function (k, v) {
    if (v.length > 0) {
      freeProdHandles.push(v);
    }
  });

  if (buyXgetYEnabled == 1) {
    var allFreeProductVariantIds = JSON.parse(
      $("#allFreeProductVariantIdsJson").text()
    );
    allFreeProductVariantIds = allFreeProductVariantIds.split(",");
  }
  $(document).on("cartopen", function () {
    showFreeGiftClaimButton();
    if (buyXgetYEnabled == 1) {
      showClaimButton();
    }
  });

  $(document).on("cart.requestStarted", function () {
    addHalterOverlay();
  });
  $(document).on("cart.requestComplete", function () {
    showFreeGiftClaimButton();
    if (buyXgetYEnabled == 1) {
      showClaimButton();
    }
    if (!$(".header-action-right .cart-action-wrapper").hasClass("active")) {
      $(".cart-opener").trigger("click");
    }
    if (checkoutAfterSampleSelectionPopup) {
      setTimeout(function () {
        $("#btnClaimSamplesMain").hide();
        $("#btnClaimSamples").hide();
        $("#btnCheckout").hide();
        $("#btnPopupCheckout").hide();
      }, 10);
      //$('#btnCheckout').trigger('click');
      window.location.href = "/checkout";
    } else {
      removeHalterOverlay();
    }
    checkoutAfterSampleSelectionPopup = false;
    miniCartFormHeightCalc();
  });

  /*$('#btnCheckout').on('click', function(){
    addHalterOverlay();
  });*/

  $("#btnPopupCheckout").on("click", function (e) {
    e.preventDefault();
    checkoutAfterSampleSelectionPopup = true;
    setTimeout(function () {
      $("#btnClaimSamplesMain").hide();
      $("#btnClaimSamples").hide();
      $("#btnCheckout").hide();
      $("#btnPopupCheckout").hide();
      //$('#btnPopupCheckout').text('please wait');
      //$('#btnCheckout').prop('disabled', true);
      $("#btnPopupCheckout").prop("disabled", true);
    }, 10);
    $("#btnClaimSamplesMain").trigger("click");
  });

  $(document).on("click", "button", function () {
    if ($(this).text().trim() == "Add to Cart") {
      //console.log("Add to Cart Clicked");
    }
  });
  // Claim Free Samples Popup Initialize ------------------------------
  $("a#btnClaimSamplesMain").magnificPopup({
    type: "inline",
    midClick: true,
    closeOnBgClick: false,
    enableEscapeKey: false,
    showCloseBtn: false,
    mainClass: "mfp-fade",
    fixedContentPos: true,
    callbacks: {
      beforeOpen: function () {
        setTimeout(function () {
          $("#claimSamplesPopup .popup-content-wrap").trigger("click");
        }, 100);
      },
      open: function () {
        var magnificPopup = $.magnificPopup.instance,
          clickedDOM = magnificPopup.st.el;
        $("#btnClaimSamplesMain").hide();
        setTimeout(function () {
          $(document).trigger("loadSampleSelectorContent");
        }, 100);
      },
      close: function () {
        if (
          $("#btnRemovePreSelectedGifts").attr("data-cart-removeclaims")
            .length > 0
        ) {
          $("#btnRemovePreSelectedGifts").trigger("click");
        }
        giftsToBeAddedCollectivelyStr = JSON.stringify(
          giftsToBeAddedCollectively
        );
        $("#btnClaimSelectedSamples").attr(
          "data-cart-addclaims",
          giftsToBeAddedCollectivelyStr
        );
        //if( giftsToBeAddedCollectively.length > 0 ){
        $("#btnClaimSelectedSamples").trigger("click");
        //}
        $(".sample-group .slider").slick("unslick");
        $("#claimSamplesPopup .sample-selectors").html(
          "<div class='sample-loader'><img style='max-width:150px; position: absolute; left:50%; top:50%; transform:translate(-50%, -50%);' src='https://cdn.shopify.com/s/files/1/0119/6028/7313/t/19/assets/loader.gif'></div>"
        );
        $("#btnRemovePreSelectedGifts").attr("data-cart-removeclaims", "");

        giftsToBeAddedCollectively = [];
        giftsToBeAddedCollectivelyStr = JSON.stringify(
          giftsToBeAddedCollectively
        );
        $("#btnClaimSelectedSamples").attr(
          "data-cart-addclaims",
          giftsToBeAddedCollectivelyStr
        );
      },
      afterClose: function () {
        /*setTimeout(function(){
            $('.cart-opener').trigger('click');
          }, 3000);*/
      },
    },
  });

  $("#btnClaimSamples").on("click", function (e) {
    $(this).hide();
  });

  function showFreeGiftClaimButton() {
    $.ajax({
      url: "/cart.js",
      dataType: "json",
      async: true,
      success: function (cart) {
        var cartSubtotal = parseFloat(
          moneyFilterRaw(cart.items_subtotal_price)
        );
        var cartItemCount = parseInt(cart.item_count);
        if (SECOMAPP.appLoaded) {
          var currTimestamp = parseInt($.now() / 1000);
          var allGiftRules = SECOMAPP.fgdata.all_gift_rules;

          var allGiftRulesTemp = allGiftRules;
          if (fgUrlPromoCodeApplied === true) {
            $.each(allGiftRulesTemp, function (k, v) {
              if (v != undefined && v != null) {
                if (
                  v.url_promotion_code.trim() != "" &&
                  fgUrlPromoCode.trim() != v.url_promotion_code.trim()
                ) {
                  allGiftRules.splice(k, 1);
                }
              }
            });
          } else if (fgUrlPromoCodeApplied === false) {
            $.each(allGiftRulesTemp, function (k, v) {
              if (v != undefined && v != null) {
                if (v.url_promotion_code.trim() != "") {
                  allGiftRules.splice(k, 1);
                }
              }
            });
          }

          var allGiftRulesSorted = allGiftRules.sort(sortByPriorityAsc);
          var activeGiftRules = [];
          var applicableGiftRules = [];
          var filteredApplicableGiftRules = [];
          var activeGiftVariantIds = [];
          var giftVariantIds = [];
          var allGiftVariantIds = [];
          var giftVariantsPopup = [];
          var giftToBeAddedVariantIds = [];
          var giftToBeSelectedVariantIds = [];
          var autoAddFree = false;
          var productHandles = SECOMAPP.fgdata.products_handle;
          var totalGiftVariants = SECOMAPP.fgdata.total_gift_variants;
          var allRemoveGiftVariants = totalGiftVariants;

          $.each(allGiftRulesSorted, function (k, v) {
            if (v.start_time <= currTimestamp && currTimestamp <= v.end_time) {
              activeGiftRules.push(v);
            }
          });

          $.each(activeGiftRules, function (k, v) {
            var activeGiftProducts = v.gift_id;
            $.each(activeGiftProducts, function (k, v) {
              activeGiftVariantIds.push(v.clone_variant_id);
            });
            var ruleMinSubtotal = parseFloat(v.totalmin);
            if (isNaN(ruleMinSubtotal)) {
              ruleMinSubtotal = 1;
            }
            var ruleMaxSubtotal = parseFloat(v.totalmax);
            if (isNaN(ruleMaxSubtotal)) {
              ruleMaxSubtotal = cartSubtotal + 1;
            }
            var ruleMinQty = parseInt(v.quantitymin);
            if (isNaN(ruleMinQty)) {
              ruleMinQty = 1;
            }
            var ruleMaxQty = parseInt(v.quantitymax);
            if (isNaN(ruleMaxQty)) {
              ruleMaxQty = cartItemCount + 1;
            }
            var ruleCond = v.condition;

            if (v.gift_rule_type == "cart") {
              var ruleItemsInCart = [];
              var ruleItemsInCartSubtotal = 0.0;
              var ruleItemsInCartCount = 0;
              var hasSelectedRuleProducts = false;
              if (
                v.productid_data != undefined &&
                v.productid_data.length > 0
              ) {
                hasSelectedRuleProducts = true;
                $.each(cart.items, function (cKey, cProdItem) {
                  if ($.inArray(cProdItem.product_id, v.productid_data) >= 0) {
                    ruleItemsInCartSubtotal =
                      ruleItemsInCartSubtotal +
                      parseFloat(moneyFilterRaw(cProdItem.final_line_price));
                    for (var i = 1; i <= cProdItem.quantity; i++) {
                      ruleItemsInCart.push(cProdItem.product_id);
                    }
                  }
                });
              }
              ruleItemsInCartCount = parseInt(ruleItemsInCart.length);

              if (
                (!isNaN(parseFloat(v.totalmin)) ||
                  !isNaN(parseFloat(v.totalmax))) &&
                isNaN(parseInt(v.quantitymin)) &&
                isNaN(parseInt(v.quantitymin))
              ) {
                if (hasSelectedRuleProducts) {
                  if (
                    ruleMinSubtotal <= ruleItemsInCartSubtotal &&
                    ruleItemsInCartSubtotal <= ruleMaxSubtotal &&
                    ruleItemsInCart.length > 0
                  ) {
                    applicableGiftRules.push(v);
                  }
                } else {
                  if (
                    ruleMinSubtotal <= cartSubtotal &&
                    cartSubtotal <= ruleMaxSubtotal
                  ) {
                    applicableGiftRules.push(v);
                  }
                }
              } else if (
                isNaN(parseFloat(v.totalmin)) &&
                isNaN(parseFloat(v.totalmax)) &&
                (!isNaN(parseInt(v.quantitymin)) ||
                  !isNaN(parseInt(v.quantitymin)))
              ) {
                if (hasSelectedRuleProducts) {
                  if (
                    ruleMinQty <= ruleItemsInCartCount &&
                    ruleItemsInCartCount <= ruleMaxQty &&
                    ruleItemsInCart.length > 0
                  ) {
                    applicableGiftRules.push(v);
                  }
                } else {
                  if (
                    ruleMinQty <= cartItemCount &&
                    cartItemCount <= ruleMaxQty
                  ) {
                    applicableGiftRules.push(v);
                  }
                }
              } else if (
                (!isNaN(parseFloat(v.totalmin)) ||
                  !isNaN(parseFloat(v.totalmax))) &&
                (!isNaN(parseInt(v.quantitymin)) ||
                  !isNaN(parseInt(v.quantitymin)))
              ) {
                if (hasSelectedRuleProducts) {
                  if (ruleCond == "and") {
                    if (
                      ruleMinSubtotal <= ruleItemsInCartSubtotal &&
                      ruleItemsInCartSubtotal <= ruleMaxSubtotal &&
                      ruleMinQty <= ruleItemsInCartCount &&
                      ruleItemsInCartCount <= ruleMaxQty &&
                      ruleItemsInCart.length > 0
                    ) {
                      applicableGiftRules.push(v);
                    }
                  } else if (ruleCond == "or") {
                    if (
                      ((ruleMinSubtotal <= ruleItemsInCartSubtotal &&
                        ruleItemsInCartSubtotal <= ruleMaxSubtotal) ||
                        (ruleMinQty <= ruleItemsInCartCount &&
                          ruleItemsInCartCount <= ruleMaxQty)) &&
                      ruleItemsInCart.length > 0
                    ) {
                      applicableGiftRules.push(v);
                    }
                  }
                } else {
                  if (ruleCond == "and") {
                    if (
                      ruleMinSubtotal <= cartSubtotal &&
                      cartSubtotal <= ruleMaxSubtotal &&
                      ruleMinQty <= cartItemCount &&
                      cartItemCount <= ruleMaxQty
                    ) {
                      applicableGiftRules.push(v);
                    }
                  } else if (ruleCond == "or") {
                    if (
                      (ruleMinSubtotal <= cartSubtotal &&
                        cartSubtotal <= ruleMaxSubtotal) ||
                      (ruleMinQty <= cartItemCount &&
                        cartItemCount <= ruleMaxQty)
                    ) {
                      applicableGiftRules.push(v);
                    }
                  }
                }
              }
            } else if (v.gift_rule_type == "catalog") {
              var catalogRuleItemsInCart = [];
              if (
                v.productid_data != undefined &&
                v.productid_data.length > 0
              ) {
                $.each(cart.items, function (cKey, cProdItem) {
                  if ($.inArray(cProdItem.product_id, v.productid_data) >= 0) {
                    for (var i = 1; i <= cProdItem.quantity; i++) {
                      catalogRuleItemsInCart.push(cProdItem.product_id);
                    }
                  }
                });
              }
              if (v.product_id != undefined && v.product_id.length > 0) {
                var ruleProdVarIds = [];
                $.each(v.product_id, function (cKey, cProdItem) {
                  ruleProdVarIds.push(cProdItem.variant_id);
                });
                $.each(cart.items, function (cKey, cProdItem) {
                  if ($.inArray(cProdItem.variant_id, ruleProdVarIds) >= 0) {
                    for (var i = 1; i <= cProdItem.quantity; i++) {
                      catalogRuleItemsInCart.push(cProdItem.product_id);
                    }
                  }
                });
              }
              if (catalogRuleItemsInCart.length >= v.min_numb_prods) {
                applicableGiftRules.push(v);
              }
            }
          });

          var prevRulePriority = false;
          var stopLowPriority = false;
          $.each(applicableGiftRules, function (k, v) {
            var stopRule = v.stop_rule;
            var priority = parseInt(v.priority);
            if (stopRule || stopLowPriority) {
              stopLowPriority = true;
              if (stopLowPriority) {
                if (prevRulePriority !== false && priority > prevRulePriority) {
                  return false;
                }
                prevRulePriority = priority;
              }
              filteredApplicableGiftRules.push(v);
            } else {
              filteredApplicableGiftRules.push(v);
            }
          });

          var sampleSelectorAvailable = false;
          var fixedApplicableGiftRules = [];
          var nonFixedApplicableGiftRules = [];
          $.each(filteredApplicableGiftRules, function (k, v) {
            var giftProducts = v.gift_id;
            var maxNumGifts = v.max_numb_gifts;
            if (giftProducts.length == maxNumGifts) {
              fixedApplicableGiftRules.push(v);
            } else {
              sampleSelectorAvailable = true;
              nonFixedApplicableGiftRules.push(v);
            }
          });

          if (sampleSelectorAvailable) {
            $("#btnClaimSamples").removeClass("auto-samples");
            $("#btnClaimSamples").addClass("choose-samples");
          } else {
            $("#btnClaimSamples").removeClass("choose-samples");
            $("#btnClaimSamples").addClass("auto-samples");
          }

          $.each(fixedApplicableGiftRules, function (k, v) {
            var giftProducts = v.gift_id;
            $.each(giftProducts, function (k, v) {
              var giftItemHandle = productHandles[v.product_id];
              /*$.ajax({
                url: '/products/' + giftItemHandle + '.js',
                dataType: 'json',
                async: false,
                success: function (giftProductItem){
                  var giftProductItemVariants = giftProductItem.variants;
                  $.each(giftProductItemVariants, function(gpivKey, variant){
                    if(variant.available){
                      giftVariantIds.push(v.clone_variant_id);
                      allGiftVariantIds.push(v.clone_variant_id);
                      return false;
                    }
                  });
                }
              });*/
              giftVariantIds.push(v.clone_variant_id);
              allGiftVariantIds.push(v.clone_variant_id);
            });
          });

          $.each(nonFixedApplicableGiftRules, function (k, v) {
            var giftProductsPopup = v.gift_id;
            var popupGiftItem = {
              rule_title: v.name,
              max_numb_gifts: v.max_numb_gifts,
              gifts: [],
            };
            $.each(giftProductsPopup, function (k, v) {
              var giftItemHandle = productHandles[v.product_id];
              /*$.ajax({
                url: '/products/' + giftItemHandle + '.js',
                dataType: 'json',
                async: false,
                success: function (giftProductItem){
                  var giftProductItemVariants = giftProductItem.variants;
                  $.each(giftProductItemVariants, function(gpivKey, variant){
                    if(variant.available){
                      allGiftVariantIds.push(v.clone_variant_id);
                      var giftHandle = productHandles[v.product_id];
                      popupGiftItem.gifts.push({product_id: v.product_id, variant_id: v.clone_variant_id, product_handle: giftHandle});
                      return false;
                    }
                  });
                }
              });*/
              allGiftVariantIds.push(v.clone_variant_id);
              var giftHandle = productHandles[v.product_id];
              popupGiftItem.gifts.push({
                product_id: v.product_id,
                variant_id: v.clone_variant_id,
                product_handle: giftHandle,
              });
            });
            giftVariantsPopup.push(popupGiftItem);
          });

          $.each(giftVariantIds, function (k, v) {
            var canAdd = true;
            $.each(cart.items, function (i, item) {
              var itemVariantId = item.variant_id;
              if (v == itemVariantId) {
                canAdd = false;
              }
              if (item.properties != null && item.properties.freesample == 1) {
                //autoAddFree = true;
                autoAddFree = false;
              }
            });
            if (canAdd) {
              giftToBeAddedVariantIds.push(v);
            }
          });

          //giftToBeSelectedVariantIds = giftVariantsPopup;
          $.each(giftVariantsPopup, function (k, v) {
            var cartVars = [];
            $.each(cart.items, function (cK, cI) {
              cartVars.push(cI.variant_id);
            });
            var gIcI = [];
            $.each(v.gifts, function (gK, gI) {
              if ($.inArray(gI.variant_id, cartVars) >= 0) {
                gIcI.push(gI.variant_id);
              }
            });
            if (gIcI.length < v.max_numb_gifts) {
              giftToBeSelectedVariantIds.push(v);
            }
          });

          var dataCartAddclaims = [];
          $.each(giftToBeAddedVariantIds, function (k, v) {
            var addClaimItem = {
              id: v,
              properties: {
                _eligiable: 0,
                _freesample: 1,
              },
              quantity: 1,
            };
            dataCartAddclaims.push(addClaimItem);
          });

          /*giftsToBeAddedCollectively = dataCartAddclaims;*/
          giftsToBeAddedCollectivelyStr = JSON.stringify(
            giftsToBeAddedCollectively
          );

          var dataCartAddclaimsStr = JSON.stringify(dataCartAddclaims);
          var giftToBeSelectedVariantIdsStr = JSON.stringify(
            giftToBeSelectedVariantIds
          );
          $("#btnClaimSamples").attr(
            "data-cart-addclaims",
            dataCartAddclaimsStr
          );
          $("#btnClaimSamplesMain").attr(
            "data-popup-samples",
            giftToBeSelectedVariantIdsStr
          );
          if (nonFixedApplicableGiftRules.length < 1) {
            if (dataCartAddclaims.length > 0) {
              if (autoAddFree) {
                $("#btnClaimSamples").hide();
                $("#btnClaimSamples").trigger("click");
                $("#btnClaimSamplesMain").hide();
                $("#btnCheckout").show();
                $("#btnPopupCheckout").hide();
              } else {
                $("#btnClaimSamples").show();
                $("#btnClaimSamplesMain").hide();
                $("#btnCheckout").show();
                $("#btnPopupCheckout").hide();
              }
            } else {
              $("#btnClaimSamples").hide();
              $("#btnClaimSamplesMain").hide();
              $("#btnCheckout").show();
              $("#btnPopupCheckout").hide();
            }
          } else {
            if (
              dataCartAddclaims.length > 0 &&
              giftToBeSelectedVariantIds.length > 0
            ) {
              if (autoAddFree) {
                $("#btnClaimSamples").hide();
                $("#btnClaimSamples").trigger("click");
                $("#btnClaimSamplesMain").show();
                $("#btnCheckout").hide();
                $("#btnPopupCheckout").show();
              } else {
                $("#btnClaimSamples").hide();
                $("#btnClaimSamplesMain").show();
                $("#btnCheckout").hide();
                $("#btnPopupCheckout").show();
              }
            } else if (
              dataCartAddclaims.length <= 0 &&
              giftToBeSelectedVariantIds.length > 0
            ) {
              $("#btnClaimSamples").hide();
              $("#btnClaimSamplesMain").show();
              $("#btnCheckout").hide();
              $("#btnPopupCheckout").show();
            } else if (
              dataCartAddclaims.length > 0 &&
              giftToBeSelectedVariantIds.length <= 0
            ) {
              if (autoAddFree) {
                $("#btnClaimSamples").hide();
                $("#btnClaimSamples").trigger("click");
                $("#btnClaimSamplesMain").hide();
                $("#btnCheckout").show();
                $("#btnPopupCheckout").hide();
              } else {
                $("#btnClaimSamples").show();
                $("#btnClaimSamplesMain").hide();
                $("#btnCheckout").show();
                $("#btnPopupCheckout").hide();
              }
            } else if (
              dataCartAddclaims.length <= 0 &&
              giftToBeSelectedVariantIds.length <= 0
            ) {
              $("#btnClaimSamples").hide();
              $("#btnClaimSamplesMain").hide();
              $("#btnCheckout").show();
              $("#btnPopupCheckout").hide();
            } else {
              $("#btnClaimSamplesMain").hide();
              $("#btnClaimSamples").hide();
              $("#btnCheckout").show();
              $("#btnPopupCheckout").hide();
            }

            /*
            if(dataCartAddclaims.length > 0 && nonFixedApplicableGiftRules.length > 0){
              if(autoAddFree){
                $('#btnClaimSamples').hide();
                $('#btnClaimSamples').trigger('click');
                $('#btnClaimSamplesMain').show();
              }else{
                $('#btnClaimSamples').hide();
                $('#btnClaimSamplesMain').show();
              }
            }else if(dataCartAddclaims.length <= 0 && nonFixedApplicableGiftRules.length > 0){
              $('#btnClaimSamples').hide();
              $('#btnClaimSamplesMain').show();
            }else{
              $('#btnClaimSamplesMain').hide();
              $('#btnClaimSamples').hide();
            }
            */
          }

          $.each(allGiftVariantIds, function (k, v) {
            allRemoveGiftVariants = $.grep(
              allRemoveGiftVariants,
              function (value) {
                return value != v;
              }
            );
          });

          var removeGiftVariants = [];
          $.each(allRemoveGiftVariants, function (k, v) {
            $.each(cart.items, function (i, item) {
              var itemVariantId = item.variant_id;
              if (itemVariantId == v) {
                removeGiftVariants.push(v);
              }
            });
          });

          if (removeGiftVariants.length > 0) {
            var removeUpdate = { updates: {} };
            $.each(removeGiftVariants, function (k, v) {
              removeUpdate.updates[v] = 0;
            });
            var removeUpdateStr = JSON.stringify(removeUpdate);
            $("#btnRemoveGifts").attr(
              "data-cart-removeclaims",
              removeUpdateStr
            );
            $("#btnRemoveGifts").trigger("click");
          }
        }
        miniCartFormHeightCalc();
      },
    });
  }

  //if( buyXgetYEnabled == 1 ){
  function showClaimButton() {
    var showClaimButton = false;
    var hasEligibleProduct = false;
    var cartFreeProdsCount = 0;
    var eligibleProdHandles = eligibleProds;
    $.getJSON("/cart.js", function (cart) {
      var claimVariantsAdded = [];
      var claimVariantsToBeAdded = [];
      $.each(cart.items, function (i, val) {
        var itemProperties = val.properties;
        if (itemProperties != null) {
          var isEligiable = parseInt(itemProperties.eligiable);
          var isFreeSample = parseInt(itemProperties.freesample);
        } else {
          var isEligiable = 0;
          var isFreeSample = 0;
        }
        if (isFreeSample) {
          cartFreeProdsCount += val.quantity;
        }
        if (isEligiable && !isFreeSample) {
          showClaimButton = true;
          hasEligibleProduct = true;
        }
        if (
          $.inArray(val.variant_id.toString(), allFreeProductVariantIds) >= 0
        ) {
          claimVariantsAdded.push(val.variant_id.toString());
        }
      });

      $.each(allFreeProductVariantIds, function (i, varId) {
        if ($.inArray(varId.toString(), claimVariantsAdded) == -1) {
          claimVariantsToBeAdded.push(varId);
        }
      });
      if (claimVariantsToBeAdded.length > 0) {
        var idHtml = "";
        $.each(claimVariantsToBeAdded, function (i, varId) {
          var dataEligiable = $("#info-" + varId).attr("data-eligiable");
          idHtml +=
            '<input type="hidden" class="freeitem" id="' +
            varId +
            '" name="id[]" value="' +
            varId +
            '" data-id="' +
            varId +
            '" data-free="1" data-eligiable="' +
            dataEligiable +
            '" data-qty="1"/>';
        });
        $("#freeVariantIds").html(idHtml);
      }
      if (cartFreeProdsCount < freeProdHandles.length && hasEligibleProduct) {
        showClaimButton = true;
      } else {
        showClaimButton = false;
      }
      if (showClaimButton) {
        $(".btn-claim-samples").css("display", "block");
      } else {
        $(".btn-claim-samples").css("display", "none");
        setTimeout(function () {
          $("#cart-mini .loader").css("display", "none");
        }, 300);
      }

      var claimData = [];
      $(".freeitem").each(function (index) {
        var variantID = $(this).attr("data-id");
        var variantFREE = $(this).attr("data-free");
        var variantELIG = $(this).attr("data-eligiable");
        var variantQTY = $(this).attr("data-qty");
        var freeitem = {
          id: variantID,
          properties: {
            _eligiable: variantELIG,
            _freesample: variantFREE,
          },
          quantity: variantQTY,
        };
        claimData.push(freeitem);
      });
      var claimDataStr = JSON.stringify(claimData);
      $("#btnClaimSamples").attr("data-cart-addclaims", claimDataStr);

      $(document).on("itemaddedtocart", function () {
        // var elmnt = document.getElementById("minicart-items-wrap");
        // elmnt.scrollIntoView(false);
        // var mincartItemsWrapHeight = $("#cart-mini #minicart-items-wrap").height();
        // $("#cart-mini .mini-cart-form .cart-info").animate({
        //  scrollTop: mincartItemsWrapHeight
        // },1000);
      });
      miniCartFormHeightCalc();
    });
  }
  //}

  function miniCartFormHeightCalc() {
    var miniCartFooter = $("#cart-mini .mini-cart-footer").innerHeight(),
      headerActionsHeight = $(".header-actions").innerHeight(),
      miniCartHeader = $("#cart-mini .cart-header").innerHeight(),
      miniCartSecHeader = $("#cart-mini .mini-cart-header").innerHeight(),
      totalHeaderHeight =
        miniCartHeader + miniCartSecHeader + 1 + headerActionsHeight,
      totalHeight =
        miniCartFooter +
        miniCartHeader +
        miniCartSecHeader +
        20 +
        headerActionsHeight;
    jQuery(".mini-cart-form").css(
      "height",
      "calc(100vh - " + totalHeaderHeight + "px)"
    );
    jQuery("#cart-mini .cart-info").css(
      "height",
      "calc(100vh - " + totalHeight + "px)"
    );
  }
  $(document).on("itemaddedtocart", function () {
    miniCartFormHeightCalc();
    // var elmnt = document.getElementById("minicart-items-wrap");
    // elmnt.scrollIntoView(false);
    // var mincartItemsWrapHeight = $("#cart-mini #minicart-items-wrap").height();
    // $("#cart-mini .mini-cart-form .cart-info").animate({
    //  scrollTop: mincartItemsWrapHeight
    // },1000);
  });

  $(document).on("loadSampleSelectorContent", function () {
    setTimeout(function () {
      loadSampleSelectorContent();
    }, 1);
  });

  $(document).on("sampleSelectQuotaReached", function () {
    $(".btn-unavailable-sample")
      .off()
      .on("click", function () {
        // Do nothing
      });
  });

  $(document).on("sampleSelectorContentLoaded", function () {
    $("#claimSamplesPopup .btn-next").on("click", function () {
      var currStep = parseInt($(this).attr("data-step"));
      var nextStep = currStep + 1;
      var prevStep = currStep - 1;
      $("#claimSamplesPopup .sample-group").hide();
      $(".selector-" + nextStep).show();
      $(".sample-group .slider").slick("refresh");
    });
    $("#claimSamplesPopup .btn-done").on("click", function () {
      $.magnificPopup.close();
    });
    $(".btn-select-sample")
      .off()
      .on("click", function () {
        var thisGiftVariantId = parseInt($(this).attr("data-variant-id"));
        var removePreSelectedStr = $("#btnRemovePreSelectedGifts").attr(
          "data-cart-removeclaims"
        );
        var removePreSelected = { updates: {} };
        if (removePreSelectedStr.length > 0) {
          removePreSelected = JSON.parse(removePreSelectedStr);
        }
        //delete removePreSelected.updates[thisGiftVariantId];
        $("#btnRemovePreSelectedGifts").attr(
          "data-cart-removeclaims",
          JSON.stringify(removePreSelected)
        );
        var thisGift = {
          id: thisGiftVariantId,
          properties: { _eligiable: 0, _freesample: 1 },
          quantity: 1,
        };
        var alreadyIncludedInToBeAddedList = false;
        $.each(giftsToBeAddedCollectively, function (a, toBeAddedItem) {
          if (toBeAddedItem.id == thisGift.id) {
            alreadyIncludedInToBeAddedList = true;
          }
        });
        if (!alreadyIncludedInToBeAddedList) {
          giftsToBeAddedCollectively.push(thisGift);
        }

        giftsToBeAddedCollectivelyStr = JSON.stringify(
          giftsToBeAddedCollectively
        );
        $(this).removeClass("btn-select-sample");
        $(this).addClass("btn-unselect-sample");
        $(this).text("Unselect");
        $(this).parents(".item").addClass("selected");
        $(this).parents(".item").find(".inner").find(".icon-checked").show();
        var maxCount = parseInt(
          $(this).parents(".sample-group").attr("data-max-gifts")
        );
        var currSelectedCount = parseInt(
          $(this).parents(".sample-group").attr("data-selected-gifts")
        );
        var nowSelectedCount = currSelectedCount + 1;
        $(this)
          .parents(".sample-group")
          .attr("data-selected-gifts", nowSelectedCount);
        $(this)
          .parents(".sample-group")
          .find(".selector-instruction")
          .find(".selected-count")
          .text(nowSelectedCount);

        if (
          minRequiredSamples > 0 &&
          (nowSelectedCount >= minRequiredSamples ||
            nowSelectedCount >= maxCount)
        ) {
          //$('#claimSamplesPopup .btn-done').show();
          var thisSampleGroup = $(this).parents(".sample-group");
          if (thisSampleGroup.find(".btn-done").length > 0) {
            thisSampleGroup.find(".btn-done").prop("disabled", false);
            thisSampleGroup.find(".btn-done").text(doneBtnText);
          }
          if (thisSampleGroup.find(".btn-next").length > 0) {
            thisSampleGroup.find(".btn-next").prop("disabled", false);
            thisSampleGroup.find(".btn-next").text(nextBtnText);
          }
        } else if (minRequiredSamples <= 0 && nowSelectedCount >= maxCount) {
          //$('#claimSamplesPopup .btn-done').show();
          var thisSampleGroup = $(this).parents(".sample-group");
          if (thisSampleGroup.find(".btn-done").length > 0) {
            thisSampleGroup.find(".btn-done").prop("disabled", false);
            thisSampleGroup.find(".btn-done").text(doneBtnText);
          }
          if (thisSampleGroup.find(".btn-next").length > 0) {
            thisSampleGroup.find(".btn-next").prop("disabled", false);
            thisSampleGroup.find(".btn-next").text(nextBtnText);
          }
        } else {
          //$('#claimSamplesPopup .btn-done').hide();
          var thisSampleGroup = $(this).parents(".sample-group");
          if (thisSampleGroup.find(".btn-done").length > 0) {
            thisSampleGroup.find(".btn-done").prop("disabled", true);
            thisSampleGroup.find(".btn-done").text(doneNextBtnDisabledText);
          }
          if (thisSampleGroup.find(".btn-next").length > 0) {
            thisSampleGroup.find(".btn-next").prop("disabled", true);
            thisSampleGroup.find(".btn-next").text(doneNextBtnDisabledText);
          }
        }
        if (nowSelectedCount >= maxCount) {
          var remainingClaims = $(this)
            .parents(".sample-group")
            .find(".btn-select-sample");
          remainingClaims.each(function () {
            $(this).addClass("btn-unavailable-sample");
            $(this).removeClass("btn-select-sample");
            $(this).text("Unavailable");
            $(this)
              .parents(".sample-group")
              .find(".selector-instruction")
              .find(".quota-reached")
              .show();
            $(document).trigger("sampleSelectQuotaReached");
          });
        }
        $(document).trigger("sampleSelectorContentSelected");
      });
    $(".btn-unselect-sample")
      .off()
      .on("click", function () {
        var thisGiftVariantId = parseInt($(this).attr("data-variant-id"));
        var removeIndex = -1;
        $.each(giftsToBeAddedCollectively, function (index, item) {
          if (item.id == thisGiftVariantId) {
            removeIndex = index;
          }
        });
        var removePreSelectedStr = $("#btnRemovePreSelectedGifts").attr(
          "data-cart-removeclaims"
        );
        var removePreSelected = { updates: {} };
        if (removePreSelectedStr.length > 0) {
          removePreSelected = JSON.parse(removePreSelectedStr);
        }
        if (
          removePreSelected.updates.thisGiftVariantId == undefined ||
          removePreSelected.updates.thisGiftVariantId == null ||
          removePreSelected.updates.thisGiftVariantId != 0
        ) {
          removePreSelected.updates[thisGiftVariantId] = 0;
        }
        $("#btnRemovePreSelectedGifts").attr(
          "data-cart-removeclaims",
          JSON.stringify(removePreSelected)
        );
        if (removeIndex >= 0) {
          giftsToBeAddedCollectively.splice(removeIndex, 1);
        }

        giftsToBeAddedCollectivelyStr = JSON.stringify(
          giftsToBeAddedCollectively
        );
        $(this).removeClass("btn-unselect-sample");
        $(this).addClass("btn-select-sample");
        $(this).text("Select");
        $(this).parents(".item").removeClass("selected");
        $(this).parents(".item").find(".inner").find(".icon-checked").hide();
        var maxCount = parseInt(
          $(this).parents(".sample-group").attr("data-max-gifts")
        );
        var currSelectedCount = parseInt(
          $(this).parents(".sample-group").attr("data-selected-gifts")
        );
        var nowSelectedCount = currSelectedCount - 1;
        $(this)
          .parents(".sample-group")
          .attr("data-selected-gifts", nowSelectedCount);
        $(this)
          .parents(".sample-group")
          .find(".selector-instruction")
          .find(".selected-count")
          .text(nowSelectedCount);
        if (
          minRequiredSamples > 0 &&
          (nowSelectedCount >= minRequiredSamples ||
            nowSelectedCount >= maxCount)
        ) {
          //$('#claimSamplesPopup .btn-done').show();
          var thisSampleGroup = $(this).parents(".sample-group");
          if (thisSampleGroup.find(".btn-done").length > 0) {
            thisSampleGroup.find(".btn-done").prop("disabled", false);
            thisSampleGroup.find(".btn-done").text(doneBtnText);
          }
          if (thisSampleGroup.find(".btn-next").length > 0) {
            thisSampleGroup.find(".btn-next").prop("disabled", false);
            thisSampleGroup.find(".btn-next").text(nextBtnText);
          }
        } else if (minRequiredSamples <= 0 && nowSelectedCount >= maxCount) {
          //$('#claimSamplesPopup .btn-done').show();
          var thisSampleGroup = $(this).parents(".sample-group");
          if (thisSampleGroup.find(".btn-done").length > 0) {
            thisSampleGroup.find(".btn-done").prop("disabled", false);
            thisSampleGroup.find(".btn-done").text(doneBtnText);
          }
          if (thisSampleGroup.find(".btn-next").length > 0) {
            thisSampleGroup.find(".btn-next").prop("disabled", false);
            thisSampleGroup.find(".btn-next").text(nextBtnText);
          }
        } else {
          //$('#claimSamplesPopup .btn-done').hide();
          var thisSampleGroup = $(this).parents(".sample-group");
          if (thisSampleGroup.find(".btn-done").length > 0) {
            thisSampleGroup.find(".btn-done").prop("disabled", true);
            thisSampleGroup.find(".btn-done").text(doneNextBtnDisabledText);
          }
          if (thisSampleGroup.find(".btn-next").length > 0) {
            thisSampleGroup.find(".btn-next").prop("disabled", true);
            thisSampleGroup.find(".btn-next").text(doneNextBtnDisabledText);
          }
        }
        if (nowSelectedCount < maxCount) {
          var unavailableClaims = $(this)
            .parents(".sample-group")
            .find(".btn-unavailable-sample");
          unavailableClaims.each(function () {
            $(this).addClass("btn-select-sample");
            $(this).removeClass("btn-unavailable-sample");
            $(this).text("Select");
            $(this)
              .parents(".sample-group")
              .find(".selector-instruction")
              .find(".quota-reached")
              .hide();
          });
        }
        $(document).trigger("sampleSelectorContentSelected");
      });
  });

  $(document).on("sampleSelectorContentSelected", function () {
    $(".btn-select-sample")
      .off()
      .on("click", function () {
        var thisGiftVariantId = parseInt($(this).attr("data-variant-id"));
        var removePreSelectedStr = $("#btnRemovePreSelectedGifts").attr(
          "data-cart-removeclaims"
        );
        var removePreSelected = { updates: {} };
        if (removePreSelectedStr.length > 0) {
          removePreSelected = JSON.parse(removePreSelectedStr);
        }
        //delete removePreSelected.updates[thisGiftVariantId];
        $("#btnRemovePreSelectedGifts").attr(
          "data-cart-removeclaims",
          JSON.stringify(removePreSelected)
        );
        var thisGift = {
          id: thisGiftVariantId,
          properties: { _eligiable: 0, _freesample: 1 },
          quantity: 1,
        };
        var alreadyIncludedInToBeAddedList = false;
        $.each(giftsToBeAddedCollectively, function (a, toBeAddedItem) {
          if (toBeAddedItem.id == thisGift.id) {
            alreadyIncludedInToBeAddedList = true;
          }
        });
        if (!alreadyIncludedInToBeAddedList) {
          giftsToBeAddedCollectively.push(thisGift);
        }

        giftsToBeAddedCollectivelyStr = JSON.stringify(
          giftsToBeAddedCollectively
        );
        $(this).removeClass("btn-select-sample");
        $(this).addClass("btn-unselect-sample");
        $(this).text("Unselect");
        $(this).parents(".item").addClass("selected");
        $(this).parents(".item").find(".inner").find(".icon-checked").show();
        var maxCount = parseInt(
          $(this).parents(".sample-group").attr("data-max-gifts")
        );
        var currSelectedCount = parseInt(
          $(this).parents(".sample-group").attr("data-selected-gifts")
        );
        var nowSelectedCount = currSelectedCount + 1;
        $(this)
          .parents(".sample-group")
          .attr("data-selected-gifts", nowSelectedCount);
        $(this)
          .parents(".sample-group")
          .find(".selector-instruction")
          .find(".selected-count")
          .text(nowSelectedCount);
        if (
          minRequiredSamples > 0 &&
          (nowSelectedCount >= minRequiredSamples ||
            nowSelectedCount >= maxCount)
        ) {
          //$('#claimSamplesPopup .btn-done').show();
          var thisSampleGroup = $(this).parents(".sample-group");
          if (thisSampleGroup.find(".btn-done").length > 0) {
            thisSampleGroup.find(".btn-done").prop("disabled", false);
            thisSampleGroup.find(".btn-done").text(doneBtnText);
          }
          if (thisSampleGroup.find(".btn-next").length > 0) {
            thisSampleGroup.find(".btn-next").prop("disabled", false);
            thisSampleGroup.find(".btn-next").text(nextBtnText);
          }
        } else if (minRequiredSamples <= 0 && nowSelectedCount >= maxCount) {
          //$('#claimSamplesPopup .btn-done').show();
          var thisSampleGroup = $(this).parents(".sample-group");
          if (thisSampleGroup.find(".btn-done").length > 0) {
            thisSampleGroup.find(".btn-done").prop("disabled", false);
            thisSampleGroup.find(".btn-done").text(doneBtnText);
          }
          if (thisSampleGroup.find(".btn-next").length > 0) {
            thisSampleGroup.find(".btn-next").prop("disabled", false);
            thisSampleGroup.find(".btn-next").text(nextBtnText);
          }
        } else {
          //$('#claimSamplesPopup .btn-done').hide();
          var thisSampleGroup = $(this).parents(".sample-group");
          if (thisSampleGroup.find(".btn-done").length > 0) {
            thisSampleGroup.find(".btn-done").prop("disabled", true);
            thisSampleGroup.find(".btn-done").text(doneNextBtnDisabledText);
          }
          if (thisSampleGroup.find(".btn-next").length > 0) {
            thisSampleGroup.find(".btn-next").prop("disabled", true);
            thisSampleGroup.find(".btn-next").text(doneNextBtnDisabledText);
          }
        }
        if (nowSelectedCount >= maxCount) {
          var remainingClaims = $(this)
            .parents(".sample-group")
            .find(".btn-select-sample");
          remainingClaims.each(function () {
            $(this).addClass("btn-unavailable-sample");
            $(this).removeClass("btn-select-sample");
            $(this).text("Unavailable");
            $(this)
              .parents(".sample-group")
              .find(".selector-instruction")
              .find(".quota-reached")
              .show();
            $(document).trigger("sampleSelectQuotaReached");
          });
        }
        $(document).trigger("sampleSelectorContentUnSelected");
      });
    $(".btn-unselect-sample")
      .off()
      .on("click", function () {
        var thisGiftVariantId = parseInt($(this).attr("data-variant-id"));
        var removeIndex = -1;
        $.each(giftsToBeAddedCollectively, function (index, item) {
          if (item.id == thisGiftVariantId) {
            removeIndex = index;
          }
        });
        var removePreSelectedStr = $("#btnRemovePreSelectedGifts").attr(
          "data-cart-removeclaims"
        );
        var removePreSelected = { updates: {} };
        if (removePreSelectedStr.length > 0) {
          removePreSelected = JSON.parse(removePreSelectedStr);
        }
        if (
          removePreSelected.updates.thisGiftVariantId == undefined ||
          removePreSelected.updates.thisGiftVariantId == null ||
          removePreSelected.updates.thisGiftVariantId != 0
        ) {
          removePreSelected.updates[thisGiftVariantId] = 0;
        }
        $("#btnRemovePreSelectedGifts").attr(
          "data-cart-removeclaims",
          JSON.stringify(removePreSelected)
        );
        if (removeIndex >= 0) {
          giftsToBeAddedCollectively.splice(removeIndex, 1);
        }

        giftsToBeAddedCollectivelyStr = JSON.stringify(
          giftsToBeAddedCollectively
        );
        $(this).removeClass("btn-unselect-sample");
        $(this).addClass("btn-select-sample");
        $(this).text("Select");
        $(this).parents(".item").removeClass("selected");
        $(this).parents(".item").find(".inner").find(".icon-checked").hide();
        var maxCount = parseInt(
          $(this).parents(".sample-group").attr("data-max-gifts")
        );
        var currSelectedCount = parseInt(
          $(this).parents(".sample-group").attr("data-selected-gifts")
        );
        var nowSelectedCount = currSelectedCount - 1;
        $(this)
          .parents(".sample-group")
          .attr("data-selected-gifts", nowSelectedCount);
        $(this)
          .parents(".sample-group")
          .find(".selector-instruction")
          .find(".selected-count")
          .text(nowSelectedCount);
        if (
          minRequiredSamples > 0 &&
          (nowSelectedCount >= minRequiredSamples ||
            nowSelectedCount >= maxCount)
        ) {
          //$('#claimSamplesPopup .btn-done').show();
          var thisSampleGroup = $(this).parents(".sample-group");
          if (thisSampleGroup.find(".btn-done").length > 0) {
            thisSampleGroup.find(".btn-done").prop("disabled", false);
            thisSampleGroup.find(".btn-done").text(doneBtnText);
          }
          if (thisSampleGroup.find(".btn-next").length > 0) {
            thisSampleGroup.find(".btn-next").prop("disabled", false);
            thisSampleGroup.find(".btn-next").text(nextBtnText);
          }
        } else if (minRequiredSamples <= 0 && nowSelectedCount >= maxCount) {
          //$('#claimSamplesPopup .btn-done').show();
          var thisSampleGroup = $(this).parents(".sample-group");
          if (thisSampleGroup.find(".btn-done").length > 0) {
            thisSampleGroup.find(".btn-done").prop("disabled", false);
            thisSampleGroup.find(".btn-done").text(doneBtnText);
          }
          if (thisSampleGroup.find(".btn-next").length > 0) {
            thisSampleGroup.find(".btn-next").prop("disabled", false);
            thisSampleGroup.find(".btn-next").text(nextBtnText);
          }
        } else {
          //$('#claimSamplesPopup .btn-done').hide();
          var thisSampleGroup = $(this).parents(".sample-group");
          if (thisSampleGroup.find(".btn-done").length > 0) {
            thisSampleGroup.find(".btn-done").prop("disabled", true);
            thisSampleGroup.find(".btn-done").text(doneNextBtnDisabledText);
          }
          if (thisSampleGroup.find(".btn-next").length > 0) {
            thisSampleGroup.find(".btn-next").prop("disabled", true);
            thisSampleGroup.find(".btn-next").text(doneNextBtnDisabledText);
          }
        }
        if (nowSelectedCount < maxCount) {
          var unavailableClaims = $(this)
            .parents(".sample-group")
            .find(".btn-unavailable-sample");
          unavailableClaims.each(function () {
            $(this).addClass("btn-select-sample");
            $(this).removeClass("btn-unavailable-sample");
            $(this).text("Select");
            $(this)
              .parents(".sample-group")
              .find(".selector-instruction")
              .find(".quota-reached")
              .hide();
          });
        }
        $(document).trigger("sampleSelectorContentUnSelected");
      });
  });

  $(document).on("sampleSelectorContentUnSelected", function () {
    $(".btn-select-sample")
      .off()
      .on("click", function () {
        var thisGiftVariantId = parseInt($(this).attr("data-variant-id"));
        var removePreSelectedStr = $("#btnRemovePreSelectedGifts").attr(
          "data-cart-removeclaims"
        );
        var removePreSelected = { updates: {} };
        if (removePreSelectedStr.length > 0) {
          removePreSelected = JSON.parse(removePreSelectedStr);
        }
        //delete removePreSelected.updates[thisGiftVariantId];
        $("#btnRemovePreSelectedGifts").attr(
          "data-cart-removeclaims",
          JSON.stringify(removePreSelected)
        );
        var thisGift = {
          id: thisGiftVariantId,
          properties: { _eligiable: 0, _freesample: 1 },
          quantity: 1,
        };
        var alreadyIncludedInToBeAddedList = false;
        $.each(giftsToBeAddedCollectively, function (a, toBeAddedItem) {
          if (toBeAddedItem.id == thisGift.id) {
            alreadyIncludedInToBeAddedList = true;
          }
        });
        if (!alreadyIncludedInToBeAddedList) {
          giftsToBeAddedCollectively.push(thisGift);
        }

        giftsToBeAddedCollectivelyStr = JSON.stringify(
          giftsToBeAddedCollectively
        );
        $(this).removeClass("btn-select-sample");
        $(this).addClass("btn-unselect-sample");
        $(this).text("Unselect");
        $(this).parents(".item").addClass("selected");
        $(this).parents(".item").find(".inner").find(".icon-checked").show();
        var maxCount = parseInt(
          $(this).parents(".sample-group").attr("data-max-gifts")
        );
        var currSelectedCount = parseInt(
          $(this).parents(".sample-group").attr("data-selected-gifts")
        );
        var nowSelectedCount = currSelectedCount + 1;
        $(this)
          .parents(".sample-group")
          .attr("data-selected-gifts", nowSelectedCount);
        $(this)
          .parents(".sample-group")
          .find(".selector-instruction")
          .find(".selected-count")
          .text(nowSelectedCount);
        if (
          minRequiredSamples > 0 &&
          (nowSelectedCount >= minRequiredSamples ||
            nowSelectedCount >= maxCount)
        ) {
          //$('#claimSamplesPopup .btn-done').show();
          var thisSampleGroup = $(this).parents(".sample-group");
          if (thisSampleGroup.find(".btn-done").length > 0) {
            thisSampleGroup.find(".btn-done").prop("disabled", false);
            thisSampleGroup.find(".btn-done").text(doneBtnText);
          }
          if (thisSampleGroup.find(".btn-next").length > 0) {
            thisSampleGroup.find(".btn-next").prop("disabled", false);
            thisSampleGroup.find(".btn-next").text(nextBtnText);
          }
        } else if (minRequiredSamples <= 0 && nowSelectedCount >= maxCount) {
          //$('#claimSamplesPopup .btn-done').show();
          var thisSampleGroup = $(this).parents(".sample-group");
          if (thisSampleGroup.find(".btn-done").length > 0) {
            thisSampleGroup.find(".btn-done").prop("disabled", false);
            thisSampleGroup.find(".btn-done").text(doneBtnText);
          }
          if (thisSampleGroup.find(".btn-next").length > 0) {
            thisSampleGroup.find(".btn-next").prop("disabled", false);
            thisSampleGroup.find(".btn-next").text(nextBtnText);
          }
        } else {
          //$('#claimSamplesPopup .btn-done').hide();
          var thisSampleGroup = $(this).parents(".sample-group");
          if (thisSampleGroup.find(".btn-done").length > 0) {
            thisSampleGroup.find(".btn-done").prop("disabled", true);
            thisSampleGroup.find(".btn-done").text(doneNextBtnDisabledText);
          }
          if (thisSampleGroup.find(".btn-next").length > 0) {
            thisSampleGroup.find(".btn-next").prop("disabled", true);
            thisSampleGroup.find(".btn-next").text(doneNextBtnDisabledText);
          }
        }
        if (nowSelectedCount >= maxCount) {
          var remainingClaims = $(this)
            .parents(".sample-group")
            .find(".btn-select-sample");
          remainingClaims.each(function () {
            $(this).addClass("btn-unavailable-sample");
            $(this).removeClass("btn-select-sample");
            $(this).text("Unavailable");
            $(this)
              .parents(".sample-group")
              .find(".selector-instruction")
              .find(".quota-reached")
              .show();
            $(document).trigger("sampleSelectQuotaReached");
          });
        }
        $(document).trigger("sampleSelectorContentSelected");
      });
    $(".btn-unselect-sample")
      .off()
      .on("click", function () {
        var thisGiftVariantId = parseInt($(this).attr("data-variant-id"));
        var removeIndex = -1;
        $.each(giftsToBeAddedCollectively, function (index, item) {
          if (item.id == thisGiftVariantId) {
            removeIndex = index;
          }
        });
        var removePreSelectedStr = $("#btnRemovePreSelectedGifts").attr(
          "data-cart-removeclaims"
        );
        var removePreSelected = { updates: {} };
        if (removePreSelectedStr.length > 0) {
          removePreSelected = JSON.parse(removePreSelectedStr);
        }
        if (
          removePreSelected.updates.thisGiftVariantId == undefined ||
          removePreSelected.updates.thisGiftVariantId == null ||
          removePreSelected.updates.thisGiftVariantId != 0
        ) {
          removePreSelected.updates[thisGiftVariantId] = 0;
        }
        $("#btnRemovePreSelectedGifts").attr(
          "data-cart-removeclaims",
          JSON.stringify(removePreSelected)
        );
        if (removeIndex >= 0) {
          giftsToBeAddedCollectively.splice(removeIndex, 1);
        }

        giftsToBeAddedCollectivelyStr = JSON.stringify(
          giftsToBeAddedCollectively
        );
        $(this).removeClass("btn-unselect-sample");
        $(this).addClass("btn-select-sample");
        $(this).text("Select");
        $(this).parents(".item").removeClass("selected");
        $(this).parents(".item").find(".inner").find(".icon-checked").hide();
        var maxCount = parseInt(
          $(this).parents(".sample-group").attr("data-max-gifts")
        );
        var currSelectedCount = parseInt(
          $(this).parents(".sample-group").attr("data-selected-gifts")
        );
        var nowSelectedCount = currSelectedCount - 1;
        $(this)
          .parents(".sample-group")
          .attr("data-selected-gifts", nowSelectedCount);
        $(this)
          .parents(".sample-group")
          .find(".selector-instruction")
          .find(".selected-count")
          .text(nowSelectedCount);
        if (
          minRequiredSamples > 0 &&
          (nowSelectedCount >= minRequiredSamples ||
            nowSelectedCount >= maxCount)
        ) {
          //$('#claimSamplesPopup .btn-done').show();
          var thisSampleGroup = $(this).parents(".sample-group");
          if (thisSampleGroup.find(".btn-done").length > 0) {
            thisSampleGroup.find(".btn-done").prop("disabled", false);
            thisSampleGroup.find(".btn-done").text(doneBtnText);
          }
          if (thisSampleGroup.find(".btn-next").length > 0) {
            thisSampleGroup.find(".btn-next").prop("disabled", false);
            thisSampleGroup.find(".btn-next").text(nextBtnText);
          }
        } else if (minRequiredSamples <= 0 && nowSelectedCount >= maxCount) {
          //$('#claimSamplesPopup .btn-done').show();
          var thisSampleGroup = $(this).parents(".sample-group");
          if (thisSampleGroup.find(".btn-done").length > 0) {
            thisSampleGroup.find(".btn-done").prop("disabled", false);
            thisSampleGroup.find(".btn-done").text(doneBtnText);
          }
          if (thisSampleGroup.find(".btn-next").length > 0) {
            thisSampleGroup.find(".btn-next").prop("disabled", false);
            thisSampleGroup.find(".btn-next").text(nextBtnText);
          }
        } else {
          //$('#claimSamplesPopup .btn-done').hide();
          var thisSampleGroup = $(this).parents(".sample-group");
          if (thisSampleGroup.find(".btn-done").length > 0) {
            thisSampleGroup.find(".btn-done").prop("disabled", true);
            thisSampleGroup.find(".btn-done").text(doneNextBtnDisabledText);
          }
          if (thisSampleGroup.find(".btn-next").length > 0) {
            thisSampleGroup.find(".btn-next").prop("disabled", true);
            thisSampleGroup.find(".btn-next").text(doneNextBtnDisabledText);
          }
        }
        if (nowSelectedCount < maxCount) {
          var unavailableClaims = $(this)
            .parents(".sample-group")
            .find(".btn-unavailable-sample");
          unavailableClaims.each(function () {
            $(this).addClass("btn-select-sample");
            $(this).removeClass("btn-unavailable-sample");
            $(this).text("Select");
            $(this)
              .parents(".sample-group")
              .find(".selector-instruction")
              .find(".quota-reached")
              .hide();
          });
        }
        $(document).trigger("sampleSelectorContentSelected");
      });
  });

  function loadSampleSelectorContent() {
    var cartVariantIds = [];
    $.ajax({
      url: "/cart.js",
      dataType: "json",
      async: false,
      success: function (cart) {
        if (cart.items.length > 0) {
          $.each(cart.items, function (cIndex, cItem) {
            cartVariantIds.push(cItem.variant_id);
          });
        }
      },
    });
    var popupContentHtml = "";
    var dataPopupSamplesStr = $("#btnClaimSamplesMain").attr(
      "data-popup-samples"
    );
    var dataPopupSamples = JSON.parse(dataPopupSamplesStr);
    var multiSelectors = false;
    if (dataPopupSamples.length > 1) {
      multiSelectors = true;
    }

    $.each(dataPopupSamples, function (i, sampleGroup) {
      var selectorCount = i + 1;

      var chooseXText1 = chooseXText.split("MAXGIFT")[0];
      var chooseXText2 = chooseXText.split("MAXGIFT")[1];
      var grpChooseXText =
        chooseXText1 + sampleGroup.max_numb_gifts + chooseXText2;

      var grpItemsAllInCart = false;
      var grpItemsInCartCount = 0;
      $.each(sampleGroup.gifts, function (j, giftItem) {
        if ($.inArray(giftItem.variant_id, cartVariantIds) >= 0) {
          grpItemsInCartCount = grpItemsInCartCount + 1;
        }
      });
      if (grpItemsInCartCount >= sampleGroup.max_numb_gifts) {
        grpItemsAllInCart = true;
      }

      popupContentHtml +=
        '<div class="sample-group selector-' +
        selectorCount +
        '" data-selected-gifts="' +
        grpItemsInCartCount +
        '" data-max-gifts="' +
        sampleGroup.max_numb_gifts +
        '">';
      popupContentHtml +=
        '<h2 class="popup-title">' + sampleGroup.rule_title + "</h2>";
      //popupContentHtml += '<h2 class="popup-title">Select Your Free Gifts</h2>';
      popupContentHtml +=
        '<div class="selector-instruction">' +
        grpChooseXText +
        ' <span class="selected-count">' +
        grpItemsInCartCount +
        "</span> of " +
        sampleGroup.max_numb_gifts +
        " selected.";
      if (grpItemsInCartCount >= sampleGroup.max_numb_gifts) {
        popupContentHtml +=
          '<br><span class="quota-reached">' +
          limitReachedText +
          "</span></div>";
      } else {
        popupContentHtml +=
          '<br><span class="quota-reached" style="display:none;">' +
          limitReachedText +
          "</span></div>";
      }
      popupContentHtml += '<div class="section section--related-products">';
      popupContentHtml += '  <div class="product-grid-block">';
      popupContentHtml += '    <div class="product-listing">';
      popupContentHtml += '      <div class="slider">';

      $.each(sampleGroup.gifts, function (j, giftItem) {
        var thisItemInCart = false;
        if ($.inArray(giftItem.variant_id, cartVariantIds) >= 0) {
          thisItemInCart = true;
        }
        $.ajax({
          url: "/products/" + giftItem.product_handle + ".js",
          dataType: "json",
          async: false,
          success: function (sampleProduct) {
            if (thisItemInCart) {
              popupContentHtml += '      <div class="item selected">';
            } else {
              popupContentHtml += '      <div class="item">';
            }
            popupContentHtml += '          <div class="inner">';
            if (thisItemInCart) {
              popupContentHtml += '           <div class="icon-checked">';
            } else {
              popupContentHtml +=
                '           <div class="icon-checked" style="display:none;">';
            }
            popupContentHtml +=
              '               <svg enable-background="new 0 0 512 512" version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><path d="m437.02 74.98c-48.352-48.351-112.64-74.98-181.02-74.98-68.381 0-132.67 26.629-181.02 74.98-48.352 48.352-74.98 112.64-74.98 181.02s26.628 132.67 74.98 181.02 112.64 74.981 181.02 74.981c68.38 0 132.67-26.629 181.02-74.981s74.981-112.64 74.981-181.02-26.629-132.67-74.981-181.02zm-181.02 407.02c-124.62 0-226-101.38-226-226s101.38-226 226-226 226 101.38 226 226-101.38 226-226 226z"/><path d="m378.3 173.86c-5.857-5.856-15.355-5.856-21.212 1e-3l-132.46 132.46-69.727-69.727c-5.857-5.857-15.355-5.857-21.213 0s-5.858 15.355 0 21.213l80.333 80.333c2.929 2.929 6.768 4.393 10.606 4.393s7.678-1.465 10.606-4.393l143.07-143.07c5.858-5.857 5.858-15.355 0-21.213z"/></svg></div>';
            popupContentHtml +=
              '            <div class="img-wrapper" data-imgsrc="' +
              sampleProduct.featured_image +
              '" data-imgalt="">';
            popupContentHtml +=
              '              <img src="' + sampleProduct.featured_image + '"/>';
            if (thisItemInCart) {
              popupContentHtml +=
                '             <a href="#" class="btn-popup-item btn-unselect-sample" data-variant-id="' +
                giftItem.variant_id +
                '">Unselect</a>';
            } else if (grpItemsAllInCart) {
              popupContentHtml +=
                '             <a href="#" class="btn-popup-item btn-unavailable-sample" data-variant-id="' +
                giftItem.variant_id +
                '">Unavailable</a>';
            } else {
              popupContentHtml +=
                '             <a href="#" class="btn-popup-item btn-select-sample" data-variant-id="' +
                giftItem.variant_id +
                '">Select</a>';
            }
            popupContentHtml += "            </div>";
            popupContentHtml +=
              '            <div class="product-grid-details">';
            popupContentHtml +=
              '              <h3 class="product-grid-details-info title">' +
              sampleProduct.title +
              "</h3>";
            popupContentHtml +=
              '              <p class="product-grid-details-info desc">' +
              $(sampleProduct.description).text().substr(0, 80) +
              "</p>";
            popupContentHtml += "            </div>";
            popupContentHtml += "          </div>";
            popupContentHtml += "        </div>";
          },
        });
      });

      popupContentHtml += "      </div>";
      popupContentHtml += "    </div>";
      popupContentHtml += "  </div>";
      popupContentHtml += "</div>";
      if (multiSelectors && selectorCount < dataPopupSamples.length) {
        var nextBtnState = "disabled";
        var nextBtnlabel = doneNextBtnDisabledText;
        if (
          minRequiredSamples > 0 &&
          grpItemsInCartCount >= minRequiredSamples
        ) {
          nextBtnState = "";
          nextBtnlabel = nextBtnText;
        }
        popupContentHtml +=
          '<div class="selector-footer"><button class="btn btn-next" data-step="' +
          selectorCount +
          '" ' +
          nextBtnState +
          ">" +
          nextBtnlabel +
          "</button></div>";
      } else {
        if (checkoutAfterSampleSelectionPopup) {
          var doneBtnState = "disabled";
          var doneBtnlabel = doneNextBtnDisabledText;
          if (
            minRequiredSamples > 0 &&
            grpItemsInCartCount >= minRequiredSamples
          ) {
            doneBtnState = "";
            doneBtnlabel = doneBtnText;
          }
          popupContentHtml +=
            '<div class="selector-footer"><button class="btn btn-done" data-step="' +
            selectorCount +
            '" ' +
            doneBtnState +
            ">" +
            doneBtnlabel +
            "</button></div>";
        } else {
          /*var doneBtnStyle = 'style="display:none;"';
                if( grpItemsInCartCount > 0 ){
                  doneBtnStyle = '';
                }
                popupContentHtml += '<div class="selector-footer"><a href="javascript:void(0);" class="btn btn-done" data-step="' + selectorCount + '" ' + doneBtnStyle + '>' + doneBtnText + '</a></div>';*/
          var doneBtnState = "disabled";
          var doneBtnlabel = doneNextBtnDisabledText;
          if (
            minRequiredSamples > 0 &&
            grpItemsInCartCount >= minRequiredSamples
          ) {
            doneBtnState = "";
            doneBtnlabel = doneBtnText;
          }
          popupContentHtml +=
            '<div class="selector-footer"><button class="btn btn-done" data-step="' +
            selectorCount +
            '" ' +
            doneBtnState +
            ">" +
            doneBtnlabel +
            "</button></div>";
        }
      }
      popupContentHtml += "</div>";
    });

    $("#claimSamplesPopup .sample-selectors").html(popupContentHtml);

    var bs_slick_config = {
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: true,
      dots: false,
      responsive: [
        {
          breakpoint: 1100,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    };
    $(".sample-group .slider").slick(bs_slick_config);
    $("#claimSamplesPopup .sample-group").hide();
    $(".selector-1").show();
    $(document).trigger("sampleSelectorContentLoaded");
  }
});
