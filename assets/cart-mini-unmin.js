function check(type){
    return $('body').find(type).length;
}

function tabMenuContent(){
  $("div.tab-content .tab-content-item:first-child").stop().css('display', 'block');
  $("div.tab-menu .tab-menu-item:first-child").find('a').stop().addClass("active");
  $("div.tab-menu .tab-menu-item a").on('click', function(e){
    e.preventDefault();
    $("div.tab-content .tab-content-item").stop().css('display', 'none');
    $("div.tab-menu .tab-menu-item a").stop().removeClass("active");
    $(this).stop().addClass("active");
    var dataTab = $(this).attr('data-tab');
    $("#" +  dataTab).stop().css('display', 'block');
    miniCartFormHeightCalc();
  });
  
}

function wishlistMiniCartOpener(){ 
  $('.cart-opener').trigger('click');
  $("div.tab-content .tab-content-item").stop().css('display', 'none');
  $("div.tab-menu .tab-menu-item a").stop().removeClass("active");
  $('.tab-menu .tab-menu-item a[data-tab="tabWishlist"]').stop().addClass('active');
  $("#tabWishlist").stop().css("display", "block");
}

function wishlistContainerHeightCalc(){
  // Wishlist Container Height -----------------------------------------------------
  var carMiniHeight = $('#cart-mini').innerHeight(),
      cartHeaderHeight = $(".cart-header").innerHeight();
  $("#tabWishlist form.cart").css("height", carMiniHeight - cartHeaderHeight - 160);
}

function miniCartFormHeightCalc(){
  var miniCartFooter = $("#cart-mini .mini-cart-footer").innerHeight(),
    headerActionsHeight = $(".header-actions").innerHeight(),
    miniCartHeader = $("#cart-mini .cart-header").innerHeight(),
    miniCartSecHeader = $("#cart-mini .mini-cart-header").innerHeight(),
    totalHeaderHeight = miniCartHeader + miniCartSecHeader + 1 + headerActionsHeight,
    totalHeight = miniCartFooter + miniCartHeader + miniCartSecHeader + 20 + headerActionsHeight;
  jQuery(".mini-cart-form").css("height", "calc(100vh - " + totalHeaderHeight + "px)" );
  jQuery("#cart-mini .cart-info").css("height", "calc(100vh - " + totalHeight + "px)" );
}

$(document).ready(function () {
    $("#cart-mini .checkout-view .button").on("click", function () {
        $(this).attr('value', 'please wait').css('background-color', '#a5a5a8').css("border-color", "#a5a5a8");
    });
    CartJS.init(RESOURCES.cartJSON, {
        "requestBodyClass": "loading"
    });

    tabMenuContent();

    $(".tab-menu-item a[data-tab='tabWishlist']").on('click', function(){
        wishlistContainerHeightCalc();
      });

    function initCartEventHandlers() {

        $(document).on('cart.requestStarted', function (event, cart) {
            var magnificPopupBtn = check('.quick-view-popup');
            if (magnificPopupBtn > 0) {
                $.magnificPopup.close();
            }

            // Active Mincart Cart Tab ----------------------------------------------------------
            $("div.tab-content .tab-content-item").stop().css('display', 'none');
            $("div.tab-menu .tab-menu-item a").stop().removeClass("active");
            $('.tab-menu .tab-menu-item a[data-tab="tabCart"]').stop().addClass('active');
            $("#tabCart").stop().css("display", "block");
            //-----------------------------------------------------------------------------------
            $(".inline-loader").css("display", "block");
            $("body").addClass('sticky-nav-min');
            $("body").addClass('cart-open');
            $('.cart-action-wrapper').addClass('active');
            $('html').addClass('safari-scroll-disable');
            var headerActionsHeight = $("div.header-actions").innerHeight();
            //$("#cart-mini").css('top', headerActionsHeight);
        });
        $(document).on('cart.requestComplete', function (event, cart) {
            updateMiniCartCount(cart.item_count);

            var totalCartPriceRaw = parseFloat(cart.total_price);
            var giftCardPrice = 0.0;
            var hasOnlyGiftCard = true;
            $.each(cart.items, function (cIKey, line_item) {
                if (line_item.gift_card) {
                    giftCardPrice = giftCardPrice + line_item.final_line_price;
                } else {
                    hasOnlyGiftCard = false;
                }
            });
            var totalCartPrice = totalCartPriceRaw - giftCardPrice;

            var free_shipping_threshold_warning_enabled = RESOURCES.free_shipping_threshold_warning_enabled;
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
                var decimal = 50;
             
                if ((!hasOnlyGiftCard) && (totalCartPrice < threshold_one_ammount)) {
                    console.log('threshold one Condition');
                    var threshold_one_ammount_needed = (threshold_one_ammount - totalCartPrice) / decimal;
                    var free_val_needed = money_format.replace("{{amount}}", threshold_one_ammount_needed);
                    var threshold_one_message = threshold_one_message.replace("XXX", free_val_needed);

                    var indicatorPercentage = (totalCartPrice * 100) / threshold_one_ammount;
                    if (threshold_one_ammount >= totalCartPrice) {
                        jQuery(".shipping__threshold--indicator").css("display", 'block');
                        miniCartFormHeightCalc();
                        jQuery("div.shipping__threshold--indicator div.indicator-track .indicator-level").css('width', indicatorPercentage + '%');
                    }
                    $(".free-shipping-message").removeClass('show');
                    $(".shipping-warning").html(threshold_one_message);

                }
                else if ((hasOnlyGiftCard) || (totalCartPrice >= threshold_one_ammount && threshold_two_ammount == 0)) {  
                  //alert(hasOnlyGiftCard);
                    console.log('free_shipping Condition');
                    $(".free-shipping-message").removeClass('show');
                    setTimeout(function(){
                        $(".free-shipping-message").html(free_shipping).addClass('show');
                      },300);
                    
                    $(".shipping-warning").html(free_shipping);
                    jQuery(".shipping__threshold--indicator").css("display", "none");
                    miniCartFormHeightCalc();
                }
                else if ((!hasOnlyGiftCard) && (totalCartPrice >= threshold_one_ammount && totalCartPrice <= threshold_two_ammount)) {
                    console.log('threshold two Condition');
                    $(".free-shipping-message").removeClass('show');
                    var threshold_two_ammount_needed = (threshold_two_ammount - totalCartPrice) / decimal;
                    var exprs_val_needed = money_format.replace("{{amount}}", threshold_two_ammount_needed);
                    var threshold_two_message = threshold_two_message.replace("XXX", exprs_val_needed);

                    var indicatorPercentage = (totalCartPrice * 100) / threshold_two_ammount;
                    if (threshold_two_ammount >= totalCartPrice) {
                        jQuery(".shipping__threshold--indicator").css("display", 'block');
                        miniCartFormHeightCalc();
                        jQuery("div.shipping__threshold--indicator div.indicator-track .indicator-level").css('width', indicatorPercentage + '%');
                    }
                    if($(".free-shipping-message").length > 0 ){
                      setTimeout(function(){
                        $(".free-shipping-message").addClass('show');
                      },300);
                      $(".free-shipping-message").html(free_shipping);
                    }else{
                      $("#cart-mini .mini-cart-header").prepend("<div class='free-shipping-message text-center'>" + free_shipping + "</div>");
                      setTimeout(function(){
                        $(".free-shipping-message").addClass('show');
                      },300);
                      
                    }
        
                    $(".shipping-warning").html(threshold_two_message);

                } 
                else if ((hasOnlyGiftCard) || (totalCartPrice >= threshold_two_ammount && threshold_three_ammount == 0)) {
                  
                    console.log('free_express_shipping Condition');
                    //$(".free-shipping-message").html(free_shipping);
                    $(".shipping-warning").html(free_express_shipping);
                    jQuery(".shipping__threshold--indicator").css("display", "none");
                    miniCartFormHeightCalc();
                    $(".free-shipping-message").removeClass('show');
                    var threshold_two_message = $('.shipping-warning').text();
                    var incStr = threshold_two_message.includes("Free Express Shipping");
                    if(incStr){
                      setTimeout(function(){
                        //$('#cart-mini .free-shipping-message').text('Enjoy Your Free Express Shipping');
                        //$(".free-shipping-message").addClass('show');
                      }, 300);
                    }else{
                      setTimeout(function(){
                        $(".free-shipping-message").html(free_shipping);
                        $(".free-shipping-message").addClass('show');
                      }, 300);
                    }
                    
                }
                else if ((!hasOnlyGiftCard) && (totalCartPrice >= threshold_two_ammount && totalCartPrice <= threshold_three_ammount)) {
                    console.log('threshold three Condition');
                    $(".free-shipping-message").removeClass('show');
                    var threshold_three_ammount_needed = (threshold_three_ammount - totalCartPrice) / decimal;
                    var exprs_val_needed = money_format.replace("{{amount}}", threshold_three_ammount_needed);
                    var threshold_three_message = threshold_three_message.replace("XXX", exprs_val_needed);
                    var incStr = free_express_shipping.includes("Free Express Shipping");

                    if(incStr){
                       setTimeout(function(){
                        $('#cart-mini .free-shipping-message').html('Enjoy Your Free Express Shipping');
                        $(".free-shipping-message").addClass('show');
                      }, 300);
                    }else{
                       setTimeout(function(){
                        $(".free-shipping-message").html(free_shipping);
                        $(".free-shipping-message").addClass('show');
                      }, 300);
                    }

                    var indicatorPercentage = (totalCartPrice * 50) / threshold_three_ammount;
                    if (threshold_three_ammount >= totalCartPrice) {
                        jQuery(".shipping__threshold--indicator").css("display", 'block');
                        miniCartFormHeightCalc();
                        jQuery("div.shipping__threshold--indicator div.indicator-track .indicator-level").css('width', indicatorPercentage + '%');
                    }
                    $(".shipping-warning").html(threshold_three_message);
                }
                else if ((!hasOnlyGiftCard) || (totalCartPrice >= threshold_three_ammount)) {
                    console.log('free_express_shipping Condition');
                    var incStr = free_express_shipping.includes("Free Express Shipping");
                    if(incStr){
                      $('#cart-mini .free-shipping-message').text('Enjoy Your Free Express Shipping');
                      $(".free-shipping-message").addClass('show');
                    }else{
                      $(".free-shipping-message").removeClass('show');
                      setTimeout(function(){
                        $(".free-shipping-message").html(free_shipping);
                        $(".free-shipping-message").addClass('show');
                      }, 300);
                    }
                    $(".shipping-warning").html(threshold_3_output_msg);
                    jQuery(".shipping__threshold--indicator").css("display", "none");
                    miniCartFormHeightCalc();
                }
            }
            setTimeout(function () {
                $(".inline-loader").css('display', 'none');
            }, 200);
            var cartMiniInfoHeight = $("#cart-mini .cart-info").innerHeight();
            $("#cart-mini .cart-info").animate({
                scrollTop: cartMiniInfoHeight
            }, 500);
        });

        $('body').on('click touchstart', function (evt) {
            if (evt.target.id == "cart-mini")
                return;
            if ($(evt.target).closest('#cart-mini').length)
                return;
            $("body").removeClass('cart-open');
            $('.cart-action-wrapper').removeClass('active');
            $('html').removeClass('safari-scroll-disable');
            headerTopBarMinView();
        });


        //open cart
        $(document).on('click', '.cart-opener', function (e) {
            e.preventDefault(); console.log('.cart-opener');
            $("body").addClass('sticky-nav-min');
            $(this).parents('.header-action').addClass('active');
            var headerActionsHeight = $(".header-actions").innerHeight();
            //$("#cart-mini").css("top", headerActionsHeight);
            $("body").addClass('cart-open');

            $(document).trigger('cartopen');
            var cartMiniInfoHeight = $("#cart-mini .cart-info").innerHeight();
            $("#cart-mini .cart-info").scrollTop(cartMiniInfoHeight);
        });

        // close cart
        $(document).on('click', '.close-cart', function (e) {
            e.preventDefault();
            $("body").removeClass('cart-open');
            $('.cart-action-wrapper').removeClass('active');
            $('html').removeClass('safari-scroll-disable');
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
        $("#mini-cart-count").text(count).attr('data-count', count);
    }


    initCartEventHandlers();

});
$(document).ajaxComplete(function (event, xhr, settings) {
    if (settings.url = '/cart/add.js') {
        $('#cart-mini .errMsg').remove();
    }
});
$(document).ajaxError(function (event, jqXHR, settings, thrownError) {
    if (settings.url = '/cart/add.js') {
        var errMSG = JSON.parse(jqXHR.responseText);
        setTimeout(function () {
            $('#cart-mini  .errMsg').remove();
            $('#cart-mini .cart-info').prepend('<div class="errMsg">' + errMSG.description + '</div>');
            $('#cart-mini .noItem').prepend('<div class="errMsg">' + errMSG.description + '</div>');
        }, 450);
    }
});